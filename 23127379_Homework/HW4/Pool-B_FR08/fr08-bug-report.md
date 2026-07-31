# FR-08 Detailed Bug Report — Checkout

> **Student:** 23127379 — Thái Minh Huy
>
> **Evidence source:** [FR-08 Run Summary](fr08-run-summary.md), Chromium, Firefox, and WebKit reports
>
> **Classification status:** Complete — pending HITL sign-off
>
> **Aggregate report:** [HW04 Bug Report](../bug_report.md)

---

## Classification summary

Run #2 executed 14 tests in each of three browsers. All 39 failed TC/browser results were classified against the JSON results, retained error contexts/screenshots/traces, reviewed spec/data, current React source, HW2 test cases and bug report, and SRS clauses. Run #1 executed no tests because the sandbox could not start the configured local web servers; it has no test results to classify.

| Classification | Distinct count | Failed TC/browser results |
|---|---:|---:|
| Genuine product defects | 1 | 3 |
| Known HW2 defects reproduced | 0 | 0 |
| New automation-discovered defects | 1 | 3 |
| Test or infrastructure issues | 1 | 36 |
| Out of HW4 scope failures | 0 | 0 |

The genuine defect is new `BUG-FR08-AUTO-001`. `TEST-FR08-001` prevented 12 address-bearing TCs from reaching Checkout in all three browsers, so their mapped HW2 defects are not claimed as reproduced.

## Failure classification matrix

Every failed TC/browser result has one row. Each evidence cell links the exact screenshot, trace, and error context retained by Playwright. The isolated HTML reports are [Chromium](playwright-report/chromium/index.html), [Firefox](playwright-report/firefox/index.html), and [WebKit](playwright-report/webkit/index.html).

