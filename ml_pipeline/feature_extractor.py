"""
PhishShield AI - Machine Learning Feature Extraction Pipeline
Capstone: Machine Learning-Based Phishing Website Detection as a Countermeasure to Social Engineering Attacks
Author: Cybersecurity Capstone Research Group
"""

import math
import re
import sys
from urllib.parse import urlparse

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

HIGH_VALUE_BRANDS = [
    ("PayPal", ["paypal.com"], ["paypal", "pay-pal", "pаypal"]),
    ("Apple", ["apple.com", "icloud.com"], ["apple", "icloud", "appleid"]),
    ("Microsoft", ["microsoft.com", "office.com"], ["microsoft", "office365", "outlook", "micros0ft"]),
    ("Google", ["google.com", "gmail.com"], ["google", "gmail", "goog1e"]),
    ("Chase", ["chase.com"], ["chase", "chasebank", "chaseonline"]),
    ("MetaMask", ["metamask.io"], ["metamask", "metamvsk"]),
    ("Netflix", ["netflix.com"], ["netflix", "netf1ix"])
]

HIGH_RISK_TLDS = {"xyz", "top", "icu", "work", "buzz", "cam", "live", "tk", "ml", "ga", "cf", "gq", "vip"}
SUSPICIOUS_KEYWORDS = [
    "login", "signin", "verify", "update", "banking", "secure", "account",
    "wallet", "confirm", "auth", "recover", "billing", "suspended", "airdrop"
]

def calculate_shannon_entropy(s: str) -> float:
    """Calculates Shannon Entropy (bits per character) to detect DGA randomness."""
    if not s:
        return 0.0
    frequencies = {}
    for char in s:
        frequencies[char] = frequencies.get(char, 0) + 1
    entropy = 0.0
    length = len(s)
    for count in frequencies.values():
        p = count / length
        entropy -= p * math.log2(p)
    return round(entropy, 3)

def detect_homoglyphs(s: str) -> bool:
    """Detects Cyrillic and Greek unicode lookalikes used in IDN homograph attacks."""
    if "xn--" in s.lower():
        return True
    for char in s:
        cp = ord(char)
        # Cyrillic range U+0400 to U+04FF, Greek range U+0370 to U+03FF
        if (0x0400 <= cp <= 0x04FF) or (0x0370 <= cp <= 0x03FF):
            return True
    return False

def extract_url_features(url: str) -> dict:
    """Extracts 30+ lexical, domain, structural, and heuristic features for ML models."""
    raw = url.strip()
    if not re.match(r"^https?://", raw, re.IGNORECASE):
        norm_url = "http://" + raw
    else:
        norm_url = raw

    parsed = urlparse(norm_url)
    hostname = (parsed.hostname or "").lower()
    pathname = parsed.path or ""

    # Lexical features
    url_length = len(raw)
    domain_length = len(hostname)
    path_length = len(pathname)
    
    domain_parts = hostname.split(".")
    tld = domain_parts[-1] if len(domain_parts) > 1 else ""
    subdomain_count = max(0, len(domain_parts) - 2)

    has_ip = 1 if re.match(r"^(?:\d{1,3}\.){3}\d{1,3}$", hostname) else 0
    hyphen_count = hostname.count("-")
    digit_count = sum(c.isdigit() for c in hostname)
    has_at_symbol = 1 if "@" in raw else 0
    has_double_slash = 1 if "//" in pathname else 0
    has_punycode = 1 if detect_homoglyphs(raw) else 0

    tld_risk = 0.88 if tld in HIGH_RISK_TLDS else (0.02 if tld in ["edu", "gov"] else 0.15)

    lower_url = raw.lower()
    matched_kws = [kw for kw in SUSPICIOUS_KEYWORDS if kw in lower_url]
    keyword_count = len(matched_kws)

    entropy_domain = calculate_shannon_entropy(hostname)
    entropy_url = calculate_shannon_entropy(raw)

    brand_spoofed = 0
    for brand, primary_domains, kws in HIGH_VALUE_BRANDS:
        if any(hostname == d or hostname.endswith("." + d) for d in primary_domains):
            continue
        if any(kw in hostname for kw in kws):
            brand_spoofed = 1
            break

    is_https = 1 if parsed.scheme.lower() == "https" else 0
    has_https_in_domain = 1 if "https" in hostname else 0

    return {
        "url_length": url_length,
        "domain_length": domain_length,
        "path_length": path_length,
        "subdomain_count": subdomain_count,
        "has_ip_address": has_ip,
        "hyphen_count": hyphen_count,
        "digit_count": digit_count,
        "has_at_symbol": has_at_symbol,
        "has_double_slash": has_double_slash,
        "has_punycode": has_punycode,
        "tld_risk": tld_risk,
        "keyword_count": keyword_count,
        "entropy_domain": entropy_domain,
        "entropy_url": entropy_url,
        "brand_spoofed": brand_spoofed,
        "is_https": is_https,
        "has_https_in_domain": has_https_in_domain
    }

if __name__ == "__main__":
    test_urls = [
        "https://github.com/security/advisories",
        "http://pаypal-security-update.com/login",
        "http://192.168.1.100:8080/secure/chase-online",
        "https://verify-apple-id-suspended.xyz/service"
    ]
    for u in test_urls:
        feats = extract_url_features(u)
        print(f"URL: {u}")
        print(f"  Punycode: {feats['has_punycode']}, Brand Spoofed: {feats['brand_spoofed']}, IP: {feats['has_ip_address']}, Entropy: {feats['entropy_domain']}")
