# FR-08 Automation Review

**Stage:** Script review complete — pending HITL sign-off
**Automation scope:** Browser UI only
**Selected:** 14 UI test cases
**Excluded:** 3 API-dependent test cases

## Reviewed architecture decision

- **Page object:** `pages/checkout.page.ts` remains justified because the selected cases share product/cart setup, Profile address updates, checkout navigation, submission, validation, and UI cleanup. It still extends `BasePage`, contains no assertions, and stores no mutable test data.
- **Fixture:** The reviewed suite continues to use `userCheckoutPage` and `checkoutPage` from the shared test-scoped fixture. Neither `fixtures/eshop.fixture.ts` nor `pages/base.page.ts` changed.
- **Helper:** FR-local orchestration remains in the spec. Profile and cart interaction mechanics stay in the page object; expected values and assertions stay in the spec/data.
- **HITL correction:** The accepted generation audit notes that shipping address is maintained through Profile. Every address-bearing case now opens `/profile`, updates the exact external address through the UI, confirms the browser dialog, reloads Profile, verifies the persisted control value, returns to Cart, and proceeds to Checkout.
- **Locator evidence:** `playwright-cli` is unavailable. Locators were re-verified against `Home.jsx`, `Cart.jsx`, `Checkout.jsx`, `Profile.jsx`, `Login.jsx`, `App.jsx`, `AuthContext.jsx`, and `CartContext.jsx`.

## Selected UI traceability manifest

| Exact HW2 TC ID and title | Type | Reviewed browser UI path and data | Complete UI-observable spec-correct result | Known Bug ID(s) | UI cleanup |
|---|---|---|---|---|---|
| **TC-FR08-EP-001** — Verify that checkout succeeds with a valid cart, authenticated user, and a valid shipping address | EP | Add `iPhone 15 Pro Max`; update the 42-char Profile address; return to Cart; proceed; submit | Exact item/quantity/price, one `h1`, formatted total, blue action, success feedback, and empty cart | BUG-FR08-001, 002, 003 | Reset Profile address, remove cart rows, return Home |
| **TC-FR08-EP-002** — Verify that checkout proceeds without a coupon when the coupon field is left blank | EP | Add product; update valid Profile address; leave coupon blank; inspect full total; submit | Coupon remains blank; exact cart total is preserved and non-editable; checkout succeeds; cart clears | None | Reset Profile address, remove cart rows, return Home |
| **TC-FR08-EP-003** — Verify that breadcrumb navigation and error message position are correct on the checkout page | EP | Add product; set blank Profile address; proceed; submit | Breadcrumb is visible; required-address error is visible and geometrically above submit | BUG-FR08-005, 006 | Reset Profile address, remove cart rows, return Home |
| **TC-FR08-NEG-001** — Verify that checkout is blocked when the user is not logged in (no JWT token) | NEG | Anonymous context; add product; click Cart's normal checkout action | Authentication dialog is shown and browser redirects to Login | None | Remove cart rows through UI and return Home |
| **TC-FR08-NEG-003** — Verify that checkout is blocked when the user's cart is empty | NEG | Authenticated empty Cart; inspect empty state; open Checkout directly | Empty state includes friendly message and illustration; checkout action remains unavailable | None | Remove any cart rows and return Home |
| **TC-FR08-NEG-004** — Verify that checkout is rejected when the shipping address field is empty | NEG | Add product; update Profile with `""`; proceed; submit | Required-address error appears above submit; checkout and cart item remain | BUG-FR08-006, 007 | Reset Profile address, remove cart rows, return Home |
| **TC-FR08-NEG-006** — Verify that a shipping address consisting of only whitespace characters is rejected at checkout | NEG | Add product; update Profile with five spaces; proceed; submit | Required-address error appears above submit; checkout and cart item remain | BUG-FR08-006, 007 | Reset Profile address, remove cart rows, return Home |
| **TC-FR08-NEG-007** — Verify that the checkout page displays exactly one `<h1>` tag and no duplicate heading elements | NEG | Add product; update baseline Profile address; inspect Checkout | Exactly one named `h1`, blue submit button, and exact thousands-separated ₫ total | BUG-FR08-001, 002 | Reset Profile address, remove cart rows, return Home |
| **TC-FR08-BV-001** — Verify that a 1-character shipping address (minimum length) is accepted at checkout | BV | Update Profile with `A`; proceed; submit | Profile retains 1 character; success feedback appears; cart clears | None | Reset Profile address, remove cart rows, return Home |
| **TC-FR08-BV-002** — Verify that a 2-character shipping address (LB+1) is accepted at checkout | BV | Update Profile with `AB`; proceed; submit | Profile retains 2 characters; success feedback appears; cart clears | None | Reset Profile address, remove cart rows, return Home |
| **TC-FR08-BV-003** — Verify that a 254-character shipping address (UB-1) is accepted at checkout | BV | Update Profile with external 254-char value; proceed; submit | Profile retains all 254 characters; checkout succeeds; cart clears | None | Reset Profile address, remove cart rows, return Home |
| **TC-FR08-BV-004** — Verify that a 255-character shipping address (UB — maximum safe length) is accepted at checkout | BV | Update Profile with external 255-char value; proceed; submit | Profile retains all 255 characters; checkout succeeds; cart clears | None | Reset Profile address, remove cart rows, return Home |
| **TC-FR08-BV-005** — Verify that an empty shipping address (LB-1 = 0 chars) is rejected at checkout | BV | Update Profile with 0 chars; proceed; submit | Required-address error appears above submit; cart item remains | BUG-FR08-006, 007 | Reset Profile address, remove cart rows, return Home |
| **TC-FR08-BV-006** — Verify system behavior when a 256-character shipping address (UB+1) is submitted at checkout | BV | Update Profile with external 256-char value; proceed; submit | Visible over-limit error appears; checkout and cart item remain | BUG-FR08-009 | Reset Profile address, remove cart rows, return Home |

