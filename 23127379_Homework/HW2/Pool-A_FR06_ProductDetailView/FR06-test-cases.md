## Test Cases — FR-06: View Product Details
**Date:** 2026-06-13 10:57
**Designer:** Gemini QA Agent (reviewed by: Thái Minh Huy)
**Based on:** FR06-domain-analysis.md + FR06-boundary-analysis.md (approved 2026-06-13)

### Source Sections Referenced
- `eshop-srs.md` — FR-06, FR-07, FR-21–FR-24, SEC-02, SEC-04
- `eshop-api-spec.md` — §3.2 (GET /api/products/:id), §4.2 (POST /api/cart)
- `theory-testcase-design.md` — §3–§6 (template, title syntax), §13 (best practices TC-BP-01 to TC-BP-07)
- `theory-domain-testing.md` — §7 (TC selection: combine valid, isolate invalid)
- HITL Phase 3 resolutions: quantity UB=999 system baseline, price tamper via API, DB max as stress test

---

## EP Test Cases (Valid)

---

### TC-FR06-EP-001

**Test Case ID:** TC-FR06-EP-001
**Title:** Verify that product detail page displays all required fields correctly with a valid product ID
**Description:** Validates the complete product detail display for a valid, existing product. Covers all valid display output ECs: image with alt text, name, price with ₫ formatting, escaped description, and category. Also covers GUI requirements (breadcrumbs, single h1, English language, blue Add to Cart button, correct tab order).
**Priority:** High
**Pre-conditions:**
  - EShop frontend is running at `http://localhost:5173`
  - EShop backend is running at `http://localhost:3000`
  - At least one product exists in the database (e.g., product id=1)
**Steps:**
  1. Open browser and navigate to `http://localhost:5173/product/1`
  2. Wait for the page to fully load
  3. Verify that the product's large image is displayed with a non-empty `alt` attribute
  4. Verify that the product name is displayed in full
  5. Verify that the price is displayed with `₫` symbol and thousands-separator formatting
  6. Verify that the product description is displayed and properly escaped (no raw HTML rendered)
  7. Verify that the product category name is displayed
  8. Verify that breadcrumb navigation is present on the page
  9. Inspect the page source — verify exactly one `<h1>` tag exists
  10. Verify the entire interface is displayed in Vietnamese
  11. Verify the "Add to Cart" button is blue (positive action colour)
  12. Verify tab order follows top-to-bottom, left-to-right sequence
**Test Data:**
  - Input: URL = `http://localhost:5173/product/1`
  - Expected Output: Product detail page with all 5 fields (image, name, price, description, category) rendered correctly
**Expected Result:** The product detail page displays: (1) a large product image with descriptive non-empty `alt` attribute, (2) the product name in full text, (3) the price formatted as e.g. `150,000 ₫` with thousands separator, (4) the description rendered as escaped text (no HTML injection), (5) the category name. Additionally: breadcrumbs are visible, exactly one `<h1>` tag exists, all text is in Vietnamese, the "Add to Cart" button is blue, and tab order is correct.
**Observed Result:** The Product detail page only displays: a large product image with descriptive non-empty `alt`attribute, the product name in full text, the price formatted as expected, the description rendered as escaped text (no HTML injection). But there is no category name, no breadcrumb navigation in the page, "Add to Cart" button is Green not blue.
**Status:** Failed
**EC Coverage:** EC-FR06-001, EC-FR06-022, EC-FR06-028, EC-FR06-029, EC-FR06-030, EC-FR06-031, EC-FR06-032, EC-FR06-033
**Req. Ref:** FR-06, FR-21, FR-23, FR-24, SEC-04
**Bug ID:** BUG-FR06-001

---

### TC-FR06-EP-002

**Test Case ID:** TC-FR06-EP-002
**Title:** Verify that quantity input field defaults to 1 and accepts valid positive integers
**Description:** Validates that the quantity input field on the product detail page is pre-set to 1 (minimum valid value) and allows the user to enter a valid positive integer.
**Priority:** High
**Pre-conditions:**
  - EShop frontend is running at `http://localhost:5173`
  - A product exists in the database (e.g., product id=1)
**Steps:**
  1. Navigate to `http://localhost:5173/product/1`
  2. Locate the quantity input field
  3. Verify the field's default/initial value is `1`
  4. Clear the field and type `5`
  5. Verify the field accepts and displays `5`
**Test Data:**
  - Input: quantity = `1` (default), then quantity = `5` (manual entry)
  - Expected Output: Field displays `1` initially, then `5` after user input
**Expected Result:** The quantity input field is pre-populated with the value `1`. After the user clears and types `5`, the field displays `5` without error.
**Observed Result:** As Expected Result
**Status:** Passed
**EC Coverage:** EC-FR06-007
**Req. Ref:** FR-06
**Bug ID:** None

---

### TC-FR06-EP-003

**Test Case ID:** TC-FR06-EP-003
**Title:** Verify that Add to Cart succeeds with valid quantity for an authenticated user
**Description:** Validates the complete "Add to Cart" flow for an authenticated user with a valid quantity. Covers success feedback (toast/badge), cart badge update, and valid auth state. The user should see visual confirmation after the action.
**Priority:** High
**Pre-conditions:**
  - EShop frontend and backend are running
  - User is logged in with valid credentials (e.g., `test@eshop.com` / `Test1234!`)
  - Product id=1 exists in the database
  - The product is NOT currently in the user's cart (clean state)
**Steps:**
  1. Log in with `test@eshop.com` / `Test1234!`
  2. Navigate to `http://localhost:5173/product/1`
  3. Set quantity to `3`
  4. Click the "Add to Cart" button
  5. Observe the UI feedback (toast notification or badge update)
  6. Check the cart badge in the navigation bar
