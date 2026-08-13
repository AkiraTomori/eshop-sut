# [SKILL-8] Bug & Anomaly Report — Group 1 (Read-heavy Load Test)

**Scenario:** Load Testing
**Endpoint:** `GET /api/products/:id`
**Date:** 2026-08-13
**CSV source:** `results/23127379_Load_20260813.csv` (463,001 rows)

---

## Scan Results

| Check | Result |
|---|---|
| Failed HTTP requests (`http_req_failed == 1.0`) | **0** |
| Timeouts (response time > 10,000 ms) | **0** |
| check() assertion failures | **0** (86,610 checks all passed) |
| p95 > 3000 ms performance threshold | **No** (p95 = 2.286 ms) |
| HTTP 5xx errors | **0** |
| HTTP 4xx errors | **0** |

---

## Expected vs Observed

| Endpoint | Expected (api_specification.md) | Observed | Bug? |
|---|---|---|---|
| `GET /api/products/:id` | 200 OK + JSON object with `id` and `name` fields | 200 OK + valid JSON, `id` and `name` verified by check() | ✅ No |

---

## GitHub Issues to Report

**None.** The Load Test produced zero errors, zero check failures, and p95 = 2.286 ms —
well within all thresholds. No bugs or performance anomalies warrant a GitHub Issue
from this test run.

### Performance Observations (informational — not bugs)

| Observation | Severity | Action |
|---|---|---|
| 11 outlier spikes > 10 ms (max 44 ms) | 🟢 Low | Consistent with SQLite WAL checkpoint — expected, not a bug |
| Hot cache bias (only 5 product IDs) | 🟢 Low | Informational — results optimistic vs real catalog |

> These observations are documented in `skill4_analysis.md` and are NOT filed
> as GitHub Issues because they are expected system behaviours, not defects.

---

## Audit Trail

- Scanned: 463,001 CSV rows
- Metric used for failure detection: `http_req_failed` (value == 1.0)
- Metric used for timeout detection: `http_req_duration` (> 10,000 ms)
- check() assertion failures sourced from: `summary.json → metrics.checks.fails`
- Expected behaviour sourced from: `api_specification.md §3.2`

---

## Human Action Required

No GitHub Issues to post for Group 1. ✅

If you disagree and spotted a real issue during your screenshot/video capture,
use the template in `bug_reports/issue_draft_template.md` to draft it.
