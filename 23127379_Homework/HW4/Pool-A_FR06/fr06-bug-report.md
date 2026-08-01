# FR-06 Detailed Bug Report — Product Detail View

> **Student:** 23127379 — Thái Minh Huy
>
> **Evidence source:** [FR-06 Run Summary](fr06-run-summary.md), Chromium, Firefox, and WebKit reports
>
> **Classification status:** Complete — pending HITL sign-off
>
> **Aggregate report:** [HW04 Bug Report](../bug_report.md)

---

## Classification summary

Run #1 executed 22 tests in each of three browsers. All 45 failed TC/browser results were classified against the JSON results, retained error contexts/screenshots/traces, reviewed spec/data, current React source, HW2 test cases and bug report, and SRS clauses.

| Classification | Distinct count | Failed TC/browser results |
|---|---:|---:|
| Genuine product defects | 8 | 45 |
| Known HW2 defects reproduced | 7 | 21 |
| New automation-discovered defects | 1 | 24 |
| Test or infrastructure issues | 1 secondary observation | 0 exclusively |
| Out of HW4 scope | 0 | 0 |

The eight genuine defects are `BUG-FR06-001`, `BUG-FR06-003`, `BUG-FR06-004`, `BUG-FR06-007`, `BUG-FR06-008`, `BUG-FR06-016`, `BUG-FR06-017`, and new `BUG-FR06-AUTO-001`. The WebKit focus observation is secondary to an EP-001 result that already confirms `BUG-FR06-001`; it is not counted as another failed result.

## Failure classification matrix

Every failed TC/browser result has one row. “First click ignored” refers to a trace-confirmed successful Playwright click after which the button remained `Thêm vào giỏ hàng` and neither permitted feedback nor validation appeared.

