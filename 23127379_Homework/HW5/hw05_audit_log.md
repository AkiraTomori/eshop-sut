# HW05 Global Audit Log

This file records all AI tool interactions across the entire HW05 performance testing workflow.

## Entry Format
```markdown
## [SKILL-{N}] {skill-name} — {YYYY-MM-DD HH:MM:SS}
- **Group**: {Group 1 / 2 / 3 / Final}
- **Input**: {brief description}
- **Output**: {brief description or file paths}
- **Notes**: {decisions, corrections, issues}
```

---

## Log Entries

## [SKILL-1] test-parameter-advisor — 2026-08-13 21:49:00
- **Group**: Group 1 — Read-heavy
- **Input**: Endpoint = `GET /api/products/:id`, Machine = MacBook Air M5, 16GB RAM, macOS 26.4.1 Tahoe, SUT = http://localhost:3000 (local SQLite)
- **Logic**: Scenario mapping (Read-heavy → Load Testing) + domain heuristics from SKILL.md. Baseline measured: 3–8ms per request (no load). 5 products in DB (IDs 1–5).
- **Output**: Parameter table below — VUs 50→100→150, 9-min staged load, think-time 1–2s, thresholds p95<2000ms / error<5%. Separate 15-min endurance file also planned.

## [SKILL-1] test-parameter-advisor — 2026-08-13 21:50:00
- **Group**: Group 2 — Auth-heavy
- **Input**: Endpoint = `PUT /api/users/me` (JWT required), Machine = MacBook Air M5 16GB, macOS 26.4.1 Tahoe, SUT = http://localhost:3000 (local SQLite)
- **Logic**: Scenario mapping (Auth-heavy → Spike Testing) + domain heuristics from SKILL.md. No lockout on PUT endpoint. 50 accounts to be seeded before run.
- **Output**: Spike stages 10→150 VUs in 10s, hold 1m, recovery 30s. Thresholds: p95<3000ms, error<30%. CSV: auth_users.csv.

## [SKILL-1] test-parameter-advisor — 2026-08-13 21:51:00
- **Group**: Group 3 — Transactional
- **Input**: Endpoint = `POST /api/checkout` (primary), prereq = `POST /api/cart`, Machine = MacBook Air M5 16GB, macOS 26.4.1 Tahoe, SUT = http://localhost:3000 (local SQLite)
- **Logic**: Scenario mapping (Transactional → Stress Testing) + domain heuristics from SKILL.md. Goal = find breaking point. SQLite exclusive write lock is primary risk.
- **Output**: Stepped stress 10→30→60→100→150→200 VUs (30s ramp+hold per step). Thresholds: p95<5000ms, error<10%. Breaking point = stage where checkout error rate first exceeds 10%.

## [SKILL-10] independent-reviewer (Skill 1 v1) — 2026-08-13 22:00:00
- **Group**: Group 1 — Read-heavy
- **Input**: skill1_parameters.md v1
- **Output**: skill1_v1_review.md, skill10_review_params.md, verdict
- **Notes**: [issues found: 1 Low severity issue - `body.length > 0` check is weak. Approved.]

## [SKILL-2] test-plan-generator — 2026-08-13 22:05:00
- **Group**: Group 1 — Read-heavy
- **Input**: Approved params from Skill 1 (VUs 50→100→150, p95<2000ms, error<5%, think-time 1–2s)
- **Output files**:
  - `Group-1_Load_Products/products_data.csv` (5 product IDs from live SUT)
  - `Group-1_Load_Products/23127379_Load_20260813.js` (staged load test, 9 min)
  - `Group-1_Load_Products/23127379_Load_Endurance_20260813.js` (soak test, 15 min)
  - `Group-1_Load_Products/skill2_testplan_notes.md`
- **Notes**: Strengthened check() per Skill 10 Low issue — verifies .id AND .name fields. SharedArray + papaparse. VU-deterministic row indexing via (__VU - 1) % 5.

