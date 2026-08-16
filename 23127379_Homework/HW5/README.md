# HW05 — Performance Testing Report
**Student ID**: 23127379
**Course**: Software Testing — HCMUS
**Submission Date**: 2026-08-16
**EShop SUT**: http://localhost:3000 | [Repository](https://github.com/ttbhanh/eshop-sut)

---

## Test Summary Report

### Scenarios Run

| # | Scenario | Endpoint Group | Endpoints | Test Plan File | Status |
|---|----------|----------------|-----------|----------------|--------|
| 1 | Load Testing | Read-heavy | `GET /api/products`, `GET /api/products/:id` | `23127379_Load_20260813.js` | ✅ Complete |
| 2 | Spike Testing | Auth-heavy | `POST /api/login`, `PUT /api/users/me` | `23127379_Spike_20260814.js` | ✅ Complete |
| 3 | Stress Testing | Transactional | `POST /api/cart` → `POST /api/checkout` | `23127379_Stress_20260814.js` | ✅ Complete |

### Endpoint Groups Covered

| Group | Scenario | Endpoints |
|---|---|---|
| Read-heavy | Load Testing | `GET /api/products`, `GET /api/products/:id` |
| Auth-heavy | Spike Testing | `POST /api/login`, `PUT /api/users/me` (incl. account lockout) |
| Transactional | Stress Testing | `POST /api/cart`, `POST /api/checkout` |

### Performance Results Summary

| Scenario | p95 (ms) | Error Rate | Throughput | Notes |
|----------|----------|------------|------------|-------|
| Load Test | 2.286ms | 0.00% | 53.56 req/s | Perfect stability up to 150 VUs |
| Spike Test | 5.744ms | 0.00% | 76.52 req/s | Recovery time: ~120s |
| Stress Test | 34.70ms | 0.00% | 108.08 req/s | Breaking point: > 200 users |

### Endurance Threshold (Soak Test)
- **Test duration**: 15 minutes at sustained load
- **Maximum stable RPS**: 55 req/s
- **Memory ceiling**: 120 MB
- **Hardware**: Apple M5, 16GB RAM, macOS

### Report Views Used

| # | Report Type | Scenario |
|---|---|---|
| 1 | CSV Raw Export (`--out csv`) | Load Testing |
| 2 | HTML Summary Report (`k6-reporter`) | Spike Testing |
| 3 | JSON Summary (`--summary-export`) | Stress Testing |

### Bugs & Performance Issues Found

| # | Type | Endpoint | Severity | GitHub Issue | Status |
|---|------|----------|----------|--------------|--------|
| *Total: 0 issues* | | | | | |

*No critical bugs found during test execution. System survived up to 200 VUs without exceeding error thresholds.*

### Demo Video
> [!IMPORTANT]
> 🎥 **Demo Video**: *(fill in YouTube link manually)*
> Duration: ~10 minutes | Language: Vietnamese narration

---

## Self-Assessment

| **No.** | **Criteria** | **Grade** | **Self-Assessed Grade** |
| --- | --- | --- | --- |
| **1** | Task 1 — Load testing | 20 | *(fill in)* |
| **2** | Task 1 — Stress testing | 20 | *(fill in)* |
| **3** | Task 1 — Spike testing | 20 | *(fill in)* |
| **4** | Task 2 — AI analysis + misinterpretation hunt | 10 | *(fill in)* |
| **5** | Task 3 — Continuous Performance Testing proposal | 10 | *(fill in)* |
| **6** | Agent Skills | 10 | *(fill in)* |
| | **Total** | **100** | *(fill in)* |

---

## Repository Structure

```text
23127379_Homework/HW5/
├── README.md
├── hw05_report.md                     ← main report
├── hw05_audit_log.md                  ← full AI interaction log
├── ai_audit_report.md                 ← Appendix A: AI Audit Report
├── ai_critique.md                     ← Appendix B: AI Critique (200–300 words)
├── ci_pipeline_proposal.md            ← Task 3: CI pipeline
├── lockout_reset_log.md               ← Skill 7 lockout reset history
├── git_commit_log.txt                 ← required by HW05
├── Group-1_Load_Products/
│   ├── 23127379_Load_20260813.js
│   ├── products_data.csv
│   └── results/
├── Group-2_Spike_Auth/
│   ├── 23127379_Spike_20260814.js
│   ├── auth_users.csv
│   └── results/
├── Group-3_Stress_Checkout/
│   ├── 23127379_Stress_20260814.js
│   ├── order_payloads.csv
│   └── results/
└── review_history/
```
