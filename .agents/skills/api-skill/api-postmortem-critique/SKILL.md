---
name: api-postmortem-critique
description: "Compile the HW06 AI Audit appendix and draft an evidence-based 200–300 word AI Critique after all three API pools have completed human review and execution."
---

# API Postmortem & Critique

Create only **proposed final appendices** for user review. Run after Pools A, B, and C are DONE and real human-review/execution evidence exists. Never fabricate an AI interaction, human correction, Newman result, screenshot, issue, or lesson learned.

## 1. Expected input

- `23127379_Homework/HW6/2026.HW06.API Testing_En.md`.
- `.agents/skills/api-skill/state/progress.md` showing all three pools DONE.
- `.agents/skills/api-skill/state/ai-audit-log.md` containing the actual interaction records.
- Confirmed Stage 2 audit tables, including human label corrections and reasons.
- Confirmed Stage 3 additions and every `Why AI missed it: ...` explanation.
- Real Stage 4 Newman/Postman evidence and Stage 5 failure triage or bug reports.
- Optional user notes describing prompt weaknesses, model limitations, useful AI contributions, and lessons learned.

If the evidence cannot support at least one concrete AI error or omission, stop and report the missing evidence. Do not fill the critique with generic claims.

## 2. Step-by-step process

1. Verify that all pools are DONE and read the HW06 assignment sections on AI Audit, AI Critique, anti-cheat evidence, and submission contents.
2. Reconcile the audit log against completed skill outputs. List missing, duplicate, unverifiable, or overly summarized interactions as gaps; never reconstruct them from memory.
3. Build an evidence matrix containing specific AI mistakes/omissions, the original output, the relevant specification or execution evidence, the human correction, and a defensible cause such as prompt scope, model limitation, or API complexity.
4. Select the strongest two or more evidence-backed examples. Include at least one missed security/state/domain issue when the records support it, plus one useful AI contribution.
5. Draft a 200–300 word critique that answers: what AI got wrong, biased, or incomplete; why it failed; what the human corrected; and what collaboration principle was learned. Count the critique body words and revise until it is within range.
6. Compile the AI Audit appendix from real records, mark unresolved gaps, present both outputs as proposals, and stop for `confirm critique`. Do not invoke the final-report compiler automatically.

Record this invocation through `ai-audit-logger`; do not log the logger's own write as another interaction.

## 3. Output format

### Evidence matrix

| Evidence ID | Pool/Stage | AI output or omission | Ground-truth evidence | Human correction | Why AI failed | Source path |
|---|---|---|---|---|---|---|

### `23127379_Homework/HW6/ai_audit_report.md`

```markdown
# AI Audit Report — HW06 API Testing

> I use AI tools for the following tasks:

| # | Tool/Model | Date and time | Skill/Task | Prompt | Output | Human review status |
|---|---|---|---|---|---|---|
```

### `23127379_Homework/HW6/ai_critique.md`

```markdown
# AI Critique — HW06 API Testing

<200–300 word evidence-based critique body>

**Word count:** <verified body count>
```

End with: `Status: PROPOSED CRITIQUE — evidence and wording require user confirmation.`

## 4. Short input → output example

**Input:** Pool A audit shows that AI initially treated OTP reuse as valid; Stage 3 added the missed one-time-use case; README SEC-07 requires invalidation after use.

**Condensed output:**

| Evidence ID | Pool/Stage | AI output or omission | Ground-truth evidence | Human correction | Why AI failed | Source path |
|---|---|---|---|---|---|---|
| CRIT-001 | Pool A / Stages 2–3 | OTP reuse case omitted | SEC-07 requires one-time use | Added invalid transition from OTPUsed | Prompt emphasized field partitions over lifecycle state | `<confirmed Pool A artifacts>` |

The critique may use this row only after the user confirms that the cited artifacts and correction are real.

