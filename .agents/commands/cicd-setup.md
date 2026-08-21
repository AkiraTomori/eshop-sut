---
description: Generate a Newman GitHub Actions workflow and CI/CD report template
argument-hint: ""
---

Read `AGENTS.md` completely, then read `.agents/skills/api-skill/cicd-pipeline-generator/SKILL.md` completely. Verify that Pools A, B, and C are DONE. Use only user-approved collection, environment, and data artifacts. If they are unavailable, emit explicit `INCOMPLETE` placeholders instead of inventing paths or commands.

Obey every rule in `AGENTS.md` section 3: add no GET request or GET health check; treat the workflow and report as proposals; do not enable, push, or run them without confirmation; and require `X-Student-Id: {StudentID}` on every Newman request through the collection-level pre-request script.

Generate the proposed GitHub Actions YAML and report template specified by the skill. The report must describe two sample runs: one all-pass run and one run with exactly one failed case. Clearly identify all sample values as placeholders rather than real execution evidence. Do not trigger the workflow.

Stop after presenting the proposal and any user-supplied real run evidence, then wait for the exact input `confirm ci/cd`. On confirmation, set Finalization to `IN_PROGRESS` if needed and mark the CI/CD finalization checkbox in `.agents/skills/api-skill/state/progress.md`; this command does not advance a pool stage. Append exactly one redacted row for this AI invocation to `.agents/skills/api-skill/state/ai-audit-log.md` using the AI Audit Report format.
