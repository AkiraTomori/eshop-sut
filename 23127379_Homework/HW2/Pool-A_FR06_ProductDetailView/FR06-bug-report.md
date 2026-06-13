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
**Priority:** _(set by HITL/PM)_
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
**Priority:** _(set by HITL/PM)_
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
**Priority:** _(set by HITL/PM)_
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
**Priority:** _(set by HITL/PM)_
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
**Priority:** _(set by HITL/PM)_
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
**Priority:** _(set by HITL/PM)_
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
**Priority:** _(set by HITL/PM)_
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
**Priority:** _(set by HITL/PM)_
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
**Priority:** _(set by HITL/PM)_
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
**Priority:** _(set by HITL/PM)_
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

*End of Bug Reports — FR-06 Product Detail View (BUG-FR06-001 to BUG-FR06-010)*
*Generated by Gemini QA Agent — 2026-06-13 | Reviewed by: Thái Minh Huy (HITL)*
