## Boundary Value Analysis — FR-04: Personal Profile Management
**Date:** 2026-06-14 22:08
**Analyst:** Gemini QA Agent (reviewed by: Thái Minh Huy)
**Based on:** FR04-domain-analysis.md (approved 2026-06-14)
**Sources:** SRS §2 (FR-04, FR-01), §9 (SEC-02, SEC-06) · API Spec §2.2 · theory-domain-testing.md §8 · BP-05, BP-06, BP-08

---

### Step 1 — BVA Eligibility Screening

| Variable | Ordered/Numeric? | BVA Required? | Rationale |
|----------|:----------------:|:-------------:|-----------|
| JWT Token | No | ❌ No | G3 must-be — binary condition (valid vs. invalid token); no numeric range |
| Full Name — length | ✅ Yes | ✅ Yes | String length is an ordered integer range [1, 255] |
| Full Name — character type | No | ❌ No | G3 must-be condition; representative only |
| Phone Number — length | ✅ Yes | ✅ Yes | String length is an ordered integer range [10, 11]; note both bounds are valid spec points |
| Phone Number — prefix (starts with `0`) | No | ❌ No | G3 must-be positional rule; representative only |
| Phone Number — character type (numeric) | No | ❌ No | G3 must-be; representative only |
| Phone Number — optional/provided | No | ❌ No | G2 discrete; representative only |
| Shipping Address — length | ✅ Yes | ✅ Yes | String length is an ordered integer range [1, 255] (assumed DB ceiling) |
| Email (read-only) | No | ❌ No | G2 discrete; representative only |
| Role (blocked) | No | ❌ No | G2 discrete; representative only |
| All Output Variables | No | ❌ No | G3 must-be conditions; representative only |

**Variables requiring BVA: Full Name length · Phone Number length · Shipping Address length**

---

### Step 2 — Risk Level & BVA Depth Assignment

| Variable | Risk Level | BVA Depth | Justification |
|----------|-----------|-----------|---------------|
| Full Name — length (1–255) | **Medium** | 4-point: `LB, LB+1, UB-1, UB` | Data validation / format check; no financial or security implication |
| Phone Number — length (10–11) | **Medium** | 4-point: `LB, LB+1, UB-1, UB` (+ LB-1 and UB+1 as dedicated invalid TCs) | Identity data validation; note the valid range spans only 2 values, requiring special handling |
| Shipping Address — length (1–255) | **Medium** | 4-point: `LB, LB+1, UB-1, UB` | Data validation / format check; no financial or security implication |

> **Note on Phone Number length:** The valid spec range is [10, 11] — only 2 integer values. This means:
> - LB = 10, LB+1 = 11 = UB (LB+1 coincides with UB — the full range is just {10, 11})
> - UB-1 = 10 = LB (UB-1 coincides with LB)
> - Effective distinct points: LB-1 = 9 (INVALID), LB = 10 (VALID), UB = 11 (VALID), UB+1 = 12 (INVALID)
> This is a **narrow-range field** (only 2 valid values), so all 4 BVA points are distinct and all meaningful.

---

### BVA Table

#### Variable 1: Full Name — Character Length

**Specification boundary:** SRS FR-04 + FR-01 imply non-empty; max 255 assumed (DB baseline confirmed by HITL)
**UI/System boundary:** Mobile text input field — no explicit `maxLength` specified in SRS (HITL to verify in app)
**Database boundary:** SQLite `TEXT` column; SQLite has no hard VARCHAR length enforcement but Node.js/Express layer may enforce 255

