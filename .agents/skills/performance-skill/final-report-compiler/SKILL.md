---
name: final-report-compiler
description: >-
  Use this skill when ALL other skills (1-8) have completed for all three
  endpoint groups and the user is ready to compile the final HW05 submission
  package. Trigger phrases: "compile final report", "prepare submission",
  "create README", "generate submission checklist", or "compile HW05".
  This skill aggregates outputs from Skills 1-8 into: (1) a pre-filled
  README.md with the HW05 self-assessment table and test summary, (2) a
  structured main report in Markdown, (3) a git commit log, and (4) a
  submission checklist. Intentionally leaves blank: self-assessment scores
  and YouTube video link — human must fill these in. STOPS for final review.
---

# Skill 9 — final-report-compiler

## Purpose
Aggregate all outputs from Skills 1–8 into the complete HW05 submission package
following the exact structure required by the assignment.
**Leaves blank: self-assessment grades and video link — human fills these in.**

---

## Pre-run Checklist

Confirm all of the following exist before running:
- [ ] Skills 1–2: 3 test script files + 3 CSV files (`*.js` files, not `.jmx`)
- [ ] Skill 3: 3 k6 CSV files + 3 `summary.json` + 3 HTML report folders
- [ ] Skill 4: p95 / error rate / throughput data for all 3 scenarios
- [ ] Skill 5: `ai_audit_report.md` + `ai_critique.md`
- [ ] Skill 6: `ci_pipeline_proposal.md`
- [ ] Skill 7: `lockout_reset_log.md`
- [ ] Skill 8: `bug_reports/issue_draft_*.md` (+ GitHub Issue links if posted)
- [ ] Physical evidence: screenshots, hardware report (video link if available)
- [ ] Git commit log

---

## Output 1 — README.md (Submission)

**File**: `23127379_Homework/HW5/README.md`

```markdown
# HW05 — Performance Testing Report
**Student ID**: 23127379
**Course**: Software Testing — HCMUS
**Submission Date**: {date}
**EShop SUT**: http://localhost:3000 | [Repository](https://github.com/ttbhanh/eshop-sut)

---

## Test Summary Report

### Scenarios Run

| # | Scenario | Endpoint Group | Endpoints | Test Plan File | Status |
|---|----------|----------------|-----------|----------------|--------|
| 1 | Load Testing | Read-heavy | `GET /api/products`, `GET /api/products/:id` | `23127379_Load_{date}.js` | ✅ Complete |
| 2 | Spike Testing | Auth-heavy | `POST /api/login` | `23127379_Spike_{date}.js` | ✅ Complete |
| 3 | Stress Testing | Transactional | `POST /api/cart` → `POST /api/checkout` | `23127379_Stress_{date}.js` | ✅ Complete |

### Endpoint Groups Covered

| Group | Scenario | Endpoints |
|---|---|---|
| Read-heavy | Load Testing | `GET /api/products`, `GET /api/products/:id` |
| Auth-heavy | Spike Testing | `POST /api/login` (incl. account lockout) |
| Transactional | Stress Testing | `POST /api/cart`, `POST /api/checkout` |

### Performance Results Summary

| Scenario | p95 (ms) | Error Rate | Throughput | Notes |
|----------|----------|------------|------------|-------|
| Load Test | {P95_LOAD}ms | {ERR_LOAD}% | {T_LOAD} req/s | {notes} |
| Spike Test | {P95_SPIKE}ms | {ERR_SPIKE}% | {T_SPIKE} req/s | Recovery: {recovery}s |
| Stress Test | {P95_STRESS}ms | {ERR_STRESS}% | {T_STRESS} req/s | Breaking point: {BP} users |

### Endurance Threshold (Soak Test)
- **Test duration**: 15 minutes at sustained load
- **Maximum stable RPS**: {STABLE_RPS} req/s
- **Memory ceiling**: {MEM_CEILING} MB
- **Hardware**: {CPU}, {RAM}GB RAM, {OS}

### Report Views Used

| # | Report Type | Scenario |
|---|---|---|
| 1 | View Results Tree | Load Testing |
| 2 | Summary Report | Spike Testing |
| 3 | Aggregate Report | Stress Testing |

### Bugs & Performance Issues Found

| # | Type | Endpoint | Severity | GitHub Issue | Status |
|---|------|----------|----------|--------------|--------|
| 1 | {type} | {endpoint} | 🔴 {severity} | [#{num}]({link}) | Reported |
| *Total: {N} issues* | | | | | |

*(If no issues: "No critical bugs found during test execution.")*

### Demo Video
> [!IMPORTANT]
> 🎥 **Demo Video**: *(fill in YouTube link manually)*
> Duration: {minutes} minutes | Language: Vietnamese narration

---

## Self-Assessment

| **No.** | **Criteria** | **Grade** | **Self-Assessed Grade** |
| --- | --- | --- | --- |
| **1** | Task 1 — Load testing | 20 | *(fill in)* |
| **2** | Task 1 — Stress testing | 20 | *(fill in)* |
| **3** | Task 1 — Spike testing | 20 | *(fill in)* |
| **4** | Task 2 — AI analysis + misinterpretation hunt | 10 | *(fill in)* |
| **5** | Task 3 — Continuous Performance Testing proposal | 10 | *(fill in)* |
| **6** | Agent Skills | 10 | *(fill in)* |
| | **Total** | **100** | *(fill in)* |

---

## Repository Structure

\`\`\`
23127379_Homework/HW5/
├── README.md
├── hw05_report.md                     ← main report
├── hw05_audit_log.md                  ← full AI interaction log
├── ai_audit_report.md                 ← Appendix A: AI Audit Report
├── ai_critique.md                     ← Appendix B: AI Critique (200–300 words)
├── ci_pipeline_proposal.md            ← Task 3: CI pipeline
├── lockout_reset_log.md               ← Skill 7 lockout reset history
├── git_commit_log.txt                 ← required by HW05
├── test-plans/
│   ├── 23127379_Load_{date}.js
│   ├── 23127379_Spike_{date}.js
│   ├── 23127379_Stress_{date}.js
│   ├── products_data.csv
│   ├── auth_credentials.csv
│   └── order_payloads.csv
├── results/
│   ├── 23127379_Load_{date}/
│   │   ├── 23127379_Load_{date}.csv
│   │   ├── summary.json
│   │   ├── html_report/
│   │   └── resource_usage.txt
│   ├── 23127379_Spike_{date}/
│   └── 23127379_Stress_{date}/
├── screenshots/
│   ├── load_test_tool_resource.png
│   ├── spike_test_tool_resource.png
│   ├── stress_test_tool_resource.png
│   └── hardware_report.png
└── bug_reports/
    └── issue_draft_*.md
\`\`\`
```

