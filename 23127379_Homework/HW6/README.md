# HW06 — EShop API Testing

> **Student ID:** 23127379  
> **Course:** CSC13003 — Software Testing  
> **SUT:** EShop (`http://localhost:3000`)  
> **Status:** WORKING TEMPLATE — replace every placeholder with verified evidence

## Selected API units

| Pool | Requirement | Endpoint(s) | Pipeline status |
|---|---|---|---|
| A | FR-03 Forgot/Reset Password | `POST /api/forgot-password`, `POST /api/reset-password` | `<from progress.md>` |
| B | FR-08 Checkout | `POST /api/checkout` | `<from progress.md>` |
| C | FR-15 Update Product | `PUT /api/products/:id` | `<from progress.md>` |

- Group non-duplication confirmation: `[USER ACTION REQUIRED: verify that no group member selected the same three APIs]`

## Test summary

| API unit | AI-generated | Human-added | Final | Executed | Passed | Failed | Genuine bugs |
|---|---:|---:|---:|---:|---:|---:|---:|
| Pool A / FR-03 | `<N>` | `<N>` | `<N ≥ 35>` | `<N>` | `<N>` | `<N>` | `<N>` |
| Pool B / FR-08 | `<N>` | `<N>` | `<N ≥ 35>` | `<N>` | `<N>` | `<N>` | `<N>` |
| Pool C / FR-15 | `<N>` | `<N>` | `<N ≥ 35>` | `<N>` | `<N>` | `<N>` | `<N>` |
| **Total** | `<N>` | `<N>` | `<N>` | `<N>` | `<N>` | `<N>` | `<N>` |

Every number must be reconciled against the confirmed case tables and real Newman reports.

## Postman/Newman artifacts

| Artifact | Path/link | Verified? |
|---|---|---|
| Collection | `<real .postman_collection.json path>` | `[ ]` |
| Environment | `<real .postman_environment.json path>` | `[ ]` |
| Pool A data | `<real JSON/CSV path>` | `[ ]` |
| Pool B data | `<real JSON/CSV path>` | `[ ]` |
| Pool C data | `<real JSON/CSV path>` | `[ ]` |
| Newman HTML reports | `<real report paths>` | `[ ]` |
| `X-Student-Id` console screenshot | `<real screenshot path>` | `[ ]` |

## Postman features actually used

Mark only features demonstrated by real artifacts.

| Feature | Used? | Evidence |
|---|---|---|
| Collection and folders | `[ ]` | `<path/screenshot>` |
| Collection/environment/data variables | `[ ]` | `<path/screenshot>` |
| Collection-level pre-request script | `[ ]` | `<path/screenshot>` |
| Tests and schema assertions | `[ ]` | `<path/report>` |
| Data-driven Collection Runner/Newman | `[ ]` | `<path/report>` |
| Workspace | `[ ]` | `<screenshot/link>` |
| Monitor | `[ ]` | `<screenshot/link>` |
| Mock server | `[ ]` | `<screenshot/link>` |

## CI/CD summary

| Run | Commit | Workflow URL | Result | Evidence |
|---|---|---|---|---|
| All passing | `<real commit>` | `<real URL>` | `<verified totals>` | `<real screenshot/artifact>` |
| Exactly one failure | `<real commit>` | `<real URL>` | `<one failed case ID>` | `<real screenshot/artifact>` |

## AI-driven test generator

- Reusable skills: `.agents/skills/api-skill/`
- Tool-neutral commands: `.agents/commands/`
- Design and pseudocode: `test_generator_design.md`
- Student-drawn diagram: `[USER ACTION REQUIRED: add real path]`
- Optional demo video: `[USER ACTION REQUIRED: add YouTube link if recorded]`

## Bugs

See `bug_report.md`. GitHub Issue links and screenshots must be real and added manually.

## AI evidence

- AI Audit Report: `ai_audit_report.md`
- AI Critique: `ai_critique.md` (mandatory 200–300 words)
- Working audit source: `.agents/skills/api-skill/state/ai-audit-log.md`

## Self-assessment

| No. | Criterion | Maximum | Self-Assessed Grade |
|---|---|---:|---:|
| 1 | API 1 — full pipeline | 30 | `<USER INPUT>` |
| 2 | API 2 — full pipeline | 30 | `<USER INPUT>` |
| 3 | API 3 — full pipeline | 30 | `<USER INPUT>` |
| 4 | Agent Skills / AI-driven generator | 10 | `<USER INPUT>` |
|  | **Total** | **100** | `<USER INPUT>` |

## Submission

- Required ZIP name: `23127379_HW06_AI_API_<SelfAssessedGrade>.zip`
- Repository URL: `<USER INPUT>`
- Moodle submission: manual only
