---
name: report-assembler
description: >
  Aggregate outputs from all other HW03 skills (gui-checklist-builder, checklist-executor,
  heuristic-usability-evaluator, cross-platform-matrix-generator, ai-audit-logger) into
  the final submission package. Produces the main report, Bug & Usability Findings Log,
  README with self-assessment, and verifies completeness. Corresponds to HW03 §15.
---

# Report Assembler

## Purpose

This skill assembles all the individual deliverables from the other 5 skills into
a complete, submission-ready package that meets all the requirements of HW03 §15.
It also performs a completeness check to ensure nothing is missing.

## Prerequisites

- Completed outputs from:
  - `gui-checklist-builder` → shared checklist, references, prompts
  - `checklist-executor` → per-screen execution results, bug reports
  - `heuristic-usability-evaluator` → usability report
  - `cross-platform-matrix-generator` → compatibility matrix results
  - `ai-audit-logger` → audit report, AI critique

## Workflow

### Step 1 — Collect All Deliverables

Scan the workspace for the following files and verify each exists:

| Source Skill | File | Required? |
|---|---|---|
| gui-checklist-builder | `shared-gui-checklist.md` | ✅ Yes (group) |
| gui-checklist-builder | `checklist-prompts.md` | ✅ Yes (group) |
| gui-checklist-builder | `checklist-references.md` | ✅ Yes (group) |
| checklist-executor | `checklist-execution-{ScreenID}.md` (×3+) | ✅ Yes |
| checklist-executor | `bug-reports.md` | ✅ Yes |
| checklist-executor | `execution-summary.md` | ✅ Yes |
| heuristic-usability-evaluator | `usability-report.md` | ✅ Yes |
| cross-platform-matrix-generator | `cross-platform-report.md` | ✅ Yes |
| cross-platform-matrix-generator | `screenshots/` (directory) | ✅ Yes |
| ai-audit-logger | `ai-audit-report.md` | ✅ Yes |
| ai-audit-logger | `ai-critique.md` | ✅ Yes |

### Step 2 — Generate Bug & Usability Findings Log

Consolidate **all** findings from Tasks 1–3 into a single file:

```markdown
# Bug & Usability Findings Log

| ID | Scenario/Screen | Type | Description | Steps/Heuristic | Severity | Suggested Fix | Screenshot Ref | Form Submission Timestamp |
|----|----------------|------|-------------|-----------------|----------|---------------|----------------|--------------------------|
| F-001 | A2 — Add/Edit Event | Bug | No inline validation on required fields | 1. Open Add Event 2. Tab past Title field | 2 | Add onBlur validation | `A2_IA-02-003_fail.png` | 2026-07-25 14:30 |
| F-002 | A2 — Add/Edit Event | Usability | Save Draft vs Publish buttons look identical | N5 — Error Prevention | 3 | Use distinct colours | `A2_IA-02-015_fail.png` | 2026-07-25 14:35 |
```

**Columns (mandatory)**:
1. **ID** — Sequential: `F-001`, `F-002`, ...
2. **Scenario/Screen** — e.g., `A2 — Add/Edit Event`
3. **Type** — `Bug` or `Usability`
4. **Description** — Clear, concise description
5. **Steps/Heuristic** — Steps to reproduce (for bugs) or heuristic violated (for usability)
6. **Severity** — 1–4 (for bugs) or 0–4 (for usability issues)
7. **Suggested Fix** — Actionable recommendation
8. **Screenshot Ref** — Filename of supporting screenshot
9. **Form Submission Timestamp** — When submitted to Google Form

### Step 3 — Generate Main Report

Assemble the main report document with the following structure:

```markdown
# HW03 — GUI & Usability Testing on EMS
## Main Report — Scenario {X}

**Student**: {Name} — {MSSV}
**Group**: {Group ID/Name}
**Date**: {YYYY-MM-DD}

---

## 1. Scenario Selection

### 1.1 Chosen Scenario
{Scenario letter and description}

### 1.2 Selected Screens
| Screen ID | Screen Name | Justification |
|-----------|-------------|---------------|
| {X1} | {name} | {why this screen was chosen} |
| {X2} | {name} | {why} |
| {X3} | {name} | {why} |

---

## 2. Task 1 — GUI Checklist

### 2.1 Shared Checklist (Group Deliverable)
{Reference to shared-gui-checklist.md}
{Reference to checklist-references.md and checklist-prompts.md}

### 2.2 Checklist Execution (Individual)
{Embed or reference per-screen execution results}
{Embed or reference execution summary}

### 2.3 Bug Reports
{Embed or reference bug-reports.md}

---

## 3. Task 2 — Usability Report
{Embed or reference usability-report.md}

---

## 4. Task 3 — Cross-Browser / Cross-Platform
{Embed or reference cross-platform-report.md}

---

## 5. Bug & Usability Findings Log
{Embed or reference findings-log.md}

---

## Appendix A — AI Audit Report
{Embed or reference ai-audit-report.md}

## Appendix B — AI Critique
{Embed or reference ai-critique.md}

## Appendix C — Git Commit Log
{Git log output}
```

