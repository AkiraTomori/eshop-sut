---
name: test-parameter-advisor
description: >-
  Use this skill when the user needs to determine realistic JMeter/k6 test
  parameters (thread count, ramp-up, think-time, duration) for EShop HW05
  performance testing. Trigger when the user says "advise test parameters",
  "recommend thread count", "suggest ramp-up", or starts a new performance
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
Recommend performance test parameters (thread count, ramp-up, think-time, duration)
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
2. **Test machine specs** — CPU, RAM, OS (running JMeter/k6)?
3. **SUT target** — EShop on `http://localhost:3000` (local) or CI server?
4. Total number of **test accounts** available (critical for auth-heavy)?
5. Any **baseline response time** already measured (GET /api/products without load)?

---

## Parameter Recommendations by Group

### Group 1 — Read-heavy — Load Testing

**Endpoint characteristics:**
- No authentication required, stateless, SQLite read-only
- EShop local typically handles 50–200 concurrent users on SQLite

**Recommended parameters:**

| Parameter | Recommended Value | Justification |
|---|---|---|
| Threads (users) | 50 → 150 (step up) | Load test = sustained high-but-normal load, not a crash scenario |
| Ramp-up period | 60s | Slow enough to observe each load level; avoids artificial spikes |
| Think-time | 1000–2000ms (randomized) | Simulates real users browsing the product catalog |
| Test duration | 5–10 min (steady state) | Long enough to stabilize p95 measurement |
| Loop count | Forever (use duration) | Do not limit loops |
| Assertion | HTTP 200, body contains `"id"` or JSON array | Validates both performance and functional correctness |

**Endurance variant:** Run 10–15 min at 100 threads to find the sustainable threshold.

---

### Group 2 — Auth-heavy — Spike Testing

**Endpoint characteristics:**
- **Account lockout after exactly 3 failed login attempts** — highest risk
- JWT generation may consume CPU under high concurrency
- Requires many test accounts to avoid mass lockout

**Recommended parameters:**

| Parameter | Recommended Value | Justification |
|---|---|---|
| Baseline threads | 5–10 users | Normal baseline load |
| Spike threads | 100–200 users (sudden) | Spike = 10–20× increase in under 10s |
| Spike ramp-up | 5–10s | Fast ramp simulates flash sale or bot attack |
| Think-time | 500ms | Auth flows typically have short think-times |
| Test duration | Baseline 2 min → Spike 1 min → Recovery 2 min | Measures recovery time |
| Credentials CSV | Minimum 50 accounts, each used by exactly one thread | Prevents shared-account lockout |
| Assertion | 200 OK + token exists; 403/401 for locked accounts (expected, not a failure) | Distinguishes lockout from real errors |

**Lockout mitigation:**
- Each virtual user must use its own credentials (CSV parameterization)
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
| Threads | Start 10 → +20 every 30s → Max 200 | Stress test = find the breaking point |
| Ramp-up | 30s per level | Measure each level before stepping up |
| Think-time | 2000–3000ms (between cart and checkout) | Real users review before confirming |
| Test duration | 3–5 min per level | Run until error rate > 5% or p95 > 5s |
| Stop when | Error rate > 10% or server crash | This is the breaking point |
| Assertion | 200 OK + `order_id` present (checkout); 401 = missing token | |

---

## Output Format

After collecting input, produce the recommendation table in this format:

```
## Parameter Recommendations — [Endpoint Group]

| Parameter | Value | Justification |
|-----------|-------|---------------|
| ...       | ...   | ...           |

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
