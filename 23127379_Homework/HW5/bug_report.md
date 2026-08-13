# HW05 Bug Report — Consolidated Summary

> **Student:** 23127379 — Thái Minh Huy
>
> **Scope:** Summary only. Detailed evidence, logs, and screenshots live in each Group's folder.
>
> **GitHub Issues:** <https://github.com/AkiraTomori/eshop-sut/issues>

---

## Feature reports

| Group | Scenario | Detailed report | Confirmed bugs / Bottlenecks |
|---|---|---|---:|
| Group 1 | Load Testing | [G1-bug-report.md](Group-1_Load_Products/G1-bug-report.md) | *(TBD)* |
| Group 2 | Spike Testing | [G2-bug-report.md](Group-2_Spike_Auth/G2-bug-report.md) | *(TBD)* |
| Group 3 | Stress Testing | [G3-bug-report.md](Group-3_Stress_Checkout/G3-bug-report.md) | *(TBD)* |

## Consolidated defect index

This index contains performance bottlenecks and structural defects discovered during the stress, load, and spike testing. 

| Bug ID | Group | Title | Severity | Known/New | GitHub Issue | Detail |
|---|---|---|---|---|---|---|
| BUG-PERF-001 | *(TBD)* | *(TBD)* | *(TBD)* | *(TBD)* | *(TBD)* | *(TBD)* |
| BUG-PERF-002 | *(TBD)* | *(TBD)* | *(TBD)* | *(TBD)* | *(TBD)* | *(TBD)* |

## Notes on expected behavior

- **403 Lockout (Group 2)**: Account lockouts after 3 failed attempts are expected behavior per the system specification. These are logged for recovery time analysis but are NOT classified as system defects unless the mechanism fails.

## Group 1 — Load Test (GET /api/products/:id) — 2026-08-13

**Result:** No bugs found.
- 0 failed requests | 0 timeouts | 0 check() failures | p95 = 2.286 ms
- 11 WAL checkpoint outliers (max 44 ms) — informational only, not a defect
- No GitHub Issues filed for Group 1.
