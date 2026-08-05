# EMS Usability Evaluation Report

## 1. Introduction

This study evaluated whether first-time EMS users could complete Scenario B: discover a named campus event, register for it, and display the check-in QR code. The flow covered B1 Events List / Discovery, B2 Event Detail, and B4 Registration Confirmation / QR Code at <https://prod-dev.ems-fitus.cloud/>.

Five university students outside the HW03 class completed moderated think-aloud sessions after one excluded pilot. The moderator measured task outcome, time, wrong actions, hesitations longer than three seconds, interventions, the 10-item System Usability Scale (SUS), and four post-task probes. Direct moderator guidance limited an outcome to `Partial`.

## 2. Participants

| ID | Profile | Prior EMS familiarity | Digital confidence | Contact status | Session |
|---|---|---|:---:|---|---|
| P1 | Third-year Computer Science student, HCMUS | None | 4/5 | Masked | 29 July 2026, 20:45 |
| P2 | Third-year Computer Science student, HCMUS | None; familiar with a similar portal flow | 4/5 | Masked | 29 July 2026, 21:00 |
| P3 | Third-year Computer Science student, HCMUS | None | 5/5 | Masked | 29 July 2026, 21:15 |
| P4 | Third-year Economics student, another university | None | 3/5 | Masked | 29 July 2026, 21:45 |
| P5 | Third-year Marketing student, another university | None; familiar with similar platforms | 4/5 | Masked | 30 July 2026, 10:30 |

All five notes state that participants were outside the HW03 class.

## 3. Task Scenario

> You recently heard that **Summer School about A.I Agentic** is coming up on campus and you would like to attend. Using EMS, find the event, register for it, and show me the QR code you would use to check in.

The moderator did not provide menu names, button labels, page locations, or action sequences. Timing stopped when the correct QR appeared, the participant gave up, or the ten-minute limit was reached.

## 4. Task Metrics

| Participant | Outcome | Time | Errors | Hesitations | Interventions | SUS |
|---|---|---:|---:|---:|---:|---:|
| P1 | Partial | 02:15 | 0 | 2 | 1 | 62.5 |
| P2 | Completed | 02:15 | 0 | 1 | 0 | 52.5 |
| P3 | Completed | 01:30 | 0 | 0 | 0 | 62.5 |
| P4 | Partial | 02:30 | 0 | 1 | 1 | 62.5 |
| P5 | Completed | 02:30 | 0 | 0 | 0 | 70.0 |
| **Mean / total** | **3 Completed; 2 Partial** | **02:12** | **0 total** | **0.8 mean; 4 total** | **0.4 mean; 2 total** | **62.0** |

### Aggregate Results

| Metric | Result |
|---|---|
| Strict unassisted completion rate | 60% (3/5) |
| Assisted partial rate | 40% (2/5) |
| Failure rate | 0% (0/5) |
| Eventual correct-QR attainment | 100% (5/5), including two assisted outcomes |
| Mean time on task | 132 seconds (02:12) |
| Time range | 90–150 seconds |
| Total errors | 0 |
| Total hesitations | 4 |

The zero-error count should not be interpreted as a friction-free flow: P1 and P4 needed direct guidance at B4, and QR-related uncertainty accounted for all recorded hesitations.

## 5. SUS Results

SUS contributions were calculated as `response − 1` for odd-numbered items and `5 − response` for even-numbered items. Each adjusted total was multiplied by 2.5.

| Participant | Adjusted total | SUS score | Interpretation |
|---|---:|---:|---|
| P1 | 25 | 62.5 | OK / Marginal |
| P2 | 21 | 52.5 | OK / Marginal |
| P3 | 25 | 62.5 | OK / Marginal |
| P4 | 25 | 62.5 | OK / Marginal |
| P5 | 28 | 70.0 | OK / Marginal |

| Statistic | Value |
|---|---:|
| Mean | 62.0 |
| Sample standard deviation (`n − 1`) | 6.2 |
| Minimum | 52.5 |
| Maximum | 70.0 |
| Range | 17.5 |

Under the required interpretation scale, the mean of 62.0 is **OK** with **Marginal** acceptability. With only five participants, the SUS result is descriptive rather than a population estimate.

## 6. Usability Findings

