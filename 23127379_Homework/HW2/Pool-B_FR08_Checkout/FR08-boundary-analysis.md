## Boundary Value Analysis — FR-08: Checkout
**Date:** 2026-06-14 09:36 (revised: 2026-06-15 — FR-09 coupon content removed)
**Analyst:** Gemini QA Agent (reviewed by: Thái Minh Huy)
**Based on:** FR08-domain-analysis.md (revised 2026-06-15)

---

### BVA Eligibility Determination

| Group | Variable | Ordered/Numeric? | BVA Required? | Risk Level | BVA Depth | Rationale |
|-------|----------|:----------------:|:-------------:|------------|-----------|-----------| 
| 1 | JWT Token | No (G3/G4 — boolean condition) | No | Low | Representative | Pass/fail; no ordered range |
| 2 | Cart contents | No (G3 — boolean: empty/non-empty) | No | Low | Representative | 0 items vs. ≥1 items is an EP class, not a continuous range |
| 3 | `shipping_address` (length) | **Yes** (G1 — string length 1–255) | **Yes** | Medium | 4-point | String length validation; data format check |
| 4 | `total_amount` (client) | No (G3 — security assertion) | No | Low | Representative | Backend recalculates regardless; not a user-facing range |
| 5 | Output variables | No (G3 — must-be conditions) | No | Low | Representative | Presence/correctness checks, not numeric ranges |

> **BVA scope:** 1 variable requires BVA — `shipping_address` length (Medium, 4-point + additional boundary types).

---

### BVA Table

#### Section A — `shipping_address` Length (EC-FR08-006, EC-FR08-007, EC-FR08-008)

> **Risk:** Medium | **BVA Depth:** 4-point (LB, LB+1, UB-1, UB)
> **Spec boundary:** 1–255 characters (LB=1, UB=255; HITL-resolved baseline from FR-08)
> **UI/System boundary:** HTML `<textarea>` or `<input>` — no explicit `maxlength` observed in SRS; UI may not enforce limit
> **DB boundary:** `shipping_address` stored as TEXT in SQLite — no hard character limit from schema; practical stress at 1000+ chars

| BV ID | EC Ref | Variable | Risk | BVA Depth | Boundary Type | Point | Test Value | Valid/Invalid | Notes |
|-------|--------|----------|------|-----------|--------------|-------|------------|:-------------:|-------|
| BV-FR08-001 | EC-FR08-006 | `shipping_address` length | Medium | 4-point | Specification | LB (=1) | `"A"` (1 char) | **VALID** | Exact lower bound — minimum valid address; FR-08 |
| BV-FR08-002 | EC-FR08-006 | `shipping_address` length | Medium | 4-point | Specification | LB+1 (=2) | `"AB"` (2 chars) | **VALID** | One step inside lower bound; FR-08 |
| BV-FR08-003 | EC-FR08-006 | `shipping_address` length | Medium | 4-point | Specification | UB-1 (=254) | 254-char string | **VALID** | One step inside upper bound; FR-08 |
| BV-FR08-004 | EC-FR08-006 | `shipping_address` length | Medium | 4-point | Specification | UB (=255) | 255-char string | **VALID** | Exact upper bound of HITL-resolved baseline; FR-08 |
| BV-FR08-005 | EC-FR08-007 | `shipping_address` length | Medium | 4-point | Specification | LB-1 (=0) | `""` (empty string) | **INVALID** | Below lower bound — empty address must be rejected; FR-08 |
| BV-FR08-006 | EC-FR08-008 | `shipping_address` length | Medium | 4-point | Specification | UB+1 (=256) | 256-char string | **INVALID** | One step above HITL baseline — stress test start; FR-08 |
| BV-FR08-007 | EC-FR08-007 | `shipping_address` length | Medium | 4-point | UI/System | System max | Whitespace-only string (e.g., `"   "`) | **INVALID** | Must-be: non-whitespace content; system should reject blank-equivalent; FR-08 |
| BV-FR08-008 | EC-FR08-008 | `shipping_address` length | Medium | 4-point | Database | DB stress | 1000-char string | **INVALID** (stress) | SQLite TEXT is unlimited; test API/backend truncation or error; FR-08 |

---

### Boundary Type Coverage Summary

| Variable | Spec Boundary | UI/System Boundary | DB Boundary | Mismatch Detected? |
|----------|:-------------:|:-----------------:|:-----------:|:------------------:|
| `shipping_address` (length) | 1–255 chars (HITL-resolved) | Not explicitly enforced by SRS; no `maxlength` specified | SQLite TEXT = unlimited | **Yes — potential mismatch:** Spec says 255, DB has no limit, UI enforcement unknown. Test BV-FR08-006 to BV-FR08-008 will reveal actual enforcement layer. |

---

### Potential High-Value Findings

1. **`shipping_address` — Spec vs. UI vs. DB mismatch (BV-FR08-006, BV-FR08-007, BV-FR08-008):**
   - Spec (HITL-resolved): max = 255 chars
   - UI: unknown enforcement (no `maxlength` in SRS)
   - DB: SQLite TEXT = no hard cap
   - → **Test at 256 chars (BV-FR08-006) and 1000 chars (BV-FR08-008)** to find where (if anywhere) the limit is enforced. If none of the three layers enforce it, this is a **data integrity bug**.

---

### BV Point Count Summary

| Variable | Risk | BVA Depth | VALID Points | INVALID Points | Total BV Points |
|----------|:----:|:---------:|:------------:|:--------------:|:---------------:|
| `shipping_address` (length) | Medium | 4-point + extras | 4 | 4 | 8 |
| **Total** | | | **4** | **4** | **8** |

> BV IDs: BV-FR08-001 through BV-FR08-008

---

### Self-Audit (AGENTS.md §7 — Boundary Analysis Gate)

```
[x] BVA applied to the one ordered/numeric EC class from Phase 2 (shipping_address)
[x] Risk level assigned and documented (Medium)
[x] Correct BVA depth selected per risk level (Medium → 4-point)
[x] Specification, UI/System, and DB boundaries documented in Boundary Type Coverage Summary
[x] LB-1 and UB+1 clearly marked as INVALID (BV-FR08-005, BV-FR08-006)
[x] Every boundary point traces back to an EC-FR08-[###] ID
[x] FR-09 coupon BVA sections (B, C, D) fully removed
```

---

**HITL Review:** Accepted (revised 2026-06-15 — FR-09 content removed)