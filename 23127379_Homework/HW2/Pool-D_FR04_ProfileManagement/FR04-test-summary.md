# Test Summary Report — FR-04: Personal Profile Management
**Test Cycle:** HW02 Domain Testing — Pool D
**Date Range:** 2026-06-14 to 2026-06-15
**Tester:** Thái Minh Huy + Gemini QA Agent
**Platform:** Mobile App (React Native + Expo) · API: `PUT /api/users/me` · `GET /api/users/me`
**Backend:** Node.js + Express at `http://localhost:3000`

---

## Summary

This test cycle applied Domain Testing methodology (Equivalence Partitioning + Boundary Value Analysis) to FR-04 Personal Profile Management on the EShop mobile application. Testing covered all input and output variables across authentication, full name, phone number, shipping address, email immutability, and role-protection constraints.

Of 31 test cases executed, **13 passed and 18 failed**, yielding an overall pass rate of **41.9%**. The failure density is concentrated in server-side API validation: the backend does not enforce mandatory field constraints, string length limits, or phone format rules. Two **Fatal** defects were discovered — one representing token expiry bypass and one representing a critical privilege escalation vulnerability that allows any standard user to promote themselves to administrator.

The feature is **not ready for release** in its current state.

---

## Test Execution Summary

| Type | Total | Passed | Failed | Blocked | Skipped | Not Run | Pass Rate |
|------|:-----:|:------:|:------:|:-------:|:-------:|:-------:|:---------:|
| EP (Equivalence) | 4 | 1 | 3 | 0 | 0 | 0 | 25.0% |
| NEG (Invalid/Negative) | 13 | 2 | 11 | 0 | 0 | 0 | 15.4% |
| BV (Boundary) | 14 | 10 | 4 | 0 | 0 | 0 | 71.4% |
| **TOTAL** | **31** | **13** | **18** | **0** | **0** | **0** | **41.9%** |

### Passed Test Cases (13)

| TC ID | Title (abbreviated) | Type |
|-------|---------------------|:----:|
| TC-FR04-EP-004 | Profile screen pre-populates existing user data on navigation | EP |
| TC-FR04-NEG-001 | Profile update rejected with no Authorization header | NEG |
| TC-FR04-NEG-012 | Email change attempt silently ignored by API | NEG |
| TC-FR04-BV-001 | Full Name = 1 character (LB) accepted | BV |
| TC-FR04-BV-002 | Full Name = 2 characters (LB+1) accepted | BV |
| TC-FR04-BV-003 | Full Name = 254 characters (UB-1) accepted | BV |
| TC-FR04-BV-004 | Full Name = 255 characters (UB) accepted | BV |
| TC-FR04-BV-007 | Phone = 10 digits (LB) accepted | BV |
| TC-FR04-BV-008 | Phone = 11 digits (UB) accepted | BV |
| TC-FR04-BV-010 | Shipping Address = 1 character (LB) accepted | BV |
| TC-FR04-BV-011 | Shipping Address = 2 characters (LB+1) accepted | BV |
| TC-FR04-BV-012 | Shipping Address = 254 characters (UB-1) accepted | BV |
| TC-FR04-BV-013 | Shipping Address = 255 characters (UB) accepted | BV |

### Failed Test Cases (18)

