# AGENTS.md — Cross-tool Rules for EShop Automation Testing (HW04)

> **Scope:** This file is the single cross-tool workflow and governance source for **all AI agents** operating in the HW04 Automation Testing workspace. Do not require a separate `GEMINI.md`, `CLAUDE.md`, or tool-specific workflow file. Tool-specific files may only point back to this file; they must not duplicate or override it.
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
| **A** | FR-06 | Product Detail View | `23127379_Homework/HW2/Pool-A_FR06_ProductDetailView/FR06-test-cases.md` | `http://localhost:5173/product/:id` |
| **B** | FR-08 | Checkout | `23127379_Homework/HW2/Pool-B_FR08_Checkout/FR08-test-cases.md` | `http://localhost:5173/checkout` |
| **C** | FR-15 | Product Management (CRUD) | `23127379_Homework/HW2/Pool-C_FR15_ProductManagement/FR15-test-cases.md` | `http://localhost:5174` (Web Admin) |

Each pool maps to a dedicated workspace directory:

```
23127379_Homework/HW4/
├── fixtures/
│   └── eshop.fixture.ts
├── pages/
│   ├── base.page.ts
│   ├── product-detail.page.ts
│   ├── checkout.page.ts
│   └── product-management.page.ts
├── Pool-A_FR06/
│   └── fr06-run-summary.md
├── Pool-B_FR08/
│   └── fr08-run-summary.md
└── Pool-C_FR15/
    └── fr15-run-summary.md
```

Pool-specific specs, data, reviews, reports, and audits are written **only** into that pool's directory. Shared fixture/page infrastructure stays in `HW4/fixtures/` and `HW4/pages/`. Writing one FR's pool artefacts into another pool is a **hard error**.

### 2.1 HW04 automation scope: browser UI only

HW2 remains authoritative for feature behaviour, but its API-level test cases are outside the HW04 automation scope.

- Select only TCs whose actions and required assertions can be completed through the Web or Web Admin UI.
- Do not use Playwright `request`, `APIRequestContext`, `fetch`, direct endpoint calls, database queries, network-response interception/assertions, or API response/status assertions.
- Setup and cleanup must also use the UI. API seeding and API cleanup are prohibited.
- A hybrid HW2 TC is eligible when it has an explicit UI execution path and a primary UI-observable outcome. Automate all UI-observable clauses, list its API/database clauses as not covered by HW4, and never claim those clauses passed.
- List every excluded API-dependent TC in `fr##-automation-review.md` as `Out of HW4 scope — API testing`, then choose another eligible UI TC. Do not count it as automated or “manual-only”.
- The minimum remains 12 UI automation TCs per FR.

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

HW2 is the source of truth for test identity, inputs, expected results, and known defects. Before working on one FR, read only that FR's complete HW2 source set plus the shared SRS. Do not copy TC mappings into a skill.

| Priority | Source File | Purpose |
|----------|------------|---------|  
| 1 (Primary) | `23127379_Homework/HW2/Pool-A_FR06_ProductDetailView/FR06-test-cases.md` | TC list for FR-06 automation |
| 1 (Primary) | `23127379_Homework/HW2/Pool-B_FR08_Checkout/FR08-test-cases.md` | TC list for FR-08 automation |
| 1 (Primary) | `23127379_Homework/HW2/Pool-C_FR15_ProductManagement/FR15-test-cases.md` | TC list for FR-15 automation |
| 2 (Context) | `23127379_Homework/HW2/agents/context/eshop-srs.md` | SUT requirements for selector/assertion grounding |
| 3 (Context) | `23127379_Homework/HW2/Pool-A_FR06_ProductDetailView/FR06-bug-report.md` | Known bugs — inform expected assertion outcomes |
| 3 (Context) | `23127379_Homework/HW2/Pool-B_FR08_Checkout/FR08-bug-report.md` | Known bugs for FR-08 |
| 3 (Context) | `23127379_Homework/HW2/Pool-C_FR15_ProductManagement/FR15-bug-report.md` | Known bugs for FR-15 |

### 4.1 Source precedence

When sources conflict, apply this order:

1. The HW04 assignment file defines submission requirements.
2. This `AGENTS.md` defines the execution workflow and quality gates.
3. The FR's HW2 `FR##-test-cases.md` defines TC ID, title, steps, data, and spec-correct expected result.
4. `eshop-srs.md` defines required behaviour when a TC is ambiguous.
5. The FR's HW2 bug report defines known defect descriptions and canonical Bug IDs.
6. Live DOM/source inspection defines locators only; buggy SUT behaviour never replaces the spec-correct expectation.
7. `.agents/context/hw04-feature-reference.md` is a verified navigation aid, not an independent source of truth.

If HW2 files disagree with each other, record a source discrepancy in the automation review and ask HITL to resolve it. Never silently invent or shift a TC/Bug mapping.

### 4.2 Playwright skill policy

Use `.agents/skills/playwright/SKILL.md` and its relevant core/CI/POM guides for Playwright engineering patterns. Load only the guides needed for the current task. Apply this precedence:

```text
HW04 assignment → AGENTS.md → current FR's HW2 sources
→ HW04 custom skill → generic Playwright skill
```

Generic examples that conflict with P-01 through P-14 are not allowed. In particular, do not copy generic `page.evaluate()`, `innerHTML`, API testing/seeding, mock, timeout, or cleanup patterns without checking them against this file.

### 4.3 Mandatory Playwright routing by workflow gate

The `playwright/` folder is an active technical layer of this workflow, not a passive reference library. A top-level workflow skill MUST load the supporting Playwright skill and listed guides for its current gate.

| Workflow gate | Top-level skill | Required supporting Playwright skills/guides | Conditional routing |
|---|---|---|---|
| Infrastructure | `playwright-setup` | `playwright-core`: `configuration.md`, `authentication.md`; `playwright-ci`: `projects-and-dependencies.md`, `reporting-and-artifacts.md`, `global-setup-teardown.md` | Load a CI-provider guide only when a provider pipeline is requested |
| FR generation | `automation-script-gen` | `playwright-core`: `test-architecture.md`, `test-data-management.md`, `locators.md`, `assertions-and-waiting.md`, `fixtures-and-hooks.md`, `react.md`; `playwright-pom`: `pom-vs-fixtures-vs-helpers.md` | Add `forms-and-validation.md`, `crud-testing.md`, or `error-and-edge-cases.md` when selected UI TCs require them; use `playwright-cli` for live inspection only when available |
| FR review | `script-review` | `playwright-core`: `locator-strategy.md`, `assertions-and-waiting.md`, `flaky-tests.md`, `common-pitfalls.md`, `test-organization.md`; `playwright-pom`: re-check the architecture decision | Use `playwright-cli` to verify live locators or reproduce a UI flow only when available |
| Browser evidence | `playwright-ci` | `projects-and-dependencies.md`, `reporting-and-artifacts.md`; `playwright-core`: `debugging.md`, `trace-analysis.md`, `error-index.md` | `playwright-cli` may capture a focused trace/screenshot when installed; provider/sharding/container guides are not loaded for a normal local HW04 run |
| Failure classification | `bug-report-automation` | `playwright-core`: `debugging.md`, `trace-analysis.md`, `error-index.md`; `playwright-ci`: `reporting-and-artifacts.md` | Use `playwright-cli` only for an authorized reproducible browser UI flow |
| Framework migration | `playwright-migration` | `from-cypress.md` or `from-selenium.md` | Not applicable to the normal HW04 flow; activate only when the repository actually contains a migration request/source suite |

Rules:

- “Used” means the relevant `SKILL.md` and routed guide were read and materially applied at the current gate. Merely listing a skill does not count.
- This workspace requires a small shared POM layer: every FR page class extends `pages/base.page.ts`. `playwright-pom` still decides whether additional components belong in page objects, fixtures, or helpers; do not turn page objects into test-data or assertion dumps.
- Before invoking `playwright-cli`, verify that its executable is installed. If unavailable, record the fallback to React source/DOM inspection and standard `@playwright/test`; never claim CLI evidence and never install it implicitly.
- A top-level workflow invocation produces one audit block. Supporting Playwright skills/guides used inside that invocation are recorded in the same block and do not create duplicate audits.
- `playwright-migration` must be recorded as not applicable, not invoked artificially, when no Cypress/Selenium migration exists.

---

## 5. Mandatory Sequential Workflow

The workflow is a state machine. Do not start the next FR until the current FR passes its completion gate.

