# Review Criteria — independent-reviewer (Skill 10)

## Hard Constraints from Specification

All constraints sourced from `api_specification.md` and `2026.HW05.Performance Testing_En.md`:

| Constraint | Correct Value | Source |
|---|---|---|
| Login lockout trigger | **Exactly 3** failed attempts | api_spec §1.2 |
| File naming | `{StudentID}_{ScenarioType}_{YYYYMMDD}` | HW05 §6 |
| Report views | **3 different types** — no repeats | HW05 Task 1 |
| CSV data files | **Separate file per group** — no shared CSV | HW05 Task 1 |
| Video duration | **≥ 6 minutes** total | HW05 Task 1 |
| AI Critique length | **200–300 words** (exact range) | HW05 §10 |
| Endurance test duration | **10–15 minutes** sustained load | HW05 Task 1 |
| Endpoint groups | Must cover all 3: read-heavy, auth-heavy, transactional | HW05 §5 |
| Auth token format | `Authorization: Bearer <token>` | api_spec §2 |

---

## JMeter / k6 Technical Constraints

| Constraint | Correct Value | Common AI Mistake |
|---|---|---|
| CSV Sharing Mode (auth-heavy) | `Current Thread` | AI often defaults to `All Threads` → all threads lock the same account |
| Think-time (Load test) | Random 1000–2000ms | AI often sets 0ms (unrealistic) |
| Ramp-up (Load test) | ≥ 30s | AI often suggests 5–10s (too fast, creates artificial spike) |
| Ramp-up (Spike test) | 5–10s (sudden) | AI often confuses Spike ramp-up with Load ramp-up |
| BASE_URL | User Defined Variable | AI often hardcodes `localhost:3000` |
| Lockout 403/401 assertion | NOT a test failure (expected) | AI often marks lockout as an error |
| Transactional flow | Login first → extract token → use in cart/checkout | AI often skips login step |

---

## Metrics Interpretation

| Metric | Correct Definition | Common AI Mistake |
|---|---|---|
| p95 | 95th percentile of `elapsed` column | AI uses `Latency` column (time-to-first-byte only) |
| Error rate | `success == false` / total requests | AI only counts 4xx/5xx HTTP codes (misses assertion failures) |
| Throughput | total requests / test duration (seconds) | AI takes JMeter's built-in display without verifying |
| Lockout 403 | Expected behavior — NOT an error | AI adds 403 lockout to overall error rate |

---

## Optimization Feasibility Reference

| Optimization | Label | Reasoning |
|---|---|---|
| SQLite WAL mode | [FEASIBLE] | EShop uses SQLite; WAL is a single pragma command |
| Index on products.name | [FEASIBLE] | Full scan risk is real; index is simple to add |
| Singleton DB connection | [FEASIBLE] | Verify in backend/db.js; cheap fix |
| Node.js cluster mode | [UNCERTAIN] | Verify if EShop supports it; may need code changes |
| Redis caching | [HALLUCINATED] | No Redis in EShop |
| PostgreSQL connection pooling | [HALLUCINATED] | EShop uses SQLite, not PostgreSQL |
| Horizontal scaling / load balancer | [HALLUCINATED] | Single localhost process — no infrastructure |
| CDN for static assets | [HALLUCINATED] | Not relevant to API performance testing |

---

## Severity Rubric

### 🔴 Critical
Will fail the assignment or produce seriously wrong data:
- Wrong file naming convention → TA rejects submission
- CSV Sharing Mode = All Threads for auth-heavy → mass account lockout
- p95 computed from `Latency` instead of `elapsed` → completely wrong metric

### 🟠 High
Significantly affects results:
- Thread count unrealistically high for local SQLite (e.g., 500 concurrent writes)
- Ramp-up too slow for Spike (defeats the purpose of spike testing)
- Lockout (403) counted as test failure → inflated error rate
- Missing auth token for transactional → all requests return 401

### 🟡 Medium
Incomplete but not outright wrong:
- Think-time = 0ms (not realistic, but test still runs)
- Status-code-only assertions (no body content validation)
- Optimization labels present but missing justification
- CI proposal uses generic thresholds instead of actual measured values

### 🟢 Low
Minor improvements:
- Missing comments in JMX file
- No error screenshot placeholder noted
- Throughput formatted with too many decimal places

---

## Review Log Format

File: `review_history/skill{N}_v{VERSION}_review.md`

```markdown
# Review — Skill {N} v{VERSION}
**Date**: {timestamp}
**Reviewer**: independent-reviewer (Skill 10, fresh context)
**Content hash**: (first 8 chars of SHA1 to detect changes between versions)

## Issues Found

| # | Location | Issue | Severity | Required Fix |
|---|----------|-------|----------|--------------|
| 1 | Thread Group config | Ramp-up = 5s for Load test | 🟠 High | Increase to ≥ 30s |
| 2 | CSV Data Set | Sharing Mode = All Threads | 🔴 Critical | Change to Current Thread |

## What Was Correct
- [x] File naming convention correct
- [x] BASE_URL uses User Defined Variable
- [x] Think-time is present

## Root Cause
[Why did the AI make this error? Select all that apply:]
- [ ] Prompt lacked EShop-specific context (SQLite local setup)
- [ ] Model limitation (no knowledge of EShop lockout implementation)
- [ ] Generic knowledge applied (enterprise solution for localhost app)
- [ ] Calculation error (wrong formula or wrong column)
- [ ] Spec constraint overlooked (did not read api_specification.md carefully)

## Fix Instructions
[Specific steps to fix — not just "fix it". Be precise.]

## Verdict
⛔ NEEDS REVISION — {N} critical issue(s) found. Fix and re-review as v{VERSION+1}.
✅ APPROVED WITH MINOR NOTES — no critical/high issues. Safe to proceed.
```
