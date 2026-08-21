---
description: Generate State Transition Testing cases for the Pool A OTP lifecycle only
argument-hint: pool-a
---

Read `AGENTS.md` completely, then read `.agents/skills/api-skill/state-transition-testing/SKILL.md` completely and apply it to the forgot/reset-password OTP lifecycle using `$ARGUMENTS`. If `$ARGUMENTS` is not exactly `pool-a`, report the scope error and stop; this technique applies only to Pool A.

Obey every rule in `AGENTS.md` section 3: generate no GET test; treat the output as a proposal; do not advance without confirmation; and ensure any future Postman/Newman request receives `X-Student-Id: {StudentID}` through the collection-level pre-request script.

Output the FSM diagram, the complete state table containing every state × event combination including invalid transitions, and the test cases in the skill's required format. This is Stage 1 (Generate). Stop and wait for the exact input `confirm stage 1`. On confirmation, mark State Transition Testing confirmed for Pool A in `.agents/skills/api-skill/state/progress.md`; mark Stage 1 DONE only if every Pool A technique is already confirmed. Do not start another command.

Before presenting the proposal and stopping, append exactly one redacted row to Pool A's `ai_audit_report.md` using `ai-audit-logger` routing, with `Human Review = PENDING`.
