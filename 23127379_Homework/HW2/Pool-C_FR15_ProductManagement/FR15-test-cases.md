## Test Cases (EP Phase) — FR-15: Product Management (Product CRUD)
**Date:** 2026-06-15 19:56
**Designer:** Gemini QA Agent (reviewed by: [HITL name])
**Based on:** FR15-domain-analysis.md + FR15-boundary-analysis.md (HITL-Accepted 2026-06-15)
**SRS Version:** 2.0 (2026-05-14)
**Scope of this file:** EP valid test cases (TC-FR15-EP-###) + NEG invalid test cases (TC-FR15-NEG-###)
**Note:** BVA test cases (TC-FR15-BV-###) will be appended in the next session per HITL instruction.

---

## EP Test Cases (Valid — Combining Maximum Valid ECs per TC)

---

### TC-FR15-EP-001

**Test Case ID:** TC-FR15-EP-001
**Title:** Verify that a new product is created successfully when all mandatory and optional fields contain valid data
**Description:** Covers the primary "happy path" for product creation. Combines all key VALID classes simultaneously: valid admin auth, valid name (≤255 chars), valid positive integer price, valid description (≤1000 chars), valid https:// imageUrl, and valid existing category_id. Confirms HTTP 201 response and product appears in list.
**Priority:** High
**Pre-conditions:**
  1. Web Admin is running at `http://localhost:5174`
  2. Admin account `admin@eshop.com` / `Admin123!` is available and unlocked
  3. At least one category exists in the database
  4. Admin is logged in and holds a valid JWT with `role = 'admin'`

**Steps:**
  1. Navigate to the Web Admin product management page
  2. Click the "Add Product" / "Create Product" button
  3. Enter `name = "Laptop Gaming ABC"` in the Product Name field
  4. Enter `price = 15000000` in the Price field
  5. Enter `description = "High performance gaming laptop with RTX 4060"` in the Description field
  6. Enter `imageUrl = "https://example.com/laptop.jpg"` in the Image URL field
  7. Select an existing category from the Category dropdown (e.g., "Electronics")
  8. Click the Submit / Save button
  9. Observe the system response and product list

**Test Data:**
  - Input: `name = "Laptop Gaming ABC"`, `price = 15000000`, `description = "High performance gaming laptop with RTX 4060"`, `imageUrl = "https://example.com/laptop.jpg"`, `category_id = [valid existing ID]`
  - Expected Output: HTTP 201 Created; success notification displayed; new product "Laptop Gaming ABC" visible in product list

**Expected Result:**
  - The API `POST /api/products` returns HTTP 201 Created
  - A success notification (toast or confirmation message) is displayed in the UI
  - The newly created product "Laptop Gaming ABC" with price 15,000,000 ₫ appears in the product list
  - The product list is not disrupted (all previously existing products remain unchanged)

**Observed Result:** _(fill during execution)_
**Status:** Not Run
**EC Coverage:** EC-FR15-001, EC-FR15-005, EC-FR15-007, EC-FR15-012, EC-FR15-019, EC-FR15-023, EC-FR15-026, EC-FR15-050
**Req. Ref:** FR-15, FR-12, SEC-02, SEC-03
**Bug ID:** _(fill if fails)_

**Cleanup:** Delete the created test product "Laptop Gaming ABC" after execution to restore clean state.

---

### TC-FR15-EP-002

**Test Case ID:** TC-FR15-EP-002
**Title:** Verify that a product is created successfully when optional fields (description and imageUrl) are omitted
**Description:** Validates that the system correctly handles a product submission where only mandatory fields are populated and optional fields are left empty/omitted. Confirms that empty description and imageUrl are accepted as valid null values.
**Priority:** High
**Pre-conditions:**
  1. Web Admin is running at `http://localhost:5174`
  2. Admin is logged in with valid JWT (`role = 'admin'`)
  3. At least one category exists in the database

**Steps:**
  1. Navigate to the product creation form
  2. Enter `name = "Basic Product X"` in the Product Name field
  3. Enter `price = 50000` in the Price field
  4. Leave the Description field empty
  5. Leave the Image URL field empty
  6. Select an existing category from the Category dropdown
  7. Click the Submit / Save button
  8. Observe the system response

**Test Data:**
  - Input: `name = "Basic Product X"`, `price = 50000`, `description = ""` (empty/omitted), `imageUrl = ""` (empty/omitted), `category_id = [valid existing ID]`
  - Expected Output: HTTP 201 Created; success notification displayed

**Expected Result:**
  - The API `POST /api/products` returns HTTP 201 Created
  - A success notification is displayed in the UI
  - The product "Basic Product X" with price 50,000 ₫ appears in the product list without a broken image or description error

**Observed Result:** _(fill during execution)_
**Status:** Not Run
**EC Coverage:** EC-FR15-001, EC-FR15-005, EC-FR15-007, EC-FR15-012, EC-FR15-018, EC-FR15-022, EC-FR15-026, EC-FR15-050
**Req. Ref:** FR-15
**Bug ID:** _(fill if fails)_

**Cleanup:** Delete the created test product "Basic Product X" after execution.

---

### TC-FR15-EP-003

**Test Case ID:** TC-FR15-EP-003
**Title:** Verify that an existing product is updated successfully with valid field values and only that product is modified
**Description:** Covers the Edit (PUT) operation happy path. Confirms that a valid admin can update all fields of an existing product, the changes are reflected correctly, and the isolation guarantee holds — no other products are affected.
**Priority:** High
**Pre-conditions:**
  1. Web Admin is running at `http://localhost:5174`
  2. Admin is logged in with valid JWT (`role = 'admin'`)
  3. A test product "Edit Target Product" exists with known original values (e.g., name = "Edit Target Product", price = 100000)
  4. At least one other product exists in the database (to verify isolation)
  5. At least one category exists

**Steps:**
  1. Navigate to the product list in Web Admin
  2. Locate "Edit Target Product" and click the Edit button
  3. Change `name` to `"Updated Product Name"`
  4. Change `price` to `200000`
  5. Change `description` to `"Updated description text"`
  6. Change `imageUrl` to `"https://example.com/updated.jpg"`
  7. Select the same or a different valid category
  8. Click the Submit / Save button
  9. Verify the product detail shows updated values
  10. Verify that at least one other product in the list has not changed its name or price

**Test Data:**
  - Input: `product_id = [existing ID]`, `name = "Updated Product Name"`, `price = 200000`, `description = "Updated description text"`, `imageUrl = "https://example.com/updated.jpg"`, `category_id = [valid existing ID]`
  - Expected Output: HTTP 200 OK; success notification; product shows updated values; other products unchanged

**Expected Result:**
  - The API `PUT /api/products/:id` returns HTTP 200 OK
  - A success notification is displayed in the UI
  - The edited product now displays "Updated Product Name", price 200,000 ₫, with updated description and image
  - All other products in the list retain their original names and prices (isolation guaranteed)

**Observed Result:** _(fill during execution)_
**Status:** Not Run
**EC Coverage:** EC-FR15-001, EC-FR15-005, EC-FR15-007, EC-FR15-012, EC-FR15-019, EC-FR15-023, EC-FR15-026, EC-FR15-030, EC-FR15-051, EC-FR15-066
**Req. Ref:** FR-15
**Bug ID:** _(fill if fails)_

**Cleanup:** Restore the original values of "Edit Target Product" or delete the product after execution.

---

### TC-FR15-EP-004

**Test Case ID:** TC-FR15-EP-004
**Title:** Verify that a product is deleted successfully after the admin confirms the delete confirmation dialog
**Description:** Covers the Delete operation happy path. Confirms that a valid admin sees a confirmation dialog, clicks Confirm, and the product is removed from the list. Verifies the delete confirmation dialog is mandatory (per AMB-06) and that the correct HTTP 200 response is returned.
**Priority:** High
**Pre-conditions:**
  1. Web Admin is running at `http://localhost:5174`
  2. Admin is logged in with valid JWT (`role = 'admin'`)
  3. A test product "Delete Target Product" exists and is visible in the product list

**Steps:**
  1. Navigate to the product list in Web Admin
  2. Locate "Delete Target Product" and click the Delete button
  3. Observe that a delete confirmation dialog appears
  4. Click the Confirm / Yes button in the dialog
  5. Observe the system response and product list

**Test Data:**
  - Input: `product_id = [existing ID of "Delete Target Product"]`; user action: confirm deletion
  - Expected Output: HTTP 200 OK; product removed from list; success notification displayed

**Expected Result:**
  - A delete confirmation dialog appears before any deletion occurs (per AMB-06 / FR-21)
  - After clicking Confirm, the API `DELETE /api/products/:id` returns HTTP 200 OK
  - A success notification is displayed
  - "Delete Target Product" is no longer present in the product list
  - All other products remain unchanged in the list

**Observed Result:** _(fill during execution)_
**Status:** Not Run
**EC Coverage:** EC-FR15-001, EC-FR15-005, EC-FR15-030, EC-FR15-048, EC-FR15-052, EC-FR15-066
**Req. Ref:** FR-15, FR-21
**Bug ID:** _(fill if fails)_

**Cleanup:** No cleanup needed (product was intentionally deleted as the test action).

---

### TC-FR15-EP-005

**Test Case ID:** TC-FR15-EP-005
**Title:** Verify that product deletion is aborted and the product remains when the admin clicks Cancel on the delete confirmation dialog
**Description:** Validates the delete cancellation flow. When the admin clicks Cancel on the confirmation dialog, the delete operation must not execute, the product must remain in the database, and the product list must be unchanged.
**Priority:** Medium
**Pre-conditions:**
  1. Web Admin is running at `http://localhost:5174`
  2. Admin is logged in with valid JWT (`role = 'admin'`)
  3. A product "Cancel Target Product" exists in the product list

**Steps:**
  1. Navigate to the product list in Web Admin
  2. Locate "Cancel Target Product" and click the Delete button
  3. Observe that a delete confirmation dialog appears
  4. Click the Cancel / No button in the dialog
  5. Observe the product list and verify the product is still present

**Test Data:**
  - Input: `product_id = [existing ID of "Cancel Target Product"]`; user action: cancel deletion
  - Expected Output: Dialog closes; product list unchanged; "Cancel Target Product" still present

**Expected Result:**
  - The delete confirmation dialog appears (per AMB-06)
  - After clicking Cancel, no `DELETE /api/products/:id` API call is made
  - The dialog closes
  - "Cancel Target Product" remains visible in the product list with all its original data intact
  - No error or success notification is shown (no operation occurred)

**Observed Result:** _(fill during execution)_
**Status:** Not Run
**EC Coverage:** EC-FR15-001, EC-FR15-005, EC-FR15-030, EC-FR15-048, EC-FR15-067
**Req. Ref:** FR-15, FR-21
**Bug ID:** _(fill if fails)_

---

### TC-FR15-EP-006

**Test Case ID:** TC-FR15-EP-006
**Title:** Verify that the product list page displays all products with correct format when accessed without a search keyword
**Description:** Validates the View/List operation for the admin product list. Confirms that all products are displayed with the correct field layout — Name, Price in ₫ format with thousands separator, Image, and Category. Also verifies a loading state is shown during data fetch and exactly one h1 tag exists on the page.
**Priority:** Medium
**Pre-conditions:**
  1. Web Admin is running at `http://localhost:5174`
  2. Admin is logged in with valid JWT (`role = 'admin'`)
  3. At least one product exists in the database

**Steps:**
  1. Navigate to the product management/list page in Web Admin
  2. Observe the page while it loads (check for loading state)
  3. After loading, inspect the product list display
  4. Verify the price format uses ₫ symbol and thousands separator
  5. Verify the page has exactly one h1 tag

**Test Data:**
  - Input: `GET /api/products` (no search query parameter)
  - Expected Output: All products rendered; price formatted as "15,000,000 ₫"; loading state visible during fetch; exactly 1 `<h1>` tag on page

**Expected Result:**
  - All products in the database are displayed in the product list
  - Each product row shows: Name, Price (formatted with ₫ and thousands separator, e.g., "15,000,000 ₫"), product image (or placeholder), and Category name
  - A loading indicator (spinner or skeleton) is visible while the `GET /api/products` request is in flight
  - The page contains exactly one `<h1>` tag describing the page content (e.g., "Product Management" or equivalent Vietnamese text)

**Observed Result:** _(fill during execution)_
**Status:** Not Run
**EC Coverage:** EC-FR15-001, EC-FR15-005, EC-FR15-033, EC-FR15-044, EC-FR15-053
**Req. Ref:** FR-15, FR-05, FR-21
**Bug ID:** _(fill if fails)_

---

### TC-FR15-EP-007

**Test Case ID:** TC-FR15-EP-007
**Title:** Verify that the product list correctly filters and displays products when a matching search keyword is entered
**Description:** Validates the search functionality on the product list page. A keyword that matches one or more product names should return only those matching products, displayed safely (no HTML rendering).
**Priority:** Medium
**Pre-conditions:**
  1. Web Admin is running at `http://localhost:5174`
  2. Admin is logged in with valid JWT (`role = 'admin'`)
  3. A product named "Wireless Keyboard Pro" exists in the database

**Steps:**
  1. Navigate to the product management list page
  2. Enter `"Wireless"` in the search bar / search field
  3. Submit the search (press Enter or click Search button)
  4. Observe the product list results

**Test Data:**
  - Input: `GET /api/products?search=Wireless`
  - Expected Output: Only products whose names contain "Wireless" are displayed (at minimum "Wireless Keyboard Pro"); other products not shown

**Expected Result:**
  - The product list updates to show only products matching the search keyword "Wireless"
  - At minimum "Wireless Keyboard Pro" is visible in the results
  - Products whose names do not contain "Wireless" are not shown
  - The search keyword "Wireless" is displayed safely in the UI as plain text (no HTML execution)

**Observed Result:** _(fill during execution)_
**Status:** Not Run
**EC Coverage:** EC-FR15-001, EC-FR15-005, EC-FR15-034, EC-FR15-053
**Req. Ref:** FR-15, FR-05
**Bug ID:** _(fill if fails)_

---

### TC-FR15-EP-008

**Test Case ID:** TC-FR15-EP-008
**Title:** Verify that an empty state with a friendly message is displayed when a search keyword returns no product matches
**Description:** Validates the empty state handling when no products match the search keyword. The system should display an appropriate message (and optionally an illustration) rather than a blank or broken page.
**Priority:** Medium
**Pre-conditions:**
  1. Web Admin is running at `http://localhost:5174`
  2. Admin is logged in with valid JWT (`role = 'admin'`)
  3. No product exists with a name containing the string "zzznoproductmatch"

**Steps:**
  1. Navigate to the product management list page
  2. Enter `"zzznoproductmatch"` in the search field
  3. Submit the search
  4. Observe the product list area

**Test Data:**
  - Input: `GET /api/products?search=zzznoproductmatch`
  - Expected Output: Empty product list; an empty state message and/or illustration displayed

**Expected Result:**
  - The product list shows no product rows
  - An empty state message is displayed (e.g., "No products found" or equivalent Vietnamese text)
  - The page does not show an error, blank area, or broken layout

**Observed Result:** _(fill during execution)_
**Status:** Not Run
**EC Coverage:** EC-FR15-001, EC-FR15-005, EC-FR15-035, EC-FR15-053
**Req. Ref:** FR-15, FR-05
**Bug ID:** _(fill if fails)_

---

### TC-FR15-EP-009

**Test Case ID:** TC-FR15-EP-009
**Title:** Verify that the product detail view displays all product fields correctly when accessed by a valid admin
**Description:** Validates the View Product Detail operation. Confirms that all product fields (Name, Price, Description, Image URL, Category) are rendered correctly and completely when accessing a specific product's detail page.
**Priority:** Medium
**Pre-conditions:**
  1. Web Admin is running at `http://localhost:5174`
  2. Admin is logged in with valid JWT (`role = 'admin'`)
  3. A product with known data exists (e.g., name = "Detail View Product", price = 300000, description = "Test description", imageUrl = "https://example.com/img.jpg", category = "Electronics")

**Steps:**
  1. Navigate to the product management list page
  2. Locate "Detail View Product" and click to view its detail
  3. Inspect all displayed fields

**Test Data:**
  - Input: `GET /api/products/:id` (valid product ID)
  - Expected Output: All product fields rendered correctly matching the stored values

**Expected Result:**
  - The product detail page displays:
    - Name: "Detail View Product"
    - Price: "300,000 ₫" (formatted with ₫ symbol and thousands separator)
    - Description: "Test description" (rendered as plain text)
    - Image: the image from "https://example.com/img.jpg" (or alt text if image fails to load)
    - Category: "Electronics"
  - No fields are missing, broken, or displayed incorrectly

**Observed Result:** _(fill during execution)_
**Status:** Not Run
**EC Coverage:** EC-FR15-001, EC-FR15-005, EC-FR15-030, EC-FR15-054
**Req. Ref:** FR-15, FR-06
**Bug ID:** _(fill if fails)_

---

### TC-FR15-EP-010

**Test Case ID:** TC-FR15-EP-010
**Title:** Verify that the product creation form displays required field indicators, correct button colours, and positions errors above the submit button
**Description:** Covers GUI compliance for the product form (FR-21, FR-22). Verifies that all mandatory fields display the `*` indicator, the Submit button is blue, the Delete/Cancel button is red, error messages appear above the submit button, and the Tab key navigates in the correct order.
**Priority:** Medium
**Pre-conditions:**
  1. Web Admin is running at `http://localhost:5174`
  2. Admin is logged in with valid JWT (`role = 'admin'`)
  3. Product creation form is accessible

**Steps:**
  1. Navigate to the product creation form
  2. Inspect all mandatory field labels (Name, Price, Category) for the `*` indicator
  3. Inspect the Submit / Save button and verify it uses a blue colour
  4. Submit the form with all fields empty to trigger validation errors
  5. Inspect the position of the error messages relative to the Submit button
  6. Press Tab key sequentially from the first field and observe focus order

**Test Data:**
  - Input: Empty form submission (to trigger errors), visual inspection of form elements
  - Expected Output: `*` on Name, Price, Category labels; blue Submit button; red Delete/Dangerous button; error messages above Submit button; Tab order is top-to-bottom left-to-right

**Expected Result:**
  - All mandatory fields (Name, Price, Category) have `*` symbol next to their labels (per FR-22)
  - The Submit / Save button uses the colour blue (per FR-21)
  - The Delete / Cancel Dangerous button (if present on this page) uses red (per FR-21)
  - After submitting an empty form, validation error messages appear **above** the submit button, not below it (per FR-22)
  - Tab key focus moves from top-to-bottom, left-to-right through the form fields (per FR-21)

**Observed Result:** _(fill during execution)_
**Status:** Not Run
**EC Coverage:** EC-FR15-037, EC-FR15-039, EC-FR15-041, EC-FR15-042, EC-FR15-044, EC-FR15-046
**Req. Ref:** FR-21, FR-22
**Bug ID:** _(fill if fails)_

---

## NEG Test Cases (Invalid — One Isolated INVALID EC per TC)

---

### TC-FR15-NEG-001

**Test Case ID:** TC-FR15-NEG-001
**Title:** Verify that the Create Product API rejects the request and returns HTTP 401 when no Authorization header is provided
**Description:** Validates that the admin product creation endpoint enforces JWT authentication. A request with no `Authorization` header must be rejected immediately with HTTP 401.
**Priority:** High
**Pre-conditions:**
  1. Backend API is running at `http://localhost:3000`
  2. No valid JWT token is included in the test request

**Steps:**
  1. Using a tool such as Postman or cURL, send a `POST /api/products` request with a valid product body
  2. Do NOT include the `Authorization` header
  3. Observe the HTTP response

**Test Data:**
  - Input: `POST /api/products` body: `{ "name": "Test", "price": 100000, "category_id": 1 }`, Authorization header: **absent**
  - Expected Output: HTTP 401 Unauthorized

**Expected Result:**
  - The API returns HTTP 401 Unauthorized
  - The product is NOT created in the database
  - The response body contains an appropriate error message (e.g., "Unauthorized" or "No token provided")

**Observed Result:** _(fill during execution)_
**Status:** Not Run
**EC Coverage:** EC-FR15-002, EC-FR15-063
**Req. Ref:** FR-12, SEC-02
**Bug ID:** _(fill if fails)_

---

### TC-FR15-NEG-002

**Test Case ID:** TC-FR15-NEG-002
**Title:** Verify that the Create Product API returns HTTP 401 when the Authorization header contains a malformed (structurally invalid) JWT token
**Description:** Validates that a malformed token (e.g., a random string that cannot be decoded as a JWT) is rejected with HTTP 401 and does not grant access to the admin endpoint.
**Priority:** High
**Pre-conditions:**
  1. Backend API is running at `http://localhost:3000`

**Steps:**
  1. Using Postman or cURL, send `POST /api/products` with a valid product body
  2. Include `Authorization: Bearer INVALID_MALFORMED_TOKEN_XYZ` in the header
  3. Observe the HTTP response

**Test Data:**
  - Input: Authorization: `Bearer INVALID_MALFORMED_TOKEN_XYZ` (non-decodable string)
  - Expected Output: HTTP 401 Unauthorized

**Expected Result:**
  - The API returns HTTP 401 Unauthorized
  - The product is NOT created
  - Access to the admin endpoint is denied

**Observed Result:** _(fill during execution)_
**Status:** Not Run
**EC Coverage:** EC-FR15-003, EC-FR15-063
**Req. Ref:** FR-12, SEC-02
**Bug ID:** _(fill if fails)_

---

### TC-FR15-NEG-003

**Test Case ID:** TC-FR15-NEG-003
**Title:** Verify that the Create Product API returns HTTP 401 when the Authorization header contains a structurally valid but expired JWT token
**Description:** Validates that an expired JWT — one that was once valid but has now passed its expiry time — is rejected. This tests the temporal validity check independently from structural validity.
**Priority:** High
**Pre-conditions:**
  1. Backend API is running at `http://localhost:3000`
  2. An expired JWT token is available for testing (can be generated by temporarily setting a very short expiry and waiting, or by using a pre-expired test token)

**Steps:**
  1. Obtain a JWT token that has passed its expiry time
  2. Send `POST /api/products` with a valid body and `Authorization: Bearer [expired_token]`
  3. Observe the HTTP response

**Test Data:**
  - Input: Authorization: `Bearer [expired_valid_jwt_token]`
  - Expected Output: HTTP 401 Unauthorized

**Expected Result:**
  - The API returns HTTP 401 Unauthorized
  - The product is NOT created
  - The response indicates the token has expired (without revealing specific internal details)

**Observed Result:** _(fill during execution)_
**Status:** Not Run
**EC Coverage:** EC-FR15-004, EC-FR15-063
**Req. Ref:** FR-12, SEC-02
**Bug ID:** _(fill if fails)_

---

### TC-FR15-NEG-004

**Test Case ID:** TC-FR15-NEG-004
**Title:** Verify that the Create Product API returns HTTP 403 when a valid JWT with role = 'user' (non-admin) is used
**Description:** Validates that access to admin product management endpoints is denied for regular users. A valid, non-expired JWT carrying `role = 'user'` must be rejected with HTTP 403 Forbidden, even though the token itself is structurally valid.
**Priority:** High
**Pre-conditions:**
  1. Backend API is running at `http://localhost:3000`
  2. A test user account `test@eshop.com` / `Test1234!` with `role = 'user'` exists
  3. A valid JWT for the test user is obtained via `POST /api/login`

**Steps:**
  1. Log in as `test@eshop.com` and obtain a valid JWT (role = 'user')
  2. Send `POST /api/products` with a valid product body and the user-role JWT in the Authorization header
  3. Observe the HTTP response

**Test Data:**
  - Input: Authorization: `Bearer [valid_user_role_JWT]`, body: `{ "name": "Test", "price": 100000, "category_id": 1 }`
  - Expected Output: HTTP 403 Forbidden

**Expected Result:**
  - The API returns HTTP 403 Forbidden
  - The product is NOT created in the database
  - The response body contains an appropriate "Forbidden" or "Insufficient privileges" message

**Observed Result:** _(fill during execution)_
**Status:** Not Run
**EC Coverage:** EC-FR15-006, EC-FR15-064
**Req. Ref:** FR-12, SEC-03
**Bug ID:** _(fill if fails)_

---

### TC-FR15-NEG-005

**Test Case ID:** TC-FR15-NEG-005
**Title:** Verify that product creation fails with a validation error when the product name field is submitted empty
**Description:** Validates that the mandatory product name field is enforced. An empty name string must be rejected and an appropriate error message must appear above the submit button.
**Priority:** High
**Pre-conditions:**
  1. Web Admin is running at `http://localhost:5174`
  2. Admin is logged in with valid JWT (`role = 'admin'`)
  3. Product creation form is open

**Steps:**
  1. Navigate to the product creation form
  2. Leave the Product Name field empty
  3. Fill all other fields with valid values (`price = 100000`, valid category)
  4. Click the Submit / Save button
  5. Observe the validation response

**Test Data:**
  - Input: `name = ""` (empty), `price = 100000`, `category_id = [valid existing ID]`
  - Expected Output: HTTP 400 Bad Request; error message displayed above the Submit button

**Expected Result:**
  - The form submission is rejected
  - The API `POST /api/products` returns HTTP 400 Bad Request (if submission reaches API)
  - An error message indicating the product name is required appears **above** the Submit button
  - No product is created in the database

**Observed Result:** _(fill during execution)_
**Status:** Not Run
**EC Coverage:** EC-FR15-008, EC-FR15-055
**Req. Ref:** FR-15, FR-22
**Bug ID:** _(fill if fails)_

---

### TC-FR15-NEG-006

**Test Case ID:** TC-FR15-NEG-006
**Title:** Verify that product creation fails when the product name is exactly 256 characters (one above the 255-char maximum)
**Description:** Validates the upper boundary of the product name length constraint. A name of exactly 256 characters must be rejected because it exceeds the 255-character maximum defined in FR-15. This is the UB+1 boundary point (BV-06).
**Priority:** High
**Pre-conditions:**
  1. Web Admin is running at `http://localhost:5174`
  2. Admin is logged in with valid JWT (`role = 'admin'`)
  3. Product creation form is open

**Steps:**
  1. Navigate to the product creation form
  2. Enter a product name that is exactly 256 characters long (e.g., `"A" × 256`)
  3. Enter `price = 100000` and select a valid category
  4. Click the Submit / Save button
  5. Observe the validation response

**Test Data:**
  - Input: `name = "AAAA...A" (256 × 'A')`, `price = 100000`, `category_id = [valid existing ID]`
  - Expected Output: HTTP 400 Bad Request; error message indicating name is too long, displayed above Submit button

**Expected Result:**
  - The form submission is rejected (at UI layer if maxlength enforced, or at API layer)
  - An error message indicating the name exceeds the 255-character limit appears **above** the Submit button
  - No product is created in the database

**Observed Result:** _(fill during execution)_
**Status:** Not Run
**EC Coverage:** EC-FR15-009, EC-FR15-056
**Req. Ref:** FR-15
**Bug ID:** _(fill if fails)_

---

### TC-FR15-NEG-007

**Test Case ID:** TC-FR15-NEG-007
**Title:** Verify that product creation fails when the product name greatly exceeds the 255-character maximum (500 characters)
**Description:** Validates that a name significantly longer than the 255-character limit is also rejected. This uses a representative well-above-UB value (500 chars) to confirm the system is not applying the constraint only at the boundary.
**Priority:** Medium
**Pre-conditions:**
  1. Web Admin is running at `http://localhost:5174`
  2. Admin is logged in with valid JWT (`role = 'admin'`)

**Steps:**
  1. Navigate to the product creation form
  2. Enter a product name that is exactly 500 characters long (e.g., `"B" × 500`)
  3. Enter `price = 100000` and select a valid category
  4. Click Submit / Save
  5. Observe the validation response

**Test Data:**
  - Input: `name = "BBB...B" (500 × 'B')`, `price = 100000`, `category_id = [valid existing ID]`
  - Expected Output: HTTP 400 Bad Request; error message indicating name too long

**Expected Result:**
  - The form submission is rejected
  - An error message indicating the name exceeds the maximum allowed length appears **above** the Submit button
  - No product is created

**Observed Result:** _(fill during execution)_
**Status:** Not Run
**EC Coverage:** EC-FR15-010, EC-FR15-056
**Req. Ref:** FR-15
**Bug ID:** _(fill if fails)_

---

### TC-FR15-NEG-008

**Test Case ID:** TC-FR15-NEG-008
**Title:** Verify that a product name containing an HTML/script injection payload is rendered as plain text and not executed in the browser
**Description:** Validates XSS protection on the product name field. A name containing `<script>alert(1)</script>` must be stored and displayed as literal text, not executed as script. This tests the output encoding requirement of SEC-04.
**Priority:** High
**Pre-conditions:**
  1. Web Admin is running at `http://localhost:5174`
  2. Admin is logged in with valid JWT (`role = 'admin'`)
  3. Browser developer tools / console is accessible to observe script execution

**Steps:**
  1. Navigate to the product creation form
  2. Enter `<script>alert(1)</script>` as the product name
  3. Enter `price = 100000` and select a valid category
  4. Click Submit / Save
  5. If creation succeeds, navigate to the product list and observe how the name is rendered
  6. Check the browser console for any JavaScript execution (alert dialog or console error)

**Test Data:**
  - Input: `name = "<script>alert(1)</script>"`, `price = 100000`, `category_id = [valid existing ID]`
  - Expected Output: Either (A) the payload is stored and rendered as the literal text `<script>alert(1)</script>` without executing, OR (B) the creation is rejected with a sanitization error

**Expected Result:**
  - The name `<script>alert(1)</script>` is either rejected at input (HTTP 400) or stored and rendered as escaped plain text in the UI
  - **No JavaScript alert dialog appears** in the browser
  - The browser console shows no unexpected script execution
  - The product list page does not execute the injected script when rendering the product name

**Observed Result:** _(fill during execution)_
**Status:** Not Run
**EC Coverage:** EC-FR15-011, EC-FR15-065
**Req. Ref:** SEC-04
**Bug ID:** _(fill if fails)_

**Cleanup:** Delete the created test product (with XSS name) after execution if creation succeeded.

---

### TC-FR15-NEG-009

**Test Case ID:** TC-FR15-NEG-009
**Title:** Verify that product creation fails with a validation error when the price is exactly zero
**Description:** Validates that price = 0 is rejected as it violates the "must be > 0" constraint (FR-15). This is one of the two dedicated INVALID ECs for the lower price boundary (per AMB-07: price=0 and price<0 are split into separate classes). Maps to BVA point BV-11.
**Priority:** High
**Pre-conditions:**
  1. Web Admin is running at `http://localhost:5174`
  2. Admin is logged in with valid JWT (`role = 'admin'`)

**Steps:**
  1. Navigate to the product creation form
  2. Enter `name = "Zero Price Product"` in the Name field
  3. Enter `0` in the Price field
  4. Select a valid category
  5. Click Submit / Save
  6. Observe the validation response

**Test Data:**
  - Input: `name = "Zero Price Product"`, `price = 0`, `category_id = [valid existing ID]`
  - Expected Output: HTTP 400 Bad Request; error message indicating price must be a positive number, displayed above Submit button

**Expected Result:**
  - The form submission is rejected
  - An error message indicating price must be greater than zero (a positive number) appears **above** the Submit button
  - No product is created in the database

**Observed Result:** _(fill during execution)_
**Status:** Not Run
**EC Coverage:** EC-FR15-013, EC-FR15-058
**Req. Ref:** FR-15
**Bug ID:** _(fill if fails)_

---

### TC-FR15-NEG-010

**Test Case ID:** TC-FR15-NEG-010
**Title:** Verify that product creation fails with a validation error when the price is a negative integer value
**Description:** Validates that a negative price (e.g., -1) is rejected. This is the second dedicated INVALID EC for price below zero (per AMB-07, split from price=0). Maps to BVA point BV-10.
**Priority:** High
**Pre-conditions:**
  1. Web Admin is running at `http://localhost:5174`
  2. Admin is logged in with valid JWT (`role = 'admin'`)

**Steps:**
  1. Navigate to the product creation form
  2. Enter `name = "Negative Price Product"` in the Name field
  3. Attempt to enter `-1` in the Price field (may need to bypass HTML min="1" via direct API if the UI blocks negative input)
  4. Select a valid category
  5. Click Submit / Save or send directly via API
  6. Observe the validation response

**Test Data:**
  - Input (UI): `name = "Negative Price Product"`, `price = -1`; Input (API direct): `POST /api/products` with `{ "name": "Negative Price Product", "price": -1, "category_id": 1 }`
  - Expected Output: HTTP 400 Bad Request; error message indicating price must be a positive number

**Expected Result:**
  - Both the UI and the API reject price = -1 with HTTP 400 Bad Request
  - An error message indicating price must be greater than zero appears **above** the Submit button (UI) or in the API response body (API)
  - No product is created

**Observed Result:** _(fill during execution)_
**Status:** Not Run
**EC Coverage:** EC-FR15-014, EC-FR15-058
**Req. Ref:** FR-15
**Bug ID:** _(fill if fails)_

---

### TC-FR15-NEG-011

**Test Case ID:** TC-FR15-NEG-011
**Title:** Verify that product creation fails when the price is a floating-point decimal value (e.g., 99.5)
**Description:** Validates that decimal/float price values are rejected per the integer-only constraint for Vietnamese ₫ currency (AMB-03, RESOLVED-02). Price = 99.5 must be refused even though it is numerically positive.
**Priority:** High
**Pre-conditions:**
  1. Web Admin is running at `http://localhost:5174`
  2. Admin is logged in with valid JWT (`role = 'admin'`)

**Steps:**
  1. Navigate to the product creation form
  2. Enter `name = "Float Price Product"` in the Name field
  3. Enter `99.5` in the Price field (or send via API if UI rounds automatically)
  4. Select a valid category
  5. Click Submit / Save or send directly via `POST /api/products`
  6. Observe the validation response

**Test Data:**
  - Input: `name = "Float Price Product"`, `price = 99.5`, `category_id = [valid existing ID]`
  - Expected Output: HTTP 400 Bad Request; error indicating price must be a whole positive integer

**Expected Result:**
  - The API rejects `price = 99.5` with HTTP 400 Bad Request
  - An appropriate error message is returned (e.g., "Price must be a positive integer")
  - No product is created with a float price

**Observed Result:** _(fill during execution)_
**Status:** Not Run
**EC Coverage:** EC-FR15-015, EC-FR15-058
**Req. Ref:** FR-15
**Bug ID:** _(fill if fails)_

---

### TC-FR15-NEG-012

**Test Case ID:** TC-FR15-NEG-012
**Title:** Verify that product creation fails when the price field contains a non-numeric string value
**Description:** Validates type enforcement on the price field. A non-numeric string (e.g., "abc") must be rejected with a validation error indicating price must be a valid number.
**Priority:** Medium
**Pre-conditions:**
  1. Backend API is running at `http://localhost:3000`
  2. Admin JWT with `role = 'admin'` is available

**Steps:**
  1. Using Postman, send `POST /api/products` with `Authorization: Bearer [admin_JWT]`
  2. Set body to `{ "name": "Test Product", "price": "abc", "category_id": 1 }`
  3. Observe the API response

**Test Data:**
  - Input: `name = "Test Product"`, `price = "abc"` (non-numeric string), `category_id = [valid existing ID]`
  - Expected Output: HTTP 400 Bad Request; error message indicating price must be a valid number

**Expected Result:**
  - The API returns HTTP 400 Bad Request
  - The response body contains an error message indicating price must be a numeric value
  - No product is created

**Observed Result:** _(fill during execution)_
**Status:** Not Run
**EC Coverage:** EC-FR15-016, EC-FR15-059
**Req. Ref:** FR-15
**Bug ID:** _(fill if fails)_

---

### TC-FR15-NEG-013

**Test Case ID:** TC-FR15-NEG-013
**Title:** Verify that product creation fails with a validation error when the price field is completely omitted from the request
**Description:** Validates that the mandatory price field cannot be omitted. A product creation request missing the price key entirely must be rejected with HTTP 400.
**Priority:** High
**Pre-conditions:**
  1. Backend API is running at `http://localhost:3000`
  2. Admin JWT with `role = 'admin'` is available

**Steps:**
  1. Using Postman, send `POST /api/products` with `Authorization: Bearer [admin_JWT]`
  2. Set body to `{ "name": "No Price Product", "category_id": 1 }` (price key is absent)
  3. Observe the API response

**Test Data:**
  - Input: `name = "No Price Product"`, price field: **absent from request body**, `category_id = [valid existing ID]`
  - Expected Output: HTTP 400 Bad Request; error message indicating price is required

**Expected Result:**
  - The API returns HTTP 400 Bad Request
  - The response contains an error indicating price is a required field
  - No product is created

**Observed Result:** _(fill during execution)_
**Status:** Not Run
**EC Coverage:** EC-FR15-017, EC-FR15-057
**Req. Ref:** FR-15, FR-22
**Bug ID:** _(fill if fails)_

---

### TC-FR15-NEG-014

**Test Case ID:** TC-FR15-NEG-014
**Title:** Verify that product creation fails when the description exceeds 1000 characters (the application-layer safety limit)
**Description:** Validates that the application correctly enforces the 1000-character description limit (AMB-01, RESOLVED-04). A description of 1001 characters must be rejected before the data reaches the SQLite TEXT column.
**Priority:** Medium
**Pre-conditions:**
  1. Backend API is running at `http://localhost:3000`
  2. Admin JWT with `role = 'admin'` is available

**Steps:**
  1. Using Postman, send `POST /api/products` with `Authorization: Bearer [admin_JWT]`
  2. Set body to include `"description"` with a value of exactly 1001 characters (e.g., `"C" × 1001`)
  3. Other fields are valid: `name = "Long Desc Product"`, `price = 100000`, `category_id = 1`
  4. Observe the API response

**Test Data:**
  - Input: `name = "Long Desc Product"`, `price = 100000`, `description = "CCC...C" (1001 × 'C')`, `category_id = [valid existing ID]`
  - Expected Output: HTTP 400 Bad Request; error message indicating description is too long

**Expected Result:**
  - The API returns HTTP 400 Bad Request
  - The response contains an error indicating the description exceeds the maximum allowed length (1000 characters)
  - No product is created with the oversized description

**Observed Result:** _(fill during execution)_
**Status:** Not Run
**EC Coverage:** EC-FR15-020
**Req. Ref:** FR-15
**Bug ID:** _(fill if fails)_

---

### TC-FR15-NEG-015

**Test Case ID:** TC-FR15-NEG-015
**Title:** Verify that an HTML/script injection payload in the description field is rendered as plain text and not executed in the browser
**Description:** Validates XSS protection on the description field. A description containing `<img src=x onerror=alert(1)>` must be stored as escaped text and not trigger script execution when rendered in the product detail view or product list.
**Priority:** High
**Pre-conditions:**
  1. Web Admin is running at `http://localhost:5174`
  2. Admin is logged in with valid JWT (`role = 'admin'`)
  3. Browser developer tools / console is accessible

**Steps:**
  1. Navigate to the product creation form
  2. Enter `name = "XSS Description Test"` in the Name field
  3. Enter `<img src=x onerror=alert(1)>` in the Description field
  4. Enter `price = 100000` and select a valid category
  5. Click Submit / Save
  6. If creation succeeds, navigate to the product detail and observe the rendered description
  7. Check the browser console for any JavaScript execution

**Test Data:**
  - Input: `name = "XSS Description Test"`, `description = "<img src=x onerror=alert(1)>"`, `price = 100000`, `category_id = [valid existing ID]`
  - Expected Output: Description rendered as literal escaped text; no browser alert triggered; no script execution in console

**Expected Result:**
  - The description is either rejected at input (HTTP 400) or stored and rendered as the escaped string `&lt;img src=x onerror=alert(1)&gt;` in the UI
  - No browser alert dialog appears
  - No unexpected scripts are executed (verified via browser console)

**Observed Result:** _(fill during execution)_
**Status:** Not Run
**EC Coverage:** EC-FR15-021, EC-FR15-065
**Req. Ref:** SEC-04
**Bug ID:** _(fill if fails)_

**Cleanup:** Delete the test product if it was successfully created.

---

### TC-FR15-NEG-016

**Test Case ID:** TC-FR15-NEG-016
**Title:** Verify that product creation fails when the imageUrl uses an unsecured http:// prefix instead of https://
**Description:** Validates the imageUrl protocol enforcement (AMB-02, RESOLVED-03). A URL beginning with `http://` must be rejected because only `https://` URLs are accepted. This tests the spec boundary for imageUrl.
**Priority:** Medium
**Pre-conditions:**
  1. Backend API is running at `http://localhost:3000`
  2. Admin JWT with `role = 'admin'` is available

**Steps:**
  1. Using Postman, send `POST /api/products` with `Authorization: Bearer [admin_JWT]`
  2. Set body: `{ "name": "HTTP URL Product", "price": 100000, "imageUrl": "http://example.com/img.jpg", "category_id": 1 }`
  3. Observe the API response

**Test Data:**
  - Input: `name = "HTTP URL Product"`, `price = 100000`, `imageUrl = "http://example.com/img.jpg"` (http:// not https://), `category_id = [valid existing ID]`
  - Expected Output: HTTP 400 Bad Request; error message indicating imageUrl must use https://

**Expected Result:**
  - The API returns HTTP 400 Bad Request
  - The response contains an error indicating the image URL must begin with `https://`
  - No product is created with an insecure image URL

**Observed Result:** _(fill during execution)_
**Status:** Not Run
**EC Coverage:** EC-FR15-024
**Req. Ref:** FR-15
**Bug ID:** _(fill if fails)_

---

### TC-FR15-NEG-017

**Test Case ID:** TC-FR15-NEG-017
**Title:** Verify that product creation fails when the imageUrl is a completely malformed non-URL string
**Description:** Validates that a completely malformed imageUrl value (e.g., "notaurl", "ftp://...", a random string) is rejected because it does not conform to the required https:// URL format (AMB-02).
**Priority:** Medium
**Pre-conditions:**
  1. Backend API is running at `http://localhost:3000`
  2. Admin JWT with `role = 'admin'` is available

**Steps:**
  1. Using Postman, send `POST /api/products` with `Authorization: Bearer [admin_JWT]`
  2. Set body: `{ "name": "Malformed URL Product", "price": 100000, "imageUrl": "notavalidurl", "category_id": 1 }`
  3. Observe the API response

**Test Data:**
  - Input: `name = "Malformed URL Product"`, `price = 100000`, `imageUrl = "notavalidurl"` (non-URL string), `category_id = [valid existing ID]`
  - Expected Output: HTTP 400 Bad Request; error indicating imageUrl is not a valid URL

**Expected Result:**
  - The API returns HTTP 400 Bad Request
  - The response indicates imageUrl must be a valid URL (starting with `https://`)
  - No product is created

**Observed Result:** _(fill during execution)_
**Status:** Not Run
**EC Coverage:** EC-FR15-025
**Req. Ref:** FR-15
**Bug ID:** _(fill if fails)_

---

### TC-FR15-NEG-018

**Test Case ID:** TC-FR15-NEG-018
**Title:** Verify that product creation fails when the category field is not selected (left empty/null)
**Description:** Validates that the mandatory category field is enforced. Submitting a product creation form without selecting a category must be rejected with an appropriate error message above the submit button.
**Priority:** High
**Pre-conditions:**
  1. Web Admin is running at `http://localhost:5174`
  2. Admin is logged in with valid JWT (`role = 'admin'`)
  3. Product creation form is open

**Steps:**
  1. Navigate to the product creation form
  2. Enter `name = "No Category Product"` and `price = 100000`
  3. Do NOT select any category from the Category dropdown (leave it blank/default unselected)
  4. Click Submit / Save
  5. Observe the validation response

**Test Data:**
  - Input: `name = "No Category Product"`, `price = 100000`, `category_id = null / not selected`
  - Expected Output: Validation error displayed above Submit button indicating category is required

**Expected Result:**
  - The form submission is rejected
  - An error message indicating category is required appears **above** the Submit button (per FR-22)
  - No product is created without a category

**Observed Result:** _(fill during execution)_
**Status:** Not Run
**EC Coverage:** EC-FR15-027, EC-FR15-060
**Req. Ref:** FR-15, FR-22
**Bug ID:** _(fill if fails)_

---

### TC-FR15-NEG-019

**Test Case ID:** TC-FR15-NEG-019
**Title:** Verify that product creation fails when the category_id references a non-existent category
**Description:** Validates that the category_id must reference an existing database record. Sending a valid integer category_id that has no matching category in the database must be rejected with HTTP 400.
**Priority:** Medium
**Pre-conditions:**
  1. Backend API is running at `http://localhost:3000`
  2. Admin JWT with `role = 'admin'` is available
  3. Category ID `99999` does not exist in the database

**Steps:**
  1. Using Postman, send `POST /api/products` with `Authorization: Bearer [admin_JWT]`
  2. Set body: `{ "name": "Orphan Category Product", "price": 100000, "category_id": 99999 }`
  3. Observe the API response

**Test Data:**
  - Input: `name = "Orphan Category Product"`, `price = 100000`, `category_id = 99999` (non-existent)
  - Expected Output: HTTP 400 Bad Request; error indicating the category does not exist

**Expected Result:**
  - The API returns HTTP 400 Bad Request
  - The response contains an error message indicating the selected category does not exist
  - No product is created with an orphaned category reference

**Observed Result:** _(fill during execution)_
**Status:** Not Run
**EC Coverage:** EC-FR15-028, EC-FR15-061
**Req. Ref:** FR-15
**Bug ID:** _(fill if fails)_

---

### TC-FR15-NEG-020

**Test Case ID:** TC-FR15-NEG-020
**Title:** Verify that the Create Product API returns HTTP 400 when the category_id is a non-integer alphanumeric string
**Description:** Validates type enforcement on the category_id field at the API level. Sending a non-integer string (e.g., "electronics") as the category_id must be rejected with HTTP 400 per AMB-04.
**Priority:** Medium
**Pre-conditions:**
  1. Backend API is running at `http://localhost:3000`
  2. Admin JWT with `role = 'admin'` is available

**Steps:**
  1. Using Postman, send `POST /api/products` with `Authorization: Bearer [admin_JWT]`
  2. Set body: `{ "name": "Wrong Category Type Product", "price": 100000, "category_id": "electronics" }`
  3. Observe the API response

**Test Data:**
  - Input: `name = "Wrong Category Type Product"`, `price = 100000`, `category_id = "electronics"` (string, not integer)
  - Expected Output: HTTP 400 Bad Request; error indicating category_id must be a valid integer

**Expected Result:**
  - The API returns HTTP 400 Bad Request
  - The response contains an error indicating the category_id must be an integer
  - No product is created

**Observed Result:** _(fill during execution)_
**Status:** Not Run
**EC Coverage:** EC-FR15-029
**Req. Ref:** FR-15
**Bug ID:** _(fill if fails)_

---

### TC-FR15-NEG-021

**Test Case ID:** TC-FR15-NEG-021
**Title:** Verify that the Edit Product API returns HTTP 404 when the product ID in the path does not reference any existing product
**Description:** Validates that editing a non-existent product returns HTTP 404. The product ID in the path parameter must map to an existing database record; otherwise, the operation must fail without any data mutation.
**Priority:** High
**Pre-conditions:**
  1. Backend API is running at `http://localhost:3000`
  2. Admin JWT with `role = 'admin'` is available
  3. Product ID `99999` does not exist in the database

**Steps:**
  1. Using Postman, send `PUT /api/products/99999` with `Authorization: Bearer [admin_JWT]`
  2. Set body: `{ "name": "Ghost Product", "price": 100000, "category_id": 1 }`
  3. Observe the API response

**Test Data:**
  - Input: Path: `/api/products/99999` (non-existent ID), body: `{ "name": "Ghost Product", "price": 100000, "category_id": 1 }`
  - Expected Output: HTTP 404 Not Found; no data is modified

**Expected Result:**
  - The API returns HTTP 404 Not Found
  - An appropriate error message is returned (e.g., "Product not found")
  - No existing product is modified

**Observed Result:** _(fill during execution)_
**Status:** Not Run
**EC Coverage:** EC-FR15-031, EC-FR15-062
**Req. Ref:** FR-15
**Bug ID:** _(fill if fails)_

---

### TC-FR15-NEG-022

**Test Case ID:** TC-FR15-NEG-022
**Title:** Verify that the Delete Product API returns HTTP 400 when the product ID path parameter is a non-integer string
**Description:** Validates type enforcement on the `:id` path parameter for the Delete endpoint. Sending a non-integer string (e.g., "abc") in the path must be rejected with HTTP 400.
**Priority:** Medium
**Pre-conditions:**
  1. Backend API is running at `http://localhost:3000`
  2. Admin JWT with `role = 'admin'` is available

**Steps:**
  1. Using Postman, send `DELETE /api/products/abc` with `Authorization: Bearer [admin_JWT]`
  2. Observe the HTTP response

**Test Data:**
  - Input: Path: `/api/products/abc` (non-integer string)
  - Expected Output: HTTP 400 Bad Request; error indicating the product ID must be a valid integer

**Expected Result:**
  - The API returns HTTP 400 Bad Request
  - The response indicates the product ID in the path is invalid (not an integer)
  - No product is deleted

**Observed Result:** _(fill during execution)_
**Status:** Not Run
**EC Coverage:** EC-FR15-032
**Req. Ref:** FR-15, API §3.3
**Bug ID:** _(fill if fails)_

---

### TC-FR15-NEG-023

**Test Case ID:** TC-FR15-NEG-023
**Title:** Verify that an HTML/script injection payload in the product search keyword is rendered as plain text and not executed in the browser
**Description:** Validates XSS protection on the product search feature. A search keyword containing a script tag must be displayed safely as plain text in the results area without triggering script execution.
**Priority:** High
**Pre-conditions:**
  1. Web Admin is running at `http://localhost:5174`
  2. Admin is logged in with valid JWT (`role = 'admin'`)
  3. Browser developer tools / console is accessible

**Steps:**
  1. Navigate to the product management list page
  2. Enter `<script>alert('XSS')</script>` in the search field
  3. Submit the search
  4. Observe the rendered output in the results area and browser console

**Test Data:**
  - Input: Search keyword = `<script>alert('XSS')</script>`
  - Expected Output: Keyword displayed as escaped plain text in the UI; no browser alert; no console errors from executed script

**Expected Result:**
  - The search keyword is displayed in the UI as the literal escaped string `&lt;script&gt;alert('XSS')&lt;/script&gt;` or equivalent plain text
  - No JavaScript alert dialog appears
  - No unexpected script execution occurs (verified via browser console)

**Observed Result:** _(fill during execution)_
**Status:** Not Run
**EC Coverage:** EC-FR15-036, EC-FR15-065
**Req. Ref:** SEC-04, FR-05
**Bug ID:** _(fill if fails)_

---

### TC-FR15-NEG-024

**Test Case ID:** TC-FR15-NEG-024
**Title:** Verify that the product creation form is missing the required asterisk (*) indicator on mandatory field labels
**Description:** This is an observational check test — it verifies whether the system violates FR-22 by not displaying `*` on mandatory fields. The "test" is the act of inspecting the form label elements. If the * is absent, this is a defect against EC-FR15-038.
**Priority:** Medium
**Pre-conditions:**
  1. Web Admin is running at `http://localhost:5174`
  2. Admin is logged in and the product creation form is visible

**Steps:**
  1. Navigate to the product creation form
  2. Inspect each mandatory field label: Product Name, Price, Category
  3. Verify whether each label contains a `*` symbol adjacent to the label text
  4. Use browser developer tools to confirm the `*` is present in the DOM (not just visually)

**Test Data:**
  - Input: Visual + DOM inspection of the product creation form labels
  - Expected Output: `*` is present next to all mandatory field labels (Name, Price, Category)

**Expected Result:**
  - The Product Name label displays `*` (e.g., "Product Name *" or "* Product Name")
  - The Price label displays `*`
  - The Category label displays `*`
  - No mandatory field label is missing the `*` indicator

**Observed Result:** _(fill during execution)_
**Status:** Not Run
**EC Coverage:** EC-FR15-038 (verifies absence of the defect described in this EC)
**Req. Ref:** FR-22
**Bug ID:** _(fill if fails)_

---

### TC-FR15-NEG-025

**Test Case ID:** TC-FR15-NEG-025
**Title:** Verify that validation error messages appear above the submit button and not below it or elsewhere on the product form
**Description:** Validates the error message position requirement from FR-22. When validation fails, error messages must appear above the Submit button. Displaying them below or in a different location is a violation of the spec.
**Priority:** Medium
**Pre-conditions:**
  1. Web Admin is running at `http://localhost:5174`
  2. Admin is logged in and the product creation form is accessible

**Steps:**
  1. Navigate to the product creation form
  2. Submit the form with all required fields empty (to trigger multiple validation errors)
  3. Observe the position of the displayed error messages relative to the Submit button

**Test Data:**
  - Input: Empty form submission (all required fields blank)
  - Expected Output: Error messages rendered above the Submit button

**Expected Result:**
  - At least one validation error message is displayed
  - All validation error messages appear in the UI area **above** the Submit button, not below it or floating elsewhere
  - The Submit button is still visible below the error messages

**Observed Result:** _(fill during execution)_
**Status:** Not Run
**EC Coverage:** EC-FR15-040 (verifies that this defect condition does NOT occur)
**Req. Ref:** FR-22
**Bug ID:** _(fill if fails)_

---

### TC-FR15-NEG-026

**Test Case ID:** TC-FR15-NEG-026
**Title:** Verify that action buttons use the correct colour coding — Submit is blue and Delete is red on the product management page
**Description:** Validates the colour-coding requirement from FR-21. The Submit/Save button must use blue and the Delete/Dangerous action button must use red. This is an observational check; failing this test means the buttons use the wrong colours (EC-FR15-043 is triggered).
**Priority:** Low
**Pre-conditions:**
  1. Web Admin is running at `http://localhost:5174`
  2. Admin is logged in and the product creation/edit form and product list are accessible

**Steps:**
  1. Navigate to the product creation form and identify the Submit / Save button
  2. Observe its colour (should be blue)
  3. Navigate to the product list and identify the Delete button for any product
  4. Observe its colour (should be red)

**Test Data:**
  - Input: Visual inspection of button colours
  - Expected Output: Submit button = blue; Delete button = red

**Expected Result:**
  - The Submit / Save button is styled with a blue background colour
  - The Delete button for each product is styled with a red background colour
  - No blue button is used for a dangerous/destructive action
  - No red button is used for a non-dangerous positive action

**Observed Result:** _(fill during execution)_
**Status:** Not Run
**EC Coverage:** EC-FR15-041, EC-FR15-042, EC-FR15-043
**Req. Ref:** FR-21
**Bug ID:** _(fill if fails)_

---

### TC-FR15-NEG-027

**Test Case ID:** TC-FR15-NEG-027
**Title:** Verify that the product management page does not contain more than one h1 tag
**Description:** Validates the single-h1-tag requirement from FR-21. Each page must have exactly one `<h1>` tag. This observational check inspects the DOM to confirm no zero or multiple h1 tags exist.
**Priority:** Low
**Pre-conditions:**
  1. Web Admin is running at `http://localhost:5174`
  2. Admin is logged in and on the product management list page

**Steps:**
  1. Navigate to the product management list page
  2. Open browser developer tools and inspect the DOM
  3. Search for all `<h1>` elements on the page
  4. Count the number of `<h1>` elements found

**Test Data:**
  - Input: DOM inspection of `<h1>` elements on the product management page
  - Expected Output: Exactly one `<h1>` element found

**Expected Result:**
  - The DOM query `document.querySelectorAll('h1').length` returns exactly `1`
  - The single `<h1>` tag contains a meaningful, descriptive page title
  - Neither zero `<h1>` tags nor more than one `<h1>` tag exists on the page

**Observed Result:** _(fill during execution)_
**Status:** Not Run
**EC Coverage:** EC-FR15-044, EC-FR15-045
**Req. Ref:** FR-21
**Bug ID:** _(fill if fails)_

---

### TC-FR15-NEG-028

**Test Case ID:** TC-FR15-NEG-028
**Title:** Verify that the Tab key navigates form fields in the correct top-to-bottom, left-to-right order on the product creation form
**Description:** Validates the tab order requirement from FR-21. Each Tab key press must move focus to the next field in a logical top-to-bottom, left-to-right sequence. Skipping a field or jumping to the wrong element is a violation of EC-FR15-047.
**Priority:** Low
**Pre-conditions:**
  1. Web Admin is running at `http://localhost:5174`
  2. Admin is logged in and the product creation form is visible

**Steps:**
  1. Click on the first field in the product creation form (Product Name)
  2. Press Tab and note which element receives focus next
  3. Continue pressing Tab through all form fields
  4. Record the focus sequence and compare to the expected top-to-bottom, left-to-right order

**Test Data:**
  - Input: Sequential Tab key presses starting from the first form field
  - Expected Output: Focus moves in order: Name → Price → Description → Image URL → Category → Submit button

**Expected Result:**
  - Tab key focus moves sequentially from top to bottom through form fields in the order they visually appear
  - No field is skipped during Tab navigation
  - Focus does not jump to a footer, navigation bar, or other out-of-sequence element before completing the form

**Observed Result:** _(fill during execution)_
**Status:** Not Run
**EC Coverage:** EC-FR15-046, EC-FR15-047
**Req. Ref:** FR-21
**Bug ID:** _(fill if fails)_

---

### TC-FR15-NEG-029

**Test Case ID:** TC-FR15-NEG-029
**Title:** Verify that the delete action does not execute immediately without displaying a confirmation dialog
**Description:** Validates the mandatory delete confirmation dialog requirement (AMB-06, FR-21). Clicking the Delete button must always trigger a confirmation dialog before any deletion. If the product is deleted immediately without a dialog appearing, EC-FR15-049 is triggered — this is a defect.
**Priority:** High
**Pre-conditions:**
  1. Web Admin is running at `http://localhost:5174`
  2. Admin is logged in with valid JWT (`role = 'admin'`)
  3. A product exists in the product list

**Steps:**
  1. Navigate to the product management list page
  2. Locate any product and click the Delete button
  3. Immediately observe whether a dialog or confirmation prompt appears
  4. Do NOT click Confirm — just verify the dialog is displayed before any deletion

**Test Data:**
  - Input: Click Delete button for any existing product
  - Expected Output: A confirmation dialog appears before any deletion occurs

**Expected Result:**
  - Immediately after clicking Delete, a confirmation dialog appears asking the admin to confirm the deletion
  - The product is still present in the list while the dialog is displayed (no immediate deletion)
  - The dialog offers both a Confirm/Yes and a Cancel/No option

**Observed Result:** _(fill during execution)_
**Status:** Not Run
**EC Coverage:** EC-FR15-048, EC-FR15-049
**Req. Ref:** FR-21
**Bug ID:** _(fill if fails)_

---

## Coverage Matrix (EP Phase Only)

| EC ID | Variable | Description | Type | Covered By |
|-------|----------|-------------|------|------------|
| EC-FR15-001 | JWT Token | Valid admin JWT present | VALID | TC-FR15-EP-001, EP-002, EP-003, EP-004, EP-005, EP-006, EP-007, EP-008, EP-009, EP-010 |
| EC-FR15-002 | JWT Token | Token absent | INVALID | TC-FR15-NEG-001 |
| EC-FR15-003 | JWT Token | Token malformed | INVALID | TC-FR15-NEG-002 |
| EC-FR15-004 | JWT Token | Token expired | INVALID | TC-FR15-NEG-003 |
| EC-FR15-005 | Admin Role | role = 'admin' | VALID | TC-FR15-EP-001, EP-002, EP-003, EP-004, EP-005, EP-006, EP-007, EP-008, EP-009, EP-010 |
| EC-FR15-006 | Admin Role | role = 'user' | INVALID | TC-FR15-NEG-004 |
| EC-FR15-007 | Product Name | 1–255 chars valid | VALID | TC-FR15-EP-001, EP-002, EP-003 |
| EC-FR15-008 | Product Name | Empty string | INVALID | TC-FR15-NEG-005 |
| EC-FR15-009 | Product Name | Exactly 256 chars | INVALID | TC-FR15-NEG-006 |
| EC-FR15-010 | Product Name | > 255 chars (500 chars) | INVALID | TC-FR15-NEG-007 |
| EC-FR15-011 | Product Name | XSS payload | INVALID | TC-FR15-NEG-008 |
| EC-FR15-012 | Price | Positive integer > 0 | VALID | TC-FR15-EP-001, EP-002, EP-003 |
| EC-FR15-013 | Price | Price = 0 | INVALID | TC-FR15-NEG-009 |
| EC-FR15-014 | Price | Price < 0 (negative) | INVALID | TC-FR15-NEG-010 |
| EC-FR15-015 | Price | Float / decimal | INVALID | TC-FR15-NEG-011 |
| EC-FR15-016 | Price | Non-numeric string | INVALID | TC-FR15-NEG-012 |
| EC-FR15-017 | Price | Missing/omitted | INVALID | TC-FR15-NEG-013 |
| EC-FR15-018 | Description | Empty/omitted (valid null) | VALID | TC-FR15-EP-002 |
| EC-FR15-019 | Description | 1–1000 chars | VALID | TC-FR15-EP-001, EP-003 |
| EC-FR15-020 | Description | > 1000 chars | INVALID | TC-FR15-NEG-014 |
| EC-FR15-021 | Description | XSS payload | INVALID | TC-FR15-NEG-015 |
| EC-FR15-022 | Image URL | Empty/omitted (valid null) | VALID | TC-FR15-EP-002 |
| EC-FR15-023 | Image URL | Valid https:// URL | VALID | TC-FR15-EP-001, EP-003 |
| EC-FR15-024 | Image URL | http:// prefix (not https) | INVALID | TC-FR15-NEG-016 |
| EC-FR15-025 | Image URL | Malformed non-URL string | INVALID | TC-FR15-NEG-017 |
| EC-FR15-026 | Category ID | Valid existing integer ID | VALID | TC-FR15-EP-001, EP-002, EP-003 |
| EC-FR15-027 | Category ID | Empty/null/not selected | INVALID | TC-FR15-NEG-018 |
| EC-FR15-028 | Category ID | Valid int, non-existent in DB | INVALID | TC-FR15-NEG-019 |
| EC-FR15-029 | Category ID | Non-integer type | INVALID | TC-FR15-NEG-020 |
| EC-FR15-030 | Product ID (path) | Valid existing product ID | VALID | TC-FR15-EP-003, EP-004, EP-005, EP-009 |
| EC-FR15-031 | Product ID (path) | Non-existent ID | INVALID | TC-FR15-NEG-021 |
| EC-FR15-032 | Product ID (path) | Non-integer path param | INVALID | TC-FR15-NEG-022 |
| EC-FR15-033 | Search Keyword | Empty/omitted | VALID | TC-FR15-EP-006 |
| EC-FR15-034 | Search Keyword | Matches products | VALID | TC-FR15-EP-007 |
| EC-FR15-035 | Search Keyword | No matches | VALID | TC-FR15-EP-008 |
| EC-FR15-036 | Search Keyword | XSS payload | INVALID | TC-FR15-NEG-023 |
| EC-FR15-037 | Req. field indicator | `*` present on all mandatory fields | VALID | TC-FR15-NEG-024 (observational) |
| EC-FR15-038 | Req. field indicator | `*` missing on one or more | INVALID | TC-FR15-NEG-024 |
| EC-FR15-039 | Error msg position | Error above Submit button | VALID | TC-FR15-NEG-025 (observational) |
| EC-FR15-040 | Error msg position | Error below Submit button | INVALID | TC-FR15-NEG-025 |
| EC-FR15-041 | Submit button colour | Blue | VALID | TC-FR15-NEG-026 |
| EC-FR15-042 | Delete button colour | Red | VALID | TC-FR15-NEG-026 |
| EC-FR15-043 | Button colour | Wrong colour | INVALID | TC-FR15-NEG-026 |
| EC-FR15-044 | h1 tag count | Exactly one h1 | VALID | TC-FR15-EP-006, TC-FR15-NEG-027 |
| EC-FR15-045 | h1 tag count | Zero or multiple h1 | INVALID | TC-FR15-NEG-027 |
| EC-FR15-046 | Tab focus order | Top-to-bottom, left-to-right | VALID | TC-FR15-NEG-028 |
| EC-FR15-047 | Tab focus order | Wrong/skip order | INVALID | TC-FR15-NEG-028 |
| EC-FR15-048 | Delete dialog | Dialog present, Cancel works | VALID | TC-FR15-EP-004, EP-005, TC-FR15-NEG-029 |
| EC-FR15-049 | Delete dialog | No dialog (immediate delete) | INVALID | TC-FR15-NEG-029 |
| EC-FR15-050 | Output: Create | HTTP 201 + product in list | VALID OUTPUT | TC-FR15-EP-001, EP-002 |
| EC-FR15-051 | Output: Update | HTTP 200 + values updated | VALID OUTPUT | TC-FR15-EP-003 |
| EC-FR15-052 | Output: Delete | HTTP 200 + product removed | VALID OUTPUT | TC-FR15-EP-004 |
| EC-FR15-053 | Output: View list | All products displayed | VALID OUTPUT | TC-FR15-EP-006, EP-007, EP-008 |
| EC-FR15-054 | Output: View detail | Full product detail rendered | VALID OUTPUT | TC-FR15-EP-009 |
| EC-FR15-055 | Output: Name empty error | HTTP 400 + error above button | INVALID OUTPUT | TC-FR15-NEG-005 |
| EC-FR15-056 | Output: Name too long error | HTTP 400 + error above button | INVALID OUTPUT | TC-FR15-NEG-006, NEG-007 |
| EC-FR15-057 | Output: Price missing error | HTTP 400 + error above button | INVALID OUTPUT | TC-FR15-NEG-013 |
| EC-FR15-058 | Output: Price invalid error | HTTP 400 + error above button | INVALID OUTPUT | TC-FR15-NEG-009, NEG-010, NEG-011 |
| EC-FR15-059 | Output: Price non-numeric error | HTTP 400 + error above button | INVALID OUTPUT | TC-FR15-NEG-012 |
| EC-FR15-060 | Output: Category missing error | HTTP 400 + error above button | INVALID OUTPUT | TC-FR15-NEG-018 |
| EC-FR15-061 | Output: Category non-existent | HTTP 400 + error message | INVALID OUTPUT | TC-FR15-NEG-019 |
| EC-FR15-062 | Output: Product not found | HTTP 404 + error message | INVALID OUTPUT | TC-FR15-NEG-021 |
| EC-FR15-063 | Output: 401 Unauthorized | HTTP 401 returned | INVALID OUTPUT | TC-FR15-NEG-001, NEG-002, NEG-003 |
| EC-FR15-064 | Output: 403 Forbidden | HTTP 403 returned | INVALID OUTPUT | TC-FR15-NEG-004 |
| EC-FR15-065 | Output: XSS prevention | Payload rendered as plain text | INVALID OUTPUT | TC-FR15-NEG-008, NEG-015, NEG-023 |
| EC-FR15-066 | Output: Isolation guarantee | Other products unaffected | VALID OUTPUT | TC-FR15-EP-003, EP-004 |
| EC-FR15-067 | Output: Cancel deletion | Product remains after cancel | VALID OUTPUT | TC-FR15-EP-005 |

**EP Phase Totals:**
- EP test cases (valid): **10** (TC-FR15-EP-001 to TC-FR15-EP-010)
- NEG test cases (invalid): **29** (TC-FR15-NEG-001 to TC-FR15-NEG-029)
- **Total EP phase test cases: 39**
- BVA test cases (TC-FR15-BV-###): Pending — to be added in next session

---

### Self-Audit (AGENTS.md §7 — Test Case Gate)

```
✅ Each invalid class has its own isolated test case (29 NEG TCs, one per invalid EC — P-01 compliant)
✅ Valid classes are efficiently combined (10 EP TCs cover 22 valid ECs — max combination applied)
✅ Every title follows: Action + Function + Condition (verified all 39 titles)
✅ Expected results are precise and written before execution (HTTP status codes, exact message positions, DOM element counts specified)
✅ Every TC references at least one EC ID and one FR/SEC ID
✅ Test cases are self-standing (no tribal knowledge — pre-conditions fully specified)
✅ Cleanup actions documented for TCs that create/modify data
```

---

**HITL Review:** [ ] Accepted / [ ] Partially Accepted / [ ] Rejected — [Notes to be filled by HITL]