| Source TC | Browser | Exact assertion/evidence | Classification | Bug ID | Reason |
|---|---|---|---|---|---|
| TC-FR06-EP-001 | Chromium | Category and breadcrumb not found; expected blue, received `rgb(22, 163, 74)` | Genuine — known | BUG-FR06-001 | Matches canonical display defect |
| TC-FR06-EP-001 | Firefox | Category and breadcrumb not found; expected blue, received `rgb(22, 163, 74)` | Genuine — known | BUG-FR06-001 | Matches canonical display defect |
| TC-FR06-EP-001 | WebKit | Same three display failures; additional first-Tab focus mismatch | Genuine — known; secondary test issue | BUG-FR06-001 | Display defect matches HW2; focus check is engine-preference-sensitive |
| TC-FR06-NEG-012 | Chromium | No alert or login action after one click | Genuine — new | BUG-FR06-AUTO-001 | First click silently ignored; auth bypass itself was not reached |
| TC-FR06-NEG-012 | Firefox | No alert or login action after one click | Genuine — new | BUG-FR06-AUTO-001 | Same trace signature |
| TC-FR06-NEG-012 | WebKit | No alert or login action after one click | Genuine — new | BUG-FR06-AUTO-001 | Same trace signature |
| TC-FR06-BV-001 | Chromium | Category `Điện thoại` not found | Genuine — known | BUG-FR06-016 | Canonical id=1 boundary manifestation |
| TC-FR06-BV-001 | Firefox | Category `Điện thoại` not found | Genuine — known | BUG-FR06-016 | Canonical id=1 boundary manifestation |
| TC-FR06-BV-001 | WebKit | Category `Điện thoại` not found | Genuine — known | BUG-FR06-016 | Canonical id=1 boundary manifestation |
| TC-FR06-BV-002 | Chromium | Category `Điện thoại` not found | Genuine — known | BUG-FR06-017 | Canonical id=2 boundary manifestation |
| TC-FR06-BV-002 | Firefox | Category `Điện thoại` not found | Genuine — known | BUG-FR06-017 | Canonical id=2 boundary manifestation |
| TC-FR06-BV-002 | WebKit | Category `Điện thoại` not found | Genuine — known | BUG-FR06-017 | Canonical id=2 boundary manifestation |
| TC-FR06-EP-003 | Chromium | `Đã thêm` feedback not found after successful click action | Genuine — new | BUG-FR06-AUTO-001 | First click silently ignored |
| TC-FR06-EP-003 | Firefox | `Đã thêm` feedback not found after successful click action | Genuine — new | BUG-FR06-AUTO-001 | Same trace signature |
| TC-FR06-EP-003 | WebKit | `Đã thêm` feedback not found after successful click action | Genuine — new | BUG-FR06-AUTO-001 | Same trace signature |
| TC-FR06-EP-004 | Chromium | Initial setup click produced no `Đã thêm` feedback | Genuine — new | BUG-FR06-AUTO-001 | Duplicate-row verification was never reached; BUG-FR06-002 not confirmed |
| TC-FR06-EP-004 | Firefox | Initial setup click produced no `Đã thêm` feedback | Genuine — new | BUG-FR06-AUTO-001 | Same trace signature |
| TC-FR06-EP-004 | WebKit | Initial setup click produced no `Đã thêm` feedback | Genuine — new | BUG-FR06-AUTO-001 | Same trace signature |
| TC-FR06-NEG-006 | Chromium | No `min="1"` constraint and no alert for value `0` | Genuine — known | BUG-FR06-003 | Reproduces missing zero-quantity UI validation |
| TC-FR06-NEG-006 | Firefox | No `min="1"` constraint and no alert for value `0` | Genuine — known | BUG-FR06-003 | Same validation defect |
| TC-FR06-NEG-006 | WebKit | No `min="1"` constraint and no alert for value `0` | Genuine — known | BUG-FR06-003 | Same validation defect |
| TC-FR06-NEG-007 | Chromium | No `min="1"` constraint and no alert for value `-1` | Genuine — known | BUG-FR06-004 | Reproduces missing negative-quantity UI validation |
| TC-FR06-NEG-007 | Firefox | No `min="1"` constraint and no alert for value `-1` | Genuine — known | BUG-FR06-004 | Same validation defect |
| TC-FR06-NEG-007 | WebKit | No `min="1"` constraint and no alert for value `-1` | Genuine — known | BUG-FR06-004 | Same validation defect |
| TC-FR06-NEG-010 | Chromium | No `required` constraint and no alert for an empty field | Genuine — known | BUG-FR06-007 | Reproduces missing empty-quantity UI validation |
| TC-FR06-NEG-010 | Firefox | No `required` constraint and no alert for an empty field | Genuine — known | BUG-FR06-007 | Same validation defect |
| TC-FR06-NEG-010 | WebKit | No `required` constraint and no alert for an empty field | Genuine — known | BUG-FR06-007 | Same validation defect |
| TC-FR06-BV-008 | Chromium | No `max="999"` constraint and no alert for `999999999` | Genuine — known | BUG-FR06-008 | Reproduces missing practical UI upper bound |
| TC-FR06-BV-008 | Firefox | No `max="999"` constraint and no alert for `999999999` | Genuine — known | BUG-FR06-008 | Same validation defect |
| TC-FR06-BV-008 | WebKit | No `max="999"` constraint and no alert for `999999999` | Genuine — known | BUG-FR06-008 | Same validation defect |
| TC-FR06-NEG-008 | Chromium | Neither alert nor `Đã thêm` feedback appeared after one click | Genuine — new | BUG-FR06-AUTO-001 | Decimal handling was never reached; BUG-FR06-005 not confirmed |
| TC-FR06-NEG-008 | Firefox | Neither alert nor `Đã thêm` feedback appeared after one click | Genuine — new | BUG-FR06-AUTO-001 | Same trace signature |
| TC-FR06-NEG-008 | WebKit | Neither alert nor `Đã thêm` feedback appeared after one click | Genuine — new | BUG-FR06-AUTO-001 | Same trace signature |
| TC-FR06-NEG-011 | Chromium | Neither alert nor `Đã thêm` feedback appeared after one click | Genuine — new | BUG-FR06-AUTO-001 | Large-value handling was never reached by this TC |
| TC-FR06-NEG-011 | Firefox | Neither alert nor `Đã thêm` feedback appeared after one click | Genuine — new | BUG-FR06-AUTO-001 | Same trace signature |
| TC-FR06-NEG-011 | WebKit | Neither alert nor `Đã thêm` feedback appeared after one click | Genuine — new | BUG-FR06-AUTO-001 | Same trace signature |
| TC-FR06-BV-003 | Chromium | `Đã thêm` feedback not found for valid quantity `1` | Genuine — new | BUG-FR06-AUTO-001 | First click silently ignored |
| TC-FR06-BV-003 | Firefox | `Đã thêm` feedback not found for valid quantity `1` | Genuine — new | BUG-FR06-AUTO-001 | Same trace signature |
| TC-FR06-BV-003 | WebKit | `Đã thêm` feedback not found for valid quantity `1` | Genuine — new | BUG-FR06-AUTO-001 | Same trace signature |
| TC-FR06-BV-004 | Chromium | `Đã thêm` feedback not found for valid quantity `2` | Genuine — new | BUG-FR06-AUTO-001 | First click silently ignored |
| TC-FR06-BV-004 | Firefox | `Đã thêm` feedback not found for valid quantity `2` | Genuine — new | BUG-FR06-AUTO-001 | Same trace signature |
| TC-FR06-BV-004 | WebKit | `Đã thêm` feedback not found for valid quantity `2` | Genuine — new | BUG-FR06-AUTO-001 | Same trace signature |
| TC-FR06-BV-005 | Chromium | Neither alert nor `Đã thêm` feedback appeared for valid `999` | Genuine — new | BUG-FR06-AUTO-001 | First click silently ignored |
| TC-FR06-BV-005 | Firefox | Neither alert nor `Đã thêm` feedback appeared for valid `999` | Genuine — new | BUG-FR06-AUTO-001 | Same trace signature |
| TC-FR06-BV-005 | WebKit | Neither alert nor `Đã thêm` feedback appeared for valid `999` | Genuine — new | BUG-FR06-AUTO-001 | Same trace signature |

