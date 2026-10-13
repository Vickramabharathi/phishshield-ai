/**
 * PhishShield AI - Sign In / Authentication View
 * Enhanced with 1-Click Instant Sign-In, Inline Error Alerts, and Smooth Transitions
 */

function renderLoginView() {
  return `
    <div style="max-width: 480px; margin: 24px auto; padding: 0 12px;">
      <div class="cyber-card" style="padding: 28px 24px; border-color: var(--border-cyber); box-shadow: 0 0 35px rgba(0, 242, 254, 0.15);">
        <!-- Logo & Header -->
        <div style="text-align: center; margin-bottom: 20px;">
          <div class="brand-icon" style="width: 46px; height: 46px; margin: 0 auto 12px; font-size: 1.35rem;">
            🛡️
          </div>
          <h1 style="font-size: 1.55rem; font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">
            Security Analyst Portal
          </h1>
          <p style="font-size: 0.85rem; color: var(--text-secondary);">
            Authenticate to access intelligence reports and SOC tools
          </p>
        </div>

        <!-- Quick 1-Click Instant Login Bar -->
        <div style="background: rgba(0, 242, 254, 0.05); border: 1px dashed var(--border-cyber); border-radius: var(--radius-md); padding: 12px; margin-bottom: 20px;">
          <div style="font-size: 0.75rem; font-weight: 700; color: var(--cyan-primary); text-transform: uppercase; margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between;">
            <span>⚡ Instant Demo Access (1-Click)</span>
            <span style="font-size: 0.7rem; color: var(--text-muted);">No Typing Needed</span>
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <button type="button" class="btn btn-secondary btn-sm" onclick="window.quickLoginAs('admin')" style="justify-content: space-between; text-align: left; padding: 8px 12px;">
              <span>🛡️ <strong>Admin</strong> (SOC Threat Intel Officer)</span>
              <span class="badge badge-critical" style="font-size: 0.65rem;">Login Now →</span>
            </button>
            <button type="button" class="btn btn-secondary btn-sm" onclick="window.quickLoginAs('analyst')" style="justify-content: space-between; text-align: left; padding: 8px 12px;">
              <span>🔬 <strong>Analyst</strong> (L2 Security Specialist)</span>
              <span class="badge badge-high" style="font-size: 0.65rem;">Login Now →</span>
            </button>
            <button type="button" class="btn btn-secondary btn-sm" onclick="window.quickLoginAs('user')" style="justify-content: space-between; text-align: left; padding: 8px 12px;">
              <span>👤 <strong>Auditor</strong> (Standard Enterprise User)</span>
              <span class="badge badge-safe" style="font-size: 0.65rem;">Login Now →</span>
            </button>
          </div>
        </div>

        <!-- Inline Error Box -->
        <div id="login-error-box" style="display: none; background: rgba(239, 68, 68, 0.12); border: 1px solid var(--risk-critical); border-radius: var(--radius-md); padding: 12px 14px; margin-bottom: 16px; color: var(--risk-critical); font-size: 0.88rem; align-items: center; gap: 8px;">
          <span>⚠️</span>
          <span id="login-error-msg"></span>
        </div>

        <!-- Inline Success Box -->
        <div id="login-success-box" style="display: none; background: rgba(16, 185, 129, 0.15); border: 1px solid var(--risk-safe); border-radius: var(--radius-md); padding: 12px 14px; margin-bottom: 16px; color: var(--risk-safe); font-size: 0.9rem; align-items: center; gap: 8px; font-weight: 600;">
          <span>✓</span>
          <span id="login-success-msg">Authentication Successful! Entering Dashboard...</span>
        </div>

        <!-- Login Form with novalidate and button type=button to prevent page reload -->
        <form id="login-form" novalidate onsubmit="event.preventDefault(); window.handleLoginForm(event); return false;">
          <div class="form-group" style="margin-bottom: 14px;">
            <label class="form-label" for="login-email">Corporate Email Address</label>
            <input 
              type="email" 
              id="login-email" 
              class="form-input" 
              placeholder="e.g. analyst@phishshield.ai" 
            />
          </div>

          <div class="form-group" style="margin-bottom: 14px;">
            <label class="form-label" for="login-password">
              <span>Security Password</span>
              <a href="javascript:void(0)" onclick="window.openForgotPasswordModal()" style="font-size: 0.78rem; color: var(--cyan-primary); text-decoration: none;">Forgot Password?</a>
            </label>
            <input 
              type="password" 
              id="login-password" 
              class="form-input" 
              placeholder="••••••••••••" 
            />
          </div>

          <button type="button" class="btn btn-primary" id="login-submit-btn" onclick="window.handleLoginForm(event)" style="width: 100%; padding: 12px; margin-top: 6px; font-weight: 600; font-size: 0.95rem;">
            <span>Authenticate Session</span>
          </button>
        </form>

        <!-- Divider -->
        <div style="display: flex; align-items: center; gap: 12px; margin: 20px 0 16px;">
          <div style="flex: 1; height: 1px; background: var(--border-subtle);"></div>
          <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em;">or</span>
          <div style="flex: 1; height: 1px; background: var(--border-subtle);"></div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; font-size: 0.88rem; color: var(--text-secondary);">
          Don't have an enterprise account? 
          <a href="#register" style="color: var(--cyan-primary); text-decoration: none; font-weight: 600;">Register Now</a>
        </div>
      </div>
    </div>
  `;
}

