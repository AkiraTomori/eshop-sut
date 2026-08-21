---
description: Build Postman collection, environment, and runner data from the audited and extended cases
argument-hint: <pool-a|pool-b|pool-c>
---

Read `AGENTS.md` completely, then read `.agents/skills/api-skill/postman-collection-builder/SKILL.md` completely. Validate that `$ARGUMENTS` names the active pool and that Stages 1, 2, and 3 are confirmed. Use only that pool's final, user-approved Stage 1+2+3 test-case table.

Obey every rule in `AGENTS.md` section 3: add no GET request; treat all generated artifacts and execution interpretation as proposals; do not advance without confirmation; and apply `X-Student-Id: {StudentID}` to every request through a collection-level pre-request script using the `StudentID` environment variable.

Build the `.postman_collection.json`, `.postman_environment.json`, and JSON/CSV data file for Collection Runner. Under the narrow Stage 4 authorization in `AGENTS.md` section 5, run Newman and produce an HTML report only when the target is `localhost` or `127.0.0.1`, local execution permission exists, and prerequisites are available. Otherwise provide exact manual commands and do not call the API. Never target a remote host.

This is Stage 4 (Execute). Present artifacts and any real local result, then stop and wait for the exact input `confirm stage 4`. Only after confirmation, mark Stage 4 DONE in `.agents/skills/api-skill/state/progress.md`. Do not start Stage 5 automatically.

Before presenting the artifacts/results and stopping, append exactly one redacted row to the active Pool's `ai_audit_report.md` using `ai-audit-logger` routing, with `Human Review = PENDING`.
