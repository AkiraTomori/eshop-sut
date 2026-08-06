---
name: jtl-log-analyzer
description: >-
  Use this skill when the user has a raw .jtl file from JMeter (or CSV from k6)
  and wants to compute real performance metrics and get optimization suggestions.
  Trigger phrases: "analyze jtl", "analyze results", "calculate p95",
  "compute error rate", "analysis ready", or when user provides a .jtl file
  path after Skill 3. This skill computes p95/p99/error rate/throughput from
  ACTUAL log data only — every number must cite specific rows in the raw .jtl.
  It proposes performance thresholds and labels each optimization recommendation
  as [FEASIBLE] or [HALLUCINATED] with clear reasoning. Must analyze each group
  individually — do not mix .jtl files from different scenarios. STOPS and
  waits for human misinterpretation review before any report is compiled.
---

# Skill 4 — jtl-log-analyzer

## Purpose
Parse the raw `.jtl` file, compute real performance metrics, propose thresholds,
and label optimization recommendations as **[FEASIBLE] / [HALLUCINATED]**.
**Every number must be traceable to a specific line in the .jtl.**

---

## Required Input

- `[JTL_FILE]` — full path to the `.jtl` file
- `[SCENARIO_TYPE]` — Load / Stress / Spike
- `[ENDPOINT_GROUP]` — read-heavy / auth-heavy / transactional

---

## Step 1 — Validate .jtl Format

JMeter `.jtl` default CSV columns:

```
timeStamp,elapsed,label,responseCode,responseMessage,threadName,
dataType,success,failureMessage,bytes,sentBytes,grpThreads,allThreads,
URL,Latency,IdleTime,Connect
```

Run validation:

```bash
# View header
head -1 {JTL_FILE}

# Count total records
wc -l {JTL_FILE}

# View first 5 data rows
sed -n '2,6p' {JTL_FILE}
```

Or use the Python script: [scripts/parse_jtl.py](./scripts/parse_jtl.py)

---

## Step 2 — Compute Metrics (source citations required)

```python
import pandas as pd
import numpy as np

df = pd.read_csv('{JTL_FILE}')
df['timestamp'] = pd.to_datetime(df['timeStamp'], unit='ms')

print("=== PERFORMANCE METRICS ===")
print(f"Total Requests : {len(df)}")
print(f"Test Duration  : {(df['timeStamp'].max() - df['timeStamp'].min())/1000:.1f}s")
print(f"Throughput     : {len(df) / ((df['timeStamp'].max()-df['timeStamp'].min())/1000):.2f} req/s")
print()
print("=== RESPONSE TIME (ms) — from 'elapsed' column ===")
print(f"Min  : {df['elapsed'].min()}")
print(f"Avg  : {df['elapsed'].mean():.1f}")
print(f"p50  : {df['elapsed'].quantile(0.50):.1f}")
print(f"p90  : {df['elapsed'].quantile(0.90):.1f}")
print(f"p95  : {df['elapsed'].quantile(0.95):.1f}")
print(f"p99  : {df['elapsed'].quantile(0.99):.1f}")
print(f"Max  : {df['elapsed'].max()}")
print()
print("=== ERROR ANALYSIS ===")
errors = df[df['success'] == False]
print(f"Error Count : {len(errors)}")
print(f"Error Rate  : {len(errors)/len(df)*100:.2f}%")
print(f"Error Types : {errors['responseCode'].value_counts().to_dict()}")
```

> **Important**: Always use the `elapsed` column for response time.
> Do NOT use `Latency` (time-to-first-byte only) or `Connect` (connection time only).

### Required output format

```markdown
## Analysis Results — {SCENARIO_TYPE} Test ({DATE})
**Source file**: `{JTL_FILE}` ({total_lines} lines, {file_size})

| Metric | Value | Source (row in .jtl) |
|--------|-------|----------------------|
| Total Requests | {n} | Rows 2–{n+1} |
| Test Duration | {d}s | timeStamp: row 2 → row {n+1} |
| Throughput | {t} req/s | Derived: {n}/{d} |
| Avg Response Time | {avg}ms | elapsed col, all rows |
| p50 | {p50}ms | 50th percentile of elapsed |
| p95 | {p95}ms | 95th percentile: ~row {p95_row} |
| p99 | {p99}ms | 99th percentile: ~row {p99_row} |
| Max Response Time | {max}ms | elapsed col max: row {max_row} |
| Error Count | {err} | success=false: rows {err_rows} |
| Error Rate | {err_pct}% | {err}/{n} × 100 |

### Errors Detected (from raw .jtl)
| Row # | Timestamp | Label | HTTP Code | Error Message |
|-------|-----------|-------|-----------|---------------|
| {row} | {ts} | {label} | {code} | {msg} |
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
| Max Stable Users | {max_threads} | {max_stable_threads} | From stable region of test |
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
  Based on error at .jtl row {row_no} (elapsed={elapsed}ms, code={code}).

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
# Extreme outliers (elapsed > p99 × 3)
p99 = df['elapsed'].quantile(0.99)
outliers = df[df['elapsed'] > p99 * 3]
print(f"Extreme outliers: {len(outliers)}")

# Error rate over time (detect degradation)
df['minute'] = df['timestamp'].dt.floor('1min')
error_by_time = df.groupby('minute').apply(
    lambda x: (x['success'] == False).sum() / len(x) * 100
)
print("Error rate per minute:")
print(error_by_time)

# Rising response time trend (possible memory/connection leak)
df['rolling_avg'] = df['elapsed'].rolling(100).mean()
```

---

## Audit Log

Append to `hw05_audit_log.md`:

```markdown
## [SKILL-4] jtl-log-analyzer — {timestamp}
- **Input**: {jtl_file} ({size}, {lines} rows)
- **Metrics**: p95={p95}ms, error_rate={err}%, throughput={t}rps
- **Threshold proposed**: p95 < {threshold}ms
- **Optimizations**: {n_feasible} feasible, {n_hallucinated} hallucinated
- **Source citations**: all numbers traced to .jtl rows
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
   [ ] Verify p95 by manually checking the .jtl
   [ ] Confirm the AI used the 'elapsed' column, not 'Latency'
   [ ] Flag any [FEASIBLE/HALLUCINATED] labels you disagree with
   [ ] Note any AI errors → use as evidence for Skill 5 (postmortem)
       and Skill 10 (independent-reviewer)

👉 After completing the misinterpretation hunt, continue the workflow.
```

## References
- [parse_jtl.py](./scripts/parse_jtl.py)
