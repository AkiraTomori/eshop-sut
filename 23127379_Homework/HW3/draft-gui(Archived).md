# Shared GUI Testing Checklist — EMS

| Field | Value |
|-------|-------|
| **SUT** | EMS — Event Management System |
| **URL** | https://prod-dev.ems-fitus.cloud/ |
| **Generated** | 2026-07-28 |
| **Total Items** | 52 |
| **Framework** | Nielsen N1–N10 · Norman NOR1–NOR6 · Shneiderman S1–S8 · WCAG 2.x |
| **Group** | 06 — Thái Minh Huy (23127379) |

> **Format**: `ID | Description | Heuristic Ref | Widget/Area | Priority`
> Items are testable statements decidable as **Pass ✅** or **Fail ❌**.

---

## IA-01 — General UI Standards

*Scope: layout, alignment, typography, colour, consistency, i18n EN/VI, empty states, loading states.*

| ID | Description | Heuristic Ref | Widget / Area | Priority |
|----|-------------|---------------|---------------|----------|
| IA-01-001 | All pages use a consistent grid layout with no misaligned elements between views | N4, S1, NOR5 | Global Layout | High |
| IA-01-002 | Typography uses a single defined font family throughout the application (no unintentional font mixing) | N4, S1 | Global Layout | Med |
| IA-01-003 | Body text contrast ratio meets WCAG AA minimum (≥ 4.5:1 for normal text, ≥ 3:1 for large text) | WCAG1.4.3 | Global Layout | High |
| IA-01-004 | Colour alone is never the sole means of conveying information (icon or text always accompanies colour) | WCAG1.4.1, N4 | Status Badges, Alerts | High |
| IA-01-005 | Event banner images are displayed without distortion (correct aspect ratio maintained, no stretching) | NOR4, N4 | Image (W-Image) | Med |
| IA-01-006 | All images that convey information have descriptive alt text (decorative images have empty alt="") | WCAG1.1.1 | Image (W-Image) | High |
| IA-01-007 | Switching language from English to Vietnamese (or vice versa) changes all UI labels without page reload | N2, S2 | Language Switcher | High |
| IA-01-008 | After EN→VI language switch, no label remains in English (no mixed-language UI) | N4, S1 | Language Switcher | High |
| IA-01-009 | Empty state message is shown with a descriptive label (no blank white space) when no events/data are available | N1, NOR2 | Grid/Table (W-Grid) | High |
| IA-01-010 | A loading indicator (spinner or skeleton screen) is visible while data is being fetched | N1, S3, NOR2 | Global Layout | High |
| IA-01-011 | Page content does not overflow or require horizontal scrolling at 1280px desktop width | N8, S1 | Global Layout | Med |
| IA-01-012 | At 200% browser zoom, all text remains readable and no content is clipped or hidden | WCAG1.4.4 | Global Layout | High |
| IA-01-013 | At 320px viewport width, no horizontal scrollbar appears and all content reflows vertically | WCAG1.4.10 | Global Layout | High |
| IA-01-014 | Button styles are visually distinct by role: primary (solid), secondary (outlined), danger (red/destructive) | N4, S1, NOR6 | Button (W-Button) | High |
| IA-01-015 | Icon meanings are consistent across all screens (same icon always represents the same action) | N4, S1, NOR5 | Icons, Global Layout | Med |

---

## IA-02 — Forms

*Scope: labels, validation, error messages, required-field handling, file uploads, rich-text editor.*

| ID | Description | Heuristic Ref | Widget / Area | Priority |
|----|-------------|---------------|---------------|----------|
| IA-02-001 | Every input field has a persistent visible label (not a placeholder-only label) | WCAG3.3.2, N6, S8 | TextBox (W-TextBox) | High |
| IA-02-002 | Required fields are clearly marked with a visual indicator (asterisk * or "Required" label) | N5, NOR3, WCAG3.3.2 | TextBox, Dropdown | High |
| IA-02-003 | Inline validation error messages appear adjacent to the relevant field (not only at the top of the form) | N9, WCAG3.3.1 | TextBox (W-TextBox) | High |
| IA-02-004 | Error messages use plain language describing what went wrong and how to fix it (no error codes) | N9, WCAG3.3.3 | TextBox, Form | High |
| IA-02-005 | Submitting a form with validation errors preserves all previously entered data (no field clearing) | N3, S5, S6 | Form | High |
| IA-02-006 | Dropdowns display a visible arrow/chevron indicator and are operable by keyboard (Space/Enter opens, arrows navigate) | WCAG2.1.1, N7, NOR6 | Dropdown (W-Dropdown) | High |
| IA-02-007 | The selected value in a Dropdown is clearly displayed after selection | N1, NOR2 | Dropdown (W-Dropdown) | Med |
| IA-02-008 | Role Selection dropdown in Registration Form (B3) shows all available roles and filters Sub-role options correctly on selection | N2, N5, NOR3 | Dropdown (W-Dropdown) | High |
| IA-02-009 | Sub-role Selection updates correctly based on the Role chosen — invalid sub-roles are not shown | N5, NOR3 | Dropdown (W-Dropdown) | High |
| IA-02-010 | The FileUpload component shows accepted file formats and size limit before the user selects a file | N6, NOR1, WCAG3.3.2 | FileUpload (W-FileUpload) | High |
| IA-02-011 | During file upload, a progress indicator shows upload status in real time | N1, S3, NOR2 | FileUpload (W-FileUpload) | Med |
| IA-02-012 | After upload, a file preview (thumbnail or filename) is displayed and a Remove/Replace button is available | N3, NOR2 | FileUpload (W-FileUpload) | Med |
| IA-02-013 | The Rich-Text Editor toolbar buttons (Bold, Italic, Link, List) are keyboard accessible (Tab + Enter to activate) | WCAG2.1.1, N7 | RichTextEditor (W-RichTextEditor) | High |
| IA-02-014 | Content entered in the Rich-Text Editor is saved correctly and re-displays accurately on reopen | N4, NOR2 | RichTextEditor (W-RichTextEditor) | High |
| IA-02-015 | Date fields enforce valid range constraints (e.g., event end date cannot precede start date) | N5, NOR3 | DatePicker (W-DatePicker) | High |
| IA-02-016 | The DatePicker calendar is navigable by keyboard (arrow keys for days, Page Up/Down for months, Esc to close) | WCAG2.1.1, N7 | DatePicker (W-DatePicker) | High |
| IA-02-017 | The Registration Confirmation step (B3 final step) clearly summarises all selected options before the user submits | N6, S4, S8 | Modal / Confirmation (W-Modal) | High |

