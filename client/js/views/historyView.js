/**
 * PhishShield AI - Global Scan History View
 */

let historyState = {
  search: '',
  riskLevel: 'All',
  prediction: 'All',
  userOnly: false,
  page: 1,
  limit: 10,
  totalPages: 1
};

function renderHistoryView() {
  const user = window.api.getCurrentUser();

  return `
    <div class="view-header">
      <div class="view-title-group">
        <h1 class="view-title">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--cyan-primary)" stroke-width="2.5">
            <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
          </svg>
          Forensic Scan History & Audit Logs
        </h1>
        <div style="display: flex; gap: 8px;">
          <button class="btn btn-secondary btn-sm" onclick="window.exportScans('csv')">
            📥 Export CSV
          </button>
          <button class="btn btn-secondary btn-sm" onclick="window.exportScans('json')">
            📥 Export JSON
          </button>
        </div>
      </div>
      <p class="view-subtitle">
        Search and filter through historical URL scans, machine learning classification verdicts, and forensic indicator matrices.
      </p>
    </div>

    <!-- Search & Filter Controls Card -->
    <div class="cyber-card" style="margin-bottom: 24px; padding: 20px;">
      <div style="display: grid; grid-template-columns: 2fr 1fr 1fr auto; gap: 14px; align-items: flex-end;" class="history-filter-grid">
        <div class="form-group" style="margin-bottom: 0;">
          <label class="form-label">Search Query (URL, Domain, Scan ID)</label>
          <input 
            type="text" 
            id="history-search-input" 
            class="form-input" 
            placeholder="Type to filter..." 
            value="${historyState.search}"
            oninput="window.debounceHistorySearch(this.value)"
          />
        </div>

        <div class="form-group" style="margin-bottom: 0;">
          <label class="form-label">Risk Level</label>
          <select id="history-risk-filter" class="form-select" onchange="window.filterHistoryRisk(this.value)">
            <option value="All">All Risk Levels</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
            <option value="Safe">Safe</option>
          </select>
        </div>

        <div class="form-group" style="margin-bottom: 0;">
          <label class="form-label">ML Verdict</label>
          <select id="history-verdict-filter" class="form-select" onchange="window.filterHistoryVerdict(this.value)">
            <option value="All">All Verdicts</option>
            <option value="Phishing">Phishing</option>
            <option value="Legitimate">Legitimate</option>
          </select>
        </div>

        ${user ? `
          <div style="padding-bottom: 8px;">
            <label style="display: flex; align-items: center; gap: 8px; font-size: 0.88rem; color: var(--text-secondary); cursor: pointer;">
              <input type="checkbox" id="history-user-only" onchange="window.toggleUserOnly(this.checked)" />
              My Scans Only
            </label>
          </div>
        ` : ''}
      </div>
    </div>

    <!-- Scans Table Card -->
    <div class="cyber-card">
      <div class="table-responsive">
        <table class="cyber-table">
          <thead>
            <tr>
              <th>Scan ID</th>
              <th>Target URL / Domain</th>
              <th>Verdict</th>
              <th>Confidence</th>
              <th>Risk Level</th>
              <th>Latency</th>
              <th>Timestamp</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody id="history-table-body">
            <tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 30px;">Loading historical scan data...</td></tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Footer -->
      <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 20px; padding-top: 14px; border-top: 1px solid var(--border-subtle); flex-wrap: wrap; gap: 12px;">
        <span style="font-size: 0.85rem; color: var(--text-secondary);" id="history-pagination-info">
          Showing page 1 of 1
        </span>
        <div style="display: flex; gap: 8px;">
          <button class="btn btn-secondary btn-sm" id="history-prev-btn" onclick="window.changeHistoryPage(-1)" disabled>
            ← Previous
          </button>
          <button class="btn btn-secondary btn-sm" id="history-next-btn" onclick="window.changeHistoryPage(1)">
            Next →
          </button>
        </div>
      </div>
    </div>
  `;
}

