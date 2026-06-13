# Bug Reports — FR-06: Product Detail View
**Test Cycle:** HW02 Domain Testing
**Pool:** A — FR-06 Product Detail View
**Date:** 2026-06-13
**Tester:** Gemini QA Agent + Thái Minh Huy
**Environment (all bugs):**
- OS: macOS Tahoe 26.1
- Browser: Microsoft Edge (latest)
- Frontend URL: http://localhost:5173
- Backend URL: http://localhost:3000

---

## Bug Report: BUG-FR06-001

**Date:** 2026-06-13
**Function Name:** FR-06 Product Detail View — Product Information Display
**Problem Summary:** Product detail page is missing the category name field, missing breadcrumb navigation, and the "Add to Cart" button is displayed in green instead of the required blue colour (Expected: category name displayed, breadcrumbs visible, and button colour blue per FR-21/FR-24).
**Severity:** Serious
**Priority:** High
**Status:** New
**Reported By:** Gemini QA Agent + Thái Minh Huy
**Assign To:** Development Team

### Steps to Reproduce

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

**GitHub Issue:** _(HITL must file and link: https://github.com/[repo]/issues/[N])_
**Linked Test Case:** TC-FR06-EP-001, TC-FR06-BV-001, TC-FR06-BV-002
**Attachments:** _(HITL attaches screenshot / recording)_

---

## Bug Report: BUG-FR06-002

**Date:** 2026-06-13
**Function Name:** FR-06 Product Detail View / FR-07 Cart Management — Add to Cart Duplicate Row
**Problem Summary:** Adding a product that already exists in the cart creates a new duplicate row instead of incrementing the existing row's quantity (Expected: existing cart entry quantity is incremented; no duplicate rows).
**Severity:** Serious
**Priority:** High
**Status:** New
**Reported By:** Gemini QA Agent + Thái Minh Huy
**Assign To:** Development Team

### Steps to Reproduce

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

**GitHub Issue:** _(HITL must file and link: https://github.com/[repo]/issues/[N])_
**Linked Test Case:** TC-FR06-EP-004
**Attachments:** _(HITL attaches screenshot / recording)_

---

## Bug Report: BUG-FR06-003

**Date:** 2026-06-13
**Function Name:** FR-06 Product Detail View — Quantity Field Input Validation (Zero)
**Problem Summary:** The quantity field on the product detail page accepts and processes a value of `0`, allowing a product to be added to the cart with zero quantity (Expected: quantity of 0 is rejected with an appropriate error message; product is NOT added to cart).
**Severity:** Serious
**Priority:** High
**Status:** New
**Reported By:** Gemini QA Agent + Thái Minh Huy
**Assign To:** Development Team

### Steps to Reproduce

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

**GitHub Issue:** _(HITL must file and link: https://github.com/[repo]/issues/[N])_
**Linked Test Case:** TC-FR06-NEG-006
**Attachments:** _(HITL attaches screenshot / recording)_

---

## Bug Report: BUG-FR06-004

**Date:** 2026-06-13
**Function Name:** FR-06 Product Detail View — Quantity Field Input Validation (Negative Integer)
**Problem Summary:** The quantity field on the product detail page accepts and processes a negative value (`-1`), allowing a product to be added to the cart with a negative quantity (Expected: negative quantity is rejected with an appropriate error; product is NOT added to cart).
**Severity:** Serious
**Priority:** Immediate
**Status:** New
**Reported By:** Gemini QA Agent + Thái Minh Huy
**Assign To:** Development Team

### Steps to Reproduce

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

**GitHub Issue:** _(HITL must file and link: https://github.com/[repo]/issues/[N])_
**Linked Test Case:** TC-FR06-NEG-007
**Attachments:** _(HITL attaches screenshot / recording)_

---

## Bug Report: BUG-FR06-005

**Date:** 2026-06-13
**Function Name:** FR-06 Product Detail View — Quantity Field Input Validation (Decimal)
**Problem Summary:** The quantity field accepts a decimal value (`1.5`) and silently truncates it to `1` before adding to cart, without informing the user that their input was modified (Expected: decimal input is rejected with a clear error message OR the UI prevents decimal entry; silent truncation without notification is a defect).
**Severity:** Medium
**Priority:** Medium
**Status:** New
**Reported By:** Gemini QA Agent + Thái Minh Huy
**Assign To:** Development Team

### Steps to Reproduce

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

**GitHub Issue:** _(HITL must file and link: https://github.com/[repo]/issues/[N])_
**Linked Test Case:** TC-FR06-NEG-008
**Attachments:** _(HITL attaches screenshot / recording)_

---

## Bug Report: BUG-FR06-006

**Date:** 2026-06-13
**Function Name:** FR-06 Product Detail View — Quantity Field Input Validation (Non-Numeric / NaN)
**Problem Summary:** The quantity field (`input type="number"`) accepts non-numeric text (e.g., `abc`), and the product is added to the cart — NaN quantity reaches the backend (Expected: non-numeric input is rejected at the frontend; the product must NOT be added to the cart with an invalid quantity).
**Severity:** Serious
**Priority:** High
**Status:** New
**Reported By:** Gemini QA Agent + Thái Minh Huy
**Assign To:** Development Team

### Steps to Reproduce

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

**GitHub Issue:** _(HITL must file and link: https://github.com/[repo]/issues/[N])_
**Linked Test Case:** TC-FR06-NEG-009
**Attachments:** _(HITL attaches screenshot / recording)_

---

## Bug Report: BUG-FR06-007

**Date:** 2026-06-13
**Function Name:** FR-06 Product Detail View — Quantity Field Input Validation (Empty Field)
**Problem Summary:** Clearing the quantity field completely and clicking "Add to Cart" results in the product being added to the cart with a NaN quantity (Expected: empty quantity field is rejected; the product must NOT be added to the cart with an undefined or NaN quantity).
**Severity:** Serious
**Priority:** High
**Status:** New
**Reported By:** Gemini QA Agent + Thái Minh Huy
**Assign To:** Development Team

### Steps to Reproduce

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

**GitHub Issue:** _(HITL must file and link: https://github.com/[repo]/issues/[N])_
**Linked Test Case:** TC-FR06-NEG-010
**Attachments:** _(HITL attaches screenshot / recording)_

---

## Bug Report: BUG-FR06-008

**Date:** 2026-06-13
**Function Name:** FR-06 Product Detail View — Quantity Field Input Validation (Extremely Large Value)
**Problem Summary:** The quantity field accepts an extremely large value (`999999999`) without any upper-limit validation, allowing the product to be added to the cart with a quantity far exceeding any practical system limit (Expected: the system rejects or caps the quantity at a defined maximum).
**Severity:** Medium
**Priority:** Medium
**Status:** New
**Reported By:** Gemini QA Agent + Thái Minh Huy
**Assign To:** Development Team

### Steps to Reproduce

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

**GitHub Issue:** _(HITL must file and link: https://github.com/[repo]/issues/[N])_
**Linked Test Case:** TC-FR06-NEG-011
**Attachments:** _(HITL attaches screenshot / recording)_

---

## Bug Report: BUG-FR06-009

**Date:** 2026-06-13
**Function Name:** FR-06 Product Detail View / SEC-02 Authentication — Unauthenticated Add to Cart
**Problem Summary:** An unauthenticated user (no session/JWT) is able to add a product to the cart without being redirected to login or shown an authentication error (Expected: unauthenticated add-to-cart is blocked; user is redirected to `/login` or shown a descriptive error toast).
**Severity:** Serious
**Priority:** Immediate
**Status:** New
**Reported By:** Gemini QA Agent + Thái Minh Huy
**Assign To:** Development Team

### Steps to Reproduce

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

**GitHub Issue:** _(HITL must file and link: https://github.com/[repo]/issues/[N])_
**Linked Test Case:** TC-FR06-NEG-012
**Attachments:** _(HITL attaches screenshot showing no login prompt)_

---

## Bug Report: BUG-FR06-010

**Date:** 2026-06-13
**Function Name:** FR-06 Product Detail View — API Cart Validation (Non-Existent Product ID)
**Problem Summary:** The `POST /api/cart` endpoint accepts a cart request containing a non-existent product ID (`id=99999`) and adds the item to the user's cart without verifying product existence in the database (Expected: the API rejects the request with HTTP 400 or 404 when the product ID does not exist).
**Severity:** Serious
**Priority:** High
**Status:** New
**Reported By:** Gemini QA Agent + Thái Minh Huy
**Assign To:** Development Team

### Steps to Reproduce

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

**GitHub Issue:** _(HITL must file and link: https://github.com/[repo]/issues/[N])_
**Linked Test Case:** TC-FR06-NEG-013
**Attachments:** _(HITL attaches Postman screenshot showing 2xx response)_

---

---

## Bug Report: BUG-FR06-011

**Date:** 2026-06-13
**Function Name:** FR-06 Product Detail View — API Cart Price Validation (Zero Price)
**Problem Summary:** The `POST /api/cart` endpoint accepts a cart request body with `price=0`, storing the item at zero cost — effectively making products free (Expected: the API rejects any request where `price ≤ 0` with HTTP 400; zero price must not be persisted in the cart).
**Severity:** Fatal
**Priority:** Immediate
**Status:** New
**Reported By:** Gemini QA Agent + Thái Minh Huy
**Assign To:** Development Team

### Steps to Reproduce

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

**GitHub Issue:** _(HITL must file and link: https://github.com/[repo]/issues/[N])_
**Linked Test Case:** TC-FR06-NEG-014
**Attachments:** _(HITL attaches Postman screenshot showing 2xx response and GET /api/cart response confirming price=0)_

---

## Bug Report: BUG-FR06-012

**Date:** 2026-06-13
**Function Name:** FR-06 Product Detail View — API Cart Price Validation (Negative Price)
**Problem Summary:** The `POST /api/cart` endpoint accepts a cart request body with a negative `price` (`-1000000`), which produces a negative cart total — a critical financial integrity defect (Expected: the API rejects any request where `price < 0` with HTTP 400).
**Severity:** Fatal
**Priority:** Immediate
**Status:** New
**Reported By:** Gemini QA Agent + Thái Minh Huy
**Assign To:** Development Team

### Steps to Reproduce

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

**GitHub Issue:** _(HITL must file and link: https://github.com/[repo]/issues/[N])_
**Linked Test Case:** TC-FR06-NEG-015
**Attachments:** _(HITL attaches Postman screenshot showing 2xx response and negative total in cart)_

---

## Bug Report: BUG-FR06-013

**Date:** 2026-06-13
**Function Name:** FR-06 Product Detail View — API Cart Quantity Validation (Zero Quantity)
**Problem Summary:** The `POST /api/cart` endpoint accepts a cart request with `quantity=0` at the API level, bypassing the frontend's specification minimum of 1 (Expected: the API rejects quantity=0 with HTTP 400 as a server-side guard independent of UI validation).
**Severity:** Serious
**Priority:** High
**Status:** New
**Reported By:** Gemini QA Agent + Thái Minh Huy
**Assign To:** Development Team

### Steps to Reproduce

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

**GitHub Issue:** _(HITL must file and link: https://github.com/[repo]/issues/[N])_
**Linked Test Case:** TC-FR06-NEG-016
**Attachments:** _(HITL attaches Postman screenshot showing 2xx response)_

---

## Bug Report: BUG-FR06-014

**Date:** 2026-06-13
**Function Name:** FR-06 Product Detail View — API Cart Quantity Validation (NaN / String Quantity)
**Problem Summary:** The `POST /api/cart` endpoint accepts a string value (`"abc"`) in the `quantity` field and stores it in the cart as a NaN quantity, corrupting the cart data (Expected: the API rejects non-numeric quantity with HTTP 400 and enforces type validation server-side).
**Severity:** Serious
**Priority:** High
**Status:** New
**Reported By:** Gemini QA Agent + Thái Minh Huy
**Assign To:** Development Team

### Steps to Reproduce

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

**GitHub Issue:** _(HITL must file and link: https://github.com/[repo]/issues/[N])_
**Linked Test Case:** TC-FR06-NEG-017
**Attachments:** _(HITL attaches Postman screenshot showing 2xx response and GET /api/cart showing NaN quantity)_

---

## Bug Report: BUG-FR06-015

**Date:** 2026-06-13
**Function Name:** FR-06 Product Detail View — API Security: Price Tampering Attack
**Problem Summary:** The `POST /api/cart` API blindly trusts the client-sent `price` field without cross-referencing the actual product price in the database. An attacker can set `price=1` for a product worth ₫30,000,000 and complete checkout at that fraudulent price — a critical security and financial integrity vulnerability (Expected: the API fetches the authoritative price from the database and ignores or overrides the client-sent value).
**Severity:** Fatal
**Priority:** Immediate
**Status:** New
**Reported By:** Gemini QA Agent + Thái Minh Huy
**Assign To:** Development Team

### Steps to Reproduce

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

**GitHub Issue:** _(HITL must file and link: https://github.com/[repo]/issues/[N])_
**Linked Test Case:** TC-FR06-NEG-018
**Attachments:** _(HITL attaches Postman screenshots: GET /api/products/1 showing real price, POST /api/cart with price=1 showing 2xx, GET /api/cart showing tampered price, checkout total showing ₫1)_

---

## Bug Report: BUG-FR06-016

**Date:** 2026-06-13
**Function Name:** FR-06 Product Detail View — Product Information Display (BVA: id=1 Lower Boundary)
**Problem Summary:** The product detail page for the smallest valid product ID (`id=1`) does not display the category name field — one of the 5 mandatory fields per FR-06 (Expected: category name is displayed). **Note: this is a duplicate manifestation of BUG-FR06-001 at the lower ID boundary; root cause is the same absent category field.**
**Severity:** Serious
**Priority:** Medium
**Status:** New
**Reported By:** Gemini QA Agent + Thái Minh Huy
**Assign To:** Development Team

### Steps to Reproduce

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

**GitHub Issue:** _(HITL must file and link: https://github.com/[repo]/issues/[N] — may reference same issue as BUG-FR06-001)_
**Linked Test Case:** TC-FR06-BV-001
**Attachments:** _(HITL attaches screenshot)_

---

## Bug Report: BUG-FR06-017

**Date:** 2026-06-13
**Function Name:** FR-06 Product Detail View — Product Information Display (BVA: id=2, LB+1)
**Problem Summary:** The product detail page for `id=2` (one above the lower boundary) also does not display the category name field — confirming the category omission defect is not isolated to id=1 and affects the product detail page globally (Expected: category name is displayed for all valid product IDs). **Note: duplicate manifestation of BUG-FR06-001; same root cause.**
**Severity:** Serious
**Priority:** Medium
**Status:** New
**Reported By:** Gemini QA Agent + Thái Minh Huy
**Assign To:** Development Team

### Steps to Reproduce

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

**GitHub Issue:** _(HITL must file and link: https://github.com/[repo]/issues/[N] — may reference same issue as BUG-FR06-001)_
**Linked Test Case:** TC-FR06-BV-002
**Attachments:** _(HITL attaches screenshot)_

---

## Bug Report: BUG-FR06-018

**Date:** 2026-06-13
**Function Name:** FR-06 Product Detail View — API Cart Price Validation (BVA: Price LB = 1₫)
**Problem Summary:** The `POST /api/cart` API accepts a client-supplied `price=1` (the price lower boundary) for a product whose actual database price is ₫30,000,000, confirming that the backend performs no server-side price validation against the database at any price value — including the boundary minimum (Expected: API fetches authoritative price from DB; price=1 sent by client is rejected or overridden when it doesn't match the DB price).
**Severity:** Fatal
**Priority:** Immediate
**Status:** New
**Reported By:** Gemini QA Agent + Thái Minh Huy
**Assign To:** Development Team

### Steps to Reproduce

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

**GitHub Issue:** _(HITL must file and link: https://github.com/[repo]/issues/[N] — may reference same issue as BUG-FR06-015)_
**Linked Test Case:** TC-FR06-BV-006
**Attachments:** _(HITL attaches Postman screenshots)_

---

## Bug Report: BUG-FR06-019

**Date:** 2026-06-13
**Function Name:** FR-06 Product Detail View — API Cart Quantity Validation (BVA: Quantity LB-1 = -1)
**Problem Summary:** The `POST /api/cart` API accepts a `quantity=-1` (one below the specification lower boundary of 1) without rejection, confirming that the API has no server-side lower-boundary enforcement for the quantity field (Expected: API rejects quantity=-1 with HTTP 400).
**Severity:** Serious
**Priority:** Immediate
**Status:** New
**Reported By:** Gemini QA Agent + Thái Minh Huy
**Assign To:** Development Team

### Steps to Reproduce

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
     "price": 1,
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

**GitHub Issue:** _(HITL must file and link: https://github.com/[repo]/issues/[N])_
**Linked Test Case:** TC-FR06-BV-007
**Attachments:** _(HITL attaches Postman screenshot showing 2xx response and GET /api/cart confirming quantity=-1)_

---

## Bug Report: BUG-FR06-020

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

**GitHub Issue:** _(HITL must file and link: https://github.com/[repo]/issues/[N])_
**Linked Test Case:** TC-FR06-BV-008
**Attachments:** _(HITL attaches Postman screenshot showing 2xx response, GET /api/cart response, and cart page total screenshot)_

---

*End of Bug Reports — FR-06 Product Detail View (BUG-FR06-001 to BUG-FR06-020)*
*Generated by Gemini QA Agent — 2026-06-13 | Reviewed by: Thái Minh Huy (HITL)*