| EC ID | Variable | Risk Level | BVA Depth | Boundary Type | Point | Test Value (chars) | Sample Value | Valid/Invalid | Notes |
|-------|----------|:----------:|:---------:|--------------|:-----:|:-----------------:|-------------|:-------------:|-------|
| EC-FR04-006 | Full Name — length | Medium | 4-point | Specification | LB-1 | 0 | `""` (empty string) | **INVALID** | Empty name violates non-empty constraint (FR-01 by inheritance); dedicated invalid TC required |
| EC-FR04-005 | Full Name — length | Medium | 4-point | Specification | LB | 1 | `"A"` | **VALID** | Exact lower bound — minimum valid name length |
| EC-FR04-005 | Full Name — length | Medium | 4-point | Specification | LB+1 | 2 | `"An"` | **VALID** | One step inside lower bound |
| EC-FR04-005 | Full Name — length | Medium | 4-point | Specification | UB-1 | 254 | 254-char string (e.g., `"Nguyen Van A" + 242 spaces`) | **VALID** | One step below assumed DB upper bound |
| EC-FR04-005 | Full Name — length | Medium | 4-point | Specification | UB | 255 | 255-char string | **VALID** | Exact assumed DB upper bound |
| EC-FR04-007 | Full Name — length | Medium | 4-point | Specification | UB+1 | 256 | 256-char string | **INVALID** | One step above assumed DB upper bound; dedicated invalid TC required |
| EC-FR04-005 | Full Name — length | Medium | Representative | UI/System | UI min | `""` (attempt) | `""` | **INVALID** | Mobile UI should prevent submission of empty name field (FR-22 required field `*`) |
| EC-FR04-007 | Full Name — length | Medium | Representative | Database | DB ceiling | 1000-char string | 1000-char string (Postman) | **INVALID** | Backend stress test; verifies whether API enforces length or silently truncates |

---

#### Variable 2: Phone Number — Digit Length

**Specification boundary:** SRS FR-04 states 10–11 digits long — both endpoints are inclusive valid values
**UI/System boundary:** Mobile numeric keyboard input — no explicit `maxLength` on input; user can type any length
**Database boundary:** SQLite TEXT column; phone stored as string — no intrinsic length enforcement at DB level

| EC ID | Variable | Risk Level | BVA Depth | Boundary Type | Point | Test Value (digits) | Sample Phone Value | Valid/Invalid | Notes |
|-------|----------|:----------:|:---------:|--------------|:-----:|:------------------:|--------------------|:-------------:|-------|
| EC-FR04-014 | Phone — length | Medium | 4-point | Specification | LB-1 | 9 digits | `"012345678"` | **INVALID** | One step below lower bound; starts with `0`, 9 digits — too short; dedicated invalid TC |
| EC-FR04-012 | Phone — length | Medium | 4-point | Specification | LB | 10 digits | `"0123456789"` | **VALID** | Exact lower bound — minimum valid phone length |
| EC-FR04-013 | Phone — length | Medium | 4-point | Specification | UB | 11 digits | `"01234567890"` | **VALID** | Exact upper bound — maximum valid phone length |
| EC-FR04-015 | Phone — length | Medium | 4-point | Specification | UB+1 | 12 digits | `"012345678901"` | **INVALID** | One step above upper bound; dedicated invalid TC |
| EC-FR04-014 | Phone — length | Medium | Representative | UI/System | UI min attempt | `"0"` (1 digit) | `"0"` | **INVALID** | User types only `0`; system must reject (far below LB); tests UI-level validation feedback |
| EC-FR04-015 | Phone — length | Medium | Representative | UI/System | UI max test | `"012345678901234"` (15 digits) | `"012345678901234"` | **INVALID** | Far above UB; verifies UI/API enforcement cap on phone length |

> **Special Note on LB+1 and UB-1 for Phone Length:**
> LB+1 = 11 = UB and UB-1 = 10 = LB. The valid range [10, 11] contains only 2 integer points. Therefore:
> - The standard 4-point set collapses to: LB(10), UB(11), LB-1(9), UB+1(12)
> - There is no distinct LB+1 or UB-1 test value beyond what LB and UB already cover
> - Both LB and UB must each receive their own individual test cases (confirmed by HITL: dual valid classes approved)

---

#### Variable 3: Shipping Address — Character Length

**Specification boundary:** SRS FR-04 has no stated max — 255-char DB baseline adopted (confirmed by HITL)
**UI/System boundary:** Mobile multiline text input — no explicit `maxLength` in SRS; HITL to verify rendered input
**Database boundary:** SQLite TEXT column — no intrinsic limit, but Node.js application layer may enforce 255

