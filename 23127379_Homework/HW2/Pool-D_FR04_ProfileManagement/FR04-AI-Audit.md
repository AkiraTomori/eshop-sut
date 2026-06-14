## Session: 2026-06-14 16:49 — Phase 1: Requirement Analysis

- **AI Tool:** Antigravity (Claude Sonnet 4.6 Thinking via Google DeepMind IDE)
- **Bloom-AI Level:** G9.2 (Apply) — Structured extraction of variables from specification
- **Prompt:**
  > "Analyse Requirements for Pool-D_FR04_Personal Profile Management (Mobile App)"
- **AI Output Summary:** Produced a complete requirement analysis artefact for FR-04 covering:
  - 6 input variables (JWT Token, Full Name, Phone Number, Shipping Address, Email read-only, Role read-only/blocked)
  - 8 output variables (success response, updated UI state, auth error, invalid phone error, email immutability, role field absence, profile pre-load on entry, role escalation rejection)
  - 6 open ambiguities flagged for HITL resolution (name length, address max length, address mandatory status, phone non-numeric handling, name character set, phone mandatory status)
  - Self-audit checklist verified and passed
- **Human Review Notes:** Confirmed and approved the 6 input and 8 output variable architectures for the Mobile Profile module. Resolved all 6 open ambiguities systematically by inheriting the validated database baseline from Pool B (FR-08):
  1. AMBIGUITY-01 & 02 (Length Bounds): Mandate a strict 255-character baseline limit for Full Name and Shipping Address fields on the UI layout. Design stress testing with 1000+ characters via Postman to verify SQLite co-expansion.
  2. AMBIGUITY-03 & 06 (Form Modality): Full Name is mandatory (account identity contract). Shipping Address and Phone Number remain optional during update transitions to support partial profile setups.
  3. AMBIGUITY-04 (Phone Validation): Non-numeric string inputs (spaces, dashes) must be strictly rejected at both frontend and backend layers to preserve the 10-11 digit numeric format contract.
  4. AMBIGUITY-05 (Character Set): Full Name must support full Unicode character block strings to guarantee correct presentation of Vietnamese diacritical marks per FR-21.
- **Verdict:** Accepted

---
## Session: 2026-06-14 21:57 — Phase 2: Domain Analysis (Equivalence Partitioning)

- **AI Tool:** Antigravity (Claude Sonnet 4.6 Thinking via Google DeepMind IDE)
- **Bloom-AI Level:** G9.3 (Analyse) — Applied 4 EP guidelines systematically to all input/output variables
- **Prompt:**
  > "I have reviewed Phase 1 for FR04. Proceed to phase 2 (Domain Analysis) for Pool-D_FR04_ProfileManagement."
- **AI Output Summary:** Produced a complete Equivalence Class table containing 32 ECs across all 6 input variables and 8 output variables from Phase 1. Key decisions:
  - Applied G4 split to JWT Token: expired token (EC-FR04-004) separated from malformed token (EC-FR04-003) due to likely different error behaviours
  - Applied BP-07 (systematic string field decomposition) to Phone Number: 4 separate partition axes (optional/provided, prefix, length, char type) producing 7 phone-related ECs
  - Retained two valid phone-length classes (EC-FR04-012: 10 digits, EC-FR04-013: 11 digits) as distinct BVA targets
  - Flagged 4 open issues for HITL: DB max-length confirmation, optional field assumption, dual phone-length valid classes, email immutability enforcement level
- **Human Review Notes:** Reviewed and approved the comprehensive 32 equivalence classes for the Mobile Profile Management suite. Resolved all 4 open domain issues to lock down the test design boundaries:
  1. Max Length Boundaries (EC-007 / EC-020): Confirmed that SQLite lacks strict string truncation boundaries; we will formally inherit the 255-character layout baseline from FR-08 to test for text-overflow UI breaking points, with 1000+ characters isolated for database backend stress verification.
  2. Optional Field Modality (EC-009 / EC-018): Validated that Phone Number and Shipping Address remain strictly OPTIONAL on account profile states. Empty string submissions must be treated as valid transitions, preventing data setup deadlocks.
  3. Dual Phone Valid Lengths (EC-012 vs EC-013): Approved the split. Both exactly 10 digits and exactly 11 digits will be treated as distinct standalone valid classes, forcing individual 1-switch boundary validation sweeps during Phase 3.
  4. Email Immutability (EC-022): Confirmed a dual-layer enforcement expectation. The UI must render the email input node as strictly disabled/read-only, and the backend API must silently ignore any 'email' keys injected inside the PUT request payload, ensuring zero system state changes.
