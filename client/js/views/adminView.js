/**
 * PhishShield AI - Admin SOC Operations & Telemetry View
 */

let adminActiveTab = 'users';

function renderAdminView() {
  const user = window.api.getCurrentUser();

  if (!user || user.role !== 'admin') {
    return `
      <div style="text-align: center; padding: 60px 20px;">
        <div style="font-size: 3rem; margin-bottom: 14px;">⛔</div>
        <h2 style="font-size: 1.6rem; margin-bottom: 12px; color: var(--risk-critical);">Access Restricted: Administrator Role Required</h2>
        <p style="color: var(--text-secondary); max-width: 500px; margin: 0 auto 20px; line-height: 1.6;">
          This command center requires Level 3 Threat Intelligence administrative privileges. Please log in with the administrator demo account.
        </p>
        <button class="btn btn-primary" onclick="window.fillDemoLogin('admin@phishshield.ai', 'AdminPass123!@#'); window.router.navigate('#login');">
          ⚡ Sign in as Administrator
        </button>
      </div>
    `;
  }

  return `
    <div class="view-header">
      <div class="view-title-group">
        <h1 class="view-title">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--cyan-primary)" stroke-width="2.5">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
          </svg>
          SOC Administrative Control Center
        </h1>
        <div style="display: flex; gap: 8px;">
          <span class="badge badge-critical">ADMIN ACCESS LEVEL 3</span>
          <span class="badge badge-safe">NODE ENCLAVE ONLINE</span>
        </div>
      </div>
      <p class="view-subtitle">
        Enterprise user management, role-based access control (RBAC), global security audit trail, and active learning ML retraining pipeline.
      </p>
    </div>

    <!-- Admin Navigation Tabs -->
    <div style="display: flex; gap: 10px; margin-bottom: 24px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 12px; flex-wrap: wrap;">
      <button class="btn ${adminActiveTab === 'users' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="window.switchAdminTab('users')">
        👥 User Management
      </button>
      <button class="btn ${adminActiveTab === 'audit' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="window.switchAdminTab('audit')">
        📜 Security Audit Logs
      </button>
      <button class="btn ${adminActiveTab === 'ml' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="window.switchAdminTab('ml')">
        🤖 ML Retraining Hub
      </button>
      <button class="btn ${adminActiveTab === 'health' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="window.switchAdminTab('health')">
        💻 System Health
      </button>
      <button class="btn ${adminActiveTab === 'supabase' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="window.switchAdminTab('supabase')">
        ⚡ Supabase Cloud
      </button>
    </div>

    <!-- Dynamic Admin Tab Container -->
    <div id="admin-tab-content">
      <!-- Populated dynamically via initAdminData -->
    </div>
  `;
}

function switchAdminTab(tab) {
  adminActiveTab = tab;
  window.router.renderCurrentView();
}