## Detailed product defects

### BUG-FR06-001 — Required product information, breadcrumb, and positive-action colour are incorrect

- **Source TC(s):** TC-FR06-EP-001
- **Known/New:** HW2 known
- **Severity:** Serious
- **Status:** Open
- **Affected browsers:** Chromium, Firefox, WebKit
- **SRS/HW2 reference:** FR-06, FR-21, FR-23, FR-24
- **GitHub Issue:** <https://github.com/AkiraTomori/eshop-sut/issues/1>

#### Reproduction steps

1. Open `/product/1`.
2. Inspect the product fields, breadcrumb, and Add to Cart button colour.

#### Expected result

All five required fields include Category, a breadcrumb is visible, and the positive-action button is blue.

#### Actual result and assertion failure

Category and breadcrumb locators resolve to no element. The button resolves correctly but its background is `rgb(22, 163, 74)` rather than expected `rgb(37, 99, 235)`.

#### Evidence

- HTML: [Chromium](playwright-report/chromium/index.html), [Firefox](playwright-report/firefox/index.html), [WebKit](playwright-report/webkit/index.html)
- Chromium: [screenshot](test-results/chromium/Pool-A_FR06-fr06-FR-06-pub-5e1c5-ith-a-valid-product-ID-FR06-chromium/test-failed-1.png), [trace](test-results/chromium/Pool-A_FR06-fr06-FR-06-pub-5e1c5-ith-a-valid-product-ID-FR06-chromium/trace.zip)
- Firefox: [screenshot](test-results/firefox/Pool-A_FR06-fr06-FR-06-pub-5e1c5-ith-a-valid-product-ID-FR06-firefox/test-failed-1.png), [trace](test-results/firefox/Pool-A_FR06-fr06-FR-06-pub-5e1c5-ith-a-valid-product-ID-FR06-firefox/trace.zip)
- WebKit: [screenshot](test-results/webkit/Pool-A_FR06-fr06-FR-06-pub-5e1c5-ith-a-valid-product-ID-FR06-webkit/test-failed-1.png), [trace](test-results/webkit/Pool-A_FR06-fr06-FR-06-pub-5e1c5-ith-a-valid-product-ID-FR06-webkit/trace.zip)

