# Master Defect Registry Report — EShop E-Commerce Platform
- **Test Cycle:** HW02 Domain & Boundary Testing
- **Environment Baseline:** macOS Tahoe 26.1 / Microsoft Edge & Postman Layer
- **Reported By:** Gemini QA Agent + Thái Minh Huy (23127379)
- **Document Status:** Live Defect Tracking Ledger
---

## TABLE OF CONTENTS
1. POOL A — FR-06: PRODUCT DETAIL VIEW (WEB FRONTEND)
2. POOL B — FR-08: CHECKOUT (WEB FRONTEND)
3. POOL C — FR-15: PRODUCT MANAGEMENT (CRUD WEB ADMIN)
4. POOL D — FR-04: PERSONAL PROFILE MANAGEMENT (MOBILE APP)

---

## POOL A — FR-06: Product Detail View (Web Frontend)
**Total Bugs Filed in Pool A:** 20 Defects (4 Fatal, 13 Serious, 3 Medium)

### Bug Report: BUG-FR06-001

**Date:** 2026-06-13
**Function Name:** FR-06 Product Detail View — Product Information Display
**Problem Summary:** Product detail page is missing the category name field, missing breadcrumb navigation, and the "Add to Cart" button is displayed in green instead of the required blue colour (Expected: category name displayed, breadcrumbs visible, and button colour blue per FR-21/FR-24).
**Severity:** Serious
**Priority:** High
**Status:** New
**Reported By:** Gemini QA Agent + Thái Minh Huy
**Assign To:** Development Team

#### Steps to Reproduce

**Pre-conditions:**
- EShop frontend running at `http://localhost:5173`
- EShop backend running at `http://localhost:3000`
- At least one product exists in the database (product id=1)
- User does not need to be logged in to view the product

**Steps:**
1. Open Microsoft Edge and navigate to `http://localhost:5173/product/1`
2. Wait for the product detail page to fully load
3. Observe whether the **category name** is displayed anywhere on the page
4. Observe whether **breadcrumb navigation** (e.g., Home > Category > Product Name) is present
5. Observe the **colour** of the "Add to Cart" button

**Expected Result:**
Per FR-06: The product detail page must display all 5 required fields — image, name, price (₫ formatted), description, and **category name**. Per FR-21: breadcrumb navigation must be present. Per FR-24: the "Add to Cart" button must use blue (positive action colour).

**Actual Result:**
- The category name field is **absent** from the product detail page
- Breadcrumb navigation is **absent** — no navigation trail visible
- The "Add to Cart" button is displayed in **green**, not blue

**Environment:**
- OS: macOS Tahoe 26.1
- Browser: Microsoft Edge (latest)
- App URL: http://localhost:5173/product/1
- Test Data: product_id=1

**GitHub Issue:** https://github.com/AkiraTomori/eshop-sut/issues/1
**Linked Test Case:** TC-FR06-EP-001, TC-FR06-BV-001, TC-FR06-BV-002

---

### Bug Report: BUG-FR06-002

**Date:** 2026-06-13
**Function Name:** FR-06 Product Detail View / FR-07 Cart Management — Add to Cart Duplicate Row
**Problem Summary:** Adding a product that already exists in the cart creates a new duplicate row instead of incrementing the existing row's quantity (Expected: existing cart entry quantity is incremented; no duplicate rows).
**Severity:** Serious
**Priority:** High
**Status:** New
**Reported By:** Gemini QA Agent + Thái Minh Huy
**Assign To:** Development Team

#### Steps to Reproduce

**Pre-conditions:**
- EShop frontend and backend are running
- User is logged in with valid credentials (e.g., `test@eshop.com` / `Test1234!`)
- Product id=1 exists in the database
- Product id=1 is **already in the user's cart** with quantity = 2

**Steps:**
1. Log in to the application at `http://localhost:5173`
2. Navigate to the cart page to confirm product id=1 is present with quantity = 2
3. Navigate to `http://localhost:5173/product/1`
4. Set quantity to `1`
5. Click the "Add to Cart" button
6. Navigate back to the cart page
7. Observe the number of rows for product id=1 and the quantity displayed

**Expected Result:**
Per FR-07: If the product already exists in the cart, the system must increment the existing cart entry's quantity. The cart should show product id=1 as a **single row** with quantity = `3` (2 + 1). No duplicate rows should be created.

**Actual Result:**
The cart displays product id=1 as **two separate rows**: one with quantity = 2 (original) and one with quantity = 1 (newly added). A duplicate row was created instead of incrementing the existing entry.

**Environment:**
- OS: macOS Tahoe 26.1
- Browser: Microsoft Edge (latest)
- App URL: http://localhost:5173/product/1 → http://localhost:5173/cart
- Test Data: product_id=1, existing cart quantity=2, added quantity=1

**GitHub Issue:** https://github.com/AkiraTomori/eshop-sut/issues/2
**Linked Test Case:** TC-FR06-EP-004

---

### Bug Report: BUG-FR06-003

**Date:** 2026-06-13
**Function Name:** FR-06 Product Detail View — Quantity Field Input Validation (Zero)
**Problem Summary:** The quantity field on the product detail page accepts and processes a value of `0`, allowing a product to be added to the cart with zero quantity (Expected: quantity of 0 is rejected with an appropriate error message; product is NOT added to cart).
**Severity:** Serious
**Priority:** High
**Status:** New
**Reported By:** Gemini QA Agent + Thái Minh Huy
**Assign To:** Development Team

#### Steps to Reproduce

**Pre-conditions:**
- EShop frontend and backend are running
- User is logged in with valid credentials
- Product id=1 exists in the database

**Steps:**
1. Navigate to `http://localhost:5173/product/1`
2. Locate the quantity input field
3. Clear the field and type `0`
4. Click the "Add to Cart" button
5. Observe the system response and check the cart

**Expected Result:**
Per FR-06: quantity must be a positive integer with a minimum value of 1. The system must reject `0`. Either: (a) the input field has `min=1` and prevents entry of 0, (b) clicking "Add to Cart" displays an error such as "Quantity must be at least 1", or (c) the API returns HTTP 400. The product must NOT be added to the cart with quantity 0.

**Actual Result:**
The system did not reject quantity = `0`. The product was added to the cart with quantity 0. No error message was displayed.

**Environment:**
- OS: macOS Tahoe 26.1
- Browser: Microsoft Edge (latest)
- App URL: http://localhost:5173/product/1
- Test Data: product_id=1, quantity=0

**GitHub Issue:** https://github.com/AkiraTomori/eshop-sut/issues/3
**Linked Test Case:** TC-FR06-NEG-006

---

### Bug Report: BUG-FR06-004

**Date:** 2026-06-13
**Function Name:** FR-06 Product Detail View — Quantity Field Input Validation (Negative Integer)
**Problem Summary:** The quantity field on the product detail page accepts and processes a negative value (`-1`), allowing a product to be added to the cart with a negative quantity (Expected: negative quantity is rejected with an appropriate error; product is NOT added to cart).
**Severity:** Serious
**Priority:** Immediate
**Status:** New
**Reported By:** Gemini QA Agent + Thái Minh Huy
**Assign To:** Development Team

#### Steps to Reproduce

**Pre-conditions:**
- EShop frontend and backend are running
- User is logged in with valid credentials
- Product id=1 exists in the database

**Steps:**
1. Navigate to `http://localhost:5173/product/1`
2. Clear the quantity field and type `-1`
3. Click the "Add to Cart" button
4. Observe the system response and check the cart page

**Expected Result:**
Per FR-06: quantity must be a positive integer (≥ 1). The system must reject `-1`. Either: (a) the input field has `min=1` preventing negative entry, (b) an error message is displayed, or (c) the API returns HTTP 400. The product must NOT be added to the cart with a negative quantity.

**Actual Result:**
The system did not reject quantity = `-1`. The product was added to the cart with a negative quantity. No error message was displayed.

**Environment:**
- OS: macOS Tahoe 26.1
- Browser: Microsoft Edge (latest)
- App URL: http://localhost:5173/product/1
- Test Data: product_id=1, quantity=-1

**GitHub Issue:** https://github.com/AkiraTomori/eshop-sut/issues/4
**Linked Test Case:** TC-FR06-NEG-007

---

### Bug Report: BUG-FR06-005

**Date:** 2026-06-13
**Function Name:** FR-06 Product Detail View — Quantity Field Input Validation (Decimal)
**Problem Summary:** The quantity field accepts a decimal value (`1.5`) and silently truncates it to `1` before adding to cart, without informing the user that their input was modified (Expected: decimal input is rejected with a clear error message OR the UI prevents decimal entry; silent truncation without notification is a defect).
**Severity:** Medium
**Priority:** Medium
**Status:** New
**Reported By:** Gemini QA Agent + Thái Minh Huy
**Assign To:** Development Team

#### Steps to Reproduce

**Pre-conditions:**
- EShop frontend and backend are running
- User is logged in with valid credentials
- Product id=1 exists in the database

**Steps:**
1. Navigate to `http://localhost:5173/product/1`
2. Clear the quantity field and type `1.5`
3. Click the "Add to Cart" button
4. Observe the system response (any error message?)
5. Navigate to the cart page and observe the quantity stored

**Expected Result:**
Per FR-06: quantity must be a positive integer. The system must either: (a) prevent decimal input via HTML `step=1` attribute, (b) display a clear error message explaining that only whole numbers are accepted, or (c) reject the request via the API. If truncation occurs, the user must be notified.

**Actual Result:**
The system accepted `1.5` without displaying any error. The decimal value was silently truncated to `1` and added to the cart. The user received no indication that their entered value was modified.

**Environment:**
- OS: macOS Tahoe 26.1
- Browser: Microsoft Edge (latest)
- App URL: http://localhost:5173/product/1
- Test Data: product_id=1, quantity=1.5

**GitHub Issue:** https://github.com/AkiraTomori/eshop-sut/issues/5
**Linked Test Case:** TC-FR06-NEG-008

---

### Bug Report: BUG-FR06-006

**Date:** 2026-06-13
**Function Name:** FR-06 Product Detail View — Quantity Field Input Validation (Non-Numeric / NaN)
**Problem Summary:** The quantity field (`input type="number"`) accepts non-numeric text (e.g., `abc`), and the product is added to the cart — NaN quantity reaches the backend (Expected: non-numeric input is rejected at the frontend; the product must NOT be added to the cart with an invalid quantity).
**Severity:** Serious
**Priority:** High
**Status:** New
**Reported By:** Gemini QA Agent + Thái Minh Huy
**Assign To:** Development Team

#### Steps to Reproduce

**Pre-conditions:**
- EShop frontend and backend are running
- User is logged in with valid credentials
- Product id=1 exists in the database

**Steps:**
1. Navigate to `http://localhost:5173/product/1`
2. Clear the quantity field and type `abc`
3. Click the "Add to Cart" button
4. Observe the system response
5. Navigate to the cart page and verify whether an entry was added

**Expected Result:**
Per FR-06: quantity must be a positive integer. With `input type="number"`, the browser should prevent non-numeric characters. If characters are entered (e.g., via programmatic injection or browser quirks), the frontend must validate and display an error before sending to the API. NaN must NOT be stored in the cart or sent to the backend.

**Actual Result:**
The system did not reject the non-numeric input. Despite `input type="number"` on the HTML element, the product was added to the cart. NaN quantity was sent to and accepted by the backend.

**Environment:**
- OS: macOS Tahoe 26.1
- Browser: Microsoft Edge (latest)
- App URL: http://localhost:5173/product/1
- Test Data: product_id=1, quantity="abc"

**GitHub Issue:** https://github.com/AkiraTomori/eshop-sut/issues/6
**Linked Test Case:** TC-FR06-NEG-009

---

### Bug Report: BUG-FR06-007

**Date:** 2026-06-13
**Function Name:** FR-06 Product Detail View — Quantity Field Input Validation (Empty Field)
**Problem Summary:** Clearing the quantity field completely and clicking "Add to Cart" results in the product being added to the cart with a NaN quantity (Expected: empty quantity field is rejected; the product must NOT be added to the cart with an undefined or NaN quantity).
**Severity:** Serious
**Priority:** High
**Status:** New
**Reported By:** Gemini QA Agent + Thái Minh Huy
**Assign To:** Development Team

#### Steps to Reproduce

**Pre-conditions:**
- EShop frontend and backend are running
- User is logged in with valid credentials
- Product id=1 exists in the database

**Steps:**
1. Navigate to `http://localhost:5173/product/1`
2. Locate the quantity input field
3. **Clear the field completely** (select all and delete — leave it blank)
4. Click the "Add to Cart" button
5. Observe the system response
6. Navigate to the cart page and check the quantity stored

