# FR-15 Automation Review

**Feature:** Product Management (CRUD)  
**Stage:** F2 — reviewed; browser evidence not yet executed  
**Scope:** Web Admin browser UI only  
**Reviewed sources:** FR15 test cases, FR15 detailed bug report, shared EShop SRS, `frontend-admin/src/App.jsx`, shared fixture/BasePage, generated spec/data/POM  
**Human Review:** Pending HITL sign-off

## Final assessment

The corrected suite contains **25 automated UI test cases**: 9 EP, 9 NEG, and 7 BV. Playwright discovers **75 project/test instances** across Chromium, Firefox, and WebKit. One valid EP case is retained as manual-only because the known SUT defect prevents safe UI-only restoration. Twenty-one API/database-dependent cases remain explicitly outside HW4 scope. No browser evidence was executed during this review gate.

The small shared POM remains appropriate: `ProductManagementPage` extends `BasePage` and owns repeated product-form/table interactions; the existing test-scoped authenticated fixture owns context lifecycle; stateless traceability and boundary-materialization helpers remain in the spec. No new fixture or helper module is warranted.

## TC coverage

| TC | Disposition | UI coverage / expected outcome |
|---|---|---|
| TC-FR15-EP-001 | Automated | Full create form, formatted row, image, existing-row preservation, create feedback, persisted edit-form values |
| TC-FR15-EP-002 | Automated | Mandatory-only create, formatted row, image fallback visibility, empty optional values, existing-row preservation, feedback |
| TC-FR15-EP-003 | Manual-only; not counted | Update and isolation draft removed because the mass-update defect makes safe UI-only restoration impossible |
| TC-FR15-EP-004 | Automated | Confirmation dialog, confirm path, deletion, success feedback, unrelated baseline row preserved |
| TC-FR15-EP-005 | Automated | Confirmation dialog, cancel path, original visible row data/image retained, no success feedback |
| TC-FR15-EP-006 | Automated | List row, price format, image, category, loading indicator, baseline presence, exactly one meaningful h1 |
| TC-FR15-EP-007 | Automated | Search field, retained keyword, matching/non-matching rows |
| TC-FR15-EP-008 | Automated | No-match search, header-only table, friendly empty state |
| TC-FR15-EP-009 | Automated | Detail action and all UI-rendered product fields |
| TC-FR15-EP-010 | Automated | Mandatory markers, button colours, error placement, canonical tab order |
| TC-FR15-NEG-005 | Automated | Empty-name rejection, required attribute, visible error placement, unchanged UI row count |
| TC-FR15-NEG-009 | Automated | Zero-price rejection, UI error, no created row |
| TC-FR15-NEG-010 | Automated | Negative-price rejection, UI error, no created row |
| TC-FR15-NEG-024 | Automated | Required asterisks on Name, Price, Category |
| TC-FR15-NEG-025 | Automated | At least the UI-triggerable name validation error appears above Save |
| TC-FR15-NEG-026 | Automated | Blue Save and red Delete computed colours |
| TC-FR15-NEG-027 | Automated | Exactly one meaningful Product Management h1 |
| TC-FR15-NEG-028 | Automated | Name → Price → Description → Image URL → Category → Save focus order |
| TC-FR15-NEG-029 | Automated | Delete confirmation appears and dismissal preserves the row |
| TC-FR15-BV-001 | Automated | Name lengths 1 and 2 through UI |
| TC-FR15-BV-002 | Automated | Name lengths 254 and 255 through UI |
| TC-FR15-BV-006 | Automated | Prices 1 and 2 through UI |
| TC-FR15-BV-007 | Automated | Prices 999,999,998 and 999,999,999 with formatted display |
| TC-FR15-BV-008 | Automated | Price 1,000,000,000 with formatted display |
| TC-FR15-BV-011 | Automated | Description lengths 0 and 1, re-opened through Edit for UI verification |
| TC-FR15-BV-012 | Automated | Description lengths 999 and 1000, re-opened through Edit for UI verification |

HTTP status, response-body, network-call, and database-persistence clauses in hybrid TCs are deliberately not covered and must not be reported as passed.

## Review findings and corrections

