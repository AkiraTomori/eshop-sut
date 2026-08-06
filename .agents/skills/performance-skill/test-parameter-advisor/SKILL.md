---
name: test-parameter-advisor
description: >-
  Use this skill when the user needs to determine realistic Grafana k6 test
  parameters (VU count, stages duration, think-time, thresholds) for EShop HW05
  performance testing. Trigger when the user says "advise test parameters",
  "recommend VU count", "suggest stages", or starts a new performance
  test cycle for any endpoint group. Covers all three EShop groups in strict
  sequential order: (1) read-heavy — GET /api/products → Load Testing,
  (2) auth-heavy — POST /api/login with lockout → Spike Testing,
  (3) transactional — POST /api/cart + POST /api/checkout → Stress Testing.
  IMPORTANT: Complete ALL stages for the current group before moving to the
  next group. STOPS after outputting parameter recommendations and waits for
  explicit human approval before any test plan is generated.
---

# Skill 1 — test-parameter-advisor

## Purpose
Recommend Grafana k6 performance test parameters (VU count, stages, think-time, thresholds)
for each EShop endpoint group, paired with the correct scenario type and with
clear justification. **This skill only advises — it does NOT generate test plans or code.**

## Endpoint Groups & Scenario Mapping (fixed)

| Endpoint Group | Endpoints | Scenario |
|---|---|---|
| Read-heavy | `GET /api/products`, `GET /api/products/:id` | Load Testing |
| Auth-heavy | `POST /api/login` (lockout after 3 failed attempts) | Spike Testing |
| Transactional | `POST /api/cart` → `POST /api/checkout` | Stress Testing |

> **Sequential rule**: Complete Group 1 (read-heavy) end-to-end through Skills 1→10
> before starting Group 2. Complete Group 2 before starting Group 3.

---

## Input to Collect

Before recommending parameters, confirm the following:

1. Which **endpoint group** are we advising for right now?
2. **Test machine specs** — CPU, RAM, OS (running k6)?
3. **SUT target** — EShop on `http://localhost:3000` (local) or CI server?
4. Total number of **test accounts** available (critical for auth-heavy)?
5. Any **baseline response time** already measured (GET /api/products without load)?

---

## Parameter Recommendations by Group

### Group 1 — Read-heavy — Load Testing

**Endpoint characteristics:**
- No authentication required, stateless, SQLite read-only
- EShop local typically handles 50–200 concurrent VUs on SQLite

**Recommended parameters:**

| Parameter | Recommended Value | Justification |
|---|---|---|
| VUs (virtual users) | 50 → 100 → 150 (step up via stages) | Load test = sustained high-but-normal load, not a crash scenario |
| stages | `[{duration:'1m',target:50},{duration:'5m',target:100},{duration:'2m',target:150},{duration:'1m',target:0}]` | Gradual ramp to observe each load level; clean ramp-down |
| think-time | `sleep(Math.random() * 1 + 1)` (1–2s) | Simulates real users browsing the product catalog |
| Test duration | ~9 min total (sum of stages) | Long enough to stabilize p95 measurement |
| iterations | Use duration-based stages (no fixed iteration count) | Do not limit loops |
| thresholds | `http_req_duration: ['p(95)<2000'], http_req_failed: ['rate<0.05']` | p95 < 2s, error rate < 5% |

**Endurance variant:** Run 10–15 min at 100 VUs to find the sustainable threshold.

---

### Group 2 — Auth-heavy — Spike Testing

**Endpoint characteristics:**
- **Account lockout after exactly 3 failed login attempts** — highest risk
- JWT generation may consume CPU under high concurrency
- Requires many test accounts to avoid mass lockout

**Recommended parameters:**

| Parameter | Recommended Value | Justification |
|---|---|---|
| Baseline VUs | 5–10 | Normal baseline load |
| Spike VUs | 100–200 (sudden) | Spike = 10–20× increase in under 10s |
| Spike stages | `[{duration:'2m',target:10},{duration:'10s',target:150},{duration:'1m',target:150},{duration:'30s',target:10},{duration:'2m',target:10},{duration:'30s',target:0}]` | Baseline → spike → hold → recovery |
| think-time | `sleep(Math.random() * 0.5 + 0.25)` (0.25–0.75s) | Auth flows typically have short think-times |
| Credentials CSV | Minimum 50 accounts, VU index-based assignment | Each VU uses its own credentials via `(__VU - 1) % credentials.length` |
| thresholds | `http_req_failed: ['rate<0.30']` | Allow lockouts (403), but 5xx = real bug |
| Lockout handling | `lockoutCounter` custom metric; 403/401 logged, NOT counted as failure | Distinguishes lockout from real errors |

**Lockout mitigation:**
- Each virtual user must use its own credentials (SharedArray + VU index)
- After each run, invoke `lockout-reset-helper` (Skill 7) before re-running

---

### Group 3 — Transactional — Stress Testing

**Endpoint characteristics:**
- Two sequential steps (cart → checkout), both requiring JWT auth
- SQLite write lock can become a bottleneck under high concurrency
- Checkout creates DB records → increased disk I/O

**Recommended parameters:**

| Parameter | Recommended Value | Justification |
|---|---|---|
| VUs | Stepped: 10→30→60→100→150→200 via stages | Stress test = find the breaking point |
| stages | Each step: 30s ramp + 30s hold | Measure each level before stepping up |
| think-time | `sleep(Math.random() * 2 + 1)` (1–3s between cart and checkout) | Real users review before confirming |
| Stop condition | `thresholds: {http_req_failed: ['rate<0.10'], http_req_duration: ['p(95)<5000']}` | Error > 10% or p95 > 5s = breaking point |
| Assertion | `check()` for 200 OK + `order_id` present (checkout); 401 = missing token (expected) | |

---

## Output Format

After collecting input, produce the recommendation table in this format:

```
## Parameter Recommendations — [Endpoint Group]

| Parameter | Value | Justification |
|-----------|-------|---------------|
| ...       | ...   | ...           |

### k6 stages snippet
```javascript
export const options = {
  stages: [ /* approved stages here */ ],
  thresholds: { /* approved thresholds here */ },
};
```

### Scenario Justification
[Explain why this endpoint group is paired with Load/Stress/Spike Testing]

### Risks to Watch
- [e.g., account lockout, SQLite WAL, JWT expiry...]

### Open Questions Before Proceeding
- [e.g., Are 50 test accounts available in SUT?]
```

---

## Audit Log

Append to `hw05_audit_log.md` (in HW5 folder):

```markdown
## [SKILL-1] test-parameter-advisor — {timestamp}
- **Input**: Endpoint group = {group}, Machine = {hw_info}
- **Logic**: Scenario mapping + domain heuristics from SKILL.md
- **Output**: [paste parameter table here]
```

---

## ⛔ Checkpoint — STOP HERE

After producing the recommendation table, **STOP COMPLETELY** and display:

```
✅ Skill 1 complete.
📋 Please review the parameter table above.
👉 If approved, reply "approved" to proceed to Skill 2 (test-plan-generator).
👉 If you want changes, specify which parameters to adjust.
❌ DO NOT automatically proceed to Skill 2 without explicit confirmation.
```

## References
- [Endpoint Groups Reference](./references/endpoint_groups.md)
- [api_specification.md](../../../../api_specification.md)
- [k6 Options Documentation](https://grafana.com/docs/k6/latest/using-k6/k6-options/reference/)
