# Bug Reports — FR-15: Product Management (CRUD) — Web Admin
**Pool:** C — FR-15 Product Management
**Test Cycle:** HW02 Domain Testing
**Date:** 2026-06-16
**Reported By:** Gemini QA Agent + HITL (Thái Minh Huy)
**Total Bugs Filed:** 17

> **Note (P-09 compliance):** GitHub Issue links must be filled in by HITL after filing issues in the project repository. Every `GitHub Issue` field below is a placeholder that must be completed before this report is considered finalized.

---

## Bug Report: BUG-FR15-001

**Date:** 2026-06-16
**Function Name:** FR-15 Product Management — Create Product (Price Validation)
**Problem Summary:** The Create Product API accepts `price = 0` and creates a product successfully (HTTP 200 OK), violating the specification requirement that price must be a positive integer greater than zero.
**Severity:** Serious
**Priority:** Serious
**Status:** New
**Reported By:** Gemini QA Agent + HITL (Thái Minh Huy)
**Assign To:** Development Team

### Steps to Reproduce

**Pre-conditions:**
- Backend API is running at `http://localhost:3000`
- Valid admin JWT with `role = 'admin'` is available

**Steps:**
1. Open Postman
2. Send `POST /api/products` with `Authorization: Bearer [admin_JWT]`
3. Set request body: `{ "name": "Zero Price Product", "price": 0, "category_id": 1 }`
4. Click Send and observe the HTTP response code and response body
5. Check the product list to confirm whether a product was created

**Expected Result:**
The API returns HTTP 400 Bad Request with an error message indicating that price must be a positive integer greater than zero. No product is created.

**Actual Result:**
The API returns HTTP 200 OK (or 201 Created). No error message is returned. A product with `price = 0` is created and appears in the product list.

**Environment:**
- OS: macOS
- Browser: N/A (API-level test via Postman)
- App URL: `http://localhost:3000`
- Test Data: `name = "Zero Price Product"`, `price = 0`, `category_id = 1`

**GitHub Issue:** https://github.com/AkiraTomori/eshop-sut/issues/42
**Linked Test Case:** TC-FR15-NEG-009

---

## Bug Report: BUG-FR15-002

**Date:** 2026-06-16
**Function Name:** FR-15 Product Management — Create Product (Price Validation)
**Problem Summary:** The Create Product API accepts a negative price (`price = -1`) and creates a product successfully, violating the specification that price must be a positive integer (greater than zero).
**Severity:** Serious
**Priority:** Immediate
**Status:** New
**Reported By:** Gemini QA Agent + HITL (Thái Minh Huy)
**Assign To:** Development Team

### Steps to Reproduce

**Pre-conditions:**
- Backend API is running at `http://localhost:3000`
- Valid admin JWT with `role = 'admin'` is available

**Steps:**
1. Open Postman
2. Send `POST /api/products` with `Authorization: Bearer [admin_JWT]`
3. Set request body: `{ "name": "Negative Price Product", "price": -1, "category_id": 1 }`
4. Click Send and observe the HTTP response
5. Check the product list to confirm whether a product was created

**Expected Result:**
The API returns HTTP 400 Bad Request with an error message indicating that price must be a positive integer. No product is created.

**Actual Result:**
The API returns HTTP 200 OK (or 201 Created). No error message is returned. A product with `price = -1` is created and stored in the database. No error message is displayed in the UI.

**Environment:**
- OS: macOS
- Browser: N/A (API-level test via Postman) / Web Admin at `http://localhost:5174`
- App URL: `http://localhost:3000`
- Test Data: `name = "Negative Price Product"`, `price = -1`, `category_id = 1`

**GitHub Issue:** https://github.com/AkiraTomori/eshop-sut/issues/43
**Linked Test Case:** TC-FR15-NEG-010

---

## Bug Report: BUG-FR15-003

