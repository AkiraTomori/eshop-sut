# SKILL: Phase 2 — Domain Analysis (Equivalence Partitioning)

> **Phase:** 2 of 5
> **Prerequisite:** Phase 1 `FR[##]-requirement-analysis.md` must be completed and HITL-approved.
> **Input:** Approved variable list from Phase 1
> **Output file:** `FR[##]-domain-analysis.md` (append to pool directory)
> **Knowledge sources (read in order):**
> 1. `FR[##]-requirement-analysis.md` — approved variable list
> 2. `.agents/context/eshop-srs.md` — verify constraint details
> 3. `.agents/context/theory-domain-testing.md §5, §6` — EP theory and 4 guidelines
> 4. `.agents/context/theory-testcase-design.md §8` — EP selection rules

---

## Skill Purpose

Apply **Equivalence Partitioning (EP)** to every input and output variable identified in Phase 1. Produce a complete, labelled Equivalence Class (EC) table that is mutually exclusive, collectively exhaustive, and fully traceable to SRS requirements.

---

## Execution Steps

### Step 1 — Apply the 4 EP Guidelines to Each Variable

For every variable from Phase 1, determine which guideline(s) apply:

| Guideline | Trigger Condition | Result |
|-----------|------------------|--------|
| **G1 — Range** | Variable has a numeric or ordered range (e.g., quantity 1–999) | 1 valid class + 2 invalid classes (below LB, above UB) |
| **G2 — Discrete Set** | Variable accepts one of a finite set of named values | 1 valid class per valid value + 1 combined invalid class |
| **G3 — Must-Be Condition** | Variable must satisfy a structural rule (type, format, prefix) | 1 valid class + 1 invalid class |
| **G4 — Split** | Sub-ranges within a class are handled differently by the system | Split into 2+ sub-classes; repeat guideline selection for each |

> **Rule (from theory-domain-testing.md BP-01):** Derive classes from the SRS specification only — never from reading source code.

### Step 2 — Include Output Variables

Do **not** skip output variables (BP-02):
- Define a `VALID OUTPUT` class for the expected success response.
- Define an `INVALID OUTPUT` class for each distinct error response type.

### Step 3 — Assign EC IDs and Labels

- Label every class: `EC-FR[##]-[SEQ]` (3-digit zero-padded, sequential).
- Mark every class: `VALID` or `INVALID`.
- Document which guideline produced the class.

### Step 4 — Verify Mutual Exclusivity & Exhaustiveness

```
□ No value can belong to two classes simultaneously (mutually exclusive)
□ Every possible input value falls into exactly one class (collectively exhaustive)
□ Every INVALID class is distinct — no two INVALID classes cover the same input range
```

If G4 splitting was applied, verify the split sub-classes together still cover the full original range.

### Step 5 — Self-Audit (AGENTS.md §7 — Domain Analysis Gate)

```
□ All input AND output variables from Phase 1 are partitioned
□ At least 1 valid + all applicable invalid classes per variable
□ All 4 EP guidelines applied and documented
□ Every class labelled with a unique EC ID
□ Classes are mutually exclusive and collectively exhaustive
□ Every class traces to a requirement (FR-XX or SEC-XX)
```

Do not append the artefact if any box is unchecked.

---

## Output Block Template

Append the following block to `FR[##]-domain-analysis.md`:

```markdown
---
## Domain Analysis (Equivalence Partitioning) — [FR-ID]: [Feature Name]
**Date:** YYYY-MM-DD HH:MM
**Analyst:** Gemini QA Agent (reviewed by: [HITL name])
**Based on:** FR[##]-requirement-analysis.md (approved YYYY-MM-DD)

### Equivalence Class Table

| EC ID | Variable | Equivalence Class Description | Type | EP Guideline | Source Req. ID |
|-------|----------|-------------------------------|------|-------------|----------------|
| EC-FR[##]-001 | [Variable Name] | [Description of the partition] | VALID | G1 | FR-XX |
| EC-FR[##]-002 | [Variable Name] | [Description of the partition] | INVALID | G1 | FR-XX |
| EC-FR[##]-003 | [Variable Name] | [Description of the partition] | INVALID | G1 | FR-XX |
| EC-FR[##]-004 | [Variable Name] | [Description of the partition] | VALID | G2 | FR-XX |
| … | … | … | … | … | … |
| EC-FR[##]-NNN | [Output Variable] | [Success / error output] | VALID OUTPUT | G3 | FR-XX |
| EC-FR[##]-NNN | [Output Variable] | [Error output description] | INVALID OUTPUT | G3 | FR-XX |

### Guideline Application Summary

| Variable | G1 | G2 | G3 | G4 | Notes |
|----------|----|----|----|----|-------|
| [name]   | ✓  |    |    |    | Range: [LB–UB] |
| [name]   |    | ✓  |    |    | Values: [v1, v2, v3] |

### Open Issues for HITL
- [ ] [Any split decision or ambiguity requiring human judgement]
```

---

## HITL Action After This Skill

1. Review every EC row — verify the description matches the SRS exactly.
2. Verify no equivalence class is missing (check against Phase 1 variable list).
3. Verify no two INVALID classes overlap.
4. Correct any misclassification and record changes.
5. Sign off: append `**HITL Review:** Accepted / Partially Accepted / Rejected — [notes]` to the block.
6. Commit: `git commit -m "feat(FR##): add equivalence class table (domain analysis)"`
7. **Only after sign-off:** trigger Phase 3 (Boundary Analysis).
