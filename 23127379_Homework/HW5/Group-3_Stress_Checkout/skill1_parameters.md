# [SKILL-1] Parameter Recommendations — Group 3 (Transactional)

**Endpoint:** `POST /api/checkout` (primary); `POST /api/cart` (prerequisite)
**Scenario:** Stress Testing
**Generated:** 2026-08-13 21:50:00
**Machine:** MacBook Air M5, 16GB RAM, macOS 26.4.1 Tahoe
**SUT:** http://localhost:3000 (local, SQLite backend)

---

## Baseline Measurement (no load)

| Metric | Value |
|---|---|
| Full flow | POST /api/login → POST /api/cart → POST /api/checkout |
| Primary endpoint measured | `POST /api/checkout` (creates order record in DB) |
| Auth required | Yes (JWT from login step) |
| DB operation | SQLite INSERT into orders table — heaviest write in the system |
| Breaking-point goal | VU count where error rate > 10% OR p95 > 5 s |

---

## Parameter Table

| Parameter | Value | Justification |
|---|---|---|
| **Primary endpoint** | `POST /api/checkout` | Creates order record — highest DB write cost in EShop |
| **Prerequisite** | `POST /api/cart` (add item before checkout) | Cart must have item; checkout without cart item = 400 |
| **Scenario** | Stress Testing | Goal is to find the breaking point via stepped VU escalation |
| **VU steps** | 10 → 30 → 60 → 100 → 150 → 200 | Each step doubles or adds 50 VUs — reveals non-linear degradation |
| **Stage pattern** | 30 s ramp-up + 30 s hold per step | Measure each plateau before stepping up |
| **Total duration** | ~13 min (12 × 30 s steps + 1 min teardown) | Long enough to observe DB write-lock saturation at high VU counts |
| **Think-time** | `sleep(Math.random() * 2 + 1)` → 1–3 s (between cart and checkout) | Simulates user reviewing cart before confirming — realistic for transactional flow |
| **Threshold — errors** | `http_req_failed: ['rate<0.10']` | > 10% error rate on checkout = breaking point |
| **Threshold — p95** | `http_req_duration: ['p(95)<5000']` | > 5 s checkout p95 = breaking point |
| **CSV input** | `order_payloads.csv` (product_id, product_name, price, quantity, shipping_address, total_amount) | Each VU iteration uses unique row to avoid cart conflicts |
| **VU row indexing** | `data[(exec.vu.idInTest + exec.scenario.iterationInTest) % data.length]` | Ensures no two VUs share the same cart row in the same iteration |
| **Checks — cart** | `status === 200` | Item added to cart successfully |
| **Checks — checkout** | `status === 200` + `order_id` present in response body | Order created and ID returned; missing order_id = silent bug |
| **Breaking point metric** | Stage where `POST /api/checkout` error rate first exceeds 10% | Report as "N VUs" breaking point |
| **Per-endpoint breakdown** | Cart step vs checkout step analysed separately in Skill 4 | Identify whether cart or checkout is the bottleneck |

---

## k6 Stages Snippet

### Stress Test (`23127379_Stress_20260813.js`)

```javascript
export const options = {
  stages: [
    { duration: '30s', target: 10  },  // step 1 ramp
    { duration: '30s', target: 10  },  // step 1 hold
    { duration: '30s', target: 30  },  // step 2 ramp
    { duration: '30s', target: 30  },  // step 2 hold
    { duration: '30s', target: 60  },  // step 3 ramp
    { duration: '30s', target: 60  },  // step 3 hold
    { duration: '30s', target: 100 },  // step 4 ramp
    { duration: '30s', target: 100 },  // step 4 hold
    { duration: '30s', target: 150 },  // step 5 ramp
    { duration: '30s', target: 150 },  // step 5 hold
    { duration: '30s', target: 200 },  // step 6 ramp
    { duration: '30s', target: 200 },  // step 6 hold — likely breaking point
    { duration: '1m',  target: 0   },  // ramp-down
  ],
  thresholds: {
    http_req_duration: ['p(95)<5000'],
    http_req_failed:   ['rate<0.10'],
  },
};
```

---

## Request Flow Per VU Iteration

```
Step 1: POST /api/login
  Body: { email, password }              ← from auth_users.csv (same seeded accounts)
  Extract: response.json().token

Step 2: POST /api/cart                   ← prerequisite (NOT the primary metric)
  Header: Authorization: Bearer <token>
  Body: { id, name, price, quantity }    ← from order_payloads.csv

  sleep(Math.random() * 2 + 1)          ← think-time: user reviews cart

Step 3: POST /api/checkout               ← PRIMARY measured endpoint
  Header: Authorization: Bearer <token>
  Body: { total_amount, shipping_address } ← from order_payloads.csv
  Assert: status === 200 AND order_id in response
```

---

## Scenario Justification

`POST /api/checkout` is the most write-intensive endpoint in EShop — it inserts
an order record into SQLite, which holds an exclusive write lock for the duration
of the INSERT. Under concurrent load, this serialises checkout operations.

Stress Testing is correct because the goal is to **find the breaking point**:
the VU count at which the system's error rate exceeds 10% or p95 exceeds 5 s.
Unlike Load Testing (operating within capacity) and Spike Testing (recovery from
shock), Stress Testing intentionally overwhelms the system to find its limits.

The cart step is a prerequisite — it must succeed for checkout to be valid —
but the analysis focus (Skill 4) is on `POST /api/checkout` performance.

---

## Risks to Watch

- **SQLite exclusive write lock:** Each checkout holds the SQLite write lock exclusively.
  Under 100+ VUs, requests queue up — this is the primary breaking mechanism.
- **SQLite WAL mode:** If WAL is not enabled, readers are also blocked during writes.
  FEASIBLE optimisation to label in Skill 4.
- **JWT expiry across long stress run:** 13-min run may exceed token TTL.
  Re-fetch token at start of each VU iteration.
- **Cart accumulation:** If the same user checks out repeatedly without clearing cart,
  total_amount may be inflated. Use fixed total_amount from CSV regardless.
- **Skill 7 prerequisite check:** Post-test, run lockout-reset-helper (Skill 7) to reset
  any accounts locked due to failed login attempts during the stress run.

---

## Pre-test Checklist

- [ ] `auth_users.csv` and `order_payloads.csv` both populated
- [ ] Confirm `POST /api/checkout` returns `order_id` in baseline curl test
- [ ] Activity Monitor open before starting test (capture screenshot)
- [ ] Skill 7 (lockout-reset-helper) ready to run post-test

---

## Review Status

- [ ] Approved by human reviewer
- [ ] Skill 10 independent review passed → see `skill10_review_params.md`
