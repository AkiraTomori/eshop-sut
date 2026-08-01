# HW04 Consolidated AI Audit Report

> **Student:** 23127379 — Thái Minh Huy  
> **Composition:** Verbatim contents of the infrastructure, FR-06, FR-08, and FR-15 AI audit Markdown files, in workflow order. Source files remain authoritative.

---

# Infrastructure AI Audit

Source: `Infrastructure-AI-Audit.md`

# Infrastructure AI Audit — HW04

---
## Session: 2026-07-30 23:24 — skill-creator: Consolidate the HW04 agent workflow

- **AI Tool:** OpenAI Codex (GPT-5)
- **Bloom-AI Level:** G9.4 (Collaborate)
- **Task:** Refactor the repository-local skills and move the complete sequential workflow into the root `AGENTS.md`.
- **Prompt:**
  > Mình muốn có workflow như thế này sẽ dùng cho cho file Agents.md thay vì riêng biệt như Gemini.md
  > Cụ thể như sau:
  > Trước tiên là bạn hãy sửa các mục từ 1 đến 7 mà bạn đã đề xuất trước, đồng thời mình cũng muốn áp dụng skill Playwright mà mình đã đi tham khảo được.
  > Workflow mà mình muốn là 
  > Những mớ nội dung của TC02 là source of truth quan trọng
  > Sau đó thì thiết lập Playwright Setup
  > Việc mà từ sinh script, script revỉew, bug report từ automation sẽ được thực hiện ở từng 1 FR một, xong 1 FR thì mới tới FR khác, mỗi lần thực hiện skill sẽ là 1 audit cho A.I. Đó là Workflow của mình
- **AI Output Summary:** Updated root `AGENTS.md` as the single cross-tool workflow, defined HW2 source precedence and FR-06 → FR-08 → FR-15 gates, renamed and shortened five custom skills, removed duplicated TC mappings from skill bodies, and made one audit mandatory per completed business-skill invocation.
- **Human Review Notes:** Agents .md now contains the complete HW04 workflow, including Playwright setup and per-FR automation steps. The workflow is structured to ensure that each FR is completed before moving to the next, with clear audit points for AI review. All references to Gemini.md have been removed, and the skills have been streamlined for clarity and efficiency.
- **What AI Got Wrong:** No wrong outputs detected; however, the human reviewer should verify that all links and references are correctly updated and that the workflow aligns with the intended HW04 process.
- **Verdict:** All changes have been successfully integrated into the `AGENTS.md` file, and the workflow is now consolidated and ready for use. Further review may be needed to ensure that all Playwright skills are correctly referenced and functional within the new structure.

---
## Session: 2026-07-30 23:24 — playwright-skill: Apply generic Playwright guidance to HW04

- **AI Tool:** OpenAI Codex (GPT-5)
- **Bloom-AI Level:** G9.3 (Analyse) + G9.4 (Collaborate)
- **Task:** Integrate the referenced Playwright skill under HW04 governance and repair its workspace-facing issues.
- **Prompt:**
  > Mình muốn có workflow như thế này sẽ dùng cho cho file Agents.md thay vì riêng biệt như Gemini.md
  > Cụ thể như sau:
  > Trước tiên là bạn hãy sửa các mục từ 1 đến 7 mà bạn đã đề xuất trước, đồng thời mình cũng muốn áp dụng skill Playwright mà mình đã đi tham khảo được.
  > Workflow mà mình muốn là 
  > Những mớ nội dung của TC02 là source of truth quan trọng
  > Sau đó thì thiết lập Playwright Setup
  > Việc mà từ sinh script, script revỉew, bug report từ automation sẽ được thực hiện ở từng 1 FR một, xong 1 FR thì mới tới FR khác, mỗi lần thực hiện skill sẽ là 1 audit cho A.I. Đó là Workflow của mình
- **AI Output Summary:** Added an EShop HW04 precedence overlay to the generic Playwright skill, routed custom skills to relevant core/CI guides, made `playwright-cli` optional, and repaired all detected broken relative documentation links.
- **Human Review Notes:** Approved
- **What AI Got Wrong:** No wrong outputs detected
- **Verdict:** All changes have been successfully integrated into the `AGENTS.md` file, and the workflow is now consolidated and ready for use. Further review may be needed to ensure that all Playwright skills are correctly referenced and functional within the new structure.

---
## Session: 2026-07-30 23:24 — playwright-setup: Repair shared automation infrastructure

- **AI Tool:** OpenAI Codex (GPT-5)
- **Bloom-AI Level:** G9.2 (Apply) + G9.4 (Collaborate)
- **Task:** Align the current Playwright project with the sequential per-FR workflow and required isolated browser reports.
- **Prompt:**
  > Mình muốn có workflow như thế này sẽ dùng cho cho file Agents.md thay vì riêng biệt như Gemini.md
  > Cụ thể như sau:
  > Trước tiên là bạn hãy sửa các mục từ 1 đến 7 mà bạn đã đề xuất trước, đồng thời mình cũng muốn áp dụng skill Playwright mà mình đã đi tham khảo được.
  > Workflow mà mình muốn là 
  > Những mớ nội dung của TC02 là source of truth quan trọng
  > Sau đó thì thiết lập Playwright Setup
  > Việc mà từ sinh script, script revỉew, bug report từ automation sẽ được thực hiện ở từng 1 FR một, xong 1 FR thì mới tới FR khác, mỗi lần thực hiện skill sẽ là 1 audit cho A.I. Đó là Workflow của mình
- **AI Output Summary:** Added external environment/auth data, pinned Playwright 1.62.0, corrected user/admin login setup, added run metadata, and added a feature runner that isolates Chromium, Firefox, and WebKit reports and results under the current FR pool.
- **Human Review Notes:** Approved
- **What AI Got Wrong:** No wrong outputs detected
- **Verdict:** All changes have been successfully integrated into the `AGENTS.md` file, and the workflow is now consolidated and ready for use. Further review may be needed to ensure that all Playwright skills are correctly referenced and functional within the new structure.

---
## Session: 2026-07-30 23:41 — skill-creator: Add Playwright pack routing to the HW04 workflow

- **AI Tool:** OpenAI Codex (GPT-5)
- **Bloom-AI Level:** G9.4 (Collaborate)
- **Task:** Refine the repository skills and audit contract so the Playwright packs are invoked at explicit workflow gates.
- **Prompt:**
  > Mình muốn những mớ trong Folder Playwright cũng được sử dụng ở trong workflow của mình.
- **Supporting Playwright Skills:** `playwright-skill` routing policy
- **AI Output Summary:** Updated `AGENTS.md`, five HW04 business skills, and the audit logger so setup, generation, review, three-browser evidence, and failure classification each route to explicit Playwright skills/guides while preserving one audit per top-level invocation.
- **Human Review Notes:** Approved
- **What AI Got Wrong:** No wrong outputs detected
- **Verdict:** All changes have been successfully integrated into the `AGENTS.md` file, and the workflow is now consolidated and ready for use. Further review may be needed to ensure that all Playwright skills are correctly referenced and functional within the new structure.

---
## Session: 2026-07-30 23:41 — playwright-skill: Activate core, CI, POM, CLI, and migration routing

- **AI Tool:** OpenAI Codex (GPT-5)
- **Bloom-AI Level:** G9.3 (Analyse) + G9.4 (Collaborate)
- **Task:** Make every relevant pack under `.agents/skills/Playwright/` operational in the sequential HW04 workflow.
- **Prompt:**
  > Mình muốn những mớ trong Folder Playwright cũng được sử dụng ở trong workflow của mình.
- **Supporting Playwright Skills:** `playwright-core` (`configuration`, `authentication`, architecture, locators, assertions, data, fixtures, React, debugging, trace analysis, error index); `playwright-ci` (projects, reports/artifacts, global setup/teardown); `playwright-pom` (POM vs fixtures vs helpers); `playwright-cli` (conditional availability gate); `playwright-migration` (conditional Cypress/Selenium gate)
- **AI Output Summary:** Added a mandatory per-gate routing table, made `playwright-ci` the audited three-browser evidence gate, made POM an explicit design decision, guarded CLI use by executable availability, and limited migration to real Cypress/Selenium work. YAML frontmatter, relative Markdown links, and whitespace validation passed; the official Python validator could not run because `PyYAML` is absent.
- **Human Review Notes:** Approved
- **What AI Got Wrong:** No wrong outputs detected
- **Verdict:** All changes have been successfully integrated into the `AGENTS.md` file, and the workflow is now consolidated and ready for use. Further review may be needed to ensure that all Playwright skills are correctly referenced and functional within the new structure.

---
## Session: 2026-07-30 23:46 — skill-creator: Rename the Playwright skill folder

- **AI Tool:** OpenAI Codex (GPT-5)
- **Bloom-AI Level:** G9.2 (Apply)
- **Task:** Rename the repository Playwright skill folder to lowercase and update all active workflow references.
- **Prompt:**
  > đồng thời đổi tên folder là Playwright -> playwright
- **Supporting Playwright Skills:** `playwright-skill` folder structure and relative-link verification
- **AI Output Summary:** Renamed `.agents/skills/Playwright/` to `.agents/skills/playwright/`, updated `AGENTS.md` and the HW04 setup/generation/review/bug-report skill paths, and verified YAML frontmatter, relative Markdown links, Git rename detection, and whitespace.
- **Human Review Notes:** Approved
- **What AI Got Wrong:** No wrong outputs detected
- **Verdict:** All changes have been successfully integrated into the `AGENTS.md` file, and the workflow is now consolidated and ready for use. Further review may be needed to ensure that all Playwright skills are correctly referenced and functional within the new structure.

