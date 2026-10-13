# PhishShield AI - REST API Specifications

The PhishShield AI platform provides a secure REST API for automated URL inspection, SOC integrations, and threat intelligence pipelines.

## Base URL
```
http://localhost:5050/api
```

## Authentication
Authentication is performed via Bearer tokens passed in the `Authorization` HTTP header:
```http
Authorization: Bearer <JWT_TOKEN_OR_API_KEY>
```

---

## 1. Authentication Endpoints

### Register User
- **POST** `/auth/register`
- **Body:**
```json
{
  "name": "Alex Vance",
  "email": "alex@secops.io",
  "password": "Password123!",
  "organization": "Threat Defense Lab"
}
```

### User Login
- **POST** `/auth/login`
- **Body:**
```json
{
  "email": "admin@phishshield.ai",
  "password": "AdminPass123!@#"
}
```

---

## 2. Threat Inspection Endpoints

### Analyze Website URL
- **POST** `/scans/analyze`
- **Rate Limit:** 60 requests / minute
- **Body:**
```json
{
  "url": "http://pаypal-security-update.com/login"
}
```
- **Response:**
```json
{
  "success": true,
  "data": {
    "id": "scn-1718000000-101",
    "url": "http://pаypal-security-update.com/login",
    "domain": "pаypal-security-update.com",
    "prediction": "Phishing",
    "confidence": 99.4,
    "riskLevel": "Critical",
    "latencyMs": 14,
    "reasons": [
      "Homoglyph / Punycode character detected in domain",
      "Brand impersonation detected targeting 'PayPal'"
    ],
    "recommendations": [
      "Immediate credential revocation for any accounts entered here",
      "Add domain to enterprise firewall & DNS sinkhole"
    ]
  }
}
```

### Scan History
- **GET** `/scans/history?search=paypal&riskLevel=Critical&page=1&limit=10`

### Export Scans
- **GET** `/scans/export?format=csv`
- **GET** `/scans/export?format=json`

---

## 3. Analytics Endpoints

### Dashboard Telemetry
- **GET** `/analytics/dashboard`
- **Returns:** Real-time statistics, 7-day velocity trends, top targeted brands, and abused TLD distributions.

---

## 4. Admin Endpoints (RBAC: Admin Only)

- **GET** `/admin/users` - List all registered users
- **PATCH** `/admin/users/:id/role` - Update role (`admin`, `analyst`, `user`)
- **GET** `/admin/audit-logs` - Retrieve global security audit trail
- **POST** `/admin/retrain` - Trigger active learning model retraining
- **GET** `/admin/system-health` - Inspect CPU, RAM, and database health