**Test Data:**
  - Input: product_id = `1`, quantity = `3`, auth = valid JWT
  - Expected Output: Toast notification displayed, cart badge shows updated item count
**Expected Result:** After clicking "Add to Cart": (1) a visual feedback is shown — either a toast notification confirming the item was added or the cart badge updates, (2) the navbar cart badge reflects the new total number of items (incremented by 3).
**Observed Result:** A toast notification confirming the item was added to the cart is displayed.
**Status:** Passed
**EC Coverage:** EC-FR06-007, EC-FR06-014, EC-FR06-016, EC-FR06-018, EC-FR06-020, EC-FR06-024
**Req. Ref:** FR-06, FR-24, FR-23, SEC-02
**Bug ID:** None
**Cleanup:** Remove the product from the cart after the test.

---

### TC-FR06-EP-004

**Test Case ID:** TC-FR06-EP-004
**Title:** Verify that adding the same product to cart increments quantity instead of creating a new row
**Description:** Validates the cart increment behaviour (FR-07) — when a user adds a product that already exists in the cart, the system should increment the quantity of the existing cart entry, not create a duplicate row.
**Priority:** High
**Pre-conditions:**
  - User is logged in with valid credentials
  - Product id=1 exists in the database
  - Product id=1 is already in the user's cart with quantity = 2
**Steps:**
  1. Log in and navigate to `http://localhost:5173/product/1`
  2. Verify product id=1 is already in the cart (navigate to cart page to confirm quantity = 2)
  3. Return to `http://localhost:5173/product/1`
  4. Set quantity to `1`
  5. Click "Add to Cart"
  6. Navigate to the cart page
  7. Verify that product id=1 appears only once in the cart
  8. Verify that the quantity for product id=1 is now `3` (2 + 1)
**Test Data:**
  - Input: product_id = `1`, quantity = `1`, existing cart quantity = `2`
  - Expected Output: Cart shows product id=1 with quantity = `3`, no duplicate rows
**Expected Result:** The cart page shows product id=1 as a single row with quantity = `3`. No new row was created. The cart total reflects the updated quantity.
**Observed Result:** The cart page shows product id=1 as multiple rows, one with quantity = `2`, one with quantity = `1`. New row was created. Status: Failed.
**Status:** Failed
**EC Coverage:** EC-FR06-025
**Req. Ref:** FR-07, FR-06
**Bug ID:** BUG-FR06-002
**Cleanup:** Reset cart to empty state after test.

---

## NEG Test Cases (Invalid — one per invalid EC)

---

### TC-FR06-NEG-001

**Test Case ID:** TC-FR06-NEG-001
**Title:** Verify that product detail page shows error when navigating with a non-existent product ID
**Description:** Tests the system's response when a valid positive integer is used as the product ID but no matching product exists in the database. Isolates EC-FR06-002.
**Priority:** High
**Pre-conditions:**
  - EShop frontend and backend are running
  - No product with id=99999 exists in the database
**Steps:**
  1. Navigate to `http://localhost:5173/product/99999`
  2. Observe the page response
**Test Data:**
  - Input: URL = `http://localhost:5173/product/99999`
  - Expected Output: Error page or 404 message displayed
**Expected Result:** The system displays an appropriate error page or "Product not found" message. No blank page, no crash, no unhandled exception. The API returns HTTP 404.
**Observed Result:** "Product not found" message is displayed.
**Status:** Passed
**EC Coverage:** EC-FR06-002, EC-FR06-023
**Req. Ref:** FR-06
**Bug ID:** None

---

### TC-FR06-NEG-002

**Test Case ID:** TC-FR06-NEG-002
**Title:** Verify that product detail page shows error when product ID is zero
**Description:** Tests the system's handling of `id=0` in the URL path. Zero is not a valid product ID. Isolates EC-FR06-003.
**Priority:** Medium
**Pre-conditions:**
  - EShop frontend and backend are running
**Steps:**
  1. Navigate to `http://localhost:5173/product/0`
  2. Observe the page response
**Test Data:**
  - Input: URL = `http://localhost:5173/product/0`
  - Expected Output: Error page or 404 message
**Expected Result:** The system displays an appropriate error page or "Product not found" message. The API returns HTTP 404. No unhandled exception or blank page.
**Observed Result:** "Product not found" message is displayed.
**Status:** Passed
**EC Coverage:** EC-FR06-003
**Req. Ref:** FR-06
**Bug ID:** None

---

### TC-FR06-NEG-003

**Test Case ID:** TC-FR06-NEG-003
**Title:** Verify that product detail page shows error when product ID is a negative integer
**Description:** Tests the system's handling of a negative integer as product ID. Isolates EC-FR06-004.
**Priority:** Medium
**Pre-conditions:**
  - EShop frontend and backend are running
**Steps:**
  1. Navigate to `http://localhost:5173/product/-1`
  2. Observe the page response
**Test Data:**
  - Input: URL = `http://localhost:5173/product/-1`
  - Expected Output: Error page or 404 message
**Expected Result:** The system displays an appropriate error page or "Product not found" message. No crash, no unhandled exception.
**Observed Result:** "Product not found" message is displayed.
**Status:** Passed
**EC Coverage:** EC-FR06-004
**Req. Ref:** FR-06
**Bug ID:** None

---

### TC-FR06-NEG-004

**Test Case ID:** TC-FR06-NEG-004
**Title:** Verify that product detail page shows error when product ID is a non-numeric string
**Description:** Tests the system's handling of a non-numeric value as product ID in the URL. Isolates EC-FR06-005.
**Priority:** Medium
**Pre-conditions:**
  - EShop frontend and backend are running
**Steps:**
  1. Navigate to `http://localhost:5173/product/abc`
  2. Observe the page response
**Test Data:**
  - Input: URL = `http://localhost:5173/product/abc`
  - Expected Output: Error page or 404 message