### Step 4 — Generate README.md

Create the README with self-assessment table and test summary:

```markdown
# HW03 — GUI & Usability Testing on EMS

## Student Information
- **Name**: {Name}
- **MSSV**: {MSSV}
- **Group**: {Group ID}
- **Scenario**: {A|B|C|D} — {description}

## Test Summary

| Metric | Value |
|--------|-------|
| Scenario chosen | {X} |
| Screens tested | {list} |
| Checklist items designed | {N} |
| Checklist items executed | {N per screen × N screens} |
| Items passed | {N} |
| Items failed | {N} |
| Bugs found | {N} |
| Usability issues (Severity 4) | {N} |
| Usability issues (Severity 3) | {N} |
| Usability issues (Severity 2) | {N} |
| Usability issues (Severity 1) | {N} |
| Usability issues (Severity 0) | {N} |
| Compatibility cells covered | {N} |
| Demo video | {YouTube link} |

## Self-Assessment

| No. | Criteria | Grade | Self-Assessed Grade |
|-----|----------|-------|---------------------|
| 1a | Task 1A — Shared checklist (> 40 items, IA-01…IA-04) + reference sources + AI prompts (group) | 15 | {/15} |
| 1b | Task 1B — Checklist execution on ≥ 3 screens + bug reports (individual) | 15 | {/15} |
| 2 | Task 2 — Usability Report of the assigned package (heuristics + severity + recommendations) | 25 | {/25} |
| 3 | Task 3 — Cross-Browser / Cross-Platform matrix (3 OS × 5 browsers × 3 device classes) | 25 | {/25} |
| 4 | Bug & Usability Findings submission (Google Form) + aggregated log | 10 | {/10} |
| 5 | Agent Skills | 10 | {/10} |
| | **Total** | **100** | **{/100}** |

## File Structure
{Tree listing of all files in the submission}

## Agent Skills
{List of skills with brief descriptions + demo video links}
```

### Step 5 — Completeness Check

Run through this checklist to verify the submission is complete:

```markdown
## Submission Completeness Check

### Group Deliverables
- [ ] Shared GUI checklist (> 40 items, covers IA-01…IA-04)
- [ ] Reference sources list
- [ ] AI prompts used for checklist

### Individual Deliverables
- [ ] Main report (Markdown)
- [ ] Main report (PDF export)
- [ ] Scenario and ≥ 3 screens identified with justification
- [ ] Checklist execution results per screen (Pass/Fail + Notes)
- [ ] Screenshots for all Failed checklist items
- [ ] Bug reports with all required fields
- [ ] Usability Report (heuristic evaluation)
- [ ] Usability Report (task-based walkthrough)
- [ ] Usability Report (synthesis + prioritised recommendations)
- [ ] Cross-platform matrix per screen
- [ ] Coverage verification (every OS, browser, device class at least once)
- [ ] Cross-platform screenshots with MSSV overlay
- [ ] Bug & Usability Findings Log (consistent with Google Form submissions)
- [ ] AI Audit Report
- [ ] AI Critique (200–300 words)
- [ ] Git commit log (text file)
- [ ] Agent Skills + demo video link
- [ ] README.md with self-assessment table and test summary

### Naming
- [ ] Zip file named: `{MSSV}_HW03_AI_GUIUsability_EMS_{SelfAssessedGrade}.zip`
- [ ] Self-assessed grade is 3 digits (000–100)
```

### Step 6 — Package for Submission

1. Ensure all files are in the correct directory structure
2. Verify the zip filename format: `{MSSV}_HW03_AI_GUIUsability_EMS_{SelfAssessedGrade}.zip`
3. Check file sizes are reasonable (screenshots not too large)
4. Verify all cross-references between documents are valid

## Output Deliverables

1. **`main-report.md`** — Complete main report
2. **`findings-log.md`** — Bug & Usability Findings Log
3. **`README.md`** — Self-assessment and test summary
4. **`completeness-check.md`** — Verification checklist (all checked)

## Integration with Other Skills

- **Input from**: All other 5 skills
- **Output**: Final submission package

## Tips

1. **Run the completeness check early** — don't wait until the last minute
2. **Cross-reference findings**: Ensure the Findings Log matches Google Form submissions
3. **Check word count**: AI Critique must be 200–300 words
4. **Verify screenshots**: All Failed items and all cross-platform cells have evidence
5. **Git commit log**: Ensure it covers all major steps of the process
