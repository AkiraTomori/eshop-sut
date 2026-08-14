# Review Log — Skill 2 v1 (Group 2: Auth-heavy Spike Testing)
**Date**: 2026-08-14 09:58:30
**Reviewer**: independent-reviewer (Skill 10, fresh context)
**Content reviewed**: `23127379_Spike_20260814.js` + `auth_users.csv` v1 (Group 2: Auth-heavy Spike Testing)

## Issues Found

| # | Location | Issue | Severity | Required Fix |
|---|----------|-------|----------|--------------|
| - | - | None (All criteria passed) | - | - |

## What Was Correct
- [x] **File Naming**: Follows `{StudentID}_{ScenarioType}_{YYYYMMDD}.js` format (`23127379_Spike_20260814.js`) with capitalized `Spike`.
- [x] **Base URL Configuration**: Correctly parametrized with fallback (`const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000'`).
- [x] **SharedArray & CSV Parsing**: `auth_users.csv` parsed via `SharedArray` + `papaparse` once outside the default function.
- [x] **Primary Endpoint vs Authentication**: Correctly focuses primary load on `PUT /api/users/me`, using `POST /api/login` only as a prerequisite step to obtain the JWT token.
- [x] **Token Forwarding**: Authorization header passed correctly as `Authorization: Bearer ${token}` with `Content-Type: application/json`.
- [x] **Payload Conformance**: `PUT /api/users/me` request body strictly matches `api_specification.md` §2.2 (`name`, `phone`, `shipping_address`).
- [x] **Lockout Logic**: Correctly omits `lockoutCounter` because `PUT /api/users/me` has no account lockout mechanism in the SUT.
- [x] **Spike Stages**: Stages precisely match approved parameters: 10 VUs baseline (2m) → 150 VUs spike (10s) → 150 VUs hold (1m) → 10 VUs recovery (30s) → 10 VUs stabilize (2m) → 0 VUs ramp-down (30s).
- [x] **Custom Metric**: `recovery_time_ms` Trend metric defined and recorded on PUT iterations to measure spike-to-baseline latency recovery.
- [x] **Thresholds & Tagging**: Thresholds explicitly key on tag `name:put_profile` (`p(95)<3000`), overall error rate `http_req_failed` (`rate<0.30`), and `recovery_time_ms` (`p(95)<3000`). All requests properly tagged (`login` and `put_profile`).
- [x] **Defensive Response Handling**: `check()` validates HTTP 200 and token presence before attempting `loginRes.json('token')`, with graceful iteration exit on failure.
- [x] **Think-time Distribution**: `sleep()` placed between actions (login → PUT) and after PUT, not batched at the end (`0.25 + Math.random() * 0.5`s).
- [x] **handleSummary Reporting**: Implements 3 distinct reporting outputs (`results/summary.html`, `results/summary.json`, and `stdout` text summary).

## Root Cause Analysis
**Why did the AI produce this error?**
N/A — No errors found. The script adheres strictly to `api_specification.md`, HW05 requirements, and k6 best practices.

## Recommendation
The script `23127379_Spike_20260814.js` is fully compliant with all assignment specifications and k6 performance testing best practices. It is ready for execution (Skill 3) against the EShop SUT.

## Verdict
✅ APPROVED — 0 Critical, 0 High, 0 Medium, 0 Low. Safe to proceed to test execution.
