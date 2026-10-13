/**
 * PhishShield AI - Real-Time Analytics Dashboard View
 */

let dashboardCharts = {};

function renderDashboardView() {
  return `
    <div class="view-header">
      <div class="view-title-group">
        <h1 class="view-title">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--cyan-primary)" stroke-width="2.5">
            <rect x="3" y="3" width="7" height="9"></rect>
            <rect x="14" y="3" width="7" height="5"></rect>
            <rect x="14" y="12" width="7" height="9"></rect>
            <rect x="3" y="16" width="7" height="5"></rect>
          </svg>
          Threat Telemetry & Analytics Dashboard
        </h1>
        <div style="display: flex; gap: 10px;">
          <button class="btn btn-secondary btn-sm" onclick="window.refreshDashboard()">
            🔄 Refresh Feeds
          </button>
          <a href="#scanner" class="btn btn-primary btn-sm">
            + New URL Scan
          </a>
        </div>
      </div>
      <p class="view-subtitle">
        Real-time telemetry aggregated from edge URL inspection nodes, heuristic extraction filters, and the active machine learning ensemble classifier.
      </p>
    </div>

    <!-- HUD Real-Time Metrics -->
    <div class="hud-grid" id="dashboard-hud-container">
      <div class="hud-card">
        <div class="hud-icon-box" style="background: rgba(0, 242, 254, 0.1); color: var(--cyan-primary);">
          🌐
        </div>
        <div class="hud-info">
          <span class="hud-label">Total URLs Scanned</span>
          <span class="hud-value" id="dash-total-scanned">--</span>
          <span class="hud-meta">Active Telemetry Stream</span>
        </div>
      </div>

      <div class="hud-card">
        <div class="hud-icon-box" style="background: rgba(239, 68, 68, 0.1); color: var(--risk-critical);">
          🛑
        </div>
        <div class="hud-info">
          <span class="hud-label">Phishing Neutralized</span>
          <span class="hud-value" id="dash-phish-detected" style="color: var(--risk-critical);">--</span>
          <span class="hud-meta" style="color: var(--risk-critical);" id="dash-phish-pct">--%</span>
        </div>
      </div>

      <div class="hud-card">
        <div class="hud-icon-box" style="background: rgba(16, 185, 129, 0.1); color: var(--risk-safe);">
          🛡️
        </div>
        <div class="hud-info">
          <span class="hud-label">Legitimate Sites</span>
          <span class="hud-value" id="dash-legit-detected" style="color: var(--risk-safe);">--</span>
          <span class="hud-meta">Verified Clean</span>
        </div>
      </div>

      <div class="hud-card">
        <div class="hud-icon-box" style="background: rgba(139, 92, 246, 0.1); color: var(--purple-accent);">
          🎯
        </div>
        <div class="hud-info">
          <span class="hud-label">Model Accuracy</span>
          <span class="hud-value" id="dash-accuracy">--%</span>
          <span class="hud-meta" id="dash-roc-auc">ROC-AUC: 0.9918</span>
        </div>
      </div>
    </div>

    <!-- Trends & Threat Distribution Grid -->
    <div class="dashboard-grid-2">
      <!-- Main Attack Velocity Line Chart Card -->
      <div class="cyber-card">
        <div class="cyber-card-header">
          <div>
            <div class="cyber-card-title">
              <span>📈</span> Scan Volume & Attack Velocity Trends
            </div>
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">
              Comparison of Legitimate vs Neutralized Phishing URLs
            </div>
          </div>
          <div style="display: flex; gap: 6px;">
            <button class="btn btn-secondary btn-sm" id="trend-daily-btn" onclick="window.switchTrendTimeframe('daily')">7 Days</button>
            <button class="btn btn-secondary btn-sm" id="trend-monthly-btn" onclick="window.switchTrendTimeframe('monthly')">6 Months</button>
          </div>
        </div>

        <div style="position: relative; height: 280px; width: 100%;">
          <canvas id="scan-trend-chart"></canvas>
        </div>
      </div>

      <!-- Threat Severity Doughnut Card -->
      <div class="cyber-card">
        <div class="cyber-card-header">
          <div class="cyber-card-title">
            <span>🛡️</span> Risk Distribution
          </div>
          <span class="badge badge-low">5 Levels</span>
        </div>
        <div style="position: relative; height: 280px; width: 100%;">
          <canvas id="risk-distribution-chart"></canvas>
        </div>
      </div>
    </div>

    <!-- Top Indicators & Top Targeted Brands Grid -->
    <div class="dashboard-grid-2">
      <!-- Most Common Phishing Indicators Bar Chart -->
      <div class="cyber-card">
        <div class="cyber-card-header">
          <div class="cyber-card-title">
            <span>🔍</span> Most Common Phishing Indicators
          </div>
          <span style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--font-mono);">
            Frequency Distribution
          </span>
        </div>
        <div style="position: relative; height: 260px; width: 100%;">
          <canvas id="indicators-bar-chart"></canvas>
        </div>
      </div>

      <!-- Top Targeted Brands & Abused TLDs -->
      <div class="cyber-card">
        <div class="cyber-card-header">
          <div class="cyber-card-title">
            <span>🎯</span> Top Targeted Brand Entities
          </div>
          <span class="badge badge-critical">High Value Targets</span>
        </div>
        <div id="top-brands-list-container">
          <!-- Populated dynamically -->
        </div>
      </div>
    </div>

    <!-- Live Threat Feed -->
    <div class="cyber-card">
      <div class="cyber-card-header">
        <div class="cyber-card-title">
          <span class="pulse-element" style="color: var(--risk-critical); display: inline-block;">🚨</span>
          Live Malicious Threat Feed (Recent Detections)
        </div>
        <a href="#history" class="btn btn-secondary btn-sm">
          View Full Scan History →
        </a>
      </div>
      <div class="table-responsive">
        <table class="cyber-table">
          <thead>
            <tr>
              <th>Detected Host</th>
              <th>Target Entity</th>
              <th>Risk Level</th>
              <th>Confidence</th>
              <th>Timestamp</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody id="dashboard-recent-threats-body">
            <tr><td colspan="6" style="text-align: center; color: var(--text-muted);">Loading threat stream...</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

async function initDashboardData() {
  try {
    const res = await window.api.getAnalytics();
    if (!res.success) return;

    const { stats, riskCounts, indicatorCounts, topBrands, trendData, monthlyTrend, recentThreats } = res;

    // Update HUD metrics
    const totalEl = document.getElementById('dash-total-scanned');
    const phishEl = document.getElementById('dash-phish-detected');
    const legitEl = document.getElementById('dash-legit-detected');
    const accEl = document.getElementById('dash-accuracy');
    const phishPctEl = document.getElementById('dash-phish-pct');

    if (totalEl) totalEl.innerText = stats.totalScanned.toLocaleString();
    if (phishEl) phishEl.innerText = stats.totalPhishing.toLocaleString();
    if (legitEl) legitEl.innerText = stats.totalLegitimate.toLocaleString();
    if (accEl) accEl.innerText = `${stats.accuracy}%`;
    if (phishPctEl) {
      const pct = stats.totalScanned > 0 ? ((stats.totalPhishing / stats.totalScanned) * 100).toFixed(1) : 0;
      phishPctEl.innerText = `${pct}% Phish Ratio`;
    }

    // Render Charts using Chart.js if loaded
    renderDashboardCharts(trendData, riskCounts, indicatorCounts);

    // Render Top Brands
    const brandsContainer = document.getElementById('top-brands-list-container');
    if (brandsContainer) {
      if (topBrands.length === 0) {
        brandsContainer.innerHTML = '<p style="color: var(--text-muted); font-size: 0.9rem;">No brand attacks recorded yet.</p>';
      } else {
        brandsContainer.innerHTML = topBrands.map((b) => `
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 14px; background: rgba(255, 255, 255, 0.02); border-radius: var(--radius-md); margin-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 1.1rem;">🏢</span>
              <strong style="font-size: 0.95rem; color: var(--text-primary);">${b.brand}</strong>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="badge badge-critical">${b.count} campaigns</span>
            </div>
          </div>
        `).join('');
      }
    }

    // Render Recent Threats Feed
    const tbody = document.getElementById('dashboard-recent-threats-body');
    if (tbody) {
      if (!recentThreats || recentThreats.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">No phishing threats detected recently.</td></tr>';
      } else {
        tbody.innerHTML = recentThreats.map((t) => `
          <tr>
            <td>
              <code style="color: var(--cyan-primary);">${t.domain}</code>
            </td>
            <td>
              <span style="font-weight: 500;">${t.targetBrand}</span>
            </td>
            <td>
              <span class="badge ${t.riskLevel === 'Safe' ? 'badge-safe' : t.riskLevel === 'Low' ? 'badge-low' : t.riskLevel === 'Medium' ? 'badge-medium' : t.riskLevel === 'High' ? 'badge-high' : 'badge-critical'}">
                ${t.riskLevel}
              </span>
            </td>
            <td>
              <strong style="font-family: var(--font-mono); color: var(--risk-critical);">${t.confidence}%</strong>
            </td>
            <td style="color: var(--text-muted); font-size: 0.8rem; font-family: var(--font-mono);">
              ${new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </td>
            <td>
              <button class="btn btn-secondary btn-sm" onclick="window.inspectThreat('${t.id}')">
                Inspect
              </button>
            </td>
          </tr>
        `).join('');
      }
    }
  } catch (err) {
    console.error('Failed to load dashboard:', err);
  }
}

function renderDashboardCharts(trendData, riskCounts, indicatorCounts) {
  if (typeof Chart === 'undefined') return;

  // Destroy previous charts if existing
  if (dashboardCharts.trend) dashboardCharts.trend.destroy();
  if (dashboardCharts.risk) dashboardCharts.risk.destroy();
  if (dashboardCharts.indicators) dashboardCharts.indicators.destroy();

  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)';
  const textColor = isDark ? '#94a3b8' : '#64748b';

  // 1. Trend Line Chart
  const trendCtx = document.getElementById('scan-trend-chart');
  if (trendCtx) {
    dashboardCharts.trend = new Chart(trendCtx, {
      type: 'line',
      data: {
        labels: trendData.labels,
        datasets: [
          {
            label: 'Neutralized Phishing',
            data: trendData.phishing,
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            fill: true,
            tension: 0.35,
            borderWidth: 2
          },
          {
            label: 'Legitimate Classified',
            data: trendData.legitimate,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.05)',
            fill: true,
            tension: 0.35,
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: textColor, font: { family: 'Outfit' } } }
        },
        scales: {
          x: { grid: { color: gridColor }, ticks: { color: textColor } },
          y: { grid: { color: gridColor }, ticks: { color: textColor } }
        }
      }
    });
  }

  // 2. Risk Doughnut Chart
  const riskCtx = document.getElementById('risk-distribution-chart');
  if (riskCtx) {
    dashboardCharts.risk = new Chart(riskCtx, {
      type: 'doughnut',
      data: {
        labels: ['Safe', 'Low', 'Medium', 'High', 'Critical'],
        datasets: [
          {
            data: [
              riskCounts.Safe || 0,
              riskCounts.Low || 0,
              riskCounts.Medium || 0,
              riskCounts.High || 0,
              riskCounts.Critical || 0
            ],
            backgroundColor: ['#10b981', '#06b6d4', '#f59e0b', '#f97316', '#ef4444'],
            borderWidth: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { color: textColor, font: { family: 'Outfit' } } }
        },
        cutout: '65%'
      }
    });
  }

  // 3. Indicators Bar Chart
  const indCtx = document.getElementById('indicators-bar-chart');
  if (indCtx) {
    const labels = Object.keys(indicatorCounts);
    const dataVals = Object.values(indicatorCounts);

    dashboardCharts.indicators = new Chart(indCtx, {
      type: 'bar',
      data: {
        labels: labels.map((l) => l.length > 20 ? l.slice(0, 18) + '...' : l),
        datasets: [
          {
            label: 'Detection Frequency',
            data: dataVals,
            backgroundColor: 'rgba(0, 242, 254, 0.65)',
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: textColor, font: { size: 10 } } },
          y: { grid: { color: gridColor }, ticks: { color: textColor, precision: 0 } }
        }
      }
    });
  }
}

async function inspectThreat(scanId) {
  try {
    const res = await window.api.getScanById(scanId);
    if (res.data) {
      window.openScanModal(res.data);
    }
  } catch (err) {
    window.showToast('Unable to open scan record: ' + err.message, 'error');
  }
}

function refreshDashboard() {
  window.showToast('Refreshing telemetry feeds...', 'info');
  initDashboardData();
}

window.renderDashboardView = renderDashboardView;
window.initDashboardData = initDashboardData;
window.inspectThreat = inspectThreat;
window.refreshDashboard = refreshDashboard;
