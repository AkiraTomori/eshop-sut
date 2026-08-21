---
name: ai-audit-logger
description: "Route each HW06 AI interaction to the applicable Pool audit or the root cross-pipeline section, preserving traceability and a local human-review gate."
---

# AI Audit Logger

Record exactly one proposed audit row after each invocation in which another HW06 skill calls AI and receives a result or error. Do not audit the logger itself. Pool-scoped work is reviewed in that Pool's own report; the root HW6 report later consolidates all three Pool reports.

## 1. Audit routing

| Scope | Append target | Audit-ID prefix |
|---|---|---|
| Pool A stages 1–5 | `23127379_Homework/HW6/Pool-A_FR03_Password_Reset/ai_audit_report.md` | `PA-AI-` |
| Pool B stages 1–5 | `23127379_Homework/HW6/Pool-B_FR08_Checkout/ai_audit_report.md` | `PB-AI-` |
| Pool C stages 1–5 | `23127379_Homework/HW6/Pool-C_FR15_Update_Product/ai_audit_report.md` | `PC-AI-` |
| Cross-pool work (`cicd-pipeline-generator`, `api-postmortem-critique`, `api-final-report-compiler`) | `23127379_Homework/HW6/ai_audit_report.md`, section `Cross-pipeline AI interactions` | `POST-AI-` |

Never write a Pool interaction only to the legacy `.agents/skills/api-skill/state/ai-audit-log.md`. That file is retained solely as a migration pointer. Never duplicate one invocation across multiple Pool reports.

## 2. Required input

- The invoking skill/task and its Pool or cross-pipeline scope.
- The actual tool/model when observable; otherwise `unknown`.
- An ISO 8601 completion timestamp with timezone, preferably `Asia/Ho_Chi_Minh`.
- A redacted prompt summary.
- A redacted output summary with artifact/case counts, proposal status, and errors when applicable.

Never infer a model, timestamp, count, or outcome. Remove credentials, JWTs, OTPs, passwords, sensitive data, and unnecessary PII.

## 3. Append and review rules

1. Resolve the target from the table above and verify that the Pool matches the active workflow state.
2. Assign the next zero-padded ID in that target without renumbering existing records.
3. Prevent duplicates using `scope + invoking skill + timestamp + prompt summary`.
4. Append one row in chronological order with `Human Review` set to `PENDING`.
5. Do not change prompt/output history. Only an explicit human decision may change `Human Review` to `CONFIRMED`, `REVISED`, or `REJECTED`; append corrections in the same file's Human Review Notes table.
6. A Pool cannot become `DONE` or advance until every local row has a non-pending human decision and the user enters `confirm pool audit`.
7. The root report is compiled from the three confirmed Pool reports. Preserve any real `POST-AI-*` rows already present when recompiling it.

## 4. Pool audit format

```markdown
# Pool <A|B|C> — AI Audit Report

> **Human review status:** PENDING

| Audit ID | Tool/Model | Timestamp | Pool/Stage | Prompt | Output | Human Review |
|---|---|---|---|---|---|---|
| PA-AI-001 | domain-testing / unknown | 2026-08-21T10:30:00+07:00 | Pool A / Stage 1 | Propose FR-03 EC/BVA cases | 36 proposed cases; not executed | PENDING |

## Human Review Notes

| Audit ID | Decision | Correction/notes | Reviewed at | User confirmation |
|---|---|---|---|---|
```

The exact tool, timestamp, prompt summary, output summary, and decision must come from real records. A Pool report remains proposed until the human reviews every row.
