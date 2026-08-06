---
name: test-plan-generator
description: >-
  Use this skill when the user provides APPROVED test parameters (from
  test-parameter-advisor, Skill 1) and wants to generate actual JMeter (.jmx)
  or k6 test plan files for EShop HW05. Trigger phrases: "generate test plan",
  "create jmx file", "generate k6 script", "write test plan", or when the user
  says "approved" after reviewing Skill 1 output. Generates: (1) JMX/k6 script
  with correct naming convention {StudentID}_{ScenarioType}_{YYYYMMDD},
  (2) a separate CSV data file for each endpoint group, (3) proper assertions
  including account-lockout handling for auth-heavy. Must be run per group —
  complete Group 1 test plan before generating Group 2. STOPS after generating
  and waits for human review before any execution.
---

# Skill 2 — test-plan-generator

## Purpose
Generate the JMeter `.jmx` (or k6) test plan and CSV data files from
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
- `[TOOL]` — JMeter (default) or k6 (bonus)

**Output filename**: `{StudentID}_{ScenarioType}_{YYYYMMDD}.jmx` (or `.js` for k6)

---

## Files to Generate

### 1. Main test plan file
Name: `{StudentID}_{ScenarioType}_{YYYYMMDD}.jmx` (or `.js`)
Save to: `23127379_Homework/HW5/test-plans/`

### 2. CSV Data Files (one per group — never shared)

| Endpoint Group | CSV File | Columns |
|---|---|---|
| Read-heavy | `products_data.csv` | `product_id,search_keyword` |
| Auth-heavy | `auth_credentials.csv` | `email,password,expected_result` |
| Transactional | `order_payloads.csv` | `product_id,product_name,price,quantity,shipping_address` |

---

## JMeter Test Plan Structure

### Load Testing — Read-heavy

```xml
<!-- Thread Group: Load Test - Products -->
<!-- Users: {approved_threads} -->
<!-- Ramp-up: {approved_ramp_up}s -->
<!-- Duration: {approved_duration}s -->
<!-- CSV Data Set Config: products_data.csv -->
<!-- HTTP Request: GET /api/products -->
<!-- HTTP Request: GET /api/products/${product_id} -->
<!-- Response Assertion: Status 200, body contains "id" -->
<!-- Listener: View Results Tree -->
<!-- Listener: Aggregate Report (export .jtl) -->
<!-- Constant Timer: Think-time ${__Random(1000,2000,)}ms -->
```

Required elements:
- `ThreadGroup` with exact values from approved params
- `CSVDataSet` pointing to `products_data.csv`
- `HTTPSamplerProxy` for both endpoints
- `ResponseAssertion` for HTTP 200 and JSON body content
- `UniformRandomTimer` for think-time
- `ResultCollector` (Aggregate Report, write to `.jtl`)
- **No hardcoded URLs** — use User Defined Variables: `BASE_URL=http://localhost:3000`

### Spike Testing — Auth-heavy

```xml
<!-- IMPORTANT: Must handle account lockout -->
<!-- Thread Group 1 (Baseline): 10 users, 60s, normal load -->
<!-- Thread Group 2 (Spike): 150 users, ramp 5s, duration 60s -->
<!-- Thread Group 3 (Recovery): 10 users, 60s, observe recovery -->
<!-- CSV Data Set Config: auth_credentials.csv -->
<!-- Sharing Mode: Current Thread (CRITICAL — prevents shared-account lockout) -->
<!-- HTTP Request: POST /api/login -->
<!-- Body: {"email":"${email}","password":"${password}"} -->
<!-- Assertions:
     - Status 200 → extract token, assert token != null
     - Status 403/401 → log "LOCKOUT" (NOT a test failure)
     - Status 500 → FAIL (this is a real bug) -->
<!-- Listener: Summary Report -->
```

**Lockout handling (JSR223 PostProcessor):**
```javascript
if (prev.getResponseCode() == "403" || prev.getResponseCode() == "401") {
    log.warn("LOCKOUT detected for: " + vars.get("email"));
    vars.put("login_status", "LOCKED");
} else if (prev.getResponseCode() == "200") {
    vars.put("login_status", "SUCCESS");
    def json = new groovy.json.JsonSlurper().parseText(prev.getResponseDataAsString());
    vars.put("auth_token", json.token);
}
```

### Stress Testing — Transactional

```xml
<!-- Stepping Thread Group (jmeter-plugins) or Ultimate Thread Group -->
<!-- Start: 10 users → +20 every 30s → Max: 200 users -->
<!-- Stop condition: Error rate > 10% -->
<!-- Flow:
     Step 1: POST /api/login → extract token
     Step 2: POST /api/cart (Authorization: Bearer ${auth_token})
     Step 3: POST /api/checkout (Authorization: Bearer ${auth_token})
-->
<!-- CSV: order_payloads.csv -->
<!-- Assertions:
     - Cart: 200 OK + body contains cart items
     - Checkout: 200 OK + "order_id" in body
     - Missing token → 401 (expected, not a bug)
-->
<!-- Listener: Aggregate Report -->
```

---

## k6 Script Template (if user selects k6)

```javascript
// {StudentID}_{ScenarioType}_{YYYYMMDD}.js
import http from 'k6/http';
import { sleep, check } from 'k6';
import { SharedArray } from 'k6/data';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

const data = new SharedArray('data', function() {
  return papaparse.parse(open('./products_data.csv'), { header: true }).data;
});

export const options = {
  // Replace with approved params from Skill 1
  stages: [
    { duration: '1m', target: 50 },
    { duration: '5m', target: 100 },
    { duration: '1m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'],
    http_req_failed: ['rate<0.05'],
  },
};

export default function () {
  const row = data[Math.floor(Math.random() * data.length)];
  const res = http.get(`${BASE_URL}/api/products/${row.product_id}`);
  check(res, {
    'status is 200': (r) => r.status === 200,
    'has product id': (r) => JSON.parse(r.body).id !== undefined,
  });
  sleep(Math.random() * 1 + 1); // think-time 1–2s
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

- [ ] File name follows convention: `{StudentID}_{ScenarioType}_{YYYYMMDD}.jmx`
- [ ] BASE_URL uses a User Defined Variable — not hardcoded
- [ ] CSV Data Set Config uses correct relative path
- [ ] Assertions cover both success and expected error cases
- [ ] Auth-heavy: lockout (403/401) is logged but NOT marked as test failure
- [ ] Transactional: login step comes first to extract token
- [ ] Think-time matches approved params
- [ ] Thread count, ramp-up, duration match approved params

---

## Audit Log

Append to `hw05_audit_log.md`:

```markdown
## [SKILL-2] test-plan-generator — {timestamp}
- **Input**: Approved params from Skill 1 (paste table here)
- **Output files**:
  - `{StudentID}_{ScenarioType}_{YYYYMMDD}.jmx`
  - `products_data.csv` / `auth_credentials.csv` / `order_payloads.csv`
- **Design decisions**: [key choices made]
```

---

## ⛔ Checkpoint — STOP HERE

```
✅ Skill 2 complete.
📁 Files created: [list full paths]
📋 Please:
   1. Open the .jmx in JMeter GUI to verify
   2. Check CSV files have enough rows and correct format
   3. Confirm assertion logic — especially lockout handling
👉 Reply "approved to run" to proceed to Skill 3 (test-execution-runner).
❌ DO NOT run the test without explicit confirmation.
```

## References
- [Naming Convention](./references/naming_convention.md)
- [Skill 1](../test-parameter-advisor/SKILL.md)