**Date:** 2026-06-16
**Function Name:** FR-15 Product Management — Create Product (Price Validation)
**Problem Summary:** The Create Product API accepts a floating-point price value (`price = 99.5`) and creates a product successfully, violating the integer-only constraint for Vietnamese ₫ currency (AMB-03, RESOLVED-02).
**Severity:** Serious
**Priority:** Serious
**Status:** New
**Reported By:** Gemini QA Agent + HITL (Thái Minh Huy)
**Assign To:** Development Team

### Steps to Reproduce

**Pre-conditions:**
- Backend API is running at `http://localhost:3000`
- Valid admin JWT with `role = 'admin'` is available

**Steps:**
1. Open Postman
2. Send `POST /api/products` with `Authorization: Bearer [admin_JWT]`
3. Set request body: `{ "name": "Float Price Product", "price": 99.5, "category_id": 1 }`
4. Click Send and observe the HTTP response
5. Check the database / product list for the created product and its stored price value

**Expected Result:**
The API returns HTTP 400 Bad Request with an error message indicating that price must be a positive integer. No product is created with a float price.

**Actual Result:**
The API returns HTTP 200 OK (or 201 Created). No error message is returned. A product with `price = 99.5` is created in the database. The float price is persisted.

**Environment:**
- OS: macOS
- Browser: N/A (API-level test via Postman)
- App URL: `http://localhost:3000`
- Test Data: `name = "Float Price Product"`, `price = 99.5`, `category_id = 1`

**GitHub Issue:** https://github.com/AkiraTomori/eshop-sut/issues/44
**Linked Test Case:** TC-FR15-NEG-011

---

## Bug Report: BUG-FR15-004

**Date:** 2026-06-16
**Function Name:** FR-15 Product Management — Create Product (Price Validation)
**Problem Summary:** The Create Product API accepts a non-numeric string as the price field (`price = "abc"`) and creates a product, violating the type constraint that price must be a valid numeric integer.
**Severity:** Serious
**Priority:** Immediate
**Status:** New
**Reported By:** Gemini QA Agent + HITL (Thái Minh Huy)
**Assign To:** Development Team

### Steps to Reproduce

**Pre-conditions:**
- Backend API is running at `http://localhost:3000`
- Valid admin JWT with `role = 'admin'` is available

**Steps:**
1. Open Postman
2. Send `POST /api/products` with `Authorization: Bearer [admin_JWT]`
3. Set request body: `{ "name": "Test Product", "price": "abc", "category_id": 1 }`
4. Click Send and observe the HTTP response and body
5. Check whether a product was created in the system

**Expected Result:**
The API returns HTTP 400 Bad Request with an error message indicating that price must be a valid numeric value. No product is created.

**Actual Result:**
The API returns HTTP 200 OK (or 201 Created). No error message is returned. A product with a non-numeric string price is still created in the database.

**Environment:**
- OS: macOS
- Browser: N/A (API-level test via Postman)
- App URL: `http://localhost:3000`
- Test Data: `name = "Test Product"`, `price = "abc"` (string), `category_id = 1`

**GitHub Issue:** https://github.com/AkiraTomori/eshop-sut/issues/45
**Linked Test Case:** TC-FR15-NEG-012

---

## Bug Report: BUG-FR15-005

**Date:** 2026-06-16
**Function Name:** FR-15 Product Management — Create Product (Price Validation)
**Problem Summary:** The Create Product API accepts a request body with the `price` field completely omitted and creates a product, violating the specification that price is a mandatory field.
**Severity:** Serious
**Priority:** Immediate
**Status:** New
**Reported By:** Gemini QA Agent + HITL (Thái Minh Huy)
**Assign To:** Development Team

### Steps to Reproduce

**Pre-conditions:**
- Backend API is running at `http://localhost:3000`
- Valid admin JWT with `role = 'admin'` is available

**Steps:**
1. Open Postman
2. Send `POST /api/products` with `Authorization: Bearer [admin_JWT]`
3. Set request body with the price key entirely absent: `{ "name": "No Price Product", "category_id": 1 }`
4. Click Send and observe the HTTP response
5. Check whether a product was created

**Expected Result:**
The API returns HTTP 400 Bad Request with an error message indicating that price is a required field. No product is created.