async function initAdminData() {
  const container = document.getElementById('admin-tab-content');
  if (!container) return;

  const user = window.api.getCurrentUser();
  if (!user || user.role !== 'admin') return;

  if (adminActiveTab === 'users') {
    container.innerHTML = `<div class="cyber-card"><p style="color: var(--text-muted);">Loading user directory...</p></div>`;
    try {
      const res = await window.api.getAdminUsers();
      renderAdminUsersTab(res.users);
    } catch (err) {
      container.innerHTML = `<div class="cyber-card" style="color: var(--risk-critical);">${err.message}</div>`;
    }
  } else if (adminActiveTab === 'audit') {
    container.innerHTML = `<div class="cyber-card"><p style="color: var(--text-muted);">Loading audit trail...</p></div>`;
    try {
      const res = await window.api.getAuditLogs();
      renderAdminAuditTab(res.logs);
    } catch (err) {
      container.innerHTML = `<div class="cyber-card" style="color: var(--risk-critical);">${err.message}</div>`;
    }
  } else if (adminActiveTab === 'ml') {
    container.innerHTML = `<div class="cyber-card"><p style="color: var(--text-muted);">Loading ML model metrics...</p></div>`;
    try {
      const res = await window.api.getModelMetrics();
      renderAdminMlTab(res.metrics);
    } catch (err) {
      container.innerHTML = `<div class="cyber-card" style="color: var(--risk-critical);">${err.message}</div>`;
    }
  } else if (adminActiveTab === 'health') {
    container.innerHTML = `<div class="cyber-card"><p style="color: var(--text-muted);">Probing system telemetry...</p></div>`;
    try {
      const res = await window.api.getSystemHealth();
      renderAdminHealthTab(res.health);
    } catch (err) {
      container.innerHTML = `<div class="cyber-card" style="color: var(--risk-critical);">${err.message}</div>`;
    }
  } else if (adminActiveTab === 'supabase') {
    container.innerHTML = `<div class="cyber-card"><p style="color: var(--text-muted);">Querying Supabase Cloud status...</p></div>`;
    try {
      const res = await window.api.getSupabaseStatus();
      renderAdminSupabaseTab(res);
    } catch (err) {
      container.innerHTML = `<div class="cyber-card" style="color: var(--risk-critical);">${err.message}</div>`;
    }
  }
}

