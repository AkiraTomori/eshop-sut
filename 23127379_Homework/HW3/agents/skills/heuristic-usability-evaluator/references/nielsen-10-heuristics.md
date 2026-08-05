# Nielsen's 10 Usability Heuristics — Detailed Reference

> This reference provides detailed descriptions, examples, and testing guidance for
> each of Nielsen's 10 usability heuristics, as used in the `heuristic-usability-evaluator` skill.

---

## Severity Rating Scale (0–4)

| Rating | Label | Description | Fix Priority |
|--------|-------|-------------|--------------|
| 0 | Not a usability problem | Evaluator disagrees this violates the heuristic in this context | None |
| 1 | Cosmetic problem | Does not affect task completion; fix if time permits | Low |
| 2 | Minor usability problem | Users can work around it, but it slows them or causes mild frustration | Medium |
| 3 | Major usability problem | Causes significant difficulty; many users will be affected | High |
| 4 | Usability catastrophe | Prevents task completion; must fix before release | Critical |

---

## N1 — Visibility of System Status

**Principle**: The system should always keep users informed about what is going on, through appropriate feedback within reasonable time.

**What to look for in EMS:**
- Loading spinners/skeletons when data is being fetched
- Progress indicators for multi-step operations (check-in, bulk actions)
- Status badges on events (DRAFT, PUBLISHED), users (ACTIVE, BLOCKED), support requests (PENDING, RESOLVED)
- Real-time updates in check-in logs
- Toast notifications after save/submit/delete operations
- Dashboard KPI updates reflecting current data