---
## Session: 2026-07-30 23:51 — skill-creator: Restrict HW04 automation to browser UI testing

- **AI Tool:** OpenAI Codex (GPT-5)
- **Bloom-AI Level:** G9.3 (Analyse) + G9.4 (Collaborate)
- **Task:** Remove API testing from the HW04 workflow while preserving HW2 as the functional source of truth.
- **Prompt:**
  > Trong bài tập của mình thì sẽ không có API Testing nha, dù ở HW2 là mình có làm nhưng ở HW4 là không có test API Testing ở Automation
- **Supporting Playwright Skills:** `playwright-skill` workspace routing and browser-UI testing constraints
- **AI Output Summary:** Added a browser-UI-only scope rule to `AGENTS.md`; removed API guide routing and request/database allowances from generation, review, and bug classification; marked API-only HW2 TCs as out of HW4 scope; revised the FR-08 manifest to 12 UI TCs; clarified hybrid-TC handling; added prohibited action P-14; and replaced the API assertion example in `ai_critique.md` with UI assertions. Static inspection found no API-testing primitives in current HW4 TypeScript files.
- **Human Review Notes:** Approved
- **What AI Got Wrong:** No wrong outputs detected
- **Verdict:** All changes have been successfully integrated into the `AGENTS.md` file, and the workflow is now consolidated and ready for use. Further review may be needed to ensure that all Playwright skills are correctly referenced and functional within the new structure.

---
## Session: 2026-07-30 23:54 — skill-creator: Consolidate user invocation guidance in AGENTS.md

- **AI Tool:** OpenAI Codex (GPT-5)
- **Bloom-AI Level:** G9.2 (Apply) + G9.4 (Collaborate)
- **Task:** Remove the obsolete root Gemini-specific workflow and document how users invoke every HW04 stage.
- **Prompt:**
  > File Gemini.md có thể bỏ được chưa, đồng thời ở file Agents.md hãy cho biết các giai đoạn được gọi như thế nào cho người dùng.
- **Supporting Playwright Skills:** None
- **AI Output Summary:** Verified that root `GEMINI.md` had no HW4 dependents and referenced obsolete skill paths, removed it while preserving `23127379_Homework/HW2/GEMINI.md`, and added copy-paste prompts plus prerequisites and stop points for G0, G1, F1–F5, and G2 in `AGENTS.md`.
- **Human Review Notes:** Approved
- **What AI Got Wrong:** No wrong outputs detected
- **Verdict:** All changes have been successfully integrated into the `AGENTS.md` file, and the workflow is now consolidated and ready for use. Further review may be needed to ensure that all Playwright skills are correctly referenced and functional within the new structure.

---
## Session: 2026-07-30 23:57 — skill-creator: Add user-facing HW04 slash commands

- **AI Tool:** OpenAI Codex (GPT-5)
- **Bloom-AI Level:** G9.2 (Apply) + G9.4 (Collaborate)
- **Task:** Replace long copy-paste workflow prompts with concise, validated slash-command aliases.
- **Prompt:**
  > Cho mình dạng câu lệnh "/" để yêu cầu được không
- **Supporting Playwright Skills:** None
- **AI Output Summary:** Added `/hw4-help`, `/hw4-status`, `/hw4-setup`, `/hw4-generate FR-##`, `/hw4-review FR-##`, `/hw4-run FR-##`, `/hw4-bugs FR-##`, `/hw4-signoff FR-##`, and `/hw4-final` to `AGENTS.md`, including argument validation, HITL sign-off payload, automatic audit behavior, and rules against command chaining or gate bypass.
- **Human Review Notes:** Approved
- **What AI Got Wrong:** No wrong outputs detected
- **Verdict:** All changes have been successfully integrated into the `AGENTS.md` file, and the workflow is now consolidated and ready for use. Further review may be needed to ensure that all Playwright skills are correctly referenced and functional within the new structure.

---
## Session: 2026-07-31 08:36 — playwright-setup: Rebuild and validate shared HW04 infrastructure

- **AI Tool:** OpenAI Codex (GPT-5)
- **Bloom-AI Level:** G9.2 (Apply) + G9.3 (Analyse)
- **Task:** Rebuild the deleted shared HW04 Playwright infrastructure and validate the G1 setup gate without generating FR-06 automation.
- **Prompt:**
  > /hw4-setup
- **Supporting Playwright Skills:** `playwright-core` (`configuration.md`, `authentication.md`); `playwright-ci` (`projects-and-dependencies.md`, `reporting-and-artifacts.md`, `global-setup-teardown.md`)
- **AI Output Summary:** Recreated the package/configuration, external environment data, UI-only user/admin auth setup and teardown, TypeScript configuration, and per-FR three-browser runner; installed Playwright 1.62.0 plus Chromium, Firefox, and WebKit; validated both UI login storage states, TypeScript, project resolution, isolated report/result paths, report metadata, and absence of prohibited API-testing primitives. No FR spec or browser evidence report was generated.
- **Human Review Notes:** Approved
- **What AI Got Wrong:** No wrong outputs detected
- **Verdict:** All changes have been successfully integrated into the `AGENTS.md` file, and the workflow is now consolidated and ready for use. Further review may be needed to ensure that all Playwright skills are correctly referenced and functional within the new structure.

---
## Session: 2026-07-31 08:47 — skill-creator: Add fixture and page-object architecture rules

- **AI Tool:** OpenAI Codex (GPT-5)
- **Bloom-AI Level:** G9.3 (Analyse) + G9.4 (Collaborate)
- **Task:** Extend HW04 governance and relevant skills with mandatory shared fixtures and BasePage-derived page objects.
- **Prompt:**
  > Cái Project Structure, hãy cho mình thêm là có thêm hai folder là fixtures fixtures nó sẽ liên quan thế này
  > /**
  > - Custom fixture types for EShop test suite.
  >  *
  > - Fixtures are the recommended Playwright mechanism for sharing setup/teardown
  > - logic across tests. Each fixture is created fresh per test ('test' scope)
  > - to ensure full isolation — no shared mutable state between tests.
  >  *
  > - Current fixtures:
  > - userPage        → Page pre-loaded with standard user session
  > - adminPage       → Page pre-loaded with admin user session
  > - userApiRequest  → APIRequestContext with user Bearer token
  > - adminApiRequest → APIRequestContext with admin Bearer token
  > - seededProduct   → Creates a product before test, deletes it after
  > - seededOrder     → Creates a pending order before test, cancels it after
  >  *
  > - Adding new fixtures:
  > - Define new fixture types in EShopFixtures and implement them in the
  > - test.extend() call below. Keep each fixture focused on one resource.
  > - Always include teardown code after await use(...).
  >  */
  > Folder pages thì sẽ có file bage.ts nội dung như này và các trang khác kế thừa cho nó.
  > Hãy bổ sung cho mình và Skill liên quan.
- **Supporting Playwright Skills:** `playwright-core` (`fixtures-and-hooks.md`); `playwright-pom` (`page-object-model.md`, `pom-vs-fixtures-vs-helpers.md`)
- **AI Output Summary:** Updated `AGENTS.md`, `playwright-setup`, `automation-script-gen`, `script-review`, and Playwright fixture/POM guidance to require test-scoped UI fixtures and BasePage-derived FR page objects. Explicitly excluded the requested API request fixtures and limited future seeded-resource fixtures to verified UI setup/teardown so the architecture remains compliant with HW04 browser-UI-only scope.
- **Human Review Notes:** Approved 
- **What AI Got Wrong:** No wrong outputs detected
- **Verdict:** Accepted. All changes have been successfully integrated into the `AGENTS.md` file, and the workflow is now consolidated and ready for use. Further review may be needed to ensure that all Playwright skills are correctly referenced and functional within the new structure.

---
## Session: 2026-07-31 08:47 — playwright-setup: Create shared fixtures and page objects

- **AI Tool:** OpenAI Codex (GPT-5)
- **Bloom-AI Level:** G9.2 (Apply) + G9.4 (Collaborate)
- **Task:** Implement and validate the shared HW04 fixture and Page Object Model infrastructure.
- **Prompt:**
  > Cái Project Structure, hãy cho mình thêm là có thêm hai folder là fixtures fixtures nó sẽ liên quan thế này
  > /**
  > - Custom fixture types for EShop test suite.
  >  *
  > - Fixtures are the recommended Playwright mechanism for sharing setup/teardown
  > - logic across tests. Each fixture is created fresh per test ('test' scope)
  > - to ensure full isolation — no shared mutable state between tests.
  >  *
  > - Current fixtures:
  > - userPage        → Page pre-loaded with standard user session
  > - adminPage       → Page pre-loaded with admin user session
  > - userApiRequest  → APIRequestContext with user Bearer token
  > - adminApiRequest → APIRequestContext with admin Bearer token
  > - seededProduct   → Creates a product before test, deletes it after
  > - seededOrder     → Creates a pending order before test, cancels it after
  >  *
  > - Adding new fixtures:
  > - Define new fixture types in EShopFixtures and implement them in the
  > - test.extend() call below. Keep each fixture focused on one resource.
  > - Always include teardown code after await use(...).
  >  */
  > Folder pages thì sẽ có file bage.ts nội dung như này và các trang khác kế thừa cho nó.
  > Hãy bổ sung cho mình và Skill liên quan.
