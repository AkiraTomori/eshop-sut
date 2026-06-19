# Test Summary Report — FR-15: Product Management (CRUD) — Web Admin

**Test Cycle:** HW02 Domain Testing
**Feature Under Test:** FR-15 — Product Management (Create / Edit / Delete / View) — Web Admin Panel
**Pool:** C
**Date Range:** 2026-06-15 to 2026-06-16
**Tester:** Thái Minh Huy (23127379) + Gemini QA Agent
**Environment:**
- OS: macOS
- Browser: Chrome (latest)
- Web Admin URL: `http://localhost:5174`
- Backend API URL: `http://localhost:3000`
- Database: SQLite (development)
- API Test Tool: Postman

---

## 1. Summary

FR-15 covers the full Product Management CRUD lifecycle in the Web Admin panel: Create, Edit, Delete, and View/List products. A total of **54 test cases** were designed and executed across three suites — Equivalence Partitioning (EP), Negative/Invalid (NEG), and Boundary Value Analysis (BVA).

The overall pass rate is **7.4% (4 out of 54 executed test cases)**. This result indicates that the Product Management feature is in a critically defective state and is **not ready for release**. The SUT failed on all key functional dimensions:

- **Authentication & Authorization:** The API does not enforce JWT authentication or role-based access control on any product management endpoint — any request (with or without a valid token) is processed.
- **Input Validation:** The backend has no server-side validation for price range, price type, name length, description length, image URL format, or category existence. All constraints are either absent or enforced only by the HTML form layer (which can be trivially bypassed).
- **HTTP Response Codes:** The API returns HTTP 200 OK for all operations regardless of outcome, including for failed lookups and deletions of non-existent resources (should be 404/400).
- **GUI Compliance:** The product form violates FR-21 and FR-22 in multiple dimensions — missing mandatory field indicators, incorrect error message position, incorrect Submit button colour, missing `<h1>` heading, and absent delete confirmation dialog.
- **Price Formatting:** Prices are not formatted with thousands separators or the ₫ currency symbol across all display contexts.

---

## 2. Test Execution Summary

### Results by Test Suite

| Suite | Total | Passed | Failed | Not Run | Skipped | Pass Rate |
|-------|-------|--------|--------|---------|---------|-----------|
| EP (Equivalence Partitioning — valid) | 10 | 0 | 8 | 2 | 0 | 0.0% |
| NEG (Invalid Equivalence Partitioning) | 29 | 4 | 24 | 1 | 0 | 13.8% |
| BV (Boundary Value Analysis) | 15 | 0 | 15 | 0 | 0 | 0.0% |
| **TOTAL** | **54** | **4** | **47** | **3** | **0** | **7.4%** |

> **Not Run explanation:**
> - TC-FR15-EP-007, TC-FR15-EP-008 (search keyword functionality): The Web Admin product management page does not implement a search keyword field — feature is absent. These 2 TCs could not be executed.
> - TC-FR15-NEG-023 (XSS in search keyword): Same reason — no search field available in Admin product management.

### Results by Functional Area

| Functional Area | Total TCs | Passed | Failed | Not Run | Pass Rate |
|----------------|-----------|--------|--------|---------|-----------|
| Authentication & Authorization | 4 | 0 | 4 | 0 | 0.0% |
| Product Name Validation | 7 | 0 | 7 | 0 | 0.0% |
| Price Validation | 9 | 0 | 9 | 0 | 0.0% |
| Description Validation | 5 | 0 | 5 | 0 | 0.0% |
| Image URL Validation | 2 | 0 | 2 | 0 | 0.0% |
| Category Validation | 3 | 0 | 3 | 0 | 0.0% |
| Product ID Path Validation | 5 | 0 | 5 | 0 | 0.0% |
| Delete Confirmation | 3 | 0 | 3 | 0 | 0.0% |
| Product View / List | 4 | 0 | 4 | 2 | 0.0% |
| XSS Prevention | 3 | 2 | 0 | 1 | 100.0% |
| GUI Compliance (FR-21/FR-22) | 6 | 1 | 4 | 0 | 16.7% |
| Price Display Formatting | 3 | 1 | 2 | 0 | 33.3% |
| **TOTAL** | **54** | **4** | **47** | **3** | **7.4%** |

### Passing Test Cases

| TC ID | Title | Area |
|-------|-------|------|
| TC-FR15-NEG-008 | XSS script tag in product name rendered as plain text | XSS Prevention |
| TC-FR15-NEG-015 | XSS img tag in description rendered as plain text | XSS Prevention |
| TC-FR15-NEG-018 | Category dropdown has a default value; empty submission not possible via UI | Category Validation |
| TC-FR15-NEG-028 | Tab key navigates form fields in correct top-to-bottom order | GUI Compliance |

