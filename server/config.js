require('dotenv').config();
const path = require('path');

module.exports = {
  PORT: process.env.PORT || 5050,
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET || 'phishshield_super_secure_jwt_secret_capstone_2026_!@#$',
  JWT_EXPIRES_IN: '24h',
  DATA_DIR: path.join(__dirname, 'database', 'data'),
  DB_FILE: path.join(__dirname, 'database', 'data', 'phishshield_db.json'),
  ML_DEFAULT_THRESHOLD: 0.65,
  MAX_URL_LENGTH: 2048,
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 200,
    SCAN_LIMIT: 60,
    AUTH_LIMIT: 25
  },
  // Supabase Configuration
  SUPABASE_URL: process.env.SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || '',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  DB_PROVIDER: process.env.DB_PROVIDER || (process.env.SUPABASE_URL ? 'supabase' : 'local')
};
