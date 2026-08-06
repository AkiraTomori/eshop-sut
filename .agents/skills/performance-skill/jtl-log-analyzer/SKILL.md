---
name: jtl-log-analyzer
description: >-
  Use this skill when the user has a raw CSV result file from k6 (or JSON summary)
  and wants to compute real performance metrics and get optimization suggestions.
  Trigger phrases: "analyze results", "calculate p95",
  "compute error rate", "analysis ready", or when user provides a .csv result
  file path after Skill 3. This skill computes p95/p99/error rate/throughput from
  ACTUAL k6 data only — every number must cite specific rows in the raw CSV.
  It proposes performance thresholds and labels each optimization recommendation
  as [FEASIBLE] or [HALLUCINATED] with clear reasoning. Must analyze each group
  individually — do not mix CSV files from different scenarios. STOPS and
  waits for human misinterpretation review before any report is compiled.
---

# Skill 4 — jtl-log-analyzer (k6 CSV Edition)

## Purpose
Parse the raw k6 CSV output, compute real performance metrics, propose thresholds,
and label optimization recommendations as **[FEASIBLE] / [HALLUCINATED]**.
**Every number must be traceable to a specific row in the CSV.**

---

## Required Input

- `[CSV_FILE]` — full path to the k6 CSV output file (`{ID}_{Scenario}_{DATE}.csv`)
- `[SUMMARY_JSON]` — full path to `summary.json` (from `--summary-export`)
- `[SCENARIO_TYPE]` — Load / Stress / Spike
- `[ENDPOINT_GROUP]` — read-heavy / auth-heavy / transactional

---

## Step 1 — Understand K6 CSV Format

K6 CSV output (via `--out csv`) has the following columns:

```
metric_name,timestamp,metric_value,check,error,error_code,error_type,
expected_response,group,method,name,proto,scenario,service,
status,subproto,tls_version,url,extra_tags
```

Key metric names for HTTP performance analysis:
- `http_req_duration` — full end-to-end response time (**use this for p95**)
- `http_req_failed` — 1.0 = failed, 0.0 = success
- `http_reqs` — total request count
- `http_req_connecting` — connection time only (do NOT use for response time)
- `http_req_waiting` — TTFB / time to first byte (do NOT use for p95 calculations)

> **CRITICAL**: Always use `http_req_duration` for response time analysis.
> Do NOT use `http_req_waiting` or `http_req_connecting` — they are partial metrics,
> equivalent to the old mistake of using `Latency` instead of `elapsed` in JTL.

Run validation:

```bash
# View header
head -1 {CSV_FILE}

# Count total records
wc -l {CSV_FILE}

# Show http_req_duration rows only (first 5)
awk -F',' '$1 == "http_req_duration"' {CSV_FILE} | head -5

# Show failed requests
awk -F',' '$1 == "http_req_failed" && $3 == "1"' {CSV_FILE} | head -5
```

---

## Step 2 — Compute Metrics from K6 CSV (source citations required)

```python
import pandas as pd
import numpy as np

df = pd.read_csv('{CSV_FILE}')

# Filter only HTTP request duration metrics
http_dur = df[df['metric_name'] == 'http_req_duration'].copy()
http_dur['timestamp'] = pd.to_numeric(http_dur['timestamp'])
http_dur['metric_value'] = pd.to_numeric(http_dur['metric_value'])

# Filter failed requests (metric_value == 1.0 means failed)
http_fail = df[df['metric_name'] == 'http_req_failed'].copy()
http_fail['metric_value'] = pd.to_numeric(http_fail['metric_value'])

total_requests = len(http_dur)
error_count = int(http_fail['metric_value'].sum())
test_duration = (http_dur['timestamp'].max() - http_dur['timestamp'].min())

print("=== PERFORMANCE METRICS ===")
print(f"Total Requests : {total_requests}")
print(f"Test Duration  : {test_duration:.1f}s")
print(f"Throughput     : {total_requests / test_duration:.2f} req/s")
print()
print("=== RESPONSE TIME (ms) — from 'http_req_duration' metric ===")
print(f"Min  : {http_dur['metric_value'].min():.1f}")
print(f"Avg  : {http_dur['metric_value'].mean():.1f}")
print(f"p50  : {http_dur['metric_value'].quantile(0.50):.1f}")
print(f"p90  : {http_dur['metric_value'].quantile(0.90):.1f}")
print(f"p95  : {http_dur['metric_value'].quantile(0.95):.1f}")
print(f"p99  : {http_dur['metric_value'].quantile(0.99):.1f}")
print(f"Max  : {http_dur['metric_value'].max():.1f}")
print()
print("=== ERROR ANALYSIS ===")
total_fail_rows = len(http_fail)
print(f"Error Count : {error_count}")
print(f"Error Rate  : {error_count / total_fail_rows * 100:.2f}%")

# Breakdown by URL/endpoint
print("\n=== PER-ENDPOINT BREAKDOWN ===")
for url, grp in http_dur.groupby('url'):
    p95 = grp['metric_value'].quantile(0.95)
    avg = grp['metric_value'].mean()
    count = len(grp)
    print(f"{url}: count={count}, avg={avg:.1f}ms, p95={p95:.1f}ms")
```