## [SKILL-10] independent-reviewer (Skill 2 v1) — 2026-08-13 22:06:06
- **Group**: Group 1 — Read-heavy
- **Input**: 23127379_Load_20260813.js + endurance file + products_data.csv v1
- **Output**: skill2_v1_review.md, skill10_review_script.md, verdict
- **Notes**: [issues found: None. Excellent script structure, all requirements met.]

## [SKILL-3] test-execution-runner — 2026-08-13 22:24:00
- **Group**: Group 1 — Read-heavy
- **Script**: Group-1_Load_Products/23127379_Load_20260813.js
- **Duration**: 9 min 0.5s | Exit code: 0
- **Output**: 23127379_Load_20260813.csv (463,001 rows), summary.json, html_report/index.html
- **Quick results**: p95=2.286 ms PASSED | error rate=0.00% PASSED | RPS=53.42 | iterations=28,870
- **Human evidence**: [ ] screenshot  [ ] hardware report  [ ] video

## [SKILL-4] jtl-log-analyzer — 2026-08-13 22:39:00
- **Group**: Group 1 — Read-heavy
- **Input**: results/23127379_Load_20260813.csv (463,001 rows) + summary.json
- **Metric source**: http_req_duration (NOT http_req_waiting)
- **Metrics**: p95=2.286ms | avg=1.319ms | error rate=0.00% | throughput=53.56 rps | iterations=28,870
- **CSV vs summary.json**: p95 exact match (2.286ms) | avg exact match (1.319ms)
- **Outliers**: 11 rows > 10.3ms (max 44.081ms) — WAL checkpoint spikes
- **Optimizations**: 4 FEASIBLE (WAL, index confirm, connection singleton, keep-alive) | 3 HALLUCINATED (Redis, horizontal scaling, pg-pool) | 1 UNCERTAIN (heap)
- **Proposed CI threshold**: p95 < 4ms, error < 2%, throughput >= 48 rps

## [SKILL-10] independent-reviewer (Skill 4 v1) — 2026-08-13 22:41:00
- **Group**: Group 1 — Read-heavy
- **Input**: skill4_analysis.md v1
- **Output**: skill4_v1_review.md, verdict
- **Notes**: Found 1 Medium issue. DB index recommended as FEASIBLE despite no slow query evidence.

## [SKILL-8] bug-anomaly-reporter — 2026-08-13 22:45:00
- **Group**: Group 1 — Read-heavy
- **Input**: results/23127379_Load_20260813.csv + summary.json
- **Bugs found**: 0 critical, 0 high, 0 medium, 0 low
- **Drafts created**: None — no real bugs or performance issues detected
- **Observations**: 11 WAL checkpoint outlier spikes (max 44ms) — informational
- **Posted by human**: N/A (no issues to post)

## [SKILL-1] test-parameter-advisor — 2026-08-14 09:17:44
- **Group**: Group 2 — Auth-heavy
- **Input**: Endpoint = `PUT /api/users/me` (JWT required via `POST /api/login` first), Machine = MacBook Air M5, 16GB RAM, macOS 26.4.1 Tahoe, SUT = http://localhost:3000 (local SQLite). No lockout on PUT endpoint (skip Skill 7).
- **Logic**: Scenario mapping (Auth-heavy → Spike Testing) + domain heuristics from SKILL.md. Recovery time is the primary Spike metric. CSV: auth_users.csv (email, password, name, phone, shipping_address).
- **Output**: Spike stages 10→150 VUs in 10s, hold 1m, recovery 30s, stabilize 2m, ramp-down 30s. Total ~6 min. Thresholds: p95<3000ms, error<30%. VU row: `(__VU - 1) % data.length`. Min 50 accounts needed.

