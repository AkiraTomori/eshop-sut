# Skill 8 — Bug & Anomaly Report — Group 2: Spike Test (Auth-heavy)

**Date**: 2026-08-14  
**Student ID**: 23127379  
**Scenario**: Spike Testing — `PUT /api/users/me` (JWT required)  
**CSV**: `results/23127379_Spike_20260814.csv` (382,979 rows)  
**Summary**: `results/summary.json`

---

## Scan Results

| Check | Result |
|---|---|
| Failed requests (`http_req_failed == 1.0`) | **0** |
| Timeouts (duration > 10,000ms) | **0** |
| 5xx Server Errors | **0** |
| 4xx Client Errors | **0** |
| check() failures | **0** (56,628 passes / 0 fails — 100%) |
| HTTP status distribution | **HTTP 200 only** (28,314 / 28,314) |
| Overall p95 vs threshold | 5.579ms < 3000ms — **PASS** |
| PUT p95 vs threshold | 5.744ms < 3000ms — **PASS** |
| Error rate vs threshold | 0.0000% < 30% — **PASS** |

---

## Expected vs Observed Behaviour (per api_specification.md)

| Endpoint | Expected | Observed | Bug? |
|---|---|---|---|
| `POST /api/login` (valid creds) | 200 OK + JWT token | 200 OK + JWT token ✅ | No |
| `PUT /api/users/me` (valid JWT) | 200 OK + `{"message": "Profile updated"}` | 200 OK + message ✅ | No |

---

## Anomalies (Non-Bug Observations)

| # | Observation | Severity | Classification |
|---|---|---|---|
| 1 | 32 outlier responses (27ms–94ms) at timestamp 1786676551 during VU spike drop | ℹ️ Informational | **WAL checkpoint artefact** — SQLite WAL flushed when write pressure dropped suddenly from 150→10 VUs. All responses were HTTP 200. Not a bug. |

---

## Bug Drafts Created

**None.** Zero real bugs or functional regressions detected across all 28,314 HTTP requests during the Spike Test.

The 32 WAL checkpoint outliers are a known SQLite behaviour and do not constitute a reportable bug. All responses returned HTTP 200 with correct body.

---

## Verdict

```
✅ Skill 8 complete — Group 2 Spike Test
   0 Critical | 0 High | 0 Medium | 0 Low
   Drafts created: None
   GitHub Issues to post: None
```
