---
name: postmortem-critique-generator
description: >-
  Use this skill LAST — only after ALL other skills (1-4, 6-9) have completed
  and independent-reviewer (Skill 10) has finished at least one review cycle
  for each endpoint group. Trigger phrases: "generate AI Audit Report",
  "write AI Critique", "postmortem", "final audit", or "summarize AI usage".
  Produces two mandatory HW05 appendices: (1) AI Audit Report — a full table
  of every AI interaction across all skills with timestamps, prompts, and
  outputs; (2) AI Critique (200–300 words) — an honest analysis of where AI
  failed, why it failed, and what lessons were learned. Both appendices must
  be grounded in REAL evidence from hw05_audit_log.md and Skill 10 review
  history — not generic statements. STOPS for final human review.
---

# Skill 5 — postmortem-critique-generator

## Purpose
Generate two mandatory HW05 appendices:
1. **AI Audit Report** — a complete log of every AI interaction
2. **AI Critique** — 200–300 words analyzing where AI went wrong and lessons learned

**Run only after Skills 1–4, 6–9 are complete and Skill 10 has reviewed at least once.**

---

## Required Input

- `[AUDIT_LOG_FILE]` — `hw05_audit_log.md` aggregated from all skills
- `[REVIEW_HISTORY]` — all Skill 10 review cycles (v1→review→v2→review...)
- `[SKILL_OUTPUTS]` — outputs from Skills 1, 2, 4, 6 (content-generating skills)
- `[JTL_FILES]` — for cross-checking numbers in the Critique

---

## Step 1 — Read and Aggregate the Audit Log

```bash
cat 23127379_Homework/HW5/hw05_audit_log.md
```

---

## Output 1 — AI Audit Report

**File**: `23127379_Homework/HW5/ai_audit_report.md`

```markdown
# AI Audit Report — HW05 Performance Testing
**Student ID**: 23127379
**Date compiled**: {compilation_date}

> "I use AI tools for the following tasks:"

## AI Interaction Log

| # | AI Tool | Skill / Task | Date & Time | Prompt Summary | Output Summary | Notes |
|---|---------|--------------|-------------|----------------|----------------|-------|
| 1 | Antigravity (Claude) | Skill 1: Params — Group 1 Read-heavy | {datetime} | "Advise thread count for GET /api/products..." | Params table: 100 threads, 60s ramp, 1500ms think-time | Approved after review |
| 2 | Antigravity (Claude) | Skill 1: Params — Group 2 Auth-heavy | {datetime} | "Advise Spike params for POST /api/login..." | Spike: baseline 10 → spike 150, ramp 5s | Adjusted lockout threshold |
| 3 | Antigravity (Claude) | Skill 1: Params — Group 3 Transactional | {datetime} | "Advise Stress params for cart+checkout..." | Stress: 10→200 users, 30s steps | |
| 4 | Antigravity (Claude) | Skill 2: Test Plan — Load | {datetime} | "Generate JMX for Load test with approved params..." | 23127379_Load_{date}.jmx + products_data.csv | Review: fixed assertion |
| 5 | Antigravity (Claude) | Skill 2: Test Plan — Spike | {datetime} | "Generate JMX for Spike test auth-heavy..." | 23127379_Spike_{date}.jmx + auth_credentials.csv | Review: added lockout handling |
| 6 | Antigravity (Claude) | Skill 2: Test Plan — Stress | {datetime} | "Generate JMX for Stress test transactional..." | 23127379_Stress_{date}.jmx + order_payloads.csv | Review: fixed stepping logic |
| 7 | Antigravity (Claude) | Skill 4: JTL Analysis — Load | {datetime} | "Analyze {jtl_file}..." | p95={x}ms, error={y}%, throughput={z}rps | Human corrected p95 calc |
| 8 | Antigravity (Claude) | Skill 4: JTL Analysis — Spike | {datetime} | "Analyze spike results..." | Lockout events: {n}, recovery time: {t}s | |
| 9 | Antigravity (Claude) | Skill 4: JTL Analysis — Stress | {datetime} | "Find breaking point from stress .jtl..." | Breaking point: ~{n} users | |
| 10 | Antigravity (Claude) | Skill 6: CI Pipeline | {datetime} | "Propose CI pipeline with p95 threshold {x}ms..." | Mermaid flowchart + trade-off table | |
| 11 | Antigravity (Claude) | Skill 10: Review — v1 outputs | {datetime} | "Review Skill 1 Load params independently..." | Found {n} issues: {summary} | |
| ... | ... | ... | ... | ... | ... | ... |

**Total AI interactions**: {total}
**AI tools used**: Antigravity CLI (Claude Sonnet)
**Estimated total AI-assisted time**: {hours} hours
```

