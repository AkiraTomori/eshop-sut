# [SKILL-1] Parameter Recommendations — Group 3 (Transactional)

**Endpoint:** `POST /api/checkout` (primary); `POST /api/cart` (prerequisite)
**Scenario:** Stress Testing
**Generated:** 2026-08-14 21:27:00
**Machine:** MacBook Air M5, 16GB RAM, macOS 26.4.1 Tahoe
**SUT:** http://localhost:3000 (local, SQLite backend)

---

## Context from Prior Groups

| Group | p95 (no-load) | p95 (peak load) | Error rate | Throughput |
|---|---|---|---|---|
| Group 1 — GET /api/products/:id (Load, 150 VU) | ~3–8 ms baseline | 2.286 ms | 0.00% | 53.56 rps |
| Group 2 — PUT /api/users/me (Spike, 150 VU) | — | 5.744 ms | 0.00% | 76.52 rps |

**Observations for Group 3 planning:**
- Both read and profile-update endpoints are very fast (< 6 ms p95) — SQLite performs well under read/simple-write load
- Both prior groups passed all thresholds with no errors at 150 VUs
- The checkout endpoint (SQLite exclusive INSERT to `orders` table) is categorically heavier than either prior endpoint
- WAL checkpoint spikes seen in both groups (max 44–95 ms) confirm SQLite I/O pressure is real at high VU counts
- Group 3 aims to actually **break** the system — start lower and step up aggressively

---

## Baseline Measurement (no load)

| Metric | Value |
|---|---|
| Full flow | POST /api/login → POST /api/cart → POST /api/checkout |
| Primary endpoint measured | `POST /api/checkout` (creates order record in DB) |
| Auth required | Yes (JWT from login step, re-fetched each iteration) |
| DB operation | SQLite INSERT into orders table — exclusive write lock per transaction |
| Breaking-point goal | VU count where checkout error rate > 10% **OR** checkout p95 > 5 s |

---

## Parameter Table

| Parameter | Value | Justification |
|---|---|---|
| **Primary endpoint** | `POST /api/checkout` | Creates order record — highest DB write cost in EShop |
| **Prerequisite step** | `POST /api/cart` body: `{id, name, price, quantity}` | Cart must have item; checkout with empty cart = 400 |
| **Auth step** | `POST /api/login` body: `{email, password}` | JWT re-fetched per iteration to avoid expiry during 13-min run |
| **Scenario** | Stress Testing | Goal = find the breaking point via stepped VU escalation |
| **VU steps** | 10 → 30 → 60 → 100 → 150 → 200 | Non-linear escalation; prior groups comfortable at 150 — step through it |
| **Stage pattern** | 30 s ramp + 30 s hold per step | Plateau at each level to stabilise p95 before stepping up |
| **Total duration** | ~7 min (12 × 30 s stages + 1 min ramp-down) | Covers all 6 VU steps; p95 trend across steps is the analysis signal |
| **Think-time** | `sleep(1 + Math.random() * 2)` → 1–3 s **between cart and checkout** | Simulates user reviewing cart before confirming order |
| **No think-time after login** | `sleep(0.2 + Math.random() * 0.3)` → 0.2–0.5 s | Short pause between login and cart add (realistic navigation) |
| **Threshold — p95** | `http_req_duration: ['p(95)<5000']` | > 5 s checkout p95 = breaking point |
| **Threshold — errors** | `http_req_failed: ['rate<0.10']` | > 10% error rate on checkout = breaking point |
| **CSV input** | `order_payloads.csv` (columns: `product_id, product_name, price, quantity, shipping_address, total_amount`) | Each row = one product for cart body + checkout shipping |
| **VU row indexing** | `data[(exec.vu.idInTest + exec.scenario.iterationInTest) % data.length]` | No two VUs share the same CSV row per iteration |
| **Checks — login** | `status === 200` before extracting `.json('token')` | Guard against failed login at high load crashing VU |
| **Checks — cart** | `status === 200` | Item added successfully |
| **Checks — checkout** | `status === 200` **AND** `order_id` present in response body | Verify order was actually written; missing `order_id` = silent bug |
| **Tags** | `{name: 'cart'}` and `{name: 'checkout'}` on respective requests | Required for per-endpoint breakdown in Skill 4 |
| **Breaking-point metric** | Stage where `checkout` tagged requests first exceed 10% error rate | Report as "N VUs = breaking point" |
| **Post-test cleanup** | Run Skill 7 (lockout-reset-helper) after test | Any failed logins at high VU may lock accounts |

---

## k6 Stages Snippet

```javascript
export const options = {
  stages: [
    { duration: '30s', target: 10  },  // step 1 ramp-up
    { duration: '30s', target: 10  },  // step 1 hold
    { duration: '30s', target: 30  },  // step 2 ramp-up
    { duration: '30s', target: 30  },  // step 2 hold
    { duration: '30s', target: 60  },  // step 3 ramp-up
    { duration: '30s', target: 60  },  // step 3 hold
    { duration: '30s', target: 100 },  // step 4 ramp-up
    { duration: '30s', target: 100 },  // step 4 hold
    { duration: '30s', target: 150 },  // step 5 ramp-up (prior groups were OK here)
    { duration: '30s', target: 150 },  // step 5 hold
    { duration: '30s', target: 200 },  // step 6 ramp-up — likely breaking point
    { duration: '30s', target: 200 },  // step 6 hold
    { duration: '1m',  target: 0   },  // ramp-down
  ],
  thresholds: {
    http_req_duration:               ['p(95)<5000'],  // global p95 guard
    'http_req_duration{name:checkout}': ['p(95)<5000'],  // checkout-specific p95
    http_req_failed:                 ['rate<0.10'],   // global error guard
  },
};
```

