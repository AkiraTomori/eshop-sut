# HW03 — GUI & Usability Testing on EMS: Agent Workflow Guide

> **Project**: HW03-AI (EMS edition) — GUI, Usability & Cross-Platform Testing
> **SUT**: EMS (Event Management System) — `https://prod-dev.ems-fitus.cloud/`
> **Skills**: 6 Agent Skills in `.agents/skills/`

---

## Overview

This file orchestrates the complete HW03 workflow. The agent follows **6 sequential stages**, each corresponding to one Agent Skill. Every stage produces artifacts in a dedicated subfolder under `artifacts/`. After each stage the agent **stops and waits for user review** before proceeding.

### Workflow Diagram

```
Stage 0: Setup
    ↓
Stage 1: gui-checklist-builder       → artifacts/01-checklist/
    ↓  ⏸ Review
Stage 2: checklist-executor          → artifacts/02-execution/
    ↓  ⏸ Review
Stage 3: heuristic-usability-evaluator → artifacts/03-usability/
    ↓  ⏸ Review
Stage 4: cross-platform-matrix-generator → artifacts/04-cross-platform/
    ↓  ⏸ Review
Stage 5: ai-audit-logger             → artifacts/05-audit/
    ↓  ⏸ Review
Stage 6: report-assembler            → artifacts/06-report/
    ↓  ⏸ Final Review
Done → ZIP and submit
```

### How the User Runs This Workflow

Each stage is triggered by the user with a simple prompt. Copy-paste the prompt from the relevant section below, fill in the `{placeholders}`, and send it to the agent. The agent will:

1. Read the corresponding skill's `SKILL.md`
2. Execute the workflow step by step
3. Save all outputs to the correct `artifacts/` subfolder
4. Present a summary and ask for review
5. **Wait** — the agent will not proceed to the next stage until you explicitly approve

> **Tip**: You can use the `/goal` command if you want the agent to run a full stage autonomously and thoroughly.

---

## Stage 0 — Project Setup

### Purpose
Configure the project with student info, scenario selection, and screen choices before any testing begins.

### User Action
Send the following prompt to the agent (fill in your details):

```
Set up my HW03 project with the following details:
- Student Name: {Your Name}
- MSSV: {Your Student ID}
- Group: {Your Group ID}
- Scenario: {A | B | C | D}
- Selected Screens (≥ 3): {e.g., A1, A2, A3}
- Justification for each screen: {brief reason per screen}

Create a project-config.md file in the project root and
create the artifact directories for all 6 stages.
```

### Expected Output
- `project-config.md` in project root (with all student/scenario info)
- Empty artifact directories created:
  ```
  artifacts/
  ├── 01-checklist/
  ├── 02-execution/
  ├── 03-usability/
  ├── 04-cross-platform/
  ├── 05-audit/
  └── 06-report/
  ```

### Review Checkpoint ⏸
Verify your scenario, screens, and justifications are correct before proceeding.

---

## Stage 1 — GUI Checklist Design (Group Deliverable)

### Skill
`gui-checklist-builder` — [SKILL.md](.agents/skills/gui-checklist-builder/SKILL.md)

### Purpose
Design a shared GUI testing checklist with **>40 items** covering all 4 Interface Aspects (IA-01 through IA-04), grounded in Nielsen, Norman, Shneiderman heuristics and WCAG criteria.

### User Action
Send the following prompt:

```
Run the gui-checklist-builder skill.

Context:
- SUT: EMS (Event Management System) — a web app for academic event management
- The checklist must cover 4 Interface Aspects:
  - IA-01: General UI Standards (layout, typography, colour, i18n EN/VI, empty/loading states)
  - IA-02: Forms (labels, validation, uploads, rich-text editor)
  - IA-03: Navigation (sidebar, breadcrumbs, tabs, drag-and-drop, deep links)
  - IA-04: Feedback/State (toasts, badges, confirmation dialogs, progress bars)
- Must have >40 items total, grounded in Nielsen 10, Norman 6, Shneiderman 8, WCAG 2.x
- Output format: ID | Description | Heuristic Ref | Widget/Area | Priority
- Include per-widget coverage (TextBox, Dropdown, Button, Image, DatePicker, Modal, Toast, FileUpload, RTE, DragDrop, ProgressBar, Tab, Sidebar, Carousel)

After generating the initial checklist with AI, critically review it and
identify items the AI missed (especially accessibility, RTL, dark mode,
keyboard navigation, i18n). For each added item, explain why the AI missed it.

Save all outputs to artifacts/01-checklist/.
```