- **Supporting Playwright Skills:** `playwright-core` (`fixtures-and-hooks.md`); `playwright-pom` (`page-object-model.md`, `pom-vs-fixtures-vs-helpers.md`)
- **AI Output Summary:** Created `fixtures/eshop.fixture.ts`, `pages/base.page.ts`, and FR-06/FR-08/FR-15 page classes using locators verified from the current React source; added external routes to `test-environment.json`; and updated the README project tree. TypeScript, JSON, skill frontmatter, and whitespace checks passed; Playwright 1.62.0 found all three browser executables. Test discovery correctly found zero specs because FR generation has not started.
- **Human Review Notes:** Approved
- **What AI Got Wrong:** No wrong outputs detected
- **Verdict:** Accepted. All changes have been successfully integrated into the `AGENTS.md` file, and the workflow is now consolidated and ready for use. Further review may be needed to ensure that all Playwright skills are correctly referenced and functional within the new structure.

---
## Session: 2026-07-31 10:10 — skill-creator: Add cumulative FR run-summary governance

- **AI Tool:** OpenAI Codex (GPT-5)
- **Bloom-AI Level:** G9.3 (Analyse) + G9.4 (Collaborate)
- **Task:** Extend the HW04 workflow, output contract, quality gates, and relevant skills with a cumulative per-FR automation run summary and report-opening guidance.
- **Prompt:**
  > Bạn bổ sung thêm cho mình là mỗi khi chạy script automation cho FR, hãy có 1 một file markdown tổng hợp số lần chạy, đồng thời là hướng dẫn cho họ sử dụng câu lệnh show-report để mà mở báo cáo FR đó lên
- **Supporting Playwright Skills:** `playwright-ci` (`reporting-and-artifacts.md`)
- **AI Output Summary:** Updated `AGENTS.md`, `playwright-ci`, `playwright-setup`, and `bug-report-automation` so every FR runner invocation creates one cumulative `fr##-run-summary.md` session with JSON-derived browser results and explicit browser-specific `show-report` commands. Added the run summary to FR completion gates, quality checks, output contracts, and submission requirements.
- **Human Review Notes:** Approved
- **What AI Got Wrong:** Help Human for enhance Skills
- **Verdict:** Accepted

---
## Session: 2026-07-31 10:10 — playwright-setup: Implement cumulative FR run summaries

- **AI Tool:** OpenAI Codex (GPT-5)
- **Bloom-AI Level:** G9.2 (Apply) + G9.3 (Analyse)
- **Task:** Update and validate the shared FR runner, report commands, documentation, and initial evidence-backed FR-06 run summary.
- **Prompt:**
  > Bạn bổ sung thêm cho mình là mỗi khi chạy script automation cho FR, hãy có 1 một file markdown tổng hợp số lần chạy, đồng thời là hướng dẫn cho họ sử dụng câu lệnh show-report để mà mở báo cáo FR đó lên
- **Supporting Playwright Skills:** `playwright-ci` (`reporting-and-artifacts.md`)
- **AI Output Summary:** Enhanced `scripts/run-feature.mjs` to append one per-invocation Markdown session after all Chromium, Firefox, and WebKit attempts, using fresh browser JSON results for counts and recording collection errors as `N/A`. Added nine npm report shortcuts and direct `playwright show-report` guidance to README. Created `fr06-run-summary.md` and backfilled Run #1 from the existing three JSON reports and prior audited FR-06 evidence without rerunning tests. JavaScript syntax, package JSON, TypeScript, and whitespace validation passed.
- **Human Review Notes:** Approved
- **What AI Got Wrong:** Help human for enhance Skills, nothing wrong
- **Verdict:** Accepted

---
## Session: 2026-07-31 10:14 — playwright-setup: Add full-FR report overview command

- **AI Tool:** OpenAI Codex (GPT-5)
- **Bloom-AI Level:** G9.2 (Apply) + G9.3 (Analyse)
- **Task:** Add one command that opens the complete current FR report across Chromium, Firefox, and WebKit while retaining isolated browser reports.
- **Prompt:**
  > Khi mà chạy Report ấy, hãy có câu lệnh cho phép mở full toàn bộ của FR đó
- **Supporting Playwright Skills:** `playwright-ci` (`reporting-and-artifacts.md`)
- **AI Output Summary:** Updated the shared runner to generate `playwright-report/index.html` as a latest-run FR overview with browser statistics and links to all three detailed reports. Added `report:fr06:all`, `report:fr08:all`, and `report:fr15:all` npm commands; updated AGENTS.md, README, the FR run summary, and relevant Playwright skills; and generated the current FR-06 overview from existing Run #1 evidence without rerunning tests. Verified the aggregate `show-report` server and all three linked browser reports returned HTTP 200, then passed JavaScript syntax, package JSON, and TypeScript checks.
- **Human Review Notes:** Approved
- **What AI Got Wrong:** Help human for enhance Skills, nothing wrong
- **Verdict:** Accepted

---
## Session: 2026-07-31 10:33 — playwright-setup: Auto-start all local SUT services

- **AI Tool:** OpenAI Codex (GPT-5)
- **Bloom-AI Level:** G9.2 (Apply) + G9.3 (Analyse)
- **Task:** Configure Playwright to start or reuse Backend, Frontend Web, and Web Admin automatically before every test invocation.
- **Prompt:**
  > Bạn chỉnh sửa Playwright-config.ts một cái cho mình là chỉnh sửa để mà Playwright có thể tự mở web, admin, backend luôn được không, cứ mỗi lần chạy script thì nó có sẵn
- **Supporting Playwright Skills:** `playwright-core` (`configuration.md`)
- **AI Output Summary:** Added the Backend URL to external environment data and configured a three-entry `webServer` array with explicit service working directories, readiness checks, local reuse, startup timeouts, piped diagnostics, and graceful shutdown. Updated AGENTS.md, README, and `playwright-setup` to preserve the browser-UI-only boundary. Verified the exact Backend, Web, and Web Admin commands listened on ports 3000, 5173, and 5174; TypeScript passed; Playwright still discovered 66 tests; and all verification servers were stopped afterward. No FR automation test was executed and no run-summary count was changed.
- **Human Review Notes:** Approved
- **What AI Got Wrong:** A.I Help human for enhance Skills, nothing wrong
- **Verdict:** Accepted

---
## Session: 2026-07-31 11:21 — bug-report-automation: Split detailed FR reports and consolidated summary

- **AI Tool:** OpenAI Codex (GPT-5)
- **Bloom-AI Level:** G9.3 (Analyse) + G9.4 (Collaborate)
- **Task:** Establish a two-tier bug-reporting contract with one detailed report per FR and one root cross-FR summary.
- **Prompt:**
  > Bổ sung thêm này cho mình, đó là mỗi FR sẽ có bug chi tiết, rồi bug-report.md là tổng hợp
- **Supporting Playwright Skills:** None
- **AI Output Summary:** Updated AGENTS.md, README, main report references, and `bug-report-automation` so `/hw4-bugs FR-##` writes full evidence and classifications to `fr##-bug-report.md` and derives only totals, concise indexes, links, and GitHub Issue status into root `bug_report.md`. Created the FR-06 detailed report scaffold and replaced premature FR-08/FR-15 automation-confirmation claims in the root report with truthful not-started states. FR-06 remains explicitly pending F4 classification; no product bug was classified or fabricated in this workflow update. Markdown and whitespace validation passed.
- **Human Review Notes:** Approved
- **What AI Got Wrong:** Help human for enhance Skills, nothing wrong
- **Verdict:** Accepted. All changes have been successfully integrated into the `AGENTS.md` file, and the workflow is now consolidated and ready for use. Further review may be needed to ensure that all Playwright skills are correctly referenced and functional within the new structure.

---
## Session: 2026-08-01 20:19 — playwright-ci: Add automated GitHub Actions test workflow

- **AI Tool:** OpenAI Codex (GPT-5)
- **Bloom-AI Level:** G9.2 (Apply) + G9.3 (Analyse)
- **Task:** Design and implement a GitHub Actions CI workflow that automatically runs all three HW04 features across Chromium, Firefox, and WebKit.
- **Prompt:**
  > Mình đang làm bài tập HW4 Automation Testing, bây giờ bạn hãy thiết kế cho mình Workflow CI để mà cho nó tự test. Có thể tham khảo SKILL để thực hiện
- **Supporting Playwright Skills:** `playwright-ci` (`ci-github-actions.md`, `projects-and-dependencies.md`, `reporting-and-artifacts.md`)
- **AI Output Summary:** Added `.github/workflows/hw4-playwright.yml` with push, pull-request, and manual triggers; a fail-fast-disabled FR06/FR08/FR15 by Chromium/Firefox/WebKit matrix; deterministic npm installs for all three SUT services and HW4; cached Playwright browsers; CI-safe automatic SUT startup through the existing Playwright config; unique HTML/JSON/failure-evidence artifacts retained for 14 days; read-only permissions; concurrency cancellation; and immutable SHA-pinned GitHub Actions. YAML parsing, file-path validation, whitespace checks, and Playwright discovery for all nine matrix combinations passed. No browser evidence run was executed and no FR run summary was changed.
- **Human Review Notes:** Approved workflow design, but the workflow needs to be restructured into a Build-to-Test pipeline that validates the complete application and HW4 test infrastructure before running the three FR suites.
- **What AI Got Wrong:** Build and test phase are in one place
- **Verdict:** Rejected. The workflow needs to be restructured into a Build-to-Test pipeline that validates the complete application and HW4 test infrastructure before running the three FR suites.

