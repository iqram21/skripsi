const authService = require('../services/authService');
const deviceService = require('../services/deviceService');
const { validateRegistration, validateLogin, handleValidationErrors } = require('../utils/validators');

class AuthController {
  async register(req, res, next) {
    try {
      const { username, email, password, deviceId } = req.body;
      
      const result = await authService.register({
        username,
        email,
        password,
        deviceId,
      });

      res.status(201).json({
        message: 'User registered successfully',
        user: result.user,
        token: result.token,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { username, password, deviceInfo } = req.body;
      
      // Use new secure login if deviceInfo is provided
      if (deviceInfo) {
        const result = await authService.secureLogin(
          username,
          password,
          deviceInfo,
          req.ip
        );

        res.status(200).json(result);
      } else {
        // Fall back to legacy login for backward compatibility
        const { deviceId } = req.body;
        const result = await authService.login({
          username,
          password,
          deviceId,
        });

        res.status(200).json({
          message: 'Login successful',
          user: result.user,
          token: result.token,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return res.status(400).json({ error: 'Token required' });
      }

      await authService.logout(token);

      res.status(200).json({
        message: 'Logout successful',
      });
    } catch (error) {
      next(error);
    }
  }

  async forceLogout(req, res, next) {
    try {
      const userId = req.user.id;
      
      await authService.forceLogout(userId);

      res.status(200).json({
        message: 'Force logout successful',
      });
    } catch (error) {
      next(error);
    }
  }

  async verify(req, res, next) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return res.status(400).json({ error: 'Token required' });
      }

      const result = await authService.verifyToken(token);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // New secure device management endpoints
  async getDevices(req, res, next) {
    try {
      const devices = await deviceService.getUserDevices(req.user.id);
      res.json({ devices });
    } catch (error) {
      next(error);
    }
  }

  async revokeDevice(req, res, next) {
    try {
      const { deviceId } = req.params;
      
      await deviceService.revokeDevice(
        parseInt(deviceId),
        req.user.id,
        req.device?.id
      );
      
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }

  async secureLogout(req, res, next) {
    try {
      const sessionToken = req.headers.authorization?.replace('Bearer ', '');
      
      if (!sessionToken) {
        return res.status(400).json({ error: 'Session token required' });
      }

      await deviceService.logout(sessionToken);

      res.status(200).json({
        message: 'Logout successful',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
