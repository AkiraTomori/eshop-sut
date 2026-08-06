---
name: test-plan-generator
description: >-
  Use this skill when the user provides APPROVED test parameters (from
  test-parameter-advisor, Skill 1) and wants to generate actual Grafana k6
  (.js) test script files for EShop HW05. Trigger phrases: "generate test plan",
  "create k6 script", "generate k6 script", "write test plan", or when the user
  says "approved" after reviewing Skill 1 output. Generates: (1) k6 script
  with correct naming convention {StudentID}_{ScenarioType}_{YYYYMMDD}.js,
  (2) a separate CSV data file for each endpoint group, (3) proper check()
  assertions including account-lockout handling for auth-heavy. Must be run per
  group — complete Group 1 test plan before generating Group 2. STOPS after
  generating and waits for human review before any execution.
---

# Skill 2 — test-plan-generator

## Purpose
Generate the Grafana k6 (`.js`) test script and CSV data files from
human-approved parameters. Name all files using the required convention.
**Does NOT execute the test plan.**

---

## Prerequisites

This skill **only runs** when:
1. A parameter table has been explicitly approved from **Skill 1**
2. The user has confirmed their StudentID and today's date for file naming

---

## Required Input

- `[APPROVED_PARAMS]` — parameter table approved from Skill 1
- `[STUDENT_ID]` — e.g., `23127379`
- `[SCENARIO_TYPE]` — `Load` / `Stress` / `Spike`
- `[DATE]` — format `YYYYMMDD`, e.g., `20260806`
- `[ENDPOINT_GROUP]` — read-heavy / auth-heavy / transactional

**Output filename**: `{StudentID}_{ScenarioType}_{YYYYMMDD}.js`

---

## Files to Generate

### 1. Main test script
Name: `{StudentID}_{ScenarioType}_{YYYYMMDD}.js`
Save to: `23127379_Homework/HW5/test-plans/`

### 2. CSV Data Files (one per group — never shared)

| Endpoint Group | CSV File | Columns |
|---|---|---|
| Read-heavy | `products_data.csv` | `product_id,search_keyword` |
| Auth-heavy | `auth_credentials.csv` | `email,password,expected_result` |
| Transactional | `order_payloads.csv` | `product_id,product_name,price,quantity,shipping_address` |

---

## K6 Script Templates

### Load Testing — Read-heavy (Group 1)

```javascript
// {StudentID}_Load_{YYYYMMDD}.js
// Group 1 — Read-heavy: GET /api/products, GET /api/products/:id
// Scenario: Load Testing
import http from 'k6/http';
import { sleep, check } from 'k6';
import { SharedArray } from 'k6/data';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

const products = new SharedArray('products', function () {
  return papaparse.parse(open('./products_data.csv'), { header: true }).data;
});

export const options = {
  // Replace with approved params from Skill 1
  stages: [
    { duration: '1m', target: 50 },   // ramp-up
    { duration: '5m', target: 100 },  // steady state
    { duration: '2m', target: 150 },  // peak load
    { duration: '1m', target: 0 },    // ramp-down
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'],  // p95 < 2s
    http_req_failed: ['rate<0.05'],     // error rate < 5%
  },
};

export default function () {
  const row = products[Math.floor(Math.random() * products.length)];

  // Request 1: List products
  const listRes = http.get(`${BASE_URL}/api/products`);
  check(listRes, {
    'GET /api/products status 200': (r) => r.status === 200,
    'GET /api/products has array': (r) => {
      try { return Array.isArray(JSON.parse(r.body)); } catch { return false; }
    },
  });

  sleep(Math.random() * 1 + 0.5); // think-time 0.5–1.5s

  // Request 2: Get product by ID
  const detailRes = http.get(`${BASE_URL}/api/products/${row.product_id}`);
  check(detailRes, {
    'GET /api/products/:id status 200': (r) => r.status === 200,
    'GET /api/products/:id has id field': (r) => {
      try { return JSON.parse(r.body).id !== undefined; } catch { return false; }
    },
  });

  sleep(Math.random() * 1 + 1); // think-time 1–2s
}

export function handleSummary(data) {
  return {
    'summary.json': JSON.stringify(data),
  };
}
```

### Spike Testing — Auth-heavy (Group 2)

