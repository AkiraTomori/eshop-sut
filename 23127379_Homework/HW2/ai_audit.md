# EShop Project — Consolidated AI Audit Log (ai_audit.md)
**Author/HITL:** Thái Minh Huy (23127379)
**Test Cycle:** HW02 Domain & Boundary Testing
**Environment Baseline:** macOS Tahoe 26.1 / Edge Browser & Postman Layer

---

## POOL A — FR-06: Product Detail View (Web Frontend)

### Session: 2026-06-13 07:56 — Phase 1: Requirement Analysis
- **AI Tool:** Gemini QA Agent (Claude Opus 4.6 Thinking)
- **Bloom-AI Level:** G9.2 (Apply)
- **Prompt:** `Analyse Requirements for Pool-A_FR06_ProductDetailView`
- **AI Output Summary:** Produced a complete requirement analysis artefact (`FR06-requirement-analysis.md`) containing:
  - Feature scope identification (Web Frontend, URL, API endpoints)
  - 7 input variables extracted (URL product ID, quantity UI field, POST /api/cart body fields, auth state)
  - 18 output variables extracted (product display fields, UI feedback, navigation elements, error states)
  - All variables traced to source requirements (FR-06, FR-07, FR-21–FR-24, SEC-02, SEC-04)
  - 5 open ambiguities flagged for HITL resolution (quantity max, product ID format, unauthenticated add-to-cart behaviour, input mechanism type, decimal price display)
- **Human Review Notes:** Reviewed and resolved 5 open ambiguities with the following engineering decisions:
  1. No spec-defined upper bound about quantity max attributes, test system/UI boundaries separately per BP-06.
  2. id (Format & Range): Test with valid existing ID, valid non-existent ID, `id=0`, negative ID, non-numeric ID, and extremely large ID.
  3. Unauthenticated Add-to-Cart: System behavior should block the action on UI and redirect to `/login` or show an error toast.
  4. Quantity Input Mechanism: UI numeric field improperly allows typing non-numeric characters, leading to NaN values being pushed to backend via POST /api/cart due to zero input validation.
  5. Decimal price display: DB stores price as integer, UI displays it as integer.
- **Verdict:** Accepted

### Session: 2026-06-13 10:04 — Phase 2: Domain Analysis (Equivalence Partitioning)
- **AI Tool:** Gemini QA Agent (Claude Opus 4.6 Thinking)
- **Bloom-AI Level:** G9.3 (Analyse)
- **Prompt:** `Proceed to phase 2: Domain Analysis for Pool-A_FR06_ProductDetailView`
- **AI Output Summary:** Produced `FR06-domain-analysis.md` containing 33 equivalence classes total (15 VALID, 18 INVALID) across 7 variable groups (`id` URL, `quantity` UI, Auth State, Cart API body, Product Display output, Add to Cart output, GUI/Navigation output). Flagged 3 open issues for HITL.
- **Human Review Notes:** Approved all 33 equivalence classes. Resolved open issues:
  1. EC-FR06-013: Retain as INVALID for system boundary testing since the SUT doesn't restrict large numbers at the UI level.
  2. EC-FR06-025: Approved G4 split for quantity increment behavior as it exercises different application paths.
  3. EC-FR06-019: Retain tampered price class; code-level analysis confirms backend blindly trusts client data, making this a critical security test target.
- **Verdict:** Accepted

