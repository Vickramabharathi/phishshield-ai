/**
 * PhishShield AI - Emergency Incident Response & Research Contact View
 */

let contactActiveTab = 'incident';

function renderContactView() {
  return `
    <div class="view-header">
      <div class="view-title-group">
        <h1 class="view-title">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--cyan-primary)" stroke-width="2.5">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
          Security Incident Response & Research Contact
        </h1>
        <span class="badge badge-critical">SOC EMERGENCY DISPATCH</span>
      </div>
      <p class="view-subtitle">
        Submit active zero-day phishing campaigns for emergency triage, or connect with our academic cybersecurity research team.
      </p>
    </div>

    <!-- Contact Mode Tabs -->
    <div style="display: flex; gap: 10px; margin-bottom: 24px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 12px;">
      <button class="btn ${contactActiveTab === 'incident' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="window.switchContactTab('incident')">
        🚨 Emergency Phishing Incident Report
      </button>
      <button class="btn ${contactActiveTab === 'research' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="window.switchContactTab('research')">
        ✉️ Academic & Capstone Inquiry
      </button>
    </div>

    <div class="grid-two-equal">
      <!-- Left: Active Form -->
      <div class="cyber-card" id="contact-form-card">
        ${contactActiveTab === 'incident' ? `
          <div class="cyber-card-header">
            <div class="cyber-card-title" style="color: var(--risk-critical);">
              <span>🚨</span> Report Malicious Phishing Campaign
            </div>
            <span class="badge badge-critical">Priority Triage</span>
          </div>

          <form id="incident-form" onsubmit="window.handleIncidentSubmit(event)">
            <div class="form-group">
              <label class="form-label" for="inc-url">Suspicious / Malicious Website URL *</label>
              <input type="url" id="inc-url" class="form-input" placeholder="https://fake-login-bank.xyz/verify" required />
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div class="form-group">
                <label class="form-label" for="inc-type">Observed Attack Vector</label>
                <select id="inc-type" class="form-select">
                  <option value="Credential Harvesting">Credential Harvesting</option>
                  <option value="Homoglyph Spoofing">Homoglyph / Punycode Spoof</option>
                  <option value="Crypto Drainer">Web3 Crypto Wallet Drainer</option>
                  <option value="Executive Spear Phish">Executive Spear Phishing (BEC)</option>
                  <option value="Malware Dropper">Drive-by Malware Dropper</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label" for="inc-severity">Severity Rating</label>
                <select id="inc-severity" class="form-select">
                  <option value="Critical">Critical (Active Employee Lure)</option>
                  <option value="High">High (High-Profile Brand Spoof)</option>
                  <option value="Medium">Medium (Suspicious Domain)</option>
                  <option value="Low">Low (Informational)</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="inc-sender">Sender Email / Attack Origin (Optional)</label>
              <input type="text" id="inc-sender" class="form-input" placeholder="e.g. security-alert@spoofed-domain.com" />
            </div>

            <div class="form-group">
              <label class="form-label" for="inc-desc">Incident Context & Evidence</label>
              <textarea id="inc-desc" class="form-textarea" rows="3" placeholder="Describe the email lure, targeted employees, or observed payload..."></textarea>
            </div>

            <button type="submit" class="btn btn-danger" id="inc-submit-btn" style="width: 100%;">
              🚨 Dispatch Emergency Incident Report
            </button>
          </form>
        ` : `
          <div class="cyber-card-header">
            <div class="cyber-card-title">
              <span>✉️</span> Academic & Project Inquiries
            </div>
            <span class="badge badge-low">Research Group</span>
          </div>

          <form id="message-form" onsubmit="window.handleMessageSubmit(event)">
            <div class="form-group">
              <label class="form-label" for="msg-name">Your Full Name</label>
              <input type="text" id="msg-name" class="form-input" placeholder="Dr. Sarah Connor" required />
            </div>

            <div class="form-group">
              <label class="form-label" for="msg-email">Email Address</label>
              <input type="email" id="msg-email" class="form-input" placeholder="sarah@university.edu" required />
            </div>

            <div class="form-group">
              <label class="form-label" for="msg-subject">Subject</label>
              <input type="text" id="msg-subject" class="form-input" value="Capstone Review & Collaboration" required />
            </div>

            <div class="form-group">
              <label class="form-label" for="msg-body">Message / Feedback</label>
              <textarea id="msg-body" class="form-textarea" rows="4" placeholder="Enter inquiry regarding model weights, datasets, or presentation schedule..." required></textarea>
            </div>

            <button type="submit" class="btn btn-primary" id="msg-submit-btn" style="width: 100%;">
              Send Research Message
            </button>
          </form>
        `}
      </div>

      <!-- Right: Research Team & FAQ Accordion -->
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <!-- Capstone Team Box -->
        <div class="cyber-card">
          <h3 style="font-size: 1.15rem; color: var(--text-primary); margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
            <span>🛡️</span> Project & Institutional Affiliation
          </h3>
          <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 14px;">
            <strong>Project Title:</strong> Machine Learning-Based Phishing Website Detection as a Countermeasure to Social Engineering Attacks.<br>
            <strong>Division:</strong> Department of Cybersecurity & Computer Science Engineering.<br>
            <strong>Research Focus:</strong> Zero-day adversarial machine learning, explainable AI, and real-time network defense.
          </p>
          <div style="font-size: 0.82rem; color: var(--text-muted); font-family: var(--font-mono); line-height: 1.8;">
            <div>• SOC Operations Lead: Alex Vance (admin@phishshield.ai)</div>
            <div>• Senior ML Research Fellow: Elena Rostova (analyst@phishshield.ai)</div>
            <div>• Security Engineering: Jordan Miller (user@phishshield.ai)</div>
          </div>
        </div>

        <!-- FAQ Accordion -->
        <div class="cyber-card">
          <h3 style="font-size: 1.15rem; color: var(--text-primary); margin-bottom: 14px;">
            Frequently Asked Questions
          </h3>

          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="background: var(--bg-tertiary); padding: 12px 14px; border-radius: var(--radius-md);">
              <strong style="color: var(--cyan-primary); font-size: 0.88rem; display: block; margin-bottom: 4px;">
                How does PhishShield detect zero-day phishing without blacklists?
              </strong>
              <p style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.5;">
                By analyzing intrinsic mathematical properties: lexical structure, character entropy, Cyrillic lookalikes, brand similarity, and protocol indicators.
              </p>
            </div>

            <div style="background: var(--bg-tertiary); padding: 12px 14px; border-radius: var(--radius-md);">
              <strong style="color: var(--cyan-primary); font-size: 0.88rem; display: block; margin-bottom: 4px;">
                What happens when an incident is submitted?
              </strong>
              <p style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.5;">
                The URL is immediately routed to our forensic feature extraction queue, scored by the ensemble classifier, and added to the SOC priority audit log.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function switchContactTab(tab) {
  contactActiveTab = tab;
  window.router.renderCurrentView();
}

async function handleIncidentSubmit(event) {
  event.preventDefault();
  const targetUrl = document.getElementById('inc-url').value.trim();
  const incidentType = document.getElementById('inc-type').value;
  const severity = document.getElementById('inc-severity').value;
  const senderEmail = document.getElementById('inc-sender').value.trim();
  const description = document.getElementById('inc-desc').value.trim();
  const btn = document.getElementById('inc-submit-btn');

  btn.disabled = true;
  btn.innerHTML = `<span class="spinner"></span> Dispatching Incident...`;

  try {
    const res = await window.api.reportIncident({
      targetUrl,
      incidentType,
      severity,
      senderEmail,
      description
    });
    window.showToast(res.message, 'success');
    document.getElementById('incident-form').reset();
  } catch (err) {
    window.showToast(err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = `<span>🚨 Dispatch Emergency Incident Report</span>`;
  }
}

async function handleMessageSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('msg-name').value.trim();
  const email = document.getElementById('msg-email').value.trim();
  const subject = document.getElementById('msg-subject').value.trim();
  const message = document.getElementById('msg-body').value.trim();
  const btn = document.getElementById('msg-submit-btn');

  btn.disabled = true;
  try {
    const res = await window.api.sendContactMessage({ name, email, subject, message });
    window.showToast(res.message, 'success');
    document.getElementById('message-form').reset();
  } catch (err) {
    window.showToast(err.message, 'error');
  } finally {
    btn.disabled = false;
  }
}

window.renderContactView = renderContactView;
window.switchContactTab = switchContactTab;
window.handleIncidentSubmit = handleIncidentSubmit;
window.handleMessageSubmit = handleMessageSubmit;
