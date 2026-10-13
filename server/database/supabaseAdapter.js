/**
 * PhishShield AI - Supabase Database Adapter & Bidirectional Data Mapper
 */

const supabaseManager = require('./supabaseClient');

const TABLE_MAP = {
  users: 'users',
  scans: 'scans',
  feedback: 'feedback',
  auditLogs: 'audit_logs',
  audit_logs: 'audit_logs',
  incidentReports: 'incident_reports',
  incident_reports: 'incident_reports',
  contactMessages: 'contact_messages',
  contact_messages: 'contact_messages',
  systemSettings: 'system_settings',
  system_settings: 'system_settings',
  modelMetrics: 'model_metrics',
  model_metrics: 'model_metrics'
};

/**
 * Convert application camelCase object to Supabase snake_case row
 */
function toSupabase(collection, item) {
  if (!item || typeof item !== 'object') return item;
  const table = TABLE_MAP[collection] || collection;

  switch (table) {
    case 'users':
      return {
        id: item.id,
        name: item.name,
        email: item.email,
        password: item.password,
        role: item.role || 'user',
        status: item.status || 'active',
        organization: item.organization || null,
        api_key: item.apiKey || null,
        mfa_enabled: Boolean(item.mfaEnabled),
        last_login: item.lastLogin || null,
        created_at: item.createdAt || new Date().toISOString(),
        updated_at: item.updatedAt || new Date().toISOString()
      };

    case 'scans':
      return {
        id: item.id,
        url: item.url,
        domain: item.domain || null,
        user_id: item.userId || null,
        user_email: item.userEmail || null,
        prediction: item.prediction,
        confidence: item.confidence !== undefined ? Number(item.confidence) : 50.0,
        risk_level: item.riskLevel || 'Moderate',
        phishing_probability: item.phishingProbability !== undefined ? Number(item.phishingProbability) : 0.5,
        latency_ms: item.latencyMs !== undefined ? Number(item.latencyMs) : 0,
        reasons: item.reasons || [],
        positive_indicators: item.positiveIndicators || [],
        recommendations: item.recommendations || [],
        features: item.features || {},
        created_at: item.createdAt || new Date().toISOString()
      };

    case 'feedback':
      return {
        id: item.id,
        scan_id: item.scanId || null,
        user_id: item.userId || null,
        user_email: item.userEmail || null,
        reported_as: item.reportedAs || item.userVerdict || 'Phishing',
        notes: item.notes || item.comments || '',
        created_at: item.createdAt || item.submittedAt || new Date().toISOString()
      };

    case 'audit_logs':
      return {
        id: item.id,
        user_id: item.userId || null,
        user_email: item.userEmail || null,
        action: item.action,
        details: item.details || '',
        ip: item.ip || '127.0.0.1',
        status: item.status || 'SUCCESS',
        timestamp: item.timestamp || new Date().toISOString()
      };

    case 'incident_reports':
      return {
        id: item.id,
        url: item.url,
        category: item.category || 'Zero-Day Phishing',
        description: item.description || '',
        reporter_email: item.reporterEmail || item.email || null,
        status: item.status || 'PENDING',
        created_at: item.createdAt || new Date().toISOString()
      };

    case 'contact_messages':
      return {
        id: item.id,
        name: item.name,
        email: item.email,
        subject: item.subject || '',
        message: item.message,
        status: item.status || 'UNREAD',
        created_at: item.createdAt || new Date().toISOString()
      };

    case 'system_settings':
      return {
        id: item.id || 'default',
        ml_sensitivity: item.mlSensitivity !== undefined ? Number(item.mlSensitivity) : 0.65,
        theme: item.theme || 'dark',
        auto_block_ip: item.autoBlockIp !== undefined ? Boolean(item.autoBlockIp) : true,
        email_alerts_enabled: item.emailAlertsEnabled !== undefined ? Boolean(item.emailAlertsEnabled) : true,
        webhook_url: item.webhookUrl || '',
        log_retention_days: item.logRetentionDays || 90,
        updated_at: new Date().toISOString()
      };

    case 'model_metrics':
      return {
        id: item.id || 'current',
        model_version: item.modelVersion || 'v2.4.1-hybrid-ensemble',
        algorithm: item.algorithm || 'Ensemble',
        dataset_size: item.datasetSize || 125400,
        features_extracted: item.featuresExtracted || 32,
        accuracy: item.accuracy || 98.42,
        precision: item.precision || 98.15,
        recall: item.recall || 98.71,
        f1_score: item.f1Score || 98.43,
        roc_auc: item.rocAuc || 0.9918,
        average_latency_ms: item.averageLatencyMs || 13.8,
        last_trained_at: item.lastTrainedAt || new Date().toISOString(),
        confusion_matrix: item.confusionMatrix || {},
        feature_weights: item.featureWeights || [],
        updated_at: new Date().toISOString()
      };

    default:
      return item;
  }
}

/**
 * Convert Supabase snake_case row to application camelCase object
 */
