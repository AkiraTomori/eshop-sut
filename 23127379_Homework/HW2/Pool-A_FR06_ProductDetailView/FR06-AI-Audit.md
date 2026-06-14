## Session: 2026-06-13 07:56 — Phase 1: Requirement Analysis

- **AI Tool:** Gemini QA Agent (Claude Opus 4.6 Thinking)
- **Bloom-AI Level:** G9.2 (Apply) — Applied Domain Testing Step 1 methodology to extract input/output variables from the SRS
- **Prompt:**
  > Analyse Requirements for Pool-A_FR06_ProductDetailView
- **AI Output Summary:** Produced a complete requirement analysis artefact (`FR06-requirement-analysis.md`) containing:
  - Feature scope identification (Web Frontend, URL, API endpoints)
  - 7 input variables extracted (URL product ID, quantity UI field, POST /api/cart body fields, auth state)
  - 18 output variables extracted (product display fields, UI feedback, navigation elements, error states)
  - All variables traced to source requirements (FR-06, FR-07, FR-21–FR-24, SEC-02, SEC-04)
  - 5 open ambiguities flagged for HITL resolution (quantity max, product ID format, unauthenticated add-to-cart behaviour, input mechanism type, decimal price display)
  - Self-audit checklist completed
- **Human Review Notes:** Reviewed and resolved 5 open ambiguities with the following engineering decisions:
1. No spec-defined upper bound about quantiy max attributes, test system/UI boundaries (e.g., what happens at very large values like 999, 9999, or `MAX_INT`). Test both specification boundaries and system boundaries separately per BP-06.
2. id (Format & Range): Test with valid existing ID, valid non-existent ID, `id=0`, negative ID, non-numeric ID, and extremely large ID.
3. Unauthenticated Add-to-Cart: System behavior should block the action on UI and redirect the user to `/login` or show a descriptive error toast. No silent failures or UI crashes allowed.
4. Quantity Input Mechanism: Verified that the UI uses a numeric input field that improperly allows typing non-numeric characters, leading to NaN values being successfully pushed to the backend via POST /api/cart due to a complete lack of input validation.
5. Decimal price display: Database store price attributes in interger field, the UI display it interger value
- **Verdict:** Accepted

---
## Session: 2026-06-13 10:04 — Phase 2: Domain Analysis (Equivalence Partitioning)

- **AI Tool:** Gemini QA Agent (Claude Opus 4.6 Thinking)
- **Bloom-AI Level:** G9.3 (Analyse) — Analysed all input/output variables and applied the 4 EP Guidelines to produce equivalence classes
- **Prompt:**
  > I have reviewed phase 1 (Analyse Requirements) for phase 1 for Pool-A_FR06_ProductDetailView.
  > Proceed to phase 2: Domain Analysis for Pool-A_FR06_ProductDetailView
- **AI Output Summary:** Produced a complete domain analysis artefact (`FR06-domain-analysis.md`) containing:
  - 33 equivalence classes total (15 VALID, 18 INVALID) across 7 variable groups:
    - `id` (URL): 6 ECs — valid existing, non-existent, zero, negative, non-numeric, extremely large
    - `quantity` (UI): 7 ECs — valid ≥1, zero, negative, decimal, non-numeric (NaN), empty, extremely large
    - Auth State: 2 ECs — authenticated, not authenticated
    - Cart API body: 6 ECs — valid/invalid for id, price, quantity at API level
    - Product Display output: 2 ECs — valid display, not-found error
    - Add to Cart output: 4 ECs — success, increment, unauth error, invalid quantity error
    - GUI/Navigation output: 6 ECs — breadcrumbs, h1, language, button colour, tab order, image alt
  - All 4 EP guidelines applied and documented in Guideline Application Summary
  - Mutual exclusivity and exhaustiveness verified
  - 3 open issues flagged for HITL (quantity UB, cart increment split, tampered price)
  - Full self-audit checklist passed
- **Human Review Notes:** Reviewed and approved all 33 equivalence classes. Resolved open issues as follows:
  1. EC-FR06-013: Retain as INVALID for system boundary testing since the SUT doesn't restrict large numbers at the UI level.
  2. EC-FR06-025: Approved G4 split for quantity increment behavior as it exercises different application paths.
  3. EC-FR06-019: Retain tampered price class; code-level analysis confirms the backend blindly trusts client data, making this a critical security test target.
- **Verdict:** Accepted

---
## Session: 2026-06-13 10:34 — Phase 3: Boundary Value Analysis (BVA)

- **AI Tool:** Gemini QA Agent (Claude Opus 4.6 Thinking)
- **Bloom-AI Level:** G9.3 (Analyse) — Analysed all numeric/ordered ECs and applied risk-based BVA across specification, UI/system, and database boundary types
- **Prompt:**
  > I have reviewed phase 2 (Domain Analysis) for Pool-A_FR06_ProductDetailView.
  > Proceed to phase 3: Boundary Analysis for Pool-A_FR06_ProductDetailView
