# HW06 — EShop API Testing

> **Student ID:** 23127379
> **Course:** CSC13003 — Software Testing
> **SUT:** EShop (`http://localhost:3000`)
> **Status:** PROPOSED FINAL PACKAGE — pending `confirm finalization`; unresolved human-owned evidence is listed below

## Selected API units

| Pool | Requirement | Scored endpoint(s) | Pipeline status |
|---|---|---|---|
| A | FR-03 Forgot/Reset Password | `POST /api/forgot-password`, `POST /api/reset-password` | DONE |
| B | FR-08 Checkout | `POST /api/checkout` | DONE |
| C | FR-15 Update Product | `PUT /api/products/:id` | DONE |

No GET request belongs to the HW06 suite. Pool B's Register/Login/Cart POST calls are fixture setup only and are not scored cases.

- Group non-duplication confirmation: Confirmed
- Public repository: https://github.com/AkiraTomori/eshop-sut

## Test summary

| API unit | AI-generated | Audited VALID | Human-added | Final approved | Executed | Passed | Failed | Genuine defect root causes |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Pool A / FR-03 | 79 | 49 | 13 | 62 | 55 | 29 | 26 | 3 |
| Pool B / FR-08 | 62 | 35 | 7 | 42 | 42 | 29 | 13 | 2 |
| Pool C / FR-15 | 86 | 60 | 7 | 67 | 67 | 30 | 37 | 3 |
| **Total** | **227** | **144** | **27** | **171** | **164** | **88** | **76** | **8** |

Count basis:

- “AI-generated” is the complete Stage 1 case inventory before audit disposition; “Final approved” is Stage 2 VALID plus confirmed Stage 3 additions.
- Pool A has 62 final rows, but 7 remained disabled by documented fixture/contract blockers; the retained run gives 29/26 case verdicts over 55 enabled IDs.
- Pool B's Newman-only result is 41 passed / 1 failed. Restricted SQLite evidence fails 12 additional, non-overlapping server-total oracles, so the final requirement verdict is 29 passed / 13 failed. Cart-clearing remains unverified.
- Pool C executed 65 cases in Newman and 2 in the approved external concurrency/replay harness; the complete verdict is 30/37.
- CI uses a distinct tracked subset of 159 enabled cases and produced 96 passed / 63 failed. It must not be substituted for the local 164-case final execution total.

Excel-compatible exports are in [`test_cases/`](test_cases/): 171 final case rows plus a reconciled summary CSV.

## Postman/Newman artifacts

| Pool | Collection / environment / data | Execution evidence | Verified fact |
|---|---|---|---|
| A | [`Pool-A.../postman/`](Pool-A_FR03_Password_Reset/postman/) | [`Pool-A_FR03_report.html`](Pool-A_FR03_Password_Reset/postman/newman/Pool-A_FR03_report.html) | 55 enabled IDs; 29 passed / 26 failed |
| B | [`Pool-B.../postman/`](Pool-B_FR08_Checkout/postman/) | [`Pool-B_FR08_full_report.html`](Pool-B_FR08_Checkout/postman/newman/Pool-B_FR08_full_report.html) and SQLite evidence | 42 cases; final evidence verdict 29/13 |
| C | [`Pool-C.../postman/`](Pool-C_FR15_Update_Product/postman/) | [`Pool-C_FR15_report.html`](Pool-C_FR15_Update_Product/postman/newman/Pool-C_FR15_report.html) and external-state evidence | 67 cases; 30 passed / 37 failed |

All three collections use a collection-level pre-request script that reads `StudentID` and upserts `X-Student-Id`. The machine-readable reports and stage records show only local POST/PUT traffic, but the assignment's separate human-captured console screenshot of the header is still missing.

## Postman features actually used

| Feature | Used? | Evidence |
|---|---|---|
| Collections and folders | Yes | Three Collection v2.1 JSON files; Pool B separates fixture and scored folders |
| Collection/environment/data variables | Yes | Three environment and runner-data files |
| Collection-level pre-request script | Yes | Each collection injects `X-Student-Id` from `StudentID` |
| Tests and available schema/security assertions | Yes | Collection scripts and Newman JSON/HTML reports |
| Data-driven Newman execution | Yes | 62/42/67 iteration datasets and retained reports |
| Workspaces | Not evidenced | Do not claim without a real workspace screenshot/link |
| Monitors | Not used/evidenced | Not claimed |
| Mock servers | Not used/evidenced | Not claimed |

