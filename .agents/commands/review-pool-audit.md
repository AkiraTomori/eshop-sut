---
description: Human-review the active Pool's local AI audit before completing the Pool
argument-hint: "<pool-a|pool-b|pool-c>"
---

Read `AGENTS.md` completely and validate that `$ARGUMENTS` identifies the active Pool whose Stages 1–5 are all DONE. Read that Pool's `ai_audit_report.md` verbatim. This governance command does not invoke an API-testing skill and must not append an audit row for reading or confirming the audit itself.

Present every local interaction and its current `Human Review` value. The human owns all decisions. Apply `REVISED` or `REJECTED` only with the user's explicit row-level decision and append the supplied correction/reason to Human Review Notes; never rewrite the original Prompt or Output cells.

Stop and wait for the exact input `confirm pool audit`. That exact confirmation accepts every still-`PENDING` row as `CONFIRMED`. Set the file-level Human review status to `CONFIRMED` with the actual timestamp, record the confirmation, mark `Pool AI Audit — human reviewed` in `.agents/skills/api-skill/state/progress.md`, and set the Pool to `DONE`. Do not invoke `/next-pool`, commit, or start another stage automatically.

Refuse confirmation if Stages 1–5 are not DONE, an audit row is malformed/unattributable, or any `REVISED`/`REJECTED` row lacks a Human Review Notes entry.