**Expected Result:** The system displays an appropriate error page or "Product not found" message. No unhandled JavaScript error, no blank page. User-supplied data in the URL is safely handled (no XSS via URL parameter — SEC-04).
**Observed Result:** "Product not found" message is displayed.
**Status:** Passed
**EC Coverage:** EC-FR06-005
**Req. Ref:** FR-06, SEC-04
**Bug ID:** None

---

### TC-FR06-NEG-005

**Test Case ID:** TC-FR06-NEG-005
**Title:** Verify that product detail page handles an extremely large product ID gracefully
**Description:** Tests the system's handling of an extremely large integer as product ID, potentially exceeding database integer limits. Isolates EC-FR06-006.
**Priority:** Low
**Pre-conditions:**
  - EShop frontend and backend are running
**Steps:**
  1. Navigate to `http://localhost:5173/product/9999999999999`
  2. Observe the page response
**Test Data:**
  - Input: URL = `http://localhost:5173/product/9999999999999`
  - Expected Output: Error page or 404 message
**Expected Result:** The system displays an appropriate error page or "Product not found" message. No server crash, no 500 Internal Server Error, no unhandled exception.
**Observed Result:** "Product not found" message is displayed.
**Status:** Passed
**EC Coverage:** EC-FR06-006
**Req. Ref:** FR-06
**Bug ID:** None

---

### TC-FR06-NEG-006

**Test Case ID:** TC-FR06-NEG-006
**Title:** Verify that quantity field rejects zero value on the product detail page
**Description:** Tests that the system prevents or rejects a quantity of 0, which is below the specification minimum of 1. Isolates EC-FR06-008.
**Priority:** High
**Pre-conditions:**
  - EShop frontend and backend are running
  - A product exists (e.g., product id=1)
  - User is logged in
**Steps:**
  1. Navigate to `http://localhost:5173/product/1`
  2. Clear the quantity field and type `0`
  3. Click "Add to Cart"
  4. Observe the system response
**Test Data:**
  - Input: quantity = `0`, product_id = `1`
  - Expected Output: Error message or prevention of add-to-cart action
**Expected Result:** The system rejects the quantity of 0. Either: (a) the input field prevents entry of 0 (e.g., HTML `min=1`), or (b) clicking "Add to Cart" displays an error message such as "Quantity must be at least 1", or (c) the API returns an error. The product is NOT added to the cart with quantity 0.
**Observed Result:** The system didn't reject the quantity of O. It was added to the cart.
**Status:** Failed
**EC Coverage:** EC-FR06-008, EC-FR06-027
**Req. Ref:** FR-06
**Bug ID:** BUG-FR06-003

---

### TC-FR06-NEG-007

**Test Case ID:** TC-FR06-NEG-007
**Title:** Verify that quantity field rejects negative integer on the product detail page
**Description:** Tests that the system prevents or rejects a negative quantity value. Isolates EC-FR06-009.
**Priority:** High
**Pre-conditions:**
  - EShop frontend and backend are running
  - A product exists (e.g., product id=1)
  - User is logged in
**Steps:**
  1. Navigate to `http://localhost:5173/product/1`
  2. Clear the quantity field and type `-1`
  3. Click "Add to Cart"
  4. Observe the system response
**Test Data:**
  - Input: quantity = `-1`, product_id = `1`
  - Expected Output: Error message or prevention of add-to-cart action
**Expected Result:** The system rejects the negative quantity. Either: (a) the input field prevents entry of negative values, or (b) an error message is displayed, or (c) the API returns an error. The product is NOT added to the cart with quantity -1.
**Observed Result:** The system didn't reject the quantity of negative one. It was added to the cart.
**Status:** Failed
**EC Coverage:** EC-FR06-009, EC-FR06-027
**Req. Ref:** FR-06
**Bug ID:** BUG-FR06-004

---

### TC-FR06-NEG-008

**Test Case ID:** TC-FR06-NEG-008
**Title:** Verify that quantity field rejects decimal value on the product detail page
**Description:** Tests that the system rejects a non-integer decimal quantity. FR-06 specifies "positive integers" only. Isolates EC-FR06-010.
**Priority:** Medium
**Pre-conditions:**
  - EShop frontend and backend are running
  - A product exists (e.g., product id=1)
  - User is logged in
**Steps:**
  1. Navigate to `http://localhost:5173/product/1`
  2. Clear the quantity field and type `1.5`
  3. Click "Add to Cart"
  4. Observe the system response
**Test Data:**
  - Input: quantity = `1.5`, product_id = `1`
  - Expected Output: Error message or truncation/rounding to integer
  
**Expected Result:** The system rejects the decimal quantity or handles it safely. Either: (a) the input field prevents decimal entry, (b) the value is rounded/truncated to the nearest integer before processing, or (c) an error message is displayed. A decimal value must NOT be stored as-is in the cart.
**Observed Result:** The system didn't reject the decimal quantity. It was added to the cart and quantity decimal truncate from 1.5 to 1.
**Status:** Failed
**EC Coverage:** EC-FR06-010, EC-FR06-027
**Req. Ref:** FR-06
**Bug ID:** BUG-FR06-005

---

### TC-FR06-NEG-009

**Test Case ID:** TC-FR06-NEG-009
**Title:** Verify that quantity field rejects non-numeric string input on the product detail page
**Description:** Tests that the system handles non-numeric text in the quantity field. HITL confirmed the UI improperly allows typing non-numeric characters, causing NaN to be sent to the API. Isolates EC-FR06-011.
**Priority:** High
**Pre-conditions:**
  - EShop frontend and backend are running
  - A product exists (e.g., product id=1)
  - User is logged in
**Steps:**
  1. Navigate to `http://localhost:5173/product/1`
  2. Clear the quantity field and type `abc`
  3. Click "Add to Cart"
  4. Observe the system response
  5. Check the cart page — verify no invalid entry was added
