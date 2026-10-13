/**
 * PhishShield AI - Registration View
 */

function renderRegisterView() {
  return `
    <div style="max-width: 520px; margin: 40px auto; padding: 0 10px;">
      <div class="cyber-card" style="padding: 36px 32px; border-color: var(--border-cyber); box-shadow: 0 0 35px rgba(0, 242, 254, 0.15);">
        <div style="text-align: center; margin-bottom: 26px;">
          <div class="brand-icon" style="width: 48px; height: 48px; margin: 0 auto 14px; font-size: 1.4rem;">
            ⚡
          </div>
          <h1 style="font-size: 1.6rem; font-weight: 700; color: var(--text-primary); margin-bottom: 6px;">
            Create Analyst Account
          </h1>
          <p style="font-size: 0.88rem; color: var(--text-secondary);">
            Join the PhishShield AI threat detection network
          </p>
        </div>

        <form id="register-form" onsubmit="window.handleRegisterForm(event)">
          <div class="form-group">
            <label class="form-label" for="reg-name">Full Legal / Analyst Name</label>
            <input type="text" id="reg-name" class="form-input" placeholder="e.g. Jordan Reed" required />
          </div>

          <div class="form-group">
            <label class="form-label" for="reg-email">Work Email Address</label>
            <input type="email" id="reg-email" class="form-input" placeholder="e.g. j.reed@secops.io" required />
          </div>

          <div class="form-group">
            <label class="form-label" for="reg-org">Organization / Department</label>
            <input type="text" id="reg-org" class="form-input" placeholder="e.g. Cyber Threat Defense Lab" required />
          </div>

          <div class="form-group">
            <label class="form-label" for="reg-password">Security Password</label>
            <input 
              type="password" 
              id="reg-password" 
              class="form-input" 
              placeholder="Minimum 8 characters" 
              required 
              oninput="window.evaluatePasswordStrength(this.value)"
            />
            
            <!-- Live Password Strength Meter -->
            <div class="password-strength-container">
              <div class="strength-meter-bar">
                <div id="password-strength-fill" class="strength-fill"></div>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span id="password-strength-label" class="strength-text" style="color: var(--text-muted);">
                  Entropy: None
                </span>
                <span style="font-size: 0.72rem; color: var(--text-muted);">
                  8+ chars • Uppercase • Number
                </span>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="reg-confirm">Confirm Password</label>
            <input type="password" id="reg-confirm" class="form-input" placeholder="Re-enter password" required />
          </div>

          <button type="submit" class="btn btn-primary" id="reg-submit-btn" style="width: 100%; padding: 12px; margin-top: 10px;">
            <span>Create Account</span>
          </button>
        </form>

        <div style="text-align: center; margin-top: 24px; font-size: 0.88rem; color: var(--text-secondary);">
          Already registered? 
          <a href="#login" style="color: var(--cyan-primary); text-decoration: none; font-weight: 600;">Sign In</a>
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
  if (val.length >= 8) score++;
  if (val.length >= 12) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;

  if (score <= 2) {
    fill.style.width = '25%';
    fill.style.background = 'var(--risk-critical)';
    label.innerText = 'Strength: Weak';
    label.style.color = 'var(--risk-critical)';
  } else if (score === 3) {
    fill.style.width = '50%';
    fill.style.background = 'var(--risk-medium)';
    label.innerText = 'Strength: Fair';
    label.style.color = 'var(--risk-medium)';
  } else if (score === 4) {
    fill.style.width = '75%';
    fill.style.background = 'var(--risk-low)';
    label.innerText = 'Strength: Good';
    label.style.color = 'var(--risk-low)';
  } else {
    fill.style.width = '100%';
    fill.style.background = 'var(--risk-safe)';
    label.innerText = 'Strength: Strong (Enterprise Grade)';
    label.style.color = 'var(--risk-safe)';
  }
}

async function handleRegisterForm(event) {
  event.preventDefault();
  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const org = document.getElementById('reg-org').value.trim();
  const password = document.getElementById('reg-password').value;
  const confirm = document.getElementById('reg-confirm').value;
  const btn = document.getElementById('reg-submit-btn');

  if (password !== confirm) {
    window.showToast('Password confirmation does not match.', 'error');
    return;
  }

  btn.disabled = true;
  btn.innerHTML = `<span class="spinner"></span> Creating Account...`;

  try {
    const res = await window.api.register({
      name,
      email,
      organization: org,
      password
    });
    window.showToast(`Welcome to PhishShield AI, ${res.user.name}!`, 'success');
    window.updateNavState();
    window.router.navigate('#dashboard');
  } catch (err) {
    window.showToast(err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = `<span>Create Account</span>`;
  }
}

window.renderRegisterView = renderRegisterView;
window.evaluatePasswordStrength = evaluatePasswordStrength;
window.handleRegisterForm = handleRegisterForm;
