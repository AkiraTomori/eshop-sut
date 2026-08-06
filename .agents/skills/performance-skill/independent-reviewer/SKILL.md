---
name: independent-reviewer
description: >-
  Use this skill to critically review outputs from Skills 1, 2, 4, or 6 for
  correctness, accuracy, and completeness — using a FRESH context with NO
  prior knowledge of how the content was generated. Trigger phrases: "review
  output", "independent review", "check this for errors", "verify this output",
  or when the user pastes content and asks "is this correct?". CRITICAL: This
  skill must be invoked as an independent agent (separate conversation context)
  to prevent AI self-defense bias. It checks against api_specification.md as
  ground truth, identifies issues with severity labels, and logs every review
  cycle as a before/after diff. Can be called repeatedly — each review cycle
  produces evidence for Skill 5 (postmortem-critique-generator).
---

# Skill 10 — independent-reviewer

## Purpose
Independently review outputs from other skills to catch errors the generating
AI would self-defensively overlook. Log every review cycle with diffs as
evidence for the postmortem.

---

## ⚠️ CRITICAL: Independent Context Required

**This skill MUST be invoked in a separate agent context with no memory of
the conversation that generated the content being reviewed.**

Using Antigravity CLI:
```bash
# Open a fresh conversation — no prior context carried over
agy "Review this Skill 1 output independently: [paste content here]"
```

Or use `/teamwork-preview` to spawn an independent agent.

**Why**: If the same context that generated the output reviews it, the AI will
tend to defend its own output and miss logical errors.

---

## Required Input

- `[CONTENT_TO_REVIEW]` — full content to review (paste completely)
- `[SOURCE_SKILL]` — which skill produced this (1 / 2 / 4 / 6)
- `[VERSION]` — v1 / v2 / v3 (which iteration)
- `[GROUND_TRUTH]` — read `api_specification.md` and HW05 requirements fresh

---

## Step 1 — Read Ground Truth First (mandatory)

Before reviewing anything, read:

```bash
cat /Users/thaiminhhuy/docs/Github/eshop-sut/api_specification.md
cat "/Users/thaiminhhuy/docs/Github/eshop-sut/23127379_Homework/HW5/2026.HW05.Performance Testing_En.md"
```

**Hard constraints to memorize:**
- Login lockout triggers after **exactly 3** failed attempts
- File naming: `{StudentID}_{ScenarioType}_{YYYYMMDD}` (exact format)
- Checkout body: `{total_amount, shipping_address}`
- Cart body: `{id, name, price, quantity}`
- Auth token header: `Authorization: Bearer <token>`
- Three **different** report view types required (no repeats)
- Three **separate** CSV files (one per endpoint group)

---

## Step 2 — Review Checklists by Skill

### Checklist: Skill 1 (test-parameter-advisor)

```markdown
## Review — Skill 1 Output (v{VERSION})

### Accuracy
- [ ] Thread count realistic for local SQLite? (>200 concurrent writes usually causes lock)
- [ ] Ramp-up slow enough for Load? (≥ 30s); fast enough for Spike? (5–10s)
- [ ] Think-time reflects real user behavior? (0ms is unrealistic for Load)
- [ ] Duration sufficient for stable p95? (≥ 5 min steady state recommended)
- [ ] Account lockout risk mentioned for auth-heavy?
- [ ] Scenario mapping correct? (Read→Load, Auth→Spike, Transaction→Stress)

### Completeness
- [ ] Justification provided for each scenario pairing?
- [ ] Endurance test parameters included?
- [ ] Lockout risk explicitly called out for auth-heavy?

### Issues Found
| # | Issue | Severity | Correct Value |
|---|-------|----------|---------------|
| | | | |
```

### Checklist: Skill 2 (test-plan-generator)

```markdown
## Review — Skill 2 Output (v{VERSION})

### File Naming
- [ ] Filename follows: `23127379_{Scenario}_{YYYYMMDD}.jmx`?
- [ ] No lowercase scenario type? (must be `Load`, `Stress`, `Spike`)

### JMX Structure
- [ ] BASE_URL uses a User Defined Variable (not hardcoded `localhost:3000`)?
- [ ] CSV Sharing Mode = `Current Thread` for auth-heavy? (CRITICAL)
- [ ] Think-time values match approved params from Skill 1?
- [ ] Thread count matches approved params?
- [ ] Ramp-up duration matches approved params?

### Assertions
- [ ] Both HTTP 200 (success) and expected errors (403 lockout) covered?
- [ ] HTTP 200 assertion also checks response body content (not just status)?
- [ ] Checkout assertion verifies `order_id` in response body?

### Auth-heavy Specific
- [ ] Each thread uses its own credentials (CSV `Current Thread` sharing)?
- [ ] Lockout (403/401) logged but NOT counted as test failure?
- [ ] JWT token extracted from login response?
- [ ] Token passed as `Authorization: Bearer` header in cart/checkout?

### CSV Files
- [ ] All required columns present?
  - products: `product_id,search_keyword`
  - auth: `email,password,expected_result`
  - order: `product_id,product_name,price,quantity,shipping_address`
- [ ] Note to create real test accounts included?

### Issues Found
| # | Issue | Severity | Correct Value |
|---|-------|----------|---------------|
| | | | |
```

### Checklist: Skill 4 (jtl-log-analyzer)