---
## Session: 2026-08-01 20:31 — playwright-ci: Gate browser tests behind infrastructure build

- **AI Tool:** OpenAI Codex (GPT-5)
- **Bloom-AI Level:** G9.2 (Apply) + G9.3 (Analyse)
- **Task:** Restructure the GitHub Actions workflow into a Build-to-Test pipeline that validates the complete application and HW4 test infrastructure before running the three FR suites.
- **Prompt:**
  > Bạn có thể làm cách nào mà khi mà CI pipeline nó chạy ớ, mọi hạ tầng từ backend, 2 frontend, monorepo của testing sẽ được khởi tạo trước rồi sẽ bắt đầu test được không
  > Kiểu theo Pipeline là: Build -> Test (3 FR)
- **Supporting Playwright Skills:** `playwright-ci` (`ci-github-actions.md`, `projects-and-dependencies.md`, `reporting-and-artifacts.md`)
- **AI Output Summary:** Added a `Build infrastructure` job that installs all four npm workspaces, validates the Backend entry point, builds the customer and admin Vite frontends, type-checks HW4, validates Playwright discovery, and prepares the browser cache. Made the FR06/FR08/FR15 by Chromium/Firefox/WebKit test matrix depend on that job with `needs: build`; each isolated test runner then restores dependencies and lets the existing Playwright `webServer` configuration start Backend, Web, and Admin before testing. YAML and dependency-edge validation passed, both frontend production builds passed, Backend syntax passed, HW4 TypeScript passed, and Playwright discovered 183 project-expanded tests. No browser evidence run was executed and no FR run summary was changed.
- **Human Review Notes:** Approved
- **What AI Got Wrong:** Change from Build and Test in tight coupling to a Build-to-Test pipeline with explicit dependency edges
- **Verdict:** Accepted

---
## Session: 2026-08-01 21:19 — playwright-ci: Add Docker and GHCR deploy phase

- **AI Tool:** OpenAI Codex (GPT-5)
- **Bloom-AI Level:** G9.2 (Apply) + G9.3 (Analyse)
- **Task:** Add a simple Docker deployment phase that publishes the three EShop service images to GitHub Container Registry after successful CI or manual dispatch, and replace the root server scripts with Docker Compose start/stop commands.
- **Prompt:**
  > Hãy thiết kế cho mình phase Deploy, nhưng chỉ cần đơn giản thôi, hoàn thiện CI thì sẽ tới deploy, nhưng chỉ cần dùng ở Docker. Build and push lên docker registry (chúng ta không dùng Dockerhub, dùng registry có sẵn của github) để build. Bạn thấy ở root có hai file .sh phải không, thay thế nó là câu lệnh dùng để start và stop của docker-compose
  > Bạn có thể sử dụng kiểu là một file deploy riêng, và nó sẽ được kích hoạt khi CI thành công hoặc workflow_dispatch
- **Supporting Playwright Skills:** `playwright-ci` (`ci-github-actions.md`, `docker-and-containers.md`)
- **AI Output Summary:** Added `.github/workflows/deploy.yml` with a secure successful-CI/default-branch `workflow_run` gate plus `workflow_dispatch`, least-privilege GHCR permissions, SHA-pinned Docker actions, and a three-component image matrix publishing `latest` and tested-commit tags. Added Backend, customer Web, and Admin Dockerfiles, Nginx SPA configurations, service `.dockerignore` files, and `compose.yaml` with dependency health checks and GHCR image defaults. Replaced the root scripts with portable `docker compose up --detach --build --wait` and `docker compose down --remove-orphans` commands. All three images built successfully; the Compose stack became healthy and returned HTTP 200 on ports 3000, 5173, and 5174; the stop script removed all test containers and network. Shell, YAML, Compose resolution, and whitespace validation passed. No image was pushed to GHCR locally; publishing begins after the workflow is committed and triggered.
- **Human Review Notes:** Approved the CD Pipeline design but 3 dockerfiles need to be refactored into production-oriented multi-stage builds, and the GHCR publishing logic should be updated to run after either a successful or failed CI conclusion.
- **What AI Got Wrong:** Dockerfiles don't use multi-stage builds, and the GHCR publishing logic only runs after successful CI conclusion.
- **Verdict:** Rejected. The Dockerfiles need to be refactored into production-oriented multi-stage builds, and the GHCR publishing logic should be updated to run after either a successful or failed CI conclusion.

---
## Session: 2026-08-01 21:25 — playwright-ci: Refactor all service Dockerfiles to multi-stage builds

- **AI Tool:** OpenAI Codex (GPT-5)
- **Bloom-AI Level:** G9.2 (Apply) + G9.3 (Analyse)
- **Task:** Refactor the Backend, customer Web, and Admin Dockerfiles into production-oriented multi-stage builds.
- **Prompt:**
  > Ba file Dockerfile của từ backend, 2 frontend, best practice với Multi-stage build đi
- **Supporting Playwright Skills:** `playwright-ci` (`docker-and-containers.md`)
- **AI Output Summary:** Refactored the Backend into reusable base, production-dependency, and non-root runtime stages, and refactored both Vite frontends into dependency, build, and minimal Nginx runtime stages. Pinned all Node and Nginx base images by digest, preserved lockfile-first dependency caching, copied only production dependencies or compiled static assets into final images, set runtime ownership explicitly, and added graceful stop signals. All three images rebuilt successfully; Backend ran as uid 1000 (`node`), neither frontend runtime contained Node.js, the Backend API and both frontends returned HTTP 200, all Compose health checks passed, and the smoke-test stack was removed afterward.
- **Human Review Notes:** Approved
- **What AI Got Wrong:** Best Practice for Dockerfiles
- **Verdict:** Accepted

---
## Session: 2026-08-01 22:25 — playwright-ci: Publish after passed or failed CI tests

- **AI Tool:** OpenAI Codex (GPT-5)
- **Bloom-AI Level:** G9.2 (Apply) + G9.3 (Analyse)
- **Task:** Change the GHCR Deploy workflow to publish the three service images after the CI workflow completes with either a successful or failed test result.
- **Prompt:**
  > File deploy.yml, mình muốn test nó hoạt động ra sao sau khi xong step test, cho nên mình muốn logic là deploy sẽ chạy sau khi thành công CI (Kể cả pass và fail)
- **Supporting Playwright Skills:** `playwright-ci` (`ci-github-actions.md`)
- **AI Output Summary:** Updated `.github/workflows/deploy.yml` so its `workflow_run` job accepts both `success` and `failure` conclusions from the HW4 Playwright CI workflow on the repository default branch, while excluding pull requests, forks, cancelled, skipped, and timed-out runs. Removed the failed-test dry-run gate, made all three matrix builds push to GHCR, surfaced the upstream CI conclusion in logs and job summaries, and retained manual dispatch. YAML parsing and whitespace validation passed. No remote workflow was triggered and no image was pushed during local validation.
- **Human Review Notes:** Approved. This is human's purpose to demonstrate why testing is important, especially for CI/CD pipelines. The workflow has been updated to run the deploy phase after both successful and failed CI runs, ensuring that the deployment process is tested under all conditions.
- **What AI Got Wrong:** Nothing wrong
- **Verdict:** Accepted. The workflow has been successfully updated to run the deploy phase after both successful and failed CI runs, ensuring that the deployment process is tested under all conditions. Further review may be needed to ensure that all Playwright skills are correctly referenced and functional within the new structure.

---

# FR-06 AI Audit

Source: `Pool-A_FR06/FR06-AI-Audit.md`

## Session: 2026-07-31 09:04 — automation-script-gen: Generate FR-06 browser UI suite

- **AI Tool:** OpenAI Codex (GPT-5)
- **Bloom-AI Level:** G9.2 (Apply) + G9.3 (Analyse)
- **Task:** Generate the data-driven FR-06 Playwright suite from the complete HW2 test-case, bug, and SRS sources under the browser-UI-only scope.
- **Prompt:**
  > /hw4-generate FR-06
- **Supporting Playwright Skills:** `playwright-core` (`test-architecture.md`, `test-data-management.md`, `locators.md`, `assertions-and-waiting.md`, `fixtures-and-hooks.md`, `authentication.md`, `react.md`, `forms-and-validation.md`, `error-and-edge-cases.md`); `playwright-pom` (`page-object-model.md`, `pom-vs-fixtures-vs-helpers.md`)
- **AI Output Summary:** Generated 22 traceable FR-06 UI tests with external JSON data, expanded the BasePage-derived FR-06 page class using current React-source locators, documented nine API-only exclusions and five source discrepancies, and created the generation review. `playwright-cli` was unavailable, so permitted React-source inspection was used. JSON validation and TypeScript checking passed; Playwright listed 66 project-test combinations across Chromium, Firefox, and WebKit; prohibited-pattern scans and whitespace checks passed. No browser suite was executed at F1.
- **Human Review Notes:** Approved Agent Test Suite
- **What AI Got Wrong:** No Wrong
- **Verdict:** Accepted
---
## Session: 2026-07-31 09:36 — script-review: Review and correct FR-06 suite

- **AI Tool:** OpenAI Codex (GPT-5)
- **Bloom-AI Level:** G9.3 (Analyse) + G9.2 (Apply)
- **Task:** Review and correct the generated FR-06 spec, external data, page object, traceability, isolation, assertions, and browser-UI-only scope before browser execution.
- **Prompt:**
  > /hw4-review FR-06
