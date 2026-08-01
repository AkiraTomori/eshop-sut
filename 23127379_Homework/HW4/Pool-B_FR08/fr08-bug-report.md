# FR-08 Detailed Bug Report — Checkout

> **Student:** 23127379 — Thái Minh Huy
>
> **Evidence source:** [FR-08 Run Summary](fr08-run-summary.md), tracked Run #6 across Chromium, Firefox, and WebKit
>
> **Classification status:** Run #6 classification accepted — FR-08 completion gate passed
>
> **Aggregate report:** [HW04 Bug Report](../bug_report.md)

---

## Classification summary

Run #6 executed 14 tests in each browser. All 39 failed TC/browser results were classified from the current JSON reports, screenshots, traces, error contexts, reviewed spec/data, React source, HW2 test cases/bug report, and SRS.

| Classification | Distinct count | Failed TC/browser results |
|---|---:|---:|
| Genuine product defects | 8 | 39 |
| Known HW2 defects reproduced | 6 | 33 |
| New automation-discovered defects | 2 | 6 |
| Test or infrastructure issues | 0 | 0 |
| Out of HW4 scope failures | 0 | 0 |

All 39 rows are genuine product-defect results: 33 reproduce known `BUG-FR08-001`, `002`, `003`, `005`, `006`, and `009`, while six reproduce new `BUG-FR08-AUTO-001` and `BUG-FR08-AUTO-002`. In EP-001, the corrected exact-item assertion passes and Playwright records three soft failures for the missing `<h1>`, incorrect green action colour, and retained cart before the result fails. The former `TEST-FR08-003` named-`listitem` locator failure appears zero times.

## Failure classification matrix

Each failed TC/browser result has one row and exact retained evidence. Isolated reports: [Chromium](playwright-report/chromium/index.html), [Firefox](playwright-report/firefox/index.html), [WebKit](playwright-report/webkit/index.html).