```markdown
## Review — Skill 4 Output (v{VERSION})

### Metric Correctness
- [ ] p95 computed from `elapsed` column? (NOT from `Latency` column)
  - `elapsed` = full end-to-end response time
  - `Latency` = time to first byte only (different metric!)
- [ ] Error rate = (success == false) / total requests?
  - Note: 403 lockout may be expected behavior, not an error
- [ ] Throughput = total requests / test duration in seconds?
- [ ] Every metric cites a specific .jtl row or column?

### FEASIBLE / HALLUCINATED Labels
- [ ] SQLite WAL mode: labeled [FEASIBLE] for EShop local? ✓
- [ ] Redis cache: labeled [HALLUCINATED] for EShop local? ✓
- [ ] DB index: labeled [FEASIBLE] only if slow query evidence exists?
- [ ] Horizontal scaling: labeled [HALLUCINATED] for localhost?
- [ ] Each label accompanied by a clear justification?

### Issues Found
| # | Issue | Severity | Correct Value | .jtl Row Evidence |
|---|-------|----------|---------------|-------------------|
| | | | | |
```

### Checklist: Skill 6 (ci-performance-pipeline-proposer)

```markdown
## Review — Skill 6 Output (v{VERSION})

### Thresholds
- [ ] All threshold values sourced from Skill 4 actual measurements?
- [ ] Regression threshold has reasonable buffer? (+20% is good; +5% too strict)
- [ ] Endurance values sourced from soak test results?

### Mermaid Flowchart
- [ ] Valid Mermaid syntax (renderable)?
- [ ] Trigger logic differentiates docs / backend / release commits?
- [ ] SUT health check failure handled?
- [ ] PR block on REGRESSION shown in flow?

### Trade-off Table
- [ ] EShop-specific false alarm sources mentioned? (hardware variance, SQLite)
- [ ] Cold start issue mentioned?
- [ ] Costs realistic for a local dev machine setup?

### Issues Found
| # | Issue | Severity | Correct Value |
|---|-------|----------|---------------|
| | | | |
```

---

## Step 3 — Severity Classification

| Severity | Definition |
|---|---|
| 🔴 Critical | Wrong = fails assignment or corrupts data (wrong spec, wrong formula) |
| 🟠 High | Significant logic error — affects results noticeably |
| 🟡 Medium | Incomplete — not wrong but missing, may lose points |
| 🟢 Low | Minor improvement — should fix but not critical |

---

## Step 4 — Write Review Log

**File**: `23127379_Homework/HW5/review_history/skill{N}_v{VERSION}_review.md`

```markdown
# Review Log — Skill {N} v{VERSION}
**Date**: {timestamp}
**Reviewer**: independent-reviewer (Skill 10, fresh context)
**Content reviewed**: {brief description}

## Issues Found

| # | Location | Issue | Severity | Required Fix |
|---|----------|-------|----------|--------------|
| 1 | Thread Group | Ramp-up = 5s for Load test (too fast) | 🟠 High | Increase to ≥ 30s |
| 2 | CSV Data Set | Sharing Mode = All Threads | 🔴 Critical | Change to Current Thread |

## What Was Correct
- [x] File naming convention correct
- [x] BASE_URL uses variable
- [x] Think-time present

## Root Cause Analysis
**Why did the AI produce this error?**
[ ] Prompt lacked EShop-specific context (e.g., SQLite local setup)
[ ] Model limitation (no knowledge of EShop lockout specifics)
[ ] Generic knowledge applied (enterprise solution for a localhost app)
[ ] Calculation error (wrong formula)
[ ] Spec constraint overlooked (did not read api_specification.md carefully)

## Recommendation
[Specific guidance for fixing — not just "fix it"]

## Verdict
⛔ NEEDS REVISION — {N_CRITICAL} critical issue(s) must be fixed.
✅ APPROVED — only minor issues, safe to proceed.
```

---

## Step 5 — Update Review Summary

After each cycle, update:
`23127379_Homework/HW5/review_history/review_summary.md`

```markdown
# Review History Summary

| Round | Skill | Version | Issues Found | Critical | Fixed? | Timestamp |
|-------|-------|---------|--------------|----------|--------|-----------|
| 1 | Skill 1 | v1 | 3 | 1 | ✅ | {ts} |
| 2 | Skill 2 | v1 | 5 | 2 | ✅ | {ts} |
| 3 | Skill 2 | v2 | 1 | 0 | ✅ | {ts} |
| 4 | Skill 4 | v1 | 2 | 1 | ⬜ | {ts} |
```

---

## After Review — Trigger Revision

If Critical/High issues found:

```
If Skill 1 has errors → Return to Skill 1 in a new context:
  "Revise test parameters for [group] — reviewer found: [issue]"

If Skill 2 has errors → Return to Skill 2:
  "Regenerate test plan v2 for [scenario] — fix: [issue]"
```

Each revision creates a new version → review again with Skill 10.

---

## ⛔ After Each Review — STOP HERE

```
✅ Skill 10 Review v{VERSION} complete.

📊 Review results for Skill {N}:
   - Critical: {n_critical}
   - High: {n_high}
   - Medium: {n_medium}
   - Low: {n_low}

📁 Log saved: review_history/skill{N}_v{VERSION}_review.md

👉 If Critical/High issues found:
   → Fix in Skill {N} → create v{VERSION+1}
   → Run Skill 10 again on v{VERSION+1}

👉 If only Medium/Low remain:
   → Fix Medium if time allows
   → Continue main workflow

❌ All review cycles MUST be logged — this is the evidence for Skill 5.
```

## References
- [Review Criteria](./references/review_criteria.md)
- [api_specification.md](../../../../api_specification.md)
- [HW05 Requirements](../../../../23127379_Homework/HW5/2026.HW05.Performance%20Testing_En.md)