**Test Data:**
  - Input: quantity = `abc`, product_id = `1`
  - Expected Output: Error message; NaN must NOT reach the cart or API
**Expected Result:** The system rejects the non-numeric input. Either: (a) the input field prevents non-numeric characters, or (b) the frontend validates and displays an error before sending to API, or (c) the API rejects NaN values. The product is NOT added to the cart with an invalid quantity. No NaN value persists in the system.
**Observed Result:** The system didn't reject the non-numeric input with input type='number' in HTML. The product was added to the cart. Status: Failed.
**Status:** Failed
**EC Coverage:** EC-FR06-011, EC-FR06-027
**Req. Ref:** FR-06
**Bug ID:** BUG-FR06-006

---

### TC-FR06-NEG-010

**Test Case ID:** TC-FR06-NEG-010
**Title:** Verify that quantity field rejects empty value on the product detail page
**Description:** Tests that the system handles an empty/blank quantity field. Isolates EC-FR06-012.
**Priority:** Medium
**Pre-conditions:**
  - EShop frontend and backend are running
  - A product exists (e.g., product id=1)
  - User is logged in
**Steps:**
  1. Navigate to `http://localhost:5173/product/1`
  2. Clear the quantity field completely (leave it blank)
  3. Click "Add to Cart"
  4. Observe the system response
**Test Data:**
  - Input: quantity = `` (empty), product_id = `1`
  - Expected Output: Error message or prevention of add-to-cart action
**Expected Result:** The system rejects the empty quantity. Either: (a) the field retains its minimum value of 1 and does not allow clearing, or (b) an error message is displayed, or (c) the "Add to Cart" button is disabled. The product is NOT added to the cart with an undefined/empty quantity.
**Observed Result:** The system didn't reject the empty quantity. The product was added to the cart with NaN quantity. Status: Failed.
**Status:** Failed
**EC Coverage:** EC-FR06-012, EC-FR06-027
**Req. Ref:** FR-06
**Bug ID:** BUG-FR06-007

---

### TC-FR06-NEG-011

**Test Case ID:** TC-FR06-NEG-011
**Title:** Verify that system handles extremely large quantity value on the product detail page
**Description:** Tests the system's response to a very large quantity value (999999999) at the system boundary. HITL set 999 as system UI baseline; this tests beyond that. Isolates EC-FR06-013.
**Priority:** Medium
**Pre-conditions:**
  - EShop frontend and backend are running
  - A product exists (e.g., product id=1)
  - User is logged in
**Steps:**
  1. Navigate to `http://localhost:5173/product/1`
  2. Clear the quantity field and type `999999999`
  3. Click "Add to Cart"
  4. Observe the system response
  5. If accepted, navigate to the cart page and check the total calculation
**Test Data:**
  - Input: quantity = `999999999`, product_id = `1`
  - Expected Output: System rejects the value or handles overflow gracefully
**Expected Result:** The system either: (a) rejects the extremely large quantity with an appropriate error message, (b) caps the quantity at a reasonable maximum, or (c) if it accepts the value, the cart total calculates correctly without integer overflow or NaN. No system crash or 500 error.
**Observed Result:** The system didn't reject the extremely large quantity. It was added to the cart without interger overflow or NaN. No system crash or 500 Error either. 
**Status:** Failed
**EC Coverage:** EC-FR06-013
**Req. Ref:** FR-06
**Bug ID:** BUG-FR06-008

---

### TC-FR06-NEG-012

**Test Case ID:** TC-FR06-NEG-012
**Title:** Verify that Add to Cart is blocked for an unauthenticated user on the product detail page
**Description:** Tests the system's behaviour when a non-logged-in user attempts to add a product to the cart. HITL resolution: system should redirect to `/login` or show descriptive error toast. Isolates EC-FR06-015.
**Priority:** High
**Pre-conditions:**
  - EShop frontend and backend are running
  - User is NOT logged in (no JWT token)
  - A product exists (e.g., product id=1)
**Steps:**
  1. Open a browser in private/incognito mode (ensure no session exists)
  2. Navigate to `http://localhost:5173/product/1`
  3. Verify the product detail page loads correctly (viewing does not require auth)
  4. Set quantity to `1`
  5. Click "Add to Cart"
  6. Observe the system response
**Test Data:**
  - Input: product_id = `1`, quantity = `1`, auth = none
  - Expected Output: Redirect to login page or descriptive error toast
**Expected Result:** The system blocks the add-to-cart action. Either: (a) the user is redirected to `/login` page, or (b) a descriptive error toast/message is displayed (e.g., "Please log in to add items to your cart"). No silent failure, no UI crash, no product added to an anonymous cart.
**Observed Result:** The system didn't block the add-to-cart action with unauthenticated user. It still add the product to the cart. 
**Status:** Failed
**EC Coverage:** EC-FR06-015, EC-FR06-026
**Req. Ref:** SEC-02, FR-06
**Bug ID:** BUG-FR06-009

---

### TC-FR06-NEG-013

**Test Case ID:** TC-FR06-NEG-013
**Title:** Verify that API rejects Add to Cart request with a non-existent product ID via direct API call
**Description:** Tests the API's handling of a tampered product ID in the `POST /api/cart` request body. Isolates EC-FR06-017.
**Priority:** Medium
**Pre-conditions:**
  - EShop backend is running at `http://localhost:3000`
  - User is logged in (valid JWT token available)
  - No product with id=99999 exists in the database
**Steps:**
  1. Obtain a valid JWT token by logging in via `POST /api/login`
  2. Send `POST /api/cart` with body: `{"id": 99999, "name": "Fake Product", "price": 100000, "quantity": 1}`
  3. Include `Authorization: Bearer <token>` header
  4. Observe the API response
