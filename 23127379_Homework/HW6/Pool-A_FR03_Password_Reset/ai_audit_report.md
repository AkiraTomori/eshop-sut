# Pool A — AI Audit Report

> **Scope:** FR-03 — `POST /api/forgot-password`, `POST /api/reset-password`  
> **Human review status:** PENDING  
> This local report is the authoritative AI-interaction record for Pool A and remains proposed until every row is reviewed.

| Audit ID | Tool/Model | Timestamp | Pool/Stage | Prompt | Output | Human Review |
|---|---|---|---|---|---|---|
| PA-AI-001 | domain-testing / GPT-5 (Codex) | 2026-08-21T10:45:17+07:00 | Pool A / Stage 1 — Domain Testing | Propose deep API-wide EC/BVA analysis for FR-03 using only the assignment, SRS, and API contract | Created a proposed artifact with 10 inventory entries, 39 equivalence classes, and 36 domain cases; no API calls or GET tests | Approved |
| PA-AI-002 | state-transition-testing / GPT-5 (Codex) | 2026-08-21T11:50:52+07:00 | Pool A / Stage 1 — State Transition Testing | Model the complete FR-03 OTP lifecycle with all state-event combinations, 0-switch coverage, and invalid transitions | Created a proposed four-state, six-event FSM with 24 transition-table cells and 24 traceable test cases; no API calls, time manipulation, or GET tests | Approved |
| PA-AI-003 | security-schema-checklist / GPT-5 (Codex) | 2026-08-21T12:02:10+0700 | Pool A / Stage 1 — Security/Schema Checklist | Propose applicable SEC-01 through SEC-07, object-targeting, injection, OTP, and response-schema checks for the FR-03 two-POST workflow | Created a proposed applicability matrix, 19 checklist cases, schema contract, and confirmation ledger; no API/database calls, GET tests, or progress update | PENDING |
| PA-AI-004 | test-case-audit-assistant / GPT-5 (Codex) | 2026-08-21T12:32:33+0700 | Pool A / Stage 2 — Audit | Audit all confirmed Pool A Stage 1 cases against the assignment, SRS, and API contract; preserve IDs and propose labels only | Audited 79 unique cases: 49 VALID, 12 INVALID, and 18 INCOMPLETE; created a proposed audit artifact; no source-case edits, API calls, GET tests, or progress update | Approved |

## Human Review Notes

| Audit ID | Decision | Correction/notes | Reviewed at | User confirmation |
|---|---|---|---|---|

Use `CONFIRMED`, `REVISED`, or `REJECTED` only after real human review. Enter `confirm pool audit` only after all Pool A rows have a non-pending decision.