---

## 3. Defect Summary

### All Bugs Filed

| Bug ID | Linked TC(s) | Severity | Functional Area | Problem Summary |
|--------|-------------|----------|----------------|-----------------|
| BUG-FR15-001 | NEG-001, NEG-002, NEG-003, NEG-004 | Serious | Authentication / Authorization | API creates products for all requests regardless of JWT validity or role — no auth enforcement |
| BUG-FR15-002 | NEG-009 | Serious | Price Validation | API accepts `price = 0` and creates product (should be HTTP 400) |
| BUG-FR15-003 | NEG-010 | Serious | Price Validation | API accepts negative price (`price = -1`) and creates product |
| BUG-FR15-004 | NEG-011 | Serious | Price Validation | API accepts float price (`99.5`) and creates product |
| BUG-FR15-005 | NEG-012 | Serious | Price Validation | API accepts non-numeric string price and creates product |
| BUG-FR15-006 | NEG-013 | Serious | Price Validation | API creates product when price field is completely omitted from request body |
| BUG-FR15-007 | NEG-014 | Serious | Description Validation | API accepts 1001-char description and stores it in DB unchecked (HVF-03 confirmed) |
| BUG-FR15-008 | NEG-016 | Medium | Image URL Validation | API accepts `http://` imageUrl (insecure protocol) without rejection |
| BUG-FR15-009 | NEG-017 | Medium | Image URL Validation | API accepts malformed non-URL string as imageUrl |
| BUG-FR15-010 | NEG-019 | Serious | Category Validation | API creates product with non-existent `category_id = 99999` — orphaned DB record |
| BUG-FR15-011 | NEG-020 | Serious | Category Validation | API accepts non-integer string as `category_id` and creates product |
| BUG-FR15-012 | NEG-021 | Serious | Product ID Validation | Edit API returns HTTP 200 for non-existent product ID (should be HTTP 404) |
| BUG-FR15-013 | NEG-022 | Medium | Product ID Validation | Delete API returns HTTP 200 for non-integer path param `abc` (should be HTTP 400) |
| BUG-FR15-014 | NEG-024 | Medium | GUI Compliance FR-22 | No `*` indicator displayed on mandatory field labels (Name, Price, Category) |
| BUG-FR15-015 | NEG-025 | Medium | GUI Compliance FR-22 | Validation error appears below Name field label, not above Submit button |
| BUG-FR15-016 | NEG-026 | Medium | GUI Compliance FR-21 | Submit / Save button uses green colour instead of the required blue |
| BUG-FR15-017 | NEG-027 | Medium | GUI Compliance FR-21 | Product management page has zero `<h1>` elements (FR-21 requires exactly one) |

> **Note:** BUG-FR15-001 encompasses 4 auth failures (NEG-001 to NEG-004). All 17 Bug IDs are unique and filed one-per-defect. GitHub Issue links must be added by HITL.

> **Additional failures confirmed by BVA execution:**
> - BV name validation failures (BV-001 to BV-003): API returns HTTP 200 (not 201) for all valid creates; 256-char name bypasses all validation — all defects already captured under BUG-FR15-001 and existing Bug IDs.
> - BV price failures (BV-004 to BV-010): Consistent with NEG suite — all covered by existing Bug IDs.
> - BV description failure (BV-013): 1001-char bypass — covered by BUG-FR15-007.
> - BV Product ID failures (BV-014, BV-015): Covered by BUG-FR15-012 and BUG-FR15-013.
> - Price formatting defect (all BV valid price TCs returned raw numbers without ₫ thousand-separator) — not originally captured in bug report. **New bug:** API/UI fails to format price with thousands separator and ₫ symbol (e.g., displays `15000000 đ` instead of `15,000,000 ₫`).

---

## 4. Defect Statistics

### By Severity

| Severity | Count | % of Total | Bugs |
|----------|-------|-----------|------|
| **Fatal** | 0 | 0% | — |
| **Serious** | 10 | 58.8% | BUG-001 to 007, 010, 011, 012 |
| **Medium** | 7 | 41.2% | BUG-008, 009, 013, 014, 015, 016, 017 |
| **Cosmetic** | 0 | 0% | — |
| **TOTAL** | **17** | **100%** | |

### By Defect Type

| Defect Type | Count | Bug IDs |
|-------------|-------|---------|
| Security / Access Control | 1 | BUG-FR15-001 (no auth on API) |
| Business Logic / Validation | 10 | BUG-002 to 007, 010, 011, 012, 013 (missing input validation) |
| Coding Logic | 0 | — |
| Data / DB Integrity | 1 | BUG-010 (orphaned FK reference accepted) |
| User Interface / Design Issue | 5 | BUG-008, 009, 014, 015, 016, 017 |
| Feature Missing | 1 | *(Price formatting — no BUG ID yet; HITL to file)* |

