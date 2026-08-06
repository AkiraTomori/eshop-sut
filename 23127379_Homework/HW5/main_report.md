# HW05 Main Report — Performance Testing

## Student information

| Field | Value |
|---|---|
| Student | 23127379 — Thái Minh Huy |
| Assignment | HW05 — Performance Testing |
| Repository | <https://github.com/AkiraTomori/eshop-sut> |
| Framework | JMeter / k6 |
| SUT URL | http://localhost:3000 |
| Scope | Load, Spike, and Stress testing |

## 1. Feature selection and automation scope

Three distinct endpoint scenarios were tested to evaluate the performance profile of the EShop system.

| Group | Scenario | Endpoints | Test Duration/Load | Latest run |
|---|---|---|---|---|
| Group 1 | Load Testing | `GET /api/products` | *(TBD)* | Run #1 |
| Group 2 | Spike Testing | `POST /api/login` | *(TBD)* | Run #1 |
| Group 3 | Stress Testing | `POST /api/cart` → `checkout` | *(TBD)* | Run #1 |

## 2. AI-first workflow and human review

*(Describe the AI-first workflow used in HW05, how you used the 10-skill suite, the independent review process, and any misinterpretation hunts that occurred during the analysis phase.)*

## 3. Automation design

### 3.1 Test Parameters

*(Describe thread counts, ramp-up times, and think times configured for the scenarios.)*

### 3.2 Data-driven implementation

*(Describe how CSV data sets were used and the sharing modes configured to avoid account lockout during spike testing.)*

## 4. Latest execution results

| Group | p95 (ms) | Error Rate (%) | Throughput (rps) | Key Finding |
|---|---|---|---|---|
| Group 1 | *(TBD)* | *(TBD)* | *(TBD)* | *(TBD)* |
| Group 2 | *(TBD)* | *(TBD)* | *(TBD)* | Recovery time: *(TBD)* s |
| Group 3 | *(TBD)* | *(TBD)* | *(TBD)* | Breaking point: *(TBD)* users |

## 5. Defect results

*(Summary of the performance bottlenecks or bugs found. Link to detailed bug_report.md)*

## 6. Continuous Integration Proposal (Task 3)

*(Brief summary of the CI performance pipeline. Detailed flowchart is in ci_pipeline_proposal.md)*

## 7. Demo video

*(Link to YouTube video playlist)*

## 8. Git history

`git-commit-log.txt` records the commits that modify HW5 `.jmx` files and test data.

## 9. Provisional self-assessment

| Criterion | Maximum | Provisional score | Rationale |
|---|---:|---:|---|
| Task 1 — Load testing | 20 | *(TBD)* | |
| Task 1 — Stress testing | 20 | *(TBD)* | |
| Task 1 — Spike testing | 20 | *(TBD)* | |
| Task 2 — AI analysis | 10 | *(TBD)* | |
| Task 3 — CI Proposal | 10 | *(TBD)* | |
| Agent Skills | 10 | *(TBD)* | |
| **Total** | **100** | **(TBD)** | **Provisional filename grade: (TBD)** |

## 10. Submission readiness

*(Checklist verification)*