// 1-Click Instant Login Function
async function quickLoginAs(role) {
  let email, pass;
  if (role === 'admin') {
    email = 'admin@phishshield.ai';
    pass = 'AdminPass123!@#';
  } else if (role === 'analyst') {
    email = 'analyst@phishshield.ai';
    pass = 'AnalystPass123!';
  } else {
    email = 'user@phishshield.ai';
    pass = 'UserPass123!';
  }

  const emailInput = document.getElementById('login-email');
  const passInput = document.getElementById('login-password');
  if (emailInput) emailInput.value = email;
  if (passInput) passInput.value = pass;

  const btn = document.getElementById('login-submit-btn');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner"></span> Authenticating as ${role.toUpperCase()}...`;
  }

  try {
    const res = await window.api.login(email, pass);
    window.showToast(`Welcome back, ${res.user.name}!`, 'success');
    window.updateNavState();
    window.router.navigate(res.user.role === 'admin' ? '#admin' : '#dashboard');
  } catch (err) {
    showLoginError(err.message);
    window.showToast(err.message, 'error');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<span>Authenticate Session</span>`;
    }
  }
}

function fillDemoLogin(email, pass) {
  const emailInput = document.getElementById('login-email');
  const passInput = document.getElementById('login-password');
  if (emailInput && passInput) {
    emailInput.value = email;
    passInput.value = pass;
    window.showToast(`Populated credentials for ${email}`, 'info');
  }
}

async function handleLoginForm(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  const emailInput = document.getElementById('login-email');
  const passInput = document.getElementById('login-password');
  const email = (emailInput ? emailInput.value : '').trim();
  const password = passInput ? passInput.value : '';
  const btn = document.getElementById('login-submit-btn');

  hideLoginError();
  hideLoginSuccess();

  if (!email) {
    showLoginError('Please enter your corporate email address.');
    if (emailInput) emailInput.focus();
    return;
  }

  if (!password) {
    showLoginError('Please enter your security password.');
    if (passInput) passInput.focus();
    return;
  }

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner"></span> Verifying Credentials...`;
  }

  try {
    const res = await window.api.login(email, password);
    showLoginSuccess(`Login Successful! Welcome, ${res.user.name}. Loading Dashboard...`);
    window.showToast(`Welcome back, ${res.user.name}!`, 'success');
    window.updateNavState();
    setTimeout(() => {
      window.router.navigate(res.user.role === 'admin' ? '#admin' : '#dashboard');
    }, 600);
  } catch (err) {
    showLoginError(err.message || 'Invalid email or password.');
    window.showToast(err.message, 'error');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<span>Authenticate Session</span>`;
    }
  }
}

function showLoginError(msg) {
  const box = document.getElementById('login-error-box');
  const text = document.getElementById('login-error-msg');
  if (box && text) {
    text.innerText = msg;
    box.style.display = 'flex';
  }
}

function hideLoginError() {
  const box = document.getElementById('login-error-box');
  if (box) box.style.display = 'none';
}

function showLoginSuccess(msg) {
  const box = document.getElementById('login-success-box');
  const text = document.getElementById('login-success-msg');
  if (box && text) {
    text.innerText = msg;
    box.style.display = 'flex';
  }
}

function hideLoginSuccess() {
  const box = document.getElementById('login-success-box');
  if (box) box.style.display = 'none';
}

function hideLoginError() {
  const box = document.getElementById('login-error-box');
  if (box) box.style.display = 'none';
}

// ═══ FORGOT PASSWORD MODAL FLOW ═══
function openForgotPasswordModal() {
  const html = `
    <div id="forgot-password-container">
      <div id="forgot-step-1">
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="width: 56px; height: 56px; border-radius: 50%; background: rgba(0, 242, 254, 0.1); border: 2px solid var(--border-cyber); display: flex; align-items: center; justify-content: center; margin: 0 auto 14px; font-size: 1.6rem;">
            🔑
          </div>
          <h3 style="font-size: 1.35rem; color: var(--text-primary); margin-bottom: 6px;">Reset Security Password</h3>
          <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5; max-width: 400px; margin: 0 auto;">
            Enter your registered email address. We'll send a secure one-time password reset link to your corporate inbox.
          </p>
        </div>

        <form novalidate onsubmit="window.handleForgotPasswordSubmit(event)">
          <div class="form-group">
            <label class="form-label" for="forgot-email">Registered Email Address</label>
            <input type="email" id="forgot-email" class="form-input" placeholder="analyst@phishshield.ai" required />
          </div>

          <button type="submit" class="btn btn-primary" id="forgot-submit-btn" style="width: 100%; padding: 12px;">
            <span>Send Password Reset Link</span>
          </button>
        </form>

        <div style="text-align: center; margin-top: 16px;">
          <a href="javascript:void(0)" onclick="window.closeModal()" style="font-size: 0.85rem; color: var(--text-secondary); text-decoration: none;">
            ← Back to Sign In
          </a>
        </div>
      </div>

      <div id="forgot-step-2" style="display: none; text-align: center;">
        <div style="width: 64px; height: 64px; border-radius: 50%; background: rgba(16, 185, 129, 0.15); border: 2px solid var(--risk-safe); display: flex; align-items: center; justify-content: center; margin: 0 auto 18px; font-size: 1.8rem;">
          ✉️
        </div>
        <h3 style="font-size: 1.35rem; color: var(--text-primary); margin-bottom: 8px;">Reset Link Dispatched</h3>
        <p style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.6; max-width: 400px; margin: 0 auto 8px;">
          A secure password reset link has been sent to:
        </p>
        <div style="font-family: var(--font-mono); font-size: 0.95rem; color: var(--cyan-primary); padding: 10px 16px; background: var(--bg-primary); border: 1px solid var(--border-cyber); border-radius: var(--radius-md); margin: 12px 0 20px; display: inline-block;" id="forgot-email-display">
          —
        </div>
        <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 24px;">
          The link expires in <strong>15 minutes</strong>.
        </p>

        <div style="display: flex; gap: 10px; justify-content: center;">
          <button class="btn btn-primary btn-sm" onclick="window.closeModal(); window.router.navigate('#login');">
            Return to Login
          </button>
        </div>
      </div>
    </div>
  `;
  window.openModal(html);
}

function handleForgotPasswordSubmit(event) {
  if (event) event.preventDefault();
  const emailInput = document.getElementById('forgot-email');
  const email = emailInput ? emailInput.value.trim() : '';
  const btn = document.getElementById('forgot-submit-btn');

  if (!email) {
    window.showToast('Please enter an email address.', 'error');
    return;
  }

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner"></span> Sending Reset Link...`;
  }

  setTimeout(() => {
    const s1 = document.getElementById('forgot-step-1');
    const s2 = document.getElementById('forgot-step-2');
    const disp = document.getElementById('forgot-email-display');
    if (s1) s1.style.display = 'none';
    if (s2) s2.style.display = 'block';
    if (disp) disp.innerText = email;
    window.showToast(`Password reset link sent to ${email}`, 'success');
  }, 1000);
}

window.renderLoginView = renderLoginView;
window.quickLoginAs = quickLoginAs;
window.fillDemoLogin = fillDemoLogin;
window.handleLoginForm = handleLoginForm;
window.openForgotPasswordModal = openForgotPasswordModal;
window.handleForgotPasswordSubmit = handleForgotPasswordSubmit;