| ID | Severity | Original pattern | Correction | Root cause |
|---|---|---|---|---|
| REV-FR15-001 | Critical | EP-003 executed an update against a shared dataset even though the live defect renames every displayed product | Removed it from automated selection and documented a disposable-database manual-only blocker | UI-only cleanup cannot uniquely restore all pre-existing rows after the mass-update defect; execution would violate isolation |
| REV-FR15-002 | High | Known-bug annotations copied conflicting TC-file Bug IDs | Canonicalized annotations to the detailed bug report: EP-001/002/006/009 and valid BV cases no longer claim price-validation Bug IDs; NEG-009 uses BUG-FR15-001 and NEG-010 uses BUG-FR15-002 | Bug IDs were copied from internally inconsistent HW2 TC annotations instead of applying source precedence |
| REV-FR15-003 | High | No eligible boundary tests were automated | Added BV-001, BV-002, BV-006, BV-007, BV-008, BV-011, and BV-012 | Generation met the numeric minimum but missed the required EP/NEG/BV priority representation |
| REV-FR15-004 | High | Tab data followed current DOM order and EP-010 omitted its tab-order clause | Corrected expected order to the HW2 specification and reused a web-first focus helper in EP-010 and NEG-028 | Live SUT behaviour and recorded observed results displaced the spec-correct expectation |
| REV-FR15-005 | Medium | Create feedback assumed only a browser dialog; delete cases did not fully cover feedback/retained data | Accepted either an exact native dialog message or exact DOM notification; added baseline, image, price, and no-success checks where applicable | Notification implementation was over-constrained and several UI-observable clauses were omitted |
| REV-FR15-006 | Medium | Raw `h1` and `table` CSS locators and unused locator members remained in the page object | Replaced them with role locators and removed unused members; retained only the source-verified unnamed `form` structural locator | Locator selection and POM cleanup were incomplete |
| REV-FR15-007 | Low | Long boundary values would otherwise be hardcoded/generated ad hoc | Stored repeat characters and lengths in JSON and materialized them with a stateless spec helper | Boundary data had not been designed for external-data compliance |

## HW2 source discrepancies

1. EP-001/002/003/006/009 and several valid BV cases reference BUG-FR15-001 or BUG-FR15-003 for notification, formatting, status, or isolation observations, but the detailed bug report defines those IDs as zero-price and float-price acceptance defects.
2. NEG-009/010 reference BUG-FR15-009, but the detailed report defines BUG-FR15-009 as non-existent-category acceptance linked to NEG-019. The automation does not attach that unrelated Bug ID.
3. NEG-001 through NEG-004 reference BUG-FR15-005, while the detailed report defines BUG-FR15-005 only for omitted price.
4. The BVA preface/matrix refers to BV-001 through BV-021, while the actual case headings and final totals provide BV-001 through BV-015.
5. NEG-006 and NEG-007 contain unresolved Bug ID placeholders.
6. NEG-024's title says the asterisks are missing, while its expected result requires them to be present. The automation asserts the required, spec-correct state.
7. NEG-027's title permits zero h1 elements, while its expected result requires exactly one meaningful h1. The automation enforces the expected result.
8. NEG-028 specifies Description before Image URL but records a pass against a current React DOM that places Image URL first. The automation follows the specified expected order.
9. The detailed report records zero h1 elements, while current React source has a global `EShop Admin` h1 and a Product Management h2. The required meaningful Product Management h1 is still absent.
10. EP-006 records category and loading UI as observed, while current source renders neither in the product list branch.

## API-dependent cases excluded from HW4

Each case below is **Out of HW4 scope — API testing**. Replacements provide browser-UI coverage but do not claim the excluded protocol/database clauses.

