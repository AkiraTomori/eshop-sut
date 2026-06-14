## Test Cases — FR-08: Checkout (+ FR-09: Coupon Code)
**Date:** 2026-06-14 10:01
**Designer:** Gemini QA Agent (reviewed by: Thái Minh Huy)
**Based on:** FR08-domain-analysis.md + FR08-boundary-analysis.md (approved 2026-06-14)
**Test Environment:**
- OS: macOS / Windows 11
- Browser: Chrome (latest)
- Frontend URL: http://localhost:5173
- Backend URL: http://localhost:3000
- API Tool: Postman (for API-level tests)

---

## EP Test Cases (Valid — Equivalence Partitioning)

---
**Test Case ID:** TC-FR08-EP-001
**Title:** Verify that checkout succeeds with a valid cart, authenticated user, and a valid shipping address
**Description:** Covers the primary happy-path checkout flow. Combines valid JWT (EC-FR08-001), non-empty cart (EC-FR08-004), valid shipping address in mid-range (EC-FR08-006), correct total_amount (EC-FR08-009), and expected successful order outputs (EC-FR08-026, EC-FR08-027, EC-FR08-036, EC-FR08-037, EC-FR08-038, EC-FR08-040, EC-FR08-041).
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
**EC Coverage:** EC-FR08-001, EC-FR08-004, EC-FR08-006, EC-FR08-009, EC-FR08-026, EC-FR08-027, EC-FR08-036, EC-FR08-037, EC-FR08-038, EC-FR08-040, EC-FR08-041
**Req. Ref:** FR-08, FR-21, FR-22, FR-23, FR-10
**Bug ID:** _(fill if fails)_

---
**Test Case ID:** TC-FR08-EP-002
**Title:** Verify that a percent-type coupon applies the correct discount at checkout with a valid order total
**Description:** Covers the full valid coupon flow with a `percent`-type coupon (EC-FR08-011, EC-FR08-014, EC-FR08-015, EC-FR08-018, EC-FR08-020, EC-FR08-023) and the corresponding discount output (EC-FR08-028, EC-FR08-029). Also covers the blank coupon field as valid (EC-FR08-014 baseline comparison).
**Priority:** High
**Pre-conditions:**
  1. Backend and Frontend are running.
  2. User `test@eshop.com` is logged in (first-time use of `SAVE10` — usage count = 0).
  3. Cart total is at least 300,000 ₫ (e.g., add product(s) summing to ≥ 300,000 ₫).
**Steps:**
  1. Navigate to the checkout page.
  2. In the coupon code field, enter `SAVE10`.
  3. Click "Apply Coupon" / "Áp dụng mã".
  4. Verify the discount is calculated: `discount_amount = Math.round(total × 10 / 100)`.
  5. Verify the `final_amount` displayed = `total − discount_amount`.
  6. Verify the `final_amount` is displayed in ₫ with thousands-separator formatting.
  7. Enter shipping address: `"123 Nguyen Hue, District 1, Ho Chi Minh City"`.
  8. Click "Place Order".
  9. Verify the order is created with the discounted final amount.
**Test Data:**
  - Input: `coupon_code` = `SAVE10`; cart total = 300,000 ₫; `shipping_address` = `"123 Nguyen Hue, District 1, Ho Chi Minh City"`.
  - Expected Output: `discount_amount` = 30,000 ₫; `final_amount` = 270,000 ₫; order created with status `pending`.
**Expected Result:** The coupon `SAVE10` is applied successfully. The checkout page displays `discount_amount = 30,000 ₫` and `final_amount = 270,000 ₫`. The order is placed at the discounted amount.
**Observed Result:** The coupon `SAVE10` is applied successfully. The checkout page displays as expected. But the total price is not the same, it should be 10% * 300,000 = 30,000 ₫. but it's 10 * 300,000 = 3,000,000 ₫
**Status:** Failed
**EC Coverage:** EC-FR08-001, EC-FR08-004, EC-FR08-006, EC-FR08-011, EC-FR08-015, EC-FR08-018, EC-FR08-020, EC-FR08-023, EC-FR08-026, EC-FR08-027, EC-FR08-028
**Req. Ref:** FR-09 (C1, C2, C3, C4, C5), FR-08, FR-21
**Bug ID:** _(fill if fails)_

---
**Test Case ID:** TC-FR08-EP-003
**Title:** Verify that a fixed-type coupon deducts a flat amount at checkout when all conditions are met
**Description:** Covers the `fixed` coupon type (EC-FR08-024) using coupon `BIGBUY` (fixed, 50,000 ₫, min 500,000 ₫). Verifies the fixed discount formula: `final_amount = total − discount_value`.
**Priority:** High
**Pre-conditions:**
  1. Backend and Frontend are running.
  2. User `test@eshop.com` is logged in (first-time use of `BIGBUY` — usage count = 0).
  3. Cart total is at least 500,000 ₫.
**Steps:**
  1. Navigate to the checkout page.
  2. Enter coupon code `BIGBUY` in the coupon field.
  3. Click "Apply Coupon".
  4. Verify `discount_amount` = 50,000 ₫ (fixed value).
  5. Verify `final_amount` = total − 50,000 ₫.
  6. Enter shipping address: `"123 Nguyen Hue, District 1, Ho Chi Minh City"`.
  7. Click "Place Order".
  8. Verify order is created at the correct discounted amount.
**Test Data:**
  - Input: `coupon_code` = `BIGBUY`; cart total = 500,000 ₫; `shipping_address` = `"123 Nguyen Hue, District 1, Ho Chi Minh City"`.
  - Expected Output: `discount_amount` = 50,000 ₫; `final_amount` = 450,000 ₫; order status = `pending`.
**Expected Result:** Coupon `BIGBUY` is applied. The UI displays `discount_amount = 50,000 ₫` and `final_amount = 450,000 ₫`. The order is successfully placed at 450,000 ₫.
**Observed Result:** The coupon `BIGBUY` is applied successfully. The checkout page displays as expected.
**Status:** Passed
**EC Coverage:** EC-FR08-001, EC-FR08-004, EC-FR08-006, EC-FR08-011, EC-FR08-015, EC-FR08-018, EC-FR08-020, EC-FR08-024, EC-FR08-026, EC-FR08-027, EC-FR08-029
**Req. Ref:** FR-09 (C1, C2, C3, C4, C5), FR-08
**Bug ID:** _(fill if fails)_

---
**Test Case ID:** TC-FR08-EP-004
**Title:** Verify that checkout proceeds without a coupon when the coupon field is left blank
**Description:** Covers the blank/empty coupon field as a valid scenario (EC-FR08-014) — no coupon is applied, and checkout completes at the full cart total.
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
  - Input: `coupon_code` = `""` (blank); `shipping_address` = `"123 Nguyen Hue, District 1, Ho Chi Minh City"`.
  - Expected Output: Order created at the full cart total; status = `pending`.
