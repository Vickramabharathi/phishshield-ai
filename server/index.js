const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./config');
const db = require('./database/db'); // Ensures database & seed are initialized

const authRoutes = require('./routes/authRoutes');
const scanRoutes = require('./routes/scanRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const adminRoutes = require('./routes/adminRoutes');
const contactRoutes = require('./routes/contactRoutes');
const { apiLimiter } = require('./middleware/rateLimiter');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// Security Headers via Helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          'https://cdn.jsdelivr.net',
          'https://cdnjs.cloudflare.com'
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          'https://fonts.googleapis.com',
          'https://cdnjs.cloudflare.com'
        ],
        fontSrc: [
          "'self'",
          'https://fonts.gstatic.com',
          'https://cdnjs.cloudflare.com'
        ],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'"]
      }
    },
    crossOriginEmbedderPolicy: false
  })
);

// Cross-Origin Resource Sharing
app.use(cors());

// Request Body Parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// General Rate Limiting for all API requests
app.use('/api', apiLimiter);

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'PhishShield AI Threat Intelligence Engine',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Mount Modular API Routes
app.use('/api/auth', authRoutes);
app.use('/api/scans', scanRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);

// Serve Client Static Assets
const clientPath = path.join(__dirname, '..', 'client');
app.use(express.static(clientPath));

// Single Page Application (SPA) Fallback
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    return res.sendFile(path.join(clientPath, 'index.html'));
  }
  next();
});

// Centralized Error Handling Middleware
app.use(errorHandler);

// Start Server if run directly
if (require.main === module) {
  const server = app.listen(config.PORT, () => {
    console.log(`================================================================`);
    console.log(`🛡️  PhishShield AI - Threat Detection Platform`);
    console.log(`📡 Server listening on: http://localhost:${config.PORT}`);
    console.log(`🔬 Capstone: Machine Learning-Based Phishing Website Detection`);
    console.log(`💾 Persistent DB: ${config.DB_FILE}`);
    console.log(`================================================================`);
  });

  process.on('SIGTERM', () => {
    console.log('SIGTERM received. Gracefully shutting down...');
    server.close(() => process.exit(0));
  });
}

module.exports = app;
