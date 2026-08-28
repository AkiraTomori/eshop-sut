# HW06 AI-Driven API Test Generator Design

## Authorship constraint

The assignment requires the architecture diagram to be **self-drawn by the student**. AI must not generate the final diagram. Insert only the real student-created file/link below.

- Student-drawn diagram: `[USER ACTION REQUIRED: add PNG/drawing-tool export path]`
- Authorship evidence: `[USER ACTION REQUIRED: add screenshot/video evidence if available]`

## Reference architecture — use this to understand, then redraw it yourself

> **Reference only:** The Mermaid diagram below explains the architecture implemented in this homework. It is not the student-drawn submission artifact. Redraw the design in your own layout and notation, then replace the placeholder above with your real image path and authorship evidence.

```mermaid
flowchart TB
    subgraph INPUTS["1. Authoritative inputs"]
        ASSIGN["HW06 assignment<br/>deliverables and scope"]
        SRS["README / SRS<br/>FR and SEC business rules"]
        SPEC["api_specification.md<br/>endpoint contracts"]
        SELECT["Selected API unit<br/>Pool A, B, or C"]
        STATE["progress.md<br/>active Pool and Stage"]
    end

    ORCH["Orchestrator — AGENTS.md<br/>enforce A → B → C, Stage 1 → 5,<br/>POST/PUT scope, no GET tests"]

    ASSIGN --> ORCH
    SRS --> ORCH
    SPEC --> ORCH
    SELECT --> ORCH
    STATE --> ORCH

    subgraph GENERATOR["2. AI-driven API test generator"]
        CONTRACT["Contract resolver<br/>parameters, roles, schemas,<br/>documented oracles"]
        COMPLETE{"Is the expected<br/>contract specified?"}
        CLARIFY["Mark as unspecified<br/>and request human decision"]

        DOMAIN["Domain analyzer — all Pools<br/>parameter inventory + EC/BVA<br/>partitions, boundaries, representatives"]
        ROUTER{"Which Pool?"}
        FSM["Pool A behavior analyzer<br/>FR-03 state-transition model"]
        DECISION["Pool B behavior analyzer<br/>FR-08 full/reduced decision table"]
        DIRECT["Pool C<br/>no extra behavior technique"]
        SECURITY["Security/schema analyzer — all Pools<br/>SEC applicability + auth/role/state/schema cases"]

        MERGE["Merge + deduplicate<br/>preserve Case ID and FR/SEC/API traceability"]
        STAGE1["Stage 1 proposal<br/>technique-separated test cases"]
        GATE1{"Human review<br/>confirm Stage 1?"}

        AUDIT["Stage 2 audit<br/>VALID / INVALID / INCOMPLETE<br/>without deleting source history"]
        GATE2{"Human review<br/>confirm Stage 2?"}

        GAP["Stage 3 gap analysis<br/>add at least 5 genuine missing cases<br/>with Why AI missed it"]
        GATE3{"Human review<br/>confirm Stage 3?"}

        FINAL["Final reviewed test suite<br/>at least 35 cases per API unit"]

        CONTRACT --> COMPLETE
        COMPLETE -- "No" --> CLARIFY --> CONTRACT
        COMPLETE -- "Yes" --> DOMAIN
        COMPLETE -- "Yes" --> ROUTER
        COMPLETE -- "Yes" --> SECURITY

        ROUTER -- "Pool A / FR-03" --> FSM
        ROUTER -- "Pool B / FR-08" --> DECISION
        ROUTER -- "Pool C / FR-15" --> DIRECT

        DOMAIN --> MERGE
        FSM --> MERGE
        DECISION --> MERGE
        DIRECT --> MERGE
        SECURITY --> MERGE

        MERGE --> STAGE1 --> GATE1
        GATE1 -- "Revise" --> MERGE
        GATE1 -- "Confirm" --> AUDIT --> GATE2
        GATE2 -- "Revise" --> AUDIT
        GATE2 -- "Confirm" --> GAP --> GATE3
        GATE3 -- "Revise" --> GAP
        GATE3 -- "Confirm" --> FINAL
    end

    ORCH --> CONTRACT

    subgraph CONSUMERS["3. Approved-suite consumers and evidence pipeline"]
        POSTMAN["Stage 4 Postman builder<br/>collection + environment + runner data"]
        HEADER["Collection pre-request script<br/>X-Student-Id from StudentID"]
        GATE4{"Human review<br/>confirm Stage 4?"}
        RUN["Local Newman execution<br/>allowed POST/PUT requests only"]
        DB["Restricted SQLite observation<br/>before / per-case / cleanup state"]
        TRIAGE["Stage 5 failure triage<br/>SUT defect vs runner/data/environment<br/>vs known issue / insufficient evidence"]
        BUGS["Bug outputs<br/>Markdown report + GitHub Issue URL<br/>+ redacted MSSV screenshot"]
        REPORTS["Final artifacts<br/>test summary, audit, critique,<br/>README, report, checklist"]

        POSTMAN --> HEADER --> GATE4
        GATE4 -- "Revise" --> POSTMAN
        GATE4 -- "Confirm and execute" --> RUN
        RUN --> TRIAGE
        DB --> TRIAGE
        TRIAGE --> BUGS --> REPORTS
    end

    FINAL --> POSTMAN
    RUN -. "response/assertion evidence" .-> DB

    AUDITLOG["Pool-local AI audit<br/>prompt + output + timestamp<br/>Human Review: PENDING → final decision"]
    ORCH -. "route each AI interaction" .-> AUDITLOG
    STAGE1 -.-> AUDITLOG
    AUDIT -.-> AUDITLOG
    GAP -.-> AUDITLOG
    POSTMAN -.-> AUDITLOG
    TRIAGE -.-> AUDITLOG
```

