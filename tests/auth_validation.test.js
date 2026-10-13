const assert = require('assert');
const {
  isValidEmail,
  validatePasswordStrength,
  isValidUrl
} = require('../server/middleware/validator');

console.log('Running Authentication & Validator Unit Tests...\n');

// 1. Email validation
assert.strictEqual(isValidEmail('admin@phishshield.ai'), true);
assert.strictEqual(isValidEmail('invalid-email'), false);
assert.strictEqual(isValidEmail('test@.com'), false);
console.log('✓ Email validation tests passed');

// 2. Password strength
assert.strictEqual(validatePasswordStrength('AdminPass123!').valid, true);
assert.strictEqual(validatePasswordStrength('short').valid, false);
assert.strictEqual(validatePasswordStrength('alllowercase123').valid, false);
assert.strictEqual(validatePasswordStrength('NOLOWERCASE123!').valid, false);
assert.strictEqual(validatePasswordStrength('NoNumbers!@#$').valid, false);
console.log('✓ Password strength tests passed');

// 3. URL validation
assert.strictEqual(isValidUrl('https://google.com'), true);
assert.strictEqual(isValidUrl('http://192.168.1.1:8080/path'), true);
assert.strictEqual(isValidUrl(''), false);
console.log('✓ URL validation tests passed');

console.log('\nAll Validation Unit Tests Passed Flawlessly! 🛡️');
