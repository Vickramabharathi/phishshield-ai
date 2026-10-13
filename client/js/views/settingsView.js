/**
 * PhishShield AI - System Settings & Preferences View
 */

function renderSettingsView() {
  const user = window.api.getCurrentUser();
  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';

  return `
    <div class="view-header">
      <div class="view-title-group">
        <h1 class="view-title">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--cyan-primary)" stroke-width="2.5">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"></path>
          </svg>
          System Settings & Heuristics Tuning
        </h1>
        <span class="badge badge-safe">Config v1.2</span>
      </div>
      <p class="view-subtitle">
        Fine-tune machine learning classification thresholds, adjust visual themes, configure multi-factor authentication, and manage security alerts.
      </p>
    </div>

    <div class="grid-two-equal">
      <!-- 1. ML Detection Sensitivity Threshold -->
      <div class="cyber-card">
        <div class="cyber-card-header">
          <div class="cyber-card-title">
            <span>🎛️</span> ML Inference Sensitivity Threshold
          </div>
          <span class="badge badge-low" id="threshold-mode-badge">Balanced Mode</span>
        </div>

        <p style="color: var(--text-secondary); font-size: 0.88rem; line-height: 1.5; margin-bottom: 20px;">
          Adjust the decision boundary threshold for classifying suspicious URLs as Phishing. Lower thresholds maximize detection of subtle zero-day vectors (higher recall).
        </p>

        <div style="background: var(--bg-primary); padding: 20px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <span style="font-weight: 600; font-size: 0.95rem; color: var(--text-primary);">Classification Threshold</span>
            <span style="font-size: 1.3rem; font-weight: 700; color: var(--cyan-primary); font-family: var(--font-mono);" id="threshold-value-display">
              0.65
            </span>
          </div>

          <input 
            type="range" 
            id="ml-threshold-slider" 
            min="0.40" 
            max="0.85" 
            step="0.05" 
            value="0.65" 
            style="width: 100%; accent-color: var(--cyan-primary); cursor: pointer;"
            oninput="window.updateThresholdSlider(this.value)"
          />

          <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-muted); margin-top: 8px;">
            <span>0.40 (Aggressive / High Recall)</span>
            <span>0.65 (Balanced Enterprise)</span>
            <span>0.85 (Conservative / Zero FP)</span>
          </div>
        </div>

        <button class="btn btn-primary btn-sm" onclick="window.saveSensitivityThreshold()">
          Apply Sensitivity Configuration
        </button>
      </div>

      <!-- 2. UI Appearance & Theme -->
      <div class="cyber-card">
        <div class="cyber-card-header">
          <div class="cyber-card-title">
            <span>🎨</span> Appearance & Theme Mode
          </div>
        </div>

        <p style="color: var(--text-secondary); font-size: 0.88rem; line-height: 1.5; margin-bottom: 20px;">
          Toggle between the high-contrast Cybersecurity Cyber Dark theme and the modern Corporate Steel Light mode.
        </p>

        <div style="display: flex; gap: 16px; margin-bottom: 24px;">
          <div 
            onclick="window.setThemeMode('dark')" 
            style="flex: 1; padding: 18px; border: 2px solid ${isDark ? 'var(--cyan-primary)' : 'var(--border-subtle)'}; background: #06090e; border-radius: var(--radius-md); cursor: pointer; text-align: center;"
          >
            <div style="font-size: 1.6rem; margin-bottom: 6px;">🌙</div>
            <strong style="color: #f8fafc; font-size: 0.95rem;">Cyber Dark</strong>
            <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 4px;">Neon Cyan & Grid</div>
          </div>

          <div 
            onclick="window.setThemeMode('light')" 
            style="flex: 1; padding: 18px; border: 2px solid ${!isDark ? 'var(--cyan-primary)' : 'var(--border-subtle)'}; background: #ffffff; border-radius: var(--radius-md); cursor: pointer; text-align: center;"
          >
            <div style="font-size: 1.6rem; margin-bottom: 6px;">☀️</div>
            <strong style="color: #0f172a; font-size: 0.95rem;">Corporate Light</strong>
            <div style="font-size: 0.75rem; color: #64748b; margin-top: 4px;">Steel Crisp Slate</div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid-two-equal" style="margin-top: 24px;">
      <!-- 3. Two-Factor Authentication -->
      <div class="cyber-card">
        <div class="cyber-card-header">
          <div class="cyber-card-title">
            <span>🔐</span> Multi-Factor Authentication (MFA)
          </div>
          <span class="badge ${user && user.mfaEnabled ? 'badge-safe' : 'badge-medium'}" id="mfa-status-badge">
            ${user && user.mfaEnabled ? 'ACTIVE' : 'DISABLED'}
          </span>
        </div>

        <p style="color: var(--text-secondary); font-size: 0.88rem; line-height: 1.5; margin-bottom: 16px;">
          Enforce time-based one-time password (TOTP) verification via Google Authenticator or YubiKey for all session logins.
        </p>

        <div style="display: flex; gap: 12px; align-items: center;">
          <button class="btn ${user && user.mfaEnabled ? 'btn-secondary' : 'btn-primary'} btn-sm" onclick="window.toggleMfaAction()">
            ${user && user.mfaEnabled ? 'Disable Two-Factor Authentication' : 'Enable Two-Factor Authentication'}
          </button>
        </div>
      </div>

      <!-- 4. Change Security Password -->
      <div class="cyber-card">
        <div class="cyber-card-header">
          <div class="cyber-card-title">
            <span>🛡️</span> Rotate Security Password
          </div>
        </div>

        ${user ? `
          <form id="change-pass-form" onsubmit="window.handleChangePassword(event)">
            <div class="form-group">
              <label class="form-label" for="curr-pass">Current Password</label>
              <input type="password" id="curr-pass" class="form-input" required />
            </div>

            <div class="form-group">
              <label class="form-label" for="new-pass">New Security Password</label>
              <input type="password" id="new-pass" class="form-input" placeholder="8+ chars with uppercase, number" required />
            </div>

            <button type="submit" class="btn btn-secondary btn-sm" id="change-pass-btn">
              Update Password Hash
            </button>
          </form>
        ` : `
          <p style="color: var(--text-secondary); font-size: 0.88rem;">Please sign in to change password.</p>
        `}
      </div>

      <!-- 5. Supabase Cloud Database Status -->
      <div class="cyber-card" style="grid-column: 1 / -1;">
        <div class="cyber-card-header">
          <div class="cyber-card-title">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--cyan-primary)" stroke-width="2">
              <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
              <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
              <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
            </svg>
            <span>Supabase Cloud Database & Storage Engine</span>
          </div>
          <span class="badge badge-safe" id="settings-db-mode-badge">Enterprise Enclave</span>
        </div>

        <p style="color: var(--text-secondary); font-size: 0.88rem; line-height: 1.6; margin-bottom: 16px;">
          PhishShield AI features high-availability Supabase PostgreSQL cloud integration with automated write-through replication, telemetry persistence, and dual-mode offline resilience.
        </p>

        <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
          <button class="btn btn-primary btn-sm" onclick="window.testSupabaseFromSettings(this)">
            ⚡ Test Supabase Connection
          </button>
          ${user && user.role === 'admin' ? `
            <button class="btn btn-secondary btn-sm" onclick="window.router.navigate('#admin'); setTimeout(() => window.switchAdminTab('supabase'), 100);">
              ⚙️ Manage Supabase in SOC Admin
            </button>
          ` : ''}
          <span id="settings-supabase-msg" style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--font-mono);"></span>
        </div>
      </div>
    </div>
  `;
}

