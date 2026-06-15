## Requirement Analysis — FR-15: Product Management (Product CRUD)
**Date:** 2026-06-15 17:30
**Analyst:** Gemini QA Agent (reviewed by: [HITL name])
**SRS Version:** 2.0 (2026-05-14)

### Feature Scope
- **Platform:** Web Admin (`http://localhost:5174`)
- **URL / Endpoint:** `http://localhost:5174/products` (list/create), `http://localhost:5174/products/:id/edit` (edit), `http://localhost:5174/products/:id/delete` (delete)
- **API Endpoints Used:**
  - `GET /api/products` — View all products
  - `GET /api/products/:id` — View single product detail
  - `POST /api/products` — Create a new product (Admin only)
  - `PUT /api/products/:id` — Edit/update an existing product (Admin only)
  - `DELETE /api/products/:id` — Delete a product (Admin only)
  - `GET /api/categories` — Retrieve existing category list for dropdown
- **Knowledge Sources Used:**
  - SRS §FR-15 (Product Management), §FR-12 (Access Control), §FR-21 (General Interface Standards), §FR-22 (Form Requirements), §SEC-02, §SEC-03, §SEC-04
  - API Spec §3.1 (Get Products), §3.2 (Get Product Details), §3.3 (Create/Update/Delete Products), §3.4 (Categories), §6 (Admin APIs)

---

### Input Variables

#### A. Authentication / Access Control Inputs (Pre-condition Inputs)

| # | Variable Name | Data Type | Constraints | Source Req. ID |
|---|--------------|-----------|-------------|----------------|
| 1 | JWT Token (Authorization Header) | string | Must be present, must be valid (not expired, not malformed); must carry `role = 'admin'` | FR-12, SEC-02, SEC-03 |
| 2 | Admin Role (`role` field in JWT) | enum | Must equal `'admin'`; regular user tokens must be rejected | FR-12, SEC-03 |

---

#### B. Create Product — Form Inputs (`POST /api/products`)

| # | Variable Name | Data Type | Constraints | Source Req. ID |
|---|--------------|-----------|-------------|----------------|
| 3 | Product Name (`name`) | string | Mandatory (must not be empty or null); maximum 255 characters | FR-15 |
| 4 | Price (`price`) | float / number | Mandatory; must be a **positive number** (> 0); zero and negative values are rejected | FR-15 |
| 5 | Description (`description`) | string | Optional; no explicit length constraint stated in SRS | FR-15 ⚠️ |
| 6 | Image URL (`imageUrl`) | string (URL) | Optional; no explicit format constraint stated in SRS | FR-15 ⚠️ |
| 7 | Category (`category_id`) | integer (foreign key) | Mandatory; must be selected from the **existing** category list fetched from `/api/categories`; a non-existent or empty category_id must be rejected | FR-15 |

---

#### C. Edit Product — Path + Form Inputs (`PUT /api/products/:id`)

| # | Variable Name | Data Type | Constraints | Source Req. ID |
|---|--------------|-----------|-------------|----------------|
| 8 | Product ID (`:id` path param) | integer | Must be a valid, existing product ID in the database; non-existent or non-integer IDs must be rejected | FR-15, API Spec §3.3 |
| 9 | Product Name (`name`) | string | Same as Create: mandatory, max 255 characters | FR-15 |
| 10 | Price (`price`) | float / number | Same as Create: mandatory, must be > 0 | FR-15 |
| 11 | Description (`description`) | string | Same as Create: optional, no explicit length constraint | FR-15 ⚠️ |
| 12 | Image URL (`imageUrl`) | string (URL) | Same as Create: optional, no explicit format constraint | FR-15 ⚠️ |
| 13 | Category (`category_id`) | integer (foreign key) | Same as Create: mandatory, must be from existing category list | FR-15 |

---

#### D. Delete Product — Path Input (`DELETE /api/products/:id`)

| # | Variable Name | Data Type | Constraints | Source Req. ID |
|---|--------------|-----------|-------------|----------------|
| 14 | Product ID (`:id` path param) | integer | Must be a valid, existing product ID; deleting a non-existent product must be handled with an appropriate error | FR-15, API Spec §3.3 |