### Expected Output in `artifacts/01-checklist/`
| File | Description |
|------|-------------|
| `shared-gui-checklist.md` | The complete checklist (>40 items, 4 IA sections) |
| `checklist-references.md` | Bibliography of all reference sources |
| `checklist-prompts.md` | AI prompts used to generate and refine the checklist |
| `ai-missed-items.md` | Items added beyond AI output with explanations |

### Review Checkpoint ⏸
Before proceeding, verify:
- [ ] Checklist has >40 items
- [ ] All 4 IAs are covered with ≥8 items each
- [ ] At least 12 widget types are referenced
- [ ] Heuristic references (N, NOR, S, WCAG) are accurate
- [ ] Items are specific and testable (can be marked Pass/Fail)
- [ ] AI-missed items have clear explanations
- [ ] Reference sources are complete

**User approval required to proceed to Stage 2.**

---

## Stage 2 — Checklist Execution (Individual Deliverable)

### Skill
`checklist-executor` — [SKILL.md](.agents/skills/checklist-executor/SKILL.md)

### Purpose
Execute the shared checklist against ≥3 screens of your scenario. Mark each item Passed or Failed, capture evidence for failures, and generate structured bug reports.

### User Action
Send the following prompt:

```
Run the checklist-executor skill.

Context:
- Scenario: {A | B | C | D}
- Screens to test: {e.g., A1 — Events List, A2 — Add/Edit Event, A3 — Registration Config}
- Checklist file: artifacts/01-checklist/shared-gui-checklist.md
- SUT URL: https://prod-dev.ems-fitus.cloud/
- User credentials: 23127379@student.hcmus.edu.vn / Minhhuy1407@ (Scenario B)

For each screen:
1. Navigate to the screen on the live EMS
2. Go through every checklist item and mark Pass ✅ or Fail ❌
3. For each Failed item, record: what failed, expected vs actual, screenshot filename
4. Generate a structured bug report for each failure

Save all outputs to artifacts/02-execution/.
```

> **Important**: The agent will need to use the browser to access the live EMS. Ensure the ngrok URL is accessible before running this stage.

### Expected Output in `artifacts/02-execution/`
| File | Description |
|------|-------------|
| `checklist-execution-{X1}.md` | Execution results for Screen 1 |
| `checklist-execution-{X2}.md` | Execution results for Screen 2 |
| `checklist-execution-{X3}.md` | Execution results for Screen 3 |
| `execution-summary.md` | Cross-screen summary (pass rates, failure patterns) |
| `bug-reports.md` | All bug reports consolidated |
| `screenshots/` | Screenshots for all Failed items |

### Review Checkpoint ⏸
Before proceeding, verify:
- [ ] All ≥3 screens have been tested (checklist execution files exist about one screen is enough to verify and continue, 2 other screens should be similar)
- [ ] Every checklist item has a Pass/Fail/N/A status per screen
- [ ] All Failed items have Notes explaining the failure
- [ ] Screenshots exist for all Failed items
- [ ] Bug reports have all required fields (ID, Screen, Steps, Expected, Actual, Severity, Screenshot)
- [ ] Severity ratings (1–4) are reasonable

**User approval required to proceed to Stage 3.**

---

## Stage 3 — Usability Evaluation (Individual Deliverable)

### Skill
`heuristic-usability-evaluator` — [SKILL.md](.agents/skills/heuristic-usability-evaluator/SKILL.md)

### Purpose
Conduct **User Testing with 5 real participants** on screens B1, B2, B4 of Scenario B.
The agent prepares all testing materials; the human runs the sessions; the agent analyses
results and assembles the Usability Report.

> ⚠️ **This stage has two sub-phases**: run Phase 1 first (agent generates templates),
> then run the 5 sessions yourself, then trigger Phase 3 for analysis.

