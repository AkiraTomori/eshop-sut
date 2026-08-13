# [SKILL-1] Parameter Recommendations — Group 1 (Read-heavy)

**Endpoint:** `GET /api/products/:id`
**Scenario:** Load Testing
**Generated:** 2026-08-13 21:49:00
**Machine:** MacBook Air M5, 16GB RAM, macOS 26.4.1 Tahoe
**SUT:** http://localhost:3000 (local, SQLite backend)

---

## Baseline Measurement (no load)

| Metric | Value |
|---|---|
| Products in DB | 5 (IDs: 1, 2, 3, 4, 5) |
| Baseline latency (min) | ~3 ms |
| Baseline latency (max) | ~8 ms |
| Auth required | No |
| DB operation | SQLite SELECT by primary key (read-only) |

---

## Parameter Table

| Parameter | Value | Justification |
|---|---|---|
| **Endpoint** | `GET /api/products/:id` | Read-only, no auth, SQLite SELECT — ideal for sustained load profiling |
| **Scenario** | Load Testing | Read-heavy = sustained normal+high load, NOT a crash/spike scenario |
| **VUs** | 50 → 100 → 150 (stepped) | Gradual escalation reveals inflection points in p95; 150 VUs is heavy for local SQLite |
| **Ramp-up** | 1 min to first stage (50 VUs) | ≥ 30s required; 60s gives SQLite connection pool time to warm up |
| **Hold duration** | 5 min @ 100 VUs, 2 min @ 150 VUs | Long enough for p95 to stabilise at each plateau |
| **Ramp-down** | 1 min to 0 | Clean teardown; avoids false-positive trailing errors |
| **Total duration** | ~9 min (load) + 15 min (endurance soak) | Two separate script files |
| **Think-time** | `sleep(Math.random() * 1 + 1)` → 1–2 s | Realistic browsing cadence; prevents thundering-herd on SQLite reader |
| **Iterations** | Duration-based (no fixed count) | Continuous until stages end; more representative of real traffic |
| **Threshold — p95** | `http_req_duration: ['p(95)<2000']` | 2 s limit; baseline 3–8 ms gives ~250x headroom — fair for SQLite under load |
| **Threshold — errors** | `http_req_failed: ['rate<0.05']` | < 5% error rate; GET /products/:id should almost never 5xx |
| **CSV input** | `products_data.csv` (5 rows, IDs 1–5) | VU picks row by `(vu.idInTest - 1) % 5` — each VU cycles its own product ID |
| **Checks** | `status === 200` + `body.length > 0` | Verify product returned, not empty / 404 |

---

## k6 Stages Snippet

### Load Test (`23127379_Load_20260813.js`)

```javascript
export const options = {
  stages: [
    { duration: '1m',  target: 50  },  // ramp-up
    { duration: '5m',  target: 100 },  // sustained normal load
    { duration: '2m',  target: 150 },  // peak load
    { duration: '1m',  target: 0   },  // ramp-down
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'],
    http_req_failed:   ['rate<0.05'],
  },
};
```

### Endurance / Soak Test (`23127379_Load_Endurance_20260813.js`)

```javascript
export const options = {
  stages: [
    { duration: '2m',  target: 100 },  // ramp-up
    { duration: '11m', target: 100 },  // sustained soak (find memory/CPU ceiling)
    { duration: '2m',  target: 0   },  // ramp-down
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'],
    http_req_failed:   ['rate<0.05'],
  },
};
```

---

## Scenario Justification

`GET /api/products/:id` is a stateless, read-only endpoint hitting SQLite with a
SELECT by primary key. No auth overhead, no write contention, no side effects —
making it the ideal Load Testing target. Load Testing applies sustained, realistic
concurrency to measure how the system degrades from baseline to near-capacity.
At what VU count does p95 start climbing from ~8 ms toward the 2 s threshold?

---

## Risks to Watch

- **SQLite read concurrency:** Multiple concurrent readers share the page cache. Under 150 VUs
  all cycling the same 5 IDs, WAL checkpoint intervals may introduce occasional latency spikes.
- **Node.js single-threaded event loop:** At 150 VUs the request queue grows non-linearly —
  expect a step-change in p95, not a gradual slope.
- **Hot cache bias:** Only 5 product IDs mean SQLite page cache is always warm after first
  requests — results slightly optimistic vs. a real catalog.
- **k6 + SUT on same machine:** CPU is shared. Activity Monitor must capture both processes.

---

## Review Status

- [x] Approved by human reviewer
- [x] Skill 10 independent review passed → see `skill10_review_params.md`
