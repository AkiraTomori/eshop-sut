# EShop Platform — Verification & Validation Master Suite (README.md)

## 1. Project Information & Metadata
- **Project Name:** EShop E-Commerce Suite
- **Test Cycle:** HW02 Domain & Boundary Value Analysis (BVA) Execution
- **Academic Version:** 2.0 (Academic Session: June 2026)
- **Lead Quality Assurance Engineer:** Thái Minh Huy (Student ID: 23127379)
- **Repository Context:** Comprehensive Black-Box Verification & Security Integration Test Suite

---

## 2. Student Self-Assessment Grading Sheet

| **No.** | **Criteria** | **Grade** | **Self-Assessed Grade** |
| --- | --- | --- | --- |
| **1** | Feature A (Domain + Boundary) | 25 | 25 |
| **2** | Feature B (Domain + Boundary) | 25 | 25 |
| **3** | Feature C (Domain + Boundary) | 25 | 25 |
| **4** | Feature D (Mobile, Domain + Boundary) | 15 | 15 |
| **5** | Agent Skills | 10 | 10 |
|  | **Total** | **100** | **100** |

---

## 3. Unified Project Test Summary Dashboard

The cross-module testing dashboard displays the aggregated verification tallies derived across all 4 operational scopes running against local environments.

### 3.1 Aggregated Global Execution Metrics
- **Total Monitored Features:** 4 Distinct Sub-Systems (`FR-06`, `FR-08`, `FR-15`, `FR-04`)
- **Grand Total Test Cases Designed:** 133 Scripted Scenarios
- **Total Executed Test Cases:** 133 Routines (100% Execution Status)
- **Total Passed Test Cases:** 45 Routines
- **Total Failed Test Cases:** 88 Routines
- **Total Not Yet Executed Cases:** 0 Routines
- **Overall Project Pass Rate:** **33.83%**
- **Total Unique Defects Logged:** 55 Bugs Reported across System Repositories

---

### 3.2 Feature-by-Feature Metric Breakdown

| Module ID | Feature Name | Cases Designed | Executed | Passed | Failed | Not Run | Unique Bugs | Release Verdict |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Pool A — FR-06** | Product Detail View | 31 | 31 | 10 | 21 | 0 | 20 | **NO-GO** |
| **Pool B — FR-08** | Checkout Frontend | 17 | 17 | 9 | 8 | 0 | 8 | **NO-GO** |
| **Pool C — FR-15** | Product CRUD Admin | 54 | 54 | 13 | 41 | 0 | 17 | **NO-GO** |
| **Pool D — FR-04** | Mobile Profile Screen | 31 | 31 | 13 | 18 | 0 | 10 | **NO-GO** |

---

## 4. Operational Defect Statistics Ledger

### 4.1 Global Defect Breakdown by Severity

| Classification Severity | Pool A (FR-06) | Pool B (FR-08) | Pool C (FR-15) | Pool D (FR-04) | Cumulative Totals | Release Blocking Status |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Fatal** | 4 | 1 | 0 | 2 | **7 Bugs** | **CRITICAL BLOCKER** |
| **Serious** | 13 | 3 | 12 | 7 | **35 Bugs** | Requires structural patch remediation |
| **Medium** | 3 | 3 | 5 | 1 | **12 Bugs** | Deferrable upon project manager sign-off |
| **Cosmetic** | 0 | 1 | 0 | 0 | **1 Bug** | Minor stylistic adjustment |
| **Sum Totals** | **20** | **8** | **17** | **10** | **55 Bugs** | **Deployment Postponed** |

---

## 5. Critical Engineering Vulnerabilities & Risks

Across the four verified sub-systems, several vulnerabilities were discovered that indicate a systemic lack of server-side data validation.

1. **Critical Price Tampering Exploits (`BUG-FR06-015`, `BUG-FR08-008`):** The backend API infrastructure blindly processes incoming network payloads (`POST /api/cart` and `POST /api/checkout`) by using client-supplied price parameters. It fails to cross-reference database pricing baselines, allowing users to modify product pricing and complete transactions at arbitrary costs.
2. **Mobile Privilege Escalation Exploit (`BUG-FR04-009`):** The profile modification endpoint lacks mass-assignment protection controls. Injecting an altered role node (`"role": "admin"`) inside a regular mobile profile text update payload body promotes the account to administrator status.
3. **Authentication Lifespan Defect (`BUG-FR04-003`):** Mobile backend middleware validation nodes accept expired JWT session tokens as active authorization, allowing outdated credentials to continue modifying profile rows.
4. **Complete Lack of Input Sanitation Middleware:** Multiple independent defects across modules (e.g., `BUG-FR15-001`, `BUG-FR04-004`, `BUG-FR08-007`) indicate that the backend lacks structured validation filters. This allows zero-value parameters, negative financials, strings where integers are expected, and empty strings to pass unchecked into SQLite database records.

---

## 6. Agent Skill

This is a playlist include workflow agent skills:
- [Agent Skills Playlist](https://www.youtube.com/playlist?list=PLgGPaxSdXWENoaH4exHolljORrP12RMgA)

If the above link can't be accesss, below here are 7 videos agent skill end-to-end:
- [Phase 1](https://www.youtube.com/watch?v=kYfGiNMYsdw&list=PLgGPaxSdXWENoaH4exHolljORrP12RMgA)
- [Phase 2](https://www.youtube.com/watch?v=KyLHqfioQk8&list=TLPQMTgwNjIwMjbQeFC6yN5JNA&index=2)
- [Phase 3](https://www.youtube.com/watch?v=Z07Da86qIOA&list=PLgGPaxSdXWENoaH4exHolljORrP12RMgA&index=3)
- [Phase 4](https://www.youtube.com/watch?v=txwXNrA2ZCg&list=PLgGPaxSdXWENoaH4exHolljORrP12RMgA&index=4)
- Part 2 of [Phase 4](https://www.youtube.com/watch?v=0r87YFHGw-Y&list=PLgGPaxSdXWENoaH4exHolljORrP12RMgA&index=6)
- Part 1 of [Phase 5](https://www.youtube.com/watch?v=IIHykfu6Z6A&list=PLgGPaxSdXWENoaH4exHolljORrP12RMgA&index=6)