/**
 * PhishShield AI - Core Client Application Controller & Router
 */

class AppRouter {
  constructor() {
    this.routes = {
      '#home': { render: window.renderHomeView },
      '#about': { render: window.renderAboutView, init: window.initAboutCharts },
      '#scanner': { render: window.renderScannerView },
      '#dashboard': { render: window.renderDashboardView, init: window.initDashboardData },
      '#history': { render: window.renderHistoryView, init: window.loadHistoryData },
      '#reports': { render: window.renderReportsView, init: window.initReportsData },
      '#profile': { render: window.renderProfileView },
      '#settings': { render: window.renderSettingsView },
      '#admin': { render: window.renderAdminView, init: window.initAdminData },
      '#contact': { render: window.renderContactView },
      '#login': { render: window.renderLoginView },
      '#register': { render: window.renderRegisterView }
    };

    this.currentHash = window.location.hash || '#home';
    this.appView = null;
  }

  init() {
    this.appView = document.getElementById('app-view');
    window.addEventListener('hashchange', () => this.handleRoute());
    this.handleRoute();
  }

  navigate(hash) {
    if (window.location.hash === hash) {
      this.handleRoute();
    } else {
      window.location.hash = hash;
    }
  }

  handleRoute() {
    let hash = window.location.hash || '#home';
    // Strip query parameters for routing if present
    const baseHash = hash.split('?')[0];

    const route = this.routes[baseHash] || this.routes['#home'];
    this.currentHash = baseHash;

    window.updateNavState();

    if (this.appView && route.render) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.appView.innerHTML = route.render();

      if (route.init) {
        setTimeout(() => route.init(), 20);
      }
    }
  }

  renderCurrentView() {
    this.handleRoute();
  }
}

// Toast Notifications System
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✓' : type === 'error' ? '⚠️' : 'ℹ️'}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Theme Toggle
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('phishshield_theme', next);

  const icon = document.getElementById('theme-icon');
  if (icon) icon.innerText = next === 'light' ? '☀️' : '🌙';

  showToast(`Switched to ${next === 'light' ? 'Corporate Light' : 'Cyber Dark'} mode`, 'info');
  if (window.router) {
    window.router.renderCurrentView();
  }
}

// Re-render Navbar and Footer
function updateNavState() {
  const header = document.querySelector('header.app-header');
  const footerContainer = document.getElementById('app-footer-container');

  if (header && window.renderNavbar) {
    header.innerHTML = window.renderNavbar();
    if (window.initNavbarEvents) window.initNavbarEvents();
  }

  if (footerContainer && window.renderFooter) {
    footerContainer.innerHTML = window.renderFooter();
  }
}

// Application Startup
document.addEventListener('DOMContentLoaded', async () => {
  // Apply saved theme
  const savedTheme = localStorage.getItem('phishshield_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  // Initialize router
  window.router = new AppRouter();
  window.showToast = showToast;
  window.toggleTheme = toggleTheme;
  window.updateNavState = updateNavState;

  // Verify auth session if token exists
  if (window.api.getToken()) {
    try {
      await window.api.getMe();
    } catch (e) {
      console.warn('Session expired or invalid, cleared.');
    }
  }

  updateNavState();
  window.router.init();
});
