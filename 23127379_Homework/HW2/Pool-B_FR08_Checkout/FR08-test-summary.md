# Test Summary Report — FR-08: Checkout + FR-09: Coupon Code
**Pool:** B
**Test Cycle:** HW02 Domain Testing — Domain Testing (EP + BVA)
**Date Range:** 2026-06-14 to 2026-06-14
**Tester:** Thái Minh Huy + Gemini QA Agent
**SRS Version:** 2.0 (2026-05-14)
**Features Under Test:** FR-08 (Checkout), FR-09 (Coupon Code Application)

---

## 1. Summary

This report summarises the test execution results for **FR-08 Checkout** and **FR-09 Coupon Code** on the eShop Web Frontend SUT running locally at `http://localhost:5173` (frontend) and `http://localhost:3000` (backend API).

A total of **41 test cases** were designed using Domain Testing methodology (Equivalence Partitioning + Boundary Value Analysis) and executed against the live system. The test cycle covered all 41 equivalence classes (EP table) and all 26 boundary value points (BVA table) derived from the SRS and API specification.

**Overall assessment:** The checkout and coupon features are **not ready for production release**. Critical findings include a **price tampering security vulnerability** (backend accepts any client-supplied order total without recalculation) and a **fatal coupon discount formula error** (percent discount inflates order total by 10× instead of reducing it by 10%). Additionally, core checkout validation failures (empty address accepted, cart not cleared post-checkout, coupon percent discount not visible in UI) collectively degrade the user experience and data integrity. A **No-Go** recommendation is made until all Fatal and Serious defects are resolved.

---

## 2. Test Execution Summary

### By Test Case Type

| Type | Total | Passed | Failed | Blocked | Skipped | Not Run | Pass Rate |
|------|:-----:|:------:|:------:|:-------:|:-------:|:-------:|:---------:|
| EP (Equivalence Partitioning) | 5 | 2 | **3** | 0 | 0 | 0 | 40.0% |
| NEG (Invalid / Negative) | 14 | 10 | **4** | 0 | 0 | 0 | 71.4% |
| BV (Boundary Value) | 22 | 18 | **4** | 0 | 0 | 0 | 81.8% |
| **TOTAL** | **41** | **30** | **11** | **0** | **0** | **0** | **73.2%** |

### By BVA Section

| BVA Section | Variable | TCs | Passed | Failed | Pass Rate |
|-------------|----------|:---:|:------:|:------:|:---------:|
| BV-A | `shipping_address` length | 7 | 5 | 2 | 71.4% |
| BV-B | Coupon `expired_at` date | 5 | 5 | 0 | 100.0% |
| BV-C | Order total vs. `min_order_amount` | 5 | 3 | 2 | 60.0% |
| BV-D | Usage count vs. `max_uses_per_user` | 5 | 5 | 0 | 100.0% |

### Failed Test Cases

| TC ID | Type | Title | Bug Filed |
|-------|:----:|-------|-----------|
| TC-FR08-EP-001 | EP | Place order with valid data — checkout page | BUG-FR08-001, BUG-FR08-002, BUG-FR08-003 |
| TC-FR08-EP-002 | EP | Apply SAVE10 percent coupon at checkout | BUG-FR08-004 |
| TC-FR08-EP-005 | EP | Verify checkout GUI and coupon on first use (VIP100) | BUG-FR08-005, BUG-FR08-006 |
| TC-FR08-NEG-004 | NEG | Checkout with empty shipping address | BUG-FR08-006, BUG-FR08-007 |
| TC-FR08-NEG-005 | NEG | Tampered total_amount in API request | BUG-FR08-008 |
| TC-FR08-NEG-013 | NEG | Checkout with whitespace-only shipping address | BUG-FR08-006, BUG-FR08-007 |
| TC-FR08-NEG-014 | NEG | Checkout page GUI structure check | BUG-FR08-001, BUG-FR08-002 |
| TC-FR08-BV-005 | BV | Shipping address = 0 chars (LB-1) | BUG-FR08-006, BUG-FR08-007 |
| TC-FR08-BV-006 | BV | Shipping address = 256 chars (UB+1) | BUG-FR08-009 |
| TC-FR08-BV-014 | BV | Coupon at exact min_order_amount = 300,000 ₫ (LB) | BUG-FR08-010 |
| TC-FR08-BV-015 | BV | Coupon at 300,001 ₫ (LB+1) — discount calculation | BUG-FR08-011 |

