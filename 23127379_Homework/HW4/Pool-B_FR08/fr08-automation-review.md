# FR-08 Automation Review

**Stage:** AI generation complete — pending `/hw4-review FR-08`  
**Automation scope:** Browser UI only  
**Selected:** 14 UI test cases  
**Excluded:** 3 API-dependent test cases

## Generation architecture decision

- **Page object:** Expanded only `pages/checkout.page.ts`. The BasePage-derived class is justified because the 14 selected cases reuse home/cart setup, checkout navigation, item/total/address interactions, submission, validation, and UI cleanup.
- **Fixture:** Reused `userCheckoutPage` for authenticated fresh-context tests and `checkoutPage` for the anonymous flow. No fixture or infrastructure file changed.
- **Helper:** Kept small orchestration helpers local to the spec. No shared helper was introduced because the behavior belongs only to FR-08 and has no independent lifecycle.
- **Test data:** All URLs, routes, labels, product identity, addresses, boundary strings, expected messages, colours, counts, Bug IDs, and exact TC titles are in `fr08-test-data.json`.
- **Locator evidence:** `playwright-cli` is not installed. Locators were grounded in `frontend-web/src/pages/Home.jsx`, `Cart.jsx`, `Checkout.jsx`, `App.jsx`, and `context/CartContext.jsx`. The expected shipping-address locator is supplied from external canonical test data because current React source contains no such field.

## Traceability manifest

| Exact HW2 TC ID and title | Type | Browser UI path and data | UI-observable spec-correct result | Known Bug ID(s) | UI cleanup |
|---|---|---|---|---|---|
| **TC-FR08-EP-001** — Verify that checkout succeeds with a valid cart, authenticated user, and a valid shipping address | EP | Add `iPhone 15 Pro Max` from Home; open Cart; proceed; inspect items/heading/total/colour; enter 42-char address; submit | Checkout shows full items, one `h1`, formatted ₫ total, blue submit, success feedback, and empty cart | BUG-FR08-001, 002, 003 | Remove every cart row through UI and return Home |
| **TC-FR08-EP-002** — Verify that checkout proceeds without a coupon when the coupon field is left blank | EP | Add product through UI; leave coupon blank; retain displayed total; enter valid address; submit | Success feedback appears at the unchanged full total and the cart is cleared | None | Remove every cart row through UI and return Home |
| **TC-FR08-EP-003** — Verify that breadcrumb navigation and error message position are correct on the checkout page | EP | Add product; open Checkout; submit without address | Breadcrumb is visible and required-address error appears above submit | BUG-FR08-005, 006 | Remove every cart row through UI and return Home |
| **TC-FR08-NEG-001** — Verify that checkout is blocked when the user is not logged in (no JWT token) | NEG | Anonymous context; add product through UI; open Checkout; submit | Clear authentication-required dialog is shown; user remains blocked from completing checkout | None | Remove every cart row through UI and return Home |
| **TC-FR08-NEG-003** — Verify that checkout is blocked when the user's cart is empty | NEG | Authenticated fresh context; verify empty Cart; navigate to Checkout | Friendly empty state with illustration remains visible and checkout submission is unavailable | None | Verify/remove any UI rows and return Home |
| **TC-FR08-NEG-004** — Verify that checkout is rejected when the shipping address field is empty | NEG | Add product; leave address empty; submit | Required-address error appears above submit; checkout page and cart item remain | BUG-FR08-006, 007 | Remove every cart row through UI and return Home |
| **TC-FR08-NEG-006** — Verify that a shipping address consisting of only whitespace characters is rejected at checkout | NEG | Add product; enter five spaces; submit | Required-address error appears above submit; checkout page and cart item remain | BUG-FR08-006, 007 | Remove every cart row through UI and return Home |
| **TC-FR08-NEG-007** — Verify that the checkout page displays exactly one `<h1>` tag and no duplicate heading elements | NEG | Add product; open Checkout; inspect heading, button CSS, and total text | Exactly one named `h1`, blue submit button, and thousands-separated ₫ total | BUG-FR08-001, 002 | Remove every cart row through UI and return Home |
| **TC-FR08-BV-001** — Verify that a 1-character shipping address (minimum length) is accepted at checkout | BV | Add product; enter `A`; submit | Address control accepts one character; success feedback appears; cart clears | None | Remove every cart row through UI and return Home |
| **TC-FR08-BV-002** — Verify that a 2-character shipping address (LB+1) is accepted at checkout | BV | Add product; enter `AB`; submit | Address control accepts two characters; success feedback appears; cart clears | None | Remove every cart row through UI and return Home |
| **TC-FR08-BV-003** — Verify that a 254-character shipping address (UB-1) is accepted at checkout | BV | Add product; enter external 254-char value; submit | Full value remains in the control; success feedback appears; cart clears | None | Remove every cart row through UI and return Home |
| **TC-FR08-BV-004** — Verify that a 255-character shipping address (UB — maximum safe length) is accepted at checkout | BV | Add product; enter external 255-char value; submit | Full value remains in the control; success feedback appears; cart clears | None | Remove every cart row through UI and return Home |
| **TC-FR08-BV-005** — Verify that an empty shipping address (LB-1 = 0 chars) is rejected at checkout | BV | Add product; leave 0-char address; submit | Required-address error appears above submit; cart item remains | BUG-FR08-006, 007 | Remove every cart row through UI and return Home |
| **TC-FR08-BV-006** — Verify system behavior when a 256-character shipping address (UB+1) is submitted at checkout | BV | Add product; enter external 256-char value; submit | System rejects the over-limit address with a visible error; cart item remains | BUG-FR08-009 | Remove every cart row through UI and return Home |

