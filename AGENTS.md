<!-- HW6 -->

# HW06 API Testing Agent Orchestration

## 1. Purpose and Authority

This file is the single source of truth for AI orchestration in CSC13003 HW06 API Testing. Tool-neutral command templates live in `.agents/commands/`, and both commands and skills must follow this file. `23127379_Homework/HW6/2026.HW06.API Testing_En.md` is the authoritative assignment, `README.md` is the source for SRS/business rules, and `api_specification.md` is the source for endpoint contracts. When an expected status, field, or behavior is absent from those specifications, mark it as unspecified and request user confirmation instead of inventing it.

The ready-to-fill working and submission templates live under `23127379_Homework/HW6/`. They are placeholders until confirmed stages and real evidence populate them.

## 2. Selected API Pools

| Pool | Requirement | Allowed endpoint(s) | Applicable Stage 1 techniques |
|---|---|---|---|
| Pool A | FR-03 password recovery workflow | `POST /api/forgot-password`, `POST /api/reset-password` | Domain Testing, State Transition Testing, Security/Schema Checklist |
| Pool B | FR-08 checkout | `POST /api/checkout` | Domain Testing, Decision Table Testing, Security/Schema Checklist |
| Pool C | FR-15 update product | `PUT /api/products/:id` | Domain Testing, Security/Schema Checklist |

Pool A is one selected API unit implemented as a two-step workflow. No GET endpoint belongs to the HW06 test scope.

## 3. Mandatory Rules

1. **Scope:** Work only on Pool A, Pool B, and Pool C endpoints listed in section 2. Do not silently expand the assignment.
2. **No GET tests:** Never design, add, or execute a GET request as an HW06 test or health check. A local readiness check must use TCP port 3000 rather than HTTP GET.
3. **Coverage:** Produce at least 35 reviewed test cases for each API unit. Domain Testing must inventory and partition every relevant API parameter. Use the taught techniques in separate steps; never generate an entire API suite with one undifferentiated prompt.
4. **Specification grounding:** Derive assignment obligations from the HW06 assignment, business constraints from `README.md`, and endpoint contracts from `api_specification.md`. Preserve FR/SEC/API traceability and label unspecified contracts explicitly.
5. **Human confirmation gate:** Every generated output is a proposal. For Stages 1–5, stop and wait for the exact confirmation `confirm stage N`. Post-pipeline outputs require `confirm ci/cd`, `confirm critique`, and `confirm finalization`. Never mark work complete, alter user labels, advance the pipeline, change pools, post an issue, commit, or trigger the next command before the applicable confirmation.
6. **Student header:** Every Postman/Newman request must receive `X-Student-Id: {StudentID}` through a collection-level pre-request script using the `StudentID` environment variable. Never hard-code the real student ID in command templates or commit secrets/tokens.
7. **AI audit:** Each AI skill invocation must append one redacted row to `.agents/skills/api-skill/state/ai-audit-log.md` with Tool, Timestamp, Prompt, and Output. Do not log the logger's own operation.
8. **Sequential workflow:** Complete Pools A → B → C. Within a pool, complete Stages 1 → 2 → 3 → 4 → 5. `/next-pool` is the only command allowed to advance the active pool. After Pool C, complete CI/CD evidence → critique/audit compilation → final report compilation.
9. **Depth over speed:** Domain analysis has no artificial time or response-length target. The agent may reason for as long as needed and must not finish until the API-wide parameter inventory, partitions, boundaries, representatives, and coverage ledger are complete.

## 4. Bootstrap

Before using any HW06 command template from `.agents/commands/`:

1. Read this entire `AGENTS.md` file.
2. Verify that all eleven required files exist:
   - `.agents/skills/api-skill/domain-testing/SKILL.md`
   - `.agents/skills/api-skill/decision-table-testing/SKILL.md`
   - `.agents/skills/api-skill/state-transition-testing/SKILL.md`
   - `.agents/skills/api-skill/security-schema-checklist/SKILL.md`
   - `.agents/skills/api-skill/test-case-audit-assistant/SKILL.md`
   - `.agents/skills/api-skill/ai-audit-logger/SKILL.md`
   - `.agents/skills/api-skill/postman-collection-builder/SKILL.md`
   - `.agents/skills/api-skill/bug-report-drafter/SKILL.md`
   - `.agents/skills/api-skill/cicd-pipeline-generator/SKILL.md`
   - `.agents/skills/api-skill/api-postmortem-critique/SKILL.md`
   - `.agents/skills/api-skill/api-final-report-compiler/SKILL.md`
