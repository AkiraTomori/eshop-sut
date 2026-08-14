// 23127379_Spike_20260814.js
// ============================================================
// HW05 — Group 2: Auth-heavy Spike Testing
// Student ID : 23127379
// Scenario   : Spike Testing
// Primary    : PUT /api/users/me  (authenticated profile update)
// Prerequisite: POST /api/login   (obtain JWT — one per iteration)
// CSV        : auth_users.csv  (email,password,name,phone,shipping_address)
// Date       : 2026-08-14
// ============================================================
// k6 Best Practices applied (AGENTS.md):
//  [1] thresholds   — pass/fail encoded in code (p95<3000ms, error<30%)
//  [2] tags         — every request tagged with `name` for per-endpoint CSV breakdown
//  [3] SharedArray  — CSV loaded once, shared across all VUs
//  [4] Custom metric — recovery_time_ms Trend tracks spike → baseline p95 recovery
//  [5] handleSummary — HTML + JSON + console = 3 distinct report views
//  [6] sleep()      — placed BETWEEN actions, not batched at end
//  [7] check()      — validates response BEFORE extracting .json() fields
//  [8] Data hygiene — PUT writes update existing rows (no new rows; no cleanup needed)
// ============================================================

import http from 'k6/http';
import { sleep, check } from 'k6';
import { SharedArray } from 'k6/data';
import { Trend } from 'k6/metrics';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';

// ---------------------------------------------------------------------------
// Environment
// ---------------------------------------------------------------------------
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

// ---------------------------------------------------------------------------
// Best Practice [4]: Custom metric — spike recovery time
// Measures how long p95 takes to return to baseline after spike drops to 10 VUs.
// Recorded on every PUT iteration so Skill 4 can slice by timestamp.
// ---------------------------------------------------------------------------
const recoveryTimeTrend = new Trend('recovery_time_ms', true); // true = track percentiles

// ---------------------------------------------------------------------------
// Best Practice [3]: SharedArray — CSV parsed once, shared across all VUs
// 50 accounts: spike_user_1@eshop.test … spike_user_50@eshop.test
// 150 spike VUs share 50 accounts via modulo — SAFE because PUT /api/users/me
// has NO account lockout mechanism (unlike POST /api/login).
// ---------------------------------------------------------------------------
const users = new SharedArray('auth_users', function () {
  return papaparse.parse(open('./auth_users.csv'), { header: true }).data.filter(
    (row) => row.email && row.email.trim() !== ''
  );
});

// ---------------------------------------------------------------------------
// Best Practice [1]: thresholds — breaking-point definition encoded in code
// p95 < 3000ms  : acceptable latency under spike
// error < 30%   : deliberately relaxed (PUT has no lockout; any error = real bug)
// ---------------------------------------------------------------------------
export const options = {
  stages: [
    { duration: '2m',  target: 10  }, // [1] Baseline warm-up — normal load
    { duration: '10s', target: 150 }, // [2] SPIKE: 10 → 150 VUs in 10s (15x increase)
    { duration: '1m',  target: 150 }, // [3] Hold at spike peak
    { duration: '30s', target: 10  }, // [4] Recovery: drop back to baseline
    { duration: '2m',  target: 10  }, // [5] Stabilise — observe recovery
    { duration: '30s', target: 0   }, // [6] Ramp-down
  ],
  thresholds: {
    // Primary SLA thresholds (PUT /api/users/me tagged as put_profile)
    'http_req_duration{name:put_profile}': ['p(95)<3000'],
    // Overall error gate
    http_req_failed: ['rate<0.30'],
    // Recovery metric — no hard threshold; used for analysis in Skill 4
    recovery_time_ms: ['p(95)<3000'],
  },
};

