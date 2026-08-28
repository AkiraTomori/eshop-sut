# HW06 Newman CI/CD Report — Submission Reference

> **Status:** STUDENT DECISION CONFIRMED WITH KNOWN DEVIATIONS.

The complete canonical report is [`reports/HW06_CICD_Report.md`](../../reports/HW06_CICD_Report.md), and the workflow is [`.github/workflows/hw06-newman.yml`](../../.github/workflows/hw06-newman.yml).

## Verified pipeline facts

- Trigger: qualifying pushes to `main`/`master`.
- Runtime: Node.js 20, backend `node server.js`, Newman 6.2.2.
- Readiness: TCP port 3000 only; no HTTP GET health check.
- Scope gate: rejects GET and out-of-scope request definitions and verifies collection-level `StudentID` header injection.
- Execution: Pool A, B, and C Newman runs; CLI/JUnit evidence upload; preserved exit codes.
- Real run: [Actions job 98890567631](https://github.com/AkiraTomori/eshop-sut/actions/runs/33183542319/job/98890567631), commit `61e0baea`, artifact `hw06-newman-33183542319-1`.
- Real result: 159 cases, 96 passed, 63 failed; screenshot [`reports/CI-fail-sample-2.png`](../../reports/CI-fail-sample-2.png).

## Required samples and deviation

| Requirement | Evidence | Status |
|---|---|---|
| All 159 cases pass | No run, URL, artifact, or screenshot exists | Literal requirement not met; student declined to modify the SUT or weaken reviewed tests |
| Exactly one case fails (158/159) | No such run exists | Literal requirement not met; student substituted the real 96/63 failed run |
| Instructor-approved exception | None supplied | User action required if formal acceptance of the substitution is needed |

The substitute proves that the workflow executes all suites, uploads evidence, and propagates test failure. It is not described as an all-pass or exactly-one-failure run.
