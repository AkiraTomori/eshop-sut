# SKILL: Phase 5 — Reporting (Bug Report / Gap Analysis / Test Summary)

> **Phase:** 5 of 5
> **Prerequisite:** Phase 4 test cases must be executed by HITL with `Observed Result` and `Status` filled in.
> **Input:** Executed `FR[##]-test-cases.md` with actual results
> **Output files:**
> - `FR[##]-bug-report.md` — one entry per failed test case
> - `FR[##]-gap-analysis.md` — AI gap findings after each session
> - `FR[##]-test-summary.md` — overwritten with latest counts after execution
> **Knowledge sources (read in order):**
> 1. `FR[##]-test-cases.md` — executed results (Status: Fail / Pass / Blocked / Skipped)
> 2. `.agents/context/theory-test-report.md §3, §4, §5, §9, §10` — bug report fields, priority/severity, TSR structure
> 3. `.agents/context/eshop-srs.md` — expected behavior reference for bug descriptions

---

## Skill Purpose

Produce professional-quality reporting artefacts from test execution results: file individual bug reports for every failed test, identify gaps the AI missed, and consolidate all results into a test summary report.

---

## Sub-Skill A: Bug Report

### When to Invoke
HITL triggers this when a test case has `Status: Fail` after execution against the live SUT.

### Execution Steps

#### Step A1 — One Report Per Failed Test
Each failed test case gets **one dedicated bug report** (TR-BP-02: one bug per report).

#### Step A2 — Verify Reproducibility
Before writing the report, confirm the defect reproduces at least twice from a clean state (TR-BP-03). If intermittent, note reproduction rate (e.g., "3 of 5 attempts").

#### Step A3 — Fill All 10 Required Fields
Following `theory-test-report.md §4`:

| Field | Gemini Action |
|-------|--------------|
| Bug ID | Assign format: `BUG-FR[##]-[###]` (e.g., `BUG-FR06-001`) |
| Function Name | Copy from the test case's `Req. Ref` field |
| Problem Summary | Pattern: `[Test Objective] + [Actual Result] vs. [Expected Result]` |
| How to Reproduce | Copy and expand test case steps; include exact data values |
| Reported By | "Gemini QA Agent + [HITL name]" |
| Date | Current date YYYY-MM-DD |
| Assign To | "Development Team" (HITL assigns specific developer) |
| Status | New |
| Priority | Leave blank — **HITL / PM sets priority** |
| Severity | Gemini assigns based on theory-test-report.md §5 criteria |

#### Step A4 — Assign Severity

| Severity | Criteria (from theory-test-report.md §5) |
|----------|------------------------------------------|
| **Fatal** | System crash, data loss, complete feature failure, security breach |
| **Serious** | Core feature broken, unauthorized access, incorrect calculation in main flow |
| **Medium** | Incorrect UI display, non-critical formula error, GUI misalignment |
| **Cosmetic** | Tab order, typo in label, focus issue, minor formatting |

> **Rule (TR-BP-06):** Gemini sets severity. Priority is set by HITL/PM. Never allow these to be conflated.

#### Step A5 — GitHub Issue Requirement
Gemini MUST add a placeholder for the GitHub Issue link — HITL must file the issue and fill it in before the report is considered complete (AGENTS.md P-09).

#### Step A6 — Self-Audit Before Filing

```
□ Bug ID assigned (BUG-FR[##]-[###] format)
□ Problem summary: [Objective] + [Actual] vs. [Expected]
□ Steps to reproduce are numbered and complete
□ Preconditions stated
□ Exact error message or incorrect value in Actual Result
□ Environment specified (OS, browser, URL)
□ Severity assigned by Gemini
□ GitHub Issue placeholder present
□ Language is factual and non-judgmental
□ One defect per report
```

#### Bug Report Template

Append to `FR[##]-bug-report.md`:

```markdown
---
## Bug Report: [BUG-FR[##]-[###]]
**Date:** YYYY-MM-DD
**Function Name:** [Feature / Module — e.g., FR-06 Product Detail View]
**Problem Summary:** [Objective] + [Actual Result] (Expected: [Expected Result])
**Severity:** Fatal / Serious / Medium / Cosmetic
**Priority:** _(set by HITL/PM)_
**Status:** New
**Reported By:** Gemini QA Agent + [HITL name]
**Assign To:** Development Team

### Steps to Reproduce

**Pre-conditions:**
- [System state, user role, test data]

**Steps:**
1. Navigate to [URL]
2. Enter "[value]" in the [field] field
3. Click [button]
4. Observe [element]

**Expected Result:**
[From SRS — exact specification behavior]

**Actual Result:**
[Exact error message, incorrect value, or unexpected behavior observed]

**Environment:**
- OS: [e.g., macOS 14.5]
- Browser: [e.g., Chrome 124.0]
- App URL: [e.g., http://localhost:5173]
- Test Data: [e.g., product_id=1, quantity=0]

**GitHub Issue:** _(HITL must file and link: https://github.com/[repo]/issues/[N])_
**Linked Test Case:** [TC-FR[##]-[TYPE]-[###]]
**Attachments:** _(HITL attaches screenshot / recording)_
```

