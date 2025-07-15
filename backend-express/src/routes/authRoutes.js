const express = require('express');
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');
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

// Protected routes
router.post('/logout',
  authenticateToken,
  authController.logout
);

router.post('/force-logout',
  authenticateToken,
  authController.forceLogout
);

module.exports = router;
