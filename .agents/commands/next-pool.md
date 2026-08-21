---
description: Advance only after all five stages and the current Pool AI audit are human-confirmed
argument-hint: ""
---

Read `AGENTS.md` completely and then read `.agents/skills/api-skill/state/progress.md`. This command does not invoke an API-testing skill.

Obey `AGENTS.md` section 3: do not create or execute GET requests; do not create Postman/Newman requests without the `X-Student-Id: {StudentID}` pre-request header; and treat a proposed state transition as pending confirmation rather than advancing automatically.

If the current Pool does not have all five stages plus `Pool AI Audit — human reviewed` marked DONE, report every incomplete item and do not modify the file. Verify that its local `ai_audit_report.md` has no `PENDING` interaction before accepting the audit checkbox. When everything is DONE, propose the next transition in A → B → C order and wait for the exact input `confirm next pool`. Only after that exact confirmation, preserve the completed Pool, set the next Pool to `IN_PROGRESS`, leave its five stage checkboxes and Pool AI Audit checkbox unchecked, update `Current Pool`, and tell the user which Stage 1 commands apply under `AGENTS.md` section 6. Pool C has no successor; report completion without modifying to a nonexistent Pool.

Do not invoke a Stage 1 command automatically.
