# Checklist Execution Results — Screen B1: Home / Events List

| Field | Value |
|-------|-------|
| **Screen ID** | B1 |
| **Screen Name** | Home / Events List |
| **SUT URL** | https://prod-dev.ems-fitus.cloud/dashboard |
| **Scenario** | B |
| **Tester** | Thái Minh Huy — 23127379 |
| **Date** | 2026-07-29 |
| **Browser / OS** | Chrome 145 / macOS |
| **Viewport** | 1440 × 900 CSS px; 320 × 800 mobile emulation |
| **Checklist Source** | artifacts/01-checklist/shared-gui-checklist.md |

> The checklist header declares 63 items, but its four tables contain 62 distinct rows: 17 + 16 + 14 + 15. This execution evaluates every actual row. Items for widgets absent from B1 are marked N/A.

## Screen Description and States Exercised

B1 is the authenticated event-discovery dashboard. It contains a spotlight event, search, time-status filters, hierarchical category filters, event-card grid, save controls, pagination, language switching, and footer links.

Live states exercised: initial desktop view, zero-result search, English/Vietnamese switch, keyboard focus, native page-size select, first/last pagination pages, save/unsave state, Slow 3G reload, and 320 × 800 phone emulation.

## IA-01 — General UI Standards

| Checklist ID | Description (abbreviated) | Status | Notes |
|---|---|---|---|
| IA-01-001 | Consistent maximum-width page container | ✅ Pass | Spotlight, filters, sidebar, and card grid remain within a centred desktop container without horizontal bleed. |
| IA-01-002 | Design-system fonts and weights | ✅ Pass | All visible content uses the same system sans-serif stack; no default serif text appears. |
| IA-01-003 | Text contrast meets WCAG AA | ❌ Fail | Lighthouse reports multiple failures: cyan text on white at 2.08:1, orange chips at 3.59:1, green chips at 3.65:1, and card copy at 4.34:1, all below 4.5:1. Screenshot: `B1_IA-01-003_fail.png`. |
| IA-01-004 | Component boundaries/icons have 3:1 contrast | ❌ Fail | Light-grey input/control borders and cyan meaningful icons do not consistently reach 3:1 against white/light-grey backgrounds. Screenshot: `B1_IA-01-004_fail.png`. |
| IA-01-005 | Images render without breakage/distortion | ✅ Pass | All supplied event artwork loaded; the event without artwork shows an intentional placeholder rather than a broken-image icon. |
| IA-01-006 | Images preserve expected aspect ratio | ❌ Fail | Event sources ranging from 1200×450 to 2048×2048 are forced into approximately 504.5×378.4 boxes with `object-fit: cover`, cropping materially different source ratios. Screenshot: `B1_IA-01-006_fail.png`. |
| IA-01-007 | Paragraph line height is at least 1.5× | ❌ Fail | Event-card body copy computes to 14px text with 20px line height (about 1.43×), below the checklist threshold. Screenshot: `B1_IA-01-007_fail.png`. |
| IA-01-008 | Meaningful images have text alternatives | ✅ Pass | Every rendered event image exposes a descriptive alt value matching its event title. |
| IA-01-009 | Visible asynchronous loading state | ❌ Fail | Under Slow 3G with cache disabled, the header and footer render around a blank main region; no spinner, skeleton, or progress indicator is shown. Screenshot: `B1_IA-01-009_fail.png`. |
| IA-01-010 | Clear empty state | ✅ Pass | A nonsense search produces “No events found” and “There are no events matching your filters.” |
| IA-01-011 | Interactive targets are at least 24×24px | ❌ Fail | Lighthouse reports the spotlight “View details” link at about 104.7×20px; the search control is also approximately 20px high at the inspected interactive node. Screenshot: `B1_IA-01-011_fail.png`. |
| IA-01-012 | Carousel controls are visually distinct | N/A | The spotlight is a static feature panel; no carousel widget, arrows, or pagination dots are present. |
| IA-01-013 | EN/VI switch updates visible UI | ✅ Pass | Navigation, filters, statuses, card metadata, pagination, and footer strings switched to Vietnamese in one render; no English system strings remained. User-authored event content was correctly left unchanged. |
| IA-01-014 | Carousel is keyboard accessible | N/A | No carousel component exists on B1. |
| IA-01-015 | Usable at 200% / 320 CSS px | ❌ Fail | At the phone viewport, functional strings are ellipsized, including the status-filter label and spotlight date; event titles/descriptions are also aggressively truncated. Screenshot: `B1_IA-01-015_fail.png`. |
| IA-01-016 | Dark/light mode toggle works | N/A | EMS exposes no theme toggle on B1. |
| IA-01-017 | Consistent spacing and alignment | ✅ Pass | Card gutters, chip spacing, icon/text pairs, filter groups, and pagination controls remain consistently aligned at desktop width. |

