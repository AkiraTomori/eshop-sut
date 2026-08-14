// =============================================================================
// 23127379_Stress_Endurance_20260814.js
// Group 3 — Transactional: Endurance / Soak Test
// Scenario: Sustained load at 60 VUs × 15 min to find hardware endurance threshold
// Required by HW05 Task 1: "Run a short endurance/soak test (~10–15 min at sustained
// load) to empirically find your hardware's threshold"
// Student ID: 23127379 | Date: 2026-08-14 | SUT: http://localhost:3000
// =============================================================================

import http from 'k6/http';
import { sleep, check } from 'k6';
import { SharedArray } from 'k6/data';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';
import { Trend } from 'k6/metrics';
import exec from 'k6/execution';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

// Custom metric: track checkout latency over the 15-min window
// Used to observe degradation trend (rising p95 = system cannot sustain the load)
const checkoutLatency = new Trend('checkout_latency_ms');

// SharedArray — shared across all VUs (important for RAM ceiling measurement accuracy)
const orders = new SharedArray('orders', function () {
  return papaparse.parse(open('./order_payloads.csv'), { header: true }).data.filter(
    (row) => row.product_id && row.product_id.trim() !== ''
  );
});

const users = new SharedArray('users', function () {
  return papaparse.parse(open('./auth_users.csv'), { header: true }).data.filter(
    (row) => row.email && row.email.trim() !== ''
  );
});

// -----------------------------------------------------------------------------
// Endurance Options — constant load at 60 VUs for 15 minutes
// NOTE: 60 VUs = step 3 of the main stress test — expected to be the last stable
// level. Adjust to 30 VUs if stress run shows breaking point at or below 60 VUs.
// -----------------------------------------------------------------------------
export const options = {
  stages: [
    { duration: '1m',  target: 60 },  // gentle ramp-up (allows JIT warmup)
    { duration: '13m', target: 60 },  // sustained load — observation window
    { duration: '1m',  target: 0  },  // ramp-down
  ],
  thresholds: {
    // Same breaking-point definition as main stress test
    http_req_duration:                ['p(95)<5000'],
    'http_req_duration{name:checkout}': ['p(95)<5000'],
    http_req_failed:                  ['rate<0.10'],
    // Custom: checkout latency should not degrade over the soak window
    checkout_latency_ms:              ['p(95)<5000'],
  },
};

export default function () {
  const rowIdx  = (exec.vu.idInTest - 1 + exec.scenario.iterationInTest) % orders.length;
  const userIdx = (exec.vu.idInTest - 1) % users.length;
  const row  = orders[rowIdx];
  const user = users[userIdx];

  // Step 1: Login (re-login per iteration — 15-min run will exceed JWT TTL)
  const loginRes = http.post(
    `${BASE_URL}/api/login`,
    JSON.stringify({ email: user.email, password: user.password }),
    { headers: { 'Content-Type': 'application/json' }, tags: { name: 'login' } }
  );

  const loginOk = check(loginRes, {
    'login: status 200': (r) => r.status === 200,
    'login: token present': (r) => {
      try { return r.json('token') !== undefined; } catch { return false; }
    },
  });

  if (!loginOk) {
    console.warn(`[VU ${exec.vu.idInTest}] Login failed (HTTP ${loginRes.status}) — skipping iteration`);
    return;
  }

  const token = loginRes.json('token');
  const authHeaders = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  };

  sleep(0.2 + Math.random() * 0.3); // navigation think-time after login

  // Step 2: POST /api/cart — prerequisite
  const cartRes = http.post(
    `${BASE_URL}/api/cart`,
    JSON.stringify({
      id:       parseInt(row.product_id),
      name:     row.product_name,
      price:    parseFloat(row.price),
      quantity: parseInt(row.quantity),
    }),
    Object.assign({}, authHeaders, { tags: { name: 'cart' } })
  );

  check(cartRes, { 'cart: status 200': (r) => r.status === 200 });

  // Think-time between cart and checkout (1–3s) — placed BETWEEN actions
  sleep(1 + Math.random() * 2);

  // Step 3: POST /api/checkout — PRIMARY; record custom latency metric
  const checkoutStart = Date.now();
  const checkoutRes = http.post(
    `${BASE_URL}/api/checkout`,
    JSON.stringify({
      total_amount:     parseFloat(row.total_amount),
      shipping_address: row.shipping_address,
    }),
    Object.assign({}, authHeaders, { tags: { name: 'checkout' } })
  );
  checkoutLatency.add(Date.now() - checkoutStart);

  check(checkoutRes, {
    'checkout: status 200': (r) => r.status === 200,
    'checkout: order_id present': (r) => {
      try { return r.json('order_id') !== undefined; } catch { return false; }
    },
  });
}

// handleSummary — 3 distinct report views
export function handleSummary(data) {
  return {
    'results/endurance_summary.html': htmlReport(data),
    'results/endurance_summary.json': JSON.stringify(data, null, 2),
    stdout: textSummary(data, { indent: '  ', enableColors: true }),
  };
}
