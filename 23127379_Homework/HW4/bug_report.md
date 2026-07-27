# HW04 Bug Report — Automation Testing
## Student: 23127379 | Thái Minh Huy
## Feature: FR-06, FR-08, FR-15

---

> **Format Note:**
> - `BUG-FR##-AUTO-###` = Newly discovered by automation
> - `BUG-FR##-###` = Previously documented in HW2 (confirmed by automation)
>
> GitHub Issues: https://github.com/ttbhanh/eshop-sut/issues

---

## Summary Table

| Bug ID | Feature | Severity | Status | GitHub Issue | Source |
|--------|---------|----------|--------|-------------|--------|
| BUG-FR06-001 | FR-06 | High | Open | TBD | HW2 confirmed |
| BUG-FR06-002 | FR-06 | High | Open | TBD | HW2 confirmed |
| BUG-FR06-003 | FR-06 | High | Open | TBD | HW2 confirmed |
| BUG-FR06-004 | FR-06 | High | Open | TBD | HW2 confirmed |
| BUG-FR06-006 | FR-06 | High | Open | TBD | HW2 confirmed |
| BUG-FR08-001 | FR-08 | Medium | Open | TBD | HW2 confirmed |
| BUG-FR08-006 | FR-08 | High | Open | TBD | HW2 confirmed |
| BUG-FR08-008 | FR-08 | Critical | Open | TBD | HW2 confirmed |
| BUG-FR15-001 | FR-15 | Medium | Open | TBD | HW2 confirmed |
| BUG-FR15-003 | FR-15 | Low | Open | TBD | HW2 confirmed |

---

## HW2 Confirmed Bugs (found again during automation)

---
### BUG-FR06-001: Category, breadcrumb missing; Add to Cart button is green not blue
**FR:** FR-06 (Product Detail View)
**Discovered In HW2:** TC-FR06-EP-001
**Confirmed By Automation:** TC-FR06-EP-001 (fr06.spec.ts)
**Browser(s):** All (Chromium, Firefox, WebKit)
**Severity:** High
**Status:** Open
**GitHub Issue:** #TBD

**SRS Violation:**
- FR-06: "Displays in full: Large Image, Name, Price, Description, **Category**"
- FR-21: "Positive action buttons (Submit, Purchase) use **blue**"
- FR-23: "**Breadcrumbs** are required on sub-pages (Cart, Checkout, Product Detail)"

**Expected Result:** Product detail page shows category name, breadcrumb navigation, and blue Add to Cart button.
**Actual Result:** No category displayed, no breadcrumb, button is green.

---
### BUG-FR06-002: Adding same product to cart creates new row instead of incrementing
**FR:** FR-06 (Product Detail View) / FR-07 (Shopping Cart)
**Discovered In HW2:** TC-FR06-EP-004
**Confirmed By Automation:** TC-FR06-EP-004 (fr06.spec.ts)
**Severity:** High
**Status:** Open
**GitHub Issue:** #TBD

**SRS Violation:**
- FR-07: "Adding the same product to the cart **increments its quantity**; it does not create a new row."

**Expected Result:** Cart shows one row for the product with quantity = 3 (2+1).
**Actual Result:** Cart shows two rows: one with qty=2 and one with qty=1.

---
### BUG-FR06-003: Quantity = 0 accepted by cart API
**FR:** FR-06 (Product Detail View)
**Discovered In HW2:** TC-FR06-NEG-006
**Confirmed By Automation:** TC-FR06-NEG-006 (fr06.spec.ts)
**Severity:** High
**Status:** Open
**GitHub Issue:** #TBD

**SRS Violation:**
- FR-06: "A Quantity input field (accepts only positive integers, **minimum value of 1**)"

**Expected Result:** Quantity = 0 rejected; error message displayed.
**Actual Result:** Product added to cart with quantity = 0.

---
### BUG-FR08-001: No h1 tag on checkout and cart pages
**FR:** FR-08 (Checkout)
**Discovered In HW2:** TC-FR08-EP-001
**Confirmed By Automation:** TC-FR08-EP-001, TC-FR08-NEG-007 (fr08.spec.ts)
**Severity:** Medium
**Status:** Open
**GitHub Issue:** #TBD

**SRS Violation:**
- FR-21: "Each page has **exactly 1 `<h1>` tag** describing the page content"

**Expected Result:** Checkout page has exactly one h1 element.
**Actual Result:** No h1 element found; only h2 used as heading.

---
### BUG-FR08-006: Empty shipping address not rejected at checkout
**FR:** FR-08 (Checkout)
**Discovered In HW2:** TC-FR08-NEG-004, TC-FR08-NEG-006
**Confirmed By Automation:** fr08.spec.ts
**Severity:** High
**Status:** Open
**GitHub Issue:** #TBD

**SRS Violation:**
- FR-08 (implied): Checkout requires a valid shipping address
- FR-22: "Error messages must appear **above** the submit button"

**Expected Result:** Empty address rejected with error message above submit button.
**Actual Result:** Order created with empty shipping address.

---
### BUG-FR08-008: Backend accepts client-supplied total_amount (security bug)
**FR:** FR-08 (Checkout)
**Discovered In HW2:** TC-FR08-NEG-005
**Confirmed By Automation:** fr08.spec.ts (API-level test)
**Severity:** Critical
**Status:** Open
**GitHub Issue:** #TBD

**SRS Violation:**
- FR-08: "The backend must **recalculate the total**; it must not accept the `total_amount` value sent by the client"

**Expected Result:** Order stored with server-calculated total (e.g., 30,000,000 ₫).
**Actual Result:** Order stored with client-supplied total (1 ₫).

---
### BUG-FR15-001: No success toast notification on product creation
**FR:** FR-15 (Product Management)
**Discovered In HW2:** TC-FR15-EP-001, TC-FR15-EP-002
**Confirmed By Automation:** fr15.spec.ts
**Severity:** Medium
**Status:** Open
**GitHub Issue:** #TBD

**SRS Violation:**
- FR-24 (implied): Visual feedback expected after CRUD operations

**Expected Result:** Success toast notification displayed after product creation.
**Actual Result:** No toast; product appears in list silently.

---
### BUG-FR15-003: Product price displayed without thousands separator
**FR:** FR-15 (Product Management)
**Discovered In HW2:** TC-FR15-EP-001, TC-FR15-EP-002
**Confirmed By Automation:** fr15.spec.ts
**Severity:** Low
**Status:** Open
**GitHub Issue:** #TBD

**SRS Violation:**
- FR-21: "**Currency consistency**: Always use the ₫ symbol with **thousands-separator** formatting"

**Expected Result:** Price displayed as "15,000,000 ₫".
**Actual Result:** Price displayed as "15000000 ₫".

---

## New Automation-Discovered Bugs

*(Append new BUG-FR##-AUTO-### entries here after automation run)*