| Source TC | Browser | Exact assertion/evidence | Classification | Bug/Issue ID | Evidence |
|---|---|---|---|---|---|
| TC-FR08-EP-001 | Chromium | `locator.fill` timed out for `getByLabel('Số điện thoại')` at `checkout.page.ts:88` | Test issue | TEST-FR08-001 | [shot](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-cd971-valid-shipping-address-FR08-chromium/test-failed-1.png) · [trace](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-cd971-valid-shipping-address-FR08-chromium/trace.zip) · [context](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-cd971-valid-shipping-address-FR08-chromium/error-context.md) |
| TC-FR08-EP-001 | Firefox | Same Profile phone-label timeout | Test issue | TEST-FR08-001 | [shot](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-cd971-valid-shipping-address-FR08-firefox/test-failed-1.png) · [trace](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-cd971-valid-shipping-address-FR08-firefox/trace.zip) · [context](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-cd971-valid-shipping-address-FR08-firefox/error-context.md) |
| TC-FR08-EP-001 | WebKit | Same Profile phone-label timeout | Test issue | TEST-FR08-001 | [shot](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-cd971-valid-shipping-address-FR08-webkit/test-failed-1.png) · [trace](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-cd971-valid-shipping-address-FR08-webkit/trace.zip) · [context](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-cd971-valid-shipping-address-FR08-webkit/error-context.md) |
| TC-FR08-EP-002 | Chromium | Same Profile phone-label timeout | Test issue | TEST-FR08-001 | [shot](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-7801f-on-field-is-left-blank-FR08-chromium/test-failed-1.png) · [trace](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-7801f-on-field-is-left-blank-FR08-chromium/trace.zip) · [context](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-7801f-on-field-is-left-blank-FR08-chromium/error-context.md) |
| TC-FR08-EP-002 | Firefox | Same Profile phone-label timeout | Test issue | TEST-FR08-001 | [shot](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-7801f-on-field-is-left-blank-FR08-firefox/test-failed-1.png) · [trace](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-7801f-on-field-is-left-blank-FR08-firefox/trace.zip) · [context](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-7801f-on-field-is-left-blank-FR08-firefox/error-context.md) |
| TC-FR08-EP-002 | WebKit | Same Profile phone-label timeout | Test issue | TEST-FR08-001 | [shot](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-7801f-on-field-is-left-blank-FR08-webkit/test-failed-1.png) · [trace](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-7801f-on-field-is-left-blank-FR08-webkit/trace.zip) · [context](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-7801f-on-field-is-left-blank-FR08-webkit/error-context.md) |
| TC-FR08-EP-003 | Chromium | Same Profile phone-label timeout | Test issue | TEST-FR08-001 | [shot](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-515e4-t-on-the-checkout-page-FR08-chromium/test-failed-1.png) · [trace](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-515e4-t-on-the-checkout-page-FR08-chromium/trace.zip) · [context](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-515e4-t-on-the-checkout-page-FR08-chromium/error-context.md) |
| TC-FR08-EP-003 | Firefox | Same Profile phone-label timeout | Test issue | TEST-FR08-001 | [shot](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-515e4-t-on-the-checkout-page-FR08-firefox/test-failed-1.png) · [trace](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-515e4-t-on-the-checkout-page-FR08-firefox/trace.zip) · [context](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-515e4-t-on-the-checkout-page-FR08-firefox/error-context.md) |
| TC-FR08-EP-003 | WebKit | Same Profile phone-label timeout | Test issue | TEST-FR08-001 | [shot](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-515e4-t-on-the-checkout-page-FR08-webkit/test-failed-1.png) · [trace](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-515e4-t-on-the-checkout-page-FR08-webkit/trace.zip) · [context](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-515e4-t-on-the-checkout-page-FR08-webkit/error-context.md) |
| TC-FR08-NEG-004 | Chromium | Same Profile phone-label timeout | Test issue | TEST-FR08-001 | [shot](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-85862-address-field-is-empty-FR08-chromium/test-failed-1.png) · [trace](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-85862-address-field-is-empty-FR08-chromium/trace.zip) · [context](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-85862-address-field-is-empty-FR08-chromium/error-context.md) |
| TC-FR08-NEG-004 | Firefox | Same Profile phone-label timeout | Test issue | TEST-FR08-001 | [shot](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-85862-address-field-is-empty-FR08-firefox/test-failed-1.png) · [trace](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-85862-address-field-is-empty-FR08-firefox/trace.zip) · [context](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-85862-address-field-is-empty-FR08-firefox/error-context.md) |
| TC-FR08-NEG-004 | WebKit | Same Profile phone-label timeout | Test issue | TEST-FR08-001 | [shot](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-85862-address-field-is-empty-FR08-webkit/test-failed-1.png) · [trace](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-85862-address-field-is-empty-FR08-webkit/trace.zip) · [context](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-85862-address-field-is-empty-FR08-webkit/error-context.md) |
| TC-FR08-NEG-006 | Chromium | Same Profile phone-label timeout | Test issue | TEST-FR08-001 | [shot](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-04ed7-s-rejected-at-checkout-FR08-chromium/test-failed-1.png) · [trace](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-04ed7-s-rejected-at-checkout-FR08-chromium/trace.zip) · [context](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-04ed7-s-rejected-at-checkout-FR08-chromium/error-context.md) |
| TC-FR08-NEG-006 | Firefox | Same Profile phone-label timeout | Test issue | TEST-FR08-001 | [shot](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-04ed7-s-rejected-at-checkout-FR08-firefox/test-failed-1.png) · [trace](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-04ed7-s-rejected-at-checkout-FR08-firefox/trace.zip) · [context](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-04ed7-s-rejected-at-checkout-FR08-firefox/error-context.md) |
| TC-FR08-NEG-006 | WebKit | Same Profile phone-label timeout | Test issue | TEST-FR08-001 | [shot](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-04ed7-s-rejected-at-checkout-FR08-webkit/test-failed-1.png) · [trace](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-04ed7-s-rejected-at-checkout-FR08-webkit/trace.zip) · [context](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-04ed7-s-rejected-at-checkout-FR08-webkit/error-context.md) |
| TC-FR08-NEG-007 | Chromium | Same Profile phone-label timeout | Test issue | TEST-FR08-001 | [shot](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-1d743-icate-heading-elements-FR08-chromium/test-failed-1.png) · [trace](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-1d743-icate-heading-elements-FR08-chromium/trace.zip) · [context](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-1d743-icate-heading-elements-FR08-chromium/error-context.md) |
| TC-FR08-NEG-007 | Firefox | Same Profile phone-label timeout | Test issue | TEST-FR08-001 | [shot](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-1d743-icate-heading-elements-FR08-firefox/test-failed-1.png) · [trace](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-1d743-icate-heading-elements-FR08-firefox/trace.zip) · [context](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-1d743-icate-heading-elements-FR08-firefox/error-context.md) |
| TC-FR08-NEG-007 | WebKit | Same Profile phone-label timeout | Test issue | TEST-FR08-001 | [shot](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-1d743-icate-heading-elements-FR08-webkit/test-failed-1.png) · [trace](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-1d743-icate-heading-elements-FR08-webkit/trace.zip) · [context](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-1d743-icate-heading-elements-FR08-webkit/error-context.md) |
| TC-FR08-BV-001 | Chromium | Same Profile phone-label timeout | Test issue | TEST-FR08-001 | [shot](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-f7bd1-s-accepted-at-checkout-FR08-chromium/test-failed-1.png) · [trace](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-f7bd1-s-accepted-at-checkout-FR08-chromium/trace.zip) · [context](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-f7bd1-s-accepted-at-checkout-FR08-chromium/error-context.md) |
| TC-FR08-BV-001 | Firefox | Same Profile phone-label timeout | Test issue | TEST-FR08-001 | [shot](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-f7bd1-s-accepted-at-checkout-FR08-firefox/test-failed-1.png) · [trace](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-f7bd1-s-accepted-at-checkout-FR08-firefox/trace.zip) · [context](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-f7bd1-s-accepted-at-checkout-FR08-firefox/error-context.md) |
| TC-FR08-BV-001 | WebKit | Same Profile phone-label timeout | Test issue | TEST-FR08-001 | [shot](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-f7bd1-s-accepted-at-checkout-FR08-webkit/test-failed-1.png) · [trace](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-f7bd1-s-accepted-at-checkout-FR08-webkit/trace.zip) · [context](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-f7bd1-s-accepted-at-checkout-FR08-webkit/error-context.md) |
| TC-FR08-BV-002 | Chromium | Same Profile phone-label timeout | Test issue | TEST-FR08-001 | [shot](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-efad3-s-accepted-at-checkout-FR08-chromium/test-failed-1.png) · [trace](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-efad3-s-accepted-at-checkout-FR08-chromium/trace.zip) · [context](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-efad3-s-accepted-at-checkout-FR08-chromium/error-context.md) |
| TC-FR08-BV-002 | Firefox | Same Profile phone-label timeout | Test issue | TEST-FR08-001 | [shot](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-efad3-s-accepted-at-checkout-FR08-firefox/test-failed-1.png) · [trace](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-efad3-s-accepted-at-checkout-FR08-firefox/trace.zip) · [context](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-efad3-s-accepted-at-checkout-FR08-firefox/error-context.md) |
| TC-FR08-BV-002 | WebKit | Same Profile phone-label timeout | Test issue | TEST-FR08-001 | [shot](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-efad3-s-accepted-at-checkout-FR08-webkit/test-failed-1.png) · [trace](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-efad3-s-accepted-at-checkout-FR08-webkit/trace.zip) · [context](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-efad3-s-accepted-at-checkout-FR08-webkit/error-context.md) |
| TC-FR08-BV-003 | Chromium | Same Profile phone-label timeout | Test issue | TEST-FR08-001 | [shot](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-213c0-s-accepted-at-checkout-FR08-chromium/test-failed-1.png) · [trace](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-213c0-s-accepted-at-checkout-FR08-chromium/trace.zip) · [context](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-213c0-s-accepted-at-checkout-FR08-chromium/error-context.md) |
| TC-FR08-BV-003 | Firefox | Same Profile phone-label timeout | Test issue | TEST-FR08-001 | [shot](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-213c0-s-accepted-at-checkout-FR08-firefox/test-failed-1.png) · [trace](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-213c0-s-accepted-at-checkout-FR08-firefox/trace.zip) · [context](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-213c0-s-accepted-at-checkout-FR08-firefox/error-context.md) |
| TC-FR08-BV-003 | WebKit | Same Profile phone-label timeout | Test issue | TEST-FR08-001 | [shot](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-213c0-s-accepted-at-checkout-FR08-webkit/test-failed-1.png) · [trace](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-213c0-s-accepted-at-checkout-FR08-webkit/trace.zip) · [context](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-213c0-s-accepted-at-checkout-FR08-webkit/error-context.md) |
| TC-FR08-BV-004 | Chromium | Same Profile phone-label timeout | Test issue | TEST-FR08-001 | [shot](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-57605-s-accepted-at-checkout-FR08-chromium/test-failed-1.png) · [trace](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-57605-s-accepted-at-checkout-FR08-chromium/trace.zip) · [context](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-57605-s-accepted-at-checkout-FR08-chromium/error-context.md) |
| TC-FR08-BV-004 | Firefox | Same Profile phone-label timeout | Test issue | TEST-FR08-001 | [shot](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-57605-s-accepted-at-checkout-FR08-firefox/test-failed-1.png) · [trace](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-57605-s-accepted-at-checkout-FR08-firefox/trace.zip) · [context](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-57605-s-accepted-at-checkout-FR08-firefox/error-context.md) |
| TC-FR08-BV-004 | WebKit | Same Profile phone-label timeout | Test issue | TEST-FR08-001 | [shot](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-57605-s-accepted-at-checkout-FR08-webkit/test-failed-1.png) · [trace](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-57605-s-accepted-at-checkout-FR08-webkit/trace.zip) · [context](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-57605-s-accepted-at-checkout-FR08-webkit/error-context.md) |
| TC-FR08-BV-005 | Chromium | Same Profile phone-label timeout | Test issue | TEST-FR08-001 | [shot](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-0f6f4-s-rejected-at-checkout-FR08-chromium/test-failed-1.png) · [trace](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-0f6f4-s-rejected-at-checkout-FR08-chromium/trace.zip) · [context](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-0f6f4-s-rejected-at-checkout-FR08-chromium/error-context.md) |
| TC-FR08-BV-005 | Firefox | Same Profile phone-label timeout | Test issue | TEST-FR08-001 | [shot](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-0f6f4-s-rejected-at-checkout-FR08-firefox/test-failed-1.png) · [trace](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-0f6f4-s-rejected-at-checkout-FR08-firefox/trace.zip) · [context](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-0f6f4-s-rejected-at-checkout-FR08-firefox/error-context.md) |
| TC-FR08-BV-005 | WebKit | Same Profile phone-label timeout | Test issue | TEST-FR08-001 | [shot](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-0f6f4-s-rejected-at-checkout-FR08-webkit/test-failed-1.png) · [trace](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-0f6f4-s-rejected-at-checkout-FR08-webkit/trace.zip) · [context](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-0f6f4-s-rejected-at-checkout-FR08-webkit/error-context.md) |
| TC-FR08-BV-006 | Chromium | Same Profile phone-label timeout | Test issue | TEST-FR08-001 | [shot](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-b189d--submitted-at-checkout-FR08-chromium/test-failed-1.png) · [trace](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-b189d--submitted-at-checkout-FR08-chromium/trace.zip) · [context](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-b189d--submitted-at-checkout-FR08-chromium/error-context.md) |
| TC-FR08-BV-006 | Firefox | Same Profile phone-label timeout | Test issue | TEST-FR08-001 | [shot](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-b189d--submitted-at-checkout-FR08-firefox/test-failed-1.png) · [trace](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-b189d--submitted-at-checkout-FR08-firefox/trace.zip) · [context](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-b189d--submitted-at-checkout-FR08-firefox/error-context.md) |
| TC-FR08-BV-006 | WebKit | Same Profile phone-label timeout | Test issue | TEST-FR08-001 | [shot](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-b189d--submitted-at-checkout-FR08-webkit/test-failed-1.png) · [trace](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-b189d--submitted-at-checkout-FR08-webkit/trace.zip) · [context](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-b189d--submitted-at-checkout-FR08-webkit/error-context.md) |
| TC-FR08-NEG-003 | Chromium | `expect(getByRole('img')).toBeVisible()` failed: element not found | Genuine — new | BUG-FR08-AUTO-001 | [shot](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-c94a4-e-user-s-cart-is-empty-FR08-chromium/test-failed-1.png) · [trace](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-c94a4-e-user-s-cart-is-empty-FR08-chromium/trace.zip) · [context](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-c94a4-e-user-s-cart-is-empty-FR08-chromium/error-context.md) |
| TC-FR08-NEG-003 | Firefox | Same missing accessible image assertion | Genuine — new | BUG-FR08-AUTO-001 | [shot](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-c94a4-e-user-s-cart-is-empty-FR08-firefox/test-failed-1.png) · [trace](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-c94a4-e-user-s-cart-is-empty-FR08-firefox/trace.zip) · [context](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-c94a4-e-user-s-cart-is-empty-FR08-firefox/error-context.md) |
| TC-FR08-NEG-003 | WebKit | Same missing accessible image assertion | Genuine — new | BUG-FR08-AUTO-001 | [shot](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-c94a4-e-user-s-cart-is-empty-FR08-webkit/test-failed-1.png) · [trace](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-c94a4-e-user-s-cart-is-empty-FR08-webkit/trace.zip) · [context](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-c94a4-e-user-s-cart-is-empty-FR08-webkit/error-context.md) |

