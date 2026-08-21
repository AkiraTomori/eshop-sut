---
description: Compile the HW06 AI Audit appendix and draft an evidence-based 200–300 word AI Critique
argument-hint: ""
---

Read `AGENTS.md` completely, then read `.agents/skills/api-skill/api-postmortem-critique/SKILL.md` completely. Verify that Pools A, B, and C are DONE, each Pool-local `ai_audit_report.md` is human-confirmed with no pending row, and real extension, execution, and bug-triage evidence exists. If the evidence cannot support a concrete critique, report the gaps and stop.

Obey every rule in `AGENTS.md` section 3. Never fabricate an interaction, AI mistake, human correction, result, screenshot, or lesson. Compile root `23127379_Homework/HW6/ai_audit_report.md` from the three reviewed Pool reports, preserving audit IDs, decisions, and source paths exactly once; also preserve real cross-pipeline rows. Draft the 200–300 word critique using only attributable evidence. Append exactly one redacted `POST-AI-*` row for this invocation before presenting the proposal, then present every root cross-pipeline row and its current Human Review value.

Stop and wait for the exact input `confirm critique`. That exact confirmation accepts every presented pending `POST-AI-*` row as `CONFIRMED`; apply `REVISED` or `REJECTED` only from explicit row-level human decisions and record notes. Only then may the critique be treated as approved input for final compilation and the AI Audit Report/Critique finalization checkbox be marked in `.agents/skills/api-skill/state/progress.md`. Do not log the logger action recursively, erase prior cross-pipeline rows, or invoke `/finalize` automatically.