| Source TC | Browser | Exact assertion/evidence | Classification | Bug/Issue ID | Evidence |
|---|---|---|---|---|---|
| TC-FR08-EP-001 | Chromium | Exact item passes; missing `<h1>`, green action, and retained cart fail | Genuine — known | BUG-FR08-001, BUG-FR08-002, BUG-FR08-003 | [shot](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-cd971-valid-shipping-address-FR08-chromium/test-failed-1.png) · [trace](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-cd971-valid-shipping-address-FR08-chromium/trace.zip) · [context](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-cd971-valid-shipping-address-FR08-chromium/error-context.md) |
| TC-FR08-EP-001 | Firefox | Same three spec-correct product failures after exact item passes | Genuine — known | BUG-FR08-001, BUG-FR08-002, BUG-FR08-003 | [shot](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-cd971-valid-shipping-address-FR08-firefox/test-failed-1.png) · [trace](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-cd971-valid-shipping-address-FR08-firefox/trace.zip) · [context](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-cd971-valid-shipping-address-FR08-firefox/error-context.md) |
| TC-FR08-EP-001 | WebKit | Same three spec-correct product failures after exact item passes | Genuine — known | BUG-FR08-001, BUG-FR08-002, BUG-FR08-003 | [shot](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-cd971-valid-shipping-address-FR08-webkit/test-failed-1.png) · [trace](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-cd971-valid-shipping-address-FR08-webkit/trace.zip) · [context](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-cd971-valid-shipping-address-FR08-webkit/error-context.md) |
| TC-FR08-EP-002 | Chromium | Total spinbutton is editable | Genuine — new | BUG-FR08-AUTO-002 | [shot](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-7801f-on-field-is-left-blank-FR08-chromium/test-failed-1.png) · [trace](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-7801f-on-field-is-left-blank-FR08-chromium/trace.zip) · [context](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-7801f-on-field-is-left-blank-FR08-chromium/error-context.md) |
| TC-FR08-EP-002 | Firefox | Same editable-total failure | Genuine — new | BUG-FR08-AUTO-002 | [shot](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-7801f-on-field-is-left-blank-FR08-firefox/test-failed-1.png) · [trace](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-7801f-on-field-is-left-blank-FR08-firefox/trace.zip) · [context](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-7801f-on-field-is-left-blank-FR08-firefox/error-context.md) |
| TC-FR08-EP-002 | WebKit | Same editable-total failure | Genuine — new | BUG-FR08-AUTO-002 | [shot](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-7801f-on-field-is-left-blank-FR08-webkit/test-failed-1.png) · [trace](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-7801f-on-field-is-left-blank-FR08-webkit/trace.zip) · [context](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-7801f-on-field-is-left-blank-FR08-webkit/error-context.md) |
| TC-FR08-EP-003 | Chromium | Breadcrumb absent; empty-address error also absent after submit | Genuine — known | BUG-FR08-005, BUG-FR08-006 | [shot](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-515e4-t-on-the-checkout-page-FR08-chromium/test-failed-1.png) · [trace](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-515e4-t-on-the-checkout-page-FR08-chromium/trace.zip) · [context](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-515e4-t-on-the-checkout-page-FR08-chromium/error-context.md) |
| TC-FR08-EP-003 | Firefox | Same breadcrumb and validation failures | Genuine — known | BUG-FR08-005, BUG-FR08-006 | [shot](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-515e4-t-on-the-checkout-page-FR08-firefox/test-failed-1.png) · [trace](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-515e4-t-on-the-checkout-page-FR08-firefox/trace.zip) · [context](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-515e4-t-on-the-checkout-page-FR08-firefox/error-context.md) |
| TC-FR08-EP-003 | WebKit | Same breadcrumb and validation failures | Genuine — known | BUG-FR08-005, BUG-FR08-006 | [shot](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-515e4-t-on-the-checkout-page-FR08-webkit/test-failed-1.png) · [trace](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-515e4-t-on-the-checkout-page-FR08-webkit/trace.zip) · [context](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-515e4-t-on-the-checkout-page-FR08-webkit/error-context.md) |
| TC-FR08-NEG-004 | Chromium | Required-address error absent | Genuine — known | BUG-FR08-006 | [shot](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-85862-address-field-is-empty-FR08-chromium/test-failed-1.png) · [trace](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-85862-address-field-is-empty-FR08-chromium/trace.zip) · [context](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-85862-address-field-is-empty-FR08-chromium/error-context.md) |
| TC-FR08-NEG-004 | Firefox | Same required-address failure | Genuine — known | BUG-FR08-006 | [shot](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-85862-address-field-is-empty-FR08-firefox/test-failed-1.png) · [trace](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-85862-address-field-is-empty-FR08-firefox/trace.zip) · [context](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-85862-address-field-is-empty-FR08-firefox/error-context.md) |
| TC-FR08-NEG-004 | WebKit | Same required-address failure | Genuine — known | BUG-FR08-006 | [shot](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-85862-address-field-is-empty-FR08-webkit/test-failed-1.png) · [trace](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-85862-address-field-is-empty-FR08-webkit/trace.zip) · [context](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-85862-address-field-is-empty-FR08-webkit/error-context.md) |
| TC-FR08-NEG-006 | Chromium | Whitespace-address error absent | Genuine — known | BUG-FR08-006 | [shot](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-04ed7-s-rejected-at-checkout-FR08-chromium/test-failed-1.png) · [trace](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-04ed7-s-rejected-at-checkout-FR08-chromium/trace.zip) · [context](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-04ed7-s-rejected-at-checkout-FR08-chromium/error-context.md) |
| TC-FR08-NEG-006 | Firefox | Same whitespace-address failure | Genuine — known | BUG-FR08-006 | [shot](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-04ed7-s-rejected-at-checkout-FR08-firefox/test-failed-1.png) · [trace](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-04ed7-s-rejected-at-checkout-FR08-firefox/trace.zip) · [context](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-04ed7-s-rejected-at-checkout-FR08-firefox/error-context.md) |
| TC-FR08-NEG-006 | WebKit | Same whitespace-address failure | Genuine — known | BUG-FR08-006 | [shot](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-04ed7-s-rejected-at-checkout-FR08-webkit/test-failed-1.png) · [trace](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-04ed7-s-rejected-at-checkout-FR08-webkit/trace.zip) · [context](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-04ed7-s-rejected-at-checkout-FR08-webkit/error-context.md) |
| TC-FR08-NEG-007 | Chromium | `<h1>` count is 0, expected 1 | Genuine — known | BUG-FR08-001 | [shot](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-1d743-icate-heading-elements-FR08-chromium/test-failed-1.png) · [trace](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-1d743-icate-heading-elements-FR08-chromium/trace.zip) · [context](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-1d743-icate-heading-elements-FR08-chromium/error-context.md) |
| TC-FR08-NEG-007 | Firefox | Same missing-`h1` failure | Genuine — known | BUG-FR08-001 | [shot](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-1d743-icate-heading-elements-FR08-firefox/test-failed-1.png) · [trace](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-1d743-icate-heading-elements-FR08-firefox/trace.zip) · [context](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-1d743-icate-heading-elements-FR08-firefox/error-context.md) |
| TC-FR08-NEG-007 | WebKit | Same missing-`h1` failure | Genuine — known | BUG-FR08-001 | [shot](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-1d743-icate-heading-elements-FR08-webkit/test-failed-1.png) · [trace](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-1d743-icate-heading-elements-FR08-webkit/trace.zip) · [context](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-1d743-icate-heading-elements-FR08-webkit/error-context.md) |
| TC-FR08-BV-001 | Chromium | Success shown, but cart does not become empty | Genuine — known | BUG-FR08-003 | [shot](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-f7bd1-s-accepted-at-checkout-FR08-chromium/test-failed-1.png) · [trace](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-f7bd1-s-accepted-at-checkout-FR08-chromium/trace.zip) · [context](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-f7bd1-s-accepted-at-checkout-FR08-chromium/error-context.md) |
| TC-FR08-BV-001 | Firefox | Same cart-not-cleared failure | Genuine — known | BUG-FR08-003 | [shot](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-f7bd1-s-accepted-at-checkout-FR08-firefox/test-failed-1.png) · [trace](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-f7bd1-s-accepted-at-checkout-FR08-firefox/trace.zip) · [context](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-f7bd1-s-accepted-at-checkout-FR08-firefox/error-context.md) |
| TC-FR08-BV-001 | WebKit | Same cart-not-cleared failure | Genuine — known | BUG-FR08-003 | [shot](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-f7bd1-s-accepted-at-checkout-FR08-webkit/test-failed-1.png) · [trace](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-f7bd1-s-accepted-at-checkout-FR08-webkit/trace.zip) · [context](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-f7bd1-s-accepted-at-checkout-FR08-webkit/error-context.md) |
| TC-FR08-BV-002 | Chromium | Success shown, but cart does not become empty | Genuine — known | BUG-FR08-003 | [shot](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-efad3-s-accepted-at-checkout-FR08-chromium/test-failed-1.png) · [trace](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-efad3-s-accepted-at-checkout-FR08-chromium/trace.zip) · [context](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-efad3-s-accepted-at-checkout-FR08-chromium/error-context.md) |
| TC-FR08-BV-002 | Firefox | Same cart-not-cleared failure | Genuine — known | BUG-FR08-003 | [shot](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-efad3-s-accepted-at-checkout-FR08-firefox/test-failed-1.png) · [trace](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-efad3-s-accepted-at-checkout-FR08-firefox/trace.zip) · [context](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-efad3-s-accepted-at-checkout-FR08-firefox/error-context.md) |
| TC-FR08-BV-002 | WebKit | Same cart-not-cleared failure | Genuine — known | BUG-FR08-003 | [shot](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-efad3-s-accepted-at-checkout-FR08-webkit/test-failed-1.png) · [trace](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-efad3-s-accepted-at-checkout-FR08-webkit/trace.zip) · [context](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-efad3-s-accepted-at-checkout-FR08-webkit/error-context.md) |
| TC-FR08-BV-003 | Chromium | Success shown, but cart does not become empty | Genuine — known | BUG-FR08-003 | [shot](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-213c0-s-accepted-at-checkout-FR08-chromium/test-failed-1.png) · [trace](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-213c0-s-accepted-at-checkout-FR08-chromium/trace.zip) · [context](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-213c0-s-accepted-at-checkout-FR08-chromium/error-context.md) |
| TC-FR08-BV-003 | Firefox | Same cart-not-cleared failure | Genuine — known | BUG-FR08-003 | [shot](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-213c0-s-accepted-at-checkout-FR08-firefox/test-failed-1.png) · [trace](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-213c0-s-accepted-at-checkout-FR08-firefox/trace.zip) · [context](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-213c0-s-accepted-at-checkout-FR08-firefox/error-context.md) |
| TC-FR08-BV-003 | WebKit | Same cart-not-cleared failure | Genuine — known | BUG-FR08-003 | [shot](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-213c0-s-accepted-at-checkout-FR08-webkit/test-failed-1.png) · [trace](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-213c0-s-accepted-at-checkout-FR08-webkit/trace.zip) · [context](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-213c0-s-accepted-at-checkout-FR08-webkit/error-context.md) |
| TC-FR08-BV-004 | Chromium | Success shown, but cart does not become empty | Genuine — known | BUG-FR08-003 | [shot](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-57605-s-accepted-at-checkout-FR08-chromium/test-failed-1.png) · [trace](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-57605-s-accepted-at-checkout-FR08-chromium/trace.zip) · [context](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-57605-s-accepted-at-checkout-FR08-chromium/error-context.md) |
| TC-FR08-BV-004 | Firefox | Same cart-not-cleared failure | Genuine — known | BUG-FR08-003 | [shot](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-57605-s-accepted-at-checkout-FR08-firefox/test-failed-1.png) · [trace](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-57605-s-accepted-at-checkout-FR08-firefox/trace.zip) · [context](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-57605-s-accepted-at-checkout-FR08-firefox/error-context.md) |
| TC-FR08-BV-004 | WebKit | Same cart-not-cleared failure | Genuine — known | BUG-FR08-003 | [shot](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-57605-s-accepted-at-checkout-FR08-webkit/test-failed-1.png) · [trace](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-57605-s-accepted-at-checkout-FR08-webkit/trace.zip) · [context](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-57605-s-accepted-at-checkout-FR08-webkit/error-context.md) |
| TC-FR08-BV-005 | Chromium | Required-address error absent | Genuine — known | BUG-FR08-006 | [shot](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-0f6f4-s-rejected-at-checkout-FR08-chromium/test-failed-1.png) · [trace](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-0f6f4-s-rejected-at-checkout-FR08-chromium/trace.zip) · [context](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-0f6f4-s-rejected-at-checkout-FR08-chromium/error-context.md) |
| TC-FR08-BV-005 | Firefox | Same required-address failure | Genuine — known | BUG-FR08-006 | [shot](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-0f6f4-s-rejected-at-checkout-FR08-firefox/test-failed-1.png) · [trace](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-0f6f4-s-rejected-at-checkout-FR08-firefox/trace.zip) · [context](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-0f6f4-s-rejected-at-checkout-FR08-firefox/error-context.md) |
| TC-FR08-BV-005 | WebKit | Same required-address failure | Genuine — known | BUG-FR08-006 | [shot](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-0f6f4-s-rejected-at-checkout-FR08-webkit/test-failed-1.png) · [trace](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-0f6f4-s-rejected-at-checkout-FR08-webkit/trace.zip) · [context](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-0f6f4-s-rejected-at-checkout-FR08-webkit/error-context.md) |
| TC-FR08-BV-006 | Chromium | 256-character address error absent | Genuine — known | BUG-FR08-009 | [shot](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-b189d--submitted-at-checkout-FR08-chromium/test-failed-1.png) · [trace](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-b189d--submitted-at-checkout-FR08-chromium/trace.zip) · [context](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-b189d--submitted-at-checkout-FR08-chromium/error-context.md) |
| TC-FR08-BV-006 | Firefox | Same over-length validation failure | Genuine — known | BUG-FR08-009 | [shot](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-b189d--submitted-at-checkout-FR08-firefox/test-failed-1.png) · [trace](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-b189d--submitted-at-checkout-FR08-firefox/trace.zip) · [context](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-b189d--submitted-at-checkout-FR08-firefox/error-context.md) |
| TC-FR08-BV-006 | WebKit | Same over-length validation failure | Genuine — known | BUG-FR08-009 | [shot](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-b189d--submitted-at-checkout-FR08-webkit/test-failed-1.png) · [trace](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-b189d--submitted-at-checkout-FR08-webkit/trace.zip) · [context](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-b189d--submitted-at-checkout-FR08-webkit/error-context.md) |
| TC-FR08-NEG-003 | Chromium | Empty-state image role absent | Genuine — new | BUG-FR08-AUTO-001 | [shot](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-c94a4-e-user-s-cart-is-empty-FR08-chromium/test-failed-1.png) · [trace](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-c94a4-e-user-s-cart-is-empty-FR08-chromium/trace.zip) · [context](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-c94a4-e-user-s-cart-is-empty-FR08-chromium/error-context.md) |
| TC-FR08-NEG-003 | Firefox | Same missing illustration | Genuine — new | BUG-FR08-AUTO-001 | [shot](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-c94a4-e-user-s-cart-is-empty-FR08-firefox/test-failed-1.png) · [trace](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-c94a4-e-user-s-cart-is-empty-FR08-firefox/trace.zip) · [context](test-results/firefox/Pool-B_FR08-fr08-FR-08-aut-c94a4-e-user-s-cart-is-empty-FR08-firefox/error-context.md) |
| TC-FR08-NEG-003 | WebKit | Same missing illustration | Genuine — new | BUG-FR08-AUTO-001 | [shot](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-c94a4-e-user-s-cart-is-empty-FR08-webkit/test-failed-1.png) · [trace](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-c94a4-e-user-s-cart-is-empty-FR08-webkit/trace.zip) · [context](test-results/webkit/Pool-B_FR08-fr08-FR-08-aut-c94a4-e-user-s-cart-is-empty-FR08-webkit/error-context.md) |

