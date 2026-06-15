## Requirement Analysis — FR-08: Checkout
**Date:** 2026-06-14 00:04 (revised: 2026-06-15 — FR-09 coupon content removed)
**Analyst:** Gemini QA Agent (reviewed by: Thái Minh Huy)
**SRS Version:** 2.0 (2026-05-14)

---

### Feature Scope

- **Platform:** Web Frontend
- **URL:** `http://localhost:5173/checkout`
- **API Endpoints Used:**
  - `POST /api/checkout` — place order
  - `GET /api/cart` — fetch current cart items for display

---

### Input Variables

| # | Variable Name | Data Type | Constraints | Source Req. ID |
|---|--------------|-----------|-------------|----------------|
| 1 | `shipping_address` | string | Mandatory; free-form text; displayed on the order; no stated max-length in SRS | FR-08, FR-18 |
| 2 | `total_amount` (client-sent) | float | Auto-calculated from cart; user cannot directly edit; backend MUST ignore and recalculate from server-side cart | FR-08 |
| 3 | `user_id` / JWT Token | string (Bearer token) | User must be logged in; valid JWT required; sent via `Authorization: Bearer <token>` header | FR-08, SEC-02 |
| 4 | `cart items` (system state) | array | Cart must not be empty for checkout to proceed (implied by FR-07, FR-08) | FR-07, FR-08 |

---

### Output Variables

| # | Output Variable | Output Type | Expected Value / Message | Condition | Source Req. ID |
|---|----------------|-------------|--------------------------|-----------|----------------|
| 1 | Successful order placement | HTTP response + UI redirect/state change | HTTP 200; cart is cleared; order record created with status `pending` | All inputs valid, user logged in, cart non-empty | FR-08, FR-10 |
| 2 | Cart cleared after checkout | UI state change | Shopping cart becomes empty (0 items) | After successful checkout | FR-08 |
| 3 | Order item list display | UI feedback | Full list of items being ordered is shown on checkout page | User navigates to checkout | FR-08 |
| 4 | Total amount display | UI feedback | Auto-calculated total shown in ₫ with thousands-separator formatting; cannot be edited by user | Always on checkout page | FR-08, FR-21 |
| 5 | Checkout rejected — user not logged in | HTTP 401 + UI redirect/error | Redirected to login page or error shown | User has no valid JWT | FR-08, SEC-02 |
| 6 | Backend total recalculation | Server-side behaviour | Server ignores `total_amount` from request body; recalculates from cart items in DB | Any checkout request | FR-08 |
| 7 | Breadcrumb navigation display | UI element | Breadcrumb trail visible on Checkout page (e.g., Trang chủ > Giỏ hàng > Thanh toán) | User on checkout page | FR-23 |
| 8 | Page title (`<h1>`) | UI element | Exactly one `<h1>` tag on the checkout page | Page load | FR-21, FR-05 |
| 9 | Error message position | UI feedback | Error messages appear **above** the submit/checkout button | Any validation error | FR-22 |
| 10 | Submit/Checkout button color | UI element | Blue color (positive action) | Normal state | FR-21 |

---

### Open Ambiguities (HITL Resolution Required)

- [x] ⚠️ **AMBIGUITY [shipping_address — max length]:** The SRS (FR-08) does not define a maximum character length for `shipping_address`. The API spec shows a sample value of ~50 chars but sets no hard limit.
  → **HITL Resolution:** Treat 255 characters as the baseline maximum (common DB VARCHAR default). Test with 256+ chars to discover the actual DB/API boundary.

- [x] ⚠️ **AMBIGUITY [empty cart checkout]:** The SRS states the cart is cleared after checkout (FR-08) but does not explicitly state that checkout is blocked when the cart is empty.
  → **HITL Resolution:** Confirmed — system blocks checkout with an empty cart and shows empty-state UI.

- [ ] ⚠️ **AMBIGUITY [`total_amount` field in checkout request]:** `POST /api/checkout` request body includes `total_amount` (per API spec §4.3), but FR-08 states the backend must recalculate and must NOT accept the client value. It is unclear if the field is simply ignored or causes an error if omitted.
  → **Recommended clarification:** Test whether omitting `total_amount` from the request causes a 400 error or is handled gracefully by the backend.

---

### Self-Audit Checklist

```
[x] Every input field in the FR-08 UI form is listed
[x] Every API request parameter for POST /api/checkout is listed
[x] Every distinct output behaviour is listed (success, auth failure, validation failure, UI outputs)
[x] Every variable is traced to a specific FR-XX or SEC-XX
[x] Coupon / FR-09 variables have been removed from scope
```

---

**HITL Review:** Accepted (revised 2026-06-15 — FR-09 content removed)
