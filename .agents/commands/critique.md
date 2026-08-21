---
description: Compile the HW06 AI Audit appendix and draft an evidence-based 200–300 word AI Critique
argument-hint: ""
---

Read `AGENTS.md` completely, then read `.agents/skills/api-skill/api-postmortem-critique/SKILL.md` completely. Verify that Pools A, B, and C are DONE and that real audit, human-review, extension, execution, and bug-triage evidence exists. If the evidence cannot support a concrete critique, report the gaps and stop.

Obey every rule in `AGENTS.md` section 3. Never fabricate an interaction, AI mistake, human correction, result, screenshot, or lesson. Compile the audit appendix and draft the 200–300 word critique using only attributable evidence. Treat both as proposals.

Stop and wait for the exact input `confirm critique`. Only after confirmation may the critique be treated as approved input for final compilation; mark the AI Audit Report/Critique finalization checkbox in `.agents/skills/api-skill/state/progress.md`. Do not invoke `/finalize` automatically.

Append exactly one redacted row for this AI invocation to `.agents/skills/api-skill/state/ai-audit-log.md`; do not log the logger action recursively.
