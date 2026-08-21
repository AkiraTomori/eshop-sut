---
name: cicd-pipeline-generator
description: "Generate a proposed push-triggered GitHub Actions workflow for Newman and an HW06 CI/CD report template with one passing run and one run containing exactly one failed case."
---

# CI/CD Pipeline Generator

Create only **proposed configuration and report-template files**. Do not push, enable a workflow, run Newman or an API, or represent the two sample runs as real results. Stop for user approval before any application or execution step.

## 1. Expected input

- User-approved Postman collection, environment, and data artifacts.
- Student ID, Node/Newman versions, the repository's existing SUT startup command, and the method for waiting on TCP port 3000.
- Report artifact paths, branch policy, and secret names when applicable.
- Approved case totals for all three API units, with at least 35 cases per unit.

If the SUT startup command is unknown or the collection is not approved, use an explicit placeholder and mark it `INCOMPLETE`; never guess. The workflow must not add a GET request as a health check.

## 2. Step-by-step process

1. Statically verify input paths, artifact names, and coverage; reject real secrets or tokens in YAML or the repository.
2. Generate `.github/workflows/hw06-newman.yml` triggered on `push`. It must check out the code, set up Node, install pinned dependencies/Newman, start EShop, and wait for `tcp:3000` instead of issuing a GET request.
3. Run Newman in data-driven mode for the three folders/API units using their corresponding collection, environment, and data files. Ensure every request receives `X-Student-Id` from the collection-level pre-request script; add no GET endpoint.
4. Produce CLI/JUnit output, plus HTML only when its dependency has been approved. Upload report artifacts even when tests fail, while preserving Newman's exit code so an assertion failure correctly fails the job.
5. Generate a CI/CD report template describing exactly two illustrative runs: `Sample Run 1` passes every case; `Sample Run 2` has exactly one failed case while all others pass. Keep every metric, run URL, commit, and screenshot as a placeholder, and state that these are sample scenarios rather than execution evidence.
6. Review YAML syntax at the content level without executing it, produce a manifest, and stop for user review.

Record the AI invocation through `ai-audit-logger` when that logger is operating.

## 3. Output format

### Proposed files

- `.github/workflows/hw06-newman.yml`
- `reports/HW06_CICD_Report.md`

### Workflow manifest

| Trigger | API unit/folder | Data file | Newman reporters | Artifact path | Student header source | Status |
|---|---|---|---|---|---|---|

### CI/CD report template

| Run | Type | Commit/URL | Total cases | Passed | Failed | Failed Test Case ID | Evidence | Notes |
|---|---|---|---|---|---|---|---|---|
| Sample Run 1 | Illustrative pass | `<fill after a real run>` | `<N>` | `<N>` | 0 | — | `<real artifact/screenshot>` | Not an execution result |
| Sample Run 2 | Illustrative negative CI | `<fill after a real run>` | `<N>` | `<N-1>` | 1 | `<exactly one ID>` | `<real artifact/screenshot>` | Not an execution result |

End the output with: `Status: PROPOSED CI/CD — not installed, pushed, or executed; pending user review.`

## 4. Short input → output example

**Input:** Collection `22123456_HW06_EShop.postman_collection.json`, three approved data files, and StudentID supplied through the environment.

**Condensed output:**

```yaml
name: HW06 Newman API Tests
on: [push]
jobs:
  newman:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      # Fill setup/start/wait/newman steps from the confirmed repository scripts.
```

The accompanying report contains the `Sample Run 1` and `Sample Run 2` rows; both retain placeholders for real evidence and are marked `PROPOSED`.
