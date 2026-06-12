# SKILL: Phase 4 — Test Case Design

> **Phase:** 4 of 5
> **Prerequisite:** Phase 2 (`FR[##]-domain-analysis.md`) and Phase 3 (`FR[##]-boundary-analysis.md`) must be completed and HITL-approved.
> **Input:** Approved EC table + approved BVA table
> **Output file:** `FR[##]-test-cases.md` (append to pool directory)
> **Knowledge sources (read in order):**
> 1. `FR[##]-domain-analysis.md` — EC table with all class IDs
> 2. `FR[##]-boundary-analysis.md` — BVA boundary points
> 3. `.agents/context/theory-testcase-design.md §3, §4, §5, §6, §13` — test case template, title syntax, validation points, best practices
> 4. `.agents/context/theory-domain-testing.md §7` — TC selection strategy
> 5. `.agents/context/eshop-srs.md` — expected results source

---

## Skill Purpose

Design a complete, traceable set of **EP test cases**, **BVA test cases**, and **negative (invalid) test cases** following the standard template from `theory-testcase-design.md §6`. Every test case must have a precise expected result written before execution.

---

## Execution Steps

### Step 1 — Design Valid EP Test Cases (TYPE: EP)

**Goal:** Cover all VALID equivalence classes with the minimum number of test cases.

- Combine as many valid EC classes as possible into a single test case (TC-BP-01 from theory-testcase-design).
- One test can cover multiple valid classes simultaneously.
- Continue until every VALID class has been covered by at least one test case.
- ID format: `TC-FR[##]-EP-[###]`

### Step 2 — Design Invalid / Negative Test Cases (TYPE: NEG)

**Goal:** Cover every INVALID equivalence class with one isolated test case each.

- Each invalid EC gets its **own dedicated test case** (AGENTS.md P-01, theory-testcase-design TC-BP-03).
- Never combine two invalid conditions in one test case.
- ID format: `TC-FR[##]-NEG-[###]`

### Step 3 — Design BVA Test Cases (TYPE: BV)

**Goal:** Cover every boundary point from the Phase 3 BVA table.

- Each boundary point (LB-1, LB, LB+1, UB-1, UB, UB+1) becomes a test case.
- `LB-1` and `UB+1` points are invalid test cases — they must be isolated (no other invalid condition combined).
- Group valid boundary points (LB, LB+1, UB-1, UB) into minimal test cases where feasible, keeping them separate from other variables' boundaries.
- ID format: `TC-FR[##]-BV-[###]`

### Step 4 — Write Each Test Case

Every test case MUST use this exact structure (from `theory-testcase-design.md §6`):

```
Test Case ID    : TC-FR[##]-[TYPE]-[###]
Title           : [Action] + [Function] + [Operating Condition]
Description     : Brief rationale tied to specific EC or BVA point
Priority        : High / Medium / Low
Pre-conditions  : System state before execution
Steps           : 1. [Action] / 2. [Action] / ... / N. [Validate]
Test Data       :
  Input  : [exact field name = exact value]
  Output : [expected response code / message / state]
Expected Result : [Precise, measurable — no vague language]
Observed Result : [Left blank — filled by HITL during execution]
Status          : Not Run
EC Coverage     : [EC-FR[##]-NNN, EC-FR[##]-NNN]
Req. Ref        : [FR-XX / SEC-XX]
Bug ID          : [Left blank]
```

### Step 5 — Title Quality Check

Every title MUST follow the pattern: **Action + Function + Operating Condition**

| Part | Examples for EShop |
|------|--------------------|
| **Action** | Verify, Validate, Confirm, Check |
| **Function** | product detail page loads, checkout total calculates, product is created, profile is updated |
| **Operating Condition** | with quantity = 1 (minimum valid), when price is negative, for an unauthenticated user, when name exceeds 255 characters |

Reject any title that uses vague language like "Test login" or "Check error".

### Step 6 — Expected Result Precision Check

For every test case, verify the expected result is:

| Type | Precision Requirement |
|------|-----------------------|
| **Valid outcome** | Exact success message, HTTP 200, specific UI state, computed value |
| **Invalid outcome** | Exact error message text, HTTP 4XX code, specific UI error display location |
| **Redirect** | Exact target URL or page name |
| **State change** | Exact before/after database or UI state |

Never write: "should work", "should display error", "correct behavior shown".

### Step 7 — Coverage Mapping

After writing all test cases, build a coverage matrix to confirm:

```
□ Every VALID EC → covered by at least one EP or BV test case
□ Every INVALID EC → covered by exactly one NEG test case (isolated)
□ Every BVA boundary point → covered by exactly one BV test case
□ Every FR-XX requirement → referenced by at least one test case
```

### Step 8 — Self-Audit (AGENTS.md §7 — Test Case Gate)

```
□ Each invalid class has its own isolated test case
□ Valid classes are efficiently combined
□ Every title follows: Action + Function + Condition
□ Expected results are precise and written before execution
□ Every TC references at least one EC ID and one FR/SEC ID
□ Test cases are self-standing (no tribal knowledge required)
□ Test cases note any cleanup required (self-cleaning)
```

---

## Output Block Template

Append the following block to `FR[##]-test-cases.md`:

```markdown
---
## Test Cases — [FR-ID]: [Feature Name]
**Date:** YYYY-MM-DD HH:MM
**Designer:** Gemini QA Agent (reviewed by: [HITL name])
**Based on:** FR[##]-domain-analysis.md + FR[##]-boundary-analysis.md (approved YYYY-MM-DD)

### EP Test Cases (Valid)

---
**Test Case ID:** TC-FR[##]-EP-001
**Title:** [Action] + [Function] + [Operating Condition]
**Description:** [Rationale — which EC classes are covered]
**Priority:** High / Medium / Low
**Pre-conditions:** [System state]
**Steps:**
  1. [Step]
  2. [Step]
  3. [Validation step]
**Test Data:**
  - Input: [field = value, field = value]
  - Expected Output: [value / message / HTTP status]
**Expected Result:** [Precise, measurable]
**Observed Result:** _(fill during execution)_
**Status:** Not Run
**EC Coverage:** EC-FR[##]-001, EC-FR[##]-005, EC-FR[##]-010
**Req. Ref:** FR-XX
**Bug ID:** _(fill if fails)_

---

### NEG Test Cases (Invalid — one per invalid EC)

---
**Test Case ID:** TC-FR[##]-NEG-001
[same structure as above]

---

### BV Test Cases (Boundary)

---
**Test Case ID:** TC-FR[##]-BV-001
[same structure as above]

---

### Coverage Matrix

| EC ID | Description | Type | Covered By |
|-------|-------------|------|------------|
| EC-FR[##]-001 | [description] | VALID | TC-FR[##]-EP-001 |
| EC-FR[##]-002 | [description] | INVALID | TC-FR[##]-NEG-001 |
| … | … | … | … |

**Total:** [N] EP test cases, [M] NEG test cases, [K] BV test cases = [Total] test cases
```

---

## HITL Action After This Skill

1. Read every test case title — reject any that are vague.
2. Read every expected result — reject any that use imprecise language.
3. Verify the Coverage Matrix — confirm no EC or BVA point is unmatched.
4. Sign off: append `**HITL Review:** Accepted / Partially Accepted / Rejected — [notes]` to the block.
5. Commit: `git commit -m "feat(FR##): add EP and BVA test cases (TC-FR[##]-EP-001 to NNN)"`
6. **Execute** each test case against the live SUT and fill in `Observed Result` and `Status`.