**IA-01 Sub-total: Pass 7 · Fail 7 · N/A 3**

## IA-02 — Forms

| Checklist ID | Description (abbreviated) | Status | Notes |
|---|---|---|---|
| IA-02-001 | Required fields display asterisks | N/A | B1 has no required data-entry form. |
| IA-02-002 | Every field has a persistent visible label | ❌ Fail | Event search relies on placeholder/ARIA text only and has no persistent visible `<label>`. Screenshot: `B1_IA-02-002_fail.png`. |
| IA-02-003 | Blank required field shows blur-time error | N/A | No required field exists. |
| IA-02-004 | Errors include corrective suggestions | N/A | No validation error state exists on B1. |
| IA-02-005 | All invalid fields are highlighted | N/A | No submitted form exists. |
| IA-02-006 | Dropdown arrow, click/Enter, selected value | ✅ Pass | The native rows-per-page select has a visible arrow, opens from keyboard, and retains the selected value. |
| IA-02-007 | Date picker enforces logical ranges | N/A | No date picker is present. |
| IA-02-008 | Date picker is keyboard accessible | N/A | No date picker is present. |
| IA-02-009 | Upload constraints are visible | N/A | No file upload is present. |
| IA-02-010 | Drag-over state is visible | N/A | No dropzone is present. |
| IA-02-011 | Upload error appears by control | N/A | No file upload is present. |
| IA-02-012 | RTE gives WYSIWYG feedback/tooltips | N/A | No rich-text editor is present. |
| IA-02-013 | Upload preview and removal control | N/A | No image upload is present. |
| IA-02-014 | RTE overflow is graceful | N/A | No rich-text editor is present. |
| IA-02-015 | Primary commit action is distinct | N/A | B1 is not a commit form or multi-step flow. |
| IA-02-016 | Password visibility toggle | N/A | No password input is present. |

**IA-02 Sub-total: Pass 1 · Fail 1 · N/A 14**

## IA-03 — Navigation

| Checklist ID | Description (abbreviated) | Status | Notes |
|---|---|---|---|
| IA-03-001 | Sidebar navigation is consistent | N/A | EMS uses a top navigation bar; B1’s left panel is a filter sidebar, not application navigation. |
| IA-03-002 | Active sidebar item is distinguished | N/A | No application-navigation sidebar exists. |
| IA-03-003 | Collapsed sidebar icons have tooltips | N/A | No collapsible application-navigation sidebar exists. |
| IA-03-004 | Sidebar is keyboard reachable | N/A | No application-navigation sidebar exists. |
| IA-03-005 | Breadcrumb represents current location | N/A | B1 is the top-level dashboard and contains no breadcrumb component. |
| IA-03-006 | Tabs show matching active panel | N/A | The status chips are filters, not a tab-panel widget. |
| IA-03-007 | Tabs are keyboard operable | N/A | No tab-panel widget exists. |
| IA-03-008 | Drag/drop has handle and ghost | N/A | No reorder interface exists. |
| IA-03-009 | Drag/drop has keyboard alternative | N/A | No reorder interface exists. |
| IA-03-010 | Flow provides Back/Cancel | N/A | B1 is not a form or multi-step flow. |
| IA-03-011 | Fixed UI does not obscure focus | ✅ Pass | Focused header, filter, card, pagination, and footer controls remain visible; the header does not cover the focused element. |
| IA-03-012 | Deep link restores matching context | N/A | `/dashboard` renders B1 directly, but the compound item also requires breadcrumb and sidebar states that do not exist here. |
| IA-03-013 | Tab order follows reading order | ✅ Pass | Focus order follows header logo/nav → utilities → spotlight → search/filters → filter sidebar/cards → pagination/footer without a distant jump. |
| IA-03-014 | Pagination marks current page/disables ends | ✅ Pass | Page 1 is visibly active with Previous disabled; page 3 becomes active with Next disabled. |

