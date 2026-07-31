# FR-06 Automation Review

**Stage:** Generated — pending `/hw4-review FR-06`  
**Automation scope:** Browser UI only  
**Selected:** 22 UI test cases  
**Excluded:** 9 API-dependent test cases

## Generation architecture decision

- **Page object:** Retained and expanded `pages/product-detail.page.ts` because the selected cases reuse product display, quantity, navigation, feedback, cart verification, focus, and UI cleanup interactions. It remains BasePage-derived and contains no assertions or test data.
- **Fixtures:** The shared fixture remains the lifecycle owner. Public tests use `productDetailPage`; authenticated tests use the fresh `userPage` fixture and bind the same FR-06 page class locally because infrastructure does not expose an authenticated FR-06 page-object fixture and F1 is prohibited from editing `eshop.fixture.ts`.
- **Helper:** One local, stateless factory binds `userPage` to `ProductDetailPage`; one setup helper establishes EP-004's cart precondition through the UI. No additional shared helper or component was justified.
- **Locator evidence:** `playwright-cli` was not installed. Locators were grounded in the current React sources `ProductDetail.jsx`, `Cart.jsx`, `App.jsx`, and `CartContext.jsx`.

## Selected UI traceability manifest

All assertions below preserve the HW2 spec-correct result. Known defective behavior is not accepted merely because it is present in the React source.