---

#### Phase 1 — Generate Testing Materials (run now)

Send the following prompt:

```
Run the heuristic-usability-evaluator skill — Phase 1 only.

Context:
- Scenario: B
- Screens: B1 (Events List), B2 (Event Detail), B4 (Registration Confirmation / QR Code)
- Task goal: "You just heard about an upcoming workshop on campus. Find it on EMS,
  register for it, and show me your check-in QR code."
- SUT URL: https://prod-dev.ems-fitus.cloud/
- Participant profile: university students unfamiliar with EMS

Generate:
1. task-scenario.md — goal-oriented task script to read aloud
2. session-template.md — structured observation notes form (one per session)
3. sus-questionnaire.md — 10 SUS items + 4 open probes (Vietnamese + English)
4. participant-sheet.md — participant recruitment info with masked contact format
5. data-collection-sheet.md — aggregation table for 5 sessions

Save all outputs to artifacts/03-usability/.
```

---

#### Phase 2 — Run 5 Sessions (human only)

After generating templates:
1. Run 1 **pilot session** with a helper to refine the task wording
2. Recruit **5 real participants** outside this class (students / lecturers / event-goers)
3. Run each session: think-aloud, observe, record time/errors/hesitations
4. After each session: collect SUS questionnaire answers + open probe responses
5. Fill in `data-collection-sheet.md` with all raw metrics

Save each session's notes as `session-notes-P1.md` through `session-notes-P5.md`.

---

#### Phase 3 — Analysis & Report (run after all 5 sessions)

Send the following prompt:

```
Run the heuristic-usability-evaluator skill — Phase 3 analysis.

I have completed 5 user testing sessions. Raw data is in:
- artifacts/03-usability/data-collection-sheet.md
- artifacts/03-usability/session-notes-P1.md through session-notes-P5.md

Screens tested: B1, B2, B4 (Scenario B)
SUS raw scores: [paste the 5 × 10 SUS answer rows here]

Perform:
1. Calculate SUS score for each participant (P1–P5) and mean/SD
2. Build task metrics table (success rate, avg time, error count, hesitation count)
3. Identify and group usability findings from session notes
4. Classify: isolated bug vs systemic design issue
5. Assign severity 0–4 and heuristic reference (N1–N10) to each finding
6. Write prioritised recommendations with effort estimates
7. Assemble complete usability-report.md

Save all outputs to artifacts/03-usability/.
```

---

### Expected Output in `artifacts/03-usability/`

| File | Phase | Description |
|------|-------|-------------|
| `task-scenario.md` | 1 | Task script read aloud to participants |
| `session-template.md` | 1 | Observation notes form |
| `sus-questionnaire.md` | 1 | SUS 10 items + 4 open probes (VI/EN) |
| `participant-sheet.md` | 1 | Participant list with masked contacts |
| `data-collection-sheet.md` | 1 | 5-row aggregation table |
| `session-notes-P1.md` … `P5.md` | 2 | Filled by human after each session |
| `usability-report.md` | 3 | Complete Usability Report |
| `usability-findings.md` | 3 | Structured findings for report-assembler |
| `screenshots/` | 3 | Evidence screenshots |

### Review Checkpoint ⏸
Before proceeding, verify:
- [ ] Phase 1: All 5 template files exist in `artifacts/03-usability/`
- [ ] Phase 2: 5 real sessions completed (not pilot), session-notes-P1 through P5 exist
- [ ] Participants are from outside this class, contacts are masked (middle 4 digits)
- [ ] SUS scores collected from all 5 participants
- [ ] Phase 3: usability-report.md contains all sections
- [ ] Each finding has: ID, description, heuristic ref, severity 0–4, screen, screenshot
- [ ] Recommendations ranked by priority with effort estimates

**User approval required to proceed to Stage 4.**

---

## Stage 4 — Cross-Platform Compatibility Testing

### Skill
`cross-platform-matrix-generator` — [SKILL.md](.agents/skills/cross-platform-matrix-generator/SKILL.md)