### Session: 2026-06-13 10:34 — Phase 3: Boundary Value Analysis (BVA)
- **AI Tool:** Gemini QA Agent (Claude Opus 4.6 Thinking)
- **Bloom-AI Level:** G9.3 (Analyse)
- **Prompt:** `Proceed to phase 3: Boundary Analysis for Pool-A_FR06_ProductDetailView`
- **AI Output Summary:** Produced `FR06-boundary-analysis.md` deriving 35 boundary test points across 4 eligible variables (`id`, `quantity`, cart body `price`, cart body `quantity`). Medium risk (4-point BVA) and High risk (6-point BVA) applied separately. Flagged 3 critical high-value findings (HVF).
- **Human Review Notes:** Approved risk-based BVA. Resolved open issues:
  1. quantity UB: Treat lack of UB as a specification flaw. Set 999 as a system UI baseline test.
  2. Tampered Price: Mandate API-level execution (Postman) for price manipulation cases since UI masks this backend vulnerability.
  3. DB Max ($2^{63}-1$): Classified as an API negative stress test to monitor overflow exceptions.
- **Verdict:** Accepted

### Session: 2026-06-13 10:57 — Phase 4: Test Case Design
- **AI Tool:** Gemini QA Agent (Claude Opus 4.6 Thinking)
- **Bloom-AI Level:** G9.2 (Apply)
- **AI Output Summary:** Produced `FR06-test-cases.md` containing **30 test cases total** (4 EP valid, 18 NEG invalid, and 8 BV boundary test cases) mapping all 33 ECs to clear measurable outcomes.
- **Human Review Notes:** Approved.
- **Verdict:** Accepted

### Session: 2026-06-13 20:34 & 20:44 — Phase 5: Reporting (Bug Reports)
- **AI Tool:** Gemini QA Agent (Claude Sonnet 4.6 Thinking)
- **Bloom-AI Level:** G9.3 (Analyse)
- **AI Output Summary:** Produced **20 individual bug reports** (BUG-FR06-001 to BUG-FR06-020). Key findings include:
  - BUG-FR06-001/016/017: Missing category name, breadcrumbs, and green button mismatch.
  - BUG-FR06-003/004/006/007/013/014: Missing UI/API validations for quantity (accepts 0, negative, empty, NaN, and string).
  - BUG-FR06-011/012/015/018: **Critical price tampering vulnerabilities** (API accepts price=0, negative prices, and client-controlled price overrides).
- **Human Review Notes:** Reviewed severities, confirmed duplicates, filed GitHub Issues, and approved.
- **Verdict:** Accepted

### Session: 2026-06-13 23:46 — Phase 5: Test Summary Report
- **AI Tool:** Gemini QA Agent (Gemini 3.1 Pro)
- **AI Output Summary:** Generated `FR06-test-summary.md` showing a 33.3% overall pass rate (20/30 TCs failed). Issued an explicit **No-Go** release recommendation due to multiple Fatal price tampering flaws.
- **Verdict:** Accepted

---

## POOL B — FR-08: Checkout (Web Frontend)

### Session: 2026-06-14 00:04 — Phase 1: Requirement Analysis
- **AI Tool:** Antigravity (Claude Sonnet 4.6 Thinking) via IDE
- **Bloom-AI Level:** G9.2 (Apply)
- **AI Output Summary:** Extracted 10 input variables and 16 output variables across FR-08 and FR-09 scopes. Flagged 5 open ambiguities.
- **Human Review Notes:** Resolved all 5 open structural ambiguities: shipping_address max safe layout is 255 chars (1000+ for DB stress); Empty cart blocked via UI; Expiry bounds exact date-only (midnight `<`); `total_amount` omission mandated as server-side verification test; Currency rounding standard integer enforced.
- **Verdict:** Accepted

### Session: 2026-06-14 08:08 — Phase 2: Domain Analysis (Equivalence Partitioning)
- **AI Tool:** Antigravity (Claude Sonnet 4.6 Thinking) via IDE
- **Bloom-AI Level:** G9.3 (Analyse)
- **AI Output Summary:** Produced an initial Equivalence Class table with **41 ECs** incorporating all ambiguity resolutions.
- **Human Review Notes:** Verified partitioning logic. Confirmed that price tampering will be isolated via direct Postman network payloads to assert backend independent recalculation filters.
- **Verdict:** Accepted