function fromSupabase(collection, row) {
  if (!row || typeof row !== 'object') return row;
  const table = TABLE_MAP[collection] || collection;

  switch (table) {
    case 'users':
      return {
        id: row.id,
        name: row.name,
        email: row.email,
        password: row.password,
        role: row.role,
        status: row.status,
        organization: row.organization,
        apiKey: row.api_key,
        mfaEnabled: row.mfa_enabled,
        lastLogin: row.last_login,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      };

    case 'scans':
      return {
        id: row.id,
        url: row.url,
        domain: row.domain,
        userId: row.user_id,
        userEmail: row.user_email,
        prediction: row.prediction,
        confidence: Number(row.confidence),
        riskLevel: row.risk_level,
        phishingProbability: Number(row.phishing_probability),
        latencyMs: Number(row.latency_ms),
        reasons: row.reasons || [],
        positiveIndicators: row.positive_indicators || [],
        recommendations: row.recommendations || [],
        features: row.features || {},
        createdAt: row.created_at
      };

    case 'feedback':
      return {
        id: row.id,
        scanId: row.scan_id,
        userId: row.user_id,
        userEmail: row.user_email,
        reportedAs: row.reported_as,
        notes: row.notes,
        createdAt: row.created_at
      };

    case 'audit_logs':
      return {
        id: row.id,
        userId: row.user_id,
        userEmail: row.user_email,
        action: row.action,
        details: row.details,
        ip: row.ip,
        status: row.status,
        timestamp: row.timestamp
      };

    case 'incident_reports':
      return {
        id: row.id,
        url: row.url,
        category: row.category,
        description: row.description,
        reporterEmail: row.reporter_email,
        status: row.status,
        createdAt: row.created_at
      };

    case 'contact_messages':
      return {
        id: row.id,
        name: row.name,
        email: row.email,
        subject: row.subject,
        message: row.message,
        status: row.status,
        createdAt: row.created_at
      };

    case 'system_settings':
      return {
        id: row.id,
        mlSensitivity: Number(row.ml_sensitivity),
        theme: row.theme,
        autoBlockIp: row.auto_block_ip,
        emailAlertsEnabled: row.email_alerts_enabled,
        webhookUrl: row.webhook_url,
        logRetentionDays: row.log_retention_days,
        updatedAt: row.updated_at
      };

    case 'model_metrics':
      return {
        id: row.id,
        modelVersion: row.model_version,
        algorithm: row.algorithm,
        datasetSize: row.dataset_size,
        featuresExtracted: row.features_extracted,
        accuracy: Number(row.accuracy),
        precision: Number(row.precision),
        recall: Number(row.recall),
        f1Score: Number(row.f1_score),
        rocAuc: Number(row.roc_auc),
        averageLatencyMs: Number(row.average_latency_ms),
        lastTrainedAt: row.last_trained_at,
        confusionMatrix: row.confusion_matrix || {},
        featureWeights: row.feature_weights || [],
        updatedAt: row.updated_at
      };

    default:
      return row;
  }
}

/**
 * Asynchronously upsert an item to Supabase table
 */
async function upsertItem(collection, item) {
  const client = supabaseManager.getClient();
  if (!client) return null;

  const table = TABLE_MAP[collection] || collection;
  const payload = toSupabase(collection, item);

  try {
    const { data, error } = await client
      .from(table)
      .upsert(payload, { onConflict: 'id' })
      .select();

    if (error) {
      console.warn(`[Supabase Sync Warning] Failed to upsert into ${table}:`, error.message);
      return null;
    }
    return data && data[0] ? fromSupabase(collection, data[0]) : payload;
  } catch (err) {
    console.warn(`[Supabase Sync Warning] Error upserting into ${table}:`, err.message);
    return null;
  }
}

/**
 * Asynchronously delete an item from Supabase table
 */
async function deleteItem(collection, id) {
  const client = supabaseManager.getClient();
  if (!client) return false;

  const table = TABLE_MAP[collection] || collection;
  try {
    const { error } = await client.from(table).delete().eq('id', id);
    if (error) {
      console.warn(`[Supabase Sync Warning] Failed to delete from ${table}:`, error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn(`[Supabase Sync Warning] Error deleting from ${table}:`, err.message);
    return false;
  }
}

/**
 * Asynchronously fetch all records from a Supabase table
 */
async function fetchAll(collection) {
  const client = supabaseManager.getClient();
  if (!client) return null;

  const table = TABLE_MAP[collection] || collection;
  try {
    const { data, error } = await client
      .from(table)
      .select('*')
      .order('created_at', { ascending: false, nullsFirst: false });

    if (error) {
      console.warn(`[Supabase Fetch Warning] Could not fetch ${table}:`, error.message);
      return null;
    }
    return (data || []).map((row) => fromSupabase(collection, row));
  } catch (err) {
    console.warn(`[Supabase Fetch Warning] Error fetching ${table}:`, err.message);
    return null;
  }
}

module.exports = {
  TABLE_MAP,
  toSupabase,
  fromSupabase,
  upsertItem,
  deleteItem,
  fetchAll
};
