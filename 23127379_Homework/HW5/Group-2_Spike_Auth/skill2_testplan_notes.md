# Skill 2 — Test Plan Notes (Group 2: Auth-heavy Spike Test)

**Generated**: 2026-08-14  
**Student ID**: 23127379  
**Script**: `23127379_Spike_20260814.js`  
**CSV**: `auth_users.csv`

---

## Run Commands

```bash
cd 23127379_Homework/HW5/Group-2_Spike_Auth

# Spike test
k6 run \
  --out csv=results/23127379_Spike_20260814.csv \
  --summary-export=results/summary_export.json \
  -e BASE_URL=http://localhost:3000 \
  23127379_Spike_20260814.js
```

> `handleSummary()` also auto-writes `results/summary.html` and `results/summary.json` at end of run.

---

## Design Decisions

### Primary vs Prerequisite Endpoint
- **Primary endpoint under test**: `PUT /api/users/me`
- **Prerequisite**: `POST /api/login` — runs **once per iteration** to obtain a fresh JWT token
- This matches AGENTS.md Group 2 spec: *"login first, then update profile"*

### Account Assignment (Medium issue M1 from Skill 10 — resolved here)
- 50 accounts rotated across 150 spike VUs via `(__VU - 1) % users.length`
- This means ~3 VUs share each account concurrently at spike peak
- **Safe**: `PUT /api/users/me` has **no lockout mechanism** (lockout only applies to `POST /api/login` with wrong password; all accounts use correct credentials)
- If 1:1 VU-to-account isolation is required, seed 150 accounts (not needed for this test)

### No lockoutCounter
- `lockoutCounter` metric from Skill 2 SKILL.md template is for Group 2 **auth-heavy via POST /api/login** 
- This script targets `PUT /api/users/me` which has no lockout — counter is omitted intentionally

### Custom Metric: recovery_time_ms
- `Trend` metric recorded on every PUT response using `Date.now()` wall-clock delta
- k6's built-in `http_req_duration{name:put_profile}` is the primary metric
- `recovery_time_ms` supplements it for Skill 4 recovery analysis (time from spike peak back to baseline p95)

### sleep() Placement
- Think-time placed **between** login and PUT (0.25–0.75s after login)
- Think-time placed **after** PUT (0.25–0.75s before next iteration)
- NOT batched at end — avoids artificial throughput inflation

### handleSummary — 3 Report Views
1. `results/summary.html` — rendered HTML via benc-uk/k6-reporter
2. `results/summary.json` — raw JSON for Skill 4 analysis
3. `stdout` — coloured terminal text summary

---

## Files

| File | Path | Purpose |
|---|---|---|
| k6 script | `23127379_Spike_20260814.js` | Main test script |
| CSV data | `auth_users.csv` | 50 seeded accounts (email, password, name, phone, shipping_address) |
| Results (post-run) | `results/summary.html` | HTML report |
| Results (post-run) | `results/summary.json` | JSON for Skill 4 |

---

## Pre-run Checklist (verified)

- [x] Filename: `23127379_Spike_20260814.js` ✅
- [x] `BASE_URL` uses `__ENV.BASE_URL || 'http://localhost:3000'` ✅
- [x] CSV loaded via `SharedArray` + `papaparse` ✅
- [x] `check()` on login before extracting `.json('token')` ✅
- [x] `check()` on PUT before trusting response body ✅
- [x] `PUT /api/users/me` body: `{name, phone, shipping_address}` per api_specification.md §2.2 ✅
- [x] `Authorization: Bearer <token>` header on PUT ✅
- [x] Stages match approved Skill 1 params ✅
- [x] `thresholds` keyed to `put_profile` tag (not raw URL) ✅
- [x] `handleSummary()` exports HTML + JSON + stdout ✅
- [x] `sleep()` between login and PUT (not batched) ✅
- [x] `recovery_time_ms` custom Trend metric ✅
- [x] No `lockoutCounter` (not needed for PUT endpoint) ✅
- [x] All 50 accounts registered in SUT DB ✅
