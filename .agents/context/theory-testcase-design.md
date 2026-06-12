# Test Case Design — Complete Theory Reference

> **Source:** CSC13003 Software Testing — S07: Test Case (Lecture Slides)
> **Maintained by:** Senior QA/QC Reference Document

---

## Table of Contents

1. [What is a Test Case?](#1-what-is-a-test-case)
2. [Why Write Test Cases?](#2-why-write-test-cases)
3. [Test Case Essentials — Fields](#3-test-case-essentials--fields)
4. [Test Case Objective / Title](#4-test-case-objective--title)
5. [Validation Point (Expected Result)](#5-validation-point-expected-result)
6. [Test Case Template](#6-test-case-template)
7. [What Makes a Good Test Case?](#7-what-makes-a-good-test-case)
8. [Test Design Technique 1 — Equivalence Partitioning (EP)](#8-test-design-technique-1--equivalence-partitioning-ep)
9. [Test Design Technique 2 — Boundary Value Analysis (BVA)](#9-test-design-technique-2--boundary-value-analysis-bva)
10. [Test Design Technique 3 — Decision Table Testing](#10-test-design-technique-3--decision-table-testing)
11. [Test Design Technique 4 — State Transition Testing](#11-test-design-technique-4--state-transition-testing)
12. [Combining Techniques](#12-combining-techniques)
13. [Senior QA Best Practices](#13-senior-qa-best-practices)

---

## 1. What is a Test Case?

A **test case** is a formal, documented artifact that defines exactly what to test and how to interpret the result.

### Definitions

| Source | Definition |
|--------|-----------|
| **Kaner, Faulk & Nguyen** *(Testing Computer Software)* | "A test that (ideally) executes a single well-defined test objective." |
| **IEEE 729-1983** | "A specific set of test data and associated procedures developed for a particular objective." |

### Key Characteristics

- Focuses on **one objective at a time** — each test case should be atomic enough that a failure points clearly to a single failure mode.
- Contains **both inputs and expected outputs** — the expected result must be defined *before* execution to avoid observer bias.
- Is **formally documented** — ad-hoc testing without documentation is not a test case.

---

## 2. Why Write Test Cases?

| Reason | Explanation |
|--------|-------------|
| **Accountability** | Establishes a clear record of what was tested, when, and by whom. |
| **Reproducibility** | Anyone can re-execute the same test under the same conditions and compare results. |
| **Tracking** | Enables measurement of test progress, pass/fail rates, and defect correlation. |
| **Automation** | Written test cases are the prerequisite for converting manual tests to automated scripts. |
| **To find bugs** | The primary purpose — structured test cases are more effective at revealing defects than unstructured testing. |
| **To verify correct execution** | Ensures that the tester is actually testing the right thing in the right way. |
| **To measure test coverage** | Coverage metrics (feature, requirement, code) require traceable, documented tests. |

---

## 3. Test Case Essentials — Fields

Every test case record should contain the following fields. The *criticality* column reflects professional priority in practice.

| Field | Description | Criticality |
|-------|-------------|-------------|
| **Test Case ID** | Unique identifier (e.g., `TC-LOGIN-001`) | Required |
| **Test Case Title / Objective** | One-line summary of what is being tested | Required |
| **Test Case Description** | Detailed narrative of the test purpose | Required |
| **Steps** | Numbered, sequential actions to perform | Required |
| **Test Data** | Specific inputs: input values, defaults, output values | Required |
| **Expected Result** | Precisely defined outcome if the system behaves correctly | Required |
| **Observed Result** | Actual outcome recorded during execution | Required |
| **Status** | Pass / Fail / Blocked / Skipped | Required |
| **Test Environment** | OS, browser, version, configuration used | Required |
| **Script** | Automation script reference (if applicable) | Optional |
| **Bug ID** | Reference to a defect report if the test fails | Optional |
| **Tracking Information** | Sprint, version, release, test cycle | Optional |
| **Comments** | Notes, assumptions, or special execution conditions | Optional |

---

## 4. Test Case Objective / Title

### Why It Matters

The **Objective/Title** is the single most important field in a test case.

- Gives the reader an immediate understanding of the test's purpose and scope.
- A clear, well-named test makes **reviews significantly easier** — reviewers can spot gaps in coverage at a glance.
- Enables the test to be **handed off** to another tester or an automation engineer without additional explanation.
- In many lightweight testing environments, the title may be the **only documented part** of a test case — making it all the more critical that it is precise and self-contained.

### Title Syntax

Use the following pattern:

```
Action + Function + Operating Condition
```

| Part | Examples |
|------|---------|
| **Action** | Verify, Test, Validate, Execute, Run, Print, Confirm, Check |
| **Function** | the login form, the checkout total, the password reset flow, the age validation |
| **Operating Condition** | with valid credentials, with an expired token, when quantity is 0, with a null input |

### Title Examples

| ❌ Weak Title | ✅ Strong Title |
|--------------|----------------|
| Test login | Verify that login succeeds with valid email and correct password |
| Check error | Verify that an error message is displayed when the quantity field receives a negative value |
| Test discount | Validate that a 10% discount is applied when promo code `SAVE10` is entered at checkout |

---

## 5. Validation Point (Expected Result)

### Definition

The **Validation Point** is the specific, observable behavior, result, or system state that the test case is designed to confirm. It is essentially the **expected result** written as a testable assertion.

### Rules for Writing Validation Points

1. **Write it as a step** — the validation point should appear as an explicit final step in the test procedure, not as an afterthought.
2. **Be specific and measurable** — avoid vague language like "should work" or "should be correct."
3. **State what will be validated precisely** — define the exact behavior, value, message, or state change expected.

### Examples

| ❌ Vague Validation Point | ✅ Precise Validation Point |
|--------------------------|----------------------------|
| The system should respond | HTTP 200 OK is returned with a JSON body containing `{ "status": "success" }` |
| An error should appear | The error message "Quantity must be at least 1" is displayed below the quantity field in red |
| The discount is applied | The order total shown on the checkout summary is reduced by exactly 10% of the subtotal |

---

## 6. Test Case Template

The following is the standard test case template derived from the course slides:

```
Test Case ID    : TC-[MODULE]-[###]
Title           : [Action] + [Function] + [Operating Condition]
Description     : Brief explanation of what is being tested and why
Priority        : High / Medium / Low
Pre-conditions  : System state required before the test begins
                  (e.g., User must be logged in, cart must be non-empty)

Steps:
  Step 1. [Action]
  Step 2. [Action]
  Step 3. [Action]
  ...
  Step N. [Validation Point — observe/confirm the expected result]

Test Data:
  Input  : [Exact input values]
  Output : [Expected output values]
  Default: [Default/initial values if applicable]

Expected Result : [Precise description of the correct system behavior]
Observed Result : [Filled during execution]
Status          : Pass / Fail / Blocked / Skipped

Test Environment:
  OS      : [e.g., macOS 14 / Windows 11]
  Browser : [e.g., Chrome 124 / Firefox 115]
  Version : [App version / build number]

Bug ID    : [e.g., BUG-042, if test fails]
Script    : [Automation script path or reference, if applicable]
Comments  : [Any notes, assumptions, or execution conditions]
```

---

## 7. What Makes a Good Test Case?

A high-quality test case satisfies the following **7 criteria** (from the slides):

| Criterion | Meaning |
|-----------|---------|
| **Accurate** | Tests exactly what it was designed to test — no scope creep, no ambiguity. |
| **Economical** | Contains no unnecessary steps. Every step contributes to reaching the validation point. |
| **Repeatable / Reusable** | Can be executed any number of times, by any tester, and produce the same results under the same conditions. |
| **Traceable** | Linked to at least one specific requirement, user story, or acceptance criterion. |
| **Appropriate** | Suitable for the target test environment — does not depend on configurations or data unavailable in that environment. |
| **Self-standing** | Can be understood and executed independently of its author — no tribal knowledge required. |
| **Self-cleaning** | Restores the system to a clean, neutral state after execution (e.g., deletes test data, reverses state changes). |

> **Senior QA Note:** A test case that fails "Self-standing" is a maintenance liability. If only the original author can execute it, it cannot be automated, handed off, or run in a CI/CD pipeline.

---

## 8. Test Design Technique 1 — Equivalence Partitioning (EP)

### What Is It?

**Equivalence Partitioning (EP)** is a black-box test design technique that divides the input domain into groups (partitions / equivalence classes) where every value within a group is expected to be processed identically by the system.

The core insight: if the system handles value `A` the same way as value `B`, testing both provides no additional defect-detection value. Testing one representative per partition is sufficient.

### Two Types of Equivalence Classes

| Type | Description | Example (field: age 18–65) |
|------|-------------|---------------------------|
| **Valid** | Inputs the system should accept and process normally | `18 ≤ age ≤ 65` |
| **Invalid** | Inputs the system should reject (error, warning, or block) | `age < 18`, `age > 65`, `age is not a number` |

### 4-Step Process

```
STEP 1 → Identify all input and output variables
STEP 2 → Identify equivalence classes for each variable (valid + invalid)
STEP 3 → Select one representative test case per equivalence class
STEP 4 → Apply Boundary Value Analysis for ordered/numeric classes
```

### Guidelines for Identifying Equivalence Classes

#### Guideline 1 — Input Specifies a Range
**Rule:** 1 valid class + 2 invalid classes (one below, one above)

| Spec: "Item count: 1–999" | Class | Type |
|--------------------------|-------|------|
| `1 ≤ count ≤ 999` | EC1 | Valid |
| `count < 1` | EC2 | Invalid |
| `count > 999` | EC3 | Invalid |

#### Guideline 2 — Input Specifies a Set of Discrete Values
**Rule:** 1 valid class per valid value + 1 combined invalid class

| Spec: "Vehicle type: BUS, TRUCK, TAXI, PASSENGER, MOTORCYCLE" | Class | Type |
|---------------------------------------------------------------|-------|------|
| BUS | EC1 | Valid |
| TRUCK | EC2 | Valid |
| TAXI | EC3 | Valid |
| PASSENGER | EC4 | Valid |
| MOTORCYCLE | EC5 | Valid |
| Any other value (e.g., TRAILER) | EC6 | Invalid |

#### Guideline 3 — Input Specifies a "Must Be" Condition
**Rule:** 1 valid class + 1 invalid class

| Spec: "First character must be a letter" | Class | Type |
|------------------------------------------|-------|------|
| First character IS a letter | EC1 | Valid |
| First character is NOT a letter | EC2 | Invalid |

#### Guideline 4 — Split When Elements Are Not Handled Identically
If there is reason to believe that values within a single equivalence class produce **different system behaviors**, split that class into smaller, more precise classes.

> **Rule:** When in doubt, split. Never merge classes that may trigger different code paths.

### Selecting Test Cases from Equivalence Classes

| Class Type | Selection Rule |
|-----------|----------------|
| **Valid classes** | Combine as many valid classes as possible into a single test case (maximize coverage per TC) |
| **Invalid classes** | Each invalid class gets its **own dedicated test case** — never combine two invalid conditions |

> **Why isolate invalid classes?** If a test has two invalid inputs and fails, you cannot determine which invalid condition caused the failure.

### Worked Example — Adding Two Integers (A, B ∈ [–99, 99])

#### Equivalence Class Table

| ID | Variable | Class | Type |
|----|----------|-------|------|
| EC1 | A | –99 ≤ A ≤ 99 | Valid |
| EC2 | A | A < –99 | Invalid |
| EC3 | A | A > 99 | Invalid |
| EC4 | A | A is not an integer | Invalid |
| EC5 | B | –99 ≤ B ≤ 99 | Valid |
| EC6 | B | B < –99 | Invalid |
| EC7 | B | B > 99 | Invalid |
| EC8 | B | B is not an integer | Invalid |
| EC9 | SUM | = A + B | Valid Output |
| EC10 | SUM | Error message | Invalid Output |

#### Minimum Test Case Set

| TC | Classes Covered | Input A | Input B | Expected Output |
|----|----------------|---------|---------|----------------|
| TC1 | EC1, EC5, EC9 | 10 | 9 | 19 |
| TC2 | EC2, EC10 | –102 | 9 | Invalid Input |
| TC3 | EC3, EC10 | 102 | 9 | Invalid Input |
| TC4 | EC4, EC10 | "abc" | 9 | Invalid Input |
| TC5 | EC6, EC10 | 10 | –200 | Invalid Input |
| TC6 | EC7, EC10 | 10 | 200 | Invalid Input |
| TC7 | EC8, EC10 | 10 | 1.25 | Invalid Input |

---

## 9. Test Design Technique 2 — Boundary Value Analysis (BVA)

### What Is It?

**Boundary Value Analysis (BVA)** is a refinement of Equivalence Partitioning that focuses test cases on the **edges (boundaries) between equivalence classes**, where defect probability is highest.

### Why Boundaries Have Highest Defect Probability

Programs most commonly fail at boundaries due to two categories of errors:

| Error Type | Example | How BVA Detects It |
|-----------|---------|-------------------|
| **Inequality mis-specification** | Developer writes `<` instead of `≤` (off-by-one) | A test at the exact boundary catches this; an interior test does not |
| **Boundary value typo** | Developer writes `INPUT < 52` instead of `INPUT < 25` | Boundary test value exposes the incorrect cutoff |

### Standard Boundary Test Points

For a valid range **[LB, UB]** (Lower Bound to Upper Bound), the following test points should be considered:

```
         LB-1  LB  LB+1        UB-1  UB  UB+1
    ——•————•———•————•——— ... ———•————•———•————•——→
    min                                         max
```

| Point | Name | Class |
|-------|------|-------|
| `LB – 1` | Just below lower boundary | **Invalid** |
| `LB` | Exact lower boundary | **Valid** |
| `LB + 1` | Just inside lower boundary | **Valid** |
| Interior | Arbitrary mid-range value | Valid |
| `UB – 1` | Just inside upper boundary | **Valid** |
| `UB` | Exact upper boundary | **Valid** |
| `UB + 1` | Just above upper boundary | **Invalid** |
| `Min possible` | System/UI minimum | Depends on constraint |
| `Max possible` | System/UI maximum | Depends on constraint |

> **Practice note:** The most commonly applied set is the **6-point BVA**: LB–1, LB, LB+1, UB–1, UB, UB+1.

### BVA Example — Age Field [18, 65]

| TC | Input | Expected Result | Rationale |
|----|-------|----------------|-----------|
| BVA-1 | 17 | Error: Age too young | LB – 1 (invalid) |
| BVA-2 | 18 | Accepted | LB (exact lower boundary) |
| BVA-3 | 19 | Accepted | LB + 1 (just inside) |
| BVA-4 | 64 | Accepted | UB – 1 (just inside) |
| BVA-5 | 65 | Accepted | UB (exact upper boundary) |
| BVA-6 | 66 | Error: Age too old | UB + 1 (invalid) |

### Boundary Types to Test

| Boundary Type | Defined By | Example |
|---------------|------------|---------|
| **Specification boundary** | Requirements / product owner | Age ≥ 18 |
| **System/UI boundary** | Developer / UI constraint | Text field max length = 4 digits |
| **Database boundary** | Infrastructure / schema | `TINYINT` max = 255 |

> **Critical insight:** A common defect pattern — spec says max = 100, UI allows 999, DB truncates at 3 digits. Testing only the spec boundary misses real production bugs.

---

## 10. Test Design Technique 3 — Decision Table Testing

### What Is It?

**Decision Table Testing** is a black-box technique used when the system's behavior depends on **combinations of multiple conditions**. It systematically enumerates all possible condition combinations and maps them to their corresponding actions/outputs.

### When to Use It

- The specification defines behavior based on multiple simultaneous conditions (logical AND / OR rules)
- Different combinations of conditions lead to different outputs
- Business rules are complex and combinations are non-trivial

### Structure of a Decision Table

```
                 │ R1 │ R2 │ R3 │ R4 │  ← Rules (columns)
─────────────────┼────┼────┼────┼────┤
CONDITIONS       │    │    │    │    │
  Condition 1    │  T │  T │  F │  F │
  Condition 2    │  T │  F │  T │  F │
─────────────────┼────┼────┼────┼────┤
ACTIONS          │    │    │    │    │
  Action 1       │  X │    │    │  X │
  Action 2       │    │  X │  X │    │
```

- **Conditions:** Boolean inputs or states (True/False, Yes/No, ≥/< threshold)
- **Actions:** Outputs or behaviors triggered by a combination of conditions
- **Rules:** Each column represents one unique combination of condition values → action

### Number of Rules

For `n` binary conditions: **maximum 2ⁿ rules**

| Conditions | Max Rules |
|-----------|-----------|
| 2 | 4 |
| 3 | 8 |
| 4 | 16 |

Rules may be **collapsed** when multiple condition combinations lead to the same action (don't-care conditions, marked with `–`).

### Worked Example — E-commerce Discount

**Spec:** Apply a discount if: (a) user is a premium member AND (b) cart total ≥ $100. Otherwise, show a prompt to upgrade or increase order.

| | R1 | R2 | R3 | R4 |
|--|----|----|----|----|
| **Premium Member** | T | T | F | F |
| **Cart ≥ $100** | T | F | T | F |
| **Apply 15% Discount** | X | | | |
| **Show "Increase Order" prompt** | | X | | |
| **Show "Upgrade to Premium" prompt** | | | X | X |

**Test cases derived:** One test case per column (rule) = 4 test cases for full decision table coverage.

### Strengths and Weaknesses

| Strengths | Weaknesses |
|-----------|-----------|
| Ensures all condition combinations are considered | Table size grows exponentially with condition count |
| Directly traceable to business rules | Requires well-defined, complete specifications |
| Reveals missing/conflicting rules in the spec | Not suitable for range-based or sequential conditions alone |

---

## 11. Test Design Technique 4 — State Transition Testing

### What Is It?

**State Transition Testing** is a black-box technique used when a system's behavior depends on its **current state** and the **transitions** between states triggered by events or inputs.

### Core Concepts

| Term | Definition |
|------|-----------|
| **State** | A stable condition or mode the system is in (e.g., Logged Out, Logged In, Session Expired) |
| **Transition** | A change from one state to another, triggered by an event or action |
| **Event / Input** | What triggers the transition (e.g., user submits login form, timer expires) |
| **Guard Condition** | A prerequisite that must be true for a transition to occur |
| **Action / Output** | What the system does when a transition fires |

### State Transition Diagram (STD)

A visual representation where:
- **Nodes** = States
- **Arrows** = Transitions
- **Labels on arrows** = `Event [Guard] / Action`

```
          ┌──────────────┐
          │  Logged Out  │◄────────────────────────────┐
          └──────┬───────┘                             │
                 │ Enter valid credentials              │ Click Logout
                 ▼                                     │
          ┌──────────────┐      Timer expires    ┌─────┴────────┐
          │  Logged In   │──────────────────────►│   Session    │
          │              │                        │   Expired    │
          └──────────────┘                        └──────────────┘
```

### State Transition Table

A tabular equivalent of the STD — each row is a current state, each column is an event:

| Current State | Event: Valid Login | Event: Invalid Login | Event: Logout | Event: Timer Expires |
|--------------|-------------------|---------------------|---------------|---------------------|
| Logged Out | → Logged In | Stay Logged Out (show error) | — | — |
| Logged In | — | — | → Logged Out | → Session Expired |
| Session Expired | → Logged In | Stay Session Expired (show error) | → Logged Out | — |

### Coverage Criteria

| Level | Description |
|-------|-------------|
| **0-switch (State coverage)** | Visit every state at least once |
| **1-switch (Transition coverage)** | Exercise every valid transition at least once |
| **2-switch** | Exercise every sequence of two consecutive transitions |
| **Sneak path testing** | Test invalid transitions — verify the system correctly blocks illegal state changes |

> **Best practice:** Minimum acceptable coverage in professional QA is **1-switch (all valid transitions)**. For safety-critical systems, 2-switch or higher is required.

### Worked Example — User Account States

**States:** `Unverified` → `Active` → `Suspended` → `Closed`

| Transition | Event | Guard | Expected Action |
|-----------|-------|-------|----------------|
| Unverified → Active | Email confirmed | Link not expired | Activate account, show welcome message |
| Active → Suspended | Admin action | Account violates ToS | Block login, send notification email |
| Suspended → Active | Admin lifts suspension | — | Restore login access |
| Suspended → Closed | Admin closes account | — | Delete user data, send closure email |
| Active → Closed | User requests deletion | — | Initiate 30-day grace period |

**Test cases to cover all transitions:**

| TC | Current State | Action | Expected New State |
|----|--------------|--------|-------------------|
| TC-ST-01 | Unverified | Confirm email | Active |
| TC-ST-02 | Active | Admin suspends | Suspended |
| TC-ST-03 | Suspended | Admin lifts | Active |
| TC-ST-04 | Suspended | Admin closes | Closed |
| TC-ST-05 | Active | User requests deletion | Closing (grace period) |
| TC-ST-06 | Suspended | Attempt login | Blocked (stay Suspended) |

### Strengths and Weaknesses

| Strengths | Weaknesses |
|-----------|-----------|
| Essential for event-driven and workflow-based systems | State explosion problem with complex systems (many states × events) |
| Reveals missing transitions and invalid state paths | Requires a well-defined, complete state model |
| Tests the sequencing and ordering of operations | Difficult to apply when states are implicit or undocumented |

---

## 12. Combining Techniques

No single technique covers all defect types. Use them together:

| When you have… | Use… |
|---------------|------|
| Numeric/ordered input ranges | **EP + BVA** |
| Multiple conditions combining to produce different outcomes | **Decision Table Testing** |
| System with distinct modes/phases/statuses | **State Transition Testing** |
| Many variables interacting | **Pairwise / Combinatorial Testing** |
| Suspected edge cases in non-boundary interior regions | **Exploratory Testing** |

### Recommended Test Design Workflow

```
1. READ the specification thoroughly
2. IDENTIFY input/output variables → Apply EP (classify all valid/invalid classes)
3. APPLY BVA on every ordered/numeric class
4. CHECK for multi-condition rules → Build a Decision Table if needed
5. CHECK for system states/workflows → Build an STD/STT if needed
6. WRITE test cases — one per equivalence class (invalid), grouped for valid
7. REVIEW titles — every title must follow: Action + Function + Condition
8. VERIFY coverage — trace every requirement to at least one test case
```

---

## 13. Senior QA Best Practices

### TC-BP-01 — Titles Are Non-Negotiable

A test case with a vague title is nearly worthless in a professional environment. Always write: `Verify that [function] [does expected thing] when [specific condition]`.

### TC-BP-02 — Define Expected Result Before Execution

Never run a test without having the expected result written down first. Defining it *after* seeing the actual result introduces confirmation bias and renders the test invalid.

### TC-BP-03 — Isolate Each Invalid Condition

Each invalid equivalence class must have its own dedicated test case. Combining two invalid inputs into one test makes failure analysis ambiguous and root cause identification impossible.

### TC-BP-04 — Self-Cleaning Tests Are Production-Grade Tests

Every test that creates data must clean it up. Tests that leave side effects corrupt shared test environments and cause false positives or false negatives in subsequent runs.

### TC-BP-05 — Trace Everything to Requirements

Every test case must reference the requirement, user story, or acceptance criterion it validates. Without traceability, you cannot measure coverage and cannot demonstrate compliance in audits or reviews.

### TC-BP-06 — Use Risk to Prioritize Depth

| Risk Level | EP Depth | BVA Depth | Decision Table | State Testing |
|-----------|---------|-----------|---------------|--------------|
| **High** (financial, security, access) | All classes | Full 6-point BVA | Full table | All transitions + sneak paths |
| **Medium** (validation, format) | All classes | 4-point BVA (LB, LB+1, UB–1, UB) | Key rules | Valid transitions only |
| **Low** (display, non-critical UI) | 1 valid + 1 invalid | Representative only | N/A | Happy path only |

### TC-BP-07 — BVA Targets Three Boundary Levels

Always test: (1) **Specification boundaries** (what the spec says), (2) **UI/system boundaries** (what the interface physically allows), and (3) **Database boundaries** (schema-level constraints). All three can diverge and all three can hide defects.

### TC-BP-08 — Decision Tables Expose Specification Gaps

When building a decision table and you discover a rule combination with no defined action, that is a **specification defect** — not a test gap. Raise it immediately before writing test cases.

### TC-BP-09 — State Tests Must Include Negative Transitions

For state transition testing, always include at least one **sneak path test** per state: attempt a transition that should NOT be allowed and verify the system correctly blocks it and remains in the correct state.

### TC-BP-10 — Automate Boundary Tests First

BVA tests are deterministic, parameterizable, and high-value. They are the best first candidates for regression automation. Parameterize boundary values so spec changes require only data updates, not test logic changes.

---

## Quick Reference Checklist

```
BEFORE WRITING TEST CASES:
□ Have I read and fully understood the specification?
□ Have I identified ALL input variables AND all output variables?
□ Have I applied EP — identified at least 1 valid + all applicable invalid classes per variable?
□ Have I followed all 4 EP guidelines (range, set, must-be, split)?
□ Have I applied BVA to all ordered/numeric fields?
□ Do I need a Decision Table? (multiple conditions → different outputs)
□ Do I need a State Transition Table? (system has distinct states/workflows)

WHEN WRITING EACH TEST CASE:
□ Title follows: Action + Function + Operating Condition
□ Each invalid class has its own dedicated test case
□ Valid classes are combined efficiently into minimum test cases
□ Expected result is written precisely before execution
□ Test case is self-standing — no tribal knowledge required
□ Test case is self-cleaning — leaves no side effects

AFTER WRITING TEST CASES:
□ Every test case is traced to at least one requirement
□ All equivalence classes are covered by at least one test case
□ BVA points (LB–1, LB, LB+1, UB–1, UB, UB+1) are all represented for high-risk fields
□ Decision table has one test case per rule (column)
□ State transition table has coverage of all valid transitions
□ Sneak path / invalid transition tests are included
```

---
