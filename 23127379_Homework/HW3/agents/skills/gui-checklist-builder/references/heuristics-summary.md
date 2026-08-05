# Heuristics Summary — Reference for GUI Checklist Builder

> This file provides a concise summary of the four major heuristic/standard frameworks
> used when building GUI testing checklists. Use this as context when generating
> or reviewing checklist items.

---

## 1. Nielsen's 10 Usability Heuristics (N1–N10)

| ID  | Heuristic | Description | Checklist Focus |
|-----|-----------|-------------|-----------------|
| N1  | Visibility of system status | The system should always keep users informed about what is going on, through appropriate feedback within reasonable time. | Loading indicators, progress bars, status badges, real-time updates, toast notifications after actions |
| N2  | Match between system and real world | The system should speak the users' language, with words, phrases, and concepts familiar to the user, rather than system-oriented terms. | Labels use domain language ("Event" not "Entity"), icons are intuitive, date formats match locale |
| N3  | User control and freedom | Users often choose system functions by mistake and need a clearly marked "emergency exit" to leave the unwanted state. | Undo/redo, Cancel buttons, Back navigation, confirmation before destructive actions, form data preservation |
| N4  | Consistency and standards | Users should not have to wonder whether different words, situations, or actions mean the same thing. | Consistent button styles, consistent sidebar position, same icon meanings, consistent typography, consistent colour semantics |
| N5  | Error prevention | Even better than good error messages is a careful design which prevents a problem from occurring in the first place. | Disabling invalid actions, date-range constraints, confirmation dialogs before delete, format validation on input |
| N6  | Recognition rather than recall | Minimize the user's memory load by making objects, actions, and options visible. | Breadcrumbs, visible labels (not placeholder-only), search suggestions, recent items, active menu highlight |
| N7  | Flexibility and efficiency of use | Accelerators — unseen by the novice user — may often speed up the interaction for the expert user. | Keyboard shortcuts, drag-and-drop reorder, bulk actions, search/filter, keyboard-accessible date pickers |
| N8  | Aesthetic and minimalist design | Dialogues should not contain information which is irrelevant or rarely needed. | Clean layout, whitespace usage, no visual clutter, relevant content prioritized |
| N9  | Help users recognize, diagnose, and recover from errors | Error messages should be expressed in plain language (no codes), precisely indicate the problem, and constructively suggest a solution. | Specific inline error messages, corrective suggestions, highlighted error fields, error state preservation |
| N10 | Help and documentation | Even though it is better if the system can be used without documentation, it may be necessary to provide help and documentation. | Tooltips, contextual help, documentation links |

---

## 2. Norman's 6 Design Principles (NOR1–NOR6)

| ID   | Principle | Description | Checklist Focus |
|------|-----------|-------------|-----------------|
| NOR1 | Visibility | The more visible functions are, the more likely users will be able to know what to do next. | Visible drag handles, visible navigation controls, clear call-to-action buttons, visible upload areas |
| NOR2 | Feedback | Sending back information about what action has been done and what has been accomplished. | Toast notifications, status badge updates, progress bar values, form validation messages, visual changes after actions |
| NOR3 | Constraints | Restricting the kind of user interactions that can take place at a given moment. | Date range constraints, file format restrictions, aspect ratio enforcement, disabled buttons for invalid states |
| NOR4 | Mapping | The relationship between controls and their effects. | Drag direction matches reorder direction, toggle on/off maps to enable/disable, image preview matches upload |
| NOR5 | Consistency | Designing interfaces to have similar operations and use similar elements for achieving similar tasks. | Consistent toast positions, consistent status colour meanings, consistent form layouts across pages |
| NOR6 | Affordance | Perceived properties that suggest how a thing can be used. | Buttons look clickable, links look navigable, drag handles look draggable, input fields look editable |

---

## 3. Shneiderman's 8 Golden Rules (S1–S8)

| ID  | Rule | Description | Checklist Focus |
|-----|------|-------------|-----------------|
| S1  | Strive for consistency | Consistent sequences of actions in similar situations; consistent colour, layout, capitalization, fonts. | Same button styles, same sidebar width, same table column alignment, same filter patterns |
| S2  | Seek universal usability | Recognize needs of diverse users (novice, expert, disabled, international). | Keyboard navigation, screen reader support, i18n EN/VI, touch targets ≥ 24px, zoom to 200% |
| S3  | Offer informative feedback | For every user action, there should be system feedback. | Success/error toasts after save/submit, status badge updates, check-in log entries, progress bars |
| S4  | Design dialogs to yield closure | Sequences of actions should have a beginning, middle, and end with clear feedback at completion. | Confirmation after form submit, success message after workflow completion, clear "done" states |
| S5  | Prevent errors | Design the system so users cannot make serious errors; offer simple error handling. | Validation before submission, confirmation dialogs for destructive actions, error field highlighting, form data preservation |
| S6  | Permit easy reversal of actions | Actions should be reversible to reduce anxiety and encourage exploration. | Undo, Cancel buttons, Draft → Edit cycle, confirmation before irreversible delete |
| S7  | Keep users in control | Users should feel in control and the system should respond to their actions. | No unexpected redirects, no auto-dismiss of critical messages, manual dismiss buttons, Back/Cancel controls |
| S8  | Reduce short-term memory load | Don't require users to remember information across screens; display relevant context. | Breadcrumbs showing path, form labels always visible, deep link support, active sidebar indicator |