## Detailed product defects

### BUG-FR08-AUTO-001 — Empty cart state is missing the required illustration

- **Source TC(s):** TC-FR08-NEG-003
- **Known/New:** Automation-discovered
- **Severity:** Cosmetic
- **Status:** Open
- **Affected browsers:** Chromium, Firefox, WebKit
- **SRS/HW2 reference:** FR-07, FR-24; TC-FR08-NEG-003
- **GitHub Issue:** Pending HITL creation

#### Preconditions

The storefront is running, the regular user is authenticated, and the cart is empty.

#### Reproduction steps

1. Log in as the regular user.
2. Remove all products from the cart through the UI.
3. Open `/cart`.
4. Inspect the empty-state message and surrounding empty-state content.

#### Expected result

The empty cart displays a friendly message and an icon or illustrative image, as required by SRS FR-07 and FR-24 and the spec-correct expectation of TC-FR08-NEG-003.

#### Actual result

The page displays `Giỏ hàng của bạn đang trống` and a `Tiếp tục mua sắm` link, but no image or illustration is present. The current `Cart.jsx` empty-state branch contains only the heading and link.

#### Exact assertion failure

At `fr08.spec.ts:319`, `expect(getByRole('img')).toBeVisible()` times out after 10 seconds with `Error: element(s) not found`. The trace snapshot contains no image role. The same assertion and DOM state reproduce in Chromium, Firefox, and WebKit.

