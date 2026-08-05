# Usability Report — Template

> Replace all `{placeholders}` with actual values. Delete sections that don't apply.

---

# Usability Report — Scenario {A|B|C|D}

**Author**: {Student Name} — {MSSV}
**Date**: {YYYY-MM-DD}
**Screens Evaluated**: {ScreenID1}, {ScreenID2}, {ScreenID3}

---

## 1. Introduction

### 1.1 Scope
This report evaluates the usability of **Scenario {X}** — *{scenario description}* — within the EMS (Event Management System). The evaluation covers the following screens:

| Screen ID | Screen Name | URL Path |
|-----------|-------------|----------|
| {X1} | {Screen 1 name} | `/{path}` |
| {X2} | {Screen 2 name} | `/{path}` |
| {X3} | {Screen 3 name} | `/{path}` |

### 1.2 Methodology
- **Heuristic Evaluation** using Nielsen's 10 Usability Heuristics (Severity 0–4)
- **Task-Based Walkthrough** with a defined user goal
- **Standardised Scoring** *(optional)* — SUS / UEQ-S with {N} participants
- **Synthesis and Prioritisation** of findings

---

## 2. Heuristic Evaluation Results

### Screen: {X1} — {Screen 1 Name}

| Issue ID | Heuristic | Element | Description | Severity | Recommendation | Screenshot |
|----------|-----------|---------|-------------|----------|----------------|------------|
| UE-X1-001 | N1 — Visibility of System Status | {element} | {description} | {0-4} | {recommendation} | `{screenshot.png}` |
| UE-X1-002 | N9 — Error Recovery | {element} | {description} | {0-4} | {recommendation} | `{screenshot.png}` |

### Screen: {X2} — {Screen 2 Name}

| Issue ID | Heuristic | Element | Description | Severity | Recommendation | Screenshot |
|----------|-----------|---------|-------------|----------|----------------|------------|
| UE-X2-001 | ... | ... | ... | ... | ... | ... |

### Screen: {X3} — {Screen 3 Name}

| Issue ID | Heuristic | Element | Description | Severity | Recommendation | Screenshot |
|----------|-----------|---------|-------------|----------|----------------|------------|
| UE-X3-001 | ... | ... | ... | ... | ... | ... |

### Summary by Heuristic

| Heuristic | Issues Found | Avg Severity | Most Affected Screen |
|-----------|-------------|--------------|----------------------|
| N1 — Visibility of System Status | {N} | {X.X} | {ScreenID} |
| N2 — Match Real World | {N} | {X.X} | {ScreenID} |
| N3 — User Control & Freedom | {N} | {X.X} | {ScreenID} |
| N4 — Consistency & Standards | {N} | {X.X} | {ScreenID} |
| N5 — Error Prevention | {N} | {X.X} | {ScreenID} |
| N6 — Recognition vs Recall | {N} | {X.X} | {ScreenID} |
| N7 — Flexibility & Efficiency | {N} | {X.X} | {ScreenID} |
| N8 — Aesthetic & Minimal | {N} | {X.X} | {ScreenID} |
| N9 — Error Recovery | {N} | {X.X} | {ScreenID} |
| N10 — Help & Documentation | {N} | {X.X} | {ScreenID} |

---

## 3. Task-Based Walkthrough

### 3.1 User Goal
> "{Realistic user goal for this scenario}"
>
> **Persona**: {Role — e.g., Student, Admin, Guest}
> **Pre-conditions**: {e.g., Logged in as student, no prior registrations}

### 3.2 Walkthrough Steps

| Step | Action | Expected Outcome | Actual Outcome | Friction? | Notes |
|------|--------|-------------------|----------------|-----------|-------|
| 1 | {action} | {expected} | {actual — ✅/❌} | {Yes/No} | {notes} |
| 2 | {action} | {expected} | {actual} | {Yes/No} | {notes} |
| ... | ... | ... | ... | ... | ... |

### 3.3 Friction Point Summary

| # | Location | Type | Description | Impact |
|---|----------|------|-------------|--------|
| 1 | {screen/element} | Dead End / Confusion / Delay | {description} | {High/Med/Low} |

---

## 4. Standardised Score *(Optional)*

### 4.1 Participants

| # | Name | Contact (masked) | Role |
|---|------|-------------------|------|
| 1 | {Name} | {09xx****xx} | {Student/Lecturer/Guest} |

### 4.2 SUS Results

| Participant | Q1 | Q2 | Q3 | Q4 | Q5 | Q6 | Q7 | Q8 | Q9 | Q10 | SUS Score |
|-------------|----|----|----|----|----|----|----|----|----|----|-----------|
| P1 | {1-5} | ... | ... | ... | ... | ... | ... | ... | ... | ... | {0-100} |
| **Average** | | | | | | | | | | | **{avg}** |

**Interpretation**: {Score interpretation based on adjective rating scale}

### 4.3 Open-Ended Responses Summary

| Question | Common Themes |
|----------|---------------|
| Most confusing part? | {summary} |
| Error recovery? | {summary} |
| Speed perception? | {summary} |
| Trust level? | {summary} |

---

## 5. Synthesis

### 5.1 Isolated Bugs vs Systemic Design Issues

**Isolated Bugs** (one-off defects):
1. {Bug description — specific to one screen/element}

**Systemic Design Issues** (recurring patterns):
1. {Pattern description — affects multiple screens}

### 5.2 Findings Distribution

| Category | Count | Severity 4 | Severity 3 | Severity 2 | Severity 1 | Severity 0 |
|----------|-------|------------|------------|------------|------------|------------|
| Isolated bugs | {N} | {N} | {N} | {N} | {N} | {N} |
| Systemic issues | {N} | {N} | {N} | {N} | {N} | {N} |
| **Total** | **{N}** | **{N}** | **{N}** | **{N}** | **{N}** | **{N}** |

---

## 6. Prioritised Recommendations

| Priority | Recommendation | Severity | Screens Affected | Issue IDs | Effort |
|----------|---------------|----------|-------------------|-----------|--------|
| 1 | {recommendation} | {3-4} | {screens} | {UE-XX-NNN} | {Low/Med/High} |
| 2 | {recommendation} | {3-4} | {screens} | {UE-XX-NNN} | {Low/Med/High} |
| 3 | {recommendation} | {2-3} | {screens} | {UE-XX-NNN} | {Low/Med/High} |

---

## 7. Appendix

### A. Screenshots

{Embed or link to all screenshots referenced in this report}

### B. Raw Data

{Include raw SUS/UEQ-S questionnaire responses if applicable}
