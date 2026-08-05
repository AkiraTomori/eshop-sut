---
name: cross-platform-matrix-generator
description: >
  Execute cross-browser / cross-platform compatibility testing for EMS screens
  (Scenario B: B1, B2, B4) across a matrix of 3 OS × 5 browsers × 3 device classes.
  Agent automates screenshot capture via BrowserStack Screenshots API or Chrome DevTools
  emulation, applies MSSV email overlay, analyses rendering defects, and produces the
  complete Cross-Platform Compatibility Report. Corresponds to HW03 Task 3.
---

# Cross-Platform Matrix Generator

## Purpose

Agent executes Task 3 end-to-end in a **loop over 3 screens**. Before any testing
begins, the full device matrix is defined for all screens. Then the agent logs in,
navigates to each screen in turn, captures all matrix cells, applies the MSSV overlay,
analyses defects, and repeats until all 3 screens are done.

```
[Setup] Define 10-cell matrix (same matrix for all screens)
    ↓
[Screen B1] Login → Navigate → Capture 10 cells → Overlay → Analyse
    ↓
[Screen B2] Login → Navigate → Capture 10 cells → Overlay → Analyse
    ↓
[Screen B4] Login → Navigate → Capture 10 cells → Overlay → Analyse
    ↓
[Report] Compile cross-platform-report.md
```

---

## Prerequisites

| Item | Value |
|------|-------|
| **SUT URL** | `https://prod-dev.ems-fitus.cloud/` |
| **Login email** | `23127379@student.hcmus.edu.vn` |
| **Login password** | `Minhhuy1407@` |
| **MSSV overlay email** | `23127379@student.hcmus.edu.vn` |
| **Screens in scope** | B1 (Events List), B2 (Event Detail), B4 (Registration Confirmation / QR) |
| **Python 3 + Pillow** | Required for overlay — `pip install Pillow` |

> ⚠️ All three screens are behind authentication. The agent must log in before
> navigating to any screen. Credentials above are reused from Stage 2.

---

## Phase 0 — Matrix Setup (runs ONCE before any screen testing)

### Step 0.1 — Define the Coverage Matrix

Define a **single 10-cell matrix** that will be reused for all 3 screens.
The matrix must satisfy all coverage rules for each screen:

| Rule | Requirement |
|------|-------------|
| OS coverage | Windows ≥ 1, macOS ≥ 1, Android ≥ 1 |
| Browser coverage | Chrome ≥ 1, Firefox ≥ 1, Safari ≥ 1, Edge ≥ 1, Opera ≥ 1 |
| Device class coverage | Desktop ≥ 1, Tablet ≥ 1, Phone ≥ 1 |

**Standard 10-cell matrix (Scenario B):**

| Cell ID | OS | Browser | Device Class | Viewport | Execution Mode |
|---------|----|---------|--------------|----------|----------------|
| C01 | Windows 11 | Chrome | Desktop | 1920×1080 | Chrome DevTools / BS |
| C02 | Windows 11 | Firefox | Desktop | 1920×1080 | Chrome DevTools / BS |
| C03 | Windows 11 | Edge | Desktop | 1440×900 | Chrome DevTools / BS |
| C04 | macOS Sequoia | Safari | Desktop | 1920×1080 | Chrome DevTools / BS |
| C05 | macOS Sequoia | Opera | Desktop | 1280×800 | Chrome DevTools / BS |
| C06 | macOS Sequoia | Chrome | Desktop | 1440×900 | Chrome DevTools / BS |
| C07 | Android 14 | Chrome | Phone | 390×844 | DevTools emulation |
| C08 | Android 14 | Samsung Internet | Phone | 360×800 | DevTools emulation |
| C09 | Android 14 | Chrome | Tablet | 820×1180 | DevTools emulation |
| C10 | iOS 17 | Safari | Phone | 390×844 | DevTools emulation |

### Step 0.2 — Coverage Verification (pre-test)

Print the coverage check table. Confirm all rules pass before starting screen testing:

```
OS:      Windows ✅ (C01,C02,C03) | macOS ✅ (C04,C05,C06) | Android ✅ (C07,C08,C09) | iOS ✅ (C10)
Browser: Chrome ✅ (C01,C06,C07,C09) | Firefox ✅ (C02) | Safari ✅ (C04,C10) | Edge ✅ (C03) | Opera ✅ (C05)
Device:  Desktop ✅ (C01–C06) | Tablet ✅ (C09) | Phone ✅ (C07,C08,C10)
```

### Step 0.3 — Create Directory Structure