## CI/CD summary

The push-triggered workflow is [`.github/workflows/hw06-newman.yml`](../../.github/workflows/hw06-newman.yml). The canonical report is [`reports/HW06_CICD_Report.md`](../../reports/HW06_CICD_Report.md).

| Required sample | Real evidence | Compliance status |
|---|---|---|
| 159/159 all passing | No run, URL, artifact, or screenshot exists | Student declined to modify the defective SUT or weaken reviewed tests; literal requirement unmet |
| 158/159 exactly one failure | No such run exists | Replaced by explicit student decision with the real 96/159 failed run; literal requirement unmet |
| Student-approved substitute | [Job 98890567631](https://github.com/AkiraTomori/eshop-sut/actions/runs/33183542319/job/98890567631), commit `61e0baea`, artifact `hw06-newman-33183542319-1`, [`CI-fail-sample-2.png`](../../reports/CI-fail-sample-2.png) | Real 159-case execution: 96 passed, 63 failed |

No instructor-approved exception is present.

## AI-driven test generator

- Reusable skills: [`.agents/skills/api-skill/`](../../.agents/skills/api-skill/)
- Tool-neutral commands: [`.agents/commands/`](../../.agents/commands/)
- Design and pseudocode: [`test_generator_design.md`](test_generator_design.md)
- Student-drawn diagram: `[USER ACTION REQUIRED: add the real student-created PNG/drawing export and authorship evidence]`
- Optional demonstration video: Playlist
    + [Part 1](https://www.youtube.com/watch?v=ou_biQwrHbc&list=PLW31g0N2iKYc&index=1)
    + [Part 2](https://www.youtube.com/watch?v=OuDKgcKGNsk&list=PLW31g0N2iKYc&index=2)
    + [Part 3](https://www.youtube.com/watch?v=bIA0vGdlcAg&list=PLW31g0N2iKYc&index=3)
    + [Part 4](https://www.youtube.com/watch?v=iix8IJVprUE&list=PLW31g0N2iKYc&index=4)
    + [Part 5](https://www.youtube.com/watch?v=WOSqtmyjCTk&list=PLW31g0N2iKYc&index=5)
    + [Part 6](https://www.youtube.com/watch?v=Ig30OK07uAQ&list=PLW31g0N2iKYc&index=6)
    + [Part 7](https://www.youtube.com/watch?v=444cEObA7mE&list=PLW31g0N2iKYc&index=7)
    + [Part 8](https://www.youtube.com/watch?v=Oxfca3F-7ZE&list=PLW31g0N2iKYc&index=8)

## Bugs and AI evidence

- Consolidated defects: [`bug_report.md`](bug_report.md). Six new HW06 Issues are posted; `BUG-PB-002` reuses existing Issue 28 and the missing-product behavior reuses Issue 52. Seven redacted MSSV screenshots were generated from the Newman/SQLite evidence during the posting session.
- Consolidated audit: [`ai_audit_report.md`](ai_audit_report.md); authoritative Pool sources remain in each Pool directory.
- Confirmed 260-word critique: [`ai_critique.md`](ai_critique.md).
- Real scoped Git history: [`git_commit_log.txt`](git_commit_log.txt).

## Self-assessment

| No. | Criterion | Maximum | Self-Assessed Grade |
|---|---|---:|---:|
| 1 | API 1 — full pipeline | 30 | 30 |
| 2 | API 2 — full pipeline | 30 | 30 |
| 3 | API 3 — full pipeline | 30 | 30 |
| 4 | Agent Skills / AI-driven generator | 10 | 10 |
|  | **Total** | **100** | 100 |

## Submission blockers

- Student-drawn generator diagram and authorship evidence.
- Human-captured `X-Student-Id` console screenshot.
- Download/retain the seven generated MSSV bug screenshots as submission files if the grader requires image artifacts inside the package; the Issue posting/reconciliation itself is complete.
- Main report PDF and AI Audit/Critique PDFs.
- Literal two-run CI/CD evidence, or a written instructor-approved exception for the documented substitution.
- Group non-duplication confirmation, self-assessment score, and final manual ZIP inspection.

Proposed ZIP: `23127379_HW06_AI_API_<SelfAssessedGrade>.zip`. ZIP creation and Moodle submission remain manual.
