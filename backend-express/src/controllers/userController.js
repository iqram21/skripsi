const deviceService = require('../services/deviceService');
const tokenService = require('../services/tokenService');

class UserController {
  async getProfile(req, res, next) {
    try {
      const user = req.user;
      
      res.status(200).json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          deviceId: user.deviceId,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async changeDevice(req, res, next) {
    try {
      const userId = req.user.id;
      const { newDeviceId } = req.body;
      
      const updatedUser = await deviceService.changeDevice(userId, newDeviceId);

      res.status(200).json({
        message: 'Device changed successfully',
        user: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }

  async getDeviceInfo(req, res, next) {
    try {
      const userId = req.user.id;
      
      const deviceInfo = await deviceService.getDeviceInfo(userId);

      res.status(200).json({
        deviceInfo,
      });
    } catch (error) {
      next(error);
    }
  }

  async getActiveSessions(req, res, next) {
    try {
      const userId = req.user.id;
      
      const sessions = await tokenService.getActiveTokens(userId);

      res.status(200).json({
        sessions,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
