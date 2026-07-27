# HW04 Main Report — Automation Testing
## Student: 23127379 | Thái Minh Huy
## Course: Software Testing | Assignment: HW04-AI

---

## 1. General Information

| Field | Value |
|-------|-------|
| **Student ID** | 23127379 |
| **Student Name** | Thái Minh Huy |
| **Assignment** | HW04 — Automation Testing |
| **Features Tested** | FR-06 (Product Detail), FR-08 (Checkout), FR-15 (Product Management) |
| **Automation Framework** | Playwright |
| **Browsers** | Chromium, Firefox, WebKit |
| **Repository** | https://github.com/AkiraTomori/eshop-sut |

---

## 2. Feature Selection (from HW2)

As completed in HW2, the three web features selected for automation are:

| Pool | FR | Feature | HW2 TCs | TCs Automated |
|------|----|---------|---------|----|
| A | FR-06 | Product Detail View | 20+ | 14 |
| B | FR-08 | Checkout | 15+ | 12 |
| C | FR-15 | Product Management (CRUD) | 30+ | 12 |
| **Total** | | | | **38** |

---

## 3. Task 1 — Automation Scripts

### 3.1 AI-First Strategy Applied

For each feature, I guided the AI (Gemini) step-by-step through the automation workflow using the **AutomationScriptGen** skill rather than issuing a single generic prompt. The process was:

1. Loaded HW2 test cases and bug reports as context
2. Specified TC selection criteria (EP, NEG, BV priorities)
3. Specified data-driven requirements (external JSON file)
4. Required ≥3 assertion patterns
5. Required proper test isolation (beforeEach/afterEach)
6. Required annotation of known bugs

### 3.2 Data-Driven Implementation

Test data is stored in external JSON files, never hardcoded in spec files:

| Feature | Data File | Entries |
|---------|-----------|---------|
| FR-06 | `Pool-A_FR06/fr06-test-data.json` | 14 |
| FR-08 | `Pool-B_FR08/fr08-test-data.json` | 14 |
| FR-15 | `Pool-C_FR15/fr15-test-data.json` | 12 |

### 3.3 Assertion Patterns Used

| Pattern | Playwright API | Used In |
|---------|---------------|---------|
| A1 — URL check | `expect(page).toHaveURL(...)` | All 3 features |
| A2 — Visibility | `expect(locator).toBeVisible()` | All 3 features |
| A3 — Text content | `expect(locator).toHaveText(...)` | All 3 features |
| A4 — Field value | `expect(locator).toHaveValue(...)` | FR-06, FR-08 |
| A5 — Count | `expect(locator).toHaveCount(...)` | FR-06, FR-08 |
| A8 — Negative visibility | `expect(locator).not.toBeVisible()` | FR-08, FR-15 |
| A9 — Contains text | `expect(locator).toContainText(...)` | All 3 features |

**Total: 7 distinct assertion patterns** (satisfies ≥3 requirement)

### 3.4 Multi-Browser Execution Results

| Feature | Chromium | Firefox | WebKit |
|---------|----------|---------|--------|
| FR-06 | *(run results)* | *(run results)* | *(run results)* |
| FR-08 | *(run results)* | *(run results)* | *(run results)* |
| FR-15 | *(run results)* | *(run results)* | *(run results)* |

HTML reports: `playwright-report/` (each report shows "Run by: 23127379")

### 3.5 Human Review — AI Script Issues Found

*(Fill after running ScriptReview skill for each FR)*

**FR-06 Review Summary:**
*(see Pool-A_FR06/fr06-automation-review.md for full details)*

**FR-08 Review Summary:**
*(see Pool-B_FR08/fr08-automation-review.md for full details)*

**FR-15 Review Summary:**
*(see Pool-C_FR15/fr15-automation-review.md for full details)*

### 3.6 Test Cases That Could Not Be Automated

| TC ID | FR | Reason | Alternative Approach |
|-------|----|--------|---------------------|
| *(fill from review)* | | | |

---

## 4. Task 2 — Demo Video

