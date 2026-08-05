# EMS Usability Findings — Scenario B

## Classification Rules

- **Systemic design issue**: observed or reported by at least two participants with a shared probable root cause.
- **Isolated observation**: raised by one participant only and requires confirmation before being treated as a product defect.
- **Severity** follows Nielsen's 0–4 scale: 0 not a problem, 1 cosmetic, 2 minor, 3 major, 4 catastrophic.

## Prioritised Findings

| ID | Classification | Description and evidence | Participants | Screen(s) | Heuristic | Severity | Screenshot |
|---|---|---|---|---|---|:---:|---|
| UF-01 | Systemic design issue | The check-in QR control is hard to discover. P1 and P4 needed moderator guidance; P2 hesitated and said finding the QR took the most effort. P3 completed independently but still said a first-time user would not know where to look without a hint. | P1, P2, P3, P4 | B4 | N6 — Recognition rather than recall | 3 | [Screenshot](./screenshots/UF1.png) |
| UF-02 | Systemic design issue | The post-registration state does not clearly confirm success or direct users to the next step. P1 saw “Pending” and did not know where to find the QR, P2 was unsure whether registration succeeded, and P4 could not independently verify registration and find the QR. | P1, P2, P4 | B2, B4 | N1 — Visibility of system status | 3 | [Screenshot](./screenshots/UF2.png) |
| UF-03 | Systemic design issue | The account-level QR lacks enough event association and purpose information. P1, P2, and P3 expected an event-specific QR and were unsure which event or check-in context the displayed code represented. | P1, P2, P3 | B4 | N2 — Match between system and the real world | 2 | [Screenshot](./screenshots/UF3.png) |
| UF-04 | Isolated observation | A participant could not determine whether an event registration could be cancelled. The task did not require cancellation, so this is a discoverability concern rather than a confirmed missing-function defect. | P5 | B2/B4 | N3 — User control and freedom | 2 | Participant wants to ask about cancellation at Admin, not in User |
| UF-05 | Isolated observation | Mobile calendar event text was reported as long, crowded, and difficult to read. The calendar was outside the scripted task flow and only one participant raised it, so targeted reproduction is required. | P5 | B1 / Calendar | N8 — Aesthetic and minimalist design | 2 | [Screenshot](./screenshots/UF5.jpeg) |

## Strengths

- All five participants found the target event, initiated registration, and eventually displayed the correct QR.
- No wrong actions or recovery attempts were recorded.
- Three participants completed without moderator assistance.
- P4 and P5 described the core registration interaction as clear or straightforward.

## Recommendations

| Priority | Recommendation | Addresses | Effort |
|:---:|---|---|---|
| P0 | After registration, show an explicit success/pending state with a prominent **View check-in QR** action and a short next-step explanation. | UF-01, UF-02 | Small |
| P0 | Keep a persistent, clearly labelled **Check-in QR** entry point near each registered event and in the main attendee navigation. | UF-01 | Medium |
| P1 | In the QR dialog, state whether the code is account-wide or event-specific and show the relevant event/check-in context. | UF-03 | Medium |
| P1 | Provide a visible cancellation action or clearly explain the cancellation policy and unavailable states. | UF-04 | Medium |
| P1 | Re-test the calendar on phone widths and apply wrapping, truncation with accessible expansion, and adequate line spacing. | UF-05 | Medium |