---

## 3. Defect Summary

### 3.1 All Defects Found (11 Total)

| Bug ID | Severity | Type | Problem Summary | Status |
|--------|:--------:|------|-----------------|:------:|
| BUG-FR08-001 | Medium | User Interface | No `<h1>` on checkout/cart page — uses `<h2>` instead (FR-21 violation) | New |
| BUG-FR08-002 | Cosmetic | User Interface | Checkout button is green instead of required blue (FR-21 violation) | New |
| BUG-FR08-003 | Serious | Business Logic | Cart not cleared after successful order placement | New |
| BUG-FR08-004 | Serious | Business Logic | SAVE10 percent coupon accepted but UI total remains unchanged | New |
| BUG-FR08-005 | Medium | Feature Missing | Breadcrumb navigation absent from checkout page (FR-22 violation) | New |
| BUG-FR08-006 | Serious | Functionality | No UI error message displayed when shipping address is empty or whitespace | New |
| BUG-FR08-007 | Serious | Data / DB Integrity | Backend API accepts orders with empty or whitespace-only shipping_address | New |
| BUG-FR08-008 | **Fatal** | Security / Access Control | Backend stores client-supplied `total_amount` without recalculation — price tampering succeeds | New |
| BUG-FR08-009 | Medium | Functionality | No enforcement of 255-char maximum on `shipping_address` (256+ chars accepted at all layers) | New |
| BUG-FR08-010 | Serious | Coding Logic | `min_order_amount` check uses strict `>` — coupon rejected at exact minimum (≥ should be used) | New |
| BUG-FR08-011 | **Fatal** | Coding Logic | Percent coupon discount formula computes `total × rate` instead of `total × rate / 100` — inflates order total by 10× | New |

### 3.2 Defect Statistics by Severity

| Severity | Count | % of Total | Release Impact |
|----------|:-----:|:----------:|----------------|
| **Fatal** | **2** | **18.2%** | Must be zero before any production deployment |
| **Serious** | **5** | **45.5%** | All must be resolved or have PM sign-off before release |
| **Medium** | **3** | **27.3%** | Should be resolved; may be deferred with PM approval |
| **Cosmetic** | **1** | **9.1%** | May be deferred to next sprint |
| **TOTAL** | **11** | 100% | — |

### 3.3 Defect Statistics by Type

| Defect Type | Count | Bugs |
|-------------|:-----:|------|
| Business Logic | 2 | BUG-FR08-003, BUG-FR08-004 |
| Coding Logic | 2 | BUG-FR08-010, BUG-FR08-011 |
| User Interface | 2 | BUG-FR08-001, BUG-FR08-002 |
| Functionality (Other) | 2 | BUG-FR08-006, BUG-FR08-009 |
| Data / DB Integrity | 1 | BUG-FR08-007 |
| Security / Access Control | 1 | BUG-FR08-008 |
| Feature Missing | 1 | BUG-FR08-005 |

### 3.4 Defect Statistics by Feature Area

| Feature Area | Bugs | Total | Highest Severity |
|-------------|------|:-----:|:----------------:|
| FR-09 Coupon Code (apply + calculate) | BUG-FR08-004, 010, 011 | 3 | **Fatal** |
| FR-08 Checkout — Input Validation (address) | BUG-FR08-006, 007, 009 | 3 | Serious |
| FR-08 Checkout — GUI / Page Standards | BUG-FR08-001, 002, 005 | 3 | Medium |
| FR-08 Checkout — Core Flow | BUG-FR08-003, 008 | 2 | **Fatal** |

---

## 4. EC Coverage Summary