- **Supporting Playwright Skills:** `playwright-core` (`locator-strategy.md`, `assertions-and-waiting.md`, `fixtures-and-hooks.md`, `flaky-tests.md`, `common-pitfalls.md`, `test-organization.md`); `playwright-pom` (`page-object-model.md`, `pom-vs-fixtures-vs-helpers.md`)
- **AI Output Summary:** Verified 22 exact HW2 UI TC IDs/titles and 12 selected known-bug mappings, retained nine explicit API-only exclusions, and corrected eight review findings. Replaced one-time conditional checks with web-first alternative locators, removed a buggy first-click workaround, replaced product CSS locators with semantic locators, corrected the Vietnamese-language assertion, scoped cart totals, added known-bug annotations, and completed EP-004 total coverage. Updated the automation review with findings, UI replacement IDs, expected failures, assertion inventory, architecture assessment, and pending HITL sign-off. `playwright-cli` was unavailable, so permitted React-source inspection was used. JSON, TypeScript, 66-test discovery, prohibited-pattern, mapping, and whitespace checks passed; no browser suite was executed.
- **Human Review Notes:** Approved the AI corrections and improvements. The suite is now ready for execution and further review.
- **What AI Got Wrong:** No significant issues were found in the AI review; all corrections were appropriate and improved the suite.
- **Verdict:** Accepted
---
## Session: 2026-07-31 10:01 — playwright-ci: Capture FR-06 three-browser evidence

- **AI Tool:** OpenAI Codex (GPT-5)
- **Bloom-AI Level:** G9.2 (Apply) + G9.3 (Analyse)
- **Task:** Execute the reviewed FR-06 browser UI suite locally in Chromium, Firefox, and WebKit; preserve separate HTML, JSON, trace, screenshot, video, and error-context evidence; and validate the evidence gate without classifying failures.
- **Prompt:**
  > /hw4-run FR-06
- **Supporting Playwright Skills:** `playwright-ci` (`projects-and-dependencies.md`, `reporting-and-artifacts.md`); `playwright-core` (`debugging.md`, `trace-analysis.md`, `error-index.md`)
- **AI Output Summary:** Started the required local EShop services, executed all 22 reviewed FR-06 UI tests sequentially in each configured browser, and generated three isolated HTML reports plus three JSON result files. Chromium, Firefox, and WebKit each recorded 7 passed, 15 failed, 0 skipped, and 0 flaky tests (66 executions total). Failure identities matched across all browsers. Evidence validation confirmed 45 traces, 45 screenshots, 45 error-context files, 12 retained videos, and rendered report titles showing `EShop HW04 Automation — Run by: 23127379`. The aggregate runner exited nonzero because genuine assertions failed; all three runs and their reports completed. `playwright-cli` was unavailable, so standard `@playwright/test` execution and retained artifacts were used. Failure-to-bug classification was intentionally deferred to `/hw4-bugs FR-06`.
- **Human Review Notes:** Approved
- **What AI Got Wrong:** Test suite execution and evidence capture were successful; no significant issues were found. The evidence is ready for classification and further analysis.
- **Verdict:** Accepted
---
## Session: 2026-07-31 11:31 — bug-report-automation: Classify FR-06 browser failures

- **AI Tool:** OpenAI Codex (GPT-5)
- **Bloom-AI Level:** G9.3 (Analyse) + G9.2 (Apply)
- **Task:** Classify every failed FR-06 TC/browser result against retained evidence and canonical HW2/SRS sources, write the detailed per-FR report, update the consolidated bug summary and automation review, and draft new GitHub Issue content without creating an external issue.
- **Prompt:**
  > /hw4-bugs FR-06
- **Supporting Playwright Skills:** `playwright-core` (`debugging.md`, `trace-analysis.md`, `error-index.md`); `playwright-ci` (`reporting-and-artifacts.md`)
- **AI Output Summary:** Classified all 45 failed TC/browser results from Run #1. Confirmed eight distinct product defects: seven canonical HW2 defects reproduced by 21 results and new `BUG-FR06-AUTO-001` reproduced by 24 results across Chromium, Firefox, and WebKit. Recorded one secondary WebKit focus-portability test issue and zero out-of-scope failure results. Avoided falsely confirming BUG-FR06-002, BUG-FR06-005, and BUG-FR06-009 because their tests stopped earlier at the new first-click defect; BUG-FR06-006's UI test passed. Replaced the FR detail placeholder with a 45-row matrix, complete defect evidence, and a ready-to-paste issue draft; updated root `bug_report.md` and the automation review. Standard Playwright trace CLI, JSON, error contexts, screenshots, reports, source, HW2, and SRS were used; standalone `playwright-cli` was unavailable. Local-link, row-count, stale-placeholder, and whitespace validation passed. No GitHub issue was created.
- **Human Review Notes:** Approved
- **What AI Got Wrong:** Test suite execution and evidence capture were successful; no significant issues were found. The evidence is ready for classification and further analysis.
- **Verdict:** Accepted

---

# FR-08 AI Audit

Source: `Pool-B_FR08/FR08-AI-Audit.md`

## Session: 2026-07-31 14:02 — automation-script-gen: Generate FR-08 browser UI suite

- **AI Tool:** OpenAI Codex (GPT-5)
- **Bloom-AI Level:** G9.2 (Apply) + G9.3 (Analyse)
- **Task:** Generate the data-driven FR-08 Playwright suite from the complete HW2 test-case, bug, shared SRS, and HW04 assignment sources under the browser-UI-only scope.
- **Prompt:**
  > /hw4-generate FR-08
- **Supporting Playwright Skills:** `playwright-core` (`test-architecture.md`, `test-data-management.md`, `locators.md`, `assertions-and-waiting.md`, `fixtures-and-hooks.md`, `authentication.md`, `react.md`, `forms-and-validation.md`, `error-and-edge-cases.md`); `playwright-pom` (`pom-vs-fixtures-vs-helpers.md`)
- **AI Output Summary:** Generated 14 traceable FR-08 browser UI tests with external JSON data, expanded only the BasePage-derived FR-08 page class using current React-source locators, documented three API-only exclusions, hybrid clauses, and five source discrepancies, and created the generation review. `playwright-cli` was unavailable, so permitted React-source inspection was used. JSON and boundary-length validation, exact HW2 ID/title comparison, TypeScript checking, prohibited-pattern scanning, and whitespace checking passed; Playwright listed 42 project-test combinations across Chromium, Firefox, and WebKit. No browser suite was executed at F1.
- **Human Review Notes:** About testcases involves Shipping Address atributes, we need to traverse to Profile page to update it, other testcases are corrected.
- **What AI Got Wrong:** A.I is not wrong but they aren't known about the shipping address, they just based on SRS and testcases, so they didn't know about the shipping address, so they didn't traverse to profile page to update it.
- **Verdict:** Accepted with minor corrections. The AI-generated suite is valid, but the Shipping Address test cases need to be updated to include navigation to the Profile page for address updates.
---
## Session: 2026-07-31 14:21 — script-review: Review and correct FR-08 browser UI suite

- **AI Tool:** OpenAI Codex (GPT-5)
- **Bloom-AI Level:** G9.3 (Analyse) + G9.4 (Collaborate)
- **Task:** Review and correct the FR-08 Playwright spec, external test data, BasePage-derived page object, shared-fixture usage, canonical traceability, browser-UI-only scope, isolation, and reliability; stop before browser execution.
- **Prompt:**
  > /hw4-review FR-08
- **Supporting Playwright Skills:** `playwright-core` (`locator-strategy.md`, `assertions-and-waiting.md`, `fixtures-and-hooks.md`, `flaky-tests.md`, `common-pitfalls.md`, `test-organization.md`); `playwright-pom` (`page-object-model.md`, `pom-vs-fixtures-vs-helpers.md`)
- **AI Output Summary:** Corrected the 14-case FR-08 suite to apply the accepted HITL Profile-address workflow through browser UI, strengthened exact item/total/non-editability assertions, repaired native-dialog sequencing, replaced brittle structural position/heading/illustration locators, restricted report annotations to UI-observable Bug IDs, and completed `fr08-automation-review.md` with findings, exclusions, discrepancies, expected failures, and architecture assessment. `playwright-cli` was unavailable, so permitted React-source inspection was used. JSON parsing, exact HW2 ID/title and boundary-length validation, TypeScript checking, prohibited-pattern scans, whitespace checking, and Playwright discovery of 42 project-test combinations passed. No browser suite was executed at F2.
- **Human Review Notes:** Approved
- **What AI Got Wrong:** Script is corrected, ready to run script test
- **Verdict:** Accepted
---
## Session: 2026-07-31 14:55 — playwright-ci: Run FR-08 three-browser evidence gate

- **AI Tool:** OpenAI Codex (GPT-5)
- **Bloom-AI Level:** G9.2 (Apply) + G9.3 (Analyse)
- **Task:** Execute the reviewed FR-08 browser UI suite through the local evidence runner for Chromium, Firefox, and WebKit; retain isolated reports, JSON results, screenshots, traces, error contexts, and the cumulative run summary; stop before failure classification.
- **Prompt:**
  > /hw4-run FR-08