3. If any required skill is missing, stop and report the missing path. Do not recreate or infer its content.
4. Ensure the state directory and the two files from section 7 exist. Initialize only missing state files; never replace existing progress or audit history.
5. Read `progress.md`, identify the active pool and next incomplete stage, and reject commands that target another pool or violate stage order.
6. Read each referenced `SKILL.md` completely before applying it.

## 5. Command Template ↔ Skill Mapping

The `/command-name` notation below is a logical workflow identifier. It does not require a Claude-specific folder or runtime; an agent/tool adapter may expose the templates through its own invocation mechanism.

| Command template | Skill or state source | Pool/stage restriction |
|---|---|---|
| `/domain-test` | `domain-testing` | Stage 1; Pools A/B/C |
| `/decision-table` | `decision-table-testing` | Stage 1; Pool B only |
| `/state-transition` | `state-transition-testing` | Stage 1; Pool A only |
| `/security-check` | `security-schema-checklist` | Stage 1; Pools A/B/C |
| `/audit` | `test-case-audit-assistant` | Stage 2; confirmed Stage 1 required |
| `/extend` | Applicable Stage 1 skills in gap-analysis mode | Stage 3; confirmed Stage 2 required |
| `/build-postman` | `postman-collection-builder` | Stage 4; confirmed Stages 1–3 required |
| `/bug-report` | `bug-report-drafter` | Stage 5; confirmed Stage 4 required |
| `/cicd-setup` | `cicd-pipeline-generator` | Post-pipeline after all pools and approved collection artifacts |
| `/next-pool` | `state/progress.md` | Current pool must have all five stages DONE |
| `/status` | `state/progress.md` | Read-only |
| `/audit-log` | `state/ai-audit-log.md` | Read-only |
| `/critique` | `api-postmortem-critique` | After Pools A/B/C are DONE and evidence exists |
| `/finalize` | `api-final-report-compiler` | Last; confirmed critique and CI/CD evidence required |

The Stage 4 instruction in this section explicitly permits `/build-postman` to run Newman only against `localhost` or `127.0.0.1` when local execution permission and prerequisites are available. Otherwise it must provide manual instructions. This narrow authorization does not permit remote API calls.

## 6. End-to-End Workflow and Stage Requirements

### 6.1 How to use the tool-neutral command templates

The files in `.agents/commands/` are reusable prompt templates, not executable shell scripts and not commands tied to a specific AI product. To use one:

1. Select the template matching the current pool and stage from section 5.
2. Give the template to the active agent through the tool's prompt, command, or adapter mechanism.
3. Replace `$ARGUMENTS` with the requested values. For example, the logical invocation `/domain-test pool-a` means using `.agents/commands/domain-test.md` with `$ARGUMENTS` set to `pool-a`; the Domain skill discovers the necessary parameters itself.
4. The agent performs the Bootstrap checks in section 4, reads the referenced skill completely, and verifies that the command is valid for the active pool and stage.
5. The agent produces only the current stage's proposal, appends the required AI audit row, and stops.
6. The user reviews the proposal. If changes are needed, request revisions while remaining in the same stage. If it is acceptable, enter the exact confirmation required by that stage.
7. Confirmation updates only the relevant progress checkbox or status. It never triggers the next template automatically.

If an approved artifact from a previous stage is not present in the active context, the agent must ask the user for its exact file/path or content. It must not reconstruct an allegedly approved artifact from memory.

### 6.2 Workflow at a glance

```mermaid
flowchart TD
    A[Bootstrap and /status] --> B[Stage 1: run every technique required by the active pool]
    B --> C{All Stage 1 outputs confirmed?}
    C -- No: revise or run missing technique --> B
    C -- Yes --> D[Stage 2: /audit active pool]
    D --> E{confirm stage 2?}
    E -- No: user edits/reviews --> D
    E -- Yes --> F[Stage 3: /extend active pool]
    F --> G{confirm stage 3?}
    G -- No: review missing cases --> F
    G -- Yes --> H[Stage 4: /build-postman active pool]
    H --> I{confirm stage 4 with artifacts/evidence?}
    I -- No: fix artifacts or supply manual-run evidence --> H
    I -- Yes --> J[Stage 5: /bug-report active pool]
    J --> K{confirm stage 5?}
    K -- No: review triage/reports --> J
    K -- Yes --> L[Mark pool DONE]
    L --> M{Pool C complete?}
    M -- No --> N["/next-pool after confirmation"]
    N --> A
    M -- Yes --> O[/cicd-setup plus two real pipeline runs]
    O --> P{confirm ci/cd?}
    P -- No: fix workflow or evidence --> O
    P -- Yes --> Q[/critique]
    Q --> R{confirm critique?}
    R -- No: correct evidence or wording --> Q
    R -- Yes --> S[/finalize]
    S --> T{confirm finalization?}
    T -- No: resolve submission gaps --> S
    T -- Yes --> U[Submission package ready for human-owned final actions]
    
```

