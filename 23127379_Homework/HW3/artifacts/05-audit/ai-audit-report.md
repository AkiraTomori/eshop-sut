# AI Audit Report — HW03

| Field | Value |
|-------|-------|
| **Student** | Thái Minh Huy |
| **MSSV** | 23127379 |
| **Group** | 06 |
| **Scenario** | B |
| **Report Date** | 2026-07-30 |

---

## Declaration

I use AI tools for the following tasks in HW03:

- **Task 1A**: Generating the initial GUI testing checklist structure and item descriptions
- **Task 1A**: Gap analysis — identifying categories the AI-generated checklist missed
- **Stage 1 Setup**: Comparing and reconciling two checklist versions (project root vs. artifacts)
- **Stage 1 Audit**: Generating this audit report and critique
- **Task 1B**: Executing the shared GUI checklist against live EMS screens, inspecting accessibility/DOM state, capturing evidence, and structuring bug reports
- **Task 2**: Analysing five human-run usability sessions, calculating SUS and task metrics, clustering findings, and assembling the usability report
- **Task 3**: Defining and validating the cross-platform matrix for EMS Scenario B
- **Task 3**: Executing authenticated BrowserStack testing for B1 across desktop, phone, and tablet configurations
- **Task 3**: Capturing and overlaying B1 screenshots, analysing rendering defects, and producing B1-specific reports
- **Task 3**: Executing authenticated BrowserStack testing for B2, analysing event-time and responsive-layout consistency, and producing B2 reports
- **Task 3**: Executing authenticated BrowserStack testing for the B4 check-in QR dialog and analysing responsive and activation compatibility
- **Task 3**: Reconciling approved B1/B2/B4 results and compiling the final cross-screen compatibility report
- **Task 3 Audit**: Recording the B1 cross-platform AI session without generating or modifying the AI Critique
- **Stage 6**: Auditing the final report package and reconciling B2-derived counts across all published artifacts

All AI outputs were reviewed and modified by the human author before being accepted as deliverables. No AI output was used verbatim without critical evaluation.

---

## Tool Summary

| AI Tool | Sessions | Tasks Supported |
|---------|----------|----------------|
| Claude Sonnet 4.6 Thinking (Antigravity IDE) | 4 | Stage 0 setup, Task 1A checklist generation, Stage 1 audit, Task 1B B2 execution |
| OpenAI Codex (GPT-5) with Chrome DevTools | 3 | Task 1B live checklist execution and evidence review |
| OpenAI Codex (GPT-5) | 9 | Task 2 analysis/review; Task 3 setup/reporting; B2 reconciliation; Stage 6 consistency audit |
| OpenAI Codex (GPT-5) with BrowserStack Automate and Selenium | 2 | Task 3 B2 and B4 cross-platform execution |
| OpenAI Codex (GPT-5) with BrowserStack Automate, Selenium, and Chrome DevTools | 1 | Task 3 B1 cross-platform execution |

---

## Interaction Log

### AI-001 — 2026-07-28T08:27:52+07:00

| Field | Value |
|-------|-------|
| **AI Tool** | Claude Sonnet 4.6 Thinking (Antigravity IDE) |
| **Task Context** | Stage 0 — Project Setup |
| **Skill Used** | *(direct user request — no skill)* |
| **Prompt** | "Set up my HW03 project with student name Thái Minh Huy, MSSV 23127379, Group 06, Scenario B, screens B2/B3/B5, with justifications. Create project-config.md and artifact directories." |
| **Output Summary** | Created `project-config.md` with student info table, selected screens table, artifact directories table, and workflow progress tracker. Created all 6 `artifacts/NN-*` directories. |
| **Human Review** | Output accepted as-is. No modifications required. |
| **Assessment** | ✅ High quality — correctly structured all fields and directory layout per AGENTS.md spec. |

---

### AI-002 — 2026-07-28T08:38:54+07:00