```text
G0 — Read HW04 + AGENTS.md + current HW2 sources
  ↓
G1 — playwright-setup + playwright-core + playwright-ci → ai-audit-logger
     validate config, browsers, auth and report paths
  ↓
FR-06:
  automation-script-gen + playwright-core + playwright-pom
    (+ playwright-cli inspection when available) → ai-audit-logger
  → script-review/HITL corrections + playwright-core + playwright-pom
    (+ playwright-cli verification when available) → ai-audit-logger
  → playwright-ci: 3 browser runs + report/trace evidence + cumulative run summary
    (+ playwright-core debugging; playwright-cli when available) → ai-audit-logger
  → bug-report-automation + playwright-core + playwright-ci
    once for all genuine failures → ai-audit-logger
  → FR-06 completion gate
  ↓
FR-08: same cycle → FR-08 completion gate
  ↓
FR-15: same cycle → FR-15 completion gate
  ↓
Final reports, critique, video and submission package
```

Rules:

- Invoke `playwright-setup` exactly once unless infrastructure changes.
- Process FRs in the order FR-06 → FR-08 → FR-15.
- Invoke `playwright-ci` once per reviewed FR for the local three-browser evidence gate; do not interpret this as authorization to create or change a remote CI pipeline.
- Invoke `bug-report-automation` once per FR run and batch all classified failures from that run.
- Invoke `ai-audit-logger` once after each completed top-level workflow-skill invocation. Record nested Playwright supporting skills in that same block. The logger action does not audit itself.
- Each invocation of the FR runner appends exactly one session to that FR's `fr##-run-summary.md`, even when one or more browser attempts fail. Do not count setup, listing, review, or `show-report` as a run.
- Do not mark an FR complete until its spec, external data, review, cumulative run summary, three reports, bug classification, and signed audit blocks exist.

### 5.1 User-facing slash commands

These are chat-command aliases interpreted by any AI agent that reads this `AGENTS.md`; they are not shell commands and do not require an IDE plugin. The user sends exactly one command per message. Supporting Playwright skills are loaded automatically.

| Stage | Slash command | Top-level action | Required state and stop point |
|---|---|---|---|
| Help | `/hw4-help` | List the commands and current valid FR values | Read-only; never advances the workflow |
| G0 — Inspect/resume | `/hw4-status` | Inspect existing artefacts and report the current gate and next valid command | Read-only; may be called at any time |
| G1 — Infrastructure setup | `/hw4-setup` | Run `playwright-setup`, validate three browsers, auth state, and report paths, then audit | Run once before FR-06 or after an infrastructure change; stop before F1 |
| F1 — Generate one FR | `/hw4-generate FR-06` | Run `automation-script-gen` for the current FR under browser-UI-only scope, then audit | G1 must pass; stop at the review gate |
| F2 — Review one FR | `/hw4-review FR-06` | Run `script-review`, correct spec/data, update automation review, then audit | F1 artefacts must exist; stop before browser runs |
| F3 — Run browser evidence | `/hw4-run FR-06` | Run the local `playwright-ci` evidence gate for Chromium, Firefox, and WebKit; update the FR run summary; then audit | F2 must pass; stop after reports/traces and one new run-summary session are captured |
| F4 — Classify failures | `/hw4-bugs FR-06` | Run `bug-report-automation` for all three browser results, then audit | F3 results must exist; stop at the FR completion gate |
| F5 — HITL sign-off | `/hw4-signoff FR-06` followed by the review block below | Update one specified pending audit block and re-check the completion gate | Repeat for each pending audit session; only complete accepted blocks unlock the next FR |
| G2 — Final deliverables | `/hw4-final` | Complete final reports and submission checklist without fabricating issues or video links | All three FR completion gates must pass |

For F1–F5, replace `FR-06` only with the current permitted FR in the sequence `FR-06 → FR-08 → FR-15`.

Use this payload immediately after `/hw4-signoff FR-##`:

```text
Session: YYYY-MM-DD HH:MM — exact session title
Human Review Notes: ...
What AI Got Wrong: ...
Verdict: Accepted | Partially Accepted | Rejected
```

Command rules:

- Command names are lowercase and must start the message. Supported FR arguments are exactly `FR-06`, `FR-08`, and `FR-15`.
- If a command is unknown, lacks a required FR/session/review field, or targets an out-of-order FR, make no changes and respond with `/hw4-help`, the current gate, and the missing prerequisite.
- Do not chain commands in one message. A command such as `/hw4-generate FR-06 && /hw4-review FR-06` is invalid.
- Extra prose may narrow the current command but cannot expand it past the stage stop point.
- A broad request such as `/hw4-all` or `làm toàn bộ HW4` is unsupported because it would bypass HITL gates.
- `ai-audit-logger` runs automatically after `/hw4-setup`, `/hw4-generate`, `/hw4-review`, `/hw4-run`, and `/hw4-bugs`; there is no separate audit command.
- `/hw4-status`, `/hw4-help`, and an incomplete `/hw4-signoff` are read-only and do not create audit blocks.
- To resume in a new conversation, call `/hw4-status`, then use the exact next command returned by the agent.

---

## 6. Mandatory Automation Standards

### 6.1 Data-Driven Testing

- **RULE:** All test data (URLs, input values, expected messages, boundary values) MUST be stored in a dedicated `.json` or `.csv` file in the pool directory.
- **RULE:** The spec file must import/read from the data file — no hardcoded values in the `test()` body.
- **Allowed:** `const testData = require('./fr06-test-data.json')` or reading CSV with a parser.
- **Prohibited:** `const name = "Laptop Gaming ABC"` directly inside the spec.

### 6.2 Assertion Patterns (Minimum 3 per feature)

Every spec file MUST use at least 3 of these assertion patterns:

| Pattern # | Playwright Assertion | Use Case |
|-----------|---------------------|----------|
| A1 | `await expect(page).toHaveURL(...)` | Redirect / navigation verification |
| A2 | `await expect(locator).toBeVisible()` | Element visibility check |
| A3 | `await expect(locator).toHaveText(...)` | Text content verification |
| A4 | `await expect(locator).toHaveValue(...)` | Form field value check |
| A5 | `await expect(locator).toHaveCount(...)` | Element count (e.g., h1 count) |
| A6 | `await expect(page).toHaveTitle(...)` | Page title check |
| A8 | `await expect(locator).not.toBeVisible()` | Negative visibility |
| A9 | `await expect(locator).toContainText(...)` | Partial text match |

### 6.3 Multi-Browser Execution

- Scripts MUST run on: **Chromium**, **Firefox**, **WebKit**.
- Each feature must produce HTML reports for all 3 browsers (9 browser runs total).
- Reports MUST display **"Run by: 23127379"** in title, header, or metadata.
- `scripts/run-feature.mjs FR06|FR08|FR15` must maintain `fr##-run-summary.md` in the current pool. Each session records the cumulative tracked run number, timestamp, process status, passed/failed/flaky/skipped/total counts, duration, and browser-specific report/result paths.
- Counts must come from the Playwright JSON reporter. Missing or invalid JSON is recorded as `N/A` with a collection note; never reuse stale counts or invent results.
- After all three browser attempts, generate `playwright-report/index.html` as the current FR overview. It must show the latest per-browser counts and link to the isolated Chromium, Firefox, and WebKit HTML reports.
- Open the full current FR report from `23127379_Homework/HW4` with:

```bash
npx playwright show-report Pool-A_FR06/playwright-report
```

To open only one browser, append `chromium`, `firefox`, or `webkit` to the report path. Replace the pool for the current FR. Stop the local report server with `Ctrl+C`; use `--port <number>` when the default port is occupied.

### 6.4 No Sleep / Flaky Waits

- **Prohibited:** `await page.waitForTimeout(5000)` or any `sleep()` equivalent.
- **Required:** `await expect(locator).toBeVisible({ timeout: 10000 })` or `await page.waitForSelector(...)`.
- Exception: `page.waitForTimeout` with ≤500ms for animation completion is tolerated if documented.

### 6.5 Test Isolation

- Each `test()` block must be self-contained and self-cleaning.
- Use `beforeEach` / `afterEach` for setup and cleanup via **UI actions** (navigate, fill, click).
- Never use direct API actions for setup, test steps, assertions, or cleanup.
- Tests must not depend on execution order.

### 6.6 Shared fixtures and Page Object Model