#### User impact and rationale

Users lose required product context and navigation, while the action colour conflicts with the interface standard. The exact three canonical symptoms reproduce across all engines.

### BUG-FR06-016 — Category missing at product-ID lower boundary

- **Source TC(s):** TC-FR06-BV-001
- **Known/New:** HW2 known
- **Severity:** Serious
- **Status:** Open
- **Affected browsers:** Chromium, Firefox, WebKit
- **SRS/HW2 reference:** FR-06
- **GitHub Issue:** <https://github.com/AkiraTomori/eshop-sut/issues/16>

#### Reproduction steps

1. Open `/product/1`.
2. Verify image, name, price, description, and category.

#### Expected result

All five fields are visible.

#### Actual result and assertion failure

The first four fields render, but exact category text `Điện thoại` is absent: `expect(locator).toBeVisible()` times out.

#### Evidence

- HTML: [Chromium](playwright-report/chromium/index.html), [Firefox](playwright-report/firefox/index.html), [WebKit](playwright-report/webkit/index.html)
- Chromium: [screenshot](test-results/chromium/Pool-A_FR06-fr06-FR-06-pub-8ed02--valid-product-ID-id-1-FR06-chromium/test-failed-1.png), [trace](test-results/chromium/Pool-A_FR06-fr06-FR-06-pub-8ed02--valid-product-ID-id-1-FR06-chromium/trace.zip)
- Firefox: [screenshot](test-results/firefox/Pool-A_FR06-fr06-FR-06-pub-8ed02--valid-product-ID-id-1-FR06-firefox/test-failed-1.png), [trace](test-results/firefox/Pool-A_FR06-fr06-FR-06-pub-8ed02--valid-product-ID-id-1-FR06-firefox/trace.zip)
- WebKit: [screenshot](test-results/webkit/Pool-A_FR06-fr06-FR-06-pub-8ed02--valid-product-ID-id-1-FR06-webkit/test-failed-1.png), [trace](test-results/webkit/Pool-A_FR06-fr06-FR-06-pub-8ed02--valid-product-ID-id-1-FR06-webkit/trace.zip)

#### User impact and rationale

The smallest valid product ID has incomplete required information. This is the canonical boundary manifestation of the same underlying omission as BUG-FR06-001.

### BUG-FR06-017 — Category missing at product-ID LB+1 boundary

- **Source TC(s):** TC-FR06-BV-002
- **Known/New:** HW2 known
- **Severity:** Serious
- **Status:** Open
- **Affected browsers:** Chromium, Firefox, WebKit
- **SRS/HW2 reference:** FR-06
- **GitHub Issue:** <https://github.com/AkiraTomori/eshop-sut/issues/17>

#### Reproduction steps

1. Open `/product/2`.
2. Verify image, name, price, description, and category.

#### Expected result

All five fields are visible.

#### Actual result and assertion failure

The first four fields render, but exact category text `Điện thoại` is absent in every engine.

#### Evidence

- HTML: [Chromium](playwright-report/chromium/index.html), [Firefox](playwright-report/firefox/index.html), [WebKit](playwright-report/webkit/index.html)
- Chromium: [screenshot](test-results/chromium/Pool-A_FR06-fr06-FR-06-pub-7752f-allest-product-ID-id-2-FR06-chromium/test-failed-1.png), [trace](test-results/chromium/Pool-A_FR06-fr06-FR-06-pub-7752f-allest-product-ID-id-2-FR06-chromium/trace.zip)
- Firefox: [screenshot](test-results/firefox/Pool-A_FR06-fr06-FR-06-pub-7752f-allest-product-ID-id-2-FR06-firefox/test-failed-1.png), [trace](test-results/firefox/Pool-A_FR06-fr06-FR-06-pub-7752f-allest-product-ID-id-2-FR06-firefox/trace.zip)
- WebKit: [screenshot](test-results/webkit/Pool-A_FR06-fr06-FR-06-pub-7752f-allest-product-ID-id-2-FR06-webkit/test-failed-1.png), [trace](test-results/webkit/Pool-A_FR06-fr06-FR-06-pub-7752f-allest-product-ID-id-2-FR06-webkit/trace.zip)