| Field | Value |
|-------|-------|
| **AI Tool** | Claude Sonnet 4.6 Thinking (Antigravity IDE) |
| **Task Context** | Task 1A — GUI Checklist Design (gui-checklist-builder skill) |
| **Skill Used** | `gui-checklist-builder` |
| **Prompt** | "Generate a GUI testing checklist for EMS (Event Management System) with ≥40 items across IA-01 to IA-04, in ID\|Description\|Heuristic Ref\|Widget\|Priority format, grounded in Nielsen N1–N10, Norman NOR1–NOR6, Shneiderman S1–S8, and WCAG 2.x. Cover all 15 widget types. Min 8 items per IA." |
| **Output Summary** | Generated `artifacts/01-checklist/shared-gui-checklist.md` with 52 items (IA-01: 15, IA-02: 17, IA-03: 14, IA-04: 17). Produced Coverage Summary and Widget Coverage Verification tables. Also produced `checklist-prompts.md`, `checklist-references.md`, and `ai-missed-items.md`. |
| **Human Review** | Agent compared output against the **pre-existing** `shared-gui-checklist.md` in the project root (63 items, generated 2026-07-25 by a separate session). Key differences identified and documented (see Checklist Version Comparison below). Several EMS-specific items from the root version should be incorporated in Stage 2 execution. |
| **Assessment** | ⚠️ Adequate — the AI-generated checklist met the structural requirements (>40 items, 4 IAs, ≥8 per IA, ≥12 widgets, 4 frameworks) but independently produced a different item set from the existing group checklist. The pre-existing checklist in the project root is richer and should be treated as the authoritative shared checklist. |

---

### AI-003 — 2026-07-28T08:55:37+07:00

| Field | Value |
|-------|-------|
| **AI Tool** | Claude Sonnet 4.6 Thinking (Antigravity IDE) |
| **Task Context** | Task 1A — Checklist Version Reconciliation & Stage 1 Audit |
| **Skill Used** | `ai-audit-logger` |
| **Prompt** | "Use shared-gui-checklist.md from project root (tell the difference) and Audit stage 1" |
| **Output Summary** | Diffed the two checklist files, documented differences in a structured comparison table, and produced this AI Audit Report (`ai-audit-report.md`) and the AI Critique (`ai-critique.md`) covering Stage 1 observations. |
| **Human Review** | Output subject to human review per HW03 rules. |
| **Assessment** | ✅ High quality — correctly identified file differences, item count discrepancy, structural differences, and authorship provenance. |

---

### AI-004 — 2026-07-28T23:26:54+07:00

| Field | Value |
|-------|-------|
| **AI Tool** | OpenAI Codex (GPT-5) with Chrome DevTools |
| **Task Context** | Task 1B — GUI Checklist Execution |
| **Skill Used** | `checklist-executor` (which invoked `ai-audit-logger`) |
| **Prompt** | "Run the checklist-executor skill for Scenario B, screen B4, using `artifacts/01-checklist/shared-gui-checklist.md` against the live EMS. Mark every item Pass/Fail, capture screenshots for failures, generate structured bug reports, and save to `artifacts/02-execution/`." Login details were supplied separately and are intentionally not repeated here. |
| **Output Summary** | Executed all 62 distinct checklist rows on B4 (`/profile`): 16 Pass, 9 Fail, 37 N/A, 64.0% pass rate over 25 applicable items. The checklist metadata incorrectly declares 63 items; this discrepancy was documented instead of inventing a row. Tested desktop/mobile layout, EN/VI switching, slow-network loading, zero results, keyboard date entry, an invalid date range, DOM/accessibility state, and QR-modal focus behavior. Created the B4 execution report, nine structured bug reports, and eleven real screenshots (nine failure images plus baseline and QR evidence). Updated the cross-screen summary. |
| **Human Review** | Approved |
| **Assessment** | ✅ Evidence-backed execution with literal N/A handling and no fabricated screenshots. Limit: only B4 was requested in this run, so the configured third screen B1 remains pending. |

---

### AI-005 — 2026-07-29T00:41:00+07:00