**Actual Result:**
The API returns HTTP 200 OK (or 201 Created). No error message is returned. A product is created in the database despite the missing mandatory price field.

**Environment:**
- OS: macOS
- Browser: N/A (API-level test via Postman)
- App URL: `http://localhost:3000`
- Test Data: `name = "No Price Product"`, price field: **absent**, `category_id = 1`

**GitHub Issue:** https://github.com/AkiraTomori/eshop-sut/issues/46
**Linked Test Case:** TC-FR15-NEG-013

---

## Bug Report: BUG-FR15-006

**Date:** 2026-06-16
**Function Name:** FR-15 Product Management — Create Product (Description Validation)
**Problem Summary:** The Create Product API accepts a description of 1001 characters and creates a product, violating the application-layer 1000-character safety limit (AMB-01, RESOLVED-04). The oversized description is stored in the SQLite database without rejection.
**Severity:** Serious
**Priority:** Serious
**Status:** New
**Reported By:** Gemini QA Agent + HITL (Thái Minh Huy)
**Assign To:** Development Team

### Steps to Reproduce

**Pre-conditions:**
- Backend API is running at `http://localhost:3000`
- Valid admin JWT with `role = 'admin'` is available

**Steps:**
1. Open Postman
2. Send `POST /api/products` with `Authorization: Bearer [admin_JWT]`
3. Set request body: `{ "name": "Long Desc Product", "price": 100000, "description": "C" × 1001 (1001-character string), "category_id": 1 }`
4. Click Send and observe the HTTP response
5. Verify in the database whether the product was created and what the stored description length is

**Expected Result:**
The API returns HTTP 400 Bad Request with an error message indicating that the description exceeds the maximum allowed length of 1000 characters. No product is created.

**Actual Result:**
The API returns HTTP 200 OK (or 201 Created). No error message is returned. A product is created with the 1001-character description stored intact in the database.

**Environment:**
- OS: macOS
- Browser: N/A (API-level test via Postman)
- App URL: `http://localhost:3000`
- Test Data: `name = "Long Desc Product"`, `price = 100000`, `description = "C" × 1001`, `category_id = 1`

**GitHub Issue:** https://github.com/AkiraTomori/eshop-sut/issues/47
**Linked Test Case:** TC-FR15-NEG-014

---

## Bug Report: BUG-FR15-007

**Date:** 2026-06-16
**Function Name:** FR-15 Product Management — Create Product (Image URL Validation)
**Problem Summary:** The Create Product API accepts an image URL using the insecure `http://` protocol and creates a product, violating the specification requirement that imageUrl must begin with `https://` (AMB-02, RESOLVED-03).
**Severity:** Medium
**Priority:** Medium
**Status:** New
**Reported By:** Gemini QA Agent + HITL (Thái Minh Huy)
**Assign To:** Development Team

### Steps to Reproduce

**Pre-conditions:**
- Backend API is running at `http://localhost:3000`
- Valid admin JWT with `role = 'admin'` is available

**Steps:**
1. Open Postman
2. Send `POST /api/products` with `Authorization: Bearer [admin_JWT]`
3. Set request body: `{ "name": "HTTP URL Product", "price": 100000, "imageUrl": "http://example.com/img.jpg", "category_id": 1 }`
4. Click Send and observe the HTTP response
5. Check whether a product was created with the insecure image URL

**Expected Result:**
The API returns HTTP 400 Bad Request with an error message indicating that the image URL must begin with `https://`. No product is created with an insecure image URL.

**Actual Result:**
The API returns HTTP 200 OK. No error message is returned. A product is created with `imageUrl = "http://example.com/img.jpg"` stored in the database.

**Environment:**
- OS: macOS
- Browser: N/A (API-level test via Postman)
- App URL: `http://localhost:3000`
- Test Data: `name = "HTTP URL Product"`, `price = 100000`, `imageUrl = "http://example.com/img.jpg"`, `category_id = 1`

**GitHub Issue:** https://github.com/AkiraTomori/eshop-sut/issues/48
**Linked Test Case:** TC-FR15-NEG-016

---

## Bug Report: BUG-FR15-008