---

## Sub-Skill B: AI Gap Analysis

### When to Invoke
HITL triggers this after completing a session where they identify test cases or bugs that the AI missed.

### Execution Steps

#### Step B1 — Review Execution Results
Scan all `Status: Fail` test cases and identify bugs that should have been anticipated from the SRS but were not covered by any test case.

#### Step B2 — Identify Gap Categories

| Gap Type | Description |
|----------|-------------|
| **Missing EC** | An equivalence class that should have been identified but was absent from the Phase 2 table |
| **Missing BVA Point** | A boundary point that should have been tested but was not in the Phase 3 table |
| **Missing Test Case** | An EC or BVA point that was in the table but had no corresponding test case |
| **Wrong Expected Result** | AI wrote an incorrect expected result that required HITL correction |
| **Missed Interaction** | A multi-variable interaction that domain testing alone did not capture |

#### Step B3 — Explain the Root Cause

For each gap, explain why the AI missed it:
- Poor prompt quality (insufficient context provided)
- AI training limitation (unable to infer unstated system behaviour)
- Specification ambiguity (requirement was unclear, AI chose wrong interpretation)
- Complexity (multi-condition interaction beyond single-variable EP)

#### Gap Analysis Template

Append to `FR[##]-gap-analysis.md`:

```markdown
---
## AI Gap Analysis — [FR-ID]: [Feature Name]
**Session Date:** YYYY-MM-DD HH:MM
**AI Tool:** Gemini QA Agent
**Analyst:** [HITL name]

### Gaps Identified

| # | Gap Type | Description | EC/BVA Point Missed | Root Cause | HITL Action |
|---|---------|-------------|--------------------|-----------:|------------|
| 1 | Missing EC | [Description of the missed equivalence class] | [EC that should exist] | [Root cause] | Added as EC-FR[##]-NNN |
| 2 | Wrong Expected Result | [Which TC and what was incorrect] | [TC-FR[##]-TYPE-NNN] | [Root cause] | Corrected in test file |
| … | … | … | … | … | … |

### Summary
- **Total gaps found:** [N]
- **Gaps due to prompt quality:** [N]
- **Gaps due to AI limitation:** [N]
- **Gaps due to specification ambiguity:** [N]
- **New test cases added as a result:** [N]
```

---

## Sub-Skill C: Test Summary Report

### When to Invoke
HITL triggers this after all test cases for a given FR have been executed.

### Execution Steps

Count from `FR[##]-test-cases.md` the status of every test case and produce the summary.

#### Test Summary Template

Overwrite `FR[##]-test-summary.md`:

```markdown
# Test Summary Report — [FR-ID]: [Feature Name]
**Test Cycle:** HW02 Domain Testing
**Date Range:** YYYY-MM-DD to YYYY-MM-DD
**Tester:** [HITL name] + Gemini QA Agent

## Test Execution Summary

| Type | Total | Passed | Failed | Blocked | Skipped | Not Run | Pass Rate |
|------|-------|--------|--------|---------|---------|---------|-----------|
| EP (Equivalence) | N | N | N | N | N | N | XX.X% |
| BV (Boundary) | N | N | N | N | N | N | XX.X% |
| NEG (Invalid) | N | N | N | N | N | N | XX.X% |
| **TOTAL** | N | N | N | N | N | N | XX.X% |

## Defect Summary

| Bug ID | Summary | Severity | Priority | Status |
|--------|---------|----------|----------|--------|
| BUG-FR[##]-001 | [summary] | Serious | High | New |

## Defect Statistics
- **Total bugs found:** [N]
- **Fatal:** [N] | **Serious:** [N] | **Medium:** [N] | **Cosmetic:** [N]
- **Open:** [N] | **Fixed:** [N] | **Deferred:** [N]

## Open Points / Risks
- [Any unresolved ambiguity, deferred defect, or risk for the HITL to decide]

## Release Recommendation
☐ Go | ☐ No-Go | ☐ Conditional Go — [conditions]
```

---

## HITL Action After This Skill

1. **Bug reports:** File GitHub Issues for every `BUG-FR[##]-[###]`; paste the issue URL into the Bug Report file.
2. **Gap analysis:** Confirm root cause explanations are accurate; add new test cases where gaps were found.
3. **Test summary:** Review pass rate and defect severity; make the release recommendation.
4. **AI Audit:** Append a session block to `FR[##]-AI-Audit.md` for this Phase 5 session.
5. Commit: `bug(FR##): file bug report [BUG-FR[##]-001]` and `docs(FR##): update test summary report`.