#### User impact and rationale

The repeated omission at LB+1 demonstrates that category loss is systematic rather than a single-product data issue.

### BUG-FR06-003 — Zero quantity lacks UI validation

- **Source TC(s):** TC-FR06-NEG-006
- **Known/New:** HW2 known
- **Severity:** Serious
- **Status:** Open
- **Affected browsers:** Chromium, Firefox, WebKit
- **SRS/HW2 reference:** FR-06
- **GitHub Issue:** <https://github.com/AkiraTomori/eshop-sut/issues/3>

#### Reproduction steps

1. Log in, open `/product/1`, and enter `0`.
2. Click Add to Cart once.

#### Expected result

The input enforces `min=1` or a visible validation error rejects zero.

#### Actual result and assertion failure

The spinbutton retains `0`, has no `min="1"` constraint, and no alert appears. The test does not claim cart insertion because the first click is separately affected by BUG-FR06-AUTO-001.

#### Evidence

- HTML: [Chromium](playwright-report/chromium/index.html), [Firefox](playwright-report/firefox/index.html), [WebKit](playwright-report/webkit/index.html)
- Chromium: [screenshot](test-results/chromium/Pool-A_FR06-fr06-FR-06-aut-3cd90-he-product-detail-page-FR06-chromium/test-failed-1.png), [trace](test-results/chromium/Pool-A_FR06-fr06-FR-06-aut-3cd90-he-product-detail-page-FR06-chromium/trace.zip)
- Firefox: [screenshot](test-results/firefox/Pool-A_FR06-fr06-FR-06-aut-3cd90-he-product-detail-page-FR06-firefox/test-failed-1.png), [trace](test-results/firefox/Pool-A_FR06-fr06-FR-06-aut-3cd90-he-product-detail-page-FR06-firefox/trace.zip)
- WebKit: [screenshot](test-results/webkit/Pool-A_FR06-fr06-FR-06-aut-3cd90-he-product-detail-page-FR06-webkit/test-failed-1.png), [trace](test-results/webkit/Pool-A_FR06-fr06-FR-06-aut-3cd90-he-product-detail-page-FR06-webkit/trace.zip)

#### User impact and rationale

Zero is visibly accepted without any guard or explanation, violating the minimum quantity rule in all browsers.

### BUG-FR06-004 — Negative quantity lacks UI validation

- **Source TC(s):** TC-FR06-NEG-007
- **Known/New:** HW2 known
- **Severity:** Serious
- **Status:** Open
- **Affected browsers:** Chromium, Firefox, WebKit
- **SRS/HW2 reference:** FR-06
- **GitHub Issue:** <https://github.com/AkiraTomori/eshop-sut/issues/4>

#### Reproduction steps

1. Log in, open `/product/1`, and enter `-1`.
2. Click Add to Cart once.

#### Expected result

The input prevents negative values or displays a rejection message.

#### Actual result and assertion failure

The spinbutton retains `-1`, exposes no `min="1"` constraint, and no alert appears.

#### Evidence

- HTML: [Chromium](playwright-report/chromium/index.html), [Firefox](playwright-report/firefox/index.html), [WebKit](playwright-report/webkit/index.html)
- Chromium: [screenshot](test-results/chromium/Pool-A_FR06-fr06-FR-06-aut-a098a-he-product-detail-page-FR06-chromium/test-failed-1.png), [trace](test-results/chromium/Pool-A_FR06-fr06-FR-06-aut-a098a-he-product-detail-page-FR06-chromium/trace.zip)
- Firefox: [screenshot](test-results/firefox/Pool-A_FR06-fr06-FR-06-aut-a098a-he-product-detail-page-FR06-firefox/test-failed-1.png), [trace](test-results/firefox/Pool-A_FR06-fr06-FR-06-aut-a098a-he-product-detail-page-FR06-firefox/trace.zip)
- WebKit: [screenshot](test-results/webkit/Pool-A_FR06-fr06-FR-06-aut-a098a-he-product-detail-page-FR06-webkit/test-failed-1.png), [trace](test-results/webkit/Pool-A_FR06-fr06-FR-06-aut-a098a-he-product-detail-page-FR06-webkit/trace.zip)

