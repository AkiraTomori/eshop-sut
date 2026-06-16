# FR15 — AI Audit Log
**Feature:** FR-15 Product Management (Product CRUD)
**Pool:** C — `23127379_Homework/HW2/Pool-C_FR15_ProductManagement/`

---
## Session: 2026-06-15 17:30 — Phase 1: Requirement Analysis

- **AI Tool:** Antigravity (Claude Sonnet 4.6 Thinking)
- **Bloom-AI Level:** G9.2 (Apply) — Applying Phase 1 skill to extract variables from SRS and API spec
- **Prompt:**
  > Analyse Requirements for Pool-C_FR15_Product Management (CRUD) Web Admin.
- **AI Output Summary:**
  The AI produced a complete Phase 1 Requirement Analysis artefact for FR-15 covering:
  - Feature scope: Web Admin at `http://localhost:5174`, API endpoints for CRUD on `/api/products` and `/api/categories`
  - **21 Input Variables** across 6 categories: Authentication/access control (JWT, role), Create form inputs (name, price, description, imageUrl, category_id), Edit form inputs (product :id path param + same form fields), Delete path input (product :id), View/list query input (search keyword), GUI/form-level inputs (required indicators, error position, language, button colour, tab order, h1 tag)
  - **16 Output Variables** across 2 categories: Successful operation outputs (product created, updated, deleted, list displayed, detail displayed) and validation/error outputs (name empty, name too long, price invalid, price non-numeric, category not selected, category non-existent, product ID not found, access denied no token, access denied non-admin, isolation guarantee, XSS prevention)
  - **7 Open Ambiguities** flagged for HITL resolution: description max length, imageUrl format validation, price integer vs float, category_id non-integer API behaviour, HTTP response codes, delete confirmation dialog, price=0 vs price<0 error differentiation
- **Human Review Notes:** Reviewed and approved the full 21-input and 16-output variable matrices for the FR-15 Product CRUD module. Resolved all 7 open ambiguities by aligning constraints with the verified SQLite database engine behaviors and system architecture conventions:
  1. AMBIGUITY-01 (Description Length): Confirmed that the `description` column uses the native SQLite `TEXT` data type, which is dynamically allocated and virtually unbounded. For UI and form constraint validation, we will enforce a maximum safety boundary of 1000 characters to prevent DOM layout distortion.
  2. AMBIGUITY-02 (Image URL Format): Image URL is strictly optional. However, if populated, the system must validate the input against a strict standard URL regex prefix schema (e.g., must start with `https://`). Empty strings will be processed as valid null mutations.
  3. AMBIGUITY-03 (Price Data Type): Confirmed that although the SQLite schema defines price numerically, the Vietnamese currency (₫) operates exclusively on integer transformations. Floating-point inputs (e.g., 99.5 ₫) are declared invalid and must be rejected at the API layer.
  4. AMBIGUITY-04 (Category ID Types): Non-integer alphanumeric inputs passed to the `category_id` key (e.g., via direct Postman payload injection) must be rigorously intercepted and rejected with an HTTP 400 Bad Request by the backend validation schema layer.
  5. AMBIGUITY-05 (HTTP Status Codes): Locked in the exact SUT endpoint expectations: Successful Create returns HTTP 201 Created; Successful Update/Delete returns HTTP 200 OK; Input validation faults return HTTP 400 Bad Request; Non-existent resources trigger HTTP 404 Not Found.
  6. AMBIGUITY-06 (Delete Dialog): Confirmed that a browser-native or component-level UI Delete Confirmation Dialog is mandatory per FR-21 design criteria. A cancellation choice on the dialog must gracefully abort the transaction, preserving database isolation.
  7. AMBIGUITY-07 (Price Zero vs Negative): Approved the partition bifurcation. Price = 0 (violates positive constraint) and Price < 0 (extreme negative injection) must be modeled as two distinct invalid equivalence classes to force independent BVA sweeps.
- **Verdict:** [X] Accepted / [ ] Partially Accepted / [ ] Rejected

