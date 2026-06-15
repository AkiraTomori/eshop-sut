# Test Summary Report — FR-08: Checkout
**Pool:** B
**Test Cycle:** HW02 Domain Testing — Domain Testing (EP + BVA)
**Date Range:** 2026-06-14 to 2026-06-14
**Revised:** 2026-06-15 — FR-09 coupon content removed; counts updated
**Tester:** Thái Minh Huy + Gemini QA Agent
**SRS Version:** 2.0 (2026-05-14)
**Feature Under Test:** FR-08 (Checkout — Web Frontend)

---

## 1. Summary

This report summarises the test execution results for **FR-08 Checkout** on the eShop Web Frontend SUT running locally at `http://localhost:5173` (frontend) and `http://localhost:3000` (backend API).

A total of **17 test cases** were designed using Domain Testing methodology (Equivalence Partitioning + Boundary Value Analysis) and executed against the live system. The test cycle covered all 20 equivalence classes (EP table) and all 8 boundary value points (BVA table) derived from the SRS and API specification for FR-08 only.

**Overall assessment:** The checkout feature is **not ready for production release**. Critical findings include a **price tampering security vulnerability** (backend accepts any client-supplied order total without recalculation), missing address validation at both the UI and backend layers, and several GUI compliance failures (missing `<h1>`, green instead of blue button, absent breadcrumb). A **No-Go** recommendation is made until all Fatal and Serious defects are resolved.

---

## 2. Test Execution Summary

### By Test Case Type

| Type | Total | Passed | Failed | Blocked | Skipped | Not Run | Pass Rate |
|------|:-----:|:------:|:------:|:-------:|:-------:|:-------:|:---------:|
| EP (Equivalence Partitioning) | 3 | 1 | **2** | 0 | 0 | 0 | 33.3% |
| NEG (Invalid / Negative) | 7 | 3 | **4** | 0 | 0 | 0 | 42.9% |
| BV (Boundary Value) | 7 | 5 | **2** | 0 | 0 | 0 | 71.4% |
| **TOTAL** | **17** | **9** | **8** | **0** | **0** | **0** | **52.9%** |

### BVA Section Breakdown

| BVA Section | Variable | TCs | Passed | Failed | Pass Rate |
|-------------|----------|:---:|:------:|:------:|:---------:|
| BV-A | `shipping_address` length | 7 | 5 | 2 | 71.4% |

### Failed Test Cases

| TC ID | Type | Title | Bug Filed |
|-------|:----:|-------|-----------|
| TC-FR08-EP-001 | EP | Checkout with valid cart, auth user, valid address | BUG-FR08-001, BUG-FR08-002, BUG-FR08-003 |
| TC-FR08-EP-003 | EP | Breadcrumb and error message position on checkout page | BUG-FR08-005, BUG-FR08-006 |
| TC-FR08-NEG-004 | NEG | Checkout with empty shipping address | BUG-FR08-006, BUG-FR08-007 |
| TC-FR08-NEG-005 | NEG | Tampered total_amount in API request | BUG-FR08-008 |
| TC-FR08-NEG-006 | NEG | Checkout with whitespace-only shipping address | BUG-FR08-006, BUG-FR08-007 |
| TC-FR08-NEG-007 | NEG | Checkout page h1 tag and button color check | BUG-FR08-001, BUG-FR08-002 |
| TC-FR08-BV-005 | BV | Empty shipping address — LB-1 (0 chars) | BUG-FR08-006, BUG-FR08-007 |
| TC-FR08-BV-006 | BV | 256-char shipping address — UB+1 | BUG-FR08-009 |

---

## 3. Defect Summary

### 3.1 All Defects Found (8 Total)

| Bug ID | Severity | Type | Problem Summary | Status |
|--------|:--------:|------|-----------------|:------:|
| BUG-FR08-001 | Medium | User Interface | No `<h1>` on checkout page — uses `<h2>` (FR-21 violation) | New |
| BUG-FR08-002 | Cosmetic | User Interface | Checkout button is green instead of required blue (FR-21 violation) | New |
| BUG-FR08-003 | Serious | Business Logic | Cart not cleared after successful order placement | New |
| BUG-FR08-005 | Medium | Feature Missing | Breadcrumb navigation absent from checkout page (FR-22 violation) | New |
| BUG-FR08-006 | Serious | Functionality | No UI error message displayed when shipping address is empty or whitespace | New |
| BUG-FR08-007 | Serious | Data / DB Integrity | Backend API accepts orders with empty or whitespace-only shipping_address | New |
| BUG-FR08-008 | **Fatal** | Security / Access Control | Backend stores client-supplied `total_amount` without recalculation — price tampering succeeds | New |
| BUG-FR08-009 | Medium | Functionality | No enforcement of 255-char maximum on `shipping_address` (256+ chars accepted at all layers) | New |

### 3.2 Defect Statistics by Severity

| Severity | Count | % of Total | Release Impact |
|----------|:-----:|:----------:|----------------|
| **Fatal** | **1** | **12.5%** | Must be zero before any production deployment |
| **Serious** | **3** | **37.5%** | All must be resolved or have PM sign-off before release |
| **Medium** | **3** | **37.5%** | Should be resolved; may be deferred with PM approval |
| **Cosmetic** | **1** | **12.5%** | May be deferred to next sprint |
| **TOTAL** | **8** | 100% | — |