| Phase | Total ECs | ECs Covered by Passing TCs | ECs Exposed by Failing TCs |
|-------|:---------:|:---------------------------:|:--------------------------:|
| EP Valid Classes | 14 | 11 | 3 _(EC-FR08-037/038/039 for GUI; EC-FR08-028 for discount)_ |
| EP Invalid Classes | 27 | 21 | 6 _(EC-FR08-007 empty addr, EC-FR08-010 tamper, EC-FR08-008 over-length)_ |
| BVA Points | 26 | 22 | 4 _(BV-005/006 empty+over addr; BV-016/017 min_order boundary)_ |

---

## 5. Open Points / Risks

| # | Risk / Open Point | Severity | Recommended Action |
|---|-------------------|:--------:|--------------------|
| 1 | **BUG-FR08-008 — Price Tampering** is a security exploit reachable by any authenticated user via Postman or browser DevTools. | Fatal | Escalate immediately. Patch backend to ignore client `total_amount` and recalculate from cart. Block production deployment until fixed. |
| 2 | **BUG-FR08-011 — Discount Formula** inflates the final order amount by 10× when any percent coupon is applied. The formula `total × rate` must become `total × rate / 100`. | Fatal | Patch and regression-test all percent coupon test cases (BV-C section) before re-releasing coupon feature. |
| 3 | **BUG-FR08-010** (strict `>` operator) and **BUG-FR08-011** (formula error) are in the same `/api/apply-coupon` endpoint — they may share a code module. A single code review of the coupon service is recommended. | Serious | Assign to same developer; single PR fix for the coupon calculation module. |
| 4 | **BUG-FR08-003** (cart not cleared): The frontend likely does not call the cart-clear API on order success. Risk of duplicate orders if user navigates back and clicks "Place Order" again from a stale cart. | Serious | Verify whether `DELETE /api/cart` or equivalent is called on success callback. |
| 5 | **BUG-FR08-007 / BUG-FR08-009** reveal a complete absence of server-side input validation on `shipping_address`. The backend should add: `trim()`, non-empty check, and `maxlength(255)` constraint at the API layer. | Serious | Add `express-validator` or equivalent middleware to the checkout route. |
| 6 | **BUG-FR08-004 vs BUG-FR08-011**: The frontend shows the total unchanged (BUG-FR08-004) while the API may be returning a catastrophically wrong value (BUG-FR08-011). After BUG-FR08-011 is patched, BUG-FR08-004 must be re-tested to confirm whether it is a separate frontend display issue or was masking the API bug. | — | Re-test TC-FR08-EP-002 after BUG-FR08-011 backend fix. |
| 7 | Coupon expiry (BV-B) and usage count (BV-D) enforcement are correctly implemented — all 10 boundary points in these areas passed. | Low | No action required. These modules are stable. |

---

## 6. Release Recommendation

☐ Go &nbsp;|&nbsp; **☒ No-Go** &nbsp;|&nbsp; ☐ Conditional Go

**Recommendation: NO-GO**

**Rationale:**
- **2 Fatal defects** remain open — both in the core financial transaction path. Production deployment with these defects would expose the business to direct financial loss (price tampering) and incorrect billing (discount formula).
- **5 Serious defects** remain open — including missing cart-clear, missing address validation, and a wrong comparison operator that incorrectly blocks valid coupon use at the exact minimum threshold.
- **Pass rate of 73.2%** is below an acceptable release threshold for a checkout flow (typically ≥ 95% required for financial features).

**Conditional Go conditions** _(if deadline pressure requires partial release)_:
1. BUG-FR08-008 (price tampering) MUST be fixed and re-verified — non-negotiable security requirement.
2. BUG-FR08-011 (discount formula) MUST be fixed and re-verified — financial correctness requirement.
3. BUG-FR08-007 (backend accepts empty address) MUST be fixed — orders with no delivery address cannot be fulfilled.
4. Remaining Serious/Medium defects may be deferred to next sprint with explicit PM sign-off and GitHub Issues tracking.

---

*Test Summary Report generated by: Gemini QA Agent + Thái Minh Huy*
*Date: 2026-06-14*
*Next action: HITL to file remaining GitHub Issues, attach screenshots, and commit this report.*
