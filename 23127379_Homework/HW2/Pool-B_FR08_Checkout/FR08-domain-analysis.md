## Domain Analysis (Equivalence Partitioning) — FR-08: Checkout
**Date:** 2026-06-14 08:08 (revised: 2026-06-15 — FR-09 coupon content removed)
**Analyst:** Gemini QA Agent (reviewed by: Thái Minh Huy)
**Based on:** FR08-requirement-analysis.md (revised 2026-06-15)

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
| EC-FR08-007 | `shipping_address` | Empty string or whitespace-only — no meaningful address provided | INVALID | G1 (below lower bound) | FR-08 |
| EC-FR08-008 | `shipping_address` | String > 255 characters — exceeds UI safety baseline (stress boundary) | INVALID | G1 (above upper bound) | FR-08 (HITL resolution: 255-char baseline) |

---

#### Group 4 — `total_amount` Field in Checkout Request (Input — Security)

| EC ID | Variable | Equivalence Class Description | Type | EP Guideline | Source Req. ID |
|-------|----------|-------------------------------|------|-------------|----------------|
| EC-FR08-009 | `total_amount` (request body) | Value matches the actual server-computed cart total — sent correctly | VALID | G3 | FR-08 |
| EC-FR08-010 | `total_amount` (request body) | Value is deliberately tampered — does NOT match server-computed total (e.g., sent as 1 ₫) | INVALID | G3 (Must-Be: backend must recalculate and ignore client value) | FR-08 |

> ⚠️ Note: EC-FR08-010 is a **security test class** — the expected result for BOTH EC-FR08-009 and EC-FR08-010 is that the backend uses its own recalculated value. The test verifies the backend ignores the client-supplied total.

---

#### Group 5 — Output Variables

| EC ID | Variable | Equivalence Class Description | Type | EP Guideline | Source Req. ID |
|-------|----------|-------------------------------|------|-------------|----------------|
| EC-FR08-011 | Order placement result | Successful checkout — HTTP 200, order created with status `pending`, cart cleared | VALID OUTPUT | G3 | FR-08, FR-10 |
| EC-FR08-012 | Cart state after checkout | Cart is cleared (0 items) immediately following successful checkout | VALID OUTPUT | G3 | FR-08 |
| EC-FR08-013 | Checkout rejected — unauthenticated | HTTP 401 / redirect to login page | INVALID OUTPUT | G3 | FR-08, SEC-02 |
| EC-FR08-014 | Checkout rejected — empty cart | Error shown; checkout blocked; cart page shown with empty-state message | INVALID OUTPUT | G3 | FR-07, FR-08 |
| EC-FR08-015 | Security: backend ignores client `total_amount` | Order total in DB matches server-recalculated value regardless of what client sent | VALID OUTPUT (security assertion) | G3 | FR-08 |
| EC-FR08-016 | GUI — Breadcrumb navigation | Breadcrumb trail visible on Checkout page (e.g., Trang chủ > Giỏ hàng > Thanh toán) | VALID OUTPUT | G3 | FR-23 |
| EC-FR08-017 | GUI — Single `<h1>` tag | Exactly one `<h1>` tag rendered on the checkout page | VALID OUTPUT | G3 | FR-21 |
| EC-FR08-018 | GUI — Error message position | Validation error messages appear **above** the submit button | VALID OUTPUT | G3 | FR-22 |
| EC-FR08-019 | GUI — Submit button color | Checkout/submit button uses blue color (positive action) | VALID OUTPUT | G3 | FR-21 |
| EC-FR08-020 | GUI — Currency display | Total amount displayed in ₫ with thousands-separator formatting | VALID OUTPUT | G3 | FR-21 |

---

### Guideline Application Summary

| Variable / Group | G1 (Range) | G2 (Discrete Set) | G3 (Must-Be) | G4 (Split) | Notes |
|-----------------|:-----------:|:-----------------:|:------------:|:----------:|-------|
| JWT Token | | | ✓ | ✓ | G4 applied to split "no token" vs. "invalid token" — different server error paths |
| Cart contents | | | ✓ | | Must-be: non-empty cart |
| `shipping_address` | ✓ | | | | Range: 1–255 chars (HITL-resolved baseline) |
| `total_amount` (client) | | | ✓ | | Must-be: backend recalculates regardless |
| Output variables (all) | | | ✓ | | G3: each output is a must-be condition (success or specific error) |

---

### EC Count Summary

| Category | Count |
|----------|-------|
| VALID input/pre-condition classes | 4 |
| INVALID input/pre-condition classes | 6 |
| VALID OUTPUT classes | 8 |
| INVALID OUTPUT classes | 2 |
| **Total EC count** | **20** |

> EC IDs: EC-FR08-001 through EC-FR08-020

---

### Self-Audit (AGENTS.md §7 — Domain Analysis Gate)

```
[x] All input AND output variables from Phase 1 (revised) are partitioned
[x] At least 1 valid + all applicable invalid classes per variable
[x] All 4 EP guidelines applied and documented (G1 ×1, G3 ×4, G4 ×1)
[x] Every class labelled with a unique EC ID (EC-FR08-001 → EC-FR08-020)
[x] Classes are mutually exclusive and collectively exhaustive
[x] Every class traces to a requirement (FR-07, FR-08, FR-10, FR-21, FR-22, FR-23, SEC-02)
[x] FR-09 coupon content fully removed from scope
```

---

### Open Issues for HITL

- [ ] **EC-FR08-008 (shipping_address > 255 chars):** This boundary is not formally defined in the SRS — derived from HITL resolution. Treat as a stress test. Actual DB/API behavior at this boundary must be observed during test execution.
- [ ] **EC-FR08-010 vs. EC-FR08-009 (tampered total_amount):** Both classes should result in order placement succeeding with the server-recalculated value. The test verifies the **server-side security assertion** (FR-08). HITL to confirm test execution approach (API-level test via Postman recommended).

---

**HITL Review:** Accepted (revised 2026-06-15 — FR-09 content removed)
