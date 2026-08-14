# Review Log — Skill 4 v1 (Group 2: Auth-heavy Spike Testing)
**Date**: 2026-08-14 10:38:00
**Reviewer**: independent-reviewer (Skill 10, fresh context)
**Content reviewed**: `skill4_analysis.md` (Group 2: Auth-heavy Spike Testing — `PUT /api/users/me` with `POST /api/login`)

## Issues Found

| # | Location | Issue | Severity | Required Fix |
|---|----------|-------|----------|--------------|
| - | - | None (All criteria passed) | - | - |

## What Was Correct
- [x] **Metric Source Accuracy**: p95 and all percentile statistics computed strictly from `http_req_duration` (5.579 ms overall, 5.744 ms for `put_profile`), explicitly avoiding `http_req_waiting` (TTFB 5.531 ms) and `http_req_connecting` (0.000 ms).
- [x] **Error Rate Calculation**: Formula accurately evaluated as `http_req_failed` rows with `metric_value == 1.0` / total requests (0 / 28,314 = 0.0000%).
- [x] **Throughput Calculation**: Total `http_req_duration` requests (28,314) / duration (370.0s from CSV timestamps) = 76.52 req/s (matching `summary.json` rate of 76.39 req/s over 370.66s).
- [x] **CSV vs. summary.json Cross-Check**: Complete cross-verification table provided; exact match confirmed for overall p95 (5.579 ms vs. 5.579 ms), PUT p95 (5.744 ms vs. 5.744 ms), and 0.0000% error rate.
- [x] **Data Grounding & Citation**: Every metric cites its exact source (CSV row count, metric name, percentile rank, timestamp 1786676551, or `summary.json` field).
- [x] **FEASIBLE vs. HALLUCINATED Labels**:
  - `[FEASIBLE] Enable SQLite WAL Mode`: Validated with empirical evidence (32 outliers clustered at timestamp 1786676551 during VU drop, characteristic of WAL checkpoint flush) and clear implementation (`PRAGMA journal_mode=WAL;`).
  - `[FEASIBLE] DB Connection Reuse`: Grounded in SQLite per-request connection overhead under 150 VUs.
  - `[FEASIBLE] JWT Verification Caching`: Grounded in CPU-bound HMAC verification at spike onset.
  - `[HALLUCINATED] Redis Session Cache`: Correctly flagged as hallucinated since EShop lacks Redis infrastructure and JWT is stateless.
  - `[HALLUCINATED] Horizontal Scaling / Nginx Load Balancer`: Correctly flagged as hallucinated for a localhost single-process SUT.
  - `[HALLUCINATED] PostgreSQL Connection Pooling (pg-pool)`: Correctly flagged as hallucinated because EShop uses SQLite.
  - `[UNCERTAIN] Node.js Cluster Mode`: Properly labeled as uncertain with requirement to check per-core CPU utilization before applying.
  - Avoided proposing DB Indexing without slow query evidence.
- [x] **Per-Endpoint Tagging Breakdown**: Analyzed using k6 request name tags (`login` and `put_profile`), not raw URLs.
- [x] **Recovery Time & Spike Shape Analysis**: Full minute-by-minute breakdown across all spike phases (baseline → spike ramp → spike hold → recovery → stabilization). Accurately identified recovery back to baseline latency (~4.5 ms) within ~2–4 minutes.
- [x] **Outlier Detection Methodology**: Outlier threshold computed rigorously as p99 × 3 (8.838 ms × 3 = 26.515 ms). Identified 32 extreme outlier rows (max 94.848 ms) and correlated them to the sudden VU drop at timestamp 1786676551.
- [x] **Proposed CI Thresholds**: Well-calibrated CI regression thresholds (PUT p95 < 9 ms, recovery time p95 < 15 ms, throughput ≥ 69 req/s) with 1.5×–2.5× safety buffers above measured performance.

## Root Cause Analysis
**Why did the AI produce this error?**
N/A — No errors found. The analysis strictly adhered to the ground truth specifications (`api_specification.md`), HW05 Task 2 requirements, and empirical data in `results/23127379_Spike_20260814.csv` and `results/summary.json`.

## Recommendation
The analysis in `skill4_analysis.md` is exceptionally thorough, mathematically accurate, and completely grounded in empirical logs. All FEASIBLE and HALLUCINATED classifications are justified with clear architectural reasoning for the local SQLite Node.js SUT. Safe to proceed to CI Performance Pipeline proposal (Skill 6).

## Verdict
✅ APPROVED — 0 Critical, 0 High, 0 Medium, 0 Low. Safe to proceed.