- `fixtures/eshop.fixture.ts` is the only shared custom-test entry point. Specs import `test` and `expect` from it, not directly from `@playwright/test`.
- `userPage` and `adminPage` create a fresh browser context and page per test using the corresponding saved storage state, then close that context after `await use(...)`.
- API fixtures such as `userApiRequest` and `adminApiRequest` are prohibited. Resource fixtures such as `seededProduct` or `seededOrder` may be added only when both setup and teardown are implemented through verified UI flows.
- `pages/base.page.ts` owns only shared browser-page behaviour such as resolving an externally supplied URL and navigation. It must not contain feature-specific locators, credentials, test data, or hardcoded SUT URLs.
- `product-detail.page.ts`, `checkout.page.ts`, and `product-management.page.ts` extend `BasePage`. Their locators must be verified against the React source/live DOM, and their methods express user intent.
- Page objects never store mutable test data between tests. Input values and expected results remain in each pool's external JSON/CSV.
- `automation-script-gen` may update only the current FR's page class. Changes to `base.page.ts` or `eshop.fixture.ts` are infrastructure changes and require `playwright-setup` plus a new infrastructure audit.

---

## 7. Output Contract — Artefacts Per Pool

| Artefact | File | Location |
|----------|------|----------|
| Playwright spec | `fr##.spec.ts` | `Pool-[X]_FR##/` |
| Test data file | `fr##-test-data.json` (or `.csv`) | `Pool-[X]_FR##/` |
| Shared fixtures | `eshop.fixture.ts` | `HW4/fixtures/` |
| Base page object | `base.page.ts` | `HW4/pages/` |
| FR page objects | `product-detail.page.ts`, `checkout.page.ts`, `product-management.page.ts` | `HW4/pages/` |
| Automation review | `fr##-automation-review.md` | `Pool-[X]_FR##/` |
| Cumulative run summary | `fr##-run-summary.md` | `Pool-[X]_FR##/` |
| Full FR report overview | `playwright-report/index.html` | `Pool-[X]_FR##/` |
| HTML report (Chromium) | `playwright-report/chromium/index.html` | `Pool-[X]_FR##/` |
| HTML report (Firefox) | `playwright-report/firefox/index.html` | `Pool-[X]_FR##/` |
| HTML report (WebKit) | `playwright-report/webkit/index.html` | `Pool-[X]_FR##/` |
| AI Audit | `FR##-AI-Audit.md` | `Pool-[X]_FR##/` |
| Bug report | `bug_report.md` | `HW4/` root |
| Main report | `main_report.md` | `HW4/` root |
| AI Critique | `ai_critique.md` | `HW4/` root |
| Infrastructure AI Audit | `Infrastructure-AI-Audit.md` | `HW4/` root |

### AI-Audit Session Block Format

Each top-level workflow-skill invocation produces exactly one session block. Infrastructure skills append to `Infrastructure-AI-Audit.md`; FR skills append to the current `FR##-AI-Audit.md`. Supporting Playwright skills used inside that invocation stay in the same block.

```markdown
---
## Session: [YYYY-MM-DD HH:MM] — [Task Description]

- **AI Tool:** [Name and version]
- **Bloom-AI Level:** G9.2 (Apply) / G9.3 (Analyse) / G9.4 (Collaborate)
- **Task:** [What was asked of the AI]
- **Prompt:**
  > [Exact prompt text submitted]
- **Supporting Playwright Skills:** [Skill names and guides materially used, or None]
- **AI Output Summary:** [Concise description of what the AI produced]
- **Human Review Notes:** Pending HITL review
- **What AI Got Wrong:** Pending HITL review
- **Verdict:** Pending HITL review / Accepted / Partially Accepted / Rejected
```

---

## 8. TC Selection Rules (which TCs to automate)

From each FR's HW2 test cases, select **at least 12** per FR (36 total) following these priorities:

| Priority | Select From | Reason |
|----------|------------|--------|
| 1st | All **EP valid** TCs (TC-FR##-EP-###) | Core happy-path coverage |
| 2nd | All **NEG** TCs with direct UI assertions | Validation/error state coverage |
| 3rd | **BV** TCs at boundaries (LB, UB, LB-1, UB+1) | Edge case coverage |
| Exclude | TCs requiring direct HTTP calls, API response/status assertions, or database inspection | Out of HW4 scope — replace with another UI TC |
| Last | Manual-only TCs after attempting Playwright-native automation | Document the concrete blocker in `fr##-automation-review.md` |

For TCs with known bugs (from HW2 bug reports), automate them and **assert the expected (spec-correct) result**, then document the failure as a confirmed bug in the automation run.

Colour and focus order remain UI-automatable with `toHaveCSS` and `toBeFocused`. Malformed-token, tampered-payload, HTTP-status, and database-only TCs are excluded as API testing, not reimplemented with Playwright's request fixture.

---

## 9. Quality Gates — Before Committing Any Artefact

The agent MUST self-audit against this checklist before presenting output:

```
AUTOMATION SCRIPTS:
□ All test data in external .json/.csv file (no hardcoded values in spec)
□ At least 3 distinct assertion patterns used per spec file
□ No sleep() / waitForTimeout() > 500ms
□ No Playwright request fixture, APIRequestContext, fetch, direct endpoint call, network-response assertion, database assertion, API setup, or API cleanup
□ beforeEach/afterEach present for setup and cleanup
□ Each test is independent (can run in any order)
□ Specs import test/expect from fixtures/eshop.fixture.ts
□ userPage/adminPage use fresh test-scoped contexts and close them after use
□ Every FR page object extends pages/base.page.ts
□ No credentials, input values, expected results, or hardcoded SUT URLs in page objects
□ Playwright config declares chromium, firefox, webkit projects
□ "Run by: 23127379" appears in report metadata or title

REVIEW & REPORTING:
□ fr##-automation-review.md lists every AI-generated issue found
□ fr##-run-summary.md has one cumulative session per FR runner invocation
□ Run-summary counts come from browser-specific JSON results; collection failures are explicit
□ Run summary documents full-FR and browser-specific `npx playwright show-report <path>` commands
□ Full FR report overview links to all three isolated browser reports
□ Known bugs (from HW2) documented in automation run output
□ Bug report linked to GitHub Issues (HITL action)
□ One AI Audit block present for every completed skill invocation
□ Human Review Notes and Verdict are signed by HITL, not fabricated by AI

GIT:
□ At least 8 commits touching .spec.ts files
□ Commits spread across at least 4 calendar days
□ Commit messages follow Conventional Commits format
```

---

## 10. Git Commit Convention

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
feat(FR15): add admin product CRUD spec with UI-based setup
```

---

## 11. HITL Responsibilities

| HITL Duty | Timing | Action Required |
|-----------|--------|-----------------|
| **Script review** | After AI generates spec | Read every `test()` block; fix selectors, assertions, data files |
| **Execution** | After script is fixed | Run `npx playwright test` for all 3 browsers; save HTML reports |
| **Bug filing** | When assertion fails on known bug | Create GitHub Issue with screenshot; link to bug_report.md |
| **Gap analysis** | After script-review for each FR | Complete `fr##-automation-review.md` with what AI got wrong |
| **AI Audit sign-off** | After each skill invocation | Replace pending Human Review Notes and Verdict |
| **Video recording** | During one full browser run | Record 5+ min unlisted YouTube demo video with narration |
| **Git commits** | After each phase | Commit spec changes only; at least 8 commits over 4 days |

---

## 12. Prohibited Actions

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
| P-11 | Starting work on FR-08 or FR-15 before the preceding FR completion gate passes |
| P-12 | Duplicating authoritative TC/Bug mappings inside a skill instead of reading HW2 |
| P-13 | Having the audit logger create an audit of its own logging action |
| P-14 | Using API testing, request fixtures, direct endpoint calls, network-response assertions, database assertions, API setup, or API cleanup in HW04 automation |

---

## 13. Submission Checklist

```
□ Pool A (FR-06): fr06.spec.ts, fr06-test-data.json, fr06-automation-review.md, fr06-run-summary.md, HTML reports (3 browsers), FR06-AI-Audit.md
□ Pool B (FR-08): fr08.spec.ts, fr08-test-data.json, fr08-automation-review.md, fr08-run-summary.md, HTML reports (3 browsers), FR08-AI-Audit.md
□ Pool C (FR-15): fr15.spec.ts, fr15-test-data.json, fr15-automation-review.md, fr15-run-summary.md, HTML reports (3 browsers), FR15-AI-Audit.md
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

*This file is the authoritative workflow for all AI agents in the HW04 workspace. A separate agent-specific workflow file is neither required nor authoritative.*
