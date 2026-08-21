---
description: Draft Markdown bug reports and GitHub Issue content from real Newman failures
argument-hint: <pool-a|pool-b|pool-c>
---

Read `AGENTS.md` completely, then read `.agents/skills/api-skill/bug-report-drafter/SKILL.md` completely. Validate that `$ARGUMENTS` names the active pool and that Stage 4 is confirmed. Analyze only real Newman failures from that pool and exclude false positives caused by scripts, data, environment, or unspecified oracles.

Obey every rule in `AGENTS.md` section 3: report no out-of-scope GET test; treat classifications, severity, and reports as proposals; do not post or advance without confirmation; and preserve the requirement that every Postman/Newman request receive `X-Student-Id: {StudentID}` through the collection-level pre-request script.

For every probable SUT defect, draft the Markdown report and GitHub Issue content in the skill's required format, including `[USER MUST ATTACH A REAL SCREENSHOT]`. Do not post an issue. If no real defect remains after triage, report that outcome explicitly.

This is Stage 5 (Report Bug). Stop and wait for the exact input `confirm stage 5`. After confirmation, mark Stage 5 DONE and the current pool `DONE` in `.agents/skills/api-skill/state/progress.md`. Do not advance the pool automatically. Remind the user to commit using `test(hw06): complete pool-<a|b|c>` from `AGENTS.md` section 8.

Append exactly one redacted row for this AI invocation to `.agents/skills/api-skill/state/ai-audit-log.md` using the AI Audit Report format.