---
## Session: 2026-06-15 18:04 — Phase 2: Domain Analysis (Equivalence Partitioning)

- **AI Tool:** Antigravity (Claude Sonnet 4.6 Thinking)
- **Bloom-AI Level:** G9.3 (Analyse) — Applying all 4 EP Guidelines to produce a complete, labelled Equivalence Class table
- **Prompt:**
  > I have reviewed Phase 1 (Analyse Requirements) for Pool-C_FR15_ProductManagement (Approved). Proceed to phase 2 (Domain Analysis) for Pool-C_FR15_ProductManagement.
- **AI Output Summary:**
  The AI produced a complete Phase 2 Domain Analysis artefact for FR-15 covering 67 Equivalence Classes (EC-FR15-001 through EC-FR15-067) organised into 11 groups. Applied G1, G2, G3, and G4 split protocols. Flagged 4 open issues for human review alignment.
- **Human Review Notes:** Formally reviewed and closed all 4 open domain issues under strict integration test guidelines:
  1. Enforced standard G4 safety split for Name XSS blocks due to unique HTML-escaping output criteria.
  2. Declared decimal prices (e.g., `100.0`) as strictly invalid to safeguard integer ₫ processing.
  3. Locked down `http://` as an explicit validation failure to mandate secure `https://` endpoints.
  4. Confirmed the application layer must clamp descriptions at 1000 characters to block layout corruption.
- **Verdict:** [X] Accepted / [ ] Parially Accepted / [ ] Rejected

---
## Session: 2026-06-15 19:19 — Phase 3: Boundary Value Analysis (BVA)

- **AI Tool:** Antigravity (Claude Sonnet 4.6 Thinking)
- **Bloom-AI Level:** G9.3 (Analyse) — Selecting BVA depth per risk level and deriving boundary points for all qualifying EC classes
- **Prompt:**
  > I have reviewed Phase 2 (Domain Analysis) for Pool-C_FR15_ProductManagement (Approved). Proceed to phase 3 (Boundary Analysis) for Pool-C_FR15_ProductManagement.
- **AI Output Summary:**
  The AI produced a complete Phase 3 BVA artefact for FR-15 covering **28 boundary test points** across 4 qualifying variables:
  - **Product Name (Medium risk, 4-point + UI/DB probes):** BV-01 to BV-09 — LB-1 (0 chars=empty), LB (1 char), LB+1 (2 chars), UB-1 (254 chars), UB (255 chars), UB+1 (256 chars), plus UI maxlength bypass and DB column boundary probes.
  - **Price (High risk, 6-point full BVA):** BV-10 to BV-18 — LB-1 (price=-1), forbidden boundary (price=0, its own INVALID EC per AMB-07), LB (price=1), LB+1 (price=2), practical UB-1/UB/UB+1 at 10-digit threshold, plus float-at-boundary probes (0.5 and 1.0 as INVALID per AMB-03/RESOLVED-02).
  - **Description (Medium risk, 4-point + DB bypass probe):** BV-19 to BV-24 — LB (0 chars=empty), LB+1 (1 char), UB-1 (999 chars), UB (1000 chars), UB+1 (1001 chars=INVALID per RESOLVED-04), plus direct API bypass probe for backend enforcement verification.
  - **Product ID path param (Medium risk, representative):** BV-25 to BV-28 — existing valid ID, non-existent ID (max+1), non-integer path, ID=0 (below auto-increment floor).
  - **3 boundary boundary types documented:** Specification, UI/System, and Database for all qualifying variables.
  - **4 High-Value Findings (HVF)** flagged: name 256-char API bypass (HVF-01), price=0 API bypass (HVF-02), description 1001-char DB bypass (HVF-03), whitespace-only name (HVF-04).
  - **Boundary Type Coverage Summary** produced with mismatch analysis for all 4 variables.
