// =============================================================================
// 23127379_Stress_20260814.js
// Group 3 — Transactional: POST /api/cart (prerequisite) → POST /api/checkout (PRIMARY)
// Scenario: Stress Testing — find the breaking point (error > 10% OR p95 > 5s)
// Student ID: 23127379 | Date: 2026-08-14 | SUT: http://localhost:3000
// =============================================================================

import http from 'k6/http';
import { sleep, check } from 'k6';
import { SharedArray } from 'k6/data';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';
import exec from 'k6/execution';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

// -----------------------------------------------------------------------------
// SharedArray — one shared copy across all VUs (no per-VU RAM overhead)
// Columns: product_id, product_name, price, quantity, shipping_address, total_amount
// -----------------------------------------------------------------------------
const orders = new SharedArray('orders', function () {
  return papaparse.parse(open('./order_payloads.csv'), { header: true }).data.filter(
    (row) => row.product_id && row.product_id.trim() !== ''
  );
});

// SharedArray for login credentials — reuse Group 2 accounts (50 accounts)
const users = new SharedArray('users', function () {
  return papaparse.parse(open('./auth_users.csv'), { header: true }).data.filter(
    (row) => row.email && row.email.trim() !== ''
  );
});

// -----------------------------------------------------------------------------
// Stress Test Options — stepped VU escalation to find breaking point
// Approved parameters from Skill 1 v2 (2026-08-14)
// Total duration: 12 × 30s + 1min ramp-down = 7 min
// Breaking point = stage where POST /api/checkout error rate first exceeds 10%
// -----------------------------------------------------------------------------
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
    { duration: '30s', target: 150 },  // step 5 ramp-up (prior groups OK at this level)
    { duration: '30s', target: 150 },  // step 5 hold
    { duration: '30s', target: 200 },  // step 6 ramp-up — likely breaking point
    { duration: '30s', target: 200 },  // step 6 hold — observe breaking point
    { duration: '1m',  target: 0   },  // ramp-down
  ],
  thresholds: {
    // Global p95 guard
    http_req_duration: ['p(95)<5000'],
    // Global error rate guard — FAIL marks the stage where system breaks
    http_req_failed: ['rate<0.10'],
    // Per-endpoint checkout p95 — primary measurement target
    'http_req_duration{name:checkout}': ['p(95)<5000'],
  },
};

// -----------------------------------------------------------------------------
// Main VU function — one iteration = login → cart → (think) → checkout
// -----------------------------------------------------------------------------
export default function () {
  // VU-deterministic row indexing — no two VUs share the same CSV row per iteration
  const rowIdx = (exec.vu.idInTest - 1 + exec.scenario.iterationInTest) % orders.length;
  const row = orders[rowIdx];

  // User index — 50 accounts spread across up to 200 VUs via modulo
  const userIdx = (exec.vu.idInTest - 1) % users.length;
  const user = users[userIdx];

  // -------------------------------------------------------------------------
  // Step 1: POST /api/login — re-login every iteration to avoid JWT expiry
  // over the 7-min run; guard with check() BEFORE extracting token
  // -------------------------------------------------------------------------
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

  // Short navigation think-time between login and cart add (0.2–0.5s)
  sleep(0.2 + Math.random() * 0.3);

  // -------------------------------------------------------------------------
  // Step 2: POST /api/cart — prerequisite (NOT the primary metric)
  // Body: {id, name, price, quantity} — per api_specification.md §4.2
  // -------------------------------------------------------------------------
  const cartPayload = JSON.stringify({
    id:       parseInt(row.product_id),
    name:     row.product_name,
    price:    parseFloat(row.price),
    quantity: parseInt(row.quantity),
  });

  const cartRes = http.post(
    `${BASE_URL}/api/cart`,
    cartPayload,
    Object.assign({}, authHeaders, { tags: { name: 'cart' } })
  );

  check(cartRes, {
    'cart: status 200': (r) => r.status === 200,
  });

  // User reviews cart before confirming order — realistic 1–3s think-time
  // IMPORTANT: placed BETWEEN cart and checkout, NOT batched at end of function
  sleep(1 + Math.random() * 2);

  // -------------------------------------------------------------------------
  // Step 3: POST /api/checkout — PRIMARY measured endpoint
  // Body: {total_amount, shipping_address} — per api_specification.md §4.3
  // -------------------------------------------------------------------------
  const checkoutPayload = JSON.stringify({
    total_amount:     parseFloat(row.total_amount),
    shipping_address: row.shipping_address,
  });

  const checkoutRes = http.post(
    `${BASE_URL}/api/checkout`,
    checkoutPayload,
    Object.assign({}, authHeaders, { tags: { name: 'checkout' } })
  );

  check(checkoutRes, {
    'checkout: status 200': (r) => r.status === 200,
    // Verify order was actually written — missing order_id = silent DB failure
    'checkout: order_id present': (r) => {
      try { return r.json('order_id') !== undefined; } catch { return false; }
    },
  });
}

// -----------------------------------------------------------------------------
// handleSummary — 3 distinct report views (satisfies HW05 Task 1 requirement)
//   1. results/summary.html — benc-uk HTML reporter (visual dashboard)
//   2. results/summary.json — raw k6 data (used by Skill 4 jtl-log-analyzer)
//   3. stdout              — textSummary (console output for quick review)
// -----------------------------------------------------------------------------
export function handleSummary(data) {
  return {
    'results/summary.html': htmlReport(data),
    'results/summary.json': JSON.stringify(data, null, 2),
    stdout: textSummary(data, { indent: '  ', enableColors: true }),
  };
}
