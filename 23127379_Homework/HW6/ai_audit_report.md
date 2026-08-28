# AI Audit Report — HW06 API Testing

> **Status:** WORKING — Pool consolidation is pending; preserve the real cross-pipeline records below.

> I use AI tools for the following tasks:

## Authoritative Pool sources

| Pool | Local AI audit | Human review confirmed? | Root reconciliation status |
|---|---|---|---|
| Pool A / FR-03 | `Pool-A_FR03_Password_Reset/ai_audit_report.md` | `[ ]` | `PENDING` |
| Pool B / FR-08 | `Pool-B_FR08_Checkout/ai_audit_report.md` | `[ ]` | `PENDING` |
| Pool C / FR-15 | `Pool-C_FR15_Update_Product/ai_audit_report.md` | `[ ]` | `PENDING` |

## Consolidated Pool interactions

Copy each real local row exactly once after its Pool audit is human-reviewed. Preserve its `Audit ID` so the root report remains traceable.

| Audit ID | Pool | Tool/Model | Date and time | Skill/Task | Prompt | Output | Human review decision | Source |
|---|---|---|---|---|---|---|---|---|

## Cross-pipeline AI interactions

CI/CD, critique, and finalization do not belong to one Pool. Append them here using `POST-AI-*`; they must also receive human review before final submission.