#### Evidence

- HTML: [Chromium](playwright-report/chromium/index.html), [Firefox](playwright-report/firefox/index.html), [WebKit](playwright-report/webkit/index.html)
- Chromium: [screenshot](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-c94a4-e-user-s-cart-is-empty-FR08-chromium/test-failed-1.png), [trace](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-c94a4-e-user-s-cart-is-empty-FR08-chromium/trace.zip), [error context](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-c94a4-e-user-s-cart-is-empty-FR08-chromium/error-context.md)
- Firefox: [screenshot](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-c94a4-e-user-s-cart-is-empty-FR08-firefox/test-failed-1.png), [trace](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-c94a4-e-user-s-cart-is-empty-FR08-firefox/trace.zip), [error context](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-c94a4-e-user-s-cart-is-empty-FR08-firefox/error-context.md)
- WebKit: [screenshot](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-c94a4-e-user-s-cart-is-empty-FR08-webkit/test-failed-1.png), [trace](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-c94a4-e-user-s-cart-is-empty-FR08-webkit/trace.zip), [error context](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-c94a4-e-user-s-cart-is-empty-FR08-webkit/error-context.md)

#### User impact and classification rationale

Users receive the essential empty-state text and navigation, but the required visual cue is absent, reducing the clarity and polish of the empty-cart experience. HW2 assigned no Bug ID to this TC, and the cross-browser trace, screenshot, source, and SRS evidence confirm a distinct UI defect, so it receives the next available automation ID.

