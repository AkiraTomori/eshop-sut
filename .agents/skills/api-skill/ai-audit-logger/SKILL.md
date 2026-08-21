---
name: ai-audit-logger
description: "Record one AI Audit Report row whenever another HW06 skill invokes AI, preserving the tool/model, timestamp, prompt summary, and output summary throughout the pipeline."
---

# AI Audit Logger

Run throughout the HW06 pipeline: after each invocation in which another skill calls AI and receives either a result or an error, record exactly one entry. Do not log the logger's own operation, which would cause recursion. Each log entry is a **proposed audit record pending user review**; it does not make the audit final or trigger another pipeline stage.

## 1. Expected input

- Name of the skill that invoked AI.
- The tool and model names actually observed; use `unknown` when unavailable and never infer them.
- Completion timestamp in ISO 8601 with a timezone, preferably `Asia/Ho_Chi_Minh`.
- A prompt summary that excludes secrets, tokens, real OTPs, and sensitive data.
- An output summary containing artifact or case counts, status, and any error.
- Default log path: `.agents/skills/api-skill/state/ai-audit-log.md`, unless `AGENTS.md` specifies another file.

## 2. Step-by-step process

1. Receive the event after the source skill finishes; do not block or modify the source skill's output.
2. Verify that the record includes the tool/model, timestamp, prompt summary, and output summary. Never invent the model, timestamp, case count, or result.
3. Redact credentials, JWTs, OTPs, passwords, and unnecessary PII while retaining enough detail to trace the purpose and artifact.
4. Prevent duplicates using `skill + timestamp + prompt summary` as the key. Append exactly one row for every AI invocation, including failed invocations.
5. Preserve chronological order and do not modify earlier records. If a correction is necessary, append a correction record that references the earlier row.

## 3. Output format

The log file must use this exact AI Audit Report table:

```markdown
# AI Audit Log — HW06

| Tool | Timestamp | Prompt | Output |
|---|---|---|---|
| domain-testing / gpt-x | 2026-08-21T10:30:00+07:00 | Deeply analyze all FR-15 parameters with EC/BVA | Proposed API-wide domain tables; not executed; pending review |
```

In the `Tool` cell, use `<skill or tool> / <model>` when the model is known. The `Prompt` and `Output` cells must contain neutral summaries and must not claim an output is final before the user approves it.

## 4. Short input → output example

**Input:** Skill `security-schema-checklist`; model not observable; timestamp `2026-08-21T14:05:00+07:00`; prompt requests FR-15 role-check cases; output contains 8 proposed cases.

**Output:**

| Tool | Timestamp | Prompt | Output |
|---|---|---|---|
| security-schema-checklist / unknown | 2026-08-21T14:05:00+07:00 | Propose security/schema cases for the FR-15 role check | 8 proposed cases; no API calls; pending user review |
