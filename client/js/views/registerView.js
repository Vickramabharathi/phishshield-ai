/**
 * PhishShield AI - Registration View
 * Clean layout, novalidate (no hidden browser blocking), 1-click test auto-fill, and rich success screen
 */

function renderRegisterView() {
  return `
    <div style="max-width: 520px; margin: 20px auto; padding: 0 12px;">
      <div class="cyber-card" id="register-card" style="padding: 26px 24px; border-color: var(--border-cyber); box-shadow: 0 0 35px rgba(0, 242, 254, 0.15);">
        
        <!-- Registration Form Container -->
        <div id="register-form-container">
          <div style="text-align: center; margin-bottom: 16px;">
            <div class="brand-icon" style="width: 44px; height: 44px; margin: 0 auto 10px; font-size: 1.35rem;">
              ⚡
            </div>
            <h1 style="font-size: 1.5rem; font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">
              Create Analyst Account
            </h1>
            <p style="font-size: 0.85rem; color: var(--text-secondary);">
              Join the PhishShield AI Threat Detection Network
            </p>
          </div>

          <!-- Quick 1-Click Auto Fill Demo Button -->
          <div style="background: rgba(0, 242, 254, 0.05); border: 1px dashed var(--border-cyber); border-radius: var(--radius-md); padding: 10px 14px; margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between; gap: 8px;">
            <div style="font-size: 0.78rem; color: var(--cyan-primary); font-weight: 600;">
              ⚡ Quick Testing Helper
            </div>
            <button type="button" id="reg-autofill-btn" class="btn btn-secondary btn-sm" onclick="window.autoFillNewAnalyst()" style="font-size: 0.78rem; padding: 6px 12px; background: rgba(0, 242, 254, 0.1); border-color: var(--border-cyber);">
              🎲 Auto-Fill Account
            </button>
          </div>

          <!-- Inline Error Box -->
          <div id="reg-error-box" style="display: none; background: rgba(239, 68, 68, 0.12); border: 1px solid var(--risk-critical); border-radius: var(--radius-md); padding: 10px 14px; margin-bottom: 14px; color: var(--risk-critical); font-size: 0.85rem; align-items: center; gap: 8px;">
            <span>⚠️</span>
            <span id="reg-error-msg"></span>
          </div>

          <!-- novalidate and type=button ensures no browser interception or page reload -->
          <form id="register-form" novalidate onsubmit="event.preventDefault(); window.handleRegisterForm(event); return false;">
            <div class="form-group" style="margin-bottom: 12px;">
              <label class="form-label" for="reg-name">Full Name / Analyst Name</label>
              <input type="text" id="reg-name" class="form-input" placeholder="e.g. Jordan Reed" />
            </div>

            <div class="form-group" style="margin-bottom: 12px;">
              <label class="form-label" for="reg-email">Work Email Address</label>
              <input type="email" id="reg-email" class="form-input" placeholder="e.g. j.reed@secops.io" />
            </div>

            <div class="form-group" style="margin-bottom: 12px;">
              <label class="form-label" for="reg-org">Organization (Optional)</label>
              <input type="text" id="reg-org" class="form-input" placeholder="e.g. Cyber Threat Defense Lab" />
            </div>

            <div class="form-group" style="margin-bottom: 12px;">
              <label class="form-label" for="reg-password">Security Password</label>
              <input 
                type="password" 
                id="reg-password" 
                class="form-input" 
                placeholder="Minimum 6 characters" 
                oninput="window.evaluatePasswordStrength(this.value)"
              />
              
              <!-- Live Password Strength Meter -->
              <div class="password-strength-container" style="margin-top: 6px;">
                <div class="strength-meter-bar">
                  <div id="password-strength-fill" class="strength-fill" style="width: 0%;"></div>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 3px;">
                  <span id="password-strength-label" class="strength-text" style="color: var(--text-muted); font-size: 0.72rem;">
                    Entropy: None
                  </span>
                  <span style="font-size: 0.7rem; color: var(--text-muted);">
                    Min 6 chars
                  </span>
                </div>
              </div>
            </div>

            <div class="form-group" style="margin-bottom: 14px;">
              <label class="form-label" for="reg-confirm">Confirm Password</label>
              <input type="password" id="reg-confirm" class="form-input" placeholder="Re-enter password" />
            </div>

            <button type="button" class="btn btn-primary" id="reg-submit-btn" onclick="window.handleRegisterForm(event)" style="width: 100%; padding: 12px; margin-top: 4px; font-weight: 600; font-size: 0.95rem;">
              <span>Create Account</span>
            </button>
          </form>

          <div style="text-align: center; margin-top: 18px; font-size: 0.85rem; color: var(--text-secondary);">
            Already registered? 
            <a href="#login" style="color: var(--cyan-primary); text-decoration: none; font-weight: 600;">Sign In</a>
          </div>
        </div>

        <!-- Success Indicator Container (Shown upon successful account creation) -->
        <div id="register-success-container" style="display: none; text-align: center; padding: 10px 0;">
          <div style="width: 68px; height: 68px; border-radius: 50%; background: rgba(16, 185, 129, 0.15); border: 2px solid var(--risk-safe); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 2rem; box-shadow: 0 0 25px rgba(16, 185, 129, 0.3);">
            ✓
          </div>
          
          <span class="badge badge-safe" style="font-size: 0.8rem; padding: 4px 12px; margin-bottom: 10px; display: inline-block;">
            REGISTRATION COMPLETE
          </span>

          <h2 style="font-size: 1.55rem; font-weight: 700; color: var(--text-primary); margin-bottom: 6px;">
            Account Successfully Created!
          </h2>

          <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 18px;" id="reg-success-welcome-msg">
            Welcome to PhishShield AI Threat Intel Network.
          </p>

          <!-- Account Details Box -->
          <div style="background: var(--bg-primary); border: 1px solid var(--border-cyber); border-radius: var(--radius-md); padding: 14px; margin-bottom: 20px; text-align: left; font-size: 0.85rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <span style="color: var(--text-muted);">Analyst Name:</span>
              <strong style="color: var(--text-primary);" id="reg-success-name">--</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <span style="color: var(--text-muted);">Email Address:</span>
              <span style="font-family: var(--font-mono); color: var(--cyan-primary);" id="reg-success-email">--</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <span style="color: var(--text-muted);">Assigned Role:</span>
              <span class="badge badge-safe">Security Analyst</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: var(--text-muted);">Session Status:</span>
              <span style="color: var(--risk-safe); font-weight: 600;">Authenticated & Active</span>
            </div>
          </div>

          <!-- Countdown and Go Inside Button -->
          <div style="margin-bottom: 10px;">
            <div style="font-size: 0.82rem; color: var(--cyan-primary); font-weight: 500; margin-bottom: 10px; display: flex; align-items: center; justify-content: center; gap: 8px;">
              <span class="spinner" style="width: 14px; height: 14px; border-width: 2px;"></span>
              <span>Entering Analyst Dashboard automatically...</span>
            </div>

            <button type="button" class="btn btn-primary" onclick="window.enterDashboardNow()" style="width: 100%; padding: 12px; font-weight: 700; font-size: 0.95rem; box-shadow: 0 0 20px rgba(0, 242, 254, 0.3);">
              🚀 Go Inside to Dashboard Now
            </button>
          </div>
        </div>

      </div>
    </div>
  `;
}