**Expected Result:**
Per FR-06: quantity is a required field with a minimum value of 1. The system must reject an empty quantity. Either: (a) the field reverts to its minimum value of 1 and cannot be left empty, (b) an error message is displayed (e.g., "Please enter a quantity"), or (c) the "Add to Cart" button is disabled. The product must NOT be added with undefined/NaN quantity.

**Actual Result:**
The system did not reject the empty quantity field. The product was added to the cart with a NaN quantity. No validation error was shown to the user.

**Environment:**
- OS: macOS Tahoe 26.1
- Browser: Microsoft Edge (latest)
- App URL: http://localhost:5173/product/1
- Test Data: product_id=1, quantity="" (empty)

**GitHub Issue:** https://github.com/AkiraTomori/eshop-sut/issues/7
**Linked Test Case:** TC-FR06-NEG-010

---

### Bug Report: BUG-FR06-008

**Date:** 2026-06-13
**Function Name:** FR-06 Product Detail View — Quantity Field Input Validation (Extremely Large Value)
**Problem Summary:** The quantity field accepts an extremely large value (`999999999`) without any upper-limit validation, allowing the product to be added to the cart with a quantity far exceeding any practical system limit (Expected: the system rejects or caps the quantity at a defined maximum).
**Severity:** Medium
**Priority:** Medium
**Status:** New
**Reported By:** Gemini QA Agent + Thái Minh Huy
**Assign To:** Development Team

#### Steps to Reproduce

**Pre-conditions:**
- EShop frontend and backend are running
- User is logged in with valid credentials
- Product id=1 exists in the database

**Steps:**
1. Navigate to `http://localhost:5173/product/1`
2. Clear the quantity field and type `999999999`
3. Click the "Add to Cart" button
4. Observe the system response
5. Navigate to the cart page and observe the quantity and total price displayed

**Expected Result:**
The system must either: (a) reject the extremely large quantity with an error message indicating a maximum limit, or (b) cap the quantity at a defined maximum (e.g., 999). No system crash, no 500 server error. The cart total must calculate without integer overflow or incorrect value.

**Actual Result:**
The system accepted quantity = `999999999` without any error or rejection. The product was added to the cart. No upper limit is enforced on the quantity field, and no maximum validation message was displayed.

**Environment:**
- OS: macOS Tahoe 26.1
- Browser: Microsoft Edge (latest)
- App URL: http://localhost:5173/product/1
- Test Data: product_id=1, quantity=999999999

**GitHub Issue:** https://github.com/AkiraTomori/eshop-sut/issues/8
**Linked Test Case:** TC-FR06-NEG-011

---

### Bug Report: BUG-FR06-009

**Date:** 2026-06-13
**Function Name:** FR-06 Product Detail View / SEC-02 Authentication — Unauthenticated Add to Cart
**Problem Summary:** An unauthenticated user (no session/JWT) is able to add a product to the cart without being redirected to login or shown an authentication error (Expected: unauthenticated add-to-cart is blocked; user is redirected to `/login` or shown a descriptive error toast).
**Severity:** Serious
**Priority:** Immediate
**Status:** New
**Reported By:** Gemini QA Agent + Thái Minh Huy
**Assign To:** Development Team

#### Steps to Reproduce

**Pre-conditions:**
- EShop frontend and backend are running
- User is **NOT logged in** — open Microsoft Edge in InPrivate mode to ensure no session exists
- Product id=1 exists in the database

**Steps:**
1. Open Microsoft Edge in **InPrivate/Private** mode
2. Navigate to `http://localhost:5173/product/1`
3. Verify the product detail page loads (viewing is publicly accessible)
4. Set quantity to `1`
5. Click the "Add to Cart" button
6. Observe the system response (redirect? error toast? silent add?)

**Expected Result:**
Per SEC-02: adding to cart requires authentication. The system must block the add-to-cart action. Either: (a) the user is redirected to `/login`, or (b) a descriptive error toast is displayed (e.g., "Please log in to add items to your cart"). No silent failure, no product added to an anonymous cart.

**Actual Result:**
The system did not block the add-to-cart action. Despite the user being unauthenticated, the product was added to the cart. No login redirect or error message was presented.

**Environment:**
- OS: macOS Tahoe 26.1
- Browser: Microsoft Edge (latest) — InPrivate mode
- App URL: http://localhost:5173/product/1
- Test Data: product_id=1, quantity=1, auth=none (no JWT)

**GitHub Issue:** https://github.com/AkiraTomori/eshop-sut/issues/9
**Linked Test Case:** TC-FR06-NEG-012

---

### Bug Report: BUG-FR06-010

**Date:** 2026-06-13
**Function Name:** FR-06 Product Detail View — API Cart Validation (Non-Existent Product ID)
**Problem Summary:** The `POST /api/cart` endpoint accepts a cart request containing a non-existent product ID (`id=99999`) and adds the item to the user's cart without verifying product existence in the database (Expected: the API rejects the request with HTTP 400 or 404 when the product ID does not exist).
**Severity:** Serious
**Priority:** High
**Status:** New
**Reported By:** Gemini QA Agent + Thái Minh Huy
**Assign To:** Development Team

#### Steps to Reproduce

**Pre-conditions:**
- EShop backend is running at `http://localhost:3000`
- User is logged in — a valid JWT token is available
- No product with `id=99999` exists in the database (verified via `GET /api/products/99999` → 404)

**Steps:**
1. Obtain a valid JWT token by sending `POST /api/login` with valid credentials
2. Using Postman or cURL, send the following request:
   ```
   POST http://localhost:3000/api/cart
   Authorization: Bearer <valid_jwt_token>
   Content-Type: application/json

   {
     "id": 99999,
     "name": "Fake Product",
     "price": 100000,
     "quantity": 1
   }
   ```
3. Observe the HTTP response status and body
4. Send `GET /api/cart` with the same JWT token and check whether the fake product appears in the cart

**Expected Result:**
The API must verify product existence before adding to cart. Since `id=99999` does not exist in the database, the API must return HTTP 400 or HTTP 404 with an appropriate error message (e.g., `{"error": "Product not found"}`). The item must NOT be added to the user's cart.

**Actual Result:**
The API returned a success response and added the non-existent product (id=99999, "Fake Product") to the user's cart. No product existence check was performed by the backend.

**Environment:**
- OS: macOS Tahoe 26.1
- Tool: Postman / cURL
- Backend URL: http://localhost:3000/api/cart
- Test Data: `{"id": 99999, "name": "Fake Product", "price": 100000, "quantity": 1}`

**GitHub Issue:** https://github.com/AkiraTomori/eshop-sut/issues/10
**Linked Test Case:** TC-FR06-NEG-013

---

### Bug Report: BUG-FR06-011

**Date:** 2026-06-13
**Function Name:** FR-06 Product Detail View — API Cart Price Validation (Zero Price)
**Problem Summary:** The `POST /api/cart` endpoint accepts a cart request body with `price=0`, storing the item at zero cost — effectively making products free (Expected: the API rejects any request where `price ≤ 0` with HTTP 400; zero price must not be persisted in the cart).
**Severity:** Fatal
**Priority:** Immediate
**Status:** New
**Reported By:** Gemini QA Agent + Thái Minh Huy
**Assign To:** Development Team

#### Steps to Reproduce

**Pre-conditions:**
- EShop backend is running at `http://localhost:3000`
- User is logged in — valid JWT token is available
- Product id=1 exists in the database with an actual price > 0

**Steps:**
1. Obtain a valid JWT token by sending `POST /api/login` with valid credentials
2. Using Postman or cURL, send the following request:
   ```
   POST http://localhost:3000/api/cart
   Authorization: Bearer <valid_jwt_token>
   Content-Type: application/json

   {
     "id": 1,
     "name": "iPhone 15 Pro Max",
     "price": 0,
     "quantity": 1
   }
   ```
3. Observe the HTTP response status and body
4. Send `GET /api/cart` and verify whether an item with `price=0` exists

**Expected Result:**
Per FR-06 and financial integrity constraints: price must be > 0. The API must return HTTP 400 with an error such as `{"error": "Price must be greater than 0"}`. The product must NOT be added to the cart with price = 0. Accepting zero price allows checkout with a total of ₫0 — a critical financial defect.

**Actual Result:**
The API accepted the request and added the product to the cart with `price = 0`. No validation error was returned. The item can subsequently be purchased at zero cost.

**Environment:**
- OS: macOS Tahoe 26.1
- Tool: Postman / cURL
- Backend URL: http://localhost:3000/api/cart
- Test Data: `{"id": 1, "name": "iPhone 15 Pro Max", "price": 0, "quantity": 1}`

**GitHub Issue:** https://github.com/AkiraTomori/eshop-sut/issues/11
**Linked Test Case:** TC-FR06-NEG-014

---

### Bug Report: BUG-FR06-012

**Date:** 2026-06-13
**Function Name:** FR-06 Product Detail View — API Cart Price Validation (Negative Price)
**Problem Summary:** The `POST /api/cart` endpoint accepts a cart request body with a negative `price` (`-1000000`), which produces a negative cart total — a critical financial integrity defect (Expected: the API rejects any request where `price < 0` with HTTP 400).
**Severity:** Fatal
**Priority:** Immediate
**Status:** New
**Reported By:** Gemini QA Agent + Thái Minh Huy
**Assign To:** Development Team

#### Steps to Reproduce

**Pre-conditions:**
- EShop backend is running at `http://localhost:3000`
- User is logged in — valid JWT token is available
- Product id=1 exists in the database

**Steps:**
1. Obtain a valid JWT token
2. Using Postman or cURL, send the following request:
   ```
   POST http://localhost:3000/api/cart
   Authorization: Bearer <valid_jwt_token>
   Content-Type: application/json

   {
     "id": 1,
     "name": "iPhone 15 Pro Max",
     "price": -1000000,
     "quantity": 1
   }
   ```
3. Observe the HTTP response status and body
4. Send `GET /api/cart` and verify whether the negative-price item exists
5. If present, proceed to checkout and observe the total calculation

**Expected Result:**
The API must reject the request. A negative price is logically invalid for any product. The API must return HTTP 400 with an appropriate error message. The product must NOT be added to the cart with a negative price, as this would produce a negative cart total and allow financial exploitation.

**Actual Result:**
The API accepted the request and added the product to the cart with `price = -1000000`. No validation error was returned. A negative cart total is producible, representing a critical financial integrity failure.

**Environment:**
- OS: macOS Tahoe 26.1
- Tool: Postman / cURL
- Backend URL: http://localhost:3000/api/cart
- Test Data: `{"id": 1, "name": "iPhone 15 Pro Max", "price": -1000000, "quantity": 1}`

**GitHub Issue:** https://github.com/AkiraTomori/eshop-sut/issues/12
**Linked Test Case:** TC-FR06-NEG-015

---

### Bug Report: BUG-FR06-013

**Date:** 2026-06-13
**Function Name:** FR-06 Product Detail View — API Cart Quantity Validation (Zero Quantity)
**Problem Summary:** The `POST /api/cart` endpoint accepts a cart request with `quantity=0` at the API level, bypassing the frontend's specification minimum of 1 (Expected: the API rejects quantity=0 with HTTP 400 as a server-side guard independent of UI validation).
**Severity:** Serious
**Priority:** High
**Status:** New
**Reported By:** Gemini QA Agent + Thái Minh Huy
**Assign To:** Development Team

#### Steps to Reproduce

**Pre-conditions:**
- EShop backend is running at `http://localhost:3000`
- User is logged in — valid JWT token is available
- Product id=1 exists in the database

**Steps:**
1. Obtain a valid JWT token
2. Using Postman or cURL, send the following request:
   ```
   POST http://localhost:3000/api/cart
   Authorization: Bearer <valid_jwt_token>
   Content-Type: application/json

   {
     "id": 1,
     "name": "iPhone 15 Pro Max",
     "price": 30000000,
     "quantity": 0
   }
   ```
3. Observe the HTTP response status and body
4. Send `GET /api/cart` and verify whether a zero-quantity entry exists

**Expected Result:**
Per FR-06: quantity minimum is 1. The API must enforce this server-side regardless of UI validation. The API must return HTTP 400 with an error such as `{"error": "Quantity must be at least 1"}`. The product must NOT be added to the cart with quantity = 0.

**Actual Result:**
The API accepted the request and added the product to the cart with `quantity = 0`. No validation error was returned. This confirms the backend has no server-side quantity validation for the minimum boundary.

**Environment:**
- OS: macOS Tahoe 26.1
- Tool: Postman / cURL
- Backend URL: http://localhost:3000/api/cart
- Test Data: `{"id": 1, "name": "iPhone 15 Pro Max", "price": 30000000, "quantity": 0}`