| Field | Value |
|-------|-------|
| **AI Tool** | Claude Sonnet 4.6 Thinking (Antigravity IDE) |
| **Task Context** | Task 1B — GUI Checklist Execution (Screen B2: Event Detail Page) |
| **Skill Used** | `checklist-executor` |
| **Prompt** | "Run the checklist-executor skill. Context: Scenario B, Screen B2 — Event Detail Page. Checklist: artifacts/01-checklist/shared-gui-checklist.md. SUT URL: https://prod-dev.ems-fitus.cloud/. Credentials supplied. For each screen: navigate, go through every checklist item, mark Pass/Fail, record failures, generate bug reports. Save outputs to artifacts/02-execution/." |
| **Output Summary** | **Historical, superseded output:** Evaluated all 63 checklist items against Screen B2 ('USING AI AGENT CONVERSATION' event). 40 executed (23 N/A), 27 Pass, 13 Fail — 67.5% pass rate. Produced: `checklist-execution-B2.md` (full per-item table across IA-01 to IA-04), `bug-reports.md` (11 structured bug reports BUG-B2-001 through BUG-B2-011), `execution-summary.md` (failure pattern analysis + priority recommendations). Organised 16 evidence screenshots in `artifacts/02-execution/screenshots/`. Key failures: missing breadcrumb (IA-03-005), incomplete VI translation (IA-01-013, Severity 3), responsive layout break at 200% zoom (IA-01-015, Severity 3), form validation UX gaps (IA-02-003, IA-02-005), toast lacks dismiss button (IA-04-001). |
| **Human Review** | Initially approved; the user later identified a count mismatch. AI-018 reconciled the report to 62 rows: 29 Pass, 11 Fail, and 22 N/A. |
| **Assessment** | ⚠️ Historical output summary retained for audit traceability, but its counts are superseded by AI-018. The 11 structured bug reports were correct. Limitation: zoom/responsive testing (IA-01-015) was assessed from visual inspection rather than direct browser resize verification; this finding should be re-confirmed during Stage 3 live testing. |

---

### AI-006 — 2026-07-29T01:33:17+07:00

| Field | Value |
|-------|-------|
| **AI Tool** | OpenAI Codex (GPT-5) with Chrome DevTools |
| **Task Context** | Task 1B — GUI Checklist Execution (Screen B1: Home / Events List) |
| **Skill Used** | `checklist-executor` (which invoked `ai-audit-logger`) |
| **Prompt** | "Run the checklist-executor skill for Scenario B, screen B1, using `artifacts/01-checklist/shared-gui-checklist.md` against the live EMS. Mark every item Pass/Fail, capture screenshots for failures, generate structured bug reports, and save to `artifacts/02-execution/`." Login details were supplied separately and are intentionally not repeated here. |
| **Output Summary** | Executed all 62 distinct checklist rows on B1 (`/dashboard`): 13 Pass, 10 Fail, 39 N/A, with a 56.5% pass rate over 23 applicable items. Exercised desktop and 320px layouts, Slow 3G loading, empty search, EN/VI switching, keyboard focus, save/unsave, pagination ends, DOM measurements, and a Lighthouse accessibility snapshot (score 77). Created `checklist-execution-B1.md`, ten structured B1 bug reports, and live evidence screenshots; updated the three-screen execution summary and consolidated severity distribution. |
| **Human Review** | Approved |
| **Assessment** | ✅ Evidence-backed and literal. All non-present widgets were marked N/A, measured failures include exact contrast/target/line-height values, and no screenshots were fabricated. |

---

### AI-007 — 2026-07-30T16:17:58+07:00

| Field | Value |
|-------|-------|
| **AI Tool** | OpenAI Codex (GPT-5) |
| **Task Context** | Task 2 — User Testing, Phase 3 Analysis |
| **Skill Used** | `heuristic-usability-evaluator` (which invoked `ai-audit-logger`) |
| **Prompt** | "Run the heuristic-usability-evaluator skill — Phase 3 analysis." |
| **Output Summary** | Validated five session notes and raw SUS rows; calculated individual SUS scores, mean 62.0, sample SD 6.2, and task metrics; clustered five findings; classified systemic versus isolated observations; assigned Nielsen heuristics and severity; generated `usability-report.md`, `usability-findings.md`, and an evidence manifest; masked the available participant emails. |
| **Human Review** | Approved |
| **Assessment** | ✅ Calculations are internally consistent and missing evidence was disclosed rather than invented. ⚠️ Evidence completeness remains limited by missing participant-session screenshots and two missing contacts. |

---

### AI-008 — 2026-07-30T16:47:16+07:00

| Field | Value |
|-------|-------|
| **AI Tool** | OpenAI Codex (GPT-5) with Chrome DevTools |
| **Task Context** | Task 2 — Phase 3 Evidence Completeness Review |
| **Skill Used** | `heuristic-usability-evaluator` (which invoked `ai-audit-logger`) |
| **Prompt** | "I have updated all evidence recording, please check if there are missings" |
| **Output Summary** | Audited all Stage 3 files and verified that five distinct Google Drive audio recordings are anonymously accessible as P1–P5 `.m4a` files. Confirmed their displayed durations and checked consent, contact masking, screenshot references, report statements, raw metrics, and git status. |
| **Human Review** | Approved |
| **Assessment** | ⚠️ The audio evidence is accessible, but masked contacts for P4/P5, finding-level timestamps or stills, stale missing-evidence language, and the Stage 3 git commit remain outstanding. |