- **Human Review Notes:** Formally reviewed and signed off on the 28 boundary point matrices for Phase 3. Confirmed that the financial risk depth for the `price` lower boundary (6-point arrangement including float probes at 0.5 and 1.0) is mathematically sound. Approved the exploitation vectors for HVF-01 through HVF-04 to catch application-layer length and type validation mismatches during the upcoming test case execution phase.
- **Verdict:** [X] Accepted / [ ] Partially Accepted / [ ] Rejected

---
## Session: 2026-06-15 19:56 — Phase 4: Test Case Design (EP + NEG)

- **AI Tool:** Antigravity (Claude Sonnet 4.6 Thinking)
- **Bloom-AI Level:** G9.2 (Apply) + G9.3 (Analyse) — Applying TC design rules to produce precise, traceable test cases from the approved EC table
- **Prompt:**
  > I have reviewed Phase 3 (Boundary Analysis) for Pool-C_FR15_ProductManagement (Approved). Proceed to phase 4 (Write Test Case) for Pool-C_FR15_ProductManagement. Because this feature may have a lot of testcase, so you generate testcase for EP first.
- **AI Output Summary:**
  The AI produced **39 EP-phase test cases** for FR-15 in `FR15-test-cases.md`, covering all 67 ECs from the approved domain analysis:
  - **10 EP (valid) test cases** (TC-FR15-EP-001 to TC-FR15-EP-010): Happy path for Create (all fields, minimal fields), Edit with isolation guarantee, Delete with confirm, Delete with cancel, View product list (no search, match, no-match), View product detail, and GUI compliance check (*, button colours, error position, tab order, h1 count).
  - **29 NEG (invalid) test cases** (TC-FR15-NEG-001 to TC-FR15-NEG-029): One isolated TC per invalid EC — 4 auth/access TCs (no token, malformed, expired, non-admin), 5 name validation TCs (empty, 256-char, 500-char, XSS), 5 price validation TCs (zero, negative, float, non-numeric, missing), 2 description TCs (>1000 chars, XSS), 2 imageUrl TCs (http://, malformed), 3 category TCs (missing, non-existent, non-integer), 2 product ID TCs (non-existent, non-integer), 1 search XSS TC, and 6 GUI compliance TCs (*, error position, button colours, h1, tab order, delete dialog).
  - **Full Coverage Matrix** produced mapping all 67 ECs to their covering TC IDs.
  - **P-01 compliance confirmed:** No two invalid conditions are combined in any single TC.
  - **BVA test cases (TC-FR15-BV-###)** deferred to next session per HITL instruction.
- **Human Review Notes:** [To be filled by HITL — review all 39 TC titles for Action+Function+Condition pattern; verify all expected results are precise and measurable; confirm coverage matrix is complete before approving]
- **Verdict:** [X] Accepted / [ ] Partially Accepted / [ ] Rejected

---
## Session: 2026-06-16 08:07 — Phase 4: Test Case Design (BVA)

- **AI Tool:** Antigravity (Claude Sonnet 4.6 Thinking)
- **Bloom-AI Level:** G9.2 (Apply) + G9.3 (Analyse) — Translating all 28 BVA boundary points into test cases using Phase 4 skill and TC-BP rules
- **Prompt:**
  > I have done all 39 Testcase for FR15, generate BVA Testcase for FR15.
- **AI Output Summary:**
  The AI produced **21 BVA test cases** (TC-FR15-BV-001 to TC-FR15-BV-021) covering all 28 boundary points from `FR15-boundary-analysis.md`:
  - **Product Name (9 BVA points → 7 TCs):** BV-001 (empty=LB-1, INVALID), BV-002 (LB=1 + LB+1=2, VALID paired), BV-003 (UB-1=254 + UB=255, VALID paired), BV-004 (UB+1=256 Spec, INVALID), BV-005 (UI min probe, VALID), BV-006 (UI/System bypass=API direct 256-char, INVALID — HVF-01), BV-007 (DB boundary=API 256-char DB inspection, INVALID — HVF-01b).
  - **Price (9 BVA points → 8 TCs):** BV-008 (price=-1, LB-1, INVALID), BV-009 (price=0, forbidden boundary, INVALID), BV-010 (price=1+2, LB+LB+1, VALID paired), BV-011 (price=999,999,998+999,999,999, UI UB-1+UB, VALID paired), BV-012 (price=1,000,000,000, 10-digit probe, VALID), BV-013 (price=0.5, float below LB, INVALID), BV-014 (price=1.0, float at LB, INVALID), BV-015 (price=0 UI vs API mismatch, HVF-02 probe, INVALID).
  - **Description (6 BVA points → 4 TCs):** BV-016 (LB=0 + LB+1=1, VALID paired), BV-017 (UB-1=999 + UB=1000, VALID paired), BV-018 (UB+1=1001 UI, INVALID), BV-019 (1001-char API direct bypass, DB probe, INVALID — HVF-03).
  - **Product ID (4 representative points → 2 TCs):** BV-020 (valid ID + max+1=404), BV-021 (non-integer path=400 + ID=0=404).
  - **Full BVA coverage matrix** appended showing all 28 BVA points mapped to their TC IDs.
  - **Final total:** 10 EP + 29 NEG + 15 BV = **54 test cases** for FR-15.
  - **Self-audit checklist** completed: all three boundary types (Spec, UI/System, DB) covered; all INVALID points isolated; HVF-01/02/03 all explicitly probed.
- **Human Review Notes:** Reviewed all 21 BVA TCs — expected results match approved boundary points; HVF probes are executable in Postman + DB inspection; approved for bug reporting phase
- **Verdict:** [] Accepted / [X] Partially Accepted / [ ] Rejected (Some testcase should be merged and HITL have merged it in the next step)

---
## Session: 2026-06-16 20:11 — Phase 5: Bug Report

- **AI Tool:** Antigravity (Claude Sonnet 4.6 Thinking)
- **Bloom-AI Level:** G9.3 (Analyse) — Analysing HITL-executed test results to produce formal, traceable bug reports per theory-test-report.md
- **Prompt:**
  > Write bug report for FR15. I have reviewed and accepted.
- **AI Output Summary:**
  The AI scanned all `Status: Fail` entries from the HITL-executed `FR15-test-cases.md` and produced **17 individual bug reports** in `FR15-bug-report.md`:
  - **5 Price Validation bugs (BUG-FR15-001 to 005):** API accepts price=0, price=-1, float price, non-numeric price, and missing price without validation — all Serious severity. Root cause: missing server-side price type and range validation.
  - **1 Description bug (BUG-FR15-006):** API accepts 1001-char description — HVF-03 confirmed. Serious severity.
  - **2 Image URL bugs (BUG-FR15-007, 008):** API accepts `http://` and malformed URL values. Medium severity.
  - **2 Category bugs (BUG-FR15-009, 010):** API accepts non-existent category_id (data integrity) and non-integer category_id type. Serious severity.
  - **2 Product ID API bugs (BUG-FR15-011, 012):** Edit returns HTTP 200 for non-existent ID (should be 404); Delete returns HTTP 200 for non-integer path (should be 400). Serious and Medium respectively.
  - **5 GUI Compliance bugs (BUG-FR15-013 to 017):** Missing * indicators (FR-22), wrong error position (FR-22), Submit button green not blue (FR-21), zero h1 tags (FR-21), no delete confirmation dialog (FR-21/AMB-06). Medium/Serious.
  - **Bug summary table** produced with all 17 BUG IDs, linked TCs, severities, and short problem summaries.
  - **Self-audit checklist** passed: one defect per report, all fields complete, GitHub Issue placeholders present (P-09), professional language, severity set by QA.
- **Human Review Notes:** [HITL must: (1) file GitHub Issues for each of the 17 bugs; (2) paste the GitHub Issue URLs into the Bug Report file; (3) attach screenshots/recordings for each bug; (4) confirm severity assignments are appropriate; (5) set Priority for each bug as PM/PO decision]
- **Verdict:** [ ] Accepted / [ ] Partially Accepted / [ ] Rejected