**Expected Result:** The order is placed successfully at the full cart total with no discount. The cart is cleared after successful checkout.
**Observed Result:** As Expected Result
**Status:** Passed
**EC Coverage:** EC-FR08-001, EC-FR08-004, EC-FR08-006, EC-FR08-014, EC-FR08-026, EC-FR08-027
**Req. Ref:** FR-08, FR-09
**Bug ID:** _(fill if fails)_

---
**Test Case ID:** TC-FR08-EP-005
**Title:** Verify that breadcrumb navigation is displayed on the checkout page for a logged-in user
**Description:** Covers GUI requirements: breadcrumb (EC-FR08-037), error message position (EC-FR08-039). Also uses VIP100 multi-use coupon to cover EC-FR08-020 (count < max_uses for a coupon with max=2).
**Priority:** Medium
**Pre-conditions:**
  1. Frontend is running.
  2. User `test@eshop.com` is logged in.
  3. Cart has at least 1 item totaling ≥ 300,000 ₫.
**Steps:**
  1. Navigate to `http://localhost:5173/checkout`.
  2. Verify breadcrumb navigation is visible (e.g., `Home > Cart > Checkout`).
  3. Attempt to click "Place Order" without entering a shipping address.
  4. Verify that the error message appears **above** the submit/checkout button (not below it).
  5. Enter coupon `VIP100` (multi-use, max=2; first use here).
  6. Click "Apply Coupon". Verify the coupon is accepted (usage_count = 0 < max = 2).
**Test Data:**
  - Input: `coupon_code` = `VIP100`; no shipping address for step 4.
  - Expected Output: Breadcrumb visible; error appears above submit button; VIP100 discount applied (100,000 ₫ fixed).
**Expected Result:** Breadcrumb navigation (e.g., `Trang chủ > Giỏ hàng > Thanh toán`) is visible at the top of the checkout page. When the shipping address is missing, an error message appears **above** (not below) the checkout button. The coupon `VIP100` is accepted on first use.
**Observed Result:** Breadcrumb is not visible at the top of the checkout page. When the shipping address is missing, an error message does not appear as expected. But the couple `VIP100` is accepted on first use.
**Status:** Failed
**EC Coverage:** EC-FR08-001, EC-FR08-004, EC-FR08-011, EC-FR08-015, EC-FR08-018, EC-FR08-020, EC-FR08-024, EC-FR08-037, EC-FR08-038, EC-FR08-039
**Req. Ref:** FR-22, FR-23, FR-21, FR-09 (C5)
**Bug ID:** _(fill if fails)_

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
**EC Coverage:** EC-FR08-002, EC-FR08-030
**Req. Ref:** FR-08, SEC-02
**Bug ID:** _(fill if fails)_

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
**EC Coverage:** EC-FR08-003, EC-FR08-030
**Req. Ref:** SEC-02, FR-08
**Bug ID:** _(fill if fails)_

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
**EC Coverage:** EC-FR08-005, EC-FR08-031
**Req. Ref:** FR-07, FR-08, FR-24
**Bug ID:** _(fill if fails)_

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
**Bug ID:** _(fill if fails)_

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
**EC Coverage:** EC-FR08-010, EC-FR08-036
**Req. Ref:** FR-08
**Bug ID:** _(fill if fails)_

---
**Test Case ID:** TC-FR08-NEG-006
**Title:** Verify that applying a non-existent coupon code at checkout displays an error message
**Description:** Tests EC-FR08-012 — coupon code does not exist in the database (C1 fails — unknown code).
**Priority:** High
**Pre-conditions:**
  1. Backend and Frontend are running.
  2. User `test@eshop.com` is logged in.
  3. Cart has at least 1 item.
**Steps:**
  1. Navigate to the checkout page.
  2. Enter coupon code `FAKECODE99` (non-existent in DB) in the coupon field.
  3. Click "Apply Coupon".
  4. Observe the UI response.
**Test Data:**
  - Input: `coupon_code` = `"FAKECODE99"`.
  - Expected Output: Error message displayed indicating the coupon code is invalid or does not exist.
**Expected Result:** The system displays an error message (e.g., "Invalid coupon code" or "Mã giảm giá không hợp lệ") **above** the checkout button. No discount is applied. The checkout total remains unchanged.
**Observed Result:** The system displays an error message (`Mã giảm giá không tồn tại hoặc đã bị vô hiệu hoá`) above the checkout button. No discount is applied. The checkout total remains unchanged.
**Status:** Passed
**EC Coverage:** EC-FR08-012, EC-FR08-032
**Req. Ref:** FR-09 (C1), FR-22
**Bug ID:** _(fill if fails)_

---
**Test Case ID:** TC-FR08-NEG-007
**Title:** Verify that an inactive coupon code is rejected at checkout with an appropriate error message
**Description:** Tests EC-FR08-013 — coupon exists in DB but `is_active = 0`. This is distinct from a non-existent code (different failure mode per G4 split).
**Priority:** High
**Pre-conditions:**
  1. Backend is running.
  2. An inactive coupon (`is_active = 0`) exists in the database. If no inactive coupon is seeded, create one via the admin panel or direct DB insert before testing.
  3. User `test@eshop.com` is logged in; cart has items.
**Steps:**
  1. Navigate to the checkout page.
  2. Enter the code of the inactive coupon (e.g., `INACTIVE01` if created).
  3. Click "Apply Coupon".
  4. Observe the system response.
**Test Data:**
  - Input: `coupon_code` = inactive coupon code with `is_active = 0`.
  - Expected Output: Error message indicating the coupon is not available or has been disabled.
**Expected Result:** The system rejects the inactive coupon and displays an error message (e.g., "This coupon is no longer active" or "Mã giảm giá không khả dụng"). No discount is applied.
**Observed Result:** The system displays an error message (`Mã giảm giá không tồn tại hoặc đã bị vô hiệu hoá`) above the checkout button. No discount is applied. The checkout total remains unchanged.
**Status:** Passed
**EC Coverage:** EC-FR08-013, EC-FR08-032
**Req. Ref:** FR-09 (C1)
**Bug ID:** _(fill if fails)_