---

#### E. View / List Products — Query Input (`GET /api/products`)

| # | Variable Name | Data Type | Constraints | Source Req. ID |
|---|--------------|-----------|-------------|----------------|
| 15 | Search keyword (`?search=`) | string | Optional query parameter; must be displayed safely in the UI (no HTML rendering) | FR-05, SEC-04 |

---

#### F. GUI / Form-Level Inputs (Web Admin UI)

| # | Variable Name | Data Type | Constraints | Source Req. ID |
|---|--------------|-----------|-------------|----------------|
| 16 | Required field indicator (`*`) | UI element | All mandatory fields (Name, Price, Category) must have `*` symbol next to label | FR-22 |
| 17 | Error message position | UI element | Error messages must appear **above** the submit button | FR-22 |
| 18 | Language of interface | enum | Interface must be in Vietnamese (except standard technical terms) | FR-21 |
| 19 | Submit/action button colour | enum | Submit/confirm actions use blue; dangerous/delete actions use red | FR-21 |
| 20 | Tab key focus order | UI behaviour | Focus order must proceed top-to-bottom, left-to-right | FR-21 |
| 21 | Page `<h1>` tag | UI structure | Each page must have **exactly one** `<h1>` tag | FR-21 |

---

### Output Variables

#### A. Successful Operations

| # | Output Variable | Output Type | Expected Value / Message | Condition | Source Req. ID |
|---|----------------|-------------|--------------------------|-----------|----------------|
| 1 | Product Created Successfully | UI feedback + HTTP response | HTTP 200/201; success notification (toast or confirmation message) displayed; new product appears in product list | Valid admin creates a product with all mandatory fields valid | FR-15 |
| 2 | Product Updated Successfully | UI feedback + HTTP response | HTTP 200; success notification displayed; product details reflect the edited values; **only that product is changed** — other products remain unaffected | Valid admin edits an existing product with all mandatory fields valid | FR-15 |
| 3 | Product Deleted Successfully | UI feedback + HTTP response | HTTP 200; success notification displayed; the product is removed from the product list | Valid admin deletes an existing product by valid ID | FR-15 |
| 4 | Product List Displayed | UI state | All products rendered with Name, Price (₫ format), Image, Category; loading state shown while fetching | Admin views product list (`GET /api/products`) | FR-15, FR-05, FR-21 |
| 5 | Product Detail Displayed | UI state | Full product detail rendered: Name, Price, Description, Image, Category | Admin views single product (`GET /api/products/:id`) | FR-15, FR-06 |

---

#### B. Validation Error Outputs (Invalid Input)

| # | Output Variable | Output Type | Expected Value / Message | Condition | Source Req. ID |
|---|----------------|-------------|--------------------------|-----------|----------------|
| 6 | Product Name Empty Error | UI feedback / HTTP error | Error message above submit button: product name is required | `name` field is empty or null on create/edit | FR-15, FR-22 |
| 7 | Product Name Too Long Error | UI feedback / HTTP error | Error message above submit button: product name exceeds 255 characters | `name` length > 255 characters | FR-15, FR-22 |
| 8 | Price Missing / Zero / Negative Error | UI feedback / HTTP error | Error message above submit button: price must be a positive number | `price` is empty, zero, or negative on create/edit | FR-15, FR-22 |
| 9 | Price Non-Numeric Error | UI feedback / HTTP error | Error message above submit button: price must be a valid number | `price` is a non-numeric string | FR-15, FR-22 |
| 10 | Category Not Selected Error | UI feedback / HTTP error | Error message above submit button: category is required | `category_id` is empty/null or not selected on create/edit | FR-15, FR-22 |
| 11 | Category Invalid / Non-Existent Error | UI feedback / HTTP error | Error message: selected category does not exist | `category_id` references a non-existent category | FR-15 |
| 12 | Product ID Not Found Error (Edit/Delete) | HTTP error / UI feedback | HTTP 404 or appropriate error message; operation is aborted | `id` path param references a non-existent product | FR-15, API Spec §3.3 |
| 13 | Access Denied — No Token | HTTP error / redirect | HTTP 401 Unauthorized; user redirected to login or error page | Admin API called without `Authorization` header | FR-12, SEC-02 |
| 14 | Access Denied — Non-Admin Token | HTTP error / redirect | HTTP 403 Forbidden; operation rejected | Valid JWT present but `role ≠ 'admin'` | FR-12, SEC-03 |
| 15 | Isolation Guarantee — Other Products Unaffected | State validation | All other products remain unchanged after edit/delete of one product | After editing/deleting product X, all other products Y, Z... retain original data | FR-15 |
| 16 | XSS Prevention Output | UI output safety | User-supplied data (name, description, imageUrl) is rendered safely; no script execution | Malicious HTML/script injected in any product field | SEC-04 |

