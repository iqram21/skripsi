const { prisma } = require('../config/database');

class DeviceService {
  async registerDevice(userId, deviceId) {
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
