---
description: Generate applicable SEC-01 through SEC-07 and schema-validation cases for one API
argument-hint: <pool-a|pool-b|pool-c>
---

Read `AGENTS.md` completely, then read `.agents/skills/api-skill/security-schema-checklist/SKILL.md` completely and apply it to the API selected by `$ARGUMENTS`. Reject arguments outside `pool-a`, `pool-b`, and `pool-c`. Generate cases only for SEC requirements that genuinely apply to the selected API, using `README.md` section 9 and `api_specification.md` as the oracle.

Obey every rule in `AGENTS.md` section 3: generate no GET test; treat the output as a proposal; do not advance without confirmation; and ensure any future Postman/Newman request receives `X-Student-Id: {StudentID}` through the collection-level pre-request script.

Output the applicability matrix, proposed checklist cases, and schema contract in the skill's required format. This is Stage 1 (Generate). Stop and wait for the exact input `confirm stage 1`. On confirmation, mark Security/Schema Checklist confirmed for the active pool in `.agents/skills/api-skill/state/progress.md`; mark Stage 1 DONE only if every technique required for that pool is already confirmed. Do not start another command.

Append exactly one redacted row to the active Pool's `ai_audit_report.md` using `ai-audit-logger` routing, with `Human Review = PENDING`.