#### User impact and rationale

Negative quantities are accepted by the control without guidance, risking invalid cart arithmetic once submission executes.

### BUG-FR06-007 — Empty quantity lacks required validation

- **Source TC(s):** TC-FR06-NEG-010
- **Known/New:** HW2 known
- **Severity:** Serious
- **Status:** Open
- **Affected browsers:** Chromium, Firefox, WebKit
- **SRS/HW2 reference:** FR-06
- **GitHub Issue:** <https://github.com/AkiraTomori/eshop-sut/issues/7>

#### Reproduction steps

1. Log in and open `/product/1`.
2. Clear the quantity field and click Add to Cart once.

#### Expected result

The field retains its minimum, is required, disables submission, or displays an error.

#### Actual result and assertion failure

The spinbutton remains blank, has no `required` constraint, and no validation alert appears.

#### Evidence

- HTML: [Chromium](playwright-report/chromium/index.html), [Firefox](playwright-report/firefox/index.html), [WebKit](playwright-report/webkit/index.html)
- Chromium: [screenshot](test-results/chromium/Pool-A_FR06-fr06-FR-06-aut-45944-he-product-detail-page-FR06-chromium/test-failed-1.png), [trace](test-results/chromium/Pool-A_FR06-fr06-FR-06-aut-45944-he-product-detail-page-FR06-chromium/trace.zip)
- Firefox: [screenshot](test-results/firefox/Pool-A_FR06-fr06-FR-06-aut-45944-he-product-detail-page-FR06-firefox/test-failed-1.png), [trace](test-results/firefox/Pool-A_FR06-fr06-FR-06-aut-45944-he-product-detail-page-FR06-firefox/trace.zip)
- WebKit: [screenshot](test-results/webkit/Pool-A_FR06-fr06-FR-06-aut-45944-he-product-detail-page-FR06-webkit/test-failed-1.png), [trace](test-results/webkit/Pool-A_FR06-fr06-FR-06-aut-45944-he-product-detail-page-FR06-webkit/trace.zip)

#### User impact and rationale

Users can leave an essential numeric field empty without receiving actionable feedback.

### BUG-FR06-008 — Practical quantity upper bound is not enforced

- **Source TC(s):** TC-FR06-BV-008
- **Known/New:** HW2 known
- **Severity:** Medium
- **Status:** Open
- **Affected browsers:** Chromium, Firefox, WebKit
- **SRS/HW2 reference:** FR-06; HW2-approved UI baseline maximum 999
- **GitHub Issue:** <https://github.com/AkiraTomori/eshop-sut/issues/8>

#### Reproduction steps

1. Log in, open `/product/1`, and enter `999999999`.
2. Click Add to Cart once.

#### Expected result

The UI enforces a practical maximum of 999 or displays a clear upper-limit error.

#### Actual result and assertion failure

The spinbutton retains `999999999`, has no `max="999"` constraint, and no alert appears.

#### Evidence

- HTML: [Chromium](playwright-report/chromium/index.html), [Firefox](playwright-report/firefox/index.html), [WebKit](playwright-report/webkit/index.html)
- Chromium: [screenshot](test-results/chromium/Pool-A_FR06-fr06-FR-06-aut-1d443-I-Upper-Boundary-Probe-FR06-chromium/test-failed-1.png), [trace](test-results/chromium/Pool-A_FR06-fr06-FR-06-aut-1d443-I-Upper-Boundary-Probe-FR06-chromium/trace.zip)
- Firefox: [screenshot](test-results/firefox/Pool-A_FR06-fr06-FR-06-aut-1d443-I-Upper-Boundary-Probe-FR06-firefox/test-failed-1.png), [trace](test-results/firefox/Pool-A_FR06-fr06-FR-06-aut-1d443-I-Upper-Boundary-Probe-FR06-firefox/trace.zip)
- WebKit: [screenshot](test-results/webkit/Pool-A_FR06-fr06-FR-06-aut-1d443-I-Upper-Boundary-Probe-FR06-webkit/test-failed-1.png), [trace](test-results/webkit/Pool-A_FR06-fr06-FR-06-aut-1d443-I-Upper-Boundary-Probe-FR06-webkit/trace.zip)