**Test Data:**
  - Input: `{"id": 99999, "name": "Fake Product", "price": 100000, "quantity": 1}`
  - Expected Output: HTTP 400/404 error response
**Expected Result:** The API returns an error (HTTP 400 or 404) indicating the product does not exist. The item is NOT added to the user's cart.
**Observed Result:** The API didn't return an error (HTTP 400 or 404) indicating the product does not exist. The item is added to the user's cart.
**Status:** Failed
**EC Coverage:** EC-FR06-017
**Req. Ref:** API §4.2
**Bug ID:** BUG-FR06-010

---

### TC-FR06-NEG-014

**Test Case ID:** TC-FR06-NEG-014
**Title:** Verify that API rejects Add to Cart request with a tampered zero price via direct API call
**Description:** Tests the API's handling of a tampered price (price=0) in the cart request body. HITL confirmed backend blindly trusts client data — this is a critical security test. Isolates EC-FR06-019. Execute via Postman/cURL only (per HITL mandate).
**Priority:** High
**Pre-conditions:**
  - EShop backend is running at `http://localhost:3000`
  - User is logged in (valid JWT token available)
  - Product id=1 exists with an actual price > 0
**Steps:**
  1. Obtain a valid JWT token by logging in via `POST /api/login`
  2. Send `POST /api/cart` with body: `{"id": 1, "name": "Product 1", "price": 0, "quantity": 1}`
  3. Include `Authorization: Bearer <token>` header
  4. Observe the API response
  5. Check the cart via `GET /api/cart` — verify no zero-price item exists
**Test Data:**
  - Input: `{"id": 1, "name": "iPhone 15 Pro Max", "price": 0, "quantity": 1}`
  - Expected Output: HTTP 400 error — price must be > 0
**Expected Result:** The API rejects the request with an error indicating invalid price. The product is NOT added to the cart with price = 0. If the API accepts it (known vulnerability per HITL finding), this is a bug — report it.
**Observed Result:** The API didn't reject the request with zero price. The product was added to the cart with price = 0. 
**Status:** Failed
**EC Coverage:** EC-FR06-019
**Req. Ref:** FR-15, API §4.2, SEC-02
**Bug ID:** BUG-FR06-011

---

### TC-FR06-NEG-015

**Test Case ID:** TC-FR06-NEG-015
**Title:** Verify that API rejects Add to Cart request with a negative price via direct API call
**Description:** Tests the API's handling of a negative price in the cart request body. Isolates the negative boundary of EC-FR06-019. Execute via Postman/cURL only.
**Priority:** High
**Pre-conditions:**
  - EShop backend is running at `http://localhost:3000`
  - User is logged in (valid JWT token available)
  - Product id=1 exists
**Steps:**
  1. Obtain a valid JWT token
  2. Send `POST /api/cart` with body: `{"id": 1, "name": "iPhone 15 Pro Max", "price": -1000000, "quantity": 1}`
  3. Include `Authorization: Bearer <token>` header
  4. Observe the API response
  5. Check the cart via `GET /api/cart`
**Test Data:**
  - Input: `{"id": 1, "name": "iPhone 15 Pro Max", "price": -1000000, "quantity": 1}`
  - Expected Output: HTTP 400 error — price must be positive
**Expected Result:** The API rejects the request with an error. A negative price must NOT be stored in the cart. If accepted, this enables negative cart totals — a critical financial bug.
**Observed Result:** The API didn't reject the request with negative price. The product was added to the cart with negative price. 
**Status:** Failed
**EC Coverage:** EC-FR06-019
**Req. Ref:** FR-15, API §4.2, SEC-02
**Bug ID:** BUG-FR06-012

---

### TC-FR06-NEG-016

**Test Case ID:** TC-FR06-NEG-016
**Title:** Verify that API rejects Add to Cart request with zero quantity via direct API call
**Description:** Tests the API's handling of quantity=0 in the `POST /api/cart` request body. Isolates EC-FR06-021 at the API level.
**Priority:** High
**Pre-conditions:**
  - EShop backend is running
  - User is logged in (valid JWT token)
  - Product id=1 exists
**Steps:**
  1. Obtain a valid JWT token
  2. Send `POST /api/cart` with body: `{"id": 1, "name": "iPhone 15 Pro Max", "price": 30000000, "quantity": 0}`
  3. Include `Authorization: Bearer <token>` header
  4. Observe the API response
**Test Data:**
  - Input: `{"id": 1, "name": "iPhone 15 Pro Max", "price": 30000000, "quantity": 0}`
  - Expected Output: HTTP 400 error — quantity must be ≥ 1
**Expected Result:** The API rejects the request. Zero quantity is below the specification minimum (FR-06: "minimum value of 1"). The product is NOT added to the cart.
**Observed Result:** The API didn't reject the request with zero quantity. The product was added to the cart with zero quantity. 
**Status:** Failed
**EC Coverage:** EC-FR06-021
**Req. Ref:** FR-06, API §4.2
**Bug ID:** BUG-FR06-013

---

### TC-FR06-NEG-017

**Test Case ID:** TC-FR06-NEG-017
**Title:** Verify that API rejects Add to Cart request with NaN quantity via direct API call
**Description:** Tests the API's handling of a NaN (non-numeric) quantity in the cart request body. HITL confirmed this vulnerability: NaN reaches the backend. Isolates EC-FR06-021 (NaN variant).
**Priority:** High
**Pre-conditions:**
  - EShop backend is running
  - User is logged in (valid JWT token)
  - Product id=1 exists
**Steps:**
  1. Obtain a valid JWT token
  2. Send `POST /api/cart` with body: `{"id": 1, "name": "iPhone 15 Pro Max", "price": 30000000, "quantity": "abc"}`
  3. Include `Authorization: Bearer <token>` header
  4. Observe the API response
  5. Check the cart via `GET /api/cart`
