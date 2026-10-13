/**
 * PhishShield AI - Universal Cyber Modal Manager
 */

function openModal(contentHtml) {
  let overlay = document.getElementById('global-modal-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'global-modal-overlay';
    overlay.className = 'modal-overlay';
    document.body.appendChild(overlay);
  }

  overlay.innerHTML = `
    <div class="modal-content" onclick="event.stopPropagation()">
      <button class="modal-close-btn" onclick="window.closeModal()">&times;</button>
      <div id="modal-body-container">
        ${contentHtml}
      </div>
    </div>
  `;

  overlay.onclick = () => window.closeModal();
  setTimeout(() => overlay.classList.add('active'), 10);
}

function closeModal() {
  const overlay = document.getElementById('global-modal-overlay');
  if (overlay) {
    overlay.classList.remove('active');
    setTimeout(() => {
      overlay.innerHTML = '';
    }, 300);
  }
}

// Open Scan Details Modal
function openScanModal(scan) {
  const isPhishing = scan.prediction === 'Phishing';
  const feats = scan.features || {};

  const html = `
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
      <div>
        <span class="badge ${scan.riskLevel === 'Safe' ? 'badge-safe' : scan.riskLevel === 'Low' ? 'badge-low' : scan.riskLevel === 'Medium' ? 'badge-medium' : scan.riskLevel === 'High' ? 'badge-high' : 'badge-critical'}">
          ${scan.riskLevel} Risk
        </span>
        <h2 style="font-size: 1.4rem; color: var(--text-primary); margin-top: 6px;">URL Deep Forensic Analysis</h2>
      </div>
      <div style="text-align: right;">
        <span style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--font-mono);">ID: ${scan.id}</span>
      </div>
    </div>

    <div style="background: var(--bg-primary); border: 1px solid var(--border-subtle); padding: 14px; border-radius: var(--radius-md); font-family: var(--font-mono); font-size: 0.88rem; word-break: break-all; margin-bottom: 20px; color: var(--cyan-primary);">
      ${scan.url}
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 20px;">
      <div style="background: var(--bg-tertiary); padding: 14px; border-radius: var(--radius-md);">
        <div style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase;">ML Prediction</div>
        <div style="font-size: 1.25rem; font-weight: 700; color: ${isPhishing ? 'var(--risk-critical)' : 'var(--risk-safe)'}; margin-top: 4px;">
          ${scan.prediction} (${scan.confidence}%)
        </div>
      </div>
      <div style="background: var(--bg-tertiary); padding: 14px; border-radius: var(--radius-md);">
        <div style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase;">Inference Latency</div>
        <div style="font-size: 1.25rem; font-weight: 700; color: var(--text-primary); margin-top: 4px; font-family: var(--font-mono);">
          ${scan.latencyMs || 14} ms
        </div>
      </div>
    </div>

    ${scan.reasons && scan.reasons.length > 0 ? `
      <div style="margin-bottom: 20px;">
        <h4 style="font-size: 0.95rem; color: var(--risk-critical); margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
          <span>⚠️</span> Explainable AI (XAI) Triggered Risk Vectors:
        </h4>
        <div class="indicator-list">
          ${scan.reasons.map((r) => `<div class="indicator-item risk">${r}</div>`).join('')}
        </div>
      </div>
    ` : ''}

    ${scan.positiveIndicators && scan.positiveIndicators.length > 0 ? `
      <div style="margin-bottom: 20px;">
        <h4 style="font-size: 0.95rem; color: var(--risk-safe); margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
          <span>🛡️</span> Verified Positive Indicators:
        </h4>
        <div class="indicator-list">
          ${scan.positiveIndicators.map((p) => `<div class="indicator-item safe">${p}</div>`).join('')}
        </div>
      </div>
    ` : ''}

    <div style="margin-bottom: 24px;">
      <h4 style="font-size: 0.95rem; color: var(--text-primary); margin-bottom: 10px;">
        Raw Feature Vector Matrix:
      </h4>
      <div class="table-responsive" style="max-height: 180px; overflow-y: auto;">
        <table class="cyber-table">
          <thead>
            <tr><th>Metric</th><th>Extracted Value</th><th>Status</th></tr>
          </thead>
          <tbody>
            <tr><td>Shannon Entropy (Domain)</td><td>${feats.shannonEntropyDomain || 'N/A'} bits</td><td>${feats.shannonEntropyDomain > 3.6 ? 'High (Anomaly)' : 'Normal'}</td></tr>
            <tr><td>Punycode / Homoglyph Attack</td><td>${feats.hasPunycode ? 'True' : 'False'}</td><td>${feats.hasPunycode ? 'Critical Trigger' : 'Clean'}</td></tr>
            <tr><td>Brand Impersonation</td><td>${feats.impersonatedBrand || 'None detected'}</td><td>${feats.impersonatedBrand ? 'Spoofing Detected' : 'Clean'}</td></tr>
            <tr><td>IP Address as Host</td><td>${feats.hasIpAddress ? 'True' : 'False'}</td><td>${feats.hasIpAddress ? 'High Risk' : 'Standard DNS'}</td></tr>
            <tr><td>Suspicious Keywords Count</td><td>${feats.suspiciousKeywords || 0}</td><td>${feats.suspiciousKeywords > 2 ? 'High Density' : 'Low'}</td></tr>
            <tr><td>Subdomain Count</td><td>${feats.subdomains || 0}</td><td>${feats.subdomains > 2 ? 'Chained' : 'Standard'}</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <div style="display: flex; gap: 12px; justify-content: flex-end;">
      <button class="btn btn-secondary btn-sm" onclick="window.openFeedbackModal('${scan.id}')">
        Flag Misclassification
      </button>
      <button class="btn btn-primary btn-sm" onclick="window.print()">
        🖨️ Print Report
      </button>
      <button class="btn btn-secondary btn-sm" onclick="window.closeModal()">
        Close
      </button>
    </div>
  `;

  openModal(html);
}

