const authService = require('../services/authService');
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
      const { username, password, deviceId } = req.body;
      
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
}

module.exports = new AuthController();
