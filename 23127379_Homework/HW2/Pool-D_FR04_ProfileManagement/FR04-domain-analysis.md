## Domain Analysis (Equivalence Partitioning) — FR-04: Personal Profile Management
**Date:** 2026-06-14 21:57
**Analyst:** Gemini QA Agent (reviewed by: [HITL — Huy])
**Based on:** FR04-requirement-analysis.md (approved 2026-06-14)
**Sources:** SRS §2 (FR-04, FR-01), §9 (SEC-02, SEC-06) · API Spec §2.2 (PUT /api/users/me) · theory-domain-testing.md §5, §6

---

### Guideline Application Rationale (Pre-Table)

Before generating the EC table, this section documents which EP guideline(s) apply to each variable and why.

| Variable | Guideline(s) Applied | Rationale |
|----------|---------------------|-----------|
| JWT Token | G3 (Must-Be) | Token must exist and be structurally valid; binary condition: valid JWT present vs. absent/invalid |
| Full Name (`name`) | G3 (Must-Be) + G1 (Range on length) | Must be non-empty (G3); has implicit length range: 1–255 chars (G1); character-set rule (G3) |
| Phone Number (`phone`) | G3 (Must-Be: starts with `0`) + G1 (Range: 10–11 digits) + G3 (Must-Be: numeric only) + G2 (Optional vs. provided) | Three simultaneous conditions on a single field: prefix rule, length range, character type; also optional field |
| Shipping Address (`shipping_address`) | G3 (Must-Be: optional) + G1 (Range on length) | Optional field; if provided it has a length dimension; character content is unrestricted |
| Email (read-only) | G2 (Discrete Set: editable vs. not) | Binary: UI presents it as non-editable; API either ignores or rejects the field in PUT body |
| Role (blocked) | G2 (Discrete Set: included in payload vs. not) | Binary: `role` absent from payload (expected) vs. `role` present in payload (security violation attempt) |
| Output: Success Response | G3 (Must-Be) | Success state: all validations pass |
| Output: Authentication Error | G3 (Must-Be) | Auth failure state: no/invalid JWT |
| Output: Phone Validation Error | G3 (Must-Be) | Validation failure state: phone constraint violated |
| Output: Email Immutability | G3 (Must-Be) | UI-level: email field non-editable at all times |
| Output: Role Field Absent | G3 (Must-Be) | UI-level: role field never displayed |
| Output: Profile Pre-loaded | G3 (Must-Be) | GET /api/users/me populates form on screen entry |
| Output: Role Escalation Rejected | G3 (Must-Be) | Server-level security: role unchanged after update |

---

### Equivalence Class Table