**Date:** 2026-06-16
**Function Name:** FR-15 Product Management — Create Product (Image URL Validation)
**Problem Summary:** The Create Product API accepts a completely malformed non-URL string as the `imageUrl` value (`"notavalidurl"`) and creates a product, violating the requirement that imageUrl must be a valid URL beginning with `https://`.
**Severity:** Medium
**Priority:** Medium
**Status:** New
**Reported By:** Gemini QA Agent + HITL (Thái Minh Huy)
**Assign To:** Development Team

### Steps to Reproduce

**Pre-conditions:**
- Backend API is running at `http://localhost:3000`
- Valid admin JWT with `role = 'admin'` is available

**Steps:**
1. Open Postman
2. Send `POST /api/products` with `Authorization: Bearer [admin_JWT]`
3. Set request body: `{ "name": "Malformed URL Product", "price": 100000, "imageUrl": "notavalidurl", "category_id": 1 }`
4. Click Send and observe the HTTP response
5. Check whether a product was created with the malformed image URL

**Expected Result:**
The API returns HTTP 400 Bad Request with an error message indicating that imageUrl must be a valid URL beginning with `https://`. No product is created.

**Actual Result:**
The API returns HTTP 200 OK. No error message is returned. A product is created with `imageUrl = "notavalidurl"` stored in the database.

**Environment:**
- OS: macOS
- Browser: N/A (API-level test via Postman)
- App URL: `http://localhost:3000`
- Test Data: `name = "Malformed URL Product"`, `price = 100000`, `imageUrl = "notavalidurl"`, `category_id = 1`

**GitHub Issue:** https://github.com/AkiraTomori/eshop-sut/issues/49
**Linked Test Case:** TC-FR15-NEG-017

---

## Bug Report: BUG-FR15-009

**Date:** 2026-06-16
**Function Name:** FR-15 Product Management — Create Product (Category Validation)
**Problem Summary:** The Create Product API accepts a `category_id` that references a non-existent category (`category_id = 99999`) and creates a product with an orphaned category reference, violating the requirement that category_id must reference an existing database record.
**Severity:** Serious
**Priority:** Serious
**Status:** New
**Reported By:** Gemini QA Agent + HITL (Thái Minh Huy)
**Assign To:** Development Team

### Steps to Reproduce

**Pre-conditions:**
- Backend API is running at `http://localhost:3000`
- Valid admin JWT with `role = 'admin'` is available
- Category ID `99999` does not exist in the database (confirmed before test)

**Steps:**
1. Open Postman
2. Send `POST /api/products` with `Authorization: Bearer [admin_JWT]`
3. Set request body: `{ "name": "Orphan Category Product", "price": 100000, "category_id": 99999 }`
4. Click Send and observe the HTTP response
5. Check whether a product was created with the non-existent category reference

**Expected Result:**
The API returns HTTP 400 Bad Request with an error message indicating that the selected category does not exist. No product is created with an orphaned category reference.

**Actual Result:**
The API returns HTTP 200 OK. No error message is returned. A product is created in the database with `category_id = 99999`, which does not reference any existing category record. This constitutes a data integrity violation (orphaned foreign key reference).

**Environment:**
- OS: macOS
- Browser: N/A (API-level test via Postman)
- App URL: `http://localhost:3000`
- Test Data: `name = "Orphan Category Product"`, `price = 100000`, `category_id = 99999` (non-existent)

**GitHub Issue:** https://github.com/AkiraTomori/eshop-sut/issues/50
**Linked Test Case:** TC-FR15-NEG-019

---

## Bug Report: BUG-FR15-010

**Date:** 2026-06-16
**Function Name:** FR-15 Product Management — Create Product (Category Validation)
**Problem Summary:** The Create Product API accepts a non-integer string as `category_id` (e.g., `"electronics"`) and creates a product, violating the type constraint that category_id must be a valid integer (AMB-04).
**Severity:** Serious
**Priority:** Serious
**Status:** New
**Reported By:** Gemini QA Agent + HITL (Thái Minh Huy)
**Assign To:** Development Team