- **AI Output Summary:** Produced a complete boundary analysis artefact (`FR06-boundary-analysis.md`) containing:
  - 4 variables eligible for BVA: `id` (URL), `quantity` (UI), cart body `price`, cart body `quantity`
  - Risk levels assigned: Medium (id), High (quantity, price, cart quantity)
  - BVA depth: 4-point for Medium, 6-point for High
  - 35 boundary test points derived across all 4 variables
  - 3 boundary types tested separately (specification, UI/system, database) per BP-06
  - Boundary Type Coverage Summary with mismatch detection
  - 3 CRITICAL high-value findings identified:
    1. `quantity` UI→API mismatch: NaN, 0, -1 reach backend without validation
    2. Cart `price` security mismatch: backend blindly trusts client price (price tampering)
    3. No upper limit on quantity: potential integer overflow in total calculation
  - 3 open issues for HITL (quantity UB classification, price tamper test method, DB max extreme boundary)
  - Full self-audit checklist passed
- **Human Review Notes:** Approved the risk-based BVA approach. Resolved open issues as follows:
  1. quantity UB: Treat the lack of UB as a specification flaw. Set 999 as a non-functional system UI baseline test.
  2. Tampered Price: Mandate API-level execution (Postman/cURL) for price manipulation cases since UI components mask this backend vulnerability.
  3. DB Max ($2^{63}-1$): Classified as an API negative stress test to monitor overflow exceptions.
- **Verdict:** Accepted

---
## Session: 2026-06-13 10:57 — Phase 4: Test Case Design

- **AI Tool:** Gemini QA Agent (Claude Opus 4.6 Thinking)
- **Bloom-AI Level:** G9.2 (Apply) — Applied test case design template and selection strategy from theory-testcase-design.md to produce EP, NEG, and BV test cases
- **Prompt:**
  > I have reviewed phase 3 (Boundary Analysis) for Pool-A_FR06_ProductDetailView.
  > Proceed to phase 4: Test Case Design for Pool-A_FR06-ProductDetailView
- **AI Output Summary:** Produced a complete test case design artefact (`FR06-test-cases.md`) containing:
  - **30 test cases total:**
    - 4 EP test cases (valid) — efficiently combining 15 VALID ECs:
      - EP-001: Full product detail display with all GUI requirements
      - EP-002: Quantity field defaults and valid input
      - EP-003: Complete Add to Cart flow (authenticated, valid quantity, feedback)
      - EP-004: Cart quantity increment for same product (FR-07)
    - 18 NEG test cases (invalid) — one per INVALID EC, strictly isolated:
      - NEG-001 to NEG-005: Product ID invalids (non-existent, zero, negative, non-numeric, extremely large)
      - NEG-006 to NEG-011: Quantity invalids (zero, negative, decimal, NaN, empty, extremely large)
      - NEG-012: Unauthenticated Add to Cart
      - NEG-013: Non-existent cart product ID (API)
      - NEG-014 to NEG-015: Zero and negative price (API — Postman/cURL)
      - NEG-016 to NEG-017: Zero and NaN quantity (API)
      - NEG-018: Price tampering attack (API — critical security)
    - 8 BV test cases (boundary) — covering all BVA points:
      - BV-001 to BV-002: Product ID LB and LB+1
      - BV-003 to BV-005: Quantity LB, LB+1, and system UB (999)
      - BV-006: Price LB = 1 (API)
      - BV-007: Cart quantity LB-1 = -1 (API)
      - BV-008: Cart quantity DB stress test (999999999)
  - Complete coverage matrix mapping all 33 ECs to test cases
  - All titles follow Action + Function + Condition pattern
  - All expected results are precise and measurable
  - Self-audit checklist passed (all 7 items)
- **Human Review Notes:** Approved
- **Verdict:** Accepted

---
## Session: 2026-06-13 20:34 — Phase 5: Reporting (Bug Report)

- **AI Tool:** Gemini QA Agent (Claude Sonnet 4.6 Thinking)
- **Bloom-AI Level:** G9.3 (Analyse) — Analysed executed test case results and produced one bug report per failed test case following theory-test-report.md §4 bug report format
- **Prompt:**
  > I have reviewed and approved Phase 1, Phase 2, Phase 3 and Phase 4 for FR06.
  > Bug Report for 10 testcases
  > I used: Macos (Tahoe 26.1) and Edge Browser