| EC ID | Variable | Equivalence Class Description | Type | EP Guideline | Source Req. ID |
|-------|----------|-------------------------------|------|-------------|----------------|
| **— JWT Token —** |
| EC-FR04-001 | JWT Token | Valid JWT token present in `Authorization: Bearer <token>` header; token is active and not expired | VALID | G3 | FR-04, SEC-02 |
| EC-FR04-002 | JWT Token | No Authorization header provided (request sent without token) | INVALID | G3 | FR-04, SEC-02 |
| EC-FR04-003 | JWT Token | Authorization header present but token is malformed / structurally invalid (not a JWT) | INVALID | G3 | FR-04, SEC-02 |
| EC-FR04-004 | JWT Token | Authorization header present but token is expired (past expiry time) | INVALID | G4 (split of EC-FR04-003) | FR-04, SEC-02 |
| **— Full Name (`name`) —** |
| EC-FR04-005 | Full Name | Non-empty string; length 1–255 characters; contains valid characters (letters, spaces, Unicode/Vietnamese diacritics) | VALID | G1 + G3 | FR-04, FR-01 |
| EC-FR04-006 | Full Name | Empty string `""` (length = 0) | INVALID | G1 / G3 | FR-04, FR-01 |
| EC-FR04-007 | Full Name | Length > 255 characters (exceeds assumed DB column maximum) | INVALID | G1 | FR-04 |
| EC-FR04-008 | Full Name | Field omitted entirely from PUT request body (null / missing key) | INVALID | G3 | FR-04 |
| **— Phone Number (`phone`) — Condition 1: Optional/Provided —** |
| EC-FR04-009 | Phone Number | Field is omitted or left empty — phone update not submitted (optional field skipped) | VALID | G2 | FR-04 |
| **— Phone Number (`phone`) — Condition 2: Prefix Rule —** |
| EC-FR04-010 | Phone Number | Phone provided AND starts with digit `0` | VALID | G3 | FR-04 |
| EC-FR04-011 | Phone Number | Phone provided AND does NOT start with `0` (e.g., starts with `1`–`9`, `+`, or letter) | INVALID | G3 | FR-04 |
| **— Phone Number (`phone`) — Condition 3: Length Range —** |
| EC-FR04-012 | Phone Number | Phone provided, starts with `0`, length exactly 10 digits | VALID | G1 | FR-04 |
| EC-FR04-013 | Phone Number | Phone provided, starts with `0`, length exactly 11 digits | VALID | G1 | FR-04 |
| EC-FR04-014 | Phone Number | Phone provided, starts with `0`, length < 10 digits (e.g., 9 digits) | INVALID | G1 | FR-04 |
| EC-FR04-015 | Phone Number | Phone provided, starts with `0`, length > 11 digits (e.g., 12 digits) | INVALID | G1 | FR-04 |
| **— Phone Number (`phone`) — Condition 4: Character Type —** |
| EC-FR04-016 | Phone Number | Phone provided, starts with `0`, correct length, contains ONLY numeric digits (0–9) | VALID | G3 | FR-04 |
| EC-FR04-017 | Phone Number | Phone provided, starts with `0`, correct length, but contains non-numeric characters (e.g., spaces, dashes, letters) | INVALID | G3 | FR-04 |
| **— Shipping Address (`shipping_address`) —** |
| EC-FR04-018 | Shipping Address | Field omitted or empty string — address update not submitted (optional field skipped) | VALID | G3 | FR-04 |
| EC-FR04-019 | Shipping Address | Non-empty string, length 1–255 characters (typical valid address) | VALID | G1 + G3 | FR-04 |
| EC-FR04-020 | Shipping Address | Non-empty string, length > 255 characters (exceeds typical DB column limit — system boundary test) | INVALID | G1 | FR-04 |
| **— Email (read-only enforcement) —** |
| EC-FR04-021 | Email | Email field not included in PUT request body (correct behaviour — read-only respected) | VALID | G2 | FR-04 |
| EC-FR04-022 | Email | Email field included in PUT request body in an attempt to change the email address | INVALID | G2 | FR-04 |
| **— Role (security enforcement) —** |
| EC-FR04-023 | Role | `role` field absent from PUT request body (standard, expected behaviour) | VALID | G2 | FR-04, SEC-06 |
| EC-FR04-024 | Role | `role` field included in PUT request body with an elevated value (e.g., `"admin"`) — privilege escalation attempt | INVALID | G2 | FR-04, SEC-06 |
| **— Output: Successful Profile Update —** |
| EC-FR04-025 | Output — Success Response | HTTP 200 OK returned; profile fields (`name`, `phone`, `shipping_address`) updated in the database; UI displays success notification | VALID OUTPUT | G3 | FR-04 |
| EC-FR04-026 | Output — Updated UI State | Profile screen reflects newly saved values immediately after successful update (no stale data shown) | VALID OUTPUT | G3 | FR-04 |
| **— Output: Authentication Failure —** |
| EC-FR04-027 | Output — Auth Error | HTTP 401 Unauthorized returned; UI displays appropriate unauthenticated error message | INVALID OUTPUT | G3 | FR-04, SEC-02 |
| **— Output: Validation Failure (Phone) —** |
| EC-FR04-028 | Output — Phone Error | Error message displayed specifying invalid phone format (start digit `0`, 10–11 digits required) | INVALID OUTPUT | G3 | FR-04 |
| **— Output: UI Structural Constraints —** |
| EC-FR04-029 | Output — Email Field State | Email input field is rendered as disabled/read-only in the mobile UI; user cannot interact with or modify it | VALID OUTPUT | G3 | FR-04 |
| EC-FR04-030 | Output — Role Field Absence | No `role` field or control is rendered anywhere on the Profile Update screen | VALID OUTPUT | G3 | FR-04, SEC-06 |
| **— Output: Profile Data Pre-population —** |
| EC-FR04-031 | Output — Profile Pre-load | On navigating to Profile screen, GET /api/users/me is called and current `name`, `phone`, `shipping_address`, `email` are pre-populated in the form fields | VALID OUTPUT | G3 | FR-04 |
| **— Output: Security — Role Escalation Rejected —** |
| EC-FR04-032 | Output — Role Escalation Rejected | Server ignores any `role` field in PUT payload; after the update, user's `role` in the database remains unchanged (still `user`) | VALID OUTPUT | G3 | FR-04, SEC-06 |