function evaluatePasswordStrength(val) {
  const fill = document.getElementById('password-strength-fill');
  const label = document.getElementById('password-strength-label');
  if (!fill || !label) return;

  if (!val) {
    fill.style.width = '0%';
    label.innerText = 'Entropy: None';
    label.style.color = 'var(--text-muted)';
    return;
  }

  let score = 0;
  if (val.length >= 6) score++;
  if (val.length >= 10) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;

  if (score <= 1) {
    fill.style.width = '25%';
    fill.style.background = 'var(--risk-critical)';
    label.innerText = 'Strength: Weak';
    label.style.color = 'var(--risk-critical)';
  } else if (score === 2) {
    fill.style.width = '50%';
    fill.style.background = 'var(--risk-medium)';
    label.innerText = 'Strength: Fair';
    label.style.color = 'var(--risk-medium)';
  } else if (score >= 3 && score <= 4) {
    fill.style.width = '75%';
    fill.style.background = 'var(--risk-low)';
    label.innerText = 'Strength: Good';
    label.style.color = 'var(--risk-low)';
  } else {
    fill.style.width = '100%';
    fill.style.background = 'var(--risk-safe)';
    label.innerText = 'Strength: Strong';
    label.style.color = 'var(--risk-safe)';
  }
}

function autoFillNewAnalyst() {
  const rand = Math.floor(1000 + Math.random() * 9000);
  const nameInput = document.getElementById('reg-name');
  const emailInput = document.getElementById('reg-email');
  const orgInput = document.getElementById('reg-org');
  const passInput = document.getElementById('reg-password');
  const confirmInput = document.getElementById('reg-confirm');

  if (nameInput) nameInput.value = `Analyst Jordan ${rand}`;
  if (emailInput) emailInput.value = `analyst_${rand}@secops.io`;
  if (orgInput) orgInput.value = 'Cyber Threat Defense Lab';
  if (passInput) {
    passInput.value = 'SecurePass123!';
    evaluatePasswordStrength('SecurePass123!');
  }
  if (confirmInput) confirmInput.value = 'SecurePass123!';

  hideRegError();
  window.showToast(`Populated unique credentials for Analyst Jordan ${rand}`, 'info');
}

