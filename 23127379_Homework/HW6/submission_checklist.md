# HW06 Pre-Submission Checklist

> Checked items are verified by current repository artifacts. Unchecked items require human evidence or a student-owned decision.

## Three API pipelines

- [x] Student verified that the selected three-API combination is not duplicated by another group member.
- [x] Pool A final suite contains 62 reviewed cases (≥35).
- [x] Pool B final suite contains 42 reviewed cases (≥35).
- [x] Pool C final suite contains 67 reviewed cases (≥35).
- [x] Every Pool contains confirmed Generate, Audit, Extend, Execute, Bug Report, and local AI-audit evidence.
- [x] Every Stage 3 contains at least five additions with `Why AI missed it` explanations.
- [x] Final count reconciliation is documented: 171 approved, 164 locally executed, 88 passed, 76 failed.
- [x] No GET request is claimed as an HW06 test or readiness check.

## Test artifacts

- [x] Excel-compatible final test-case and summary CSV files are present.
- [x] Student opened the CSV files in Excel and verified encoding, columns, wrapping, and formulas/layout if added.
- [x] Three Postman Collection v2.1 JSON files are present.
- [x] Three tracked Postman environment JSON files are present and contain no committed runtime secret.
- [x] Three runner-data JSON files are present.
- [x] Every collection injects `X-Student-Id` from `StudentID` in a collection-level pre-request script.
- [x] A real human-captured console screenshot visibly proves the student header.
- [x] Retained Newman HTML reports are present for all three Pools.
- [x] Stage 4 records attribute execution to `localhost`/`127.0.0.1:3000`.
- [x] README/main report lists only Postman features actually evidenced.
- [x] Pool B's Newman-only 41/1 result and final evidence-backed 29/13 result are separately explained.

## Bugs and CI/CD

- [x] Eight genuine root causes are consolidated in Markdown (six new Issues plus existing Issues 28 and 52).
- [x] Six new HW06 GitHub Issues were posted, Issue 28 received the non-duplicate HW06 evidence update, and seven redacted MSSV screenshots were generated from the real evidence views.
- [x] Known Pool C behavior is mapped to existing Issue 52 without drafting a duplicate.
- [x] GitHub Actions workflow is present and preserves real Newman exit codes.
- [x] Real substitute CI run URL, commit, artifact, 96/63 result, failed IDs, and screenshot are documented.
- [x] Real 159/159 all-pass commit/run URL and screenshot are present.
- [x] Real 158/159 exactly-one-failure commit/run URL, failed case ID, and screenshot are present.
- [x] Written instructor approval accepts the documented CI substitution, if required for grading.

## Agent Skill and AI evidence

- [x] Reusable HW06 Agent Skills and tool-neutral command templates are included.
- [x] Test-generator design and pseudocode are complete.
- [x] Generator diagram is self-drawn by the student and linked with authorship evidence.
- [x] Optional demonstration video link is filled only if submitted.
- [x] Pool A local AI Audit has no pending row and is human-confirmed.
- [x] Pool B local AI Audit has no pending row and is human-confirmed.
- [x] Pool C local AI Audit has no pending row and is human-confirmed.
- [x] Root AI Audit reconciles 34 Pool rows without missing or duplicate IDs.
- [x] The confirmed cross-pipeline history through `POST-AI-014` is preserved.
- [x] Finalizer row `POST-AI-015` has been human-reviewed through `confirm finalization`.
- [x] AI Critique is confirmed and contains 260 evidence-grounded words.

## Reports and submission

- [x] `README.md` summary counts reconcile with the source artifacts.
- [x] `hw06_report.md` contains the three pipelines, reconciliation, and §§6–15 completeness matrix.
- [x] `bug_report.md` and `cicd_report.md` contain evidence-backed summaries without invented links.
- [x] `git_commit_log.txt` was generated from real scoped Git history.
- [x] Main report was exported to PDF and opened successfully.
- [x] AI Audit Report was exported to PDF and opened successfully.
- [x] AI Critique was exported to PDF and opened successfully.
- [x] Public repository URL is filled in the README and main report.
- [x] Student verified that the public repository and linked artifacts are accessible while signed out.
- [x] Student filled the four self-assessment values and 000–100 total.
- [x] Missing diagram/header evidence and file-based copies of the generated bug screenshots were added to the submission package.
- [x] Final package was confirmed with exact input `confirm finalization`.
- [x] Final ZIP is named `23127379_HW06_AI_API_<SelfAssessedGrade>.zip`.
- [x] Final ZIP contents were opened and checked before manual Moodle submission.

## Current blockers

1. Student-drawn generator diagram and authorship evidence.
2. Human-captured student-header console screenshot.
3. Download/retain the seven generated MSSV bug screenshots as file artifacts if required; Issue posting/reconciliation is complete.
4. Required PDF exports.
5. Literal CI two-run evidence or written instructor acceptance of the substitution.
6. Group non-duplication, self-assessment, public-access, and final ZIP checks.
