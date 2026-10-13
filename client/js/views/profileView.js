/**
 * PhishShield AI - User Profile & API Key View
 */

function renderProfileView() {
  const user = window.api.getCurrentUser();

  if (!user) {
    return `
      <div style="text-align: center; padding: 60px 20px;">
        <h2 style="font-size: 1.5rem; margin-bottom: 12px; color: var(--text-primary);">Authentication Required</h2>
        <p style="color: var(--text-secondary); margin-bottom: 20px;">Please sign in to inspect your user profile and API credentials.</p>
        <a href="#login" class="btn btn-primary">Sign In</a>
      </div>
    `;
  }

  return `
    <div class="view-header">
      <div class="view-title-group">
        <h1 class="view-title">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--cyan-primary)" stroke-width="2.5">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          Analyst Profile & Security Credentials
        </h1>
        <span class="badge ${user.role === 'admin' ? 'badge-critical' : user.role === 'analyst' ? 'badge-high' : 'badge-safe'}">
          Role: ${user.role}
        </span>
      </div>
      <p class="view-subtitle">
        Manage your threat intelligence credentials, generate automated scanning API keys, and review security activities.
      </p>
    </div>

    <div class="grid-two-equal">
      <!-- Profile Information Card -->
      <div class="cyber-card">
        <div class="cyber-card-header">
          <div class="cyber-card-title">
            <span>👤</span> Account Details
          </div>
        </div>

        <form id="profile-edit-form" onsubmit="window.handleProfileUpdate(event)">
          <div class="form-group">
            <label class="form-label" for="profile-name">Analyst Name</label>
            <input type="text" id="profile-name" class="form-input" value="${user.name}" required />
          </div>

          <div class="form-group">
            <label class="form-label" for="profile-email">Email (Immutable Identity)</label>
            <input type="email" id="profile-email" class="form-input" value="${user.email}" disabled style="opacity: 0.7;" />
          </div>

          <div class="form-group">
            <label class="form-label" for="profile-org">Organization / SecOps Team</label>
            <input type="text" id="profile-org" class="form-input" value="${user.organization || 'PhishShield Labs'}" required />
          </div>

          <button type="submit" class="btn btn-primary btn-sm" id="profile-update-btn">
            Save Profile Updates
          </button>
        </form>
      </div>

      <!-- Developer API Key Manager -->
      <div class="cyber-card">
        <div class="cyber-card-header">
          <div class="cyber-card-title">
            <span>🔑</span> Developer API Key (SIEM / CLI)
          </div>
          <span class="badge badge-low">REST v1</span>
        </div>

        <p style="color: var(--text-secondary); font-size: 0.88rem; line-height: 1.5; margin-bottom: 16px;">
          Use this cryptographic secret key to authenticate automated headless scanning through Python SDK, cURL, or enterprise SIEM pipelines.
        </p>

        <div style="background: var(--bg-primary); border: 1px solid var(--border-subtle); padding: 12px 16px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 16px;">
          <code id="api-key-display" style="font-family: var(--font-mono); font-size: 0.88rem; color: var(--cyan-primary); word-break: break-all;">
            ${user.apiKey || 'ps_live_************************'}
          </code>
          <button class="btn btn-secondary btn-sm" onclick="window.copyApiKey()" title="Copy Key">
            📋 Copy
          </button>
        </div>

        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <button class="btn btn-danger btn-sm" onclick="window.regenerateApiKeyAction()">
            🔄 Regenerate Secret Key
          </button>
        </div>

        <!-- Sample curl snippet -->
        <div style="margin-top: 20px;">
          <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 6px; font-family: var(--font-mono);">
            cURL Integration Example:
          </div>
          <pre style="background: var(--bg-primary); padding: 12px; border-radius: var(--radius-sm); font-family: var(--font-mono); font-size: 0.78rem; color: var(--text-secondary); overflow-x: auto;">curl -X POST https://phishshield.ai/api/scans/analyze \\
  -H "Authorization: Bearer ${user.apiKey || 'YOUR_API_KEY'}" \\
  -H "Content-Type: application/json" \\
  -d '{"url":"https://suspicious-target.com"}'</pre>
        </div>
      </div>
    </div>
  `;
}

async function handleProfileUpdate(event) {
  event.preventDefault();
  const name = document.getElementById('profile-name').value.trim();
  const org = document.getElementById('profile-org').value.trim();
  const btn = document.getElementById('profile-update-btn');

  btn.disabled = true;
  try {
    const res = await window.api.updateProfile({ name, organization: org });
    window.showToast('Profile updated successfully!', 'success');
    window.updateNavState();
  } catch (err) {
    window.showToast(err.message, 'error');
  } finally {
    btn.disabled = false;
  }
}

function copyApiKey() {
  const user = window.api.getCurrentUser();
  if (user && user.apiKey) {
    navigator.clipboard.writeText(user.apiKey).then(() => {
      window.showToast('API key copied to clipboard!', 'info');
    });
  }
}

async function regenerateApiKeyAction() {
  if (!confirm('Warning: Rolling this API key will invalidate any active automated integrations. Proceed?')) return;

  try {
    const res = await window.api.generateApiKey();
    const user = window.api.getCurrentUser();
    if (user) {
      user.apiKey = res.apiKey;
      window.api.setCurrentUser(user);
    }
    const display = document.getElementById('api-key-display');
    if (display) display.innerText = res.apiKey;
    window.showToast('New API key generated successfully!', 'success');
  } catch (err) {
    window.showToast(err.message, 'error');
  }
}

window.renderProfileView = renderProfileView;
window.handleProfileUpdate = handleProfileUpdate;
window.copyApiKey = copyApiKey;
window.regenerateApiKeyAction = regenerateApiKeyAction;