### Steps to Reproduce

**Pre-conditions:**
- Backend API is running at `http://localhost:3000`
- Valid admin JWT with `role = 'admin'` is available

**Steps:**
1. Open Postman
2. Send `POST /api/products` with `Authorization: Bearer [admin_JWT]`
3. Set request body: `{ "name": "Wrong Category Type Product", "price": 100000, "category_id": "electronics" }`
4. Click Send and observe the HTTP response
5. Check whether a product was created

**Expected Result:**
The API returns HTTP 400 Bad Request with an error message indicating that category_id must be a valid integer. No product is created.

**Actual Result:**
The API returns HTTP 200 OK (or 201 Created). No error message is returned. A product is created in the database with a non-integer category_id value.

**Environment:**
- OS: macOS
- Browser: N/A (API-level test via Postman)
- App URL: `http://localhost:3000`
- Test Data: `name = "Wrong Category Type Product"`, `price = 100000`, `category_id = "electronics"` (string)

**GitHub Issue:** https://github.com/AkiraTomori/eshop-sut/issues/51
**Linked Test Case:** TC-FR15-NEG-020

---

## Bug Report: BUG-FR15-011

**Date:** 2026-06-16
**Function Name:** FR-15 Product Management — Edit Product (Product ID Validation)
**Problem Summary:** The Edit Product API (`PUT /api/products/99999`) returns HTTP 200 OK when the product ID in the path does not exist, instead of returning HTTP 404 Not Found. No data is modified but the response code is incorrect, masking the error condition.
**Severity:** Serious
**Priority:** Serious
**Status:** New
**Reported By:** Gemini QA Agent + HITL (Thái Minh Huy)
**Assign To:** Development Team

### Steps to Reproduce

**Pre-conditions:**
- Backend API is running at `http://localhost:3000`
- Valid admin JWT with `role = 'admin'` is available
- Product ID `99999` does not exist in the database

**Steps:**
1. Open Postman
2. Send `PUT /api/products/99999` with `Authorization: Bearer [admin_JWT]`
3. Set request body: `{ "name": "Ghost Product", "price": 100000, "category_id": 1 }`
4. Click Send and observe the HTTP response code and body

**Expected Result:**
The API returns HTTP 404 Not Found with an error message such as "Product not found". No existing product is modified.

**Actual Result:**
The API returns HTTP 200 OK. No error message is returned. No existing product is modified, but the incorrect 200 status code makes it appear the operation succeeded on a valid resource.

**Environment:**
- OS: macOS
- Browser: N/A (API-level test via Postman)
- App URL: `http://localhost:3000`
- Test Data: Path: `/api/products/99999` (non-existent product ID), body: `{ "name": "Ghost Product", "price": 100000, "category_id": 1 }`

**GitHub Issue:** https://github.com/AkiraTomori/eshop-sut/issues/52
**Linked Test Case:** TC-FR15-NEG-021

---

## Bug Report: BUG-FR15-012

**Date:** 2026-06-16
**Function Name:** FR-15 Product Management — Delete Product (Product ID Type Validation)
**Problem Summary:** The Delete Product API (`DELETE /api/products/abc`) returns HTTP 200 OK when the product ID path parameter is a non-integer string (`"abc"`), instead of returning HTTP 400 Bad Request for an invalid path parameter type.
**Severity:** Medium
**Priority:** Medium
**Status:** New
**Reported By:** Gemini QA Agent + HITL (Thái Minh Huy)
**Assign To:** Development Team

### Steps to Reproduce

**Pre-conditions:**
- Backend API is running at `http://localhost:3000`
- Valid admin JWT with `role = 'admin'` is available

**Steps:**
1. Open Postman
2. Send `DELETE /api/products/abc` with `Authorization: Bearer [admin_JWT]`
3. Click Send and observe the HTTP response code and body

**Expected Result:**
The API returns HTTP 400 Bad Request with an error message indicating that the product ID must be a valid integer. No product is deleted.

**Actual Result:**
The API returns HTTP 200 OK. No error message is returned indicating the invalid path parameter type. No product is deleted, but the incorrect 200 status code does not communicate the error condition to the caller.

