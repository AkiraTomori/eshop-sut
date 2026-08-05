# Checklist Execution Results — Screen B4: My Registrations / Ticket

| Field | Value |
|-------|-------|
| **Screen ID** | B4 |
| **Screen Name** | My Registrations / Ticket (`My Profile` → `My Activities`) |
| **SUT URL** | https://prod-dev.ems-fitus.cloud/profile |
| **Scenario** | B |
| **Tester** | Thái Minh Huy — 23127379 |
| **Date** | 2026-07-28 |
| **Browser** | Chrome (DevTools-controlled, Chromium engine) |
| **OS** | macOS |
| **Primary Viewport** | 1440 × 900 CSS px |
| **Responsive Viewport** | 320 × 800 CSS px |
| **Checklist Source** | `artifacts/01-checklist/shared-gui-checklist.md` |

## Screen Identification and Tested States

B4 is implemented inside the authenticated Profile page rather than as a separate “My Registrations” navigation item. The tested area contains:

- profile and participation counters;
- `My Activities`, search, date-range filters, export, and pagination;
- three registration cards with Pending/Approved, participation, and event-state badges;
- registration/check-in timestamps and role labels;
- the profile-level check-in QR ticket dialog.

States exercised:

1. Direct deep link to `/profile`.
2. Normal list containing three registrations.
3. Search with zero matches.
4. EN → VI → EN language switching.
5. QR dialog open, keyboard focus cycling, Escape close, and focus restoration.
6. Date range entered entirely by keyboard.
7. Invalid filter range: start `10/08/2026`, end `01/08/2026`.
8. Slow-3G reload to inspect the asynchronous loading state.
9. 320 × 800 mobile viewport.

> Scope note: the skill expects at least three screens for a complete Stage 2 submission. This execution covers the user-requested B4 screen only; B2 already exists, while B1 is still required to meet the configured three-screen package.
>
> Checklist integrity note: the checklist metadata says **63** items, but the four tables contain **62 distinct IDs** (17 + 16 + 14 + 15). Every actual checklist row is evaluated below; no synthetic 63rd item was invented.

## IA-01 — General UI Standards

| Checklist ID | Description (abbreviated) | Status | Notes |
|---|---|---|---|
| IA-01-001 | Content uses consistent max-width container | ✅ Pass | Desktop content is centred in a consistent container; no page-level bleed at 1440 px. |
| IA-01-002 | Design-system fonts; no default serif | ✅ Pass | Computed fonts use the same system sans-serif stack throughout. |
| IA-01-003 | Text contrast meets 4.5:1 / 3:1 | ❌ Fail | Several visible controls are below AA: white `Student` text on cyan is approximately 2.08:1, white `Export` text on green approximately 2.71:1, and the active page number approximately 2.08:1. Expected ≥4.5:1 for this normal-sized text. Screenshot: `B4_IA-01-003_fail.png`. |
| IA-01-004 | Component boundaries/icons meet 3:1 | ✅ Pass | Input outlines, card edges, and primary icons remain visually distinguishable on the light surfaces inspected. |
| IA-01-005 | Images render without broken/blurred state | ✅ Pass | All five loaded `<img>` elements completed with non-zero natural dimensions; no broken-image icon appeared. |
| IA-01-006 | Images preserve expected aspect ratio | ❌ Fail | Registration thumbnails are forced into the same 218 × 186 area although source ratios differ (for example 1200 × 450 and 2048 × 2048), causing conspicuous cropping. Screenshot: `B4_IA-01-006_fail.png`. |
| IA-01-007 | Paragraph line height/spacing is readable | ✅ Pass | Body copy inspected at 16/24 px and 14/20 px has approximately 1.43–1.5 line-height and clear separation. |
| IA-01-008 | Meaningful images have alternatives | ✅ Pass | Event thumbnails and institutional logos expose non-empty accessible names/alt text. |
| IA-01-009 | Async loading has visible indicator | ❌ Fail | Under a Slow-3G reload, only the public header was visible while the document remained busy; the profile content area was blank with no spinner, skeleton, or progress indicator. Screenshot: `B4_IA-01-009_fail.png`. |
| IA-01-010 | Zero-result state is explicit | ✅ Pass | Searching for a nonexistent registration displays `No activities found` instead of an empty/broken region. |
| IA-01-011 | Interactive targets are at least 24×24 | ❌ Fail | The search input’s actual interactive box measured about 175 × 20 CSS px and footer links about 19 px high, below the checklist’s 24 px minimum. Screenshot: `B4_IA-01-011_fail.png`. |
| IA-01-012 | Carousel controls are visually distinct | N/A | No carousel is present on B4. |
| IA-01-013 | EN/VI switch updates all visible text | ❌ Fail | Vietnamese mode leaves visible strings untranslated, including `Show QR code`, `Student`, `Participant`, `Rows per page`, and `Go to page`. Screenshot: `B4_IA-01-013_fail.png`. |
| IA-01-014 | Carousel is keyboard accessible | N/A | No carousel is present on B4. |
| IA-01-015 | Usable at 200% zoom / 320 px | ❌ Fail | At 320 px, the action row is wider than its container and the third action is clipped; internal regions report widths up to 457 px, with registration content also clipped/truncated. Screenshot: `B4_IA-01-015_fail.png`. |
| IA-01-016 | Dark/light mode toggle works | N/A | No theme toggle is provided on this screen. |
| IA-01-017 | Spacing and alignment are consistent | ✅ Pass | Desktop cards, counters, buttons, and icon/text pairs align consistently. |

