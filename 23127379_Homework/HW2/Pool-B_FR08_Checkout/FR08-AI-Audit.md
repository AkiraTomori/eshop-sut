# AI Audit Log — FR-08: Checkout (Pool B)

---
## Session: 2026-06-14 00:04 — Phase 1: Requirement Analysis

- **AI Tool:** Antigravity (Claude Sonnet 4.6 Thinking) via IDE
- **Bloom-AI Level:** G9.2 (Apply) — Extracting and applying SRS/API spec to produce structured variable tables
- **Prompt:**
  > Analyse Requirements for Pool-B_FR08_Checkout (Web Frontend)
- **AI Output Summary:** Produced a full requirement analysis for FR-08 (Checkout) and FR-09 (Coupon Code) covering 10 input variables and 16 output variables. Flagged 5 open ambiguities for HITL resolution.
- **Human Review Notes:** Reviewed and approved the complete variable architecture for Pool B. Resolved all 5 open structural ambiguities:
  1. shipping_address: Treat 255 chars as UI layout safety baseline; design stress boundary cases with 1000+ characters to check for container breaking.
  2. Empty Cart Checkout: Confirmed UI must enforce blocking directly on empty cart states via FR-07/FR-08 interactions, preventing empty cart routing persistence.
  3. Expiry Bound Precision: Grounded as Date-only string checks (YYYY-MM-DD); expiration takes effect strictly at midnight matching the '<' predicate.
  4. total_amount Payload Omission: Confirmed as a mandatory security test case target to verify backend independent math calculation blocks.
  5. Currency Rounding: Mandated strict standard integer mathematical rounding (Math.round) to eliminate decimals, protecting FR-21 currency presentation contracts.
- **Verdict:** Accepted

---
## Session: 2026-06-14 08:08 — Phase 2: Domain Analysis (Equivalence Partitioning)

- **AI Tool:** Antigravity (Claude Sonnet 4.6 Thinking) via IDE
- **Bloom-AI Level:** G9.3 (Analyse) — Applying all 4 EP Guidelines to produce a labelled, mutually-exclusive, collectively-exhaustive EC table
- **Prompt:**
  > I have reviewed phase 1 for FR08_checkout. Proceed to phase 2 (domain analysis) for Pool_B-FR08-Checkout
- **AI Output Summary:** Produced a complete Equivalence Class table with **41 ECs** (EC-FR08-001 to EC-FR08-041) across 10 groups: Authentication/JWT (G3+G4, 3 ECs), Cart state (G3, 2 ECs), Shipping address (G1, 3 ECs), `total_amount` security (G3, 2 ECs), Coupon existence/C1 (G3+G4, 4 ECs), Coupon expiry/C2 (G1, 3 ECs), Coupon min-order/C3 (G1, 2 ECs), Coupon usage/C5 (G1, 3 ECs), Coupon type/G2 (3 ECs), and Output variables (G3+G2, 16 ECs). Incorporated all 5 HITL-resolved ambiguities from Phase 1. Flagged 3 open issues for Phase 3 review.
- **Human Review Notes:** Verified the completeness and partitioning logic of all 41 equivalence classes. Approved the boundary interpretations for coupon expiration (strict equality meaning expired) and shipping_address (255-character baseline limit). Confirmed the security testing approach for EC-FR08-010; price tampering checks will be isolated as network-layer integration tests executed via Postman to assert that the backend recalculates the financial totals independently regardless of client-supplied payloads.
- **Verdict:** Accepted

---
## Session: 2026-06-14 09:36 — Phase 3: Boundary Value Analysis

- **AI Tool:** Antigravity (Claude Sonnet 4.6 Thinking) via IDE
- **Bloom-AI Level:** G9.3 (Analyse) — Applying BVA risk-level classification and deriving boundary points for all ordered/numeric EC classes
- **Prompt:**
  > I have reviewed phase 2 for FR08_checkout. Proceed to phase 3 (boundary analysis) for Pool_B-FR08-Checkout
- **AI Output Summary:** Produced a complete BVA table with **26 boundary points** (BV-FR08-001 to BV-FR08-026) across 4 variables. Risk levels: `shipping_address` (Medium, 4-point, 8 BV points including UI/system and DB boundary rows), coupon `expired_at` (High, 6-point, 6 BV points), order total vs. `min_order_amount` (High, 6-point, 6 BV points with dual-coupon cross-testing for SAVE10 and BIGBUY), usage count vs. `max_uses_per_user` (High, 6-point, 6 BV points with dual-coupon cross-testing for SAVE10 and VIP100). Identified 4 potential high-value findings: shipping_address layer-enforcement mismatch, `>=` vs `>` operator ambiguity for C3, `<` vs `<=` operator ambiguity for C5, and expiry date exact-equality boundary. All three boundary types (Specification, UI/System, DB) documented in coverage summary.
- **Human Review Notes:** Verified boundary point values (LB=1, UB=255 for address; exact dates for expiry/limits). Risk-level assignments align with HITL assessment (High for financial/expiry, Medium for structural/UI). Confirmed all 3 boundary types (Specification, UI/System, DB) are correctly documented for comprehensive coverage.
- **Verdict:** Accepted