```
artifacts/04-cross-platform/
├── screenshots/
│   ├── raw/         ← raw captures before overlay
│   └── (overlaid)   ← final with MSSV email
└── scripts/
    ├── browserstack_capture.py
    └── add_overlay.py
```

---

## Phase 1–3 — Per-Screen Test Loop

*Repeat the following steps for each screen: B1, then B2, then B4.*

---

### Step 1 — Login to EMS

Before navigating to the target screen, the agent must authenticate:

```
URL:      https://prod-dev.ems-fitus.cloud/
Email:    23127379@student.hcmus.edu.vn
Password: Minhhuy1407@
```

**Login flow (browser_subagent):**
1. Navigate to `https://prod-dev.ems-fitus.cloud/`
2. Locate the Email and Password fields
3. Fill in credentials and submit
4. Confirm redirect to authenticated home page before proceeding

> If session persists from a previous screen, the agent may skip re-login and
> directly navigate to the next screen URL.

---

### Step 2 — Navigate to Target Screen

| Screen | Navigation Path |
|--------|----------------|
| **B1** | Events List — navigate to `/` or the Events section after login |
| **B2** | Event Detail — click on any published event from B1 |
| **B4** | Registration Confirmation / QR Code — navigate to My Registrations or complete a registration to reach the QR screen |

The agent waits for the page to fully load (no spinner visible, main content rendered)
before starting capture.

---

### Step 3 — Capture All 10 Matrix Cells

For each cell C01–C10, the agent:

#### Mode A — Chrome DevTools Emulation (default, no credentials needed)

The `browser_subagent` applies viewport emulation via JavaScript injection:

```javascript
// For Phone cells (C07, C08, C10): 390×844
// For Tablet cells (C09): 820×1180
// For Desktop cells (C01–C06): 1920×1080 / 1440×900 / 1280×800
```

Steps per cell:
1. Set viewport dimensions to match the cell's target resolution
2. Inject MSSV overlay bar (see Step 4) **before** screenshot
3. Capture full-page screenshot
4. Save to `artifacts/04-cross-platform/screenshots/raw/{ScreenID}_{CellID}.png`

#### Mode B — BrowserStack Screenshots API

For desktop/real-device cells, submit to BrowserStack API:

```python
# scripts/browserstack_capture.py  (agent generates and runs this)
import requests, time, os

USERNAME    = "{BS_USERNAME}"       # provided by user
ACCESS_KEY  = "{BS_ACCESS_KEY}"     # provided by user
SUT_URL     = "https://prod-dev.ems-fitus.cloud/"

SCREENS = {
    "B1": SUT_URL,
    "B2": SUT_URL + "events/",      # agent finds actual event URL first
    "B4": SUT_URL + "registrations/"
}

MATRIX_BS = [
    # Desktop cells — BrowserStack real browsers
    {"os": "Windows", "os_version": "11",        "browser": "chrome",   "browser_version": "latest"},
    {"os": "Windows", "os_version": "11",        "browser": "firefox",  "browser_version": "latest"},
    {"os": "Windows", "os_version": "11",        "browser": "edge",     "browser_version": "latest"},
    {"os": "OS X",    "os_version": "Sequoia",   "browser": "safari",   "browser_version": "latest"},
    {"os": "OS X",    "os_version": "Sequoia",   "browser": "opera",    "browser_version": "latest"},
    {"os": "OS X",    "os_version": "Sequoia",   "browser": "chrome",   "browser_version": "latest"},
    # Mobile/Tablet cells — BrowserStack real devices
    {"device": "Samsung Galaxy S23",       "os_version": "13", "browser": "chrome"},
    {"device": "Samsung Galaxy S23 Ultra", "os_version": "13", "browser": "samsung"},
    {"device": "Samsung Galaxy Tab S9",    "os_version": "13", "browser": "chrome"},
    {"device": "iPhone 15",                "os_version": "17", "browser": "safari"},
]

for screen_id, url in SCREENS.items():
    payload = {"url": url, "browsers": MATRIX_BS, "wait_time": 5, "quality": "compressed"}
    r = requests.post(
        "https://www.browserstack.com/screenshots",
        auth=(USERNAME, ACCESS_KEY), json=payload,
        headers={"Content-Type": "application/json"}
    )
    job_id = r.json()["job"]["id"]
    print(f"[{screen_id}] Job: {job_id}")
    # Poll until done, download images
    while True:
        time.sleep(10)
        status = requests.get(f"https://www.browserstack.com/screenshots/{job_id}.json",
                              auth=(USERNAME, ACCESS_KEY)).json()
        if status["state"] == "done":
            for s in status["screenshots"]:
                fname = f"{screen_id}_{s.get('os','dev')}_{s['browser']}_{s.get('device','desktop')}.png"
                img_data = requests.get(s["image_url"]).content
                with open(f"artifacts/04-cross-platform/screenshots/raw/{fname}", "wb") as f:
                    f.write(img_data)
            break
```

