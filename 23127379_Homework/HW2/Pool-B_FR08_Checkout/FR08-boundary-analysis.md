## Boundary Value Analysis — FR-08: Checkout (+ FR-09: Coupon Code)
**Date:** 2026-06-14 09:36
**Analyst:** Gemini QA Agent (reviewed by: Thái Minh Huy)
**Based on:** FR08-domain-analysis.md (approved 2026-06-14)

---

### BVA Eligibility Determination

| Group | Variable | Ordered/Numeric? | BVA Required? | Risk Level | BVA Depth | Rationale |
|-------|----------|:----------------:|:-------------:|------------|-----------|-----------|
| 1 | JWT Token | No (G3/G4 — boolean condition) | No | Low | Representative | Pass/fail; no ordered range |
| 2 | Cart contents | No (G3 — boolean: empty/non-empty) | No | Low | Representative | 0 items vs. ≥1 items is an EP class, not a continuous range |
| 3 | `shipping_address` (length) | **Yes** (G1 — string length 1–255) | **Yes** | Medium | 4-point | String length validation; data format check |
| 4 | `total_amount` (client) | No (G3 — security assertion) | No | Low | Representative | Backend recalculates regardless; not a user-facing range |
| 5 | Coupon code existence | No (G3/G4 — discrete condition) | No | Low | Representative | Exist/not-exist/inactive — no ordered range |
| 6 | Coupon `expired_at` (date) | **Yes** (G1 — ordered date) | **Yes** | **High** | 6-point | Financial access control gate; date inequalities are error-prone |
| 7 | Order total vs. `min_order_amount` (C3) | **Yes** (G1 — financial amount) | **Yes** | **High** | 6-point | Financial gate; off-by-one errors on `>=` boundary are critical |
| 8 | Usage count vs. `max_uses_per_user` (C5) | **Yes** (G1 — integer count) | **Yes** | **High** | 6-point | Access control limit; `<` strict boundary is high-risk |
| 9 | Coupon `type` | No (G2 — discrete set) | No | Low | Representative per value | Enumerated: {percent, fixed}; no range |
| 10 | Output variables | No (G3 — must-be conditions) | No | Low | Representative | Presence/correctness checks, not numeric ranges |

> **BVA scope:** 4 variables require BVA — `shipping_address` (Medium, 4-point), coupon expiry (High, 6-point), order total vs. min_order (High, 6-point), usage count vs. max_uses (High, 6-point).

---

### BVA Table

#### Section A — `shipping_address` Length (EC-FR08-006, EC-FR08-007, EC-FR08-008)

> **Risk:** Medium | **BVA Depth:** 4-point (LB, LB+1, UB-1, UB)
> **Spec boundary:** 1–255 characters (LB=1, UB=255; HITL-resolved baseline from FR-08)
> **UI/System boundary:** HTML `<textarea>` or `<input>` — no explicit `maxlength` observed in SRS; UI may not enforce limit
> **DB boundary:** `shipping_address` stored as TEXT in SQLite — no hard character limit from schema; practical stress at 1000+ chars

| BV ID | EC Ref | Variable | Risk | BVA Depth | Boundary Type | Point | Test Value | Valid/Invalid | Notes |
|-------|--------|----------|------|-----------|--------------|-------|------------|:-------------:|-------|
| BV-FR08-001 | EC-FR08-007 | `shipping_address` length | Medium | 4-point | Specification | LB (=1) | `"A"` (1 char) | **VALID** | Exact lower bound — minimum valid address; FR-08 |
| BV-FR08-002 | EC-FR08-006 | `shipping_address` length | Medium | 4-point | Specification | LB+1 (=2) | `"AB"` (2 chars) | **VALID** | One step inside lower bound; FR-08 |
| BV-FR08-003 | EC-FR08-006 | `shipping_address` length | Medium | 4-point | Specification | UB-1 (=254) | 254-char string | **VALID** | One step inside upper bound; FR-08 |
| BV-FR08-004 | EC-FR08-006 | `shipping_address` length | Medium | 4-point | Specification | UB (=255) | 255-char string | **VALID** | Exact upper bound of HITL-resolved baseline; FR-08 |
| BV-FR08-005 | EC-FR08-007 | `shipping_address` length | Medium | 4-point | Specification | LB-1 (=0) | `""` (empty string) | **INVALID** | Below lower bound — empty address must be rejected; FR-08 |
| BV-FR08-006 | EC-FR08-008 | `shipping_address` length | Medium | 4-point | Specification | UB+1 (=256) | 256-char string | **INVALID** | One step above HITL baseline — stress test start; FR-08 |
| BV-FR08-007 | EC-FR08-008 | `shipping_address` length | Medium | 4-point | UI/System | System max | Whitespace-only string (e.g., `"   "`) | **INVALID** | Must-be: non-whitespace content; system should reject blank-equivalent; FR-08 |
| BV-FR08-008 | EC-FR08-008 | `shipping_address` length | Medium | 4-point | Database | DB stress | 1000-char string | **INVALID** (stress) | SQLite TEXT is unlimited; test API/backend truncation or error; FR-08 |

