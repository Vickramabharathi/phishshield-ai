/**
 * PhishShield AI - Dedicated URL Scanner View
 */

let lastScannerResult = null;

function renderScannerView() {
  return `
    <div class="view-header">
      <div class="view-title-group">
        <h1 class="view-title">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--cyan-primary)" stroke-width="2.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          Deep URL Threat Scanner
        </h1>
        <div style="display: flex; gap: 8px;">
          <span class="badge badge-safe">Ensemble v2.4 Active</span>
          <span class="badge badge-low">SHAP Reasoning Enabled</span>
        </div>
      </div>
      <p class="view-subtitle">
        Enter any web address to execute a deep forensic machine learning scan. Evaluates 30+ lexical parameters, homoglyphs, information-theoretic entropy, and brand impersonation vectors.
      </p>
    </div>

    <!-- Scanner Input Card -->
    <div class="cyber-card" style="margin-bottom: 24px; padding: 28px;">
      <form id="deep-scan-form" onsubmit="window.handleDeepScan(event)">
        <div class="scanner-box" style="margin-bottom: 16px;">
          <input 
            type="text" 
            id="deep-scan-input" 
            class="scanner-input" 
            placeholder="Enter or paste full website URL (e.g. https://verify-apple-id-suspended.xyz/service)..."
            required
          />
          <div class="scanner-actions">
            <button type="button" class="btn btn-secondary btn-sm" onclick="window.pasteToDeepScan()">
              Paste
            </button>
            <button type="submit" class="btn btn-primary" id="deep-scan-submit-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <span>Analyze URL</span>
            </button>
          </div>
        </div>
      </form>

      <!-- Preloaded Cyber Test Vectors -->
      <div>
        <span style="font-size: 0.82rem; color: var(--text-muted); font-weight: 500; display: block; margin-bottom: 8px;">
          Curated Threat Benchmark Samples:
        </span>
        <div class="quick-samples-bar" style="margin-top: 0;">
          <button type="button" class="sample-chip" onclick="window.loadDeepSample('http://pаypal-security-update.com/login')">
            <span style="color: var(--risk-critical);">●</span> Homoglyph Cyrillic Spoof (PayPal)
          </button>
          <button type="button" class="sample-chip" onclick="window.loadDeepSample('http://192.168.1.105:8080/secure/chase-online-banking/auth.php')">
            <span style="color: var(--risk-critical);">●</span> Raw IPv4 + Non-standard Port 8080 (Chase)
          </button>
          <button type="button" class="sample-chip" onclick="window.loadDeepSample('https://verify-apple-id-suspended.xyz/service/login')">
            <span style="color: var(--risk-high);">●</span> Abused TLD (.xyz) Brand Phish (Apple)
          </button>
          <button type="button" class="sample-chip" onclick="window.loadDeepSample('https://metamvsk-airdrop-claim.top/connect-wallet')">
            <span style="color: var(--risk-critical);">●</span> Typo-squatting Web3 Drainer (MetaMask)
          </button>
          <button type="button" class="sample-chip" onclick="window.loadDeepSample('https://github.com/security/advisories')">
            <span style="color: var(--risk-safe);">●</span> Authoritative Platform (GitHub)
          </button>
          <button type="button" class="sample-chip" onclick="window.loadDeepSample('https://docs.google.com/document/d/1A-sample/edit')">
            <span style="color: var(--risk-safe);">●</span> Trusted Cloud Service (Google Docs)
          </button>
        </div>
      </div>
    </div>

    <!-- Animated Scan Telemetry Progress (Hidden by default) -->
    <div id="scan-progress-card" class="cyber-card" style="display: none; margin-bottom: 24px; padding: 24px; border-color: var(--cyan-primary);">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span class="spinner" style="color: var(--cyan-primary);"></span>
          <span style="font-weight: 600; font-size: 0.95rem; color: var(--text-primary);" id="progress-step-text">
            Ingesting URL & parsing lexical features...
          </span>
        </div>
        <span style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--cyan-primary);" id="progress-percent">
          20%
        </span>
      </div>
      <div class="meter-track">
        <div id="scan-progress-bar" class="meter-fill" style="width: 20%; background: linear-gradient(90deg, var(--cyan-primary), var(--blue-electric));"></div>
      </div>
    </div>

    <!-- Scan Results Display Area -->
    <div id="scan-results-container"></div>
  `;
}

