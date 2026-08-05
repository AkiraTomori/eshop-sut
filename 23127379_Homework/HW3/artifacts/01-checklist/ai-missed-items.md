# AI-Missed Items — Items Added Beyond AI Output

**Stage**: 1 — GUI Checklist Design
**Date**: 2026-07-28
**Author**: Thái Minh Huy (23127379)

> This file documents items that were **added by human review** after the initial AI-generated checklist.
> For each item, the table below includes: the item content, the root cause of the AI's omission,
> and the category of the gap.

---

## Summary Table

| Item ID | Item Description | Gap Category | Why AI Missed It |
|---------|------------------|--------------|-----------------|
| IA-01-007 | EN→VI language switch changes all UI labels without reload | i18n | Generic prompts don't assume bilingual requirements |
| IA-01-008 | No mixed-language labels after language switch | i18n | AI doesn't test UI state consistency across language toggle |
| IA-01-012 | Content usable at 200% browser zoom | Zoom / Responsive | WCAG 1.4.4 not prompted explicitly; AI focuses on layout at 100% |
| IA-01-013 | No horizontal scroll at 320px viewport | Responsive | WCAG 1.4.10 (Reflow) not implied by domain prompt; AI defaults to desktop |
| IA-02-005 | Form data preserved after server-side validation error | Error resilience | AI generates error display items but ignores data loss risk on failure |
| IA-02-013 | Rich-Text Editor toolbar is keyboard accessible | Keyboard nav | RTE accessibility is a niche concern; AI treats RTEs as functional widgets |
| IA-03-002 | Sidebar `aria-current="page"` on active item | ARIA / Screen reader | AI rarely generates ARIA-specific items without explicit accessibility prompt |
| IA-03-012 | Keyboard alternative for drag-and-drop (Move Up/Down buttons) | Keyboard nav | AI acknowledges drag-drop but almost never includes WCAG 2.5.7 keyboard alternative |
| IA-04-004 | Toast auto-dismiss ≥ 5 seconds and has manual dismiss button | Timing / WCAG 2.2.1 | AI generates "toast appears" items but ignores dismissal timing requirements |
| IA-04-005 | Toast announced via `role="status"` or `role="alert"` | Screen reader | Dynamic content announcements (WCAG 4.1.3) rarely generated without explicit WCAG prompt |
| IA-04-011 | Keyboard focus trapped inside confirmation dialog | Focus management | Focus trapping is a modal-specific accessibility pattern AI rarely includes |
| IA-04-015 | Progress bar has `aria-valuenow/min/max` attributes | ARIA / Screen reader | AI generates visual progress bar items but ignores ARIA semantics |

---

## Detailed Analysis

### 1. Items Related to Internationalisation (EN/VI)

**Items**: IA-01-007, IA-01-008

**Why AI Missed Them**:
The initial prompt specified "i18n EN/VI" as a scope item, but the AI interpreted this as a design consideration rather than generating **executable test items** for it. Specifically:
- The AI did not generate any checklist item that required actually toggling the language switcher and verifying that all labels change.
- The AI did not think to check for **mixed-language UI states** that arise when only some labels are translated.

This is a classic AI limitation: the model translates "i18n" into a design quality note ("labels use domain language") rather than into the dynamic test action ("switch language and verify completeness"). Human reviewers familiar with bilingual Vietnamese applications know this is one of the most common failure modes.

---

### 2. Items Related to Zoom / Responsive (WCAG 1.4.4, 1.4.10)

**Items**: IA-01-012, IA-01-013

**Why AI Missed Them**:
The initial prompt listed "responsive design" in the scope, and the AI generated layout consistency items for desktop width. However:
- **WCAG 1.4.4** (Resize Text — 200% zoom) requires testing at a browser zoom level, not a viewport size. AI models tend to conflate responsive design (viewport width) with zoom behaviour (browser scale factor), and miss the distinction.
- **WCAG 1.4.10** (Reflow — 320px viewport) was not referenced in the initial prompt. The AI defaulted to the commonly known 768px mobile breakpoint, missing the WCAG-mandated 320px threshold specifically.

Both items required explicit WCAG criterion knowledge that the AI did not apply without being directly prompted.

---

### 3. Form Data Preservation on Error (IA-02-005)

