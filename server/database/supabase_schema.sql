-- ==============================================================================
-- PhishShield AI • Supabase PostgreSQL Schema & Migrations
-- Project: Machine Learning-Based Phishing Website Detection Platform
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'analyst', 'user')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
  organization TEXT,
  api_key TEXT,
  mfa_enabled BOOLEAN DEFAULT FALSE,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. SCANS TABLE (URL Threat Telemetry & ML Classifications)
CREATE TABLE IF NOT EXISTS public.scans (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  domain TEXT,
  user_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
  user_email TEXT,
  prediction TEXT NOT NULL CHECK (prediction IN ('Phishing', 'Suspicious', 'Legitimate')),
  confidence NUMERIC(5, 2) NOT NULL DEFAULT 50.00,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('Critical', 'High', 'Moderate', 'Low', 'Safe')),
  phishing_probability NUMERIC(6, 4) NOT NULL DEFAULT 0.5000,
  latency_ms NUMERIC(6, 2) DEFAULT 0.00,
  reasons JSONB NOT NULL DEFAULT '[]'::JSONB,
  positive_indicators JSONB NOT NULL DEFAULT '[]'::JSONB,
  recommendations JSONB NOT NULL DEFAULT '[]'::JSONB,
  features JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. FEEDBACK TABLE (User & SOC Analyst Corrections for ML Active Learning)
CREATE TABLE IF NOT EXISTS public.feedback (
  id TEXT PRIMARY KEY,
  scan_id TEXT REFERENCES public.scans(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
  user_email TEXT,
  reported_as TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. AUDIT LOGS TABLE (Enterprise Security Action Trail)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  user_email TEXT,
  action TEXT NOT NULL,
  details TEXT,
  ip TEXT,
  status TEXT NOT NULL DEFAULT 'SUCCESS',
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. INCIDENT REPORTS TABLE (Zero-Day Emergency Submissions)
CREATE TABLE IF NOT EXISTS public.incident_reports (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  reporter_email TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'INVESTIGATING', 'RESOLVED', 'DISMISSED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. CONTACT MESSAGES TABLE (Enterprise & Support Queries)
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'UNREAD' CHECK (status IN ('UNREAD', 'IN_REVIEW', 'ARCHIVED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. SYSTEM SETTINGS TABLE (Single-Row Heuristic Configuration)
CREATE TABLE IF NOT EXISTS public.system_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  ml_sensitivity NUMERIC(4, 2) NOT NULL DEFAULT 0.65,
  theme TEXT NOT NULL DEFAULT 'dark',
  auto_block_ip BOOLEAN NOT NULL DEFAULT TRUE,
  email_alerts_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  webhook_url TEXT DEFAULT '',
  log_retention_days INTEGER NOT NULL DEFAULT 90,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. MODEL METRICS TABLE (Machine Learning Telemetry & Confusion Matrix)
CREATE TABLE IF NOT EXISTS public.model_metrics (
  id TEXT PRIMARY KEY DEFAULT 'current',
  model_version TEXT NOT NULL DEFAULT 'v2.4.1-hybrid-ensemble',
  algorithm TEXT NOT NULL,
  dataset_size INTEGER NOT NULL DEFAULT 125400,
  features_extracted INTEGER NOT NULL DEFAULT 32,
  accuracy NUMERIC(5, 2) NOT NULL DEFAULT 98.42,
  precision NUMERIC(5, 2) NOT NULL DEFAULT 98.15,
  recall NUMERIC(5, 2) NOT NULL DEFAULT 98.71,
  f1_score NUMERIC(5, 2) NOT NULL DEFAULT 98.43,
  roc_auc NUMERIC(6, 4) NOT NULL DEFAULT 0.9918,
  average_latency_ms NUMERIC(6, 2) NOT NULL DEFAULT 13.80,
  last_trained_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  confusion_matrix JSONB NOT NULL DEFAULT '{}'::JSONB,
  feature_weights JSONB NOT NULL DEFAULT '[]'::JSONB,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR HIGH-THROUGHPUT PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_api_key ON public.users(api_key);
CREATE INDEX IF NOT EXISTS idx_scans_domain ON public.scans(domain);
CREATE INDEX IF NOT EXISTS idx_scans_user_id ON public.scans(user_id);
CREATE INDEX IF NOT EXISTS idx_scans_created_at ON public.scans(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_scans_prediction ON public.scans(prediction);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON public.audit_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_scan_id ON public.feedback(scan_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incident_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.model_metrics ENABLE ROW LEVEL SECURITY;

-- Allow full access for backend API service role and anon key requests
DO $$
BEGIN
  -- Users policies
  DROP POLICY IF EXISTS "Service role & anon full access users" ON public.users;
  CREATE POLICY "Service role & anon full access users" ON public.users FOR ALL USING (true) WITH CHECK (true);

  -- Scans policies
  DROP POLICY IF EXISTS "Service role & anon full access scans" ON public.scans;
  CREATE POLICY "Service role & anon full access scans" ON public.scans FOR ALL USING (true) WITH CHECK (true);

  -- Feedback policies
  DROP POLICY IF EXISTS "Service role & anon full access feedback" ON public.feedback;
  CREATE POLICY "Service role & anon full access feedback" ON public.feedback FOR ALL USING (true) WITH CHECK (true);

  -- Audit logs policies
  DROP POLICY IF EXISTS "Service role & anon full access audit_logs" ON public.audit_logs;
  CREATE POLICY "Service role & anon full access audit_logs" ON public.audit_logs FOR ALL USING (true) WITH CHECK (true);

  -- Incident reports policies
  DROP POLICY IF EXISTS "Service role & anon full access incident_reports" ON public.incident_reports;
  CREATE POLICY "Service role & anon full access incident_reports" ON public.incident_reports FOR ALL USING (true) WITH CHECK (true);

  -- Contact messages policies
  DROP POLICY IF EXISTS "Service role & anon full access contact_messages" ON public.contact_messages;
  CREATE POLICY "Service role & anon full access contact_messages" ON public.contact_messages FOR ALL USING (true) WITH CHECK (true);

  -- System settings policies
  DROP POLICY IF EXISTS "Service role & anon full access system_settings" ON public.system_settings;
  CREATE POLICY "Service role & anon full access system_settings" ON public.system_settings FOR ALL USING (true) WITH CHECK (true);

  -- Model metrics policies
  DROP POLICY IF EXISTS "Service role & anon full access model_metrics" ON public.model_metrics;
  CREATE POLICY "Service role & anon full access model_metrics" ON public.model_metrics FOR ALL USING (true) WITH CHECK (true);
END $$;
