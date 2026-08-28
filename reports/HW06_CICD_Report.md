# HW06 Newman CI/CD Report

> The workflow configuration began as an AI proposal and was subsequently executed by the student. This report preserves the real diagnostic result and the student's explicit decision not to manufacture the two requested result shapes by changing the SUT or weakening the reviewed tests.

## 1. Configuration manifest

| Trigger | API unit/folder | Approved data file | Approved rows / tracked CI-enabled rows | Newman reporters | Artifact path | Student header source | Status |
|---|---|---|---:|---|---|---|---|
| `push` to `main` or `master`, limited to the workflow, backend, or HW06 paths | Pool A / `Pool A - FR-03 Password Reset` | `23127379_Homework/HW6/Pool-A_FR03_Password_Reset/postman/23127379_FR03_data.json` | 62 / 55 | CLI, JUnit | `23127379_Homework/HW6/reports/newman-ci/pool-a/` | Collection-level pre-request script reads `StudentID` and upserts `X-Student-Id` | `IMPLEMENTED / EXECUTED`; 7 approved rows remain deliberately disabled by documented blockers |
| Same push trigger | Pool B / scored `Pool B - FR-08 Checkout`, with the approved POST-only fixture folder | `23127379_Homework/HW6/Pool-B_FR08_Checkout/postman/23127379_FR08_data.json` | 42 / 42 | CLI, JUnit | `23127379_Homework/HW6/reports/newman-ci/pool-b/` | Collection-level pre-request script reads `StudentID` and upserts `X-Student-Id` | `IMPLEMENTED / EXECUTED`; fixture requests are setup only and are not scored cases |
| Same push trigger | Pool C / `Pool C - FR-15 Update Product` | `23127379_Homework/HW6/Pool-C_FR15_Update_Product/postman/23127379_FR15_data.json` | 67 / 62 | CLI, JUnit | `23127379_Homework/HW6/reports/newman-ci/pool-c/` | Collection-level pre-request script reads `StudentID` and upserts `X-Student-Id` | `IMPLEMENTED / EXECUTED`; 5 rows remain fixture/external-harness gated in tracked data |

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

## 4. Required runs and student-approved substitution

