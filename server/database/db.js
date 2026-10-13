const fs = require('fs');
const path = require('path');
const config = require('../config');
const { generateInitialSeedData } = require('./seed');
const supabaseManager = require('./supabaseClient');
const supabaseAdapter = require('./supabaseAdapter');

class DatabaseManager {
  constructor() {
    this.dbPath = config.DB_FILE;
    this.dataDir = config.DATA_DIR;
    this.cache = null;
    this.isWriting = false;
    this.provider = config.DB_PROVIDER || (config.SUPABASE_URL ? 'supabase' : 'local');
    this.init();
  }

  init() {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }

    if (!fs.existsSync(this.dbPath)) {
      const seedData = generateInitialSeedData();
      this.writeSync(seedData);
      this.cache = seedData;
    } else {
      try {
        const raw = fs.readFileSync(this.dbPath, 'utf8');
        this.cache = JSON.parse(raw);
        if (!this.cache.users || !this.cache.scans) {
          const seedData = generateInitialSeedData();
          this.writeSync(seedData);
          this.cache = seedData;
        }
      } catch (err) {
        console.error('Error loading database file, re-initializing seed data:', err.message);
        const seedData = generateInitialSeedData();
        this.writeSync(seedData);
        this.cache = seedData;
      }
    }

    // Check Supabase availability at boot
    if (supabaseManager.hasConfig()) {
      console.log(`[Database] Supabase Cloud integration active (${config.SUPABASE_URL})`);
    } else {
      console.log(`[Database] Running in Local Persistent Mode (${this.dbPath})`);
    }
  }

  writeSync(data) {
    const tempPath = `${this.dbPath}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf8');
    fs.renameSync(tempPath, this.dbPath);
  }

  save() {
    try {
      this.writeSync(this.cache);
    } catch (err) {
      console.error('Failed to persist database:', err.message);
    }
  }

  // --- Collection Helpers ---

  reloadFromDisk() {
    try {
      if (fs.existsSync(this.dbPath)) {
        const stats = fs.statSync(this.dbPath);
        if (!this.lastMtime || stats.mtimeMs > this.lastMtime) {
          this.lastMtime = stats.mtimeMs;
          const raw = fs.readFileSync(this.dbPath, 'utf8');
          this.cache = JSON.parse(raw);
        }
      }
    } catch (e) {
      // Preserve existing in-memory cache on read error
    }
  }

  get(collection) {
    this.reloadFromDisk();
    if (!this.cache[collection]) {
      this.cache[collection] = [];
    }
    return this.cache[collection];
  }

  find(collection, filterFn = () => true) {
    const items = this.get(collection);
    return Array.isArray(items) ? items.filter(filterFn) : [];
  }

  findOne(collection, filterFn) {
    const items = this.get(collection);
    return Array.isArray(items) ? items.find(filterFn) : null;
  }

  findById(collection, id) {
    return this.findOne(collection, (item) => item.id === id);
  }

  insert(collection, item) {
    const items = this.get(collection);
    if (!item.id) {
      item.id = `${collection.slice(0, 3)}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }
    if (!item.createdAt) {
      item.createdAt = new Date().toISOString();
    }
    items.unshift(item);
    this.save();

    // Async write-through replication to Supabase
    if (supabaseManager.hasConfig()) {
      supabaseAdapter.upsertItem(collection, item).catch((err) => {
        console.warn(`[Supabase Replication] insert failed for ${collection}/${item.id}:`, err.message);
      });
    }

    return item;
  }

  update(collection, id, updates) {
    const items = this.get(collection);
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return null;
    items[index] = { ...items[index], ...updates, updatedAt: new Date().toISOString() };
    this.save();

    // Async write-through replication to Supabase
    if (supabaseManager.hasConfig()) {
      supabaseAdapter.upsertItem(collection, items[index]).catch((err) => {
        console.warn(`[Supabase Replication] update failed for ${collection}/${id}:`, err.message);
      });
    }

    return items[index];
  }

  delete(collection, id) {
    const items = this.get(collection);
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return false;
    items.splice(index, 1);
    this.save();

    // Async write-through replication to Supabase
    if (supabaseManager.hasConfig()) {
      supabaseAdapter.deleteItem(collection, id).catch((err) => {
        console.warn(`[Supabase Replication] delete failed for ${collection}/${id}:`, err.message);
      });
    }

    return true;
  }

  count(collection, filterFn = () => true) {
    return this.find(collection, filterFn).length;
  }

  // Settings & Metrics Singletons
  getSettings() {
    return this.cache.systemSettings || {};
  }

  updateSettings(updates) {
    this.cache.systemSettings = { ...this.cache.systemSettings, ...updates };
    this.save();

    if (supabaseManager.hasConfig()) {
      supabaseAdapter.upsertItem('systemSettings', this.cache.systemSettings).catch((err) => {
        console.warn('[Supabase Replication] settings update failed:', err.message);
      });
    }

    return this.cache.systemSettings;
  }

  getModelMetrics() {
    return this.cache.modelMetrics || {};
  }

  updateModelMetrics(updates) {
    this.cache.modelMetrics = { ...this.cache.modelMetrics, ...updates };
    this.save();

    if (supabaseManager.hasConfig()) {
      supabaseAdapter.upsertItem('modelMetrics', this.cache.modelMetrics).catch((err) => {
        console.warn('[Supabase Replication] metrics update failed:', err.message);
      });
    }

    return this.cache.modelMetrics;
  }

  // --- Supabase Cloud Sync & Health Diagnostics ---

  isSupabaseConfigured() {
    return supabaseManager.hasConfig();
  }

  getSupabaseManager() {
    return supabaseManager;
  }

  getSupabaseAdapter() {
    return supabaseAdapter;
  }

  /**
   * Diagnostic check on database health & Supabase status
   */
  async getStatus() {
    const isConfigured = supabaseManager.hasConfig();
    let connResult = { connected: false, message: 'Not configured' };
    let remoteCounts = null;

    if (isConfigured) {
      connResult = await supabaseManager.testConnection();
      if (connResult.connected) {
        remoteCounts = await supabaseManager.getTableCounts();
      }
    }

    return {
      provider: isConfigured && connResult.connected ? 'supabase' : 'local',
      configured: isConfigured,
      connected: connResult.connected,
      latencyMs: connResult.latencyMs || null,
      message: connResult.message,
      supabaseUrl: config.SUPABASE_URL ? config.SUPABASE_URL.replace(/https?:\/\//, '') : null,
      localStats: {
        users: this.get('users').length,
        scans: this.get('scans').length,
        feedback: this.get('feedback').length,
        auditLogs: this.get('auditLogs').length,
        incidentReports: this.get('incidentReports').length,
        contactMessages: this.get('contactMessages').length
      },
      remoteStats: remoteCounts
    };
  }

  /**
   * Push all local data into Supabase (Initial Migration / Manual Sync)
   */
  async pushToSupabase() {
    if (!supabaseManager.hasConfig()) {
      throw new Error('Supabase is not configured. Please supply SUPABASE_URL and SUPABASE_ANON_KEY in .env');
    }

    const test = await supabaseManager.testConnection();
    if (!test.connected) {
      throw new Error(`Cannot connect to Supabase: ${test.message}`);
    }

    const report = {
      users: 0,
      scans: 0,
      feedback: 0,
      auditLogs: 0,
      incidentReports: 0,
      contactMessages: 0,
      settings: false,
      metrics: false,
      errors: []
    };

    // 1. Users
    const users = this.get('users');
    for (const u of users) {
      const res = await supabaseAdapter.upsertItem('users', u);
      if (res) report.users++;
      else report.errors.push(`Failed to sync user: ${u.email}`);
    }

    // 2. Scans
    const scans = this.get('scans');
    for (const s of scans) {
      const res = await supabaseAdapter.upsertItem('scans', s);
      if (res) report.scans++;
      else report.errors.push(`Failed to sync scan: ${s.id}`);
    }

    // 3. Feedback
    const feedback = this.get('feedback');
    for (const f of feedback) {
      const res = await supabaseAdapter.upsertItem('feedback', f);
      if (res) report.feedback++;
    }

    // 4. Audit Logs
    const auditLogs = this.get('auditLogs');
    for (const a of auditLogs) {
      const res = await supabaseAdapter.upsertItem('auditLogs', a);
      if (res) report.auditLogs++;
    }

    // 5. Incident Reports
    const incidentReports = this.get('incidentReports');
    for (const ir of incidentReports) {
      const res = await supabaseAdapter.upsertItem('incidentReports', ir);
      if (res) report.incidentReports++;
    }

    // 6. Contact Messages
    const contactMessages = this.get('contactMessages');
    for (const cm of contactMessages) {
      const res = await supabaseAdapter.upsertItem('contactMessages', cm);
      if (res) report.contactMessages++;
    }

    // 7. System Settings & Metrics
    if (this.cache.systemSettings) {
      const res = await supabaseAdapter.upsertItem('systemSettings', this.cache.systemSettings);
      if (res) report.settings = true;
    }

    if (this.cache.modelMetrics) {
      const res = await supabaseAdapter.upsertItem('modelMetrics', this.cache.modelMetrics);
      if (res) report.metrics = true;
    }

    return report;
  }

  /**
   * Pull all records from Supabase and hydrate local database cache
   */
  async pullFromSupabase() {
    if (!supabaseManager.hasConfig()) {
      throw new Error('Supabase is not configured.');
    }

    const test = await supabaseManager.testConnection();
    if (!test.connected) {
      throw new Error(`Cannot connect to Supabase: ${test.message}`);
    }

    const collections = ['users', 'scans', 'feedback', 'auditLogs', 'incidentReports', 'contactMessages'];
    const pulledStats = {};

    for (const col of collections) {
      const rows = await supabaseAdapter.fetchAll(col);
      if (Array.isArray(rows) && rows.length > 0) {
        this.cache[col] = rows;
        pulledStats[col] = rows.length;
      }
    }

    this.save();
    return pulledStats;
  }
}

const db = new DatabaseManager();
module.exports = db;
