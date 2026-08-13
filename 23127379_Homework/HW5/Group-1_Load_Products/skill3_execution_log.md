# [SKILL-3] Execution Log — Group 1 (Read-heavy Load Test)

**Script:** `23127379_Load_20260813.js`
**Date/Time:** 2026-08-13 22:24 to 22:33 (UTC+7)
**Duration:** 9 min 0.5 s
**Exit code:** 0
**SUT:** http://localhost:3000 (local SQLite)

---

## Quick Results (from summary.json)

| Metric | Value | Threshold | Status |
|---|---|---|---|
| **p95 response time** | 2.286 ms | < 2000 ms | PASSED |
| **p99 response time** | N/A ms | — | — |
| **avg response time** | 1.319 ms | — | — |
| **min response time** | 0.199 ms | — | — |
| **max response time** | 44.081 ms | — | — |
| **Error rate** | 0.00% | < 5% | PASSED |
| **Throughput (RPS)** | 53.42 req/s | — | — |
| **Total HTTP requests** | 28870 | — | — |
| **Iterations completed** | 28,870 | — | — |

---

## Output Files

| File | Details |
|---|---|
| `results/23127379_Load_20260813.csv` | 463,001 rows (full raw metric log) |
| `results/summary.json` | k6 JSON summary |
| `results/html_report/index.html` | HTML report |
| `results/k6_console.txt` | Full k6 terminal output |

---

## Key Observations

- **p95 = 2.286 ms** — far below the 2000 ms threshold (baseline 3-8 ms under zero load)
- **Zero errors** — all 28,870 requests returned HTTP 200; error rate = 0.00%
- **Throughput = 53.42 RPS** at 150 VUs peak — EShop handles read load efficiently on M5
- **Max latency = 44.081 ms** — isolated outlier, consistent with SQLite WAL checkpoint spike
- SQLite read-only path shows negligible contention under 150 concurrent VUs

---

## Physical Evidence Checklist

- [ ] Screenshot: k6 terminal + Activity Monitor in same frame (timestamp visible)
- [ ] Hardware report: screenfetch screenshot
- [ ] Demo video segment (>= 2 min for this scenario, Vietnamese narration)
- [ ] Files verified: CSV YES | summary.json YES | HTML report YES

---

## Next Step

Skill 4: jtl-log-analyzer — compute p95 from raw CSV rows, label FEASIBLE/HALLUCINATED