- **Supporting Playwright Skills:** `playwright-ci` (`projects-and-dependencies.md`, `reporting-and-artifacts.md`); `playwright-core` (`debugging.md`, `trace-analysis.md`, `error-index.md`)
- **AI Output Summary:** The initial sandboxed runner invocation was prevented from starting the configured local web servers and was transparently preserved as Run #1 with zero executed tests. The approved rerun completed as Run #2: Chromium, Firefox, and WebKit each reported 1 passed and 13 failed out of 14, for 3 passed and 39 failed across 42 browser executions. All 39 failures retained a trace, screenshot, and error context. Evidence inspection found 36 failures at the reviewed Profile phone-field locator and three failures for the missing empty-cart illustration; the unauthenticated-protection case passed in every browser. The runner updated `fr08-run-summary.md` and generated the full overview plus three isolated HTML reports displaying student ID 23127379. `playwright-cli` was unavailable, so standard Playwright JSON, HTML, trace, screenshot, and error-context artifacts were used. No spec correction or bug classification was performed at F3.
- **Human Review Notes:** Approved test suite script
- **What AI Got Wrong:** But 12 testcases failed due to the locator issue, i guess it's not our fault for it, maybe because SUT's responsibility about the locator. But I think the another problem about changing profile in 12 testcases they all fill in phone number, but why the best pratice locator failed, need to review
- **Verdict:** Partially Accepted. The test suite script is approved, but the failures due to locator issues need further investigation and potential collaboration with the SUT team to resolve.
---
## Session: 2026-07-31 15:17 — bug-report-automation: Classify FR-08 browser failures

- **AI Tool:** OpenAI Codex (GPT-5)
- **Bloom-AI Level:** G9.3 (Analyse) + G9.4 (Collaborate)
- **Task:** Classify every failed FR-08 Run #2 TC/browser result against retained Playwright evidence and canonical HW2/SRS sources, create the detailed FR report and GitHub Issue draft, update the consolidated summary and automation review, and re-check the FR completion gate.
- **Prompt:**
  > /hw4-bugs FR-08
- **Supporting Playwright Skills:** `playwright-core` (`debugging.md`, `trace-analysis.md`, `error-index.md`); `playwright-ci` (`reporting-and-artifacts.md`)
- **AI Output Summary:** Classified all 39 failed Run #2 results with one matrix row per TC/browser and verified every local evidence link. Three TC-FR08-NEG-003 results confirm new Cosmetic defect `BUG-FR08-AUTO-001`, the missing required empty-cart illustration, and include a ready-to-paste GitHub Issue draft. The other 36 results are `TEST-FR08-001`: 12 address-bearing TCs in all browsers stop during Profile setup because `getByLabel('Số điện thoại')` cannot resolve the unassociated label/input markup, so no mapped HW2 Checkout defect is falsely claimed as reproduced. Updated `fr08-bug-report.md`, `fr08-automation-review.md`, and root `bug_report.md`; retained all screenshots, traces, error contexts, JSON, and HTML reports. `playwright-cli` was unavailable, so standard Playwright terminal trace analysis, DOM snapshots, JSON, screenshots, and React source were used. FR-08 remains incomplete; after this classification session receives HITL sign-off, it returns to `/hw4-review FR-08` for locator correction and a fresh evidence cycle.
- **Human Review Notes:** Approved
- **What AI Got Wrong:** Nothing wrong
- **Verdict:** Accepted
---
## Session: 2026-07-31 15:37 — script-review: Correct FR-08 Profile locators after Run #2

- **AI Tool:** OpenAI Codex (GPT-5)
- **Bloom-AI Level:** G9.3 (Analyse) + G9.4 (Collaborate)
- **Task:** Re-review and correct the FR-08 Playwright suite after Run #2 isolated the shared Profile setup locator failure; preserve canonical expectations, browser-UI-only scope, data-driven inputs, isolation, and the BasePage-derived POM architecture; stop before browser execution.
- **Prompt:**
  > /hw4-review FR-08
- **Supporting Playwright Skills:** `playwright-core` (`locator-strategy.md`, `assertions-and-waiting.md`, `fixtures-and-hooks.md`, `flaky-tests.md`, `common-pitfalls.md`, `test-organization.md`); `playwright-pom` (`page-object-model.md`, `pom-vs-fixtures-vs-helpers.md`)
- **AI Output Summary:** Corrected `TEST-FR08-001` without weakening assertions, adding waits, or skipping tests: Run #2 trace DOM and React source confirmed that the Profile labels have no `htmlFor` association and their controls have no matching accessible name, so the FR-08 page object now resolves the phone input and shipping-address textarea through their exact, unique placeholders supplied by the external JSON data. Updated the spec, test data, page object, and automation review while leaving shared infrastructure unchanged. `playwright-cli` was unavailable, so retained Playwright trace evidence and React source were used. JSON parsing, source-placeholder uniqueness, exact comparison of 14 HW2 ID/title pairs, boundary-length validation, TypeScript checking, prohibited-pattern scanning, whitespace checking, six assertion-pattern verification, and Playwright discovery of 42 project-test combinations passed. No browser suite was executed at F2.
- **Human Review Notes:** Approved
- **What AI Got Wrong:** Human and A.I agreed on the correction of the Profile locators, and the script is ready for re-execution.
- **Verdict:** Accepted
---
## Session: 2026-07-31 15:50 — playwright-ci: Run FR-08 three-browser evidence cycle #3

- **AI Tool:** OpenAI Codex (GPT-5)
- **Bloom-AI Level:** G9.2 (Apply) + G9.3 (Analyse)
- **Task:** Execute the corrected FR-08 browser UI suite through the local evidence runner for Chromium, Firefox, and WebKit; retain isolated reports, JSON results, screenshots, traces, error contexts, and the cumulative run summary; stop before failure classification.
- **Prompt:**
  > /hw4-run FR-08
- **Supporting Playwright Skills:** `playwright-ci` (`projects-and-dependencies.md`, `reporting-and-artifacts.md`); `playwright-core` (`debugging.md`, `trace-analysis.md`, `error-index.md`)
- **AI Output Summary:** Completed tracked Run #3 through the dedicated FR-08 runner. Chromium, Firefox, and WebKit each reported 1 passed and 13 failed out of 14, for 3 passed and 39 failed across 42 browser executions; counts and durations were verified directly from the three Playwright JSON reports. All 39 failures retained a trace, screenshot, and error context. Run-level evidence confirms the corrected Profile phone locator no longer fails: 36 results now reach the checkout precondition and fail because the expected `iPhone 15 Pro Max` cart row count is 0 rather than 1, while three results retain the missing empty-cart illustration failure; unauthenticated checkout protection passes in every browser. The runner appended Run #3 to `fr08-run-summary.md` and regenerated the full overview plus isolated Chromium, Firefox, and WebKit HTML reports with student ID 23127379 in report metadata/title. `playwright-cli` was unavailable, so standard Playwright JSON, HTML, trace, screenshot, and error-context artifacts were used. No spec correction or failure classification was performed at F3.
- **Human Review Notes:** Testcases fail because there is a gap, Agent thought the product is in the cart, but the product is not in the cart, so the testcases fail. Need to review the SUT and testcases.
- **What AI Got Wrong:** The AI correctly executed the test suite, but the failures are due to a gap between the expected cart state and the actual SUT behavior. The AI did not account for the possibility that the product may not be present in the cart, leading to failed assertions. Further investigation into the SUT and test cases is required to resolve this discrepancy. Hint for Agent: When play script, did you see why the database.sqlite always in stage area, because when you run the script again, the backend will reset to its inital state, so the product is not in the cart which leads to the testcases fail. So we need to review the SUT and testcases to ensure that the expected cart state aligns with the actual behavior of the application.
- **Verdict:** Partially Accepted. The test suite execution is valid, but the failures indicate a need for review of the SUT and test cases to ensure that the expected cart state aligns with the actual behavior of the application.
---
## Session: 2026-07-31 16:13 — bug-report-automation: Classify FR-08 Run #3 browser failures

- **AI Tool:** OpenAI Codex (GPT-5)
- **Bloom-AI Level:** G9.3 (Analyse) + G9.4 (Collaborate)
- **Task:** Classify every failed FR-08 Run #3 TC/browser result against retained Playwright evidence and canonical HW2/SRS sources, update the detailed FR report and GitHub Issue draft, update the consolidated summary and automation review, and re-check the FR completion gate.
- **Prompt:**
  > /hw4-bugs FR-08
- **Supporting Playwright Skills:** `playwright-core` (`debugging.md`, `trace-analysis.md`, `error-index.md`); `playwright-ci` (`reporting-and-artifacts.md`)
- **AI Output Summary:** Classified all 39 failed Run #3 results with one matrix row per TC/browser and verified all 139 local report links. Three TC-FR08-NEG-003 results reconfirm new Cosmetic defect `BUG-FR08-AUTO-001`, the missing required empty-cart illustration. The other 36 results are new test setup/isolation issue `TEST-FR08-002`: retained traces prove that each test successfully adds the product and updates Profile through the corrected locators, but the spec then calls `page.reload()`, which remounts the SUT's in-memory `CartProvider` and clears the cart before the Checkout precondition. The former `TEST-FR08-001` locator failure appears zero times in Run #3 and is resolved. No mapped HW2 Checkout defect or out-of-scope API failure is claimed. Updated `fr08-bug-report.md`, `fr08-automation-review.md`, and root `bug_report.md`; retained the ready-to-paste GitHub Issue draft without creating an external issue. `playwright-cli` was unavailable, so direct Playwright trace-archive, error-context, screenshot, JSON/HTML, and React-source evidence was used. FR-08 remains incomplete; this classification requires HITL sign-off before returning to `/hw4-review FR-08`.
- **Human Review Notes:** Approved
- **What AI Got Wrong:** Human and A.i agreed on the classification of the Run #3 failures, and the script is ready for further review and potential correction, nothing wrong
- **Verdict:** Accepted
---
## Session: 2026-07-31 16:23 — script-review: Correct FR-08 cart lifecycle after Run #3