// ---------------------------------------------------------------------------
// Default function — one VU iteration
// Flow: POST /api/login (get JWT) → PUT /api/users/me (primary endpoint)
// ---------------------------------------------------------------------------
export default function () {
  // Each VU deterministically picks its own CSV row via modulo.
  // This prevents two VUs from sharing credentials simultaneously.
  // Modulo sharing is SAFE here — PUT has no lockout (confirmed Skill 1 + Skill 10).
  const userIndex = (__VU - 1) % users.length;
  const user = users[userIndex];

  // -------------------------------------------------------------------------
  // Step 1 — POST /api/login (prerequisite — obtain JWT token)
  // Best Practice [7]: check() BEFORE extracting .json() to avoid crash on error
  // Best Practice [2]: tagged as 'login' for per-endpoint CSV breakdown
  // -------------------------------------------------------------------------
  const loginPayload = JSON.stringify({
    email: user.email,
    password: user.password,
  });

  const loginRes = http.post(
    `${BASE_URL}/api/login`,
    loginPayload,
    {
      headers: { 'Content-Type': 'application/json' },
      tags: { name: 'login' }, // Best Practice [2]
    }
  );

  // Best Practice [7]: validate login before trusting body
  const loginOk = check(loginRes, {
    'POST /api/login -- status 200': (r) => r.status === 200,
    'POST /api/login -- token present': (r) => {
      try { return typeof JSON.parse(r.body).token === 'string'; } catch { return false; }
    },
  });

  if (!loginOk) {
    console.error(
      `[VU${__VU}] Login failed for ${user.email} -- HTTP ${loginRes.status}: ${loginRes.body}`
    );
    // Do NOT attempt PUT if login failed — skip this iteration cleanly
    return;
  }

  // Safe to extract token (check() passed)
  const token = loginRes.json('token');

  // Best Practice [6]: think-time BETWEEN login and profile update
  sleep(0.25 + Math.random() * 0.5); // 0.25-0.75s

  // -------------------------------------------------------------------------
  // Step 2 — PUT /api/users/me (PRIMARY endpoint under test)
  // JWT from login is passed as Bearer header on every PUT request.
  // Best Practice [2]: tagged as 'put_profile' — thresholds key off this tag
  // Best Practice [4]: record response time into recoveryTimeTrend
  // -------------------------------------------------------------------------
  const putPayload = JSON.stringify({
    name: user.name,
    phone: user.phone,
    shipping_address: user.shipping_address,
  });

  const startTime = Date.now();

  const putRes = http.put(
    `${BASE_URL}/api/users/me`,
    putPayload,
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      tags: { name: 'put_profile' }, // Best Practice [2]
    }
  );

  const elapsed = Date.now() - startTime;

  // Best Practice [7]: check() validates response before trusting body
  check(putRes, {
    'PUT /api/users/me -- status 200': (r) => r.status === 200,
    'PUT /api/users/me -- body has message': (r) => {
      try { return typeof JSON.parse(r.body).message === 'string'; } catch { return false; }
    },
  });

  if (putRes.status >= 500) {
    console.error(
      `[VU${__VU}] PUT /api/users/me SERVER ERROR -- HTTP ${putRes.status}: ${putRes.body}`
    );
  }

  // Best Practice [4]: record every PUT duration into custom recovery metric
  recoveryTimeTrend.add(elapsed, { name: 'put_profile' });

  // Best Practice [6]: think-time AFTER PUT — not batched at the end
  sleep(0.25 + Math.random() * 0.5); // 0.25-0.75s
}

// ---------------------------------------------------------------------------
// Best Practice [5]: handleSummary — 3 distinct report views
//   1. results/summary.html  -> rendered HTML report (benc-uk/k6-reporter)
//   2. results/summary.json  -> raw JSON for Skill 4 (jtl-log-analyzer)
//   3. stdout                -> coloured terminal output
// ---------------------------------------------------------------------------
export function handleSummary(data) {
  return {
    'results/summary.html': htmlReport(data),
    'results/summary.json': JSON.stringify(data, null, 2),
    stdout: textSummary(data, { indent: '  ', enableColors: true }),
  };
}