| Audit ID | Tool/Model | Timestamp | Task | Prompt | Output | Human Review |
|---|---|---|---|---|---|---|
| POST-AI-001 | skill-creator / unknown | 2026-08-21T11:04:56+07:00 | HW06 audit-orchestration update | Add an authoritative AI audit per Pool with local Human Review, and make the root HW6 AI Audit Report consolidate the three Pool reports | Added Pool-local audit routing, review gate and command, root aggregation rules, templates, and progress checks; migrated the existing Domain Testing record to `PA-AI-001`; no API calls | CONFIRMED |
| POST-AI-002 | skill-creator / unknown | 2026-08-21T11:20:36+07:00 | HW06 slash-command consistency review | Review every slash command against the revised `AGENTS.md` and correct any audit-routing or confirmation-gate mismatch | Reviewed all 15 command files; added exact `confirm next pool`, made `confirm critique` review all presented pending cross-pipeline rows, and required audit writes before output-producing commands stop; validation passed; no API calls | CONFIRMED |
| POST-AI-003 | cicd-pipeline-generator / GPT-5 | 2026-08-28T21:35:21+07:00 | HW06 CI/CD proposal | Generate the push-triggered Newman GitHub Actions workflow and two-run CI/CD report proposal after all three Pools reached DONE | Created 2 proposed files; mapped 171 approved rows and 159 tracked CI-enabled rows; pinned Newman 6.2.2; enforced TCP-only readiness, GET-free scope, collection-level StudentID header checks, runtime secret handling, JUnit/CLI uploads, and preserved exit codes; YAML/content validation passed; no workflow, Newman run, API call, push, or commit performed; runtime secret and real two-run evidence remain incomplete | CONFIRMED |
| POST-AI-004 | cicd-pipeline-generator / GPT-5 | 2026-08-28T21:52:55+07:00 | HW06 CI/CD failure diagnosis | Diagnose the GitHub Actions failure reporting that the required Postman environment bundle is absent | Confirmed the workflow received an empty `HW06_POSTMAN_ENV_BUNDLE`; verified the repository configuration report already marks that secret incomplete; found the local Pool B environment cleared and no Pool C local environment, so the committed templates cannot yet form a runnable complete bundle; no secret value printed, no workflow/API run, and no progress or CI/CD confirmation changed | CONFIRMED |
| POST-AI-005 | cicd-pipeline-generator / GPT-5 | 2026-08-28T22:02:45+07:00 | HW06 Actions secret setup | Create the required repository Actions secret after explicit user authorization | Authenticated GitHub CLI as the repository owner; generated and structurally validated a three-Pool runtime environment bundle in memory using reviewed local values, disposable credentials, and deterministic local seed fixtures; created `HW06_POSTMAN_ENV_BUNDLE` and verified its name/update timestamp without retrieving or printing its value; no workflow run, push, commit, API test, CI/CD confirmation, or progress transition performed | CONFIRMED |
| POST-AI-006 | cicd-pipeline-generator / GPT-5 | 2026-08-28T22:05:20+07:00 | HW06 CI startup-path correction | Diagnose and correct the GitHub Actions SUT log/PID directory failure supplied by the user | Identified that the backend-scoped step created a relative results directory under `backend/` while redirects used the repository-root path; changed one `mkdir` target to `${GITHUB_WORKSPACE}/${HW06_RESULTS}` and documented the failed pre-SUT run; no workflow run, API call, push, commit, progress transition, or CI/CD confirmation performed | CONFIRMED |
| POST-AI-007 | cicd-pipeline-generator / GPT-5 | 2026-08-28T22:17:03+07:00 | HW06 diagnostic-run evidence reconciliation | Calculate passed cases for GitHub Actions run `33183542319` and fill the CI/CD report without misclassifying it as the required one-failure run | Reconciled 159 CI-enabled cases against uploaded CLI/JUnit evidence: 96 passed and 63 unique cases failed across 73 failed assertions; restored Sample Run 2 placeholders, added the actual job URL, commit, artifact name, per-Pool counts, and failed-ID breakdown under a separate diagnostic-run section; screenshot, passing run, exact-one-failure run, CI/CD confirmation, push, commit, and progress transition remain pending | CONFIRMED |
| POST-AI-008 | cicd-pipeline-generator / GPT-5 | 2026-08-28T22:23:09+07:00 | HW06 incomplete-pass explanation | Add a report note explaining why the required all-pass run is unavailable and clearly label the real failed result | Added an evidence-grounded note that the current SUT defects prevent a truthful 159/159 result, warned against disabling cases or weakening reviewed oracles, and labeled diagnostic run `33183542319` as FAILED with 96 passed and 63 unique failed cases; no run, push, commit, progress transition, or CI/CD confirmation performed | CONFIRMED |
| POST-AI-009 | cicd-pipeline-generator / GPT-5 | 2026-08-28T22:25:59+07:00 | HW06 CI/CD confirmation gate | Apply the user's exact `confirm ci/cd` input only if the required real evidence is complete | Confirmation rejected: Sample Run 1 and Sample Run 2 still contain placeholders, no all-pass or exactly-one-failure record exists, required screenshots remain unchecked, and the only real run has 96 passed and 63 failed cases; progress and prior human-review decisions were left unchanged | CONFIRMED |
| POST-AI-010 | cicd-pipeline-generator / GPT-5 | 2026-08-28T22:29:18+07:00 | HW06 CI/CD confirmation recheck | Reapply the user's exact `confirm ci/cd` input after rechecking the current report and evidence | Confirmation rejected again: both required sample rows retain placeholders, Sample Run 1 has no all-pass result, the diagnostic run has 63 failed cases rather than exactly one, required screenshots/checklist evidence remain absent, and contradictory completion wording does not replace execution evidence; progress and prior decisions were left unchanged | CONFIRMED |
| POST-AI-011 | cicd-pipeline-generator / GPT-5 | 2026-08-28T22:30:40+07:00 | HW06 CI/CD readiness report | Make the CI/CD report structurally ready for confirmation review without inventing missing execution evidence | Corrected contradictory wording that treated the 63-failure diagnostic run as completed/qualified; added a confirmation-readiness matrix separating verified workflow/secret evidence from four blocked run, screenshot, and cleanup requirements; documented an instructor-exception path; report remains `NOT READY FOR confirm ci/cd`, and no progress, prior review decision, run, push, or commit was changed | CONFIRMED |
| POST-AI-012 | cicd-pipeline-generator / GPT-5 | 2026-08-28T22:35:06+07:00 | HW06 CI/CD confirmation evidence recheck | Reapply `confirm ci/cd` after inspecting the newly supplied CI failure screenshot | Screenshot confirms checkout, setup, TCP readiness, all three Newman steps, artifact upload, and final exit-status failure, but it does not show an all-pass run, executed case counts, or exactly one failed test-case ID; both required sample rows remain incomplete, so progress and prior human-review decisions were left unchanged | CONFIRMED |
| POST-AI-013 | cicd-pipeline-generator / GPT-5 | 2026-08-28T22:40:21+07:00 | HW06 student-approved CI evidence substitution | Document in English the student's decision not to produce an all-pass run and to replace the exactly-one-failure sample with the current failed CI evidence | Updated the CI/CD report to explain that 159/159 is not achievable against the unchanged defective SUT without remediation or weakening reviewed tests; replaced Sample Run 2 with the real 159-case result of 96 passed and 63 failed, linked its job, artifact, failed-ID detail, and supplied screenshot; labeled both choices as student-owned deviations from the literal requirements; no run, source-code fix, progress transition, prior review change, push, or commit performed | CONFIRMED |

## Cross-pipeline Human Review Notes

| Audit ID | Decision | Correction/notes | Reviewed at | User confirmation |
|---|---|---|---|---|

## Reconciliation

| Source invocation or Audit ID | Present exactly once? | Output path | Human-reviewed? | Gap/action |
|---|---|---|---|---|

Do not invent missing interactions, copy unreviewed Pool rows as approved, or erase cross-pipeline rows when refreshing the consolidated sections.