---

## IA-03 — Navigation

*Scope: sidebar, breadcrumbs, tabs, drag-and-drop reorder, back/return actions, deep links.*

| ID | Description | Heuristic Ref | Widget / Area | Priority |
|----|-------------|---------------|---------------|----------|
| IA-03-001 | The sidebar shows the currently active page with a distinct highlight (colour, bold, or indicator) | N1, N6, S8 | Sidebar (W-Sidebar) | High |
| IA-03-002 | The sidebar navigation links have correct `aria-current="page"` on the active item | WCAG4.1.2, N1 | Sidebar (W-Sidebar) | High |
| IA-03-003 | The sidebar is keyboard navigable (Tab and arrow keys move between items, Enter activates) | WCAG2.1.1, S2 | Sidebar (W-Sidebar) | High |
| IA-03-004 | On mobile viewports, the sidebar collapses into a hamburger menu and is still keyboard accessible | WCAG2.1.1, N7 | Sidebar (W-Sidebar) | Med |
| IA-03-005 | Breadcrumbs are present on detail and sub-pages (e.g., Events > Event Detail > Registration) | N6, S8, NOR1 | Breadcrumbs | High |
| IA-03-006 | Clicking a breadcrumb link navigates to the correct parent page | N3, NOR4 | Breadcrumbs | High |
| IA-03-007 | Tabs on the Event Detail page (B2) are keyboard navigable (arrow keys switch tabs, focus follows active tab) | WCAG2.1.1, N7, S2 | Tab (W-Tab) | High |
| IA-03-008 | The active tab is visually distinct from inactive tabs (underline, bold, or colour change) | N1, N4, S1 | Tab (W-Tab) | High |
| IA-03-009 | Clicking a Tab displays the correct corresponding panel content | N1, NOR2 | Tab (W-Tab) | High |
| IA-03-010 | Drag-and-drop items display a visible drag handle (≥ 24×24px) to indicate draggability | NOR1, NOR6, WCAG2.5.8 | DragDrop (W-DragDrop) | High |
| IA-03-011 | During drag-and-drop, the drop target zone is visually highlighted | NOR2, NOR4 | DragDrop (W-DragDrop) | Med |
| IA-03-012 | A keyboard alternative exists for drag-and-drop reorder (e.g., Move Up / Move Down buttons or keyboard shortcut) | WCAG2.5.7, S2 | DragDrop (W-DragDrop) | High |
| IA-03-013 | Deep links (direct URLs) load the correct screen without redirect to home | N3, S7, N7 | Global Navigation | Med |
| IA-03-014 | Browser Back button returns to the previous screen with correct state (e.g., filters preserved) | N3, S6, S7 | Global Navigation | High |

---

## IA-04 — Feedback / State

*Scope: toasts, badges, confirmation dialogs, progress bars, status colours, real-time updates.*