let redirectTimer = null;

async function handleRegisterForm(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  const nameInput = document.getElementById('reg-name');
  const emailInput = document.getElementById('reg-email');
  const orgInput = document.getElementById('reg-org');
  const passInput = document.getElementById('reg-password');
  const confirmInput = document.getElementById('reg-confirm');

  const name = nameInput ? nameInput.value.trim() : '';
  const email = emailInput ? emailInput.value.trim() : '';
  const org = (orgInput && orgInput.value.trim()) || 'Cyber Threat Defense Lab';
  const password = passInput ? passInput.value : '';
  const confirm = confirmInput ? confirmInput.value : '';
  const btn = document.getElementById('reg-submit-btn');

  hideRegError();

  // Visible, clean JavaScript validation
  if (!name || name.length < 2) {
    showRegError('Please enter your full name (at least 2 characters).');
    if (nameInput) nameInput.focus();
    return;
  }

  if (!email || !email.includes('@') || !email.includes('.')) {
    showRegError('Please provide a valid corporate email address.');
    if (emailInput) emailInput.focus();
    return;
  }

  if (!password || password.length < 6) {
    showRegError('Password must be at least 6 characters long.');
    if (passInput) passInput.focus();
    return;
  }

  if (password !== confirm) {
    showRegError('Password confirmation does not match.');
    if (confirmInput) confirmInput.focus();
    return;
  }

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner"></span> Creating Account...`;
  }

  try {
    const res = await window.api.register({
      name,
      email,
      organization: org,
      password
    });

    // Update global navigation immediately
    window.updateNavState();
    window.showToast(`Account created for ${res.user.name}!`, 'success');

    // Display rich Success Indicator
    displayRegistrationSuccess(res.user);

  } catch (err) {
    showRegError(err.message || 'Registration failed. Please check your details.');
    window.showToast(err.message, 'error');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<span>Create Account</span>`;
    }
  }
}

function showRegError(msg) {
  const errorBox = document.getElementById('reg-error-box');
  const errorMsg = document.getElementById('reg-error-msg');
  if (errorBox && errorMsg) {
    errorMsg.innerText = msg;
    errorBox.style.display = 'flex';
  }
}

function hideRegError() {
  const errorBox = document.getElementById('reg-error-box');
  if (errorBox) errorBox.style.display = 'none';
}

function displayRegistrationSuccess(user) {
  const formContainer = document.getElementById('register-form-container');
  const successContainer = document.getElementById('register-success-container');
  const nameEl = document.getElementById('reg-success-name');
  const emailEl = document.getElementById('reg-success-email');
  const welcomeEl = document.getElementById('reg-success-welcome-msg');

  if (formContainer) formContainer.style.display = 'none';
  if (successContainer) successContainer.style.display = 'block';

  if (nameEl) nameEl.innerText = user.name || 'Security Analyst';
  if (emailEl) emailEl.innerText = user.email || '';
  if (welcomeEl) welcomeEl.innerText = `Welcome to PhishShield AI Threat Intel Network, ${user.name}! Your security profile and session have been authenticated.`;

  // Automatically enter dashboard after 1.2s
  redirectTimer = setTimeout(() => {
    enterDashboardNow();
  }, 1200);
}

function enterDashboardNow() {
  if (redirectTimer) clearTimeout(redirectTimer);
  window.updateNavState();
  window.router.navigate('#dashboard');
}

window.renderRegisterView = renderRegisterView;
window.evaluatePasswordStrength = evaluatePasswordStrength;
window.autoFillNewAnalyst = autoFillNewAnalyst;
window.handleRegisterForm = handleRegisterForm;
window.enterDashboardNow = enterDashboardNow;