---
**Test Case ID:** TC-FR08-NEG-008
**Title:** Verify that an expired coupon code is rejected at checkout when the expiry date has passed
**Description:** Tests EC-FR08-017 — current date is definitively past `expired_at`. Uses the sample coupon `EXPIRED` (expired `2020-01-01`), which is well past the current date.
**Priority:** High
**Pre-conditions:**
  1. Backend and Frontend are running.
  2. User `test@eshop.com` is logged in; cart total ≥ 100,000 ₫ (EXPIRED coupon's min_order).
**Steps:**
  1. Navigate to the checkout page.
  2. Enter coupon code `EXPIRED` in the coupon field.
  3. Click "Apply Coupon".
  4. Observe the system response.
**Test Data:**
  - Input: `coupon_code` = `"EXPIRED"`; current date = 2026-06-14 (> expired_at = 2020-01-01).
  - Expected Output: Error message indicating the coupon has expired.
**Expected Result:** The system rejects coupon `EXPIRED` and displays an error message (e.g., "This coupon has expired" or "Mã giảm giá đã hết hạn"). No discount is applied to the checkout total.
**Observed Result:** The system displays an error message (`Mã giảm giá không tồn tại hoặc đã bị vô hiệu hoá`) above the checkout button. No discount is applied. The checkout total remains unchanged.
**Status:** Passed
**EC Coverage:** EC-FR08-017, EC-FR08-033
**Req. Ref:** FR-09 (C2)
**Bug ID:** _(fill if fails)_

---
**Test Case ID:** TC-FR08-NEG-009
**Title:** Verify that a coupon is rejected when the order total is below the minimum order amount
**Description:** Tests EC-FR08-019 — order total is less than `min_order_amount`. Uses `SAVE10` (min_order = 300,000 ₫) with a cart total of 200,000 ₫ (below threshold).
**Priority:** High
**Pre-conditions:**
  1. Backend and Frontend are running.
  2. User `test@eshop.com` is logged in.
  3. Cart total is 200,000 ₫ (below SAVE10's min_order_amount of 300,000 ₫).
**Steps:**
  1. Navigate to the checkout page.
  2. Verify the displayed order total is 200,000 ₫.
  3. Enter coupon code `SAVE10` in the coupon field.
  4. Click "Apply Coupon".
  5. Observe the system response.
**Test Data:**
  - Input: `coupon_code` = `"SAVE10"`; cart total = 200,000 ₫; min_order_amount = 300,000 ₫.
  - Expected Output: Error message indicating the order total does not meet the minimum requirement.
**Expected Result:** The system rejects the coupon and displays an error message (e.g., "Minimum order amount is 300,000 ₫" or "Đơn hàng tối thiểu 300,000 ₫ để sử dụng mã này"). No discount is applied. The checkout total remains at 200,000 ₫.
**Observed Result:** As Expected Result
**Status:** Passed
**EC Coverage:** EC-FR08-019, EC-FR08-034
**Req. Ref:** FR-09 (C3)
**Bug ID:** _(fill if fails)_

---
**Test Case ID:** TC-FR08-NEG-010
**Title:** Verify that a coupon is rejected when the user has reached the maximum usage limit
**Description:** Tests EC-FR08-021 — user's usage count equals `max_uses_per_user` (count = max, strict `<` condition). Uses `SAVE10` (max_uses = 1) after the user has already used it once.
**Priority:** High
**Pre-conditions:**
  1. Backend and Frontend are running.
  2. User `test@eshop.com` has already used coupon `SAVE10` exactly **1 time** (usage_count = 1 = max_uses_per_user).
  3. Cart total ≥ 300,000 ₫.
**Steps:**
  1. Navigate to the checkout page.
  2. Enter coupon code `SAVE10`.
  3. Click "Apply Coupon".
  4. Observe the system response.
**Test Data:**
  - Input: `coupon_code` = `"SAVE10"`; user's prior usage count of SAVE10 = 1 (= max_uses_per_user); cart total ≥ 300,000 ₫.
  - Expected Output: Error message indicating the usage limit has been reached.
**Expected Result:** The system rejects the coupon and displays an error message (e.g., "You have already used this coupon the maximum number of times" or "Mã giảm giá đã đạt giới hạn sử dụng"). No discount is applied.
**Observed Result:** As Expected Result
**Status:** Passed
**EC Coverage:** EC-FR08-021, EC-FR08-035
**Req. Ref:** FR-09 (C5)
**Bug ID:** _(fill if fails)_

---
**Test Case ID:** TC-FR08-NEG-011
**Title:** Verify that a coupon is still rejected when the user's usage count exceeds the maximum limit
**Description:** Tests EC-FR08-022 — usage count is greater than `max_uses_per_user` (count > max, which is also caught by the `<` condition). Tests a more extreme violation (2 uses vs. max=1).
**Priority:** Medium
**Pre-conditions:**
  1. Backend is running.
  2. Via Postman or direct DB modification, user `test@eshop.com` has used `SAVE10` **2 times** (usage_count = 2 > max_uses_per_user = 1).
  3. Cart total ≥ 300,000 ₫.
**Steps:**
  1. Send `POST /api/apply-coupon` via Postman with: `{ "code": "SAVE10", "total_amount": 350000, "user_id": <user_id> }` and a valid Authorization header.
  2. Observe the API response.
**Test Data:**
  - Input: `code` = `"SAVE10"`; `total_amount` = 350,000; `user_id` = test user's ID; usage_count = 2.
  - Expected Output: HTTP 4XX with error message indicating usage limit exceeded.
**Expected Result:** The API returns an error response (HTTP 400 or similar) with a message indicating the coupon usage limit has been exceeded. No discount is calculated.
**Observed Result:** As Expected Result
**Status:** Passed
**EC Coverage:** EC-FR08-022, EC-FR08-035
**Req. Ref:** FR-09 (C5)
**Bug ID:** _(fill if fails)_

---
**Test Case ID:** TC-FR08-NEG-012
**Title:** Verify that an invalid coupon type value is rejected by the system
**Description:** Tests EC-FR08-025 — coupon type is not `percent` or `fixed` (an enumerated-set invalid class per G2). This tests the API-level validation of coupon type.
**Priority:** Medium
**Pre-conditions:**
  1. Backend is running.
  2. Via direct DB insert, create a test coupon with `type = "cashback"` (invalid enum value), `is_active = 1`, and a future expiry date.
  3. A valid JWT for `test@eshop.com` is available.
**Steps:**
  1. Send `POST /api/apply-coupon` via Postman with the `cashback`-type coupon code.
  2. Observe the API response.
**Test Data:**
  - Input: `code` = invalid-type coupon code; `total_amount` = 300,000; `user_id` = test user's ID.
  - Expected Output: HTTP 4XX with error message indicating unsupported or invalid coupon type.
**Expected Result:** The API returns an error response. No discount is applied. The system does not crash or return an undefined value.
**Observed Result:** As Expected Result
**Status:** Passed
**EC Coverage:** EC-FR08-025
**Req. Ref:** FR-09, FR-17
**Bug ID:** _(fill if fails)_

---
**Test Case ID:** TC-FR08-NEG-013
**Title:** Verify that a shipping address consisting of only whitespace characters is rejected at checkout
**Description:** Tests the whitespace-only variant of EC-FR08-007 (confirmed per HITL: blank-equivalent addresses must be blocked). System/UI boundary test from BV-FR08-007.
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
**Bug ID:** _(fill if fails)_

---
**Test Case ID:** TC-FR08-NEG-014
**Title:** Verify that the checkout page displays exactly one `<h1>` tag and no duplicate heading elements
**Description:** Tests EC-FR08-038 — GUI requirement of exactly one `<h1>` tag per page (FR-21). Also confirms EC-FR08-040 (submit button is blue) and EC-FR08-041 (currency formatted correctly).
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
**EC Coverage:** EC-FR08-038, EC-FR08-040, EC-FR08-041
**Req. Ref:** FR-21
**Bug ID:** _(fill if fails)_

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
**Bug ID:** _(fill if fails)_

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
**Bug ID:** _(fill if fails)_

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
**Bug ID:** _(fill if fails)_

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
**Bug ID:** _(fill if fails)_

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
**Observed Result:** The system didn't reject the empty address and not displays an error message above the "Place Order" button. Order is stll created.
**Status:** Failed
**EC Coverage:** EC-FR08-007 (via BV-FR08-005)
**Req. Ref:** FR-08, FR-22
**Bug ID:** _(fill if fails)_

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
**Observed Result:** System didn't reject the 256-char address with an error message, it still accpets and creates an order.
**Status:** Failed
**EC Coverage:** EC-FR08-008 (via BV-FR08-006)
**Req. Ref:** FR-08
**Bug ID:** _(fill if fails)_

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
**Bug ID:** _(fill if fails)_

---
### Section BV-B: Coupon Expiry Date Boundaries (High Risk — 6-point)

---
**Test Case ID:** TC-FR08-BV-008
**Title:** Verify that a coupon is accepted one day before its expiry date (UB-1)
**Description:** BVA valid point UB-1 for coupon expiry. Tests BV-FR08-009 — the last fully valid date before expiry. Uses a coupon with `expired_at = 2099-12-31`.
**Priority:** High
**Pre-conditions:**
  1. Backend and Frontend are running.
  2. User `test@eshop.com` is logged in; cart total ≥ 500,000 ₫.
  3. System date is set to `2099-12-30` (one day before expiry of `BIGBUY`).
     _(Note: For demo environment, may require admin DB update or date mocking.)_
**Steps:**
  1. Navigate to the checkout page.
  2. Enter coupon code `BIGBUY`.
  3. Click "Apply Coupon".
  4. Verify the coupon is accepted and the discount is applied.
**Test Data:**
  - Input: `coupon_code` = `"BIGBUY"`; system date = `2099-12-30` (UB-1 relative to `expired_at = 2099-12-31`).
  - Expected Output: Coupon accepted; `discount_amount` = 50.000 đ; `final_amount` shown correctly.
**Expected Result:** The coupon `BIGBUY` is accepted on `2099-12-30` (one day before expiry). The discount is applied and `final_amount` is reduced by 10%.
**Observed Result:** As Expected Result
**Status:** Passed
**EC Coverage:** EC-FR08-015 (via BV-FR08-009)
**Req. Ref:** FR-09 (C2)
**Bug ID:** _(fill if fails)_

---
**Test Case ID:** TC-FR08-BV-009
**Title:** Verify that a coupon is rejected on its exact expiry date (UB — boundary condition)
**Description:** BVA critical boundary point — exact expiry date. Tests BV-FR08-010. Per HITL resolution, `current_date = expired_at` is treated as INVALID (strict `<` predicate). Uses `EXPIRED` coupon (`expired_at = 2020-01-01`) with date set to `2020-01-01`. This is the highest-risk boundary point — off-by-one in operator would allow this coupon.
**Priority:** High
**Pre-conditions:**
  1. Backend is running.
  2. System/test environment date is set to `2020-01-01` (= `EXPIRED` coupon's `expired_at`) OR use API with date-mock.
  3. Valid JWT for `test@eshop.com` available; cart total ≥ 100,000 ₫.
**Steps:**
  1. Send `POST /api/apply-coupon` via Postman: `{ "code": "EXPIRED", "total_amount": 150000, "user_id": <id> }` with date mocked to `2020-01-01`.
  2. Observe the API response.
**Test Data:**
  - Input: `coupon_code` = `"EXPIRED"`; `expired_at` = `2020-01-01`; test date = `2020-01-01` (UB = exact expiry).
  - Expected Output: HTTP 4XX; error: coupon has expired.
**Expected Result:** The API rejects the coupon on its exact expiry date (`current_date = expired_at`). An error response is returned indicating the coupon has expired. The `<` predicate means equality is NOT valid.
**Observed Result:** As Expected Result
**Status:** Passed
**EC Coverage:** EC-FR08-016 (via BV-FR08-010)
**Req. Ref:** FR-09 (C2)
**Bug ID:** _(fill if fails)_

---
**Test Case ID:** TC-FR08-BV-010
**Title:** Verify that a coupon is rejected one day after its expiry date (UB+1)
**Description:** BVA invalid point UB+1 for expiry — one day past expiry. Tests BV-FR08-011. Uses `EXPIRED` coupon with date `2020-01-02`. Isolated invalid test.
**Priority:** High
**Pre-conditions:**
  1. Backend is running.
  2. Date is mocked to `2020-01-02` (one day past `expired_at = 2020-01-01`).
  3. Valid JWT available; cart total ≥ 100,000 ₫.
**Steps:**
  1. Send `POST /api/apply-coupon` via Postman: `{ "code": "EXPIRED", "total_amount": 150000, "user_id": <id> }` with date = `2020-01-02`.
  2. Observe the API response.
**Test Data:**
  - Input: `coupon_code` = `"EXPIRED"`; test date = `2020-01-02` (UB+1).
  - Expected Output: HTTP 4XX; error: coupon has expired.
**Expected Result:** The API rejects the coupon one day past its expiry. Error response confirms expiry. The system correctly handles dates beyond expiry.
**Observed Result:** As Expected Result
**Status:** Passed
**EC Coverage:** EC-FR08-017 (via BV-FR08-011)
**Req. Ref:** FR-09 (C2)
**Bug ID:** _(fill if fails)_

---
**Test Case ID:** TC-FR08-BV-011
**Title:** Verify that a non-expired coupon is accepted when the current date is well before the expiry date (interior valid)
**Description:** Interior valid representative for expiry date. Tests BV-FR08-012 — normal operation using `BIGBUY` (expires 2099-12-31) on today's date (2026-06-14). This is the standard runtime condition.
**Priority:** High
**Pre-conditions:**
  1. Backend and Frontend are running.
  2. User `test@eshop.com` is logged in (first use of BIGBUY); cart total ≥ 500,000 ₫.
**Steps:**
  1. Navigate to the checkout page with today's actual date.
  2. Enter coupon `BIGBUY`.
  3. Click "Apply Coupon".
  4. Verify the coupon is accepted.
**Test Data:**
  - Input: `coupon_code` = `"BIGBUY"`; current date = `2026-06-14`; `expired_at` = `2099-12-31`.
  - Expected Output: Coupon accepted; 50.000 đ discount applied.
**Expected Result:** Coupon `BIGBUY` is accepted. The 50.000 đ discount is applied. This confirms the normal expiry check works for a coupon far from its expiry date.
**Observed Result:** As Expected Result
**Status:** Passed
**EC Coverage:** EC-FR08-015 (via BV-FR08-012)
**Req. Ref:** FR-09 (C2)
**Bug ID:** _(fill if fails)_

---
**Test Case ID:** TC-FR08-BV-012
**Title:** Verify that the EXPIRED sample coupon is rejected when used well after its expiry date (far invalid)
**Description:** Tests BV-FR08-013 — far past expiry using the seeded `EXPIRED` coupon on the current date `2026-06-14` (years after `expired_at = 2020-01-01`).
**Priority:** Medium
**Pre-conditions:**
  1. Backend and Frontend are running.
  2. User `test@eshop.com` is logged in; cart total ≥ 100,000 ₫.
**Steps:**
  1. Navigate to the checkout page.
  2. Enter coupon code `EXPIRED`.
  3. Click "Apply Coupon".
  4. Observe the error message.
**Test Data:**
  - Input: `coupon_code` = `"EXPIRED"`; current date = `2026-06-14`; `expired_at` = `2020-01-01`.
  - Expected Output: Error message: coupon has expired.
**Expected Result:** The system rejects the `EXPIRED` coupon with a clear expiry error message. No discount is applied.
**Observed Result:** As Expected Result
**Status:** Passed
**EC Coverage:** EC-FR08-017 (via BV-FR08-013)
**Req. Ref:** FR-09 (C2)
**Bug ID:** _(fill if fails)_

---
### Section BV-C: Order Total vs. `min_order_amount` Boundaries (High Risk — 6-point)

---
**Test Case ID:** TC-FR08-BV-013
**Title:** Verify that a coupon is rejected when the order total is 1 ₫ below the minimum order amount (LB-1)
**Description:** BVA critical invalid point LB-1 for min_order_amount. Tests BV-FR08-015. Order total = 299,999 ₫ vs. SAVE10 min_order = 300,000 ₫. This off-by-one tests whether the `>=` operator is correctly implemented.
**Priority:** High
**Pre-conditions:**
  1. Backend is running.
  2. Valid JWT for `test@eshop.com`; cart total set to 299,999 ₫.
**Steps:**
  1. Send `POST /api/apply-coupon` via Postman: `{ "code": "SAVE10", "total_amount": 299999, "user_id": <id> }`.
  2. Observe the API response.
**Test Data:**
  - Input: `code` = `"SAVE10"`; `total_amount` = 299,999 ₫ (LB-1); `min_order_amount` = 300,000 ₫.
  - Expected Output: HTTP 4XX; error: order total below minimum.
**Expected Result:** The API rejects the coupon because 299,999 < 300,000. An error message is returned indicating the minimum order amount is not met. This boundary test detects off-by-one errors in the `>=` operator.
**Observed Result:** As Expected Result
**Status:** Passed
**EC Coverage:** EC-FR08-019 (via BV-FR08-015)
**Req. Ref:** FR-09 (C3)
**Bug ID:** _(fill if fails)_

---
**Test Case ID:** TC-FR08-BV-014
**Title:** Verify that a coupon is accepted when the order total exactly equals the minimum order amount (LB)
**Description:** BVA critical valid boundary LB = exact min_order_amount. Tests BV-FR08-016. Order total = 300,000 ₫ exactly. The `>=` operator means equal is VALID. This detects if the developer incorrectly used strict `>`.
**Priority:** High
**Pre-conditions:**
  1. Backend is running.
  2. Valid JWT for `test@eshop.com` (first use of SAVE10); cart total = exactly 300,000 ₫.
**Steps:**
  1. Send `POST /api/apply-coupon` via Postman: `{ "code": "SAVE10", "total_amount": 300000, "user_id": <id> }`.
  2. Observe the API response.
**Test Data:**
  - Input: `code` = `"SAVE10"`; `total_amount` = 300,000 ₫ (LB = exact min); `min_order_amount` = 300,000 ₫.
  - Expected Output: HTTP 200; `discount_amount` = 30,000 ₫; `final_amount` = 270,000 ₫.
**Expected Result:** The API accepts the coupon at exactly the minimum order amount (300,000 ₫ = min_order_amount). Returns `discount_amount = 30,000` and `final_amount = 270,000`. A response of "minimum not met" at this exact value would indicate a `>` operator bug.
**Observed Result:** The API didn't accept the coupon at exactly the minimum order amount (300,000 đ = min _order_amount).
**Status:** Failed
**EC Coverage:** EC-FR08-018 (via BV-FR08-016)
**Req. Ref:** FR-09 (C3)
**Bug ID:** _(fill if fails)_

---
**Test Case ID:** TC-FR08-BV-015
**Title:** Verify that a coupon is accepted when the order total is 1 ₫ above the minimum order amount (LB+1)
**Description:** BVA valid point LB+1. Tests BV-FR08-017 — one unit above the minimum threshold confirms the system works just inside the valid range.
**Priority:** High
**Pre-conditions:**
  1. Backend is running.
  2. Valid JWT for `test@eshop.com` (first use of SAVE10); `total_amount` = 300,001 ₫.
**Steps:**
  1. Send `POST /api/apply-coupon` via Postman: `{ "code": "SAVE10", "total_amount": 300001, "user_id": <id> }`.
  2. Observe the API response.
**Test Data:**
  - Input: `code` = `"SAVE10"`; `total_amount` = 300,001 ₫ (LB+1).
  - Expected Output: HTTP 200; `discount_amount` = Math.round(300001 × 10 / 100) = 30,000 ₫; `final_amount` = 270,001 ₫.
**Expected Result:** The coupon is accepted at 300,001 ₫. Discount = 30,000 ₫ (after Math.round). Final amount = 270,001 ₫.
**Observed Result:** The coupon is accepted at 300,001 đ. But the discount_amount is `-2700009` and final amount is `3000010`
**Status:** Failed
**EC Coverage:** EC-FR08-018 (via BV-FR08-017)
**Req. Ref:** FR-09 (C3)
**Bug ID:** _(fill if fails)_

---
**Test Case ID:** TC-FR08-BV-016
**Title:** Verify that a coupon is rejected when the order total is well below the minimum (far below LB)
**Description:** Far below minimum — interior invalid. Tests BV-FR08-018. Uses 100,000 ₫ vs. SAVE10's 300,000 ₫ min_order.
**Priority:** Medium
**Pre-conditions:**
  1. Backend is running; valid JWT available.
**Steps:**
  1. Send `POST /api/apply-coupon` via Postman: `{ "code": "SAVE10", "total_amount": 100000, "user_id": <id> }`.
  2. Observe the response.
**Test Data:**
  - Input: `code` = `"SAVE10"`; `total_amount` = 100,000 ₫ (far below min = 300,000 ₫).
  - Expected Output: HTTP 4XX; error: minimum order not met.
**Expected Result:** The API rejects the coupon with a minimum order error. This confirms the validation works for values well below the threshold.
**Observed Result:** As Expected Result
**Status:** Passed
**EC Coverage:** EC-FR08-019 (via BV-FR08-018)
**Req. Ref:** FR-09 (C3)
**Bug ID:** _(fill if fails)_

---
**Test Case ID:** TC-FR08-BV-017
**Title:** Verify that the BIGBUY coupon is rejected when the order total is 1 ₫ below its minimum (BIGBUY LB-1)
**Description:** Cross-coupon boundary test. Tests BV-FR08-020 — LB-1 for BIGBUY's `min_order_amount` = 500,000 ₫. Order total = 499,999 ₫.
**Priority:** High
**Pre-conditions:**
  1. Backend is running; valid JWT for `test@eshop.com` (first use of BIGBUY).
**Steps:**
  1. Send `POST /api/apply-coupon` via Postman: `{ "code": "BIGBUY", "total_amount": 499999, "user_id": <id> }`.
  2. Observe the API response.
**Test Data:**
  - Input: `code` = `"BIGBUY"`; `total_amount` = 499,999 ₫ (LB-1 for BIGBUY's min = 500,000 ₫).
  - Expected Output: HTTP 4XX; error: minimum order not met.
**Expected Result:** The API rejects the `BIGBUY` coupon because 499,999 < 500,000. An error indicating minimum order amount is not met is returned.
**Observed Result:** As Expected Result
**Status:** Passed
**EC Coverage:** EC-FR08-019 (via BV-FR08-020)
**Req. Ref:** FR-09 (C3)
**Bug ID:** _(fill if fails)_

---
### Section BV-D: Coupon Usage Count vs. `max_uses_per_user` Boundaries (High Risk — 6-point)

---
**Test Case ID:** TC-FR08-BV-018
**Title:** Verify that SAVE10 coupon is accepted on the user's first use (usage_count = 0 — LB)
**Description:** BVA lower bound — first use. Tests BV-FR08-021. Usage count = 0 (LB); max_uses = 1. Condition: 0 < 1 → VALID.
**Priority:** High
**Pre-conditions:**
  1. Backend and Frontend are running.
  2. User `test@eshop.com` has **never** used `SAVE10` (usage_count = 0).
  3. Cart total ≥ 300,000 ₫.
**Steps:**
  1. Navigate to the checkout page.
  2. Enter coupon `SAVE10`.
  3. Click "Apply Coupon".
  4. Verify the coupon is accepted.
**Test Data:**
  - Input: `coupon_code` = `"SAVE10"`; user usage_count of SAVE10 = 0 (LB); max_uses = 1.
  - Expected Output: Coupon accepted; 10% discount applied.
**Expected Result:** The coupon `SAVE10` is accepted on the first use (usage_count = 0 < max_uses = 1). Discount of 10% is applied.
**Observed Result:** As Expected Result
**Status:** Passed
**EC Coverage:** EC-FR08-020 (via BV-FR08-021)
**Req. Ref:** FR-09 (C5)
**Bug ID:** _(fill if fails)_

---
**Test Case ID:** TC-FR08-BV-019
**Title:** Verify that VIP100 coupon is accepted on the user's second use (usage_count = 1, max = 2 — LB+1/UB-1)
**Description:** BVA LB+1 and UB-1 combined for VIP100 (max=2). Tests BV-FR08-022 and BV-FR08-026. Usage count = 1: still 1 remaining use; condition 1 < 2 → VALID.
**Priority:** High
**Pre-conditions:**
  1. Backend is running; valid JWT for `test@eshop.com`.
  2. User has used `VIP100` exactly **1 time** (usage_count = 1, max = 2).
  3. Cart total ≥ 300,000 ₫.
**Steps:**
  1. Send `POST /api/apply-coupon`: `{ "code": "VIP100", "total_amount": 400000, "user_id": <id> }`.
  2. Observe the API response.
**Test Data:**
  - Input: `code` = `"VIP100"`; usage_count = 1 (= UB-1 for max=2); `total_amount` = 400,000 ₫.
  - Expected Output: HTTP 200; `discount_amount` = 100,000 ₫; `final_amount` = 300,000 ₫.
**Expected Result:** The coupon is accepted (1 < 2). Discount = 100,000 ₫ (fixed). Final amount = 300,000 ₫.
**Observed Result:** As Expected Result
**Status:** Passed
**EC Coverage:** EC-FR08-020 (via BV-FR08-022, BV-FR08-026)
**Req. Ref:** FR-09 (C5)
**Bug ID:** _(fill if fails)_

---
**Test Case ID:** TC-FR08-BV-020
**Title:** Verify that SAVE10 coupon is rejected after the user has already used it once (usage_count = max_uses = 1 — UB)
**Description:** BVA critical upper boundary for usage count. Tests BV-FR08-023 — usage_count = max_uses_per_user = 1. Condition: 1 < 1 is FALSE → INVALID. This is the most critical boundary point for the usage limit — detects if developer used `<=` instead of `<`.
**Priority:** High
**Pre-conditions:**
  1. Backend and Frontend are running.
  2. User `test@eshop.com` has used `SAVE10` exactly **1 time** (usage_count = 1 = max_uses_per_user = 1).
  3. Cart total ≥ 300,000 ₫.
**Steps:**
  1. Navigate to the checkout page.
  2. Enter coupon `SAVE10`.
  3. Click "Apply Coupon".
  4. Observe the system response.
**Test Data:**
  - Input: `coupon_code` = `"SAVE10"`; usage_count = 1; max_uses_per_user = 1 (UB — exactly at limit).
  - Expected Output: Error message: usage limit reached.
**Expected Result:** The coupon is **rejected**. The system displays an error indicating the usage limit has been reached (e.g., "You have already used this coupon"). A response of `discount_amount` being applied would indicate a `<=` operator bug (allowing one extra use).
**Observed Result:** As Expected Result
**Status:** Passed
**EC Coverage:** EC-FR08-021 (via BV-FR08-023)
**Req. Ref:** FR-09 (C5)
**Bug ID:** _(fill if fails)_

---
**Test Case ID:** TC-FR08-BV-021
**Title:** Verify that VIP100 coupon is rejected after the user has used it exactly twice (usage_count = max_uses = 2 — UB for VIP100)
**Description:** BVA upper boundary for VIP100 (max=2). Tests BV-FR08-025. Usage_count = 2 = max_uses = 2 → condition 2 < 2 is FALSE → INVALID.
**Priority:** High
**Pre-conditions:**
  1. Backend is running; valid JWT for `test@eshop.com`.
  2. User has used `VIP100` exactly **2 times** (usage_count = 2, max_uses_per_user = 2).
  3. Cart total ≥ 300,000 ₫.
**Steps:**
  1. Send `POST /api/apply-coupon`: `{ "code": "VIP100", "total_amount": 400000, "user_id": <id> }`.
  2. Observe the API response.
**Test Data:**
  - Input: `code` = `"VIP100"`; usage_count = 2; max_uses_per_user = 2 (UB).
  - Expected Output: HTTP 4XX; error: usage limit reached.
**Expected Result:** The coupon `VIP100` is rejected after 2 uses. Error message indicates maximum uses reached.
**Observed Result:** As Expected Result
**Status:** Passed
**EC Coverage:** EC-FR08-021 (via BV-FR08-025)
**Req. Ref:** FR-09 (C5)
**Bug ID:** _(fill if fails)_

---
**Test Case ID:** TC-FR08-BV-022
**Title:** Verify that SAVE10 coupon is rejected when used a second time, exceeding the usage limit (UB+1)
**Description:** BVA invalid point UB+1 for usage count. Tests BV-FR08-024. Usage_count = 2 > max_uses = 1 → clearly blocked. Isolated invalid test.
**Priority:** Medium
**Pre-conditions:**
  1. Backend is running; valid JWT.
  2. User has used `SAVE10` **2 times** (via data setup; usage_count = 2, max = 1).
**Steps:**
  1. Send `POST /api/apply-coupon`: `{ "code": "SAVE10", "total_amount": 350000, "user_id": <id> }`.
  2. Observe the API response.
**Test Data:**
  - Input: `code` = `"SAVE10"`; usage_count = 2 (UB+1 = beyond max); max_uses = 1.
  - Expected Output: HTTP 4XX; error: usage limit exceeded.
**Expected Result:** The API rejects the coupon. Error response confirms usage is exceeded. The system does not apply any discount.
**Observed Result:** As Expected Result
**Status:** Passed
**EC Coverage:** EC-FR08-022 (via BV-FR08-024)
**Req. Ref:** FR-09 (C5)
**Bug ID:** _(fill if fails)_

---

## Coverage Matrix

| EC ID | Description | Type | Covered By |
|-------|-------------|:----:|------------|
| EC-FR08-001 | Valid JWT token | VALID | TC-FR08-EP-001, TC-FR08-EP-002, TC-FR08-EP-003, TC-FR08-EP-004, TC-FR08-EP-005 |
| EC-FR08-002 | No JWT token (unauthenticated) | INVALID | TC-FR08-NEG-001 |
| EC-FR08-003 | Malformed/expired JWT token | INVALID | TC-FR08-NEG-002 |
| EC-FR08-004 | Cart contains ≥ 1 item | VALID | TC-FR08-EP-001, TC-FR08-EP-002, TC-FR08-EP-003, TC-FR08-EP-004, TC-FR08-EP-005 |
| EC-FR08-005 | Cart is empty | INVALID | TC-FR08-NEG-003 |
| EC-FR08-006 | `shipping_address` 1–255 chars | VALID | TC-FR08-EP-001, TC-FR08-BV-001, TC-FR08-BV-002, TC-FR08-BV-003, TC-FR08-BV-004 |
| EC-FR08-007 | `shipping_address` empty / whitespace | INVALID | TC-FR08-NEG-004, TC-FR08-NEG-013, TC-FR08-BV-005 |
| EC-FR08-008 | `shipping_address` > 255 chars | INVALID | TC-FR08-BV-006, TC-FR08-BV-007 |
| EC-FR08-009 | `total_amount` matches server total | VALID | TC-FR08-EP-001 |
| EC-FR08-010 | `total_amount` tampered/incorrect | INVALID | TC-FR08-NEG-005 |
| EC-FR08-011 | Coupon exists and is active (C1 valid) | VALID | TC-FR08-EP-002, TC-FR08-EP-003, TC-FR08-EP-005 |
| EC-FR08-012 | Coupon code not found in DB | INVALID | TC-FR08-NEG-006 |
| EC-FR08-013 | Coupon exists but inactive (`is_active=0`) | INVALID | TC-FR08-NEG-007 |
| EC-FR08-014 | Coupon field blank (no coupon) | VALID | TC-FR08-EP-004 |
| EC-FR08-015 | current_date < expired_at (C2 valid) | VALID | TC-FR08-EP-002, TC-FR08-BV-008, TC-FR08-BV-011 |
| EC-FR08-016 | current_date = expired_at (boundary — INVALID) | INVALID | TC-FR08-BV-009 |
| EC-FR08-017 | current_date > expired_at (expired) | INVALID | TC-FR08-NEG-008, TC-FR08-BV-010, TC-FR08-BV-012 |
| EC-FR08-018 | Order total >= min_order_amount (C3 valid) | VALID | TC-FR08-EP-002, TC-FR08-BV-014, TC-FR08-BV-015 |
| EC-FR08-019 | Order total < min_order_amount (C3 fails) | INVALID | TC-FR08-NEG-009, TC-FR08-BV-013, TC-FR08-BV-016, TC-FR08-BV-017 |
| EC-FR08-020 | usage_count < max_uses_per_user (C5 valid) | VALID | TC-FR08-EP-002, TC-FR08-EP-005, TC-FR08-BV-018, TC-FR08-BV-019 |
| EC-FR08-021 | usage_count = max_uses_per_user (boundary — INVALID) | INVALID | TC-FR08-NEG-010, TC-FR08-BV-020, TC-FR08-BV-021 |
| EC-FR08-022 | usage_count > max_uses_per_user | INVALID | TC-FR08-NEG-011, TC-FR08-BV-022 |
| EC-FR08-023 | Coupon type = `percent` | VALID | TC-FR08-EP-002 |
| EC-FR08-024 | Coupon type = `fixed` | VALID | TC-FR08-EP-003, TC-FR08-EP-005 |
| EC-FR08-025 | Coupon type = invalid enum value | INVALID | TC-FR08-NEG-012 |
| EC-FR08-026 | Successful order placement (HTTP 200, status=pending) | VALID OUTPUT | TC-FR08-EP-001, TC-FR08-EP-002, TC-FR08-EP-003, TC-FR08-EP-004 |
| EC-FR08-027 | Cart cleared after checkout | VALID OUTPUT | TC-FR08-EP-001, TC-FR08-EP-002, TC-FR08-EP-003, TC-FR08-EP-004 |
| EC-FR08-028 | Percent discount output correctly computed | VALID OUTPUT | TC-FR08-EP-002, TC-FR08-BV-015 |
| EC-FR08-029 | Fixed discount output correctly computed | VALID OUTPUT | TC-FR08-EP-003 |
| EC-FR08-030 | Checkout rejected — unauthenticated (HTTP 401) | INVALID OUTPUT | TC-FR08-NEG-001, TC-FR08-NEG-002 |
| EC-FR08-031 | Checkout rejected — empty cart | INVALID OUTPUT | TC-FR08-NEG-003 |
| EC-FR08-032 | Coupon error — code invalid/inactive | INVALID OUTPUT | TC-FR08-NEG-006, TC-FR08-NEG-007 |
| EC-FR08-033 | Coupon error — expired | INVALID OUTPUT | TC-FR08-NEG-008, TC-FR08-BV-010, TC-FR08-BV-012 |
| EC-FR08-034 | Coupon error — min order not met | INVALID OUTPUT | TC-FR08-NEG-009, TC-FR08-BV-013, TC-FR08-BV-016 |
| EC-FR08-035 | Coupon error — usage limit reached | INVALID OUTPUT | TC-FR08-NEG-010, TC-FR08-NEG-011, TC-FR08-BV-020, TC-FR08-BV-021 |
| EC-FR08-036 | Backend ignores client total_amount (security) | VALID OUTPUT | TC-FR08-NEG-005 |
| EC-FR08-037 | Breadcrumb navigation visible | VALID OUTPUT | TC-FR08-EP-005 |
| EC-FR08-038 | Exactly one `<h1>` on checkout page | VALID OUTPUT | TC-FR08-EP-001, TC-FR08-NEG-014 |
| EC-FR08-039 | Error messages appear above submit button | VALID OUTPUT | TC-FR08-EP-005, TC-FR08-NEG-004 |
| EC-FR08-040 | Submit button is blue | VALID OUTPUT | TC-FR08-EP-001, TC-FR08-NEG-014 |
| EC-FR08-041 | Total displayed in ₫ with thousands separator | VALID OUTPUT | TC-FR08-EP-001, TC-FR08-NEG-014 |

---

### BVA Point Coverage

| BV ID | Variable | Point | Valid/Invalid | Covered By |
|-------|----------|-------|:-------------:|------------|
| BV-FR08-001 | `shipping_address` | LB (1 char) | VALID | TC-FR08-BV-001 |
| BV-FR08-002 | `shipping_address` | LB+1 (2 chars) | VALID | TC-FR08-BV-002 |
| BV-FR08-003 | `shipping_address` | UB-1 (254 chars) | VALID | TC-FR08-BV-003 |
| BV-FR08-004 | `shipping_address` | UB (255 chars) | VALID | TC-FR08-BV-004 |
| BV-FR08-005 | `shipping_address` | LB-1 (0 = empty) | INVALID | TC-FR08-BV-005 |
| BV-FR08-006 | `shipping_address` | UB+1 (256 chars) | INVALID | TC-FR08-BV-006 |
| BV-FR08-007 | `shipping_address` | UI/System (whitespace) | INVALID | TC-FR08-NEG-013 |
| BV-FR08-008 | `shipping_address` | DB stress (1000 chars) | INVALID | TC-FR08-BV-007 |
| BV-FR08-009 | Coupon expiry | UB-1 (day before expiry) | VALID | TC-FR08-BV-008 |
| BV-FR08-010 | Coupon expiry | UB (exact expiry date) | INVALID | TC-FR08-BV-009 |
| BV-FR08-011 | Coupon expiry | UB+1 (day after expiry) | INVALID | TC-FR08-BV-010 |
| BV-FR08-012 | Coupon expiry | Interior valid (today vs. 2099) | VALID | TC-FR08-BV-011 |
| BV-FR08-013 | Coupon expiry | Far invalid (EXPIRED coupon) | INVALID | TC-FR08-BV-012 |
| BV-FR08-014 | Coupon expiry | UI/System (yesterday's date) | INVALID | TC-FR08-BV-009 (merged — same boundary logic) |
| BV-FR08-015 | min_order_amount | LB-1 (299,999 ₫) | INVALID | TC-FR08-BV-013 |
| BV-FR08-016 | min_order_amount | LB (300,000 ₫ exact) | VALID | TC-FR08-BV-014 |
| BV-FR08-017 | min_order_amount | LB+1 (300,001 ₫) | VALID | TC-FR08-BV-015 |
| BV-FR08-018 | min_order_amount | Far below (100,000 ₫) | INVALID | TC-FR08-BV-016 |
| BV-FR08-019 | min_order_amount | Interior valid (500,000 ₫) | VALID | TC-FR08-EP-003 |
| BV-FR08-020 | min_order_amount (BIGBUY) | LB-1 (499,999 ₫) | INVALID | TC-FR08-BV-017 |
| BV-FR08-021 | usage_count | LB (0 = first use) | VALID | TC-FR08-BV-018 |
| BV-FR08-022 | usage_count (VIP100) | LB+1/UB-1 (count=1, max=2) | VALID | TC-FR08-BV-019 |
| BV-FR08-023 | usage_count (SAVE10) | UB (count=1 = max=1) | INVALID | TC-FR08-BV-020 |
| BV-FR08-024 | usage_count (SAVE10) | UB+1 (count=2 > max=1) | INVALID | TC-FR08-BV-022 |
| BV-FR08-025 | usage_count (VIP100) | UB (count=2 = max=2) | INVALID | TC-FR08-BV-021 |
| BV-FR08-026 | usage_count (VIP100) | UB-1 (count=1, max=2) | VALID | TC-FR08-BV-019 |

---

**Total Test Cases:**
- EP Test Cases (Valid): **5** (TC-FR08-EP-001 to TC-FR08-EP-005)
- NEG Test Cases (Invalid): **14** (TC-FR08-NEG-001 to TC-FR08-NEG-014)
- BV Test Cases (Boundary): **22** (TC-FR08-BV-001 to TC-FR08-BV-022)
- **Grand Total: 41 test cases**

---

**HITL Review:** Accepted