## Domain Analysis (Equivalence Partitioning) — FR-08: Checkout (+ FR-09: Coupon Code)
**Date:** 2026-06-14 08:08
**Analyst:** Gemini QA Agent (reviewed by: Thái Minh Huy)
**Based on:** FR08-requirement-analysis.md (approved 2026-06-14)

---

### Equivalence Class Table

#### Group 1 — Authentication / Session (Input)

| EC ID | Variable | Equivalence Class Description | Type | EP Guideline | Source Req. ID |
|-------|----------|-------------------------------|------|-------------|----------------|
| EC-FR08-001 | JWT Token | User is logged in — valid, non-expired JWT token present in `Authorization: Bearer <token>` header | VALID | G3 | FR-08, SEC-02 |
| EC-FR08-002 | JWT Token | User is NOT logged in — no JWT token supplied (unauthenticated request) | INVALID | G3 | FR-08, SEC-02 |
| EC-FR08-003 | JWT Token | JWT token is malformed / expired / tampered with — present but invalid | INVALID | G4 (split of EC-FR08-002: different error path — server rejects token vs. missing header) | SEC-02 |

---

#### Group 2 — Cart State (Input / Pre-condition)

| EC ID | Variable | Equivalence Class Description | Type | EP Guideline | Source Req. ID |
|-------|----------|-------------------------------|------|-------------|----------------|
| EC-FR08-004 | Cart contents | Cart contains ≥ 1 item — checkout can proceed | VALID | G3 | FR-07, FR-08 |
| EC-FR08-005 | Cart contents | Cart is empty — 0 items; checkout must be blocked | INVALID | G3 | FR-07, FR-08 |

---

#### Group 3 — Shipping Address (Input)

| EC ID | Variable | Equivalence Class Description | Type | EP Guideline | Source Req. ID |
|-------|----------|-------------------------------|------|-------------|----------------|
| EC-FR08-006 | `shipping_address` | Non-empty string, 1–255 characters — valid address provided | VALID | G1 | FR-08 |
| EC-FR08-007 | `shipping_address` | Empty string / whitespace-only — no address provided | INVALID | G1 (below lower bound) | FR-08 |
| EC-FR08-008 | `shipping_address` | String > 255 characters — exceeds UI safety baseline (stress boundary) | INVALID | G1 (above upper bound) | FR-08 (HITL resolution: 255-char baseline) |

---

#### Group 4 — `total_amount` Field in Checkout Request (Input — Security)

| EC ID | Variable | Equivalence Class Description | Type | EP Guideline | Source Req. ID |
|-------|----------|-------------------------------|------|-------------|----------------|
| EC-FR08-009 | `total_amount` (request body) | Value matches the actual server-computed cart total — sent correctly | VALID | G3 | FR-08 |
| EC-FR08-010 | `total_amount` (request body) | Value is deliberately tampered — does NOT match server-computed total (e.g., sent as 1 ₫) | INVALID | G3 (Must-Be: backend must recalculate and ignore client value) | FR-08 |

> ⚠️ Note: EC-FR08-010 is a **security test class** — the expected result for BOTH EC-FR08-009 and EC-FR08-010 is that the backend uses its own recalculated value. The test verifies the backend ignores the client-supplied total.

---

#### Group 5 — Coupon Code: Code Existence & Activity (FR-09 C1)

| EC ID | Variable | Equivalence Class Description | Type | EP Guideline | Source Req. ID |
|-------|----------|-------------------------------|------|-------------|----------------|
| EC-FR08-011 | `coupon_code` (existence) | Code exists in DB AND `is_active = 1` — condition C1 satisfied | VALID | G3 | FR-09 (C1) |
| EC-FR08-012 | `coupon_code` (existence) | Code does NOT exist in the DB — unknown coupon | INVALID | G3 | FR-09 (C1) |
| EC-FR08-013 | `coupon_code` (existence) | Code exists BUT `is_active = 0` — coupon is inactive/disabled | INVALID | G4 (split of invalid: different failure reason from non-existent code) | FR-09 (C1) |
| EC-FR08-014 | `coupon_code` (format) | Empty string — no coupon entered (coupon field left blank) | VALID | G3 | FR-09 (coupon is optional) |

---

#### Group 6 — Coupon Code: Expiry Date (FR-09 C2)

