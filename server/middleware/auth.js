const jwt = require('jsonwebtoken');
const config = require('../config');
const db = require('../database/db');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied: Authentication token required.'
    });
  }

  jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired authentication token. Please log in again.'
      });
    }

    const user = db.findById('users', decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User account associated with this session was not found.'
      });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({
        success: false,
        message: 'Account has been suspended by system administrator.'
      });
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      organization: user.organization
    };
    next();
  });
}

function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = null;
    return next();
  }

  jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
    if (!err && decoded) {
      const user = db.findById('users', decoded.id);
      if (user && user.status === 'active') {
        req.user = {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          organization: user.organization
        };
      }
    }
    next();
  });
}

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required for this operation.'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Requires one of [${allowedRoles.join(', ')}] permissions. Current role: ${req.user.role}`
      });
    }

    next();
  };
}

module.exports = {
  authenticateToken,
  optionalAuth,
  requireRole
};