#### User impact and rationale

The UI provides no practical purchase limit and exposes downstream totals to unreasonable values. The API-only BUG-FR06-020 was not claimed by this UI evidence.

### BUG-FR06-AUTO-001 — First Add to Cart click is silently ignored

- **Source TC(s):** TC-FR06-EP-003, TC-FR06-EP-004, TC-FR06-NEG-008, TC-FR06-NEG-011, TC-FR06-NEG-012, TC-FR06-BV-003, TC-FR06-BV-004, TC-FR06-BV-005
- **Known/New:** Automation-discovered
- **Severity:** Serious
- **Status:** Open
- **Affected browsers:** Chromium, Firefox, WebKit
- **SRS/HW2 reference:** FR-06, FR-24
- **GitHub Issue:** https://github.com/AkiraTomori/eshop-sut/issues/59

#### Preconditions

The storefront is running and product 1 exists. Authentication does not affect reproduction.

#### Reproduction steps

1. Open `/product/1`.
2. Optionally enter a valid quantity such as `3`.
3. Click `Thêm vào giỏ hàng` exactly once.
4. Observe the button/feedback and open the cart.
5. Click a second time only to contrast the behavior.

#### Expected result

The first click immediately processes the action and shows a toast or cart-badge update, or displays validation/authentication feedback when the input or user state is invalid.

#### Actual result

The first click is accepted by the browser but produces no action, feedback, validation, or navigation; the button remains `Thêm vào giỏ hàng`. Current source corroborates the trace: `handleAddToCart` increments `clickCount` and returns when `clickCount === 0`, so processing requires a second click.

#### Exact assertion failure

Representative failure: `expect(getByRole('button', { name: /Thêm vào giỏ hàng|Đã thêm/ }).filter({ hasText: 'Đã thêm' })).toBeVisible()` times out after the trace records a successful click. Trace inspection reported no console errors or failed network requests.

#### Evidence

- HTML: [Chromium](playwright-report/chromium/index.html), [Firefox](playwright-report/firefox/index.html), [WebKit](playwright-report/webkit/index.html)
- Chromium EP-003: [screenshot](test-results/chromium/Pool-A_FR06-fr06-FR-06-aut-0989a--an-authenticated-user-FR06-chromium/test-failed-1.png), [trace](test-results/chromium/Pool-A_FR06-fr06-FR-06-aut-0989a--an-authenticated-user-FR06-chromium/trace.zip), [error context](test-results/chromium/Pool-A_FR06-fr06-FR-06-aut-0989a--an-authenticated-user-FR06-chromium/error-context.md)
- Firefox EP-003: [screenshot](test-results/firefox/Pool-A_FR06-fr06-FR-06-aut-0989a--an-authenticated-user-FR06-firefox/test-failed-1.png), [trace](test-results/firefox/Pool-A_FR06-fr06-FR-06-aut-0989a--an-authenticated-user-FR06-firefox/trace.zip), [error context](test-results/firefox/Pool-A_FR06-fr06-FR-06-aut-0989a--an-authenticated-user-FR06-firefox/error-context.md)
- WebKit EP-003: [screenshot](test-results/webkit/Pool-A_FR06-fr06-FR-06-aut-0989a--an-authenticated-user-FR06-webkit/test-failed-1.png), [trace](test-results/webkit/Pool-A_FR06-fr06-FR-06-aut-0989a--an-authenticated-user-FR06-webkit/trace.zip), [error context](test-results/webkit/Pool-A_FR06-fr06-FR-06-aut-0989a--an-authenticated-user-FR06-webkit/error-context.md)