**IA-01 Sub-total: Pass 8 · Fail 6 · N/A 3**

## IA-02 — Forms

| Checklist ID | Description (abbreviated) | Status | Notes |
|---|---|---|---|
| IA-02-001 | Required fields show an asterisk | N/A | B4 has no required data-entry field. |
| IA-02-002 | Every field has a persistent visible label | ❌ Fail | `Search activities...` and `Go to page` rely on placeholder/accessible-name text without persistent visible labels. Screenshot: `B4_IA-02-002_fail.png`. |
| IA-02-003 | Blank required field errors on blur | N/A | No required field exists on B4. |
| IA-02-004 | Inline errors provide corrective suggestion | N/A | No inline field-error component is rendered on B4; logical date validation is assessed under IA-02-007. |
| IA-02-005 | Error fields highlighted after submit | N/A | There is no form submission action on B4. |
| IA-02-006 | Dropdown arrow/keyboard/value behavior | ✅ Pass | `Rows per page` exposes a listbox trigger, selected value `10`, and keyboard-focusable control. |
| IA-02-007 | Date picker enforces logical range | ❌ Fail | The filters accept start `10/08/2026` and end `01/08/2026` without preventing the value or displaying an error; all three results remain visible. Screenshot: `B4_IA-02-007_fail.png`. |
| IA-02-008 | Date picker works with keyboard | ✅ Pass | Day, month, and year segments were entered without opening the calendar; date-picker buttons are also keyboard focusable. |
| IA-02-009 | Upload constraints are visible | N/A | No file upload is present. |
| IA-02-010 | Drag-over upload feedback | N/A | No file upload/drop zone is present. |
| IA-02-011 | Upload error is adjacent | N/A | No file upload is present. |
| IA-02-012 | RTE gives WYSIWYG feedback/tooltips | N/A | No rich-text editor is present. |
| IA-02-013 | Upload preview and remove control | N/A | No image/file upload is present. |
| IA-02-014 | RTE has bounded, graceful overflow | N/A | No rich-text editor is present. |
| IA-02-015 | Primary commit action is distinct | N/A | B4 has filters and export but no commit/save/publish action. |
| IA-02-016 | Password field has visibility toggle | N/A | `Change Password` navigates to another screen; no password field is present on B4. |

**IA-02 Sub-total: Pass 2 · Fail 2 · N/A 12**

## IA-03 — Navigation

| Checklist ID | Description (abbreviated) | Status | Notes |
|---|---|---|---|
| IA-03-001 | Sidebar is present and consistent | N/A | EMS uses a top navigation bar; no sidebar exists on B4. |
| IA-03-002 | Active sidebar item is distinguished | N/A | No sidebar item exists for Profile/My Activities. |
| IA-03-003 | Collapsed sidebar icons have tooltips | N/A | No collapsible sidebar exists. |
| IA-03-004 | Sidebar is keyboard reachable | N/A | No sidebar exists. |
| IA-03-005 | Breadcrumb represents current location | N/A | No breadcrumb component exists on B4; this item tests an existing breadcrumb rather than requiring one. |
| IA-03-006 | Tabs show matching active panel | N/A | No tab panel exists. |
| IA-03-007 | Tabs are keyboard operable | N/A | No tab panel exists. |
| IA-03-008 | Drag/drop has handle and ghost | N/A | No reordering UI exists. |
| IA-03-009 | Drag/drop has keyboard alternative | N/A | No reordering UI exists. |
| IA-03-010 | Form/flow has Back or Cancel | N/A | B4 is not a form or multi-step flow. |
| IA-03-011 | Fixed UI does not obscure focus | ✅ Pass | Keyboard-focused header and page controls remained visible; the fixed header did not cover the focused element. |
| IA-03-012 | Deep link restores correct context | N/A | `/profile` renders the correct content, but the checklist also requires matching breadcrumb and sidebar states, neither of which exists on B4. |
| IA-03-013 | Tab order follows reading order | ✅ Pass | DOM focus order runs header logo/nav → language/notifications/user → QR/Edit/Password → search/filter/export → page/footer controls without a distant jump. |
| IA-03-014 | Pagination marks page and disables ends | ✅ Pass | Page `1` is visually active; previous and next buttons are disabled for the single-page, three-result data set. |

**IA-03 Sub-total: Pass 3 · Fail 0 · N/A 11**

