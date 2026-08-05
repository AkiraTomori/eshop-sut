# Execution Summary — Scenario B GUI Checklist Testing

| Field | Value |
|-------|-------|
| **Scenario** | B |
| **Tester** | Thái Minh Huy — 23127379 |
| **Screens Completed** | B1 — Home / Events List; B2 — Event Detail; B4 — My Registrations / Ticket |
| **Latest Execution Date** | 2026-07-29 |
| **Checklist** | artifacts/01-checklist/shared-gui-checklist.md |

> Stage 2’s configured three-screen set is now complete. The checklist metadata declares 63 items, but its four tables contain 62 distinct rows (17 + 16 + 14 + 15). All three screen reports evaluate those 62 actual rows.

## Cross-Screen Pass Rate Summary

| Screen | Screen Name | Executed | Passed | Failed | N/A | Pass Rate |
|--------|-------------|---------:|-------:|-------:|----:|----------:|
| B1 | Home / Events List | 23 | 13 | 10 | 39 | 56.5% |
| B2 | Event Detail Page | 40 | 29 | 11 | 22 | 72.5% |
| B4 | My Registrations / Ticket | 25 | 16 | 9 | 37 | 64.0% |
| **Combined** | **3 screens** | **88** | **58** | **30** | **98** | **65.9%** |

## Failure Analysis by Interface Aspect

### B1 — Home / Events List

| Interface Aspect | Executed | Passed | Failed | N/A | Pass Rate |
|-----------------|---------:|-------:|-------:|----:|----------:|
| IA-01 General UI Standards | 14 | 7 | 7 | 3 | 50.0% |
| IA-02 Forms | 2 | 1 | 1 | 14 | 50.0% |
| IA-03 Navigation | 3 | 3 | 0 | 11 | 100.0% |
| IA-04 Feedback/State | 4 | 2 | 2 | 11 | 50.0% |
| **Total** | **23** | **13** | **10** | **39** | **56.5%** |

### B2 — Event Detail

| Interface Aspect | Executed | Passed | Failed | N/A | Pass Rate |
|-----------------|---------:|-------:|-------:|----:|----------:|
| IA-01 General UI Standards | 14 | 11 | 3 | 3 | 78.6% |
| IA-02 Forms | 5 | 3 | 2 | 11 | 60.0% |
| IA-03 Navigation | 8 | 5 | 3 | 6 | 62.5% |
| IA-04 Feedback/State | 13 | 10 | 3 | 2 | 76.9% |
| **Total** | **40** | **29** | **11** | **22** | **72.5%** |

### B4 — My Registrations / Ticket

| Interface Aspect | Executed | Passed | Failed | N/A | Pass Rate |
|-----------------|---------:|-------:|-------:|----:|----------:|
| IA-01 General UI Standards | 14 | 8 | 6 | 3 | 57.1% |
| IA-02 Forms | 4 | 2 | 2 | 12 | 50.0% |
| IA-03 Navigation | 3 | 3 | 0 | 11 | 100.0% |
| IA-04 Feedback/State | 4 | 3 | 1 | 11 | 75.0% |
| **Total** | **25** | **16** | **9** | **37** | **64.0%** |

## Cross-Screen Failure Patterns

1. **Responsive and content reflow**
   - B1 truncates functional labels and spotlight metadata at phone width.
   - B2’s information/registration regions break under high zoom or narrow width.
   - B4 clips profile actions and registration content at 320px.

2. **Visual and control accessibility**
   - B1 and B4 contain low-contrast text, weak component boundaries, and undersized targets.
   - B1/B4 pagination arrows lack names or tooltips; B2’s share icon lacks a tooltip.
   - B2 also reports missing hero-image alternative text and unclear navigation focus.

3. **Loading and state visibility**
   - B1 and B4 show blank content regions during throttled loading.
   - B1 save/unsave changes state without a success notification.
   - B2’s success toast is too brief and lacks a dismiss button.

4. **Forms and validation**
   - B1 and B4 searches rely on placeholder text instead of persistent labels.
   - B4 accepts an end-before-start date filter.
   - B2 role validation does not highlight the erroneous choices.

5. **Image presentation**
   - B1 and B4 force materially different artwork ratios into fixed `object-fit: cover` boxes, cropping content.

6. **Internationalisation**
   - B1’s navigation, filters, metadata, pagination, and footer translate correctly.
   - B2 and B4 retain untranslated strings or single-language event/account content.

## Structured Bug Severity Distribution

| Severity | B1 | B2 | B4 | Total |
|----------|---:|---:|---:|------:|
| 1 — Cosmetic | 1 | 2 | 1 | 4 |
| 2 — Minor | 8 | 7 | 6 | 21 |
| 3 — Major | 1 | 2 | 2 | 5 |
| 4 — Critical | 0 | 0 | 0 | 0 |
| **Total structured bugs** | **10** | **11** | **9** | **30** |

> The 30 structured bug reports correspond exactly to the 30 failed checklist results across B1, B2, and B4.

## Recommended Priorities

| Priority | Bug(s) | Recommendation | Impact |
|----------|--------|----------------|--------|
| P1 | BUG-B1-007, BUG-B2-003, BUG-B4-006 | Rework responsive grids, actions, and functional labels for 320px and 200% zoom. | Core mobile and low-vision usability |
| P2 | BUG-B1-001/002, BUG-B4-001 | Replace low-contrast text/icon/border tokens with WCAG-compliant design tokens. | Systemic accessibility |
| P3 | BUG-B1-005, BUG-B4-003 | Add stable loading skeletons to dashboard/profile content regions. | Visibility of system status |
| P4 | BUG-B2-002, BUG-B4-005 | Complete and consistently apply Vietnamese localisation. | i18n compliance |
| P5 | BUG-B1-008, BUG-B4-007 | Add persistent visible and programmatically associated labels. | Form accessibility |
| P6 | BUG-B1-010, BUG-B2-011, BUG-B4-009 | Add accessible names and visible tooltips to all icon-only controls. | Keyboard/screen-reader clarity |
| P7 | BUG-B1-009, BUG-B2-009 | Standardise success feedback with dismissible, sufficiently persistent notifications. | Action confidence |

## Evidence and Environment

- Live SUT: https://prod-dev.ems-fitus.cloud/
- Primary environment: Chrome on macOS, 1440×900 CSS px
- Additional checks: 320×800 touch emulation, Slow 3G, keyboard-only focus, EN/VI switching, Lighthouse snapshot
- All failure screenshots were captured from the live EMS and stored in `artifacts/02-execution/screenshots/`.
- No screenshots were generated or fabricated.
