## Test Cases — FR-08: Checkout
**Date:** 2026-06-14 10:01 (revised: 2026-06-15 — FR-09 coupon content removed)
**Designer:** Gemini QA Agent (reviewed by: Thái Minh Huy)
**Based on:** FR08-domain-analysis.md + FR08-boundary-analysis.md (revised 2026-06-15)
**Test Environment:**
- OS: macOS / Windows 11
- Browser: Edge (latest)
- Frontend URL: http://localhost:5173
- Backend URL: http://localhost:3000
- API Tool: Postman (for API-level tests)

---

## EP Test Cases (Valid — Equivalence Partitioning)

---
**Test Case ID:** TC-FR08-EP-001
**Title:** Verify that checkout succeeds with a valid cart, authenticated user, and a valid shipping address
**Description:** Covers the primary happy-path checkout flow. Combines valid JWT (EC-FR08-001), non-empty cart (EC-FR08-004), valid shipping address in mid-range (EC-FR08-006), correct total_amount (EC-FR08-009), and expected successful order outputs (EC-FR08-011, EC-FR08-012, EC-FR08-015, EC-FR08-016, EC-FR08-017, EC-FR08-019, EC-FR08-020).
**Priority:** High
**Pre-conditions:**
  1. Backend (`http://localhost:3000`) and Frontend (`http://localhost:5173`) are running.
  2. User `test@eshop.com` / `Test1234!` is logged in.
  3. Cart contains at least 1 product (e.g., any product added from the home page).
**Steps:**
  1. Navigate to `http://localhost:5173/cart`.
  2. Verify cart is non-empty (at least 1 item displayed).
  3. Click the "Checkout" / "Thanh toán" button to proceed to the checkout page.
  4. Verify the checkout page loads and displays the full list of cart items.
  5. Verify exactly one `<h1>` tag is present on the page.
  6. Verify the total amount is displayed in ₫ format with thousands separators (e.g., `100,000 ₫`).
  7. Verify the Checkout/Submit button is blue.
  8. Enter a valid shipping address: `"123 Nguyen Hue, District 1, Ho Chi Minh City"` (42 chars).
  9. Click the "Place Order" / "Đặt hàng" button.
  10. Verify the order is placed successfully.
  11. Verify the cart is now empty.
**Test Data:**
  - Input: `shipping_address` = `"123 Nguyen Hue, District 1, Ho Chi Minh City"` (42 chars); User: `test@eshop.com`; Cart: ≥ 1 item.
  - Expected Output: Order created with status `pending`; cart cleared; HTTP 200 from `POST /api/checkout`.
**Expected Result:** The order is placed successfully. The system displays a success notification. The cart is cleared (0 items). The order appears in the user's order history with status `pending`.
**Observed Result:** The order is placed successfully. The system displays a success notification. The cart is cleared (0 items). The order appears in the user's order history with status `pending`. But there is no `<h1>` tag is present in cart page and checkout page and "Tiến thành thanh toán" button are green color, not blue color. The cart is not empty after checkout
**Status:** Failed
**EC Coverage:** EC-FR08-001, EC-FR08-004, EC-FR08-006, EC-FR08-009, EC-FR08-011, EC-FR08-012, EC-FR08-015, EC-FR08-016, EC-FR08-017, EC-FR08-019, EC-FR08-020
**Req. Ref:** FR-08, FR-21, FR-22, FR-23, FR-10
**Bug ID:** BUG-FR08-001, BUG-FR08-002, BUG-FR08-003

---
**Test Case ID:** TC-FR08-EP-002
**Title:** Verify that checkout proceeds without a coupon when the coupon field is left blank
**Description:** Covers the blank/empty coupon field as a valid scenario — no coupon is applied, and checkout completes at the full cart total.
**Priority:** Medium
**Pre-conditions:**
  1. Backend and Frontend are running.
  2. User `test@eshop.com` is logged in.
  3. Cart has at least 1 item.
**Steps:**
  1. Navigate to the checkout page.
  2. Leave the coupon code field empty (do not enter any code).
  3. Enter shipping address: `"123 Nguyen Hue, District 1, Ho Chi Minh City"`.
  4. Click "Place Order".
  5. Verify the order is placed at the full cart total (no discount applied).
**Test Data:**
  - Input: `shipping_address` = `"123 Nguyen Hue, District 1, Ho Chi Minh City"`.
  - Expected Output: Order created at the full cart total; status = `pending`.
