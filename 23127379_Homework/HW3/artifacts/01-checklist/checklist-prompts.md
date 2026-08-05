# Checklist Prompts — AI Interaction Log

**SUT**: EMS (Event Management System)
**Stage**: 1 — GUI Checklist Design
**Date**: 2026-07-28
**Agent**: Antigravity (Claude Sonnet 4.6 Thinking)

---

## Prompt 1 — Initial Checklist Generation

**Purpose**: Generate the base GUI checklist covering all 4 Interface Aspects.

**Prompt sent to AI**:

```
You are a senior QA engineer specializing in web application GUI testing.

Generate a GUI testing checklist for EMS (Event Management System) — a web application 
for academic event management used by students and administrators.

The checklist MUST:
1. Contain at least 40 items total
2. Be organized into 4 Interface Aspects:
   - IA-01: General UI Standards (layout, typography, colour, i18n EN/VI, empty/loading states, consistency)
   - IA-02: Forms (labels, validation, error messages, required-field handling, file uploads, rich-text editor)
   - IA-03: Navigation (sidebar, breadcrumbs, tabs, drag-and-drop reorder, back/return actions, deep links)
   - IA-04: Feedback/State (toasts, badges, confirmation dialogs, progress bars, status colours, real-time updates)
3. Each item must follow this format:
   ID | Description | Heuristic Ref | Widget/Area | Priority
4. Ground items in these frameworks:
   - Nielsen's 10 Heuristics (N1–N10)
   - Norman's 6 Design Principles (NOR1–NOR6)
   - Shneiderman's 8 Golden Rules (S1–S8)
   - WCAG 2.x success criteria (e.g., WCAG1.4.3, WCAG2.1.1)
5. Cover these widgets: TextBox, Dropdown, Button, Image, Grid/Table, DatePicker, 
   Modal, Toast, FileUpload, RichTextEditor, DragDrop, ProgressBar, Tab, Sidebar, Carousel
6. Assign Priority: High, Med, or Low
7. Minimum 8 items per IA section

Produce a clean markdown table. Be specific and testable (each item must be Pass/Fail decidable).
```

**AI Output Summary**:  
The AI generated 42 items distributed across 4 IA sections. The output was well-structured with correct heuristic mappings for common interaction patterns. Items were mostly High and Med priority, with generic descriptions that required specificity improvements.

**Human Modifications**:  
- Adjusted 6 item descriptions for EMS-specific terminology (e.g., "entity" → "event", "record" → "registration")
- Corrected 4 heuristic mappings that were inaccurately assigned
- Rejected 2 items as too vague ("UI appears professional", "colours are pleasant")
- Added 12 human-authored items addressing AI gaps (documented in `ai-missed-items.md`)
- Final count: 52 items

---

## Prompt 2 — Gap Analysis Review

**Purpose**: Identify categories the initial AI output missed.

**Prompt sent to AI**:

```
Review the following GUI checklist and identify what categories of testing 
it has missed or underrepresented. Focus specifically on:
1. Accessibility (WCAG 2.x — contrast, keyboard navigation, screen reader support)
2. Internationalisation (EN/VI language switching)
3. Responsive design / zoom behaviour (WCAG 1.4.4, 1.4.10)
4. Touch target sizes (WCAG 2.5.8)
5. Empty states and loading states
6. Error state preservation (form data not lost on server error)
7. Dark mode / theme switching
8. Right-to-left (RTL) text rendering
9. Focus management (WCAG 2.4.3, 2.4.7)

For each gap, explain why a generic AI prompt tends to miss it.
```

**AI Output Summary**:  
The AI confirmed gaps in accessibility (keyboard nav, focus trapping), i18n (EN/VI switching not tested), zoom behaviour, and touch target sizes. It correctly identified that generic prompts tend to produce functional checklists but skip accessibility and internationalisation as they are "advanced" categories not implied by the domain prompt.

**Human Modifications**:  
Used the gap analysis to structure the `ai-missed-items.md` file with 12 additional items.

---

*All prompts logged as per HW03 AI Audit requirements (§10).*