> **Note on authentication**: BrowserStack Screenshots API captures public URLs.
> For authenticated screens, agent must first capture the session cookie via browser_subagent,
> then pass it as a request header to BrowserStack, OR use Chrome DevTools emulation (Mode A)
> which maintains the active login session.

---

### Step 4 — Apply MSSV Email Overlay

After all 10 raw screenshots for the current screen are saved, agent runs:

```python
# scripts/add_overlay.py  (agent generates and runs this)
from PIL import Image, ImageDraw, ImageFont
import os, glob

MSSV_EMAIL = "23127379@student.hcmus.edu.vn"
RAW_DIR    = "artifacts/04-cross-platform/screenshots/raw/"
OUT_DIR    = "artifacts/04-cross-platform/screenshots/"
os.makedirs(OUT_DIR, exist_ok=True)

for img_path in glob.glob(RAW_DIR + "*.png"):
    img  = Image.open(img_path).convert("RGBA")
    draw = ImageDraw.Draw(img)

    bar_h = 44
    # Semi-transparent black bar at bottom
    draw.rectangle([(0, img.height - bar_h), (img.width, img.height)], fill=(0, 0, 0, 200))

    try:
        font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 24)
    except Exception:
        font = ImageFont.load_default()

    draw.text((16, img.height - bar_h + 10), MSSV_EMAIL, fill=(255, 255, 255, 255), font=font)

    out_path = OUT_DIR + os.path.basename(img_path)
    img.convert("RGB").save(out_path)
    print(f"Overlaid → {out_path}")
```

---

### Step 5 — Analyse & Mark Pass/Fail

For each screenshot, agent performs DOM + visual inspection:

| Check | Method | Defect if... |
|-------|--------|--------------|
| Horizontal overflow | `document.documentElement.scrollWidth > window.innerWidth` | Scrollbar appears / content cut off |
| Element overlap | Bounding box intersection check via JS | Two elements share the same pixel space |
| Broken images | `img.naturalWidth === 0` | Placeholder icon shown |
| Text truncation | `element.scrollHeight > element.clientHeight` on text nodes | Content clipped |
| Touch target size | `element.getBoundingClientRect().height < 24` on buttons | Too small for touch |
| Vietnamese text | Visual scan — diacritics visible | Missing/garbled diacritics |
| Layout shift | Compare grid structure at viewport vs 1920 | Unexpected column stacking |

Record result per cell:
- `✅ Pass` — no defects found
- `❌ Fail` — one or more defects; record: type + 1-line description + screenshot filename

---

### Step 6 — Screen-Level Report Section

After completing all 10 cells for this screen, write the report section:

```markdown
## Screen {ScreenID} — {Screen Name}

### Matrix Results

| Cell | OS | Browser | Device | Resolution | Result | Defect | Screenshot |
|------|----|---------|--------|------------|--------|--------|------------|
| C01 | Windows 11 | Chrome | Desktop | 1920×1080 | ✅ Pass | — | B1_C01.png |
| C07 | Android 14 | Chrome | Phone | 390×844 | ❌ Fail | Sidebar overlaps main content | B1_C07.png |
...

### Coverage Verification

| Dimension | Required | Covered By | Status |
|-----------|----------|------------|--------|
| Windows   | ≥ 1 | C01, C02, C03 | ✅ |
| macOS     | ≥ 1 | C04, C05, C06 | ✅ |
| Android   | ≥ 1 | C07, C08, C09 | ✅ |
| Chrome    | ≥ 1 | C01, C06, C07, C09 | ✅ |
| Firefox   | ≥ 1 | C02 | ✅ |
| Safari    | ≥ 1 | C04, C10 | ✅ |
| Edge      | ≥ 1 | C03 | ✅ |
| Opera     | ≥ 1 | C05 | ✅ |
| Desktop   | ≥ 1 | C01–C06 | ✅ |
| Tablet    | ≥ 1 | C09 | ✅ |
| Phone     | ≥ 1 | C07, C08, C10 | ✅ |
```

---

### Step 7 — ⏸ Present Per-Screen Report & Wait for Review

After writing the report section for this screen, the agent **stops** and presents
the results to the user before moving to the next screen.

The agent must output a summary in this format:

