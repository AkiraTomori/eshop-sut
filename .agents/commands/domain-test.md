---
description: Generate Domain Testing cases (Equivalence Partitioning + BVA) for one field
argument-hint: <pool-a|pool-b|pool-c> <field-name>
---

Read `AGENTS.md` completely, then read `.agents/skills/api-skill/domain-testing/SKILL.md` completely and apply its exact process to the field and API identified by `$ARGUMENTS`. Reject an invalid pool or missing field name. Use `README.md` and `api_specification.md` for the field's real constraints; do not invent unspecified boundaries, status codes, or schema details.

Obey every rule in `AGENTS.md` section 3: generate no GET test; treat the output as a proposal; do not advance without confirmation; and ensure any future Postman/Newman request receives `X-Student-Id: {StudentID}` through the collection-level pre-request script.

Output the Equivalence Class and test-case tables in the skill's required format. This is Stage 1 (Generate). Stop after presenting the proposal and wait for the exact input `confirm stage 1`. On confirmation, mark Domain Testing confirmed for the active pool in `.agents/skills/api-skill/state/progress.md`; mark Stage 1 DONE only if every technique required for that pool is already confirmed. Do not start another command.

Append exactly one redacted row for this AI invocation to `.agents/skills/api-skill/state/ai-audit-log.md` using the AI Audit Report format.
