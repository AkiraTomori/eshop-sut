# FR-06 Automation Review

**Stage:** Browser evidence classified — pending HITL audit sign-off
**Automation scope:** Browser UI only  
**Selected:** 22 UI test cases  
**Excluded:** 9 API-dependent test cases

## Generation architecture decision

- **Page object:** Retained and expanded `pages/product-detail.page.ts` because the selected cases reuse product display, quantity, navigation, feedback, cart verification, focus, and UI cleanup interactions. It remains BasePage-derived and contains no assertions or test data.
- **Fixtures:** The shared fixture remains the lifecycle owner. Public tests use `productDetailPage`; authenticated tests use the fresh `userPage` fixture and bind the same FR-06 page class locally because infrastructure does not expose an authenticated FR-06 page-object fixture and F1 is prohibited from editing `eshop.fixture.ts`.
- **Helper:** One local, stateless factory binds `userPage` to `ProductDetailPage`. The generated adaptive setup helper was removed because it compensated for defective first-click behavior. No additional shared helper or component is justified.
- **Locator evidence:** `playwright-cli` was not installed. Locators were grounded in the current React sources `ProductDetail.jsx`, `Cart.jsx`, `App.jsx`, and `CartContext.jsx`.

## Selected UI traceability manifest

All assertions below preserve the HW2 spec-correct result. Known defective behavior is not accepted merely because it is present in the React source.

| TC ID and exact HW2 title | Type | UI data and actions | Complete UI-observable expected result | Known Bug | UI cleanup |
|---|---|---|---|---|---|
| **TC-FR06-EP-001** — Verify that product detail page displays all required fields correctly with a valid product ID | EP | Open product 1; inspect image, name, price, description, category, breadcrumb, h1, visible language, button colour, and keyboard focus | URL is product 1; all five fields render; image alt is descriptive; price is formatted with `₫`; breadcrumb is visible; exactly one h1 exists; visible interface labels are Vietnamese; positive action is blue; focus follows visual order | BUG-FR06-001 | Open cart, remove UI rows, return home |
| **TC-FR06-EP-002** — Verify that quantity input field defaults to 1 and accepts valid positive integers | EP | Product 1; default `1`, then enter `5` | Quantity has value `1`, accepts `5`, and displays `5` | None | Open cart, remove UI rows, return home |
| **TC-FR06-EP-003** — Verify that Add to Cart succeeds with valid quantity for an authenticated user | EP | Authenticated user; product 1; quantity `3`; click once | Visible success feedback appears and the navbar cart badge displays `3` | None | Open cart, remove UI rows, return home |
| **TC-FR06-EP-004** — Verify that adding the same product to cart increments quantity instead of creating a new row | EP | Establish quantity `2` through UI; add `1`; inspect cart | Exactly one product row exists with quantity `3`; no duplicate row; total is `90,000,000 ₫` | BUG-FR06-002 | Remove all cart rows through UI, return home |
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

## Script-review findings and corrections

| Issue | Severity | Original pattern | Correction | Root cause |
|---|---|---|---|---|
| Alternative validation/cart outcomes used `isVisible()`, `getAttribute()`, and `count()` branches | High | One-time resolved booleans selected which assertions ran | Replaced with web-first `Locator.or()` assertions and scoped acceptable-outcome locators | Generated logic attempted to encode canonical “reject or handle safely” alternatives imperatively |
| EP-004 setup retried Add to Cart when feedback was absent | High | Adaptive second click compensated for `clickCount` | Removed retry; setup now performs the exact one-click UI action and asserts feedback | Generation optimized around buggy React behavior, which could mask a new first-click defect |
| Product price, description, image, and quantity used CSS selectors | Medium | Tailwind class and element-attribute selectors | Replaced primary locators with `getByRole()` and exact visible-text locators | Source inspection was used, but locator resilience hierarchy was not applied strictly enough |
| Vietnamese-language check required `html[lang=vi]` | Medium | `toHaveAttribute('lang', 'vi')` | Replaced with assertions on visible Vietnamese quantity/action/navigation labels | SRS requires visible language consistency, not a particular document metadata implementation |
| Cart total assertion used an unscoped exact amount | High | `getByText(amount)` could match unit price, subtotal, and summary | Added cart-row quantity/subtotal filtering and a label-scoped cart-summary locator | Repeated currency values make global text locators strict-mode ambiguous |
| Known Bug IDs existed only in JSON/review | Medium | Test reports did not expose mappings | Added `known-bug` annotations from external data without skipping or inverting tests | Traceability data was not connected to Playwright report metadata |
| EP-004 omitted the expected cart-total clause | High | Row count and quantity only | Added external expected total and a scoped total assertion | Generation implemented only the primary duplicate-row outcome |
| EP-001 stopped at the first independent display defect | Low | All checklist assertions were hard | Made independent known-defect display checks soft while retaining hard navigation/core-content assertions | A checklist-style TC benefits from collecting category, breadcrumb, and colour failures together |