## API-dependent exclusions

These cases are not automated and are not counted toward the 14 selected UI cases.

| Exact HW2 TC ID and title | Classification | UI replacement selected for HW4 |
|---|---|---|
| **TC-FR08-NEG-002** — Verify that checkout is rejected when the JWT token is malformed or expired | Out of HW4 scope — API testing | NEG-001 covers the user-visible unauthenticated path; malformed-token handling remains uncovered |
| **TC-FR08-NEG-005** — Verify that the backend ignores a tampered total_amount and recalculates the order total independently | Out of HW4 scope — API testing | EP-001/EP-002 assert the visible non-edited total and checkout UI only; backend tamper resistance remains uncovered |
| **TC-FR08-BV-007** — Verify system behavior when a 1000-character shipping address (DB stress boundary) is submitted at checkout | Out of HW4 scope — API testing | BV-006 covers the UI upper-invalid boundary; API/database stress and persistence remain uncovered |

## Hybrid clauses not covered by HW4

- EP-001: HTTP 200, stored `pending` status, and database/order-history persistence are not asserted. The current Web UI has no order-history route.
- EP-002: Stored full-total and `pending` status are not asserted; only the visible pre-submit total, success feedback, and cart state are covered.
- NEG-001: HTTP 401 and database non-creation are not asserted; only the user-visible rejection is covered.
- NEG-003, NEG-004, NEG-006, BV-005, and BV-006: Database non-creation and backend validation are not asserted.
- BV-003 and BV-004: Database storage length/truncation is not asserted; only the UI control value and visible checkout result are covered.
- Storage state supplies authenticated UI context, but no token, header, request, response, endpoint, or database content is inspected.

## Source discrepancies requiring HITL resolution

1. The revised HW2 file says FR-09 coupon content was removed, but EP-002 still explicitly depends on a coupon field. The generated case retains the exact authoritative TC and treats a blank coupon as a visible no-discount checkout condition.
2. HW2 EP-001 says the cart is cleared in its Expected Result and also reports it remained non-empty in Observed Result. The generated assertion follows the spec-correct Expected Result and known BUG-FR08-003 mapping.
3. HW2 BV-006 offers two “outcomes” but explicitly calls acceptance a defect finding. The generated assertion uses the resolved 255-character baseline from the test case and BUG-FR08-009: 256 characters must be rejected.
4. The detailed bug report describes BUG-FR08-005 as violating FR-22, while SRS assigns breadcrumbs to FR-23. No Bug ID remapping was made.
5. Current `Checkout.jsx` contains no shipping-address field and does not send a shipping address in the checkout UI action. This conflicts with the UI steps and observed results across the accepted HW2 test cases. Spec-correct field assertions are retained so browser evidence can classify the live implementation at F3/F4.

## Assertion-pattern inventory

- A1: `toHaveURL`
- A2/A8: `toBeVisible` / `not.toBeVisible`
- A3/A9: `toHaveText` / `toContain`
- A4: `toHaveValue`
- A5: `toHaveCount`
- A10: `toHaveCSS`
- Data integrity: `toHaveLength`

## Generation quality gate

- Exact HW2 IDs/titles: 14 selected UI cases.
- External data: JSON contains all test inputs and expected UI values.
- Isolation: fresh test-scoped contexts; `beforeEach` UI setup and `afterEach` UI cleanup in every describe.
- POM: only the FR-08 BasePage-derived class changed; fixtures/base/other FR page classes are untouched.
- Known defects: assertions remain spec-correct and Bug IDs are annotations, not skips.
- Browser execution: intentionally not run at F1.

**Human Review:** Pending HITL review

**Next gate:** `/hw4-review FR-08`
