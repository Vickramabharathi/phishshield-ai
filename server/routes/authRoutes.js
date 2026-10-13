const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('../config');
const db = require('../database/db');
const { authenticateToken } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const { sanitizeString, isValidEmail, validatePasswordStrength } = require('../middleware/validator');
const { logSecurityEvent } = require('../middleware/auditLogger');

// Helper to generate JWT token
function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRES_IN }
  );
}

// POST /api/auth/register
router.post('/register', authLimiter, (req, res) => {
  try {
    const name = sanitizeString(req.body.name);
    const email = (req.body.email || '').trim().toLowerCase();
    const password = req.body.password;
    const organization = sanitizeString(req.body.organization || 'Independent Researcher');

    if (!name || name.length < 2) {
      return res.status(400).json({ success: false, message: 'Full name is required (min 2 characters).' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }

    const passCheck = validatePasswordStrength(password);
    if (!passCheck.valid) {
      return res.status(400).json({ success: false, message: passCheck.message });
    }

    // Check duplicate
    const existing = db.findOne('users', (u) => u.email === email);
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email address already exists.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const apiKey = 'ps_live_' + crypto.randomBytes(12).toString('hex');

    const newUser = {
      name,
      email,
      password: hashedPassword,
      role: 'user', // default role
      status: 'active',
      organization,
      apiKey,
      mfaEnabled: false,
      lastLogin: new Date().toISOString()
    };

    const created = db.insert('users', newUser);
    const token = generateToken(created);

    logSecurityEvent({
      userId: created.id,
      userEmail: created.email,
      action: 'USER_REGISTERED',
      details: `New account created with role "user"`,
      ip: req.ip || req.connection.remoteAddress,
      status: 'SUCCESS'
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user: {
        id: created.id,
        name: created.name,
        email: created.email,
        role: created.role,
        organization: created.organization,
        apiKey: created.apiKey,
        mfaEnabled: created.mfaEnabled
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ success: false, message: 'Internal server error during registration.' });
  }
});

// POST /api/auth/login
router.post('/login', authLimiter, (req, res) => {
  try {
    const email = (req.body.email || '').trim().toLowerCase();
    const password = req.body.password;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = db.findOne('users', (u) => u.email === email);
    if (!user) {
      logSecurityEvent({
        userId: 'anonymous',
        userEmail: email,
        action: 'FAILED_LOGIN_ATTEMPT',
        details: 'Invalid email address provided',
        ip: req.ip || req.connection.remoteAddress,
        status: 'FAILURE'
      });
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ success: false, message: 'Account is suspended. Contact SOC Administrator.' });
    }

    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      logSecurityEvent({
        userId: user.id,
        userEmail: user.email,
        action: 'FAILED_LOGIN_ATTEMPT',
        details: 'Incorrect password hash verification',
        ip: req.ip || req.connection.remoteAddress,
        status: 'FAILURE'
      });
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Update last login
    db.update('users', user.id, { lastLogin: new Date().toISOString() });

    const token = generateToken(user);

    logSecurityEvent({
      userId: user.id,
      userEmail: user.email,
      action: 'USER_LOGIN',
      details: `Successful login via web portal (Role: ${user.role})`,
      ip: req.ip || req.connection.remoteAddress,
      status: 'SUCCESS'
    });

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        organization: user.organization,
        apiKey: user.apiKey,
        mfaEnabled: user.mfaEnabled,
        lastLogin: user.lastLogin
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Internal server error during authentication.' });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, (req, res) => {
  const user = db.findById('users', req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      organization: user.organization,
      apiKey: user.apiKey,
      mfaEnabled: user.mfaEnabled,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin
    }
  });
});

// PUT /api/auth/profile
router.put('/profile', authenticateToken, (req, res) => {
  const name = sanitizeString(req.body.name);
  const organization = sanitizeString(req.body.organization);

  const updates = {};
  if (name && name.length >= 2) updates.name = name;
  if (organization) updates.organization = organization;

  const updated = db.update('users', req.user.id, updates);

  logSecurityEvent({
    userId: req.user.id,
    userEmail: req.user.email,
    action: 'PROFILE_UPDATED',
    details: 'User metadata updated',
    ip: req.ip || req.connection.remoteAddress,
    status: 'SUCCESS'
  });

  res.json({
    success: true,
    message: 'Profile updated successfully.',
    user: {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      organization: updated.organization,
      apiKey: updated.apiKey,
      mfaEnabled: updated.mfaEnabled
    }
  });
});

// PUT /api/auth/change-password
router.put('/change-password', authenticateToken, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = db.findById('users', req.user.id);

  if (!bcrypt.compareSync(currentPassword, user.password)) {
    return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
  }

  const passCheck = validatePasswordStrength(newPassword);
  if (!passCheck.valid) {
    return res.status(400).json({ success: false, message: passCheck.message });
  }

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(newPassword, salt);
  db.update('users', user.id, { password: hashedPassword });

  logSecurityEvent({
    userId: req.user.id,
    userEmail: req.user.email,
    action: 'PASSWORD_CHANGED',
    details: 'User rotated credentials',
    ip: req.ip || req.connection.remoteAddress,
    status: 'SUCCESS'
  });

  res.json({ success: true, message: 'Password changed successfully.' });
});

// POST /api/auth/generate-api-key
router.post('/generate-api-key', authenticateToken, (req, res) => {
  const newApiKey = 'ps_live_' + crypto.randomBytes(12).toString('hex');
  db.update('users', req.user.id, { apiKey: newApiKey });

  logSecurityEvent({
    userId: req.user.id,
    userEmail: req.user.email,
    action: 'API_KEY_REGENERATED',
    details: 'New API Key generated for automated telemetry',
    ip: req.ip || req.connection.remoteAddress,
    status: 'SUCCESS'
  });

  res.json({ success: true, apiKey: newApiKey });
});

// POST /api/auth/toggle-mfa
router.post('/toggle-mfa', authenticateToken, (req, res) => {
  const user = db.findById('users', req.user.id);
  const newMfaState = !user.mfaEnabled;
  db.update('users', user.id, { mfaEnabled: newMfaState });

  logSecurityEvent({
    userId: req.user.id,
    userEmail: req.user.email,
    action: 'MFA_STATE_CHANGED',
    details: `Multi-Factor Authentication toggled to ${newMfaState ? 'ENABLED' : 'DISABLED'}`,
    ip: req.ip || req.connection.remoteAddress,
    status: 'SUCCESS'
  });

  res.json({
    success: true,
    mfaEnabled: newMfaState,
    message: `Two-Factor Authentication is now ${newMfaState ? 'enabled' : 'disabled'}.`
  });
});

module.exports = router;