**Expected Result:** The order is placed successfully at the full cart total with no discount. The cart is cleared after successful checkout.
**Observed Result:** As Expected Result
**Status:** Passed
**EC Coverage:** EC-FR08-001, EC-FR08-004, EC-FR08-006, EC-FR08-011, EC-FR08-012
**Req. Ref:** FR-08
**Bug ID:** None

---
**Test Case ID:** TC-FR08-EP-003
**Title:** Verify that breadcrumb navigation and error message position are correct on the checkout page
**Description:** Covers GUI requirements: breadcrumb (EC-FR08-016), error message position (EC-FR08-018). Tests FR-22 and FR-23 compliance for the checkout page.
**Priority:** Medium
**Pre-conditions:**
  1. Frontend is running.
  2. User `test@eshop.com` is logged in.
  3. Cart has at least 1 item.
**Steps:**
  1. Navigate to `http://localhost:5173/checkout`.
  2. Verify breadcrumb navigation is visible (e.g., `Trang chủ > Giỏ hàng > Thanh toán`).
  3. Attempt to click "Place Order" without entering a shipping address.
  4. Verify that the error message appears **above** the submit/checkout button (not below it).
**Test Data:**
  - Input: No shipping address for step 3.
  - Expected Output: Breadcrumb visible; error appears above submit button.
**Expected Result:** Breadcrumb navigation (e.g., `Trang chủ > Giỏ hàng > Thanh toán`) is visible at the top of the checkout page. When the shipping address is missing, an error message appears **above** (not below) the checkout button.
**Observed Result:** Breadcrumb is not visible at the top of the checkout page. When the shipping address is missing, an error message does not appear as expected.
**Status:** Failed
**EC Coverage:** EC-FR08-001, EC-FR08-004, EC-FR08-016, EC-FR08-018
**Req. Ref:** FR-22, FR-23
**Bug ID:** BUG-FR08-005, BUG-FR08-006

---

## NEG Test Cases (Invalid — one per INVALID equivalence class)

---
**Test Case ID:** TC-FR08-NEG-001
**Title:** Verify that checkout is blocked when the user is not logged in (no JWT token)
**Description:** Tests EC-FR08-002 — unauthenticated user attempts to place an order. Expected: HTTP 401 or redirect to login.
**Priority:** High
**Pre-conditions:**
  1. Backend and Frontend are running.
  2. No user is logged in (no JWT token in browser storage).
  3. Cart may contain items (added as guest or via direct API).
**Steps:**
  1. Without logging in, navigate directly to `http://localhost:5173/checkout`.
  2. Attempt to place an order (click "Place Order" or submit via API `POST /api/checkout` without `Authorization` header).
  3. Observe the system response.
**Test Data:**
  - Input: No `Authorization` header; `shipping_address` = `"123 Test St"`.
  - Expected Output: HTTP 401 Unauthorized or redirect to login page.
**Expected Result:** The system rejects the checkout attempt. The user is either redirected to the login page (`http://localhost:5173/login`) or a clear error message is displayed indicating authentication is required. No order is created in the database.
**Observed Result:** The system rejects the checkout attempt, a clear error message is displayed indicating authentication is required. No order is created in the database.
**Status:** Passed
**EC Coverage:** EC-FR08-002, EC-FR08-013
**Req. Ref:** FR-08, SEC-02
**Bug ID:** None

---
**Test Case ID:** TC-FR08-NEG-002
**Title:** Verify that checkout is rejected when the JWT token is malformed or expired
**Description:** Tests EC-FR08-003 — token is present but invalid (tampered/expired). Different failure path from EC-FR08-002 (no token vs. bad token).
**Priority:** High
**Pre-conditions:**
  1. Backend is running.
  2. A malformed or previously-expired token is available (e.g., manually altered string).
**Steps:**
  1. Send `POST /api/checkout` via Postman with `Authorization: Bearer INVALID_TAMPERED_TOKEN_XYZ`.
  2. Include a valid-looking body: `{ "total_amount": 30000000, "shipping_address": "123 Nguyen Hue, District 1, Ho Chi Minh City" }`.
  3. Observe the API response.
**Test Data:**
  - Input: `Authorization: Bearer INVALID_TAMPERED_TOKEN_XYZ`; `shipping_address` = `"123 Nguyen Hue, District 1, Ho Chi Minh City"`.
  - Expected Output: HTTP 401 or HTTP 403 with a descriptive error message.
