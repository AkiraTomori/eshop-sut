# SKILL: Phase 3 — Boundary Value Analysis (BVA)

> **Phase:** 3 of 5
> **Prerequisite:** Phase 2 `FR[##]-domain-analysis.md` must be completed and HITL-approved.
> **Input:** Approved EC table from Phase 2
> **Output file:** `FR[##]-boundary-analysis.md` (append to pool directory)
> **Knowledge sources (read in order):**
> 1. `FR[##]-domain-analysis.md` — approved EC table
> 2. `.agents/context/eshop-srs.md` — specification boundaries
> 3. `.agents/context/eshop-api-spec.md` — API-level constraints (field sizes, value ranges)
> 4. `.agents/context/theory-domain-testing.md §8` — BVA theory and boundary points
> 5. `.agents/context/theory-testcase-design.md §9` — BVA boundary types and TC-BP-07

---

## Skill Purpose

Apply **Boundary Value Analysis (BVA)** to every ordered or numeric equivalence class in the Phase 2 EC table. Select the appropriate BVA depth based on risk level, and test all three boundary types: specification, UI/system, and database.

---

## Execution Steps

### Step 1 — Identify Which ECs Require BVA

From the approved EC table, select every class where the variable is:
- Numeric (integer, float, currency amount)
- Ordered (date, length, count)
- String with a defined min/max length

Skip BVA for non-ordered discrete sets (G2 classes) and boolean/flag fields — use a representative only.

### Step 2 — Assign Risk Level & BVA Depth

For each qualifying EC, assign a risk level and the corresponding BVA depth:

| Risk Level | Field Type | BVA Points Required |
|-----------|------------|---------------------|
| **High** | Financial amounts, access control limits, security fields, quantity caps | `LB-1, LB, LB+1, UB-1, UB, UB+1` (6-point full) |
| **Medium** | Data validation fields, format checks, string lengths | `LB, LB+1, UB-1, UB` (4-point reduced) |
| **Low** | Display/UI, non-critical formatting | Representative interior value only |

> **Source:** `theory-domain-testing.md BP-05, BP-08` and `theory-testcase-design.md TC-BP-06`

### Step 3 — Derive Boundary Points Per Class

For each qualifying EC with bounds [LB, UB]:

| Point | Value | Class | Test Type |
|-------|-------|-------|-----------|
| `LB - 1` | One step below lower bound | INVALID | Dedicated invalid TC |
| `LB` | Exact lower bound | VALID | BVA TC |
| `LB + 1` | One step above lower bound | VALID | BVA TC |
| Interior | Mid-range representative | VALID | EP TC (already covered in Phase 4) |
| `UB - 1` | One step below upper bound | VALID | BVA TC |
| `UB` | Exact upper bound | VALID | BVA TC |
| `UB + 1` | One step above upper bound | INVALID | Dedicated invalid TC |

> **Rule:** `LB-1` and `UB+1` are **always** dedicated invalid test cases — never combine them with another condition.

### Step 4 — Test Three Boundary Types Separately

For every numeric/ordered field, distinguish and test all three boundary levels:

| Boundary Type | Source | Example |
|--------------|--------|---------|
| **Specification** | `eshop-srs.md` requirement | Product price > 0 (FR-15) |
| **UI / System** | What the HTML input or API actually accepts | `<input type="number" min="1">` allows 0 via API bypass |
| **Database** | Schema field type (SQLite INTEGER, TEXT(255), etc.) | name VARCHAR(255) |

Document each boundary type explicitly in the output table. A mismatch between these three is a **high-value test finding**.

### Step 5 — Self-Audit (AGENTS.md §7 — Boundary Analysis Gate)

```
□ BVA applied to all ordered/numeric EC classes from Phase 2
□ Risk level assigned and documented for each variable
□ Correct BVA depth selected per risk level (6-point / 4-point / representative)
□ Specification, UI, and DB boundaries all documented in separate rows
□ LB-1 and UB+1 are clearly marked as INVALID
□ Every boundary point traces back to an EC-FR[##]-[###] ID
```

---

## Output Block Template

Append the following block to `FR[##]-boundary-analysis.md`:

```markdown
---
## Boundary Value Analysis — [FR-ID]: [Feature Name]
**Date:** YYYY-MM-DD HH:MM
**Analyst:** Gemini QA Agent (reviewed by: [HITL name])
**Based on:** FR[##]-domain-analysis.md (approved YYYY-MM-DD)

### BVA Table

| EC ID | Variable | Risk Level | BVA Depth | Boundary Type | Point | Test Value | Valid/Invalid | Notes |
|-------|----------|-----------|-----------|--------------|-------|------------|--------------|-------|
| EC-FR[##]-001 | [Variable] | High | 6-point | Specification | LB-1 | [value] | INVALID | [SRS ref] |
| EC-FR[##]-001 | [Variable] | High | 6-point | Specification | LB | [value] | VALID | [SRS ref] |
| EC-FR[##]-001 | [Variable] | High | 6-point | Specification | LB+1 | [value] | VALID | [SRS ref] |
| EC-FR[##]-001 | [Variable] | High | 6-point | Specification | UB-1 | [value] | VALID | [SRS ref] |
| EC-FR[##]-001 | [Variable] | High | 6-point | Specification | UB | [value] | VALID | [SRS ref] |
| EC-FR[##]-001 | [Variable] | High | 6-point | Specification | UB+1 | [value] | INVALID | [SRS ref] |
| EC-FR[##]-001 | [Variable] | High | 6-point | UI/System | Min possible | [value] | VALID | [UI constraint] |
| EC-FR[##]-001 | [Variable] | High | 6-point | Database | Max possible | [value] | VALID | [schema constraint] |
| … | … | … | … | … | … | … | … | … |

### Boundary Type Coverage Summary

| Variable | Spec Boundary | UI/System Boundary | DB Boundary | Mismatch Detected? |
|----------|--------------|-------------------|------------|-------------------|
| [name]   | [range]      | [range]           | [range]    | Yes / No          |

### Potential High-Value Findings (Boundary Mismatches)
- [Variable]: Spec says max=[X], UI allows max=[Y], DB stores [Z] → test value [Y+1] against API
```

---

## HITL Action After This Skill

1. Review all boundary point values — verify they match the SRS constraints exactly.
2. Confirm risk level assignments — adjust any that are misclassified.
3. Check the "Boundary Type Coverage Summary" — investigate any mismatch row.
4. Sign off: append `**HITL Review:** Accepted / Partially Accepted / Rejected — [notes]` to the block.
5. Commit: `git commit -m "feat(FR##): add BVA table for [variable names]"`
6. **Only after sign-off:** trigger Phase 4 (Test Case Design).