- **Verdict:** Accepted

---
## Session: 2026-06-14 22:08 — Phase 3: Boundary Value Analysis (BVA)

- **AI Tool:** Antigravity (Claude Sonnet 4.6 Thinking via Google DeepMind IDE)
- **Bloom-AI Level:** G9.3 (Analyse) — Systematic BVA depth selection and boundary point derivation across all eligible EC classes
- **Prompt:**
  > "I have reviewed Phase 2 for FR04. Proceed to phase 3 (Boundary Analysis) for Pool-D_FR04_ProfileManagement."
- **AI Output Summary:** Screened all 32 ECs for BVA eligibility; identified 3 ordered/numeric fields requiring BVA (Full Name length, Phone length, Shipping Address length). Assigned Medium risk and 4-point BVA depth to all three. Key decisions:
  - Full Name length: 4-point BVA on [1, 255] — LB=1, LB+1=2, UB-1=254, UB=255; LB-1=0 (empty, INVALID), UB+1=256 (INVALID)
  - Phone length: Narrow-range [10, 11] — only 2 valid spec values; LB+1 collapses to UB; effective 4 points are LB-1=9 (INVALID), LB=10 (VALID), UB=11 (VALID), UB+1=12 (INVALID); documented collapse explicitly
  - Shipping Address length: Optional field; LB-1=0 (empty = VALID for optional field); LB=1, UB-1=254, UB=255; UB+1=256 (INVALID)
  - All 3 boundary types (Spec, UI/System, DB) documented per field
  - 4 potential boundary mismatch risks flagged: missing spec max for name/address, UI keyboard not enforcing phone length, phone narrow-range dual-valid endpoints
- **Human Review Notes:** Verified boundary point values against SRS and resolved all 4 boundary mismatch risks to lock down test coverage:
  1. Name/Address Max-Length: The 255-character layout boundary is confirmed as the test target. Any longer input (1000+ chars) is confirmed as a Backend/DB stress-test case only.
  2. Phone Keyboard: Verified the Android numeric keyboard allows entry of 10-11 digit strings, so no client-side keyboard-based blocking is implemented or expected.
  3. Phone Dual-Valid Endpoints: Explicit confirmation that both EC-012 (10 digits) and EC-013 (11 digits) must be treated as distinct, individually testable equivalence classes during BVA execution.
  4. Phone Numeric-Only Validation: Backend validation confirmed (via database schema and API behaviour) to strictly enforce numeric-only content, with no allowance for spaces, dashes, or other whitespace.
- **Verdict:** Accepted

---

## Session: 2026-06-14 22:15 — Phase 4: Test Case Design

- **AI Tool:** Antigravity (Claude Sonnet 4.6 Thinking via Google DeepMind IDE)
- **Bloom-AI Level:** G9.3 (Analyse) — Systematic derivation of EP, NEG, and BVA test cases from approved EC and BVA tables
- **Prompt:**
  > "I have reviewed Phase 3 for FR04. Proceed to phase 4 (Write test case) for Pool-D_FR04_ProfileManagement."
- **AI Output Summary:** Produced 31 test cases across three types: 4 EP (valid), 13 NEG (one per invalid EC), and 14 BV (boundary). Key design decisions:
  - EP-001: Primary valid path combining 10 valid ECs (JWT, name, 10-digit phone with `0` prefix, numeric-only, address, email/role absent) — maximum valid class combination
  - EP-002: Dedicated valid case for 11-digit phone (EC-FR04-013) — separate from EP-001 as HITL mandated both length classes as distinct test targets
  - EP-003: Optional-field scenario — phone and address both empty, only name provided (EC-009, EC-018)
  - EP-004: Profile screen load / UI structural constraints (read-only email, no role field, GET pre-population) — covers EC-029, 030, 031
  - NEG-001 to NEG-013: One isolated test per invalid EC (13 TCs); critical security tests NEG-012 (email change attempt) and NEG-013 (role escalation) include verification GET step to confirm database state unchanged
  - BV TCs: Full Name 5 BV points (BV-001 to BV-005); Phone 4 BV points (BV-006 to BV-009); Shipping Address 5 BV points (BV-010 to BV-014); total 14 BV TCs
  - Coverage matrix confirms all 32 ECs covered; all BVA boundary points covered; all FR-04 and SEC-06 references present
- **Human Review Notes:** Reviewed all 31 test cases for title quality, expected result precision, EC coverage completeness, and self-standing clarity.
- **Verdict:** Accepted