| ID | Description | Heuristic Ref | Widget / Area | Priority |
|----|-------------|---------------|---------------|----------|
| IA-04-001 | A toast notification appears after every successful user action (e.g., save, submit, register) | N1, S3, NOR2 | Toast (W-Toast) | High |
| IA-04-002 | A toast notification appears after every failed action with a descriptive error message | N9, S3, NOR2 | Toast (W-Toast) | High |
| IA-04-003 | Success toasts are green, error toasts are red, warning toasts are yellow — colours are semantically consistent | N4, S1, NOR5 | Toast (W-Toast) | High |
| IA-04-004 | Toasts have a visible dismiss (×) button and auto-dismiss no sooner than 5 seconds | WCAG2.2.1, N3, S7 | Toast (W-Toast) | High |
| IA-04-005 | Toast messages are announced to screen readers via `role="status"` or `role="alert"` | WCAG4.1.3, S2 | Toast (W-Toast) | High |
| IA-04-006 | The Event Detail page (B2) shows the correct registration status badge (Open / Full / Waitlisted / Closed) | N1, NOR2, S3 | Status Badge | High |
| IA-04-007 | The status badge uses both colour and text label (not colour alone) to convey state | WCAG1.4.1, N4 | Status Badge | High |
| IA-04-008 | The Register button on Event Detail (B2) is disabled and labelled "Full" when capacity is reached | N5, NOR3, S5 | Button (W-Button) | High |
| IA-04-009 | When event is full, a Waitlist button is displayed and leads to the registration flow with a clear waitlist confirmation | N1, NOR2, S4 | Button (W-Button) | High |
| IA-04-010 | A confirmation dialog appears before any destructive action (delete, cancel registration) with explicit Confirm/Cancel buttons | N5, N3, S5, S6 | Modal/Dialog (W-Modal) | High |
| IA-04-011 | The confirmation dialog traps keyboard focus (Tab stays within dialog) until the user dismisses it | WCAG2.1.2, N7 | Modal/Dialog (W-Modal) | High |
| IA-04-012 | Pressing Esc closes a non-destructive dialog (without taking any action) | N3, S6 | Modal/Dialog (W-Modal) | Med |
| IA-04-013 | After closing a dialog, keyboard focus returns to the element that triggered it | WCAG2.4.3, S7 | Modal/Dialog (W-Modal) | High |
| IA-04-014 | Progress bars for multi-step forms (e.g., Registration Form B3) display the current step number and total steps | N1, S3, S4 | ProgressBar (W-ProgressBar) | High |
| IA-04-015 | Progress bars have `aria-valuenow`, `aria-valuemin`, and `aria-valuemax` attributes for screen reader support | WCAG4.1.2, S2 | ProgressBar (W-ProgressBar) | High |
| IA-04-016 | The Post-Event Star Review widget (B5) shows the current selected rating value visually and provides keyboard input support | N1, WCAG2.1.1, NOR2 | Star Rating | High |
| IA-04-017 | After submitting a star review (B5), a confirmation message or success toast is shown and the review appears in the list | N1, S3, S4, NOR2 | Toast, Review List | High |

---

## Coverage Summary

| IA Category | Item Count | High | Med | Low | WCAG Criteria | Heuristic Frameworks |
|-------------|-----------|------|-----|-----|---------------|----------------------|
| IA-01 General UI Standards | 15 | 10 | 5 | 0 | 1.1.1, 1.4.1, 1.4.3, 1.4.4, 1.4.10 | N, NOR, S, WCAG |
| IA-02 Forms | 17 | 12 | 4 | 0 | 2.1.1, 3.3.1, 3.3.2, 3.3.3, 4.1.2 | N, NOR, S, WCAG |
| IA-03 Navigation | 14 | 10 | 3 | 0 | 2.1.1, 2.4.2, 2.5.7, 2.5.8, 4.1.2 | N, NOR, S, WCAG |
| IA-04 Feedback/State | 17 | 15 | 2 | 0 | 1.4.1, 2.1.2, 2.2.1, 2.4.3, 4.1.2, 4.1.3 | N, NOR, S, WCAG |
| **TOTAL** | **52** | **47** | **14** | **0** | — | All 4 frameworks |

---

## Widget Coverage Verification

| Widget | Items Covering It |
|--------|------------------|
| TextBox | IA-02-001, IA-02-002, IA-02-003, IA-02-004 |
| Dropdown | IA-02-006, IA-02-007, IA-02-008, IA-02-009 |
| Button | IA-01-014, IA-04-008, IA-04-009 |
| Image | IA-01-005, IA-01-006 |
| Grid/Table | IA-01-009 |
| DatePicker | IA-02-015, IA-02-016 |
| Modal/Dialog | IA-02-017, IA-04-010, IA-04-011, IA-04-012, IA-04-013 |
| Toast | IA-04-001, IA-04-002, IA-04-003, IA-04-004, IA-04-005 |
| FileUpload | IA-02-010, IA-02-011, IA-02-012 |
| RichTextEditor | IA-02-013, IA-02-014 |
| DragDrop | IA-03-010, IA-03-011, IA-03-012 |
| ProgressBar | IA-04-014, IA-04-015 |
| Tab | IA-03-007, IA-03-008, IA-03-009 |
| Sidebar | IA-03-001, IA-03-002, IA-03-003, IA-03-004 |
| Carousel | *(not applicable to Scenario B screens; addressed by IA-01-005 for banner images)* |
| Star Rating | IA-04-016, IA-04-017 |

**Total distinct widget types covered**: 15 (exceeds minimum of 12) ✅

---

*End of checklist. Total items: 52 (>40 required ✅). Generated 2026-07-28.*
