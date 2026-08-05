# HW03 — GUI & Usability Testing on EMS

## Main Report — Scenario B

**Student:** Thái Minh Huy — 23127379

**Group:** 06

**Date:** 2026-07-30

**SUT:** [EMS — Event Management System](https://prod-dev.ems-fitus.cloud/)

## Executive Summary

This project evaluated the attendee journey across Events List (B1), Event Detail (B2), and Registration Confirmation / QR Code (B4). A 62-item heuristic checklist was executed on all three screens, producing 30 structured GUI bugs. Five moderated sessions achieved 60% unassisted completion and a mean SUS score of 62.0, with QR discovery as the main usability barrier. Thirty cross-platform cells produced 16 passes and 14 failures (53.3%); device-dependent event times were the broadest functional risk.

| Workstream | Scope | Key Result |
|---|---|---|
| Task 1A | 62 checklist items; IA-01…IA-04 | 17/16/14/15 items by aspect |
| Task 1B | 3 screens × 62 rows | 88 applicable evaluations; 58 Pass, 30 Fail |
| Task 2 | 5 participants; B1→B2→B4 | 60% unassisted completion; SUS 62.0 |
| Task 3 | 10 cells × 3 screens | 16 Pass, 14 Fail; 53.3% |
| Consolidated findings | Tasks 1–3 | 45 traceable entries |

## 1. Scenario Selection

### 1.1 Chosen Scenario

Scenario B covers the attendee flow: discover an event, inspect its details, register, and retrieve the check-in QR code.

### 1.2 Selected Screens

| Screen ID | Screen Name | Justification |
|---|---|---|
| B1 | Events List / Discovery | First attendee touchpoint; exercises browsing, discovery, search, filtering, state handling, and navigation. |
| B2 | Event Detail | Core decision and registration screen; exercises event information, registration roles, state transitions, and action feedback. |
| B4 | Registration Confirmation / QR Code | Validates the final registration outcome and whether the attendee can locate and display check-in evidence. |

The authoritative setup is in [`project-config.md`](../../project-config.md).

## 2. Task 1 — GUI Checklist

### 2.1 Shared Checklist Design

The group deliverable contains 62 unique, testable items, exceeding the required 40:

| Interface Aspect | Items |
|---|---:|
| IA-01 — General UI Standards | 17 |
| IA-02 — Forms | 16 |
| IA-03 — Navigation | 14 |
| IA-04 — Feedback / State | 15 |
| **Total** | **62** |

The checklist incorporates Nielsen, Norman, Shneiderman, WCAG 2.1/2.2, and ARIA guidance and covers the specified widget families. Supporting artifacts:

- [Shared GUI checklist](../01-checklist/shared-gui-checklist.md)
- [References](../01-checklist/checklist-references.md)
- [AI prompts](../01-checklist/checklist-prompts.md)
- [AI-missed items and critique](../01-checklist/ai-missed-items.md)

### 2.2 Checklist Execution

Row-level recounting of the three execution tables gives:

| Screen | Applicable | Pass | Fail | N/A | Pass Rate |
|---|---:|---:|---:|---:|---:|
| B1 — Events List | 23 | 13 | 10 | 39 | 56.5% |
| B2 — Event Detail | 40 | 29 | 11 | 22 | 72.5% |
| B4 — Registration / QR | 25 | 16 | 9 | 37 | 64.0% |
| **Total** | **88** | **58** | **30** | **98** | **65.9%** |

The B2 source summary and `execution-summary.md` have been reconciled with the row-level table: 62 unique rows, 29 Pass, 11 Fail, and 22 N/A. The 11 failed rows also agree with the 11 structured B2 bug reports.

Execution evidence:

- [B1 execution](../02-execution/checklist-execution-B1.md)
- [B2 execution](../02-execution/checklist-execution-B2.md)
- [B4 execution](../02-execution/checklist-execution-B4.md)
- [Published execution summary](../02-execution/execution-summary.md)

### 2.3 Bug Reports

Task 1 produced 30 structured bugs:

| Severity | Count |
|---|---:|
| 1 — Cosmetic | 4 |
| 2 — Minor | 21 |
| 3 — Major | 5 |
| 4 — Critical | 0 |

The principal patterns were responsive reflow, colour/non-text contrast, loading feedback, incomplete Vietnamese localisation, persistent form labels, and icon-only control clarity. Full reproduction steps and evidence are in [bug-reports.md](../02-execution/bug-reports.md).

## 3. Task 2 — Usability Evaluation

Five university students outside the HW03 class completed moderated think-aloud sessions after an excluded pilot. The task was to find “Summer School about A.I Agentic,” register, and show the check-in QR code.

| Metric | Result |
|---|---|
| Unassisted completion | 60% (3/5) |
| Assisted partial outcome | 40% (2/5) |
| Eventual QR attainment | 100% |
| Mean task time | 132 seconds |
| Errors | 0 |
| Hesitations | 4 |
| Mean SUS | 62.0 |
| SUS sample SD | 6.2 |

The zero-error count does not imply a friction-free flow: two participants required moderator help and QR uncertainty accounted for every hesitation. The five findings comprise two severity-3 systemic issues and three severity-2 issues:

1. The QR entry point is hard to discover.
2. Post-registration status and next steps are unclear.
3. QR purpose/event association is ambiguous.
4. Cancellation is not discoverable or explained.
5. Mobile calendar text was reported crowded.

The prioritised response is to expose a clear View check-in QR action immediately after registration and keep it visible near each registered event. See the [complete usability report](../03-usability/usability-report.md) and [structured findings](../03-usability/usability-findings.md).

## 4. Task 3 — Cross-Browser / Cross-Platform

The 10-cell matrix was executed for B1, B2, and B4 using BrowserStack Automate, with 30 raw and 30 MSSV-overlaid screenshots.

| Screen | Cells | Pass | Fail | Pass Rate |
|---|---:|---:|---:|---:|
| B1 — Events List | 10 | 5 | 5 | 50% |
| B2 — Event Detail | 10 | 5 | 5 | 50% |
| B4 — Registration / QR | 10 | 6 | 4 | 60% |
| **Total** | **30** | **16** | **14** | **53.3%** |

Windows, macOS, Android, iOS, Chrome, Firefox, Safari, Edge, Opera, desktop, tablet, and phone were represented. Opera coverage is conditional: BrowserStack did not offer Opera on macOS Sequoia, so C05 used macOS Mojave with Opera 12.15. That legacy substitute could not negotiate EMS TLS and cannot establish current Opera behavior.

The broadest confirmed defect was a ten-hour mobile/tablet time shift on B1 and B2. Other repeated issues were phone control overlap, clipped profile actions, duplicate tablet filters, and an iOS QR-activation signal requiring physical-device confirmation. See the [complete cross-platform report](../04-cross-platform/cross-platform-report.md) and [screenshot evidence](../04-cross-platform/screenshots/).

## 5. Bug & Usability Findings Log

The [consolidated findings log](findings-log.md) contains 45 sequential entries:

- 30 Task 1 GUI bugs;
- 5 Task 2 usability findings;
- 10 Task 3 compatibility findings.

Google Form submission timestamps have been provided directly by the student and are filled in across all 45 entries (08:29\u201309:30, 01/08/2026).

## 6. Conclusions and Priorities

1. Fix time-zone handling by storing the event zone and rendering dates explicitly in `Asia/Ho_Chi_Minh`.
2. Make the registration outcome and check-in QR action immediately visible.
3. Repair 320 px/phone layouts: stack actions, reserve space for floating controls, and remove fixed minimum widths.
4. Apply accessible colour, focus, target-size, label, and tooltip tokens systematically.
5. Complete Vietnamese localisation and validate it screen-by-screen.
6. Confirm current Opera support and iOS QR activation on suitable real devices.

## Appendix A — AI Audit Report

The [AI Audit Report](../05-audit/ai-audit-report.md) records 20 interactions through Stages 1–4, including prompts, outputs, and review status.

## Appendix B — AI Critique

The existing [AI Critique](../05-audit/ai-critique.md) discusses counting inconsistencies, browser automation limits, stale generated text, and evidence discipline.

## Appendix C — Git Commit Log

See [git-commit-log.txt](git-commit-log.txt) for the chronological stage summary and source commit trail.
