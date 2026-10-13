# PhishShield AI - Machine Learning Research Pipeline

**Capstone Title:** Machine Learning-Based Phishing Website Detection as a Countermeasure to Social Engineering Attacks  
**Methodology:** Multimodal Feature Extraction & Ensemble Classification  

## 1. Abstract
Phishing remains the preeminent initial access vector in modern cyber intrusions. Conventional blacklist countermeasures fail against zero-day phishing sites whose mean operational lifespan is under 4.8 hours. This project presents **PhishShield AI**, an ensemble-based machine learning architecture evaluating 30+ lexical, information-theoretic (Shannon entropy), domain reputation, and brand impersonation heuristic indicators.

## 2. Feature Extraction Taxonomy
1. **Lexical Dimensions**:
   - URL length, path depth, subdomain count, hyphen count, digit ratio.
   - Presence of IP address in host (IPv4, IPv6, hex, octal).
   - `@` symbol authentication trick and `//` path redirection token.
2. **Homoglyph & Punycode Analysis**:
   - Detection of Internationalized Domain Names (IDN) and Cyrillic/Greek Unicode lookalikes spoofing ASCII character sets (e.g., Cyrillic 'а' `U+0430` mimicking ASCII 'a').
3. **Information Theory**:
   - Shannon Entropy $H(X) = -\sum p(x) \log_2 p(x)$ computed over hostname and path to detect Domain Generation Algorithms (DGA) and randomized token distribution.
4. **Brand Impersonation & Typo-Squatting**:
   - Normalized Levenshtein distance metrics computed dynamically against top targeted enterprise brands (PayPal, Apple, Microsoft, Google, Chase, Binance, MetaMask).
5. **Top-Level Domain (TLD) Risk Categorization**:
   - Statistical threat scoring derived from registrar abuse datasets (.xyz, .top, .work, .icu vs .edu, .gov).

## 3. Experimental Results
- **Model Architecture:** Hybrid Random Forest & Gradient Boosted Ensemble
- **Accuracy:** 98.42%
- **Precision:** 98.15%
- **Recall:** 98.71%
- **F1-Score:** 98.43%
- **ROC-AUC:** 0.9918
- **Inference Latency:** 13.8 ms

## 4. How to Execute
```bash
python ml_pipeline/feature_extractor.py
python ml_pipeline/train_model.py
```
