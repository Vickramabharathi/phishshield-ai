const assert = require('assert');
const {
  extractFeatures,
  calculateShannonEntropy,
  levenshteinDistance,
  detectHomoglyphs
} = require('../server/ml/featureExtractor');
const { classifyUrl } = require('../server/ml/classifier');

console.log('Running Feature Extractor & ML Classifier Unit Tests...\n');

// 1. Shannon Entropy
const lowEntropy = calculateShannonEntropy('google.com');
const highEntropy = calculateShannonEntropy('x9k2m8q4z1p0w7.biz');
assert.ok(highEntropy > lowEntropy, 'DGA random string should have higher entropy than english word');
console.log(`✓ Shannon Entropy: "google.com" (${lowEntropy}) vs DGA string (${highEntropy})`);

// 2. Homoglyph Detection
assert.strictEqual(detectHomoglyphs('pаypal.com'), true, 'Should detect Cyrillic lookalike "а"');
assert.strictEqual(detectHomoglyphs('xn--apple-43d.com'), true, 'Should detect Punycode xn-- prefix');
assert.strictEqual(detectHomoglyphs('apple.com'), false, 'Should not detect homoglyphs in pure ASCII');
console.log('✓ Homoglyph & Punycode detector verified');

// 3. Levenshtein Distance
assert.strictEqual(levenshteinDistance('paypal', 'paypa1'), 1, '1 character substitution should distance 1');
assert.strictEqual(levenshteinDistance('apple', 'apple'), 0, 'Exact match should distance 0');
console.log('✓ Levenshtein distance calculation verified');

// 4. Feature Extractor on Suspicious URL
const feats = extractFeatures('http://192.168.1.1:8080/login/verify-account');
assert.strictEqual(feats.hasIpAddress, true, 'Should flag IPv4 hostname');
assert.strictEqual(feats.hasNonStandardPort, true, 'Should flag port 8080');
assert.ok(feats.suspiciousKeywordsCount >= 2, 'Should flag "login" and "verify" keywords');
console.log('✓ Lexical & structural features verified');

// 5. Classifier Verdicts
const punycodeRes = classifyUrl('http://pаypal-security-update.com/login');
assert.strictEqual(punycodeRes.prediction, 'Phishing', 'Punycode URL must be flagged as Phishing');
assert.strictEqual(punycodeRes.riskLevel, 'Critical', 'Punycode attack must have Critical risk');
assert.ok(punycodeRes.reasons.length > 0, 'Must include explainable AI reasons');
assert.ok(punycodeRes.recommendations.length > 0, 'Must include security recommendations');

const trustedRes = classifyUrl('https://mit.edu/research');
assert.strictEqual(trustedRes.prediction, 'Legitimate', 'Reputable academic domain must be Legitimate');
assert.strictEqual(trustedRes.riskLevel, 'Safe', 'Academic domain must be Safe');

console.log('\nAll 5 Unit Test Suites Passed Flawlessly! 🛡️');
