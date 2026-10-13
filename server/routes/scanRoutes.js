const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { optionalAuth, authenticateToken } = require('../middleware/auth');
const { scanLimiter } = require('../middleware/rateLimiter');
const { isValidUrl } = require('../middleware/validator');
const { classifyUrl } = require('../ml/classifier');
const { logSecurityEvent } = require('../middleware/auditLogger');

// POST /api/scans/analyze - Deep URL inspection endpoint
router.post('/analyze', scanLimiter, optionalAuth, (req, res) => {
  try {
    const rawUrl = (req.body.url || '').trim();

    if (!rawUrl) {
      return res.status(400).json({
        success: false,
        message: 'A valid website URL is required for scanning.'
      });
    }

    if (!isValidUrl(rawUrl)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid URL format. Please enter a valid URL (e.g., https://example.com).'
      });
    }

    const settings = db.getSettings();
    const threshold = settings.mlSensitivity || 0.65;

    // Execute Machine Learning Ensemble Classification
    const result = classifyUrl(rawUrl, threshold);

    // Persist scan entry
    const scanEntry = {
      id: `scn-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      url: result.url,
      domain: result.domain,
      userId: req.user ? req.user.id : 'guest',
      userEmail: req.user ? req.user.email : 'guest@anonymous',
      prediction: result.prediction,
      confidence: result.confidence,
      riskLevel: result.riskLevel,
      phishingProbability: result.phishingProbability,
      latencyMs: result.latencyMs,
      reasons: result.reasons,
      positiveIndicators: result.positiveIndicators,
      recommendations: result.recommendations,
      featureContributions: result.featureContributions,
      features: {
        urlLength: result.features.urlLength,
        domainLength: result.features.domainLength,
        subdomains: result.features.subdomainCount,
        hasIpAddress: result.features.hasIpAddress,
        hasAtSymbol: result.features.hasAtSymbol,
        hasPunycode: result.features.hasPunycodeOrHomoglyph,
        suspiciousKeywords: result.features.suspiciousKeywordsCount,
        shannonEntropyDomain: result.features.shannonEntropyDomain,
        tldRiskScore: result.features.tldRiskScore,
        brandImpersonationScore: result.features.brandSimilarityScore,
        impersonatedBrand: result.features.impersonatedBrand
      },
      createdAt: new Date().toISOString()
    };

    db.insert('scans', scanEntry);

    logSecurityEvent({
      userId: req.user ? req.user.id : 'guest',
      userEmail: req.user ? req.user.email : 'guest@anonymous',
      action: 'URL_SCAN_EXECUTED',
      details: `Analyzed ${result.domain} -> ${result.prediction} (${result.riskLevel}, ${result.confidence}%)`,
      ip: req.ip || req.connection.remoteAddress,
      status: 'SUCCESS'
    });

    res.json({
      success: true,
      data: scanEntry
    });
  } catch (err) {
    console.error('Scan analysis error:', err);
    res.status(500).json({
      success: false,
      message: 'An error occurred during machine learning URL feature extraction.'
    });
  }
});

// GET /api/scans/history - Paginated & filterable scan history
router.get('/history', optionalAuth, (req, res) => {
  try {
    const {
      search = '',
      riskLevel = '',
      prediction = '',
      page = 1,
      limit = 10,
      userOnly = 'false'
    } = req.query;

    let scans = db.get('scans');

    // Filter by user if requested and authenticated
    if (userOnly === 'true' && req.user) {
      scans = scans.filter((s) => s.userId === req.user.id);
    }

    // Search query (URL, Domain, ID)
    if (search) {
      const q = search.toLowerCase();
      scans = scans.filter(
        (s) =>
          s.url.toLowerCase().includes(q) ||
          s.domain.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q)
      );
    }

    // Filter by Risk Level
    if (riskLevel && riskLevel !== 'All') {
      scans = scans.filter((s) => s.riskLevel.toLowerCase() === riskLevel.toLowerCase());
    }

    // Filter by Prediction
    if (prediction && prediction !== 'All') {
      scans = scans.filter((s) => s.prediction.toLowerCase() === prediction.toLowerCase());
    }

    const total = scans.length;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = scans.slice(startIndex, startIndex + limitNum);

    res.json({
      success: true,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      data: paginated
    });
  } catch (err) {
    console.error('Error fetching scan history:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve scan history.' });
  }
});

// GET /api/scans/export - Export scans to CSV or JSON
router.get('/export', optionalAuth, (req, res) => {
  try {
    const format = (req.query.format || 'json').toLowerCase();
    const scans = db.get('scans');

    if (format === 'csv') {
      const headers = ['ID', 'URL', 'Domain', 'Prediction', 'Confidence', 'RiskLevel', 'LatencyMs', 'Timestamp'];
      const rows = scans.map((s) => [
        `"${s.id}"`,
        `"${s.url.replace(/"/g, '""')}"`,
        `"${s.domain}"`,
        `"${s.prediction}"`,
        s.confidence,
        `"${s.riskLevel}"`,
        s.latencyMs || 12,
        `"${s.createdAt}"`
      ]);
      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="phishshield_scan_export.csv"');
      return res.send(csvContent);
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="phishshield_scan_export.json"');
    res.json({ exportDate: new Date().toISOString(), total: scans.length, scans });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Export failed.' });
  }
});

// GET /api/scans/:id - Single scan inspection
router.get('/:id', (req, res) => {
  const scan = db.findById('scans', req.params.id);
  if (!scan) {
    return res.status(404).json({ success: false, message: 'Scan record not found.' });
  }
  res.json({ success: true, data: scan });
});

// POST /api/scans/:id/feedback - Report false positive / negative
router.post('/:id/feedback', optionalAuth, (req, res) => {
  const { reportedAs, notes } = req.body;
  const scan = db.findById('scans', req.params.id);

  if (!scan) {
    return res.status(404).json({ success: false, message: 'Scan not found.' });
  }

  const feedbackEntry = {
    id: `fbk-${Date.now()}`,
    scanId: scan.id,
    originalPrediction: scan.prediction,
    reportedAs: reportedAs || 'Misclassified',
    notes: notes || '',
    userEmail: req.user ? req.user.email : 'guest@anonymous',
    createdAt: new Date().toISOString()
  };

  db.insert('feedback', feedbackEntry);

  logSecurityEvent({
    userId: req.user ? req.user.id : 'guest',
    userEmail: req.user ? req.user.email : 'guest@anonymous',
    action: 'MODEL_FEEDBACK_SUBMITTED',
    details: `Reported scan ${scan.id} as ${feedbackEntry.reportedAs}`,
    ip: req.ip || req.connection.remoteAddress,
    status: 'SUCCESS'
  });

  res.json({
    success: true,
    message: 'Thank you! Your feedback has been queued for machine learning active retraining.'
  });
});

// DELETE /api/scans/:id - Delete scan entry
router.delete('/:id', authenticateToken, (req, res) => {
  const scan = db.findById('scans', req.params.id);
  if (!scan) {
    return res.status(404).json({ success: false, message: 'Scan not found.' });
  }

  // Only admin or owner can delete
  if (req.user.role !== 'admin' && scan.userId !== req.user.id) {
    return res.status(403).json({ success: false, message: 'Not authorized to delete this scan entry.' });
  }

  db.delete('scans', scan.id);
  res.json({ success: true, message: 'Scan removed successfully.' });
});

module.exports = router;