async function loadHistoryData() {
  const tbody = document.getElementById('history-table-body');
  const pageInfo = document.getElementById('history-pagination-info');
  const prevBtn = document.getElementById('history-prev-btn');
  const nextBtn = document.getElementById('history-next-btn');

  if (!tbody) return;

  try {
    const res = await window.api.getHistory({
      search: historyState.search,
      riskLevel: historyState.riskLevel,
      prediction: historyState.prediction,
      userOnly: historyState.userOnly,
      page: historyState.page,
      limit: historyState.limit
    });

    historyState.totalPages = res.totalPages || 1;

    if (pageInfo) pageInfo.innerText = `Showing page ${historyState.page} of ${historyState.totalPages} (${res.total} total scans)`;
    if (prevBtn) prevBtn.disabled = historyState.page <= 1;
    if (nextBtn) nextBtn.disabled = historyState.page >= historyState.totalPages;

    if (!res.data || res.data.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; color: var(--text-muted); padding: 40px;">
            No scan records match the current filters.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = res.data.map((scan) => {
      const isPhishing = scan.prediction === 'Phishing';
      return `
        <tr>
          <td><code style="font-size: 0.8rem; color: var(--text-muted);">${scan.id.slice(0, 12)}</code></td>
          <td>
            <div style="font-weight: 600; color: var(--text-primary); max-width: 320px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${scan.url}">
              ${scan.domain || scan.url}
            </div>
            <div style="font-size: 0.78rem; color: var(--text-muted); max-width: 320px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              ${scan.url}
            </div>
          </td>
          <td>
            <span style="font-weight: 700; color: ${isPhishing ? 'var(--risk-critical)' : 'var(--risk-safe)'}; display: flex; align-items: center; gap: 4px;">
              ${isPhishing ? '⚠️ Phishing' : '🛡️ Legitimate'}
            </span>
          </td>
          <td>
            <span style="font-family: var(--font-mono); font-weight: 600;">${scan.confidence}%</span>
          </td>
          <td>
            <span class="badge ${scan.riskLevel === 'Safe' ? 'badge-safe' : scan.riskLevel === 'Low' ? 'badge-low' : scan.riskLevel === 'Medium' ? 'badge-medium' : scan.riskLevel === 'High' ? 'badge-high' : 'badge-critical'}">
              ${scan.riskLevel}
            </span>
          </td>
          <td style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-secondary);">
            ${scan.latencyMs || 14} ms
          </td>
          <td style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--font-mono);">
            ${new Date(scan.createdAt).toLocaleDateString()} ${new Date(scan.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </td>
          <td>
            <div style="display: flex; gap: 6px;">
              <button class="btn btn-secondary btn-sm" onclick="window.viewScanDetail('${scan.id}')" title="View Full Report">
                Inspect
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  } catch (err) {
    console.error('History load error:', err);
    tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--risk-critical);">Failed to load history: ${err.message}</td></tr>`;
  }
}

let searchTimer = null;
function debounceHistorySearch(val) {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    historyState.search = val.trim();
    historyState.page = 1;
    loadHistoryData();
  }, 300);
}

function filterHistoryRisk(val) {
  historyState.riskLevel = val;
  historyState.page = 1;
  loadHistoryData();
}

function filterHistoryVerdict(val) {
  historyState.prediction = val;
  historyState.page = 1;
  loadHistoryData();
}

function toggleUserOnly(checked) {
  historyState.userOnly = checked;
  historyState.page = 1;
  loadHistoryData();
}

function changeHistoryPage(delta) {
  historyState.page += delta;
  loadHistoryData();
}

async function viewScanDetail(scanId) {
  try {
    const res = await window.api.getScanById(scanId);
    if (res.data) {
      window.openScanModal(res.data);
    }
  } catch (e) {
    window.showToast('Could not open scan record: ' + e.message, 'error');
  }
}

function exportScans(format) {
  window.open(`/api/scans/export?format=${format}`, '_blank');
}

window.renderHistoryView = renderHistoryView;
window.loadHistoryData = loadHistoryData;
window.debounceHistorySearch = debounceHistorySearch;
window.filterHistoryRisk = filterHistoryRisk;
window.filterHistoryVerdict = filterHistoryVerdict;
window.toggleUserOnly = toggleUserOnly;
window.changeHistoryPage = changeHistoryPage;
window.viewScanDetail = viewScanDetail;
window.exportScans = exportScans;