| TC ID | Title (abbreviated) | Type | Bug ID |
|-------|---------------------|:----:|--------|
| TC-FR04-EP-001 | Profile update with valid 10-digit phone | EP | BUG-FR04-001 |
| TC-FR04-EP-002 | Profile update with valid 11-digit phone | EP | BUG-FR04-001 |
| TC-FR04-EP-003 | Profile update with optional phone/address empty | EP | BUG-FR04-001 |
| TC-FR04-NEG-002 | Malformed JWT returns HTTP 403 instead of 401 | NEG | BUG-FR04-002 |
| TC-FR04-NEG-003 | Expired JWT accepted — profile updated | NEG | BUG-FR04-003 |
| TC-FR04-NEG-004 | Empty name `""` accepted by API | NEG | BUG-FR04-004 |
| TC-FR04-NEG-005 | Name > 255 chars accepted and stored | NEG | BUG-FR04-005 |
| TC-FR04-NEG-006 | Missing `name` key accepted by API | NEG | BUG-FR04-006 |
| TC-FR04-NEG-007 | Phone not starting with `0` accepted | NEG | BUG-FR04-007 |
| TC-FR04-NEG-008 | 9-digit phone: rejected but wrong error text (9-10 instead of 10-11) | NEG | BUG-FR04-001 |
| TC-FR04-NEG-009 | 12-digit phone: rejected but wrong error text (9-10 instead of 10-11) | NEG | BUG-FR04-001 |
| TC-FR04-NEG-010 | Non-numeric phone `"0912-345-678"` accepted by API | NEG | BUG-FR04-008 |
| TC-FR04-NEG-011 | Address > 255 chars accepted and stored | NEG | BUG-FR04-010 |
| TC-FR04-NEG-013 | Role escalation via PUT payload — `role="admin"` stored | NEG | BUG-FR04-009 |
| TC-FR04-BV-005 | Full Name = 256 chars (UB+1) accepted — no rejection | BV | BUG-FR04-005 |
| TC-FR04-BV-006 | Phone = 9 digits: rejected but wrong error text | BV | BUG-FR04-001 |
| TC-FR04-BV-009 | Phone = 12 digits (UB+1) accepted by API | BV | BUG-FR04-008 |
| TC-FR04-BV-014 | Address = 256 chars (UB+1) accepted — no rejection | BV | BUG-FR04-010 |

---

## Defect Summary

| Bug ID | Problem Summary | Severity | Priority | Status | Linked TCs |
|--------|----------------|:--------:|:--------:|:------:|-----------|
| BUG-FR04-001 | Wrong phone validation regex (9–10 digits enforced; SRS: 10–11) — blocks all valid phone inputs | Serious | Serious | New | EP-001, EP-002, EP-003, NEG-008, NEG-009, BV-006 |
| BUG-FR04-002 | Malformed JWT returns HTTP 403 instead of HTTP 401 | Medium | Medium | New | NEG-002 |
| BUG-FR04-003 | Expired JWT accepted — profile updated without authentication error | **Fatal** | **Immediate** | New | NEG-003 |
| BUG-FR04-004 | Empty string `""` accepted as valid mandatory `name` field | Serious | Serious | New | NEG-004 |
| BUG-FR04-005 | Full Name > 255 chars accepted and stored without rejection | Serious | Serious | New | NEG-005, BV-005 |
| BUG-FR04-006 | Missing `name` key in PUT body accepted — DB state changed | Serious | Serious | New | NEG-006 |
| BUG-FR04-007 | Phone prefix `0` constraint not enforced at UI or API layer | Serious | Serious | New | NEG-007 |
| BUG-FR04-008 | Non-numeric phone & 12-digit phone accepted by API — no server-side phone format validation | Serious | Serious | New | NEG-010, BV-009 |
| BUG-FR04-009 | 🚨 Role privilege escalation via PUT payload — `role="admin"` committed to DB; violates SEC-06 | **Fatal** | **Immediate** | New | NEG-013 |
| BUG-FR04-010 | Shipping Address > 255 chars accepted and stored without rejection | Serious | Serious | New | NEG-011, BV-014 |

**GitHub Issues filed:** #32 · #33 · #34 · #35 · #36 · #37 · #38 · #39 · #40 · #41  
**Repository:** https://github.com/AkiraTomori/eshop-sut/issues

---

## Defect Statistics

### By Severity

| Severity | Count | % of Total |
|:--------:|:-----:|:----------:|
| **Fatal** | 2 | 20.0% |
| **Serious** | 7 | 70.0% |
| **Medium** | 1 | 10.0% |
| **Cosmetic** | 0 | 0.0% |
| **TOTAL** | **10** | **100%** |