---

#### Section B — Coupon Expiry Date (EC-FR08-015, EC-FR08-016, EC-FR08-017)

> **Risk:** High | **BVA Depth:** 6-point
> **Spec boundary:** Current date must be strictly `<` `expired_at` (date-only, YYYY-MM-DD; HITL-resolved)
> **Reference coupon:** `SAVE10` expires `2099-12-31`; `EXPIRED` expires `2020-01-01`
> **Interpretation:** LB = day after coupon creation (not specified), UB = `expired_at` date. The condition is `current_date < expired_at`, so `current_date = expired_at` is **INVALID**.
> **BVA approach:** Test relative to a known `expired_at` value. Using sample coupon `SAVE10` with `expired_at = 2099-12-31` as the reference UB.

| BV ID | EC Ref | Variable | Risk | BVA Depth | Boundary Type | Point | Test Value (relative to `expired_at = 2099-12-31`) | Valid/Invalid | Notes |
|-------|--------|----------|------|-----------|--------------|-------|-----------------------------------------------------|:-------------:|-------|
| BV-FR08-009 | EC-FR08-015 | Coupon `expired_at` | High | 6-point | Specification | UB-1 | `2099-12-30` (one day before expiry) | **VALID** | Last fully-valid date; coupon should apply; FR-09 (C2) |
| BV-FR08-010 | EC-FR08-016 | Coupon `expired_at` | High | 6-point | Specification | UB (exact expiry) | `2099-12-31` (expiry date itself) | **INVALID** | HITL-resolved: `<` is strict; current = expired_at → coupon expired; FR-09 (C2) |
| BV-FR08-011 | EC-FR08-017 | Coupon `expired_at` | High | 6-point | Specification | UB+1 | `2100-01-01` (one day past expiry) | **INVALID** | Clearly past expiry; coupon must be rejected; FR-09 (C2) |
| BV-FR08-012 | EC-FR08-015 | Coupon `expired_at` | High | 6-point | Specification | Interior (far valid) | Current date (today, 2026-06-14) vs. SAVE10 (`2099-12-31`) | **VALID** | Interior representative for non-expired state; FR-09 (C2) |
| BV-FR08-013 | EC-FR08-017 | Coupon `expired_at` | High | 6-point | Specification | Far invalid | `EXPIRED` coupon (`expired_at = 2020-01-01`); current date 2026-06-14 is years past expiry | **INVALID** | Far past expiry using sample data; FR-09 (C2) |
| BV-FR08-014 | EC-FR08-016 | Coupon `expired_at` | High | 6-point | UI/System | System boundary | Coupon with `expired_at` = yesterday's date | **INVALID** | System date comparison: current_date > expired_at; verifies date comparison logic at recent boundary; FR-09 (C2) |

> ⚠️ **LB for expiry not tested with 6-point:** The lower bound (coupon creation date) is not exposed to the user and is not a spec-defined user input. BVA is applied only to the upper bound (expiry date) which is the actionable boundary per FR-09 (C2).

---

#### Section C — Order Total vs. `min_order_amount` (FR-09 C3) (EC-FR08-018, EC-FR08-019)

> **Risk:** High | **BVA Depth:** 6-point
> **Spec boundary:** Order total must be `>=` `min_order_amount` (FR-09 C3); condition: `total >= min_order_amount`
> **Reference coupon samples:**
> - `SAVE10`: `min_order_amount = 300,000 ₫`
> - `BIGBUY`: `min_order_amount = 500,000 ₫`
> - `VIP100`: `min_order_amount = 300,000 ₫`
> **Testing with `SAVE10` / `VIP100` reference: LB = 300,000 ₫ (min_order_amount); UB = no spec-defined upper cap on order total**
> **Note:** Since there is no spec-defined upper bound on order total, UB-related points (UB, UB-1, UB+1) are not applicable. BVA is applied to the lower bound only (the `min_order_amount` threshold).