**Environment:**
- OS: macOS
- Browser: N/A (API-level test via Postman)
- App URL: `http://localhost:3000`
- Test Data: Path: `/api/products/abc` (non-integer string as product ID)

**GitHub Issue:** https://github.com/AkiraTomori/eshop-sut/issues/53
**Linked Test Case:** TC-FR15-NEG-022

---

## Bug Report: BUG-FR15-013

**Date:** 2026-06-16
**Function Name:** FR-15 Product Management — Product Form GUI Compliance (FR-22)
**Problem Summary:** The product creation form does not display a required field indicator (`*`) adjacent to any mandatory field label (Product Name, Price, Category), violating the FR-22 requirement that all mandatory fields must be visually marked with an asterisk.
**Severity:** Medium
**Priority:** Medium
**Status:** New
**Reported By:** Gemini QA Agent + HITL (Thái Minh Huy)
**Assign To:** Development Team

### Steps to Reproduce

**Pre-conditions:**
- Web Admin is running at `http://localhost:5174`
- Admin is logged in with valid JWT (`role = 'admin'`)

**Steps:**
1. Navigate to the product creation form at `http://localhost:5174`
2. Inspect the labels of the mandatory fields: Product Name, Price, Category
3. Look for the presence of a `*` symbol adjacent to each mandatory field label
4. Use browser developer tools to confirm the DOM does not contain the `*` indicator in the label elements

**Expected Result:**
Each mandatory field label (Product Name, Price, Category) displays a `*` symbol adjacent to the label text, as required by FR-22. DOM inspection confirms the `*` is present in the markup.

**Actual Result:**
None of the mandatory field labels (Product Name, Price, Category) display the required `*` symbol. The form does not provide any visual indication of which fields are mandatory, violating FR-22.

**Environment:**
- OS: macOS
- Browser: Chrome (latest)
- App URL: `http://localhost:5174`
- Test Data: Visual + DOM inspection only

**GitHub Issue:** https://github.com/AkiraTomori/eshop-sut/issues/54
**Linked Test Case:** TC-FR15-NEG-024

---

## Bug Report: BUG-FR15-014

**Date:** 2026-06-16
**Function Name:** FR-15 Product Management — Product Form GUI Compliance (FR-22)
**Problem Summary:** Validation error messages on the product creation form appear below the individual field labels (e.g., below the Name field) rather than above the Submit button, violating the FR-22 requirement that all validation errors must appear above the Submit button.
**Severity:** Medium
**Priority:** Medium
**Status:** New
**Reported By:** Gemini QA Agent + HITL (Thái Minh Huy)
**Assign To:** Development Team

### Steps to Reproduce

**Pre-conditions:**
- Web Admin is running at `http://localhost:5174`
- Admin is logged in with valid JWT (`role = 'admin'`)
- Product creation form is open

**Steps:**
1. Navigate to the product creation form at `http://localhost:5174`
2. Leave all required fields empty (do not enter any values)
3. Click the Submit / Save button
4. Observe the position of the displayed validation error messages relative to the Submit button

**Expected Result:**
All validation error messages appear in the UI area **above** the Submit button, consistent with FR-22. The Submit button is still visible below the error messages.

**Actual Result:**
A validation error message appears below the Name field label, not above the Submit button. Other mandatory fields (Price, Category) do not display error messages at all. The error placement does not conform to the FR-22 specification.

**Environment:**
- OS: macOS
- Browser: Chrome (latest)
- App URL: `http://localhost:5174`
- Test Data: Empty form submission (all fields blank)

**GitHub Issue:** https://github.com/AkiraTomori/eshop-sut/issues/55
**Linked Test Case:** TC-FR15-NEG-025

---

## Bug Report: BUG-FR15-015

**Date:** 2026-06-16
**Function Name:** FR-15 Product Management — Product Form GUI Compliance (FR-21)
**Problem Summary:** The Submit / Save button on the product creation form uses a green background colour instead of the blue colour required by FR-21, which specifies that submission/positive-action buttons must be blue.
**Severity:** Medium
**Priority:** Medium
**Status:** New
**Reported By:** Gemini QA Agent + HITL (Thái Minh Huy)
**Assign To:** Development Team