---

### Open Ambiguities (HITL Resolution Required)

- [X] ⚠️ AMBIGUITY [Description Field — Max Length]: SRS FR-15 does not specify a maximum character limit for the product `description` field. The API spec lists it as a free-text field with no constraint.
  → **Recommended clarification:** Ask the HITL to check the database schema for the `description` column type (e.g., TEXT vs VARCHAR(N)). Treat as unbounded string for EP purposes, but consider DB column limits as a system boundary for BVA.

- [X] ⚠️ AMBIGUITY [Image URL Field — Format Validation]: SRS FR-15 does not specify whether `imageUrl` must conform to a valid URL format (e.g., starting with `http://` or `https://`), or whether it can be a relative path or empty string.
  → **Recommended clarification:** Ask the HITL to inspect actual system behaviour: does the UI or API validate URL format? Is the field truly optional (can be submitted empty)? This determines whether to add an invalid EC for malformed URLs.

- [X] ⚠️ AMBIGUITY [Price Data Type — Integer vs Float]: SRS says "must be a positive number (> 0)" without specifying if decimal/float values (e.g., 99.99) are valid. The API spec example shows `"price": 100000` (integer). Vietnamese currency (₫) is typically integer.
  → **Recommended clarification:** Confirm whether decimal price values (e.g., 99.5) are valid or should be treated as invalid input. This affects EC partitioning for the price field.

- [X] ⚠️ AMBIGUITY [Category_id — Invalid Non-Integer Values]: SRS says category must be "selected from the existing list" (implying UI dropdown), but the API spec accepts a raw integer. It is unclear what happens if a non-integer value is passed directly to the API (e.g., via Postman with `category_id: "abc"`).
  → **Recommended clarification:** Confirm if non-integer category_id needs its own equivalence class (likely yes for API-level testing).

- [X] ⚠️ AMBIGUITY [HTTP Response Codes for CRUD Operations]: The API spec §3.3 does not explicitly document the HTTP status codes for successful Create (201 vs 200), successful Delete (200 vs 204), or specific error codes for validation failures (400, 404, 409). 
  → **Recommended clarification:** Observe actual system responses via Postman/cURL to confirm expected HTTP status codes, then lock them in as expected results.

- [X] ⚠️ AMBIGUITY [Delete Confirmation Dialog]: SRS FR-07 mentions a confirmation dialog for cart item removal, and FR-14 and FR-15 are silent on whether a confirmation dialog is required before deleting a product. 
  → **Recommended clarification:** Check the Web Admin UI to see if a delete confirmation dialog exists for products. If yes, add it as an output variable and add a test case for cancelling the deletion.

- [X] ⚠️ AMBIGUITY [Price = 0 vs Price < 0 — Same or Different Error?]: The SRS says price must be > 0, so both 0 and negative values are invalid. It is unclear if the system treats them as the same error class or produces different error messages.
  → **Recommended clarification:** Treat as two separate invalid ECs (price = 0 and price < 0) in Domain Analysis to maximise defect detection; verify during execution.

---

### Self-Audit Checklist

```
✅ Every input field in the FR's UI form is listed (Name, Price, Description, ImageURL, Category, Product ID)
✅ Every API request parameter is listed (path :id, request body fields, auth header)
✅ Every distinct output behaviour is listed (success states, error states, access control, isolation, XSS)
✅ Every variable is traced to a specific FR-XX or SEC-XX
✅ All ambiguities are flagged for HITL with recommended resolutions
```

---

**HITL Review:** Accepted