### 3.3 Defect Statistics by Type

| Defect Type | Count | Bugs |
|-------------|:-----:|------|
| User Interface | 2 | BUG-FR08-001, BUG-FR08-002 |
| Functionality (Validation) | 2 | BUG-FR08-006, BUG-FR08-009 |
| Data / DB Integrity | 1 | BUG-FR08-007 |
| Business Logic | 1 | BUG-FR08-003 |
| Security / Access Control | 1 | BUG-FR08-008 |
| Feature Missing | 1 | BUG-FR08-005 |

### 3.4 Defect Statistics by Feature Area

| Feature Area | Bugs | Total | Highest Severity |
|-------------|------|:-----:|:----------------:|
| FR-08 Checkout — Input Validation (address) | BUG-FR08-006, 007, 009 | 3 | Serious |
| FR-08 Checkout — GUI / Page Standards | BUG-FR08-001, 002, 005 | 3 | Medium |
| FR-08 Checkout — Core Flow | BUG-FR08-003, 008 | 2 | **Fatal** |

---

## 4. EC Coverage Summary

| Phase | Total ECs | Covered (Passing TCs) | Exposed by Failing TCs |
|-------|:---------:|:---------------------:|:----------------------:|
| Valid input/pre-condition ECs (EC-001→010) | 7 | 5 (JWT valid, cart non-empty, address valid, total correct, no coupon) | 2 (EC-007 empty addr, EC-010 tampered total) |
| Valid output ECs (EC-011→015) | 5 | 2 (successful order, cart cleared) | 3 (EC-012 cart not cleared, EC-015 total not recalculated, EC-016 breadcrumb) |
| GUI output ECs (EC-016→020) | 5 | 2 (currency display) | 3 (EC-016 breadcrumb, EC-017 h1, EC-019 button color) |
| Invalid output ECs (EC-013, EC-014) | 2 | 2 | 0 |

---

## 5. Open Points / Risks

| # | Risk / Open Point | Severity | Recommended Action |
|---|-------------------|:--------:|--------------------|
| 1 | **BUG-FR08-008 — Price Tampering** is a security exploit reachable by any authenticated user via Postman or browser DevTools. | Fatal | Escalate immediately. Patch backend to ignore client `total_amount` and recalculate from the server-side cart. Block production deployment until fixed. |
| 2 | **BUG-FR08-007 / BUG-FR08-006** reveal a complete absence of server-side and frontend input validation on `shipping_address`. Any order with an empty or whitespace-only delivery address cannot be fulfilled. | Serious | Add `trim()`, non-empty check to the checkout route. Add frontend validation with error message display above the submit button. |
| 3 | **BUG-FR08-003** (cart not cleared): The frontend likely does not call the cart-clear API on order success. Risk of duplicate orders if user navigates back and clicks "Place Order" again from a stale cart. | Serious | Verify whether `DELETE /api/cart` or equivalent is called on success callback. |
| 4 | **BUG-FR08-009** combined with BUG-FR08-007 reveals no backend validation layer on `shipping_address` whatsoever — no empty check, no length cap. A single middleware addition (`express-validator` or equivalent) could fix both. | Medium | Add shipping_address validation: `trim()`, `notEmpty()`, `isLength({ max: 255 })` to `POST /api/checkout` route. |
| 5 | Auth validation (NEG-001, NEG-002) and cart-empty validation (NEG-003) are correctly implemented — both blocks tested at 100% pass rate. | Low | No action required. These modules are stable. |
| 6 | All 4 valid `shipping_address` length boundary points (BV-001 to BV-004) passed — the system correctly accepts addresses from 1 to 255 characters. | Low | No action required. |

---

## 6. Release Recommendation

☐ Go &nbsp;|&nbsp; **☒ No-Go** &nbsp;|&nbsp; ☐ Conditional Go

**Recommendation: NO-GO**

**Rationale:**
- **1 Fatal defect** remains open — BUG-FR08-008 (price tampering vulnerability) is reachable by any authenticated user and would allow orders to be placed at 1 ₫. This is an immediate business risk.
- **3 Serious defects** remain open — missing address validation allows meaningless delivery data to be stored; cart-not-cleared risks duplicate orders.
- **Pass rate of 52.9%** is far below the acceptable threshold for a financial checkout flow (minimum ≥ 95% required for production).

**Conditional Go conditions** _(if deadline pressure requires partial release)_:
1. BUG-FR08-008 (price tampering) **MUST** be fixed and re-verified — non-negotiable security requirement.
2. BUG-FR08-007 (backend accepts empty address) **MUST** be fixed — orders without a delivery address cannot be shipped.
3. BUG-FR08-003 (cart not cleared) **MUST** be fixed — risk of duplicate orders.
4. Remaining Medium/Cosmetic defects may be deferred with explicit PM sign-off.

---

*Test Summary Report generated by: Gemini QA Agent + Thái Minh Huy*
*Date: 2026-06-15 (revised — FR-09 coupon content removed)*
*Next action: HITL to file GitHub Issues, attach screenshots, and commit this report.*
