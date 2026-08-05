# Checklist Execution Results — Screen B2: Event Detail Page

| Field | Value |
|-------|-------|
| **Screen ID** | B2 |
| **Screen Name** | Event Detail Page |
| **SUT URL** | https://prod-dev.ems-fitus.cloud/events/{id} |
| **Scenario** | B |
| **Tester** | Thái Minh Huy — 23127379 |
| **Date** | 2026-07-28 |
| **Browser** | Chrome (latest) |
| **OS** | macOS |
| **Viewport** | 1456 × 816 px (desktop) |
| **Checklist Source** | artifacts/01-checklist/shared-gui-checklist.md |

---

## Screen Description

The **Event Detail page** is the primary information and action page for a specific event in EMS. Key UI areas:

- **Banner/Hero image** — event cover photo with "Upcoming" badge
- **Event header** — title, subtitle, tag chips (category + campus), "Save event" / "Saved" button
- **Info cards** — Event date, Registration period, Check-in period, Location, Slot available
- **Detailed content section** — rich-text body with event description
- **Registration roles section** — role checkboxes (Participant/Visitor), slot counters, Register/Cancel button
- **Footer** — institution info, links, social icons

States exercised during testing:
1. Not registered (default view)
2. Role selected but not submitted (pre-register)
3. Validation trigger — attempt to register without selecting a role
4. Registered (Pending review state)
5. Cancel registration confirmation dialog
6. Event saved / unsaved toggle

---

## IA-01 — General UI Standards

| Checklist ID | Description (abbreviated) | Status | Notes |
|---|---|---|---|
| IA-01-001 | Content in consistent max-width container | ✅ Pass | Page uses a centred ~940px column; no bleed at 1456px viewport. |
| IA-01-002 | Design-system fonts; no browser-default serif | ✅ Pass | Sans-serif font (Inter-style) used consistently throughout. |
| IA-01-003 | Body text contrast ≥ 4.5:1 | ✅ Pass | Dark text on light-grey background visually passes WCAG AA. |
| IA-01-004 | UI component boundaries contrast ≥ 3:1 | ✅ Pass | Card borders and checkboxes have sufficient contrast. |
| IA-01-005 | Images render without blur/pixelation | ✅ Pass | Hero banner renders crisply. No broken-image icons observed. |
| IA-01-006 | Images maintain aspect ratio at every breakpoint | ✅ Pass | Banner aspect ratio consistent at desktop viewport. |
| IA-01-007 | Line height ≥ 1.5× font size in body text | ✅ Pass | Event body paragraphs have comfortable line spacing. |
| IA-01-008 | Meaningful images have alt text / fallback | ❌ Fail | Hero banner image shows no descriptive alt attribute on hover; no tooltip appears. Screenshot: B2_IA-01-008_fail.png |
| IA-01-009 | Loading spinner/skeleton during async fetch | ✅ Pass | Brief loading state observed before event content renders. |
| IA-01-010 | Empty state message when list has zero items | ✅ Pass | Zero slot counters (Pending: 0, Waitlisted: 0) displayed clearly. |
| IA-01-011 | Interactive elements min 24×24 px touch target | ✅ Pass | Buttons and checkboxes meet minimum size. |
| IA-01-012 | Carousel nav controls visually distinct | N/A | No carousel on Event Detail page. |
| IA-01-013 | Language toggle updates all UI text | ❌ Fail | Switching EN→VI via flag icon does NOT translate event title, body content, or registration labels — only some chrome strings change. Expected: full UI translation. Actual: partial translation only. Screenshot: B2_IA-01-013_fail.png |
| IA-01-014 | Carousel keyboard accessible | N/A | No carousel on this page. |
| IA-01-015 | Page usable at 200% zoom / 320px viewport | ❌ Fail | At 200% zoom, the three info cards (Event date / Registration period / Check-in period) overflow their flex container causing horizontal scroll. At narrow viewport, Registration roles panel overflows. Screenshot: B2_IA-01-013_fail.png |
| IA-01-016 | Dark/Light mode toggle works | N/A | EMS provides no dark/light mode toggle. |
| IA-01-017 | Consistent spacing/alignment across page | ✅ Pass | Info cards and role cards are evenly spaced; icon+text pairs aligned. |

**IA-01 Sub-total: Pass 11 · Fail 3 · N/A 3**

---

## IA-02 — Forms

> The Event Detail page has limited form-like interaction: only the registration roles checkbox section and Register/Cancel button.

