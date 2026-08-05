# AI Critique — HW03 (Full Project: Stages 0–4 and Stage 6)

**Author**: Thái Minh Huy (23127379)
**Date**: 2026-07-31
**Covers**: AI interactions AI-001 through AI-020
**Word target**: 200–300 words

---

## Where AI Got It Wrong

**Duplicate generation without discovery (AI-002).** When asked to build the GUI checklist, the AI generated 52 new items without first scanning the workspace for an existing file. A 63-item checklist already existed from a prior session. The model expressed no uncertainty and delivered a contradictory artifact; a human had to identify and reconcile both files manually. The core failure: the model treated a stateful task as stateless.

**Systematic accessibility omissions (AI-002).** The first-pass checklist predictably excluded ARIA-level requirements — `aria-current` for active navigation, `role="status"` on toast announcements, and `aria-valuenow` on progress bars. These are WCAG 1.3.1 / 4.1.2 Level AA items, not edge cases. A dedicated gap-analysis prompt in a second pass was required to recover them, revealing a training-data skew toward sighted-user practice.

**Visual inference substituting for live verification (AI-005, AI-015).** In Stage 2, the responsive layout item (IA-01-015) was marked Fail from screenshot inspection rather than a live 320 px resize — probabilistic, not empirical evidence. In Stage 4, the AI could not directly render pages in a target browser; it relied on BrowserStack-returned screenshots to classify defects, meaning subtle CSS engine differences between Chromium and WebKit went undetected without human cross-check.

**Scope drift in consistency auditing (AI-019).** When asked to reconcile B2 counts in the final report, the AI also silently corrected wording in the audit's own statistics table — a scope expansion beyond the stated task.

## Why AI Failed to Catch Issues

- **Prompt quality**: The initial checklist prompt did not specify "check for an existing file first." A more precise prompt prevents duplication entirely.
- **Model limitation**: The AI cannot render pages, observe live CSS behaviour, run DevTools audits, or physically interact with a device. It reasons only from screenshots and DOM text it is explicitly shown.
- **Context gap**: Without knowledge of EMS-specific UI patterns (top-nav instead of sidebar, a single-language database model, BrowserStack's legacy Opera substitute), the AI applied generic web-app assumptions that produced N/A items and one misclassified defect.

## Principles for AI Collaboration

1. **Supply full context upfront** — Tell the AI what already exists before asking it to generate; never assume it will discover existing files on its own.
2. **Accessibility requires a dedicated second-pass prompt** — A single general checklist prompt will never produce WCAG-complete output; plan an explicit accessibility gap-review step.
3. **AI outputs structure; humans supply empirical evidence** — Use AI to generate breadth and organisation, then manually verify every finding that depends on live rendering, interaction state, or real browser behaviour.

---

*Word count: 299 words*
