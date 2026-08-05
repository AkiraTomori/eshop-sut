# Checklist Execution Result — Template

> Use this template for each screen tested. Replace placeholders with actual values.

## Screen: {ScreenID} — {Screen Name}

- **Scenario**: {A | B | C | D}
- **URL**: `https://promoter-starboard-prude.ngrok-free.dev/{path}`
- **Tested on**: {YYYY-MM-DD HH:MM}
- **Browser/OS**: {e.g., Chrome 126 / macOS 15.1}
- **Viewport**: {e.g., 1440×900}

### Execution Results

| Checklist ID | Description | Status | Notes |
|---|---|---|---|
| IA-01-001 | Page content within consistent max-width container | ✅ Passed | — |
| IA-01-002 | Text uses design system fonts, no browser defaults | ❌ Failed | Footer copyright text uses serif font |
| IA-01-003 | Body text contrast ratio ≥ 4.5:1 | ✅ Passed | — |
| ... | ... | ... | ... |
| IA-04-013 | Status messages announced to screen readers | ⬜ N/A | No status messages on this screen |

### Summary

| Metric | Value |
|--------|-------|
| Total items | 56 |
| Passed | 42 |
| Failed | 11 |
| N/A | 3 |
| Pass rate | 78.6% |

---

## Bug Report Template

### Bug #1

| Field | Value |
|-------|-------|
| **Bug ID** | BUG-A2-001 |
| **Screen** | A2 — Add/Edit Event Form |
| **Checklist Item** | IA-02-003 — Inline error on leaving required field blank |
| **Steps to Reproduce** | 1. Navigate to Admin > Events > Add Event. 2. Click into the "Event Title" field. 3. Without entering text, Tab to the next field. |
| **Expected Result** | An inline error message appears immediately below the "Event Title" field stating "Event title is required". |
| **Actual Result** | No error message appears until the user clicks the "Save" button. |
| **Severity** | 2 — Minor |
| **Screenshot** | `A2_IA-02-003_fail.png` |
| **Type** | Bug |

### Bug #2

| Field | Value |
|-------|-------|
| **Bug ID** | BUG-A2-002 |
| **Screen** | A2 — Add/Edit Event Form |
| **Checklist Item** | IA-02-010 — Thumbnail enforces 4:3 aspect ratio |
| **Steps to Reproduce** | 1. Navigate to Admin > Events > Add Event. 2. Click "Upload Thumbnail". 3. Select a 16:9 image (1920×1080). |
| **Expected Result** | An error message states "Thumbnail must have a 4:3 aspect ratio". |
| **Actual Result** | The image is accepted and stretched to fill the thumbnail area, causing visible distortion. |
| **Severity** | 3 — Major |
| **Screenshot** | `A2_IA-02-010_fail.png` |
| **Type** | Bug |

---

## Cross-Screen Summary Template

### Execution Summary Across All Screens

| Screen | Total | Passed | Failed | N/A | Pass Rate |
|--------|-------|--------|--------|-----|-----------|
| A1 — Events List | 56 | 45 | 8 | 3 | 84.9% |
| A2 — Add/Edit Event | 56 | 42 | 11 | 3 | 78.6% |
| A3 — Registration Config | 56 | 47 | 6 | 3 | 88.7% |
| **Overall** | **168** | **134** | **25** | **9** | **84.3%** |

### Failures by Interface Aspect

| IA Category | Failed Items | Most Common Issue |
|-------------|-------------|-------------------|
| IA-01 General UI | 6 | Contrast ratio failures |
| IA-02 Forms | 10 | Missing inline validation |
| IA-03 Navigation | 4 | Keyboard inaccessible controls |
| IA-04 Feedback | 5 | Missing ARIA announcements |

### Bugs by Severity

| Severity | Count | Percentage |
|----------|-------|------------|
| 4 — Critical | 1 | 4.0% |
| 3 — Major | 7 | 28.0% |
| 2 — Minor | 12 | 48.0% |
| 1 — Cosmetic | 5 | 20.0% |
