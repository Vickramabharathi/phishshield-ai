const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { sanitizeString, isValidEmail } = require('../middleware/validator');
const { logSecurityEvent } = require('../middleware/auditLogger');
const { optionalAuth } = require('../middleware/auth');

// POST /api/contact/incident - Report emergency phishing campaign
router.post('/incident', optionalAuth, (req, res) => {
  const { targetUrl, incidentType, senderEmail, description, severity } = req.body;

  if (!targetUrl) {
    return res.status(400).json({ success: false, message: 'Target suspicious URL is required.' });
  }

  const report = {
    id: `inc-${Date.now()}`,
    targetUrl: sanitizeString(targetUrl),
    incidentType: incidentType || 'Credential Harvesting',
    senderEmail: sanitizeString(senderEmail || ''),
    description: sanitizeString(description || ''),
    severity: severity || 'High',
    reportedBy: req.user ? req.user.email : 'anonymous',
    status: 'TRIAGED',
    createdAt: new Date().toISOString()
  };

  db.insert('incidentReports', report);

  logSecurityEvent({
    userId: req.user ? req.user.id : 'guest',
    userEmail: req.user ? req.user.email : 'guest@anonymous',
    action: 'INCIDENT_REPORT_SUBMITTED',
    details: `Incident reported for ${report.targetUrl} (Severity: ${report.severity})`,
    ip: req.ip || req.connection.remoteAddress,
    status: 'SUCCESS'
  });

  res.status(201).json({
    success: true,
    message: 'Incident successfully dispatched to the Threat Intelligence emergency queue.',
    reportId: report.id
  });
});

// POST /api/contact/message - General inquiries & capstone review
router.post('/message', (req, res) => {
  const name = sanitizeString(req.body.name);
  const email = (req.body.email || '').trim().toLowerCase();
  const subject = sanitizeString(req.body.subject || 'Capstone Project Inquiry');
  const message = sanitizeString(req.body.message);

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
  }

  const contactEntry = {
    id: `msg-${Date.now()}`,
    name,
    email,
    subject,
    message,
    createdAt: new Date().toISOString()
  };

  db.insert('contactMessages', contactEntry);

  res.status(201).json({
    success: true,
    message: 'Your message has been received by the PhishShield AI Capstone Research Team.'
  });
});

module.exports = router;
