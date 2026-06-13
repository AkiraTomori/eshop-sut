## Requirement Analysis — FR-06: View Product Details
**Date:** 2026-06-13 07:56
**Analyst:** Gemini QA Agent (reviewed by: Thái Minh Huy)
**SRS Version:** 2.0 (2026-05-14)

### Feature Scope
- **Platform:** Web Frontend
- **URL / Endpoint:** `http://localhost:5173/products/:id`
- **API Endpoints Used:**
  - `GET /api/products/:id` — Retrieve product detail data
  - `POST /api/cart` — Add product to shopping cart (requires `Authorization: Bearer <token>`)

### Source Requirements Referenced
The following SRS sections were consulted for this analysis:
- **FR-06** (§3 — View Product Details) — primary feature definition
- **FR-07** (§4 — Shopping Cart) — cart behaviour when adding the same product
- **FR-21** (§8 — General Interface Standards) — currency format, language, `<h1>` tag, tab order
- **FR-22** (§8 — Form Requirements) — required field indicators, error message placement
- **FR-23** (§8 — Navigation Requirements) — breadcrumbs on Product Detail, cart badge
- **FR-24** (§8 — Feedback & State Requirements) — toast/badge after Add to Cart, image alt text
- **SEC-02** (§9) — JWT Token required for authenticated APIs
- **SEC-04** (§9) — user-supplied data must be properly escaped; no direct `innerHTML`

---

### Input Variables

| # | Variable Name | Data Type | Constraints | Source Req. ID |
|---|--------------|-----------|-------------|----------------|
| 1 | `id` (URL path parameter) | integer | Must be a valid, existing product ID in the database. Passed as part of the URL path `/products/:id`. | FR-06, API §3.2 |
| 2 | `quantity` (UI input field) | integer | Accepts only **positive integers**; minimum value of **1**. This is a user-editable input field on the product detail page. | FR-06 |
| 3 | `id` (cart request body — product ID) | integer | Must match the product being viewed. Sent in the `POST /api/cart` request body as `"id"`. | API §4.2 |
| 4 | `name` (cart request body) | string | Product name. Sent in the `POST /api/cart` request body as `"name"`. Value comes from the displayed product data. | API §4.2 |
| 5 | `price` (cart request body) | number | Product price. Sent in the `POST /api/cart` request body as `"price"`. Value comes from the displayed product data. | API §4.2 |
| 6 | `quantity` (cart request body) | integer | The quantity selected by the user. Sent in the `POST /api/cart` request body as `"quantity"`. Must be a positive integer ≥ 1. | FR-06, API §4.2 |
| 7 | User authentication state | JWT Token / null | The `POST /api/cart` endpoint requires `Authorization: Bearer <token>` header. The user may or may not be logged in when viewing the product detail page. | SEC-02, API §4 |

---

### Output Variables

| # | Output Variable | Output Type | Expected Value / Message | Condition | Source Req. ID |
|---|----------------|-------------|--------------------------|-----------|----------------|
| 1 | Product detail display — Large Image | UI display | Large product image rendered with standard aspect ratio and a **non-empty `alt` attribute** describing the image content | Valid product ID in URL | FR-06, FR-24 |
| 2 | Product detail display — Name | UI display | Product name displayed in full | Valid product ID in URL | FR-06 |
| 3 | Product detail display — Price | UI display | Price displayed with `₫` symbol and thousands-separator formatting (e.g., `150,000 ₫`) | Valid product ID in URL | FR-06, FR-21 |
| 4 | Product detail display — Description | UI display | Full product description displayed; user-supplied content must be **properly escaped** (no raw HTML rendering) | Valid product ID in URL | FR-06, SEC-04 |
| 5 | Product detail display — Category | UI display | Product category name displayed | Valid product ID in URL | FR-06 |
| 6 | Quantity input field | UI form element | Input field displayed, pre-set to minimum value of 1, accepts only positive integers | Page load | FR-06 |
| 7 | Add to Cart button | UI button | Button visible and clickable | Page load | FR-06 |
| 8 | Add to Cart — Success feedback | UI feedback (toast/badge) | Visual feedback shown: toast notification and/or cart badge quantity update | User clicks "Add to Cart" with valid quantity while authenticated | FR-06, FR-24, FR-23 |
| 9 | Cart badge update | UI badge | The navbar "Cart" link badge updates to reflect the new total number of items in the cart | After successful Add to Cart | FR-23 |
| 10 | Cart quantity increment (same product) | State change | Adding the same product to the cart **increments its quantity** rather than creating a new row | Product already exists in cart, user adds it again | FR-07 |
| 11 | Breadcrumb navigation | UI navigation | Breadcrumbs displayed on the Product Detail sub-page | Page load | FR-23 |
| 12 | Page heading (`<h1>`) | UI / SEO | Exactly **one `<h1>` tag** on the page describing the page content | Page load | FR-21, FR-05 |
| 13 | Language consistency | UI display | Entire interface in English (except standard technical terms) | Page load | FR-21 |
| 14 | Color consistency — Add to Cart button | UI display | Positive action button (Add to Cart) uses **blue** colour | Page load | FR-21 |
| 15 | Tab order | UI accessibility | Focus order via Tab key goes from top to bottom, left to right | Keyboard navigation | FR-21 |
| 16 | Error — Invalid product ID (non-existent) | UI feedback / HTTP response | Appropriate error display or HTTP 404 when product ID does not exist in the database | Invalid / non-existent product `id` in URL | FR-06 |
| 17 | Error — Invalid quantity (non-positive / non-integer) | UI feedback | System rejects or prevents input; quantity field should not accept values ≤ 0 or non-integer values | User enters invalid quantity | FR-06 |
| 18 | Error — Add to Cart without authentication | UI feedback / HTTP response | API returns error (requires JWT Token); UI should display appropriate message or redirect to login | User clicks "Add to Cart" while not logged in | SEC-02 |

