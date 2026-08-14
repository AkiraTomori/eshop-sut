# [SKILL-2] Test Plan Notes — Group 3 Transactional

**Generated**: 2026-08-14 21:57:00
**Scenario**: Stress Testing
**Student ID**: 23127379

---

## Files Generated

| File | Purpose |
|---|---|
| `23127379_Stress_20260814.js` | Main stress test — find breaking point |
| `23127379_Stress_Endurance_20260814.js` | Soak test — 60 VUs × 15 min endurance threshold |
| `order_payloads.csv` | 50-row transactional data (5 products × 10 address variants) |
| `auth_users.csv` | Copied from Group 2 — 50 spike_user_N@eshop.test accounts |

---

## Design Decisions

### 1. Dual SharedArray — why two CSVs?

The script loads `order_payloads.csv` (row data for cart/checkout bodies) AND
`auth_users.csv` (login credentials) as separate SharedArrays. This is necessary
because the two concerns are independent:
- **Row indexing** for order data uses `(vu.idInTest - 1 + iterationInTest) % orders.length`
  to ensure no two VUs ever share the same cart row in the same iteration
- **User indexing** uses `(vu.idInTest - 1) % users.length` — VU N always logs in
  as the same user across all its iterations (simulating a real user session pattern)

### 2. Re-login per iteration (not in setup())

The 7-min main stress test approaches typical JWT TTL (commonly 1–24h, but unknown
for this SUT). The 15-min endurance run will almost certainly exceed a short TTL.
Re-logging in at the start of each iteration is the safe choice — it adds ~2–5ms
overhead per iteration but prevents cascading 401 failures at scale.

### 3. Object.assign() for auth headers + tags

k6 does not support tag merging natively. We use `Object.assign({}, authHeaders, { tags: { name: 'cart' } })`
to attach the `Authorization` header AND the tag together in a single options object
without mutating the shared `authHeaders` constant.

### 4. Per-tag threshold on `{name:checkout}`

In addition to the global `http_req_duration` threshold, we add:
```js
'http_req_duration{name:checkout}': ['p(95)<5000'],
```
This means k6 will independently mark PASS/FAIL for the checkout endpoint.
If login or cart degrades but checkout stays fast, the global threshold triggers
first — but Skill 4 can still isolate checkout performance using the CSV tag column.

### 5. 30s hold per step — known limitation

Per Skill 10 review: 30s hold is the bare minimum for stable p95 under SQLite
write-lock contention. At steps 5–6 (150–200 VUs), the p95 value at end-of-hold
may still be rising. **Treat the result at steps 5–6 as a lower bound** — the actual
degradation may be worse under sustained load (which the endurance script captures).

### 6. order_payloads.csv — product IDs 1–5 only

The EShop SUT has 5 products seeded (IDs 1–5, confirmed from Group 1 baseline run).
The CSV uses all 5 products across 50 rows (10 variants each) with realistic
Vietnamese addresses and prices. `total_amount` = price × quantity (pre-computed).

### 7. Data hygiene note

Each run inserts real order rows into SQLite. Running the stress test multiple times
without cleanup will accumulate order records, which may slightly shift checkout
latency on subsequent runs (larger table → longer sequential scans if no index on
`user_id` or `created_at`). **Document this in the report if cleanup is not performed.**

---

## Run Commands

```bash
# Main stress test (7 min)
cd 23127379_Homework/HW5/Group-3_Stress_Checkout
k6 run --out csv=results/23127379_Stress_20260814.csv 23127379_Stress_20260814.js

# Endurance soak test (15 min) — run AFTER main stress test to confirm stable VU level
k6 run --out csv=results/23127379_Stress_Endurance_20260814.csv 23127379_Stress_Endurance_20260814.js
```

---

## Pre-run Checklist

- [x] SUT running: `curl http://localhost:3000/api/products` returns 200
- [x] Confirm product IDs 1–5 exist in SUT
- [x] All 50 spike_user_N accounts verified in SUT (from Group 2 setup)
- [x] `results/` directory created (already done)
- [x] Activity Monitor open (screenshot before run starts)
- [x] k6 version: `k6 version`