### Steps to Reproduce

**Pre-conditions:**
- Web Admin is running at `http://localhost:5174`
- Admin is logged in with valid JWT (`role = 'admin'`)

**Steps:**
1. Navigate to the product creation form at `http://localhost:5174`
2. Locate the Submit / Save button at the bottom of the form
3. Observe the background colour of the button
4. Use browser developer tools to inspect the computed CSS background-color property of the Submit button

**Expected Result:**
The Submit / Save button uses a blue background colour, consistent with FR-21 colour coding for positive/submission actions.

**Actual Result:**
The Submit / Save button uses a green background colour. The button does not conform to the FR-21 specification requiring blue for submission actions.

**Environment:**
- OS: macOS
- Browser: Chrome (latest)
- App URL: `http://localhost:5174`
- Test Data: Visual inspection of product creation form

**GitHub Issue:** https://github.com/AkiraTomori/eshop-sut/issues/56
**Linked Test Case:** TC-FR15-NEG-026

---

## Bug Report: BUG-FR15-016

**Date:** 2026-06-16
**Function Name:** FR-15 Product Management — Product Management Page GUI Compliance (FR-21)
**Problem Summary:** The product management page contains zero `<h1>` elements in the DOM, violating the FR-21 requirement that each page must have exactly one `<h1>` heading tag.
**Severity:** Medium
**Priority:** Medium
**Status:** New
**Reported By:** Gemini QA Agent + HITL (Thái Minh Huy)
**Assign To:** Development Team

### Steps to Reproduce

**Pre-conditions:**
- Web Admin is running at `http://localhost:5174`
- Admin is logged in with valid JWT (`role = 'admin'`)

**Steps:**
1. Navigate to the product management list page at `http://localhost:5174`
2. Open browser developer tools (F12)
3. In the browser console, execute: `document.querySelectorAll('h1').length`
4. Observe the returned count

**Expected Result:**
`document.querySelectorAll('h1').length` returns exactly `1`. A single `<h1>` tag is present on the page with a descriptive page title.

**Actual Result:**
`document.querySelectorAll('h1').length` returns `0`. No `<h1>` element exists on the product management page. This violates FR-21 and also impacts accessibility and SEO.

**Environment:**
- OS: macOS
- Browser: Chrome (latest)
- App URL: `http://localhost:5174`
- Test Data: DOM inspection via browser console

**GitHub Issue:** https://github.com/AkiraTomori/eshop-sut/issues/57
**Linked Test Case:** TC-FR15-NEG-027

---

## Bug Report: BUG-FR15-017

**Date:** 2026-06-16
**Function Name:** FR-15 Product Management — Delete Product (Confirmation Dialog)
**Problem Summary:** Clicking the Delete button on the product management list immediately deletes the product without displaying a confirmation dialog, violating the FR-21 / AMB-06 requirement that a confirmation dialog must appear before any deletion is executed.
**Severity:** Serious
**Priority:** Serious
**Status:** New
**Reported By:** Gemini QA Agent + HITL (Thái Minh Huy)
**Assign To:** Development Team

### Steps to Reproduce

**Pre-conditions:**
- Web Admin is running at `http://localhost:5174`
- Admin is logged in with valid JWT (`role = 'admin'`)
- At least one product exists in the product list

**Steps:**
1. Navigate to the product management list page at `http://localhost:5174`
2. Locate any existing product in the list
3. Click the Delete button for that product
4. Immediately observe whether a confirmation dialog appears before the product is removed

**Expected Result:**
Immediately after clicking the Delete button, a confirmation dialog appears asking the admin to confirm the deletion (e.g., "Are you sure you want to delete this product?"). The product remains in the list while the dialog is displayed. The dialog provides a Confirm/Yes and a Cancel/No option.

**Actual Result:**
After clicking the Delete button, no confirmation dialog appears. The product is immediately deleted from the list without any confirmation step. This creates a risk of accidental, irreversible data deletion by admin users.

