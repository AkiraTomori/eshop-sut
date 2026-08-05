# EMS Usability Study — Data Collection Sheet

## Instructions

- Enter data only after each real session; do not include the pilot.
- Keep time in `mm:ss`.
- Use only `Completed`, `Partial`, or `Failed` for task success.
- Copy raw SUS responses exactly as entered (integers 1–5).
- Do not invent or infer missing values. Mark missing data `NR` and explain it in Notes.
- Calculate SUS scores and aggregate statistics during Phase 3.

## Session Metrics

| Participant | Task Success | Time (`mm:ss`) | Errors | Hesitations | SUS Score (`0–100`) | Key Quote | Notes / system incidents |
|---|---|---:|---:|---:|---:|---|---|
| P1 | Partial | 02:15 | 0 | 2 | 62.5 | “The QR made it slow because it was confusing.” | One moderator intervention at B4; normalized from the session’s checked “Completed” to “Partial” under the predefined assistance rule. No system incident recorded. |
| P2 | Completed | 02:15 | 0 | 1 | 52.5 | “Phần chậm nhất và tốn nhiều công sức nhất là kiếm được mã QR và hiểu được công dụng của mã QR.” | Completed without moderator intervention. No system incident recorded. |
| P3 | Completed | 01:30 | 0 | 0 | 62.5 | “Hơi mơ hồ (không tự tin), ý nghĩ của mình là mỗi sự kiện có một QR riêng cho nó.” | Completed without moderator intervention. The participant’s request for clearer guidance was a post-task opinion, not actual moderator assistance. |
| P4 | Partial | 02:30 | 0 | 1 | 62.5 | “Không, mọi thứ đều rõ ràng dễ nhận thấy.” | One moderator intervention at B4; normalized from the session’s checked “Completed” to “Partial” under the predefined assistance rule. No system incident recorded. |
| P5 | Completed | 02:30 | 0 | 0 | 70.0 | “Nhìn chung là khá đơn giản.” | Completed without moderator intervention. No system incident recorded. |

## Raw SUS Responses

Scale: 1 = Strongly disagree; 5 = Strongly agree. Preserve all 10 raw values for auditability.

| Participant | Q1 | Q2 | Q3 | Q4 | Q5 | Q6 | Q7 | Q8 | Q9 | Q10 | Calculated SUS |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|---:|
| P1 | 3 | 3 | 4 | 2 | 2 | 3 | 3 | 2 | 4 | 1 | 62.5 |
| P2 | 3 | 3 | 2 | 4 | 3 | 3 | 5 | 3 | 3 | 2 | 52.5 |
| P3 | 5 | 4 | 3 | 2 | 3 | 3 | 4 | 3 | 4 | 2 | 62.5 |
| P4 | 4 | 2 | 4 | 4 | 4 | 3 | 4 | 2 | 5 | 5 | 62.5 |
| P5 | 4 | 2 | 4 | 2 | 4 | 2 | 4 | 2 | 3 | 3 | 70.0 |

SUS scoring uses `(response − 1)` for odd items and `(5 − response)` for even items, with the adjusted total multiplied by 2.5.

## Milestone and Assistance Detail

| Participant | B1: correct event opened | B2: registration initiated | B4: correct QR displayed | Moderator interventions | End condition |
|---|:---:|:---:|:---:|---:|---|
| P1 | ✅ 00:30 | ✅ 01:30 | ✅ 02:15 | 1 | Correct QR |
| P2 | ✅ 01:00 | ✅ 01:30 | ✅ 02:15 | 0 | Correct QR |
| P3 | ✅ 00:30 | ✅ 01:00 | ✅ 01:30 | 0 | Correct QR |
| P4 | ✅ 00:30 | ✅ 01:45 | ✅ 02:30 | 1 | Correct QR |
| P5 | ✅ 00:30 | ✅ 01:30 | ✅ 02:30 | 0 | Correct QR |

## Post-Session Data Quality Check

| Check | P1 | P2 | P3 | P4 | P5 |
|---|:---:|:---:|:---:|:---:|:---:|
| Session notes saved as `session-notes-PN.md` | ✅ | ✅ | ✅ | ✅ | ✅ |
| Success outcome and rationale recorded | ✅ | ✅ | ✅ | ✅ | ✅ |
| Time, errors, and hesitations recorded | ✅ | ✅ | ✅ | ✅ | ✅ |
| All 10 raw SUS responses recorded | ✅ | ✅ | ✅ | ✅ | ✅ |
| Four open probes answered | ✅ | ✅ | ✅ | ✅ | ✅ |
| Key quote is anonymised | ✅ | ✅ | ✅ | ✅ | ✅ |
| Contact is masked in participant sheet | ✅ | ✅ | ✅ | ✅ | ✅ |

### Data Quality Notes

- All five participant contacts are recorded in masked form in `participant-sheet.md`.
- The status normalization for P1 and P4 follows the predeclared rule that direct moderator guidance makes a result no better than Partial.

## Phase 3 Calculation Workspace

Complete only after all five sessions.

| Aggregate metric | Result |
|---|---|
| Completion count / 5 | 3 / 5 |
| Partial count / 5 | 2 / 5 |
| Failure count / 5 | 0 / 5 |
| Unassisted completion rate | 60% (3 / 5) |
| Mean time on task | 02:12 |
| Total / mean errors | 0 / 0.0 |
| Total / mean hesitations | 4 / 0.8 |
| Mean SUS | 62.0 — OK, Marginal |
| SUS standard deviation | 6.2 (sample SD, `n − 1`) |
| Minimum / maximum SUS | 52.5 / 70.0 |

## Cross-Participant Patterns

Use this area for candidate clusters; findings are confirmed in Phase 3.

| Candidate pattern | Participants affected | Screens | Supporting notes / quotes |
|---|---|---|---|
| QR-code discoverability and purpose are unclear | P1, P2, P3, P4 | B4 | P1 and P4 required intervention; P2 said finding and understanding the QR took the most effort; P3 expected an event-specific QR. |
| Post-registration state does not clearly communicate the next step | P1, P2, P3, P4 | B2, B4 | Participants reported uncertainty about whether registration succeeded and where to retrieve the check-in QR. |
| Core event discovery and registration flow is generally understandable | P1, P2, P3, P4, P5 | B1, B2 | All participants found the event and initiated registration with zero recorded wrong actions. |
| Cancellation, calendar readability, and organiser-side QR use need clarification | P5 | B1 / outside the main task flow | P5 asked how to cancel registration, reported difficult-to-read mobile calendar text, and questioned how organisers scan the QR. |
