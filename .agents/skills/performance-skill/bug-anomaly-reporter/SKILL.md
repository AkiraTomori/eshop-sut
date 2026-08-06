---
name: bug-anomaly-reporter
description: >-
  Use this skill when k6 CSV results reveal actual bugs, errors, or performance
  anomalies in EShop that warrant GitHub Issue reporting. Trigger phrases:
  "report bug", "create GitHub issue", "found an error", "report performance
  issue", "draft bug report", or after Skill 4 identifies 5xx errors, timeouts,
  or functional regressions in the k6 CSV result. This skill compares actual k6
  observations against api_specification.md expected behavior, drafts GitHub
  Issue content for each real finding, and STOPS for human review before any
  issue is posted. Does NOT auto-post issues — human must post manually with
  real screenshots attached.
---

# Skill 8 — bug-anomaly-reporter

## Purpose
Draft GitHub Issue content for real bugs found in `.jtl` logs.
**Does NOT post issues automatically** — drafts only, for human review and manual posting.

---

## Required Input

- `[CSV_FILE]` — k6 CSV result file from Skill 3 (`{ID}_{Scenario}_{DATE}.csv`)
- `[SUMMARY_JSON]` — `summary.json` from Skill 3
- `[SCENARIO_TYPE]` — Load / Stress / Spike
- `[EXPECTED_BEHAVIOR]` — from `api_specification.md` (read the source file)

---

## Step 1 — Scan k6 CSV for Real Errors

```python
import pandas as pd

df = pd.read_csv('{CSV_FILE}')

# Filter HTTP duration metrics
http_dur = df[df['metric_name'] == 'http_req_duration'].copy()
http_dur['metric_value'] = pd.to_numeric(http_dur['metric_value'])

# 1. Failed HTTP requests (http_req_failed == 1.0)
http_fail = df[(df['metric_name'] == 'http_req_failed') & (df['metric_value'].astype(float) == 1.0)]
print(f"Failed requests: {len(http_fail)}")
if 'url' in http_fail.columns:
    print(http_fail[['timestamp', 'url', 'error', 'error_code', 'status']].head(20).to_string())

# 2. Timeouts (duration > 10000ms or error contains 'timeout')
timeouts = http_dur[http_dur['metric_value'] > 10000]
print(f"\nTimeouts (>10s): {len(timeouts)}")

# 3. Functional regressions (check() failures logged in k6 console)
# Note: check() failures appear in k6 console output and summary.json 'checks' section
import json
try:
    with open('{SUMMARY_JSON}') as f:
        summary = json.load(f)
    checks = summary.get('metrics', {}).get('checks', {}).get('values', {})
    fail_rate = checks.get('fails', 0)
    print(f"\ncheck() failures: {fail_rate}")
except Exception as e:
    print(f"\nCould not read summary.json: {e}")

# 4. High latency (p95 > acceptable threshold)
p95 = http_dur['metric_value'].quantile(0.95)
print(f"\np95: {p95:.1f}ms")
if p95 > 3000:
    print("⚠️  p95 > 3s — may warrant a performance issue report")
```

---

## Step 2 — Compare Against Expected Behavior

| Endpoint | Expected (from api spec) | Observed (from .jtl) | Bug? |
|---|---|---|---|
| `GET /api/products` | 200 OK, JSON array | {observed} | {yes/no} |
| `GET /api/products/:id` | 200 OK, JSON object with `"id"` | {observed} | {yes/no} |
| `POST /api/login` (valid) | 200 OK + JWT token | {observed} | {yes/no} |
| `POST /api/login` (3× wrong) | 403 Locked | {observed} | {yes/no} |
| `POST /api/cart` | 200 OK | {observed} | {yes/no} |
| `POST /api/checkout` | 200 OK + `order_id` | {observed} | {yes/no} |

---

## Step 3 — Severity Classification

| Severity | Definition | Example |
|---|---|---|
| 🔴 Critical | Server crash / data corruption / 5xx affecting all users | 500 Internal Server Error on checkout |
| 🟠 High | Functional regression / lockout deviates from spec | 403 after 2 attempts instead of 3 |
| 🟡 Medium | Performance degradation above threshold | p95 > 5s under normal load |
| 🟢 Low | Minor issue or performance warning | Slight response time increase |

---

## Step 4 — Draft GitHub Issues

Create: `23127379_Homework/HW5/bug_reports/issue_draft_{N}.md`

### Template 1: Server Error (5xx)

