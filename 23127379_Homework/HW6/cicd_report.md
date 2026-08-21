# HW06 Newman CI/CD Report

> **Status:** TEMPLATE — workflow runs, commits, URLs, and screenshots must be real.

## 1. Pipeline configuration

| Item | Value | Evidence |
|---|---|---|
| Workflow path | `<real .github/workflows path>` | `<repository link>` |
| Trigger | `push` | `<workflow excerpt/link>` |
| SUT startup | `<real command>` | `<workflow step>` |
| Readiness check | `tcp:3000` or equivalent non-GET check | `<workflow step>` |
| Newman version/command | `<real version and command>` | `<workflow step/log>` |
| Collection/environment/data | `<real paths>` | `<artifact links>` |
| Student header source | Collection-level pre-request script | `<screenshot/path>` |
| Report retention | `<JUnit/HTML/CLI artifacts>` | `<artifact link>` |

## 2. Workflow sequence

Describe checkout → setup → SUT startup → TCP readiness → Newman data-driven runs → report upload → exit-code handling.

## 3. Required real runs

| Run | Commit | Workflow URL | Total | Passed | Failed | Failed case ID | Screenshot/artifact |
|---|---|---|---:|---:|---:|---|---|
| All passing | `<real commit>` | `<real URL>` | `<N>` | `<N>` | 0 | — | `<real evidence>` |
| Exactly one failure | `<real commit>` | `<real URL>` | `<N>` | `<N-1>` | 1 | `<one real case ID>` | `<real evidence>` |

## 4. Interpretation and cleanup

- Explain why the deliberate failure occurred and how the suite was restored.
- Confirm that the failing commit was not misrepresented as a product defect.
- Record any cost, reliability, or local-SUT limitations.

**Confirmation:** `<confirm ci/cd / pending>`

