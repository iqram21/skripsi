const jwt = require('jsonwebtoken');
const { prisma } = require('../config/database');
const { verifyToken } = require('../utils/jwt');
const deviceService = require('../services/deviceService');

// New secure authentication middleware
const secureAuthenticateToken = async (req, res, next) => {
  try {
    const sessionToken = req.headers['authorization']?.replace('Bearer ', '');
    const deviceToken = req.headers['x-device-token'];

    if (!sessionToken || !deviceToken) {
      return res.status(401).json({ error: 'Missing authentication' });
    }

    // Validate session and device tokens
    const validation = await deviceService.validateSession(sessionToken, deviceToken);
    
    if (!validation.valid) {
      return res.status(403).json({ error: validation.reason });
    }

    req.user = validation.user;
    req.device = validation.device;
    req.session = validation.session;
    next();
  } catch (error) {
    console.error('Secure authentication error:', error);
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

// Legacy authentication middleware (keeping for backward compatibility)
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    // Verify JWT token
    const decoded = verifyToken(token);
    
    // Check if token exists in database and is valid
    const tokenRecord = await prisma.token.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!tokenRecord || !tokenRecord.isValid) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Check if token is expired
    if (new Date() > tokenRecord.expiresAt) {
      // Mark token as invalid
      await prisma.token.update({
        where: { id: tokenRecord.id },
        data: { isValid: false },
      });
      return res.status(401).json({ error: 'Token expired' });
    }

    req.user = tokenRecord.user;
    req.token = tokenRecord;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(403).json({ error: 'Invalid token' });
  }
};

module.exports = { 
  authenticateToken,
  secureAuthenticateToken 
};