```markdown
**Title**: [PERF-BUG] POST /api/checkout returns 500 under concurrent load

**Labels**: `bug`, `performance`, `HW05`

## Summary
During Stress Testing, `POST /api/checkout` returned HTTP 500 under
concurrent load of {N} users.

## Environment
- **EShop commit**: [insert git hash]
- **Test date**: {date}
- **Tool**: Grafana k6 {version}
- **Hardware**: {CPU}, {RAM}GB RAM, macOS {version}
- **Concurrent VUs at time of error**: {N}
- **Test script**: `23127379_Stress_{date}.js`

## Steps to Reproduce
1. Start EShop: `bash run_servers.sh`
2. Verify: `curl http://localhost:3000/api/products` → 200
3. Run stress test with {N}+ virtual users
4. Observe HTTP 500 responses

## Expected Behavior
Per `api_specification.md` §4.3: `POST /api/checkout` should return 200 OK.

## Actual Behavior
HTTP 500: `{responseMessage from .jtl}`

## Evidence
**Raw k6 CSV (row {line_number}):**
```
{paste exact CSV row here: metric_name,timestamp,metric_value,...}
```
- Error count: {err_count} / {total} ({err_pct}%)
- First occurrence: {first_timestamp}
- Last occurrence: {last_timestamp}

*[Screenshot — ATTACH MANUALLY: k6 terminal output + backend process in same frame]*

## Possible Root Cause
SQLite write lock under concurrent transactions. See Skill 4 analysis.

---
*Reported by: bug-anomaly-reporter (Skill 8) — EShop HW05*
```

### Template 2: High Latency

```markdown
**Title**: [PERF-ISSUE] GET /api/products p95 > {threshold}ms under {N} users

**Labels**: `performance`, `HW05`

## Summary
Load Testing shows `GET /api/products` p95 = {p95}ms, exceeding
acceptable threshold of {threshold}ms at {N} concurrent users.

## Measurements (from k6 CSV + summary.json)
| Metric | Value | Source |
|--------|-------|--------|
| p95 | {p95}ms | http_req_duration p95 from CSV |
| p99 | {p99}ms | http_req_duration p99 from CSV |
| Throughput | {t} req/s | Derived: total_requests / duration |
| Error Rate | {err}% | http_req_failed rate from summary.json |

*[Screenshot of k6 terminal summary + resource monitor — ATTACH MANUALLY]*

## Recommended Fixes
1. [FEASIBLE] Enable SQLite WAL mode
2. [FEASIBLE] Add index on `products.name`
```

### Template 3: Functional Regression

```markdown
**Title**: [BUG] POST /api/login lockout triggers after {N} attempts, not 3

**Labels**: `bug`, `regression`, `HW05`

## Summary
Account lockout (HTTP 403) observed after {N} failed login attempts,
deviating from spec which states 3 attempts.

## Expected (per api_specification.md §1.2)
Account locked after exactly **3** failed login attempts → HTTP 403.

## Actual (from k6 CSV)
Account locked after {N} attempts (evidence: k6 CSV rows {rows}, lockoutCounter metric).

*[Screenshot — ATTACH MANUALLY]*
```

---

## Step 5 — Draft Summary

```markdown
## Bug Draft Summary — {SCENARIO_TYPE} Test

| # | Issue | Severity | Draft File |
|---|-------|----------|------------|
| 1 | {title} | 🔴 Critical | issue_draft_1.md |
| 2 | {title} | 🟡 Medium | issue_draft_2.md |

Total issues: {N}
```

---

## Audit Log

Append to `hw05_audit_log.md`:

```markdown
## [SKILL-8] bug-anomaly-reporter — {timestamp}
- **Input**: {csv_file} + summary.json
- **Bugs found**: {n_critical} critical, {n_high} high, {n_medium} medium
- **Drafts created**: issue_draft_1.md ... issue_draft_{N}.md
- **Posted by human**: [ ] pending
```

---

## ⛔ Checkpoint — STOP HERE

```
✅ Skill 8 complete.

📋 Bug Drafts:
{list of issue_draft_*.md files}

⚠️  Required action from you:
   [ ] Read each draft and confirm the bug is real
   [ ] Capture a screenshot of the error in JMeter + .jtl in same frame
   [ ] Post each issue manually to GitHub Issues
   [ ] Copy the Issue URL → add to hw05_audit_log.md

❌ The agent does NOT post issues — real screenshots must come from you.

👉 After posting, proceed to Skill 9 (final-report-compiler).
```

## References
- [GitHub Issue Template](./resources/github_issue_template.md)
- [api_specification.md](../../../../api_specification.md)