function updateThresholdSlider(val) {
  const display = document.getElementById('threshold-value-display');
  const badge = document.getElementById('threshold-mode-badge');
  if (display) display.innerText = val;
  if (badge) {
    if (val < 0.55) {
      badge.innerText = 'Aggressive Mode';
      badge.className = 'badge badge-high';
    } else if (val > 0.75) {
      badge.innerText = 'Conservative Mode';
      badge.className = 'badge badge-safe';
    } else {
      badge.innerText = 'Balanced Mode';
      badge.className = 'badge badge-low';
    }
  }
}

function saveSensitivityThreshold() {
  const val = document.getElementById('ml-threshold-slider').value;
  localStorage.setItem('phishshield_ml_threshold', val);
  window.showToast(`Machine Learning threshold calibrated to ${val}`, 'success');
}

function setThemeMode(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('phishshield_theme', theme);
  const icon = document.getElementById('theme-icon');
  if (icon) icon.innerText = theme === 'light' ? '☀️' : '🌙';
  window.router.renderCurrentView();
}

async function toggleMfaAction() {
  if (!window.api.isAuthenticated()) {
    window.showToast('Please sign in first.', 'info');
    return;
  }

  try {
    const res = await window.api.toggleMfa();
    const user = window.api.getCurrentUser();
    if (user) {
      user.mfaEnabled = res.mfaEnabled;
      window.api.setCurrentUser(user);
    }
    window.showToast(res.message, 'success');
    window.router.renderCurrentView();
  } catch (e) {
    window.showToast(e.message, 'error');
  }
}

async function handleChangePassword(event) {
  event.preventDefault();
  const currentPassword = document.getElementById('curr-pass').value;
  const newPassword = document.getElementById('new-pass').value;
  const btn = document.getElementById('change-pass-btn');

  btn.disabled = true;
  try {
    await window.api.changePassword(currentPassword, newPassword);
    window.showToast('Password updated successfully!', 'success');
    document.getElementById('change-pass-form').reset();
  } catch (err) {
    window.showToast(err.message, 'error');
  } finally {
    btn.disabled = false;
  }
}

async function testSupabaseFromSettings(btn) {
  const msg = document.getElementById('settings-supabase-msg');
  if (btn) {
    btn.disabled = true;
    btn.innerText = 'Testing...';
  }
  if (msg) msg.innerText = 'Connecting...';

  try {
    const res = await window.api.testSupabaseConnection();
    if (res.connected) {
      if (msg) msg.innerHTML = `<span style="color: var(--risk-safe);">🟢 Connected (${res.latencyMs}ms)</span>`;
      window.showToast('Supabase database ping successful!', 'success');
    } else {
      if (msg) msg.innerHTML = `<span style="color: var(--risk-medium);">🟡 ${res.message}</span>`;
      window.showToast('Supabase check completed (Local Standby Mode active)', 'info');
    }
  } catch (err) {
    if (msg) msg.innerHTML = `<span style="color: var(--risk-critical);">❌ ${err.message}</span>`;
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerText = '⚡ Test Supabase Connection';
    }
  }
}

window.renderSettingsView = renderSettingsView;
window.updateThresholdSlider = updateThresholdSlider;
window.saveSensitivityThreshold = saveSensitivityThreshold;
window.setThemeMode = setThemeMode;
window.toggleMfaAction = toggleMfaAction;
window.handleChangePassword = handleChangePassword;
window.testSupabaseFromSettings = testSupabaseFromSettings;