**GitHub Issue:** https://github.com/AkiraTomori/eshop-sut/issues/13
**Linked Test Case:** TC-FR06-NEG-016

---

### Bug Report: BUG-FR06-014

**Date:** 2026-06-13
**Function Name:** FR-06 Product Detail View — API Cart Quantity Validation (NaN / String Quantity)
**Problem Summary:** The `POST /api/cart` endpoint accepts a string value (`"abc"`) in the `quantity` field and stores it in the cart as a NaN quantity, corrupting the cart data (Expected: the API rejects non-numeric quantity with HTTP 400 and enforces type validation server-side).
**Severity:** Serious
**Priority:** High
**Status:** New
**Reported By:** Gemini QA Agent + Thái Minh Huy
**Assign To:** Development Team

#### Steps to Reproduce

**Pre-conditions:**
- EShop backend is running at `http://localhost:3000`
- User is logged in — valid JWT token is available
- Product id=1 exists in the database

**Steps:**
1. Obtain a valid JWT token
2. Using Postman or cURL, send the following request:
   ```
   POST http://localhost:3000/api/cart
   Authorization: Bearer <valid_jwt_token>
   Content-Type: application/json

   {
     "id": 1,
     "name": "iPhone 15 Pro Max",
     "price": 30000000,
     "quantity": "abc"
   }
   ```
3. Observe the HTTP response status and body
4. Send `GET /api/cart` and inspect the `quantity` field of the stored cart entry

**Expected Result:**
The API must enforce type validation on the `quantity` field. A string value such as `"abc"` must be rejected with HTTP 400 and an error such as `{"error": "Quantity must be a positive integer"}`. NaN must never be stored in the cart, as it corrupts total calculations and downstream processing.

**Actual Result:**
The API accepted the request and added the product to the cart with `quantity = "abc"` (NaN). No type validation error was returned. NaN quantity is now persisted in the database, corrupting the cart data and making the cart total incalculable.

**Environment:**
- OS: macOS Tahoe 26.1
- Tool: Postman / cURL
- Backend URL: http://localhost:3000/api/cart
- Test Data: `{"id": 1, "name": "iPhone 15 Pro Max", "price": 30000000, "quantity": "abc"}`

**GitHub Issue:** https://github.com/AkiraTomori/eshop-sut/issues/14
**Linked Test Case:** TC-FR06-NEG-017

---

### Bug Report: BUG-FR06-015

**Date:** 2026-06-13
**Function Name:** FR-06 Product Detail View — API Security: Price Tampering Attack
**Problem Summary:** The `POST /api/cart` API blindly trusts the client-sent `price` field without cross-referencing the actual product price in the database. An attacker can set `price=1` for a product worth ₫30,000,000 and complete checkout at that fraudulent price — a critical security and financial integrity vulnerability (Expected: the API fetches the authoritative price from the database and ignores or overrides the client-sent value).
**Severity:** Fatal
**Priority:** Immediate
**Status:** New
**Reported By:** Gemini QA Agent + Thái Minh Huy
**Assign To:** Development Team

#### Steps to Reproduce

**Pre-conditions:**
- EShop backend is running at `http://localhost:3000`
- User is logged in — valid JWT token is available
- Product id=1 exists in the database with a confirmed price of `30,000,000 ₫` (verified via `GET /api/products/1`)

**Steps:**
1. Send `GET http://localhost:3000/api/products/1` and confirm the actual price (e.g., `30000000`)
2. Obtain a valid JWT token
3. Using Postman or cURL, send the following tampered request:
   ```
   POST http://localhost:3000/api/cart
   Authorization: Bearer <valid_jwt_token>
   Content-Type: application/json

   {
     "id": 1,
     "name": "iPhone 15 Pro Max",
     "price": 1,
     "quantity": 1
   }
   ```
4. Observe the HTTP response status
5. Send `GET /api/cart` — verify whether `price=1` was stored
6. Proceed to checkout and observe the order total

**Expected Result:**
Per SEC-02 and financial integrity requirements: the API must NOT trust the client-supplied `price` field. The server must retrieve the authoritative price from the database and use that value. The API should either: (a) reject the request because the client price (1) does not match the DB price (30000000), or (b) silently override with the DB price. Under no circumstances should checkout complete at a tampered price.

**Actual Result:**
The API accepted `price=1` and stored it in the cart. The checkout flow processes the cart at ₫1 for a product actually worth ₫30,000,000. This is a working price-tampering exploit enabling users to purchase products at arbitrarily low prices.

**Environment:**
- OS: macOS Tahoe 26.1
- Tool: Postman / cURL
- Backend URL: http://localhost:3000/api/cart
- Test Data: `{"id": 1, "name": "iPhone 15 Pro Max", "price": 1, "quantity": 1}` (actual DB price = 30,000,000)

**GitHub Issue:** https://github.com/AkiraTomori/eshop-sut/issues/15
**Linked Test Case:** TC-FR06-NEG-018

---

### Bug Report: BUG-FR06-016

**Date:** 2026-06-13
**Function Name:** FR-06 Product Detail View — Product Information Display (BVA: id=1 Lower Boundary)
**Problem Summary:** The product detail page for the smallest valid product ID (`id=1`) does not display the category name field — one of the 5 mandatory fields per FR-06 (Expected: category name is displayed). **Note: this is a duplicate manifestation of BUG-FR06-001 at the lower ID boundary; root cause is the same absent category field.**
**Severity:** Serious
**Priority:** Medium
**Status:** New
**Reported By:** Gemini QA Agent + Thái Minh Huy
**Assign To:** Development Team

#### Steps to Reproduce

**Pre-conditions:**
- EShop frontend and backend are running
- Product with id=1 exists in the database with an assigned category

**Steps:**
1. Open Microsoft Edge and navigate to `http://localhost:5173/product/1`
2. Wait for the product detail page to fully load
3. Inspect the page for the **category name** field (any label such as "Category:", "Danh mục:", or similar)
4. Verify all 5 required fields: image, name, price, description, category

**Expected Result:**
Per FR-06: the product detail page for id=1 (specification lower boundary LB=1) must display all 5 required fields including the **category name**. This boundary test confirms the minimum valid product ID is handled completely.

**Actual Result:**
The category name field is absent from the product detail page for id=1. Only 4 of the 5 required fields are displayed (image, name, price, description). Category is missing.

**Environment:**
- OS: macOS Tahoe 26.1
- Browser: Microsoft Edge (latest)
- App URL: http://localhost:5173/product/1
- Test Data: product_id=1 (specification LB)

**GitHub Issue:** https://github.com/AkiraTomori/eshop-sut/issues/16
**Linked Test Case:** TC-FR06-BV-001

---

### Bug Report: BUG-FR06-017

**Date:** 2026-06-13
**Function Name:** FR-06 Product Detail View — Product Information Display (BVA: id=2, LB+1)
**Problem Summary:** The product detail page for `id=2` (one above the lower boundary) also does not display the category name field — confirming the category omission defect is not isolated to id=1 and affects the product detail page globally (Expected: category name is displayed for all valid product IDs). **Note: duplicate manifestation of BUG-FR06-001; same root cause.**
**Severity:** Serious
**Priority:** Medium
**Status:** New
**Reported By:** Gemini QA Agent + Thái Minh Huy
**Assign To:** Development Team

#### Steps to Reproduce

**Pre-conditions:**
- EShop frontend and backend are running
- Product with id=2 exists in the database with an assigned category

**Steps:**
1. Open Microsoft Edge and navigate to `http://localhost:5173/product/2`
2. Wait for the product detail page to fully load
3. Inspect the page for the **category name** field
4. Verify all 5 required fields: image, name, price, description, category

**Expected Result:**
Per FR-06: the product detail page for id=2 (BVA point LB+1=2) must display all 5 required fields including **category name**. If the category field is missing for both id=1 and id=2, the defect is confirmed as a systematic omission across the entire product detail feature, not a data issue for a single product.

**Actual Result:**
The category name field is absent from the product detail page for id=2. Only 4 of the 5 required fields are displayed. This confirms BUG-FR06-001 / BUG-FR06-016 is a systematic defect affecting all products, not a data issue.

**Environment:**
- OS: macOS Tahoe 26.1
- Browser: Microsoft Edge (latest)
- App URL: http://localhost:5173/product/2
- Test Data: product_id=2 (BVA LB+1)

**GitHub Issue:** https://github.com/AkiraTomori/eshop-sut/issues/17
**Linked Test Case:** TC-FR06-BV-002

---

### Bug Report: BUG-FR06-018

