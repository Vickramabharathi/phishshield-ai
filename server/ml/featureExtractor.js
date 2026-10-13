const { URL } = require('url');
const { HIGH_VALUE_BRANDS, HIGH_RISK_TLDS, TRUSTED_DOMAINS, SUSPICIOUS_KEYWORDS } = require('./brandList');

// Compute Shannon Entropy for a string (measures randomness / DGA generation)
function calculateShannonEntropy(str) {
  if (!str || str.length === 0) return 0;
  const frequencies = {};
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    frequencies[char] = (frequencies[char] || 0) + 1;
  }
  let entropy = 0;
  const len = str.length;
  for (const char in frequencies) {
    const p = frequencies[char] / len;
    entropy -= p * Math.log2(p);
  }
  return parseFloat(entropy.toFixed(3));
}

// Levenshtein distance between two strings
function levenshteinDistance(a, b) {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

// Check for Homoglyphs (Cyrillic, Greek lookalikes replacing Latin)
function detectHomoglyphs(str) {
  // Common Cyrillic lookalikes: а (U+0430), с (U+0441), е (U+0435), о (U+043E), р (U+0440), х (U+0445), у (U+0443), і (U+0456)
  const cyrillicRegex = /[\u0400-\u04FF]/;
  const greekRegex = /[\u0370-\u03FF]/;
  const punycodePrefix = str.toLowerCase().includes('xn--');
  const hasLookalike = cyrillicRegex.test(str) || greekRegex.test(str);
  return punycodePrefix || hasLookalike;
}

// Common URL shorteners
const SHORTENERS = new Set([
  'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'is.gd', 'buff.ly', 'rebrand.ly'
]);

function extractFeatures(rawUrl) {
  let normalizedUrl = rawUrl.trim();
  if (!/^https?:\/\//i.test(normalizedUrl)) {
    normalizedUrl = 'http://' + normalizedUrl;
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(normalizedUrl);
  } catch (err) {
    // Fallback for malformed URLs
    parsedUrl = {
      hostname: normalizedUrl.replace(/^https?:\/\//, '').split('/')[0].split('?')[0],
      pathname: '/' + (normalizedUrl.split('/')[1] || ''),
      search: '',
      protocol: normalizedUrl.startsWith('https') ? 'https:' : 'http:'
    };
  }

  const hostname = (parsedUrl.hostname || '').toLowerCase();
  const pathname = parsedUrl.pathname || '';
  const search = parsedUrl.search || '';
  const protocol = (parsedUrl.protocol || 'http:').replace(':', '').toLowerCase();

  // Lexical & Structural Metrics
  const urlLength = rawUrl.length;
  const domainLength = hostname.length;
  const pathLength = pathname.length;

  // Domain parts
  const domainParts = hostname.split('.');
  const tld = domainParts.length > 1 ? domainParts[domainParts.length - 1] : '';
  const registeredDomain = domainParts.length >= 2 ? domainParts.slice(-2).join('.') : hostname;
  const subdomainCount = Math.max(0, domainParts.length - 2);

  // IP Address check (IPv4, IPv6, port or hex)
  const ipv4Regex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}(?::[0-9]+)?$/;
  const hasIpAddress = ipv4Regex.test(hostname) || /\[?[a-f0-9:]+\]?/i.test(hostname) && hostname.includes(':');

  // Character counts
  const hyphenCountDomain = (hostname.match(/-/g) || []).length;
  const digitCountDomain = (hostname.match(/[0-9]/g) || []).length;
  const digitRatioDomain = domainLength > 0 ? parseFloat((digitCountDomain / domainLength).toFixed(3)) : 0;
  const hasAtSymbol = rawUrl.includes('@');
  const hasDoubleSlashRedirect = pathname.includes('//');

  // Homoglyph & Punycode
  const hasPunycodeOrHomoglyph = detectHomoglyphs(rawUrl) || detectHomoglyphs(hostname);

  // Non-standard port
  const hasNonStandardPort = Boolean(parsedUrl.port && !['80', '443'].includes(parsedUrl.port));

  // TLD Risk Score
  let tldRiskScore = 0.1;
  if (HIGH_RISK_TLDS.has(tld)) {
    tldRiskScore = 0.88;
  } else if (['edu', 'gov', 'mil', 'org'].includes(tld)) {
    tldRiskScore = 0.02;
  } else if (['com', 'net', 'io'].includes(tld)) {
    tldRiskScore = 0.15;
  }

  // Keywords Analysis
  const lowerUrl = rawUrl.toLowerCase();
  const matchedKeywords = [];
  for (const kw of SUSPICIOUS_KEYWORDS) {
    if (lowerUrl.includes(kw)) {
      matchedKeywords.push(kw);
    }
  }

  // Shannon Entropy
  const shannonEntropyDomain = calculateShannonEntropy(hostname);
  const shannonEntropyUrl = calculateShannonEntropy(rawUrl);

  // Brand Impersonation / Typo-squatting analysis
  let brandImpersonationDetected = false;
  let impersonatedBrand = null;
  let brandSimilarityScore = 0.0;

  // Check if domain is already on trusted list
  const isTrustedDomain = TRUSTED_DOMAINS.has(registeredDomain) || TRUSTED_DOMAINS.has(hostname);

  if (!isTrustedDomain) {
    for (const brand of HIGH_VALUE_BRANDS) {
      // Check if primary domain matches
      const isOfficial = brand.primaryDomains.some((d) => hostname === d || hostname.endsWith('.' + d));
      if (isOfficial) continue;

      // Check keywords inside domain or subdomain
      for (const kw of brand.keywords) {
        if (hostname.includes(kw)) {
          brandImpersonationDetected = true;
          impersonatedBrand = brand.name;
          brandSimilarityScore = 0.95;
          break;
        }
      }

      // Check Levenshtein distance against brand name
      if (!brandImpersonationDetected) {
        const brandKey = brand.keywords[0];
        const dist = levenshteinDistance(registeredDomain.split('.')[0], brandKey);
        if (dist === 1 || (dist === 2 && brandKey.length > 5)) {
          brandImpersonationDetected = true;
          impersonatedBrand = brand.name;
          brandSimilarityScore = parseFloat((1 - dist / Math.max(brandKey.length, registeredDomain.length)).toFixed(2));
          break;
        }
      }

      if (brandImpersonationDetected) break;
    }
  }

  // https keyword in domain trick (e.g. https-chase-update.com)
  const hasHttpsInDomain = hostname.includes('https') || hostname.includes('http-');

  // URL Shortener
  const hasUrlShortener = SHORTENERS.has(hostname);

  // Depth
  const pathDepth = pathname.split('/').filter(Boolean).length;
  const queryParamCount = search ? search.split('&').length : 0;

  return {
    rawUrl,
    normalizedUrl,
    hostname,
    pathname,
    protocol,
    tld,
    registeredDomain,
    isTrustedDomain,
    // Lexical features
    urlLength,
    domainLength,
    pathLength,
    subdomainCount,
    hyphenCountDomain,
    digitCountDomain,
    digitRatioDomain,
    hasIpAddress,
    hasAtSymbol,
    hasDoubleSlashRedirect,
    hasPunycodeOrHomoglyph,
    hasNonStandardPort,
    port: parsedUrl.port || (protocol === 'https' ? '443' : '80'),
    // Heuristics
    hasHttpsInDomain,
    hasUrlShortener,
    pathDepth,
    queryParamCount,
    tldRiskScore,
    matchedKeywords,
    suspiciousKeywordsCount: matchedKeywords.length,
    // Information theory
    shannonEntropyDomain,
    shannonEntropyUrl,
    // Brand detection
    brandImpersonationDetected,
    impersonatedBrand,
    brandSimilarityScore
  };
}

module.exports = {
  extractFeatures,
  calculateShannonEntropy,
  levenshteinDistance,
  detectHomoglyphs
};