| EC ID | Variable | Equivalence Class Description | Type | EP Guideline | Source Req. ID |
|-------|----------|-------------------------------|------|-------------|----------------|
| EC-FR08-015 | Coupon `expired_at` | Current date < `expired_at` (date-only comparison) — coupon not yet expired | VALID | G1 | FR-09 (C2) |
| EC-FR08-016 | Coupon `expired_at` | Current date = `expired_at` — coupon expires today (boundary: exact expiry date) | INVALID | G1 (at/beyond upper bound: `<` is strict, so equal = expired) | FR-09 (C2) |
| EC-FR08-017 | Coupon `expired_at` | Current date > `expired_at` — coupon has definitively expired in the past | INVALID | G1 (above upper bound) | FR-09 (C2) |

---

#### Group 7 — Coupon Code: Minimum Order Amount (FR-09 C3)

| EC ID | Variable | Equivalence Class Description | Type | EP Guideline | Source Req. ID |
|-------|----------|-------------------------------|------|-------------|----------------|
| EC-FR08-018 | Order total vs. `min_order_amount` | Order total >= `min_order_amount` — minimum order condition met | VALID | G1 | FR-09 (C3) |
| EC-FR08-019 | Order total vs. `min_order_amount` | Order total < `min_order_amount` — minimum order NOT met | INVALID | G1 (below lower bound) | FR-09 (C3) |

---

#### Group 8 — Coupon Code: Usage Limit Per User (FR-09 C5)

| EC ID | Variable | Equivalence Class Description | Type | EP Guideline | Source Req. ID |
|-------|----------|-------------------------------|------|-------------|----------------|
| EC-FR08-020 | Usage count vs. `max_uses_per_user` | User usage count < `max_uses_per_user` — limit not yet reached | VALID | G1 | FR-09 (C5) |
| EC-FR08-021 | Usage count vs. `max_uses_per_user` | User usage count = `max_uses_per_user` — limit exactly reached (boundary) | INVALID | G1 (at upper bound; condition requires count < max, so equal = blocked) | FR-09 (C5) |
| EC-FR08-022 | Usage count vs. `max_uses_per_user` | User usage count > `max_uses_per_user` — limit exceeded | INVALID | G1 (above upper bound) | FR-09 (C5) |

---

#### Group 9 — Coupon Type & Discount Calculation (FR-09)

| EC ID | Variable | Equivalence Class Description | Type | EP Guideline | Source Req. ID |
|-------|----------|-------------------------------|------|-------------|----------------|
| EC-FR08-023 | Coupon `type` | `percent` — discount = Math.round(total × discount_value / 100) | VALID | G2 | FR-09 |
| EC-FR08-024 | Coupon `type` | `fixed` — discount = discount_value (flat deduction in ₫) | VALID | G2 | FR-09 |
| EC-FR08-025 | Coupon `type` | Any value other than `percent` or `fixed` — invalid coupon type | INVALID | G2 (one combined invalid class for non-enumerated values) | FR-09, FR-17 |

---

#### Group 10 — Output Variables

| EC ID | Variable | Equivalence Class Description | Type | EP Guideline | Source Req. ID |
|-------|----------|-------------------------------|------|-------------|----------------|
| EC-FR08-026 | Order placement result | Successful checkout — HTTP 200, order created with status `pending`, cart cleared | VALID OUTPUT | G3 | FR-08, FR-10 |
| EC-FR08-027 | Cart state after checkout | Cart is cleared (0 items) immediately following successful checkout | VALID OUTPUT | G3 | FR-08 |
| EC-FR08-028 | Coupon applied — percent discount output | `discount_amount` and `final_amount` correctly computed (percent formula, Math.round applied) | VALID OUTPUT | G2 | FR-09 |
| EC-FR08-029 | Coupon applied — fixed discount output | `discount_amount` = fixed value; `final_amount = total − discount_value` | VALID OUTPUT | G2 | FR-09 |
| EC-FR08-030 | Checkout rejected — unauthenticated | HTTP 401 / redirect to login page | INVALID OUTPUT | G3 | FR-08, SEC-02 |
| EC-FR08-031 | Checkout rejected — empty cart | Error shown; checkout blocked; cart page shown with empty-state message | INVALID OUTPUT | G3 | FR-07, FR-08 |
| EC-FR08-032 | Coupon error — code not found / inactive (C1 fail) | Error message displayed to user (code invalid or inactive) | INVALID OUTPUT | G3 | FR-09 (C1) |
| EC-FR08-033 | Coupon error — expired (C2 fail) | Error message displayed (coupon has expired) | INVALID OUTPUT | G3 | FR-09 (C2) |
| EC-FR08-034 | Coupon error — min order not met (C3 fail) | Error message displayed (order total below minimum required) | INVALID OUTPUT | G3 | FR-09 (C3) |
| EC-FR08-035 | Coupon error — usage limit reached (C5 fail) | Error message displayed (max uses per user exceeded) | INVALID OUTPUT | G3 | FR-09 (C5) |
| EC-FR08-036 | Security: backend ignores client `total_amount` | Order total in DB matches server-recalculated value regardless of what client sent | VALID OUTPUT (security assertion) | G3 | FR-08 |
| EC-FR08-037 | GUI — Breadcrumb navigation | Breadcrumb trail visible on Checkout page | VALID OUTPUT | G3 | FR-23 |
| EC-FR08-038 | GUI — Single `<h1>` tag | Exactly one `<h1>` tag rendered on the checkout page | VALID OUTPUT | G3 | FR-21 |
| EC-FR08-039 | GUI — Error message position | Validation/coupon error messages appear **above** the submit button | VALID OUTPUT | G3 | FR-22 |
| EC-FR08-040 | GUI — Submit button color | Checkout/submit button uses blue color (positive action) | VALID OUTPUT | G3 | FR-21 |
| EC-FR08-041 | GUI — Currency display | Total amount displayed in ₫ with thousands-separator formatting | VALID OUTPUT | G3 | FR-21 |

