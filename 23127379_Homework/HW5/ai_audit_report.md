# AI Audit Report — HW05 Performance Testing
**Student ID**: 23127379
**Date compiled**: 2026-08-16

> "I use AI tools for the following tasks:"

## AI Interaction Log

| # | AI Tool | Skill / Task | Date & Time | Prompt Summary | Output Summary | Notes |
|---|---------|--------------|-------------|----------------|----------------|-------|
| 1 | Antigravity | Skill 1: Params — Group 1 Load | 2026-08-13 21:49 | "Advise Load Test params for GET /api/products/:id..." | VUs 50→100→150, 9-min load, 1-2s think-time | Approved after review |
| 2 | Antigravity | Skill 1: Params — Group 2 Spike | 2026-08-13 21:50 | "Advise Spike Test params for PUT /api/users/me..." | Spike: 10→150 VUs in 10s, hold 1m, recovery 30s | Approved after review |
| 3 | Antigravity | Skill 1: Params — Group 3 Stress | 2026-08-13 21:51 | "Advise Stress Test params for POST /api/checkout..." | Stress: 10→200 users, 30s steps | Rejected (Missing endurance) |
| 4 | Antigravity | Skill 10: Review — Skill 1 G1 | 2026-08-13 22:00 | "Review this Skill 1 output independently..." | Found 1 Low severity issue | |
| 5 | Antigravity | Skill 2: Test Plan — Group 1 | 2026-08-13 22:05 | "Generate test plan for Group 1..." | 23127379_Load_20260813.js + products_data.csv | Review: 0 issues |
| 6 | Antigravity | Skill 10: Review — Skill 2 G1 | 2026-08-13 22:06 | "Review this Skill 2 output independently..." | Perfect script structure | |
| 7 | Antigravity | Skill 3: Runner — Group 1 | 2026-08-13 22:24 | "Run Group 1 Load Test end-to-end..." | CSV (463,001 rows), summary.json, html_report | |
| 8 | Antigravity | Skill 4: Analyzer — Group 1 | 2026-08-13 22:39 | "Activate skill jtl-log-analyzer..." | p95=2.286ms, error=0.00%, throughput=53.56rps | |
| 9 | Antigravity | Skill 10: Review — Skill 4 G1 | 2026-08-13 22:41 | "Review this Skill 4 output independently..." | Found 1 Medium issue (Index recommendation) | |
| 10 | Antigravity | Skill 8: Bug Reporter — Group 1 | 2026-08-13 22:45 | "Activate skill bug-anomaly-reporter..." | 0 bugs found | |
| 11 | Antigravity | Skill 1: Params — Group 2 Spike | 2026-08-14 09:17 | "Advise Spike Test params for PUT /api/users/me..." | Spike: 10→150 VUs, ~6 min total | |
| 12 | Antigravity | Skill 10: Review — Skill 1 G2 | 2026-08-14 09:22 | "Review this Skill 1 output independently..." | Found 2 Medium issues (Endurance missing) | Accepted |
| 13 | Antigravity | Skill 2: Test Plan — Group 2 | 2026-08-14 09:35 | "Generate test plan for Group 2..." | 23127379_Spike_20260814.js + auth_users.csv | |
| 14 | Antigravity | Skill 10: Review — Skill 2 G2 | 2026-08-14 09:59 | "Review this Skill 2 output independently..." | Perfect score, 0 issues | |
| 15 | Antigravity | Skill 3: Runner — Group 2 | 2026-08-14 10:00 | "Run Group 2 Spike Test end-to-end..." | CSV (382,980 rows), summary.json, html_report | |
| 16 | Antigravity | Skill 4: Analyzer — Group 2 | 2026-08-14 10:18 | "Activate skill jtl-log-analyzer..." | p95=5.744ms, recovery=6ms, error=0.0% | |
| 17 | Antigravity | Skill 10: Review — Skill 4 G2 | 2026-08-14 10:44 | "Review this Skill 4 output independently..." | Perfect score, 0 issues | |
| 18 | Antigravity | Skill 8: Bug Reporter — Group 2 | 2026-08-14 10:46 | "Activate skill bug-anomaly-reporter..." | 0 bugs found | |
| 19 | Antigravity | Skill 1: Params — Group 3 Stress | 2026-08-14 21:27 | "Advise Stress Test params for POST /api/checkout..." | Stepped stress 10→200 VUs, 30s steps | |
| 20 | Antigravity | Skill 10: Review — Skill 1 G3 | 2026-08-14 21:48 | "Review this Skill 1 output independently..." | 1 High, 1 Medium issue | Rejected |
| 21 | Antigravity | Skill 1: Params — Group 3 v2 | 2026-08-14 21:51 | "Fix and resubmit as v2..." | Added 15-min endurance test, fixed duration | Approved |
| 22 | Antigravity | Skill 2: Test Plan — Group 3 | 2026-08-14 21:57 | "Generate test plan for Group 3..." | 23127379_Stress_20260814.js + order_payloads.csv | |
| 23 | Antigravity | Skill 3: Runner — Group 3 | 2026-08-16 11:17 | "Run Group 3 Stress Test end-to-end..." | CSV (45,501 rows), summary.json, html_report | |
| 24 | Antigravity | Skill 7: Lockout Reset — Group 3 | 2026-08-16 11:20 | "Activate skill lockout-reset-helper..." | 0 accounts locked | |
| 25 | Antigravity | Skill 4: Analyzer — Group 3 | 2026-08-16 11:20 | "Activate skill jtl-log-analyzer..." | p95=34.7ms, error=0.00%, throughput=108.08rps | |
| 26 | Antigravity | Skill 10: Review — Skill 4 G3 | 2026-08-16 11:21 | "Review this Skill 4 output independently..." | 0 issues, Perfect score | |
| 27 | Antigravity | Skill 8: Bug Reporter — Group 3 | 2026-08-16 11:21 | "Activate skill bug-anomaly-reporter..." | 0 bugs found | |
| 28 | Antigravity | Skill 6: CI Pipeline Proposer | 2026-08-16 11:25 | "Propose CI pipeline with p95 threshold..." | ci_pipeline_proposal.md | |
| 29 | Antigravity | Skill 10: Review — Skill 6 | 2026-08-16 11:26 | "Review this Skill 6 output independently..." | 0 issues, Perfect score | |

**Total AI interactions**: 29
**AI tools used**: Antigravity CLI (Claude Sonnet)
**Estimated total AI-assisted time**: 8 hours

## Review Cycles (Skill 10)

| Round | Target | Issue Found | Severity | Fixed? |
|-------|--------|-------------|----------|--------|
| v1 → review | Skill 1 Load params | `body.length > 0` check is weak | Low | ✅ Fixed in script |
| v1 → review | Skill 4 Load analysis | DB index recommended as FEASIBLE despite no slow query evidence | Medium | ✅ Noted |
| v1 → review | Skill 1 Spike params | Endurance parameters missing | Medium | ✅ Accepted (Not needed for Spike) |
| v1 → review | Skill 1 Spike params | Modulo account usage clarity | Medium | ✅ Clarified in script |
| v1 → review | Skill 1 Stress params | Endurance parameters missing | High | ✅ Added to v2 |
| v1 → review | Skill 1 Stress params | Duration math error | Medium | ✅ Fixed in v2 |
