# Bug Reports — EMS Checklist Execution (Scenario B)

| Field | Value |
|-------|-------|
| **Scenario** | B |
| **Screens Tested** | B2 — Event Detail Page; B4 — My Registrations / Ticket; B1 - Home/Events List |
| **Tester** | Thái Minh Huy — 23127379 |
| **Date** | 2026-07-28 |
| **Total Bugs** | 30 |

---

## Bug #1

| Field | Value |
|-------|-------|
| **Bug ID** | BUG-B2-001 |
| **Screen** | B2 — Event Detail Page |
| **Checklist Item** | IA-01-008 — Meaningful images have alt text / fallback |
| **Steps to Reproduce** | 1. Navigate to any event detail page (e.g., https://prod-dev.ems-fitus.cloud/events/39). 2. Hover over the hero banner image. 3. Inspect the `<img>` element in browser DevTools. |
| **Expected Result** | The hero banner image has a descriptive `alt` attribute (e.g., alt="Event banner for USING AI AGENT CONVERSATION") or at minimum a non-empty alt text. Hovering should display a tooltip if alt is set. |
| **Actual Result** | No tooltip appears on hover. DevTools inspection confirms the `alt` attribute is absent or empty on the banner image. |
| **Severity** | 2 — Minor |
| **Screenshot** | `screenshots/B2_IA-01-008_fail.png` |
| **Type** | Bug |

---

## Bug #2

| Field | Value |
|-------|-------|
| **Bug ID** | BUG-B2-002 |
| **Screen** | B2 — Event Detail Page |
| **Checklist Item** | IA-01-013 — Language toggle updates all UI text |
| **Steps to Reproduce** | 1. Navigate to the event detail page. 2. Note event title, body text (e.g., "1. Why AI Agents Matter"), and registration labels. 3. Click the language/flag toggle in the top navigation (EN → VI). 4. Observe which text elements change. |
| **Expected Result** | All UI text updates to Vietnamese within one render cycle — including event title, body content sections, and the "Registration roles", "Student roles", "Participant", "Visitor" labels. |
| **Actual Result** | Only some top-level UI chrome strings appear to switch languages. The event title "USING AI AGENT CONVERSATION", body content headings ("Why AI Agents Matter"), and registration section labels ("Registration roles", "Participant", "Visitor") remain in English after switching to VI. |
| **Severity** | 3 — Major |
| **Screenshot** | `screenshots/B2_IA-01-013_fail.png` |
| **Type** | Bug |

---

## Bug #3

| Field | Value |
|-------|-------|
| **Bug ID** | BUG-B2-003 |
| **Screen** | B2 — Event Detail Page |
| **Checklist Item** | IA-01-015 — Page usable at 200% zoom / 320px viewport |
| **Steps to Reproduce** | 1. Navigate to the event detail page. 2. Using browser zoom controls, set zoom to 200%. 3. Observe the three info cards (Event date / Registration period / Check-in period). Alternatively, resize viewport to 320px width. |
| **Expected Result** | All content reflows gracefully — info cards stack vertically or wrap without causing horizontal scrollbar. No content truncation. |
| **Actual Result** | At 200% zoom, the three side-by-side info cards overflow their flex container and a horizontal scrollbar appears. At 320px viewport width, the Registration roles panel also overflows horizontally. |
| **Severity** | 3 — Major |
| **Screenshot** | `screenshots/B2_IA-01-013_fail.png` |
| **Type** | Bug |

---

## Bug #4

| Field | Value |
|-------|-------|
| **Bug ID** | BUG-B2-004 |
| **Screen** | B2 — Event Detail Page |
| **Checklist Item** | IA-02-003 — Inline error adjacent to unfilled required field |
| **Steps to Reproduce** | 1. Navigate to the event detail page with a registered user who can register. 2. Scroll to "Registration roles" section. 3. Do NOT tick any role checkbox. 4. Click "Register (Student)" button. |
| **Expected Result** | An inline error indicator appears immediately adjacent to (or inside) each unticked role checkbox card, highlighting the specific field that requires action. Error message is contextual to each element. |
| **Actual Result** | An error message "Please tick a role before submitting registration." appears below the entire Registration roles section, not adjacent to individual role checkbox cards. Individual role cards receive no visual error state. |
| **Severity** | 2 — Minor |
| **Screenshot** | `screenshots/B2_IA-02-003_fail.png` |
| **Type** | Bug |

---

## Bug #5

| Field | Value |
|-------|-------|
| **Bug ID** | BUG-B2-005 |
| **Screen** | B2 — Event Detail Page |
| **Checklist Item** | IA-02-005 — Error fields visually highlighted simultaneously |
| **Steps to Reproduce** | 1. Navigate to event detail page. 2. Without selecting any role, click "Register (Student)". 3. Observe the role checkbox cards' visual state. |
| **Expected Result** | All unanswered required role cards are simultaneously highlighted with a visual error indicator (e.g., red border on the card, error icon, background colour change). |
| **Actual Result** | The Participant and Visitor role cards show no visual error state (no red border, no error background). Only the text error message appears below the section. |
| **Severity** | 2 — Minor |
| **Screenshot** | `screenshots/B2_IA-02-003_fail.png` |
| **Type** | Bug |

---

## Bug #6

| Field | Value |
|-------|-------|
| **Bug ID** | BUG-B2-006 |
| **Screen** | B2 — Event Detail Page |
| **Checklist Item** | IA-03-002 — Active page item visually distinguished |
| **Steps to Reproduce** | 1. Log in to EMS. 2. Navigate to an event detail page from the Events listing. 3. Observe the top navigation and any breadcrumb area. |
| **Expected Result** | There should be a sub-level active indicator showing the user is within a specific event — e.g., a breadcrumb trail showing "Events > USING AI AGENT CONVERSATION" — with the current event name as the active (non-clickable) last segment. |
| **Actual Result** | Only the "Events" top-nav item is highlighted. There is no breadcrumb trail and no sub-level indicator distinguishing this specific event page from the Events listing. |
| **Severity** | 2 — Minor |
| **Screenshot** | `screenshots/B2_IA-03-005_fail.png` |
| **Type** | Bug |

---

## Bug #7

| Field | Value |
|-------|-------|
| **Bug ID** | BUG-B2-007 |
| **Screen** | B2 — Event Detail Page |
| **Checklist Item** | IA-03-004 — Sidebar/nav reachable by Tab with visible focus indicator |
| **Steps to Reproduce** | 1. Navigate to the event detail page. 2. Place focus at the top of the page (click in address bar then Tab into page). 3. Tab through the top navigation items (Events, Calendar, Saved Events, User Guide). 4. Observe the focus indicator on each nav item. |
| **Expected Result** | Each top nav item displays a clearly visible focus indicator (e.g., outlined border, highlighted background) that meets WCAG 2.4.7 (minimum 3:1 contrast for the focus indicator). |
| **Actual Result** | Focus indicator on top-nav items is either absent or too subtle to be clearly visible during keyboard navigation. The "Back to events" link does show a focus outline, but top-nav items' focus state lacks a prominent visible indicator. |
| **Severity** | 2 — Minor |
| **Screenshot** | `screenshots/B2_IA-03-001_pass.png` |
| **Type** | Bug |

---

## Bug #8

| Field | Value |
|-------|-------|
| **Bug ID** | BUG-B2-008 |
| **Screen** | B2 — Event Detail Page |
| **Checklist Item** | IA-03-005 — Breadcrumb reflects current page location |
| **Steps to Reproduce** | 1. Navigate to any event detail page. 2. Look for a breadcrumb trail below or near the top navigation bar. |
| **Expected Result** | A breadcrumb trail is visible, e.g.: `Events > USING AI AGENT CONVERSATION` where "Events" is a clickable link and the event name is the non-clickable current page. |
| **Actual Result** | No breadcrumb trail exists. The only navigation indicator is the "← Back to events" link, which is a simple back button rather than a hierarchical breadcrumb. |
| **Severity** | 2 — Minor |
| **Screenshot** | `screenshots/B2_IA-03-005_fail.png` |
| **Type** | Bug |

---

## Bug #9

| Field | Value |
|-------|-------|
| **Bug ID** | BUG-B2-009 |
| **Screen** | B2 — Event Detail Page |
| **Checklist Item** | IA-04-001 — Toast position consistent; auto-dismiss ≥5s; manual X button |
| **Steps to Reproduce** | 1. Navigate to event detail page. 2. Select a registration role (e.g., Participant). 3. Click "Register (Student)". 4. Observe the success toast notification that appears. |
| **Expected Result** | Toast notification: (a) appears in a consistent screen position, (b) includes a visible manual dismiss (×) button, (c) auto-dismisses after at least 5 seconds for success toasts. |
| **Actual Result** | Toast appeared (position consistent — top-right area), but: (a) **No manual dismiss (×) button** was visible on the toast, (b) toast **auto-dismissed in approximately 3 seconds**, which is below the 5-second minimum. |
| **Severity** | 2 — Minor |
| **Screenshot** | `screenshots/B2_IA-04-001_fail.png` |
| **Type** | Bug |

---

## Bug #10

| Field | Value |
|-------|-------|
| **Bug ID** | BUG-B2-010 |
| **Screen** | B2 — Event Detail Page |
| **Checklist Item** | IA-04-007 — Progress bars show numerical value adjacent to bar |
| **Steps to Reproduce** | 1. Navigate to the event detail page. 2. Scroll to the "Registration roles" section showing "Registered: 1/200". 3. Look for a progress bar widget accompanying the slot data. |
| **Expected Result** | A visual progress bar (e.g., a filled bar showing approximately 0.5% completion) should be displayed adjacent to or below the "Registered: 1/200" counter to visually convey slot utilisation. |
| **Actual Result** | Only text counters are displayed (Registered: 1/200, Pending: 1, Confirmed: 0, Waitlisted: 0). No visual progress bar widget accompanies the slot utilisation data. |
| **Severity** | 1 — Cosmetic |
| **Screenshot** | `screenshots/B2_registration_roles_section.png` |
| **Type** | Bug |

---

## Bug #11

| Field | Value |
|-------|-------|
| **Bug ID** | BUG-B2-011 |
| **Screen** | B2 — Event Detail Page |
| **Checklist Item** | IA-04-015 — Icon-only buttons have tooltips on hover/focus |
| **Steps to Reproduce** | 1. Navigate to the event detail page. 2. Scroll to bottom-right corner and locate the floating circular blue button with a share icon. 3. Hover over this button with the mouse. 4. Wait for a tooltip to appear. |
| **Expected Result** | A descriptive tooltip (e.g., "Share this event") appears on hover, clearly identifying the action of this icon-only button. |
| **Actual Result** | No tooltip appears when hovering over the floating share icon button. The button has no accessible label or tooltip visible to the user. |
| **Severity** | 1 — Cosmetic |
| **Screenshot** | `screenshots/B2_registration_roles_section.png` |
| **Type** | Bug |

---

## Bug Severity Distribution

| Severity | Count | Bug IDs |
|----------|-------|---------|
| 1 — Cosmetic | 2 | BUG-B2-010, BUG-B2-011 |
| 2 — Minor | 7 | BUG-B2-001, BUG-B2-004, BUG-B2-005, BUG-B2-006, BUG-B2-007, BUG-B2-008, BUG-B2-009 |
| 3 — Major | 2 | BUG-B2-002, BUG-B2-003 |
| 4 — Critical | 0 | — |
| **Total** | **11** | |

## Bug Category Distribution

| Category | Count |
|----------|-------|
| Accessibility (alt text, focus, tooltips) | 3 |
| Navigation (breadcrumb, active state) | 3 |
| Internationalisation / Responsive | 2 |
| Form Feedback / Validation UX | 2 |
| Feedback / Toasts | 1 |

---

# B4 — My Registrations / Ticket

## Bug #12

| Field | Value |
|-------|-------|
| **Bug ID** | BUG-B4-001 |
| **Screen** | B4 — My Registrations / Ticket (`/profile`) |
| **Checklist Item** | IA-01-003 — Normal text meets WCAG AA contrast |
| **Steps to Reproduce** | 1. Log in as the Scenario B student. 2. Open `/profile`. 3. Inspect the `Student` badge, `Export` button, and active pagination button with DevTools. 4. Compare foreground and background colours. |
| **Expected Result** | Normal-sized text has a contrast ratio of at least 4.5:1. |
| **Actual Result** | White `Student` text on cyan is approximately 2.08:1, white `Export` text on green approximately 2.71:1, and the active page number approximately 2.08:1. |
| **Severity** | 2 — Minor |
| **Screenshot** | `screenshots/B4_IA-01-003_fail.png` |
| **Type** | Bug |

## Bug #13

| Field | Value |
|-------|-------|
| **Bug ID** | BUG-B4-002 |
| **Screen** | B4 — My Registrations / Ticket (`/profile`) |
| **Checklist Item** | IA-01-006 — Images preserve expected aspect ratio |
| **Steps to Reproduce** | 1. Open `/profile`. 2. Scroll to `My Activities`. 3. Compare the three event thumbnails, especially the Summer School banner and square LUMOS artwork. |
| **Expected Result** | Each image preserves its intended aspect ratio without inappropriate cropping or stretching. |
| **Actual Result** | Sources with materially different ratios (for example 1200 × 450 and 2048 × 2048) are forced into the same approximately 218 × 186 display box, cropping important content. |
| **Severity** | 2 — Minor |
| **Screenshot** | `screenshots/B4_IA-01-006_fail.png` |
| **Type** | Bug |

## Bug #14

| Field | Value |
|-------|-------|
| **Bug ID** | BUG-B4-003 |
| **Screen** | B4 — My Registrations / Ticket (`/profile`) |
| **Checklist Item** | IA-01-009 — Visible asynchronous loading state |
| **Steps to Reproduce** | 1. Open DevTools and throttle the network to Slow 3G. 2. Reload `/profile` with cache disabled. 3. Observe the page while the document is still busy and before profile data appears. |
| **Expected Result** | A visible spinner, skeleton, or progress indicator occupies the profile content area until data is ready. |
| **Actual Result** | Only the public header appears; the profile content region is blank with no visible loading indicator. |
| **Severity** | 2 — Minor |
| **Screenshot** | `screenshots/B4_IA-01-009_fail.png` |
| **Type** | Bug |

## Bug #15

| Field | Value |
|-------|-------|
| **Bug ID** | BUG-B4-004 |
| **Screen** | B4 — My Registrations / Ticket (`/profile`) |
| **Checklist Item** | IA-01-011 — Interactive targets are at least 24 × 24 CSS px |
| **Steps to Reproduce** | 1. Open `/profile` at desktop width. 2. Inspect the bounding rectangles of the search input and footer links. |
| **Expected Result** | Every interactive control has a target at least 24 CSS px high and wide. |
| **Actual Result** | The search input’s interactive rectangle is approximately 20 px high, while several footer links are approximately 19 px high. |
| **Severity** | 2 — Minor |
| **Screenshot** | `screenshots/B4_IA-01-011_fail.png` |
| **Type** | Bug |

## Bug #16

| Field | Value |
|-------|-------|
| **Bug ID** | BUG-B4-005 |
| **Screen** | B4 — My Registrations / Ticket (`/profile`) |
| **Checklist Item** | IA-01-013 — Language toggle updates all visible UI text |
| **Steps to Reproduce** | 1. Open `/profile` in English. 2. Open the flag menu. 3. Select `Tiếng Việt`. 4. Review the profile actions, badges, roles, and pagination. |
| **Expected Result** | All visible interface strings switch to Vietnamese in one render without truncation or layout break. |
| **Actual Result** | Visible strings remain in English, including `Show QR code`, `Student`, `Participant`, `Rows per page`, and `Go to page`. |
| **Severity** | 3 — Major |
| **Screenshot** | `screenshots/B4_IA-01-013_fail.png` |
| **Type** | Bug |

## Bug #17

| Field | Value |
|-------|-------|
| **Bug ID** | BUG-B4-006 |
| **Screen** | B4 — My Registrations / Ticket (`/profile`) |
| **Checklist Item** | IA-01-015 — Page remains usable at 320 CSS px |
| **Steps to Reproduce** | 1. Open `/profile`. 2. Emulate a 320 × 800 CSS-pixel phone viewport. 3. Inspect the profile action row and registration cards. |
| **Expected Result** | Controls reflow without horizontal clipping, overlap, or truncated functional content. |
| **Actual Result** | The action row exceeds the container and clips the third action; internal profile/activity regions measure as wide as 457 px, and registration content is truncated. |
| **Severity** | 3 — Major |
| **Screenshot** | `screenshots/B4_IA-01-015_fail.png` |
| **Type** | Bug |

## Bug #18

| Field | Value |
|-------|-------|
| **Bug ID** | BUG-B4-007 |
| **Screen** | B4 — My Registrations / Ticket (`/profile`) |
| **Checklist Item** | IA-02-002 — Every form field has a persistent visible label |
| **Steps to Reproduce** | 1. Open `/profile`. 2. Inspect the activity search input. 3. Scroll to the pagination controls and inspect `Go to page`. 4. Enter a value in either field. |
| **Expected Result** | Each field has a visible label that remains present while the field contains a value. |
| **Actual Result** | Both fields rely on placeholder/accessible-name text and have no associated persistent visible `<label>`. |
| **Severity** | 2 — Minor |
| **Screenshot** | `screenshots/B4_IA-02-002_fail.png` |
| **Type** | Bug |

## Bug #19

| Field | Value |
|-------|-------|
| **Bug ID** | BUG-B4-008 |
| **Screen** | B4 — My Registrations / Ticket (`/profile`) |
| **Checklist Item** | IA-02-007 — Date range enforces logical constraints |
| **Steps to Reproduce** | 1. Open `/profile`. 2. Open `Filters`. 3. Using only the keyboard, enter start `10/08/2026`. 4. Enter end `01/08/2026`. 5. Move focus away and inspect the result list. |
| **Expected Result** | The end-before-start range is prevented or a clear inline error is displayed, and the invalid filter is not applied. |
| **Actual Result** | Both dates are accepted with no error or invalid styling; the page continues to show all three registrations. |
| **Severity** | 2 — Minor |
| **Screenshot** | `screenshots/B4_IA-02-007_fail.png` |
| **Type** | Bug |

## Bug #20

| Field | Value |
|-------|-------|
| **Bug ID** | BUG-B4-009 |
| **Screen** | B4 — My Registrations / Ticket (`/profile`) |
| **Checklist Item** | IA-04-015 — Icon-only controls display a tooltip |
| **Steps to Reproduce** | 1. Open `/profile`. 2. Hover and keyboard-focus the language and notification icon buttons. 3. Scroll to the pagination controls and hover/focus previous and next icons. |
| **Expected Result** | Each icon-only control presents a descriptive visible tooltip on hover or focus. |
| **Actual Result** | Language and notification buttons have accessible names but no visible tooltip/title; initial previous/next pagination buttons expose neither text nor tooltip. |
| **Severity** | 1 — Cosmetic |
| **Screenshot** | `screenshots/B4_IA-04-015_fail.png` |
| **Type** | Bug |

## B4 Bug Severity Distribution

| Severity | Count | Bug IDs |
|----------|------:|---------|
| 1 — Cosmetic | 1 | BUG-B4-009 |
| 2 — Minor | 6 | BUG-B4-001, BUG-B4-002, BUG-B4-003, BUG-B4-004, BUG-B4-007, BUG-B4-008 |
| 3 — Major | 2 | BUG-B4-005, BUG-B4-006 |
| 4 — Critical | 0 | — |
| **Total B4** | **9** | |

# B1 — Home / Events List

## Bug #21

| Field | Value |
|-------|-------|
| **Bug ID** | BUG-B1-001 |
| **Screen** | B1 — Home / Events List (`/dashboard`) |
| **Checklist Item** | IA-01-003 — Normal text meets WCAG AA contrast |
| **Steps to Reproduce** | 1. Log in and open `/dashboard`. 2. Run a Lighthouse accessibility snapshot or inspect computed foreground/background colours. 3. Review active navigation, event chips, registration badges, and secondary card text. |
| **Expected Result** | Normal-sized text has a contrast ratio of at least 4.5:1. |
| **Actual Result** | Lighthouse reports failures including cyan on white at 2.08:1, orange chips at 3.59:1, green chips at 3.65:1, and card copy at 4.34:1. |
| **Severity** | 2 — Minor |
| **Screenshot** | `screenshots/B1_IA-01-003_fail.png` |
| **Type** | Bug |

## Bug #22

| Field | Value |
|-------|-------|
| **Bug ID** | BUG-B1-002 |
| **Screen** | B1 — Home / Events List (`/dashboard`) |
| **Checklist Item** | IA-01-004 — Component boundaries and meaningful icons reach 3:1 contrast |
| **Steps to Reproduce** | 1. Open `/dashboard`. 2. Inspect the search/filter control borders and cyan icons against their white/light-grey backgrounds. 3. Compare the computed colours. |
| **Expected Result** | Meaningful icons and essential control boundaries reach at least 3:1 against adjacent colours. |
| **Actual Result** | Light-grey boundaries and cyan icons are visibly faint and do not consistently reach 3:1. |
| **Severity** | 2 — Minor |
| **Screenshot** | `screenshots/B1_IA-01-004_fail.png` |
| **Type** | Bug |

## Bug #23

| Field | Value |
|-------|-------|
| **Bug ID** | BUG-B1-003 |
| **Screen** | B1 — Home / Events List (`/dashboard`) |
| **Checklist Item** | IA-01-006 — Event images preserve expected aspect ratio |
| **Steps to Reproduce** | 1. Open `/dashboard`. 2. Compare event images whose sources are 1200×450, 1228×687, and 2048×2048. 3. Inspect their rendered boxes and `object-fit`. |
| **Expected Result** | Artwork preserves its expected composition without inappropriate cropping or stretching. |
| **Actual Result** | Materially different source ratios are forced into approximately 504.5×378.4 boxes with `object-fit: cover`, cropping artwork content. |
| **Severity** | 2 — Minor |
| **Screenshot** | `screenshots/B1_IA-01-006_fail.png` |
| **Type** | Bug |

## Bug #24

| Field | Value |
|-------|-------|
| **Bug ID** | BUG-B1-004 |
| **Screen** | B1 — Home / Events List (`/dashboard`) |
| **Checklist Item** | IA-01-007 — Paragraph line height is at least 1.5× font size |
| **Steps to Reproduce** | 1. Open `/dashboard`. 2. Inspect an event-card description paragraph. 3. Compare its computed font size and line height. |
| **Expected Result** | Paragraph line height is at least 1.5 times its font size. |
| **Actual Result** | Event-card copy computes to 14px font size and 20px line height, approximately 1.43×. |
| **Severity** | 1 — Cosmetic |
| **Screenshot** | `screenshots/B1_IA-01-007_fail.png` |
| **Type** | Bug |

## Bug #25

| Field | Value |
|-------|-------|
| **Bug ID** | BUG-B1-005 |
| **Screen** | B1 — Home / Events List (`/dashboard`) |
| **Checklist Item** | IA-01-009 — Visible asynchronous loading state |
| **Steps to Reproduce** | 1. Throttle the network to Slow 3G. 2. Reload `/dashboard` with cache disabled. 3. Observe the content area before event data and authentication state resolve. |
| **Expected Result** | A spinner, skeleton, or progress indicator occupies the main content area until data is ready. |
| **Actual Result** | Header and footer render around a large blank main region with no visible loading indicator. |
| **Severity** | 2 — Minor |
| **Screenshot** | `screenshots/B1_IA-01-009_fail.png` |
| **Type** | Bug |

## Bug #26

| Field | Value |
|-------|-------|
| **Bug ID** | BUG-B1-006 |
| **Screen** | B1 — Home / Events List (`/dashboard`) |
| **Checklist Item** | IA-01-011 — Interactive targets are at least 24×24 CSS px |
| **Steps to Reproduce** | 1. Open `/dashboard` at desktop width. 2. Run Lighthouse or inspect interactive bounding rectangles. 3. Check the spotlight “View details” link and event-search control. |
| **Expected Result** | Each interactive target is at least 24 CSS px high and wide, or has equivalent safe spacing. |
| **Actual Result** | The spotlight “View details” target is approximately 104.7×20px; the inspected search node is also approximately 20px high. |
| **Severity** | 2 — Minor |
| **Screenshot** | `screenshots/B1_IA-01-011_fail.png` |
| **Type** | Bug |

## Bug #27

| Field | Value |
|-------|-------|
| **Bug ID** | BUG-B1-007 |
| **Screen** | B1 — Home / Events List (`/dashboard`) |
| **Checklist Item** | IA-01-015 — Page remains usable at 320 CSS px |
| **Steps to Reproduce** | 1. Emulate a 320×800 touch viewport. 2. Reload `/dashboard`. 3. Inspect the status filter, spotlight metadata, search field, and event cards. |
| **Expected Result** | Content reflows without functional text truncation, overlap, or horizontal scrolling. |
| **Actual Result** | Functional strings are ellipsized, including the status-filter label and spotlight date; event titles and descriptions are aggressively truncated. |
| **Severity** | 3 — Major |
| **Screenshot** | `screenshots/B1_IA-01-015_fail.png` |
| **Type** | Bug |

## Bug #28

| Field | Value |
|-------|-------|
| **Bug ID** | BUG-B1-008 |
| **Screen** | B1 — Home / Events List (`/dashboard`) |
| **Checklist Item** | IA-02-002 — Every field has a persistent visible label |
| **Steps to Reproduce** | 1. Open `/dashboard`. 2. Inspect the event-search input before and after entering text. 3. Review its associated label elements. |
| **Expected Result** | The search field has a persistent visible label that remains available when the field contains text. |
| **Actual Result** | Search relies on placeholder/ARIA text only; no persistent visible `<label>` is present. |
| **Severity** | 2 — Minor |
| **Screenshot** | `screenshots/B1_IA-02-002_fail.png` |
| **Type** | Bug |

## Bug #29

| Field | Value |
|-------|-------|
| **Bug ID** | BUG-B1-009 |
| **Screen** | B1 — Home / Events List (`/dashboard`) |
| **Checklist Item** | IA-04-009 — Successful actions notify and update the UI |
| **Steps to Reproduce** | 1. Open `/dashboard`. 2. Activate “Save” on an unsaved event card. 3. Observe the button state and page live-alert region. 4. Activate “Unsave” to restore the original state. |
| **Expected Result** | The button updates and a clear success notification confirms the save/unsave operation. |
| **Actual Result** | The button state changes immediately, but no toast or success message is emitted. |
| **Severity** | 2 — Minor |
| **Screenshot** | `screenshots/B1_IA-04-009_fail.png` |
| **Type** | Bug |

## Bug #30

| Field | Value |
|-------|-------|
| **Bug ID** | BUG-B1-010 |
| **Screen** | B1 — Home / Events List (`/dashboard`) |
| **Checklist Item** | IA-04-015 — Icon-only buttons expose descriptive tooltips |
| **Steps to Reproduce** | 1. Scroll to B1 pagination. 2. Hover and keyboard-focus Previous and Next. 3. Inspect accessible names and `title` attributes. |
| **Expected Result** | Both icon-only pagination buttons display a descriptive tooltip on hover/focus and expose an accessible name. |
| **Actual Result** | Previous and Next have no visible text, `aria-label`, or `title`; Lighthouse flags both as unnamed buttons. |
| **Severity** | 2 — Minor |
| **Screenshot** | `screenshots/B1_IA-04-015_fail.png` |
| **Type** | Bug |

## B1 Bug Severity Distribution

| Severity | Count | Bug IDs |
|----------|------:|---------|
| 1 — Cosmetic | 1 | BUG-B1-004 |
| 2 — Minor | 8 | BUG-B1-001, BUG-B1-002, BUG-B1-003, BUG-B1-005, BUG-B1-006, BUG-B1-008, BUG-B1-009, BUG-B1-010 |
| 3 — Major | 1 | BUG-B1-007 |
| 4 — Critical | 0 | — |
| **Total B1** | **10** | |

## Combined Structured Bug Distribution

| Severity | B1 | B2 | B4 | Total |
|----------|---:|---:|---:|------:|
| 1 — Cosmetic | 1 | 2 | 1 | 4 |
| 2 — Minor | 8 | 7 | 6 | 21 |
| 3 — Major | 1 | 2 | 2 | 5 |
| 4 — Critical | 0 | 0 | 0 | 0 |
| **Total** | **10** | **11** | **9** | **30** |
