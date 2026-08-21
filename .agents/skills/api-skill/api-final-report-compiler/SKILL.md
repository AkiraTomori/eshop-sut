---
name: api-final-report-compiler
description: "Audit HW06 deliverable completeness and compile the final README, main report, summaries, and submission checklist after all pools, CI/CD evidence, and critique are approved."
---

# API Final Report Compiler

Compile only an **evidence-backed proposed submission package**. Run last, after all three pools are DONE, CI/CD artifacts exist, and `api-postmortem-critique` has been confirmed. Never fabricate test counts, passes/failures, Postman/Newman features, screenshots, links, Git commits, self-assessment scores, PDFs, or a student-drawn diagram.

## 1. Expected input

- The full HW06 assignment and current `AGENTS.md`.
- Confirmed Stage 1–5 artifacts for Pools A, B, and C, with at least 35 final cases per API unit.
- Excel-compatible test-case data and test summary.
- Postman collection, environment, runner data, Newman HTML reports, and the actual Postman-feature list.
- Confirmed bugs/false-positive triage and GitHub Issue links when posted.
- GitHub Actions workflow plus two real run links/screenshots: all passing and exactly one failure.
- Confirmed `ai_audit_report.md` and 200–300 word `ai_critique.md`.
- AI test-generator pseudocode and a placeholder/path for the student's self-drawn diagram.
- Git commit history, repository link, optional demo link, and any PDFs/screenshots actually produced.

Missing human-only evidence is a gap, not permission to generate it.

## 2. Step-by-step process

1. Read the HW06 assignment completely and build a requirement-to-artifact completeness matrix covering sections 6–15.
2. Verify pool counts and pipeline evidence. Reconcile generated, human-added, executed, passed, failed, and bug totals against the source artifacts; report any mismatch instead of choosing a convenient number.
3. Verify anti-cheat evidence: real `X-Student-Id` console screenshot, Newman hostname, real pipeline URLs/screenshots, and a student-drawn generator diagram. Mark each as `PRESENT`, `MISSING`, or `USER ACTION REQUIRED`.
4. Compile/update the README summary and self-assessment table, main report, CI/CD references, generator-design references, consolidated bug summary, AI appendices, and Git commit-log reference using only verified data.
5. Produce a pre-submission checklist and proposed ZIP name. Leave self-assessment values, missing URLs, screenshots, PDF exports, and diagram evidence as explicit user placeholders.
6. Present changed files, unresolved blockers, and the final verification table. Stop for `confirm finalization`; never zip, commit, push, post issues, or submit automatically.

Record this invocation through `ai-audit-logger` when that logger is operating.

## 3. Output format

### Completeness matrix

| HW06 requirement | Required artifact/evidence | Source path | Status | User action |
|---|---|---|---|---|

### Proposed compiled files

- `23127379_Homework/HW6/README.md`
- `23127379_Homework/HW6/hw06_report.md`
- `23127379_Homework/HW6/submission_checklist.md`
- `23127379_Homework/HW6/git_commit_log.txt` when generated from real Git history

### README summary table

| API unit | Generated | Human-added | Final | Executed | Passed | Failed | Genuine bugs | Evidence source |
|---|---:|---:|---:|---:|---:|---:|---:|---|

### Final handoff

```text
Status: PROPOSED FINAL PACKAGE — pending user confirmation.
Verified artifacts: <count>
Missing/user-owned artifacts: <list>
Proposed ZIP: 23127379_HW06_AI_API_<SelfAssessedGrade>.zip
```

## 4. Short input → output example

**Input:** All pool reports exist, but the Pool B Newman screenshot and self-assessed grade are missing.

**Condensed output:**

| HW06 requirement | Required artifact/evidence | Source path | Status | User action |
|---|---|---|---|---|
| Pool B execution | Newman report + screenshot | `<Pool B report path>` | USER ACTION REQUIRED | Attach real Newman screenshot |
| Self-assessment | Score in README and ZIP name | `README.md` | USER ACTION REQUIRED | Enter the student's score |

The compiler leaves both placeholders blank and does not claim the package is submission-ready.