async function handleDeepScan(event) {
  event.preventDefault();
  const input = document.getElementById('deep-scan-input');
  const btn = document.getElementById('deep-scan-submit-btn');
  const progressCard = document.getElementById('scan-progress-card');
  const progressText = document.getElementById('progress-step-text');
  const progressPercent = document.getElementById('progress-percent');
  const progressBar = document.getElementById('scan-progress-bar');
  const resultsContainer = document.getElementById('scan-results-container');

  const url = input.value.trim();
  if (!url) return;

  btn.disabled = true;
  resultsContainer.innerHTML = '';
  progressCard.style.display = 'block';

  // Multi-stage inspection animation
  const stages = [
    { text: 'Ingesting URL & normalizing RFC 3986 tokens...', pct: 25 },
    { text: 'Detecting Homoglyphs & Unicode Punycode lookalikes...', pct: 50 },
    { text: 'Computing Shannon Entropy (DGA & algorithmic patterns)...', pct: 75 },
    { text: 'Evaluating Brand Typo-squatting & executing ML Ensemble...', pct: 95 }
  ];

  for (let i = 0; i < stages.length; i++) {
    progressText.innerText = stages[i].text;
    progressPercent.innerText = `${stages[i].pct}%`;
    progressBar.style.width = `${stages[i].pct}%`;
    await new Promise((r) => setTimeout(r, 180));
  }

  try {
    const res = await window.api.scanUrl(url);
    const data = res.data;
    lastScannerResult = data;

    progressText.innerText = 'Analysis Complete! Generating XAI Threat Report...';
    progressPercent.innerText = '100%';
    progressBar.style.width = '100%';

    await new Promise((r) => setTimeout(r, 200));
    progressCard.style.display = 'none';

    renderScanResult(data);
    window.showToast(`Scan complete: ${data.prediction} (${data.riskLevel})`, data.prediction === 'Phishing' ? 'error' : 'success');
  } catch (err) {
    progressCard.style.display = 'none';
    window.showToast(err.message, 'error');
  } finally {
    btn.disabled = false;
  }
}

