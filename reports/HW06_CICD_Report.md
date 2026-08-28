# HW06 Newman CI/CD Report — Proposal

> This document and `.github/workflows/hw06-newman.yml` are proposed configuration only. No workflow was pushed or executed by this invocation, and the two required runs below are illustrative placeholders rather than execution evidence.

## 1. Configuration manifest

| Trigger | API unit/folder | Approved data file | Approved rows / tracked CI-enabled rows | Newman reporters | Artifact path | Student header source | Status |
|---|---|---|---:|---|---|---|---|
| `push` to `main` or `master`, limited to the workflow, backend, or HW06 paths | Pool A / `Pool A - FR-03 Password Reset` | `23127379_Homework/HW6/Pool-A_FR03_Password_Reset/postman/23127379_FR03_data.json` | 62 / 55 | CLI, JUnit | `23127379_Homework/HW6/reports/newman-ci/pool-a/` | Collection-level pre-request script reads `StudentID` and upserts `X-Student-Id` | `PROPOSED`; 7 approved rows remain deliberately disabled by documented blockers |
| Same push trigger | Pool B / scored `Pool B - FR-08 Checkout`, with the approved POST-only fixture folder | `23127379_Homework/HW6/Pool-B_FR08_Checkout/postman/23127379_FR08_data.json` | 42 / 42 | CLI, JUnit | `23127379_Homework/HW6/reports/newman-ci/pool-b/` | Collection-level pre-request script reads `StudentID` and upserts `X-Student-Id` | `PROPOSED`; fixture requests are setup only and are not scored cases |
| Same push trigger | Pool C / `Pool C - FR-15 Update Product` | `23127379_Homework/HW6/Pool-C_FR15_Update_Product/postman/23127379_FR15_data.json` | 67 / 62 | CLI, JUnit | `23127379_Homework/HW6/reports/newman-ci/pool-c/` | Collection-level pre-request script reads `StudentID` and upserts `X-Student-Id` | `PROPOSED`; 5 rows remain fixture/external-harness gated in tracked data |

The tracked CI-enabled total is 159 cases (`55 + 42 + 62`), and each selected API unit still has at least 35 CI-enabled cases. The approved-suite total is 171 rows. The difference is preserved explicitly; disabled or external-harness cases must not be represented as executed by this Newman workflow.

## 2. Pipeline sequence

1. A qualifying push checks out the repository and sets up Node.js 20.
2. The job installs backend dependencies with `npm ci` and pins Newman to `6.2.2`.
3. A static gate parses all approved collection/data artifacts, verifies at least 35 unique rows per Pool, rejects every GET request or out-of-scope request definition, and verifies collection-level `StudentID` header injection.
4. The job reads the repository secret `HW06_POSTMAN_ENV_BUNDLE`, validates three complete reviewed Postman environments, enforces the same non-empty `StudentID`, enforces local port 3000, and writes permission-restricted runtime files under `RUNNER_TEMP`. Pool B's `fixtureRunId` is replaced with the GitHub run ID/attempt to avoid cross-run fixture collisions.
5. The workflow creates `${GITHUB_WORKSPACE}/${HW06_RESULTS}` explicitly, then starts the backend with the repository's real command, `node server.js`, from `backend/` after `npm ci`. Readiness is a TCP connection to `127.0.0.1:3000`; the workflow performs no HTTP GET health check.
6. Newman executes Pool A, the complete Pool B collection (so its approved POST-only fixtures precede the scored Checkout folder), and Pool C in data-driven mode.
7. Each run produces CLI and JUnit evidence. Exit codes are recorded separately so all three Pools run and evidence uploads even if assertions fail; the final step fails the job if any Newman exit code is non-zero.

HTML is not generated in CI because the approved local evidence does not record an exact `newman-reporter-htmlextra` version to pin. Existing Stage 4 HTML reports remain separate real local evidence. A reviewed exact reporter version may be added later without changing the CI result semantics.

## 3. Required repository configuration

Create one GitHub Actions repository secret named `HW06_POSTMAN_ENV_BUNDLE`. Its value must be a JSON object with keys `poolA`, `poolB`, and `poolC`; each value must be the complete, human-reviewed local Postman environment object for that Pool. Each environment must:

- use exactly `StudentID` (case-sensitive) with the same non-empty value in all three environments;
- set `baseUrl` to `http://localhost:3000` or `http://127.0.0.1:3000`;
- contain the Pool's reviewed runtime fixture values, including passwords or JWTs required by enabled rows;
- contain no production credential; use disposable local fixtures only.

The repository secret was created through the authenticated GitHub CLI at `2026-08-28T15:02:07Z`. Its three-environment bundle was generated in memory, structurally validated, and accepted by GitHub without printing or persisting the bundle in the repository. GitHub exposes only the secret name and update timestamp after creation, so human review remains pending. The workflow deliberately fails before starting the SUT when the secret is absent or malformed.

The first post-secret run exposed a working-directory defect before the SUT started: `mkdir -p "${HW06_RESULTS}"` ran from `backend/`, but the log and PID redirects targeted `${GITHUB_WORKSPACE}/${HW06_RESULTS}`. The workflow now creates the absolute repository-root results directory. This correction changes no request, assertion, fixture, or readiness behavior and is not a successful sample run.

## 4. Two required real sample runs

| Run | Type | Commit/URL | Total cases | Passed | Failed | Failed Test Case ID | Evidence | Notes |
|---|---|---|---:|---:|---:|---|---|---|
| Sample Run 1 | Illustrative pass | `<fill after a real all-pass commit and workflow run>` | `<N actually executed>` | `<same N>` | 0 | — | `<real Actions URL, uploaded JUnit/CLI artifact, and human screenshot>` | Not an execution result; do not fill until every CI-enabled case passes |
| Sample Run 2 | Illustrative negative CI | `<fill after a separate real commit and workflow run>` | `<N actually executed>` | `<N-1>` | 1 | `<exactly one real failed case ID>` | `<real Actions URL, uploaded JUnit/CLI artifact, and human screenshot>` | Not an execution result; the deliberate assertion failure must not be reported as an SUT defect |

For each run, reconcile `N` against the JUnit/CLI evidence and state whether it means the 159 tracked CI-enabled cases or a later reviewed expansion. Never count skipped rows as passed. After Sample Run 2, restore the deliberately changed assertion in a separate human-owned action and explain the cleanup in the final report.

## 5. Evidence and review checklist

- [ ] `HW06_POSTMAN_ENV_BUNDLE` created and reviewed without exposing its value.
- [ ] Workflow committed and pushed manually by the student.
- [ ] Sample Run 1 URL, commit SHA, artifact, counts, and screenshot recorded.
- [ ] Sample Run 1 has zero failed CI-enabled cases.
- [ ] Sample Run 2 URL, commit SHA, artifact, counts, and screenshot recorded.
- [ ] Sample Run 2 has exactly one failed case, with its ID recorded.
- [ ] Deliberate negative-CI change restored after evidence capture.
- [ ] No GET request or HTTP GET readiness check appears in either run.
- [ ] `X-Student-Id` injection is shown in human-captured console evidence without exposing passwords, JWTs, or other secrets.
- [ ] Disabled/external cases are not misrepresented as CI-executed cases.
- [ ] User enters the exact confirmation `confirm ci/cd` only after reviewing the proposal and supplying real evidence.

Status: Approved for CI/CD workflow implementation. The student must supply real evidence in the final report after executing the workflow with the reviewed secret and approved collections/data.