// Open Feedback Modal
function openFeedbackModal(scanId) {
  const html = `
    <h3 style="font-size: 1.3rem; margin-bottom: 12px; color: var(--text-primary);">Report Classification Feedback</h3>
    <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 20px; line-height: 1.5;">
      Your feedback directly updates the PhishShield AI active machine learning retraining pipeline.
    </p>

    <div class="form-group">
      <label class="form-label">Classification Feedback Type</label>
      <select id="feedback-type" class="form-select">
        <option value="False Positive">False Positive (Marked Phishing but actually Safe)</option>
        <option value="False Negative">False Negative (Marked Safe but actually Phishing)</option>
        <option value="Impersonation Missed">Brand Impersonation was not flagged</option>
      </select>
    </div>

    <div class="form-group">
      <label class="form-label">Additional Analyst Notes (Optional)</label>
      <textarea id="feedback-notes" class="form-textarea" rows="3" placeholder="Provide any additional domain context, WHOIS info, or campaign details..."></textarea>
    </div>

    <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px;">
      <button class="btn btn-secondary" onclick="window.closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="window.submitFeedbackAction('${scanId}')">Submit to Active Learning</button>
    </div>
  `;
  openModal(html);
}

async function submitFeedbackAction(scanId) {
  const type = document.getElementById('feedback-type').value;
  const notes = document.getElementById('feedback-notes').value;

  try {
    const res = await window.api.submitFeedback(scanId, type, notes);
    window.closeModal();
    window.showToast(res.message || 'Feedback submitted successfully!', 'success');
  } catch (err) {
    window.showToast(err.message, 'error');
  }
}

window.openModal = openModal;
window.closeModal = closeModal;
window.openScanModal = openScanModal;
window.openFeedbackModal = openFeedbackModal;
window.submitFeedbackAction = submitFeedbackAction;
