<!-- GitHub Issue Template — bug-anomaly-reporter (Skill 8) -->
<!-- Dùng template này làm khung cho từng issue draft -->

## Template 1: Performance Bug (5xx Server Error)

**Title**: [PERF-BUG] {endpoint} returns {status_code} under {N} concurrent users

**Labels**: `bug`, `performance`, `HW05`

**Assignees**: (để trống)

---

**Body**:

## Summary
During {scenario_type} Testing, `{endpoint}` returned HTTP {status_code} errors
under concurrent load of {N} users at {timestamp}.

## Environment
- **EShop commit**: [insert git hash]
- **Test date**: {date}
- **Tool**: JMeter {version} / k6 {version}
- **Hardware**: {CPU model}, {RAM}GB RAM, macOS/Windows/Linux {version}
- **Concurrent users at error**: {N}
- **Test plan**: `{test_plan_filename}.jmx`

## Steps to Reproduce
1. Start EShop: `bash run_servers.sh`
2. Verify health: `curl http://localhost:3000/api/products` → 200
3. Run test plan: `jmeter -n -t {test_plan} -l results.jtl`
4. Observe {status_code} responses at ~{N} concurrent users

## Expected Behavior
Per `api_specification.md` §{section}:
`{endpoint}` should return {expected_status} with `{expected_body_summary}`.

## Actual Behavior
HTTP {actual_status} returned with message: `{error_message}`

## Evidence
**Raw .jtl (specific rows):**
```
{paste exact .jtl rows — timeStamp,elapsed,label,responseCode,...}
```
Line {line_number} in `{jtl_filename}.jtl`

**Error rate**: {err_pct}% ({err_count}/{total} requests)
**First occurrence**: {first_timestamp}
**Last occurrence**: {last_timestamp}

*[Screenshot — ATTACH MANUALLY: JMeter showing error + backend process in same frame]*

## Possible Root Cause
{analysis from Skill 4, e.g.: "SQLite write lock under concurrent transactions"}

## Suggested Fix
{from Skill 4 FEASIBLE recommendations}

---
*Reported via: bug-anomaly-reporter (Skill 8) — EShop HW05 Performance Testing*
*Full .jtl log: attached in repository `23127379_Homework/HW5/results/`*

---

## Template 2: Performance Issue (High Latency)

**Title**: [PERF-ISSUE] {endpoint} p95 > {threshold}ms under {N} users (Load Test)

**Labels**: `performance`, `HW05`

---

**Body**:

## Summary
`{endpoint}` exhibits high latency under load: p95 = {p95}ms exceeds
acceptable threshold of {threshold}ms at {N} concurrent users.

## Measurements

| Metric | Value | Source (line in .jtl) |
|--------|-------|----------------------|
| p95 Response Time | {p95}ms | .jtl percentile from lines 2-{N} |
| p99 Response Time | {p99}ms | .jtl percentile |
| Throughput | {t} req/s | Derived: {total}/{duration}s |
| Error Rate | {err}% | {err_count}/{total} |
| Test Duration | {duration}s | timeStamp range |

## Evidence
```
# .jtl excerpt (slowest requests):
{paste 5 slowest rows}
```
*[Screenshot of JMeter Aggregate Report — ATTACH MANUALLY]*

## Impact
- {N} concurrent users represents {description_of_load_level}
- Under this load, {X}% of users experience > {threshold}ms response time

## Suggested Improvements
1. [FEASIBLE] {improvement from Skill 4}
2. [UNCERTAIN] {improvement with caveat}

---

## Template 3: Functional Regression

**Title**: [BUG] {endpoint} {unexpected_behavior} — deviates from api_specification

**Labels**: `bug`, `regression`, `HW05`

---

**Body**:

## Summary
`{endpoint}` exhibits behavior not matching `api_specification.md`:
{brief description of deviation}

## Expected (per api_specification.md §{N})
{quote from spec}

## Actual (observed during performance test)
{what actually happened, with .jtl evidence}

## Evidence
```
{relevant .jtl rows}
```
*[Screenshot — ATTACH MANUALLY]*

## Notes
- This was discovered during {scenario_type} testing at {N} concurrent users
- It's unclear if this is load-related or pre-existing — needs investigation under single user

---
*Reported via: bug-anomaly-reporter (Skill 8)*
