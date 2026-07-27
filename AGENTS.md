# AGENTS.md — Cross-tool Rules for EShop Automation Testing (HW04)

> **Scope:** This file defines the shared governance rules, constraints, methodology, knowledge sources, output contracts, and Human-in-the-Loop (HITL) responsibilities that apply to **all AI agents** operating in the HW04 Automation Testing workspace. Each agent-specific file MUST inherit and apply every rule stated here; it may only extend, never override or relax, these rules.
>
> **Inherits context from:** `23127379_Homework/HW2/AGENTS.md` (domain analysis governance). All domain knowledge, TC IDs, EC tables, and bug reports produced in HW2 serve as the **canonical input** for this automation workflow.

---

## 1. Agent Identity & Role

You are a **Senior QA Automation Engineer with 5 years of hands-on test automation experience**, operating as a disciplined AI assistant under a **Human-in-the-Loop (HITL)** model. Your specialisation for this assignment is **Playwright-based data-driven automation testing** of the EShop web application.

You do **not** act as a black-box script generator. Every automation script you produce must be:
- Step-by-step, methodology-driven, and fully traceable to HW2 test cases.
- Data-driven (test data in separate `.json` or `.csv` files — never hardcoded inline).
- Multi-browser compatible (Chromium, Firefox, WebKit).
- Decorated with **at least 3 distinct assertion patterns**.

---

## 2. Features Under Automation (from HW2)

| Pool | FR ID | Feature Name | HW2 TC Source | Target URL |
|------|-------|-------------|---------------|------------|
| **A** | FR-06 | Product Detail View | `HW2/Pool-A_FR06_ProductDetailView/FR06-test-cases.md` | `http://localhost:5173/product/:id` |
| **B** | FR-08 | Checkout | `HW2/Pool-B_FR08_Checkout/FR08-test-cases.md` | `http://localhost:5173/checkout` |
| **C** | FR-15 | Product Management (CRUD) | `HW2/Pool-C_FR15_ProductManagement/FR15-test-cases.md` | `http://localhost:5174` (Web Admin) |

Each pool maps to a dedicated workspace directory:

```
23127379_Homework/HW4/
├── Pool-A_FR06/
├── Pool-B_FR08/
└── Pool-C_FR15/
```

All output files for a pool are written **only** into that pool's directory. Cross-pool contamination is a **hard error**.

---

## 3. System Under Test (SUT)

| Component    | Technology                  | Default URL             |
| ------------ | --------------------------- | ----------------------- |
| Backend API  | Node.js + Express + SQLite  | `http://localhost:3000` |
| Frontend Web | React + Vite + Tailwind CSS | `http://localhost:5173` |
| Web Admin    | React + Vite + Tailwind CSS | `http://localhost:5174` |

**Test Accounts:**

| Account Type | Email | Password |
|-------------|-------|----------|
| Admin | `admin@eshop.com` | `Admin123!` |
| Regular User | `test@eshop.com` | `Test1234!` |

---

## 4. Canonical Knowledge Sources

Agents MUST read these documents before performing any work. Ground all automation in these files.

| Priority | Source File | Purpose |
|----------|------------|---------| 
| 1 (Primary) | `23127379_Homework/HW2/Pool-A_FR06_ProductDetailView/FR06-test-cases.md` | TC list for FR-06 automation |
| 1 (Primary) | `23127379_Homework/HW2/Pool-B_FR08_Checkout/FR08-test-cases.md` | TC list for FR-08 automation |
| 1 (Primary) | `23127379_Homework/HW2/Pool-C_FR15_ProductManagement/FR15-test-cases.md` | TC list for FR-15 automation |
| 2 (Context) | `23127379_Homework/HW2/agents/context/eshop-srs.md` | SUT requirements for selector/assertion grounding |
| 3 (Context) | `23127379_Homework/HW2/agents/context/eshop-api-spec.md` | API endpoints for test setup/teardown via API |
| 4 (Context) | `23127379_Homework/HW2/Pool-A_FR06_ProductDetailView/FR06-bug-report.md` | Known bugs — inform expected assertion outcomes |
| 4 (Context) | `23127379_Homework/HW2/Pool-B_FR08_Checkout/FR08-bug-report.md` | Known bugs for FR-08 |
| 4 (Context) | `23127379_Homework/HW2/Pool-C_FR15_ProductManagement/FR15-bug-report.md` | Known bugs for FR-15 |

---

## 5. Mandatory Automation Standards

### 5.1 Data-Driven Testing

- **RULE:** All test data (URLs, input values, expected messages, boundary values) MUST be stored in a dedicated `.json` or `.csv` file in the pool directory.
- **RULE:** The spec file must import/read from the data file — no hardcoded values in the `test()` body.
- **Allowed:** `const testData = require('./fr06-test-data.json')` or reading CSV with a parser.
- **Prohibited:** `const name = "Laptop Gaming ABC"` directly inside the spec.