- **AI Tool:** OpenAI Codex (GPT-5)
- **Bloom-AI Level:** G9.3 (Analyse) + G9.4 (Collaborate)
- **Task:** Re-review and correct the FR-08 browser UI suite after Run #3 proved that the Profile reload cleared the test's in-memory cart precondition; preserve Profile persistence verification, UI-only setup/cleanup, canonical expectations, external data, isolation, and the BasePage-derived POM architecture; stop before browser execution.
- **Prompt:**
  > /hw4-review FR-08
- **Supporting Playwright Skills:** `playwright-core` (`locator-strategy.md`, `assertions-and-waiting.md`, `fixtures-and-hooks.md`, `flaky-tests.md`, `common-pitfalls.md`, `test-organization.md`); `playwright-pom` (`pom-vs-fixtures-vs-helpers.md`)
- **AI Output Summary:** Corrected `TEST-FR08-002` by reordering only the FR-local browser workflow: each address-bearing test now updates Profile, reloads and verifies the persisted external address, then adds `iPhone 15 Pro Max` through the UI before asserting the cart row/total and entering Checkout. Run #3 traces and `CartContext.jsx` prove that the former `beforeEach` product setup succeeded and was later erased when `page.reload()` remounted the in-memory `CartProvider`; the database reset does not explain that within-test state transition. Preserved all cart and Checkout assertions, external JSON, corrected Profile locators, UI-only cleanup, shared fixtures, and the BasePage-derived page object; no timeout, retry, skip, storage manipulation, API action, or weakened expectation was introduced. Updated `fr08.spec.ts`, `fr08-automation-review.md`, and the consolidated FR-08 status in `bug_report.md`; no page object, fixture, or test-data change was needed. `playwright-cli` was unavailable, so retained Playwright evidence and React source were used. JSON and boundary validation, exact comparison of 14 selected HW2 ID/title pairs, TypeScript checking, prohibited-pattern scanning, whitespace checking, nine assertion-pattern checks, and Playwright discovery of 42 project-test combinations passed. No browser suite was executed at F2.
- **Human Review Notes:** Approved
- **What AI Got Wrong:** Human and A.I agreed on the correction of the cart lifecycle issue, and the script is ready for re-execution after third time
- **Verdict:** Accepted
---
## Session: 2026-07-31 20:50 — playwright-ci: Run FR-08 three-browser evidence cycle #4

- **AI Tool:** OpenAI Codex (GPT-5)
- **Bloom-AI Level:** G9.2 (Apply) + G9.3 (Analyse)
- **Task:** Execute the HITL-accepted FR-08 cart-lifecycle correction through the dedicated local evidence runner for Chromium, Firefox, and WebKit; retain isolated JSON/HTML reports, screenshots, traces, error contexts, and one new cumulative run-summary session; stop before failure classification.
- **Prompt:**
  > /hw4-run FR-08
- **Supporting Playwright Skills:** `playwright-ci` (`projects-and-dependencies.md`, `reporting-and-artifacts.md`); `playwright-core` (`debugging.md`, `trace-analysis.md`, `error-index.md`)
- **AI Output Summary:** Completed tracked Run #4 through the dedicated FR-08 runner. Chromium, Firefox, and WebKit each reported 1 passed and 13 failed out of 14, for 3 passed and 39 failed across 42 browser executions; counts and durations (167.6s, 194.4s, and 177.9s) were verified directly from the three current Playwright JSON reports. All 39 failures retained a trace, screenshot, and error context. Evidence confirms that the Run #3 cart-precondition failure is no longer present: all address-bearing cases now pass Profile persistence, product addition, cart-row/total checks, and Checkout navigation before reaching distinct spec-correct feature assertions. The runner appended Run #4 to `fr08-run-summary.md` and regenerated the full overview plus isolated Chromium, Firefox, and WebKit HTML reports with student ID 23127379 configured in report metadata/title. `playwright-cli` was unavailable, so standard Playwright JSON, HTML, trace, screenshot, and error-context artifacts were used. No spec correction or failure classification was performed at F3.
- **Human Review Notes:** Approved
- **What AI Got Wrong:** Nothing Wrong after third correction according our analysis why test suites have the same issues
- **Verdict:** Accepted
---
## Session: 2026-07-31 21:12 — bug-report-automation: Classify FR-08 Run #4 browser failures

- **AI Tool:** OpenAI Codex (GPT-5)
- **Bloom-AI Level:** G9.3 (Analyse) + G9.4 (Collaborate)
- **Task:** Classify every failed FR-08 Run #4 TC/browser result against retained Playwright evidence and canonical HW2/SRS sources, update the detailed FR report and GitHub Issue drafts, update the consolidated summary and automation review, and re-check the FR completion gate.
- **Prompt:**
  > /hw4-bugs FR-08
- **Supporting Playwright Skills:** `playwright-core` (`debugging.md`, `trace-analysis.md`, `error-index.md`); `playwright-ci` (`reporting-and-artifacts.md`)
- **AI Output Summary:** Classified all 39 failed Run #4 results with one matrix row per TC/browser and verified every local evidence link. Thirty-six rows are genuine product-defect results: 30 primary rows reproduce known HW2 defects and six reproduce two new cross-browser defects, `BUG-FR08-AUTO-001` (missing empty-cart illustration) and `BUG-FR08-AUTO-002` (directly editable Checkout total); known action-colour defect `BUG-FR08-002` is additionally visible as a secondary EP-001 observation without increasing the failed-result count. The remaining three EP-001 rows are `TEST-FR08-003`: the exact item text is visibly correct, but the test incorrectly requires a native `listitem` to derive an accessible name from descendant text. Confirmed that prior `TEST-FR08-001` and `TEST-FR08-002` are resolved and that no failure is API-only or out of scope. Updated `fr08-bug-report.md`, `fr08-automation-review.md`, and root `bug_report.md`; retained ready-to-paste drafts for both new defects without creating external issues. `playwright-cli` was unavailable, so retained Playwright JSON, screenshots, traces, error contexts, and React source were used. FR-08 remains incomplete; after this session receives HITL sign-off, it returns to `/hw4-review FR-08` for the focused locator correction.
- **Human Review Notes:** Approved
- **What AI Got Wrong:** Nothing wrong
- **Verdict:** Accepted
---
## Session: 2026-07-31 21:20 — script-review: Correct FR-08 list-item locator after Run #4

- **AI Tool:** OpenAI Codex (GPT-5)
- **Bloom-AI Level:** G9.3 (Analyse) + G9.4 (Collaborate)
- **Task:** Re-review and correct the FR-08 browser UI suite after Run #4 isolated an invalid accessible-name assumption in the EP-001 Checkout item locator; preserve external test data, the exact item-content expectation, all later known-defect assertions, UI-only isolation, and the existing fixture/POM architecture; stop before browser execution.
- **Prompt:**
  > /hw4-review FR-08
- **Supporting Playwright Skills:** `playwright-core` (`locator-strategy.md`, `assertions-and-waiting.md`, `fixtures-and-hooks.md`, `flaky-tests.md`, `common-pitfalls.md`, `test-organization.md`); `playwright-pom` (`page-object-model.md`, `pom-vs-fixtures-vs-helpers.md`)
- **AI Output Summary:** Corrected `TEST-FR08-003` without weakening the product-content check: retained Run #4 evidence and `Checkout.jsx` confirm the exact item content is rendered inside a native `li`, but `listitem` does not receive an accessible name from descendant text. The BasePage-derived Checkout page object now filters semantic list items with the externally supplied descendant text, and EP-001 asserts the complete normalized external value using `toHaveText` instead of visibility alone. Preserved all heading, action-colour, total, success, cart-clear, known-bug, data-driven, UI-only setup/cleanup, fixture, and isolation behavior; no test data or shared infrastructure changed. Updated `fr08.spec.ts`, `pages/checkout.page.ts`, `fr08-automation-review.md`, the Run #4 report status, and the consolidated workflow status. `playwright-cli` was unavailable, so retained Playwright evidence and React source were used. JSON parsing, 14 unique TC and boundary-length checks, exact HW2 ID/title comparison, TypeScript checking, prohibited-pattern scanning, eight assertion-pattern checks, whitespace validation, and Playwright discovery of 42 project-test combinations passed. No browser suite was executed at F2.
- **Human Review Notes:** Approved
- **What AI Got Wrong:** Nothing Wrong
- **Verdict:** Accepted
---
## Session: 2026-08-01 11:16 — playwright-ci: Run FR-08 three-browser evidence cycle #6

- **AI Tool:** OpenAI Codex (GPT-5)
- **Bloom-AI Level:** G9.2 (Apply) + G9.3 (Analyse)
- **Task:** Execute the HITL-accepted FR-08 item-locator correction through the dedicated local evidence runner for Chromium, Firefox, and WebKit; retain isolated JSON/HTML reports, screenshots, traces, error contexts, and every cumulative run-summary attempt; stop before failure classification.
- **Prompt:**
  > /hw4-run FR-08
