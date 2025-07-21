const express = require('express');
const authController = require('../controllers/authController');
const { authenticateToken, secureAuthenticateToken } = require('../middleware/authMiddleware');
const { checkDeviceRegistration } = require('../middleware/deviceMiddleware');
const { validateRegistration, validateLogin, handleValidationErrors } = require('../utils/validators');

const router = express.Router();

// Public routes
router.post('/register', 
  validateRegistration,
  handleValidationErrors,
  checkDeviceRegistration,
  authController.register
);

router.post('/login',
  validateLogin,
  handleValidationErrors,
  authController.login
);

router.get('/verify',
  authController.verify
);

// Protected routes (legacy)
router.post('/logout',
  authenticateToken,
  authController.logout
);

router.post('/force-logout',
  authenticateToken,
  authController.forceLogout
);

// New secure device management routes
router.get('/devices',
  secureAuthenticateToken,
  authController.getDevices
);

router.post('/devices/:deviceId/revoke',
  secureAuthenticateToken,
  authController.revokeDevice
);

router.post('/secure-logout',
  secureAuthenticateToken,
  authController.secureLogout
);

module.exports = router;
