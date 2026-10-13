const { createClient } = require('@supabase/supabase-js');
const config = require('../config');

class SupabaseManager {
  constructor() {
    this.client = null;
    this.isConfigured = false;
    this.init();
  }

  init() {
    const url = config.SUPABASE_URL;
    const key = config.SUPABASE_SERVICE_ROLE_KEY || config.SUPABASE_ANON_KEY;

    if (url && key && url.startsWith('http')) {
      try {
        this.client = createClient(url, key, {
          auth: {
            persistSession: false,
            autoRefreshToken: false
          }
        });
        this.isConfigured = true;
      } catch (err) {
        console.error('Failed to initialize Supabase client:', err.message);
        this.client = null;
        this.isConfigured = false;
      }
    } else {
      this.client = null;
      this.isConfigured = false;
    }
  }

  getClient() {
    return this.client;
  }

  hasConfig() {
    return this.isConfigured && Boolean(this.client);
  }

  /**
   * Test live connectivity to Supabase
   * @returns {Promise<{connected: boolean, latencyMs?: number, message: string, details?: any}>}
   */
  async testConnection() {
    if (!this.hasConfig()) {
      return {
        connected: false,
        message: 'Supabase credentials are not configured in environment variables (SUPABASE_URL and SUPABASE_ANON_KEY).'
      };
    }

    const start = Date.now();
    try {
      // Query users table for a quick count/existence check
      const { data, error, count } = await this.client
        .from('users')
        .select('id', { count: 'exact', head: true });

      const latencyMs = Date.now() - start;

      if (error) {
        return {
          connected: false,
          latencyMs,
          message: `Supabase query returned error: ${error.message} (Code: ${error.code})`,
          details: error
        };
      }

      return {
        connected: true,
        latencyMs,
        message: 'Successfully connected to Supabase PostgreSQL database.',
        userCount: count ?? 0
      };
    } catch (err) {
      return {
        connected: false,
        latencyMs: Date.now() - start,
        message: `Failed to reach Supabase: ${err.message}`
      };
    }
  }

  /**
   * Fetch table counts from Supabase
   */
  async getTableCounts() {
    if (!this.hasConfig()) {
      return null;
    }

    const tables = ['users', 'scans', 'audit_logs', 'feedback', 'incident_reports', 'contact_messages'];
    const counts = {};

    await Promise.all(
      tables.map(async (table) => {
        try {
          const { count, error } = await this.client
            .from(table)
            .select('id', { count: 'exact', head: true });
          counts[table] = error ? null : (count ?? 0);
        } catch {
          counts[table] = null;
        }
      })
    );

    return counts;
  }
}

const supabaseManager = new SupabaseManager();
module.exports = supabaseManager;
