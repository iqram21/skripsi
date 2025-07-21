const crypto = require('crypto');
const { prisma } = require('../config/database');

class DeviceService {
  /**
   * Generate a cryptographically secure device token
   */
  generateDeviceToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Generate a cryptographically secure session token
   */
  generateSessionToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Register or update a device for a user
   */
  async registerDevice(userId, deviceInfo, ipAddress) {
    const deviceToken = this.generateDeviceToken();
    
    // Check if this device already exists for this user
    let device = await prisma.device.findFirst({
      where: {
        userId: userId,
        userAgent: deviceInfo.userAgent,
        isActive: true
      }
    });

    if (!device) {
      // Register new device
      device = await prisma.device.create({
        data: {
          userId: userId,
          deviceToken: deviceToken,
          deviceName: `${deviceInfo.platform} - ${new Date().toLocaleDateString()}`,
          userAgent: deviceInfo.userAgent,
          ipAddress: ipAddress,
          lastUsedAt: new Date()
        }
      });
    } else {
      // Update existing device with new token
      device = await prisma.device.update({
        where: { id: device.id },
        data: {
          deviceToken: deviceToken,
          lastUsedAt: new Date(),
          ipAddress: ipAddress
        }
      });
    }

    return device;
  }

  /**
   * Create a new session for a device
   */
  async createSession(deviceId, userId, expirationHours = 168) { // 7 days default
    const sessionToken = this.generateSessionToken();
    const expiresAt = new Date(Date.now() + expirationHours * 60 * 60 * 1000);

    const session = await prisma.deviceSession.create({
      data: {
        sessionToken: sessionToken,
        deviceId: deviceId,
        userId: userId,
        expiresAt: expiresAt
      }
    });

    return session;
  }

  /**
   * Validate session and device tokens
   */
  async validateSession(sessionToken, deviceToken) {
    const session = await prisma.deviceSession.findUnique({
      where: { sessionToken },
      include: { 
        device: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      }
    });

    if (!session || !session.isValid || session.expiresAt < new Date()) {
      return { valid: false, reason: 'Invalid or expired session' };
    }

    // CRITICAL: Validate device token matches
    if (session.device.deviceToken !== deviceToken) {
      // Someone tried to use a different device token!
      await prisma.deviceSession.update({
        where: { id: session.id },
        data: { isValid: false }
      });
      
      // Log security incident
      console.error(`SECURITY ALERT: Device token mismatch for user ${session.userId}`);
      
      return { valid: false, reason: 'Device authentication failed' };
    }

    // Check if device is still active
    if (!session.device.isActive) {
      return { valid: false, reason: 'Device has been deactivated' };
    }

    // Update last used
    await prisma.device.update({
      where: { id: session.device.id },
      data: { lastUsedAt: new Date() }
    });

    return { 
      valid: true, 
      session,
      user: session.user,
      device: session.device
    };
  }

  /**
   * Get all devices for a user
   */
  async getUserDevices(userId) {
    return await prisma.device.findMany({
      where: { userId: userId },
      select: {
        id: true,
        deviceName: true,
        lastUsedAt: true,
        createdAt: true,
        isActive: true,
        ipAddress: true
      },
      orderBy: { lastUsedAt: 'desc' }
    });
  }

  /**
   * Revoke a device (deactivate it)
   */
  async revokeDevice(deviceId, userId, currentDeviceId = null) {
    // Prevent users from revoking their current device
    if (currentDeviceId && deviceId === currentDeviceId) {
      throw new Error('Cannot revoke current device');
    }

    // Deactivate the device
    await prisma.device.update({
      where: {
        id: deviceId,
        userId: userId
      },
      data: { isActive: false }
    });

    // Invalidate all sessions for this device
    await prisma.deviceSession.updateMany({
      where: { deviceId: deviceId },
      data: { isValid: false }
    });

    return { success: true };
  }

  /**
   * Invalidate all sessions for a user (force logout from all devices)
   */
  async invalidateAllUserSessions(userId) {
    await prisma.deviceSession.updateMany({
      where: { userId: userId },
      data: { isValid: false }
    });

    return { success: true };
  }

  /**
   * Logout from current session
   */
  async logout(sessionToken) {
    await prisma.deviceSession.update({
      where: { sessionToken },
      data: { isValid: false }
    });

    return { success: true };
  }

  // Legacy methods for backward compatibility
  async registerDeviceLegacy(userId, deviceId) {
    // Check if device is already registered to another user
    const existingDevice = await prisma.user.findFirst({
      where: { 
        deviceId,
        NOT: { id: userId }
      }
    });

    if (existingDevice) {
      throw new Error('Device is already registered to another account');
    }

    // Update user's device ID
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { deviceId },
      select: {
        id: true,
        username: true,
        email: true,
        deviceId: true,
      }
    });

    return updatedUser;
  }

  async changeDevice(userId, newDeviceId) {
    // Check if new device is already registered to another user
    const existingDevice = await prisma.user.findFirst({
      where: { 
        deviceId: newDeviceId,
        NOT: { id: userId }
      }
    });

    if (existingDevice) {
      throw new Error('Device is already registered to another account');
    }

    // Invalidate all existing tokens for this user
    await prisma.token.updateMany({
      where: { userId },
      data: { isValid: false }
    });

    // Update user's device ID
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { deviceId: newDeviceId },
      select: {
        id: true,
        username: true,
        email: true,
        deviceId: true,
      }
    });

    return updatedUser;
  }

  async validateDevice(userId, deviceId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { deviceId: true }
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.deviceId && user.deviceId !== deviceId) {
      throw new Error('Device mismatch');
    }

    return true;
  }

  async getDeviceInfo(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        deviceId: true,
        lastLogin: true,
        tokens: {
          where: { isValid: true },
          select: {
            deviceId: true,
            createdAt: true,
            expiresAt: true,
          }
        }
      }
    });

    return user;
  }
}

module.exports = new DeviceService();
