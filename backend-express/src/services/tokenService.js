const { prisma } = require('../config/database');
const { generateToken } = require('../utils/jwt');

class TokenService {
  async createToken(userId, deviceId) {
    const token = generateToken({
      userId,
      deviceId,
    });

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.token.create({
      data: {
        token,
        userId,
        deviceId,
        expiresAt,
      }
    });

    return token;
  }

  async invalidateToken(token) {
    await prisma.token.updateMany({
      where: { token },
      data: { isValid: false }
    });
  }

  async invalidateAllUserTokens(userId) {
    await prisma.token.updateMany({
      where: { userId },
      data: { isValid: false }
    });
  }

  async cleanupExpiredTokens() {
    const result = await prisma.token.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    });

    return result.count;
  }

  async getActiveTokens(userId) {
    return await prisma.token.findMany({
      where: {
        userId,
        isValid: true,
        expiresAt: {
          gt: new Date()
        }
      },
      select: {
        id: true,
        deviceId: true,
        createdAt: true,
        expiresAt: true,
      }
    });
  }
}

module.exports = new TokenService();