## API-dependent exclusions

These cases are not automated and are not counted toward the 22 selected UI cases.

| TC ID and exact HW2 title | Classification | UI replacement selected for HW4 |
|---|---|---|
| **TC-FR06-NEG-013** — Verify that API rejects Add to Cart request with a non-existent product ID via direct API call | Out of HW4 scope — API testing | NEG-001 covers the non-existent product through the UI; it does not replace server validation |
| **TC-FR06-NEG-014** — Verify that API rejects Add to Cart request with a tampered zero price via direct API call | Out of HW4 scope — API testing | BV-001 preserves required product/price display coverage; price tampering remains uncovered |
| **TC-FR06-NEG-015** — Verify that API rejects Add to Cart request with a negative price via direct API call | Out of HW4 scope — API testing | BV-002 adds a second valid UI product boundary; negative-price server validation remains uncovered |
| **TC-FR06-NEG-016** — Verify that API rejects Add to Cart request with zero quantity via direct API call | Out of HW4 scope — API testing | NEG-006 covers zero quantity through the UI |
| **TC-FR06-NEG-017** — Verify that API rejects Add to Cart request with NaN quantity via direct API call | Out of HW4 scope — API testing | NEG-009 and NEG-010 cover non-numeric/empty quantity through normal UI input |
| **TC-FR06-NEG-018** — Verify that API rejects Add to Cart request with tampered low price via direct API call | Out of HW4 scope — API testing | EP-001 verifies authoritative displayed price only; tamper resistance remains uncovered |
| **TC-FR06-BV-006** — Verify that API handles cart request with the minimum valid price of 1₫ via direct API call | Out of HW4 scope — API testing | BV-003 supplies an eligible UI lower-boundary quantity case; price API boundary remains uncovered |
| **TC-FR06-BV-007** — Verify that API rejects cart request with negative quantity of -1 via direct API call | Out of HW4 scope — API testing | NEG-007 covers negative quantity through the UI |
| **TC-FR06-BV-009** — Verify that API handles cart requests with an extremely large quantity parameter as a server-side stress test (DB Boundary Bypass — HVF-03 / BUG-FR06-020 Core Probe) | Out of HW4 scope — API testing | NEG-011 and BV-008 cover the extreme value through the UI; database/server stress remains uncovered |

## Hybrid clauses not covered by HW4

- NEG-001 and NEG-002: API HTTP 404 clauses are not asserted; only the primary UI error state is automated.
- NEG-005 and NEG-011: HTTP 500/status clauses are not asserted; only UI stability, visible validation, quantity, and rendered total are covered.
- EP-003: Token/header validity is supplied by the approved storage-state fixture but no token or request header is inspected.
- All cart setup, verification, and cleanup use visible browser UI. No direct endpoint, response, interception, or database assertion is present.

## Source discrepancies requiring HITL resolution

1. EP-001's description says “English language,” while its steps, Expected Result, SRS FR-21, and observed comparison require Vietnamese. The reviewed assertion follows the higher-confidence Expected Result plus SRS and verifies visible Vietnamese labels without imposing `lang=vi`.
2. NEG-008's Expected Result permits safe truncation/rounding, but its title says “rejects,” its Failed status treats truncation as defective, and BUG-FR06-005 requires prevention or user notification. The generated test preserves the canonical TC Expected Result by accepting visible rejection or safe integer `1`; HITL should decide whether notification is mandatory.
3. NEG-011 permits acceptance when the total is correct and no overflow occurs, while its Failed status and BUG-FR06-008 frame lack of an upper bound as the defect. The generated NEG-011 follows the TC Expected Result; BV-008 separately asserts the practical maximum.
4. The detailed BUG-FR06-020 report links `TC-FR06-BV-008`, but the canonical test-case file maps BUG-FR06-020 to API-only `TC-FR06-BV-009`. No remapping was guessed; BV-009 remains excluded pending HITL correction.
5. The HW2 narrative for NEG-009 says a `type=number` input accepted `abc`. Current React source still declares `type=number`; the generated browser test uses normal keyboard events and prohibits programmatic value injection. HITL should compare the three-browser evidence at F3 before retaining or revising BUG-FR06-006.

