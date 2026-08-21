---
name: api-postmortem-critique
description: "Compile the HW06 AI Audit appendix and draft an evidence-based 200–300 word AI Critique after all three API pools have completed human review and execution."
---

# API Postmortem & Critique

Create only **proposed final appendices** for user review. Run after Pools A, B, and C are DONE and real human-review/execution evidence exists. Never fabricate an AI interaction, human correction, Newman result, screenshot, issue, or lesson learned.

## 1. Expected input

- `23127379_Homework/HW6/2026.HW06.API Testing_En.md`.
- `.agents/skills/api-skill/state/progress.md` showing all three pools DONE.
- The three authoritative Pool reports: `Pool-A_FR03_Password_Reset/ai_audit_report.md`, `Pool-B_FR08_Checkout/ai_audit_report.md`, and `Pool-C_FR15_Update_Product/ai_audit_report.md` under `23127379_Homework/HW6/`.
- Each Pool report showing `Human review status: CONFIRMED`, no `PENDING` row, and attributable Human Review Notes for every revised or rejected interaction.
- Existing real `POST-AI-*` rows in root `23127379_Homework/HW6/ai_audit_report.md`; these are cross-pipeline history and must survive recompilation.
- Confirmed Stage 2 audit tables, including human label corrections and reasons.
- Confirmed Stage 3 additions and every `Why AI missed it: ...` explanation.
- Real Stage 4 Newman/Postman evidence and Stage 5 failure triage or bug reports.
- Optional user notes describing prompt weaknesses, model limitations, useful AI contributions, and lessons learned.

If the evidence cannot support at least one concrete AI error or omission, stop and report the missing evidence. Do not fill the critique with generic claims.

## 2. Step-by-step process

1. Verify that all pools are DONE and read the HW06 assignment sections on AI Audit, AI Critique, anti-cheat evidence, and submission contents.
2. Reconcile each Pool report independently against that Pool's completed skill outputs. Then reconcile all existing `POST-AI-*` records and their Human Review Notes. List missing, duplicate, unverifiable, unreviewed, or overly summarized interactions as gaps; never reconstruct them from memory.
3. Build an evidence matrix containing specific AI mistakes/omissions, the original output, the relevant specification or execution evidence, the human correction, and a defensible cause such as prompt scope, model limitation, or API complexity.
4. Select the strongest two or more evidence-backed examples. Include at least one missed security/state/domain issue when the records support it, plus one useful AI contribution.
5. Draft a 200–300 word critique that answers: what AI got wrong, biased, or incomplete; why it failed; what the human corrected; and what collaboration principle was learned. Count the critique body words and revise until it is within range.
6. Aggregate the three confirmed Pool reports into the root AI Audit appendix, preserving every local audit ID, human decision, and source path exactly once. Preserve existing cross-pipeline rows and append this invocation's `POST-AI-*` row before presenting the proposal. Present every pending cross-pipeline row for human review, mark unresolved gaps, and stop for `confirm critique`. That exact confirmation accepts all presented pending `POST-AI-*` rows as `CONFIRMED` unless the user supplied a row-level `REVISED` or `REJECTED` decision with notes. Do not invoke the final-report compiler automatically.

Record this invocation as one `POST-AI-*` row under the root report's `Cross-pipeline AI interactions`; do not log the logger's own write as another interaction or copy this row into a Pool report.

## 3. Output format

### Evidence matrix

| Evidence ID | Pool/Stage | AI output or omission | Ground-truth evidence | Human correction | Why AI failed | Source path |
|---|---|---|---|---|---|---|

### `23127379_Homework/HW6/ai_audit_report.md`

```markdown
# AI Audit Report — HW06 API Testing

> I use AI tools for the following tasks:

| Audit ID | Pool | Tool/Model | Date and time | Skill/Task | Prompt | Output | Human review decision | Source |
|---|---|---|---|---|---|---|---|---|
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
