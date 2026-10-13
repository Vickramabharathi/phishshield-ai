#!/usr/bin/env node

/**
 * PhishShield AI • Supabase Cloud Migration & Verification Utility
 * 
 * Usage:
 *   node server/database/migrateToSupabase.js              (Migrates seed/local data to Supabase)
 *   node server/database/migrateToSupabase.js --dry-run    (Tests connection without modifying data)
 *   node server/database/migrateToSupabase.js --pull       (Pulls remote data into local JSON cache)
 */

require('dotenv').config();
const path = require('path');
const config = require('../config');
const db = require('./db');
const supabaseManager = require('./supabaseClient');

async function run() {
  console.log('================================================================');
  console.log('🛡️  PhishShield AI • Supabase Cloud Database Manager');
  console.log('================================================================');

  const isDryRun = process.argv.includes('--dry-run');
  const isPull = process.argv.includes('--pull');

  console.log(`📡 Target Supabase URL: ${config.SUPABASE_URL || '(Not set in .env)'}`);
  console.log(`🔑 Service/Anon Key   : ${config.SUPABASE_ANON_KEY ? '••••••••' + config.SUPABASE_ANON_KEY.slice(-6) : '(Not set)'}`);

  if (!supabaseManager.hasConfig()) {
    console.error('\n❌ ERROR: Supabase credentials are missing!');
    console.error('Please configure your .env file with:');
    console.error('  SUPABASE_URL=https://your-project.supabase.co');
    console.error('  SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...');
    console.error('\n💡 Tip: Check out server/database/supabase_schema.sql to create your tables.');
    process.exit(1);
  }

  console.log('\n🔍 Verifying Supabase connection...');
  const conn = await supabaseManager.testConnection();

  if (!conn.connected) {
    console.error(`\n❌ Failed to connect to Supabase:`);
    console.error(`   ${conn.message}`);
    if (conn.details) {
      console.error('   Hint: Ensure you have executed `server/database/supabase_schema.sql` in your Supabase SQL Editor.');
    }
    process.exit(1);
  }

  console.log(`✅ Supabase Connection SUCCESSFUL! (Latency: ${conn.latencyMs}ms)`);

  if (isDryRun) {
    console.log('\n🧪 Dry-run completed successfully! Database is ready for traffic.');
    const remoteCounts = await supabaseManager.getTableCounts();
    console.log('Remote Table Counts:', remoteCounts);
    process.exit(0);
  }

  if (isPull) {
    console.log('\n⬇️  Pulling data from Supabase to local cache...');
    const result = await db.pullFromSupabase();
    console.log('✅ Hydrated local cache from Supabase tables:');
    console.table(result);
    process.exit(0);
  }

  console.log('\n⬆️  Pushing local database & seed data into Supabase Cloud...');
  const report = await db.pushToSupabase();

  console.log('\n📊 Migration Report:');
  console.log(`   - Users migrated           : ${report.users}`);
  console.log(`   - Scans & Threat records   : ${report.scans}`);
  console.log(`   - Feedback logs            : ${report.feedback}`);
  console.log(`   - Security Audit logs      : ${report.auditLogs}`);
  console.log(`   - Emergency Incidents      : ${report.incidentReports}`);
  console.log(`   - Contact Messages         : ${report.contactMessages}`);
  console.log(`   - System Settings Synced   : ${report.settings ? 'Yes' : 'No'}`);
  console.log(`   - ML Model Metrics Synced  : ${report.metrics ? 'Yes' : 'No'}`);

  if (report.errors && report.errors.length > 0) {
    console.warn('\n⚠️ Warnings encountered during migration:');
    report.errors.forEach((err) => console.warn(`   • ${err}`));
  } else {
    console.log('\n🎉 ALL DATA SUCCESSFULLY SYNCED TO SUPABASE CLOUD!');
  }

  console.log('================================================================');
}

run().catch((err) => {
  console.error('\n💥 Unexpected error during migration:', err);
  process.exit(1);
});