| ID | Finding | Type | Participants | Screen(s) | Heuristic | Severity |
|---|---|---|---|---|---|:---:|
| UF-01 | Check-in QR entry point is difficult to discover. | Systemic design issue | P1, P2, P3, P4 | B4 | N6 | 3 |
| UF-02 | Post-registration state does not clearly confirm success or direct the next step. | Systemic design issue | P1, P2, P4 | B2, B4 | N1 | 3 |
| UF-03 | QR purpose and event association are ambiguous. | Systemic design issue | P1, P2, P3 | B4 | N2 | 2 |
| UF-04 | Registration cancellation is not discoverable or explained. | Isolated observation | P5 | B2/B4 | N3 | 2 |
| UF-05 | Mobile calendar text was reported as crowded and hard to read. | Isolated observation | P5 | B1 / Calendar | N8 | 2 |

### UF-01 — QR Discoverability

P1 and P4 reached the QR only after moderator guidance. P2 hesitated and described finding it as the most effortful part of the task. P3 completed without observed hesitation but still said a first-time user would not know where to look without a hint. This is a systemic recognition-over-recall problem and a major issue because it reduced strict task success to 60%.

### UF-02 — Registration Status and Next Step

P1 reported seeing “Pending” without knowing where the QR was. P2 lacked confidence that registration had succeeded. P4 also needed help to verify the outcome and locate the QR. The system state and next action are not sufficiently visible at the handoff from B2 to B4.

### UF-03 — QR Meaning and Event Association

P1, P2, and P3 expected each event to have its own QR and were unsure whether the account-level code applied to the selected event. The QR dialog needs language and context that match users' event-centred mental model.

### UF-04 — Cancellation

P5 asked whether a completed registration could be cancelled. Because cancellation was outside the scripted task and only one participant raised it, this is an isolated discoverability observation requiring product confirmation, not a proven missing-function bug.

### UF-05 — Mobile Calendar Readability

P5 reported long, crowded calendar text on a phone. This occurred outside the intended screen path and was not reproduced during analysis, so it remains an isolated observation that needs targeted cross-platform verification.

## 7. Prioritised Recommendations

| Priority | Recommendation | Finding(s) | Effort |
|:---:|---|---|---|
| P0 | Show an explicit registration state and a prominent **View check-in QR** action immediately after registration. | UF-01, UF-02 | Small |
| P0 | Add a persistent, clearly labelled QR entry point near registered events and in attendee navigation. | UF-01 | Medium |
| P1 | State whether the QR is reusable or event-specific and show event/check-in context in the dialog. | UF-03 | Medium |
| P1 | Surface a cancellation action or explain policy and unavailable states. | UF-04 | Medium |
| P1 | Reproduce the calendar issue at phone widths, then improve wrapping, truncation/expansion, and line spacing. | UF-05 | Medium |

## 8. Limitations and Data Quality

- The sample is small (`n = 5`) and weighted toward digitally confident third-year students.
- Three participants study Computer Science at HCMUS, which may make the interface more familiar than it would be to the broader attendee population.
- Two outcomes required moderator assistance; their recorded completion times include the intervention and should not be compared directly with unassisted times.
- P3's post-task comment says guidance would be needed, but the observation log records no actual intervention or hesitation. It was used as attitudinal support only.
- P5's calendar observation was outside the scripted task and needs reproduction.

## 9. Appendix

### A. Raw Inputs

- `data-collection-sheet.md`
- `session-notes-P1.md` through `session-notes-P5.md`
- `participant-sheet.md`
- `task-scenario.md`
- `sus-questionnaire.md`

### B. Raw SUS Rows

| ID | Q1 | Q2 | Q3 | Q4 | Q5 | Q6 | Q7 | Q8 | Q9 | Q10 |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| P1 | 3 | 3 | 4 | 2 | 2 | 3 | 3 | 2 | 4 | 1 |
| P2 | 3 | 3 | 2 | 4 | 3 | 3 | 5 | 3 | 3 | 2 |
| P3 | 5 | 4 | 3 | 2 | 3 | 3 | 4 | 3 | 4 | 2 |
| P4 | 4 | 2 | 4 | 4 | 4 | 3 | 4 | 2 | 5 | 5 |
| P5 | 4 | 2 | 4 | 2 | 4 | 2 | 4 | 2 | 3 | 3 |