**Expected Result:** The API returns HTTP 401 or HTTP 403. No order is created. The response body contains an error message indicating invalid/expired token. The system does not fall back to processing the request as unauthenticated.
**Observed Result:** The API returns HTTP 403 Forbidden. No order is created.
**Status:** Passed
**EC Coverage:** EC-FR08-003, EC-FR08-013
**Req. Ref:** SEC-02, FR-08
**Bug ID:** None

---
**Test Case ID:** TC-FR08-NEG-003
**Title:** Verify that checkout is blocked when the user's cart is empty
**Description:** Tests EC-FR08-005 — authenticated user with an empty cart attempts checkout. Expected: error or blocked state.
**Priority:** High
**Pre-conditions:**
  1. Backend and Frontend are running.
  2. User `test@eshop.com` is logged in.
  3. Cart is empty (all items removed or cart never populated).
**Steps:**
  1. Ensure the cart is empty (navigate to `/cart` and verify empty state message is shown).
  2. Attempt to navigate to the checkout page or click "Checkout" from the cart page.
  3. Observe whether checkout is blocked.
**Test Data:**
  - Input: Authenticated user; cart item count = 0.
  - Expected Output: Checkout is blocked; user sees an appropriate error or is redirected to the cart page with an empty-state message.
**Expected Result:** The system prevents the user from reaching or completing checkout with an empty cart. An appropriate error message or empty-state UI (with icon/illustration) is displayed. No order is created.
**Observed Result:** The system prevents the user from reaching/completing checkout with an empty cart. UI said "Giỏ hàng của bạn đang trống, tiếp tục mua sắm"
**Status:** Passed
**EC Coverage:** EC-FR08-005, EC-FR08-014
**Req. Ref:** FR-07, FR-08, FR-24
**Bug ID:** None

---
**Test Case ID:** TC-FR08-NEG-004
**Title:** Verify that checkout is rejected when the shipping address field is empty
**Description:** Tests EC-FR08-007 — shipping address is an empty string. The backend or UI must reject the order.
**Priority:** High
**Pre-conditions:**
  1. Backend and Frontend are running.
  2. User `test@eshop.com` is logged in.
  3. Cart has at least 1 item.
**Steps:**
  1. Navigate to the checkout page.
  2. Leave the `shipping_address` field completely empty.
  3. Click "Place Order".
  4. Observe the system response.
**Test Data:**
  - Input: `shipping_address` = `""` (empty string).
  - Expected Output: Error message displayed above the submit button indicating shipping address is required.
**Expected Result:** The system does not create an order. An error message (e.g., "Shipping address is required" or "Vui lòng nhập địa chỉ giao hàng") is displayed **above** the "Place Order" button. The user remains on the checkout page.
**Observed Result:** The system still creates an order. No error message like "Shipping address is required" appears.
**Status:** Failed
**EC Coverage:** EC-FR08-007
**Req. Ref:** FR-08, FR-22
**Bug ID:** BUG-FR08-006, BUG-FR08-007

---
**Test Case ID:** TC-FR08-NEG-005
**Title:** Verify that the backend ignores a tampered total_amount and recalculates the order total independently
**Description:** Tests EC-FR08-010 — client sends a deliberately incorrect `total_amount` (e.g., 1 ₫). The backend must recalculate from cart items and store the correct total. This is a security assertion test via API.
**Priority:** High
**Pre-conditions:**
  1. Backend is running.
  2. A valid JWT token for `test@eshop.com` is available.
  3. Cart contains items with a known total (e.g., 30,000,000 ₫ in DB).
**Steps:**
  1. Send `POST /api/checkout` via Postman with a valid `Authorization: Bearer <token>` header.
  2. Set the request body to: `{ "total_amount": 1, "shipping_address": "123 Nguyen Hue, District 1, Ho Chi Minh City" }`.
  3. Observe the HTTP response and the order record created in the database.
  4. Query `GET /api/orders/my-orders` to retrieve the created order.
  5. Verify the stored `total_amount` in the order record matches the actual cart total (not the client-sent `1`).
**Test Data:**
  - Input: `total_amount` = 1 (tampered); `shipping_address` = `"123 Nguyen Hue, District 1, Ho Chi Minh City"`; actual cart total = 30,000,000 ₫.
  - Expected Output: Order created with `total_amount` = 30,000,000 ₫ (server-recalculated), NOT 1 ₫.
