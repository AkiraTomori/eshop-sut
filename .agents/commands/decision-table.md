---
description: Generate Decision Table Testing cases for Pool B checkout only
argument-hint: pool-b
---

Read `AGENTS.md` completely, then read `.agents/skills/api-skill/decision-table-testing/SKILL.md` completely and apply it to checkout using `$ARGUMENTS`. If `$ARGUMENTS` is not exactly `pool-b`, report the scope error and stop; this technique applies only to Pool B.

Obey every rule in `AGENTS.md` section 3: generate no GET test; treat the output as a proposal; do not advance without confirmation; and ensure any future Postman/Newman request receives `X-Student-Id: {StudentID}` through the collection-level pre-request script.

Output the full `2^n` table, reduced table, and derived test cases in the skill's required order and format. This is Stage 1 (Generate). Stop and wait for the exact input `confirm stage 1`. On confirmation, mark Decision Table Testing confirmed for Pool B in `.agents/skills/api-skill/state/progress.md`; mark Stage 1 DONE only if every Pool B technique is already confirmed. Do not start another command.

Append exactly one redacted row for this AI invocation to `.agents/skills/api-skill/state/ai-audit-log.md` using the AI Audit Report format.