---

## Output 2 — Main Report Structure

**File**: `23127379_Homework/HW5/hw05_report.md`

```markdown
# HW05 Performance Testing — Main Report

## 1. Introduction
[Brief description of EShop SUT and testing objectives]

## 2. Test Design (Task 1)

### 2.1 Load Testing — Read-heavy
[Endpoint group, scenario justification, approved parameters from Skill 1,
AI review notes (what AI got right / wrong, what you corrected)]

### 2.2 Spike Testing — Auth-heavy
[Same structure]

### 2.3 Stress Testing — Transactional
[Same structure]

## 3. Execution & Evidence (Task 1 continued)
[Execution summary, screenshot descriptions, hardware spec table]

## 4. AI Analysis & Misinterpretation Hunt (Task 2)
[From Skill 4: real numbers vs AI analysis, where AI was wrong, correct
values cited from .jtl rows]

## 5. Continuous Performance Testing Proposal (Task 3)
[From Skill 6: paste Mermaid flowchart and trade-off table]

## 6. Bugs & Issues
[From Skill 8: bug table, GitHub Issue links]

## 7. Conclusion

## Appendix A — AI Audit Report
[Embed or link ai_audit_report.md]

## Appendix B — AI Critique
[Paste ai_critique.md]
```

---

## Output 3 — Git Commit Log

```bash
cd /Users/thaiminhhuy/docs/Github/eshop-sut
git log --oneline --all -- "23127379_Homework/HW5/" \
  > "23127379_Homework/HW5/git_commit_log.txt"
cat "23127379_Homework/HW5/git_commit_log.txt"
```

---

## Output 4 — Submission Checklist

```markdown
## Pre-Submission Checklist

### Required Files
- [ ] hw05_report.md + PDF export
- [ ] README.md with self-assessment table (FILL IN GRADES)
- [ ] 3 test scripts: 23127379_Load/Spike/Stress_{date}.js
- [ ] 3 raw k6 CSV files + 3 summary.json (full, not truncated)
- [ ] 3 HTML reports (via k6-html-reporter: html_report/index.html)
- [ ] 3 CSV data files (products, auth, order)
- [ ] resource_usage.txt for all 3 runs
- [ ] screenshots/ (tool + resource monitor in same frame)
- [ ] hardware_report.png + hardware_spec.md
- [ ] YouTube video link (unlisted, ≥ 6 min, Vietnamese narration)
- [ ] ai_audit_report.md
- [ ] ai_critique.md (200–300 words — verify word count!)
- [ ] ci_pipeline_proposal.md
- [ ] git_commit_log.txt
- [ ] bug_reports/ + GitHub Issue links (if any)
- [ ] lockout_reset_log.md

### ZIP Naming
- [ ] 23127379_HW05_AI_Performance_{grade}.zip
  - Example: 23127379_HW05_AI_Performance_085.zip

### Final Checks
- [ ] Self-assessed grade filled in both README.md and ZIP filename
- [ ] Video link filled in README.md
- [ ] All GitHub Issue links are public and valid
- [ ] ai_critique.md word count verified = {N} words
```

---

## ⛔ Checkpoint — FINAL STOP

```
✅ Skill 9 complete — submission package compiled.

📄 Files created:
   - README.md
   - hw05_report.md
   - git_commit_log.txt
   - submission_checklist.md

✏️  You MUST fill in before submitting:
   [ ] Self-assessed grade in README.md
   [ ] YouTube video link in README.md
   [ ] ZIP filename with grade: 23127379_HW05_AI_Performance_{grade}.zip

🔍 If Skill 5 (postmortem) has not been run yet, do it now.

📦 Then: zip the entire HW5 directory and submit to Moodle.
```

## References
- [HW05 Assignment](../../../../23127379_Homework/HW5/2026.HW05.Performance%20Testing_En.md)
