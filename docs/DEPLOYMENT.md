# PhishShield AI - Production Deployment Guide

## 1. Local Development
```bash
# Clone and enter directory
cd phishshield-ai

# Install dependencies
npm install

# Run automated test suites
npm test

# Launch production server
npm start
```
The server will boot on `http://localhost:5050`.

---

## 2. Docker Deployment
```bash
# Build Docker image
docker build -t phishshield-ai:latest .

# Run container
docker run -d -p 5050:5050 --name phishshield phishshield-ai:latest
```

---

## 3. Environment Variables
| Variable | Default | Purpose |
| :--- | :--- | :--- |
| `PORT` | `5050` | Port for Express HTTP server |
| `NODE_ENV` | `production` | Runtime mode |
| `JWT_SECRET` | Secure key | Secret used for signing authentication tokens |
| `ML_DEFAULT_THRESHOLD` | `0.65` | Default decision threshold |

---

## 4. Cloud Deployments (Render, Railway, Heroku)
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Health Check Endpoint:** `http://localhost:5050/api/health`