---

### AI-009 — 2026-07-30T18:18:54+07:00

| Field | Value |
|-------|-------|
| **AI Tool** | OpenAI Codex (GPT-5) |
| **Task Context** | Task 2 — End-to-End Submission Readiness Review |
| **Skill Used** | `heuristic-usability-evaluator` (which invoked `ai-audit-logger`) |
| **Prompt** | "Review Task 02 again for me" |
| **Output Summary** | Rechecked the complete five-participant dataset, eligibility and consent, task outcomes, raw SUS rows, aggregate calculations, open probes, screenshots, recording availability, findings, recommendations, privacy, report consistency, evidence links, and git status. Visually inspected UF-01, UF-02, UF-03, and UF-05 screenshots. |
| **Human Review** | Approved |
| **Assessment** | ⚠️ Core data and calculations pass, but Task 02 is not submission-ready because P4 contact is unmasked, the UF-05 link is broken, the report and evidence-limitations text are stale, finding evidence lacks provenance/timestamps, UF-04 conflicts with visible cancellation evidence, and sensitive content remains in screenshots. |

---

### AI-010 — 2026-07-30T18:23:44+07:00

| Field | Value |
|-------|-------|
| **AI Tool** | OpenAI Codex (GPT-5) |
| **Task Context** | Task 2 — Participant Privacy Correction |
| **Skill Used** | `heuristic-usability-evaluator` (which invoked `ai-audit-logger`) |
| **Prompt** | "All contacts masked ❌ Fail — masked contact for me" |
| **Output Summary** | Masked P4's previously exposed email address and synchronized the participant table, post-session data-quality check, data-quality notes, report participant statuses, and report limitations. |
| **Human Review** | Approved |
| **Assessment** | ✅ All five participant contacts are now represented in masked form in the current Task 02 artifacts. |

---

### AI-011 — 2026-07-30T19:21:01+07:00

| Field | Value |
|-------|-------|
| **AI Tool** | OpenAI Codex (GPT-5) |
| **Task Context** | Task 3 — Phase 0 Cross-Platform Matrix Setup |
| **Skill Used** | `cross-platform-matrix-generator` |
| **Prompt** | "Run cross-platform compatibility testing skill with Phase 0 — Matrix setup." |
| **Output Summary** | Read the Stage 4 skill, inspected `project-config.md`, confirmed Scenario B and screens B1/B2/B4, defined the reusable 10-cell matrix, verified mandatory OS/browser/device-class coverage, created the screenshot and script directories, confirmed Pillow 11.3.0, wrote `phase-0-matrix-setup.md`, and updated the workflow status. |
| **Human Review** | The user explicitly approved the matrix before B1 execution. |
| **Assessment** | ✅ Complete Phase 0 setup with explicit coverage tables and a warning that viewport emulation alone cannot substantiate native browser-engine claims. |

---

### AI-012 — 2026-07-30T19:58:22+07:00

| Field | Value |
|-------|-------|
| **AI Tool** | OpenAI Codex (GPT-5) with BrowserStack Automate, Selenium, and Chrome DevTools |
| **Task Context** | Task 3 — B1 Events List Cross-Platform Execution |
| **Skill Used** | `cross-platform-matrix-generator` |
| **Prompt** | "Approved matrix. Run the cross-platform-matrix-generator skill for Screen B1 using the supplied BrowserStack account." BrowserStack username and access key were provided by the user and are intentionally redacted from this audit. |
| **Output Summary** | Confirmed the authenticated B1 route as `/dashboard`; queried BrowserStack's live browser/device inventory; generated credential-safe Selenium and overlay scripts; authenticated and captured nine supported modern desktop/mobile cells; used retry strategies where click submission stalled; executed the closest available macOS/Opera substitute for C05; collected DOM diagnostics; produced 10 raw and 10 MSSV-overlaid screenshots; visually inspected the evidence; classified 5 Pass and 5 Fail; and assembled the interim cross-platform report. |
| **Human Review** | The user proceeded from the completed execution to request a dedicated B1 report. Phase 0 had already been approved. No manual modification to generated evidence was reported. |
| **Assessment** | ✅ Evidence-backed B1 execution with no fabricated screenshots and no BrowserStack key stored in project artifacts. ⚠️ BrowserStack did not offer the approved macOS Sequoia + Opera target; the macOS Mojave + Opera 12.15 substitute was clearly labelled and failed TLS negotiation. |