## Script-review findings and corrections

| Issue | Severity | Original pattern | Correction | Root cause |
|---|---|---|---|---|
| Shipping address was located on Checkout although current UI maintains it on Profile | High | `getByLabel("Địa chỉ giao hàng")` on `/checkout` | Added UI-only Profile update, dialog handling, reload, and persisted-value assertion before checkout | Generation followed the canonical checkout wording but lacked the later HITL workflow clarification |
| EP-002 compared the total input with its own one-time `inputValue()` snapshot | High | A mutable control was used as both actual and expected value | Added external cart total/input/formatted expectations and `not.toBeEditable()` | The original assertion could pass after client-side tampering and bypassed web-first checking |
| EP-001 checked only checkout item count | High | `checkoutItems.toHaveCount(1)` | Added an exact external item summary assertion covering product, quantity, and price | Count alone did not prove the full cart item list was displayed |
| Anonymous test waited only for a Checkout-submit dialog | High | Direct `/checkout` plus `waitForEvent('dialog')` could hang if the compliant outcome redirected | Uses the normal Cart checkout action, captures its authentication dialog, and asserts Login redirect | The canonical alternative outcome was encoded as a single fragile implementation branch |
| Dialog-triggering clicks were awaited before the dialog was dismissed | High | A modal browser dialog could block the awaited click and deadlock the test | Start the click, await/dismiss the dialog, then await click completion | Native dialogs pause page execution until handled |
| Error-position check depended on a CSS general-sibling relationship | Medium | `error.locator('~ button')` | Replaced with an `expect.poll` over source-independent bounding-box order | Visual order does not require the error and button to be siblings |
| Heading count used a raw `h1` CSS locator | Low | `page.locator('h1')` | Uses `getByRole('heading', { level: 1 })` | A semantic role/level expresses the same requirement more resiliently |
| Empty illustration depended on the message's immediate parent | Medium | `message.locator('..').getByRole('img')` | Uses the page's accessible image role after the empty message is established | The SRS requires an illustration, not a fixed DOM wrapper |
| Backend-only BUG-FR08-007 was exposed as browser report metadata | Medium | Every canonical Bug ID was annotated | Browser annotations are filtered through an external UI-observable Bug-ID allowlist; canonical mappings remain documented | A UI failure must not be reported as proof of the separate API validation defect |

## API-dependent exclusions

These cases are not automated and are not counted toward the 14 selected UI cases.

| Exact HW2 TC ID and title | Classification | UI replacement selected for HW4 |
|---|---|---|
| **TC-FR08-NEG-002** — Verify that checkout is rejected when the JWT token is malformed or expired | Out of HW4 scope — API testing | NEG-001 covers the user-visible anonymous path; malformed-token handling remains uncovered |
| **TC-FR08-NEG-005** — Verify that the backend ignores a tampered total_amount and recalculates the order total independently | Out of HW4 scope — API testing | EP-001/EP-002 assert the visible authoritative total and non-editability only; backend tamper resistance remains uncovered |
| **TC-FR08-BV-007** — Verify system behavior when a 1000-character shipping address (DB stress boundary) is submitted at checkout | Out of HW4 scope — API testing | BV-006 covers the UI upper-invalid boundary; API/database stress and persistence remain uncovered |

## Hybrid clauses not covered by HW4

- EP-001: HTTP 200, stored `pending` status, and order-history/database persistence are not asserted.
- EP-002: Server-stored full total and `pending` status are not asserted; visible total, non-editability, success, and cart state are covered.
- NEG-001: HTTP 401 and database non-creation are not asserted; only the UI dialog and Login redirect are covered.
- NEG-003, NEG-004, NEG-006, BV-005, and BV-006: Database non-creation and backend validation are not asserted.
- BV-003 and BV-004: The full value is verified after a browser reload on Profile, but database inspection is not performed.
- Storage state supplies authenticated browser context; no token, header, endpoint, request, response, interception, or database content is inspected.

