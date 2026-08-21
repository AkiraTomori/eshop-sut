# <Pool/API> — Five-Stage Working Record

> Copy this template into the selected pool directory. Replace placeholders only with confirmed or real evidence.

## API metadata

| Item | Value |
|---|---|
| Pool/FR | `<value>` |
| Endpoint(s) | `<allowed POST/PUT endpoint(s)>` |
| SRS source | `<README section>` |
| API source | `<api_specification section>` |
| Final case target | `≥35` |

## Stage 1 — Generate

### Domain Testing

- Parameter inventory: `<path/link>`
- EC/BVA tables: `<path/link>`
- Coverage ledger: `<path/link>`
- Parameters inventoried / covered: `<N> / <N>`
- User confirmation: `<timestamp/reference>`

### API-specific behavior technique

- Technique: `<State Transition / Decision Table / Not applicable>`
- Diagram/full table/reduced table: `<path/link>`
- Cases: `<N>`
- User confirmation: `<timestamp/reference>`

### Security and schema

- Applicability matrix: `<path/link>`
- Cases: `<N>`
- User confirmation: `<timestamp/reference>`

## Stage 2 — Audit

| Generated | Proposed VALID | Proposed INVALID | Proposed INCOMPLETE | Human-corrected final | User confirmation |
|---:|---:|---:|---:|---:|---|

- Confirmed audit table: `<path/link>`
- Important corrections: `<evidence-backed summary>`

## Stage 3 — Extend

| Added Case ID | Missing coverage | Why AI missed it | User decision |
|---|---|---|---|

- At least five confirmed additions: `[ ]`
- Final case total ≥35: `[ ]`
- User confirmation: `<timestamp/reference>`

## Stage 4 — Execute

| Artifact/evidence | Path/link | Verified? |
|---|---|---|
| Postman collection folder | `<path>` | `[ ]` |
| Environment | `<path>` | `[ ]` |
| Data file | `<path>` | `[ ]` |
| Student-header screenshot | `<real screenshot>` | `[ ]` |
| Newman HTML report | `<real report>` | `[ ]` |
| Hostname | `<localhost/127.0.0.1 or real deployment>` | `[ ]` |

| Executed | Passed | Failed | Skipped | Reconciled? |
|---:|---:|---:|---:|---|

- User confirmation: `<timestamp/reference>`

## Stage 5 — Report bugs

| Failure ID | Classification | Bug/Issue ID | Evidence | Status |
|---|---|---|---|---|

- Genuine bug count: `<N>`
- False-positive count: `<N>`
- User-posted GitHub Issue links: `<real links or none>`
- User confirmation: `<timestamp/reference>`

## AI audit references

List the corresponding rows from `.agents/skills/api-skill/state/ai-audit-log.md`.

