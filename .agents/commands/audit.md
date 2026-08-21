---
description: Propose VALID, INVALID, or INCOMPLETE labels for the generated test-case table
argument-hint: <pool-a|pool-b|pool-c>
---

Read `AGENTS.md` completely, then read `.agents/skills/api-skill/test-case-audit-assistant/SKILL.md` completely. Validate that `$ARGUMENTS` names the active pool and that Stage 1 is confirmed. Load only that pool's confirmed Stage 1 test-case table.

Obey every rule in `AGENTS.md` section 3: audit no GET test as valid; treat every label as a proposal; do not advance without confirmation; and preserve the requirement that any future Postman/Newman request receive `X-Student-Id: {StudentID}` through the collection-level pre-request script.

Add the `Proposed label` and `Reason` columns in the skill's required format. Do not edit source cases or decide labels on the user's behalf. This is Stage 2 (Audit). Stop for the user to revise the table and wait for the exact input `confirm stage 2`. Only after that confirmation, mark Stage 2 DONE in `.agents/skills/api-skill/state/progress.md`. Do not start Stage 3 automatically.

Append exactly one redacted row to the active Pool's `ai_audit_report.md` using `ai-audit-logger` routing, with `Human Review = PENDING`.
