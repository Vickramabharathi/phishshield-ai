/**
 * Known targeted brand catalog used for homoglyph, Levenshtein,
 * typo-squatting and impersonation heuristic detection.
 */
const HIGH_VALUE_BRANDS = [
  { name: 'PayPal', primaryDomains: ['paypal.com'], keywords: ['paypal', 'pay-pal', 'pаypal'] },
  { name: 'Apple', primaryDomains: ['apple.com', 'icloud.com'], keywords: ['apple', 'icloud', 'appleid', 'itunes'] },
  { name: 'Microsoft', primaryDomains: ['microsoft.com', 'live.com', 'office.com', 'outlook.com'], keywords: ['microsoft', 'office365', 'outlook', 'onedrive', 'msft', 'azure', 'micros0ft'] },
  { name: 'Google', primaryDomains: ['google.com', 'gmail.com'], keywords: ['google', 'gmail', 'gsuite', 'workspace', 'goog1e'] },
  { name: 'Amazon', primaryDomains: ['amazon.com', 'aws.amazon.com'], keywords: ['amazon', 'prime-video', 'aws-security', 'amaz0n'] },
  { name: 'Netflix', primaryDomains: ['netflix.com'], keywords: ['netflix', 'netf1ix', 'netflix-verify'] },
  { name: 'Chase Bank', primaryDomains: ['chase.com'], keywords: ['chase', 'chasebank', 'chaseonline'] },
  { name: 'Bank of America', primaryDomains: ['bankofamerica.com'], keywords: ['bankofamerica', 'bofa', 'bank-of-america'] },
  { name: 'Wells Fargo', primaryDomains: ['wellsfargo.com'], keywords: ['wellsfargo', 'wells-fargo'] },
  { name: 'MetaMask', primaryDomains: ['metamask.io'], keywords: ['metamask', 'metamvsk', 'meta-mask', 'metamask-wallet'] },
  { name: 'Binance', primaryDomains: ['binance.com'], keywords: ['binance', 'binance-auth', 'b1nance'] },
  { name: 'Coinbase', primaryDomains: ['coinbase.com'], keywords: ['coinbase', 'c0inbase', 'coinbase-pro'] },
  { name: 'Facebook', primaryDomains: ['facebook.com', 'meta.com'], keywords: ['facebook', 'faceb00k', 'meta-support', 'fb-security'] },
  { name: 'Instagram', primaryDomains: ['instagram.com'], keywords: ['instagram', 'insta-verify', 'ig-badge'] },
  { name: 'LinkedIn', primaryDomains: ['linkedin.com'], keywords: ['linkedin', 'linked-in'] },
  { name: 'Dropbox', primaryDomains: ['dropbox.com'], keywords: ['dropbox', 'drop-box'] },
  { name: 'DHL', primaryDomains: ['dhl.com'], keywords: ['dhl-tracking', 'dhl-express', 'dhl-delivery'] },
  { name: 'FedEx', primaryDomains: ['fedex.com'], keywords: ['fedex-tracking', 'fedex-delivery'] },
  { name: 'Steam', primaryDomains: ['steampowered.com', 'steamcommunity.com'], keywords: ['steamcommunity', 'steampowered', 'steam-gift'] },
  { name: 'DocuSign', primaryDomains: ['docusign.net', 'docusign.com'], keywords: ['docusign', 'docus1gn'] }
];

const HIGH_RISK_TLDS = new Set([
  'xyz', 'top', 'icu', 'work', 'buzz', 'cam', 'live', 'tk', 'ml', 'ga', 'cf',
  'gq', 'vip', 'monster', 'club', 'rest', 'wang', 'fit', 'space', 'surf', 'cyou'
]);

const TRUSTED_DOMAINS = new Set([
  'google.com', 'github.com', 'microsoft.com', 'apple.com', 'amazon.com',
  'wikipedia.org', 'cloudflare.com', 'mozilla.org', 'mit.edu', 'stanford.edu',
  'harvard.edu', 'nih.gov', 'cisa.gov', 'nist.gov', 'stackoverflow.com',
  'linkedin.com', 'paypal.com', 'chase.com', 'netflix.com'
]);

const SUSPICIOUS_KEYWORDS = [
  'login', 'signin', 'sign-in', 'log-in', 'verify', 'verification', 'update',
  'banking', 'secure', 'security', 'account', 'wallet', 'confirm', 'auth',
  'authenticate', 'recover', 'billing', 'suspended', 'unlock', 'password',
  'credential', 'validate', 'renew', 'airdrop', 'claim', 'refund', 'invoice',
  'payment', 'support', 'helpdesk', 'resolution', 'alert', 'dispute'
];

module.exports = {
  HIGH_VALUE_BRANDS,
  HIGH_RISK_TLDS,
  TRUSTED_DOMAINS,
  SUSPICIOUS_KEYWORDS
};