> **Important**: Always use the `http_req_duration` metric for response time.
> Do NOT use `http_req_waiting` (TTFB only) or `http_req_connecting` (connection only).

### Also cross-check with summary.json

```python
import json

with open('{SUMMARY_JSON}') as f:
    summary = json.load(f)

metrics = summary.get('metrics', {})
duration_vals = metrics.get('http_req_duration', {}).get('values', {})
failed_vals = metrics.get('http_req_failed', {}).get('values', {})
reqs_vals = metrics.get('http_reqs', {}).get('values', {})

print("=== FROM summary.json ===")
print(f"p95 (summary): {duration_vals.get('p(95)', 'N/A')}ms")
print(f"avg (summary): {duration_vals.get('avg', 'N/A')}ms")
print(f"error rate   : {failed_vals.get('rate', 'N/A'):.4f}")
print(f"total reqs   : {reqs_vals.get('count', 'N/A')}")
```

### Required output format

```markdown
## Analysis Results — {SCENARIO_TYPE} Test ({DATE})
**Source file**: `{CSV_FILE}` ({total_lines} lines)
**Cross-check**: `summary.json`

| Metric | Value | Source |
|--------|-------|--------|
| Total Requests | {n} | http_req_duration rows in CSV |
| Test Duration | {d}s | timestamp: first → last http_req_duration row |
| Throughput | {t} req/s | Derived: {n}/{d} |
| Avg Response Time | {avg}ms | http_req_duration metric_value, mean |
| p50 | {p50}ms | 50th percentile of http_req_duration |
| p95 | {p95}ms | 95th percentile of http_req_duration |
| p99 | {p99}ms | 99th percentile of http_req_duration |
| Max Response Time | {max}ms | http_req_duration metric_value, max |
| Error Count | {err} | http_req_failed metric_value == 1.0 |
| Error Rate | {err_pct}% | {err}/{total_fail_rows} × 100 |

### Cross-check with summary.json
| Metric | CSV-computed | summary.json | Match? |
|--------|-------------|--------------|--------|
| p95 | {csv_p95}ms | {json_p95}ms | ✅/❌ |
| Error rate | {csv_err}% | {json_err} | ✅/❌ |

### Errors Detected
| Timestamp | URL | HTTP Status | Error Code |
|-----------|-----|-------------|------------|
| {ts} | {url} | {status} | {code} |
```

---

## Step 3 — Propose Performance Thresholds

Based on actual measured values:

```markdown
## Proposed Performance Thresholds

| Metric | Measured | Proposed Threshold | Basis |
|--------|----------|--------------------|-------|
| p95 Response Time | {p95}ms | < {p95 * 1.5}ms | 1.5× buffer above measured value |
| Error Rate | {err_pct}% | < 2% | E-commerce industry standard |
| Throughput | {t} req/s | ≥ {t * 0.9} req/s | 90% of measured capacity |
| Max Stable VUs | {max_vus} | {max_stable_vus} | From stable stage of test |
```

---

## Step 4 — Optimization Recommendations (labels mandatory)

Every recommendation **must** carry a **[FEASIBLE]** or **[HALLUCINATED]** label:

```markdown
## Optimization Recommendations

### [FEASIBLE] Enable SQLite WAL Mode
- **Why feasible**: EShop uses SQLite (verify in backend/db.js).
  WAL allows concurrent reads while a write is in progress.
- **How to apply**: Add `PRAGMA journal_mode=WAL;` during DB connection init.
- **Expected improvement**: Reduces write contention during Stress test.
  Based on error at CSV row with url={url}, status={code}.

### [FEASIBLE] Add Index on products.name
- **Why feasible**: `GET /api/products?search=` may perform a full table scan.
  `CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);`
- **Verify**: Run `EXPLAIN QUERY PLAN SELECT * FROM products WHERE name LIKE ?`

### [FEASIBLE] Reuse DB Connection (Singleton Pattern)
- **Why feasible**: If the backend opens a new connection per request, overhead
  is high. Verify in `backend/db.js` or `backend/database.js`.

### [HALLUCINATED] Redis Cache for Product Listing
- **Why hallucinated**: EShop is a local demo app with no Redis installation.
  Correct for production, but not applicable to this SUT.

### [HALLUCINATED] Horizontal Scaling / Load Balancer
- **Why hallucinated**: SUT runs as a single Node.js process on localhost.
  No infrastructure to scale out.

### [HALLUCINATED] PostgreSQL Connection Pooling (pg-pool)
- **Why hallucinated**: EShop uses SQLite, not PostgreSQL.
  Connection pooling libraries like pg-pool do not apply.

### [UNCERTAIN — verify first] Increase Node.js Heap Size
- **Why uncertain**: If memory pressure causes GC pauses, try
  `node --max-old-space-size=2048 server.js`.
  Requires checking `resource_usage.txt` for memory trend before concluding.
```

---

## Step 5 — Detect Anomalies

```python
# Extreme outliers (metric_value > p99 × 3)
p99 = http_dur['metric_value'].quantile(0.99)
outliers = http_dur[http_dur['metric_value'] > p99 * 3]
print(f"Extreme outliers: {len(outliers)}")
if len(outliers) > 0:
    print(outliers[['timestamp', 'url', 'metric_value', 'status']].to_string())

# Error rate over time (detect degradation)
http_dur_time = http_dur.copy()
http_dur_time['datetime'] = pd.to_datetime(http_dur_time['timestamp'], unit='s')
http_dur_time['minute'] = http_dur_time['datetime'].dt.floor('1min')

fail_with_time = df[df['metric_name'] == 'http_req_failed'].copy()
fail_with_time['timestamp_num'] = pd.to_numeric(fail_with_time['timestamp'])
fail_with_time['datetime'] = pd.to_datetime(fail_with_time['timestamp_num'], unit='s')
fail_with_time['minute'] = fail_with_time['datetime'].dt.floor('1min')
fail_with_time['metric_value'] = pd.to_numeric(fail_with_time['metric_value'])

error_by_time = fail_with_time.groupby('minute')['metric_value'].mean() * 100
print("\nError rate per minute (%) — for degradation detection:")
print(error_by_time)

# Rising response time trend (possible memory/connection leak)
http_dur_sorted = http_dur.sort_values('timestamp')
http_dur_sorted['rolling_avg'] = http_dur_sorted['metric_value'].rolling(100).mean()
print("\nFirst rolling avg:", http_dur_sorted['rolling_avg'].dropna().iloc[0])
print("Last rolling avg: ", http_dur_sorted['rolling_avg'].dropna().iloc[-1])
```

---

## Audit Log

Append to `hw05_audit_log.md`:

```markdown
## [SKILL-4] jtl-log-analyzer — {timestamp}
- **Input**: {csv_file} ({size}, {lines} rows) + summary.json
- **Metrics**: p95={p95}ms, error_rate={err}%, throughput={t}rps
- **Threshold proposed**: p95 < {threshold}ms
- **Optimizations**: {n_feasible} feasible, {n_hallucinated} hallucinated
- **Source citations**: all numbers traced to CSV rows or summary.json
```

---

## ⛔ Checkpoint — STOP HERE

```
✅ Skill 4 complete.

📊 Summary:
   - p95: {p95}ms | Error Rate: {err}% | Throughput: {t} req/s
   - Feasible optimizations: {n_feasible}
   - Hallucinated optimizations: {n_hallucinated}

🔍 Action required from you (Task 2 — Misinterpretation Hunt):
   Review every number in the table above and:
   [ ] Verify p95 by running the Python script yourself on the CSV
   [ ] Confirm the AI used 'http_req_duration', NOT 'http_req_waiting' or 'http_req_connecting'
   [ ] Cross-check CSV-computed p95 vs summary.json p95 — they should match closely
   [ ] Flag any [FEASIBLE/HALLUCINATED] labels you disagree with
   [ ] Note any AI errors → use as evidence for Skill 5 (postmortem)
       and Skill 10 (independent-reviewer)

👉 After completing the misinterpretation hunt, continue the workflow.
```

## References
- [parse_k6_csv.py](./scripts/parse_k6_csv.py)
- [k6 Metrics Reference](https://grafana.com/docs/k6/latest/using-k6/metrics/reference/)
