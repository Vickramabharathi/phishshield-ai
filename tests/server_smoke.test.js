const app = require('../server/index');
const assert = require('assert');

console.log('Testing PhishShield AI backend boot & routes...');

assert.ok(app, 'Express app should be instantiated');
console.log('✓ Express app booted cleanly');

const { classifyUrl } = require('../server/ml/classifier');
const phishResult = classifyUrl('http://pаypal-security-update.com/login');
assert.strictEqual(phishResult.prediction, 'Phishing', 'Punycode spoofing should be detected as Phishing');
console.log(`✓ ML Classifier detected phishing: ${phishResult.prediction} (${phishResult.riskLevel}, ${phishResult.confidence}%)`);

const legitResult = classifyUrl('https://github.com/trending');
assert.strictEqual(legitResult.prediction, 'Legitimate', 'GitHub should be detected as Legitimate');
console.log(`✓ ML Classifier detected legitimate: ${legitResult.prediction} (${legitResult.riskLevel}, ${legitResult.confidence}%)`);

console.log('All smoke tests passed successfully!');