#### User impact and classification rationale

Every add-to-cart attempt appears broken on first use, causing confusion, repeated clicks, and unreliable validation/auth feedback. The exact behavior is absent from HW2, is consistent in all three engines, and is directly confirmed by trace and source, so it receives the next available automation ID.

## Known mappings not confirmed by this run

- **BUG-FR06-002:** EP-004 stopped on the first setup click before creating or inspecting duplicate rows.
- **BUG-FR06-005:** NEG-008 stopped before decimal conversion or cart storage could be observed.
- **BUG-FR06-009:** NEG-012 stopped because the generic first-click defect silently suppressed the action; unauthenticated cart insertion was not observed.
- **BUG-FR06-006:** NEG-009 passed in all three browsers because normal keyboard input could not place `abc` into the `type=number` control and no cart row appeared.
- **BUG-FR06-008 via NEG-011:** NEG-011 stopped at the first-click defect; BUG-FR06-008 is confirmed separately by BV-008's missing UI maximum.

## Test and infrastructure issues

### TEST-FR06-001 — WebKit first-Tab focus assertion is not portable

- **Source:** TC-FR06-EP-001, WebKit only
- **Observed:** After the first `Tab`, `getByRole('link', { name: 'EShop' })` was not focused.
- **Classification:** Test portability issue; return to `/hw4-review FR-06`.
- **Reason:** Chromium and Firefox passed the same sequence, while WebKit/macOS link tabbing depends on browser/platform full-keyboard-access behavior. The test assumes an initial focus origin and link-tabbing preference that it does not establish.
- **Evidence:** [WebKit trace](test-results/webkit/Pool-A_FR06-fr06-FR-06-pub-5e1c5-ith-a-valid-product-ID-FR06-webkit/trace.zip)
- **Correction direction:** Establish a deterministic focus starting point and validate focusable order without depending on host link-tabbing preferences. Do not weaken the SRS tab-order requirement.

## Out-of-scope observations

No browser-run failure used direct API/database actions, and no failed result came from an API-dependent HW2 TC. The nine API-only cases already excluded in `fr06-automation-review.md` remain outside HW4 scope and are not counted as confirmations.

## GitHub Issue draft

### BUG-FR06-AUTO-001 — First Add to Cart click is silently ignored

- **Severity:** Serious
- **Feature:** FR-06 Product Detail View
- **Browsers:** Chromium, Firefox, WebKit
**Source TCs:** EP-003, EP-004, NEG-008, NEG-011, NEG-012, BV-003, BV-004, BV-005

**Summary**

The first click on `Thêm vào giỏ hàng` performs no add, feedback, validation, authentication prompt, or navigation. A second click is required before the handler processes the action.

**Steps**

1. Open `http://localhost:5173/product/1`.
2. Enter quantity `3`.
3. Click `Thêm vào giỏ hàng` once.
4. Observe the unchanged button and cart.
5. Click the button a second time and observe that processing then occurs.

**Expected**

The first click processes the action and immediately shows toast/badge feedback, or appropriate validation/authentication feedback.

**Actual**

The first click is silently ignored in all three browsers. Trace actionability checks pass and the click completes, but no feedback appears. The handler returns on its first invocation because `clickCount === 0`.

**Evidence**

- [Full FR report](playwright-report/index.html)
- [Chromium representative trace](test-results/chromium/Pool-A_FR06-fr06-FR-06-aut-0989a--an-authenticated-user-FR06-chromium/trace.zip)
- [Firefox representative trace](test-results/firefox/Pool-A_FR06-fr06-FR-06-aut-0989a--an-authenticated-user-FR06-firefox/trace.zip)
- [WebKit representative trace](test-results/webkit/Pool-A_FR06-fr06-FR-06-aut-0989a--an-authenticated-user-FR06-webkit/trace.zip)

**GitHub Issue URL:** https://github.com/AkiraTomori/eshop-sut/issues/59
