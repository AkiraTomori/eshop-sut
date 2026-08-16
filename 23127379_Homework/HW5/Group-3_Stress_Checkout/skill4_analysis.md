## Analysis Results — Stress Test (20260816)
**Source file**: `23127379_Stress_20260816.csv` (45501 lines)
**Cross-check**: `summary.json`

| Metric | Value | Source |
|--------|-------|--------|
| Total Requests | 45501 | http_req_duration rows in CSV |
| Test Duration | 421.0s | timestamp: first → last http_req_duration row |
| Throughput | 108.08 req/s | Derived: 45501 / 421.0 |
| Avg Response Time | 12.7ms | http_req_duration metric_value, mean |
| p50 | 7.4ms | 50th percentile of http_req_duration |
| p95 | 34.7ms | 95th percentile of http_req_duration |
| p99 | 113.9ms | 99th percentile of http_req_duration |
| Max Response Time | 932.4ms | http_req_duration metric_value, max |
| Error Count | 0 | http_req_failed metric_value == 1.0 |
| Error Rate | 0.00% | 0 / 45501 × 100 |

### Per-Endpoint Breakdown
| Endpoint | Request Count | Avg (ms) | p95 (ms) |
|----------|---------------|----------|----------|
| POST /api/cart | 15167 | 4.8 | 13.0 |
| POST /api/checkout | 15167 | 20.9 | 43.3 |
| POST /api/login | 15167 | 12.3 | 38.1 |

**Breaking Point**: > 200 VUs. The system sustained 200 VUs without exceeding 10% error rate or 5000ms p95 on `POST /api/checkout`.

### Cross-check with summary.json
| Metric | CSV-computed | summary.json | Match? |
|--------|-------------|--------------|--------|
| p95 | 34.7ms | 34.704ms | ✅ |
| Error rate | 0.00% | 0.00% | ✅ |

### Errors Detected
| Timestamp | URL | HTTP Status | Error Code |
|-----------|-----|-------------|------------|
| N/A | N/A | N/A | N/A |
*(No errors detected during the test)*

## Proposed Performance Thresholds

| Metric | Measured | Proposed Threshold | Basis |
|--------|----------|--------------------|-------|
| p95 Response Time (Checkout) | 43.3ms | < 65.0ms | 1.5× buffer above measured value for checkout |
| Error Rate | 0.00% | < 2% | E-commerce industry standard |
| Throughput | 108.08 req/s | ≥ 97.2 req/s | 90% of measured capacity |
| Max Stable VUs | > 200 | 200 | System was perfectly stable up to 200 VUs |

## Optimization Recommendations

### [FEASIBLE] Enable SQLite WAL Mode
- **Why feasible**: EShop uses SQLite. `POST /api/checkout` heavily writes to the database. WAL allows concurrent reads while a write is in progress, drastically reducing locking issues under stress.
- **How to apply**: Add `PRAGMA journal_mode=WAL;` during DB connection init.

### [FEASIBLE] Reuse DB Connection (Singleton Pattern)
- **Why feasible**: If the backend opens a new SQLite connection per transaction, overhead is high. Ensuring the app uses a singleton connection pattern will improve `POST /api/checkout` performance.

### [HALLUCINATED] Horizontal Scaling / Load Balancer
- **Why hallucinated**: SUT runs as a single Node.js process with an SQLite DB on localhost. There is no load balancer or multi-node architecture to scale out.

### [HALLUCINATED] PostgreSQL Connection Pooling (pg-pool)
- **Why hallucinated**: EShop uses SQLite, not PostgreSQL. Connection pooling libraries like pg-pool do not apply.

### [HALLUCINATED] Redis Cache for Checkout
- **Why hallucinated**: EShop is a local demo app with no Redis. Additionally, checkout is inherently transactional and must hit the DB; caching it is logically unsound.