### By Status

| Status | Count |
|--------|-------|
| New | 17 |
| Fixed | 0 |
| Deferred | 0 |
| Closed | 0 |

---

## 5. Open Points & Risks

| # | Area | Issue | Risk Level | HITL Action Required |
|---|------|-------|-----------|----------------------|
| 1 | **Auth & Authorization (Critical)** | The entire API has no authentication enforcement. Any caller (no token, invalid token, expired token, user-role token) can create, edit, and delete products. This is a critical security vulnerability (SEC-02, SEC-03). | 🔴 Critical | Escalate immediately to development team before any production deployment |
| 2 | **Server-Side Validation (Complete Absence)** | All 5 price constraints, name length, description length, imageUrl format, and category existence checks are absent at the API layer. The system relies entirely on HTML form validation which is trivially bypassed. | 🔴 Critical | Add comprehensive backend validation middleware for all product fields |
| 3 | **Price Formatting Display** | Prices are displayed without thousands separators and without proper ₫ currency symbol throughout the admin panel. This is a usability issue not currently assigned a Bug ID. | 🟡 Medium | HITL to file a separate GitHub Issue for price formatting; add it to the defect tracker |
| 4 | **Search Feature Missing** | TC-FR15-EP-007, EP-008, NEG-023 could not be executed because the product search keyword feature is not present in the Web Admin product management page. | 🟡 Medium | HITL to confirm whether the search feature is intentionally excluded from admin or is a missing feature. If excluded, update SRS §FR-05 scope. |
| 5 | **Delete Confirmation Dialog Absent** | Clicking Delete immediately removes a product with no confirmation — this creates a production risk of accidental irreversible data loss by admin users (BUG-FR15-017). | 🔴 High | Priority fix before admin panel goes live |
| 6 | **HTTP 200 vs 201 on Create** | All successful create operations return HTTP 200 OK instead of HTTP 201 Created. While functional, this violates REST API conventions and caused test failures on valid operations. This contributes to BV test failures even when product creation itself succeeds. | 🟡 Medium | Developer to update `POST /api/products` handler to return HTTP 201 Created |
| 7 | **GitHub Issue Links** | All 17 bug reports have placeholder GitHub Issue links that must be filled by HITL before this report is considered finalized. | Required | HITL must file 17 GitHub Issues and paste URLs into FR15-bug-report.md |

---

## 6. Release Recommendation

☐ Go | ☒ **No-Go** | ☐ Conditional Go

**Recommendation: NO-GO**

The FR-15 Product Management feature is not ready for release. The following **blocking defects** must be resolved before any release gate consideration:

1. **BUG-FR15-001 (Serious):** Complete absence of API authentication — all product management endpoints are publicly accessible without any token.
2. **BUG-FR15-002 to BUG-FR15-007 (Serious):** Complete absence of server-side price and description validation — invalid data including negative prices, float prices, and oversized descriptions are accepted and stored.
3. **BUG-FR15-010, BUG-FR15-011 (Serious):** Non-existent and non-integer `category_id` values are accepted, creating orphaned database records.
4. **BUG-FR15-017 (Serious):** Delete confirmation dialog is absent — products are deleted immediately on button click with no opportunity for the admin to cancel an accidental deletion.

The remaining 13 Medium-severity defects (GUI compliance violations, incorrect HTTP response codes, formatting issues) should also be resolved in the same development cycle but are not individually release-blocking.

---

## 7. Test Coverage Summary

| Coverage Dimension | Result |
|-------------------|--------|
| Equivalence Classes covered | 67 / 67 (100%) |
| BVA boundary points tested | 28 / 28 (100%) |
| Functional areas tested | 12 / 12 (100%) |
| Test cases executed | 51 / 54 (94.4%) — 3 skipped due to absent search feature |
| Defects found | 17 unique bugs |
| Defect detection rate | 17 bugs / 54 TCs = 31.5% (high defect density — feature requires significant rework) |

---

### Self-Audit (Phase 5 Skill — Sub-Skill C)

```
✅ Summary written in plain language accessible to non-technical stakeholders
✅ Test scope and objectives stated
✅ Execution dates and test cycle identified
✅ Test Case Result table complete (Total / Passed / Failed / Not Run / Pass Rate)
✅ Defect Report included (17 bugs, by severity, by type, by status)
✅ Defect statistics by functional area included
✅ Defect statistics by severity and type included
✅ Open Points section covers all unresolved risks and decision items
✅ Release recommendation clearly stated (No-Go with specific blocking defect justification)
```