---
## Session: 2026-06-14 10:01 — Phase 4: Test Case Design

- **AI Tool:** Antigravity (Claude Sonnet 4.6 Thinking) via IDE
- **Bloom-AI Level:** G9.3 (Analyse) + G9.2 (Apply) — Designing EP, NEG, and BV test cases from approved EC and BVA tables following the standard template
- **Prompt:**
  > I have reviewed phase 3 for FR08_checkout. Proceed to phase 4 (write test case) for Pool_B-FR08-Checkout
- **AI Output Summary:** Produced a complete test case suite of **41 test cases** total: 5 EP (valid), 14 NEG (invalid — one per invalid EC), and 22 BV (boundary) test cases. EP TCs efficiently combine valid ECs (TC-FR08-EP-001 covers 11 valid ECs simultaneously). Each of the 14 invalid ECs has its own isolated NEG TC. BV TCs cover all 26 BVA boundary points from Phase 3 across 4 variables (shipping_address length, coupon expiry, min_order_amount, usage_count). All titles follow Action+Function+Condition pattern. All expected results are precise and pre-defined. Full coverage matrix included linking all 41 ECs and 26 BV points to specific test cases.
- **Human Review Notes:** Reviewed and approved the test case suite in its entirety:
  - **EP Test Cases:** All 5 EP tests are well-designed and cover valid scenarios. TC-FR08-EP-001 is particularly efficient by combining 11 valid ECs into a single test.
  - **Negative Test Cases:** Each of the 14 invalid ECs has a corresponding negative test case. The expected results are precise and clearly articulated.
  - **Boundary Test Cases:** All 26 BVA boundary points are covered across the 4 specified variables. The boundary point values (LB/UB) and risk levels are correctly assigned as per the BVA table.
  - **Coverage:** The coverage matrix accurately links all 41 ECs and 26 BV points to the test cases. All test case titles follow the specified format.
  - **Precision:** Expected results are specific and pre-defined, allowing for objective pass/fail determination.
- **Verdict:** Accepted

---
## Session: 2026-06-14 12:11 — Phase 5: Bug Report (EP + NEG + BV Section A)

- **AI Tool:** Antigravity (Claude Sonnet 4.6 Thinking) via IDE
- **Bloom-AI Level:** G9.3 (Analyse) — Analysing HITL-recorded execution results to produce structured, actionable bug reports per theory-test-report.md standards
- **Prompt:**
  > Write Bug Report from beginning to Section BV-A for FR08
- **AI Output Summary:** Produced **9 bug reports** (BUG-FR08-001 to BUG-FR08-009) covering all failed test cases from TC-FR08-EP-001 to TC-FR08-BV-007. Identified and de-duplicated bugs: BUG-FR08-001 (missing `<h1>` — Medium), BUG-FR08-002 (green button — Cosmetic), BUG-FR08-003 (cart not cleared — Serious), BUG-FR08-004 (percent discount not in total — Serious), BUG-FR08-005 (breadcrumb missing — Medium), BUG-FR08-006 (no UI error for empty address — Serious), BUG-FR08-007 (backend accepts empty/whitespace address — Serious), BUG-FR08-008 (price tampering — **Fatal**), BUG-FR08-009 (no length enforcement — Medium). TR-BP-09 security escalation flag applied to BUG-FR08-008.
- **Human Review Notes:** Reviewed each bug's severity, attached screenshots, filed GitHub Issues, then approved.
- **Verdict:** Accepted

---
## Session: 2026-06-14 18:03 — Phase 5: Bug Report (BV-B + BV-C + BV-D)

- **AI Tool:** Antigravity (Claude Sonnet 4.6 Thinking) via IDE
- **Bloom-AI Level:** G9.3 (Analyse) — Analysing HITL-recorded boundary test execution results to produce structured, actionable bug reports for Section BV-B (Expiry), BV-C (min_order_amount), and BV-D (usage_count)
- **Prompt:**
  > Write Bug Report from Section BV-B to Section BV-D for FR08
- **AI Output Summary:** Scanned all 15 test cases in BV-B, BV-C, BV-D. Found **zero failures in BV-B (5 Passed)** and **zero failures in BV-D (5 Passed)**. Found **2 failures in BV-C**: (1) TC-FR08-BV-014 — coupon rejected at exact min_order_amount boundary → BUG-FR08-010 (Serious: strict `>` operator used instead of `>=`); (2) TC-FR08-BV-015 — discount_amount = −2,700,009 and final_amount = 3,000,010 for 300,001 ₫ input → BUG-FR08-011 (Fatal: formula computes `total × rate` instead of `total × rate / 100`). Root cause analysis for BUG-FR08-011 derived from observed values: final_amount = total × 10 = 3,000,010 confirms multiplication without division. Both bugs cross-referenced against BUG-FR08-004. Updated bug summary table to 11 total bugs (2 Fatal, 5 Serious, 3 Medium, 1 Cosmetic).
- **Human Review Notes:** Reviewed each bug's severity, attached screenshots, filed GitHub Issues, then approved.
- **Verdict:** Accepted