| BV ID | EC Ref | Variable | Risk | BVA Depth | Boundary Type | Point | Test Value (min_order = 300,000 ₫) | Valid/Invalid | Notes |
|-------|--------|----------|------|-----------|--------------|-------|--------------------------------------|:-------------:|-------|
| BV-FR08-015 | EC-FR08-019 | Order total vs. `min_order_amount` | High | 6-point | Specification | LB-1 | 299,999 ₫ (one unit below minimum) | **INVALID** | Order total < min_order_amount → coupon C3 fails; FR-09 (C3) |
| BV-FR08-016 | EC-FR08-018 | Order total vs. `min_order_amount` | High | 6-point | Specification | LB (exact) | 300,000 ₫ (exactly equals min_order_amount) | **VALID** | Exact lower bound; `>=` means equal is valid; FR-09 (C3) |
| BV-FR08-017 | EC-FR08-018 | Order total vs. `min_order_amount` | High | 6-point | Specification | LB+1 | 300,001 ₫ (one unit above minimum) | **VALID** | Just above minimum; coupon should apply; FR-09 (C3) |
| BV-FR08-018 | EC-FR08-019 | Order total vs. `min_order_amount` | High | 6-point | Specification | Far below LB | 100,000 ₫ (well below minimum) | **INVALID** | Representative for clearly insufficient order; FR-09 (C3) |
| BV-FR08-019 | EC-FR08-018 | Order total vs. `min_order_amount` | High | 6-point | Specification | Interior valid | 500,000 ₫ (well above minimum for SAVE10) | **VALID** | Interior valid representative; also covers BIGBUY's min_order threshold as exact LB for that coupon; FR-09 (C3) |
| BV-FR08-020 | EC-FR08-019 | Order total vs. `min_order_amount` | High | 6-point | Specification | LB-1 (BIGBUY) | 499,999 ₫ vs. BIGBUY min_order = 500,000 ₫ | **INVALID** | Cross-coupon boundary test; LB-1 for a different coupon's threshold; FR-09 (C3) |

---

#### Section D — Coupon Usage Count vs. `max_uses_per_user` (FR-09 C5) (EC-FR08-020, EC-FR08-021, EC-FR08-022)

> **Risk:** High | **BVA Depth:** 6-point
> **Spec boundary:** User usage count must be strictly `<` `max_uses_per_user`; condition: `usage_count < max_uses_per_user`
> **Reference coupon samples:**
> - `SAVE10`: `max_uses_per_user = 1`
> - `VIP100`: `max_uses_per_user = 2`
> **Interpretation:** LB = 0 uses (user has never used the coupon). UB = `max_uses_per_user - 1` (last valid use). At `usage_count = max_uses_per_user`, the condition `count < max` fails → INVALID.

| BV ID | EC Ref | Variable | Risk | BVA Depth | Boundary Type | Point | Test Value (max_uses = 1 for SAVE10) | Valid/Invalid | Notes |
|-------|--------|----------|------|-----------|--------------|-------|---------------------------------------|:-------------:|-------|
| BV-FR08-021 | EC-FR08-020 | Usage count vs. `max_uses_per_user` | High | 6-point | Specification | LB (=0) | User has used SAVE10 **0 times** → applying for the first time | **VALID** | Exact lower bound; fresh user; FR-09 (C5) |
| BV-FR08-022 | EC-FR08-020 | Usage count vs. `max_uses_per_user` | High | 6-point | Specification | LB+1 / UB (=1 for max=2) | User has used VIP100 **1 time**; max=2 → still valid | **VALID** | With VIP100 (max=2): interior valid representative; FR-09 (C5) |
| BV-FR08-023 | EC-FR08-021 | Usage count vs. `max_uses_per_user` | High | 6-point | Specification | UB (= max_uses = 1) | User has used SAVE10 **1 time**; max=1 → usage_count = max → **blocked** | **INVALID** | Exact upper bound; `<` is strict so equal = blocked; critical boundary; FR-09 (C5) |
| BV-FR08-024 | EC-FR08-022 | Usage count vs. `max_uses_per_user` | High | 6-point | Specification | UB+1 (=2 for max=1) | User has used SAVE10 **2 times** (data-setup scenario — manipulated) | **INVALID** | One beyond max; clearly blocked; FR-09 (C5) |
| BV-FR08-025 | EC-FR08-021 | Usage count vs. `max_uses_per_user` | High | 6-point | Specification | UB (= max_uses = 2) | User has used VIP100 **2 times**; max=2 → usage_count = max → **blocked** | **INVALID** | Cross-coupon: boundary with VIP100 (max=2); FR-09 (C5) |
| BV-FR08-026 | EC-FR08-020 | Usage count vs. `max_uses_per_user` | High | 6-point | Specification | UB-1 (=1 for max=2) | User has used VIP100 **1 time**; max=2 → still 1 use remaining → **valid** | **VALID** | UB-1 for VIP100: last fully-valid state before blocking; FR-09 (C5) |

---

### Boundary Type Coverage Summary