## [SKILL-10] independent-reviewer (Skill 1 G2 v1) — 2026-08-14 09:22:51
- **Group**: Group 2 — Auth-heavy
- **Input**: Skill 1 v1 parameter table for PUT /api/users/me Spike Test
- **Output**: skill1_g2_v1_review.md | verdict: ✅ APPROVED WITH MINOR NOTES
- **Issues**: 0 Critical, 0 High, 2 Medium, 0 Low
  - M1: Clarify that 50 accounts shared via modulo among 150 VUs is safe (no lockout on PUT) — noted in script docs
  - M2: Endurance parameters not included — accepted: Spike test doesn't require endurance variant for Group 2
- **Decision**: Proceed to Skill 2 (test-plan-generator) for Group 2

## [SKILL-2] test-plan-generator — 2026-08-14 09:35:00
- **Group**: Group 2 — Auth-heavy
- **Input**: Approved params from Skill 1 (VUs 10→150 spike, p95<3000ms, error<30%, think-time 0.25–0.75s)
- **Output files**:
  - `Group-2_Spike_Auth/23127379_Spike_20260814.js` (spike test, ~6 min)
  - `Group-2_Spike_Auth/auth_users.csv` (50 accounts, already seeded in SUT)
  - `Group-2_Spike_Auth/skill2_testplan_notes.md`
- **Design decisions**:
  - Primary endpoint: PUT /api/users/me (NOT login); login is prerequisite only
  - No lockoutCounter (PUT has no lockout mechanism)
  - custom Trend metric `recovery_time_ms` for spike recovery analysis
  - Modulo VU-to-account mapping (50 accounts, 150 VUs) — safe, no lockout risk
  - thresholds keyed to `put_profile` tag for per-endpoint p95 enforcement
  - handleSummary: HTML + JSON + stdout (3 report views)

## [SKILL-10] independent-reviewer (Skill 2 G2 v1) — 2026-08-14 09:59:39
- **Group**: Group 2 — Auth-heavy
- **Input**: 23127379_Spike_20260814.js v1
- **Output**: skill2_g2_v1_review.md | verdict: ✅ APPROVED
- **Issues**: 0 Critical, 0 High, 0 Medium, 0 Low — perfect score
- **Decision**: Proceed to Skill 3 (test-execution-runner)

## [SKILL-3] test-execution-runner — 2026-08-14 10:00:06
- **Group**: Group 2 — Auth-heavy
- **Script**: Group-2_Spike_Auth/23127379_Spike_20260814.js
- **Duration**: 6m 10.7s | Exit code: 0
- **Output**: results/23127379_Spike_20260814.csv (382,980 rows), results/summary.json, results/summary.html
- **Quick results**:
  - PUT /api/users/me p95 = 5.744ms ✅ PASS (threshold: <3000ms)
  - overall p95 = 5.579ms
  - recovery_time_ms p95 = 6ms, max = 95ms
  - error rate = 0.00% ✅ PASS (threshold: <30%)
  - checks = 100.00% (56,628/56,628)
  - throughput = 76.39 req/s | iterations = 14,157 | iter/s = 38.19
  - max VUs reached = 150
- **Human evidence**: [ ] screenshot  [ ] hardware report  [ ] video

## [SKILL-4] jtl-log-analyzer — 2026-08-14 10:18:00
- **Group**: Group 2 — Auth-heavy
- **Input**: results/23127379_Spike_20260814.csv (382,979 rows) + summary.json
- **Metric source**: http_req_duration ONLY (NOT http_req_waiting)
- **Metrics**:
  - Overall: p95=5.579ms | avg=2.653ms | error=0.00% | throughput=76.52 req/s
  - PUT /api/users/me {put_profile}: p95=5.744ms | avg=2.740ms | max=94.848ms
  - POST /api/login {login}: p95=5.399ms | avg=2.566ms | max=90.433ms
  - recovery_time_ms: p95=6ms | avg=2.812ms | max=95ms
- **CSV vs summary.json**: p95 exact match (5.579ms) | error rate exact match (0.0%)
- **Outliers**: 32 rows > 26.515ms (p99×3) — all at timestamp 1786676551 (WAL checkpoint during VU drop, all HTTP 200)
- **Recovery**: PUT p95 peaked at 7.698ms at 03:00, returned to 4.5ms by 03:04-03:05 (~2-4 min recovery)
- **Optimizations**: 3 FEASIBLE (WAL, connection singleton, JWT cache) | 3 HALLUCINATED (Redis, scaling, pg-pool) | 1 UNCERTAIN (cluster mode)
- **Analysis file**: Group-2_Spike_Auth/skill4_analysis.md

