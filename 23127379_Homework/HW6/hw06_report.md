# HW06 API Testing — Main Report

> **Student ID:** 23127379  
> **Status:** TEMPLATE — populate only from confirmed artifacts and real execution evidence

## 1. Introduction

- SUT and testing objective.
- Selected APIs and why they represent Pools A, B, and C.
- AI-first, human-review methodology.
- Explicit no-GET scope and `X-Student-Id` policy.

## 2. Workflow and tools

### 2.1 Five-stage workflow

Describe Generate → Audit → Extend → Execute → Report Bugs and the human confirmation gates.

### 2.2 Tools and AI declaration

List every AI tool/model and API-testing tool actually used. Do not list planned but unused tools.

### 2.3 Postman features used

| Feature | How it was used | Evidence |
|---|---|---|

## 3. Pool A — FR-03 Password Recovery

### 3.1 API contract and business rules
### 3.2 Stage 1 — Domain parameter inventory, EC, and BVA
### 3.3 Stage 1 — OTP state-transition model and complete State Table
### 3.4 Stage 1 — Security and response-schema cases
### 3.5 Stage 2 — Human audit and corrections
### 3.6 Stage 3 — At least five human-added cases and why AI missed them
### 3.7 Stage 4 — Postman/Newman execution and evidence
### 3.8 Stage 5 — Failure triage and genuine bugs
### 3.9 Pool A AI audit and human-review decisions

| Metric | Value | Evidence source |
|---|---:|---|
| AI-generated cases | `<N>` | `<path>` |
| Human-added cases | `<N>` | `<path>` |
| Final cases | `<N ≥ 35>` | `<path>` |
| Executed / Passed / Failed | `<N / N / N>` | `<Newman report>` |
| Genuine bugs | `<N>` | `<bug report/issues>` |

## 4. Pool B — FR-08 Checkout

Use the same structure as Pool A, replacing state-transition analysis with the complete and reduced checkout Decision Table. Link `Pool-B_FR08_Checkout/ai_audit_report.md` and summarize its human-review decisions.

## 5. Pool C — FR-15 Update Product

Use the same structure as Pool A, covering API-wide Domain Testing plus applicable security/schema cases. Explain how tests verify that only the targeted product changes. Link `Pool-C_FR15_Update_Product/ai_audit_report.md` and summarize its human-review decisions.

## 6. Cross-pool test summary

| Pool/API | Generated | Audited VALID | Corrected | Human-added | Final | Executed | Passed | Failed | Bugs |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|

Explain and resolve every mismatch between counts.

## 7. CI/CD integration

- Workflow configuration and trigger.
- SUT startup and TCP readiness strategy.
- Newman command and artifact retention.
- `X-Student-Id` handling.
- Real all-pass run link/screenshot.
- Real exactly-one-failure run link/screenshot.

Refer to `cicd_report.md` for full evidence.

## 8. AI-driven API test generator design

- Reusable skill architecture.
- Student-owned design decisions.
- Link to the self-drawn diagram.
- Pseudocode and coverage gates.
- Optional demonstration video link.

Refer to `test_generator_design.md`.

## 9. Bugs and GitHub Issues

Summarize genuine defects only, with real issue URLs and screenshot paths. Explain false positives separately.

## 10. AI collaboration findings

Summarize the most important audit corrections and human-added gaps. Link the complete appendices.

## 11. Conclusion

State coverage achieved, important defects, limitations, and lessons without claiming missing evidence.

## Appendix A — AI Audit Report

See consolidated `ai_audit_report.md`; its Pool rows must trace back to the three Pool-local `ai_audit_report.md` files without duplication.

## Appendix B — AI Critique

See `ai_critique.md`.

## Appendix C — Git Commit Log

See `git_commit_log.txt` after it has been generated from real history.
