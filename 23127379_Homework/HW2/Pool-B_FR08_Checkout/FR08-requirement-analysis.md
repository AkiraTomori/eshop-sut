## Requirement Analysis — FR-08: Checkout (+ FR-09: Coupon Code)
**Date:** 2026-06-14 00:04
**Analyst:** Gemini QA Agent (reviewed by: Thái Minh Huy)
**SRS Version:** 2.0 (2026-05-14)

---

### Feature Scope

- **Platform:** Web Frontend
- **URL:** `http://localhost:5173/checkout`
- **API Endpoints Used:**
  - `POST /api/checkout` — place order
  - `POST /api/apply-coupon` — validate and apply coupon code
  - `GET /api/cart` — fetch current cart items for display

---

### Input Variables

| # | Variable Name | Data Type | Constraints | Source Req. ID |
|---|--------------|-----------|-------------|----------------|
| 1 | `shipping_address` | string | Mandatory; free-form text; displayed on the order; no stated max-length | FR-08, FR-18 |
| 2 | `total_amount` (client-sent) | float | Auto-calculated from cart; user cannot directly edit; backend MUST ignore/recalculate | FR-08 |
| 3 | `coupon_code` | string | Optional; must match an active coupon in the DB (`is_active = 1`) | FR-09 (C1) |
| 4 | `coupon expiry` (system field) | date | Current date must be < `expired_at` | FR-09 (C2) |
| 5 | `order total vs. min_order_amount` | float | Order total must be >= `min_order_amount` for the coupon to be valid | FR-09 (C3) |
| 6 | `user_id` / JWT Token | string (Bearer token) | User must be logged in; valid JWT required; sent via `Authorization: Bearer <token>` header | FR-08, FR-09 (C4), SEC-02 |
| 7 | `usage_count` (per user, per coupon) | integer | Number of times user has used the coupon must be < `max_uses_per_user` | FR-09 (C5) |
| 8 | `cart items` (system state) | array | Cart must not be empty for checkout to proceed (implied by FR-07, FR-08) | FR-07, FR-08 |
| 9 | `discount_value` (coupon attribute) | float / integer | Used in discount calculation: percent (0–100) or fixed (positive number > 0) | FR-09, FR-17 |
| 10 | `coupon type` | enum | `percent` or `fixed` | FR-09, FR-17 |

---

### Output Variables

| # | Output Variable | Output Type | Expected Value / Message | Condition | Source Req. ID |
|---|----------------|-------------|--------------------------|-----------|----------------|
| 1 | Successful order placement | HTTP response + UI redirect/state change | HTTP 200; cart is cleared; order record created with status `pending` | All inputs valid, user logged in, cart non-empty | FR-08, FR-10 |
| 2 | Cart cleared after checkout | UI state change | Shopping cart becomes empty | After successful checkout | FR-08 |
| 3 | Order item list display | UI feedback | Full list of items being ordered is shown on checkout page | User navigates to checkout | FR-08 |
| 4 | Total amount display | UI feedback | Auto-calculated total shown in ₫ with thousands-separator formatting; cannot be edited | Always on checkout page | FR-08, FR-21 |
| 5 | Coupon discount applied — percent type | UI feedback + API response | `discount_amount = total × discount_value / 100`; `final_amount = total − discount_amount` shown | Coupon valid, type = `percent` | FR-09 |
| 6 | Coupon discount applied — fixed type | UI feedback + API response | `discount_amount = discount_value`; `final_amount = total − discount_amount` shown | Coupon valid, type = `fixed` | FR-09 |
| 7 | Coupon rejection — code not found / inactive | UI error feedback | Error message shown (code does not exist or is inactive) | C1 fails | FR-09 (C1) |
| 8 | Coupon rejection — expired | UI error feedback | Error message shown (coupon has expired) | C2 fails (`current_date >= expired_at`) | FR-09 (C2) |
| 9 | Coupon rejection — order below minimum | UI error feedback | Error message shown (order total < `min_order_amount`) | C3 fails | FR-09 (C3) |
| 10 | Checkout rejected — user not logged in | HTTP 401 + UI redirect/error | Redirected to login page or error shown | User has no valid JWT | FR-08, SEC-02 |
| 11 | Coupon rejection — usage limit reached | UI error feedback | Error message shown (user has exceeded `max_uses_per_user`) | C5 fails | FR-09 (C5) |
| 12 | Backend total recalculation | Server-side behaviour | Server ignores `total_amount` from request body; recalculates from cart items in DB | Any checkout request | FR-08 |
| 13 | Breadcrumb navigation display | UI element | Breadcrumb trail visible on Checkout page (e.g., Home > Cart > Checkout) | User on checkout page | FR-23 |
| 14 | Page title (`<h1>`) | UI element | Exactly one `<h1>` tag on the checkout page | Page load | FR-21, FR-05 |
| 15 | Error message position | UI feedback | Error messages appear **above** the submit/checkout button | Any validation error | FR-22 |
| 16 | Submit/Checkout button color | UI element | Blue color (positive action) | Normal state | FR-21 |

---

### Open Ambiguities (HITL Resolution Required)

- [ ] ⚠️ **AMBIGUITY [shipping_address — max length]:** The SRS (FR-08) does not define a maximum character length for `shipping_address`. The API spec shows a sample value of ~50 chars but sets no hard limit.
  → **Recommended clarification:** Assume no hard upper limit at the UI level; test with very long strings (e.g., 1000+ chars) to find the actual DB/API boundary. Confirm with HITL.

- [ ] ⚠️ **AMBIGUITY [empty cart checkout]:** The SRS states the cart is cleared after checkout (FR-08) but does not explicitly state that checkout is blocked when the cart is empty. It is implied by business logic (you cannot order zero items).
  → **Recommended clarification:** Confirm whether the UI/backend blocks checkout with an empty cart and what error message is expected.

- [ ] ⚠️ **AMBIGUITY [coupon — C2 boundary precision]:** FR-09 states "current date must be before `expired_at`", but does not specify whether the comparison is date-only (YYYY-MM-DD) or includes time (datetime). The sample `EXPIRED` coupon has `expired_at = 2020-01-01`.
  → **Recommended clarification:** Confirm if expiry is checked at midnight of the expiry date or at the exact second.

- [ ] ⚠️ **AMBIGUITY [total_amount field in checkout request]:** `POST /api/checkout` request body includes `total_amount` (per API spec §4.3), but FR-08 states the backend must recalculate and must NOT accept the client value. It is unclear if the field is simply ignored or causes an error if omitted.
  → **Recommended clarification:** Test whether omitting `total_amount` from the request causes a 400 error or is handled gracefully by the backend.

- [ ] ⚠️ **AMBIGUITY [coupon discount — rounding]:** FR-09 percent formula is `total × discount_value / 100`. No rounding rule (floor, ceil, round) is specified for non-integer results (e.g., 500,001 × 10% = 50,000.1 ₫).
  → **Recommended clarification:** Confirm expected rounding behavior for percent-type coupons.

---

### Self-Audit Checklist

```
[x] Every input field in the FR-08 + FR-09 UI form is listed
[x] Every API request parameter is listed (POST /api/checkout, POST /api/apply-coupon)
[x] Every distinct output behaviour is listed (success, all 5 coupon failure modes, auth failure, UI outputs)
[x] Every variable is traced to a specific FR-XX or SEC-XX
[x] All ambiguities are flagged for HITL
```

---

**HITL Review:** Accepted