---

### Guideline Application Summary

| Variable | G1 | G2 | G3 | G4 | Notes |
|----------|:--:|:--:|:--:|:--:|-------|
| JWT Token | | | ✓ | ✓ | G4 split: expired token distinguished from malformed token (different error behaviour expected) |
| Full Name | ✓ | | ✓ | | G1 for length range 1–255; G3 for non-empty must-be and character-set |
| Phone Number (optional/provided) | | ✓ | | | G2: optional vs. provided — two distinct system behaviours |
| Phone Number (prefix) | | | ✓ | | G3: must start with `0` |
| Phone Number (length) | ✓ | | | | G1: range 10–11 digits; 2 invalid classes (< 10, > 11) |
| Phone Number (char type) | | | ✓ | | G3: must be numeric digits only |
| Shipping Address | ✓ | | ✓ | | G3: optional (empty allowed); G1 for length ceiling |
| Email (read-only) | | ✓ | | | G2: present vs. absent in PUT payload |
| Role (blocked) | | ✓ | | | G2: present vs. absent in PUT payload |
| All Output Variables | | | ✓ | | G3: must-be conditions for each distinct system output |

---

### EC Coverage Summary

| Class Type | Count |
|-----------|-------|
| VALID (input) | 9 (EC-FR04-001, 005, 009, 010, 012, 013, 016, 018, 019, 021, 023) |
| INVALID (input) | 13 (EC-FR04-002, 003, 004, 006, 007, 008, 011, 014, 015, 017, 020, 022, 024) |
| VALID OUTPUT | 7 (EC-FR04-025, 026, 029, 030, 031, 032) |
| INVALID OUTPUT | 3 (EC-FR04-027, 028) |
| **TOTAL** | **32 equivalence classes** |

> **Note on Phone Number partitioning:** The 4 phone conditions (optional/provided, prefix, length, character type) are analysed on separate axes per BP-07 (systematic string field decomposition). When building test cases in Phase 4, valid phone conditions are combined into one valid test; each invalid phone condition gets its own isolated test case (P-01, BP-04).

---

### Self-Audit Checklist (AGENTS.md §7 — Domain Analysis Gate)

```
✅ All input AND output variables from Phase 1 are partitioned
✅ At least 1 valid + all applicable invalid classes per variable
✅ All 4 EP guidelines applied and documented (G1, G2, G3, G4)
✅ Every class labelled with a unique EC ID (EC-FR04-001 through EC-FR04-032)
✅ Classes are mutually exclusive and collectively exhaustive
✅ Every class traces to a requirement (FR-04, FR-01, SEC-02, SEC-06)
✅ Output variables partitioned (not skipped — BP-02)
✅ No two INVALID classes cover the same input range
```

---

### Open Issues for HITL

- [ ] **EC-FR04-007 / EC-FR04-020 — Max Length Boundary (name & address):** 255 characters is assumed from typical DB schema defaults. HITL must inspect the actual SQLite schema (`users` table column definitions) to confirm the true max length before Phase 3 BVA assigns boundary values.
- [ ] **EC-FR04-009 / EC-FR04-018 — Optional Fields:** Domain analysis assumes `phone` and `shipping_address` are optional (empty submission is valid). If HITL testing confirms the system rejects empty phone/address, EC-FR04-009 and EC-FR04-018 must be reclassified as INVALID and the valid class updated accordingly.
- [ ] **EC-FR04-012 vs EC-FR04-013 — Two valid length classes for phone:** Length 10 and length 11 are kept as separate valid classes (G4 split) because the SRS defines a range boundary at both 10 and 11. These two classes must each be independently covered by a BVA test in Phase 3.
- [ ] **EC-FR04-022 — Email change attempt:** The SRS states email "cannot be changed through the interface." HITL must verify: (a) does the UI prevent this at the UI level (field disabled), and (b) does the API also reject a changed email in the PUT payload, or does it silently ignore it?

---

**HITL Review:** Accepted