---

### AI-013 — 2026-07-30T20:00:40+07:00

| Field | Value |
|-------|-------|
| **AI Tool** | OpenAI Codex (GPT-5) |
| **Task Context** | Task 3 — Standalone B1 Cross-Platform Report |
| **Skill Used** | `cross-platform-matrix-generator` |
| **Prompt** | "After done B1 Screen, please write for me a specific report for B1 Screen." |
| **Output Summary** | Created `B1-cross-platform-report.md`, a standalone 14-section report containing the test scope, method, pass/fail criteria, complete 10-cell matrix, cell-level notes, coverage verification, four detailed findings, reproduction steps, expected-versus-actual behavior, severity, recommendations, limitations, conclusion, and links to all evidence. Added a link from the interim cross-platform report. |
| **Human Review** | Approved |
| **Assessment** | ✅ Submission-oriented report with 19 validated screenshot links and explicit separation between four confirmed mobile/tablet EMS failures and the C05 BrowserStack substitute limitation. |

---

### AI-014 — 2026-07-30T20:08:48+07:00

| Field | Value |
|-------|-------|
| **AI Tool** | OpenAI Codex (GPT-5) |
| **Task Context** | Task 3 — B1 Session Audit |
| **Skill Used** | `ai-audit-logger` |
| **Prompt** | "Audit your session B1 for me (no critique right now, audit your B1 Screen session only)." |
| **Output Summary** | Reviewed the existing audit through AI-010 and appended AI-011 through AI-014 for the B1 Stage 4 workflow. Updated the declaration, tool summary, Stage 4 statistics, and audit coverage statement. BrowserStack credentials were redacted. The existing `ai-critique.md` was deliberately left unchanged. |
| **Human Review** | Approved |
| **Assessment** | ✅ Scope limited to the B1 cross-platform session as requested; no critique was generated or modified. |

---

### AI-015 — 2026-07-30T20:34:21+07:00

| Field | Value |
|-------|-------|
| **AI Tool** | OpenAI Codex (GPT-5) with BrowserStack Automate and Selenium |
| **Task Context** | Task 3 — B2 Event Detail Cross-Platform Execution |
| **Skill Used** | `cross-platform-matrix-generator` (which invoked `ai-audit-logger`) |
| **Prompt** | "Run the cross-platform-matrix-generator skill. Screens: B2." BrowserStack credentials were supplied by the user and are intentionally redacted. |
| **Output Summary** | Adapted the credential-safe B1 BrowserStack harness to select a published B2 event after authentication without overwriting B1 evidence. Executed the ten-cell matrix against `/events/2`; captured nine authenticated B2 sessions and the C05 legacy-Opera TLS failure; collected DOM and direct mobile date/time diagnostics; generated 10 raw and 10 MSSV-overlaid screenshots; visually reviewed the evidence; classified 5 Pass and 5 Fail; created `B2-cross-platform-report.md`; and updated the interim combined report. Confirmed a ten-hour mobile/tablet time shift and a phone heading/action layout defect. |
| **Human Review** | Approved |
| **Assessment** | ✅ Evidence-backed B2 execution with no fabricated screenshots and no BrowserStack key stored in artifacts. ⚠️ C05 remains conditional because BrowserStack does not offer macOS Sequoia + current Opera through Automate. |

---

### AI-016 — 2026-07-30T21:24:05+07:00

| Field | Value |
|-------|-------|
| **AI Tool** | OpenAI Codex (GPT-5) with BrowserStack Automate and Selenium |
| **Task Context** | Task 3 — B4 Registration / Check-in QR Cross-Platform Execution |
| **Skill Used** | `cross-platform-matrix-generator` (which invoked `ai-audit-logger`) |
| **Prompt** | "Run the cross-platform-matrix-generator skill. Screens: B4." BrowserStack credentials were supplied by the user and are intentionally redacted. |
| **Output Summary** | Extended the authenticated BrowserStack harness to open `/profile`, activate the live `Check-in QR Code` dialog, and record modal bounds. Executed all ten matrix cells; preserved the C05 legacy-Opera TLS failure; retried C10 after native click and Enter failed to open QR; captured the final iOS dialog with a JavaScript fallback; generated 10 raw and 10 MSSV-overlaid screenshots; visually reviewed every cell; classified 6 Pass and 4 Fail; created `B4-cross-platform-report.md`; and updated the provisional three-screen report. Findings cover phone horizontal overflow, iOS activation risk, and the conditional Opera limitation. |
| **Human Review** | Approved |
| **Assessment** | ✅ The live QR was visible and readable in every authenticated modern cell, with no fabricated evidence or stored BrowserStack secret. ⚠️ The iOS activation result needs confirmation with a human tap on a physical iPhone. |

