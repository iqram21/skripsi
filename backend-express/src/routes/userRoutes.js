const express = require('express');
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { validateDeviceChange, handleValidationErrors } = require('../utils/validators');

const router = express.Router();

// All user routes require authentication
router.use(authenticateToken);

router.get('/profile', userController.getProfile);

router.put('/device/change',
  validateDeviceChange,
  handleValidationErrors,
  userController.changeDevice
);

router.get('/device/info', userController.getDeviceInfo);

router.get('/sessions', userController.getActiveSessions);

module.exports = router;
