# HW04 Verified Feature Reference

This file is a navigation aid for HW04. HW2 remains authoritative. Re-read the current FR's complete test-case and bug-report files before generating or reviewing automation.

## Source map

| Order | FR | HW2 test cases | HW2 known bugs | HW4 pool |
|---:|---|---|---|---|
| 1 | FR-06 | `23127379_Homework/HW2/Pool-A_FR06_ProductDetailView/FR06-test-cases.md` | `23127379_Homework/HW2/Pool-A_FR06_ProductDetailView/FR06-bug-report.md` | `23127379_Homework/HW4/Pool-A_FR06/` |
| 2 | FR-08 | `23127379_Homework/HW2/Pool-B_FR08_Checkout/FR08-test-cases.md` | `23127379_Homework/HW2/Pool-B_FR08_Checkout/FR08-bug-report.md` | `23127379_Homework/HW4/Pool-B_FR08/` |
| 3 | FR-15 | `23127379_Homework/HW2/Pool-C_FR15_ProductManagement/FR15-test-cases.md` | `23127379_Homework/HW2/Pool-C_FR15_ProductManagement/FR15-bug-report.md` | `23127379_Homework/HW4/Pool-C_FR15/` |

Shared SRS: `23127379_Homework/HW2/agents/context/eshop-srs.md`.

## HW04 scope filter

Automate browser UI only. HW2 API-only TCs requiring direct HTTP requests, API response/status assertions, or database inspection remain valid HW2 evidence but are excluded from HW4 as `Out of HW4 scope — API testing`. A hybrid TC with an explicit UI path may cover only its UI-observable clauses; list its API/database clauses as not covered. Replace each excluded API-only TC with another eligible UI TC and never use Playwright's request fixture for HW4.

## Recommended TC manifests

These are reviewed starting manifests, not replacements for HW2. Verify every title, step, expected result, status, and Bug ID against the source before use.

### FR-06 — Product Detail

Target: `http://localhost:5173/product/:id`

Recommended 14:

```text
EP-001, EP-002, EP-003, EP-004,
NEG-001, NEG-002, NEG-003, NEG-004, NEG-005,
NEG-006, NEG-007, NEG-009,
BV-001, BV-003
```

Important corrections:

- `BV-001` is the minimum existing product ID (`id=1`), not a quantity boundary.
- `BV-003` is the valid quantity lower boundary (`quantity=1`).
- The UI quantity upper probe `quantity=999` is `BV-005`.
- Known defect mappings in this manifest include:
  - `EP-001 → BUG-FR06-001`
  - `EP-004 → BUG-FR06-002`
  - `NEG-006 → BUG-FR06-003`
  - `NEG-007 → BUG-FR06-004`
  - `NEG-009 → BUG-FR06-006`
  - `BV-001 → BUG-FR06-016` in the detailed HW2 report

Verified source locators:

```text
Name: role=heading level 1
Image: img with non-empty alt
Quantity: input[type="number"]
Add: role=button, name matching "Thêm vào giỏ hàng"
```

The page currently has no category or breadcrumb and has no toast/alert element. Assert spec-correct behaviour and classify failures as known defects.

### FR-08 — Checkout

Target: `http://localhost:5173/checkout`

Recommended 12 UI TCs:

```text
EP-001, EP-002, EP-003,
NEG-001, NEG-003, NEG-004, NEG-006, NEG-007,
BV-001, BV-004, BV-005, BV-006
```

Known defect mappings:

```text
EP-001  → BUG-FR08-001, BUG-FR08-002, BUG-FR08-003
EP-003  → BUG-FR08-005
NEG-004 → BUG-FR08-006, BUG-FR08-007
NEG-006 → BUG-FR08-006, BUG-FR08-007
NEG-007 → BUG-FR08-001, BUG-FR08-002
BV-005  → BUG-FR08-006, BUG-FR08-007
BV-006  → BUG-FR08-009
```

Implementation warning:

- The current `Checkout.jsx` has no `shipping_address` input and does not include `shipping_address` in its checkout request.
- Inspect the live flow and the profile page before selecting a UI locator. Treat absence of the required field as SUT evidence, not permission to invent a selector.
- `NEG-002` and `NEG-005` require direct API testing and are excluded from HW4. They do not count toward the 12 UI TCs.

Verified current UI locators:

```text
Heading: current page uses role=heading level 2 (spec expects one h1)
Total input: input[type="number"]
Coupon: placeholder "Nhập mã giảm giá..."
Checkout: role=button, name "Xác Nhận Thanh Toán"
```

### FR-15 — Product Management

Target: `http://localhost:5174`

Recommended 14:

```text
EP-001 through EP-010,
NEG-005, NEG-009, NEG-010,
BV-003
```

Important corrections:

```text
NEG-001 = missing Authorization header
NEG-002 = malformed JWT
NEG-003 = expired JWT
NEG-004 = authenticated non-admin
NEG-005 = empty product name
NEG-009 = price 0       → BUG-FR15-001
NEG-010 = negative price → BUG-FR15-002
```

Do not reuse the old shifted NEG mapping.

`NEG-001` through `NEG-004` are direct API authorization tests and are excluded from HW4. The recommended manifest starts at `NEG-005`, whose empty-name validation is UI-observable.

Verified current UI facts:

- Admin navigation uses clickable list items, not an “Add Product” button.
- Product inputs currently lack `name` attributes; prefer verified placeholders/labels or add stable `data-testid` values to the SUT through a separately reviewed change.
- Product success uses browser `alert`, not `.toast-success` or `[role="alert"]`.
- Delete currently has no confirmation dialog; this is `BUG-FR15-017` linked to `NEG-029`.

## Browser UI-native checks

Do not classify these as manual-only by default:

```text
Colour        → expect(locator).toHaveCSS(...)
Tab order     → keyboard.press('Tab') + expect(locator).toBeFocused()
```

Malformed JWT, tampered body, HTTP status, and database-only checks are `Out of HW4 scope — API testing`.

## Source discrepancy rule

Some older HW2 TC blocks and bug summaries contain inconsistent Bug IDs. Preserve the TC identity and expected result from `FR##-test-cases.md`, use the detailed bug report/summary for the canonical defect description, and document the discrepancy in `fr##-automation-review.md`. Never silently renumber a defect.
