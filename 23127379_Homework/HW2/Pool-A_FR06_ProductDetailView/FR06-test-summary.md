# Test Summary Report — FR-06: Product Detail View
**Test Cycle:** HW02 Domain Testing
**Date Range:** 2026-06-13 to 2026-06-13
**Tester:** Thái Minh Huy + Gemini QA Agent

## Test Execution Summary

| Type | Total | Passed | Failed | Blocked | Skipped | Not Run | Pass Rate |
|------|-------|--------|--------|---------|---------|---------|-----------|
| EP (Equivalence) | 4 | 2 | 2 | 0 | 0 | 0 | 50.0% |
| BV (Boundary) | 8 | 3 | 5 | 0 | 0 | 0 | 37.5% |
| NEG (Invalid) | 18 | 5 | 13 | 0 | 0 | 0 | 27.8% |
| **TOTAL** | 30 | 10 | 20 | 0 | 0 | 0 | 33.3% |

## Defect Summary

| Bug ID | Summary | Severity | Priority | Status |
|--------|---------|----------|----------|--------|
| BUG-FR06-001 | Category name missing, missing breadcrumbs, wrong button colour | Serious | High | New |
| BUG-FR06-002 | Add to Cart duplicate row instead of incrementing | Serious | High | New |
| BUG-FR06-003 | Quantity field accepts zero value | Serious | High | New |
| BUG-FR06-004 | Quantity field accepts negative integer | Serious | Immediate | New |
| BUG-FR06-005 | Quantity field accepts decimal and silently truncates | Medium | Medium | New |
| BUG-FR06-006 | Quantity field accepts NaN string | Serious | High | New |
| BUG-FR06-007 | Quantity field accepts empty value | Serious | High | New |
| BUG-FR06-008 | Quantity field accepts extremely large value | Medium | Medium | New |
| BUG-FR06-009 | Unauthenticated add to cart allowed | Serious | Immediate | New |
| BUG-FR06-010 | API accepts non-existent product ID | Serious | High | New |
| BUG-FR06-011 | API accepts zero price — product purchasable at ₫0 | Fatal | Immediate | New |
| BUG-FR06-012 | API accepts negative price — negative cart total possible | Fatal | Immediate | New |
| BUG-FR06-013 | API accepts zero quantity — no server-side minimum guard | Serious | High | New |
| BUG-FR06-014 | API accepts NaN string quantity — NaN stored in DB corrupting cart | Serious | High | New |
| BUG-FR06-015 | Price tampering attack — `price=1` accepted for a ₫30M product | Fatal | Immediate | New |
| BUG-FR06-016 | Category missing at LB (id=1) *(duplicate of BUG-FR06-001)* | Serious | Medium | New |
| BUG-FR06-017 | Category missing at LB+1 (id=2) — confirms systematic defect | Serious | Medium | New |
| BUG-FR06-018 | Price tampering confirmed at boundary (price=1) *(duplicate of BUG-FR06-015)* | Fatal | Immediate | New |
| BUG-FR06-019 | API accepts quantity=-1 (BVA LB-1) — no boundary enforcement | Serious | Immediate | New |
| BUG-FR06-020 | API accepts quantity=999999999 — no upper bound; no total field | Medium | Medium | New |

## Defect Statistics
- **Total bugs found:** 20
- **Fatal:** 4 | **Serious:** 13 | **Medium:** 3 | **Cosmetic:** 0
- **Open:** 20 | **Fixed:** 0 | **Deferred:** 0

## Open Points / Risks
- **Critical Security Flaw:** The cart API's blind trust in client-submitted prices allows anyone to modify product pricing, creating orders for zero, negative, or heavily discounted amounts.
- **Server-Side Validation Gaps:** The backend is missing fundamental validation (NaN checks, missing DB product checks, and quantity bounds), resulting in potential database corruption.
- **Redundancy Note:** Several bugs filed are manifestations of the same root causes (e.g., 015 & 018 for price tampering; 001, 016, 017 for missing category field) and can likely be grouped into singular fixes.

## Release Recommendation
☐ Go | ☒ No-Go | ☐ Conditional Go
*Rationale: The product is currently unsafe for release due to catastrophic financial vulnerability (price tampering) and a low pass rate (33.3%).*