| Variable | Spec Boundary | UI/System Boundary | DB Boundary | Mismatch Detected? |
|----------|:-------------:|:-----------------:|:-----------:|:------------------:|
| `shipping_address` (length) | 1–255 chars (HITL-resolved) | Not explicitly enforced by SRS; no `maxlength` specified | SQLite TEXT = unlimited | **Yes — potential mismatch:** Spec says 255, DB has no limit, UI enforcement unknown. Test BV-FR08-006 to BV-FR08-008 will reveal actual enforcement layer. |
| Coupon `expired_at` (date) | current_date < expired_at | Server-side date comparison (YYYY-MM-DD string); no UI input for this field | Stored as DATE/TEXT in SQLite | **No mismatch expected** — comparison is purely server-side; spec and system aligned. Verify `=` boundary (BV-FR08-010). |
| Order total vs. `min_order_amount` | total >= min_order_amount | Auto-calculated by backend from cart items; no direct UI input | Order totals stored as REAL/INTEGER in SQLite | **Potential mismatch:** Spec says `>=`; if backend uses `>` (strict), LB exact test (BV-FR08-016) will detect it. |
| Usage count vs. `max_uses_per_user` | count < max_uses_per_user | Server-side counter; no direct UI input | Usage count stored as INTEGER in DB | **Potential mismatch:** If backend uses `<=` instead of `<`, boundary test BV-FR08-023 (count = max = 1) will detect the error. |

---

### Potential High-Value Findings (Boundary Mismatches)

1. **`shipping_address` — Spec vs. UI vs. DB mismatch (BV-FR08-006, BV-FR08-007, BV-FR08-008):**
   - Spec (HITL-resolved): max = 255 chars
   - UI: unknown enforcement (no `maxlength` in SRS)
   - DB: SQLite TEXT = no hard cap
   - → **Test at 256 chars (BV-FR08-006) and 1000 chars (BV-FR08-008)** to find where (if anywhere) the limit is enforced. If none of the three layers enforce it, this is a **data integrity bug**.

2. **`min_order_amount` — Operator precision (BV-FR08-015 and BV-FR08-016):**
   - Spec: `total >= min_order_amount` (inclusive)
   - Risk: Developer may have implemented `total > min_order_amount` (exclusive), which would incorrectly **block** valid orders at exactly the minimum
   - → **Test BV-FR08-016 (total = exactly 300,000 ₫ vs. SAVE10)** — if coupon is rejected, this is a boundary operator bug.

3. **`max_uses_per_user` — Operator precision (BV-FR08-023):**
   - Spec: `usage_count < max_uses_per_user` (strict less than)
   - Risk: Developer may have implemented `usage_count <= max_uses_per_user`, which would incorrectly **allow** a coupon one extra use
   - → **Test BV-FR08-023 (count = 1, max = 1)** — if coupon is **accepted**, this is a usage-limit bypass bug.

4. **Coupon expiry exact date (BV-FR08-010):**
   - Spec: `current_date < expired_at` (strict; equal = expired per HITL)
   - Risk: Developer may have implemented `<=`, allowing coupons on their expiry date
   - → **Test BV-FR08-010 (current_date = expired_at)** — if coupon is accepted, this is an expiry boundary bug.

---

### BV Point Count Summary

| Variable | High/Med | BVA Depth | VALID Points | INVALID Points | Total BV Points |
|----------|:--------:|:---------:|:------------:|:--------------:|:---------------:|
| `shipping_address` (length) | Medium | 4-point + extras | 4 | 4 | 8 |
| Coupon `expired_at` | High | 6-point | 2 | 4 | 6 |
| Order total vs. `min_order_amount` | High | 6-point | 3 | 3 | 6 |
| Usage count vs. `max_uses_per_user` | High | 6-point | 3 | 3 | 6 |
| **Total** | | | **12** | **14** | **26** |

> BV IDs: BV-FR08-001 through BV-FR08-026

---

### Self-Audit (AGENTS.md §7 — Boundary Analysis Gate)

```
[x] BVA applied to all ordered/numeric EC classes from Phase 2 (shipping_address, expiry date, min_order, usage count)
[x] Risk level assigned and documented for each variable (1 Medium, 3 High)
[x] Correct BVA depth selected per risk level (Medium → 4-point; High → 6-point)
[x] Specification, UI/System, and DB boundaries documented in Boundary Type Coverage Summary
[x] LB-1 and UB+1 clearly marked as INVALID (BV-FR08-005, BV-FR08-006, BV-FR08-011, BV-FR08-015, BV-FR08-023/025)
[x] Every boundary point traces back to an EC-FR08-[###] ID
```

---

**HITL Review:** Accepted