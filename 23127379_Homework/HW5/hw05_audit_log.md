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
