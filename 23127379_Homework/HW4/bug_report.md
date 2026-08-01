# HW04 Bug Report — Consolidated Summary

> **Student:** 23127379 — Thái Minh Huy
>
> **Scope:** Summary only. Detailed evidence and reproduction steps live in each FR pool.
>
> **GitHub Issues:** <https://github.com/AkiraTomori/eshop-sut/issues>

---

## Feature reports

| FR | Feature | Detailed report | Latest automation evidence | Classification status | Confirmed bugs |
|---|---|---|---|---|---:|
| FR-06 | Product Detail View | [fr06-bug-report.md](Pool-A_FR06/fr06-bug-report.md) | Run #1 — 3 browsers | Complete — HITL accepted | 8 |
| FR-08 | Checkout | [fr08-bug-report.md](Pool-B_FR08/fr08-bug-report.md) | Run #6 — 3 browsers | Complete — HITL accepted | 8 |
| FR-15 | Product Management | [fr15-bug-report.md](Pool-C_FR15/fr15-bug-report.md) | Run #2 — 3 browsers | Complete — HITL accepted | 12 |

## Consolidated bug index

This index contains only defects classified as genuine in the detailed FR reports. Full reproduction steps, assertions, and artifact paths remain in those reports.

| Bug ID | FR | Title | Severity | Affected browsers | Known/New | GitHub Issue | Detail |
|---|---|---|---|---|---|---|---|
| BUG-FR06-001 | FR-06 | Missing required product details/breadcrumb; wrong action colour | Serious | Chromium, Firefox, WebKit | Known | [Issue 1](https://github.com/AkiraTomori/eshop-sut/issues/1) | [Detail](Pool-A_FR06/fr06-bug-report.md#bug-fr06-001--required-product-information-breadcrumb-and-positive-action-colour-are-incorrect) |
| BUG-FR06-003 | FR-06 | Zero quantity lacks UI validation | Serious | Chromium, Firefox, WebKit | Known | [Issue 3](https://github.com/AkiraTomori/eshop-sut/issues/3) | [Detail](Pool-A_FR06/fr06-bug-report.md#bug-fr06-003--zero-quantity-lacks-ui-validation) |
| BUG-FR06-004 | FR-06 | Negative quantity lacks UI validation | Serious | Chromium, Firefox, WebKit | Known | [Issue 4](https://github.com/AkiraTomori/eshop-sut/issues/4) | [Detail](Pool-A_FR06/fr06-bug-report.md#bug-fr06-004--negative-quantity-lacks-ui-validation) |
| BUG-FR06-007 | FR-06 | Empty quantity lacks required validation | Serious | Chromium, Firefox, WebKit | Known | [Issue 7](https://github.com/AkiraTomori/eshop-sut/issues/7) | [Detail](Pool-A_FR06/fr06-bug-report.md#bug-fr06-007--empty-quantity-lacks-required-validation) |
| BUG-FR06-008 | FR-06 | Practical quantity upper bound is not enforced | Medium | Chromium, Firefox, WebKit | Known | [Issue 8](https://github.com/AkiraTomori/eshop-sut/issues/8) | [Detail](Pool-A_FR06/fr06-bug-report.md#bug-fr06-008--practical-quantity-upper-bound-is-not-enforced) |
| BUG-FR06-016 | FR-06 | Category missing at product-ID lower boundary | Serious | Chromium, Firefox, WebKit | Known | [Issue 16](https://github.com/AkiraTomori/eshop-sut/issues/16) | [Detail](Pool-A_FR06/fr06-bug-report.md#bug-fr06-016--category-missing-at-product-id-lower-boundary) |
| BUG-FR06-017 | FR-06 | Category missing at product-ID LB+1 boundary | Serious | Chromium, Firefox, WebKit | Known | [Issue 17](https://github.com/AkiraTomori/eshop-sut/issues/17) | [Detail](Pool-A_FR06/fr06-bug-report.md#bug-fr06-017--category-missing-at-product-id-lb1-boundary) |
| BUG-FR06-AUTO-001 | FR-06 | First Add to Cart click is silently ignored | Serious | Chromium, Firefox, WebKit | New | [Issue 59](https://github.com/AkiraTomori/eshop-sut/issues/59) | [Detail](Pool-A_FR06/fr06-bug-report.md#bug-fr06-auto-001--first-add-to-cart-click-is-silently-ignored) |
| BUG-FR08-001 | FR-08 | Checkout page has no required h1 | Medium | Chromium, Firefox, WebKit | Known | [Issue 21](https://github.com/AkiraTomori/eshop-sut/issues/21) | [Detail](Pool-B_FR08/fr08-bug-report.md#bug-fr08-001--checkout-page-has-no-required-h1) |
| BUG-FR08-002 | FR-08 | Positive checkout action is green instead of blue | Cosmetic | Chromium, Firefox, WebKit | Known | [Issue 22](https://github.com/AkiraTomori/eshop-sut/issues/22) | [Detail](Pool-B_FR08/fr08-bug-report.md#bug-fr08-002--positive-checkout-action-is-green-instead-of-blue) |
| BUG-FR08-003 | FR-08 | Successful checkout does not clear the cart | Serious | Chromium, Firefox, WebKit | Known | [Issue 23](https://github.com/AkiraTomori/eshop-sut/issues/23) | [Detail](Pool-B_FR08/fr08-bug-report.md#bug-fr08-003--successful-checkout-does-not-clear-the-cart) |
| BUG-FR08-005 | FR-08 | Checkout breadcrumb is absent | Medium | Chromium, Firefox, WebKit | Known | [Issue 25](https://github.com/AkiraTomori/eshop-sut/issues/25) | [Detail](Pool-B_FR08/fr08-bug-report.md#bug-fr08-005--checkout-breadcrumb-is-absent) |
| BUG-FR08-006 | FR-08 | Missing shipping-address validation and UI error | Serious | Chromium, Firefox, WebKit | Known | [Issue 26](https://github.com/AkiraTomori/eshop-sut/issues/26) | [Detail](Pool-B_FR08/fr08-bug-report.md#bug-fr08-006--missing-shipping-address-validation-and-ui-error) |
| BUG-FR08-009 | FR-08 | 256-character shipping address is not rejected | Medium | Chromium, Firefox, WebKit | Known | [Issue 29](https://github.com/AkiraTomori/eshop-sut/issues/29) | [Detail](Pool-B_FR08/fr08-bug-report.md#bug-fr08-009--256-character-shipping-address-is-not-rejected) |
| BUG-FR08-AUTO-001 | FR-08 | Empty cart state is missing the required illustration | Cosmetic | Chromium, Firefox, WebKit | New | [Issue 60](https://github.com/AkiraTomori/eshop-sut/issues/60) | [Detail](Pool-B_FR08/fr08-bug-report.md#bug-fr08-auto-001--empty-cart-state-is-missing-the-required-illustration) |
| BUG-FR08-AUTO-002 | FR-08 | Checkout total is directly editable | Serious | Chromium, Firefox, WebKit | New | [Issue 61](https://github.com/AkiraTomori/eshop-sut/issues/61) | [Detail](Pool-B_FR08/fr08-bug-report.md#bug-fr08-auto-002--checkout-total-is-directly-editable) |
| BUG-FR15-001 | FR-15 | Zero price is accepted | Serious | Chromium, Firefox, WebKit | Known | [Issue 42](https://github.com/AkiraTomori/eshop-sut/issues/42) | [Detail](Pool-C_FR15/fr15-bug-report.md#bug-fr15-001--zero-price-is-accepted) |
| BUG-FR15-002 | FR-15 | Negative price is accepted | Serious | Chromium, Firefox, WebKit | Known | [Issue 43](https://github.com/AkiraTomori/eshop-sut/issues/43) | [Detail](Pool-C_FR15/fr15-bug-report.md#bug-fr15-002--negative-price-is-accepted) |
| BUG-FR15-013 | FR-15 | Mandatory field indicators are missing | Medium | Chromium, Firefox, WebKit | Known | [Issue 54](https://github.com/AkiraTomori/eshop-sut/issues/54) | [Detail](Pool-C_FR15/fr15-bug-report.md#bug-fr15-013--mandatory-field-indicators-are-missing) |
| BUG-FR15-014 | FR-15 | Required validation errors are absent | Medium | Chromium, Firefox, WebKit | Known | [Issue 55](https://github.com/AkiraTomori/eshop-sut/issues/55) | [Detail](Pool-C_FR15/fr15-bug-report.md#bug-fr15-014--required-validation-errors-are-absent) |
| BUG-FR15-015 | FR-15 | Save button is green instead of blue | Medium | Chromium, Firefox, WebKit | Known | [Issue 56](https://github.com/AkiraTomori/eshop-sut/issues/56) | [Detail](Pool-C_FR15/fr15-bug-report.md#bug-fr15-015--save-button-is-green-instead-of-blue) |
| BUG-FR15-017 | FR-15 | Delete confirmation is absent | Serious | Chromium, Firefox, WebKit | Known | [Issue 58](https://github.com/AkiraTomori/eshop-sut/issues/58) | [Detail](Pool-C_FR15/fr15-bug-report.md#bug-fr15-017--delete-confirmation-is-absent) |
| BUG-FR15-AUTO-001 | FR-15 | Product-list prices lack thousands separators | Medium | Chromium, Firefox, WebKit | New | [Issue 62](https://github.com/AkiraTomori/eshop-sut/issues/62) | [Detail](Pool-C_FR15/fr15-bug-report.md#bug-fr15-auto-001--product-list-prices-lack-thousands-separators) |
| BUG-FR15-AUTO-002 | FR-15 | Successful deletion has no success notification | Medium | Chromium, Firefox, WebKit | New | [Issue 63](https://github.com/AkiraTomori/eshop-sut/issues/63) | [Detail](Pool-C_FR15/fr15-bug-report.md#bug-fr15-auto-002--successful-deletion-has-no-success-notification) |
| BUG-FR15-AUTO-003 | FR-15 | Product search and empty-result state are absent | Serious | Chromium, Firefox, WebKit | New | [Issue 64](https://github.com/AkiraTomori/eshop-sut/issues/64) | [Detail](Pool-C_FR15/fr15-bug-report.md#bug-fr15-auto-003--product-search-and-empty-result-state-are-absent) |
| BUG-FR15-AUTO-004 | FR-15 | Product detail action/view is absent in Web Admin | Serious | Chromium, Firefox, WebKit | New | [Issue 65](https://github.com/AkiraTomori/eshop-sut/issues/65) | [Detail](Pool-C_FR15/fr15-bug-report.md#bug-fr15-auto-004--product-detail-actionview-is-absent-in-web-admin) |
| BUG-FR15-AUTO-005 | FR-15 | Product-list loading indicator is absent | Medium | Chromium, Firefox, WebKit | New | [Issue 66](https://github.com/AkiraTomori/eshop-sut/issues/66) | [Detail](Pool-C_FR15/fr15-bug-report.md#bug-fr15-auto-005--product-list-loading-indicator-is-absent) |
| BUG-FR15-AUTO-006 | FR-15 | Product Management lacks a meaningful feature-level h1 | Medium | Chromium, Firefox, WebKit | New | [Issue 67](https://github.com/AkiraTomori/eshop-sut/issues/67) | [Detail](Pool-C_FR15/fr15-bug-report.md#bug-fr15-auto-006--product-management-lacks-a-meaningful-feature-level-h1) |

## Totals

Counts represent distinct classified defects/issues, not repeated browser failures.

| Metric | FR-06 | FR-08 | FR-15 | Total |
|---|---:|---:|---:|---:|
| Confirmed genuine product defects | 8 | 8 | 12 | 28 |
| Known HW2 defects reproduced | 7 | 6 | 6 | 19 |
| New automation-discovered defects | 1 | 2 | 6 | 9 |
| Test/infrastructure issues | 1 | 0 | 2 | 3 |
| Out-of-scope failures | 0 | 0 | 0 | 0 |

FR-06 has 45 failed TC/browser results: 21 reproduce known defects and 24 reproduce the new first-click defect. One WebKit focus-portability observation is secondary to an EP-001 product-defect result and does not increase the 45-result total.

FR-08 Run #6 has 39 failed TC/browser results, all classified as genuine product defects: 33 reproduce six known HW2 defects and 6 reproduce two new defects. The corrected EP-001 exact-item check passes before directly recording `BUG-FR08-001`, `BUG-FR08-002`, and `BUG-FR08-003`; `TEST-FR08-001`, `TEST-FR08-002`, and `TEST-FR08-003` each recur zero times. No Run #6 failure is a test/infrastructure issue or an out-of-scope API failure.

FR-15 Run #2 has 72 failed TC/browser results: 57 genuine product-failure results reproduce six known and six new defects, while 15 results are exclusively two test/source issues. `TEST-FR15-001` accounts for 12 unrelated price-format failures in Name/Description boundary cases; `TEST-FR15-002` accounts for three exclusive tab-order failures and is also secondary to three EP-010 results already counted as genuine. No Run #2 result is an out-of-scope API failure.

## Aggregation rules

- `/hw4-bugs FR-##` writes full details to the current pool's `fr##-bug-report.md`.
- Root `bug_report.md` contains only totals, a concise bug index, GitHub Issue links, and links to detailed FR reports.
- Root counts are derived from, and never exceed, the detailed per-FR reports.
- A failed assertion is not automatically a product bug; classification requires HW2/SRS, test, environment, and retained evidence.
- API-only HW2 defects remain outside HW4 automation scope and are never presented as browser-automation confirmations.