**IA-03 Sub-total: Pass 3 · Fail 0 · N/A 11**

## IA-04 — Feedback / State

| Checklist ID | Description (abbreviated) | Status | Notes |
|---|---|---|---|
| IA-04-001 | Toast timing, position, and dismiss control | N/A | No toast was produced by the B1 interactions; the missing success notification is evaluated under IA-04-009. |
| IA-04-002 | Toast colour semantics | N/A | No toast appeared. |
| IA-04-003 | Toast animates without layout shift | N/A | No toast appeared. |
| IA-04-004 | Status badges do not rely only on colour | ✅ Pass | Upcoming/Ongoing/Ended, registration availability, Registered, and role capacity states all include visible text. |
| IA-04-005 | Destructive actions require confirmation | N/A | No destructive/irreversible B1 action was available. |
| IA-04-006 | Modal focus trap and dismissal | N/A | No modal was invoked on B1. |
| IA-04-007 | Progress bar includes numeric value | N/A | Capacity is shown as text cards; no progress-bar widget exists. |
| IA-04-008 | Progress bar animates smoothly | N/A | No progress-bar widget exists. |
| IA-04-009 | Successful action notifies and updates UI | ❌ Fail | Save/unsave changes the button state immediately, but no success toast/message appears in the page’s live alert region. Screenshot: `B1_IA-04-009_fail.png`. |
| IA-04-010 | Failed actions show friendly errors | N/A | No failed server action was produced during B1 testing. |
| IA-04-011 | Failed form preserves entered data | N/A | No submitted form exists. |
| IA-04-012 | Real-time log format remains consistent | N/A | No real-time log/feed exists. |
| IA-04-013 | Async removal closes layout gap | N/A | No list item removal operation exists on B1. |
| IA-04-014 | Hover/press feedback is distinct | ✅ Pass | Navigation, filter chips, event cards, save buttons, and pagination controls expose visible hover/pressed styling. |
| IA-04-015 | Icon-only buttons expose tooltips | ❌ Fail | Previous/Next pagination buttons expose no text, `aria-label`, or `title`; Lighthouse flags both as unnamed buttons, and no tooltip appears. Screenshot: `B1_IA-04-015_fail.png`. |

**IA-04 Sub-total: Pass 2 · Fail 2 · N/A 11**

## Execution Summary — Screen B1

| Metric | Count |
|--------|------:|
| Actual checklist rows | 62 |
| Passed ✅ | 13 |
| Failed ❌ | 10 |
| Not Applicable | 39 |
| Executed (Pass + Fail) | 23 |
| **Pass Rate** | **56.5%** |

## Failed Items Summary

| # | Checklist ID | Category | Severity | Evidence |
|---:|---|---|---|---|
| 1 | IA-01-003 | Text contrast | 2 — Minor | `B1_IA-01-003_fail.png` |
| 2 | IA-01-004 | Non-text contrast | 2 — Minor | `B1_IA-01-004_fail.png` |
| 3 | IA-01-006 | Image cropping | 2 — Minor | `B1_IA-01-006_fail.png` |
| 4 | IA-01-007 | Readability | 1 — Cosmetic | `B1_IA-01-007_fail.png` |
| 5 | IA-01-009 | Loading feedback | 2 — Minor | `B1_IA-01-009_fail.png` |
| 6 | IA-01-011 | Target size | 2 — Minor | `B1_IA-01-011_fail.png` |
| 7 | IA-01-015 | Mobile truncation | 3 — Major | `B1_IA-01-015_fail.png` |
| 8 | IA-02-002 | Field labeling | 2 — Minor | `B1_IA-02-002_fail.png` |
| 9 | IA-04-009 | Success feedback | 2 — Minor | `B1_IA-04-009_fail.png` |
| 10 | IA-04-015 | Icon tooltips/names | 2 — Minor | `B1_IA-04-015_fail.png` |

## Test Evidence Notes

- Lighthouse snapshot: Accessibility 77; 9 accessibility audits failed.
- Exact DOM measurements were obtained with Chrome DevTools.
- Screenshots are from the live EMS only; none were generated or fabricated.
- The save/unsave action was returned to its original state after testing.