## Detailed product defects

All defects below affect Chromium, Firefox, and WebKit. The matrix above contains the exact screenshot, trace, and error-context path for every browser result; each section links the three HTML reports and a representative Chromium artifact.

### BUG-FR08-001 — Checkout page has no required `<h1>`

- **Known/New:** Known HW2 defect; **Severity:** Medium; **Source:** TC-FR08-EP-001 and NEG-007
- **SRS/HW2:** FR-21; [GitHub Issue 21](https://github.com/AkiraTomori/eshop-sut/issues/21)
- **Expected:** Exactly one `<h1>` describes Checkout.
- **Actual/assertion:** `getByRole('heading', { level: 1 })` has count 0; `Checkout.jsx` renders `Xác Nhận Đơn Hàng` as `<h2>`.
- **Evidence:** [Chromium screenshot](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-1d743-icate-heading-elements-FR08-chromium/test-failed-1.png), [trace](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-1d743-icate-heading-elements-FR08-chromium/trace.zip), [Chromium report](playwright-report/chromium/index.html), [Firefox report](playwright-report/firefox/index.html), [WebKit report](playwright-report/webkit/index.html).
- **Impact:** Page structure and assistive-technology navigation violate the global heading requirement.

### BUG-FR08-002 — Positive checkout action is green instead of blue

- **Known/New:** Known HW2 defect; **Severity:** Cosmetic; **Source:** TC-FR08-EP-001
- **SRS/HW2:** FR-21; [GitHub Issue 22](https://github.com/AkiraTomori/eshop-sut/issues/22)
- **Expected:** The positive checkout action is blue (`rgb(37, 99, 235)`).
- **Actual/assertion:** EP-001 reaches `toHaveCSS` in every browser and receives `rgb(22, 163, 74)` instead of `rgb(37, 99, 235)`; `Checkout.jsx` uses `bg-green-600`.
- **Evidence:** [Chromium screenshot](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-cd971-valid-shipping-address-FR08-chromium/test-failed-1.png), [trace](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-cd971-valid-shipping-address-FR08-chromium/trace.zip), [Chromium report](playwright-report/chromium/index.html), [Firefox report](playwright-report/firefox/index.html), [WebKit report](playwright-report/webkit/index.html).
- **Impact:** Positive-action colour is inconsistent with the required interface language.

### BUG-FR08-003 — Successful checkout does not clear the cart

- **Known/New:** Known HW2 defect; **Severity:** Serious; **Source:** TC-FR08-BV-001 through BV-004
- **SRS/HW2:** FR-08; [GitHub Issue 23](https://github.com/AkiraTomori/eshop-sut/issues/23)
- **Expected:** After success, Cart shows the empty-state message and zero product rows.
- **Actual/assertion:** Success feedback appears, but returning to Cart cannot find `Giỏ hàng của bạn đang trống`; `Checkout.jsx` imports `clearCart` but never calls it.
- **Evidence:** [Chromium screenshot](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-f7bd1-s-accepted-at-checkout-FR08-chromium/test-failed-1.png), [trace](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-f7bd1-s-accepted-at-checkout-FR08-chromium/trace.zip), [Chromium report](playwright-report/chromium/index.html), [Firefox report](playwright-report/firefox/index.html), [WebKit report](playwright-report/webkit/index.html).
- **Impact:** Users can see and potentially reuse stale cart contents after a completed order.

### BUG-FR08-005 — Checkout breadcrumb is absent

- **Known/New:** Known HW2 defect; **Severity:** Medium; **Source:** TC-FR08-EP-003
- **SRS/HW2:** FR-23; [GitHub Issue 25](https://github.com/AkiraTomori/eshop-sut/issues/25)
- **Expected:** `Trang chủ > Giỏ hàng > Thanh toán` is visible on Checkout.
- **Actual/assertion:** The exact breadcrumb locator is absent in all browsers; `Checkout.jsx` contains no breadcrumb UI.
- **Evidence:** [Chromium screenshot](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-515e4-t-on-the-checkout-page-FR08-chromium/test-failed-1.png), [trace](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-515e4-t-on-the-checkout-page-FR08-chromium/trace.zip), [Chromium report](playwright-report/chromium/index.html), [Firefox report](playwright-report/firefox/index.html), [WebKit report](playwright-report/webkit/index.html).
- **Impact:** Users lose required location context and navigation on a sub-page.

### BUG-FR08-006 — Missing shipping-address validation and UI error

- **Known/New:** Known HW2 defect; **Severity:** Serious; **Source:** TC-FR08-EP-003, NEG-004, NEG-006, BV-005
- **SRS/HW2:** FR-08, FR-22; [GitHub Issue 26](https://github.com/AkiraTomori/eshop-sut/issues/26)
- **Expected:** Empty/whitespace address blocks checkout and shows a required error above the submit button.
- **Actual/assertion:** `Vui lòng nhập địa chỉ giao hàng` is absent and Checkout proceeds to success. Current Checkout UI does not read or validate the saved Profile address.
- **Evidence:** [Chromium screenshot](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-85862-address-field-is-empty-FR08-chromium/test-failed-1.png), [trace](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-85862-address-field-is-empty-FR08-chromium/trace.zip), [Chromium report](playwright-report/chromium/index.html), [Firefox report](playwright-report/firefox/index.html), [WebKit report](playwright-report/webkit/index.html).
- **Impact:** Orders can be attempted without usable delivery information; backend acceptance remains the separate API-only `BUG-FR08-007` and is not claimed here.

### BUG-FR08-009 — 256-character shipping address is not rejected

- **Known/New:** Known HW2 defect; **Severity:** Medium; **Source:** TC-FR08-BV-006
- **SRS/HW2:** HITL-resolved 255-character maximum; [GitHub Issue 29](https://github.com/AkiraTomori/eshop-sut/issues/29)
- **Expected:** A visible over-limit error blocks checkout at 256 characters.
- **Actual/assertion:** `Địa chỉ giao hàng không được vượt quá 255 ký tự` is absent and the UI proceeds; no Checkout validation consumes the saved address.
- **Evidence:** [Chromium screenshot](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-b189d--submitted-at-checkout-FR08-chromium/test-failed-1.png), [trace](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-b189d--submitted-at-checkout-FR08-chromium/trace.zip), [Chromium report](playwright-report/chromium/index.html), [Firefox report](playwright-report/firefox/index.html), [WebKit report](playwright-report/webkit/index.html).
- **Impact:** The required safe address boundary is unenforced in the browser flow.

### BUG-FR08-AUTO-001 — Empty cart state is missing the required illustration

- **Known/New:** Automation-discovered; **Severity:** Cosmetic; **Source:** TC-FR08-NEG-003; **GitHub Issue:** https://github.com/AkiraTomori/eshop-sut/issues/60
- **SRS/HW2:** FR-07, FR-24.
- **Expected:** Empty Cart contains a friendly message and icon/illustration.
- **Actual/assertion:** The friendly message and continue-shopping link render, but `getByRole('img')` finds no image; `Cart.jsx` contains no illustration.
- **Evidence:** [Chromium screenshot](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-c94a4-e-user-s-cart-is-empty-FR08-chromium/test-failed-1.png), [trace](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-c94a4-e-user-s-cart-is-empty-FR08-chromium/trace.zip), [Chromium report](playwright-report/chromium/index.html), [Firefox report](playwright-report/firefox/index.html), [WebKit report](playwright-report/webkit/index.html).
- **Impact:** The empty state lacks the required visual cue and polish.

### BUG-FR08-AUTO-002 — Checkout total is directly editable

- **Known/New:** Automation-discovered; **Severity:** Serious; **Source:** TC-FR08-EP-002; **GitHub Issue:** https://github.com/AkiraTomori/eshop-sut/issues/61
- **SRS/HW2:** FR-08 requires an automatically calculated total that cannot be directly edited.
- **Expected:** The displayed total retains `30000000` and is not editable.
- **Actual/assertion:** `expect(getByRole('spinbutton')).not.toBeEditable()` receives `editable`; `Checkout.jsx` binds the number input to mutable `editableTotal`.
- **Evidence:** [Chromium screenshot](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-7801f-on-field-is-left-blank-FR08-chromium/test-failed-1.png), [trace](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-7801f-on-field-is-left-blank-FR08-chromium/trace.zip), [Chromium report](playwright-report/chromium/index.html), [Firefox report](playwright-report/firefox/index.html), [WebKit report](playwright-report/webkit/index.html).
- **Impact:** Users can manipulate the client-side payable amount. This is a distinct UI control failure; the canonical backend trust vulnerability remains API-only `BUG-FR08-008` and is not claimed as browser-confirmed.

## Test and infrastructure issues

Run #6 contains no test or infrastructure failure. `TEST-FR08-001`, `TEST-FR08-002`, and `TEST-FR08-003` each appear zero times. The EP-001 exact item text passes in all browsers, and all address-bearing cases pass Profile persistence, product addition, cart row/total, and Checkout navigation before reaching their spec-correct product assertions. Tracked Run #5 remains documented separately as a browser-launch permission attempt with zero executions and is not counted in Run #6 classification.

## Out-of-scope observations

No Run #6 failure came from a direct API/database action or API-dependent HW2 TC. NEG-002, NEG-005, and BV-007 remain excluded as `Out of HW4 scope — API testing`. Backend defects `BUG-FR08-007` and `BUG-FR08-008` are not presented as browser confirmations.

## GitHub Issue drafts

### BUG-FR08-AUTO-001 — Empty cart state is missing the required illustration

- **Severity:** Cosmetic
- **Feature/browsers:** FR-08 Checkout / FR-07 Cart; Chromium, Firefox, WebKit
- **Source TC:** TC-FR08-NEG-003

**Summary:** Authenticated empty Cart displays its friendly message and continue-shopping link but omits the icon/illustration required by SRS FR-07 and FR-24.

**Steps:** Log in, remove every cart item through the UI, open `/cart`, and inspect the empty-state content.

**Expected:** Friendly message plus an icon or illustrative image.

**Actual:** Only `Giỏ hàng của bạn đang trống` and `Tiếp tục mua sắm` render; no image role exists.

**Evidence:** [Full report](playwright-report/index.html), [screenshot](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-c94a4-e-user-s-cart-is-empty-FR08-chromium/test-failed-1.png), [trace](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-c94a4-e-user-s-cart-is-empty-FR08-chromium/trace.zip).

**GitHub Issue URL:** https://github.com/AkiraTomori/eshop-sut/issues/60

### BUG-FR08-AUTO-002 — Checkout total is directly editable

- **Severity:** Serious
- **Feature/browsers:** FR-08 Checkout; Chromium, Firefox, WebKit
- **Source TC:** TC-FR08-EP-002

**Summary:** The automatically calculated Checkout total is rendered as an editable number input, contrary to FR-08.

**Steps:** Log in, set a valid Profile address, add one product, proceed through Cart to Checkout, and focus/edit `Tổng tiền thanh toán (VND)`.

**Expected:** The calculated total is displayed read-only/non-editable and remains authoritative.

**Actual:** The number control is editable and is bound to mutable `editableTotal` state.

**Evidence:** [Full report](playwright-report/index.html), [screenshot](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-7801f-on-field-is-left-blank-FR08-chromium/test-failed-1.png), [trace](test-results/chromium/Pool-B_FR08-fr08-FR-08-aut-7801f-on-field-is-left-blank-FR08-chromium/trace.zip).

**GitHub Issue URL:** https://github.com/AkiraTomori/eshop-sut/issues/61