### 6.3 Practical operating sequence

1. **Start or resume:** use `/status` to print `progress.md`. Optionally use `/audit-log` to inspect prior AI activity. Identify the one `IN_PROGRESS` pool and its first incomplete stage.
2. **Generate Stage 1 cases:** run every technique required for that pool, one template at a time. `/domain-test <active-pool>` performs one deep pass over every necessary API parameter and may take as much analysis time as needed. Do not mark Stage 1 DONE until all applicable technique outputs have been reviewed and confirmed.
3. **Review each proposal:** check requirement sources, coverage, negative cases, expected results, and absence of GET requests. Request corrections without confirmation when needed. The command remains in Stage 1.
4. **Confirm Stage 1:** enter `confirm stage 1` only after accepting the relevant proposal. Mark the technique sub-checkbox. When every applicable technique sub-checkbox is checked, mark Stage 1 DONE. Do not invoke `/audit` automatically.
5. **Audit Stage 2:** invoke `/audit <active-pool>` using only confirmed Stage 1 cases. The agent proposes `VALID`, `INVALID`, or `INCOMPLETE`; the user makes final label changes. Enter `confirm stage 2` only after the audit table is accepted.
6. **Extend Stage 3:** invoke `/extend <active-pool>` against the confirmed audit table. Review at least five genuinely missing cases and every `Why AI missed it: ...` explanation. Prioritize security gaps for every pool and state-transition gaps for Pool A. Enter `confirm stage 3` only after accepting the extensions.
7. **Build/execute Stage 4:** invoke `/build-postman <active-pool>`. Review the collection, environment, data file, folder structure, test scripts, and collection-level `X-Student-Id` pre-request script. If local Newman execution is unavailable, the user runs the provided manual command and returns the real report. Enter `confirm stage 4` only after artifacts and available execution evidence are accepted.
8. **Triage/report Stage 5:** invoke `/bug-report <active-pool>` with real Newman failures. Separate SUT defects from false positives and require real evidence. Review every draft and attach screenshots manually. If no SUT defect exists, preserve that explicit result. Enter `confirm stage 5` to mark the stage and pool DONE.
9. **Advance:** invoke `/next-pool`. It must refuse to advance unless all five current-pool stages are DONE. After the user confirms the proposed transition, begin the next pool at Stage 1. After Pool C, report that all pools are complete instead of creating another pool.
10. **Prepare and evidence CI/CD:** after all approved collection artifacts are available, invoke `/cicd-setup`. Review the proposed workflow, then the user creates the required two sample commits/runs: one all passing and one with exactly one failed case. Supply real run URLs and screenshots, then enter `confirm ci/cd`. The agent must not push commits or trigger the workflow automatically.
11. **Compile audit and critique:** invoke `/critique` only after every pool and CI/CD evidence are complete. Review the interaction reconciliation, evidence matrix, AI Audit Report, and 200–300 word critique. Enter `confirm critique` only when every cited mistake and correction is real.
12. **Finalize the submission:** invoke `/finalize` last. Resolve every completeness-matrix gap, especially the Excel cases, Postman feature list, PDFs, screenshots, Git history, issue links, and student-drawn generator diagram. Enter `confirm finalization` only after the compiled package is accurate. The user remains responsible for ZIP creation and Moodle submission.

### 6.4 Pool-specific command order

| Pool | Stage 1 command order | Common continuation |
|---|---|---|
| Pool A | `/domain-test pool-a` → `/state-transition pool-a` → `/security-check pool-a` | `/audit pool-a` → `/extend pool-a` → `/build-postman pool-a` → `/bug-report pool-a` → `/next-pool` |
| Pool B | `/domain-test pool-b` → `/decision-table pool-b` → `/security-check pool-b` | `/audit pool-b` → `/extend pool-b` → `/build-postman pool-b` → `/bug-report pool-b` → `/next-pool` |
| Pool C | `/domain-test pool-c` → `/security-check pool-c` | `/audit pool-c` → `/extend pool-c` → `/build-postman pool-c` → `/bug-report pool-c`; no successor pool |

The Stage 1 command order is recommended for clarity. A pool's applicable Stage 1 techniques may be run in another order, but all must be confirmed before Stage 2.

### 6.5 Stage completion and evidence criteria

#### Stage 1 — Generate

Complete all techniques applicable to the active pool:

- Pool A: `/domain-test`, `/state-transition`, `/security-check`.
- Pool B: `/domain-test`, `/decision-table`, `/security-check`.
- Pool C: `/domain-test`, `/security-check`.

