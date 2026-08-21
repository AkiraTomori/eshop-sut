---
description: Propose at least five test cases missed during Stage 1 and explain each omission
argument-hint: <pool-a|pool-b|pool-c>
---

Read `AGENTS.md` completely and validate that `$ARGUMENTS` names the active pool with confirmed Stages 1 and 2. Read the complete applicable Stage 1 skill files: `domain-testing`, `security-schema-checklist`, plus `state-transition-testing` for Pool A or `decision-table-testing` for Pool B. Pool C uses only Domain Testing and Security/Schema Checklist.

Run the applicable skills in gap-analysis mode against the user-confirmed Stage 2 audit table. Propose only genuinely absent cases, prioritize security and state-transition gaps as required by section 6.3, and provide at least five new cases. Every new case must include a line beginning `Why AI missed it: `.

Obey every rule in `AGENTS.md` section 3: generate no GET test; treat every new case as a proposal; do not advance without confirmation; and preserve the requirement that any future Postman/Newman request receive `X-Student-Id: {StudentID}` through the collection-level pre-request script.

This is Stage 3 (Extend). Stop and wait for the exact input `confirm stage 3`. Only after confirmation, mark Stage 3 DONE in `.agents/skills/api-skill/state/progress.md`. Do not start Stage 4 automatically.

Before presenting the proposal and stopping, append one redacted row per invoked skill to the active Pool's `ai_audit_report.md` using `ai-audit-logger` routing, with `Human Review = PENDING` on each row.
