/**
 * PhishShield AI - Centralized REST API Client
 */

class ApiService {
  constructor() {
    this.baseUrl = '/api';
    this.tokenKey = 'phishshield_auth_token';
    this.userKey = 'phishshield_user_data';
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token) {
    if (token) {
      localStorage.setItem(this.tokenKey, token);
    } else {
      localStorage.removeItem(this.tokenKey);
    }
  }

  getCurrentUser() {
    try {
      const data = localStorage.getItem(this.userKey);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  setCurrentUser(user) {
    if (user) {
      localStorage.setItem(this.userKey, JSON.stringify(user));
    } else {
      localStorage.removeItem(this.userKey);
    }
  }

  isAuthenticated() {
    return Boolean(this.getToken());
  }

  logout() {
    this.setToken(null);
    this.setCurrentUser(null);
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, { ...options, headers });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 401 && this.getToken()) {
          // Token expired
          this.logout();
          window.location.hash = '#login';
        }
        throw new Error(data.message || `Request failed with status ${response.status}`);
      }

      return data;
    } catch (err) {
      console.error(`API Error [${endpoint}]:`, err.message);
      throw err;
    }
  }

  // --- Auth Endpoints ---

  async login(email, password) {
    const res = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (res.token) {
      this.setToken(res.token);
      this.setCurrentUser(res.user);
    }
    return res;
  }

  async register(userData) {
    const res = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    if (res.token) {
      this.setToken(res.token);
      this.setCurrentUser(res.user);
    }
    return res;
  }

  async getMe() {
    const res = await this.request('/auth/me');
    if (res.user) {
      this.setCurrentUser(res.user);
    }
    return res.user;
  }

  async updateProfile(profileData) {
    const res = await this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
    if (res.user) {
      this.setCurrentUser(res.user);
    }
    return res;
  }

  async changePassword(currentPassword, newPassword) {
    return this.request('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword })
    });
  }

  async generateApiKey() {
    return this.request('/auth/generate-api-key', { method: 'POST' });
  }

  async toggleMfa() {
    return this.request('/auth/toggle-mfa', { method: 'POST' });
  }

  // --- Scan Endpoints ---

  async scanUrl(url) {
    return this.request('/scans/analyze', {
      method: 'POST',
      body: JSON.stringify({ url })
    });
  }

  async getHistory(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.request(`/scans/history?${qs}`);
  }

  async getScanById(id) {
    return this.request(`/scans/${id}`);
  }

  async submitFeedback(scanId, reportedAs, notes) {
    return this.request(`/scans/${scanId}/feedback`, {
      method: 'POST',
      body: JSON.stringify({ reportedAs, notes })
    });
  }

  async deleteScan(scanId) {
    return this.request(`/scans/${scanId}`, { method: 'DELETE' });
  }

  // --- Analytics Endpoints ---

  async getAnalytics() {
    return this.request('/analytics/dashboard');
  }

  // --- Admin Endpoints ---

  async getAdminUsers() {
    return this.request('/admin/users');
  }

  async updateUserRole(userId, role) {
    return this.request(`/admin/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role })
    });
  }

  async updateUserStatus(userId, status) {
    return this.request(`/admin/users/${userId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  }

  async getAuditLogs(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.request(`/admin/audit-logs?${qs}`);
  }

  async getModelMetrics() {
    return this.request('/admin/model-metrics');
  }

  async retrainModel() {
    return this.request('/admin/retrain', { method: 'POST' });
  }

  async getSystemHealth() {
    return this.request('/admin/system-health');
  }

  // --- Supabase Cloud Database Endpoints ---

  async getSupabaseStatus() {
    return this.request('/admin/supabase/status');
  }

  async testSupabaseConnection() {
    return this.request('/admin/supabase/test', { method: 'POST' });
  }

  async syncSupabase() {
    return this.request('/admin/supabase/sync', { method: 'POST' });
  }

  // --- Contact / Incident Endpoints ---

  async reportIncident(incidentData) {
    return this.request('/contact/incident', {
      method: 'POST',
      body: JSON.stringify(incidentData)
    });
  }

  async sendContactMessage(msgData) {
    return this.request('/contact/message', {
      method: 'POST',
      body: JSON.stringify(msgData)
    });
  }
}

const api = new ApiService();
window.api = api;