---

## Step 2 — Summarize Review History

From Skill 10 logs, compile:

```markdown
## Review Cycles (Skill 10)

| Round | Target | Issue Found | Severity | Fixed? |
|-------|--------|-------------|----------|--------|
| v1 → review | Skill 1 Load params | Thread count too high for local SQLite | High | ✅ Reduced 200→100 |
| v1 → review | Skill 2 JMX | Missing lockout handling in assertion | Critical | ✅ Added JSR223 PostProcessor |
| v2 → review | Skill 4 analysis | p95 computed from Latency column, not elapsed | Critical | ✅ Fixed formula |
| v1 → review | Skill 6 CI | Thresholds generic, not from actual measurements | Medium | ✅ Tied to real p95 |
```

---

## Output 2 — AI Critique (200–300 words)

**File**: `23127379_Homework/HW5/ai_critique.md`

Content must be based on **real evidence** from the review history. Template:

```markdown
# AI Critique — HW05 Performance Testing
**Student ID**: 23127379

## Analysis of AI Errors and Limitations

During HW05, I used Antigravity (Claude Sonnet) to support the entire
performance testing workflow. The following is an honest assessment of where
the AI fell short, with concrete evidence.

### Error 1: [Name the specific error — from review history]
[Describe specifically: what the AI generated incorrectly (Skill X, version v1),
what the wrong value was, what the correct value is (citing the exact .jtl row),
and why the AI produced this error — e.g., the prompt lacked context about
EShop's SQLite local setup, or the model defaulted to generic enterprise
recommendations, or the question was too broad.]

### Error 2: [Name the specific error]
[Same structure as above...]

### What the AI Did Well
[Honest acknowledgment: time saved, things AI correctly identified that you
might have missed, structure it provided for a complex workflow.]

### Lessons Learned
[1–2 concrete principles about AI collaboration in performance testing.
Example: "Always provide sample .jtl rows when prompting AI to analyze results,
rather than describing them in words — AI tends to hallucinate numbers without
ground truth data."]

**Word count**: [count and state explicitly for TA verification]
```

---

## Verify Word Count

```bash
# Count words in critique (content only, not markdown headers)
wc -w 23127379_Homework/HW5/ai_critique.md
# Target: 200–300 words
```

---

## Audit Log

Append to `hw05_audit_log.md`:

```markdown
## [SKILL-5] postmortem-critique-generator — {timestamp}
- **Input**: hw05_audit_log.md ({n_entries} entries), Skill 10 ({n_cycles} review cycles)
- **Output**: ai_audit_report.md + ai_critique.md
- **Critique word count**: {n} words
- **AI interactions documented**: {total}
```

---

## ⛔ Checkpoint — STOP HERE

```
✅ Skill 5 complete.

📄 Files created:
   - ai_audit_report.md
   - ai_critique.md ({word_count} words)

📋 Action required from you:
   [ ] Read AI Critique — is it exactly 200–300 words?
   [ ] Check Audit Report — every AI interaction documented?
   [ ] Fill in self-assessment grades in the README (Skill 9)
   [ ] Add your YouTube demo video link

👉 After review, proceed to Skill 9 (final-report-compiler)
   to compile the final submission README.
```

## References
- [Audit Report Template](./references/audit_report_template.md)
- [HW05 Assignment](../../../../23127379_Homework/HW5/2026.HW05.Performance%20Testing_En.md)