---

## Request Flow Per VU Iteration

```
Step 1: POST /api/login
  Body: { email, password }             ← from auth_users.csv (re-login each iteration)
  check: status === 200
  Extract: response.json('token')       ← guard with check() first
  sleep(0.2 + Math.random() * 0.3)     ← 0.2–0.5 s (navigation think-time)

Step 2: POST /api/cart                  ← prerequisite (tagged: {name: 'cart'})
  Header: Authorization: Bearer <token>
  Body: { id, name, price, quantity }   ← from order_payloads.csv row
  check: status === 200

  sleep(1 + Math.random() * 2)         ← 1–3 s think-time between cart and checkout

Step 3: POST /api/checkout              ← PRIMARY measured endpoint (tagged: {name: 'checkout'})
  Header: Authorization: Bearer <token>
  Body: { total_amount, shipping_address } ← from order_payloads.csv row
  check: status === 200 AND order_id present in response body
```

---

## Scenario Justification

`POST /api/checkout` is the most write-intensive endpoint in EShop — it inserts an order
record into SQLite under an exclusive write lock. Unlike reads (Group 1) and profile updates
(Group 2), concurrent checkout requests must be serialised at the DB layer, meaning the
system's throughput ceiling is fundamentally limited by SQLite's single-writer model.

**Stress Testing** is the correct scenario because:
- Load Testing would only confirm normal operations — we already know the system handles 150 VUs on reads
- Spike Testing focuses on recovery — not relevant when the mechanism is a write lock, not cold-start
- Only Stress Testing (stepped VU escalation past capacity) reveals the breaking point

Evidence from prior groups that 150 VUs is a comfortable ceiling for reads/profile writes
makes it important to include steps **above** 150 VUs to actually stress the checkout writer.

---

## Risks to Watch

| Risk | Likelihood | Mitigation |
|---|---|---|
| SQLite exclusive write lock serialises checkout at high VU | **HIGH** | This is the expected breaking mechanism — record the stage |
| SQLite WAL mode absent → readers also blocked | Medium | FEASIBLE optimisation label in Skill 4 |
| JWT expiry during 13-min run | Medium | Re-login at the start of every VU iteration (not once in `setup()`) |
| Cart accumulation inflating total_amount | Low | Use fixed `total_amount` from CSV regardless of cart state |
| Login failures locking accounts at peak VU | Low-Medium | check() on login; Skill 7 post-test; SUT lockout only triggers on repeated bad passwords |
| Order data accumulation affecting reproducibility | Medium | Document if cleanup not performed between runs |

---

## Data Requirements

### `order_payloads.csv` — required columns

| Column | Example value | Used in |
|---|---|---|
| `product_id` | `1` | cart body `id` field |
| `product_name` | `"Áo thun nam"` | cart body `name` field |
| `price` | `150000` | cart body `price` field |
| `quantity` | `1` | cart body `quantity` field |
| `shipping_address` | `"123 Lê Lợi, Q1, TP.HCM"` | checkout body `shipping_address` |
| `total_amount` | `150000` | checkout body `total_amount` |

Minimum rows: **50** (enough for 200 VUs × modulo indexing without collision within a single iteration).

### `auth_users.csv` — reuse from Group 2
Use the same 50-account CSV seeded for Group 2. Login credentials needed for JWT.

---

## Endurance / Soak Test Parameters (HW05 Task 1 — mandatory)

> HW05 Task 1 requires a short soak test (~10–15 min at sustained load) to find the hardware's endurance threshold. Run this **after** the main stress run to determine the stable VU ceiling.

**Target VU count**: 60 VUs (step 3 of the stress test — expected to be below the breaking point; confirm from stress run results)

| Parameter | Value | Justification |
|---|---|---|
| **Script filename** | `23127379_Stress_Endurance_YYYYMMDD.js` | Follows naming convention; separate script from main stress run |
| **VUs** | 60 (constant) | Last step confirmed stable in stress run before breaking point |
| **Duration** | 15 min constant load | Long enough to detect memory growth, GC pauses, WAL checkpoint accumulation |
| **Think-time** | Same as main script: `sleep(1 + Math.random() * 2)` between cart/checkout | Consistent with stress run |
| **Thresholds** | Same as main: `p(95)<5000`, `rate<0.10` | Monitor for degradation over time |
| **Evidence to capture** | Activity Monitor screenshot at 0 min, 5 min, 10 min, 15 min | Shows memory growth / CPU stabilization |
| **Report metric** | Maximum stable RPS + memory ceiling at 15-min mark | Required by HW05 as concrete endurance threshold number |

**Note**: If the stress run shows the breaking point is at or below 60 VUs, adjust the endurance VU count to 30 VUs (step 2) — always use the last stable step.

---


## Pre-test Checklist

- [x] `order_payloads.csv` populated with ≥ 50 rows (valid product IDs from live SUT)
- [x] `auth_users.csv` present with ≥ 50 accounts (reuse from Group 2)
(Note: change gmail to @stress to indicate stress-test accounts, not real users)
- [x] Confirm `POST /api/checkout` returns `order_id` in baseline `curl` test
- [x] Activity Monitor open before starting test (screenshot for evidence)
- [x] Skill 7 (lockout-reset-helper) ready to run post-test

---

## Review Status

- [x] Approved by human reviewer
- [x] Skill 10 independent review passed → see `skill10_review_params_g3.md`
