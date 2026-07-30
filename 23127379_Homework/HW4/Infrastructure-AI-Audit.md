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
- **Human Review Notes:** Pending HITL review
- **What AI Got Wrong:** Pending HITL review
- **Verdict:** Pending HITL review

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
- **Human Review Notes:** Pending HITL review
- **What AI Got Wrong:** Pending HITL review
- **Verdict:** Pending HITL review

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
- **Human Review Notes:** Pending HITL review
- **What AI Got Wrong:** Pending HITL review
- **Verdict:** Pending HITL review

---
## Session: 2026-07-30 23:41 — skill-creator: Add Playwright pack routing to the HW04 workflow

- **AI Tool:** OpenAI Codex (GPT-5)
- **Bloom-AI Level:** G9.4 (Collaborate)
- **Task:** Refine the repository skills and audit contract so the Playwright packs are invoked at explicit workflow gates.
- **Prompt:**
  > Mình muốn những mớ trong Folder Playwright cũng được sử dụng ở trong workflow của mình.
- **Supporting Playwright Skills:** `playwright-skill` routing policy
- **AI Output Summary:** Updated `AGENTS.md`, five HW04 business skills, and the audit logger so setup, generation, review, three-browser evidence, and failure classification each route to explicit Playwright skills/guides while preserving one audit per top-level invocation.
- **Human Review Notes:** Pending HITL review
- **What AI Got Wrong:** Pending HITL review
- **Verdict:** Pending HITL review

---
## Session: 2026-07-30 23:41 — playwright-skill: Activate core, CI, POM, CLI, and migration routing

- **AI Tool:** OpenAI Codex (GPT-5)
- **Bloom-AI Level:** G9.3 (Analyse) + G9.4 (Collaborate)
- **Task:** Make every relevant pack under `.agents/skills/Playwright/` operational in the sequential HW04 workflow.
- **Prompt:**
  > Mình muốn những mớ trong Folder Playwright cũng được sử dụng ở trong workflow của mình.
- **Supporting Playwright Skills:** `playwright-core` (`configuration`, `authentication`, architecture, locators, assertions, data, fixtures, React, debugging, trace analysis, error index); `playwright-ci` (projects, reports/artifacts, global setup/teardown); `playwright-pom` (POM vs fixtures vs helpers); `playwright-cli` (conditional availability gate); `playwright-migration` (conditional Cypress/Selenium gate)
- **AI Output Summary:** Added a mandatory per-gate routing table, made `playwright-ci` the audited three-browser evidence gate, made POM an explicit design decision, guarded CLI use by executable availability, and limited migration to real Cypress/Selenium work. YAML frontmatter, relative Markdown links, and whitespace validation passed; the official Python validator could not run because `PyYAML` is absent.
- **Human Review Notes:** Pending HITL review
- **What AI Got Wrong:** Pending HITL review
- **Verdict:** Pending HITL review

---
## Session: 2026-07-30 23:46 — skill-creator: Rename the Playwright skill folder

- **AI Tool:** OpenAI Codex (GPT-5)
- **Bloom-AI Level:** G9.2 (Apply)
- **Task:** Rename the repository Playwright skill folder to lowercase and update all active workflow references.
- **Prompt:**
  > đồng thời đổi tên folder là Playwright -> playwright
- **Supporting Playwright Skills:** `playwright-skill` folder structure and relative-link verification
- **AI Output Summary:** Renamed `.agents/skills/Playwright/` to `.agents/skills/playwright/`, updated `AGENTS.md` and the HW04 setup/generation/review/bug-report skill paths, and verified YAML frontmatter, relative Markdown links, Git rename detection, and whitespace.
- **Human Review Notes:** Pending HITL review
- **What AI Got Wrong:** Pending HITL review
- **Verdict:** Pending HITL review

---
## Session: 2026-07-30 23:51 — skill-creator: Restrict HW04 automation to browser UI testing

- **AI Tool:** OpenAI Codex (GPT-5)
- **Bloom-AI Level:** G9.3 (Analyse) + G9.4 (Collaborate)
- **Task:** Remove API testing from the HW04 workflow while preserving HW2 as the functional source of truth.
- **Prompt:**
  > Trong bài tập của mình thì sẽ không có API Testing nha, dù ở HW2 là mình có làm nhưng ở HW4 là không có test API Testing ở Automation
- **Supporting Playwright Skills:** `playwright-skill` workspace routing and browser-UI testing constraints
- **AI Output Summary:** Added a browser-UI-only scope rule to `AGENTS.md`; removed API guide routing and request/database allowances from generation, review, and bug classification; marked API-only HW2 TCs as out of HW4 scope; revised the FR-08 manifest to 12 UI TCs; clarified hybrid-TC handling; added prohibited action P-14; and replaced the API assertion example in `ai_critique.md` with UI assertions. Static inspection found no API-testing primitives in current HW4 TypeScript files.
- **Human Review Notes:** Pending HITL review
- **What AI Got Wrong:** Pending HITL review
- **Verdict:** Pending HITL review

---
## Session: 2026-07-30 23:54 — skill-creator: Consolidate user invocation guidance in AGENTS.md

- **AI Tool:** OpenAI Codex (GPT-5)
- **Bloom-AI Level:** G9.2 (Apply) + G9.4 (Collaborate)
- **Task:** Remove the obsolete root Gemini-specific workflow and document how users invoke every HW04 stage.
- **Prompt:**
  > File Gemini.md có thể bỏ được chưa, đồng thời ở file Agents.md hãy cho biết các giai đoạn được gọi như thế nào cho người dùng.
- **Supporting Playwright Skills:** None
- **AI Output Summary:** Verified that root `GEMINI.md` had no HW4 dependents and referenced obsolete skill paths, removed it while preserving `23127379_Homework/HW2/GEMINI.md`, and added copy-paste prompts plus prerequisites and stop points for G0, G1, F1–F5, and G2 in `AGENTS.md`.
- **Human Review Notes:** Pending HITL review
- **What AI Got Wrong:** Pending HITL review
- **Verdict:** Pending HITL review

---
## Session: 2026-07-30 23:57 — skill-creator: Add user-facing HW04 slash commands

- **AI Tool:** OpenAI Codex (GPT-5)
- **Bloom-AI Level:** G9.2 (Apply) + G9.4 (Collaborate)
- **Task:** Replace long copy-paste workflow prompts with concise, validated slash-command aliases.
- **Prompt:**
  > Cho mình dạng câu lệnh "/" để yêu cầu được không
- **Supporting Playwright Skills:** None
- **AI Output Summary:** Added `/hw4-help`, `/hw4-status`, `/hw4-setup`, `/hw4-generate FR-##`, `/hw4-review FR-##`, `/hw4-run FR-##`, `/hw4-bugs FR-##`, `/hw4-signoff FR-##`, and `/hw4-final` to `AGENTS.md`, including argument validation, HITL sign-off payload, automatic audit behavior, and rules against command chaining or gate bypass.
- **Human Review Notes:** Pending HITL review
- **What AI Got Wrong:** Pending HITL review
- **Verdict:** Pending HITL review