```javascript
// {StudentID}_Spike_{YYYYMMDD}.js
// Group 2 — Auth-heavy: POST /api/login (lockout after 3 failed attempts)
// Scenario: Spike Testing
import http from 'k6/http';
import { sleep, check } from 'k6';
import { SharedArray } from 'k6/data';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';
import { Counter } from 'k6/metrics';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

// Custom metric: count lockout events (403) separately — these are EXPECTED
const lockoutCounter = new Counter('lockout_events');

// CRITICAL: Use SharedArray so each VU gets unique credentials
// Each VU accesses its own row by VU index — equivalent to "Current Thread" mode in JMeter
const credentials = new SharedArray('credentials', function () {
  return papaparse.parse(open('./auth_credentials.csv'), { header: true }).data;
});

export const options = {
  // Spike pattern: Baseline → Spike → Recovery
  stages: [
    { duration: '2m', target: 10 },   // Baseline: normal load
    { duration: '10s', target: 150 }, // SPIKE: sudden 15× increase
    { duration: '1m', target: 150 },  // Hold spike
    { duration: '30s', target: 10 },  // Recovery begins
    { duration: '2m', target: 10 },   // Recovery: observe stabilization
    { duration: '30s', target: 0 },   // Ramp down
  ],
  thresholds: {
    // Allow lockouts (403) — track via lockoutCounter
    // Only 5xx server errors count as real failures here
    http_req_failed: ['rate<0.30'],
  },
};

export default function () {
  // Each VU uses its own credentials by VU index (prevents shared-account lockout)
  const credIndex = (__VU - 1) % credentials.length;
  const cred = credentials[credIndex];

  const payload = JSON.stringify({
    email: cred.email,
    password: cred.password,
  });

  const params = {
    headers: { 'Content-Type': 'application/json' },
  };

  const res = http.post(`${BASE_URL}/api/login`, payload, params);

  if (res.status === 403 || res.status === 401) {
    // LOCKOUT — expected behavior, NOT a test failure
    lockoutCounter.add(1);
    console.log(`LOCKOUT detected for: ${cred.email} (HTTP ${res.status})`);
  } else {
    check(res, {
      'POST /api/login status 200': (r) => r.status === 200,
      'POST /api/login has token': (r) => {
        try { return JSON.parse(r.body).token !== undefined; } catch { return false; }
      },
    });
    if (res.status === 500) {
      console.error(`SERVER ERROR for ${cred.email}: ${res.body}`);
    }
  }

  sleep(Math.random() * 0.5 + 0.25); // think-time 0.25–0.75s
}

export function handleSummary(data) {
  return {
    'summary.json': JSON.stringify(data),
  };
}
```

### Stress Testing — Transactional (Group 3)

```javascript
// {StudentID}_Stress_{YYYYMMDD}.js
// Group 3 — Transactional: POST /api/cart → POST /api/checkout
// Scenario: Stress Testing (find breaking point)
import http from 'k6/http';
import { sleep, check } from 'k6';
import { SharedArray } from 'k6/data';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

const orders = new SharedArray('orders', function () {
  return papaparse.parse(open('./order_payloads.csv'), { header: true }).data;
});

// Fixed test account for stress test (pre-created in SUT)
const TEST_EMAIL = __ENV.STRESS_EMAIL || 'stress_user@test.com';
const TEST_PASS  = __ENV.STRESS_PASS  || 'TestPass123!';

export const options = {
  // Stepping ramp-up: find breaking point
  stages: [
    { duration: '30s', target: 10 },  // Step 1: 10 VUs
    { duration: '30s', target: 10 },  // Hold 30s
    { duration: '30s', target: 30 },  // Step 2: 30 VUs
    { duration: '30s', target: 30 },  // Hold
    { duration: '30s', target: 60 },  // Step 3: 60 VUs
    { duration: '30s', target: 60 },  // Hold
    { duration: '30s', target: 100 }, // Step 4: 100 VUs
    { duration: '30s', target: 100 }, // Hold
    { duration: '30s', target: 150 }, // Step 5: 150 VUs
    { duration: '30s', target: 150 }, // Hold
    { duration: '30s', target: 200 }, // Step 6: 200 VUs (max / breaking point)
    { duration: '30s', target: 200 }, // Hold — observe breaking point
    { duration: '30s', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<5000'], // Degraded: p95 > 5s
    http_req_failed: ['rate<0.10'],    // Breaking point: error > 10%
  },
};

export default function () {
  const row = orders[Math.floor(Math.random() * orders.length)];

  // Step 1: Login to get JWT token
  const loginRes = http.post(
    `${BASE_URL}/api/login`,
    JSON.stringify({ email: TEST_EMAIL, password: TEST_PASS }),
    { headers: { 'Content-Type': 'application/json' } }
  );

  const loginOk = check(loginRes, {
    'POST /api/login status 200': (r) => r.status === 200,
    'POST /api/login has token': (r) => {
      try { return JSON.parse(r.body).token !== undefined; } catch { return false; }
    },
  });

  if (!loginOk) {
    console.error(`Login failed for stress user (HTTP ${loginRes.status})`);
    return; // Skip cart/checkout if login failed
  }

  let token;
  try {
    token = JSON.parse(loginRes.body).token;
  } catch {
    return;
  }

  const authHeaders = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  };

  sleep(Math.random() * 0.5 + 0.5); // think-time after login

  // Step 2: Add to cart
  const cartPayload = JSON.stringify({
    id: parseInt(row.product_id),
    name: row.product_name,
    price: parseFloat(row.price),
    quantity: parseInt(row.quantity),
  });

  const cartRes = http.post(`${BASE_URL}/api/cart`, cartPayload, authHeaders);
  check(cartRes, {
    'POST /api/cart status 200': (r) => r.status === 200,
  });

  sleep(Math.random() * 2 + 1); // think-time 1–3s (user reviews cart)

  // Step 3: Checkout
  const checkoutPayload = JSON.stringify({
    total_amount: parseFloat(row.price) * parseInt(row.quantity),
    shipping_address: row.shipping_address,
  });

  const checkoutRes = http.post(`${BASE_URL}/api/checkout`, checkoutPayload, authHeaders);
  check(checkoutRes, {
    'POST /api/checkout status 200': (r) => r.status === 200,
    'POST /api/checkout has order_id': (r) => {
      try { return JSON.parse(r.body).order_id !== undefined; } catch { return false; }
    },
  });

  sleep(Math.random() * 1 + 1); // think-time after checkout
}

export function handleSummary(data) {
  return {
    'summary.json': JSON.stringify(data),
  };
}
```