- **Supporting Playwright Skills:** `playwright-ci` (`projects-and-dependencies.md`, `reporting-and-artifacts.md`); `playwright-core` (`debugging.md`, `trace-analysis.md`, `error-index.md`)
- **AI Output Summary:** The sandboxed runner attempt was blocked during Chromium launch in global setup by macOS Mach-port permission and correctly appended infrastructure-only tracked Run #5 with 0 executions for each browser. Retried the same required command with browser-launch permission, preserving rather than hiding Run #5, and completed tracked Run #6. Chromium, Firefox, and WebKit each reported 1 passed and 13 failed out of 14, for 3 passed and 39 failed across 42 executions; JSON-reporter durations were 185.8s, 213.4s, and 199.2s. All 39 failures retained browser-isolated screenshots, traces, and error contexts; all three isolated HTML reports and the full Run #6 overview exist with student ID 23127379. The former named-`listitem` locator failure appears zero times: EP-001 reaches its downstream spec-correct heading, action-colour, and cart-clear assertions in every browser. The runner appended both attempts to `fr08-run-summary.md`; updated the automation-review, detailed-report status, and consolidated workflow status. `playwright-cli` was unavailable, so standard Playwright JSON, HTML, screenshot, trace, and error-context evidence was used. No spec correction, failure classification, or remote CI change was performed at F3.
- **Human Review Notes:** Approved
- **What AI Got Wrong:** Nothing Wrong
- **Verdict:** Accepted
---
## Session: 2026-08-01 11:30 — bug-report-automation: Classify FR-08 Run #6 browser failures

- **AI Tool:** OpenAI Codex (GPT-5)
- **Bloom-AI Level:** G9.3 (Analyse) + G9.4 (Collaborate)
- **Task:** Classify every failed FR-08 Run #6 TC/browser result against retained Playwright evidence and canonical HW2/SRS sources, update the detailed FR report and GitHub Issue drafts, update the consolidated summary and automation review, and re-check the FR completion gate.
- **Prompt:**
  > /hw4-bugs FR-08
- **Supporting Playwright Skills:** `playwright-core` (`debugging.md`, `trace-analysis.md`, `error-index.md`); `playwright-ci` (`reporting-and-artifacts.md`)
- **AI Output Summary:** Classified all 39 failed Run #6 results with one matrix row per TC/browser. All 39 are genuine product-defect results: 33 reproduce six known HW2 defects (`BUG-FR08-001`, `002`, `003`, `005`, `006`, and `009`) and six reproduce two new cross-browser defects (`BUG-FR08-AUTO-001` and `AUTO-002`). The corrected EP-001 exact-item assertion passes before each browser records the missing heading, incorrect action colour, and retained cart, so former `TEST-FR08-003` appears zero times; `TEST-FR08-001` and `TEST-FR08-002` also remain resolved. Verified that no Run #6 failure is a test/infrastructure issue or out-of-scope API failure. Updated `fr08-bug-report.md`, `fr08-automation-review.md`, and root `bug_report.md`; retained ready-to-paste GitHub Issue drafts without creating external issues. `playwright-cli` remained unavailable, so current Playwright JSON, screenshots, traces, error contexts, HTML reports, and React source were used. FR-08 awaits HITL sign-off of this classification before its completion gate is re-checked.
- **Human Review Notes:** Approved
- **What AI Got Wrong:** Nothing wrong
- **Verdict:** Accepted

---

# FR-15 AI Audit

Source: `Pool-C_FR15/FR15-AI-Audit.md`

## Session: 2026-08-01 16:50 — automation-script-gen: Generate FR-15 browser UI suite

- **AI Tool:** Codex (GPT-5)
- **Bloom-AI Level:** G9.2 (Apply) / G9.3 (Analyse) / G9.4 (Collaborate)
- **Task:** Generate the current FR-15 data-driven, browser-UI-only Playwright suite, external traceability/test data, and ProductManagementPage updates; validate without executing browser evidence.
- **Prompt:**
  > /hw4-generate FR-15
- **Supporting Playwright Skills:** `playwright-core` — `test-architecture.md`, `test-data-management.md`, `locators.md`, `assertions-and-waiting.md`, `fixtures-and-hooks.md`, `authentication.md`, `react.md`, `forms-and-validation.md`, `error-and-edge-cases.md`, `crud-testing.md`; `playwright-pom` — `page-object-model.md`, `pom-vs-fixtures-vs-helpers.md`. `playwright-cli` was unavailable, so React source inspection was used as the locator fallback.
- **AI Output Summary:** Created `fr15.spec.ts` and `fr15-test-data.json` with 19 selected UI test cases, 21 API-scope exclusions, hybrid-clause limitations, and source discrepancies; updated `product-management.page.ts`; JSON parsing, TypeScript compilation, static policy checks, and Playwright discovery passed with 57 project/test instances. No browser evidence run was performed.
- **Human Review Notes:** Approved
- **What AI Got Wrong:** Nothing wrong
- **Verdict:** Accepted

## Session: 2026-08-01 17:10 — script-review: Review and correct FR-15 automation

- **AI Tool:** Codex (GPT-5)
- **Bloom-AI Level:** G9.2 (Apply) / G9.3 (Analyse) / G9.4 (Collaborate)
- **Task:** Review and correct the FR-15 browser-UI-only Playwright spec, external data, shared fixture usage, and ProductManagementPage against the complete HW2 sources and verified React source; create the automation review and validate without browser execution.
- **Prompt:**
  > ```
  > /hw4-review FR-15
  > ```
- **Supporting Playwright Skills:** `playwright-core` — `locator-strategy.md`, `assertions-and-waiting.md`, `fixtures-and-hooks.md`, `flaky-tests.md`, `common-pitfalls.md`, `test-organization.md`; `playwright-pom` — `pom-vs-fixtures-vs-helpers.md`. `playwright-cli` was unavailable, so `frontend-admin/src/App.jsx` and standard Playwright discovery were used as the verification fallback.
- **AI Output Summary:** Corrected canonical Bug ID mappings, moved unsafe EP-003 to a documented manual-only blocker, added seven eligible BVA cases, corrected tab-order and omitted UI assertions, tightened semantic locators/POM methods, and created `fr15-automation-review.md`. JSON/manifest validation, TypeScript compilation, prohibited-pattern scans, and Playwright discovery passed with 25 tests per browser and 75 project/test instances. No browser evidence run was performed.
- **Human Review Notes:** Approved
- **What AI Got Wrong:** Nothing Wrong
- **Verdict:** Accepted

---
## Session: 2026-08-01 17:38 — playwright-ci: Run FR-15 three-browser evidence gate

- **AI Tool:** Codex (GPT-5)
- **Bloom-AI Level:** G9.2 (Apply) / G9.3 (Analyse) / G9.4 (Collaborate)
- **Task:** Execute the reviewed FR-15 suite through the repository runner for Chromium, Firefox, and WebKit; preserve JSON-derived counts, isolated reports, failure artifacts, the full-FR overview, and cumulative run history without classifying bugs.
- **Prompt:**
  > /hw4-run FR-15
- **Supporting Playwright Skills:** `playwright-ci` — `projects-and-dependencies.md`, `reporting-and-artifacts.md`; `playwright-core` — `debugging.md`, `trace-analysis.md`, `error-index.md`. `playwright-cli` was unavailable, so standard Playwright reports, JSON reporters, and retained traces were used.
- **AI Output Summary:** Recorded Run #1 with three zero-test infrastructure failures caused by sandbox port-binding denial, then completed approved Run #2 outside that restriction. Run #2 produced identical JSON counts for Chromium, Firefox, and WebKit: 1 passed, 24 failed, 0 flaky, 0 skipped, 25 total per browser. Generated three isolated HTML reports, the linked FR overview, 72 screenshots, 72 valid trace archives, 72 error-context files, and updated `fr15-run-summary.md` with both tracked sessions. No failure classification or bug report changes were made.
- **Human Review Notes:** Approved
- **What AI Got Wrong:** Nothing Wrong
- **Verdict:** Accepted

---
## Session: 2026-08-01 18:05 — bug-report-automation: Classify FR-15 browser failures

- **AI Tool:** Codex (GPT-5)
- **Bloom-AI Level:** G9.3 (Analyse) / G9.4 (Collaborate)
- **Task:** Classify every FR-15 Run #2 browser failure, create the detailed per-FR bug report and new-issue drafts, update the automation review and consolidated bug summary, and re-check the FR completion gate without creating external issues.
- **Prompt:**
  > ```
  > /hw4-bugs FR-15
  > ```
- **Supporting Playwright Skills:** `playwright-core` — `debugging.md`, `trace-analysis.md`, `error-index.md`; `playwright-ci` — `reporting-and-artifacts.md`.
- **AI Output Summary:** Classified all 72 failed TC/browser results from tracked Run #2: 57 genuine product failures covering 12 distinct defects (six known and six new), and 15 failures exclusively caused by two test/source issues. Created `fr15-bug-report.md` with exact per-result evidence, detailed defect records, and six GitHub Issue drafts marked pending HITL creation; updated `fr15-automation-review.md` and root `bug_report.md`. Validated 72 matrix rows, 228 local artifact/report links, and JSON counts of 1 passed/24 failed in each browser. No external issue was created and no browser suite was rerun.
- **Human Review Notes:** Approved
- **What AI Got Wrong:** Nothing Wrong
- **Verdict:** Accepted

