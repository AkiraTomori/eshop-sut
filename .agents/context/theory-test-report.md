# Test Report — Complete Theory Reference

## Table of Contents

1. [Overview — What is a Test Report?](#1-overview--what-is-a-test-report)
2. [Bug / Defect Life Cycle](#2-bug--defect-life-cycle)
3. [Bug Report](#3-bug-report)
4. [Bug Report Essentials — Fields](#4-bug-report-essentials--fields)
5. [Priority vs. Severity](#5-priority-vs-severity)
6. [Bug Report Quality Characteristics](#6-bug-report-quality-characteristics)
7. [How to Reproduce a Defect](#7-how-to-reproduce-a-defect)
8. [Bad Bug Reports — Anti-patterns](#8-bad-bug-reports--anti-patterns)
9. [Test Summary Report](#9-test-summary-report)
10. [Defect Statistics and Metrics](#10-defect-statistics-and-metrics)
11. [Senior QA Best Practices](#11-senior-qa-best-practices)

---

## 1. Overview — What is a Test Report?

A **Test Report** is a formal artifact that communicates the outcomes of testing activities to stakeholders. In professional QA, test reporting encompasses two main categories:

| Report Type | Purpose | Primary Audience |
|-------------|---------|-----------------|
| **Bug / Defect Report** | Document a specific defect found during testing — what it is, how to reproduce it, and its impact | Developers, team leads, project managers |
| **Test Summary Report** | Summarize overall test activities, results, defect statistics, and open risks for a test cycle or release | Project managers, product owners, clients, leadership |

The course covers three core areas:
1. **Bug/Defect Life Cycle** — the workflow a defect follows from discovery to closure
2. **Bug/Defect Report** — how to document a specific defect
3. **Test Summary Report** — how to summarize and communicate overall test results

---

## 2. Bug / Defect Life Cycle

The **Bug Life Cycle** (also called the Defect Life Cycle) defines the series of states a defect moves through from the moment it is discovered until it is finally closed.

### Standard Bug Life Cycle States

```
         ┌──────────┐
         │   NEW    │  ← Tester discovers and logs the bug
         └────┬─────┘
              │ Assign to developer
              ▼
         ┌──────────┐
         │  OPEN /  │  ← Developer receives and investigates
         │ IN-PROGRESS│
         └────┬─────┘
              │
    ┌─────────┼──────────────────────┐
    │         │                      │
    ▼         ▼                      ▼
┌───────┐ ┌────────┐           ┌──────────┐
│FIXED  │ │REJECTED│           │ DEFERRED │
└───┬───┘ └────────┘           └──────────┘
    │ Return to tester
    ▼
┌──────────┐
│  CLOSED  │  ← Tester verifies fix is correct
└────┬─────┘
     │ Fix does not resolve the issue
     ▼
┌──────────┐
│REOPENED  │  ← Bug re-enters the cycle
└──────────┘
```

### All Possible Bug States

| State | Description |
|-------|-------------|
| **New** | Bug has just been logged; not yet reviewed or assigned |
| **Open / In-Progress** | Assigned to a developer who is actively investigating or fixing it |
| **Fixed** | Developer has applied a fix; returned to QA for verification |
| **Closed** | QA has verified the fix is correct and the bug no longer reproduces |
| **Reopened** | QA verification failed — the fix did not resolve the bug; cycle restarts |
| **Rejected** | Developer or lead determines this is not a bug (by design, misunderstanding, or invalid report) |
| **Deferred** | Bug is valid but the fix is postponed to a future release (low priority or scope constraint) |
| **Duplicate** | The same defect was already reported under a different Bug ID |

> **Key rule:** A bug is **not** closed by the developer. It is closed by the **tester** after successful verification. Only testers own the "Closed" transition.

---

## 3. Bug Report

### Definition

A **Bug Report** (also called a Defect Report or Problem Report) is a detailed document that describes a defect discovered during testing — including the context in which it was found, how to reproduce it, its impact, and who is responsible for it.

### Core Purpose

> *"The point of writing a problem report (bug report) is to get bugs fixed."*
> — **Cem Kaner** *(Testing Computer Software)*

A bug report serves three stakeholders simultaneously:
- **The tester** — creates an accountable record of a defect found
- **The developer** — receives enough information to locate, understand, and fix the issue
- **The manager/team lead** — has visibility into product quality and risk

---

## 4. Bug Report Essentials — Fields

Every bug report must contain the following 10 core fields:

| # | Field | Description |
|---|-------|-------------|
| 1 | **Bug ID** | Unique identifier for the defect (distinct from Test Case ID) |
| 2 | **Function Name** | The module, feature, or function where the bug was found |
| 3 | **Problem Summary** | One-line description: Test Objective + Actual result (vs. Expected result) |
| 4 | **How to Reproduce** | Step-by-step instructions + screenshots to reliably reproduce the defect |
| 5 | **Reported By** | Name or ID of the tester who discovered and filed the report |
| 6 | **Date** | Date the defect was reported |
| 7 | **Assign To** | Name or ID of the developer responsible for fixing the defect |
| 8 | **Status** | Current lifecycle state (New / Open / Fixed / Closed / Reopened / Rejected / Deferred / Duplicate) |
| 9 | **Priority** | Urgency of fix — how quickly this needs to be resolved |
| 10 | **Severity** | Impact on the application — how bad the defect is for the product |

### Field Detail: Bug ID

- Every bug must have a **unique, non-reusable** numeric or alphanumeric identifier.
- **Bug ID ≠ Test Case ID** — they are separate tracking entities. A single test case may uncover multiple bugs; a single bug may affect multiple test cases.
- Format convention: `BUG-[MODULE]-[###]` (e.g., `BUG-LOGIN-042`) or tool-managed sequential IDs (Jira, Azure DevOps, etc.)

### Field Detail: Function Name

The function or module where the defect manifests. Examples:
- Login
- Logout
- Account List
- Add Account
- Delete Account
- Checkout / Payment
- Search / Filter

### Field Detail: Problem Summary

The problem summary must follow the pattern:

```
[Test Objective] + [Actual Result] (vs. [Expected Result])
```

| ❌ Weak Summary | ✅ Strong Summary |
|----------------|-----------------|
| "Login doesn't work" | "No error message is displayed when attempting to register with an email that already exists" |
| "Price is wrong" | "Room price is calculated incorrectly when check-in date equals check-out date — shows $0 instead of one night's rate" |
| "Page crashes" | "Application throws HTTP 500 error when submitting the order form with an empty shipping address" |

### Field Detail: How to Reproduce

The reproduction steps must include:
1. **Preconditions** — system state before beginning (e.g., "User must be logged in as a standard user")
2. **Numbered steps** — every keyboard action, mouse click, and input value
3. **Expected result** — what *should* happen
4. **Actual result** — what *actually* happens
5. **Screenshots or screen recordings** — attached to the report to support the developer

**Template:**

```
Pre-conditions:
  - [State of the system before the test]

Steps to Reproduce:
  1. Navigate to [URL / Screen]
  2. Enter "[value]" in the [field name] field
  3. Click the [button name] button
  4. Observe [element / area]

Expected Result:
  [Description of correct system behavior]

Actual Result:
  [Description of what actually happened — exact error message, incorrect value, etc.]

Attachments:
  - screenshot_step3.png
  - screen_recording.mp4
```

---

## 5. Priority vs. Severity

These are the two most commonly confused fields in bug reporting. They are **independent dimensions**.

### Priority — How Urgently Must This Be Fixed?

Priority is a **business / scheduling** decision. It answers: *"How soon does this need to be in a working state?"*

| Priority Level | Fix Timeline | Description |
|---------------|-------------|-------------|
| **Immediate (Critical)** | Within 1 day | Must be fixed immediately — causes great damage to the product or blocks core workflows |
| **High** | Within 2–4 days | Impacts the product's main features; significant business impact |
| **Medium** | Within 5–8 days | Causes minimal deviation from requirements; workaround may exist |
| **Low** | Future release | Very minor effect on product operation; cosmetic or edge-case issue |

### Severity — How Bad Is the Impact on the Application?

Severity is a **technical / quality** assessment. It answers: *"How badly does this defect affect the system?"*

| Severity Level | Description | Examples |
|---------------|-------------|---------|
| **Fatal** | Causes critical damage to the product | System crash, data loss, corrupted database, complete feature failure |
| **Serious** | Impacts the product's main features | User can delete comments without logging in; unauthorized data access |
| **Medium** | Causes minimal deviation from requirements | GUI does not display correctly on mobile devices; incorrect calculation in non-critical path |
| **Cosmetic** | Very minor effect on product operation | Incorrect tab order, no default focus, missing keyboard shortcut, typo in label |

### Priority vs. Severity — The Key Distinction

| Scenario | Priority | Severity | Explanation |
|---------|---------|---------|-------------|
| Login page is completely broken | Immediate | Fatal | High business impact + high technical impact |
| Company CEO's name is misspelled on the About page | High | Cosmetic | Low technical impact but urgent business fix needed |
| A rarely-used report has an incorrect total | Low | Serious | High technical impact but low business urgency |
| A tooltip has a minor spelling error | Low | Cosmetic | Low on both dimensions |

> **Senior QA Note:** Priority is set by the **Project Manager or Product Owner**. Severity is set by the **QA tester**. Never let a developer override severity — that is a QA judgment call, not an engineering one.

---

## 6. Bug Report Quality Characteristics

A high-quality bug report must satisfy these 7 characteristics:

| Characteristic | Meaning |
|---------------|---------|
| **Written** | Formally documented — not communicated verbally or via instant messaging |
| **Numbered** | Assigned a unique Bug ID for tracking and reference |
| **Simple** | Uses plain, straightforward language — one issue per report |
| **Understandable** | Any team member (developer, manager, new hire) can read and comprehend it |
| **Reproducible** | The steps provided reliably reproduce the defect every time — no ambiguity |
| **Legible** | Clearly written with correct grammar; no jargon, abbreviations, or cryptic shorthand |
| **Non-judgmental** | Describes technical facts only — no emotional language, blame, or personal attacks |

---

## 7. How to Reproduce a Defect

Reliable reproduction is the single most important aspect of a bug report for developers. Three methods should be used together:

| Method | Purpose |
|--------|---------|
| **Record all test steps** | Write down every action taken, in sequence, including exact input values |
| **Keyboard and mouse activities** | Document specific key sequences, right-clicks, double-clicks, drag operations |
| **Screen capture** | Attach screenshots (of the error state) or a screen recording (of the full reproduction flow) |

### Reproduction Completeness Checklist

```
□ Preconditions are clearly stated (system state, user role, test data)
□ Steps are numbered and sequential
□ Each step specifies the exact input value or UI element interacted with
□ Expected result is written from the specification perspective
□ Actual result includes the exact error message, incorrect value, or failure behavior
□ Environment is specified (OS, browser, app version, test data)
□ Screenshot or recording is attached
□ Bug is verified to reproduce at least twice before filing
```

---

## 8. Bad Bug Reports — Anti-patterns

### Anti-pattern 1: The Report That Wasn't Filed

A defect discovered but not documented does not officially exist. If the developer never fixes it and it reaches production, there is no accountability trail.

**Rule:** Every defect, regardless of how minor, must be logged.

---

### Anti-pattern 2: Filed via Email

Email is not a bug tracking system. Defects filed by email:
- Cannot be tracked or measured
- Can be lost, ignored, or overlooked
- Cannot be assigned, prioritized, or linked to test cases
- Cannot contribute to defect metrics or trend analysis

**Rule:** All defects must be filed in the team's official bug tracking tool (Jira, Azure DevOps, TestRail, Bugzilla, etc.).

---

### Anti-pattern 3: No Specific Information

| ❌ Bad | ✅ Good |
|-------|--------|
| "It does not work!" | "Error 404: Access denied when clicking the Export button on the Reports screen" |
| "I just clicked and it crashes" | "Application crashes with NullPointerException when clicking the Delete button on an empty cart (see stack trace in attachment)" |

---

### Anti-pattern 4: Only Reports the Symptom

Reporting only the symptom forces the developer to do the tester's diagnostic work. The bug report must describe **what was being done** when the symptom occurred, not just the symptom itself.

| ❌ Symptom only | ✅ Context + Symptom |
|----------------|---------------------|
| "It crashed" | "Error 404: Page not found when clicking the Export button on the Admin Reports page after filtering by date range" |

---

### Anti-pattern 5: Unknown or Unclear Environment

The exact environment is often the decisive factor in reproducing a defect. Omitting it makes reproduction unreliable or impossible.

| ❌ Unclear | ✅ Specific |
|-----------|------------|
| "Windows" | "Windows 7, Google Chrome 20.0.1132.47m" |
| "Mobile" | "iPhone 14 Pro, iOS 16.5, Safari 16.4" |

---

### Anti-pattern 6: Adjectives Instead of Numbers

Qualitative descriptions are subjective and unmeasurable. Always use objective, quantifiable data.

| ❌ Adjective | ✅ Measurable |
|-------------|--------------|
| "System is really slow" | "System does not respond after 3 seconds; timeout occurs after 5 minutes" |
| "File is too large" | "Upload fails when file size exceeds 4.8 MB (spec allows up to 5 MB)" |
| "Form takes forever to load" | "Form load time is 12.3 seconds on a 100Mbps connection (expected: < 2 seconds)" |

---

### Anti-pattern 7: Uses Judgment or Personal Attacks

Bug reports must be factual and technical. Emotional or judgmental language damages team relationships and reduces report credibility.

| ❌ Judgmental | ✅ Professional |
|--------------|----------------|
| "Error message is stupid" | "Error message is unclear — it does not indicate which field failed validation" |
| "Developer clearly didn't test this" | "Feature does not match the specification in REQ-042" |
| "This is embarrassing" | "Critical defect found in core checkout flow — see steps to reproduce" |

---

## 9. Test Summary Report

### Definition

A **Test Summary Report** (TSR) is a high-level document that consolidates all testing activities and results for a given test cycle, sprint, or release. It communicates test progress, quality metrics, and risk to stakeholders who need a comprehensive view without examining individual test cases.

### Primary Audience

- Project Managers
- Product Owners / Product Managers
- Clients and external stakeholders
- Senior leadership / C-suite (for major releases)

### Standard Sections of a Test Summary Report

| Section | Content |
|---------|---------|
| **Summary** | High-level overview of the test cycle — scope, objectives, timeline, and overall quality assessment |
| **Test Case Result Report** | Breakdown of test execution: total TCs, passed, failed, blocked, skipped, and pass rate percentage |
| **Defect Report** | Summary of all defects found — total count, by severity, by priority, by status (open/closed/deferred) |
| **Open Points** | Outstanding risks, unresolved issues, deferred defects, or items requiring decision before release |

### Test Case Result Report — Typical Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                  TEST EXECUTION SUMMARY                          │
├──────────────────┬──────┬────────┬────────┬─────────┬───────────┤
│ Feature / Module │Total │ Passed │ Failed │ Blocked │ Pass Rate │
├──────────────────┼──────┼────────┼────────┼─────────┼───────────┤
│ Login            │  12  │   11   │    1   │    0    │   91.7%   │
│ Registration     │   8  │    8   │    0   │    0    │  100.0%   │
│ Checkout         │  20  │   17   │    2   │    1    │   85.0%   │
│ Search           │  10  │   10   │    0   │    0    │  100.0%   │
├──────────────────┼──────┼────────┼────────┼─────────┼───────────┤
│ TOTAL            │  50  │   46   │    3   │    1    │   92.0%   │
└──────────────────┴──────┴────────┴────────┴─────────┴───────────┘
```

---

## 10. Defect Statistics and Metrics

The Test Summary Report includes defect statistics from multiple analytical dimensions. These metrics are used for:
- Identifying which modules have the highest defect density
- Understanding what types of defects are most prevalent
- Targeting root cause analysis and process improvement

### Statistics by Feature / Function

Count and weight defects by the feature or module they affect, identifying the highest-risk areas of the product.

### Statistics by Defect Type

Categorizes defects by their root cause:

| Defect Type | Description | Example |
|-------------|-------------|---------|
| **Business Logic** | Incorrect implementation of business rules | Discount calculated at 15% instead of the specified 10% |
| **Coding Logic** | Programming errors, incorrect algorithms | Off-by-one error in loop causing last item to be skipped |
| **Coding Standard** | Code that violates agreed conventions | Hardcoded credentials, missing null checks |
| **Data / Database Integrity** | Data storage or retrieval errors | Duplicate records inserted, foreign key violations |
| **Design Issue** | Mismatch between UI design and implementation | Button positioned incorrectly relative to spec mockup |
| **Feature Missing** | Specified functionality not implemented | Export to CSV button not present on the Reports page |
| **Functionality (Other)** | Functional defects not covered above | Form submission proceeds without completing required fields |
| **Performance** | System too slow or resource-intensive | API response time exceeds 3 seconds under normal load |
| **Requirement Misunderstanding** | Feature built differently from the intent of the requirement | Filter logic inverted — excludes items that should be included |
| **Security / Access Control** | Unauthorized access or data exposure | Standard users can access admin-only endpoints |
| **User Interface** | Visual or UX defects | Button is not visible on screens < 768px width |

### Real-World Defect Distribution Example (from slides)

A production test cycle analysis across 1,842 weighted defects:

| Defect Type | Fatal | Serious | Medium | Cosmetic | Weighted Total | % |
|-------------|-------|---------|--------|----------|---------------|---|
| Business Logic | 1 | 9 | 332 | 31 | 1,082 | 58.7% |
| Coding Logic | 1 | 2 | 112 | 12 | 368 | 20.0% |
| User Interface | — | — | 30 | 152 | 242 | 13.1% |
| Functionality (Other) | — | 18 | 4 | — | 58 | 3.1% |
| Feature Missing | — | 6 | 4 | 22 | — | 1.2% |
| Performance | — | 2 | 3 | 1 | 20 | 1.1% |
| Coding Standard | — | — | 4 | 12 | — | 0.7% |
| Other | — | 5 | 2 | — | 17 | 0.9% |
| Data / DB Integrity | — | 3 | 9 | — | — | 0.5% |
| Req Misunderstanding | — | 2 | 6 | — | — | 0.3% |
| Design Issue | — | 1 | 3 | — | — | 0.2% |
| Security / Access Control | — | 1 | 3 | — | — | 0.2% |
| **TOTAL** | **2** | **13** | **517** | **206** | **1,842** | **100%** |

**Insights from this distribution:**
- **Business Logic (58.7%)** is the dominant defect category → indicates the need for better requirements review and acceptance criteria
- **Coding Logic (20%)** is second → targeted code reviews and unit testing can reduce this
- **User Interface (13.1%)** is almost entirely Cosmetic → lower business risk but high visibility to end users
- **Root cause prevention strategies identified in the data:**
  - Requirement workshops → reduce Business Logic and Req Misunderstanding defects
  - Code reviews → reduce Coding Logic and Coding Standard defects
  - Prototype/design sign-off → reduce Design Issue and UI defects
  - Coding conventions → reduce Coding Standard defects

### Statistics by Defect Severity

Track defect counts broken down by severity level across the full product:

```
Example Severity Distribution:
  Fatal    :   2  ( 0.1%)  → Must be zero before release
  Serious  :  13  ( 0.7%)  → Require sign-off before release
  Medium   : 517  (28.1%)  → All should be resolved or risk-accepted
  Cosmetic : 206  (11.2%)  → May be deferred with PM approval
  TOTAL    : 738  (40.1%)  → Open at end of test cycle
```

---

## 11. Senior QA Best Practices

### TR-BP-01 — File Every Defect, Regardless of Size

The discipline of logging every defect — even trivial cosmetic issues — builds a complete quality record. Patterns in small defects often reveal systemic problems (e.g., a UI component used in 20 places that is consistently misaligned indicates a broken design system component).

### TR-BP-02 — One Bug Per Report

Each bug report should describe exactly one defect. Filing multiple unrelated defects in a single report makes tracking, assignment, and closure impossible. If two separate bugs happen to occur on the same screen, they get separate reports.

### TR-BP-03 — Verify Reproducibility Before Filing

Before filing a bug report, reproduce the defect **at least twice** from a clean state. A defect that cannot be consistently reproduced wastes developer time and damages QA credibility. Note the reproduction rate if intermittent (e.g., "reproduces 3 out of 5 attempts").

### TR-BP-04 — Always Specify Actual vs. Expected

Every bug report must contain both the **Actual Result** (what happened) and the **Expected Result** (what should have happened, based on the specification). Without the expected result, the developer cannot confirm what the correct behavior should be.

### TR-BP-05 — Attach Evidence

A bug report without evidence is an opinion. Always attach:
- Screenshots (annotated with arrows or highlights if helpful)
- Screen recordings for complex or multi-step reproduction flows
- Log files or console output for backend or API defects
- Network request/response captures (using browser DevTools) for API-level issues

### TR-BP-06 — Separate Priority and Severity Decisions

Never allow developers to override severity assessments. Severity is an objective technical measurement owned by QA. Priority is a scheduling decision owned by the Project Manager or Product Owner. The chain of accountability must be maintained:

```
QA sets Severity → PM/PO sets Priority → Developer estimates and fixes
```

### TR-BP-07 — Use Defect Density for Module Risk Assessment

Defect density = (number of defects) / (size or complexity of module). Modules with high defect density are higher-risk candidates for:
- Additional exploratory testing
- Code review
- Architecture redesign

Track defect density over test cycles to identify chronic problem areas.

### TR-BP-08 — The Test Summary Report Is a Communication Document

The TSR is not a technical document — it is a **business communication tool**. Write the Summary section in plain language that non-technical stakeholders can understand. Lead with the business impact: "The checkout flow has 3 open Critical defects that block release" is more actionable than "3 Fatal defects remain in the payment module."

### TR-BP-09 — Escalate Sneak Paths and Security Defects Immediately

Defects involving unauthorized access, data exposure, or privilege escalation (Security/Access Control type) should **bypass normal priority queues** and be escalated directly to the team lead or security officer, regardless of their assigned severity. Security defects are inherently high-risk even when their functional impact appears limited.

### TR-BP-10 — Use Defect Type Distribution for Root Cause Analysis

After each test cycle, analyze the defect type distribution from the TSR. High proportions in specific categories indicate process gaps:

| High % in Category | Root Cause Signal | Process Improvement |
|-------------------|-------------------|-------------------|
| Business Logic | Requirements unclear or misunderstood | Add requirement review workshops, AC sign-off |
| Coding Logic | Insufficient unit testing | Increase unit test coverage targets |
| Coding Standard | No enforced conventions | Add linting and code review checklist |
| Data / DB Integrity | Missing data validation | Add database constraint review |
| Feature Missing | Scope communication breakdown | Improve sprint planning and definition of done |
| Performance | No performance acceptance criteria | Add performance NFRs to each user story |

---

## Quick Reference Checklists

### Bug Report Checklist (Before Submitting)

```
□ Bug ID assigned (in bug tracking tool, not email)
□ Function name / module specified
□ Problem summary follows: [Objective] + [Actual Result] vs. [Expected Result]
□ Steps to reproduce are numbered and complete
□ Preconditions stated (user role, system state, test data)
□ Expected Result is written (from specification, not assumption)
□ Actual Result is specific (exact error message, incorrect value, behavior)
□ Environment fully specified (OS, browser version, app version, test data)
□ Screenshots or recording attached
□ Severity assigned by QA (Fatal / Serious / Medium / Cosmetic)
□ Bug reproduces at least twice from a clean state
□ Language is professional, factual, and non-judgmental
□ One defect per report (not multiple issues combined)
```

### Test Summary Report Checklist

```
□ Summary section written in plain language (non-technical stakeholders can understand)
□ Test scope and objectives stated
□ Test execution dates and cycle identified
□ Test Case Result table complete (Total / Passed / Failed / Blocked / Skipped / Pass Rate)
□ Defect Report included (total open, by severity, by priority, by status)
□ Defect statistics by function/module included
□ Defect statistics by defect type included
□ Defect statistics by severity included
□ Open Points section lists all unresolved risks, deferred items, and decision items
□ Release recommendation clearly stated (Go / No-Go / Conditional Go with conditions)
```

---