---

## CSV Data Samples

### products_data.csv
```csv
product_id,search_keyword
1,shirt
2,pants
3,shoes
4,bag
5,hat
```
> Note: Run `GET /api/products` first to get real IDs from the SUT.

### auth_credentials.csv
```csv
email,password,expected_result
perf_user_001@test.com,TestPass123!,success
perf_user_002@test.com,TestPass123!,success
perf_user_003@test.com,WrongPass!,lockout_candidate
```
> **Must create ≥ 50 real test accounts** in the SUT before running Spike test.
> See: [scripts/create_test_accounts.sh](./scripts/create_test_accounts.sh)

### order_payloads.csv
```csv
product_id,product_name,price,quantity,shipping_address
1,Basic T-Shirt,150000,2,"123 Le Loi St, District 1, HCMC"
2,Slim Jeans,350000,1,"456 Nguyen Hue St, District 1, HCMC"
```

---

## Pre-save Checklist

- [ ] File name follows convention: `{StudentID}_{ScenarioType}_{YYYYMMDD}.js`
- [ ] `BASE_URL` uses `__ENV.BASE_URL || 'http://localhost:3000'` — not hardcoded
- [ ] CSV loaded via `SharedArray` + `papaparse` with correct relative path
- [ ] `check()` assertions cover both success and expected error cases
- [ ] Auth-heavy: lockout (403/401) increments `lockoutCounter` but NOT counted as `http_req_failed`
- [ ] Transactional: login step comes first to extract JWT token
- [ ] `sleep()` think-time matches approved params
- [ ] `stages` VU count and duration match approved params
- [ ] `handleSummary()` exports `summary.json` for HTML report generation
- [ ] `thresholds` match the performance targets from Skill 1

---

## Audit Log

Append to `hw05_audit_log.md`:

```markdown
## [SKILL-2] test-plan-generator — {timestamp}
- **Input**: Approved params from Skill 1 (paste table here)
- **Output files**:
  - `{StudentID}_{ScenarioType}_{YYYYMMDD}.js`
  - `products_data.csv` / `auth_credentials.csv` / `order_payloads.csv`
- **Design decisions**: [key choices made]
```

---

## ⛔ Checkpoint — STOP HERE

```
✅ Skill 2 complete.
📁 Files created: [list full paths]
📋 Please:
   1. Open the .js script and read through it carefully
   2. Check CSV files have enough rows and correct format
   3. Confirm check() assertion logic — especially lockout handling for auth-heavy
   4. Verify stages match approved params from Skill 1
👉 Reply "approved to run" to proceed to Skill 3 (test-execution-runner).
❌ DO NOT run the test without explicit confirmation.
```

## References
- [Naming Convention](./references/naming_convention.md)
- [Skill 1](../test-parameter-advisor/SKILL.md)
- [k6 Documentation](https://grafana.com/docs/k6/latest/)
