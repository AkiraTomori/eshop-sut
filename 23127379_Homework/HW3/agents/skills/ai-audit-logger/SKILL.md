---
name: ai-audit-logger
description: >
  Automatically log all AI interactions (tool name, timestamp, prompt, output summary)
  during the HW03 testing process. Generates the mandatory AI Audit Report appendix
  and the AI Critique section (200–300 words). Corresponds to HW03 §10 and §11.
---

# AI Audit Logger

## Purpose

This skill tracks and logs every AI interaction during the HW03 testing process,
producing the mandatory AI Audit Report and AI Critique. It can be invoked by
other skills (gui-checklist-builder, checklist-executor, heuristic-usability-evaluator,
cross-platform-matrix-generator) or called directly by the user.

## When to Invoke

- **After every AI interaction** that contributes to the homework deliverables
- At the **end of each testing session** as a summary
- When **generating the final report** to compile the complete audit log

## Workflow

### Step 1 — Capture Interaction Data

For each AI interaction, record the following fields:

| Field | Description | Example |
|-------|-------------|---------|
| **Entry ID** | Sequential number | `AI-001` |
| **Date/Time** | ISO 8601 format | `2026-07-25T14:30:00+07:00` |
| **AI Tool** | Name and version | `Claude Sonnet 4 (Antigravity IDE)` |
| **Task Context** | Which HW03 task this supports | `Task 1A — Checklist Generation` |
| **Skill Used** | Agent skill that triggered this | `gui-checklist-builder` |
| **Prompt** | The exact prompt or instruction given to AI | `Generate a GUI checklist...` |
| **Output Summary** | Concise summary of what AI produced | `Generated 42 checklist items across 4 IAs` |
| **Human Review** | What the human modified/corrected | `Added 14 items for accessibility; removed 3 duplicates` |
| **Assessment** | Quality assessment of AI output | `Good initial coverage but missed WCAG criteria` |

### Step 2 — Append to Audit Log File

Maintain a running log file at `ai-audit-report.md`:

```markdown
# AI Audit Report — HW03

## Declaration

I use AI tools for the following tasks:

## Interaction Log

### AI-001 — {Date/Time}

| Field | Value |
|-------|-------|
| **AI Tool** | {tool} |
| **Task Context** | {task} |
| **Skill Used** | {skill} |
| **Prompt** | {prompt — can be multiline} |
| **Output Summary** | {summary} |
| **Human Review** | {modifications made} |
| **Assessment** | {quality assessment} |
```

### Step 3 — Generate AI Audit Report

When the user requests the final audit report, compile:

1. **Declaration**: "I use AI tools for the following tasks:" followed by a summary list
2. **Tool Summary Table**:

```markdown
| AI Tool | Sessions | Tasks Supported |
|---------|----------|-----------------|
| Claude Sonnet 4 | 12 | Task 1A, 1B, 2, 3 |
| ChatGPT-4o | 3 | Task 1A, 2 |
```

3. **Complete Interaction Log**: All entries in chronological order
4. **Statistics**:
   - Total AI interactions
   - Interactions per task
   - Average human modification rate (% of AI output that was changed)

### Step 4 — Generate AI Critique (200–300 Words)

Produce the AI Critique section based on accumulated observations. The critique must address:

1. **Where AI got it wrong**: Specific examples of incorrect, biased, or incomplete AI outputs
2. **Why AI failed**: Root cause analysis (prompt quality, model limitation, context gap)
3. **Lessons learned**: Principles for effective AI collaboration

#### AI Critique Template

```markdown
# AI Critique

## Where AI Got It Wrong

{Describe 2–3 specific instances where the AI produced incorrect, biased, or
incomplete results. Reference the audit log entry IDs.}

**Example patterns:**
- The AI consistently missed {category of items} in the GUI checklist because {reason}.
- When asked to evaluate usability, the AI {specific failure pattern}.
- The AI-generated cross-platform matrix {specific issue}.

## Why AI Failed to Catch Issues

{Analyse the root causes:}
- **Prompt quality**: {Did vague prompts lead to vague outputs?}
- **Model limitations**: {What can't the AI perceive? e.g., actual rendering, real-time behaviour}
- **Context gaps**: {What SUT-specific knowledge was the AI missing?}

## Principles for AI Collaboration

{State 2–3 concrete principles derived from this experience:}
1. {Principle 1 — e.g., "Always provide the AI with concrete examples of the SUT's UI patterns"}
2. {Principle 2 — e.g., "Never trust AI outputs for accessibility testing without manual verification"}
3. {Principle 3 — e.g., "Use AI to generate the initial structure, then apply domain expertise to refine"}
```

**Word count target**: 200–300 words. Count the words before finalising.

### Step 5 — Handle "No AI Used" Case

If the user declares they did not use AI for a specific task:

```markdown
### {Task Name}

I do not use any AI help in this task.
```

## Output Deliverables

1. **`ai-audit-report.md`** — Complete audit log with declaration, interaction log, and statistics
2. **`ai-critique.md`** — 200–300 word critique of AI performance

## Auto-Logging Behaviour

When invoked by other skills, this skill **automatically**:
1. Captures the current timestamp
2. Records the calling skill name
3. Records the task context
4. Prompts the user to provide the prompt text and output summary (or extracts from context)
5. Appends the entry to the audit log file

## Integration with Other Skills

- **Called by**: All other 5 skills after AI interactions
- **Output to**: `report-assembler` (audit report + critique as appendices)

## Privacy & Compliance

- Log the **substance** of prompts and outputs, not necessarily verbatim transcripts of very long exchanges
- Truncate very long AI outputs to a meaningful summary (keep full prompts)
- Ensure no sensitive personal data is logged (mask MSSV in examples if needed)