---

### Guideline Application Summary

| Variable / Group | G1 (Range) | G2 (Discrete Set) | G3 (Must-Be) | G4 (Split) | Notes |
|-----------------|:-----------:|:-----------------:|:------------:|:----------:|-------|
| JWT Token | | | ✓ | ✓ | G4 applied to split "no token" vs. "invalid token" — different server error paths |
| Cart contents | | | ✓ | | Must-be: non-empty cart |
| `shipping_address` | ✓ | | | | Range: 1–255 chars (HITL-resolved baseline) |
| `total_amount` (client) | | | ✓ | | Must-be: backend recalculates regardless |
| Coupon code — existence | | | ✓ | ✓ | G4 applied to split "not found" vs. "inactive" |
| Coupon code — optional (blank) | | | ✓ | | Blank = valid (no coupon applied) |
| Coupon expiry (C2) | ✓ | | | | Ordered date range: current date < expired_at |
| Coupon min order (C3) | ✓ | | | | Numeric range: order total >= min_order_amount |
| Coupon usage count (C5) | ✓ | | | | Range: count < max_uses_per_user |
| Coupon `type` | | ✓ | | | Discrete set: {percent, fixed} |
| Output variables (all) | | | ✓ | | G3: each output is a must-be condition (success or specific error) |

---

### EC Count Summary

| Category | Count |
|----------|-------|
| VALID input/pre-condition classes | 10 |
| INVALID input/pre-condition classes | 14 |
| VALID OUTPUT classes | 11 |
| INVALID OUTPUT classes | 6 |
| **Total EC count** | **41** |

> EC IDs: EC-FR08-001 through EC-FR08-041

---

### Self-Audit (AGENTS.md §7 — Domain Analysis Gate)

```
[x] All input AND output variables from Phase 1 are partitioned
[x] At least 1 valid + all applicable invalid classes per variable
[x] All 4 EP guidelines applied and documented (G1 ×4, G2 ×2, G3 ×10, G4 ×2)
[x] Every class labelled with a unique EC ID (EC-FR08-001 → EC-FR08-041)
[x] Classes are mutually exclusive and collectively exhaustive
[x] Every class traces to a requirement (FR-07, FR-08, FR-09, FR-10, FR-17, FR-21, FR-22, FR-23, SEC-02)
```

---

### Open Issues for HITL

- [ ] **EC-FR08-016 (expiry = today boundary):** Confirm system behavior when current date equals `expired_at` exactly. HITL-resolved interpretation: expiry at midnight means `current_date == expired_at` is treated as **expired** (INVALID). Verify in Phase 3 BVA with date = expiry date test.
- [ ] **EC-FR08-008 (shipping_address > 255 chars):** This boundary is not formally defined in the SRS — derived from HITL resolution. Treat as a stress test. Actual DB/API behavior at this boundary must be observed during test execution.
- [ ] **EC-FR08-010 vs. EC-FR08-009 (tampered total_amount):** Both classes should result in order placement succeeding with the server-recalculated value. The test verifies the **server-side security assertion** (FR-08), not a user-facing error. HITL to confirm test execution approach (API-level test via Postman recommended).

---

**HITL Review:** Accepted
