---
description: Deeply analyze every relevant API parameter and generate Domain Testing cases with Equivalence Partitioning and BVA
argument-hint: <pool-a|pool-b|pool-c>
---

Read `AGENTS.md` completely, then read `.agents/skills/api-skill/domain-testing/SKILL.md` completely and apply its exact process to the API unit identified by `$ARGUMENTS`. Reject an invalid pool. Do not require a field name: independently inventory and analyze every relevant path, header/auth, and body parameter for the selected API, including documented dependencies. Use `README.md` and `api_specification.md` for real constraints; do not invent unspecified boundaries, status codes, or schema details.

Use as much analysis time and reasoning depth as needed. Do not optimize for a short answer, stop after obvious fields, or omit difficult parameters. Complete the parameter inventory, EC tables, BVA coverage, representatives, and coverage ledger before presenting the proposal.

Obey every rule in `AGENTS.md` section 3: generate no GET test; treat the output as a proposal; do not advance without confirmation; and ensure any future Postman/Newman request receives `X-Student-Id: {StudentID}` through the collection-level pre-request script.

Output the Parameter Inventory, Equivalence Class table, proposed test-case table, and Coverage Ledger in the skill's required format. This is Stage 1 (Generate). Stop after presenting the complete API-wide proposal and wait for the exact input `confirm stage 1`. On confirmation, mark Domain Testing confirmed for the active pool in `.agents/skills/api-skill/state/progress.md`; mark Stage 1 DONE only if every technique required for that pool is already confirmed. Do not start another command.

Append exactly one redacted row to the active Pool's `ai_audit_report.md` using `ai-audit-logger` routing, with `Human Review = PENDING`.