**Expected Result:** The API returns HTTP 200 and creates an order. The order's `total_amount` in the database is 30,000,000 ₫ (the actual cart total), not 1 ₫. The backend has ignored the client-supplied value and performed its own calculation.
**Observed Result:** The API returns HTTP 200 and creates an order. The order's `total_amount` in the database is 1 ₫ (the client-sent value), not 30,000,000 ₫.
**Status:** Failed
**EC Coverage:** EC-FR08-010, EC-FR08-015
**Req. Ref:** FR-08
**Bug ID:** BUG-FR08-008

---
**Test Case ID:** TC-FR08-NEG-006
**Title:** Verify that a shipping address consisting of only whitespace characters is rejected at checkout
**Description:** Tests the whitespace-only variant of EC-FR08-007 — blank-equivalent addresses must be blocked. System/UI boundary test from BV-FR08-007.
**Priority:** Medium
**Pre-conditions:**
  1. Backend and Frontend are running.
  2. User `test@eshop.com` is logged in; cart has at least 1 item.
**Steps:**
  1. Navigate to the checkout page.
  2. In the `shipping_address` field, enter only spaces: `"     "` (5 spaces).
  3. Click "Place Order".
  4. Observe the system response.
**Test Data:**
  - Input: `shipping_address` = `"     "` (whitespace only).
  - Expected Output: Error message indicating address is required or invalid.
**Expected Result:** The system rejects the whitespace-only shipping address and displays an error message above the submit button. No order is created.
**Observed Result:** The system didn't reject the whitespace-only shipping address and didn't display an error message above the submit button. Order is still created.
**Status:** Failed
**EC Coverage:** EC-FR08-007
**Req. Ref:** FR-08, FR-22
**Bug ID:** BUG-FR08-006, BUG-FR08-007

---
**Test Case ID:** TC-FR08-NEG-007
**Title:** Verify that the checkout page displays exactly one `<h1>` tag and no duplicate heading elements
**Description:** Tests EC-FR08-017 — GUI requirement of exactly one `<h1>` tag per page (FR-21). Also confirms EC-FR08-019 (submit button is blue) and EC-FR08-020 (currency formatted correctly).
**Priority:** Low
**Pre-conditions:**
  1. Frontend is running.
  2. User `test@eshop.com` is logged in; cart has at least 1 item.
**Steps:**
  1. Navigate to `http://localhost:5173/checkout`.
  2. Open browser DevTools → Elements/Inspector.
  3. Count the number of `<h1>` elements on the page.
  4. Verify the checkout/submit button has a blue background color.
  5. Verify the displayed total amount includes the `₫` symbol and thousands separator.
**Test Data:**
  - Input: Authenticated user; non-empty cart.
  - Expected Output: Exactly 1 `<h1>` element; submit button is blue; total shown as e.g. `100,000 ₫`.
**Expected Result:** The checkout page contains exactly **one `<h1>` tag**. The "Place Order" button is styled in blue. The total amount is displayed with thousands separators and the `₫` symbol (e.g., `100,000 ₫`, not `100000`).
**Observed Result:** There is no `<h1>` element; there is `<h2>` element as heading. Submit button is not blue. The total is shown as e.g. `100,000 ₫`.
**Status:** Failed
**EC Coverage:** EC-FR08-017, EC-FR08-019, EC-FR08-020
**Req. Ref:** FR-21
**Bug ID:** BUG-FR08-001, BUG-FR08-002

---

## BV Test Cases (Boundary Value Analysis)

---
### Section BV-A: `shipping_address` Length Boundaries (Medium Risk — 4-point)

---
**Test Case ID:** TC-FR08-BV-001
**Title:** Verify that a 1-character shipping address (minimum length) is accepted at checkout
**Description:** BVA lower bound (LB = 1 char). Tests BV-FR08-001 — exact lower boundary of `shipping_address` length.
**Priority:** Medium
**Pre-conditions:**
  1. Backend and Frontend are running.
  2. User `test@eshop.com` is logged in; cart has at least 1 item.
**Steps:**
  1. Navigate to the checkout page.
  2. Enter `shipping_address` = `"A"` (exactly 1 character).
  3. Click "Place Order".
  4. Observe whether the order is accepted or rejected.
**Test Data:**
  - Input: `shipping_address` = `"A"` (1 char = LB).
  - Expected Output: Order created successfully; HTTP 200; cart cleared.
**Expected Result:** The system accepts a 1-character shipping address and places the order successfully. No validation error is displayed.
**Observed Result:** As Expected Result
**Status:** Passed
**EC Coverage:** EC-FR08-006 (via BV-FR08-001)
**Req. Ref:** FR-08
**Bug ID:** None

