const db = require('../database/db');

function logSecurityEvent({
  userId = 'anonymous',
  userEmail = 'unauthenticated',
  action,
  details,
  ip = '127.0.0.1',
  status = 'SUCCESS'
}) {
  try {
    const entry = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      userId,
      userEmail,
      action,
      details,
      ip,
      status
    };
    db.insert('auditLogs', entry);
    return entry;
  } catch (err) {
    console.error('Audit log failed to record:', err.message);
    return null;
  }
}

module.exports = { logSecurityEvent };