## [SKILL-10] independent-reviewer (Skill 4 G2 v1) — 2026-08-14 10:44:52
- **Group**: Group 2 — Auth-heavy
- **Input**: skill4_analysis.md v1
- **Output**: skill4_g2_v1_review.md | verdict: ✅ APPROVED
- **Issues**: 0 Critical, 0 High, 0 Medium, 0 Low — perfect score
- **Notes**: All FEASIBLE/HALLUCINATED labels verified correct; metric source confirmed http_req_duration; CSV vs summary.json match confirmed; recovery time and outlier methodology validated
- **Decision**: Proceed to Skill 8 (bug-anomaly-reporter)

## [SKILL-8] bug-anomaly-reporter — 2026-08-14 10:46:00
- **Group**: Group 2 — Auth-heavy
- **Input**: results/23127379_Spike_20260814.csv + summary.json
- **Bugs found**: 0 critical, 0 high, 0 medium, 0 low
- **Status code distribution**: HTTP 200 only (28,314/28,314)
- **Checks**: 56,628 passes / 0 fails (100%)
- **Anomaly**: 32 WAL checkpoint outliers (max 94.848ms, all HTTP 200) — informational only
- **Drafts created**: None — no real bugs detected
- **Posted by human**: N/A

## [SKILL-1] test-parameter-advisor — 2026-08-14 21:27:00
- **Group**: Group 3 — Transactional (official run — Groups 1 & 2 now complete)
- **Input**: Endpoint = `POST /api/checkout` (primary), prereq = `POST /api/cart`, auth = `POST /api/login`, Machine = MacBook Air M5, 16GB RAM, macOS 26.4.1 Tahoe, SUT = http://localhost:3000 (local SQLite). Context: Group 1 p95=2.286ms @ 150VU, Group 2 p95=5.744ms @ 150VU — both error-free.
- **Logic**: Scenario mapping (Transactional → Stress Testing). Goal = find breaking point. SQLite exclusive write lock on INSERT is primary bottleneck. VU steps start at 10, pass through 150 (proven safe for reads), extend to 200 to find the actual ceiling.
- **Output**: Stepped stress 10→30→60→100→150→200 VUs (30s ramp + 30s hold each), think-time 1–3 s between cart and checkout (not batched at end), thresholds p95<5000ms and error<10%, per-tag threshold on `checkout` requests, VU-deterministic row indexing. File: `Group-3_Stress_Checkout/skill1_parameters.md`

## [SKILL-10] independent-reviewer (Skill 1 G3 v1) — 2026-08-14 21:48:08
- **Group**: Group 3 — Transactional
- **Input**: skill1_parameters.md v1
- **Output**: skill1_g3_v1_review.md | verdict: NEEDS REVISION
- **Issues**: 0 Critical, 1 High, 1 Medium, 0 Low
  - H1: Endurance/soak test parameters missing (HW05 Task 1 mandatory)
  - M1: Duration math error — 12×30s = 6 min + 1 min ramp-down = 7 min total (not 13 min)
- **Decision**: Fix and resubmit as v2

## [SKILL-1] test-parameter-advisor v2 — 2026-08-14 21:51:00
- **Group**: Group 3 — Transactional
- **Changes from v1**:
  - Fixed total duration: 7 min (12 × 30 s + 1 min ramp-down) — not 13 min
  - Added Endurance / Soak Test section: `23127379_Stress_Endurance_YYYYMMDD.js` @ 60 VUs × 15 min constant load; evidence captures at 0/5/10/15 min; reports max stable RPS + memory ceiling
- **File**: `Group-3_Stress_Checkout/skill1_parameters.md` (updated in-place)
