/**
 * PhishShield AI - Navigation Bar Component
 */

function renderNavbar() {
  const user = window.api.getCurrentUser();
  const currentHash = window.location.hash || '#home';
  const isAdmin = user && user.role === 'admin';

  return `
    <div class="nav-container">
      <a href="#home" class="brand-logo" id="nav-brand-logo">
        <div class="brand-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <span>PhishShield<span style="color: var(--cyan-primary);">.AI</span></span>
        <span class="brand-badge">ENTERPRISE</span>
      </a>

      <nav class="nav-menu" id="nav-menu-links">
        <a href="#home" class="nav-link ${currentHash === '#home' ? 'active' : ''}" id="nav-link-home">
          <span>Home</span>
        </a>
        <a href="#scanner" class="nav-link ${currentHash === '#scanner' ? 'active' : ''}" id="nav-link-scanner">
          <span>URL Scanner</span>
        </a>
        <a href="#dashboard" class="nav-link ${currentHash === '#dashboard' ? 'active' : ''}" id="nav-link-dashboard">
          <span>Dashboard</span>
        </a>
        <a href="#history" class="nav-link ${currentHash === '#history' ? 'active' : ''}" id="nav-link-history">
          <span>Scan History</span>
        </a>
        <a href="#reports" class="nav-link ${currentHash === '#reports' ? 'active' : ''}" id="nav-link-reports">
          <span>Reports</span>
        </a>
        <a href="#about" class="nav-link ${currentHash === '#about' ? 'active' : ''}" id="nav-link-about">
          <span>About</span>
        </a>
        <a href="#contact" class="nav-link ${currentHash === '#contact' ? 'active' : ''}" id="nav-link-contact">
          <span>Contact</span>
        </a>
        ${isAdmin ? `
          <a href="#admin" class="nav-link ${currentHash === '#admin' ? 'active' : ''}" id="nav-link-admin" style="color: var(--cyan-primary);">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"/>
            </svg>
            <span>Admin Panel</span>
          </a>
        ` : ''}
      </nav>

      <div class="nav-actions">
        <!-- Theme Toggle -->
        <button id="theme-toggle-btn" class="btn btn-secondary btn-sm" title="Toggle Theme" aria-label="Toggle Theme" style="padding: 8px;">
          <span id="theme-icon">🌙</span>
        </button>

        ${user ? `
          <!-- User Profile Menu -->
          <div class="user-dropdown-container" style="position: relative;">
            <button id="user-menu-btn" class="btn btn-secondary btn-sm" style="display: flex; align-items: center; gap: 8px; border-radius: var(--radius-full);">
              <div style="width: 26px; height: 26px; border-radius: 50%; background: linear-gradient(135deg, var(--cyan-primary), var(--purple-accent)); color: #06090e; font-weight: 700; display: flex; align-items: center; justify-content: center; font-size: 0.75rem;">
                ${user.name.charAt(0).toUpperCase()}
              </div>
              <span style="font-size: 0.85rem; max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${user.name}</span>
              <span class="badge ${user.role === 'admin' ? 'badge-critical' : user.role === 'analyst' ? 'badge-high' : 'badge-safe'}" style="font-size: 0.65rem; padding: 2px 6px;">
                ${user.role}
              </span>
            </button>
            <div id="user-dropdown-menu" style="display: none; position: absolute; right: 0; top: 40px; background: var(--bg-secondary); border: 1px solid var(--border-cyber); border-radius: var(--radius-md); box-shadow: var(--shadow-lg); width: 200px; padding: 8px 0; z-index: 200;">
              <a href="#profile" class="nav-link" style="padding: 8px 16px;">👤 Profile & Keys</a>
              <a href="#settings" class="nav-link" style="padding: 8px 16px;">⚙️ Settings</a>
              ${isAdmin ? '<a href="#admin" class="nav-link" style="padding: 8px 16px; color: var(--cyan-primary);">🛡️ Admin Panel</a>' : ''}
              <hr style="border: none; border-top: 1px solid var(--border-subtle); margin: 6px 0;">
              <button id="logout-btn" style="width: 100%; text-align: left; background: none; border: none; padding: 8px 16px; color: var(--risk-critical); cursor: pointer; font-size: 0.88rem; font-family: var(--font-sans); display: flex; align-items: center; gap: 6px;">
                🚪 Sign Out
              </button>
            </div>
          </div>
        ` : `
          <!-- Login / Register Buttons -->
          <a href="#login" class="btn btn-secondary btn-sm" id="nav-btn-login">Sign In</a>
          <a href="#register" class="btn btn-primary btn-sm" id="nav-btn-register">Register</a>
        `}

        <!-- Mobile Menu Toggle Button -->
        <button class="mobile-toggle" id="mobile-menu-toggle" aria-label="Toggle mobile menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  `;
}

function initNavbarEvents() {
  const userMenuBtn = document.getElementById('user-menu-btn');
  const userDropdownMenu = document.getElementById('user-dropdown-menu');
  if (userMenuBtn && userDropdownMenu) {
    userMenuBtn.onclick = (e) => {
      e.stopPropagation();
      userDropdownMenu.style.display = userDropdownMenu.style.display === 'block' ? 'none' : 'block';
    };
    document.addEventListener('click', () => {
      userDropdownMenu.style.display = 'none';
    });
  }

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.onclick = () => {
      window.api.logout();
      window.showToast('You have been logged out securely.', 'info');
      window.router.navigate('#home');
    };
  }

  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const navMenu = document.getElementById('nav-menu-links');
  if (mobileToggle && navMenu) {
    mobileToggle.onclick = () => {
      navMenu.classList.toggle('open');
    };
  }

  const themeBtn = document.getElementById('theme-toggle-btn');
  if (themeBtn) {
    themeBtn.onclick = () => {
      window.toggleTheme();
    };
  }
}

window.renderNavbar = renderNavbar;
window.initNavbarEvents = initNavbarEvents;