---
**Test Case ID:** TC-FR08-BV-002
**Title:** Verify that a 2-character shipping address (LB+1) is accepted at checkout
**Description:** BVA point LB+1 (2 chars). Tests BV-FR08-002.
**Priority:** Medium
**Pre-conditions:**
  1. Backend and Frontend are running.
  2. User `test@eshop.com` is logged in; cart has at least 1 item.
**Steps:**
  1. Navigate to the checkout page.
  2. Enter `shipping_address` = `"AB"` (2 characters).
  3. Click "Place Order".
**Test Data:**
  - Input: `shipping_address` = `"AB"` (2 chars = LB+1).
  - Expected Output: Order created successfully.
**Expected Result:** The system accepts a 2-character shipping address and places the order successfully.
**Observed Result:** As Expected Result
**Status:** Passed
**EC Coverage:** EC-FR08-006 (via BV-FR08-002)
**Req. Ref:** FR-08
**Bug ID:** None

---
**Test Case ID:** TC-FR08-BV-003
**Title:** Verify that a 254-character shipping address (UB-1) is accepted at checkout
**Description:** BVA point UB-1 (254 chars). Tests BV-FR08-003 — one step inside the upper bound.
**Priority:** Medium
**Pre-conditions:**
  1. Backend and Frontend are running.
  2. User `test@eshop.com` is logged in; cart has at least 1 item.
**Steps:**
  1. Navigate to the checkout page.
  2. Enter a 254-character string as the shipping address (e.g., `"A" × 254`).
  3. Click "Place Order".
**Test Data:**
  - Input: `shipping_address` = 254-character string (UB-1); example: `"AAAA…A"` (254 × "A").
  - Expected Output: Order created successfully.
**Expected Result:** The system accepts a 254-character shipping address and places the order successfully. No truncation or error occurs.
**Observed Result:** As Expected Result
**Status:** Passed
**EC Coverage:** EC-FR08-006 (via BV-FR08-003)
**Req. Ref:** FR-08
**Bug ID:** None

---
**Test Case ID:** TC-FR08-BV-004
**Title:** Verify that a 255-character shipping address (UB — maximum safe length) is accepted at checkout
**Description:** BVA point UB (255 chars). Tests BV-FR08-004 — exact upper bound of HITL-resolved baseline.
**Priority:** Medium
**Pre-conditions:**
  1. Backend and Frontend are running.
  2. User `test@eshop.com` is logged in; cart has at least 1 item.
**Steps:**
  1. Navigate to the checkout page.
  2. Enter a 255-character string as the shipping address (e.g., `"B" × 255`).
  3. Click "Place Order".
**Test Data:**
  - Input: `shipping_address` = 255-character string (UB = 255 × "B").
  - Expected Output: Order created successfully with the full 255-char address stored.
**Expected Result:** The system accepts a 255-character shipping address and places the order successfully. The address is stored in full (255 characters) in the order record without truncation.
**Observed Result:** As Expected Result
**Status:** Passed
**EC Coverage:** EC-FR08-006 (via BV-FR08-004)
**Req. Ref:** FR-08
**Bug ID:** None

---
**Test Case ID:** TC-FR08-BV-005
**Title:** Verify that an empty shipping address (LB-1 = 0 chars) is rejected at checkout
**Description:** BVA invalid lower bound (LB-1 = 0 = empty string). Tests BV-FR08-005. Isolated invalid test.
**Priority:** High
**Pre-conditions:**
  1. Backend and Frontend are running.
  2. User `test@eshop.com` is logged in; cart has at least 1 item.
**Steps:**
  1. Navigate to the checkout page.
  2. Leave the `shipping_address` field empty (0 characters).
  3. Click "Place Order".
**Test Data:**
  - Input: `shipping_address` = `""` (0 chars = LB-1).
  - Expected Output: Error message displayed above the submit button; no order created.
**Expected Result:** The system rejects the empty address and displays an error message above the "Place Order" button. No order is created.
**Observed Result:** The system didn't reject the empty address and not displays an error message above the "Place Order" button. Order is still created.
**Status:** Failed
**EC Coverage:** EC-FR08-007 (via BV-FR08-005)
**Req. Ref:** FR-08, FR-22
**Bug ID:** BUG-FR08-006, BUG-FR08-007

