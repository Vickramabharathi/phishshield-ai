# 🛡️ PhishShield AI
### Machine Learning-Based Phishing Website Detection as a Countermeasure to Social Engineering Attacks

**Academic Capstone Project & Commercial Cybersecurity Threat Platform**

---

## 🌟 Executive Overview
**PhishShield AI** is an enterprise-grade cybersecurity web application built for an advanced capstone project. Designed to resemble state-of-the-art commercial products (CrowdStrike, Cloudflare Radar, VirusTotal), PhishShield AI detects and neutralizes zero-day phishing websites, homoglyph character substitutions, and credential harvesting lures in real time.

---

## 🚀 Key Features

### 1. Cyber Threat Intelligence UI
- **Futuristic Cybersecurity Aesthetic:** Glowing cyber accents, glassmorphic HUD telemetry, dark & light theme modes, animated radar scan sweep.
- **Fully Responsive:** Seamlessly optimized for desktop, tablet, and mobile browsers.

### 2. Real-Time Deep URL Inspection
- **Multimodal Feature Extraction:** Computes 32 distinct features (lexical, Unicode homoglyphs, Shannon entropy, brand impersonation via Levenshtein distance, abused TLD risk).
- **Explainable AI (XAI):** Clear SHAP-inspired feature attribution detailing exactly why a website was flagged.
- **Defensive Recommendations:** Actionable checklists for end users and SOC incident responders.

### 3. Analytics & Telemetry Dashboard
- **HUD Counters:** Total URLs Scanned, Phishing Neutralized, Legitimate Classified, Model Accuracy (98.42%).
- **Interactive Charts:** Scan volume velocity trends (7-day and 6-month), threat severity distribution doughnut, and most common phishing indicators.
- **Live Threat Stream:** Real-time ticker of freshly classified malicious domains.

### 4. Enterprise Security & Administration
- **Role-Based Access Control (RBAC):** `Admin`, `Analyst`, and `User` roles.
- **Global Security Audit Logs:** Records user actions, IP addresses, timestamps, and outcomes.
- **Active ML Retraining Hub:** Trigger active learning updates incorporating user-reported feedback.
- **Hardened Security:** Helmet security headers, rate limiting, and password hashing with bcrypt.

---

## 🔑 Pre-Configured Demo Accounts

For capstone evaluation, presentations, and testing, the following accounts are pre-seeded:

| Role | Email Address | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@phishshield.ai` | `AdminPass123!@#` | Full administrative control, user management, audit logs, ML retraining |
| **Analyst** | `analyst@phishshield.ai` | `AnalystPass123!` | Deep forensic inspection, feedback loop, threat reporting |
| **User** | `user@phishshield.ai` | `UserPass123!` | Standard URL scanning, personal history, API key generation |

*(1-click login buttons are also provided directly on the Login page!)*

---

## 💻 Tech Stack
- **Frontend:** Vanilla CSS design system, Semantic HTML5, Modular ES6 JavaScript, Chart.js.
- **Backend:** Node.js, Express.js (v5), Helmet, CORS, Express-Rate-Limit, JSON Web Tokens (JWT), Bcrypt.js, `@supabase/supabase-js`.
- **Database:** **Supabase Cloud PostgreSQL** (primary cloud database with real-time replication & Row Level Security) + Persistent local atomic fallback storage. (See [`docs/SUPABASE_SETUP.md`](file:///c:/Users/HP/.gemini/antigravity-ide/scratch/phishshield-ai/docs/SUPABASE_SETUP.md)).
- **Machine Learning Pipeline:** Python 3, scikit-learn, Shannon Entropy, Levenshtein Distance, Random Forest, XGBoost.

---

## ⚡ Quickstart Guide

### 1. Start the Web Server
```bash
# Navigate to the project folder
cd phishshield-ai

# Install dependencies
npm install

# Run automated tests
npm test

# Start the application
npm start
```
The application will be live at: **http://localhost:5050**

### 2. Run the Machine Learning Pipeline (Python)
```bash
python ml_pipeline/feature_extractor.py
python ml_pipeline/train_model.py
```

---

## 📑 Pages Included
1. **Home (`#home`):** Landing page with live hero mini-scanner and radar sweep.
2. **About (`#about`):** Capstone research paper, interactive Confusion Matrix, and ROC-AUC curve.
3. **URL Scanner (`#scanner`):** Deep URL inspection with animated multi-stage telemetry.
4. **Dashboard (`#dashboard`):** Real-time statistics, threat trends, and live threat feed.
5. **Scan History (`#history`):** Filterable, searchable logs with CSV/JSON export.
6. **Reports (`#reports`):** Threat analytics and printable Executive Summary Briefing.
7. **Profile (`#profile`):** User management and developer API key generator.
8. **Settings (`#settings`):** ML sensitivity slider, theme mode, 2FA toggle, and password rotation.
9. **Admin Panel (`#admin`):** User role management, global audit logs, and live ML retraining.
10. **Contact (`#contact`):** Emergency phishing incident report submission form.
11. **Login (`#login`):** Modern sign-in with 1-click demo login buttons.
12. **Register (`#register`):** Account creation with live password strength meter.

---

## 📄 License
MIT License • Cybersecurity Capstone Project 2026