## Genuinely non-automatable steps

None of the selected UI steps is inherently manual. Colour uses `toHaveCSS`, focus order uses keyboard plus `toBeFocused`, and non-numeric input uses normal `pressSequentially` keyboard events. Programmatic injection of `abc` into `type=number` would bypass the browser UI and is deliberately not used.

## Known-failure classification from Run #1

The detailed evidence and 45-row TC/browser matrix are in [fr06-bug-report.md](fr06-bug-report.md).

| Classification | Result |
|---|---|
| Confirmed genuine defects | 8 distinct: 7 known HW2 defects and 1 new automation-discovered defect |
| Known defects reproduced | BUG-FR06-001, BUG-FR06-003, BUG-FR06-004, BUG-FR06-007, BUG-FR06-008, BUG-FR06-016, BUG-FR06-017 |
| New defect | BUG-FR06-AUTO-001 — first Add to Cart click is silently ignored in Chromium, Firefox, and WebKit |
| Known mappings not confirmed | BUG-FR06-002, BUG-FR06-005, and BUG-FR06-009 were not reached because their tests stopped at BUG-FR06-AUTO-001; BUG-FR06-006's UI test passed |
| Test issue | TEST-FR06-001 — WebKit first-Tab focus assertion depends on host/browser full-keyboard-access behavior and must return to script review |
| Out-of-scope failures | 0; all nine API-only exclusions remain excluded and unclaimed |

The new first-click defect accounts for 24 failed TC/browser results across EP-003, EP-004, NEG-008, NEG-011, NEG-012, BV-003, BV-004, and BV-005. The 21 remaining failed results reproduce the seven known UI defects above. Product-not-found cases and normal non-numeric keyboard prevention passed in all engines.

## Assertion-pattern inventory

- A1: `toHaveURL`
- A2: `toBeVisible`, including `Locator.or()` for canonical alternative outcomes
- A3: `toHaveText`
- A4: `toHaveValue`
- A5: `toHaveCount`
- A7: `toHaveAttribute` for image alt text
- A10: `toHaveCSS`
- Focus: `toBeFocused`

## Fixture/POM architecture findings

- The BasePage-derived FR-06 class remains justified because 22 tests reuse more than five product/cart interactions.
- Public tests consume the typed `productDetailPage` fixture. Authenticated tests consume the fresh test-scoped `userPage`; a local stateless factory binds it to the same page class because adding `userProductDetailPage` would be an infrastructure change outside F2.
- No mutable test data is stored in the page object. All URLs, labels, values, boundaries, messages, expected totals, and Bug IDs remain external.
- No new component/helper abstraction was added: cart interactions are used only by the current FR suite, and splitting them now would add indirection without cross-feature reuse.
- The only remaining raw selectors are narrowly scoped HTML validation-attribute selectors used to represent invisible native constraints in an alternative locator; all user-facing elements use roles or visible text.

## Final quality assessment

- 22 exact HW2 UI TC IDs/titles are discovered under `@FR06`; all nine API-dependent TCs are explicitly excluded and replaced for UI-count/priority purposes without claiming equivalent server coverage.
- All UI-observable canonical expected-result clauses are asserted or a source discrepancy is documented.
- Tests are fresh-context, order-independent, data-driven, and use UI-only setup/cleanup with `beforeEach`/`afterEach`.
- Known bugs are annotated but not skipped, inverted, or weakened.
- Run #1 completed all 66 browser executions and produced isolated Chromium, Firefox, and WebKit reports, JSON, screenshots, traces, error contexts, and a cumulative run summary.
- Failure classification is complete in `fr06-bug-report.md` and the consolidated root `bug_report.md`.
- FR-06 remains blocked only on HITL sign-off of pending audit sessions; external creation of BUG-FR06-AUTO-001 remains a HITL action.

**Human Review:** Pending HITL sign-off for browser-evidence and bug-classification audit sessions

**Next gate:** `/hw4-signoff FR-06`
