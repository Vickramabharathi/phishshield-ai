/**
 * PhishShield AI - Footer Component
 */

function renderFooter() {
  return `
    <footer class="app-footer">
      <div class="footer-inner">
        <div>
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 14px;">
            <div class="brand-icon" style="width: 30px; height: 30px;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <strong style="font-size: 1.15rem; color: var(--text-primary);">PhishShield<span style="color: var(--cyan-primary);">.AI</span></strong>
          </div>
          <p style="color: var(--text-secondary); font-size: 0.88rem; line-height: 1.6; max-width: 380px; margin-bottom: 16px;">
            Machine Learning-Based Phishing Website Detection as a Countermeasure to Social Engineering Attacks. Advanced behavioral heuristics, homoglyph analysis, and real-time ensemble inference.
          </p>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="width: 8px; height: 8px; border-radius: 50%; background: var(--risk-safe); box-shadow: 0 0 8px var(--risk-safe);"></span>
            <span style="font-size: 0.8rem; font-family: var(--font-mono); color: var(--risk-safe);">THREAT SENSORS ONLINE (99.98% SLA)</span>
          </div>
        </div>

        <div>
          <h4 style="color: var(--text-primary); font-size: 0.92rem; margin-bottom: 14px; text-transform: uppercase; letter-spacing: 0.05em;">Detection Platform</h4>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px; font-size: 0.88rem;">
            <li><a href="#scanner" class="nav-link" style="padding: 0;">Live URL Inspector</a></li>
            <li><a href="#dashboard" class="nav-link" style="padding: 0;">Telemetry HUD</a></li>
            <li><a href="#history" class="nav-link" style="padding: 0;">Global Scan Logs</a></li>
            <li><a href="#reports" class="nav-link" style="padding: 0;">Threat Analytics & Reports</a></li>
          </ul>
        </div>

        <div>
          <h4 style="color: var(--text-primary); font-size: 0.92rem; margin-bottom: 14px; text-transform: uppercase; letter-spacing: 0.05em;">Academic Research</h4>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px; font-size: 0.88rem;">
            <li><a href="#about" class="nav-link" style="padding: 0;">Project Architecture</a></li>
            <li><a href="#about" class="nav-link" style="padding: 0;">ML Feature Taxonomy</a></li>
            <li><a href="#about" class="nav-link" style="padding: 0;">Confusion Matrix</a></li>
            <li><a href="#contact" class="nav-link" style="padding: 0;">Incident Response Team</a></li>
          </ul>
        </div>

        <div>
          <h4 style="color: var(--text-primary); font-size: 0.92rem; margin-bottom: 14px; text-transform: uppercase; letter-spacing: 0.05em;">Security & Access</h4>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px; font-size: 0.88rem;">
            <li><a href="#login" class="nav-link" style="padding: 0;">Analyst Portal</a></li>
            <li><a href="#profile" class="nav-link" style="padding: 0;">API Access & SDK</a></li>
            <li><a href="#settings" class="nav-link" style="padding: 0;">Model Sensitivity</a></li>
            <li><a href="#contact" class="nav-link" style="padding: 0;">Emergency Phish Submission</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <div>
          © 2026 PhishShield AI. Cybersecurity Capstone Research Project. All rights reserved.
        </div>
        <div style="display: flex; gap: 16px;">
          <span>RFC 3986 Compliant</span>
          <span>•</span>
          <span>MIT License</span>
          <span>•</span>
          <span>Ensemble ML v2.4.1</span>
        </div>
      </div>
    </footer>
  `;
}

window.renderFooter = renderFooter;