**Date:** 2026-06-13
**Function Name:** FR-06 Product Detail View — API Cart Price Validation (BVA: Price LB = 1₫)
**Problem Summary:** The `POST /api/cart` API accepts a client-supplied `price=1` (the price lower boundary) for a product whose actual database price is ₫30,000,000, confirming that the backend performs no server-side price validation against the database at any price value — including the boundary minimum (Expected: API fetches authoritative price from DB; price=1 sent by client is rejected or overridden when it doesn't match the DB price).
**Severity:** Fatal
**Priority:** Immediate
**Status:** New
**Reported By:** Gemini QA Agent + Thái Minh Huy
**Assign To:** Development Team

#### Steps to Reproduce

**Pre-conditions:**
- EShop backend is running at `http://localhost:3000`
- User is logged in — valid JWT token is available
- Product id=1 exists with a confirmed database price significantly greater than 1 (e.g., 30,000,000 ₫)

**Steps:**
1. Confirm the product's real price: `GET http://localhost:3000/api/products/1` (note the price field)
2. Obtain a valid JWT token
3. Using Postman or cURL, send:
   ```
   POST http://localhost:3000/api/cart
   Authorization: Bearer <valid_jwt_token>
   Content-Type: application/json

   {
     "id": 1,
     "name": "iPhone 15 Pro Max",
     "price": 1,
     "quantity": 1
   }
   ```
4. Observe the HTTP response
5. Send `GET /api/cart` and check the stored price value

**Expected Result:**
The API must validate the client-supplied price against the database. Since 1 ≠ DB price (30,000,000), the API must reject with HTTP 400 or silently override with the DB price. The boundary value test (price=1) confirms whether any server-side price guard exists at the theoretical minimum valid price.

**Actual Result:**
The API returned a success response and stored `price=1` in the cart. No price validation against the database was performed. This boundary test confirms that the price tampering vulnerability (BUG-FR06-015) is present at every price value — including the minimum boundary of 1₫.

**Environment:**
- OS: macOS Tahoe 26.1
- Tool: Postman / cURL
- Backend URL: http://localhost:3000/api/cart
- Test Data: `{"id": 1, "name": "iPhone 15 Pro Max", "price": 1, "quantity": 1}` (actual DB price = 30,000,000)

**GitHub Issue:** https://github.com/AkiraTomori/eshop-sut/issues/18
**Linked Test Case:** TC-FR06-BV-006

---

### Bug Report: BUG-FR06-019

**Date:** 2026-06-13
**Function Name:** FR-06 Product Detail View — API Cart Quantity Validation (BVA: Quantity LB-1 = -1)
**Problem Summary:** The `POST /api/cart` API accepts a `quantity=-1` (one below the specification lower boundary of 1) without rejection, confirming that the API has no server-side lower-boundary enforcement for the quantity field (Expected: API rejects quantity=-1 with HTTP 400).
**Severity:** Serious
**Priority:** Immediate
**Status:** New
**Reported By:** Gemini QA Agent + Thái Minh Huy
**Assign To:** Development Team

#### Steps to Reproduce

**Pre-conditions:**
- EShop backend is running at `http://localhost:3000`
- User is logged in — valid JWT token is available
- Product id=1 exists in the database

**Steps:**
1. Obtain a valid JWT token
2. Using Postman or cURL, send:
   ```
   POST http://localhost:3000/api/cart
   Authorization: Bearer <valid_jwt_token>
   Content-Type: application/json

   {
     "id": 1,
     "name": "iPhone 15 Pro Max",
     "price": 30000000,
     "quantity": -1
   }
   ```
3. Observe the HTTP response status and body
4. Send `GET /api/cart` and verify whether a negative-quantity entry exists

**Expected Result:**
Per FR-06: quantity must be ≥ 1. The BVA LB-1 point (-1) is one step below the lower boundary. The API must return HTTP 400 with an error such as `{"error": "Quantity must be at least 1"}`. A negative quantity must NOT be stored in the cart as it corrupts totals and could theoretically reduce cart value when combined with valid items.

**Actual Result:**
The API accepted the request and stored `quantity = -1` in the cart. No boundary validation was performed. The backend has confirmed no server-side minimum quantity guard at the API layer.

**Environment:**
- OS: macOS Tahoe 26.1
- Tool: Postman / cURL
- Backend URL: http://localhost:3000/api/cart
- Test Data: `{"id": 1, "name": "iPhone 15 Pro Max", "price": 1, "quantity": -1}`

**GitHub Issue:** https://github.com/AkiraTomori/eshop-sut/issues/19
**Linked Test Case:** TC-FR06-BV-007

---

### Bug Report: BUG-FR06-020

**Date:** 2026-06-13
**Function Name:** FR-06 Product Detail View — API Cart Quantity Validation (BVA: DB Stress — quantity=999999999)
**Problem Summary:** The `POST /api/cart` API accepts an extremely large quantity (`999999999`) without rejection or upper-bound enforcement. While no server crash occurred, the API provides no way to retrieve the calculated cart total via `GET /api/cart`, preventing overflow verification — a system design gap (Expected: the API either rejects the extreme quantity or returns the total with overflow-safe calculation).
**Severity:** Medium
**Priority:** Medium
**Status:** New
**Reported By:** Gemini QA Agent + Thái Minh Huy
**Assign To:** Development Team

### Steps to Reproduce

**Pre-conditions:**
- EShop backend is running at `http://localhost:3000`
- User is logged in — valid JWT token is available
- Product id=1 exists in the database (price = 30,000,000)

**Steps:**
1. Obtain a valid JWT token
2. Using Postman or cURL, send:
   ```
   POST http://localhost:3000/api/cart
   Authorization: Bearer <valid_jwt_token>
   Content-Type: application/json

   {
     "id": 1,
     "name": "iPhone 15 Pro Max",
     "price": 30000000,
     "quantity": 999999999
   }
   ```
3. Observe the HTTP response status and body
4. Send `GET /api/cart` — record the raw response
5. Attempt to view the cart page at `http://localhost:5173/cart` and inspect the displayed total
6. Manually calculate expected total: 30,000,000 × 999,999,999 = 29,999,999,970,000,000 ₫ — check for overflow/truncation

**Expected Result:**
The API must either: (a) reject the quantity with an error indicating an upper limit (e.g., `{"error": "Quantity cannot exceed 9999"}`), or (b) if accepted, the cart total must be calculated correctly using overflow-safe arithmetic (result: approximately ₫29,999,999,970,000,000) with no integer overflow, truncation, or NaN. The `GET /api/cart` response must return the total in a verifiable format.

**Actual Result:**
The API accepted `quantity=999999999` without rejection. The `GET /api/cart` API response does not include a pre-calculated total field, making overflow verification impossible via API alone. Manual calculation using the cart page data was required. No upper-bound enforcement exists at the API layer. The lack of an API-level total field is also noted as a design gap that hinders testing.

**Environment:**
- OS: macOS Tahoe 26.1
- Tool: Postman / cURL + Microsoft Edge (for cart page total)
- Backend URL: http://localhost:3000/api/cart
- Test Data: `{"id": 1, "name": "iPhone 15 Pro Max", "price": 30000000, "quantity": 999999999}`
- Expected total (manual): ₫29,999,999,970,000,000

**GitHub Issue:** https://github.com/AkiraTomori/eshop-sut/issues/20
**Linked Test Case:** TC-FR06-BV-008

## POOL B — FR-08: Checkout (Web Frontend)
**Total Bugs Filed in Pool B:** 8 Defects (1 Fatal, 3 Serious, 3 Medium, 1 Cosmetic)

---

### Bug Report: BUG-FR08-001
- **Date:** 2026-06-14
- **Function Name:** FR-08 Checkout — GUI / Page Structure
- **Problem Summary:** The checkout page does not contain any `<h1>` heading element — it uses `<h2>` instead — violating the FR-21 requirement that every page must have exactly one `<h1>` tag.
- **Severity:** Medium
- **Priority:** Medium
- **Status:** New
- **Assign To:** Development Team

#### Steps to Reproduce
**Pre-conditions:**
- Backend (`http://localhost:3000`) and Frontend (`http://localhost:5173`) are running.
- User `test@eshop.com` is logged in.
- Cart contains at least 1 item.

**Steps:**
1. Navigate to `http://localhost:5173/checkout`.
2. Open browser DevTools → Elements / Inspector (F12).
3. Search for `<h1>` elements on the page (Ctrl+F in Elements: `h1`).
4. Observe how many `<h1>` elements are present.

#### Test Results Matrix
- **Expected Result:** Per FR-21, the checkout page must contain exactly **one `<h1>` element** serving as the primary page heading.
- **Actual Result:** There are **zero `<h1>` elements** on the checkout page. The page heading is implemented using `<h2>`, which violates the FR-21 heading structure requirement.
- **Test Data:** Authenticated user; non-empty cart.
- **GitHub Issue Link:** https://github.com/AkiraTomori/eshop-sut/issues/21
- **Linked Test Cases:** TC-FR08-EP-001, TC-FR08-NEG-007

---

### Bug Report: BUG-FR08-002
- **Date:** 2026-06-14
- **Function Name:** FR-08 Checkout — GUI / Button Styling
- **Problem Summary:** The checkout/proceed-to-checkout button ("Tiến hành thanh toán") is displayed in **green** instead of the required **blue** color, violating the FR-21 UI standard for primary action buttons.
- **Severity:** Cosmetic
- **Priority:** Low
- **Status:** New
- **Assign To:** Development Team

#### Steps to Reproduce
**Steps:**
1. Navigate to `http://localhost:5173/cart` or `http://localhost:5173/checkout`.
2. Locate the "Tiến hành thanh toán" (Proceed to Checkout) / "Đặt hàng" (Place Order) button.
3. Observe the button's background color.
4. Open DevTools → Computed CSS on the button element; note the `background-color` value.

#### Test Results Matrix
- **Expected Result:** Per FR-21, the primary checkout/submit button must be styled in **blue**. Hex value or class should reflect a blue theme (e.g., `#1E90FF`, `bg-blue-*`, or similar).
- **Actual Result:** The button is rendered in **green** (not blue). The observed color does not match the FR-21 blue button specification.
- **Test Data:** Authenticated user; non-empty cart.
- **GitHub Issue Link:** https://github.com/AkiraTomori/eshop-sut/issues/22
- **Linked Test Cases:** TC-FR08-EP-001, TC-FR08-NEG-007

---

### Bug Report: BUG-FR08-003
- **Date:** 2026-06-14
- **Function Name:** FR-08 Checkout — Cart State After Order Placement
- **Problem Summary:** After a successful checkout, the user's cart is **not cleared** — cart items remain visible in the cart page instead of being reset to an empty state.
- **Severity:** Serious
- **Priority:** Serious
- **Status:** New
- **Assign To:** Development Team

#### Steps to Reproduce
**Steps:**
1. Navigate to `http://localhost:5173/checkout`.
2. Enter a valid shipping address (e.g., `"123 Nguyen Hue, District 1, Ho Chi Minh City"`).
3. Click "Đặt hàng" (Place Order).
4. Observe the success notification confirming the order is placed.
5. Navigate to `http://localhost:5173/cart`.
6. Observe the cart state.

#### Test Results Matrix
- **Expected Result:** After a successful order placement, the cart must be **cleared** (0 items). The cart page should display the empty-state UI (e.g., "Giỏ hàng của bạn đang trống") per FR-07/FR-08 post-checkout behaviour.
- **Actual Result:** After a successful order placement, the cart **still shows the previously ordered items**. The cart is not emptied. This can lead to users accidentally re-ordering or to a misrepresentation of cart state.
- **Test Data:** `shipping_address` = `"123 Nguyen Hue, District 1, Ho Chi Minh City"`; at least 1 product in cart.
- **GitHub Issue Link:** https://github.com/AkiraTomori/eshop-sut/issues/23
- **Linked Test Cases:** TC-FR08-EP-001

---

### Bug Report: BUG-FR08-005
- **Date:** 2026-06-14
- **Function Name:** FR-08 Checkout — Breadcrumb Navigation
- **Problem Summary:** The breadcrumb navigation component is **absent** from the checkout page, violating the FR-22 requirement that the checkout page must display breadcrumb navigation showing the user's position in the site hierarchy.
- **Severity:** Medium
- **Priority:** Medium
- **Status:** New
- **Assign To:** Development Team

#### Steps to Reproduce
**Steps:**
1. Navigate to `http://localhost:5173/checkout`.
2. Observe the top of the page for a breadcrumb navigation element (e.g., `Trang chủ > Giỏ hàng > Thanh toán`).

#### Test Results Matrix
- **Expected Result:** Per FR-22, the checkout page must display a **breadcrumb navigation bar** at the top of the page indicating the current location (e.g., `Trang chủ > Giỏ hàng > Thanh toán`).
- **Actual Result:** No breadcrumb navigation is visible anywhere on the checkout page. The page does not indicate the user's position in the site navigation hierarchy.
- **Test Data:** Authenticated user; non-empty cart.
- **GitHub Issue Link:** https://github.com/AkiraTomori/eshop-sut/issues/25
- **Linked Test Cases:** TC-FR08-EP-003

---

### Bug Report: BUG-FR08-006
- **Date:** 2026-06-14
- **Function Name:** FR-08 Checkout — Input Validation Error Message Display
- **Problem Summary:** When the user attempts to place an order without entering a shipping address, **no validation error message is displayed** — the system fails silently or proceeds anyway, violating the FR-22 requirement for error message feedback above the submit button.
- **Severity:** Serious
- **Priority:** Serious
- **Status:** New
- **Assign To:** Development Team

#### Steps to Reproduce
**Steps:**
1. Navigate to `http://localhost:5173/checkout`.
2. Leave the `shipping_address` field completely empty.
3. Click "Đặt hàng" (Place Order).
4. Observe the page response — specifically whether any error message appears.

#### Test Results Matrix
- **Expected Result:** Per FR-08 and FR-22: The system must **not** create an order. An error message (e.g., "Vui lòng nhập địa chỉ giao hàng" or "Shipping address is required") must be displayed **above** the "Đặt hàng" button. The user must remain on the checkout page.
- **Actual Result:** When the "Đặt hàng" button is clicked with an empty shipping address field: No error message is displayed anywhere on the page; The system **still creates an order** with an empty/null shipping address stored in the database; The user is not notified of the validation failure.
- **Test Data:** `shipping_address` = `""` (empty string); authenticated user; non-empty cart.
- **GitHub Issue Link:** https://github.com/AkiraTomori/eshop-sut/issues/26
- **Linked Test Cases:** TC-FR08-EP-003, TC-FR08-NEG-004, TC-FR08-NEG-006, TC-FR08-BV-005

---

### Bug Report: BUG-FR08-007
- **Date:** 2026-06-14
- **Function Name:** FR-08 Checkout — Shipping Address Validation (Empty / Whitespace)
- **Problem Summary:** The system accepts an order with an empty string or whitespace-only `shipping_address` — no server-side validation rejects the blank address, resulting in orders being stored with meaningless shipping destinations.
- **Severity:** Serious
- **Priority:** Serious
- **Status:** New
- **Assign To:** Development Team

#### Steps to Reproduce
**Steps (API-level — Postman):**
1. Send `POST http://localhost:3000/api/checkout` with: Header `Authorization: Bearer <valid_token>` and Body `{ "shipping_address": "     " }` (five whitespace characters).
2. Observe the HTTP response code.
3. Query `GET http://localhost:3000/api/orders/my-orders` to retrieve the newly created order.
4. Inspect the `shipping_address` field of the order record.

#### Test Results Matrix
- **Expected Result:** The API must return **HTTP 400 Bad Request** with an error message indicating that the shipping address is required and must be non-empty. No order must be created in the database.
- **Actual Result:** The API returns **HTTP 200 OK**. An order is created in the database with the shipping address stored as `"     "`. No validation error is returned. The same behaviour is reproduced with `""` (empty string).
- **Test Data:** `shipping_address` = `"     "` and `""`; valid JWT.
- **GitHub Issue Link:** https://github.com/AkiraTomori/eshop-sut/issues/27
- **Linked Test Cases:** TC-FR08-NEG-004, TC-FR08-NEG-006, TC-FR08-BV-005

---

### Bug Report: BUG-FR08-008
- **Date:** 2026-06-14
- **Function Name:** FR-08 Checkout — Security: `total_amount` Recalculation
- **Problem Summary:** The backend **trusts the client-supplied `total_amount`** without recalculating from the actual cart items — a price tampering attack succeeds, allowing an order to be placed at 1 ₫ regardless of the actual cart total.
- **Severity:** Fatal
- **Priority:** Immediate
- **Status:** New
- **Assign To:** Development Team

#### Steps to Reproduce
**Steps (API-level — Postman):**
1. Send `POST http://localhost:3000/api/checkout` with: Header `Authorization: Bearer <valid_token>` and Body `{ "total_amount": 1, "shipping_address": "123 Nguyen Hue, District 1, Ho Chi Minh City" }`.
2. Observe the HTTP response code.
3. Query `GET http://localhost:3000/api/orders/my-orders` to retrieve the created order.
4. Inspect the `total_amount` field of the stored order record.

#### Test Results Matrix
- **Expected Result:** The backend must **ignore** the client-supplied `total_amount` field. Instead, it must independently calculate the order total from the authenticated user's current cart contents stored server-side. The stored `total_amount` must equal the real cart total (30,000,000 ₫), not the client-sent value (1 ₫).
- **Actual Result:** The API returns **HTTP 200 OK**. The order is created with `total_amount = 1 ₫` — the exact value sent by the client. The backend does **not** recalculate the total from the cart. This constitutes a **critical price tampering vulnerability**: any authenticated user can place any order for 1 ₫.
- **Test Data:** Tampered `total_amount` = 1; actual cart total = 30,000,000 ₫; valid JWT for `test@eshop.com`.
- **GitHub Issue Link:** https://github.com/AkiraTomori/eshop-sut/issues/28
- **Linked Test Cases:** TC-FR08-NEG-005
- *Security Escalation Note (TR-BP-09):* This is a Fatal security defect. This defect must be escalated immediately to the team lead and patched before any production deployment.

---

### Bug Report: BUG-FR08-009
- **Date:** 2026-06-14
- **Function Name:** FR-08 Checkout — Shipping Address Length Enforcement
- **Problem Summary:** The system does **not enforce** the 255-character maximum length on the `shipping_address` field — a 256-character address is accepted and an order is created, indicating there is no length-enforcement layer (UI, API, or database).
- **Severity:** Medium
- **Priority:** Medium
- **Status:** New
- **Assign To:** Development Team

#### Steps to Reproduce
**Steps (UI):**
1. Navigate to `http://localhost:5173/checkout`.
2. In the `shipping_address` field, paste a 256-character string (`"C"` repeated 256 times).
3. Click "Đặt hàng" (Place Order).
4. Observe whether the order is accepted or an error is displayed.

**Steps (API — Postman for confirmation):**
1. Send `POST http://localhost:3000/api/checkout` with Header `Authorization: Bearer <valid_token>` and Body `{ "shipping_address": "<256-char string>" }`.
2. Check whether the API returns an error or HTTP 200.
3. Query the stored order to verify whether the full 256-char address is stored.

#### Test Results Matrix
- **Expected Result:** Per the HITL-resolved 255-character baseline: The system must **reject** a 256-character shipping address via a UI `maxlength` attribute, an API HTTP 400 Bad Request error message, or DB schema restrictions. At least one enforcement layer must exist.
- **Actual Result:** The system accepts the 256-character address without any error. An order is created successfully with the full over-length address stored in the database. **No enforcement layer** rejects the over-length input. (A 1000-character address was also accepted without error in TC-FR08-BV-007).
- **Test Data:** `shipping_address` = 256-char string (`"C" × 256`) and 1000-char string.
- **GitHub Issue Link:** https://github.com/AkiraTomori/eshop-sut/issues/29
- **Linked Test Cases:** TC-FR08-BV-006, TC-FR08-BV-007

---

## 🟢 POOL C — FR-15: Product Management (Product CRUD Web Admin)
**Total Bugs Filed in Pool C:** 17 Defects (0 Fatal, 12 Serious, 5 Medium)

---

### Bug Report: BUG-FR15-001
- **Date:** 2026-06-16
- **Function Name:** FR-15 Product Management — Create Product (Price Validation)
- **Problem Summary:** The Create Product API accepts `price = 0` and creates a product successfully (HTTP 200 OK), violating the specification requirement that price must be a positive integer greater than zero.
- **Severity:** Serious
- **Priority:** Serious
- **Status:** New
- **Assign To:** Development Team

#### Steps to Reproduce
**Pre-conditions:**
- Backend API is running at `http://localhost:3000`
- Valid admin JWT with `role = 'admin'` is available

**Steps:**
1. Open Postman.
2. Send `POST /api/products` with `Authorization: Bearer [admin_JWT]`.
3. Set request body: `{ "name": "Zero Price Product", "price": 0, "category_id": 1 }`.
4. Click Send and observe the HTTP response code and response body.
5. Check the product list to confirm whether a product was created.

#### Test Results Matrix
- **Expected Result:** The API returns HTTP 400 Bad Request with an error message indicating that price must be a positive integer greater than zero. No product is created.
- **Actual Result:** The API returns HTTP 200 OK (or 201 Created). No error message is returned. A product with `price = 0` is created and appears in the product list.
- **Test Data:** `name = "Zero Price Product"`, `price = 0`, `category_id = 1`
- **GitHub Issue Link:** https://github.com/AkiraTomori/eshop-sut/issues/42
- **Linked Test Case:** TC-FR15-NEG-009

---

### Bug Report: BUG-FR15-002
- **Date:** 2026-06-16
- **Function Name:** FR-15 Product Management — Create Product (Price Validation)
- **Problem Summary:** The Create Product API accepts a negative price (`price = -1`) and creates a product successfully, violating the specification that price must be a positive integer (greater than zero).
- **Severity:** Serious
- **Priority:** Immediate
- **Status:** New
- **Assign To:** Development Team

#### Steps to Reproduce
**Steps:**
1. Open Postman.
2. Send `POST /api/products` with `Authorization: Bearer [admin_JWT]`.
3. Set request body: `{ "name": "Negative Price Product", "price": -1, "category_id": 1 }`.
4. Click Send and observe the HTTP response.
5. Check the product list to confirm whether a product was created.

#### Test Results Matrix
- **Expected Result:** The API returns HTTP 400 Bad Request with an error message indicating that price must be a positive integer. No product is created.
- **Actual Result:** The API returns HTTP 200 OK (or 201 Created). No error message is returned. A product with `price = -1` is created and stored in the database. No error message is displayed in the UI.
- **Test Data:** `name = "Negative Price Product"`, `price = -1`, `category_id = 1`
- **GitHub Issue Link:** https://github.com/AkiraTomori/eshop-sut/issues/43
- **Linked Test Case:** TC-FR15-NEG-010

---

### Bug Report: BUG-FR15-003
- **Date:** 2026-06-16
- **Function Name:** FR-15 Product Management — Create Product (Price Validation)
- **Problem Summary:** The Create Product API accepts a floating-point price value (`price = 99.5`) and creates a product successfully, violating the integer-only constraint for Vietnamese ₫ currency (AMB-03, RESOLVED-02).
- **Severity:** Serious
- **Priority:** Serious
- **Status:** New
- **Assign To:** Development Team

#### Steps to Reproduce
**Steps:**
1. Open Postman.
2. Send `POST /api/products` with `Authorization: Bearer [admin_JWT]`.
3. Set request body: `{ "name": "Float Price Product", "price": 99.5, "category_id": 1 }`.
4. Click Send and observe the HTTP response.
5. Check the database / product list for the created product and its stored price value.

#### Test Results Matrix
- **Expected Result:** The API returns HTTP 400 Bad Request with an error message indicating that price must be a positive integer. No product is created with a float price.
- **Actual Result:** The API returns HTTP 200 OK (or 201 Created). No error message is returned. A product with `price = 99.5` is created in the database. The float price is persisted.
- **Test Data:** `name = "Float Price Product"`, `price = 99.5`, `category_id = 1`
- **GitHub Issue Link:** https://github.com/AkiraTomori/eshop-sut/issues/44
- **Linked Test Case:** TC-FR15-NEG-011

---

### Bug Report: BUG-FR15-004
- **Date:** 2026-06-16
- **Function Name:** FR-15 Product Management — Create Product (Price Validation)
- **Problem Summary:** The Create Product API accepts a non-numeric string as the price field (`price = "abc"`) and creates a product, violating the type constraint that price must be a valid numeric integer.
- **Severity:** Serious
- **Priority:** Immediate
- **Status:** New
- **Assign To:** Development Team

#### Steps to Reproduce
**Steps:**
1. Open Postman.
2. Send `POST /api/products` with `Authorization: Bearer [admin_JWT]`.
3. Set request body: `{ "name": "Test Product", "price": "abc", "category_id": 1 }`.
4. Click Send and observe the HTTP response and body.
5. Check whether a product was created in the system.

#### Test Results Matrix
- **Expected Result:** The API returns HTTP 400 Bad Request with an error message indicating that price must be a valid numeric value. No product is created.
- **Actual Result:** The API returns HTTP 200 OK (or 201 Created). No error message is returned. A product with a non-numeric string price is still created in the database.
- **Test Data:** `name = "Test Product"`, `price = "abc"`, `category_id = 1`
- **GitHub Issue Link:** https://github.com/AkiraTomori/eshop-sut/issues/45
- **Linked Test Case:** TC-FR15-NEG-012

---

### Bug Report: BUG-FR15-005
- **Date:** 2026-06-16
- **Function Name:** FR-15 Product Management — Create Product (Price Validation)
- **Problem Summary:** The Create Product API accepts a request body with the `price` field completely omitted and creates a product, violating the specification that price is a mandatory field.
- **Severity:** Serious
- **Priority:** Immediate
- **Status:** New
- **Assign To:** Development Team

#### Steps to Reproduce
**Steps:**
1. Open Postman.
2. Send `POST /api/products` with `Authorization: Bearer [admin_JWT]`.
3. Set request body with the price key entirely absent: `{ "name": "No Price Product", "category_id": 1 }`.
4. Click Send and observe the HTTP response.
5. Check whether a product was created.

#### Test Results Matrix
- **Expected Result:** The API returns HTTP 400 Bad Request with an error message indicating that price is a required field. No product is created.
- **Actual Result:** The API returns HTTP 200 OK (or 201 Created). No error message is returned. A product is created in the database despite the missing mandatory price field.
- **Test Data:** `name = "No Price Product"`, price field: **absent**, `category_id = 1`
- **GitHub Issue Link:** https://github.com/AkiraTomori/eshop-sut/issues/46
- **Linked Test Case:** TC-FR15-NEG-013

---

### Bug Report: BUG-FR15-006
- **Date:** 2026-06-16
- **Function Name:** FR-15 Product Management — Create Product (Description Validation)
- **Problem Summary:** The Create Product API accepts a description of 1001 characters and creates a product, violating the application-layer 1000-character safety limit (AMB-01, RESOLVED-04). The oversized description is stored in the SQLite database without rejection.
- **Severity:** Serious
- **Priority:** Serious
- **Status:** New
- **Assign To:** Development Team

#### Steps to Reproduce
**Steps:**
1. Open Postman.
2. Send `POST /api/products` with `Authorization: Bearer [admin_JWT]`.
3. Set request body: `{ "name": "Long Desc Product", "price": 100000, "description": "C" × 1001, "category_id": 1 }`.
4. Click Send and observe the HTTP response.
5. Verify in the database whether the product was created and what the stored description length is.

#### Test Results Matrix
- **Expected Result:** The API returns HTTP 400 Bad Request with an error message indicating that the description exceeds the maximum allowed length of 1000 characters. No product is created.
- **Actual Result:** The API returns HTTP 200 OK (or 201 Created). No error message is returned. A product is created with the 1001-character description stored intact in the database.
- **Test Data:** `name = "Long Desc Product"`, `price = 100000`, `description = "C" × 1001`, `category_id = 1`
- **GitHub Issue Link:** https://github.com/AkiraTomori/eshop-sut/issues/47
- **Linked Test Case:** TC-FR15-NEG-014

---

### Bug Report: BUG-FR15-007
- **Date:** 2026-06-16
- **Function Name:** FR-15 Product Management — Create Product (Image URL Validation)
- **Problem Summary:** The Create Product API accepts an image URL using the insecure `http://` protocol and creates a product, violating the specification requirement that imageUrl must begin with `https://` (AMB-02, RESOLVED-03).
- **Severity:** Medium
- **Priority:** Medium
- **Status:** New
- **Assign To:** Development Team

#### Steps to Reproduce
**Steps:**
1. Open Postman.
2. Send `POST /api/products` with `Authorization: Bearer [admin_JWT]`.
3. Set request body: `{ "name": "HTTP URL Product", "price": 100000, "imageUrl": "http://example.com/img.jpg", "category_id": 1 }`.
4. Click Send and observe the HTTP response.
5. Check whether a product was created with the insecure image URL.

#### Test Results Matrix
- **Expected Result:** The API returns HTTP 400 Bad Request with an error message indicating that the image URL must begin with `https://`. No product is created with an insecure image URL.
- **Actual Result:** The API returns HTTP 200 OK. No error message is returned. A product is created with `imageUrl = "http://example.com/img.jpg"` stored in the database.
- **Test Data:** `name = "HTTP URL Product"`, `price = 100000`, `imageUrl = "http://example.com/img.jpg"`, `category_id = 1`
- **GitHub Issue Link:** https://github.com/AkiraTomori/eshop-sut/issues/48
- **Linked Test Case:** TC-FR15-NEG-016

---

### Bug Report: BUG-FR15-008
- **Date:** 2026-06-16
- **Function Name:** FR-15 Product Management — Create Product (Image URL Validation)
- **Problem Summary:** The Create Product API accepts a completely malformed non-URL string as the `imageUrl` value (`"notavalidurl"`) and creates a product, violating the requirement that imageUrl must be a valid URL beginning with `https://`.
- **Severity:** Medium
- **Priority:** Medium
- **Status:** New
- **Assign To:** Development Team

#### Steps to Reproduce
**Steps:**
1. Open Postman.
2. Send `POST /api/products` with `Authorization: Bearer [admin_JWT]`.
3. Set request body: `{ "name": "Malformed URL Product", "price": 100000, "imageUrl": "notavalidurl", "category_id": 1 }`.
4. Click Send and observe the HTTP response.
5. Check whether a product was created with the malformed image URL.

#### Test Results Matrix
- **Expected Result:** The API returns HTTP 400 Bad Request with an error message indicating that imageUrl must be a valid URL beginning with `https://`. No product is created.
- **Actual Result:** The API returns HTTP 200 OK. No error message is returned. A product is created with `imageUrl = "notavalidurl"` stored in the database.
- **Test Data:** `name = "Malformed URL Product"`, `price = 100000`, `imageUrl = "notavalidurl"`, `category_id = 1`
- **GitHub Issue Link:** https://github.com/AkiraTomori/eshop-sut/issues/49
- **Linked Test Case:** TC-FR15-NEG-017

---

### Bug Report: BUG-FR15-009
- **Date:** 2026-06-16
- **Function Name:** FR-15 Product Management — Create Product (Category Validation)
- **Problem Summary:** The Create Product API accepts a `category_id` that references a non-existent category (`category_id = 99999`) and creates a product with an orphaned category reference, violating the requirement that category_id must reference an existing database record.
- **Severity:** Serious
- **Priority:** Serious
- **Status:** New
- **Assign To:** Development Team

#### Steps to Reproduce
**Steps:**
1. Open Postman.
2. Send `POST /api/products` with `Authorization: Bearer [admin_JWT]`.
3. Set request body: `{ "name": "Orphan Category Product", "price": 100000, "category_id": 99999 }`.
4. Click Send and observe the HTTP response.
5. Check whether a product was created with the non-existent category reference.

#### Test Results Matrix
- **Expected Result:** The API returns HTTP 400 Bad Request with an error message indicating that the selected category does not exist. No product is created with an orphaned category reference.
- **Actual Result:** The API returns HTTP 200 OK. No error message is returned. A product is created in the database with `category_id = 99999`, which does not reference any existing category record. This constitutes a data integrity violation.
- **Test Data:** `name = "Orphan Category Product"`, `price = 100000`, `category_id = 99999`
- **GitHub Issue Link:** https://github.com/AkiraTomori/eshop-sut/issues/50
- **Linked Test Case:** TC-FR15-NEG-019

---

### Bug Report: BUG-FR15-010
- **Date:** 2026-06-16
- **Function Name:** FR-15 Product Management — Create Product (Category Validation)
- **Problem Summary:** The Create Product API accepts a non-integer string as `category_id` (e.g., `"electronics"`) and creates a product, violating the type constraint that category_id must be a valid integer (AMB-04).
- **Severity:** Serious
- **Priority:** Serious
- **Status:** New
- **Assign To:** Development Team

#### Steps to Reproduce
**Steps:**
1. Open Postman.
2. Send `POST /api/products` with `Authorization: Bearer [admin_JWT]`.
3. Set request body: `{ "name": "Wrong Category Type Product", "price": 100000, "category_id": "electronics" }`.
4. Click Send and observe the HTTP response.
5. Check whether a product was created.

#### Test Results Matrix
- **Expected Result:** The API returns HTTP 400 Bad Request with an error message indicating that category_id must be a valid integer. No product is created.
- **Actual Result:** The API returns HTTP 200 OK (or 201 Created). No error message is returned. A product is created in the database with a non-integer category_id value.
- **Test Data:** `name = "Wrong Category Type Product"`, `price = 100000`, `category_id = "electronics"`
- **GitHub Issue Link:** https://github.com/AkiraTomori/eshop-sut/issues/51
- **Linked Test Case:** TC-FR15-NEG-020

---

### Bug Report: BUG-FR15-011
- **Date:** 2026-06-16
- **Function Name:** FR-15 Product Management — Edit Product (Product ID Validation)
- **Problem Summary:** The Edit Product API (`PUT /api/products/99999`) returns HTTP 200 OK when the product ID in the path does not exist, instead of returning HTTP 404 Not Found. No data is modified but the response code is incorrect, masking the error condition.
- **Severity:** Serious
- **Priority:** Serious
- **Status:** New
- **Assign To:** Development Team

#### Steps to Reproduce
**Steps:**
1. Open Postman.
2. Send `PUT /api/products/99999` with `Authorization: Bearer [admin_JWT]`.
3. Set request body: `{ "name": "Ghost Product", "price": 100000, "category_id": 1 }`.
4. Click Send and observe the HTTP response code and body.

#### Test Results Matrix
- **Expected Result:** The API returns HTTP 404 Not Found with an error message such as "Product not found". No existing product is modified.
- **Actual Result:** The API returns HTTP 200 OK. No error message is returned. No existing product is modified, but the incorrect 200 status code makes it appear the operation succeeded.
- **Test Data:** Path: `/api/products/99999`, body: `{ "name": "Ghost Product", "price": 100000, "category_id": 1 }`
- **GitHub Issue Link:** https://github.com/AkiraTomori/eshop-sut/issues/52
- **Linked Test Case:** TC-FR15-NEG-021

---

### Bug Report: BUG-FR15-012
- **Date:** 2026-06-16
- **Function Name:** FR-15 Product Management — Delete Product (Product ID Type Validation)
- **Problem Summary:** The Delete Product API (`DELETE /api/products/abc`) returns HTTP 200 OK when the product ID path parameter is a non-integer string (`"abc"`), instead of returning HTTP 400 Bad Request for an invalid path parameter type.
- **Severity:** Medium
- **Priority:** Medium
- **Status:** New
- **Assign To:** Development Team

#### Steps to Reproduce
**Steps:**
1. Open Postman.
2. Send `DELETE /api/products/abc` with `Authorization: Bearer [admin_JWT]`.
3. Click Send and observe the HTTP response code and body.

#### Test Results Matrix
- **Expected Result:** The API returns HTTP 400 Bad Request with an error message indicating that the product ID must be a valid integer. No product is deleted.
- **Actual Result:** The API returns HTTP 200 OK. No error message is returned. No product is deleted, but the incorrect 200 status code fails to communicate the error.
- **Test Data:** Path: `/api/products/abc`
- **GitHub Issue Link:** https://github.com/AkiraTomori/eshop-sut/issues/53
- **Linked Test Case:** TC-FR15-NEG-022

---

### Bug Report: BUG-FR15-013
- **Date:** 2026-06-16
- **Function Name:** FR-15 Product Management — Product Form GUI Compliance (FR-22)
- **Problem Summary:** The product creation form does not display a required field indicator (`*`) adjacent to any mandatory field label (Product Name, Price, Category), violating the FR-22 requirement that all mandatory fields must be visually marked with an asterisk.
- **Severity:** Medium
- **Priority:** Medium
- **Status:** New
- **Assign To:** Development Team

#### Steps to Reproduce
**Steps:**
1. Navigate to the product creation form at `http://localhost:5174`.
2. Inspect the labels of the mandatory fields: Product Name, Price, Category.
3. Look for the presence of a `*` symbol adjacent to each mandatory field label.
4. Use browser developer tools to confirm the DOM does not contain the `*` indicator.

#### Test Results Matrix
- **Expected Result:** Each mandatory field label (Product Name, Price, Category) displays a `*` symbol adjacent to the label text, as required by FR-22.
- **Actual Result:** None of the mandatory field labels display the required `*` symbol. The form fails to provide visual indicators for required states.
- **Test Data:** Visual + DOM inspection only.
- **GitHub Issue Link:** https://github.com/AkiraTomori/eshop-sut/issues/54
- **Linked Test Case:** TC-FR15-NEG-024

---

### Bug Report: BUG-FR15-014
- **Date:** 2026-06-16
- **Function Name:** FR-15 Product Management — Product Form GUI Compliance (FR-22)
- **Problem Summary:** Validation error messages on the product creation form appear below the individual field labels (e.g., below the Name field) rather than above the Submit button, violating the FR-22 requirement that all validation errors must appear above the Submit button.
- **Severity:** Medium
- **Priority:** Medium
- **Status:** New
- **Assign To:** Development Team

#### Steps to Reproduce
**Steps:**
1. Navigate to the product creation form at `http://localhost:5174`.
2. Leave all required fields empty.
3. Click the Submit / Save button.
4. Observe the position of the displayed validation error messages relative to the Submit button.

#### Test Results Matrix
- **Expected Result:** All validation error messages appear in the UI area **above** the Submit button, consistent with FR-22.
- **Actual Result:** A validation error message appears below the Name field label, not above the Submit button. Other mandatory fields do not display error messages at all.
- **Test Data:** Empty form submission (all fields blank).
- **GitHub Issue Link:** https://github.com/AkiraTomori/eshop-sut/issues/55
- **Linked Test Case:** TC-FR15-NEG-025

---

### Bug Report: BUG-FR15-015
- **Date:** 2026-06-16
- **Function Name:** FR-15 Product Management — Product Form GUI Compliance (FR-21)
- **Problem Summary:** The Submit / Save button on the product creation form uses a green background colour instead of the blue colour required by FR-21, which specifies that submission/positive-action buttons must be blue.
- **Severity:** Medium
- **Priority:** Medium
- **Status:** New
- **Assign To:** Development Team

#### Steps to Reproduce
**Steps:**
1. Navigate to the product creation form at `http://localhost:5174`.
2. Locate the Submit / Save button at the bottom of the form.
3. Use browser developer tools to inspect the computed CSS background-color property of the Submit button.

#### Test Results Matrix
- **Expected Result:** The Submit / Save button uses a blue background colour, consistent with FR-21 colour coding for positive/submission actions.
- **Actual Result:** The Submit / Save button uses a green background colour, violating the FR-21 color contract.
- **Test Data:** Visual inspection of product creation form.
- **GitHub Issue Link:** https://github.com/AkiraTomori/eshop-sut/issues/56
- **Linked Test Case:** TC-FR15-NEG-026

---

### Bug Report: BUG-FR15-016
- **Date:** 2026-06-16
- **Function Name:** FR-15 Product Management — Product Management Page GUI Compliance (FR-21)
- **Problem Summary:** The product management page contains zero `<h1>` elements in the DOM, violating the FR-21 requirement that each page must have exactly one `<h1>` heading tag.
- **Severity:** Medium
- **Priority:** Medium
- **Status:** New
- **Assign To:** Development Team

#### Steps to Reproduce
**Steps:**
1. Navigate to the product management list page at `http://localhost:5174`.
2. Open browser developer tools (F12).
3. In the browser console, execute: `document.querySelectorAll('h1').length`.

#### Test Results Matrix
- **Expected Result:** `document.querySelectorAll('h1').length` returns exactly `1`. A single `<h1>` tag is present on the page with a descriptive title.
- **Actual Result:** `document.querySelectorAll('h1').length` returns `0`. No `<h1>` element exists on the product management page.
- **Test Data:** DOM inspection via browser console.
- **GitHub Issue Link:** https://github.com/AkiraTomori/eshop-sut/issues/57
- **Linked Test Case:** TC-FR15-NEG-027

---

### Bug Report: BUG-FR15-017
- **Date:** 2026-06-16
- **Function Name:** FR-15 Product Management — Delete Product (Confirmation Dialog)
- **Problem Summary:** Clicking the Delete button on the product management list immediately deletes the product without displaying a confirmation dialog, violating the FR-21 / AMB-06 requirement that a confirmation dialog must appear before any deletion is executed.
- **Severity:** Serious
- **Priority:** Serious
- **Status:** New
- **Assign To:** Development Team

#### Steps to Reproduce
**Steps:**
1. Navigate to the product management list page at `http://localhost:5174`.
2. Locate any existing product in the list.
3. Click the Delete button for that product.
4. Immediately observe whether a confirmation dialog appears before deletion.

#### Test Results Matrix
- **Expected Result:** Immediately after clicking the Delete button, a confirmation dialog appears asking the admin to confirm the deletion. The product remains in the list while the dialog is displayed.
- **Actual Result:** After clicking the Delete button, no confirmation dialog appears. The product is immediately deleted from the list without any confirmation step.
- **Test Data:** Any existing product in the product management list.
- **GitHub Issue Link:** https://github.com/AkiraTomori/eshop-sut/issues/58
- **Linked Test Case:** TC-FR15-NEG-029


---

## 🟢 POOL D — FR-04: Personal Profile Management (Mobile App)
**Total Bugs Filed in Pool D:** 10 Defects (2 Fatal, 7 Serious, 1 Medium)

---
### Bug Report: BUG-FR04-001
**Date:** 2026-06-15
**Function Name:** FR-04 Personal Profile Management — Phone Number Validation
**Problem Summary:** Profile update API rejects all valid 10-digit and 11-digit phone numbers, and also rejects empty/optional phone submissions, because the mobile UI validation regex enforces an incorrect 9–10 digit range instead of the SRS-specified 10–11 digit range (Expected: phone numbers of 10–11 digits are accepted; Actual: error message "Vui lòng nhập đúng 9-10 chữ số" blocks all valid phone inputs)
**Severity:** Serious
**Priority:** Serious
**Status:** New
**Reported By:** Gemini QA Agent + Thái Minh Huy
**Assign To:** Development Team

#### Steps to Reproduce

**Pre-conditions:**
- EShop mobile app is running and connected to the backend at `http://localhost:3000`
- Test user `test@eshop.com` is logged in with a valid JWT session token
- User navigates to the Profile screen

**Steps:**
1. Navigate to the **Profile** screen in the mobile app
2. Enter `"Nguyen Van Test"` in the Full Name field
3. Enter `"0912345678"` (10 digits, starts with `0`) in the Phone Number field
4. Enter `"Test Address"` in the Shipping Address field
5. Tap the **Save / Update** button
6. Observe the UI response

**Expected Result:**
Per SRS FR-04, phone numbers of 10 or 11 digits starting with `0` are valid. The system should return HTTP 200 OK, display a success notification, and update the profile in the database. The same behaviour is expected for 11-digit inputs (`"01234567890"`) and for an empty phone field (optional field per FR-04).

**Actual Result:**
The mobile UI displays a validation error message: **"Lỗi, Số điện thoại không hợp lệ. Vui lòng nhập đúng 9-10 chữ số"** — the error indicates 9–10 digits, not 10–11 digits as specified in the SRS. The form submission is blocked. The database state remains unchanged. This defect is reproduced consistently for:
- 10-digit phones (TC-FR04-EP-001): **Failed**
- 11-digit phones (TC-FR04-EP-002): **Failed**
- Empty phone field (TC-FR04-EP-003): **Failed**
- 9-digit phone boundary (TC-FR04-NEG-008, BV-006): rejected correctly but with wrong error text
- 12-digit phone boundary at API level (TC-FR04-BV-009): accepted instead of rejected (see BUG-FR04-008)

**Root Cause (Suspected):** The client-side validation regex in the mobile app enforces `length >= 9 && length <= 10` instead of `length >= 10 && length <= 11`. The off-by-one error in the allowed range means all SRS-valid phones are rejected and 9-digit phones (which should be invalid) are incorrectly accepted by the UI validation rule (though subsequently the error message is still shown, which is also wrong).

**Environment:**
- OS: iOS (mobile device / emulator)
- App: EShop Mobile App (React Native + Expo)
- Backend: Node.js + Express at `http://localhost:3000`
- Test Data: `phone = "0912345678"` (10 digits), `phone = "01234567890"` (11 digits), `phone = ""`

**GitHub Issue:** https://github.com/AkiraTomori/eshop-sut/issues/32
**Linked Test Cases:** TC-FR04-EP-001, TC-FR04-EP-002, TC-FR04-EP-003, TC-FR04-NEG-008, TC-FR04-NEG-009, TC-FR04-BV-006

---
### Bug Report: BUG-FR04-002
**Date:** 2026-06-15
**Function Name:** FR-04 Personal Profile Management — JWT Authentication Error Code
**Problem Summary:** The API returns HTTP 403 Forbidden when a malformed JWT token is sent in the Authorization header, instead of the expected HTTP 401 Unauthorized (Expected: HTTP 401; Actual: HTTP 403)
**Severity:** Medium
**Priority:** Medium
**Status:** New
**Reported By:** Gemini QA Agent + Thái Minh Huy
**Assign To:** Development Team

#### Steps to Reproduce

**Pre-conditions:**
- EShop backend is running at `http://localhost:3000`
- Postman or equivalent API testing tool is available

**Steps:**
1. Open Postman and create a `PUT` request to `http://localhost:3000/api/users/me`
2. Set the request body to:
   ```json
   { "name": "Test", "phone": "0912345678", "shipping_address": "Test Address" }
   ```
3. Set the Authorization header to: `Bearer thisisnotavalidjwt`
4. Send the request
5. Observe the HTTP response status code and body

**Expected Result:**
Per SEC-02, any request with an invalid or unparseable token must be rejected with **HTTP 401 Unauthorized** and an error body indicating the request is unauthenticated.

**Actual Result:**
The server returns **HTTP 403 Forbidden** instead of HTTP 401 Unauthorized. The profile data in the database remains unchanged (the rejection is correct, but the status code is wrong). Reproduced consistently across 2 attempts from a clean state.

**Root Cause (Suspected):** The authentication middleware uses HTTP 403 for all token-related rejections without distinguishing between "not authenticated" (401) and "authenticated but not authorized" (403). RFC 7235 defines 401 for authentication failure and 403 for authorization failure — these are different semantics.

**Environment:**
- OS: macOS Tahoe 26.1 (Postman desktop client)
- API Endpoint: `PUT http://localhost:3000/api/users/me`
- Test Data: `Authorization: Bearer thisisnotavalidjwt`

**GitHub Issue:** https://github.com/AkiraTomori/eshop-sut/issues/33
**Linked Test Case:** TC-FR04-NEG-002

---
### Bug Report: BUG-FR04-003
**Date:** 2026-06-15
**Function Name:** FR-04 Personal Profile Management — Expired JWT Token Acceptance
**Problem Summary:** The API accepts an expired JWT token and successfully updates the user profile, instead of rejecting the request with HTTP 401 Unauthorized (Expected: HTTP 401; Actual: HTTP 200 OK with profile data updated in database)
**Severity:** Fatal
**Priority:** Immediate
**Status:** New
**Reported By:** Gemini QA Agent + Thái Minh Huy
**Assign To:** Development Team

#### Steps to Reproduce

**Pre-conditions:**
- EShop backend is running at `http://localhost:3000`
- An expired JWT token is available (from a previous session that has timed out, or manually constructed with a past `exp` claim)
- Postman or equivalent API testing tool is available

**Steps:**
1. Open Postman and create a `PUT` request to `http://localhost:3000/api/users/me`
2. Set the request body to:
   ```json
   { "name": "Test", "phone": "0912345678", "shipping_address": "Test Address" }
   ```
3. Set the Authorization header to: `Bearer <expired_jwt_token>`
4. Send the request
5. Observe the HTTP response status code and body
6. Send a `GET` request to `http://localhost:3000/api/users/me` using the same expired token and verify the database state

**Expected Result:**
Per SEC-02, the server must validate the JWT token's expiry claim (`exp`). An expired token must be rejected with **HTTP 401 Unauthorized** and an error body indicating the token has expired. The profile data must not be modified.

**Actual Result:**
The server returns **HTTP 200 OK** and successfully updates the user profile in the database. The expired JWT token is accepted as valid, bypassing the token expiry check entirely. This defect was reproduced consistently across 2 attempts from a clean state.

**Security Impact:** This is a **Fatal** defect. An attacker in possession of a stolen or leaked JWT token can continue to access and modify user profile data indefinitely, even after the token has expired — effectively making the token non-revocable by expiry. This defeats the purpose of JWT token expiration as a security control.

**Environment:**
- OS: macOS Tahoe 26.1 (Postman desktop client)
- API Endpoint: `PUT http://localhost:3000/api/users/me`
- Test Data: `Authorization: Bearer <expired_jwt_token>` (token with past `exp` claim)

**GitHub Issue:** https://github.com/AkiraTomori/eshop-sut/issues/34
**Linked Test Case:** TC-FR04-NEG-003

---
### Bug Report: BUG-FR04-004
**Date:** 2026-06-15
**Function Name:** FR-04 Personal Profile Management — Empty Name Validation
**Problem Summary:** The API accepts an empty string `""` for the mandatory `name` field and successfully updates the user profile with a blank name, instead of rejecting the request with HTTP 400 Bad Request (Expected: HTTP 400; Actual: HTTP 200 OK with blank name stored in database)
**Severity:** Serious
**Priority:** Serious
**Status:** New
**Reported By:** Gemini QA Agent + Thái Minh Huy
**Assign To:** Development Team

#### Steps to Reproduce

**Pre-conditions:**
- EShop backend is running at `http://localhost:3000`
- Postman or equivalent API testing tool is available
- Test user `test@eshop.com` is authenticated; valid JWT token is available

**Steps:**
1. Open Postman and create a `PUT` request to `http://localhost:3000/api/users/me`
2. Set the Authorization header to: `Bearer <valid_token>`
3. Set the request body to:
   ```json
   { "name": "", "phone": "0912345678", "shipping_address": "Test Address" }
   ```
4. Send the request
5. Observe the HTTP response status code and body
6. Send a `GET` request to `http://localhost:3000/api/users/me` and verify the stored name value

**Expected Result:**
Per FR-04 and FR-01, the `name` field is mandatory. The server must reject a request where `name` is an empty string with **HTTP 400 Bad Request** and an error message such as `{"message": "Name is required"}`. The profile data in the database must remain unchanged.

**Actual Result:**
The server returns **HTTP 200 OK**. A subsequent `GET /api/users/me` confirms the stored name has been updated to an empty string `""`. The database record is corrupted — the user account now has a blank display name. Reproduced consistently across 2 attempts from a clean state.

**Environment:**
- OS: macOS Tahoe 26.1 (Postman desktop client)
- API Endpoint: `PUT http://localhost:3000/api/users/me`
- Test Data: `{"name": "", "phone": "0912345678", "shipping_address": "Test Address"}`

**GitHub Issue:** https://github.com/AkiraTomori/eshop-sut/issues/35
**Linked Test Case:** TC-FR04-NEG-004

---
### Bug Report: BUG-FR04-005
**Date:** 2026-06-15
**Function Name:** FR-04 Personal Profile Management — Full Name Length Upper Bound Not Enforced
**Problem Summary:** The API accepts a Full Name value of 256 characters (and longer) without error, storing the full oversized string in the database, instead of rejecting the request with HTTP 400 Bad Request (Expected: HTTP 400 for name > 255 chars; Actual: HTTP 200 OK with full string stored)
**Severity:** Serious
**Priority:** Serious
**Status:** New
**Reported By:** Gemini QA Agent + Thái Minh Huy
**Assign To:** Development Team

#### Steps to Reproduce

**Pre-conditions:**
- EShop backend is running at `http://localhost:3000`
- Postman or equivalent API testing tool is available
- Valid JWT token is available

**Steps:**
1. Open Postman and create a `PUT` request to `http://localhost:3000/api/users/me`
2. Set the Authorization header to: `Bearer <valid_token>`
3. Construct a name string of exactly **256 characters** (e.g., `"A" × 256`)
4. Set the request body to:
   ```json
   { "name": "AAA...A (256 chars)", "phone": "0912345678", "shipping_address": "Test Address" }
   ```
5. Send the request
6. Observe the HTTP response status code and body
7. Send a `GET` request to `http://localhost:3000/api/users/me` and verify the stored name length

**Expected Result:**
The server must reject the request with **HTTP 400 Bad Request** and an error message indicating the name exceeds the maximum allowed length (255 characters). The profile data in the database must remain unchanged.

**Actual Result:**
The server returns **HTTP 200 OK**. A subsequent `GET /api/users/me` confirms the full 256-character string is stored in the database without truncation. No error or warning is returned. The same behaviour was observed with names significantly longer than 255 characters (TC-FR04-BV-005). Reproduced consistently across 2 attempts.

**Environment:**
- OS: macOS Tahoe 26.1 (Postman desktop client)
- API Endpoint: `PUT http://localhost:3000/api/users/me`
- Test Data: `{"name": "A" × 256, "phone": "0912345678", "shipping_address": "Test Address"}`

**GitHub Issue:** https://github.com/AkiraTomori/eshop-sut/issues/36
**Linked Test Cases:** TC-FR04-NEG-005, TC-FR04-BV-005

---
### Bug Report: BUG-FR04-006
**Date:** 2026-06-15
**Function Name:** FR-04 Personal Profile Management — Missing Name Field Accepted by API
**Problem Summary:** The API accepts a PUT request body that entirely omits the mandatory `name` key and successfully updates the profile, instead of rejecting with HTTP 400 Bad Request (Expected: HTTP 400; Actual: HTTP 200 OK with database state changed)
**Severity:** Serious
**Priority:** Serious
**Status:** New
**Reported By:** Gemini QA Agent + Thái Minh Huy
**Assign To:** Development Team

#### Steps to Reproduce

**Pre-conditions:**
- EShop backend is running at `http://localhost:3000`
- Postman or equivalent API testing tool is available
- Valid JWT token is available

**Steps:**
1. Open Postman and create a `PUT` request to `http://localhost:3000/api/users/me`
2. Set the Authorization header to: `Bearer <valid_token>`
3. Set the request body to — intentionally omitting the `name` key entirely:
   ```json
   { "phone": "0912345678", "shipping_address": "Test Address" }
   ```
4. Send the request
5. Observe the HTTP response status code and body
6. Send a `GET` request to `http://localhost:3000/api/users/me` and verify if the database was modified

**Expected Result:**
Per FR-04, `name` is a mandatory field. The server must reject a request where the `name` key is absent with **HTTP 400 Bad Request** and an error message such as `{"message": "Name is required"}`. The profile data in the database must remain unchanged.

**Actual Result:**
The server returns **HTTP 200 OK**. The database state is changed (phone and address are updated). The missing mandatory `name` field is not enforced at the API validation layer. Reproduced consistently across 2 attempts.

**Environment:**
- OS: macOS Tahoe 26.1 (Postman desktop client)
- API Endpoint: `PUT http://localhost:3000/api/users/me`
- Test Data: `{"phone": "0912345678", "shipping_address": "Test Address"}` (no `name` key)

**GitHub Issue:** https://github.com/AkiraTomori/eshop-sut/issues/37
**Linked Test Case:** TC-FR04-NEG-006

---
### Bug Report: BUG-FR04-007
**Date:** 2026-06-15
**Function Name:** FR-04 Personal Profile Management — Phone Prefix `0` Rule Not Enforced
**Problem Summary:** The API and mobile UI accept a phone number that does not start with digit `0` (e.g., `"1912345678"`), storing it in the database without error, instead of rejecting the input per the SRS prefix constraint (Expected: validation error; Actual: HTTP 200 OK with invalid phone stored)
**Severity:** Serious
**Priority:** Serious
**Status:** New
**Reported By:** Gemini QA Agent + Thái Minh Huy
**Assign To:** Development Team

#### Steps to Reproduce

**Pre-conditions:**
- EShop mobile app is running and connected to the backend at `http://localhost:3000`
- Test user `test@eshop.com` is logged in with a valid JWT session token

**Steps:**
1. Navigate to the **Profile** screen in the mobile app
2. Enter `"Nguyen Van Test"` in the Full Name field
3. Enter `"1912345678"` in the Phone Number field (10 digits, starts with `1` — not `0`)
4. Enter `"Test Address"` in the Shipping Address field
5. Tap the **Save / Update** button
6. Observe the UI response
7. Also send directly via Postman:
   ```json
   { "name": "Nguyen Van Test", "phone": "1912345678", "shipping_address": "Test Address" }
   ```

**Expected Result:**
Per SRS FR-04, a valid phone number must start with digit `0`. A phone number starting with any other digit (e.g., `1`) must be rejected with a validation error message indicating the phone must start with `0`. The profile data must not be modified.

**Actual Result:**
Neither the mobile UI nor the API rejects the phone number. No error message is displayed on the mobile app screen. The API returns **HTTP 200 OK** and the phone number `"1912345678"` is stored in the database. The `0` prefix constraint is not enforced at either the frontend or backend validation layer. Reproduced consistently across 2 attempts.

**Environment:**
- OS: iOS (mobile device / emulator)
- App: EShop Mobile App (React Native + Expo)
- Backend: Node.js + Express at `http://localhost:3000`
- API Endpoint: `PUT http://localhost:3000/api/users/me`
- Test Data: `phone = "1912345678"` (starts with `1`)

**GitHub Issue:** https://github.com/AkiraTomori/eshop-sut/issues/38
**Linked Test Case:** TC-FR04-NEG-007

---
### Bug Report: BUG-FR04-008
**Date:** 2026-06-15
**Function Name:** FR-04 Personal Profile Management — Non-Numeric Phone Accepted by API; 12-Digit Phone Accepted by API
**Problem Summary:** The backend API accepts phone numbers containing non-numeric characters (e.g., `"0912-345-678"`) and also accepts phone numbers exceeding the 11-digit maximum (e.g., `"012345678901"` — 12 digits), storing them in the database without any validation error (Expected: HTTP 400; Actual: HTTP 200 OK with invalid data stored)
**Severity:** Serious
**Priority:** Serious
**Status:** New
**Reported By:** Gemini QA Agent + Thái Minh Huy
**Assign To:** Development Team

#### Steps to Reproduce

**Pre-conditions:**
- EShop backend is running at `http://localhost:3000`
- Postman or equivalent API testing tool is available
- Valid JWT token is available

**Steps — Scenario A (Non-numeric phone):**
1. Open Postman and create a `PUT` request to `http://localhost:3000/api/users/me`
2. Set the Authorization header to: `Bearer <valid_token>`
3. Set the request body to:
   ```json
   { "name": "Nguyen Van Test", "phone": "0912-345-678", "shipping_address": "Test Address" }
   ```
4. Send the request and observe the HTTP response
5. Send a `GET` to `/api/users/me` to confirm if `"0912-345-678"` is stored in the database

**Steps — Scenario B (12-digit phone):**
1. Repeat steps 1–2 above
2. Set the request body to:
   ```json
   { "name": "Nguyen Van Test", "phone": "012345678901", "shipping_address": "Test Address" }
   ```
3. Send the request and observe the HTTP response
4. Send a `GET` to `/api/users/me` to confirm if the 12-digit string is stored

**Expected Result:**
- **Scenario A:** The API must reject the request with HTTP 400 Bad Request and a validation error stating the phone must contain only numeric digits (0–9). The database must not be modified.
- **Scenario B:** The API must reject the request with HTTP 400 Bad Request and a validation error stating the phone must be 10–11 digits long. The database must not be modified.

**Actual Result:**
- **Scenario A:** The API returns **HTTP 200 OK** and stores `"0912-345-678"` (with dashes) directly into the database. The backend has no numeric-character validation for the phone field at the API layer (TC-FR04-NEG-010).
- **Scenario B:** The API returns **HTTP 200 OK** and stores `"012345678901"` (12 digits) into the database without truncation or error (TC-FR04-BV-009). Both defects are attributed to a missing server-side phone validation layer.

Both scenarios reproduced consistently across 2 attempts from a clean state.

**Environment:**
- OS: macOS Tahoe 26.1 (Postman desktop client)
- API Endpoint: `PUT http://localhost:3000/api/users/me`
- Test Data Scenario A: `phone = "0912-345-678"` (contains dashes)
- Test Data Scenario B: `phone = "012345678901"` (12 digits)

**GitHub Issue:** https://github.com/AkiraTomori/eshop-sut/issues/39
**Linked Test Cases:** TC-FR04-NEG-010, TC-FR04-BV-009

---
### Bug Report: BUG-FR04-009
**Date:** 2026-06-15
**Function Name:** FR-04 Personal Profile Management — Role Privilege Escalation via PUT Payload
**Problem Summary:** A standard user can escalate their own account role to `"admin"` by including `"role": "admin"` in a PUT /api/users/me request; the API does not strip or reject the `role` field and writes it to the database — directly violating SEC-06 (Expected: `role` field silently ignored, `role = "user"` unchanged; Actual: `role = "admin"` stored in database)
**Severity:** Fatal
**Priority:** Immediate
**Status:** New
**Reported By:** Gemini QA Agent + Thái Minh Huy
**Assign To:** Development Team

#### Steps to Reproduce

**Pre-conditions:**
- EShop backend is running at `http://localhost:3000`
- Postman or equivalent API testing tool is available
- Test user `test@eshop.com` is authenticated; valid JWT token is available
- The test user's current `role` is confirmed as `"user"` via `GET /api/users/me`

**Steps:**
1. Open Postman and send a `GET` request to `http://localhost:3000/api/users/me` with `Bearer <valid_token>` — confirm `role = "user"`
2. Open a new `PUT` request to `http://localhost:3000/api/users/me`
3. Set the Authorization header to: `Bearer <valid_token>`
4. Set the request body to:
   ```json
   {
     "name": "Nguyen Van Test",
     "phone": "0912345678",
     "shipping_address": "Test Address",
     "role": "admin"
   }
   ```
5. Send the request and observe the HTTP response
6. Send a `GET` request to `http://localhost:3000/api/users/me` with the same token
7. Inspect the `role` field in the GET response body

**Expected Result:**
Per SEC-06, the `role` attribute is read-only from the client. The server must silently ignore any `role` key present in the PUT request body. A subsequent `GET /api/users/me` must confirm the user's role is still `"user"`. Attempting to access an admin-only endpoint must return HTTP 403.

**Actual Result:**
The API returns **HTTP 200 OK**. A subsequent `GET /api/users/me` confirms `role = "admin"` — the role has been successfully escalated from `"user"` to `"admin"`. The attacker now has administrator-level privileges on the account. This represents a **critical privilege escalation vulnerability** — any authenticated user can promote themselves to admin through a single API call. Reproduced consistently across 2 attempts from a clean state.

**Security Impact (Critical):** An attacker exploiting this vulnerability gains full administrator access to the EShop system, including all admin-only endpoints. This could result in unauthorized access to all user data, the ability to modify/delete products and orders, and full system compromise. This defect must be treated as a **P0 / Immediate priority** security incident.

**Environment:**
- OS: macOS (Postman desktop client)
- API Endpoint: `PUT http://localhost:3000/api/users/me`
- Test Data: `{"role": "admin"}` injected in PUT body of a standard `user`-role account

**GitHub Issue:** https://github.com/AkiraTomori/eshop-sut/issues/40
**Linked Test Case:** TC-FR04-NEG-013

---
### Bug Report: BUG-FR04-010
**Date:** 2026-06-15
**Function Name:** FR-04 Personal Profile Management — Shipping Address Length Upper Bound Not Enforced
**Problem Summary:** The API accepts a Shipping Address value exceeding 255 characters (e.g., 256+ chars) without error, storing the full oversized string in the database, instead of rejecting the request with HTTP 400 Bad Request (Expected: HTTP 400 for address > 255 chars; Actual: HTTP 200 OK with full string stored)
**Severity:** Serious
**Priority:** Serious
**Status:** New
**Reported By:** Gemini QA Agent + Thái Minh Huy
**Assign To:** Development Team

#### Steps to Reproduce

**Pre-conditions:**
- EShop backend is running at `http://localhost:3000`
- Postman or equivalent API testing tool is available
- Valid JWT token is available

**Steps:**
1. Open Postman and create a `PUT` request to `http://localhost:3000/api/users/me`
2. Set the Authorization header to: `Bearer <valid_token>`
3. Construct an address string of exactly **256 characters** (e.g., `"A" × 256`)
4. Set the request body to:
   ```json
   { "name": "Nguyen Van Test", "phone": "0912345678", "shipping_address": "AAA...A (256 chars)" }
   ```
5. Send the request
6. Observe the HTTP response status code and body
7. Send a `GET` request to `http://localhost:3000/api/users/me` and verify the stored address length

**Expected Result:**
The server must reject the request with **HTTP 400 Bad Request** and an error message indicating the shipping address exceeds the maximum allowed length (255 characters). The profile data in the database must remain unchanged.

**Actual Result:**
The server returns **HTTP 200 OK**. A subsequent `GET /api/users/me` confirms the full 256-character address string is stored in the database without truncation. No error or warning is returned (TC-FR04-NEG-011, TC-FR04-BV-014). Reproduced consistently across 2 attempts.

**Environment:**
- OS: macOS Tahoe 26.1 (Postman desktop client)
- API Endpoint: `PUT http://localhost:3000/api/users/me`
- Test Data: `{"shipping_address": "A" × 256, "name": "Nguyen Van Test", "phone": "0912345678"}`

**GitHub Issue:** https://github.com/AkiraTomori/eshop-sut/issues/41
**Linked Test Cases:** TC-FR04-NEG-011, TC-FR04-BV-014