---

## 4. WCAG 2.x Key Success Criteria (Most Relevant)

| Criterion | Name | Level | Checklist Focus |
|-----------|------|-------|-----------------|
| WCAG 1.1.1 | Non-text Content | A | All images have alt text |
| WCAG 1.4.1 | Use of Colour | A | Colour alone does not convey meaning (combine with icon/text) |
| WCAG 1.4.3 | Contrast (Minimum) | AA | Text contrast ≥ 4.5:1 (normal) / 3:1 (large) |
| WCAG 1.4.4 | Resize Text | AA | Content usable at 200% zoom |
| WCAG 1.4.10 | Reflow | AA | No horizontal scroll at 320px viewport |
| WCAG 1.4.11 | Non-text Contrast | AA | UI component borders ≥ 3:1 contrast |
| WCAG 2.1.1 | Keyboard | A | All functionality operable by keyboard |
| WCAG 2.1.2 | No Keyboard Trap | A | Focus can always be moved away from any component |
| WCAG 2.2.1 | Timing Adjustable | A | Auto-dismiss toasts ≥ 5s, error toasts persist or ≥ 10s |
| WCAG 2.4.3 | Focus Order | A | Tab order follows visual reading order |
| WCAG 2.4.7 | Focus Visible | AA | Focused elements have visible focus indicator |
| WCAG 2.4.11 | Focus Not Obscured | AA | Focused element not hidden by sticky headers/overlays |
| WCAG 2.5.7 | Dragging Movements | AA | Drag-and-drop has keyboard alternative |
| WCAG 2.5.8 | Target Size (Minimum) | AA | Interactive targets ≥ 24×24 CSS px |
| WCAG 3.3.1 | Error Identification | A | Errors identified and described to user in text |
| WCAG 3.3.2 | Labels or Instructions | A | Input fields have labels/instructions |
| WCAG 3.3.3 | Error Suggestion | AA | Error messages suggest correction |
| WCAG 4.1.2 | Name, Role, Value | A | ARIA attributes correct (role, aria-current, etc.) |
| WCAG 4.1.3 | Status Messages | AA | Status messages announced to screen readers (role="status"/alert) |

---

## 5. Per-Widget Checklist Patterns (W-*)

Common UI widgets and their typical test concerns:

| Widget | Key Test Concerns |
|--------|-------------------|
| W-TextBox | Label present, placeholder not sole label, required indicator, inline validation, error message specificity |
| W-Dropdown | Arrow indicator visible, keyboard operable (Space/Enter), selected value shown, option list scrollable |
| W-Button | Distinct styles for primary/secondary/danger, disabled state visually clear, keyboard focusable, min 24px target |
| W-Image | Alt text, aspect ratio preserved, no broken images, no blur/pixelation, responsive sizing |
| W-Grid/Table | Column headers, sort indicators, empty state message, pagination, responsive overflow handling |
| W-DatePicker | Keyboard entry possible, range constraints enforced, format matches locale, calendar navigable by keyboard |
| W-Modal/Dialog | Focus trapped inside, Esc closes, focus returns to trigger on close, backdrop click behaviour, confirm/cancel labels |
| W-Toast | Consistent position, colour semantics (green/red/yellow/blue), auto-dismiss timing, manual dismiss, screen reader announced |
| W-FileUpload | Accepted formats shown, file size limit shown, progress indicator during upload, preview after upload, remove/replace option |
| W-RichTextEditor | Toolbar buttons work, keyboard accessible, content preserved on save/reopen, no HTML injection |
| W-DragDrop | Visible drag handle, ghost image during drag, keyboard alternative (Move Up/Down), drop zone highlight |
| W-ProgressBar | Numerical label, aria-valuenow/min/max, responsive width, consistent visual treatment |
| W-Tab | Active tab distinct, keyboard navigable (arrow keys), correct panel displayed, focus management |
| W-Sidebar | Consistent position/width, active page indicator, aria-current, keyboard navigable, collapsible on mobile |
| W-Carousel | Navigation arrows visible, pagination dots, keyboard accessible, auto-play stoppable, touch swipe on mobile |