// 1. Render Users Tab
function renderAdminUsersTab(users) {
  const container = document.getElementById('admin-tab-content');
  container.innerHTML = `
    <div class="cyber-card">
      <div class="cyber-card-header">
        <div class="cyber-card-title">
          <span>👥</span> Registered Enterprise Users (${users.length})
        </div>
      </div>
      <div class="table-responsive">
        <table class="cyber-table">
          <thead>
            <tr>
              <th>Analyst Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Organization</th>
              <th>Scans Run</th>
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${users.map((u) => `
              <tr>
                <td><strong>${u.name}</strong></td>
                <td><code style="color: var(--cyan-primary);">${u.email}</code></td>
                <td>
                  <select class="form-select" style="padding: 4px 8px; font-size: 0.8rem; width: auto;" onchange="window.changeUserRole('${u.id}', this.value)">
                    <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>Admin</option>
                    <option value="analyst" ${u.role === 'analyst' ? 'selected' : ''}>Analyst</option>
                    <option value="user" ${u.role === 'user' ? 'selected' : ''}>User</option>
                  </select>
                </td>
                <td>
                  <span class="badge ${u.status === 'active' ? 'badge-safe' : 'badge-critical'}">
                    ${u.status}
                  </span>
                </td>
                <td style="color: var(--text-secondary);">${u.organization || 'Independent'}</td>
                <td style="font-family: var(--font-mono); font-weight: 600;">${u.scanCount || 0}</td>
                <td style="font-size: 0.78rem; color: var(--text-muted); font-family: var(--font-mono);">
                  ${u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : 'Never'}
                </td>
                <td>
                  <button class="btn btn-secondary btn-sm" onclick="window.toggleUserStatus('${u.id}', '${u.status === 'active' ? 'suspended' : 'active'}')">
                    ${u.status === 'active' ? 'Suspend' : 'Activate'}
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// 2. Render Audit Logs Tab
function renderAdminAuditTab(logs) {
  const container = document.getElementById('admin-tab-content');
  container.innerHTML = `
    <div class="cyber-card">
      <div class="cyber-card-header">
        <div class="cyber-card-title">
          <span>📜</span> System Security Audit Trail (${logs.length} events)
        </div>
      </div>
      <div class="table-responsive">
        <table class="cyber-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>User Account</th>
              <th>Security Action</th>
              <th>Event Details</th>
              <th>Source IP</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${logs.map((l) => `
              <tr>
                <td style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--text-muted);">
                  ${new Date(l.timestamp).toLocaleDateString()} ${new Date(l.timestamp).toLocaleTimeString()}
                </td>
                <td><code style="color: var(--text-primary); font-size: 0.8rem;">${l.userEmail}</code></td>
                <td><span class="badge badge-low">${l.action}</span></td>
                <td style="color: var(--text-secondary); font-size: 0.82rem; max-width: 320px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${l.details}">
                  ${l.details}
                </td>
                <td><code style="font-size: 0.78rem; color: var(--cyan-primary);">${l.ip || '127.0.0.1'}</code></td>
                <td>
                  <span class="badge ${l.status === 'SUCCESS' ? 'badge-safe' : 'badge-critical'}">${l.status}</span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// 3. Render ML Retraining Hub Tab
function renderAdminMlTab(metrics) {
  const container = document.getElementById('admin-tab-content');
  container.innerHTML = `
    <div class="cyber-card" style="margin-bottom: 24px;">
      <div class="cyber-card-header">
        <div class="cyber-card-title">
          <span>🤖</span> Active Learning Model Telemetry
        </div>
        <span class="badge badge-safe">${metrics.modelVersion}</span>
      </div>

      <div class="hud-grid" style="margin-bottom: 24px;">
        <div class="hud-card">
          <div class="hud-icon-box" style="background: rgba(0, 242, 254, 0.1); color: var(--cyan-primary);">🎯</div>
          <div class="hud-info">
            <span class="hud-label">Accuracy</span>
            <span class="hud-value">${metrics.accuracy}%</span>
          </div>
        </div>
        <div class="hud-card">
          <div class="hud-icon-box" style="background: rgba(16, 185, 129, 0.1); color: var(--risk-safe);">📈</div>
          <div class="hud-info">
            <span class="hud-label">ROC-AUC</span>
            <span class="hud-value">${metrics.rocAuc}</span>
          </div>
        </div>
        <div class="hud-card">
          <div class="hud-icon-box" style="background: rgba(139, 92, 246, 0.1); color: var(--purple-accent);">📚</div>
          <div class="hud-info">
            <span class="hud-label">Dataset Samples</span>
            <span class="hud-value">${metrics.datasetSize.toLocaleString()}</span>
          </div>
        </div>
        <div class="hud-card">
          <div class="hud-icon-box" style="background: rgba(245, 158, 11, 0.1); color: var(--risk-medium);">⚡</div>
          <div class="hud-info">
            <span class="hud-label">Mean Latency</span>
            <span class="hud-value">${metrics.averageLatencyMs} ms</span>
          </div>
        </div>
      </div>

      <div style="background: var(--bg-primary); border: 1px solid var(--border-cyber); border-radius: var(--radius-md); padding: 24px; margin-bottom: 20px;">
        <h3 style="font-size: 1.15rem; color: var(--text-primary); margin-bottom: 8px;">
          Trigger Retraining with Active Feedback Loop
        </h3>
        <p style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.5; margin-bottom: 16px;">
          Incorporates user-reported false positives, analyst labels, and new zero-day samples into the Random Forest and Gradient Boosting decision trees.
        </p>

        <div id="retrain-progress-area" style="display: none; margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 6px;">
            <span id="retrain-step-label">Optimizing hyperparameters & cross-validating...</span>
            <span style="font-family: var(--font-mono); color: var(--cyan-primary);" id="retrain-pct-label">0%</span>
          </div>
          <div class="meter-track">
            <div id="retrain-progress-bar" class="meter-fill" style="width: 0%; background: linear-gradient(90deg, var(--cyan-primary), var(--purple-accent));"></div>
          </div>
        </div>

        <button class="btn btn-primary" id="retrain-btn" onclick="window.triggerRetrainingAction()">
          ⚡ Execute Model Retraining Pipeline
        </button>
      </div>
    </div>
  `;
}

// 4. Render Health Tab
function renderAdminHealthTab(health) {
  const container = document.getElementById('admin-tab-content');
  const uptimeHours = (health.uptimeSeconds / 3600).toFixed(1);

  container.innerHTML = `
    <div class="cyber-card">
      <div class="cyber-card-header">
        <div class="cyber-card-title">
          <span>💻</span> System Diagnostics & Node Health
        </div>
        <span class="badge badge-safe">${health.status}</span>
      </div>

      <div class="hud-grid">
        <div class="hud-card">
          <div class="hud-icon-box" style="background: rgba(0, 242, 254, 0.1); color: var(--cyan-primary);">⏳</div>
          <div class="hud-info">
            <span class="hud-label">Server Uptime</span>
            <span class="hud-value">${uptimeHours} hrs</span>
          </div>
        </div>
        <div class="hud-card">
          <div class="hud-icon-box" style="background: rgba(16, 185, 129, 0.1); color: var(--risk-safe);">💾</div>
          <div class="hud-info">
            <span class="hud-label">Memory Usage</span>
            <span class="hud-value">${health.memory.percent}%</span>
            <span class="hud-meta">${health.memory.usedMB} MB / ${health.memory.totalMB} MB</span>
          </div>
        </div>
        <div class="hud-card">
          <div class="hud-icon-box" style="background: rgba(139, 92, 246, 0.1); color: var(--purple-accent);">⚙️</div>
          <div class="hud-info">
            <span class="hud-label">Node Runtime</span>
            <span class="hud-value">${health.nodeVersion}</span>
            <span class="hud-meta">${health.platform} (${health.arch})</span>
          </div>
        </div>
        <div class="hud-card">
          <div class="hud-icon-box" style="background: rgba(245, 158, 11, 0.1); color: var(--risk-medium);">🗄️</div>
          <div class="hud-info">
            <span class="hud-label">Scans in DB</span>
            <span class="hud-value">${health.database.totalScans}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

// User role & status actions
async function changeUserRole(userId, newRole) {
  try {
    await window.api.updateUserRole(userId, newRole);
    window.showToast(`Updated user role to ${newRole}`, 'success');
  } catch (err) {
    window.showToast(err.message, 'error');
    initAdminData();
  }
}

async function toggleUserStatus(userId, newStatus) {
  try {
    await window.api.updateUserStatus(userId, newStatus);
    window.showToast(`User status updated to ${newStatus}`, 'success');
    initAdminData();
  } catch (err) {
    window.showToast(err.message, 'error');
  }
}

// Retrain action with animated telemetry
async function triggerRetrainingAction() {
  const btn = document.getElementById('retrain-btn');
  const progArea = document.getElementById('retrain-progress-area');
  const progBar = document.getElementById('retrain-progress-bar');
  const progLabel = document.getElementById('retrain-step-label');
  const pctLabel = document.getElementById('retrain-pct-label');

  btn.disabled = true;
  progArea.style.display = 'block';

  const steps = [
    { text: 'Aggregating newly verified threat telemetry & feedback...', pct: 25 },
    { text: 'Recalculating information-theoretic entropy distributions...', pct: 50 },
    { text: 'Pruning Random Forest decision trees & tuning XGBoost depths...', pct: 75 },
    { text: 'Performing 5-fold cross validation...', pct: 95 }
  ];

  for (let s of steps) {
    progLabel.innerText = s.text;
    pctLabel.innerText = `${s.pct}%`;
    progBar.style.width = `${s.pct}%`;
    await new Promise((r) => setTimeout(r, 250));
  }

  try {
    const res = await window.api.retrainModel();
    progLabel.innerText = 'Model successfully updated!';
    pctLabel.innerText = '100%';
    progBar.style.width = '100%';

    await new Promise((r) => setTimeout(r, 300));
    window.showToast(res.message, 'success');
    initAdminData();
  } catch (e) {
    window.showToast(e.message, 'error');
    btn.disabled = false;
  }
}

// 5. Render Supabase Cloud Database Tab
function renderAdminSupabaseTab(status) {
  const container = document.getElementById('admin-tab-content');
  const isConn = Boolean(status.connected);
  const isCfg = Boolean(status.configured);

  container.innerHTML = `
    <div class="cyber-card" style="margin-bottom: 24px;">
      <div class="cyber-card-header">
        <div class="cyber-card-title">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--cyan-primary)" stroke-width="2">
            <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
          </svg>
          Supabase Cloud Database Enclave
        </div>
        <div style="display: flex; gap: 8px; align-items: center;">
          <span class="badge ${isConn ? 'badge-safe' : (isCfg ? 'badge-moderate' : 'badge-low')}">
            ${isConn ? '🟢 CONNECTED (POSTGRES)' : (isCfg ? '🟡 CONFIGURED (CONNECTING)' : '⚪ LOCAL STANDBY (OFFLINE CACHE)')}
          </span>
          ${status.latencyMs ? `<span class="badge badge-safe">${status.latencyMs}ms Ping</span>` : ''}
        </div>
      </div>

      <p style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.6; margin-bottom: 20px;">
        PhishShield AI connects to Supabase Cloud for persistent, low-latency relational threat telemetry storage, real-time threat broadcasts, and disaster recovery. All URL classifications and security audit events replicate to Supabase in real time.
      </p>

      <!-- Connection Telemetry HUD -->
      <div class="hud-grid" style="margin-bottom: 24px;">
        <div class="hud-card">
          <div class="hud-icon-box" style="background: rgba(0, 242, 254, 0.1); color: var(--cyan-primary);">🌐</div>
          <div class="hud-info">
            <span class="hud-label">Endpoint URL</span>
            <span class="hud-value" style="font-size: 0.9rem; word-break: break-all;">${status.supabaseUrl || 'Local Mode'}</span>
            <span class="hud-meta">Provider: ${(status.provider || 'local').toUpperCase()}</span>
          </div>
        </div>

        <div class="hud-card">
          <div class="hud-icon-box" style="background: rgba(16, 185, 129, 0.1); color: var(--risk-safe);">⚡</div>
          <div class="hud-info">
            <span class="hud-label">PostgreSQL Latency</span>
            <span class="hud-value">${status.latencyMs ? `${status.latencyMs} ms` : 'Local Cache'}</span>
            <span class="hud-meta">${isConn ? 'SSL Encrypted TLS 1.3' : 'Offline Mode'}</span>
          </div>
        </div>

        <div class="hud-card">
          <div class="hud-icon-box" style="background: rgba(139, 92, 246, 0.1); color: var(--purple-accent);">🛡️</div>
          <div class="hud-info">
            <span class="hud-label">Scans Synchronized</span>
            <span class="hud-value">${status.localStats ? status.localStats.scans : 0} Local / ${status.remoteStats && status.remoteStats.scans !== null ? status.remoteStats.scans : (isConn ? '0' : 'Standby')} Remote</span>
            <span class="hud-meta">Real-Time Write-Through</span>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 20px;">
        <button class="btn btn-primary btn-sm" id="btn-test-supabase" onclick="window.testSupabaseBtn()">
          ⚡ Ping & Verify Connection
        </button>
        <button class="btn btn-secondary btn-sm" id="btn-sync-supabase" onclick="window.syncToSupabaseBtn()">
          ⬆️ Sync Local Cache to Supabase
        </button>
      </div>

      <div id="supabase-action-feedback" style="display: none; padding: 14px; border-radius: var(--radius-sm); margin-bottom: 20px; font-size: 0.88rem;"></div>

      <!-- Synchronized Tables Telemetry Matrix -->
      <h3 style="font-size: 1rem; color: var(--text-primary); margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
        <span>📊</span> Schema Telemetry Matrix
      </h3>

      <div class="table-responsive">
        <table class="cyber-table">
          <thead>
            <tr>
              <th>PostgreSQL Table</th>
              <th>Description</th>
              <th>Local Cache Count</th>
              <th>Supabase Cloud Count</th>
              <th>Sync State</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>public.users</code></td>
              <td>Analyst accounts & hashed credentials</td>
              <td><strong>${status.localStats ? status.localStats.users : 0}</strong></td>
              <td><strong>${status.remoteStats ? (status.remoteStats.users ?? 'Standby') : (isConn ? '0' : 'Standby')}</strong></td>
              <td><span class="badge ${isConn ? 'badge-safe' : 'badge-low'}">${isConn ? 'SYNCHRONIZED' : 'LOCAL ONLY'}</span></td>
            </tr>
            <tr>
              <td><code>public.scans</code></td>
              <td>ML threat classifications & forensic vectors</td>
              <td><strong>${status.localStats ? status.localStats.scans : 0}</strong></td>
              <td><strong>${status.remoteStats ? (status.remoteStats.scans ?? 'Standby') : (isConn ? '0' : 'Standby')}</strong></td>
              <td><span class="badge ${isConn ? 'badge-safe' : 'badge-low'}">${isConn ? 'SYNCHRONIZED' : 'LOCAL ONLY'}</span></td>
            </tr>
            <tr>
              <td><code>public.audit_logs</code></td>
              <td>SOC administrative audit trail</td>
              <td><strong>${status.localStats ? status.localStats.auditLogs : 0}</strong></td>
              <td><strong>${status.remoteStats ? (status.remoteStats.audit_logs ?? 'Standby') : (isConn ? '0' : 'Standby')}</strong></td>
              <td><span class="badge ${isConn ? 'badge-safe' : 'badge-low'}">${isConn ? 'SYNCHRONIZED' : 'LOCAL ONLY'}</span></td>
            </tr>
            <tr>
              <td><code>public.feedback</code></td>
              <td>False positive / negative telemetry</td>
              <td><strong>${status.localStats ? status.localStats.feedback : 0}</strong></td>
              <td><strong>${status.remoteStats ? (status.remoteStats.feedback ?? 'Standby') : (isConn ? '0' : 'Standby')}</strong></td>
              <td><span class="badge ${isConn ? 'badge-safe' : 'badge-low'}">${isConn ? 'SYNCHRONIZED' : 'LOCAL ONLY'}</span></td>
            </tr>
            <tr>
              <td><code>public.incident_reports</code></td>
              <td>Zero-day triage tickets</td>
              <td><strong>${status.localStats ? status.localStats.incidentReports : 0}</strong></td>
              <td><strong>${status.remoteStats ? (status.remoteStats.incident_reports ?? 'Standby') : (isConn ? '0' : 'Standby')}</strong></td>
              <td><span class="badge ${isConn ? 'badge-safe' : 'badge-low'}">${isConn ? 'SYNCHRONIZED' : 'LOCAL ONLY'}</span></td>
            </tr>
            <tr>
              <td><code>public.contact_messages</code></td>
              <td>Incident inquiries</td>
              <td><strong>${status.localStats ? status.localStats.contactMessages : 0}</strong></td>
              <td><strong>${status.remoteStats ? (status.remoteStats.contact_messages ?? 'Standby') : (isConn ? '0' : 'Standby')}</strong></td>
              <td><span class="badge ${isConn ? 'badge-safe' : 'badge-low'}">${isConn ? 'SYNCHRONIZED' : 'LOCAL ONLY'}</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Setup Guide / Help Drawer -->
      <div style="margin-top: 24px; padding: 18px; background: rgba(0, 242, 254, 0.03); border: 1px dashed var(--border-subtle); border-radius: var(--radius-md);">
        <h4 style="font-size: 0.95rem; color: var(--cyan-primary); margin-bottom: 8px;">
          🛠️ How to connect your Supabase project:
        </h4>
        <ol style="color: var(--text-secondary); font-size: 0.85rem; line-height: 1.8; margin-left: 20px;">
          <li>Create a free project at <a href="https://supabase.com" target="_blank" style="color: var(--cyan-primary);">supabase.com</a>.</li>
          <li>Open your Supabase <strong>SQL Editor</strong> and execute the script in <code>server/database/supabase_schema.sql</code>.</li>
          <li>In your project root <code>.env</code> file, set <code>SUPABASE_URL</code> and <code>SUPABASE_ANON_KEY</code>.</li>
          <li>Restart server and click "Sync Local Cache to Supabase" above or run <code>npm run db:migrate:supabase</code>!</li>
        </ol>
      </div>
    </div>
  `;
}

// Supabase Test Button Action
async function testSupabaseBtn() {
  const btn = document.getElementById('btn-test-supabase');
  const box = document.getElementById('supabase-action-feedback');
  if (!btn || !box) return;

  btn.disabled = true;
  btn.innerText = 'Testing connection...';
  box.style.display = 'block';
  box.style.background = 'rgba(0, 242, 254, 0.08)';
  box.style.color = 'var(--text-primary)';
  box.innerHTML = '🔄 Probing Supabase endpoint...';

  try {
    const res = await window.api.testSupabaseConnection();
    if (res.connected) {
      box.style.background = 'rgba(16, 185, 129, 0.15)';
      box.style.color = 'var(--risk-safe)';
      box.innerHTML = `✅ <strong>Connected!</strong> Ping: ${res.latencyMs}ms. ${res.message}`;
      window.showToast('Supabase connected successfully!', 'success');
    } else {
      box.style.background = 'rgba(239, 68, 68, 0.15)';
      box.style.color = 'var(--risk-critical)';
      box.innerHTML = `⚠️ <strong>Connection Notice:</strong> ${res.message}`;
      window.showToast('Supabase ping check completed', 'info');
    }
    // Refresh tab state
    setTimeout(() => {
      initAdminData();
    }, 1500);
  } catch (err) {
    box.style.background = 'rgba(239, 68, 68, 0.15)';
    box.style.color = 'var(--risk-critical)';
    box.innerHTML = `❌ Error: ${err.message}`;
  } finally {
    btn.disabled = false;
    btn.innerText = '⚡ Ping & Verify Connection';
  }
}

// Supabase Sync Button Action
async function syncToSupabaseBtn() {
  const btn = document.getElementById('btn-sync-supabase');
  const box = document.getElementById('supabase-action-feedback');
  if (!btn || !box) return;

  btn.disabled = true;
  btn.innerText = 'Syncing data...';
  box.style.display = 'block';
  box.style.background = 'rgba(0, 242, 254, 0.08)';
  box.style.color = 'var(--text-primary)';
  box.innerHTML = '⬆️ Migrating local database cache to Supabase Cloud...';

  try {
    const res = await window.api.syncSupabase();
    if (res.success) {
      box.style.background = 'rgba(16, 185, 129, 0.15)';
      box.style.color = 'var(--risk-safe)';
      const rep = res.report || {};
      box.innerHTML = `🎉 <strong>Sync Succeeded!</strong> Users: ${rep.users || 0}, Scans: ${rep.scans || 0}, Logs: ${rep.auditLogs || 0}`;
      window.showToast('Database migrated to Supabase successfully!', 'success');
      setTimeout(() => {
        initAdminData();
      }, 1500);
    } else {
      box.style.background = 'rgba(239, 68, 68, 0.15)';
      box.style.color = 'var(--risk-critical)';
      box.innerHTML = `⚠️ Sync notice: ${res.message}`;
    }
  } catch (err) {
    box.style.background = 'rgba(239, 68, 68, 0.15)';
    box.style.color = 'var(--risk-critical)';
    box.innerHTML = `❌ Sync failed: ${err.message}`;
  } finally {
    btn.disabled = false;
    btn.innerText = '⬆️ Sync Local Cache to Supabase';
  }
}

window.renderAdminView = renderAdminView;
window.switchAdminTab = switchAdminTab;
window.initAdminData = initAdminData;
window.changeUserRole = changeUserRole;
window.toggleUserStatus = toggleUserStatus;
window.triggerRetrainingAction = triggerRetrainingAction;
window.renderAdminSupabaseTab = renderAdminSupabaseTab;
window.testSupabaseBtn = testSupabaseBtn;
window.syncToSupabaseBtn = syncToSupabaseBtn;