---
**Test Case ID:** TC-FR08-BV-006
**Title:** Verify system behavior when a 256-character shipping address (UB+1) is submitted at checkout
**Description:** BVA invalid upper boundary (UB+1 = 256 chars). Tests BV-FR08-006 — one step above the HITL-resolved baseline. This is a stress/mismatch detection test. Isolated invalid test.
**Priority:** Medium
**Pre-conditions:**
  1. Backend and Frontend are running.
  2. User `test@eshop.com` is logged in; cart has at least 1 item.
**Steps:**
  1. Navigate to the checkout page.
  2. Enter a 256-character string as the shipping address.
  3. Click "Place Order".
  4. Observe whether the UI, API, or database enforces the length limit.
**Test Data:**
  - Input: `shipping_address` = 256-character string (UB+1 = 256 × "C").
  - Expected Output: Error message OR order is created (revealing lack of enforcement — which is a defect finding).
**Expected Result:** One of two outcomes (document which): (a) **Expected (pass):** System rejects the 256-char address with an error message. (b) **Defect finding:** System accepts the 256-char address without error, indicating no length enforcement layer — log as a bug.
**Observed Result:** System didn't reject the 256-char address with an error message, it still accepts and creates an order.
**Status:** Failed
**EC Coverage:** EC-FR08-008 (via BV-FR08-006)
**Req. Ref:** FR-08
**Bug ID:** BUG-FR08-009

---
**Test Case ID:** TC-FR08-BV-007
**Title:** Verify system behavior when a 1000-character shipping address (DB stress boundary) is submitted at checkout
**Description:** BVA DB boundary stress test. Tests BV-FR08-008 — extremely long address to identify where (if anywhere) truncation or error occurs. Isolated stress test.
**Priority:** Low
**Pre-conditions:**
  1. Backend is running.
  2. A valid JWT for `test@eshop.com` is available (Postman).
**Steps:**
  1. Send `POST /api/checkout` via Postman with `shipping_address` = 1000-character string.
  2. Observe the API response and the stored address in the DB.
**Test Data:**
  - Input: `shipping_address` = 1000-character string (DB stress boundary test).
  - Expected Output: Error OR 200 with full/truncated address stored.
**Expected Result:** Document actual behavior: (a) API returns error (good — enforcement exists), (b) API returns 200 but address is truncated in DB (defect — silent data loss), (c) API returns 200 and full address is stored (no limit enforced — document finding).
**Observed Result:** API returns 200 and full address is stored (no limit enforced).
**Status:** Passed
**EC Coverage:** EC-FR08-008 (via BV-FR08-008)
**Req. Ref:** FR-08
**Bug ID:** BUG-FR08-009

---

## EC Coverage Matrix

| EC ID | Description | Covered By |
|-------|-------------|-----------|
| EC-FR08-001 | JWT Token — valid | EP-001 |
| EC-FR08-002 | JWT Token — missing | NEG-001 |
| EC-FR08-003 | JWT Token — invalid/expired | NEG-002 |
| EC-FR08-004 | Cart — non-empty | EP-001, EP-002 |
| EC-FR08-005 | Cart — empty | NEG-003 |
| EC-FR08-006 | `shipping_address` — 1–255 chars (valid) | EP-001, EP-002, BV-001, BV-002, BV-003, BV-004 |
| EC-FR08-007 | `shipping_address` — empty/whitespace | NEG-004, NEG-006, BV-005 |
| EC-FR08-008 | `shipping_address` — >255 chars | BV-006, BV-007 |
| EC-FR08-009 | `total_amount` — matches server total | EP-001 |
| EC-FR08-010 | `total_amount` — tampered | NEG-005 |
| EC-FR08-011 | Successful checkout output | EP-001, EP-002 |
| EC-FR08-012 | Cart cleared after checkout | EP-001, EP-002 |
| EC-FR08-013 | Checkout rejected — unauthenticated | NEG-001, NEG-002 |
| EC-FR08-014 | Checkout rejected — empty cart | NEG-003 |
| EC-FR08-015 | Backend ignores client total_amount | EP-001, NEG-005 |
| EC-FR08-016 | GUI — breadcrumb navigation | EP-001, EP-003 |
| EC-FR08-017 | GUI — single `<h1>` tag | EP-001, NEG-007 |
| EC-FR08-018 | GUI — error message position | EP-003, NEG-004 |
| EC-FR08-019 | GUI — submit button blue | EP-001, NEG-007 |
| EC-FR08-020 | GUI — currency display | EP-001, NEG-007 |

---

**HITL Review:** Accepted (revised 2026-06-15 — FR-09 coupon test cases removed)