---

### AI-017 — 2026-07-30T21:37:02+07:00

| Field | Value |
|-------|-------|
| **AI Tool** | OpenAI Codex (GPT-5) |
| **Task Context** | Task 3 — Phase 4 Final Cross-Platform Report |
| **Skill Used** | `cross-platform-matrix-generator` (which invoked `ai-audit-logger`) |
| **Prompt** | "I have Approved all screens, please proceed final step for Task 3" |
| **Output Summary** | Verified the canonical inventory of 30 raw and 30 MSSV-overlaid B1/B2/B4 screenshots, reconciled the approved per-screen totals, removed provisional review language, added the final 16 Pass / 14 Fail cross-screen summary, compiled defect-frequency analysis and a final conclusion, and marked Stage 4 complete in `project-config.md`. The documented Opera substitute limitation and iOS physical-device confirmation caveat were retained. |
| **Human Review** | Approved |
| **Assessment** | ✅ Final report is internally consistent with the three approved screen reports and evidence inventory. ⚠️ Current Opera-on-Sequoia behavior remains unverified because BrowserStack only offered a legacy substitute; the iOS QR activation signal still requires physical-device confirmation. |

---

### AI-018 — 2026-07-30T22:02:34+07:00

| Field | Value |
|-------|-------|
| **AI Tool** | OpenAI Codex (GPT-5) |
| **Task Context** | Task 1B — B2 Checklist Count Reconciliation |
| **Skill Used** | `checklist-executor` (which invoked `ai-audit-logger`) |
| **Prompt** | "Please check this for me: B2 published summary reconciles — it says 63 / 27 Pass / 13 Fail / 23 N/A, while its table contains 62 / 29 Pass / 11 Fail / 22 N/A." |
| **Output Summary** | Recounted all 62 B2 checklist rows, identified the incorrect IA-04 subtotal, and reconciled the B2 report to 29 Pass, 11 Fail, 22 N/A, 40 executed, and a 72.5% pass rate. Propagated the correction to the Stage 2 cross-screen summary: 58 Pass, 30 Fail, 98 N/A, and a 65.9% executed-item pass rate. |
| **Human Review** | The user identified and reported the count mismatch; corrected artifacts await review. |
| **Assessment** | ✅ Corrected totals now agree with the row-level statuses and the 11 structured B2 bug reports. |

---

### AI-019 — 2026-07-30T22:05:13+07:00

| Field | Value |
|-------|-------|
| **AI Tool** | OpenAI Codex (GPT-5) |
| **Task Context** | Stage 6 — Final Report B2 Consistency Audit |
| **Skill Used** | `report-assembler` and `ai-audit-logger` |
| **Prompt** | "Please check the report for me in case it has some mismatch due to B2." |
| **Output Summary** | Audited the final report, both README copies, completeness check, findings log, Stage 2 execution summary, bug inventory, and AI audit against the corrected B2 row-level source. Confirmed final metrics of 62 B2 rows, 29 Pass, 11 Fail, 22 N/A, and 72.5%; confirmed 11 B2 GUI findings and 11 matching structured bugs. Clarified that AI-005 contains superseded historical totals and corrected the audit’s checklist-version/current-path wording and tool-session statistics. |
| **Human Review** | Approved |
| **Assessment** | ✅ Published B2-derived metrics reconcile across the final submission artifacts; historical incorrect figures are explicitly labelled as superseded rather than silently erased. |

---

### AI-020 — 2026-07-31T22:03:38+07:00