**Test Data:**
  - Input: `{"id": 1, "name": "iPhone 15 Pro Max", "price": 30000000, "quantity": "abc"}`
  - Expected Output: HTTP 400 error — quantity must be a positive integer
**Expected Result:** The API rejects the request with an error indicating invalid quantity type. The string "abc" must NOT be stored as the quantity. If accepted (known vulnerability per HITL), this is a bug — NaN quantity corrupts cart data.
**Observed Result:** The API didn't reject the request with NaN quantity. The product was added to the cart with NaN quantity. 
**Status:** Failed
**EC Coverage:** EC-FR06-021
**Req. Ref:** FR-06, API §4.2
**Bug ID:** BUG-FR06-014

---

### TC-FR06-NEG-018

**Test Case ID:** TC-FR06-NEG-018
**Title:** Verify that API rejects Add to Cart request with tampered low price via direct API call
**Description:** Tests the critical price tampering vulnerability. The client sends a price of 1₫ when the actual DB price is 100,000₫. HITL confirmed the backend blindly trusts client-sent price. Execute via Postman/cURL only (per HITL mandate).
**Priority:** High
**Pre-conditions:**
  - EShop backend is running
  - User is logged in (valid JWT token)
  - Product id=1 exists with actual price > 1 (e.g., price = 30000000)
**Steps:**
  1. Obtain a valid JWT token
  2. Query the actual price: `GET /api/products/1` → note the real price (e.g., 30000000)
  3. Send `POST /api/cart` with body: `{"id": 1, "name": "iPhone 15 Pro Max", "price": 1, "quantity": 1}`
  4. Include `Authorization: Bearer <token>` header
  5. Observe the API response
  6. Check the cart via `GET /api/cart` — check if price = 1 was accepted
  7. If accepted, proceed to checkout and verify the order total
**Test Data:**
  - Input: `{"id": 1, "name": "iPhone 15 Pro Max", "price": 1, "quantity": 1}` (actual DB price = 30000000)
  - Expected Output: API should reject or override with actual DB price
**Expected Result:** The API either: (a) rejects the request because the price doesn't match the DB price, or (b) overrides the client-sent price with the actual DB price. If the API accepts price = 1 and allows checkout at that price, this is a critical security bug (price tampering attack).
**Observed Result:** The API didn't reject the request with tampered low price. The product was added to the cart with tampered low price. 
**Status:** Failed
**EC Coverage:** EC-FR06-019
**Req. Ref:** API §4.2, SEC-02
**Bug ID:** BUG-FR06-015

---

## BV Test Cases (Boundary)

---

### TC-FR06-BV-001

**Test Case ID:** TC-FR06-BV-001
**Title:** Verify that product detail page loads correctly with the smallest valid product ID (id=1)
**Description:** Tests the exact lower boundary of the product ID range. BVA point: LB = 1 (specification boundary). This is the minimum valid product ID per FR-06.
**Priority:** Medium
**Pre-conditions:**
  - Product with id=1 exists in the database
**Steps:**
  1. Navigate to `http://localhost:5173/product/1`
  2. Verify the product detail page loads with all required fields
**Test Data:**
  - Input: URL = `http://localhost:5173/product/1`
  - Expected Output: Product detail page displayed correctly
**Expected Result:** The product detail page for id=1 loads successfully with all 5 required fields (image, name, price, description, category).
**Observed Result:** There is no category name in product detail page
**Status:** Failed
**EC Coverage:** EC-FR06-001
**Req. Ref:** FR-06
**Bug ID:** BUG-FR06-016

---

### TC-FR06-BV-002

**Test Case ID:** TC-FR06-BV-002
**Title:** Verify that product detail page loads correctly with the second smallest product ID (id=2)
**Description:** Tests one step above the lower boundary. BVA point: LB+1 = 2.
**Priority:** Low
**Pre-conditions:**
  - Product with id=2 exists in the database
**Steps:**
  1. Navigate to `http://localhost:5173/product/2`
  2. Verify the product detail page loads with all required fields
**Test Data:**
  - Input: URL = `http://localhost:5173/product/2`
  - Expected Output: Product detail page displayed correctly
**Expected Result:** The product detail page for id=2 loads successfully with all 5 required fields.
**Observed Result:** There is no category name in product detail page
**Status:** Failed
**EC Coverage:** EC-FR06-001
**Req. Ref:** FR-06
**Bug ID:** BUG-FR06-017

---

### TC-FR06-BV-003

**Test Case ID:** TC-FR06-BV-003
**Title:** Verify that quantity field accepts the minimum valid value of 1 and Add to Cart succeeds
**Description:** Tests the exact lower boundary of the quantity range. BVA point: LB = 1 (specification boundary). This is the minimum valid quantity per FR-06.
**Priority:** High
**Pre-conditions:**
  - User is logged in
  - Product id=1 exists
**Steps:**
  1. Navigate to `http://localhost:5173/product/1`
  2. Set quantity to `1` (or verify default is `1`)
  3. Click "Add to Cart"
  4. Verify success feedback is shown
**Test Data:**
  - Input: quantity = `1`, product_id = `1`
  - Expected Output: Add to Cart succeeds; toast/badge feedback shown
**Expected Result:** The system accepts quantity = 1 and adds the product to the cart. Visual feedback (toast or badge update) is displayed.
**Observed Result:** As Expected Result
**Status:** Passed
**EC Coverage:** EC-FR06-007
**Req. Ref:** FR-06
**Bug ID:** None
**Cleanup:** Remove item from cart after test.

---

### TC-FR06-BV-004

**Test Case ID:** TC-FR06-BV-004
**Title:** Verify that quantity field accepts the value 2 (one above minimum boundary)
**Description:** Tests one step above the lower boundary. BVA point: LB+1 = 2.
**Priority:** Medium
**Pre-conditions:**
  - User is logged in
  - Product id=1 exists