**Environment:**
- OS: macOS
- Browser: Chrome (latest)
- App URL: `http://localhost:5174`
- Test Data: Any existing product in the product management list

**GitHub Issue:** https://github.com/AkiraTomori/eshop-sut/issues/58
**Linked Test Case:** TC-FR15-NEG-029

---

## Bug Summary Table

| Bug ID | Linked TC | Severity | Feature Area | Problem Summary (Short) |
|--------|-----------|----------|-------------|------------------------|
| BUG-FR15-001 | TC-FR15-NEG-009 | Serious | Price Validation | API accepts `price = 0` and creates product |
| BUG-FR15-002 | TC-FR15-NEG-010 | Serious | Price Validation | API accepts negative price (`price = -1`) and creates product |
| BUG-FR15-003 | TC-FR15-NEG-011 | Serious | Price Validation | API accepts float price (`99.5`) and creates product |
| BUG-FR15-004 | TC-FR15-NEG-012 | Serious | Price Validation | API accepts non-numeric string price and creates product |
| BUG-FR15-005 | TC-FR15-NEG-013 | Serious | Price Validation | API creates product when price field is completely omitted |
| BUG-FR15-006 | TC-FR15-NEG-014 | Serious | Description Validation | API accepts 1001-char description and creates product (HVF-03) |
| BUG-FR15-007 | TC-FR15-NEG-016 | Medium | ImageUrl Validation | API accepts `http://` imageUrl (insecure protocol) |
| BUG-FR15-008 | TC-FR15-NEG-017 | Medium | ImageUrl Validation | API accepts completely malformed non-URL imageUrl |
| BUG-FR15-009 | TC-FR15-NEG-019 | Serious | Category Validation | API creates product with non-existent `category_id` (data integrity) |
| BUG-FR15-010 | TC-FR15-NEG-020 | Serious | Category Validation | API accepts non-integer string as `category_id` |
| BUG-FR15-011 | TC-FR15-NEG-021 | Serious | Product ID Validation | Edit API returns HTTP 200 for non-existent product ID (should be 404) |
| BUG-FR15-012 | TC-FR15-NEG-022 | Medium | Product ID Validation | Delete API returns HTTP 200 for non-integer path param (should be 400) |
| BUG-FR15-013 | TC-FR15-NEG-024 | Medium | GUI Compliance FR-22 | No `*` indicator on mandatory fields (Name, Price, Category) |
| BUG-FR15-014 | TC-FR15-NEG-025 | Medium | GUI Compliance FR-22 | Validation errors appear below field label, not above Submit button |
| BUG-FR15-015 | TC-FR15-NEG-026 | Medium | GUI Compliance FR-21 | Submit button is green, not blue as required by FR-21 |
| BUG-FR15-016 | TC-FR15-NEG-027 | Medium | GUI Compliance FR-21 | Product management page has zero `<h1>` elements (should be exactly 1) |
| BUG-FR15-017 | TC-FR15-NEG-029 | Serious | Delete Confirmation | No confirmation dialog before product deletion — immediate delete |

---

### Self-Audit (AGENTS.md §7 + Phase 5 Skill Step A6)

```
✅ 17 unique Bug IDs assigned — format BUG-FR15-001 to BUG-FR15-017
✅ One defect per report (TR-BP-02 compliant)
✅ Each problem summary follows: [Objective] + [Actual Result] vs. [Expected Result]
✅ All steps to reproduce are numbered with exact input values
✅ Preconditions stated for every report
✅ Expected results cited from SRS (FR-15, FR-21, FR-22, AMB-01, AMB-02, AMB-03, AMB-04)
✅ Actual results are specific and factual (no vague language)
✅ Environment specified for each report (macOS, Chrome, localhost URLs)
✅ Severity assigned by QA (not Priority — left for HITL/PM)
✅ GitHub Issue placeholder present in every report (P-09 compliance)
✅ Language is professional and non-judgmental throughout
✅ Attachments placeholder present — HITL to fill with screenshots/recordings
```