**Common violations:**
- No feedback after clicking a button (user doesn't know if click registered)
- Data loads silently without any loading indicator
- Status badge colours ambiguous or inconsistent
- Counter values don't update after an action

**Example issue:**
> After clicking "Publish Event", there is no loading indicator or feedback for ~3 seconds. The user doesn't know if the click registered and may click again, potentially causing duplicate actions. **Severity: 3**

---

## N2 — Match Between System and Real World

**Principle**: The system should speak the users' language, with words, phrases, and concepts familiar to the user, rather than system-oriented terms.

**What to look for in EMS:**
- Labels use academic/event domain language ("Event", "Participant", "Check-in") not database terms ("Entity", "Record", "Transaction")
- Date/time formats match the locale (DD/MM/YYYY for Vietnamese users)
- Icons are universally recognisable
- i18n text is natural (not machine-translated) in both EN and VI
- Error messages use plain language, not error codes

**Common violations:**
- Technical jargon in user-facing messages ("500 Internal Server Error", "null reference")
- Untranslated strings in VI mode
- Date format inconsistencies between EN and VI modes
- Icon metaphors that don't match the action

---

## N3 — User Control and Freedom

**Principle**: Users often choose system functions by mistake and will need a clearly marked "emergency exit" to leave the unwanted state without going through an extended dialogue.

**What to look for in EMS:**
- Cancel/Back buttons on all forms and multi-step flows
- Confirmation dialogs before destructive actions (Delete, Block, Reset Password)
- Ability to undo recent actions (e.g., revert from Published to Draft)
- Form data preserved when navigating back
- Clear way to exit modals/dialogs

**Common violations:**
- No Cancel button on a form — only "Save"
- Destructive action performed without confirmation
- Navigating back after filling a form loses all entered data
- Modal cannot be dismissed (no X button, no Esc, no backdrop click)

---

## N4 — Consistency and Standards

**Principle**: Users should not have to wonder whether different words, situations, or actions mean the same thing. Follow platform conventions.

**What to look for in EMS:**
- Same button styles throughout (primary, secondary, danger)
- Same layout patterns (sidebar position, header height, content margins)
- Same terminology ("Event" always means "Event", not sometimes "Activity")
- Same colour semantics (green = success everywhere, red = error everywhere)
- Same interaction patterns (all dropdowns behave the same, all tables have the same column features)

**Common violations:**
- Different button styles for the same action type on different pages
- Sidebar width changes between pages
- Toast notifications appear in different positions on different pages
- "Save" vs "Submit" vs "Confirm" used interchangeably for the same action

---

## N5 — Error Prevention

**Principle**: Even better than good error messages is a careful design which prevents a problem from occurring in the first place.

**What to look for in EMS:**
- Date pickers prevent selecting end date before start date
- Required fields marked clearly before user attempts submission
- File upload controls show accepted formats before user selects a file
- Confirmation dialogs for irreversible actions
- Disabled submit button until form is valid

**Common violations:**
- No constraints on date range — user can set end date before start date
- File upload accepts any format then fails silently
- Delete button with no confirmation dialog
- User can publish an event with missing required fields

---

## N6 — Recognition Rather Than Recall

**Principle**: Minimize the user's memory load by making objects, actions, and options visible.

**What to look for in EMS:**
- Breadcrumbs showing current location in the hierarchy
- Active sidebar menu item highlighted
- Form labels always visible (not just as placeholders)
- Filter/search results show what filters are active
- Event detail shows relevant context (date, location) without requiring navigation back

**Common violations:**
- Breadcrumbs missing or incorrect
- Active page not highlighted in sidebar
- Placeholder text disappears on focus, label is lost
- User must remember what filters they applied — no visible filter tags

---

## N7 — Flexibility and Efficiency of Use

**Principle**: Accelerators — unseen by the novice user — may often speed up the interaction for the expert user.

**What to look for in EMS:**
- Keyboard shortcuts for common actions
- Drag-and-drop for reordering (with keyboard alternative)
- Bulk selection and bulk actions in lists
- Search and filter shortcuts
- Pagination allows jumping to specific page

**Common violations:**
- No keyboard shortcut for any action
- Drag-and-drop is the only way to reorder (no Move Up/Down buttons)
- No bulk actions — each item must be acted on individually
- No search/filter on long lists

---

## N8 — Aesthetic and Minimalist Design

**Principle**: Dialogues should not contain information which is irrelevant or rarely needed. Every extra unit of information in a dialogue competes with the relevant units.

**What to look for in EMS:**
- Clean layouts with appropriate whitespace
- Only essential information displayed; secondary info available on demand
- No visual clutter (too many borders, shadows, colours)
- Primary actions visually prominent; secondary actions de-emphasised

**Common violations:**
- Overloaded dashboard with too many metrics
- Excessive use of different colours creating visual noise
- Important actions (Save, Publish) visually equal to minor actions (Cancel, Close)
- Information density too high — walls of text without hierarchy

---

## N9 — Help Users Recognize, Diagnose, and Recover from Errors

**Principle**: Error messages should be expressed in plain language (no codes), precisely indicate the problem, and constructively suggest a solution.

**What to look for in EMS:**
- Error messages are specific: "Event title is required" not "Invalid input"
- Error messages are positioned near the offending field
- All error fields highlighted simultaneously after submission failure
- Focus moves to the first error field
- Error state preserves previously entered valid data

**Common violations:**
- Generic error messages: "Something went wrong" or "Error 500"
- Error message far from the field that caused it (e.g., only at top of form)
- Only one error shown at a time — user must fix and resubmit to see the next
- Valid form data lost after an error

---

## N10 — Help and Documentation

**Principle**: Even though it is better if the system can be used without documentation, it may be necessary to provide help and documentation. Any such information should be easy to search, focused on the user's task, list concrete steps, and not be too large.

**What to look for in EMS:**
- Tooltips on complex form fields or actions
- Contextual help icons (ℹ️) with explanations
- Format hints next to fields (e.g., "Image must be 4:3 ratio, max 5MB")
- Onboarding guidance for first-time users

**Common violations:**
- No tooltips or help text on any field
- Complex features (Rich Text Editor, registration configuration) with no guidance
- File upload with no indication of accepted formats or size limits
- No explanation of what "Waitlist" means in the registration config
