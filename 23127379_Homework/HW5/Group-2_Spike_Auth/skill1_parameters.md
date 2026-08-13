# [SKILL-1] Parameter Recommendations — Group 2 (Auth-heavy)

**Endpoint:** `PUT /api/users/me` (requires JWT — login first, then update profile)
**Scenario:** Spike Testing
**Generated:** 2026-08-13 21:50:00
**Machine:** MacBook Air M5, 16GB RAM, macOS 26.4.1 Tahoe
**SUT:** http://localhost:3000 (local, SQLite backend)

---

## Baseline Measurement (no load)

| Metric | Value |
|---|---|
| Test accounts | 1 existing; agent seeds 50 via POST /api/register before test |
| Auth flow | POST /api/login → extract JWT → PUT /api/users/me with Bearer token |
| Lockout mechanism | None on PUT /api/users/me (Skill 7 not required) |
| Primary endpoint | `PUT /api/users/me` |
| DB operation | SQLite UPDATE (users table) — write operation |

---

## Parameter Table

| Parameter | Value | Justification |
|---|---|---|
| **Endpoint** | `PUT /api/users/me` (JWT required) | Auth+write endpoint; JWT overhead + DB write under spike reveals recovery behaviour |
| **Scenario** | Spike Testing | Sudden traffic shock exposes JWT bottleneck and SQLite write-lock recovery |
| **Baseline VUs** | 10 | Low steady-state simulating normal authenticated users |
| **Spike VUs** | 150 (sudden) | 15× baseline increase in ≤ 10 s — meets spike definition (10–20× rule) |
| **Ramp-up to baseline** | 2 min to 10 VUs | Establish steady baseline before the shock |
| **Spike ramp** | 10 s from 10 → 150 VUs | Must be < 10 s to be classified as spike, not ramp-up |
| **Spike hold** | 1 min @ 150 VUs | Hold long enough to observe queue saturation |
| **Recovery** | 30 s from 150 → 10 VUs | Measure how fast p95 returns to baseline |
| **Post-recovery hold** | 2 min @ 10 VUs | Confirm system stabilises (not just a transient dip) |
| **Ramp-down** | 30 s to 0 | Clean teardown |
| **Total duration** | ~6 min | Spike test is short by design |
| **Think-time** | `sleep(Math.random() * 0.5 + 0.25)` → 0.25–0.75 s | Short think-time maximises spike realism for auth flows |
| **Iterations** | Duration-based | Continuous per-VU iterations throughout stages |
| **Threshold — errors** | `http_req_failed: ['rate<0.30']` | Allow up to 30% fail rate during spike; focus on 5xx bugs |
| **Threshold — p95** | `http_req_duration: ['p(95)<3000']` | 3 s limit; JWT under 150 VUs may add latency |
| **CSV input** | `auth_users.csv` (50 rows: email, password, name, phone, shipping_address) | Each VU uses own account via `(vu.idInTest - 1) % accounts.length` |
| **Checks — login** | `status === 200` + `token !== null` | Confirm JWT extracted before PUT |
| **Checks — PUT** | `status === 200` | Profile update confirmed |
| **Key metric** | Recovery time = elapsed from spike-drop to baseline p95 restored | Primary Spike Test KPI |

---

## k6 Stages Snippet

### Spike Test (`23127379_Spike_20260813.js`)

```javascript
export const options = {
  stages: [
    { duration: '2m',  target: 10  },  // establish baseline
    { duration: '10s', target: 150 },  // spike: sudden 15x increase
    { duration: '1m',  target: 150 },  // hold spike — observe saturation
    { duration: '30s', target: 10  },  // recovery ramp-down
    { duration: '2m',  target: 10  },  // confirm return to baseline
    { duration: '30s', target: 0   },  // teardown
  ],
  thresholds: {
    http_req_duration: ['p(95)<3000'],
    http_req_failed:   ['rate<0.30'],
  },
};
```

---

## Request Flow Per VU Iteration

```
Step 1: POST /api/login
  Body: { email, password }        ← from auth_users.csv
  Extract: response.json().token

Step 2: PUT /api/users/me          ← PRIMARY measured endpoint
  Header: Authorization: Bearer <token>
  Body: { name, phone, shipping_address }   ← from auth_users.csv
  Assert: status === 200
```

---

## Scenario Justification

`PUT /api/users/me` requires JWT authentication — every VU iteration must first
call `POST /api/login`. Under a spike, 150 simultaneous login + profile-update
flows stress both JWT generation (CPU) and SQLite users-table writes (I/O).

Spike Testing is correct because it measures **recovery behaviour**: does the
system return to baseline p95 after absorbing a sudden burst? No lockout risk
(all VUs use valid credentials). Skill 7 is not needed.

---

## Risks to Watch

- **JWT token expiry:** Re-fetch token every iteration to avoid stale 401s.
- **SQLite write-lock contention:** 150 concurrent UPDATEs serialise in WAL — p95 spike expected.
- **Account seeding prerequisite:** `seed_accounts.js` must complete before running this test.
- **3 VUs per account:** With 50 accounts and 150 VUs, concurrent updates to same user_id
  may trigger row-level lock. SQLite handles this gracefully but adds latency.

---

## Pre-test Checklist

- [ ] `seed_accounts.js` run — 50 accounts confirmed in DB
- [ ] `auth_users.csv` has 50 rows
- [ ] `POST /api/login` returns `token` in response body
- [ ] `PUT /api/users/me` with valid token returns 200

---

## Review Status

- [ ] Approved by human reviewer
- [ ] Skill 10 independent review passed → see `skill10_review_params.md`