---

### Open Ambiguities (HITL Resolution Required)

- [ ] ⚠️ AMBIGUITY [`quantity` — maximum value]: FR-06 states the quantity field must accept "positive integers, minimum value of 1" but does **not specify a maximum value**. There is no upper bound defined in the SRS for the quantity input.
   → Recommended clarification: Check the SUT's actual UI constraints (e.g., HTML `max` attribute, spinner limits). For testing purposes, assume there is no spec-defined upper bound, but test system/UI boundaries (e.g., what happens at very large values like 999, 9999, or `MAX_INT`). Test both specification boundaries and system boundaries separately per BP-06.

- [ ] ⚠️ AMBIGUITY [`id` — format and range]: The SRS does not specify whether the product `id` is always a positive integer, what happens with `id=0`, negative IDs, non-numeric IDs (e.g., `abc`), or extremely large IDs.
   → Recommended clarification: Test with valid existing ID, valid non-existent ID, `id=0`, negative ID, non-numeric ID, and extremely large ID. Document the system's actual behaviour.

- [ ] ⚠️ AMBIGUITY [Add to Cart — unauthenticated user behaviour]: FR-06 states an "Add to Cart" button is shown, and `POST /api/cart` requires JWT auth (SEC-02). However, the SRS does not explicitly specify the **UI behaviour** when an unauthenticated user clicks "Add to Cart" (e.g., redirect to login? show error toast? disable the button?).
   → Recommended clarification: Observe the SUT's actual behaviour and document it. For test design, create test cases for both authenticated and unauthenticated scenarios.

- [ ] ⚠️ AMBIGUITY [`quantity` — input mechanism]: FR-06 mentions a "Quantity input field" but does not specify whether it is a free-text `<input type="number">`, a stepper with +/- buttons, or a dropdown. The input mechanism affects what invalid values can be entered (e.g., text input allows "abc", a stepper may not).
   → Recommended clarification: Inspect the SUT to determine the input type. Test both UI-level constraints (what the field allows) and API-level constraints (what the backend accepts).

- [ ] ⚠️ AMBIGUITY [Price display — decimal values]: FR-21 mandates `₫` symbol with thousands-separator formatting, but does not specify handling of decimal prices (e.g., `99,999.5 ₫` vs. `100,000 ₫`). The API spec shows `"price": 100000` as an integer example.
   → Recommended clarification: Determine whether prices in the database can be decimal (float) and how they are displayed. This affects display output testing.

---

### Self-Audit Checklist

```
[x] Every input field in the FR's UI form is listed (quantity, product ID in URL)
[x] Every API request parameter is listed (POST /api/cart body: id, name, price, quantity; auth header)
[x] Every distinct output behaviour is listed (display fields, feedback, errors, navigation elements)
[x] Every variable is traced to a specific FR-XX or SEC-XX
[x] All ambiguities are flagged for HITL
```

---

**HITL Review:** Accepted