## Test and infrastructure issues

### TEST-FR08-001 — Profile labels are not associated with their controls

- **Source TC(s):** TC-FR08-EP-001, EP-002, EP-003, NEG-004, NEG-006, NEG-007, BV-001, BV-002, BV-003, BV-004, BV-005, BV-006
- **Affected browsers:** Chromium, Firefox, WebKit
- **Failed results:** 36
- **Classification:** Test locator/setup issue; return to `/hw4-review FR-08`

#### Observed evidence

Every address-bearing test stops at `checkout.page.ts:88`:

```text
TimeoutError: locator.fill: Timeout 10000ms exceeded.
- waiting for getByLabel('Số điện thoại', { exact: true })
```

The trace snapshot shows the visible `Số điện thoại` text and an adjacent textbox with placeholder `VD: 0912345678`, but the textbox has no accessible name. `Profile.jsx` renders a `<label>` without `htmlFor` and an `<input>` without `id`, so `getByLabel()` correctly resolves no associated control. The same defect also affects the address textarea locator on the following line, although execution never reaches it.

#### Why this is not a product confirmation

The failing action is UI setup on Profile, before navigation to Checkout and before any FR-08 expected-result assertion. It therefore cannot confirm `BUG-FR08-001`, `002`, `003`, `005`, `006`, or `009`, even when those IDs annotate the source TC. The test must use a source-verified stable control locator, then be reviewed and rerun.

