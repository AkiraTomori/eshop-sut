# SKILL: Phase 1 — Requirement Analysis

> **Phase:** 1 of 5
> **Input:** FR identifier (e.g., `FR-06`) + Pool (e.g., `A`)
> **Output file:** `FR[##]-requirement-analysis.md` (append to pool directory)
> **Knowledge sources (read in order):**
> 1. `.agents/context/eshop-srs.md` — primary source of truth
> 2. `.agents/context/eshop-api-spec.md` — API endpoint and request/response schema
> 3. `.agents/context/theory-domain-testing.md §4` — Step 1 guidance

---

## Skill Purpose

Extract and document **every input variable and output variable** for the target FR, grounding each variable in an explicit SRS requirement. This artefact is the mandatory prerequisite for Phase 2 (Domain Analysis) — it is a hard error to begin EP without it.

---

## Execution Steps

### Step 1 — Identify the Feature Scope
- Read the target FR section in `eshop-srs.md` completely.
- Read any GUI requirements (`FR-21` to `FR-24`) that apply to the FR.
- Read the relevant API endpoints in `eshop-api-spec.md`.
- State the platform (Web Frontend / Web Admin / Mobile App) and the relevant URL/endpoint.

### Step 2 — Extract Input Variables

For every user-supplied or system-received input, record:

| Column | Content |
|--------|---------|
| **Variable Name** | Exact field name as it appears in the UI or API spec |
| **Data Type** | string / integer / float / boolean / enum / date / file |
| **Constraints** | Range, format, allowed values, mandatory/optional, uniqueness |
| **Source Req. ID** | The FR-XX or SEC-XX that defines this constraint |

Include:
- Form fields (text inputs, dropdowns, checkboxes, file pickers)
- URL path parameters and query parameters (from API spec)
- Request body fields (JSON keys from `eshop-api-spec.md`)
- Hidden/system inputs (JWT token, session state, role)

### Step 3 — Extract Output Variables

For every observable output the system can produce, record:

| Column | Content |
|--------|---------|
| **Output Variable** | Exact observable behaviour (e.g., "Success toast notification", "HTTP 400 error") |
| **Output Type** | UI feedback / HTTP response / state change / redirect / email |
| **Expected Value / Message** | As specified in the SRS |
| **Condition** | Which input scenario triggers this output |
| **Source Req. ID** | The FR-XX or SEC-XX that mandates this output |

### Step 4 — Flag Ambiguities

If any variable's constraint is undefined, contradictory, or unclear in the SRS:

```
⚠️ AMBIGUITY [VAR-NAME]: [Description of the unclear or missing specification]
   → Recommended clarification: [Suggested interpretation or question for HITL]
```

Do not proceed to Phase 2 until HITL resolves all `⚠️ AMBIGUITY` items.

### Step 5 — Self-Audit

Before appending output, verify:

```
□ Every input field in the FR's UI form is listed
□ Every API request parameter is listed
□ Every distinct output behaviour is listed
□ Every variable is traced to a specific FR-XX or SEC-XX
□ All ambiguities are flagged for HITL
```

---

## Output Block Template

Append the following block to `FR[##]-requirement-analysis.md`:

```markdown
---
## Requirement Analysis — [FR-ID]: [Feature Name]
**Date:** YYYY-MM-DD HH:MM
**Analyst:** Gemini QA Agent (reviewed by: [HITL name])
**SRS Version:** 2.0 (2026-05-14)

### Feature Scope
- **Platform:** [Web Frontend / Web Admin / Mobile App]
- **URL / Endpoint:** [e.g., http://localhost:5173/products/:id]
- **API Endpoints Used:** [e.g., GET /api/products/:id, POST /api/cart]

### Input Variables

| # | Variable Name | Data Type | Constraints | Source Req. ID |
|---|--------------|-----------|-------------|----------------|
| 1 | [field name] | [type]    | [constraints] | [FR-XX] |
| … | …            | …         | …           | …              |

### Output Variables

| # | Output Variable | Output Type | Expected Value / Message | Condition | Source Req. ID |
|---|----------------|-------------|--------------------------|-----------|----------------|
| 1 | [output name]  | [type]      | [value or message]       | [when]    | [FR-XX] |
| … | …              | …           | …                        | …         | …              |

### Open Ambiguities (HITL Resolution Required)
- [ ] ⚠️ [Variable]: [Issue description] → [Suggested resolution]
```

---

## HITL Action After This Skill

1. Review the full variable table — confirm no input or output is missing.
2. Resolve all `⚠️ AMBIGUITY` items and record decisions in the file.
3. Sign off: append `**HITL Review:** Accepted / Partially Accepted / Rejected — [notes]` to the block.
4. Commit: `git commit -m "feat(FR##): add requirement analysis"`