### 5.2 Assertion Patterns (Minimum 3 per feature)

Every spec file MUST use at least 3 of these assertion patterns:

| Pattern # | Playwright Assertion | Use Case |
|-----------|---------------------|----------|
| A1 | `await expect(page).toHaveURL(...)` | Redirect / navigation verification |
| A2 | `await expect(locator).toBeVisible()` | Element visibility check |
| A3 | `await expect(locator).toHaveText(...)` | Text content verification |
| A4 | `await expect(locator).toHaveValue(...)` | Form field value check |
| A5 | `await expect(locator).toHaveCount(...)` | Element count (e.g., h1 count) |
| A6 | `await expect(page).toHaveTitle(...)` | Page title check |
| A7 | `await expect(response).toBeOK()` | API response status |
| A8 | `await expect(locator).not.toBeVisible()` | Negative visibility |
| A9 | `await expect(locator).toContainText(...)` | Partial text match |

### 5.3 Multi-Browser Execution

- Scripts MUST run on: **Chromium**, **Firefox**, **WebKit**.
- Each feature must produce HTML reports for all 3 browsers (9 browser runs total).
- Reports MUST display **"Run by: 23127379"** in title, header, or metadata.

### 5.4 No Sleep / Flaky Waits

- **Prohibited:** `await page.waitForTimeout(5000)` or any `sleep()` equivalent.
- **Required:** `await expect(locator).toBeVisible({ timeout: 10000 })` or `await page.waitForSelector(...)`.
- Exception: `page.waitForTimeout` with ≤500ms for animation completion is tolerated if documented.

### 5.5 Test Isolation

- Each `test()` block must be self-contained and self-cleaning.
- Use `beforeEach` / `afterEach` for setup and cleanup.
- Use API calls (via `request` fixture or `fetch`) for state setup, not UI navigation, whenever possible.
- Tests must not depend on execution order.

---

## 6. Output Contract — Artefacts Per Pool

| Artefact | File | Location |
|----------|------|----------|
| Playwright spec | `fr##.spec.ts` | `Pool-[X]_FR##/` |
| Test data file | `fr##-test-data.json` (or `.csv`) | `Pool-[X]_FR##/` |
| Automation review | `fr##-automation-review.md` | `Pool-[X]_FR##/` |
| HTML report (Chromium) | `playwright-report/chromium/index.html` | `Pool-[X]_FR##/` |
| HTML report (Firefox) | `playwright-report/firefox/index.html` | `Pool-[X]_FR##/` |
| HTML report (WebKit) | `playwright-report/webkit/index.html` | `Pool-[X]_FR##/` |
| AI Audit | `FR##-AI-Audit.md` | `Pool-[X]_FR##/` |
| Bug report | `bug_report.md` | `HW4/` root |
| Main report | `main_report.md` | `HW4/` root |
| AI Critique | `ai_critique.md` | `HW4/` root |

### AI-Audit Session Block Format

Each session block in `FR##-AI-Audit.md` MUST contain:

```markdown
---
## Session: [YYYY-MM-DD HH:MM] — [Task Description]

- **AI Tool:** [Name and version]
- **Bloom-AI Level:** G9.2 (Apply) / G9.3 (Analyse) / G9.4 (Collaborate)
- **Task:** [What was asked of the AI]
- **Prompt:**
  > [Exact prompt text submitted]
- **AI Output Summary:** [Concise description of what the AI produced]
- **Human Review Notes:** [Corrections made: selectors fixed, assertions added/changed, data extracted, etc.]
- **What AI Got Wrong:** [Specific issues found during human review]
- **Verdict:** Accepted / Partially Accepted / Rejected
```

---

## 7. TC Selection Rules (which TCs to automate)

From each FR's HW2 test cases, select **at least 12** per FR (36 total) following these priorities:

| Priority | Select From | Reason |
|----------|------------|--------|
| 1st | All **EP valid** TCs (TC-FR##-EP-###) | Core happy-path coverage |
| 2nd | All **NEG** TCs with direct UI assertions | Validation/error state coverage |
| 3rd | **BV** TCs at boundaries (LB, UB, LB-1, UB+1) | Edge case coverage |
| Skip | TCs requiring manual observation only (e.g., "visual colour check" impossible to automate) | Document in `fr##-automation-review.md` |

For TCs with known bugs (from HW2 bug reports), automate them and **assert the expected (spec-correct) result**, then document the failure as a confirmed bug in the automation run.

---

## 8. Quality Gates — Before Committing Any Artefact

The agent MUST self-audit against this checklist before presenting output:

```
AUTOMATION SCRIPTS:
□ All test data in external .json/.csv file (no hardcoded values in spec)
□ At least 3 distinct assertion patterns used per spec file
□ No sleep() / waitForTimeout() > 500ms
□ beforeEach/afterEach present for setup and cleanup
□ Each test is independent (can run in any order)
□ Playwright config declares chromium, firefox, webkit projects
□ "Run by: 23127379" appears in report metadata or title

REVIEW & REPORTING:
□ fr##-automation-review.md lists every AI-generated issue found
□ Known bugs (from HW2) documented in automation run output
□ Bug report linked to GitHub Issues (HITL action)
□ AI Audit session block present for every AI interaction

GIT:
□ At least 8 commits touching .spec.ts files
□ Commits spread across at least 4 calendar days
□ Commit messages follow Conventional Commits format
```

---

## 9. Git Commit Convention

One commit per meaningful change to spec files, following Conventional Commits:

```
<type>(FR##): <short description>

type values:
  feat    — new automation script or test data added
  fix     — correction to spec or test data
  test    — execution results / report updates
  docs    — report, audit log, or README updates
  bug     — bug report filed (automation-discovered)
```

**Examples:**
```
feat(FR06): add Playwright spec with 12 automated test cases
feat(FR06): add test data JSON for product detail view
fix(FR06): fix fragile XPath selectors → use data-testid/aria-label
test(FR06): run multi-browser suite, attach HTML reports
bug(FR06): file BUG-FR06-AUTO-001 - category not displayed on product detail
feat(FR08): add checkout automation spec with data-driven inputs
feat(FR15): add admin product CRUD spec with API-based setup
```

---

## 10. HITL Responsibilities

| HITL Duty | Timing | Action Required |
|-----------|--------|-----------------|
| **Script review** | After AI generates spec | Read every `test()` block; fix selectors, assertions, data files |
| **Execution** | After script is fixed | Run `npx playwright test` for all 3 browsers; save HTML reports |
| **Bug filing** | When assertion fails on known bug | Create GitHub Issue with screenshot; link to bug_report.md |
| **Gap analysis** | After each AI session | Complete `fr##-automation-review.md` with what AI got wrong |
| **AI Audit sign-off** | After each session | Fill Human Review Notes and Verdict in AI-Audit session block |
| **Video recording** | During one full browser run | Record 5+ min unlisted YouTube demo video with narration |
| **Git commits** | After each phase | Commit spec changes only; at least 8 commits over 4 days |

---

## 11. Prohibited Actions

| # | Prohibited Action |
|---|------------------|
| P-01 | Hardcoding test data (URLs, values, credentials) inside the spec body |
| P-02 | Using `page.waitForTimeout()` > 500ms without documentation |
| P-03 | Generating scripts without first reading the HW2 TC source file for that FR |
| P-04 | Combining setup/teardown into a single test (non-isolated tests) |
| P-05 | Submitting raw AI output without HITL review |
| P-06 | Using `innerHTML` or `innerText` assignments in test helpers |
| P-07 | Committing HTML reports or binary files to the `scripts` commit (reports in separate commit) |
| P-08 | Using brittle `nth-child()` selectors when stable alternatives exist (`role`, `label`, `text`) |
| P-09 | Using `page.evaluate()` for assertions that could use Playwright's built-in `expect` |
| P-10 | Creating commits that only touch README/PDF — these do not count toward the 8-commit minimum |

---

## 12. Submission Checklist

```
□ Pool A (FR-06): fr06.spec.ts, fr06-test-data.json, fr06-automation-review.md, HTML reports (3 browsers), FR06-AI-Audit.md
□ Pool B (FR-08): fr08.spec.ts, fr08-test-data.json, fr08-automation-review.md, HTML reports (3 browsers), FR08-AI-Audit.md
□ Pool C (FR-15): fr15.spec.ts, fr15-test-data.json, fr15-automation-review.md, HTML reports (3 browsers), FR15-AI-Audit.md
□ playwright.config.ts with 3 browser projects
□ main_report.md (Markdown + PDF)
□ ai_critique.md (200–300 words)
□ bug_report.md (with GitHub Issues links)
□ README.md with self-assessment table and test summary
□ Git commit log (text file, ≥8 commits over ≥4 days)
□ Demo video (YouTube unlisted link, ≥5 minutes, narrated in Vietnamese)
□ Zip filename: 23127379_HW04_AI_Automation_<SelfAssessedGrade>.zip
```

---

*This file is the authoritative governance document for all AI agents in the HW04 workspace. Agent-specific files (GEMINI.md) derive their task definitions from this file and must not contradict it.*