function renderScanResult(data) {
  const container = document.getElementById('scan-results-container');
  if (!container) return;

  const isPhishing = data.prediction === 'Phishing';
  const feats = data.features || {};

  container.innerHTML = `
    <!-- Main Verdict Banner Card -->
    <div class="verdict-card ${isPhishing ? 'phishing' : 'legitimate'}">
      <div class="verdict-top">
        <div class="verdict-badge-big">
          <div class="verdict-icon" style="background: ${isPhishing ? 'rgba(239, 68, 68, 0.25)' : 'rgba(16, 185, 129, 0.25)'};">
            ${isPhishing ? '⚠️' : '🛡️'}
          </div>
          <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
              <span class="badge ${data.riskLevel === 'Safe' ? 'badge-safe' : data.riskLevel === 'Low' ? 'badge-low' : data.riskLevel === 'Medium' ? 'badge-medium' : data.riskLevel === 'High' ? 'badge-high' : 'badge-critical'}">
                ${data.riskLevel} Risk
              </span>
              <span style="font-size: 0.82rem; font-family: var(--font-mono); color: var(--text-secondary);">
                Scan Latency: ${data.latencyMs || 14}ms
              </span>
            </div>
            <div class="verdict-title" style="color: ${isPhishing ? 'var(--risk-critical)' : 'var(--risk-safe)'};">
              Website Classified as ${data.prediction}
            </div>
            <div style="font-family: var(--font-mono); font-size: 0.95rem; color: var(--text-secondary); margin-top: 4px; word-break: break-all;">
              Target: <span style="color: var(--text-primary);">${data.url}</span>
            </div>
          </div>
        </div>

        <!-- Confidence Gauge Display -->
        <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); padding: 18px 24px; border-radius: var(--radius-lg); text-align: center; min-width: 170px;">
          <div style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em;">Confidence</div>
          <div style="font-size: 2.2rem; font-weight: 800; font-family: var(--font-mono); color: ${isPhishing ? 'var(--risk-critical)' : 'var(--risk-safe)'};">
            ${data.confidence}%
          </div>
          <div class="meter-track" style="margin-top: 8px; width: 120px;">
            <div class="meter-fill" style="width: ${data.confidence}%; background: ${isPhishing ? 'var(--risk-critical)' : 'var(--risk-safe)'};"></div>
          </div>
        </div>
      </div>

      <!-- Action Buttons Bar & Workflow Routing -->
      <div style="display: flex; gap: 10px; flex-wrap: wrap; padding-top: 14px; border-top: 1px solid var(--border-subtle); align-items: center;">
        <a href="#reports" class="btn btn-secondary btn-sm">
          📊 Intelligence Reports
        </a>
        <a href="#history" class="btn btn-secondary btn-sm">
          📜 Scan History
        </a>
        <button class="btn btn-secondary btn-sm" onclick="window.print()">
          🖨️ Export PDF / Print
        </button>
        <button class="btn btn-secondary btn-sm" onclick="window.copyScanShareLink('${data.id}')">
          🔗 Copy Link
        </button>
        <button class="btn btn-secondary btn-sm" onclick="window.openFeedbackModal('${data.id}')">
          Flag Misclassification
        </button>
        <button class="btn btn-primary btn-sm" onclick="window.clearScanner()">
          + Scan Another URL
        </button>
      </div>
    </div>

    <!-- Explainable AI (XAI) Reasons & Positive Indicators Grid -->
    <div class="grid-two-equal">
      <!-- Risk Drivers -->
      <div class="cyber-card">
        <div class="cyber-card-header">
          <div class="cyber-card-title" style="color: ${isPhishing ? 'var(--risk-critical)' : 'var(--text-primary)'};">
            <span>⚠️</span> Triggered Risk Indicators (${data.reasons ? data.reasons.length : 0})
          </div>
        </div>
        ${data.reasons && data.reasons.length > 0 ? `
          <div class="indicator-list">
            ${data.reasons.map((r) => `<div class="indicator-item risk">${r}</div>`).join('')}
          </div>
        ` : `
          <p style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.5;">
            No malicious phishing triggers detected. The URL does not exhibit token obfuscation, brand spoofing, or abnormal entropy.
          </p>
        `}
      </div>

      <!-- Positive / Benign Safeguards -->
      <div class="cyber-card">
        <div class="cyber-card-header">
          <div class="cyber-card-title" style="color: var(--risk-safe);">
            <span>🛡️</span> Positive Trust Factors (${data.positiveIndicators ? data.positiveIndicators.length : 0})
          </div>
        </div>
        ${data.positiveIndicators && data.positiveIndicators.length > 0 ? `
          <div class="indicator-list">
            ${data.positiveIndicators.map((p) => `<div class="indicator-item safe">${p}</div>`).join('')}
          </div>
        ` : `
          <p style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.5;">
            Zero verified trust factors detected. Standard defensive posture recommended.
          </p>
        `}
      </div>
    </div>

    <!-- Contextual Defensive Recommendations -->
    <div class="cyber-card" style="margin-bottom: 24px;">
      <div class="cyber-card-header">
        <div class="cyber-card-title">
          <span>📋</span> Actionable Security Recommendations
        </div>
        <span class="badge ${isPhishing ? 'badge-critical' : 'badge-safe'}">
          ${isPhishing ? 'Mitigation Required' : 'Verified Secure'}
        </span>
      </div>
      <div class="recommendation-box">
        ${(data.recommendations || []).map((rec, idx) => `
          <div class="rec-item">
            <span style="color: ${isPhishing ? 'var(--risk-critical)' : 'var(--risk-safe)'}; font-weight: 700;">[0${idx + 1}]</span>
            <span>${rec}</span>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Forensic Feature Vector Matrix -->
    <div class="cyber-card">
      <div class="cyber-card-header">
        <div class="cyber-card-title">
          <span>🔬</span> Deep Feature Vector Matrix (32 ML Dimensions)
        </div>
        <span style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--font-mono);">
          RFC 3986 Lexical Inspector
        </span>
      </div>
      <div class="table-responsive">
        <table class="cyber-table">
          <thead>
            <tr>
              <th>Feature Name</th>
              <th>Extracted Value</th>
              <th>Normative Baseline</th>
              <th>Risk Attribution</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Punycode / Homoglyph</strong></td>
              <td><code>${feats.hasPunycode ? 'DETECTED' : 'CLEAN'}</code></td>
              <td>ASCII Standard</td>
              <td><span class="badge ${feats.hasPunycode ? 'badge-critical' : 'badge-safe'}">${feats.hasPunycode ? 'CRITICAL' : 'SAFE'}</span></td>
            </tr>
            <tr>
              <td><strong>Brand Impersonation</strong></td>
              <td><code>${feats.impersonatedBrand || 'None detected'}</code></td>
              <td>Official Registered Entity</td>
              <td><span class="badge ${feats.impersonatedBrand ? 'badge-critical' : 'badge-safe'}">${feats.impersonatedBrand ? 'CRITICAL' : 'SAFE'}</span></td>
            </tr>
            <tr>
              <td><strong>Shannon Entropy (Domain)</strong></td>
              <td><code>${feats.shannonEntropyDomain || 0} bits</code></td>
              <td>Natural English: 2.5 - 3.2 bits</td>
              <td><span class="badge ${feats.shannonEntropyDomain > 3.6 ? 'badge-high' : 'badge-safe'}">${feats.shannonEntropyDomain > 3.6 ? 'HIGH' : 'NORMAL'}</span></td>
            </tr>
            <tr>
              <td><strong>Host Format (IP vs Domain)</strong></td>
              <td><code>${feats.hasIpAddress ? 'RAW IP ADDRESS' : 'DNS DOMAIN'}</code></td>
              <td>Fully Qualified Domain Name</td>
              <td><span class="badge ${feats.hasIpAddress ? 'badge-high' : 'badge-safe'}">${feats.hasIpAddress ? 'HIGH' : 'SAFE'}</span></td>
            </tr>
            <tr>
              <td><strong>Credential Theft Keywords</strong></td>
              <td><code>${feats.suspiciousKeywords || 0} occurrences</code></td>
              <td>0 - 1 tokens</td>
              <td><span class="badge ${feats.suspiciousKeywords > 2 ? 'badge-high' : feats.suspiciousKeywords > 0 ? 'badge-medium' : 'badge-safe'}">${feats.suspiciousKeywords > 2 ? 'HIGH' : feats.suspiciousKeywords > 0 ? 'MEDIUM' : 'SAFE'}</span></td>
            </tr>
            <tr>
              <td><strong>Subdomain Nesting Depth</strong></td>
              <td><code>${feats.subdomains || 0} subdomains</code></td>
              <td>&lt; 2 subdomains</td>
              <td><span class="badge ${feats.subdomains > 2 ? 'badge-medium' : 'badge-safe'}">${feats.subdomains > 2 ? 'ELEVATED' : 'SAFE'}</span></td>
            </tr>
            <tr>
              <td><strong>URL Total Length</strong></td>
              <td><code>${feats.urlLength || 0} chars</code></td>
              <td>&lt; 75 characters</td>
              <td><span class="badge ${feats.urlLength > 120 ? 'badge-medium' : 'badge-safe'}">${feats.urlLength > 120 ? 'ELEVATED' : 'SAFE'}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function loadDeepSample(url) {
  const input = document.getElementById('deep-scan-input');
  if (input) {
    input.value = url;
    window.handleDeepScan({ preventDefault: () => {} });
  }
}

async function pasteToDeepScan() {
  try {
    const text = await navigator.clipboard.readText();
    const input = document.getElementById('deep-scan-input');
    if (input) input.value = text.trim();
  } catch (e) {
    window.showToast('Please paste manually using Ctrl+V.', 'info');
  }
}

function copyScanShareLink(scanId) {
  const url = `${window.location.origin}/#history?search=${scanId}`;
  navigator.clipboard.writeText(url).then(() => {
    window.showToast('Shareable scan link copied to clipboard!', 'info');
  });
}

function clearScanner() {
  const input = document.getElementById('deep-scan-input');
  const container = document.getElementById('scan-results-container');
  if (input) input.value = '';
  if (container) container.innerHTML = '';
}

window.renderScannerView = renderScannerView;
window.handleDeepScan = handleDeepScan;
window.loadDeepSample = loadDeepSample;
window.pasteToDeepScan = pasteToDeepScan;
window.copyScanShareLink = copyScanShareLink;
window.clearScanner = clearScanner;
