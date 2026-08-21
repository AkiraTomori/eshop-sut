# Pool A — AI Audit Report

> **Scope:** FR-03 — `POST /api/forgot-password`, `POST /api/reset-password`  
> **Human review status:** PENDING  
> This local report is the authoritative AI-interaction record for Pool A and remains proposed until every row is reviewed.

| Audit ID | Tool/Model | Timestamp | Pool/Stage | Prompt | Output | Human Review |
|---|---|---|---|---|---|---|
| PA-AI-001 | domain-testing / GPT-5.6 Sol (Codex) | 2026-08-21T10:45:17+07:00 | Pool A / Stage 1 — Domain Testing | Propose deep API-wide EC/BVA analysis for FR-03 using only the assignment, SRS, and API contract | Created a proposed artifact with 10 inventory entries, 39 equivalence classes, and 36 domain cases; no API calls or GET tests | Approved |
| PA-AI-002 | state-transition-testing / unknown | 2026-08-21T11:50:52+07:00 | Pool A / Stage 1 — State Transition Testing | Model the complete FR-03 OTP lifecycle with all state-event combinations, 0-switch coverage, and invalid transitions | Created a proposed four-state, six-event FSM with 24 transition-table cells and 24 traceable test cases; no API calls, time manipulation, or GET tests | Approved |

## Human Review Notes

| Audit ID | Decision | Correction/notes | Reviewed at | User confirmation |
|---|---|---|---|---|

Use `CONFIRMED`, `REVISED`, or `REJECTED` only after real human review. Enter `confirm pool audit` only after all Pool A rows have a non-pending decision.