### Session: 2026-06-14 09:36 — Phase 3: Boundary Value Analysis
- **AI Tool:** Antigravity (Claude Sonnet 4.6 Thinking) via IDE
- **Bloom-AI Level:** G9.3 (Analyse)
- **AI Output Summary:** Produced a BVA table with **26 boundary points** covering address length (Medium risk), coupon expiry, min-order, and max-uses (High risk).
- **Human Review Notes:** Verified boundary values (LB=1, UB=255 for address).
- **Verdict:** Accepted

### Session: 2026-06-14 10:01 — Phase 4: Test Case Design
- **AI Tool:** Antigravity (Claude Sonnet 4.6 Thinking) via IDE
- **AI Output Summary:** Scripted a complete suite of **41 test cases** (5 EP valid, 14 NEG invalid, 22 BV boundary) with full traceability.
- **Human Review Notes:** Confirmed that valid classes are combined efficiently while invalid threat vectors remain strictly isolated.
- **Verdict:** Accepted

### Session: 2026-06-14 12:11 & 18:03 — Phase 5: Reporting (Bug Reports)
- **AI Tool:** Antigravity (Claude Sonnet 4.6 Thinking) via IDE
- **AI Output Summary:** Logged **11 initial bug reports** (BUG-FR08-001 to BUG-FR08-011). Key failures included BUG-FR08-003 (cart not cleared), BUG-FR08-007 (backend accepts empty/whitespace address), BUG-FR08-008 (**Fatal Price Tampering** via network bypass), and BUG-FR08-011 (Fatal calculation formula multiplication without division).
- **Verdict:** Accepted

### Session: 2026-06-15 15:48 — Artefact Cleanup: Remove FR-09 Content from Pool B
- **AI Tool:** Antigravity (Claude Sonnet 4.6 Thinking) via IDE
- **Bloom-AI Level:** G9.2 (Apply)
- **Prompt:** `Please remove anything not relevant in FR08.` (Remove FR-09 Coupon scope)
- **AI Output Summary:** Cleansed and re-scoped all 6 artifact files to clear FR-09 out:
  - `FR08-requirement-analysis.md`: Retained 4 inputs + 10 outputs.
  - `FR08-domain-analysis.md`: Stripped Groups 5–9. **EC count reduced from 41 to 20**.
  - `FR08-boundary-analysis.md`: Retained Section A only. **BV count reduced from 26 to 8**.
  - `FR08-test-cases.md`: Removed coupon workflows. **TC count reduced from 41 to 17**.
  - `FR08-bug-report.md`: Removed BUG-FR08-004, 010, 011. **Bug count settled at 8**.
  - `FR08-test-summary.md`: Updated counts: 17 TCs, 9 Pass / 8 Fail (**52.9% pass rate**), 8 bugs (1 Fatal, 3 Serious, 3 Medium, 1 Cosmetic). Release recommendation remains **No-Go** due to open BUG-FR08-008.
- **Human Review Notes:** Verified revised files, confirmed zero coupon leftovers, signed off.
- **Verdict:** Accepted

---

## POOL C — FR-15: Product Management (Product CRUD Web Admin)

### Session: 2026-06-15 17:30 — Phase 1: Requirement Analysis
- **AI Tool:** Antigravity (Claude Sonnet 4.6 Thinking)
- **Bloom-AI Level:** G9.2 (Apply)
- **AI Output Summary:** Extracted **21 input variables** and **16 output variables** mapped across Web Admin parameters (`/api/products` and `/api/categories`). Identified 7 open ambiguities.
- **Human Review Notes:** Resolved all 7 structural ambiguities: Description uses SQLite TEXT with a 1000-char UI safety limit; Image URL must use secure `https://` regex; Price operates exclusively on integer currency transformations (VND ₫); Non-integer category IDs must return HTTP 400; HTTP CRUD codes locked (Create=201, Update/Delete=200, Validation=400, Not Found=404); Delete confirmation dialog is mandatory; Price=0 and Price<0 are split into two distinct classes.
- **Verdict:** [X] Accepted

