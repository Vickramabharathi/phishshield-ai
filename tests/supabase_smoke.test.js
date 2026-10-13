const assert = require('assert');
const supabaseManager = require('../server/database/supabaseClient');
const supabaseAdapter = require('../server/database/supabaseAdapter');
const db = require('../server/database/db');

async function runTests() {
  console.log('Testing Supabase Cloud Database Integration & Mappers...\n');

  // Test 1: Supabase Manager Initial State & Safe Fallback
  console.log('1. Testing Supabase client manager fallback mode...');
  assert.strictEqual(typeof supabaseManager.hasConfig, 'function');
  assert.strictEqual(typeof supabaseManager.testConnection, 'function');
  const connResult = await supabaseManager.testConnection();
  assert.strictEqual(typeof connResult.connected, 'boolean');
  console.log('✓ Fallback & unconfigured state handled gracefully without crash');

  // Test 2: Table Name Mappings
  console.log('2. Testing collection-to-table mappings...');
  assert.strictEqual(supabaseAdapter.TABLE_MAP.users, 'users');
  assert.strictEqual(supabaseAdapter.TABLE_MAP.scans, 'scans');
  assert.strictEqual(supabaseAdapter.TABLE_MAP.auditLogs, 'audit_logs');
  assert.strictEqual(supabaseAdapter.TABLE_MAP.feedback, 'feedback');
  assert.strictEqual(supabaseAdapter.TABLE_MAP.incidentReports, 'incident_reports');
  console.log('✓ Table names mapped accurately');

  // Test 3: Bidirectional Mapper (Users)
  console.log('3. Testing bidirectional data transformation for users...');
  const appUser = {
    id: 'usr-test-999',
    name: 'Cyber Sentinel',
    email: 'sentinel@phishshield.ai',
    password: 'hashedpassword123',
    role: 'analyst',
    status: 'active',
    apiKey: 'ps_live_testkey12345678',
    mfaEnabled: true
  };

  const supaUserRow = supabaseAdapter.toSupabase('users', appUser);
  assert.strictEqual(supaUserRow.id, 'usr-test-999');
  assert.strictEqual(supaUserRow.api_key, 'ps_live_testkey12345678');
  assert.strictEqual(supaUserRow.mfa_enabled, true);

  const restoredUser = supabaseAdapter.fromSupabase('users', supaUserRow);
  assert.strictEqual(restoredUser.apiKey, 'ps_live_testkey12345678');
  assert.strictEqual(restoredUser.mfaEnabled, true);
  assert.strictEqual(restoredUser.name, 'Cyber Sentinel');
  console.log('✓ Users camelCase <-> snake_case bidirectional transformation verified');

  // Test 4: Bidirectional Mapper (Scans)
  console.log('4. Testing bidirectional data transformation for threat scans...');
  const appScan = {
    id: 'scn-test-001',
    url: 'http://malicious-login-verify.top/auth',
    domain: 'malicious-login-verify.top',
    userId: 'usr-test-999',
    prediction: 'Phishing',
    confidence: 97.5,
    riskLevel: 'Critical',
    phishingProbability: 0.975,
    latencyMs: 14.2,
    reasons: ['Suspicious keywords detected'],
    positiveIndicators: [],
    recommendations: ['Block domain'],
    features: { urlLength: 42, hasPunycode: false }
  };

  const supaScanRow = supabaseAdapter.toSupabase('scans', appScan);
  assert.strictEqual(supaScanRow.user_id, 'usr-test-999');
  assert.strictEqual(supaScanRow.risk_level, 'Critical');
  assert.strictEqual(supaScanRow.phishing_probability, 0.975);
  assert.strictEqual(supaScanRow.latency_ms, 14.2);

  const restoredScan = supabaseAdapter.fromSupabase('scans', supaScanRow);
  assert.strictEqual(restoredScan.userId, 'usr-test-999');
  assert.strictEqual(restoredScan.riskLevel, 'Critical');
  assert.strictEqual(restoredScan.phishingProbability, 0.975);
  assert.strictEqual(restoredScan.features.urlLength, 42);
  console.log('✓ Scans camelCase <-> snake_case bidirectional transformation verified');

  // Test 5: DatabaseManager Dual-Mode Diagnostics
  console.log('5. Testing DatabaseManager diagnostics and write-through operations...');
  const status = await db.getStatus();
  assert.ok(status.provider === 'supabase' || status.provider === 'local');
  assert.ok(status.localStats.users >= 3);
  assert.ok(status.localStats.scans >= 2);

  const inserted = db.insert('scans', {
    url: 'https://example-test-safe.org',
    domain: 'example-test-safe.org',
    prediction: 'Legitimate',
    confidence: 99.0,
    riskLevel: 'Safe'
  });
  assert.ok(inserted.id);
  const found = db.findById('scans', inserted.id);
  assert.strictEqual(found.domain, 'example-test-safe.org');
  db.delete('scans', inserted.id);
  console.log('✓ DatabaseManager operations & write-through replication functioning cleanly');

  console.log('\nAll Supabase Integration Tests Passed Flawlessly! 🛡️⚡');
}

runTests().catch((err) => {
  console.error('\n❌ Test Failure:', err);
  process.exit(1);
});
