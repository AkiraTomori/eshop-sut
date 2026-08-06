---
name: heuristic-usability-evaluator
description: >
  Conduct a User Testing study with 5 real participants on ≥3 EMS screens.
  Designs task scenarios, session templates, SUS questionnaire, and participant
  sheets. After the human runs the 5 sessions and fills in raw data, this skill
  analyses results and assembles a complete Usability Report for HW03 Task 2.
---

# User Testing — Usability Evaluator

## Purpose

This skill supports **HW03 Task 2 — User Testing with 5 real participants**.
Instead of a solo expert review, the workflow involves:

1. **Agent** prepares all testing materials (templates, questionnaires, scenarios)
2. **Human** runs 5 real user sessions (think-aloud, observation, SUS collection)
3. **Agent** analyses the collected data and assembles the Usability Report

> ⚠️ **The agent cannot conduct real user sessions.** All sessions must be run
> by the student with real participants from outside the class.

---

## Workflow

### Phase 1 — Design & Preparation (Agent)

#### Step 1 — Write the Task Scenario

Write a **goal-oriented task scenario** for Scenario B, screens B1, B2, B4:

- **Format**: Give the participant a realistic goal, NOT step-by-step instructions
- **Example (Scenario B)**: *"You just heard about an upcoming workshop on campus.
  Find the event on EMS, register for it, and show me your check-in QR code."*
- Scenarios must exercise all 3 target screens naturally within the flow

Output: `task-scenario.md`

#### Step 2 — Define Measurement Criteria

Minimum required metrics per session:

| Metric | How to Measure |
|--------|---------------|
| **Task Success** | Completed ✅ / Partial ⚠️ / Failed ❌ |
| **Time on Task** | Stopwatch from task start to completion/give-up |
| **Error Count** | Number of wrong actions / recovery attempts |
| **Hesitation Count** | Visible pauses > 3 seconds, verbal uncertainty |
| **SUS Score** | 10-item questionnaire after task (0–100) |
| **Open Probes** | 4 open questions on clarity, recovery, speed, trust |

Output: recorded in `session-template.md`

#### Step 3 — Create Session Materials

Generate four documents:

1. **`task-scenario.md`** — Task instructions to read aloud to participant
2. **`session-template.md`** — Structured observation notes form (one per session)
3. **`sus-questionnaire.md`** — 10 SUS items + 4 open probes in Vietnamese + English
4. **`participant-sheet.md`** — Participant info table with masked contacts

#### Step 4 — Create Data Collection Sheet

Generate `data-collection-sheet.md` with:
- One row per participant (P1–P5)
- Columns: Task Success, Time, Errors, Hesitations, SUS Score, Key Quote
- Space to paste raw SUS answers for calculation

---

### Phase 2 — Run Sessions (Human Only)

> The agent cannot perform this phase. Instructions are provided below for reference.

**Before each session:**
- Print or open `session-template.md` on a separate device
- Have `sus-questionnaire.md` ready to hand to participant after task
- Set up screen recording + audio if participant consents

**During each session:**
1. Introduce the study: *"We are testing the product, not you."*
2. Ask participant to **think aloud** — narrate what they are doing and feeling
3. Read the task scenario from `task-scenario.md` — do NOT show the steps
4. Observe neutrally — only intervene if participant is completely stuck
5. Record: time, errors, hesitations, notable quotes

**After each session:**
1. Give participant `sus-questionnaire.md` to fill in
2. Ask the 4 open probe questions and note answers
3. Fill in `data-collection-sheet.md` with metrics from this session
4. Save session notes as `session-notes-P{N}.md`

**Pilot session:**
- Run 1 pilot with a non-participant before the 5 real sessions
- Adjust scenario wording if pilot reveals confusing instructions

---

### Phase 3 — Analysis & Report (Agent, after human provides data)

#### Step 5 — Calculate SUS Scores

For each participant, calculate SUS score:
- Odd items (Q1,3,5,7,9): `(score − 1)`
- Even items (Q2,4,6,8,10): `(5 − score)`
- Sum all adjusted scores × 2.5 = SUS score (0–100)

Aggregate: mean, min, max, standard deviation across 5 participants.

SUS interpretation scale:
| Score | Adjective | Acceptability |
|-------|-----------|---------------|
| 85+ | Excellent | Acceptable |
| 72–84 | Good | Acceptable |
| 52–71 | OK | Marginal |
| 38–51 | Poor | Not acceptable |
| < 38 | Awful | Not acceptable |

#### Step 6 — Analyse Task Metrics

Build summary table:

| Participant | Task Success | Time (min) | Errors | Hesitations | SUS |
|-------------|-------------|------------|--------|-------------|-----|
| P1 | ... | ... | ... | ... | ... |
| Mean | — | — | — | — | — |

#### Step 7 — Identify & Prioritise Usability Findings

1. **Group pain points**: cluster observations with the same root cause across participants
2. **Classify**:
   - **Isolated bug**: Happened with 1 participant only
   - **Systemic issue**: Happened with ≥2 participants (design problem)
3. **Assign severity** (Nielsen 0–4):
   - 0 — Not a real problem
   - 1 — Cosmetic only
   - 2 — Minor (fix when time allows)
   - 3 — Major (high priority)
   - 4 — Catastrophe (must fix — blocks task completion)
4. **Map to heuristic**: Assign N1–N10 reference to each finding

#### Step 8 — Compile Usability Report

Assemble `usability-report.md` with sections:

1. **Introduction** — Scenario B, screens B1/B2/B4, methodology summary
2. **Participant Table** — 5 participants with masked contact (middle 4 digits hidden)
3. **Task Scenario** — Goal-oriented task text used in sessions
4. **Task Metrics Table** — Success rate, avg time, errors, hesitations
5. **SUS Results** — Individual scores, mean, interpretation, adjective label
6. **Usability Findings** — Ranked by severity, with: finding ID, description, heuristic ref, severity, screens affected, evidence quote, screenshot ref
7. **Recommendations** — Prioritised list with effort estimate
8. **Appendix** — Raw session notes, SUS raw data, screenshots

---

## Output Deliverables

Save all outputs to `artifacts/03-usability/`:

| File | Phase | Description |
|------|-------|-------------|
| `task-scenario.md` | Phase 1 | Task script to read to participants |
| `session-template.md` | Phase 1 | Observation notes form (one copy per session) |
| `sus-questionnaire.md` | Phase 1 | SUS 10 items + 4 open probes (VI + EN) |
| `participant-sheet.md` | Phase 1 | Recruitment info + masked contact list |
| `data-collection-sheet.md` | Phase 1 | Aggregation table for 5 sessions |
| `session-notes-P1.md` … `P5.md` | Phase 2 | Filled by human after each session |
| `usability-report.md` | Phase 3 | Complete Usability Report |
| `usability-findings.md` | Phase 3 | Structured findings for report-assembler |
| `screenshots/` | Phase 3 | Evidence screenshots |

---

## Screens in Scope (Scenario B)

| Screen | Name | Flow Position |
|--------|------|---------------|
| **B1** | Events List / Discovery | Participant finds the target event |
| **B2** | Event Detail | Participant views details, clicks Register |
| **B4** | Registration Confirmation / QR Code | Participant completes registration and views QR |

---

## Integration with Other Skills

- **Input from**: `checklist-executor` (cross-reference failed items as usability context)
- **Output to**: `report-assembler` (usability report + findings as appendices)
- **Logs to**: `ai-audit-logger` (all AI interactions during this stage)