| Checklist ID | Description (abbreviated) | Status | Notes |
|---|---|---|---|
| IA-02-001 | Required fields show red asterisk | N/A | Registration uses checkboxes, not labelled required text fields. |
| IA-02-002 | Visible label above/left of every field | ✅ Pass | "Registration roles" heading and role names label the checkboxes clearly. |
| IA-02-003 | Inline error on leaving required field blank | ❌ Fail | Clicking "Register (Student)" with no role selected shows "Please tick a role before submitting registration." below the section, but individual checkbox cards are NOT highlighted. Error placement is below overall section rather than adjacent to each role. Screenshot: B2_IA-02-003_fail.png |
| IA-02-004 | Error messages include specific corrective suggestion | ✅ Pass | "Please tick a role before submitting registration." is specific and actionable. |
| IA-02-005 | All error fields highlighted simultaneously | ❌ Fail | Role checkbox cards are not visually highlighted (no red border/background) when validation fails — only the text message appears. Screenshot: B2_IA-02-003_fail.png |
| IA-02-006 | Dropdown accessible and shows selected value | N/A | No dropdown on this screen. |
| IA-02-007 | Date/time picker enforces logical constraints | N/A | Dates are read-only display cards, not inputs. |
| IA-02-008 | Date/time picker keyboard accessible | N/A | No date input on this screen. |
| IA-02-009 | File upload shows constraints | N/A | No file upload on this screen. |
| IA-02-010 | Drag-and-drop upload zone changes state on hover | N/A | No file upload on this screen. |
| IA-02-011 | File upload error adjacent to control | N/A | No file upload on this screen. |
| IA-02-012 | RTE formatting buttons give WYSIWYG feedback | N/A | Event body is rendered (read-only) HTML — no RTE for attendees. |
| IA-02-013 | Image upload thumbnail preview with remove button | N/A | No image upload on this screen. |
| IA-02-014 | RTE defined minimum height and graceful overflow | N/A | No RTE on this screen. |
| IA-02-015 | Primary action visually distinct from secondary | ✅ Pass | "Register (Student)" = filled blue primary button. "Cancel registration" = outlined red-text secondary. Clear hierarchy. Screenshot: B2_IA-02-015_pass.png |
| IA-02-016 | Password field has eye-icon visibility toggle | N/A | No password input on this screen. |

**IA-02 Sub-total: Pass 3 · Fail 2 · N/A 11**

---

## IA-03 — Navigation

| Checklist ID | Description (abbreviated) | Status | Notes |
|---|---|---|---|
| IA-03-001 | Sidebar nav present and consistent on every page | ✅ Pass | Top navigation bar (Events, Calendar, Saved Events, User Guide) is consistently present. EMS uses top-nav instead of sidebar. Screenshot: B2_IA-03-001_pass.png |
| IA-03-002 | Active page item visually distinguished | ❌ Fail | "Events" item is highlighted in top nav, but no sub-level breadcrumb or active indicator shows the specific event context. Expected: sub-level indicator or breadcrumb. Actual: only top-level "Events" highlighted, no event-level path. Screenshot: B2_IA-03-005_fail.png |
| IA-03-003 | Collapsed sidebar icons have tooltips | N/A | No collapsible sidebar; EMS uses top-nav. |
| IA-03-004 | Sidebar reachable via Tab with visible focus | ❌ Fail | Focus outline on top-nav items was not clearly visible during keyboard navigation; "Back to events" link is reachable but top-nav items' focus state lacks clear visual indicator. Requires further live keyboard testing. |
| IA-03-005 | Breadcrumb reflects current location | ❌ Fail | No breadcrumb trail on the Event Detail page. Only "← Back to events" button provided — not a hierarchical breadcrumb. Expected: Events > [Event Name] breadcrumb. Screenshot: B2_IA-03-005_fail.png |
| IA-03-006 | Tab panels display correct content; active tab distinct | N/A | No tab panel on this page. |
| IA-03-007 | Tab panels keyboard accessible | N/A | No tab panel on this page. |
| IA-03-008 | Drag-and-drop shows drag handle with ghost | N/A | No drag-and-drop on this page. |
| IA-03-009 | Drag-and-drop keyboard alternative | N/A | No drag-and-drop on this page. |
| IA-03-010 | Back/Cancel clearly labelled | ✅ Pass | "← Back to events" clearly labelled at page top. |
| IA-03-011 | Sticky headers don't obscure focused elements | ✅ Pass | Top nav (~56px height) does not obscure registration section when scrolled into view. |
| IA-03-012 | Deep-link URL renders correct content | ✅ Pass | Direct URL to event detail page renders the correct event without needing to navigate from the listing page. |
| IA-03-013 | Tab order follows visual reading order | ✅ Pass | Top-to-bottom tab order from nav → Back button → event info → registration section was logically consistent. |
| IA-03-014 | Pagination highlights current page | N/A | No pagination on this page. |

**IA-03 Sub-total: Pass 5 · Fail 3 · N/A 6**

---

## IA-04 — Feedback / State

