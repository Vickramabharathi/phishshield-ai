# 🛡️ PhishShield AI • Supabase Cloud Database Integration Guide

This guide explains how to connect and configure **Supabase** as the persistent cloud database for PhishShield AI.

---

## 🌟 Overview

PhishShield AI features enterprise **dual-mode database architecture**:
- **Supabase Cloud Mode:** When configured, all threat scans, user accounts, SOC audit logs, and feedback loop entries are persistently stored and replicated in real time to Supabase PostgreSQL.
- **Local Fallback Mode:** When running offline or before credentials are provided, the system seamlessly operates on a local persistent JSON cache, ensuring zero downtime and sub-millisecond local ML inference speeds.

---

## ⚡ Quick Setup (3 Easy Steps)

### Step 1: Create a Supabase Project
1. Log in or create a free account at [https://supabase.com](https://supabase.com).
2. Click **New Project** and name it (e.g. `phishshield-ai`).
3. Set your database password and choose your nearest region.

---

### Step 2: Execute the Database Schema
1. In your Supabase dashboard, open the **SQL Editor** (from the left sidebar).
2. Click **New Query**.
3. Open the file [`server/database/supabase_schema.sql`](file:///c:/Users/HP/.gemini/antigravity-ide/scratch/phishshield-ai/server/database/supabase_schema.sql) from this repository.
4. Copy and paste its entire contents into the SQL Editor.
5. Click **Run**. This will create:
   - Tables: `users`, `scans`, `feedback`, `audit_logs`, `incident_reports`, `contact_messages`, `system_settings`, `model_metrics`
   - High-performance indexes on `url`, `domain`, `user_id`, `created_at`, etc.
   - Row Level Security (RLS) policies for secure backend and client access.

---

### Step 3: Configure Environment Variables
1. In your Supabase dashboard, navigate to **Project Settings** -> **API**.
2. Copy your **Project URL** and your **anon / public** API Key (or `service_role` key).
3. Open your project root `.env` file (or duplicate from `.env.example`):

```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DB_PROVIDER=supabase
```

---

## 🚀 Migrating Existing Data to Supabase

To push your initial demo users, past scans, and ML model telemetry into your new Supabase database, run:

```bash
# Push all local records and seed data to Supabase
npm run db:migrate:supabase

# Or test the connection first without writing data:
npm run db:test:supabase

# If you ever want to pull remote data into your local cache:
npm run db:pull:supabase
```

---

## 🖥️ In-App Supabase Management

You can also manage and test Supabase directly through the browser UI:
1. Log in as an Administrator (`admin@phishshield.ai` / `AdminPass123!@#`).
2. Go to **Admin** (`#admin`) -> **Supabase Cloud** tab.
3. View real-time connection status, PostgreSQL latency ping, and live table counts.
4. Click **Ping & Verify Connection** or **Sync Local Cache to Supabase** with 1 click.
5. Alternatively, open **Settings** (`#settings`) to run a quick Supabase health ping.

---

## 🔒 Security & Row Level Security (RLS)

- Sensitive passwords in `users` are hashed using **bcrypt** with salted work factors before being stored.
- SSL/TLS 1.3 is enforced on all connections to Supabase.
- RLS policies ensure granular protection over scan telemetry and audit logs.
