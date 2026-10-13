/**
 * PhishShield AI - Sign In / Authentication View
 * Enhanced with Forgot Password modal flow and Email Verification
 */

function renderLoginView() {
  return `
    <div style="max-width: 480px; margin: 40px auto; padding: 0 10px;">
      <div class="cyber-card" style="padding: 36px 32px; border-color: var(--border-cyber); box-shadow: 0 0 35px rgba(0, 242, 254, 0.15);">
        <!-- Logo & Header -->
        <div style="text-align: center; margin-bottom: 28px;">
          <div class="brand-icon" style="width: 48px; height: 48px; margin: 0 auto 14px; font-size: 1.4rem;">
            🛡️
          </div>
          <h1 style="font-size: 1.6rem; font-weight: 700; color: var(--text-primary); margin-bottom: 6px;">
            Security Analyst Portal
          </h1>
          <p style="font-size: 0.88rem; color: var(--text-secondary);">
            Authenticate to access intelligence reports and SOC tools
          </p>
        </div>

        <!-- Quick 1-Click Demo Login Bar -->
        <div style="background: rgba(0, 242, 254, 0.05); border: 1px dashed var(--border-cyber); border-radius: var(--radius-md); padding: 14px; margin-bottom: 24px;">
          <div style="font-size: 0.75rem; font-weight: 700; color: var(--cyan-primary); text-transform: uppercase; margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
            <span>⚡</span> One-Click Demo Credentials (Capstone Evaluators)
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <button type="button" class="btn btn-secondary btn-sm" onclick="window.fillDemoLogin('admin@phishshield.ai', 'AdminPass123!@#')" style="justify-content: flex-start; text-align: left;">
              🛡️ <strong>Admin</strong> (Threat Intel Officer • Full Access)
            </button>
            <button type="button" class="btn btn-secondary btn-sm" onclick="window.fillDemoLogin('analyst@phishshield.ai', 'AnalystPass123!')" style="justify-content: flex-start; text-align: left;">
              🔬 <strong>Analyst</strong> (SOC L2 Security Specialist)
            </button>
            <button type="button" class="btn btn-secondary btn-sm" onclick="window.fillDemoLogin('user@phishshield.ai', 'UserPass123!')" style="justify-content: flex-start; text-align: left;">
              👤 <strong>Auditor</strong> (Standard Enterprise User)
            </button>
          </div>
        </div>

        <!-- Login Form -->
        <form id="login-form" onsubmit="window.handleLoginForm(event)">
          <div class="form-group">
            <label class="form-label" for="login-email">Corporate Email Address</label>
            <input 
              type="email" 
              id="login-email" 
              class="form-input" 
              placeholder="e.g. analyst@phishshield.ai" 
              required 
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="login-password">
              <span>Security Password</span>
              <a href="javascript:void(0)" onclick="window.openForgotPasswordModal()" style="font-size: 0.78rem; color: var(--cyan-primary); text-decoration: none;">Forgot Password?</a>
            </label>
            <input 
              type="password" 
              id="login-password" 
              class="form-input" 
              placeholder="••••••••••••" 
              required 
            />
          </div>

          <!-- Remember Me Checkbox -->
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
            <input type="checkbox" id="login-remember" style="accent-color: var(--cyan-primary); cursor: pointer;" />
            <label for="login-remember" style="font-size: 0.85rem; color: var(--text-secondary); cursor: pointer;">Remember this session</label>
          </div>

          <button type="submit" class="btn btn-primary" id="login-submit-btn" style="width: 100%; padding: 12px; margin-top: 8px;">
            <span>Authenticate Session</span>
          </button>
        </form>

        <!-- Divider -->
        <div style="display: flex; align-items: center; gap: 12px; margin: 24px 0 20px;">
          <div style="flex: 1; height: 1px; background: var(--border-subtle);"></div>
          <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em;">or</span>
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
  event.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const btn = document.getElementById('login-submit-btn');

  btn.disabled = true;
  btn.innerHTML = `<span class="spinner"></span> Verifying Credentials...`;

  try {
    const res = await window.api.login(email, password);
    window.showToast(`Welcome back, ${res.user.name}!`, 'success');
    window.updateNavState();
    window.router.navigate(res.user.role === 'admin' ? '#admin' : '#dashboard');
  } catch (err) {
    window.showToast(err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = `<span>Authenticate Session</span>`;
  }
}

// ═══ FORGOT PASSWORD MODAL FLOW ═══
function openForgotPasswordModal() {
  const html = `
    <div id="forgot-password-container">
      <!-- Step 1: Email Input -->
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

        <form onsubmit="window.handleForgotPasswordSubmit(event)">
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

      <!-- Step 2: Confirmation (Hidden initially) -->
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
          The link expires in <strong>15 minutes</strong>. Check your spam/junk folder if you don't see it within 2 minutes.
        </p>

        <div style="display: flex; gap: 10px; justify-content: center;">
          <button class="btn btn-secondary btn-sm" onclick="window.showForgotStep1()">
            Resend Email
          </button>
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
  event.preventDefault();
  const email = document.getElementById('forgot-email').value.trim();
  const btn = document.getElementById('forgot-submit-btn');

  btn.disabled = true;
  btn.innerHTML = `<span class="spinner"></span> Sending Reset Link...`;

  // Simulate sending reset email
  setTimeout(() => {
    document.getElementById('forgot-step-1').style.display = 'none';
    document.getElementById('forgot-step-2').style.display = 'block';
    document.getElementById('forgot-email-display').innerText = email;
    window.showToast(`Password reset link sent to ${email}`, 'success');
    btn.disabled = false;
    btn.innerHTML = `<span>Send Password Reset Link</span>`;
  }, 1500);
}

function showForgotStep1() {
  document.getElementById('forgot-step-1').style.display = 'block';
  document.getElementById('forgot-step-2').style.display = 'none';
}

window.renderLoginView = renderLoginView;
window.fillDemoLogin = fillDemoLogin;
window.handleLoginForm = handleLoginForm;
window.openForgotPasswordModal = openForgotPasswordModal;
window.handleForgotPasswordSubmit = handleForgotPasswordSubmit;
window.showForgotStep1 = showForgotStep1;