## IA-04 — Feedback / State

| Checklist ID | Description (abbreviated) | Status | Notes |
|---|---|---|---|
| IA-04-001 | Toast timing, position, dismiss button | N/A | No toast-producing action was required on B4. |
| IA-04-002 | Toast has redundant semantic cues | N/A | No toast was produced on B4. |
| IA-04-003 | Toast animation does not shift layout | N/A | No toast was produced on B4. |
| IA-04-004 | Status badges do not rely on colour | ✅ Pass | `Pending review`, `Approved`, `Student participation`, `Upcoming`, and `Ongoing` all include visible text. |
| IA-04-005 | Destructive action asks for confirmation | N/A | No destructive/irreversible action is available on B4. |
| IA-04-006 | Modal traps focus, Esc closes, focus returns | ✅ Pass | The QR modal kept Shift+Tab/Tab within its controls, closed with Escape, and returned focus to the QR trigger. Evidence: `B4_QR_dialog.png`. |
| IA-04-007 | Progress bar shows numeric value | N/A | No progress bar exists on B4. |
| IA-04-008 | Progress bar animates smoothly | N/A | No progress bar exists on B4. |
| IA-04-009 | Successful action notifies and updates UI | N/A | B4 exposes no save/delete/registration mutation used in this run. |
| IA-04-010 | Failed action gives friendly error | N/A | No server action was intentionally failed. |
| IA-04-011 | Failed submission preserves data | N/A | No submission form exists on B4. |
| IA-04-012 | Real-time log entries remain consistent | N/A | No real-time log/feed exists. |
| IA-04-013 | Async removal closes layout gap | N/A | No item-removal action exists on B4. |
| IA-04-014 | Hover/pressed feedback is distinct | ✅ Pass | Buttons and links use visible hover/active state classes; inspected controls change border, background, colour, or position. |
| IA-04-015 | Icon-only buttons show text tooltips | ❌ Fail | Language and notification icon buttons have accessible names but no visible tooltip/title, and the initial pagination previous/next icon buttons have neither text nor tooltip. Screenshot: `B4_IA-04-015_fail.png`. |

**IA-04 Sub-total: Pass 3 · Fail 1 · N/A 11**

## Execution Summary — B4

| Metric | Count |
|--------|------:|
| Total distinct checklist rows | 62 |
| Checklist metadata count | 63 (inconsistent with actual rows) |
| Not Applicable (N/A) | 37 |
| **Executed (Pass + Fail)** | **25** |
| **Passed ✅** | **16** |
| **Failed ❌** | **9** |
| **Pass Rate** | **64.0%** of executed items |

### Failed Items

| # | Checklist ID | Finding | Severity | Screenshot |
|---:|---|---|---|---|
| 1 | IA-01-003 | Normal-size badge/button text has sub-AA contrast | 2 — Minor | `B4_IA-01-003_fail.png` |
| 2 | IA-01-006 | Differently shaped event images are cropped into one ratio | 2 — Minor | `B4_IA-01-006_fail.png` |
| 3 | IA-01-009 | Profile content is blank during throttled async loading | 2 — Minor | `B4_IA-01-009_fail.png` |
| 4 | IA-01-011 | Search and footer interactive targets are below 24 px high | 2 — Minor | `B4_IA-01-011_fail.png` |
| 5 | IA-01-013 | Vietnamese mode retains visible English strings | 3 — Major | `B4_IA-01-013_fail.png` |
| 6 | IA-01-015 | 320 px layout clips the action row and registration content | 3 — Major | `B4_IA-01-015_fail.png` |
| 7 | IA-02-002 | Search and page-jump fields lack persistent labels | 2 — Minor | `B4_IA-02-002_fail.png` |
| 8 | IA-02-007 | End-before-start filter range is accepted without error | 2 — Minor | `B4_IA-02-007_fail.png` |
| 9 | IA-04-015 | Icon-only controls lack visible tooltips | 1 — Cosmetic | `B4_IA-04-015_fail.png` |

## Evidence Inventory

| File | Purpose |
|---|---|
| `screenshots/B4_overview.png` | Full-page B4 baseline |
| `screenshots/B4_QR_dialog.png` | QR ticket modal |
| `screenshots/B4_IA-01-003_fail.png` | Contrast finding |
| `screenshots/B4_IA-01-006_fail.png` | Thumbnail cropping |
| `screenshots/B4_IA-01-009_fail.png` | Blank loading state |
| `screenshots/B4_IA-01-011_fail.png` | Small target evidence |
| `screenshots/B4_IA-01-013_fail.png` | Partial Vietnamese translation |
| `screenshots/B4_IA-01-015_fail.png` | 320 px clipping/overflow |
| `screenshots/B4_IA-02-002_fail.png` | Placeholder-only fields |
| `screenshots/B4_IA-02-007_fail.png` | Invalid date range accepted |
| `screenshots/B4_IA-04-015_fail.png` | Icon-only controls without tooltips |
