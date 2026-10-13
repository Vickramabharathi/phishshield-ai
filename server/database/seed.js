const bcrypt = require('bcryptjs');

function generateInitialSeedData() {
  const salt = bcrypt.genSaltSync(10);

  // Pre-hashed passwords for instant startup
  const adminPasswordHash = bcrypt.hashSync('AdminPass123!@#', salt);
  const analystPasswordHash = bcrypt.hashSync('AnalystPass123!', salt);
  const userPasswordHash = bcrypt.hashSync('UserPass123!', salt);

  const users = [
    {
      id: 'usr-admin-001',
      name: 'Alex Vance',
      email: 'admin@phishshield.ai',
      password: adminPasswordHash,
      role: 'admin',
      status: 'active',
      organization: 'PhishShield Security Labs',
      apiKey: 'ps_live_a89f3c92e1047db26910a3c2',
      mfaEnabled: true,
      lastLogin: new Date(Date.now() - 1000 * 60 * 32).toISOString(),
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString()
    },
    {
      id: 'usr-analyst-002',
      name: 'Elena Rostova',
      email: 'analyst@phishshield.ai',
      password: analystPasswordHash,
      role: 'analyst',
      status: 'active',
      organization: 'Cyber Defense Operations Center (SOC)',
      apiKey: 'ps_live_f42c1788e0915ab98721c4b1',
      mfaEnabled: true,
      lastLogin: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString()
    },
    {
      id: 'usr-user-003',
      name: 'Jordan Miller',
      email: 'user@phishshield.ai',
      password: userPasswordHash,
      role: 'user',
      status: 'active',
      organization: 'FinTech Corp SecOps',
      apiKey: 'ps_live_b7104e63d8919cf10928a9f0',
      mfaEnabled: false,
      lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString()
    }
  ];

  const initialScans = [
    {
      id: 'scn-9021-001',
      url: 'http://pаypal-security-update.com/login?token=89432f81',
      domain: 'pаypal-security-update.com',
      userId: 'usr-admin-001',
      userEmail: 'admin@phishshield.ai',
      prediction: 'Phishing',
      confidence: 99.4,
      riskLevel: 'Critical',
      phishingProbability: 0.994,
      latencyMs: 14,
      reasons: [
        'Homoglyph / Punycode character detected in domain (Cyrillic "а" \\u0430 spoofing ASCII "a")',
        'High-value brand impersonation detected targeting "PayPal"',
        'Suspicious credential harvesting keywords: ["login", "security", "update"]',
        'Unencrypted HTTP protocol used for sensitive authentication transaction'
      ],
      positiveIndicators: [],
      recommendations: [
        'CRITICAL: Immediate credential revocation for any accounts entered here',
        'Add domain "pаypal-security-update.com" to enterprise firewall & DNS sinkhole',
        'Submit automated takedown request via registrar abuse desk',
        'Purge active employee browser session cookies'
      ],
      features: {
        urlLength: 56,
        domainLength: 26,
        subdomains: 0,
        hasIpAddress: false,
        hasAtSymbol: false,
        hasPunycode: true,
        suspiciousKeywords: 3,
        shannonEntropyDomain: 3.42,
        tldRiskScore: 0.35,
        brandImpersonationScore: 0.96,
        impersonatedBrand: 'PayPal'
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString()
    },
    {
      id: 'scn-9021-002',
      url: 'https://github.com/security/advisories',
      domain: 'github.com',
      userId: 'usr-analyst-002',
      userEmail: 'analyst@phishshield.ai',
      prediction: 'Legitimate',
      confidence: 99.1,
      riskLevel: 'Safe',
      phishingProbability: 0.009,
      latencyMs: 11,
      reasons: [],
      positiveIndicators: [
        'Globally established authoritative domain with pristine reputation',
        'Strict TLS 1.3 encryption with verified EV/OV certificate',
        'Standard lexical path structure without obfuscation or redirection patterns',
        'Low Shannon entropy (2.81 bits) indicating natural linguistic nomenclature'
      ],
      recommendations: [
        'URL confirmed safe for enterprise navigation',
        'No malicious redirection or credential harvesting triggers found'
      ],
      features: {
        urlLength: 39,
        domainLength: 10,
        subdomains: 0,
        hasIpAddress: false,
        hasAtSymbol: false,
        hasPunycode: false,
        suspiciousKeywords: 1,
        shannonEntropyDomain: 2.81,
        tldRiskScore: 0.05,
        brandImpersonationScore: 0.0,
        impersonatedBrand: null
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString()
    },
    {
      id: 'scn-9021-003',
      url: 'http://192.168.1.105:8080/secure/chase-online-banking/auth.php',
      domain: '192.168.1.105:8080',
      userId: 'usr-admin-001',
      userEmail: 'admin@phishshield.ai',
      prediction: 'Phishing',
      confidence: 98.7,
      riskLevel: 'Critical',
      phishingProbability: 0.987,
      latencyMs: 16,
      reasons: [
        'Raw IPv4 address used in hostname instead of registered domain name',
        'Non-standard port 8080 bound to sensitive financial authentication route',
        'Targeted financial brand spoofing ("Chase Bank")',
        'Insecure cleartext HTTP transmission of banking credentials'
      ],
      positiveIndicators: [],
      recommendations: [
        'Block raw IP address in edge perimeter router ACLs',
        'Audit network ingress logs for internal beaconing to port 8080',
        'Trigger SOC incident ticket: Potential internal phishing C2 server'
      ],
      features: {
        urlLength: 63,
        domainLength: 18,
        subdomains: 0,
        hasIpAddress: true,
        hasAtSymbol: false,
        hasPunycode: false,
        suspiciousKeywords: 4,
        shannonEntropyDomain: 2.15,
        tldRiskScore: 0.90,
        brandImpersonationScore: 0.92,
        impersonatedBrand: 'Chase Bank'
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 110).toISOString()
    },
    {
      id: 'scn-9021-004',
      url: 'https://verify-apple-id-suspended.xyz/service/login',
      domain: 'verify-apple-id-suspended.xyz',
      userId: 'usr-user-003',
      userEmail: 'user@phishshield.ai',
      prediction: 'Phishing',
      confidence: 97.8,
      riskLevel: 'High',
      phishingProbability: 0.978,
      latencyMs: 15,
      reasons: [
        'High-risk abused Top-Level Domain (.xyz) frequently leveraged in zero-day campaigns',
        'Brand spoofing keywords targeting Apple Inc.',
        'Urgency-inducing social engineering keywords: ["suspended", "verify", "service"]',
        'Hyphenated domain structure designed to imitate authentic corporate subdomains'
      ],
      positiveIndicators: [],
      recommendations: [
        'Do not submit Apple ID, password, or two-factor SMS codes',
        'Submit URL to Apple Security (reportphishing@apple.com)',
        'Check device for unapproved configuration profiles'
      ],
      features: {
        urlLength: 53,
        domainLength: 30,
        subdomains: 0,
        hasIpAddress: false,
        hasAtSymbol: false,
        hasPunycode: false,
        suspiciousKeywords: 4,
        shannonEntropyDomain: 3.78,
        tldRiskScore: 0.85,
        brandImpersonationScore: 0.88,
        impersonatedBrand: 'Apple'
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString()
    },
    {
      id: 'scn-9021-005',
      url: 'https://docs.google.com/document/d/1A-example-presentation/edit',
      domain: 'docs.google.com',
      userId: 'usr-user-003',
      userEmail: 'user@phishshield.ai',
      prediction: 'Legitimate',
      confidence: 99.5,
      riskLevel: 'Safe',
      phishingProbability: 0.005,
      latencyMs: 12,
      reasons: [],
      positiveIndicators: [
        'Official Google cloud collaboration infrastructure',
        'High-reputation top level domain and verified organization certificates',
        'Legitimate document hash query structure'
      ],
      recommendations: [
        'Safe to open and view document',
        'Standard reminder: Review external document contents before clicking embedded links'
      ],
      features: {
        urlLength: 64,
        domainLength: 15,
        subdomains: 1,
        hasIpAddress: false,
        hasAtSymbol: false,
        hasPunycode: false,
        suspiciousKeywords: 0,
        shannonEntropyDomain: 2.74,
        tldRiskScore: 0.05,
        brandImpersonationScore: 0.0,
        impersonatedBrand: null
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString()
    },
    {
      id: 'scn-9021-006',
      url: 'https://metamvsk-airdrop-claim.top/connect-wallet',
      domain: 'metamvsk-airdrop-claim.top',
      userId: 'usr-analyst-002',
      userEmail: 'analyst@phishshield.ai',
      prediction: 'Phishing',
      confidence: 99.1,
      riskLevel: 'Critical',
      phishingProbability: 0.991,
      latencyMs: 13,
      reasons: [
        'Typo-squatting brand spoofing targeting Web3 wallet "MetaMask" (v substituted for u)',
        'Abused cheap TLD (.top) associated with crypto drainer malware kits',
        'Deceptive cryptocurrency social engineering bait ("airdrop-claim")',
        'Suspicious wallet authorization endpoint'
      ],
      positiveIndicators: [],
      recommendations: [
        'CRITICAL: NEVER sign Web3 eth_sign or permit transactions on this domain',
        'Add address to browser Web3 shield blacklists (MetaMask Phishing Detect)',
        'Report domain to chainabuse.com and Cloudflare trust & safety'
      ],
      features: {
        urlLength: 51,
        domainLength: 26,
        subdomains: 0,
        hasIpAddress: false,
        hasAtSymbol: false,
        hasPunycode: false,
        suspiciousKeywords: 2,
        shannonEntropyDomain: 3.65,
        tldRiskScore: 0.88,
        brandImpersonationScore: 0.91,
        impersonatedBrand: 'MetaMask'
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 320).toISOString()
    },
    {
      id: 'scn-9021-007',
      url: 'https://aws.amazon.com/console/',
      domain: 'aws.amazon.com',
      userId: 'usr-admin-001',
      userEmail: 'admin@phishshield.ai',
      prediction: 'Legitimate',
      confidence: 99.4,
      riskLevel: 'Safe',
      phishingProbability: 0.006,
      latencyMs: 10,
      reasons: [],
      positiveIndicators: [
        'Authentic AWS cloud provider infrastructure',
        'Valid organizational SAN SSL/TLS certificate',
        'Consistent domain taxonomy'
      ],
      recommendations: [
        'Verified authentic management portal',
        'Ensure Multi-Factor Authentication (MFA) is active on IAM accounts'
      ],
      features: {
        urlLength: 30,
        domainLength: 14,
        subdomains: 1,
        hasIpAddress: false,
        hasAtSymbol: false,
        hasPunycode: false,
        suspiciousKeywords: 0,
        shannonEntropyDomain: 2.89,
        tldRiskScore: 0.05,
        brandImpersonationScore: 0.0,
        impersonatedBrand: null
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 420).toISOString()
    },
    {
      id: 'scn-9021-008',
      url: 'http://netflix-billing-update.account-secure-verify.work/reactivate',
      domain: 'netflix-billing-update.account-secure-verify.work',
      userId: 'usr-user-003',
      userEmail: 'user@phishshield.ai',
      prediction: 'Phishing',
      confidence: 98.9,
      riskLevel: 'Critical',
      phishingProbability: 0.989,
      latencyMs: 15,
      reasons: [
        'Extreme subdomain nesting and obfuscation (3 levels)',
        'Unsolicited billing lure targeting Netflix streaming service',
        'High abuse top-level domain (.work)',
        'Excessive hyphen token chaining (5 hyphens across hostname)'
      ],
      positiveIndicators: [],
      recommendations: [
        'Do not submit credit card or CVV details',
        'Verify subscription status directly in official Netflix mobile app',
        'Report message to phishing@netflix.com'
      ],
      features: {
        urlLength: 72,
        domainLength: 49,
        subdomains: 2,
        hasIpAddress: false,
        hasAtSymbol: false,
        hasPunycode: false,
        suspiciousKeywords: 4,
        shannonEntropyDomain: 4.12,
        tldRiskScore: 0.86,
        brandImpersonationScore: 0.94,
        impersonatedBrand: 'Netflix'
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 560).toISOString()
    },
    {
      id: 'scn-9021-009',
      url: 'https://microsoft.com/en-us/security/business',
      domain: 'microsoft.com',
      userId: 'usr-analyst-002',
      userEmail: 'analyst@phishshield.ai',
      prediction: 'Legitimate',
      confidence: 99.2,
      riskLevel: 'Safe',
      phishingProbability: 0.008,
      latencyMs: 11,
      reasons: [],
      positiveIndicators: [
        'Official Microsoft corporate digital presence',
        'Reputable top-level domain with DNSSEC verification',
        'Canonical security documentation URL'
      ],
      recommendations: ['Safe for organizational reference and review'],
      features: {
        urlLength: 45,
        domainLength: 13,
        subdomains: 0,
        hasIpAddress: false,
        hasAtSymbol: false,
        hasPunycode: false,
        suspiciousKeywords: 1,
        shannonEntropyDomain: 2.92,
        tldRiskScore: 0.05,
        brandImpersonationScore: 0.0,
        impersonatedBrand: null
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 680).toISOString()
    },
    {
      id: 'scn-9021-010',
      url: 'https://micros0ft-office365-login.icu/owa/auth',
      domain: 'micros0ft-office365-login.icu',
      userId: 'usr-admin-001',
      userEmail: 'admin@phishshield.ai',
      prediction: 'Phishing',
      confidence: 99.3,
      riskLevel: 'Critical',
      phishingProbability: 0.993,
      latencyMs: 14,
      reasons: [
        'Leetspeak character substitution: "micros0ft" (zero in place of "o")',
        'Targeted enterprise credential harvesting targeting Microsoft 365 Outlook Web App (OWA)',
        'Abused cheap registrar TLD (.icu)',
        'Heuristic entropy indicates deceptive token obfuscation'
      ],
      positiveIndicators: [],
      recommendations: [
        'Initiate enterprise password reset for any victim user',
        'Revoke OAuth refresh tokens and invalidate Entra ID sessions',
        'Add block rule to Microsoft Defender for Cloud Apps'
      ],
      features: {
        urlLength: 47,
        domainLength: 29,
        subdomains: 0,
        hasIpAddress: false,
        hasAtSymbol: false,
        hasPunycode: false,
        suspiciousKeywords: 3,
        shannonEntropyDomain: 3.71,
        tldRiskScore: 0.91,
        brandImpersonationScore: 0.95,
        impersonatedBrand: 'Microsoft'
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 820).toISOString()
    }
  ];

  const auditLogs = [
    {
      id: 'aud-001',
      timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      userId: 'usr-admin-001',
      userEmail: 'admin@phishshield.ai',
      action: 'URL_SCAN_EXECUTED',
      details: 'Scanned URL: http://pаypal-security-update.com (Verdict: Phishing, Confidence: 99.4%)',
      ip: '192.168.1.45',
      status: 'SUCCESS'
    },
    {
      id: 'aud-002',
      timestamp: new Date(Date.now() - 1000 * 60 * 32).toISOString(),
      userId: 'usr-admin-001',
      userEmail: 'admin@phishshield.ai',
      action: 'USER_LOGIN',
      details: 'User authenticated with MFA verification',
      ip: '192.168.1.45',
      status: 'SUCCESS'
    },
    {
      id: 'aud-003',
      timestamp: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
      userId: 'usr-analyst-002',
      userEmail: 'analyst@phishshield.ai',
      action: 'URL_SCAN_EXECUTED',
      details: 'Scanned URL: https://metamvsk-airdrop-claim.top (Verdict: Phishing, Confidence: 99.1%)',
      ip: '10.0.4.12',
      status: 'SUCCESS'
    },
    {
      id: 'aud-004',
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      userId: 'usr-analyst-002',
      userEmail: 'analyst@phishshield.ai',
      action: 'USER_LOGIN',
      details: 'Session initialized via security workstation',
      ip: '10.0.4.12',
      status: 'SUCCESS'
    },
    {
      id: 'aud-005',
      timestamp: new Date(Date.now() - 1000 * 60 * 185).toISOString(),
      userId: 'usr-admin-001',
      userEmail: 'admin@phishshield.ai',
      action: 'MODEL_RETRAIN_TRIGGERED',
      details: 'Ensemble model retrained on 1,200 newly verified threat telemetry samples. ROC-AUC updated to 0.9918.',
      ip: '192.168.1.45',
      status: 'SUCCESS'
    },
    {
      id: 'aud-006',
      timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
      userId: 'usr-user-003',
      userEmail: 'user@phishshield.ai',
      action: 'USER_LOGIN',
      details: 'Regular user login via web portal',
      ip: '172.16.8.21',
      status: 'SUCCESS'
    },
    {
      id: 'aud-007',
      timestamp: new Date(Date.now() - 1000 * 60 * 400).toISOString(),
      userId: 'usr-admin-001',
      userEmail: 'admin@phishshield.ai',
      action: 'SYSTEM_SETTINGS_UPDATED',
      details: 'ML detection sensitivity threshold tuned to 0.65 (Balanced Enterprise Mode)',
      ip: '192.168.1.45',
      status: 'SUCCESS'
    }
  ];

  const modelMetrics = {
    modelVersion: 'v2.4.1-hybrid-ensemble',
    algorithm: 'Ensemble (Random Forest + Gradient Boosting + Lexical Heuristics)',
    datasetSize: 125400,
    featuresExtracted: 32,
    accuracy: 98.42,
    precision: 98.15,
    recall: 98.71,
    f1Score: 98.43,
    rocAuc: 0.9918,
    averageLatencyMs: 13.8,
    lastTrainedAt: new Date(Date.now() - 1000 * 60 * 185).toISOString(),
    confusionMatrix: {
      truePositives: 61890,
      falsePositives: 1160,
      trueNegatives: 61530,
      falseNegatives: 820
    },
    featureWeights: [
      { feature: 'Punycode / Homoglyph Presence', weight: 0.185 },
      { feature: 'Brand Impersonation / Levenshtein Distance', weight: 0.172 },
      { feature: 'Top-Level Domain (TLD) Abuse Risk', weight: 0.138 },
      { feature: 'Suspicious Keywords Count', weight: 0.126 },
      { feature: 'Shannon Entropy (Domain & Path)', weight: 0.114 },
      { feature: 'IP Address as Hostname', weight: 0.098 },
      { feature: 'Protocol & SSL Characteristics', weight: 0.075 },
      { feature: 'Subdomain Count & Path Depth', weight: 0.052 },
      { feature: 'Lexical Length & Character Distribution', weight: 0.040 }
    ]
  };

  const systemSettings = {
    mlSensitivity: 0.65,
    theme: 'dark',
    autoBlockIp: true,
    emailAlertsEnabled: true,
    webhookUrl: '',
    logRetentionDays: 90
  };

  return {
    users,
    scans: initialScans,
    auditLogs,
    modelMetrics,
    systemSettings,
    incidentReports: []
  };
}

module.exports = { generateInitialSeedData };
