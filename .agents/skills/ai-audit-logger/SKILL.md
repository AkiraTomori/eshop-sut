---
name: ai-audit-logger
description: "Append exactly one HW04 AI Audit session block after a completed top-level workflow-skill invocation. Use after playwright-setup, automation-script-gen, script-review, the per-FR playwright-ci evidence gate, or bug-report-automation; record nested Playwright skills in the same block and do not audit the logger action itself."
---

# Log one HW04 AI interaction

Follow `AGENTS.md` and never fabricate HITL review.

## Choose the destination

- Infrastructure work: `23127379_Homework/HW4/Infrastructure-AI-Audit.md`
- FR-06 work: `23127379_Homework/HW4/Pool-A_FR06/FR06-AI-Audit.md`
- FR-08 work: `23127379_Homework/HW4/Pool-B_FR08/FR08-AI-Audit.md`
- FR-15 work: `23127379_Homework/HW4/Pool-C_FR15/FR15-AI-Audit.md`

Create one block for one completed invocation. If a skill invocation is unfinished, do not log it as completed. Do not create a second audit for this logging action.

## Append the block

```markdown
---
## Session: YYYY-MM-DD HH:MM — [Skill name: task]

- **AI Tool:** [exact tool/model if known]
- **Bloom-AI Level:** [G9.2 Apply / G9.3 Analyse / G9.4 Collaborate]
- **Task:** [completed skill invocation and scope]
- **Prompt:**
  > [exact user prompt; preserve wording]
- **Supporting Playwright Skills:** [skill names and guides materially used, or None]
- **AI Output Summary:** [files/actions/results, concise and factual]
- **Human Review Notes:** Pending HITL review
- **What AI Got Wrong:** Pending HITL review
- **Verdict:** Pending HITL review
```

Append; never overwrite existing blocks. Do not claim Accepted, Partially Accepted, or Rejected until the human reviewer supplies that verdict.

## Validate

- Verify timestamp in `Asia/Ho_Chi_Minh`.
- Verify the prompt is verbatim.
- Verify every claimed supporting Playwright skill/guide was actually read and materially applied.
- Verify the output summary names only work that actually completed.
- Verify the file matches the current infrastructure/FR scope.
- Report the appended file to HITL for sign-off.
