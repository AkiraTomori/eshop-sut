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
