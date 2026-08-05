# Bug & Usability Findings Log

**Student:** Thái Minh Huy — 23127379

**Scenario:** B

**Compiled:** 2026-07-30

This log consolidates the 30 structured GUI bugs from Task 1, five usability findings from Task 2, and ten compatibility findings from Task 3. The source artifacts contain no Google Form submission timestamps; timestamps below were provided directly by the student from their actual form submission records.

| ID | Scenario/Screen | Type | Description | Steps/Heuristic | Severity | Suggested Fix | Screenshot Ref | Form Submission Timestamp |
|---|---|---|---|---|:---:|---|---|---|
| F-001 | B2 — Event Detail | Bug | Hero banner lacks a descriptive text alternative. | IA-01-008; BUG-B2-001 | 2 | Add a concise, event-specific `alt` value. | `../02-execution/screenshots/B2_IA-01-008_fail.png` | 08:29 01/08/2026 |
| F-002 | B2 — Event Detail | Bug | Vietnamese mode leaves event and registration content in English. | IA-01-013; BUG-B2-002 | 3 | Localise all visible UI and content labels consistently. | `../02-execution/screenshots/B2_IA-01-013_fail.png` | 08:30 01/08/2026 |
| F-003 | B2 — Event Detail | Bug | Information cards and roles overflow at 200% zoom/320 px. | IA-01-015; BUG-B2-003 | 3 | Stack or wrap cards and remove fixed minimum widths. | `../02-execution/screenshots/B2_IA-01-013_fail.png` | 08:31 01/08/2026 |
| F-004 | B2 — Event Detail | Bug | Missing-role validation is not adjacent to the affected cards. | IA-02-003; BUG-B2-004 | 2 | Place contextual errors beside each invalid role control. | `../02-execution/screenshots/B2_IA-02-003_fail.png` | 08:32 01/08/2026 |
| F-005 | B2 — Event Detail | Bug | Invalid role cards receive no visual error state. | IA-02-005; BUG-B2-005 | 2 | Highlight all invalid cards and focus the first error. | `../02-execution/screenshots/B2_IA-02-003_fail.png` | 08:33 01/08/2026 |
| F-006 | B2 — Event Detail | Bug | Current event has no sub-level active navigation indicator. | IA-03-002; BUG-B2-006 | 2 | Add a current-page breadcrumb or equivalent state. | `../02-execution/screenshots/B2_IA-03-005_fail.png` | 08:34 01/08/2026 |
| F-007 | B2 — Event Detail | Bug | Top-navigation keyboard focus is absent or too subtle. | IA-03-004; BUG-B2-007 | 2 | Add a high-contrast `:focus-visible` indicator. | `../02-execution/screenshots/B2_IA-03-001_pass.png` | 08:34 01/08/2026 |
| F-008 | B2 — Event Detail | Bug | Event Detail has no hierarchical breadcrumb. | IA-03-005; BUG-B2-008 | 2 | Add `Events > Current event` with a linked ancestor. | `../02-execution/screenshots/B2_IA-03-005_fail.png` | 08:35 01/08/2026 |
| F-009 | B2 — Event Detail | Bug | Success toast has no dismiss button and lasts about three seconds. | IA-04-001; BUG-B2-009 | 2 | Add manual dismissal and keep success messages for at least five seconds. | `../02-execution/screenshots/B2_IA-04-001_fail.png` | 08:36 01/08/2026 |
| F-010 | B2 — Event Detail | Bug | Slot utilisation has text counters but no visual progress bar. | IA-04-007; BUG-B2-010 | 1 | Pair the numeric value with an accessible progress indicator. | `../02-execution/screenshots/B2_registration_roles_section.png` | 08:37 01/08/2026 |
| F-011 | B2 — Event Detail | Bug | Floating Share icon has no visible tooltip. | IA-04-015; BUG-B2-011 | 1 | Add an accessible name and hover/focus tooltip. | `../02-execution/screenshots/B2_registration_roles_section.png` | 08:37 01/08/2026 |
| F-012 | B4 — Registration / Ticket | Bug | Badge, Export, and pagination text fail AA contrast. | IA-01-003; BUG-B4-001 | 2 | Replace low-contrast colour tokens with AA-compliant pairs. | `../02-execution/screenshots/B4_IA-01-003_fail.png` | 08:40 01/08/2026 |
| F-013 | B4 — Registration / Ticket | Bug | Differently shaped event artwork is cropped into one ratio. | IA-01-006; BUG-B4-002 | 2 | Preserve intended ratios or use art-directed thumbnails. | `../02-execution/screenshots/B4_IA-01-006_fail.png` | 08:41 01/08/2026 |
| F-014 | B4 — Registration / Ticket | Bug | Profile content is blank during slow loading. | IA-01-009; BUG-B4-003 | 2 | Render a stable skeleton or progress indicator. | `../02-execution/screenshots/B4_IA-01-009_fail.png` | 08:42 01/08/2026 |
| F-015 | B4 — Registration / Ticket | Bug | Search and footer targets are shorter than 24 CSS px. | IA-01-011; BUG-B4-004 | 2 | Increase hit areas to at least 24×24 CSS px. | `../02-execution/screenshots/B4_IA-01-011_fail.png` | 08:43 01/08/2026 |
| F-016 | B4 — Registration / Ticket | Bug | Vietnamese mode retains multiple English profile strings. | IA-01-013; BUG-B4-005 | 3 | Complete and validate the profile translation catalogue. | `../02-execution/screenshots/B4_IA-01-013_fail.png` | 08:44 01/08/2026 |
| F-017 | B4 — Registration / Ticket | Bug | Phone action row and registration content clip at 320 px. | IA-01-015; BUG-B4-006 | 3 | Wrap/stack actions and remove viewport-exceeding widths. | `../02-execution/screenshots/B4_IA-01-015_fail.png` | 08:45 01/08/2026 |
| F-018 | B4 — Registration / Ticket | Bug | Search and page fields rely on placeholder text. | IA-02-002; BUG-B4-007 | 2 | Add persistent visible, associated labels. | `../02-execution/screenshots/B4_IA-02-002_fail.png` | 08:46 01/08/2026 |
| F-019 | B4 — Registration / Ticket | Bug | Filters accept an end date earlier than the start date. | IA-02-007; BUG-B4-008 | 2 | Prevent invalid ranges or show an inline corrective error. | `../02-execution/screenshots/B4_IA-02-007_fail.png` | 08:47 01/08/2026 |
| F-020 | B4 — Registration / Ticket | Bug | Language, notification, and pagination icons lack tooltips. | IA-04-015; BUG-B4-009 | 1 | Provide accessible names and visible hover/focus tooltips. | `../02-execution/screenshots/B4_IA-04-015_fail.png` | 08:47 01/08/2026 |
| F-021 | B1 — Events List | Bug | Secondary text and controls fail AA contrast. | IA-01-003; BUG-B1-001 | 2 | Use WCAG-compliant foreground/background tokens. | `../02-execution/screenshots/B1_IA-01-003_fail.png` | 08:50 01/08/2026 |
| F-022 | B1 — Events List | Bug | Meaningful icons and boundaries have insufficient contrast. | IA-01-004; BUG-B1-002 | 2 | Raise non-text contrast to at least 3:1. | `../02-execution/screenshots/B1_IA-01-004_fail.png` | 08:51 01/08/2026 |
| F-023 | B1 — Events List | Bug | Event artwork is cropped into fixed thumbnail boxes. | IA-01-006; BUG-B1-003 | 2 | Preserve expected image composition and ratio. | `../02-execution/screenshots/B1_IA-01-006_fail.png` | 08:52 01/08/2026 |
| F-024 | B1 — Events List | Bug | Paragraph line height is below the 1.5× target. | IA-01-007; BUG-B1-004 | 1 | Increase body-copy line height to at least 1.5. | `../02-execution/screenshots/B1_IA-01-007_fail.png` | 08:53 01/08/2026 |
| F-025 | B1 — Events List | Bug | Dashboard content has no visible slow-loading state. | IA-01-009; BUG-B1-005 | 2 | Add a content skeleton or progress indicator. | `../02-execution/screenshots/B1_IA-01-009_fail.png` | 08:54 01/08/2026 |
| F-026 | B1 — Events List | Bug | Several interactive targets are below 24×24 CSS px. | IA-01-011; BUG-B1-006 | 2 | Enlarge targets or provide equivalent safe spacing. | `../02-execution/screenshots/B1_IA-01-011_fail.png` | 08:55 01/08/2026 |
| F-027 | B1 — Events List | Bug | Content truncates or overlaps at 320 px. | IA-01-015; BUG-B1-007 | 3 | Reflow cards and controls without horizontal clipping. | `../02-execution/screenshots/B1_IA-01-015_fail.png` | 08:55 01/08/2026 |
| F-028 | B1 — Events List | Bug | Search uses placeholder text without a persistent label. | IA-02-002; BUG-B1-008 | 2 | Add a visible and programmatically associated label. | `../02-execution/screenshots/B1_IA-02-002_fail.png` | 08:56 01/08/2026 |
| F-029 | B1 — Events List | Bug | Save/unsave lacks a clear success notification. | IA-04-009; BUG-B1-009 | 2 | Update the control and show a clear status message. | `../02-execution/screenshots/B1_IA-04-009_fail.png` | 08:57 01/08/2026 |
| F-030 | B1 — Events List | Bug | Pagination icon buttons lack names/tooltips. | IA-04-015; BUG-B1-010 | 2 | Add accessible names and hover/focus tooltips. | `../02-execution/screenshots/B1_IA-04-015_fail.png` | 08:57 01/08/2026 |
| F-031 | B4 — Registration / QR | Usability | Check-in QR entry point is difficult to discover. | N6 — Recognition rather than recall; UF-01 | 3 | Put a persistent Check-in QR action near each registration and in navigation. | `../03-usability/screenshots/UF1.png` | 09:01 01/08/2026 |
| F-032 | B2/B4 — Registration handoff | Usability | Post-registration state does not confirm success or direct the next step. | N1 — Visibility of system status; UF-02 | 3 | Show explicit status and a prominent View check-in QR action. | `../03-usability/screenshots/UF2.png` | 09:02 01/08/2026 |
| F-033 | B4 — Registration / QR | Usability | QR purpose and event association are ambiguous. | N2 — Match with the real world; UF-03 | 2 | Explain whether the QR is account-wide or event-specific and show context. | `../03-usability/screenshots/UF3.png` | 09:03 01/08/2026 |
| F-034 | B2/B4 — Registration | Usability | Cancellation availability and policy are hard to discover. | N3 — User control and freedom; UF-04 | 2 | Expose cancellation or explain its policy and unavailable states. | Not captured | 09:04 01/08/2026 |
| F-035 | B1 — Mobile Calendar | Usability | Long mobile calendar text was reported crowded and hard to read. | N8 — Aesthetic/minimalist design; UF-05 | 2 | Re-test on phones; improve wrapping, spacing, and accessible expansion. | `../03-usability/screenshots/UF5.jpeg` | 09:05 01/08/2026 |
| F-036 | B1 — Cross-platform | Bug | Legacy Opera substitute cannot negotiate EMS TLS. | CP-B1-01; C05 | 3 | Publish browser support and test current Opera with another provider. | `../04-cross-platform/screenshots/B1_C05.png` | 09:11 01/08/2026 |
| F-037 | B1 — Cross-platform | Bug | Mobile/tablet event times shift by ten hours. | CP-B1-02; C07–C10 | 3 | Store and explicitly render the event time zone. | `../04-cross-platform/screenshots/B1_C07.png` | 09:12 01/08/2026 |
| F-038 | B1 — Cross-platform | Bug | Floating Filters/Share controls overlap phone content. | CP-B1-03; C07, C08, C10 | 2 | Reserve space or move controls outside spotlight content. | `../04-cross-platform/screenshots/B1_C08.png` | 09:13 01/08/2026 |
| F-039 | B1 — Cross-platform | Bug | Tablet shows duplicate Filters controls. | CP-B1-04; C09 | 2 | Make responsive filter triggers mutually exclusive. | `../04-cross-platform/screenshots/B1_C09.png` | 09:14 01/08/2026 |
| F-040 | B2 — Cross-platform | Bug | Mobile/tablet periods shift by ten hours. | CP-B2-01; C07–C10 | 3 | Format timestamps explicitly in `Asia/Ho_Chi_Minh`. | `../04-cross-platform/screenshots/B2_C07.png` | 09:15 01/08/2026 |
| F-041 | B2 — Cross-platform | Bug | Save and Share controls constrain or overlap phone content. | CP-B2-02; C07, C08, C10 | 2 | Stack heading/actions and relocate Share at phone widths. | `../04-cross-platform/screenshots/B2_C08.png` | 09:16 01/08/2026 |
| F-042 | B2 — Cross-platform | Bug | Legacy Opera substitute cannot negotiate EMS TLS. | CP-B2-03; C05 | 3 | Validate current Opera elsewhere and publish support boundaries. | `../04-cross-platform/screenshots/B2_C05.png` | 09:17 01/08/2026 |
| F-043 | B4 — Cross-platform | Bug | Phone action row overflows and clips Change Password. | CP-B4-01; C07, C08, C10 | 3 | Stack/wrap profile actions and remove fixed minimum widths. | `../04-cross-platform/screenshots/B4_C07.png` | 09:28 01/08/2026 |
| F-044 | B4 — Cross-platform | Bug | iOS native QR activation failed in automation. | CP-B4-02; C10 | 3 | Use a native button handler and confirm with a physical iPhone tap. | `../04-cross-platform/screenshots/B4_C10.png` | 09:30 01/08/2026 |
| F-045 | B4 — Cross-platform | Bug | Legacy Opera substitute cannot negotiate EMS TLS. | CP-B4-03; C05 | 3 | Validate current Opera elsewhere and publish support boundaries. | `../04-cross-platform/screenshots/B4_C05.png` | 09:30 01/08/2026 |

## Traceability Notes

- F-001–F-030 map one-to-one to `BUG-B2-001…011`, `BUG-B4-001…009`, and `BUG-B1-001…010`.
- F-031–F-035 map to `UF-01…UF-05`.
- F-036–F-045 map to the consolidated `CP-*` findings.
- F-034 has no screenshot in its source because it is an isolated participant observation.
- F-036, F-042, and F-045 concern an approved legacy Opera substitute and do not establish failure in current Opera on macOS Sequoia.