**Steps:**
  1. Navigate to `http://localhost:5173/product/1`
  2. Set quantity to `2`
  3. Click "Add to Cart"
  4. Verify success feedback is shown
**Test Data:**
  - Input: quantity = `2`, product_id = `1`
  - Expected Output: Add to Cart succeeds
**Expected Result:** The system accepts quantity = 2 and adds the product to the cart with quantity 2.
**Observed Result:** As Expected Result
**Status:** Passed
**EC Coverage:** EC-FR06-007
**Req. Ref:** FR-06
**Bug ID:** None
**Cleanup:** Remove item from cart after test.

---

### TC-FR06-BV-005

**Test Case ID:** TC-FR06-BV-005
**Title:** Verify that quantity field accepts the system UI baseline upper boundary of 999
**Description:** Tests the system UI baseline upper boundary (set by HITL as non-functional baseline). BVA point: UB = 999 (system boundary). No spec-defined UB exists.
**Priority:** Medium
**Pre-conditions:**
  - User is logged in
  - Product id=1 exists
**Steps:**
  1. Navigate to `http://localhost:5173/product/1`
  2. Clear the quantity field and type `999`
  3. Click "Add to Cart"
  4. Observe the system response
  5. If accepted, verify cart total calculates correctly
**Test Data:**
  - Input: quantity = `999`, product_id = `1`
  - Expected Output: System accepts or rejects gracefully (no crash, no overflow)
**Expected Result:** The system either: (a) accepts quantity = 999 and the cart total is calculated correctly without overflow, or (b) displays a validation message indicating the quantity exceeds a practical limit. No server error or crash.
**Observed Result:** The server accepts quantity = 999 and the cart total is calculated correctly
**Status:** Passed
**EC Coverage:** EC-FR06-007, EC-FR06-013
**Req. Ref:** FR-06
**Bug ID:** None
**Cleanup:** Remove item from cart after test.

---

### TC-FR06-BV-006

**Test Case ID:** TC-FR06-BV-006
**Title:** Verify that API handles cart request with the minimum valid price of 1₫ via direct API call
**Description:** Tests the exact lower boundary of valid price. BVA point: LB = 1 (specification: price > 0, smallest positive integer).
**Priority:** Medium
**Pre-conditions:**
  - EShop backend is running
  - User is logged in (valid JWT token)
  - Product id=1 exists
**Steps:**
  1. Obtain a valid JWT token by logging in via `POST /api/login`
  2. Send `POST /api/cart` with body: `{"id": 1, "name": "iPhone 15 Pro Max", "price": 1, "quantity": 1}`
  3. Include `Authorization: Bearer <token>` header
  4. Observe the API response
**Test Data:**
  - Input: `{"id": 1, "name": "iPhone 15 Pro Max", "price": 1, "quantity": 1}`
  - Expected Output: API processes the request (price = 1 is technically valid as it is > 0)