#### Correction direction

Return to the review gate and replace both Profile `getByLabel()` locators with stable locators grounded in the current accessible DOM, such as the unique phone placeholder and address placeholder supplied through external data. Do not add a timeout or weaken any checkout assertion.

## Known HW2 mappings not confirmed by this run

- **BUG-FR08-001, BUG-FR08-002, BUG-FR08-003:** EP-001 and NEG-007 stopped during Profile setup before heading, colour, checkout success, or cart clearing could be inspected.
- **BUG-FR08-005, BUG-FR08-006:** EP-003 and the blank-address cases stopped before Checkout, so breadcrumb and validation feedback were not observed.
- **BUG-FR08-009:** BV-006 stopped before the 256-character address was persisted or submitted.
- **BUG-FR08-007 and BUG-FR08-008:** Backend/API defects remain outside the HW4 browser-UI scope and are not claimed by browser evidence.
- **EP-002 editable total observation:** The total control was never reached, so no new defect is claimed.
- **NEG-003 direct-checkout clause:** Execution stopped at the missing illustration before opening `/checkout`; only the missing illustration is confirmed.

## Out-of-scope observations

No Run #2 failure used direct API/database actions, and no failed result came from an API-dependent HW2 TC. NEG-002, NEG-005, and BV-007 remain excluded as `Out of HW4 scope — API testing`; their canonical API defects are not presented as browser-automation confirmations.

## GitHub Issue draft

### BUG-FR08-AUTO-001 — Empty cart state is missing the required illustration

- **Severity:** Cosmetic
- **Feature:** FR-08 Checkout / FR-07 Shopping Cart empty state
- **Browsers:** Chromium, Firefox, WebKit
- **Source TC:** TC-FR08-NEG-003

**Summary**

The authenticated empty-cart page displays its friendly message and continue-shopping link but omits the icon or illustration required by SRS FR-07 and FR-24.

**Steps**

1. Log in as the regular user.
2. Remove every cart item through the UI.
3. Open `http://localhost:5173/cart`.
4. Inspect the empty-state content.

**Expected**

The empty state includes both a friendly message and an icon or illustrative image.

**Actual**

Only `Giỏ hàng của bạn đang trống` and `Tiếp tục mua sắm` are rendered. No image role or illustration exists in the DOM in any tested browser.

**Evidence**

- [Full FR report](playwright-report/index.html)
- [Chromium representative screenshot](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-c94a4-e-user-s-cart-is-empty-FR08-chromium/test-failed-1.png)
- [Chromium representative trace](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-c94a4-e-user-s-cart-is-empty-FR08-chromium/trace.zip)
- [Firefox representative trace](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-c94a4-e-user-s-cart-is-empty-FR08-firefox/trace.zip)
- [WebKit representative trace](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-c94a4-e-user-s-cart-is-empty-FR08-webkit/trace.zip)

**GitHub Issue URL:** Pending HITL creation
