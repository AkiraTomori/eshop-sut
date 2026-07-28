---
name: AIAuditLogger
description: Extracts and formats AI Audit Report session blocks after every AI interaction session. Records tool name, timestamp, exact prompt, output summary, human review notes, and verdict. Appends to the FR-specific AI-Audit.md file following the HW04 format defined in AGENTS.md §6.
---

# SKILL: AIAuditLogger — AI Audit Session Recorder

> **Skill:** AIAuditLogger
> **Phase:** Compliance (run after EVERY AI interaction session)
> **Trigger:** After completing any Skill that involved an AI interaction (AutomationScriptGen, ScriptReview questions, etc.)
> **Input:**
>   - AI tool name and version used
>   - Date and time of the session
>   - The exact prompt(s) submitted
>   - Summary of AI output
>   - HITL review notes (what was changed/corrected)
> **Output file:** `23127379_Homework/HW4/Pool-[X]_FR##/FR##-AI-Audit.md` (append)
> **Governance:** `AGENTS.md §6` (AI-Audit format), HW04 §9 (AI Audit Report requirements)

---

## Skill Purpose

Record every AI interaction in a structured, auditable format to:
1. Comply with HW04's mandatory AI Audit Report requirement.
2. Document the "human review" evidence required for Anti-AI-Cheat verification.
3. Build the AI Critique analysis (by reviewing multiple sessions for patterns).
4. Capture the prompt quality evolution over the assignment.

**Critical rule:** This skill must be invoked after **every** AI interaction, not just the ones that produced good results. Rejected AI outputs must also be logged with `Verdict: Rejected` and the reason.

---

## Execution Steps

### Step 1 — Gather Session Information

Before writing the audit block, collect:

```
REQUIRED INFORMATION:
□ AI Tool name and version (e.g., "Gemini 2.5 Pro in IDE context", "Claude Sonnet 4.5", "ChatGPT-4o")
□ Session date and time (ISO format: YYYY-MM-DD HH:MM)
□ Bloom-AI level demonstrated:
  - G9.2 (Apply): used AI to generate/execute a technique
  - G9.3 (Analyse): critically analysed and improved AI output
  - G9.4 (Collaborate): guided AI step-by-step through the methodology
□ The FR being worked on (FR-06 / FR-08 / FR-15 / Infrastructure)
□ The phase/task (Script generation / Review / Bug report / etc.)
□ The exact prompt(s) submitted (copy verbatim)
□ Summary of what the AI produced (not the full output — a concise description)
□ What the human reviewer found wrong or missing
□ What corrections were made
□ Final verdict: Accepted / Partially Accepted / Rejected
```

### Step 2 — Write the Audit Block

Use this exact template (from `AGENTS.md §6`):

```markdown
---
## Session: [YYYY-MM-DD HH:MM] — [Task Description]

- **AI Tool:** [Name and version, e.g., "Gemini 2.5 Pro (Antigravity IDE, 2026-07-27)"]
- **FR:** [FR-06 / FR-08 / FR-15 / Infrastructure]
- **Phase/Task:** [e.g., "Automation Script Generation — EP valid test cases"]
- **Bloom-AI Level:** G9.2 (Apply) / G9.3 (Analyse) / G9.4 (Collaborate)

### Prompt Submitted
> [Paste the EXACT prompt text here — do not paraphrase]
>
> [If multiple prompts in sequence, number them:]
> **Prompt 1:**
> [...]
> **Prompt 2:**
> [...]

### AI Output Summary
[Concise 3–5 sentence description of what the AI produced. Include:]
- What was generated (e.g., "Generated 14 test() blocks for FR-06 covering TC-FR06-EP-001 to TC-FR06-NEG-012")
- Format of output (e.g., "TypeScript spec file with test data JSON")
- Obvious strengths (e.g., "Correctly structured beforeEach/afterEach hooks")

### Human Review Notes
[Document every correction made. Be specific:]
- **Issue 1 — [Category]:** [What was wrong] → [What was fixed]
  - Example: "Selector `div.product-price` → replaced with `page.getByTestId('product-price')` because the AI predicted CSS class without inspecting live DOM"
- **Issue 2 — [Category]:** [...]
- **Issue 3 — [Category]:** [...]
- **No issues found (if applicable):** State explicitly if the output was correct.

### What AI Got Wrong
[Categorise the types of errors — this feeds into the AI Critique section of the main report:]
- [ ] Fragile/brittle selectors (predicted DOM structure without live inspection)
- [ ] Weak assertions (used toBeVisible when toHaveText was needed)
- [ ] Missing test isolation (tests depended on each other)
- [ ] Hardcoded test data (should be in JSON file)
- [ ] Flaky waits (used waitForTimeout instead of expect-based waits)
- [ ] Missing edge cases (did not cover boundary values from HW2 BVA)
- [ ] Incorrect expected result (used buggy actual result instead of spec-correct expected)
- [ ] Wrong locator strategy (used XPath when role/label available)
- [ ] Missing cleanup (no afterEach to reset state)
- [ ] None — output was correct

### Verdict
**[Accepted / Partially Accepted / Rejected]**
- *Accepted:* Output used with no significant changes
- *Partially Accepted:* Output used after corrections (list changes above)
- *Rejected:* Output not used; reason: [explain]
```

### Step 3 — Append to Audit File

Append the session block to the correct file:

| FR | Audit File |
|----|-----------|
| FR-06 | `23127379_Homework/HW4/Pool-A_FR06/FR06-AI-Audit.md` |
| FR-08 | `23127379_Homework/HW4/Pool-B_FR08/FR08-AI-Audit.md` |
| FR-15 | `23127379_Homework/HW4/Pool-C_FR15/FR15-AI-Audit.md` |
| Infrastructure | Append to nearest FR audit file or `FR06-AI-Audit.md` |

