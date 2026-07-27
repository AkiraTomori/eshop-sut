---
name: BugReportAutomation
description: Converts failing Playwright test assertions into structured bug reports following the HW2 bug report format. Produces entries for bug_report.md and ready-to-paste GitHub Issue content with screenshot references.
---

# SKILL: BugReportAutomation — Automation-Discovered Bug Reporting

> **Skill:** BugReportAutomation
> **Phase:** Reporting (triggered when a test assertion fails and the failure reveals a genuine product defect)
> **Prerequisite:**
>   - HTML report from Playwright run showing failing tests
>   - Screenshot captured by Playwright (`only-on-failure` config)
>   - `23127379_Homework/HW2/Pool-[X]_FR##_*/FR##-bug-report.md` (to avoid duplicate bug filing)
> **Input:**
>   - Test name, assertion failure message, screenshot path
>   - HW2 bug report (to check if already filed)
> **Output files:**
>   - Appended entry in `23127379_Homework/HW4/bug_report.md`
>   - GitHub Issue content (ready to paste)
> **Governance:** `AGENTS.md §6` (output contract), `§8` (quality gate), `§10 HITL §bug filing`

---

## Skill Purpose

When a Playwright assertion fails and the failure indicates a **genuine product defect** (not a test issue), document the bug systematically. Distinguish between:

1. **Confirmed bugs** — already filed in HW2 bug report (just link in automation run).
2. **New automation-discovered bugs** — defects found during automation runs that were not in HW2.
3. **Test infrastructure issues** — locator/setup problems, not product defects (fix the test, don't file a bug).

---

## Execution Steps

### Step 1 — Classify the Failure

Before filing a bug, determine the failure type:

```
Is the test assertion failing because:

A) The assertion is wrong or the locator is broken?
   → Fix the test. This is NOT a bug. Do NOT file.

B) The locator is correct and the expected result matches the SRS,
   but the SUT produces a different result?
   → This IS a bug. Proceed to Step 2.

C) The bug was already filed in HW2 (check FR##-bug-report.md)?
   → It's a CONFIRMED BUG from HW2. Link to existing bug ID.
   → Still document as "Known Failure" in fr##-automation-review.md.
   → Do NOT create a new GitHub Issue (duplicate).

D) This is a new defect not seen in HW2?
   → NEW bug. File a new GitHub Issue + add to bug_report.md.
```

### Step 2 — Gather Evidence

Before writing the bug report, collect:

```
□ TC ID that triggered the failure (e.g., TC-FR06-EP-001)
□ Browser(s) where it fails (Chromium / Firefox / WebKit / All)
□ Exact assertion failure message from Playwright output
□ Screenshot path (from test-results/[test-name]/screenshot.png)
□ Playwright trace file path (if trace: 'retain-on-failure' is set)
□ Relevant SRS requirement ID (the spec that was violated)
□ Severity assessment (Critical / High / Medium / Low)
```

### Step 3 — Determine Bug ID

Bug IDs for automation-discovered bugs follow the format:

```
BUG-FR##-AUTO-[SEQ]

Where:
- FR## = FR-06, FR-08, FR-15
- AUTO = marks as automation-discovered (vs. manual testing)
- [SEQ] = sequential number starting from 001

Examples:
- BUG-FR06-AUTO-001 (first automation-discovered bug for FR-06)
- BUG-FR08-AUTO-002 (second automation-discovered bug for FR-08)
```

For confirmed HW2 bugs, use the existing ID (e.g., BUG-FR06-001).

### Step 4 — Write Bug Report Entry

Append to `23127379_Homework/HW4/bug_report.md`:

```markdown
---
## BUG-FR##-AUTO-[SEQ]: [Short Bug Title]
**Date Discovered:** YYYY-MM-DD HH:MM
**Discovered By:** Automation — Playwright (23127379)
**Source TC:** TC-FR##-[TYPE]-[###]
**Browser(s):** Chromium, Firefox, WebKit (specify which)
**Severity:** Critical / High / Medium / Low
**Status:** Open
**GitHub Issue:** #[issue-number] (fill after creating issue)

### Environment
- Frontend URL: http://localhost:5173 (or http://localhost:5174 for admin)
- Backend URL: http://localhost:3000
- SUT Version: [git commit hash if known]

### Steps to Reproduce (from TC)
1. [Step 1]
2. [Step 2]
3. [Step 3 — action that triggers bug]

### Expected Result (per SRS [FR-XX / SEC-XX])
[Exact expected behavior as defined in the SRS]

### Actual Result
[What the SUT actually does — copy from Playwright error output]

### Playwright Assertion Failure
```
[Paste exact Playwright error message here]
Expected: ...
Received: ...
```

### Evidence
- Screenshot: `23127379_Homework/HW4/test-results/[test-folder]/screenshot.png`
- Playwright Trace: `23127379_Homework/HW4/test-results/[test-folder]/trace.zip`
- HTML Report: `23127379_Homework/HW4/playwright-report/index.html`

### SRS Violation
> **[FR-XX / SEC-XX]:** "[Quote the relevant SRS requirement text]"

### Impact
[Describe user impact: what breaks, what cannot be done, security implications if any]

### Already In HW2?
- [ ] Yes — HW2 Bug ID: [BUG-FR##-###] (link back)
- [ ] No — New defect discovered during automation
```

### Step 5 — Write GitHub Issue Content

Prepare ready-to-paste content for GitHub Issues:

```markdown
**[GitHub Issue Title]:** BUG-FR##-AUTO-[SEQ]: [Short Bug Title]

## Summary
[1–2 sentence description of the bug]

## Steps to Reproduce
1. [Step 1]
2. [Step 2]
3. [Step 3]

## Expected Result
[Per SRS FR-XX: exact expected behaviour]

## Actual Result
[What the SUT does instead]

## Playwright Failure Message
```
[Exact Playwright assertion error]
```

## Evidence
<!-- HITL: Attach screenshot here after GitHub Issue is created -->
![Screenshot]([screenshot filename])

## Environment
- Browser: [Chromium / Firefox / WebKit / All]
- Frontend: http://localhost:5173
- Student: 23127379

## Labels
- bug
- automated-discovery
- [pool-a / pool-b / pool-c]
- [severity: critical / high / medium / low]
```

---

## Severity Classification Guide

| Severity | Definition | Examples from EShop |
|----------|-----------|---------------------|
| **Critical** | Core functionality broken; security vulnerability | Cart total tampered, auth bypass, data loss |
| **High** | Feature broken for primary use case; affects most users | Checkout fails, product not created, login blocked |
| **Medium** | Feature degraded; workaround exists | Missing breadcrumb, wrong button color, price formatting |
| **Low** | Visual/cosmetic; minor UX issue | Missing toast notification, slight label mismatch |

---

## Known HW2 Bugs — Quick Reference

These are confirmed bugs from HW2 that will appear as automation failures. Do NOT refile these — just link:

| HW2 Bug ID | Feature | Short Description | Expected Test Outcome |
|-----------|---------|------------------|-----------------------|
| BUG-FR06-001 | FR-06 | Category, breadcrumb missing; button is green not blue | TC-FR06-EP-001 fails (expected) |
| BUG-FR06-002 | FR-06 | Cart creates new row instead of incrementing quantity | TC-FR06-EP-004 fails (expected) |
| BUG-FR06-003 | FR-06 | Quantity = 0 accepted (should be rejected) | TC-FR06-NEG-006 fails (expected) |
| BUG-FR06-004 | FR-06 | Negative quantity accepted | TC-FR06-NEG-007 fails (expected) |
| BUG-FR06-006 | FR-06 | Non-numeric quantity (NaN) accepted | TC-FR06-NEG-009 fails (expected) |
| BUG-FR08-001 | FR-08 | No h1 tag on checkout/cart page | TC-FR08-EP-001 fails (expected) |
| BUG-FR08-002 | FR-08 | Button not blue | TC-FR08-EP-001 partially fails |
| BUG-FR08-006 | FR-08 | Empty address not rejected | TC-FR08-NEG-004 fails (expected) |
| BUG-FR08-007 | FR-08 | Error message position wrong | TC-FR08-NEG-004 fails (expected) |
| BUG-FR08-008 | FR-08 | Backend accepts client-sent total_amount (security bug) | TC-FR08-NEG-005 fails (expected) |
| BUG-FR15-001 | FR-15 | No success toast on product creation | TC-FR15-EP-001 fails (expected) |
| BUG-FR15-003 | FR-15 | Price displayed without thousands formatting | TC-FR15-EP-001 fails (expected) |

---

## Output Block Template

After completing this skill for a bug, present to HITL:

```
[BugReportAutomation Complete]

BUG FILED: BUG-FR##-AUTO-[SEQ]
- Type: New automation-discovered / Confirmed HW2 bug
- Severity: [level]
- Source TC: TC-FR##-[TYPE]-[###]
- Browsers affected: [list]

HITL ACTIONS REQUIRED:
1. Create GitHub Issue using the content above
2. Attach screenshot from `23127379_Homework/HW4/test-results/` to the issue
3. Copy the issue number (#XX) back to `23127379_Homework/HW4/bug_report.md` GitHub Issue field
4. Add bug to `fr##-automation-review.md` Known Failures table
5. Commit:
   ```bash
   git add 23127379_Homework/HW4/bug_report.md
   git commit -m "bug(FR##): file BUG-FR##-AUTO-[SEQ] - [short description]"
   ```
```

---

## HITL Action After This Skill

1. Review the bug entry in `bug_report.md` for accuracy.
2. Create the GitHub Issue and attach the screenshot.
3. Fill in the GitHub Issue number in `bug_report.md`.
4. If this is a known HW2 bug: verify the HW2 Bug ID link is correct.
5. Commit the updated `bug_report.md`.