| TC ID and exact HW2 title | Type | UI data and actions | Complete UI-observable expected result | Known Bug | UI cleanup |
|---|---|---|---|---|---|
| **TC-FR06-EP-001** — Verify that product detail page displays all required fields correctly with a valid product ID | EP | Open product 1; inspect image, name, price, description, category, breadcrumb, h1, language, button colour, and keyboard focus | URL is product 1; all five fields render; image alt is descriptive; price is formatted with `₫`; breadcrumb is visible; exactly one h1 exists; document is Vietnamese; positive action is blue; focus follows visual order | BUG-FR06-001 | Open cart, remove UI rows, return home |
| **TC-FR06-EP-002** — Verify that quantity input field defaults to 1 and accepts valid positive integers | EP | Product 1; default `1`, then enter `5` | Quantity has value `1`, accepts `5`, and displays `5` | None | Open cart, remove UI rows, return home |
| **TC-FR06-EP-003** — Verify that Add to Cart succeeds with valid quantity for an authenticated user | EP | Authenticated user; product 1; quantity `3`; click once | Visible success feedback appears and the navbar cart badge displays `3` | None | Open cart, remove UI rows, return home |
| **TC-FR06-EP-004** — Verify that adding the same product to cart increments quantity instead of creating a new row | EP | Establish quantity `2` through UI; add `1`; inspect cart | Exactly one product row exists with quantity `3`; no duplicate row | BUG-FR06-002 | Remove all cart rows through UI, return home |
| **TC-FR06-NEG-001** — Verify that product detail page shows error when navigating with a non-existent product ID | NEG | Open product `99999` | A visible product-not-found message appears; no product h1 or blank/crashed page | None | Open cart, remove UI rows, return home |
| **TC-FR06-NEG-002** — Verify that product detail page shows error when product ID is zero | NEG | Open product `0` | A visible product-not-found message appears; no product h1 or blank/crashed page | None | Open cart, remove UI rows, return home |
| **TC-FR06-NEG-003** — Verify that product detail page shows error when product ID is a negative integer | NEG | Open product `-1` | A visible product-not-found message appears; no product h1 or blank/crashed page | None | Open cart, remove UI rows, return home |
| **TC-FR06-NEG-004** — Verify that product detail page shows error when product ID is a non-numeric string | NEG | Open product `abc` | Input is safely handled; visible product-not-found message appears; no product h1, raw markup, or crash | None | Open cart, remove UI rows, return home |
| **TC-FR06-NEG-005** — Verify that product detail page handles an extremely large product ID gracefully | NEG | Open product `9999999999999` | Visible product-not-found message appears; no blank/crashed page | None | Open cart, remove UI rows, return home |
| **TC-FR06-NEG-006** — Verify that quantity field rejects zero value on the product detail page | NEG | Authenticated; enter `0`; click once; inspect native/UI validation and cart | Native or visible UI validation blocks the action; product does not appear in cart | BUG-FR06-003 | Remove all cart rows through UI, return home |
| **TC-FR06-NEG-007** — Verify that quantity field rejects negative integer on the product detail page | NEG | Authenticated; enter `-1`; click once; inspect native/UI validation and cart | Native or visible UI validation blocks the action; product does not appear in cart | BUG-FR06-004 | Remove all cart rows through UI, return home |
| **TC-FR06-NEG-008** — Verify that quantity field rejects decimal value on the product detail page | NEG | Authenticated; enter `1.5`; click once; inspect validation/cart | Decimal is rejected with visible validation, or the canonical TC's permitted safe conversion stores integer `1`; decimal is never stored as-is | BUG-FR06-005 | Remove all cart rows through UI, return home |
| **TC-FR06-NEG-009** — Verify that quantity field rejects non-numeric string input on the product detail page | NEG | Authenticated; type `abc` with real keyboard events into `type=number`; click once; inspect cart | Browser/UI prevents `abc` from becoming the control value and no invalid cart row is added | BUG-FR06-006 | Remove all cart rows through UI, return home |
| **TC-FR06-NEG-010** — Verify that quantity field rejects empty value on the product detail page | NEG | Authenticated; clear quantity; click once; inspect native/UI validation and cart | Required/native or visible UI validation blocks the action; product does not appear in cart | BUG-FR06-007 | Remove all cart rows through UI, return home |
| **TC-FR06-NEG-011** — Verify that system handles extremely large quantity value on the product detail page | NEG | Authenticated; enter `999999999`; click once; inspect validation or cart total | Value is rejected/capped with visible validation, or, as the canonical TC permits, accepted with quantity and total rendered without NaN/overflow/crash | BUG-FR06-008 | Remove all cart rows through UI, return home |
| **TC-FR06-NEG-012** — Verify that Add to Cart is blocked for an unauthenticated user on the product detail page | NEG | Anonymous; product 1; quantity `1`; click once | Redirect to login or visible authentication alert; no anonymous cart row | BUG-FR06-009 | Open cart, remove UI rows, return home |
| **TC-FR06-BV-001** — Verify that product detail page loads correctly with the smallest valid product ID (id=1) | BV | Open product `1`; inspect five fields | Product 1 URL loads with image, full name, formatted price, description, and category | BUG-FR06-016 | Open cart, remove UI rows, return home |
| **TC-FR06-BV-002** — Verify that product detail page loads correctly with the second smallest product ID (id=2) | BV | Open product `2`; inspect five fields | Product 2 URL loads with image, full name, formatted price, description, and category | BUG-FR06-017 | Open cart, remove UI rows, return home |
| **TC-FR06-BV-003** — Verify that quantity field accepts the minimum valid value of 1 and Add to Cart succeeds | BV | Authenticated; quantity `1`; click once | Success feedback appears; cart shows quantity `1` and correct total | None | Remove all cart rows through UI, return home |
| **TC-FR06-BV-004** — Verify that quantity field accepts the value 2 (one above minimum boundary) | BV | Authenticated; quantity `2`; click once | Success feedback appears; cart shows quantity `2` and correct total | None | Remove all cart rows through UI, return home |
| **TC-FR06-BV-005** — Verify that quantity field accepts the system UI baseline upper boundary of 999 | BV | Authenticated; quantity `999`; click once; inspect validation or cart | Graceful validation is accepted; otherwise cart shows quantity `999` and correct non-overflowing total | None | Remove all cart rows through UI, return home |
| **TC-FR06-BV-008** — Verify that quantity field handles an extremely large integer value on the UI input form (UI Upper Boundary Probe) | BV | Authenticated; quantity `999999999`; click once; inspect native/UI validation and cart | Native or visible UI validation enforces practical maximum `999`; no cart row is submitted | BUG-FR06-008 | Remove all cart rows through UI, return home |

## API-dependent exclusions

These cases are not automated and are not counted toward the 22 selected UI cases.

