# Domain Testing — Complete Theory Reference

---

## Table of Contents
1. [What is Domain Testing?](#1-what-is-domain-testing)
2. [Core Concepts & Definitions](#2-core-concepts--definitions)
3. [General Approach — 4 Steps](#3-general-approach--4-steps)
4. [Step 1 — Identify Input & Output Variables](#4-step-1--identify-input--output-variables)
5. [Step 2 — Identify Equivalence Classes](#5-step-2--identify-equivalence-classes)
6. [Guidelines for Identifying Equivalence Classes](#6-guidelines-for-identifying-equivalence-classes)
7. [Step 3 — Selecting Test Cases](#7-step-3--selecting-test-cases)
8. [Step 4 — Boundary Value Analysis (BVA)](#8-step-4--boundary-value-analysis-bva)
9. [Strengths and Weaknesses](#9-strengths-and-weaknesses)
10. [Worked Examples (from Slides)](#10-worked-examples-from-slides)
11. [Senior QA Best Practices — 5+ Years in Domain Testing](#11-senior-qa-best-practices--5-years-in-domain-testing)

---

## 1. What is Domain Testing?

**Domain Testing** is a black-box test design technique also known by the following aliases:
- **Equivalence Partitioning**
- **Equivalence Analysis**
- **Boundary Analysis**

### Fundamental Problem It Solves
There are too many possible input values for any software system to test exhaustively. Domain Testing addresses this by applying a **stratified sampling strategy** — a principled method to select a small but representative set of test cases from a huge population of possible inputs.

### Core Principle
> *"In domain testing, we partition a domain into sub-domains (equivalence classes) and then test using values from each sub-domain."*

**In plain terms:**
- The **domain** = the full set of all possible input values for a variable.
- A **sub-domain (equivalence class)** = a subset of the domain where all values are expected to produce the same program behavior (same outcome/result).
- Instead of testing every single value, you pick **one representative value** from each sub-domain.

---

## 2. Core Concepts & Definitions

| Term | Definition |
|------|-----------|
| **Domain** | The complete set of all possible values for an input or output variable |
| **Sub-domain / Equivalence Class** | A partition of the domain where all elements are expected to be handled identically by the program |
| **Valid Equivalence Class** | A sub-domain representing **valid/acceptable** inputs that the program should process normally |
| **Invalid Equivalence Class** | A sub-domain representing **invalid/unacceptable** inputs that the program should reject (e.g., error message) |
| **Boundary Value** | A value that sits exactly at the edge (border) between two equivalence classes |
| **Best Representative** | The single test value chosen from a sub-domain that is most likely to expose errors — typically a boundary value for ordered/numeric fields |
| **Redundant Testing** | Executing multiple test cases that all fall within the same equivalence class — produces no additional information |

### The Equivalence Assumption
Two test cases belong to the **same equivalence class** if the **expected result** of each is identical. Running many tests in the same equivalence class is, by definition, **redundant** — they provide no additional defect-detection value over running a single representative.

---

## 3. General Approach — 4 Steps

```
STEP 1 → Identify Input & Output variables
STEP 2 → Identify Equivalence Classes for each variable
STEP 3 → Select the best representative test case for each class
STEP 4 → Use Boundary Values as the best representatives for ordered fields
```

---

## 4. Step 1 — Identify Input & Output Variables

**Source:** The program/system specification (requirements document, user story, SRS, etc.)

### What to identify:
- Every **input** the program accepts (from user, file, API, database, etc.)
- Every **output** the program produces (computed values, messages, status codes, etc.)

### Simple Example: A Program That Adds Two Numbers
| Category | Variables |
|----------|-----------|
| **Input** | Number A |
| **Input** | Number B |
| **Output** | SUM (A + B) |
| **Output** | Error message ("Invalid Input") |

> **Key insight:** Outputs are also partitioned — valid outputs (the computed result) and invalid outputs (error messages) both represent expected behaviors that need to be tested.

---

## 5. Step 2 — Identify Equivalence Classes

### Definition Reminder
An equivalence class is a subset of values where every element is handled **identically** by the program. If any element in the class passes, all elements in the class are assumed to pass. If any element fails, all elements in the class are assumed to fail.

### Two Types of Equivalence Classes

#### A. Valid Equivalence Classes
- Represent **acceptable, in-specification** inputs
- The program should process these normally and produce a correct output
- Example: For a field accepting integers –99 to 99 → Valid class is `-99 ≤ X ≤ 99`

#### B. Invalid Equivalence Classes
- Represent **unacceptable, out-of-specification** inputs
- The program should reject these and produce an appropriate error
- Example: For the same field → Invalid classes are `X < -99` and `X > 99`

### Important Characteristics
- Identifying equivalence classes is a **heuristic process** — it requires judgment, not a formula
- Classes must be **mutually exclusive** (no overlap between partitions)
- Classes must be **collectively exhaustive** (cover the entire domain)
- Each class represents a **specific risk** that the program may handle incorrectly

---

## 6. Guidelines for Identifying Equivalence Classes

These four guidelines cover the most common input condition scenarios:

---

### Guideline 1 — Input Specifies a Range of Values
**Situation:** The spec defines a numeric or ordered range (e.g., "value must be between X and Y")

**Example:** *"The item count can be from 1 to 999"*

| Class Type | Equivalence Class | Count |
|-----------|-------------------|-------|
| Valid | `1 ≤ count ≤ 999` | 1 |
| Invalid | `count < 1` | 1 |
| Invalid | `count > 999` | 1 |

**Rule: 1 valid class + 2 invalid classes (one below, one above the range)**

---

### Guideline 2 — Input Specifies a Set of Discrete Values (Handled Differently)
**Situation:** The spec defines a finite set of allowed values where each value triggers different program behavior

**Example:** *"Type of vehicle must be: BUS, TRUCK, TAXI-CAB, PASSENGER, or MOTORCYCLE"*

| Class Type | Equivalence Class | Count |
|-----------|-------------------|-------|
| Valid | BUS | 1 |
| Valid | TRUCK | 1 |
| Valid | TAXI-CAB | 1 |
| Valid | PASSENGER | 1 |
| Valid | MOTORCYCLE | 1 |
| Invalid | TRAILER (or any non-listed value) | 1 |

**Rule: 1 valid class per valid value + 1 combined invalid class**

---

### Guideline 3 — Input Specifies a "Must Be" Condition
**Situation:** The spec requires a specific type or property for an input

**Example:** *"First character of the identifier must be a letter"*

| Class Type | Equivalence Class |
|-----------|-------------------|
| Valid | First character IS a letter |
| Invalid | First character is NOT a letter |

**Rule: 1 valid class + 1 invalid class**

---

### Guideline 4 — Split When Elements Are Not Handled Identically
**Situation:** There is reason to believe that elements within a proposed equivalence class are NOT all handled the same way by the program

**Action:** Split that equivalence class into two or more smaller equivalence classes

**Example:** If an initial class "non-alphanumeric characters" is suspected to be handled differently for special characters vs. control characters, split it into separate classes.

**Rule: When in doubt, split — never merge classes that may have different behaviors**

---

## 7. Step 3 — Selecting Test Cases

### Selection Strategy
The goal is to achieve **maximum coverage with minimum test cases**.

#### For Valid Equivalence Classes:
- Design test cases that **cover as many valid equivalence classes as possible simultaneously**
- A single test case can cover multiple valid classes at once (because all inputs in one test must be valid together)
- Continue until **all valid classes** have been covered by at least one test case

#### For Invalid Equivalence Classes:
- Design test cases so that **each test covers exactly one invalid class**
- Never combine multiple invalid conditions in one test case
- Reason: If a test has two invalid inputs and fails, you cannot determine **which** invalid condition caused the failure
- Continue until **all invalid classes** have been covered by at least one test case

### Minimum Test Case Count
```
Minimum TCs = max(# valid classes combined into TCs) + (# invalid classes × 1)
```
One test can satisfy multiple valid classes, but each invalid class needs its own dedicated test.

---

## 8. Step 4 — Boundary Value Analysis (BVA)

### Why Boundaries Matter
Programs are **more likely to fail at a boundary** than at arbitrary interior values. There are two primary error types that BVA targets:

| Error Type | Description | Detection |
|-----------|-------------|-----------|
| **Inequality mis-specification** | Developer writes `≤` instead of `<` (off-by-one in condition) | Detectable **only** at the boundary — an interior value would pass regardless |
| **Boundary value mistyped** | Developer writes `INPUT < 52` (transposition) instead of `INPUT < 25` | Detectable at the boundary value AND any other value incorrectly handled |

### Boundary vs. Non-Boundary — Why Boundary Wins
**Example program logic:**
```
INPUT < 10   → Error message
10 ≤ INPUT < 25 → Print "hello"
INPUT ≥ 25   → Error message
```

- **Testing at boundary (value = 25):** Catches BOTH error types above
- **Testing at non-boundary (value = 53):** May catch NEITHER error type

**Conclusion:** Boundary values have the **highest defect-detection probability** per test executed.

---

### The 9 Boundary Test Points Per Partition

For each equivalence class with a defined lower bound (LB) and upper bound (UB), up to **9 test cases** can be derived:

```
                  LB              UB
   ←————|————|————|————————————|————|————|————→
        8*  4  LB-1  LB  LB+1  UB-1  UB  UB+1  6    9*

  #  | Point        | Description
  ---|--------------|-------------------------------------------
  1  | Interior     | Arbitrary value well inside the partition
  2  | LB+1         | One step inside lower boundary (valid)
  3  | LB           | Exact lower boundary
  4  | LB-1         | One step below lower boundary (invalid)
  5  | UB+1         | One step above upper boundary (invalid)
  6  | Far invalid  | A value well outside the upper boundary
  7  | UB-1         | One step inside upper boundary (valid)
  8* | Min Possible | Smallest value the UI/system will physically accept
  9* | Max Possible | Largest value the UI/system will physically accept
```

> **Note:** Points 8* and 9* represent the smallest/largest possible values allowed via the UI (system constraints), which may differ from specification boundaries.

In practice, the most commonly used boundary points are:
- **LB** (lower boundary exact)
- **LB+1** (just inside)
- **LB-1** (just outside, into adjacent invalid class)
- **UB** (upper boundary exact)
- **UB-1** (just inside)
- **UB+1** (just outside, into adjacent invalid class)

---

## 9. Strengths and Weaknesses

### Strengths
| Strength | Detail |
|----------|--------|
| **High defect-detection efficiency** | Finds highest-probability errors with a relatively small, well-chosen set of tests |
| **Intuitively clear** | Easy to teach, learn, and explain to stakeholders — the approach is logical and traceable |
| **Scales to multi-variable systems** | Extends naturally to programs with multiple input variables by combining per-variable partitions |
| **Documentation value** | The equivalence class table provides clear traceability from requirements to test cases |

### Weaknesses / Blind Spots
| Weakness | Detail |
|----------|--------|
| **Interior errors missed** | Defects that occur for non-boundary interior values within a class may go undetected |
| **Unknown actual domains** | The real internal program domains may differ from the specified ones; partitions are based on specs, not implementation |
| **Interaction effects not covered** | Standard equivalence partitioning tests variables largely independently; complex variable interactions require combinatorial techniques |
| **Heuristic dependence** | The quality of the test suite depends heavily on the tester's skill in identifying meaningful partitions |

---

## 10. Worked Examples (from Slides)

### Example 1 — Adding Two Integers (A, B), Each –99 to 99

#### Complete Partition Table

| ID | Input/Output | Equivalence Class |
|----|-------------|-------------------|
| EC1 | A | –99 ≤ A ≤ 99 (valid) |
| EC2 | A | A < –99 (invalid) |
| EC3 | A | A > 99 (invalid) |
| EC4 | A | A is not an integer (invalid) |
| EC5 | B | –99 ≤ B ≤ 99 (valid) |
| EC6 | B | B < –99 (invalid) |
| EC7 | B | B > 99 (invalid) |
| EC8 | B | B is not an integer (invalid) |
| EC9 | SUM | = A + B (valid output) |
| EC10 | SUM | Error Message (invalid output) |

#### Minimum Test Case Set

| #TC | Partitions Covered | Input A | Input B | Expected Output |
|-----|--------------------|---------|---------|-----------------|
| TC1 | EC1, EC5, EC9 | 10 | 9 | 19 |
| TC2 | EC2, EC10 | –102 | 9 | Invalid Input |
| TC3 | EC3 | 102 | 9 | Invalid Input |
| TC4 | EC4 | Abc | 9 | Invalid Input |
| TC5 | EC6 | 10 | –200 | Invalid Input |
| TC6 | EC7 | 10 | 200 | Invalid Input |
| TC7 | EC8 | 10 | 1.25 | Invalid Input |

#### Boundary Value Test Cases

| #TC | Partition | Input A | Input B | Expected Output |
|-----|-----------|---------|---------|-----------------|
| TC1 | A < –99 | –100 | 9 | Invalid Input |
| TC2 | –99 ≤ A ≤ 99 | –99 | 9 | –90 |
| TC3 | –99 ≤ A ≤ 99 | –98 | 9 | –89 |
| TC4 | –99 ≤ A ≤ 99 | 98 | 9 | 107 |
| TC5 | –99 ≤ A ≤ 99 | 99 | 9 | 108 |
| TC6 | A > 99 | 100 | 9 | Invalid Input |
| TC7 | B < –99 | –10 | –100 | Invalid Input |
| TC8 | –99 ≤ B ≤ 99 | 10 | –99 | –89 |
| TC9 | –99 ≤ B ≤ 99 | 10 | –98 | –88 |
| TC10 | –99 ≤ B ≤ 99 | 10 | 98 | 108 |
| TC11 | –99 ≤ B ≤ 99 | 10 | 99 | 109 |
| TC12 | B > 99 | 10 | 100 | Invalid Input |

---

### Example 2 — Positive Integer Less Than 100

**Spec:** Enter a positive integer less than 100

| Condition | Class ID | Equivalence Class | Type |
|-----------|----------|-------------------|------|
| C1: Is an integer | EC1 | Is an integer | Valid |
| C1: Is an integer | EC2 | Not an integer | Invalid |
| C2: Range (0, 100) | EC3 | 0 < X < 100 | Valid |
| C2: Range (0, 100) | EC4 | X ≤ 0 | Invalid |
| C2: Range (0, 100) | EC5 | X ≥ 100 | Invalid |

**Combined Valid Class:** Integer AND 0 < X < 100

**Combined Invalid Classes:**
- Is an integer, X ≤ 0
- Is an integer, X ≥ 100
- Not an integer (covers all range sub-cases)

---

### Example 3 — 7-Character String with Uppercase First

**Spec:** A string of 7 characters; first character must be uppercase

| Type | Equivalence Class |
|------|-------------------|
| Valid | Length = 7 AND first character is uppercase |
| Invalid | Length = 7 AND first character is lowercase |
| Invalid | Length < 7 |
| Invalid | Length > 7 |

---

### Example 4 — 2D Coordinate Point (X, Y)

**Spec:** `3 ≤ X ≤ 7`, `5 ≤ Y ≤ 9`

| Type | Equivalence Class |
|------|-------------------|
| Valid | 3 ≤ X ≤ 7 AND 5 ≤ Y ≤ 9 |
| Invalid | X < 3 |
| Invalid | X > 7 |
| Invalid | Y < 5 |
| Invalid | Y > 9 |

---

### Example 5 — Widget Identifier

**Spec:** 3–15 alphanumeric characters; first two characters must be letters

#### Three Input Conditions Identified:
1. Must consist of alphanumeric characters
2. Total character count range: 3 to 15
3. First two characters must be letters

#### Equivalence Classes Per Condition:

| Condition | Class ID | Description | Type |
|-----------|----------|-------------|------|
| 1: Alphanumeric | EC1 | Identifier is alphanumeric | Valid |
| 1: Alphanumeric | EC2 | Identifier is NOT alphanumeric | Invalid |
| 2: Length 3–15 | EC3 | Length between 3 and 15 (inclusive) | Valid |
| 2: Length 3–15 | EC4 | Length < 3 | Invalid |
| 2: Length 3–15 | EC5 | Length > 15 | Invalid |
| 3: First 2 = letters | EC6 | First 2 characters are letters | Valid |
| 3: First 2 = letters | EC7 | First 2 characters are NOT letters | Invalid |

#### Final Combined Summary:

**Valid:**
- Alphanumeric, length 3–15, first 2 characters are letters

**Invalid:**
- Not alphanumeric
- Length < 3 characters
- Length > 15 characters
- First 2 characters are not letters

---

## 11. Senior QA Best Practices — 5+ Years in Domain Testing

The following practices represent field-tested conventions adopted in professional QA environments across enterprise software, fintech, and platform product teams.

---

### BP-01 — Always Start From the Specification, Never From the Code
**Principle:** Equivalence classes must be derived from **requirements documents, user stories, or functional specifications** — never from reading the source code. Reading the code introduces implementation bias and causes you to miss specification violations that the code does not even know about.

**In practice:**
- Map each input field to its spec requirement before identifying any partition.
- Document the requirement reference (e.g., `REQ-003`) beside each equivalence class for traceability.

---

### BP-02 — Model Outputs as Partitions, Not Just Inputs
**Principle:** The slides rightly include output variables (SUM, Error Message) in the partition table. Many junior testers skip this. **Output-based partitioning** ensures you write at least one test case that provokes each distinct output type.

**In practice:**
- List all outputs the system can produce (computed value, error code, status response, redirect, email trigger, etc.)
- Assign each output to a valid or invalid class.
- Verify you have at least one test case that generates every output partition.

---

### BP-03 — Use the Equivalence Class Table as a Living Document
**Principle:** The partition table is not a one-time artifact. It should be maintained throughout the project lifecycle.

**In practice:**
- Store the EC table in your test management tool (Jira, TestRail, Zephyr, etc.) alongside test cases.
- When requirements change, audit every affected equivalence class before modifying test cases.
- Mark classes as `COVERED`, `PENDING`, or `BLOCKED` for sprint-level tracking.

---

### BP-04 — Never Group Invalid Classes in a Single Test Case
**Principle:** This is one of the most common and costly mistakes. A test with two invalid inputs is ambiguous — you cannot determine which input caused the failure.

**Bad example:**
```
TC_BAD: A = "abc" (not integer), B = 200 (out of range) → Expected: Error
```

**Good examples:**
```
TC_A: A = "abc" (not integer), B = 9 (valid) → Expected: Error   [tests EC4]
TC_B: A = 10 (valid),          B = 200 (out of range) → Expected: Error   [tests EC7]
```

**In practice:** When a defect is raised against a test with multiple invalid inputs, root cause analysis becomes ambiguous. Keep each invalid test atomic.

---

### BP-05 — Apply the Full BVA Set for High-Risk Fields
**Principle:** For business-critical numeric fields (financial amounts, age limits, subscription tiers, inventory counts), apply all 6 standard boundary points: LB–1, LB, LB+1, UB–1, UB, UB+1.

**In practice:**
- For non-critical fields with limited risk, you may reduce to 4 points (LB, LB+1, UB–1, UB).
- Always include LB–1 and UB+1 as dedicated **invalid** test cases, not just informal checks.
- In database-backed systems, also test the physical min/max (INT boundaries, field-length limits in the DB schema).

---

### BP-06 — Distinguish Specification Boundaries from System Boundaries
**Principle:** The spec may say "age must be 18–99," but the UI text field may accept 0–9999. Both sets of boundaries must be tested.

| Boundary Type | Example | Who Defines It |
|--------------|---------|----------------|
| Specification boundary | Age ≥ 18 | Product owner / requirements |
| System/UI boundary | Field max length = 4 digits | Developer / UI constraint |
| Database boundary | TINYINT max = 255 | Infrastructure |

**In practice:** Test all three levels. A common defect pattern: spec says max = 100, UI allows 999, DB stores 3 digits → input of 100 passes UI but causes DB truncation or logic error.

---

### BP-07 — Handle String-Type Fields Systematically
**Principle:** String inputs have multiple simultaneous dimensions: length, character type, position-based rules, case sensitivity. Each dimension is its own partition axis.

**Systematic decomposition for a string field:**
```
Axis 1: Length     → empty, too short, valid range, too long
Axis 2: Char type  → alphanumeric, special chars, unicode, control chars
Axis 3: Position   → first char rule, last char rule, pattern (regex)
Axis 4: Case       → uppercase, lowercase, mixed (if case-sensitive)
```

**In practice:** Create a separate equivalence class row for each axis. Do not merge "invalid length" and "invalid character type" into one generic "invalid input" class — they represent different defects.

---

### BP-08 — Use Risk to Prioritize Which Partitions Get BVA
**Principle:** Not every partition needs full boundary analysis. Apply BVA effort proportional to defect risk.

**Risk prioritization matrix:**

| Risk Level | Partition Type | BVA Depth |
|-----------|----------------|-----------|
| High | Financial, security, access control | Full 6-point BVA |
| Medium | Data validation, format checks | 4-point BVA (LB, LB+1, UB–1, UB) |
| Low | Display/UI, non-critical formatting | Representative only |

---

### BP-09 — Re-partition When the Implementation Reveals Sub-behaviors
**Guideline 4 from theory applied in practice:** During exploratory testing or code review, if you discover that values within a "valid" class produce subtly different behaviors, split that class immediately and add a test case.

**Example:** A valid discount range of `10%–50%` that internally applies different discount algorithms for `<25%` (tier 1) vs. `≥25%` (tier 2) should be split into two valid classes, each with its own BVA.

---

### BP-10 — Document Expected Results Precisely Before Executing
**Principle:** Every test case must have a precisely defined expected result **before** execution. Vague expectations like "should work correctly" are not acceptable.

**In practice:**
- For valid cases: specify the exact computed value, format, or state change.
- For invalid cases: specify the exact error message text, HTTP status code, or UI behavior.
- This prevents confirmation bias — the tester knowing what "should happen" before running the test, then rationalizing an incorrect result as acceptable.

---

### BP-11 — Automate Boundary Tests First
**Principle:** Boundary value tests are deterministic, repeatable, and high-value. They should be the first candidates for automation in a regression suite.

**In practice:**
- BVA tests make excellent unit/integration test cases with near-zero maintenance cost.
- Parameterize boundary test data so that when the spec changes (e.g., max changes from 99 to 199), only the test data changes, not the test logic.

---

### BP-12 — Combine Domain Testing with Other Techniques
**Principle:** Domain Testing is necessary but not sufficient for complete test coverage. Use it as the foundation, then supplement with:

| Technique | When to Add |
|-----------|-------------|
| **Decision Table Testing** | When multiple conditions combine to produce different outputs |
| **State Transition Testing** | When the system has distinct states and transitions |
| **Pairwise / Combinatorial Testing** | When many variables interact and full combination is infeasible |
| **Exploratory Testing** | To catch errors that fall in non-obvious interior regions of a partition |

---

### Quick Reference — Domain Testing Decision Checklist

```
□ Have I read and understood the complete specification for this input?
□ Have I identified ALL input variables AND all output variables?
□ For each variable, have I identified at least:
    - 1 valid equivalence class?
    - All applicable invalid equivalence classes?
□ Have I followed all 4 guidelines (range, set, must-be, split)?
□ Is each equivalence class truly handling input identically? If unsure → split.
□ Does every invalid test case test exactly ONE invalid condition?
□ Does my valid test case cover as many valid classes as possible simultaneously?
□ Have I applied BVA to all numeric / ordered fields?
□ Have I documented expected results precisely (not vaguely)?
□ Is the equivalence class table stored and linked to test cases in the test tool?
□ Have I considered system-level boundaries beyond the specification?
```

---