> ⚠️ Fatal defects must be **zero** before any release. Serious defects require sign-off from the project lead.

### By Defect Type

| Defect Type | Count | Bugs |
|-------------|:-----:|------|
| Business Logic | 4 | BUG-FR04-001, BUG-FR04-004, BUG-FR04-007, BUG-FR04-002 |
| Coding Logic / Missing Validation | 4 | BUG-FR04-005, BUG-FR04-006, BUG-FR04-008, BUG-FR04-010 |
| Security / Access Control | 2 | BUG-FR04-003, BUG-FR04-009 |

### By Status

| Status | Count |
|:------:|:-----:|
| New | 10 |
| Open | 0 |
| Fixed | 0 |
| Closed | 0 |
| Deferred | 0 |

---

## Feature Area Risk Assessment

| Area | TCs | Failed | Defect Density | Risk Level |
|------|:---:|:------:|:--------------:|:----------:|
| Authentication (JWT) | 4 | 2 | 50% | 🔴 High |
| Phone Number Validation | 8 | 6 | 75% | 🔴 High |
| Full Name Validation | 7 | 3 | 43% | 🟠 Medium-High |
| Role / Security (SEC-06) | 2 | 1 | 50% | 🔴 High |
| Shipping Address Validation | 6 | 2 | 33% | 🟠 Medium |
| Email Immutability | 1 | 0 | 0% | 🟢 Low |
| Profile Data Pre-load (UI) | 3 | 0 | 0% | 🟢 Low |

---

## Open Points / Risks

1. **BUG-FR04-009 (Role Escalation — Fatal/Immediate):** Any authenticated user can self-escalate to `admin` role via a single API call. This must be treated as a **P0 security incident** and patched before any further testing or deployment. Until fixed, admin-only endpoints are accessible to all users who exploit this vulnerability.

2. **BUG-FR04-003 (Expired JWT — Fatal/Immediate):** Token expiry is not enforced. Stolen or leaked tokens remain valid indefinitely — the primary security control (token expiry) for session management is non-functional. All user data is exposed to persistent unauthorized access.

3. **BUG-FR04-001 (Phone Regex — Serious):** The client-side regex error means **all valid 10–11 digit phone numbers are rejected** by the mobile UI, making the phone update feature completely broken from the user's perspective. This impacts all 3 EP valid test cases covering phone input.

4. **No server-side input validation layer detected:** Defects BUG-FR04-004, 005, 006, 007, 008, 010 all indicate the same root cause — the `PUT /api/users/me` endpoint lacks a validation middleware layer (e.g., express-validator or Joi). A single architectural fix (adding a validation schema to the route) would likely resolve 6 of the 10 reported bugs.

5. **Spec ambiguity — 255-char boundary not documented in SRS:** The 255-character upper limit for name and address fields was inherited from FR-08 DB baseline (HITL-confirmed in Phase 2), not stated in FR-04 itself. The development team may not be aware of this constraint. The SRS should be updated to formally specify these limits.

---

## Release Recommendation

☐ Go &nbsp;&nbsp; **☑ No-Go** &nbsp;&nbsp; ☐ Conditional Go

**Reason:** FR-04 Personal Profile Management contains **2 Fatal defects** (BUG-FR04-003: expired token accepted; BUG-FR04-009: role privilege escalation). Both are security-critical and completely block release. Additionally, the primary user-facing phone update flow is broken (BUG-FR04-001), and the API validation layer is largely absent (6 additional Serious bugs). The feature requires significant backend remediation before re-testing.

**Minimum fix criteria before re-test:**
1. Patch BUG-FR04-009 (role escalation) — **mandatory before any deployment**
2. Patch BUG-FR04-003 (expired JWT) — **mandatory before any deployment**
3. Correct BUG-FR04-001 (phone regex) — unblocks all valid EP test cases
4. Implement server-side validation middleware for `PUT /api/users/me` — resolves BUG-FR04-004, 005, 006, 007, 008, 010