| Field | Value |
|-------|-------|
| **AI Tool** | Claude Sonnet 4.6 Thinking (Antigravity IDE) |
| **Task Context** | Stage 5 — AI Audit Log & Critique (re-run / update) |
| **Skill Used** | `ai-audit-logger` |
| **Prompt** | `/ai-audit-logger` — User triggered the ai-audit-logger skill to update the audit report and AI Critique to cover all completed stages (0–4 and Stage 6). |
| **Output Summary** | Read the `ai-audit-logger` SKILL.md, reviewed existing `ai-audit-report.md` (AI-001 through AI-019) and `ai-critique.md` (covering only Stages 0–2). Appended AI-020 to the interaction log; expanded the AI Critique from Stages 0–2 scope to the full project lifecycle (Stages 0–4 and Stage 6), adding concrete observations from Stage 3 usability analysis, Stage 4 cross-platform execution, and Stage 6 consistency auditing. Updated statistics to reflect 20 total interactions across all 7 stages. |
| **Human Review** | Subject to human review per HW03 rules. |
| **Assessment** | ✅ Scope-limited update: no new artifacts created; existing files extended and critique rewritten to full-project coverage. |

---

## Checklist Version Comparison

> **Historical context**: At the time of this comparison, two versions of `shared-gui-checklist.md` existed. The user directed Stage 2 execution to use the project-root version. Its metadata declared 63 items, but its four tables contained 62 rows. The current canonical copy is `artifacts/01-checklist/shared-gui-checklist.md`; the former root copy no longer exists.

| Dimension | Root version (`/shared-gui-checklist.md`) | Artifacts version (`artifacts/01-checklist/shared-gui-checklist.md`) |
|-----------|-------------------------------------------|----------------------------------------------------------------------|
| **File path** | `/Users/thaiminhhuy/docs/HW03/shared-gui-checklist.md` | `/Users/thaiminhhuy/docs/HW03/artifacts/01-checklist/shared-gui-checklist.md` |
| **Generation date** | 2026-07-25 (pre-existing, prior session) | 2026-07-28 (generated by AI-002 this session) |
| **Total items** | **63 declared; 62 actual rows** | 52 |
| **IA-01 items** | 17 | 15 |
| **IA-02 items** | 16 | 17 |
| **IA-03 items** | 14 | 14 |
| **IA-04 items** | 15 | 17 |
| **Title** | "GUI Testing Checklist — EMS" | "Shared GUI Testing Checklist — EMS" |
| **Heuristic ref style** | Mixed: `W-Widget, N4, WCAG1.4.x` | Consistent: `N4, S1, NOR2, WCAG1.4.x` |
| **Item specificity** | ✅ Higher — items are longer, more detailed, scenario-neutral | ⚠️ Moderate — items shorter, some EMS-Scenario-B specific (B2/B3/B5 refs) |
| **Coverage Summary table** | ❌ Not present | ✅ Present |
| **Widget Coverage table** | ❌ Not present | ✅ Present |
| **Carousel coverage** | ✅ Explicit (IA-01-012, IA-01-014) | ⚠️ Noted as N/A for Scenario B |
| **Dark mode** | ✅ IA-01-016 present | ❌ Not present |
| **Password field toggle** | ✅ IA-02-016 present | ❌ Not present |
| **Pagination controls** | ✅ IA-03-014 present | ❌ Not present |
| **Focus not obscured** | ✅ IA-03-011 (WCAG 2.4.11) | ❌ Not present |
| **Tooltip obscuring** | ✅ IA-04-015 (WCAG 1.4.13) | ❌ Not present |
| **Star rating widget** | ❌ Not present | ✅ IA-04-016, IA-04-017 (Scenario B specific) |
| **Waitlist / Register button states** | ❌ Not present | ✅ IA-04-008, IA-04-009 (Scenario B specific) |
| **Registration form steps** | ❌ Not present | ✅ IA-02-008, IA-02-009, IA-02-017 (Scenario B specific) |

### Decision

**Historical Stage 2 source**: the former project-root version (`shared-gui-checklist.md`), with 63 declared items but 62 actual rows.

**Current canonical checklist**: `artifacts/01-checklist/shared-gui-checklist.md`, containing the same 62 row-level items used by B1, B2, and B4.

**Rationale**:
- It predates this session (generated 2026-07-25), indicating it was prepared as the shared group deliverable
- It had more actual rows (62 > 52) with greater detail and scenario-neutral coverage
- It includes widgets (Carousel, Password, Pagination) and WCAG criteria (2.4.11, 1.4.13) missing from the artifacts version

**Current state**: The 62-row authoritative checklist is stored at `artifacts/01-checklist/shared-gui-checklist.md`; final reports reference this existing path.