**Item**: IA-02-005

**Why AI Missed It**:
The AI generated multiple items about error messages being displayed correctly after failed submission. However, it did not generate an item testing whether **the user's input data is preserved** when the server returns an error. This is a critical usability failure (losing filled forms is one of the most frustrating UX issues) but it is a *side-effect* condition rather than a primary interaction. AI models tend to generate "happy path + error display" combinations but rarely model secondary consequences of error states.

---

### 4. Rich-Text Editor Keyboard Accessibility (IA-02-013)

**Item**: IA-02-013

**Why AI Missed It**:
The AI generated items covering RTE content saving and toolbar functionality, but treated the RTE as a functional widget without considering its keyboard accessibility. Rich-text editors (e.g., Quill, TinyMCE) are notoriously difficult to make keyboard-accessible, and this is a known area of WCAG 2.1.1 compliance risk. The AI did not include this because:
1. RTE accessibility is a specialist concern rarely covered in general QA resources.
2. The initial prompt mentioned "keyboard accessibility" in the gap analysis prompt (Prompt 2) but not Prompt 1, so the AI didn't apply it proactively to the RTE widget.

---

### 5. ARIA and Screen Reader Items (IA-03-002, IA-04-005, IA-04-015)

**Items**: IA-03-002, IA-04-005, IA-04-015

**Why AI Missed Them**:
These three items require testing specific ARIA attributes (`aria-current`, `role="status"`, `aria-valuenow`) rather than visual/functional behaviour. The AI model:
1. Does not routinely generate ARIA-specific checklist items unless explicitly prompted to "check ARIA attributes."
2. Confuses ARIA compliance with visual accessibility — it generated contrast and colour items but skipped semantic markup requirements.
3. WCAG 4.1.2 (Name, Role, Value) and WCAG 4.1.3 (Status Messages) are Level AA criteria that are frequently omitted from AI-generated checklists because they require DOM inspection knowledge, not visual testing.

---

### 6. Keyboard Drag-and-Drop Alternative (IA-03-012)

**Item**: IA-03-012

**Why AI Missed It**:
The AI correctly identified drag-and-drop as a widget to test (visible drag handles, drop zone highlight). However, WCAG 2.5.7 (Dragging Movements — Level AA, added in WCAG 2.2) requires that **all drag-and-drop functionality be achievable through a non-drag alternative**. This criterion is:
1. New in WCAG 2.2 (2023), and many AI models have training data dominated by WCAG 2.1.
2. Requires understanding of an *alternative pathway*, not just testing the drag interaction itself.
3. The AI focused on the interaction fidelity of drag-and-drop rather than its accessibility compliance.

---

### 7. Toast Timing and Focus Management (IA-04-004, IA-04-011)

**Items**: IA-04-004, IA-04-011

**Why AI Missed Them**:
- **IA-04-004** (Toast dismiss timing): The AI generated "toast appears after action" items but did not think to test the **temporal dimension** of the toast — specifically WCAG 2.2.1 (Timing Adjustable) which requires auto-dismissing content to persist for ≥ 5 seconds (or not auto-dismiss at all). This reflects a systematic gap where AI models test presence of UI feedback but not its duration.
- **IA-04-011** (Dialog focus trap): The AI generated items about dialog labels and confirm/cancel buttons, but focus management within modals is a JavaScript behaviour concern. AI models rarely generate DOM/focus-tree items from a purely GUI-checklist perspective unless explicitly instructed to check WCAG 2.1.2 (No Keyboard Trap).

---

## Lessons Learned

1. **AI reliably generates**: visual consistency items, form validation patterns, basic error message format items, navigation presence items.
2. **AI systematically misses**: ARIA semantic attributes, WCAG 2.2 criteria (especially 2.5.7, 2.5.8, 2.4.11), timing/duration requirements, keyboard alternatives for visual interactions, and multilingual state completeness.
3. **Root cause pattern**: AI generates checklists from a *sighted, mouse-using, single-language* user perspective by default. Any deviation (keyboard-only, screen reader, zoom, bilingual) requires explicit human intervention.
4. **Mitigation**: Always run a second AI prompt focused specifically on accessibility, i18n, and WCAG 2.2 gaps after the initial generation.
