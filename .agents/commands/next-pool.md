---
description: Advance to the next pool only after all five stages in the current pool are DONE
argument-hint: ""
---

Read `AGENTS.md` completely and then read `.agents/skills/api-skill/state/progress.md`. This command does not invoke an API-testing skill.

Obey `AGENTS.md` section 3: do not create or execute GET requests; do not create Postman/Newman requests without the `X-Student-Id: {StudentID}` pre-request header; and treat a proposed state transition as pending confirmation rather than advancing automatically.

If the current pool does not have all five stages marked DONE, report an error, list every incomplete stage, and do not modify the file. If all five stages are DONE, propose the next transition in A → B → C order and wait for explicit user confirmation. After confirmation, preserve the completed pool, set the next pool to `IN_PROGRESS`, leave its five stage checkboxes unchecked, update `Current Pool`, and tell the user which Stage 1 commands apply under `AGENTS.md` section 6. Pool C has no successor; report completion without modifying to a nonexistent pool.

Do not invoke a Stage 1 command automatically.
