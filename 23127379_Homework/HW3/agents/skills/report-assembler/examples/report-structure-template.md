# Report Structure — Template

> This template shows the final submission file structure and document formats.

---

## Submission File Structure

```
{MSSV}_HW03_AI_GUIUsability_EMS_{Grade}.zip
├── README.md                          ← Self-assessment + test summary
├── main-report.md                     ← Main report (Markdown)
├── main-report.pdf                    ← Main report (PDF)
│
├── group/                             ← Group deliverables
│   ├── shared-gui-checklist.md        ← GUI checklist (>40 items)
│   ├── checklist-references.md        ← Reference sources
│   └── checklist-prompts.md           ← AI prompts used
│
├── task1-checklist/                    ← Task 1B — Checklist execution
│   ├── checklist-execution-X1.md      ← Per-screen results
│   ├── checklist-execution-X2.md
│   ├── checklist-execution-X3.md
│   ├── execution-summary.md           ← Cross-screen summary
│   └── bug-reports.md                 ← All bug reports
│
├── task2-usability/                   ← Task 2 — Usability Report
│   └── usability-report.md
│
├── task3-cross-platform/              ← Task 3 — Cross-platform
│   ├── cross-platform-report.md
│   └── screenshots/                   ← All cross-platform screenshots
│       ├── X1_Win11_Chrome_Desktop.png
│       ├── X1_Win11_Firefox_Desktop.png
│       └── ...
│
├── findings/                          ← Bug & Usability Findings
│   └── findings-log.md               ← Aggregated findings log
│
├── screenshots/                       ← All testing screenshots
│   ├── checklist/                     ← Failed checklist item screenshots
│   │   ├── X1_IA-01-002_fail.png
│   │   └── ...
│   └── usability/                     ← Usability issue screenshots
│       ├── UE-X1-001.png
│       └── ...
│
├── ai/                                ← AI documentation
│   ├── ai-audit-report.md            ← AI Audit Report
│   └── ai-critique.md                ← AI Critique (200–300 words)
│
├── git-commit-log.txt                 ← Git commit history
│
└── skills/                            ← Agent Skills
    ├── gui-checklist-builder/
    ├── checklist-executor/
    ├── heuristic-usability-evaluator/
    ├── cross-platform-matrix-generator/
    ├── ai-audit-logger/
    └── report-assembler/
```

---

## Bug & Usability Findings Log Format

```markdown
# Bug & Usability Findings Log

**Student**: {Name} — {MSSV}
**Scenario**: {X}
**Total Findings**: {N}

| ID | Scenario/Screen | Type | Description | Steps/Heuristic | Severity | Suggested Fix | Screenshot Ref | Form Timestamp |
|----|----------------|------|-------------|-----------------|----------|---------------|----------------|----------------|
| F-001 | {scenario/screen} | Bug | {description} | {steps} | {1-4} | {fix} | `{file.png}` | {timestamp} |
| F-002 | {scenario/screen} | Usability | {description} | {heuristic} | {0-4} | {fix} | `{file.png}` | {timestamp} |
```

---

## README.md Format

```markdown
# HW03 — GUI & Usability Testing on EMS

## Student Information

| Field | Value |
|-------|-------|
| Name | {Name} |
| MSSV | {MSSV} |
| Group | {Group ID} |
| Scenario | {X — description} |
| Email | {MSSV}@{domain}.edu.vn |

## Test Summary

| Metric | Value |
|--------|-------|
| Scenario | {X} — {description} |
| Screens tested | {X1, X2, X3} |
| Checklist items (total) | {N} |
| Checklist items executed | {N × screens} |
| Pass / Fail / N/A | {N} / {N} / {N} |
| Bugs found | {N} |
| Usability issues | {N} (Sev 4: {N}, Sev 3: {N}, Sev 2: {N}, Sev 1: {N}, Sev 0: {N}) |
| Compatibility cells | {N} (Pass: {N}, Fail: {N}) |
| SUS score | {N/A or score} |
| Demo video | [YouTube link]({url}) |

## Self-Assessment

| No. | Criteria | Max | Self |
|-----|----------|-----|------|
| 1a | Shared checklist + refs + prompts (group) | 15 | {X} |
| 1b | Checklist execution + bugs (individual) | 15 | {X} |
| 2 | Usability Report | 25 | {X} |
| 3 | Cross-platform matrix | 25 | {X} |
| 4 | Findings submission + log | 10 | {X} |
| 5 | Agent Skills | 10 | {X} |
| | **Total** | **100** | **{X}** |

## File Structure

(See tree above)

## Agent Skills

| Skill | Purpose | Demo |
|-------|---------|------|
| gui-checklist-builder | Design GUI checklists | [Video]({url}) |
| checklist-executor | Execute checklists on screens | [Video]({url}) |
| heuristic-usability-evaluator | Usability evaluation | [Video]({url}) |
| cross-platform-matrix-generator | Compatibility testing | [Video]({url}) |
| ai-audit-logger | AI interaction logging | [Video]({url}) |
| report-assembler | Final report assembly | [Video]({url}) |
```