- **AI Output Summary:** Produced `FR06-bug-report.md` containing **10 individual bug reports** (BUG-FR06-001 to BUG-FR06-010) corresponding to the first 10 failed test cases identified from the executed `FR06-test-cases.md`:
  - **BUG-FR06-001** (Serious): Missing category name, missing breadcrumbs, green Add to Cart button → TC-FR06-EP-001
  - **BUG-FR06-002** (Serious): Add to Cart creates duplicate cart rows instead of incrementing quantity → TC-FR06-EP-004
  - **BUG-FR06-003** (Serious): Quantity=0 not rejected by UI — product added to cart with zero quantity → TC-FR06-NEG-006
  - **BUG-FR06-004** (Serious): Negative quantity not rejected by UI — product added to cart with quantity=-1 → TC-FR06-NEG-007
  - **BUG-FR06-005** (Medium): Decimal quantity (1.5) silently truncated to 1 without user notification → TC-FR06-NEG-008
  - **BUG-FR06-006** (Serious): Non-numeric quantity (NaN) not rejected — NaN reaches backend via input type="number" → TC-FR06-NEG-009
  - **BUG-FR06-007** (Serious): Empty quantity field not rejected — product added to cart with NaN quantity → TC-FR06-NEG-010
  - **BUG-FR06-008** (Medium): Extremely large quantity (999999999) accepted without upper-limit enforcement → TC-FR06-NEG-011
  - **BUG-FR06-009** (Serious): Unauthenticated user can add to cart — no login redirect or error shown → TC-FR06-NEG-012
  - **BUG-FR06-010** (Serious): API accepts non-existent product ID in cart request — no product existence validation → TC-FR06-NEG-013
  - Each report includes: Bug ID, Date, Problem Summary, Severity, Steps to Reproduce, Expected vs Actual Result, Environment (macOS Tahoe 26.1 / Edge), GitHub Issue placeholder, and Linked Test Case
  - Severity assigned per theory-test-report.md §5 (Fatal/Serious/Medium/Cosmetic)
  - Priority left blank for HITL/PM assignment per TR-BP-06
- **Human Review Notes:** Approved
- **Verdict:** Accepted

---
## Session: 2026-06-13 20:44 — Phase 5: Reporting (Bug Report — Remaining Test Cases)

- **AI Tool:** Gemini QA Agent (Claude Sonnet 4.6 Thinking)
- **Bloom-AI Level:** G9.3 (Analyse) — Analysed remaining 10 failed test cases and produced dedicated bug reports for each
- **Prompt:**
  > Write bug report for remaining testcases.
- **AI Output Summary:** Appended **10 additional bug reports** (BUG-FR06-011 to BUG-FR06-020) to `FR06-bug-report.md`, covering all remaining failed test cases not addressed in the previous session:
  - **BUG-FR06-011** (Fatal): API accepts price=0 — product purchasable at zero cost → TC-FR06-NEG-014
  - **BUG-FR06-012** (Fatal): API accepts price=-1,000,000 — negative cart total possible → TC-FR06-NEG-015
  - **BUG-FR06-013** (Serious): API accepts quantity=0 at server level — no server-side minimum quantity guard → TC-FR06-NEG-016
  - **BUG-FR06-014** (Serious): API accepts quantity="abc" (NaN string) — NaN stored in DB corrupting cart → TC-FR06-NEG-017
  - **BUG-FR06-015** (Fatal): Price tampering attack — API blindly trusts client price=1 for a ₫30M product → TC-FR06-NEG-018
  - **BUG-FR06-016** (Serious): Category name missing at BVA LB (id=1) — duplicate manifestation of BUG-FR06-001 → TC-FR06-BV-001
  - **BUG-FR06-017** (Serious): Category name missing at BVA LB+1 (id=2) — confirms systematic defect → TC-FR06-BV-002
  - **BUG-FR06-018** (Fatal): Price boundary LB=1 accepted via API — price tampering confirmed at all price values → TC-FR06-BV-006
  - **BUG-FR06-019** (Serious): API accepts quantity=-1 (BVA LB-1) — no server-side lower-boundary enforcement → TC-FR06-BV-007
  - **BUG-FR06-020** (Medium): API accepts quantity=999999999 (DB stress) — no upper-bound enforcement; GET /api/cart lacks total field for verification → TC-FR06-BV-008
  - Severity breakdown for all 20 bugs: 4 × Fatal, 12 × Serious, 3 × Medium, 0 × Cosmetic
  - BUG-FR06-016 and BUG-FR06-017 are noted as duplicate manifestations of BUG-FR06-001 (same root cause — category field not rendered)
  - BUG-FR06-018 is noted as a BVA-level confirmation of the price tampering vulnerability already identified in BUG-FR06-015
- **Human Review Notes:** Approved
- **Verdict:** Accepted

---
## Session: 2026-06-13 23:46 — Phase 5: Reporting (Test Summary Report)

- **AI Tool:** Gemini QA Agent (Gemini 3.1 Pro)
- **Bloom-AI Level:** G9.3 (Analyse) — Evaluated execution status across all 30 test cases to compile summary metrics
- **Prompt:**
  > Write test report for testcase FR06.
- **AI Output Summary:** Generated `FR06-test-summary.md` containing execution metrics (33.3% pass rate), a breakdown of 20 defects (4 Fatal, 13 Serious, 3 Medium), and a 'No-Go' release recommendation due to critical price tampering vulnerabilities and poor validation.
- **Human Review Notes:** Approved
- **Verdict:** Accepted