### Purpose
Agent **executes** cross-browser/cross-platform testing end-to-end on screens B1, B2, B4.
The workflow is structured as:
1. **Phase 0** — Define the 10-cell device matrix once for all screens
2. **Loop B1 → B2 → B4** — For each screen: login, navigate, capture, overlay, analyse
3. **Phase 4** — Compile the final report

All 3 screens are behind EMS authentication. The agent uses the **same credentials as Stage 2**:
- **Email**: `23127379@student.hcmus.edu.vn`
- **Password**: `Minhhuy1407@`

> **Mode A (Recommended)**: Agent uses BrowserStack Screenshots API → real OS/browser screenshots
> **Mode B (Fallback)**: Agent uses local Chrome + DevTools emulation → no credentials needed

---

### Execution Flow

```
Phase 0 — Matrix Setup (once)
│  Define 10-cell matrix covering: Windows, macOS, Android × Chrome, Firefox,
│  Safari, Edge, Opera × Desktop, Tablet, Phone
│  Verify coverage rules pass for all 3 OS / 5 browsers / 3 device classes
│  Create artifacts/04-cross-platform/screenshots/{raw/} directories
│
├─ Screen B1 (Events List)
│    Step 1: Login → https://prod-dev.ems-fitus.cloud/
│    Step 2: Navigate to Events List screen
│    Step 3: Capture 10 screenshots (1 per matrix cell)
│    Step 4: Apply MSSV email overlay via Python + Pillow
│    Step 5: Analyse each screenshot → mark Pass/Fail, note defects
│    Step 6: Write B1 report section
│    Step 7: ⏸ Present B1 results to user → WAIT for approval
│
├─ Screen B2 (Event Detail)           ← starts after user approves B1
│    Step 1: Re-use login session (or re-login if expired)
│    Step 2: Navigate to any published Event Detail page
│    Steps 3–6: same as B1
│    Step 7: ⏸ Present B2 results to user → WAIT for approval
│
└─ Screen B4 (Registration Confirmation / QR Code)  ← starts after user approves B2
     Step 1: Re-use login session (or re-login if expired)
     Step 2: Navigate to My Registrations / QR Code screen
     Steps 3–6: same as B1
     Step 7: ⏸ Present B4 results to user → WAIT for approval

Phase 4 — Compile final cross-platform-report.md  ← starts after user approves B4
```

---

### Standard 10-Cell Matrix (Scenario B)

| Cell | OS | Browser | Device | Viewport |
|------|----|---------|--------|----------|
| C01 | Windows 11 | Chrome | Desktop | 1920×1080 |
| C02 | Windows 11 | Firefox | Desktop | 1920×1080 |
| C03 | Windows 11 | Edge | Desktop | 1440×900 |
| C04 | macOS Sequoia | Safari | Desktop | 1920×1080 |
| C05 | macOS Sequoia | Opera | Desktop | 1280×800 |
| C06 | macOS Sequoia | Chrome | Desktop | 1440×900 |
| C07 | Android 14 | Chrome | Phone | 390×844 |
| C08 | Android 14 | Samsung Internet | Phone | 360×800 |
| C09 | Android 14 | Chrome | Tablet | 820×1180 |
| C10 | iOS 17 | Safari | Phone | 390×844 |

**Coverage check**: Windows ✅ · macOS ✅ · Android ✅ · Chrome ✅ · Firefox ✅ · Safari ✅ · Edge ✅ · Opera ✅ · Desktop ✅ · Tablet ✅ · Phone ✅

---

#### Trigger A — With BrowserStack Credentials