**Expected Result:** The API accepts the request since price = 1 is a valid positive integer. Note: If the backend validates the price against the DB (it should but doesn't per HITL finding), this may be rejected. Document actual behaviour.
**Observed Result:** The API didn't reject the request. price = 1 is added to the cart
**Status:** Failed
**EC Coverage:** EC-FR06-018
**Req. Ref:** FR-15, API §4.2
**Bug ID:** BUG-FR06-018
**Cleanup:** Remove item from cart after test.

---

### TC-FR06-BV-007

**Test Case ID:** TC-FR06-BV-007
**Title:** Verify that API rejects cart request with negative quantity of -1 via direct API call
**Description:** Tests the API's handling of quantity = -1 (one below the lower boundary). BVA point: LB-1 = 0 already covered in NEG-016; this tests far below at -1.
**Priority:** High
**Pre-conditions:**
  - EShop backend is running
  - User is logged in (valid JWT token)
  - Product id=1 exists
**Steps:**
  1. Obtain a valid JWT token
  2. Send `POST /api/cart` with body: `{"id": 1, "name": "iPhone 15 Pro Max", "price": 1, "quantity": -1}`
  3. Include `Authorization: Bearer <token>` header
  4. Observe the API response
**Test Data:**
  - Input: `{"id": 1, "name": "iPhone 15 Pro Max", "price": 1, "quantity": -1}`
  - Expected Output: HTTP 400 error — quantity must be ≥ 1
**Expected Result:** The API rejects the request. Negative quantity must NOT be stored in the cart.
**Observed Result:** The API didn't reject the request. Negative quantity = -1 is added to the cart
**Status:** Failed
**EC Coverage:** EC-FR06-021
**Req. Ref:** FR-06, API §4.2
**Bug ID:** BUG-FR06-019

---

### TC-FR06-BV-008

**Test Case ID:** TC-FR06-BV-008
**Title:** Verify that API handles extremely large quantity (999999999) as stress test via direct API call
**Description:** Tests the database practical limit for quantity. BVA point: DB boundary. HITL classified this as an API negative stress test.
**Priority:** Low
**Pre-conditions:**
  - EShop backend is running
  - User is logged in (valid JWT token)
  - Product id=1 exists (price = 30000000)
**Steps:**
  1. Obtain a valid JWT token
  2. Send `POST /api/cart` with body: `{"id": 1, "name": "iPhone 15 Pro Max", "price": 30000000, "quantity": 999999999}`
  3. Include `Authorization: Bearer <token>` header
  4. Observe the API response
  5. If accepted, check cart total (30000000 × 999999999 = ~3 × 10^16 — potential overflow)
**Test Data:**
  - Input: `{"id": 1, "name": "iPhone 15 Pro Max", "price": 30000000, "quantity": 999999999}`
  - Expected Output: Rejection, or if accepted, correct total without overflow
**Expected Result:** The API either: (a) rejects the extremely large quantity with an error, or (b) if accepted, the cart total (approximately 99,999,999,900,000 ₫) calculates without integer overflow or NaN. No 500 server error.
**Observed Result:** The API didn't reject the extremely large quantiy with an error, it still accepted but the tester doesn't have a way to check to sum in API, the closest API required tester to calculate by hand with calculator
**Status:** Failed
**EC Coverage:** EC-FR06-013, EC-FR06-021
**Req. Ref:** FR-06, API §4.2
**Bug ID:** BUG-FR06-020
**Cleanup:** Remove item from cart after test.

---

## Coverage Matrix

| EC ID | Description | Type | Covered By |
|-------|-------------|:----:|------------|
| EC-FR06-001 | Valid existing product ID | VALID | TC-FR06-EP-001, TC-FR06-BV-001, TC-FR06-BV-002 |
| EC-FR06-002 | Non-existent product ID | INVALID | TC-FR06-NEG-001 |
| EC-FR06-003 | Product ID = 0 | INVALID | TC-FR06-NEG-002 |
| EC-FR06-004 | Negative product ID | INVALID | TC-FR06-NEG-003 |
| EC-FR06-005 | Non-numeric product ID | INVALID | TC-FR06-NEG-004 |
| EC-FR06-006 | Extremely large product ID | INVALID | TC-FR06-NEG-005 |
| EC-FR06-007 | Valid quantity ≥ 1 | VALID | TC-FR06-EP-002, TC-FR06-EP-003, TC-FR06-BV-003, TC-FR06-BV-004, TC-FR06-BV-005 |
| EC-FR06-008 | Quantity = 0 | INVALID | TC-FR06-NEG-006 |
| EC-FR06-009 | Negative quantity | INVALID | TC-FR06-NEG-007 |
| EC-FR06-010 | Decimal quantity | INVALID | TC-FR06-NEG-008 |
| EC-FR06-011 | Non-numeric quantity (NaN) | INVALID | TC-FR06-NEG-009 |
| EC-FR06-012 | Empty quantity | INVALID | TC-FR06-NEG-010 |
| EC-FR06-013 | Extremely large quantity | INVALID | TC-FR06-NEG-011, TC-FR06-BV-005, TC-FR06-BV-008 |
| EC-FR06-014 | Authenticated user | VALID | TC-FR06-EP-003 |
| EC-FR06-015 | Unauthenticated user | INVALID | TC-FR06-NEG-012 |
| EC-FR06-016 | Valid cart product ID | VALID | TC-FR06-EP-003 |
| EC-FR06-017 | Non-existent cart product ID | INVALID | TC-FR06-NEG-013 |
| EC-FR06-018 | Valid cart price | VALID | TC-FR06-EP-003, TC-FR06-BV-006 |
| EC-FR06-019 | Invalid/tampered cart price | INVALID | TC-FR06-NEG-014, TC-FR06-NEG-015, TC-FR06-NEG-018 |
| EC-FR06-020 | Valid cart quantity | VALID | TC-FR06-EP-003 |
| EC-FR06-021 | Invalid cart quantity (API) | INVALID | TC-FR06-NEG-016, TC-FR06-NEG-017, TC-FR06-BV-007, TC-FR06-BV-008 |
| EC-FR06-022 | Valid product display | VALID OUTPUT | TC-FR06-EP-001 |
| EC-FR06-023 | Product not found display | INVALID OUTPUT | TC-FR06-NEG-001 |
| EC-FR06-024 | Add to Cart success feedback | VALID OUTPUT | TC-FR06-EP-003 |
| EC-FR06-025 | Cart quantity increment | VALID OUTPUT | TC-FR06-EP-004 |
| EC-FR06-026 | Unauthenticated error | INVALID OUTPUT | TC-FR06-NEG-012 |
| EC-FR06-027 | Invalid quantity error | INVALID OUTPUT | TC-FR06-NEG-006, NEG-007, NEG-008, NEG-009, NEG-010 |
| EC-FR06-028 | Breadcrumbs displayed | VALID OUTPUT | TC-FR06-EP-001 |
| EC-FR06-029 | Single `<h1>` tag | VALID OUTPUT | TC-FR06-EP-001 |
| EC-FR06-030 | Vietnamese language | VALID OUTPUT | TC-FR06-EP-001 |
| EC-FR06-031 | Blue Add to Cart button | VALID OUTPUT | TC-FR06-EP-001 |
| EC-FR06-032 | Correct tab order | VALID OUTPUT | TC-FR06-EP-001 |
| EC-FR06-033 | Non-empty image alt | VALID OUTPUT | TC-FR06-EP-001 |

---

### Coverage Verification

```
[x] Every VALID EC (15) → covered by at least one EP or BV test case
[x] Every INVALID EC (18) → covered by at least one NEG test case (isolated — no two invalids combined)
[x] Every BVA boundary point → covered by a BV test case
[x] Every FR-XX requirement referenced → FR-06, FR-07, FR-15, FR-21, FR-23, FR-24, SEC-02, SEC-04
```

**Total:** 4 EP test cases + 18 NEG test cases + 8 BV test cases = **30 test cases**

---

### Self-Audit (AGENTS.md §7 — Test Case Gate)

```
[x] Each invalid class has its own isolated test case (18 NEG TCs for 18 INVALID ECs)
[x] Valid classes are efficiently combined (4 EP TCs cover 15 VALID ECs)
[x] Every title follows: Action + Function + Condition
[x] Expected results are precise and written before execution (no vague language)
[x] Every TC references at least one EC ID and one FR/SEC ID
[x] Test cases are self-standing (complete pre-conditions, steps, and data)
[x] Test cases note cleanup where required (self-cleaning)
```

---

**HITL Review:** Accepted