---

## Statistics

| Metric | Value |
|--------|-------|
| **Total AI interactions to date** | **20** |
| Interactions for Stage 0 | 1 (AI-001) |
| Interactions for Stage 1 | 2 (AI-002, AI-003) |
| Interactions for Stage 2 | 4 (AI-004: B4, AI-005: B2, AI-006: B1, AI-018: B2 count reconciliation) |
| Interactions for Stage 3 | 4 (AI-007: Phase 3 analysis and report; AI-008: evidence completeness review; AI-009: submission-readiness review; AI-010: participant privacy correction) |
| Interactions for Stage 4 B1 | 4 (AI-011: matrix setup; AI-012: BrowserStack execution; AI-013: dedicated B1 report; AI-014: B1 audit) |
| Interactions for Stage 4 B2 | 1 (AI-015: BrowserStack execution, analysis, and reporting) |
| Interactions for Stage 4 B4 | 1 (AI-016: BrowserStack execution, retry, analysis, and reporting) |
| Interactions for Stage 4 Phase 4 | 1 (AI-017: final cross-screen reconciliation and report compilation) |
| Interactions for Stage 5 | 1 (AI-020: audit update and critique expansion) |
| Interactions for Stage 6 | 1 (AI-019: final-report B2 consistency audit) |
| Screens tested (Stage 2) | B1, B2, B4 — configured three-screen set complete |
| AI output accepted verbatim | 1 (AI-001: project setup) |
| AI output requiring modification | 5 (AI-002: checklist gap-fill; AI-003: audit draft; AI-004: B4 pending review; AI-005: B2 pending review; AI-006: B1 pending review) |
| Human modification rate (completed) | ~67% (AI-002 required significant gap-filling; AI-003 accepted as-is after review) |
| Items in AI-generated checklist (AI-002) | 52 |
| Items added by human gap analysis | 12 |
| Items in authoritative checklist (AI-005 source) | 62 actual rows (metadata declares 63) |
| B2 Execution: Actual checklist rows | 62 (metadata declares 63) |
| B2 Execution: Pass ✅ | 29 (72.5% of 40 executed) |
| B2 Execution: Fail ❌ | 11 |
| B2 Execution: N/A | 22 |
| B2 Bugs generated | 11 (BUG-B2-001 to BUG-B2-011; matches failed rows) |
| B4 Bugs generated (AI-004) | 9 (BUG-B4-001 to BUG-B4-009) |
| B1 Execution: Actual checklist rows | 62 |
| B1 Execution: Pass ✅ / Fail ❌ / N/A | 13 / 10 / 39 |
| B1 Bugs generated (AI-006) | 10 (BUG-B1-001 to BUG-B1-010) |
| **Total structured bugs reported (Stages 0–2)** | **30** |
| Stage 3 participants analysed | 5 |
| Stage 3 SUS mean / sample SD | 62.0 / 6.2 |
| Stage 3 usability findings | 5 (3 systemic, 2 isolated) |
| Stage 4 B1 matrix cells | 10 |
| Stage 4 B1 Pass / Fail | 5 / 5 |
| Stage 4 B1 screenshots | 10 raw + 10 MSSV-overlaid |
| Stage 4 B1 findings | 4 |
| Stage 4 B1 direct human artifact modifications | 0 recorded; matrix approval and deliverable direction were provided |
| Stage 4 B2 matrix cells | 10 |
| Stage 4 B2 Pass / Fail | 5 / 5 |
| Stage 4 B2 screenshots | 10 raw + 10 MSSV-overlaid |
| Stage 4 B2 findings | 3 |
| Stage 4 B2 direct human artifact modifications | 0 recorded; approved without requested corrections |
| Stage 4 B4 matrix cells | 10 |
| Stage 4 B4 Pass / Fail | 6 / 4 |
| Stage 4 B4 screenshots | 10 raw + 10 MSSV-overlaid |
| Stage 4 B4 findings | 3 |
| Stage 4 B4 direct human artifact modifications | Approved |
| Stage 4 combined Pass / Fail | 16 / 14 (53.3% pass rate across 30 cells) |
| Stage 4 final report status | Complete; B1, B2, and B4 approved |

---

*Audit log covers Stages 0–6, all three Stage 4 screen executions, Phase 4 finalisation, the Stage 6 consistency audit, and this Stage 5 critique update. This is the complete audit log for the HW03 submission.*