## Source discrepancies requiring HITL resolution

1. The revised HW2 header says FR-09 coupon content was removed, while EP-002 still explicitly depends on a coupon field. The reviewed suite retains the exact authoritative TC and checks the current visible blank-coupon condition.
2. EP-001 Expected Result requires cart clearing, while its Observed Result says both that the cart cleared and that it remained non-empty. The assertion follows the spec-correct Expected Result and BUG-FR08-003.
3. BV-006 lists two possible observations but labels acceptance as the defect outcome. The reviewed assertion follows the HITL-resolved 255-character maximum and requires rejection at 256.
4. BUG-FR08-005 cites FR-22 for breadcrumbs, while SRS assigns breadcrumbs to FR-23. No Bug ID was remapped.
5. HW2 describes address entry at Checkout; current React source exposes address only on Profile and Checkout neither reads nor sends it. The accepted generation-audit note resolves the UI route for HW4: update Profile first, then preserve the spec-correct checkout rejection/success expectations.
6. Profile's current phone validator accepts 9–10 digits beginning with `1–9`, conflicting with SRS FR-04 (`0`, 10–11 digits). A fixed external UI-valid phone is used solely to permit Profile address setup; phone behavior is not claimed as FR-08 coverage.

## Genuinely non-automatable steps

None of the selected UI clauses is inherently manual. Colour uses `toHaveCSS`; heading structure uses accessible role plus level; error placement uses polled element geometry; address persistence is verified by a normal Profile reload. API/database clauses remain out of scope rather than being simulated.

## Expected known failures before F3

These are source-grounded expectations, not browser results or classifications:

- EP-001/NEG-007: Checkout uses `<h2>` and a green submit action (BUG-FR08-001/002).
- EP-001/EP-002 and valid boundaries: `Checkout.jsx` sets success but does not call `clearCart()` (BUG-FR08-003).
- EP-003: Breadcrumb and address-validation feedback are absent (BUG-FR08-005/006).
- NEG-003: Cart's empty state has no illustration, and direct Checkout still exposes submission.
- NEG-004/NEG-006/BV-005: No UI required/whitespace validation exists (BUG-FR08-006). Browser evidence cannot confirm backend-only BUG-FR08-007.
- BV-006: Profile and Checkout expose no 255-character enforcement or over-limit UI error (UI-observable portion of BUG-FR08-009).
- EP-002: The checkout total is a directly editable number input, contrary to SRS FR-08; F3 may reveal a new UI defect because HW2 has no mapped Bug ID for this clause.

## Assertion-pattern inventory

- A1: `toHaveURL`
- A2/A8: `toBeVisible` / `not.toBeVisible`
- A3/A9: `toHaveText` / `toContain`
- A4: `toHaveValue`
- A5: `toHaveCount`
- A10: `toHaveCSS`
- Additional web-first checks: `not.toBeEditable`, `expect.poll(...).toBe(true)`
- External data integrity: `toHaveLength`

## Fixture/POM architecture findings

- The BasePage-derived FR-08 class remains warranted for the repeated Profile/Cart/Checkout workflow.
- Fresh `userCheckoutPage` and `checkoutPage` contexts preserve browser isolation. `beforeEach` performs only UI setup; `afterEach` resets Profile address and removes cart rows through the UI.
- The test account phone is set to one fixed external UI-valid setup value on every address-bearing test because the current Profile form refuses an empty phone. No test depends on its previous phone value.
- Orders cannot be deleted through the user UI, so successful-test order records cannot be removed within HW4's UI-only boundary. The selected assertions do not depend on order count or order execution order.
- `productCard(...).locator('..')` remains the sole narrow structural locator because the current Home product card has no semantic container/test ID; it is source-verified and scoped by an exact product heading.
- Page objects retain interaction mechanics only. URLs, labels, phone/address values, totals, messages, colours, counts, Bug IDs, and exact test identity remain external.

## Final quality assessment

- All 14 exact HW2 UI TC IDs/titles remain selected; all three API-dependent cases are explicitly excluded.
- Every address-bearing case now includes the HITL-requested Profile update and persisted browser-control verification.
- All UI-observable expected clauses are asserted or explicitly disclosed as a source discrepancy/out-of-scope hybrid clause.
- Tests use the shared fixture, external JSON, fresh contexts, UI-only setup/cleanup, and spec-correct known-defect assertions.
- Browser execution was intentionally not run at F2. Static validation and three-project discovery passed before handoff.
- FR-08 is ready for HITL review of this correction set, then the next workflow command is `/hw4-run FR-08`.

**Human Review:** Pending HITL sign-off

**Next gate:** `/hw4-run FR-08`