| Excluded TC | API/database dependency | Replacement UI TC(s) |
|---|---|---|
| NEG-001 | Missing Authorization header and HTTP 401 | NEG-024, NEG-027 |
| NEG-002 | Malformed JWT and HTTP 401 | NEG-025, NEG-028 |
| NEG-003 | Expired JWT and HTTP 401 | NEG-026, NEG-029 |
| NEG-004 | Non-admin JWT and HTTP 403 | NEG-005, NEG-009 |
| NEG-012 | Non-numeric payload/API response | NEG-010, BV-006 |
| NEG-013 | Omitted request-body property and HTTP 400 | NEG-005, NEG-025 |
| NEG-014 | Direct over-limit description/API assertion | BV-011, BV-012 |
| NEG-016 | Direct insecure-URL payload/API assertion | EP-001, EP-002 |
| NEG-017 | Direct malformed-URL payload/API assertion | EP-002, EP-009 |
| NEG-019 | Non-existent category ID/database integrity | NEG-009, NEG-010 |
| NEG-020 | Alphanumeric category ID payload and HTTP 400 | NEG-024, NEG-025 |
| NEG-021 | Non-existent path ID and HTTP 404 | EP-009, NEG-029 |
| NEG-022 | Non-integer path ID and HTTP 400 | EP-004, NEG-029 |
| BV-003 | Postman plus direct SQLite truncation check | BV-001, BV-002 |
| BV-004 | Direct API price −1 | NEG-010, BV-006 |
| BV-005 | Direct API price 0 | NEG-009, BV-006 |
| BV-009 | Direct API float 0.5 | BV-006, BV-007 |
| BV-010 | Direct API float 1.0 | BV-006, BV-008 |
| BV-013 | Direct API and database description 1001 | BV-011, BV-012 |
| BV-014 | Direct API max+1 product ID | EP-009, NEG-029 |
| BV-015 | Direct API invalid/zero product IDs | EP-004, NEG-029 |

## Eligible cases not selected

NEG-006, NEG-007, NEG-008, NEG-011, NEG-015, NEG-018, and NEG-023 remain eligible UI candidates but are not needed for the current 25-case suite. They are not labelled API-only or manual-only. The selected set already covers creation, validation, search, display, deletion, accessibility/GUI, and valid name/price/description boundaries.

## Manual-only blocker

**TC-FR15-EP-003:** A Playwright-native UI test was drafted and statically reviewed. The current React update handler changes every product name in client state, including pre-existing products. After that mutation the UI no longer exposes stable identities needed to restore each original row, and API/database reset is prohibited. Running the case against the shared dataset would therefore leave unrelated data corrupted. Execute it only under HITL control with a disposable database snapshot; it is not counted among automated TCs.

For NEG-025/EP-010, Category cannot be made empty through the current UI because the select has no blank option and defaults to category 1. The suite asserts all required markers and the UI-triggerable empty-name error placement; it does not fabricate an empty category payload.

## Classified browser failures

Tracked Run #2 produced 72 failed TC/browser results and three passes. The completed [detailed bug report](fr15-bug-report.md) classifies 57 results as genuine product failures and 15 exclusively as test/source issues. Six known defects were reproduced (`BUG-FR15-001`, `002`, `013`, `014`, `015`, and `017`) and six new cross-browser defects were assigned `BUG-FR15-AUTO-001` through `BUG-FR15-AUTO-006`.

`BUG-FR15-016` was not marked reproduced: its canonical observation is zero h1 elements, whereas current evidence has one global `EShop Admin` h1 and a Product Management h2. That distinct current defect is `BUG-FR15-AUTO-006`. Four boundary TCs (`BV-001`, `BV-002`, `BV-011`, `BV-012`) fail only because their helper adds price formatting beyond the authoritative boundary expectations (`TEST-FR15-001`). NEG-028's specified order conflicts with the SRS visual-order requirement and its own recorded HW2 result (`TEST-FR15-002`); the same mismatch is secondary in EP-010, which independently reproduces genuine UI defects.

## Assertion-pattern inventory

The spec uses at least these distinct Playwright patterns:

- `toHaveURL`
- `toBeVisible` / `not.toBeVisible`
- `toHaveText`
- `toContainText`
- `toHaveValue`
- `toHaveCount`
- `toHaveAttribute`
- `toHaveCSS`
- `toBeFocused`
- `expect.poll(...).toBe(...)`

All browser-facing assertions are awaited. There are no sleeps, forced actions, broad catches, `page.evaluate()`, request fixtures, direct endpoints, network-response assertions, or database operations.

## Validation status

- External JSON parses successfully.
- TypeScript compilation passes with `npx tsc --noEmit`.
- Playwright discovery lists 25 tests per browser project, 75 total.
- The selected/excluded/eligible/manual manifest partitions all 54 authoritative FR-15 TCs without duplication.
- `playwright-cli` is unavailable; locator verification used `frontend-admin/src/App.jsx` plus standard Playwright discovery. No CLI evidence is claimed.
- Browser evidence Run #2 completed for Chromium, Firefox, and WebKit with 1 passed and 24 failed tests per browser; isolated reports, screenshots, traces, and error contexts are retained.
- All 72 failures are classified in `fr15-bug-report.md`; GitHub Issue drafts for six new defects remain pending HITL creation.
