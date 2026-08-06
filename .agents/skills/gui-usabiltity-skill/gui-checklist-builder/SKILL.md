---
name: gui-checklist-builder
description: >
  Design a reusable GUI testing checklist (>40 items) for a web application,
  grounded in recognised UI heuristics (Nielsen 10, Norman 6, Shneiderman 8)
  and covering four Interface Aspects: General UI Standards (IA-01), Forms (IA-02),
  Navigation (IA-03), and Feedback/State (IA-04). Targets EMS (Event Management System)
  but is adaptable to any web SUT.
---

# GUI Checklist Builder

## Purpose

This skill guides the agent through designing a comprehensive GUI testing checklist
that meets the requirements of HW03 Task 1A. The checklist must:

- Contain **more than 40 items** total
- Cover all **four Interface Aspects** (IA-01 through IA-04)
- Be grounded in **recognised heuristic frameworks**
- Include **reference sources** and **AI prompts** used during creation
- Identify items the AI missed and explain why

## Workflow

### Step 1 — Gather Context

1. **Identify the SUT** (System Under Test). For HW03 this is the EMS web application.
2. **Read the Interface Aspects** to understand what dimensions the checklist must cover:
   - **IA-01: General UI Standards** — layout, alignment, typography, colour, consistency, i18n EN/VI, empty/loading states.
   - **IA-02: Forms** — labels, validation, error placement, required-field handling, uploads, rich-text editor.
   - **IA-03: Navigation** — menus, breadcrumbs, tabs, sidebar, drag-and-drop reorder, back/return actions, deep links.
   - **IA-04: Feedback / State** — toasts, badges, confirmation dialogs, progress bars, status colours, real-time updates.
3. **Load heuristic references** from `references/heuristics-summary.md` for Nielsen, Norman, Shneiderman, and WCAG criteria.

### Step 2 — Generate Initial Checklist with AI

1. Craft a **structured prompt** that:
   - Specifies the SUT type (web application for event management)
   - Lists the 4 Interface Aspects with their scope
   - References the heuristic frameworks explicitly (Nielsen 10, Norman 6, Shneiderman 8, WCAG key criteria)
   - Asks for a specific output format: `ID | Description | Heuristic Ref | Widget/Area | Priority`
   - Requests per-widget coverage (TextBox, Dropdown, Button, Image, Grid, DatePicker, Modal, Toast, FileUpload, RichTextEditor, DragDrop, ProgressBar, Tab, Sidebar, Carousel)
   - Sets a minimum of 40 items distributed across the 4 IAs
2. **Record the prompt** in the AI Audit Log (invoke `ai-audit-logger` skill).
3. Parse the AI output into the structured checklist format.

### Step 3 — Critical Review & Human Additions

1. **Review each item** for:
   - Relevance to the EMS SUT specifically
   - Correct heuristic reference mapping
   - Testability (is the item concrete enough to mark Pass/Fail?)
   - Priority assignment (High / Med / Low)
2. **Identify gaps** the AI commonly misses. Check specifically for:
   - Accessibility (WCAG 2.x criteria — contrast, keyboard nav, screen reader)
   - Right-to-left (RTL) layout support
   - Dark mode / theme switching
   - Keyboard-only navigation
   - Internationalisation (EN/VI language switch behaviour)
   - Touch target minimum sizes
   - Zoom behaviour (200% zoom)
   - Empty states and loading states
   - Error state preservation (form data not lost on server error)
3. **Add human-authored items** for each gap. For every item added beyond the AI output, document:
   - The item itself
   - **Why the AI missed it** (prompt quality, model limitation, SUT-specific characteristic)

### Step 4 — Structure & Validate

1. Organise items into 4 sections: IA-01, IA-02, IA-03, IA-04.
2. Assign sequential IDs: `IA-01-001`, `IA-01-002`, ... `IA-04-NNN`.
3. Verify **coverage**:
   - Total items > 40
   - Each IA has ≥ 8 items
   - At least 12 distinct widget types are referenced
   - At least 3 heuristic frameworks are cited per IA section
4. Create a **Coverage Summary** table showing: IA Category, Item count, High/Med/Low breakdown, WCAG codes covered, Heuristic frameworks covered.
5. Create a **Widget Coverage Verification** table listing each widget and the items that test it.

### Step 5 — Output Deliverables

Generate the following files:

1. **`shared-gui-checklist.md`** — The complete checklist in Markdown table format with:
   - Header metadata (SUT type, generation date, total items)
   - Reference Sources section
   - 4 IA sections with tables
   - Coverage Summary
   - Widget Coverage Verification
2. **`checklist-prompts.md`** — All AI prompts used to generate and refine the checklist.
3. **`checklist-references.md`** — Bibliography of all reference sources (books, articles, standards, course slides).

## Output Format

Each checklist item must follow this schema:

```markdown
| ID | Description | Heuristic Ref | Widget / Area | Priority |
```

Where:
- **ID**: `IA-XX-NNN` format
- **Description**: A specific, testable statement that can be marked Pass or Fail
- **Heuristic Ref**: Abbreviated references (e.g., `N4` = Nielsen #4, `S1` = Shneiderman #1, `NOR2` = Norman #2, `WCAG1.4.3` = WCAG success criterion 1.4.3)
- **Widget / Area**: The UI widget or area being tested
- **Priority**: `High`, `Med`, or `Low`

## Heuristic Reference Abbreviations

| Abbreviation | Source |
|---|---|
| N1–N10 | Nielsen's 10 Usability Heuristics |
| NOR1–NOR6 | Norman's 6 Design Principles |
| S1–S8 | Shneiderman's 8 Golden Rules |
| WCAGX.X.X | WCAG 2.x Success Criteria |
| W-Widget | Per-widget checklist (from course slides) |

## Quality Criteria

- ❌ **Reject** items that are too vague to test (e.g., "The UI looks good")
- ❌ **Reject** duplicate items across IA sections
- ✅ **Accept** items that reference a specific widget, state, or interaction
- ✅ **Accept** items that map to at least one heuristic reference
- ✅ **Require** at least one screenshot-worthy test condition per IA section