| Run | Type | Commit/URL | Total cases | Passed | Failed | Failed Test Case ID | Evidence | Notes |
|---|---|---|---:|---:|---:|---|---|---|
| Sample Run 1 | Not produced — student decision | — | 159 expected | — | — | — | No all-pass artifact or screenshot exists | The unchanged SUT contains defects exposed by the approved suite. A 159/159 result would require source-code fixes or dishonest weakening/disabling of reviewed tests. The student chose to preserve the SUT and truthful evidence. |
| Sample Run 2 | Student-selected substitute: actual failed CI | [`61e0baea` / job `98890567631`](https://github.com/AkiraTomori/eshop-sut/actions/runs/33183542319/job/98890567631) | 159 | 96 | 63 | 63 unique IDs detailed below | Artifact `hw06-newman-33183542319-1`; [CI failure screenshot](CI-fail-sample-2.png) | Substitutes for the requested exactly-one-failure run by explicit student decision. It proves failure detection and exit-code propagation, but it is not a literal 158/159 result. |

### English rationale for omitting the all-pass run

An all-pass run is not achievable against the current unchanged SUT because the approved API suite exposes genuine implementation defects. The latest complete execution ran all 159 CI-enabled cases and produced 96 passes and 63 failures. Producing 159/159 would therefore require modifying the application source code to correct those defects, or altering the test suite to suppress valid failures. The latter would invalidate the reviewed expected results and misrepresent the observed quality of the SUT.

The student has chosen not to modify the SUT solely to manufacture an all-green screenshot. This preserves separation between testing evidence and product remediation: the pipeline evaluates the submitted SUT as it exists, and the failures remain visible and traceable. Consequently, no all-pass URL, artifact, or screenshot is claimed. This is a transparent student-owned deviation from the assignment's requested all-pass sample, not evidence that the requirement was technically met.

### English rationale for substituting the failed run

The student has also chosen to use the existing real failed CI execution instead of creating a separate run with exactly one deliberately failing case. The retained execution is stronger as diagnostic evidence because it shows the actual behavior of the current SUT: all three Newman suites ran, artifacts were uploaded, and Newman's non-zero exit status correctly failed the GitHub Actions job. It contains 63 failed cases rather than one, so it does not satisfy the literal 158/159 scenario. The report records this difference rather than relabeling or hiding failures. No deliberate one-case change was introduced, so there is no artificial assertion change to restore.

This substitution is an explicit student decision. It demonstrates that the CI pipeline detects and propagates real API test failures, while accepting the assessment risk that the assignment specifically asks for exactly one failed case.

### Substituted failed-run detail

| Pool | CI-enabled cases | Passed cases | Failed cases | Failed assertions | Unique failed test case IDs |
|---|---:|---:|---:|---:|---|
| Pool A | 55 | 29 | 26 | 36 | `FR03-DOM-001`, `FR03-DOM-010`, `FR03-DOM-011`, `FR03-DOM-028`–`FR03-DOM-036`, `FR03-ST-001`, `FR03-ST-008`, `FR03-ST-013`, `FR03-ST-014`, `FR03-SEC-011`, `FR03-SEC-012`, `FR03-SEC-014`, `FR03-SCH-001`, `FR03-EXT-DOM-001`–`FR03-EXT-DOM-006` |
| Pool B | 42 | 40 | 2 | 2 | `FR08-DOM-006`, `FR08-DOM-007` |
| Pool C | 62 | 27 | 35 | 35 | `FR15-DOM-002`–`FR15-DOM-005`, `FR15-DOM-008`–`FR15-DOM-011`, `FR15-DOM-013`, `FR15-DOM-021`–`FR15-DOM-024`, `FR15-DOM-026`, `FR15-DOM-027`, `FR15-DOM-030`–`FR15-DOM-033`, `FR15-DOM-045`–`FR15-DOM-047`, `FR15-SEC-002`–`FR15-SEC-006`, `FR15-SEC-008`, `FR15-SEC-009`, `FR15-SEC-016`, `FR15-SEC-018`, `FR15-SEC-023`, `FR15-SCH-009`, `FR15-EXT-SEC-002`, `FR15-EXT-SEC-003` |
| **Total** | **159** | **96** | **63** | **73** | **63 unique IDs** |

## 5. Decision and compliance status

| Requirement | Current evidence or decision | Status |
|---|---|---|
| Push-triggered Newman workflow exists and preserves real exit codes | Workflow executed through job `98890567631`; backend, TCP readiness, three Newman runs, and artifact upload completed | `READY` |
| Reviewed runtime secret is available without repository disclosure | `HW06_POSTMAN_ENV_BUNDLE` exists; its value was not printed or committed | `READY` |
| Sample Run 1: all 159 enabled cases pass | Omitted because reaching 159/159 against the current SUT requires product remediation; the student chose not to change the SUT or weaken approved tests | `STUDENT-DECLINED — LITERAL REQUIREMENT NOT MET` |
| Sample Run 2: exactly one of 159 enabled cases fails | Replaced by the real 96-pass/63-failure run, with job URL, uploaded artifact, failed-ID breakdown, and screenshot | `STUDENT-APPROVED SUBSTITUTE — LITERAL REQUIREMENT NOT MET` |
| Evidence attribution | Real job URL, commit, artifact name, counts, failed IDs, and screenshot are recorded for the substituted failed run | `DOCUMENTED` |
| Deliberate one-case change restored | No deliberate assertion change was created because the actual failed run was retained | `NOT APPLICABLE TO THE SUBSTITUTE` |
| Instructor-approved exception | No written instructor exception is present | `NOT PROVIDED` |

**Decision status:** `CONFIRMED BY STUDENT WITH KNOWN REQUIREMENT DEVIATIONS.` The pipeline execution is real, but this report does not claim that the literal all-pass and exactly-one-failure evidence requirements were satisfied. Only explicit instructor approval can convert these substitutions into accepted assignment compliance.

## 6. Evidence and review checklist

- [x] `HW06_POSTMAN_ENV_BUNDLE` exists without exposing its value in the repository.
- [x] Workflow was committed, pushed, and executed by the student.
- [x] Real failed-run URL, commit, artifact, counts, failed IDs, and screenshot recorded.
- [x] Student decision not to produce an all-pass run documented in English.
- [x] Student decision to substitute the current failed run for the one-failure sample documented in English.
- [ ] Literal 159/159 all-pass evidence supplied — intentionally omitted by student decision.
- [ ] Literal 158/159 exactly-one-failure evidence supplied — replaced by the 96/159 result.
- [ ] Instructor approval for these substitutions supplied.
- [x] Workflow and approved collection definitions contain no GET test or HTTP GET readiness check.
- [ ] `X-Student-Id` injection is shown in human-captured console evidence without exposing passwords, JWTs, or other secrets.
- [x] Disabled/external cases are not misrepresented as CI-executed cases.
- [x] User entered the exact confirmation `confirm ci/cd` with awareness of the documented requirement deviations.

Status: `CI/CD DECISION CONFIRMED — student-approved substitution accepted for workflow progression; real failed CI documented; literal all-pass and exactly-one-failure requirements remain unmet unless the instructor accepts the deviation.`
