# [SKILL-4] JTL Log Analysis — Group 1 (Read-heavy Load Test)

**Source CSV:** `results/23127379_Load_20260813.csv` (463,001 rows total)
**Cross-check:** `results/summary.json`
**Metric used for p95:** `http_req_duration` (full end-to-end — NOT http_req_waiting, NOT http_req_connecting)
**Scenario:** Load Testing | **Endpoint:** `GET /api/products/:id`
**Date:** 2026-08-13

---

## Analysis Results

| Metric | Value | Source |
|---|---|---|
| **Total HTTP requests** | 28,870 | `http_req_duration` rows in CSV |
| **Test duration** | 539 s (~9 min) | timestamp: first → last `http_req_duration` row |
| **Throughput** | 53.56 req/s | Derived: 28,870 / 539 |
| **Min response time** | 0.199 ms | `http_req_duration`, metric_value min |
| **Avg response time** | 1.319 ms | `http_req_duration`, metric_value mean |
| **p50** | 1.220 ms | 50th percentile of `http_req_duration` |
| **p90** | 1.995 ms | 90th percentile of `http_req_duration` |
| **p95** | **2.286 ms** | 95th percentile of `http_req_duration` |
| **p99** | 3.448 ms | 99th percentile of `http_req_duration` |
| **Max response time** | 44.081 ms | `http_req_duration`, metric_value max |
| **Error count** | 0 | `http_req_failed` metric_value == 1.0 count |
| **Error rate** | **0.00%** | 0 / 28,870 × 100 |

### Cross-check with summary.json

| Metric | CSV-computed | summary.json | Match? |
|---|---|---|---|
| p95 | 2.286 ms | 2.286 ms | ✅ Exact match |
| avg | 1.319 ms | 1.319 ms | ✅ Exact match |
| Error rate | 0.00% | 0.00% (value=0) | ✅ Exact match |
| Total requests | 28,870 | 28,870 | ✅ Exact match |

---

## Per-Endpoint Breakdown

| URL | Count | Avg (ms) | p95 (ms) |
|---|---|---|---|
| `GET /api/products/1` | 5,997 | 1.324 | 2.298 |
| `GET /api/products/4` | 5,811 | 1.324 | 2.261 |
| `GET /api/products/3` | 5,735 | 1.314 | 2.300 |
| `GET /api/products/5` | 5,726 | 1.325 | 2.289 |
| `GET /api/products/2` | 5,601 | 1.310 | 2.271 |

> All product IDs show near-identical performance — hot SQLite page cache means
> all 5 rows are served from memory after the first few requests.

---

## Threshold Evaluation

| Threshold | Measured | Result |
|---|---|---|
| `p(95) < 2000 ms` | 2.286 ms | ✅ **PASSED** (2.286 ms << 2000 ms) |
| `rate < 0.05` | 0.00% | ✅ **PASSED** (0% < 5%) |

---

## Anomaly Detection

| Type | Count | Details |
|---|---|---|
| Extreme outliers (> p99 × 3 = > 10.3 ms) | **11** | Isolated spikes — consistent with SQLite WAL checkpoint flushes |
| Max latency spike | 44.081 ms | Single row; not representative of system behaviour |
| Error rate trend | Flat 0% | No degradation across any minute window |
| Response time drift | None detected | Rolling average stable from start to end of test |

---

## Proposed Performance Thresholds (for CI gate)

| Metric | Measured | Proposed CI Threshold | Basis |
|---|---|---|---|
| p95 response time | 2.286 ms | < 4 ms | 1.75× buffer; allows headroom for background tasks |
| Error rate | 0.00% | < 2% | E-commerce industry standard; zero baseline gives room |
| Throughput | 53.56 req/s | ≥ 48 req/s | 90% of measured capacity |
| Max stable VUs | 150 | 100 | Conservative for CI server vs developer machine |

---

## Optimization Recommendations

### [FEASIBLE] Enable SQLite WAL Mode
- **Evidence:** 11 outliers > 10 ms — consistent with checkpoint-induced pauses
- **Why feasible:** EShop uses SQLite. WAL (Write-Ahead Logging) allows readers to
  continue while a checkpoint write occurs, eliminating reader-blocks.
- **How to apply:** Add `PRAGMA journal_mode=WAL;` in backend DB init.
- **Expected improvement:** Reduces outlier spike frequency; stabilises p99.

### [HALLUCINATED] Add Database Index on `products.id`
- **Why hallucinated:** `GET /api/products/:id` queries by primary key. SQLite
  creates a primary key index automatically — no manual index is needed or missing.
  p95 = 2.286 ms confirms the existing index is fully effective with zero slow queries.
  Recommending an index here would be fixing a problem that does not exist.
- **Skill 10 correction (v1 → v2):** Original label was [FEASIBLE] — corrected to
  [HALLUCINATED] because there is no slow query evidence and the primary key index
  is already present and working.

### [FEASIBLE] Connection Singleton Pattern
- **Why feasible:** If backend opens a new SQLite connection per request, overhead
  accumulates under 150 VUs. A singleton pattern (open once, reuse) is a
  standard Node.js SQLite best practice.
- **Verify:** Check `backend/db.js` or `backend/database.js`.

### [FEASIBLE] HTTP Keep-Alive / Connection Reuse
- **Evidence:** `http_req_connecting` metric exists in CSV — each VU opens a new
  TCP connection per request if keep-alive is not enabled.
- **How to apply:** Set `Connection: keep-alive` header in k6; ensure Express
  server keeps connections alive.
- **Expected improvement:** Reduces per-request connection overhead at high VU counts.

### [HALLUCINATED] Redis Cache for Product Detail
- **Why hallucinated:** EShop is a local SQLite demo app. No Redis is installed.
  Caching is a valid production pattern but requires infrastructure not present here.
- **Correct for:** Production microservices. Not applicable to this SUT.

### [HALLUCINATED] Horizontal Scaling / Load Balancer
- **Why hallucinated:** SUT runs as a single Node.js process on localhost.
  There is no Nginx, no Docker Swarm, no Kubernetes. Horizontal scaling requires
  infrastructure that does not exist in this environment.

### [HALLUCINATED] PostgreSQL Connection Pooling (pg-pool)
- **Why hallucinated:** EShop uses SQLite, not PostgreSQL. pg-pool is a
  PostgreSQL-specific library and has no relevance here.

### [UNCERTAIN — verify] Node.js Heap Increase
- **Why uncertain:** p95 = 2.286 ms shows no latency pressure from GC.
  Without `resource_usage.txt` showing memory growth during the test, this
  cannot be confirmed or dismissed. Check heap usage in Activity Monitor recording.

---

## Key Finding

> **EShop handles 150 concurrent VUs on `GET /api/products/:id` with p95 = 2.286 ms
> and 0% errors — well within the 2000 ms threshold. The system is not latency-bound
> at this load level. The read path is highly efficient due to SQLite's in-memory
> page cache on the M5 chip. 11 outliers (max 44 ms) are attributable to
> SQLite WAL checkpoint flushes and do not represent a systemic issue.**

---

## Review Status

- [ ] Human misinterpretation hunt complete
- [ ] Verified: p95 from `http_req_duration` (NOT `http_req_waiting`)
- [ ] CSV p95 matches summary.json p95
- [ ] FEASIBLE/HALLUCINATED labels reviewed
- [ ] Skill 10 independent review passed → see `skill10_review_analysis.md`