**Rule:** Never overwrite. Always append to the bottom of the file after a horizontal rule separator (`---`).

### Step 4 — Self-Audit Before Appending

```
□ Session timestamp is correct (ISO format YYYY-MM-DD HH:MM)
□ AI Tool name is specific (not just "AI")
□ Prompt text is verbatim (not paraphrased)
□ Output summary is concise and factual
□ Every issue found is documented in Human Review Notes
□ "What AI Got Wrong" checklist is filled honestly
□ Verdict reflects the actual outcome (not aspirational)
□ Block will be appended to the correct FR audit file
```

---

## Session Example (Reference)

```markdown
---
## Session: 2026-07-27 14:30 — Automation Script Generation for FR-06

- **AI Tool:** Gemini 2.5 Pro (Antigravity IDE, 2026-07-27)
- **FR:** FR-06 (Product Detail View)
- **Phase/Task:** AutomationScriptGen — EP and NEG test cases (TC-FR06-EP-001 to TC-FR06-NEG-010)
- **Bloom-AI Level:** G9.2 (Apply) + G9.4 (Collaborate)

### Prompt Submitted
> Using the AutomationScriptGen skill, generate Playwright test cases for FR-06 Product Detail View. 
> Read from: `23127379_Homework/HW2/Pool-A_FR06_ProductDetailView/FR06-test-cases.md`
> Select TCs: TC-FR06-EP-001, EP-002, EP-003, EP-004, NEG-001 through NEG-010, BV-001, BV-003
> Requirements: data-driven (JSON), 3+ assertion patterns, beforeEach/afterEach, annotate known bugs.
> Known bugs reference: `23127379_Homework/HW2/Pool-A_FR06_ProductDetailView/FR06-bug-report.md`

### AI Output Summary
Generated `fr06.spec.ts` with 14 test cases covering EP-001 to EP-004 and NEG-001 to NEG-010. 
Created `fr06-test-data.json` with 14 entries. Used `beforeEach` for page navigation and `afterEach` UI-based cleanup.
Assertion patterns included: toHaveURL, toBeVisible, toHaveText, toHaveValue, toHaveCount.

### Human Review Notes
- **Issue 1 — Fragile Selector:** Line 45: `page.locator('div.product-container > img')` → replaced with `page.locator('img[alt]')` because the AI assumed CSS class name not present in SUT.
- **Issue 2 — Missing Assertion:** TC-FR06-EP-003 (Add to Cart): AI only checked toast visibility, missing cart badge count assertion → added `expect(cartBadge).toContainText('1')`.
- **Issue 3 — Weak Assertion:** TC-FR06-EP-001: AI used `toContainText('₫')` for price check; replaced with `toContainText(/\d{1,3}(,\d{3})* ₫/)` (regex for thousands format).
- **Issue 4 — Missing Cleanup:** TC-FR06-EP-003/004: No afterEach to clear cart → added UI-based cleanup: navigate to cart page and click remove buttons for added items.
- **Issue 5 — Known Bug Handling:** TC-FR06-EP-001 asserted category display but AI did NOT annotate the known bug (BUG-FR06-001) → added inline comment.

### What AI Got Wrong
- [x] Fragile/brittle selectors (predicted DOM structure without live inspection)
- [x] Weak assertions (used toBeVisible when richer assertions were needed)
- [ ] Missing test isolation
- [ ] Hardcoded test data
- [ ] Flaky waits
- [ ] Missing edge cases
- [x] Missing cleanup (afterEach not written for cart state)
- [x] Incorrect known-bug annotation (BUG-FR06-001 not annotated)

### Verdict
**Partially Accepted** — Output used after 5 corrections (see Human Review Notes above).
```

---

## AI Critique Material — Running Observations

After each session, add a bullet to the running AI Critique notes in the audit file:

```markdown
---
## Running AI Critique Notes (for main_report.md §AI Critique)
- [2026-07-27 FR-06]: AI predicted DOM structure (CSS classes, div nesting) without access to live rendered HTML. This is a structural limitation: the AI knows React component patterns but not the compiled CSS. Fix: always inspect live SUT for selectors.
- [YYYY-MM-DD FR-##]: [observation]
```

These notes will be consolidated into the 200–300 word AI Critique required by HW04 §10.

---

## Output Block Template

After completing this skill, present to HITL:

```
[AIAuditLogger Complete]

SESSION LOGGED:
- File: `23127379_Homework/HW4/Pool-[X]_FR##/FR##-AI-Audit.md`
- Session: [YYYY-MM-DD HH:MM]
- Task: [description]
- Issues documented: N
- Verdict: [Accepted / Partially Accepted / Rejected]

HITL ACTIONS REQUIRED:
1. Review the session block for accuracy
2. Confirm the prompt text is verbatim
3. Confirm the "What AI Got Wrong" checklist is honest
4. Sign off by adding your name to Human Review Notes if not already present
5. Commit:
   ```bash
   git add 23127379_Homework/HW4/Pool-[X]_FR##/FR##-AI-Audit.md
   git commit -m "docs(FR##): log AI audit session - [task description]"
   ```
```

---

## HITL Action After This Skill

1. Read the session block — verify it accurately reflects what happened.
2. If you made additional corrections not captured by the AI: add them to Human Review Notes.
3. Sign off the session (your name in the audit block confirms HITL review).
4. Never submit the AI-Audit file without your review notes — this is an Anti-AI-Cheat requirement.
5. Commit as shown above.