### Session: 2026-06-15 18:04 — Phase 2: Domain Analysis (Equivalence Partitioning)
- **AI Tool:** Antigravity (Claude Sonnet 4.6 Thinking)
- **Bloom-AI Level:** G9.3 (Analyse)
- **AI Output Summary:** Generated **67 Equivalence Classes** (EC-FR15-001 to 067) split into 11 distinct groups.
- **Human Review Notes:** Closed all 4 open domain issues: Enforced G4 split for Name XSS; Refused price float coercion parameters (e.g., `100.0` is invalid); Blocked unencrypted `http://` prefixes; Clamped descriptions at 1000 characters to protect web grid rendering.
- **Verdict:** [X] Accepted

### Session: 2026-06-15 19:19 — Phase 3: Boundary Value Analysis (BVA)
- **AI Tool:** Antigravity (Claude Sonnet 4.6 Thinking)
- **Bloom-AI Level:** G9.3 (Analyse)
- **AI Output Summary:** Produced a comprehensive matrix covering **28 boundary points** across 4 qualifying variables (Name, Price, Description, Product ID) across Spec, UI/System, and DB layers. Flagged 4 High-Value Findings (HVF-01 to HVF-04).
- **Human Review Notes:** Confirmed the mathematical soundness of the 6-point pricing lower bound (including float probes at 0.5 and 1.0). Approved exploitation vectors for HVF-01 through HVF-04 to capture application-layer length and type validation failures.
- **Verdict:** [X] Accepted

### Session: 2026-06-15 19:56 & 2026-06-16 08:07 — Phase 4: Test Case Design (EP + BVA Consolidated)
- **AI Tool:** Antigravity (Claude Sonnet 4.6 Thinking)
- **AI Output Summary:** Scripted a highly comprehensive test suite. Initially drafted 60 test cases, which were refactored and streamlined into **54 pure test cases** (10 EP valid, 29 NEG invalid, 15 BV boundary) after removing environmental redundancies and applying strict P-01 atomic constraints.
- **Human Review Notes:** Approved the optimized 54-case structure to ensure rigorous multi-endpoint validation coverage.
- **Verdict:** [X] Accepted

### Session: 2026-06-16 20:11 — Phase 5: Bug Report
- **AI Tool:** Antigravity (Claude Sonnet 4.6 Thinking)
- **Bloom-AI Level:** G9.3 (Analyse)
- **AI Output Summary:** Logged **17 individual bug reports** (`BUG-FR15-001` to `BUG-FR15-017`) directly derived from failed test case nodes. Defects include 5 price validation gaps (accepting price=0, negatives, and float types via API), description limit leaks (accepting 1001 characters), category data integrity leaks, and 5 separate GUI compliance defects (missing mandatory asterisks, incorrect error message alignment, green button color mismatch, missing `<h1>` element, and missing delete confirmation prompts).
- **Human Review Notes:** Verified all 17 Bug IDs, cross-referenced traceability links, and approved.
- **Verdict:** [X] Accepted

---

## POOL D — FR-04: Personal Profile Management (Mobile App)

### Session: 2026-06-14 16:49 — Phase 1: Requirement Analysis
- **AI Tool:** Antigravity (Claude Sonnet 4.6 Thinking via Google DeepMind IDE)
- **Bloom-AI Level:** G9.2 (Apply)
- **AI Output Summary:** Extracted 6 input variables and 8 output variables from the mobile profile specification. Flagged 6 open ambiguities.
- **Human Review Notes:** Approved variable matrices and resolved all 6 ambiguities by inheriting the database baseline established in FR-08: Full Name and Shipping Address use a strict 255-char UI layout safety baseline (1000+ for DB stress); Phone number and address remain optional on updates; Non-numeric phone inputs are strictly blocked; Full Name must support full Unicode character blocks for Vietnamese diacritics.
- **Verdict:** Accepted