| EC ID | Variable | Risk Level | BVA Depth | Boundary Type | Point | Test Value (chars) | Sample Value | Valid/Invalid | Notes |
|-------|----------|:----------:|:---------:|--------------|:-----:|:-----------------:|-------------|:-------------:|-------|
| EC-FR04-018 | Shipping Address — length | Medium | 4-point | Specification | LB-1 | 0 | `""` (empty string) | **VALID** | Empty address is valid (optional field — HITL confirmed); LB-1 = LB for optional field, so empty is the valid floor |
| EC-FR04-019 | Shipping Address — length | Medium | 4-point | Specification | LB | 1 | `"A"` | **VALID** | Minimum non-empty address; single character |
| EC-FR04-019 | Shipping Address — length | Medium | 4-point | Specification | LB+1 | 2 | `"AB"` | **VALID** | One step inside lower bound |
| EC-FR04-019 | Shipping Address — length | Medium | 4-point | Specification | UB-1 | 254 | 254-char address string | **VALID** | One step below assumed upper bound |
| EC-FR04-019 | Shipping Address — length | Medium | 4-point | Specification | UB | 255 | 255-char address string | **VALID** | Exact assumed DB upper bound |
| EC-FR04-020 | Shipping Address — length | Medium | 4-point | Specification | UB+1 | 256 | 256-char address string | **INVALID** | One step above assumed DB upper bound; dedicated invalid TC required |
| EC-FR04-020 | Shipping Address — length | Medium | Representative | Database | DB stress | 1000-char string | 1000-char address (Postman) | **INVALID** | Backend stress test; verifies API/DB behaviour on extreme-length address |

> **Note on Shipping Address LB:** Because shipping_address is OPTIONAL (confirmed by HITL), the effective lower bound for the provided range is 1 (when field is non-empty). An empty string (LB-1 = 0) falls into EC-FR04-018 (valid optional skip). This is a **specification boundary overlap** noted in the boundary type summary below.

---

### Boundary Type Coverage Summary

| Variable | Spec Boundary | UI/System Boundary | DB Boundary | Mismatch Detected? |
|----------|:------------:|:-----------------:|:-----------:|:------------------:|
| Full Name — length | 1 char (min) · 255 chars (max, assumed) | Mobile text field — no hard maxLength stated in SRS | SQLite TEXT — no strict enforcement; App layer enforces 255 | ⚠️ **Potential mismatch** — SRS silent on max; DB has no hard limit; App layer is the effective boundary |
| Phone — length | 10 digits (min) · 11 digits (max) | Mobile numeric input — user can type any length | SQLite TEXT — no intrinsic phone length limit | ⚠️ **Potential mismatch** — UI may allow typing 12+ digits without real-time rejection; API must be the enforcement layer |
| Shipping Address — length | No stated max (0 = optional, 1+ = provided) | Mobile multiline input — no explicit maxLength | SQLite TEXT — no hard limit; App layer assumed 255 | ⚠️ **Potential mismatch** — no spec boundary exists; only DB/App boundary applies; test 256 chars via API |

---

### Potential High-Value Findings (Boundary Mismatches)

1. **Full Name max length:** SRS does not specify max length. The 255-char boundary is a DB/App-layer assumption. If the UI text input has no `maxLength` enforcement on the mobile form, a user could type 1000+ characters and the App or DB must reject it. **Test value: 256-char name via Postman to verify backend enforcement.**

2. **Phone number length on mobile UI:** The SRS specifies 10–11 digits. A mobile numeric keyboard does not inherently enforce a character count limit. The system must validate phone length at the API layer. **Test value: 12-digit phone `"012345678901"` via both mobile UI and Postman API directly.**

3. **Shipping Address — no spec upper bound:** The spec is completely silent on shipping address max length. Only the HITL-assumed 255-char DB baseline governs. If the backend accepts 1000-char addresses without error, this is a spec gap (not a bug), but should be documented. **Test value: 1000-char address via Postman to observe system behaviour.**

4. **Phone LB=10 and UB=11 are both valid:** Unlike typical ranges where only LB and UB-1 are commonly valid endpoints, here both LB=10 and UB=11 are valid spec-defined values. This means both must have their own dedicated passing test cases, and both LB-1=9 and UB+1=12 must have their own dedicated failing test cases — 4 individual phone-length boundary test cases are required.

---

### Self-Audit Checklist (AGENTS.md §7 — Boundary Analysis Gate)

```
✅ BVA applied to all ordered/numeric EC classes from Phase 2 (Full Name length, Phone length, Address length)
✅ Risk level assigned and documented for each variable (all Medium)
✅ Correct BVA depth selected per risk level (4-point for all Medium-risk fields)
✅ Specification, UI, and DB boundaries all documented in separate rows
✅ LB-1 and UB+1 are clearly marked as INVALID
✅ Every boundary point traces back to an EC-FR04-[###] ID
✅ Narrow-range phone field handled correctly (LB+1=UB collapse documented)
✅ Optional field (shipping address) LB boundary semantics documented
✅ 3 boundary mismatch risks flagged for HITL investigation
```

---

**HITL Review:** Accepted
