const bcrypt = require('bcrypt');
const { prisma } = require('../config/database');
const { generateToken } = require('../utils/jwt');
const authConfig = require('../config/auth');
const deviceService = require('./deviceService');

class AuthService {
  /**
   * New secure login method
   */
  async secureLogin(email, password, deviceInfo, ipAddress) {
    // Find user by email or username
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username: email }
        ]
      }
    });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new Error('Invalid credentials');
    }

    // Register or update device with new secure token
    const device = await deviceService.registerDevice(user.id, deviceInfo, ipAddress);

    // Create new session
    const session = await deviceService.createSession(device.id, user.id);

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    return {
      success: true,
      sessionToken: session.sessionToken,
      deviceToken: device.deviceToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username
      }
    };
  }

  /**
   * Legacy register method (keeping for backward compatibility)
   */
  async register(userData) {
    const { username, email, password, deviceId } = userData;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    });

    if (existingUser) {
      throw new Error('Username or email already exists');
    }

    // Check if device is already registered
    const existingDevice = await prisma.user.findFirst({
      where: { deviceId }
    });

    if (existingDevice) {
      throw new Error('Device is already registered to another account');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, authConfig.bcrypt.rounds);

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        deviceId,
        lastLogin: new Date(),
      },
      select: {
        id: true,
        username: true,
        email: true,
        deviceId: true,
        lastLogin: true,
        createdAt: true,
      }
    });

    // Generate token
    const token = generateToken({
      userId: user.id,
      username: user.username,
      deviceId: user.deviceId,
    });

    // Store token in database
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    await prisma.token.create({
      data: {
        token,
        userId: user.id,
        deviceId: user.deviceId,
        expiresAt,
      }
    });

    return { user, token };
  }

  async login(loginData) {
    const { username, password, deviceId } = loginData;

    // Find user
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email: username }
        ]
      }
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Check device ID
    if (user.deviceId && user.deviceId !== deviceId) {
      throw new Error('Device mismatch. This account is registered to a different device.');
    }

    // If user doesn't have a device ID, register this device
    if (!user.deviceId) {
      await prisma.user.update({
        where: { id: user.id },
        data: { deviceId }
      });
    }

    // Invalidate all existing tokens for this user
    await prisma.token.updateMany({
      where: { userId: user.id },
      data: { isValid: false }
    });

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    // Generate new token
    const token = generateToken({
      userId: user.id,
      username: user.username,
      deviceId: deviceId,
    });

    // Store token in database
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    await prisma.token.create({
      data: {
        token,
        userId: user.id,
        deviceId: deviceId,
        expiresAt,
      }
    });

    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      deviceId: deviceId,
      lastLogin: new Date(),
      createdAt: user.createdAt,
    };

    return { user: userResponse, token };
  }

  async logout(token) {
    // Invalidate token
    await prisma.token.updateMany({
      where: { token },
      data: { isValid: false }
    });

    return { message: 'Logged out successfully' };
  }

  async forceLogout(userId) {
    // Invalidate all tokens for user
    await prisma.token.updateMany({
      where: { userId },
      data: { isValid: false }
    });

    return { message: 'Force logout successful' };
  }

  async verifyToken(token) {
    const tokenRecord = await prisma.token.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!tokenRecord || !tokenRecord.isValid) {
      throw new Error('Invalid token');
    }

    if (new Date() > tokenRecord.expiresAt) {
      await prisma.token.update({
        where: { id: tokenRecord.id },
        data: { isValid: false }
      });
      throw new Error('Token expired');
    }

    return {
      valid: true,
      user: {
        id: tokenRecord.user.id,
        username: tokenRecord.user.username,
        email: tokenRecord.user.email,
        deviceId: tokenRecord.user.deviceId,
      }
    };
  }
}

module.exports = new AuthService();
