---
name: bug-anomaly-reporter
description: >-
  Use this skill when .jtl results reveal actual bugs, errors, or performance
  anomalies in EShop that warrant GitHub Issue reporting. Trigger phrases:
  "report bug", "create GitHub issue", "found an error", "report performance
  issue", "draft bug report", or after Skill 4 identifies 5xx errors, timeouts,
  or functional regressions in the .jtl log. This skill compares actual .jtl
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

- `[JTL_FILE]` — `.jtl` file from Skill 3
- `[SCENARIO_TYPE]` — Load / Stress / Spike
- `[EXPECTED_BEHAVIOR]` — from `api_specification.md` (read the source file)

---

## Step 1 — Scan .jtl for Real Errors

```python
import pandas as pd

df = pd.read_csv('{JTL_FILE}')

# 1. HTTP 5xx errors (genuine server bugs)
errors_5xx = df[df['responseCode'].astype(str).str.startswith('5')]
print(f"5xx Errors: {len(errors_5xx)}")
print(errors_5xx[['timeStamp','label','responseCode','responseMessage','failureMessage']].to_string())

# 2. Timeouts
timeouts = df[
    (df['elapsed'] > 10000) |
    (df['responseMessage'].str.contains('timeout', case=False, na=False))
]
print(f"\nTimeouts: {len(timeouts)}")

# 3. Functional regressions (200 OK but assertion failed)
func_failures = df[(df['responseCode'] == '200') & (df['success'] == False)]
print(f"\nFunctional failures (200 OK but assertion failed): {len(func_failures)}")
print(func_failures[['label','failureMessage']].drop_duplicates().to_string())

# 4. High latency (p95 > acceptable threshold)
p95 = df['elapsed'].quantile(0.95)
print(f"\np95: {p95}ms")
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
- **Tool**: JMeter {version}
- **Hardware**: {CPU}, {RAM}GB RAM, macOS/Windows/Linux {version}
- **Concurrent users at time of error**: {N}
- **Test plan**: `23127379_Stress_{date}.jmx`

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
**Raw .jtl (row {line_number}):**
```
{paste exact .jtl row here}
```
- Error count: {err_count} / {total} ({err_pct}%)
- First occurrence: {first_timestamp}
- Last occurrence: {last_timestamp}

*[Screenshot — ATTACH MANUALLY: JMeter output + backend process in same frame]*

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

## Measurements (from raw .jtl)
| Metric | Value | .jtl Source |
|--------|-------|-------------|
| p95 | {p95}ms | ~row {row} |
| p99 | {p99}ms | ~row {row} |
| Throughput | {t} req/s | Derived |
| Error Rate | {err}% | {err_count}/{total} |

*[Screenshot of JMeter Aggregate Report — ATTACH MANUALLY]*

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

## Actual (from .jtl)
Account locked after {N} attempts (evidence: .jtl rows {rows}).

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
- **Input**: {jtl_file}
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