**YouTube Link:** *(TBD — fill after recording)*
**Duration:** ≥ 5 minutes
**Language:** Vietnamese (narrated)
**Feature Demonstrated:** *(fill — which FR)*

**Video Contents:**
- [ ] Shows automation script running end-to-end
- [ ] Shows multi-browser execution
- [ ] Shows generated HTML report with "Run by: 23127379"
- [ ] Narrates at least one fix made to AI-generated script
- [ ] Shows either face-cam OR terminal with `whoami` + `hostname`

---

## 5. Agent Skills

**Skills Built for HW04:**

| Skill | File | Purpose |
|-------|------|---------|
| PlaywrightSetup | `.agents/skills/PlaywrightSetup/SKILL.md` | Project initialization |
| AutomationScriptGen | `.agents/skills/AutomationScriptGen/SKILL.md` | Script generation |
| ScriptReview | `.agents/skills/ScriptReview/SKILL.md` | AI review & gap analysis |
| BugReportAutomation | `.agents/skills/BugReportAutomation/SKILL.md` | Bug reporting |
| AIAuditLogger | `.agents/skills/AIAuditLogger/SKILL.md` | Audit trail |

**Skill Demo Video:** *(TBD — YouTube link showing end-to-end skill use)*

---

## 6. Bug Summary

*(See `bug_report.md` for full details)*

| Bug ID | Feature | Severity | Type |
|--------|---------|----------|------|
| BUG-FR06-001 | FR-06 | High | HW2 Confirmed |
| BUG-FR06-002 | FR-06 | High | HW2 Confirmed |
| BUG-FR06-003 | FR-06 | High | HW2 Confirmed |
| BUG-FR06-004 | FR-06 | High | HW2 Confirmed |
| BUG-FR06-006 | FR-06 | High | HW2 Confirmed |
| BUG-FR08-001 | FR-08 | Medium | HW2 Confirmed |
| BUG-FR08-006 | FR-08 | High | HW2 Confirmed |
| BUG-FR08-008 | FR-08 | **Critical** | HW2 Confirmed |
| BUG-FR15-001 | FR-15 | Medium | HW2 Confirmed |
| BUG-FR15-003 | FR-15 | Low | HW2 Confirmed |

---

## 7. Git Commit Log Summary

*(See `git-commit-log.txt` for full log)*

| Commit | Message | Date |
|--------|---------|------|
| *(fill after commits)* | | |

**Total spec-file commits:** *(fill)* / 8 minimum required
**Days spanned:** *(fill)* / 4 minimum required

---

## 8. References

- HW2 Test Cases: `../HW2/Pool-A_FR06_ProductDetailView/FR06-test-cases.md`
- HW2 Test Cases: `../HW2/Pool-B_FR08_Checkout/FR08-test-cases.md`
- HW2 Test Cases: `../HW2/Pool-C_FR15_ProductManagement/FR15-test-cases.md`
- EShop SRS: `../HW2/agents/context/eshop-srs.md`
- Playwright Documentation: https://playwright.dev
- HW04 Assignment: `/eshop-sut/2026.HW04.Automation Testing_En.md`

---

## 9. Self-Assessment

| No. | Criteria | Max | Self-Assessed |
|-----|----------|-----|---------------|
| 1 | Task 1 — Feature A (FR-06) | 25 | *(fill)* |
| 1 | Task 1 — Feature B (FR-08) | 25 | *(fill)* |
| 1 | Task 1 — Feature C (FR-15) | 25 | *(fill)* |
| 2 | Task 2 — Demo video | 15 | *(fill)* |
| 3 | Agent Skills | 10 | *(fill)* |
| | **Total** | **100** | *(fill)* |

---

## Appendix — AI Critique

*(See `ai_critique.md`)*

## Appendix — AI Audit Reports

- FR-06: `Pool-A_FR06/FR06-AI-Audit.md`
- FR-08: `Pool-B_FR08/FR08-AI-Audit.md`
- FR-15: `Pool-C_FR15/FR15-AI-Audit.md`