```
## ⏸ Screen {ScreenID} — Compatibility Test Complete

**Matrix results:**
| Cell | OS | Browser | Device | Result | Defect |
...(full table)...

**Pass rate:** {N}/10 ({%})
**Coverage:** Windows ✅ | macOS ✅ | Android ✅ | Chrome ✅ | Firefox ✅ | Safari ✅ | Edge ✅ | Opera ✅ | Desktop ✅ | Tablet ✅ | Phone ✅
**Fail cells:** {list cell IDs with defect descriptions, or "None"}
**Screenshots:** saved to artifacts/04-cross-platform/screenshots/{ScreenID}_*.png

Please review the above results.
→ Reply "OK" or "Proceed" to continue to the next screen.
→ Reply with corrections if any cell result needs adjustment.
```

**Agent waits here.** Do NOT proceed to the next screen until the user explicitly approves.

---

### ↩ After User Approves → Next Screen

Once the user replies with approval:
- If screens remain → go back to **Step 1** (login check) for the next screen
- If all 3 screens done → proceed to Phase 4

---

## Phase 4 — Compile Final Report

After all 3 screen loops complete, assemble `cross-platform-report.md`:

```markdown
# Cross-Platform Compatibility Report — EMS Scenario B

| Field | Value |
|-------|-------|
| Student | Thái Minh Huy — 23127379 |
| Screens | B1, B2, B4 |
| Matrix | 10 cells per screen × 3 screens = 30 total |
| Date | {date} |
| Tool | Chrome DevTools emulation / BrowserStack API |

---
{Screen B1 section}
{Screen B2 section}
{Screen B4 section}

---
## Cross-Screen Summary

| Screen | Cells | Pass | Fail | Pass Rate |
|--------|-------|------|------|-----------|
| B1 — Events List | 10 | ? | ? | ?% |
| B2 — Event Detail | 10 | ? | ? | ?% |
| B4 — QR / Confirmation | 10 | ? | ? | ?% |
| **Total** | **30** | **?** | **?** | **?%** |

## Most Common Defects

| Defect Type | Count | Affected Cells |
|-------------|-------|----------------|
...
```

---

## Output Deliverables

All saved to `artifacts/04-cross-platform/`:

| File/Folder | Description |
|-------------|-------------|
| `cross-platform-report.md` | Full report: 3 screen sections + summary |
| `screenshots/{ScreenID}_{CellID}.png` | 30 overlaid screenshots (final) |
| `screenshots/raw/{ScreenID}_{CellID}.png` | 30 raw screenshots |
| `scripts/browserstack_capture.py` | BrowserStack capture script |
| `scripts/add_overlay.py` | MSSV overlay script |

---

## Execution Triggers

### Trigger A — BrowserStack API mode
```
Run the cross-platform-matrix-generator skill.

Mode: BrowserStack API
BrowserStack Username: {your_username}
BrowserStack Access Key: {your_access_key}
Screens: B1, B2, B4
MSSV email: 23127379@student.hcmus.edu.vn
SUT URL: https://prod-dev.ems-fitus.cloud/
```

### Trigger B — Chrome DevTools emulation (no credentials)
```
Run the cross-platform-matrix-generator skill.

Mode: Chrome DevTools emulation
Screens: B1, B2, B4
MSSV email: 23127379@student.hcmus.edu.vn
SUT URL: https://prod-dev.ems-fitus.cloud/

Note: No BrowserStack credentials available. Use local Chrome emulation only.
```

---

## Agent Self-Check Checklist

**Phase 0:**
- [ ] Matrix defined with 10 cells covering all OS/browser/device rules
- [ ] `artifacts/04-cross-platform/screenshots/raw/` directory created
- [ ] Python + Pillow available (`python3 -c "import PIL"`)

**Per Screen (×3):**
- [ ] Login successful (authenticated session confirmed)
- [ ] Navigated to correct screen URL
- [ ] 10 screenshots captured and saved to `raw/`
- [ ] Overlay applied — all 10 final screenshots in `screenshots/`
- [ ] Each cell marked Pass/Fail with defect notes
- [ ] `ai-audit-logger` invoked to log this stage

**Phase 4:**
- [ ] `cross-platform-report.md` contains all 3 screen sections
- [ ] Cross-screen summary table complete
- [ ] Total: 30 overlaid screenshots exist
- [ ] Coverage verification passes for all 3 screens
- [ ] `ai-audit-logger` invoked to log this stage

---

## Integration

- **Input from**: `checklist-executor`, `heuristic-usability-evaluator` (same screens)
- **Output to**: `report-assembler` (report + Fail findings)
- **Logs to**: `ai-audit-logger`