| Checklist ID | Description (abbreviated) | Status | Notes |
|---|---|---|---|
| IA-04-001 | Toast position consistent; auto-dismiss ≥5s; manual X button | ❌ Fail | Registration success toast appeared without a visible manual dismiss (×) button. Toast auto-dismissed in ~3 seconds (below the ≥5 second minimum). Screenshot: B2_IA-04-001_fail.png |
| IA-04-002 | Toast colour semantics match meaning | ✅ Pass | Success state uses appropriate green-toned confirmation. Colour aligns with expected semantic. |
| IA-04-003 | Toast animates in/out without shifting content | ✅ Pass | Toast appeared/disappeared without causing page layout shift. |
| IA-04-004 | Status badges use text + icon, not colour alone | ✅ Pass | "Upcoming" badge (text+colour), "Pending review" badge (text+colour), slot count labels all use text. |
| IA-04-005 | Confirmation dialog before destructive actions | ✅ Pass | "Cancel registration" triggers modal: "Are you sure you want to cancel your registration?" with "Cancel" and "Cancel registration" buttons. Screenshot: B2_IA-04-005_pass.png |
| IA-04-006 | Modal traps focus; Esc/overlay dismisses; focus returns | ✅ Pass | Cancel confirmation dialog dismissible via Cancel button; focus management returns to page. Screenshot: B2_IA-04-006_pass.png |
| IA-04-007 | Progress bars show numerical value adjacent to bar | ❌ Fail | Slot counts displayed as "Registered: 1/200" (text only), but no visual progress bar widget exists for slot utilisation. Checklist requires a visual bar. Screenshot: B2_registration_roles_section.png |
| IA-04-008 | Progress bars animate smoothly | N/A | No progress bar widget on this page. |
| IA-04-009 | Successful actions trigger notification and UI updates | ✅ Pass | After clicking "Register (Student)", role shows "Pending" badge, counter increments, button changes to "Cancel registration". Screenshot: B2_IA-04-009_pass.png |
| IA-04-010 | Failed actions show user-friendly error (no stack traces) | ✅ Pass | "Please tick a role before submitting registration." is user-friendly with no system exceptions. |
| IA-04-011 | On failed submission, form stays populated | ✅ Pass | When validation fails, registration roles section stays as-is — no data lost. |
| IA-04-012 | Real-time log entries have consistent formatting | N/A | No real-time log/feed on this page. |
| IA-04-013 | Item removal updates layout gracefully | ✅ Pass | After cancel registration, role cards reset cleanly without layout break. |
| IA-04-014 | Interactive elements show hover/click feedback | ✅ Pass | Register button darkens on hover; "Save event" changes to "Saved" with filled bookmark icon on click. |
| IA-04-015 | Icon-only buttons have tooltips | ❌ Fail | Floating share button (bottom-right, blue circle with share icon) shows no tooltip on hover or focus. Expected: descriptive tooltip. Actual: no tooltip. Screenshot: B2_registration_roles_section.png |

**IA-04 Sub-total: Pass 10 · Fail 3 · N/A 2**

---

## Execution Summary — Screen B2

| Metric | Count |
|--------|-------|
| Actual checklist rows | 62 |
| Checklist metadata count | 63 (inconsistent with actual rows) |
| Not Applicable (N/A) | 22 |
| **Executed (Pass + Fail)** | **40** |
| **Passed ✅** | **29** |
| **Failed ❌** | **11** |
| **Pass Rate** | **72.5%** (of executed items) |

### Failed Items Summary

| # | ID | Description | Severity | Category |
|---|----|-------------|----------|----------|
| 1 | IA-01-008 | Hero banner missing alt text | 2 — Minor | Accessibility |
| 2 | IA-01-013 | VI language switch partial — event content not translated | 3 — Major | i18n |
| 3 | IA-01-015 | Layout breaks at 200% zoom / 320px viewport | 3 — Major | Responsive |
| 4 | IA-02-003 | Validation error not shown adjacent to individual role checkbox | 2 — Minor | Form Feedback |
| 5 | IA-02-005 | Erroneous role cards not highlighted after validation failure | 2 — Minor | Form Feedback |
| 6 | IA-03-002 | No sub-level active nav indicator for current event | 2 — Minor | Navigation |
| 7 | IA-03-004 | Keyboard focus outline unclear on top-nav items | 2 — Minor | Accessibility |
| 8 | IA-03-005 | No breadcrumb trail on Event Detail page | 2 — Minor | Navigation |
| 9 | IA-04-001 | Toast: no manual dismiss button; auto-dismisses <5 seconds | 2 — Minor | Feedback |
| 10 | IA-04-007 | No visual progress bar for slot utilisation | 1 — Cosmetic | Feedback |
| 11 | IA-04-015 | Floating share icon-only button has no tooltip | 1 — Cosmetic | Accessibility |

---

## Test Environment

| Parameter | Value |
|-----------|-------|
| **Browser** | Google Chrome (latest stable) |
| **OS** | macOS |
| **SUT URL** | https://prod-dev.ems-fitus.cloud/ |
| **Test account** | 23127379@student.hcmus.edu.vn |
| **Test date** | 2026-07-28 |
| **Event tested** | "USING AI AGENT CONVERSATION" (Conferences & Seminars / Cho Quan Campus) |
| **Screenshots folder** | artifacts/02-execution/screenshots/ |