### How to redraw it by hand

1. Divide the page into three large horizontal zones: **Inputs**, **AI Test Generator**, and **Execution/Evidence**.
2. Draw `AGENTS.md` as the controller between the inputs and generator; annotate it with `A → B → C`, `Stage 1 → 5`, and `No GET`.
3. In the generator zone, draw three parallel analysis branches: **Domain**, **State/Decision by Pool**, and **Security/Schema**.
4. Join those branches at **Merge + Deduplicate**, then draw the three human loops: Stage 1 review, Stage 2 audit, and Stage 3 extension.
5. Continue from the final `≥35 cases` box to Postman, Newman, SQLite evidence, failure triage, and reporting.
6. Draw the AI Audit as a side box with dashed arrows from each AI-assisted stage. Use a different color for human decision diamonds so your responsibility is visually obvious.

### Meaning of the main paths

- **Pool A / FR-03:** Domain + State Transition + Security/Schema.
- **Pool B / FR-08:** Domain + Decision Table + Security/Schema.
- **Pool C / FR-15:** Domain + Security/Schema; no artificial state/decision technique is added.
- A contract gap loops back to human clarification; the generator must not invent an oracle.
- A generated case cannot reach Postman until it survives audit, extension review, deduplication, and human confirmation.
- Newman proves responses/assertions, while restricted SQLite evidence proves persistent state without adding GET tests.

## Design decisions

| Component | Responsibility | Input | Output | Human gate |
|---|---|---|---|---|
| Orchestrator (`AGENTS.md`) | Enforce pool/stage order and evidence policy | Assignment + progress | Allowed next operation | Every stage |
| Domain analyzer | Inventory every parameter and derive EC/BVA | SRS + API spec + API unit | Parameter inventory, EC/BVA, coverage ledger | Stage 1 |
| State/decision analyzer | Model API-specific behavior | Rules and state/causes | State/decision cases | Stage 1 |
| Security/schema analyzer | Apply SEC rules and contract checks | Role + schema + endpoint | Security/schema cases | Stage 1 |
| Audit/extension | Human review and missed-case discovery | Generated cases | Corrected/final suite | Stages 2–3 |
| Postman builder/executor | Produce data-driven artifacts and evidence | Approved cases | Collection, data, reports | Stage 4 |
| Reporter/finalizer | Preserve bugs, audit, critique, and submission evidence | Real artifacts | Reports/checklists | Stage 5/finalization |

## Pseudocode

```text
function generate_api_tests(api_unit, assignment, srs, api_spec):
    assert api_unit in {PoolA_FR03, PoolB_FR08, PoolC_FR15}
    assert api_unit uses only allowed POST/PUT endpoints

    contract = resolve_contract(api_unit, srs, api_spec)
    if contract has unspecified fields or oracles:
        mark_them_for_human_confirmation()

    domain = deep_domain_analysis(contract)
    assert every_relevant_parameter_in(domain.inventory)
    assert every_invalid_partition_has_isolated_case(domain)
    assert every_documented_boundary_is_covered(domain)

    technique_cases = []
    if api_unit == PoolA_FR03:
        technique_cases += complete_state_transition_analysis(contract)
    if api_unit == PoolB_FR08:
        technique_cases += full_then_reduced_decision_table(contract)

    technique_cases += applicable_security_and_schema_cases(contract)
    proposed_cases = deduplicate_with_traceability(domain.cases + technique_cases)

    output proposed_cases
    stop until human confirms Stage 1

    audited_cases = human_audit(proposed_cases)
    stop until human confirms Stage 2

    extensions = gap_analysis(audited_cases, minimum_new_cases=5)
    require why_ai_missed_it for every extensions item
    stop until human confirms Stage 3

    final_cases = audited_cases + human_confirmed(extensions)
    assert count(final_cases) >= 35
    return final_cases as proposal for Postman construction
```

## Demonstration plan

1. Show the student-drawn architecture diagram.
2. Run one API through separate Domain, behavior, and security/schema prompts.
3. Demonstrate the human confirmation gate and audit log.
4. Show the generated case tables; do not substitute a fake Newman run for the generator demo.

- Optional YouTube link: `[USER ACTION REQUIRED]`