| TC ID and exact HW2 title | Classification |
|---|---|
| **TC-FR06-NEG-013** — Verify that API rejects Add to Cart request with a non-existent product ID via direct API call | Out of HW4 scope — API testing |
| **TC-FR06-NEG-014** — Verify that API rejects Add to Cart request with a tampered zero price via direct API call | Out of HW4 scope — API testing |
| **TC-FR06-NEG-015** — Verify that API rejects Add to Cart request with a negative price via direct API call | Out of HW4 scope — API testing |
| **TC-FR06-NEG-016** — Verify that API rejects Add to Cart request with zero quantity via direct API call | Out of HW4 scope — API testing |
| **TC-FR06-NEG-017** — Verify that API rejects Add to Cart request with NaN quantity via direct API call | Out of HW4 scope — API testing |
| **TC-FR06-NEG-018** — Verify that API rejects Add to Cart request with tampered low price via direct API call | Out of HW4 scope — API testing |
| **TC-FR06-BV-006** — Verify that API handles cart request with the minimum valid price of 1₫ via direct API call | Out of HW4 scope — API testing |
| **TC-FR06-BV-007** — Verify that API rejects cart request with negative quantity of -1 via direct API call | Out of HW4 scope — API testing |
| **TC-FR06-BV-009** — Verify that API handles cart requests with an extremely large quantity parameter as a server-side stress test (DB Boundary Bypass — HVF-03 / BUG-FR06-020 Core Probe) | Out of HW4 scope — API testing |

## Hybrid clauses not covered by HW4

- NEG-001 and NEG-002: API HTTP 404 clauses are not asserted; only the primary UI error state is automated.
- NEG-005 and NEG-011: HTTP 500/status clauses are not asserted; only UI stability, visible validation, quantity, and rendered total are covered.
- EP-003: Token/header validity is supplied by the approved storage-state fixture but no token or request header is inspected.
- All cart setup, verification, and cleanup use visible browser UI. No direct endpoint, response, interception, or database assertion is present.

## Source discrepancies requiring HITL resolution

1. EP-001's description says “English language,” while its steps, Expected Result, SRS FR-21, and observed comparison require Vietnamese. The generated assertion follows the higher-confidence Expected Result plus SRS and expects `lang=vi`.
2. NEG-008's Expected Result permits safe truncation/rounding, but its title says “rejects,” its Failed status treats truncation as defective, and BUG-FR06-005 requires prevention or user notification. The generated test preserves the canonical TC Expected Result by accepting visible rejection or safe integer `1`; HITL should decide whether notification is mandatory.
3. NEG-011 permits acceptance when the total is correct and no overflow occurs, while its Failed status and BUG-FR06-008 frame lack of an upper bound as the defect. The generated NEG-011 follows the TC Expected Result; BV-008 separately asserts the practical maximum.
4. The detailed BUG-FR06-020 report links `TC-FR06-BV-008`, but the canonical test-case file maps BUG-FR06-020 to API-only `TC-FR06-BV-009`. No remapping was guessed; BV-009 remains excluded pending HITL correction.
5. The HW2 narrative for NEG-009 says a `type=number` input accepted `abc`. Current React source still declares `type=number`; the generated browser test uses normal keyboard events and prohibits programmatic value injection. HITL should compare the three-browser evidence at F3 before retaining or revising BUG-FR06-006.

## Generation-time risks for script review

- Current React source suppresses the first Add to Cart click via `clickCount`; this behavior is absent from the HW2 mappings. Tests preserve the HW2 one-click steps. EP-004 uses a UI-visible adaptive retry only to establish its precondition, not for the action under test.
- The current navbar source has no cart quantity badge, category field, or breadcrumb. Assertions remain spec-correct and are expected to expose those known defects.
- Product-not-found rendering is grounded in the current React message. F2 should verify it against a running SUT and adjust only if the user-visible DOM differs.

## F1 quality snapshot

- External JSON contains URLs, inputs, boundaries, labels, and expected values.
- Spec imports the shared custom `test`/`expect`, uses fresh public/authenticated pages, and has `beforeEach`/`afterEach`.
- Assertions include URL, visibility, text, value, attribute, count, CSS, focus, and negative cart-state patterns.
- Full browser evidence has intentionally not been run. The next gate is `/hw4-review FR-06`.