### Session: 2026-06-14 21:57 — Phase 2: Domain Analysis (Equivalence Partitioning)
- **AI Tool:** Antigravity (Claude Sonnet 4.6 Thinking via Google DeepMind IDE)
- **Bloom-AI Level:** G9.3 (Analyse)
- **AI Output Summary:** Generated **32 Equivalence Classes** across all profile parameters. Applied G4 split to separate expired vs. malformed tokens. Applied string decomposition to phone parameters yielding 7 phone-related ECs.
- **Human Review Notes:** Closed all 4 open issues: Inherited 255-char layout baseline; Treated phone and address as strictly optional to prevent data deadlocks; Approved the dual valid phone length split (10 and 11 digits) forcing individual boundary sweeps; Mandated email immutability checks on both UI and backend.
- **Verdict:** Accepted

### Session: 2026-06-14 22:08 — Phase 3: Boundary Value Analysis (BVA)
- **AI Tool:** Antigravity (Claude Sonnet 4.6 Thinking via Google DeepMind IDE)
- **Bloom-AI Level:** G9.3 (Analyse)
- **AI Output Summary:** Identified 3 ordered variables requiring BVA (Name length, Phone length, Address length). Applied a 4-point depth at Medium risk. Documented the phone narrow-range collapse explicitly. Flagged 4 boundary mismatch risks.
- **Human Review Notes:** Locked down test boundaries: 255-character layout target vs. 1000+ backend stress target; Android numeric keyboard lacks native length restrictions; Re-verified dual valid phone length endpoints and strict numeric-only backend constraints.
- **Verdict:** Accepted

### Session: 2026-06-14 22:15 — Phase 4: Test Case Design
- **AI Tool:** Antigravity (Claude Sonnet 4.6 Thinking via Google DeepMind IDE)
- **AI Output Summary:** Produced **31 test cases total** (4 EP valid, 13 NEG invalid, and 14 BV boundary test cases). EP-001 combined 10 valid ECs simultaneously. Critical security tests (email immutability, role escalation) incorporated verification GET steps to validate database state invariance.
- **Human Review Notes:** Reviewed titles, expected results, and completed coverage matrix maps.
- **Verdict:** Accepted

### Session: 2026-06-15 11:10 — Phase 5: Reporting (Bug Reports)
- **AI Tool:** Antigravity (Claude Sonnet 4.6 Thinking via Google DeepMind IDE)
- **Bloom-AI Level:** G9.3 (Analyse)
- **AI Output Summary:** Scanned 31 test results; mapped 17 failures to **10 individual bug reports** (`BUG-FR04-001` to `BUG-FR04-010`). Core vulnerabilities discovered:
  - BUG-FR04-001 (Serious): Broken phone validation regex in UI restricts valid 11-digit entries.
  - BUG-FR04-003 (Fatal): Expired JWT tokens accepted by backend without session validation.
  - BUG-FR04-004/005/006/008/010: Missing server-side length constraints and format filters for names, addresses, and phone numbers.
  - BUG-FR04-009 (**Fatal Privilege Escalation**): Server blindly writes `role = "admin"` to the database when injected inside a regular profile PUT payload body, violating SEC-06.
- **Human Review Notes:** Verified severities, filed 10 GitHub Issues, and recorded issue URLs.
- **Verdict:** Accepted

### Session: 2026-06-15 12:51 — Phase 5: Test Summary Report
- **AI Tool:** Antigravity (Claude Sonnet 4.6 Thinking via Google DeepMind IDE)
- **AI Output Summary:** Produced `FR04-test-summary.md` calculating a 41.9% overall pass rate (13 Passed / 18 Failed). Issued an absolute **No-Go** release recommendation due to 2 active Fatal security flaws (Role Escalation and Expired JWT bypass) blocking compliance.
- **Verdict:** Accepted