Sign up for a free trial at [browserstack.com](https://www.browserstack.com/users/sign_up),
then send:

```
Run the cross-platform-matrix-generator skill.

Mode: BrowserStack API
BrowserStack Username: {your_username}
BrowserStack Access Key: {your_access_key}
Screens: B1, B2, B4
MSSV email: 23127379@student.hcmus.edu.vn
SUT URL: https://prod-dev.ems-fitus.cloud/
Login email: 23127379@student.hcmus.edu.vn
Login password: Minhhuy1407@
```

---

#### Trigger B — Chrome DevTools Emulation (no credentials)

```
Run the cross-platform-matrix-generator skill.

Mode: Chrome DevTools emulation
Screens: B1, B2, B4
MSSV email: 23127379@student.hcmus.edu.vn
SUT URL: https://prod-dev.ems-fitus.cloud/
Login email: 23127379@student.hcmus.edu.vn
Login password: Minhhuy1407@

Note: No BrowserStack credentials available. Use local Chrome emulation only.
```

---

### What the Agent Does Automatically

| Phase | Step | Agent Action |
|-------|------|-------------|
| **0 — Setup** | 0.1 | Defines 10-cell matrix with full OS/browser/device coverage |
| **0 — Setup** | 0.2 | Verifies coverage rules pass before starting |
| **0 — Setup** | 0.3 | Creates output directory structure |
| **Per screen** | 1 | Logs in to EMS (`23127379@student.hcmus.edu.vn / Minhhuy1407@`) |
| **Per screen** | 2 | Navigates to correct screen URL (B1 → B2 → B4) |
| **Per screen** | 3 | Captures 10 screenshots via BrowserStack API or Chrome DevTools |
| **Per screen** | 4 | Applies MSSV email overlay using Python + Pillow |
| **Per screen** | 5 | Analyses screenshots for defects (overflow, overlap, truncation, etc.) |
| **Per screen** | 6 | Writes per-screen report section with matrix table + coverage check |
| **Per screen** | **7 ⏸** | **Presents full per-screen results to user → waits for approval before next screen** |
| **4 — Report** | — | Compiles all 3 sections into `cross-platform-report.md` + summary |

### Expected Output in `artifacts/04-cross-platform/`
| File/Folder | Description |
|-------------|-------------|
| `cross-platform-report.md` | Complete report: 3 matrix tables + coverage checks + summary |
| `screenshots/` | All overlaid screenshots with MSSV email (final) |
| `screenshots/raw/` | Raw screenshots before overlay |
| `scripts/browserstack_capture.py` | BrowserStack API script (agent-generated) |
| `scripts/add_overlay.py` | MSSV overlay script (agent-generated) |

### Review Checkpoint ⏸
Before proceeding, verify:
- [ ] 30 screenshots exist (10 per screen × 3 screens)
- [ ] All screenshots have MSSV email overlay visible at the bottom
- [ ] Coverage passes: every OS ≥ 1, every browser ≥ 1, every device class ≥ 1 (per screen)
- [ ] Every cell is marked Pass ✅ or Fail ❌
- [ ] All Fail cells have: defect type + 1-line description
- [ ] `cross-platform-report.md` contains all 3 matrix tables + cross-screen summary

**User approval required to proceed to Stage 5.**



---

## Stage 5 — AI Audit Log & Critique

### Skill
`ai-audit-logger` — [SKILL.md](.agents/skills/ai-audit-logger/SKILL.md)

### Purpose
Compile the complete AI Audit Report logging every AI interaction across Stages 1–4, and write the 200–300 word AI Critique.

### User Action
Send the following prompt:

```
Run the ai-audit-logger skill.

Context:
- Review all AI interactions from Stages 1–4
- Check the conversation history for all prompts sent and outputs received
- For each interaction, record: AI tool, date/time, task context, prompt, output summary, human modifications

Generate:
1. AI Audit Report with:
   - Declaration: "I use AI tools for the following tasks: ..."
   - Tool summary table
   - Complete interaction log (chronological)
   - Statistics (total interactions, per task, modification rate)

2. AI Critique (200–300 words) addressing:
   - Where did AI get things wrong, biased, or incomplete?
   - Why did AI fail to catch certain issues?
   - What principles did you learn about AI collaboration?

Save all outputs to artifacts/05-audit/.
```

### Expected Output in `artifacts/05-audit/`
| File | Description |
|------|-------------|
| `ai-audit-report.md` | Complete AI Audit Report with interaction log |
| `ai-critique.md` | 200–300 word AI Critique |

### Review Checkpoint ⏸
Before proceeding, verify:
- [ ] Declaration is present and accurate
- [ ] All significant AI interactions are logged
- [ ] Each log entry has: tool, date/time, prompt, output summary, human review
- [ ] AI Critique is 200–300 words (count them)
- [ ] Critique addresses: AI errors, root causes, lessons learned

**User approval required to proceed to Stage 6.**

---

## Stage 6 — Final Report Assembly

### Skill
`report-assembler` — [SKILL.md](.agents/skills/report-assembler/SKILL.md)

### Purpose
Aggregate all outputs from Stages 1–5 into the final submission package: main report, Bug & Usability Findings Log, README with self-assessment, and verify completeness.

### User Action
Send the following prompt:

```
Run the report-assembler skill.

Context:
- Student: {Name} — {MSSV}
- Group: {Group ID}
- Scenario: {A | B | C | D}
- Self-assessed grade: {000–100}

Collect artifacts from:
- artifacts/01-checklist/ (checklist, references, prompts)
- artifacts/02-execution/ (execution results, bug reports)
- artifacts/03-usability/ (usability report)
- artifacts/04-cross-platform/ (cross-platform report, screenshots)
- artifacts/05-audit/ (audit report, critique)

Generate:
1. Main report (main-report.md) — combines all task results
2. Bug & Usability Findings Log (findings-log.md) — consolidated from Tasks 1–3
3. README.md — self-assessment table + test summary
4. Completeness check — verify nothing is missing
5. Git commit log — summarise the testing process steps

Save all outputs to artifacts/06-report/.
Also copy the final README.md to the project root.
```

### Expected Output in `artifacts/06-report/`
| File | Description |
|------|-------------|
| `main-report.md` | Complete main report |
| `main-report.pdf` | PDF export of main report |
| `findings-log.md` | Bug & Usability Findings Log |
| `README.md` | Self-assessment + test summary |
| `completeness-check.md` | Submission completeness verification |
| `git-commit-log.txt` | Git commit history |

### Final Review Checkpoint ⏸
Before submission, verify:
- [ ] Main report contains all sections (scenario, checklist, execution, usability, cross-platform)
- [ ] Findings Log has all entries consistent with Google Form submissions
- [ ] README has accurate test summary and self-assessment table
- [ ] All completeness check items are checked ✅
- [ ] Zip filename follows format: `{MSSV}_HW03_AI_GUIUsability_EMS_{Grade}.zip`

---

## Quick Reference — Stage Prompts

| Stage | Quick Prompt | Output Folder |
|-------|-------------|---------------|
| 0 | "Set up HW03 project for Scenario {X}, screens {X1, X2, X3}" | project root |
| 1 | "Run gui-checklist-builder skill, save to artifacts/01-checklist/" | `artifacts/01-checklist/` |
| 2 | "Run checklist-executor skill on screens {X1, X2, X3}, save to artifacts/02-execution/" | `artifacts/02-execution/` |
| 3 | "Run heuristic-usability-evaluator skill, save to artifacts/03-usability/" | `artifacts/03-usability/` |
| 4 | "Run cross-platform-matrix-generator skill, save to artifacts/04-cross-platform/" | `artifacts/04-cross-platform/` |
| 5 | "Run ai-audit-logger skill, save to artifacts/05-audit/" | `artifacts/05-audit/` |
| 6 | "Run report-assembler skill, save to artifacts/06-report/" | `artifacts/06-report/` |

---

## Rules

- **AI-First strategy**: Use AI as a disciplined assistant. Guide it through each step of the technique — do not issue a single generic prompt.
- **Human review mandatory**: Every AI output must be reviewed. The agent must stop and present results for approval at each review checkpoint.
- **Evidence required**: Screenshots must come from the live EMS. Never fabricate or AI-generate screenshots.
- **Documentation**: All work must be in Markdown. Keep a running audit log of every AI interaction.
- **Artifact organisation**: All outputs go to the corresponding `artifacts/{NN}-{stage}/` folder. Never mix outputs from different stages.
- **Git commits**: Create a git commit after completing each stage.
- **Language**: All reports and documentation should be written in English unless specified otherwise.

## EMS Access

| Resource | Value |
|----------|-------|
| **SUT URL** | `https://prod-dev.ems-fitus.cloud/` |
| **User account** | `23127379@student.hcmus.edu.vn` / `Minhhuy1407@` |
| **User account** | Register your own via the EMS sign-up flow |