Each command stops with a proposal. After the user confirms each applicable output, record that technique in `progress.md`. Mark Stage 1 DONE only when all applicable techniques are confirmed.

#### Stage 2 — Audit

Audit only confirmed Stage 1 cases. Labels are proposals; the user owns all edits. Mark Stage 2 DONE only after `confirm stage 2`.

#### Stage 3 — Extend

Compare the confirmed Stage 2 table against all applicable techniques and propose at least five genuinely missing cases. Prioritize security and state-transition gaps. Every proposed case must contain `Why AI missed it: ...`. Mark Stage 3 DONE only after `confirm stage 3`.

#### Stage 4 — Execute

Build the approved Postman collection, environment, and data file, applying the mandatory student header. Run Newman only under the local authorization in section 5; otherwise provide manual commands. Mark Stage 4 DONE only after `confirm stage 4`.

#### Stage 5 — Report Bug

Draft reports only for real failures after false-positive triage. Never post GitHub Issues automatically; include a placeholder for a user-supplied real screenshot. If there are no confirmed SUT defects, record that outcome. After `confirm stage 5`, mark Stage 5 and the current pool DONE and remind the user of section 8.

#### CI/CD evidence

The proposed report template must describe two sample runs: one in which all cases pass, and one in which exactly one case fails. Placeholders are not execution evidence and must be replaced by real run URLs, artifacts, and screenshots after execution.

#### Post-pipeline critique and finalization

- `/critique` requires all pool outputs, human corrections, extension explanations, execution evidence, and the AI audit log. The 200–300 word critique must cite real failures/omissions and remain a proposal until `confirm critique`.
- `/finalize` requires the confirmed critique, CI/CD evidence, at least 35 final cases per API, Excel-compatible test cases, Postman/Newman artifacts, the Postman feature list, bug evidence, Git history, and the student-owned generator diagram. Missing evidence must remain visibly incomplete until `confirm finalization`.

## 7. State Files and Initial Progress Template

Default AI audit file:

```markdown
# AI Audit Log — HW06

| Tool | Timestamp | Prompt | Output |
|---|---|---|---|
```

Initial progress file:

```markdown
# HW06 API Testing Progress

Current Pool: Pool A

## Pool A — IN_PROGRESS

- [ ] Stage 1 — Generate
  - [ ] Domain Testing
  - [ ] State Transition Testing
  - [ ] Security/Schema Checklist
- [ ] Stage 2 — Audit
- [ ] Stage 3 — Extend
- [ ] Stage 4 — Execute
- [ ] Stage 5 — Report Bug

## Pool B — NOT_STARTED

- [ ] Stage 1 — Generate
  - [ ] Domain Testing
  - [ ] Decision Table Testing
  - [ ] Security/Schema Checklist
- [ ] Stage 2 — Audit
- [ ] Stage 3 — Extend
- [ ] Stage 4 — Execute
- [ ] Stage 5 — Report Bug

## Pool C — NOT_STARTED

- [ ] Stage 1 — Generate
  - [ ] Domain Testing
  - [ ] Security/Schema Checklist
- [ ] Stage 2 — Audit
- [ ] Stage 3 — Extend
- [ ] Stage 4 — Execute
- [ ] Stage 5 — Report Bug

## Finalization — NOT_STARTED

- [ ] CI/CD workflow and two real run records confirmed
- [ ] AI Audit Report and 200–300 word AI Critique confirmed
- [ ] Test-generator pseudocode and student-drawn diagram evidence present
- [ ] Final README, main report, summaries, and checklist confirmed
```

Use `DONE`, `IN_PROGRESS`, and `NOT_STARTED` for pool and Finalization status. Preserve completed pools and audit history. When advancing A → B or B → C, set the next pool to `IN_PROGRESS` with all five stages unchecked. Pool C has no successor. Set Finalization to `IN_PROGRESS` when post-pipeline work begins and to `DONE` only after all four finalization checkboxes are confirmed.

## 8. Git Commit Convention

Never commit automatically. After the user confirms a stage, suggest:

```text
test(hw06): complete pool-<a|b|c> stage-<1|2|3|4|5>
```

After Stage 5 confirmation and pool completion, suggest:

```text
test(hw06): complete pool-<a|b|c>
```

For post-pipeline work, suggest only after the corresponding user confirmation:

```text
ci(hw06): add Newman pipeline and run evidence
docs(hw06): add AI audit report and critique
docs(hw06): compile final submission package
```

For this one-time orchestration scaffold, the suggested commit is:

```text
chore(hw06): scaffold API testing commands and state
```
