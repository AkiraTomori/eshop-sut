# Phase 0 — Cross-Platform Matrix Setup

## Scope

| Field | Value |
|-------|-------|
| SUT | EMS — Event Management System |
| Scenario | B |
| Screens | B1 — Events List; B2 — Event Detail; B4 — Registration Confirmation / QR Code |
| Matrix size | 10 cells, reused for each screen |
| Planned total | 30 executions (10 cells × 3 screens) |
| MSSV overlay | `23127379@student.hcmus.edu.vn` |
| Capture mode | To be selected before screenshot execution: BrowserStack API or Chrome DevTools emulation |
| Setup date | 2026-07-30 |

## Reusable 10-Cell Matrix

| Cell ID | Target OS | Target Browser | Device Class | Viewport | Supported Execution Mode |
|---------|-----------|----------------|--------------|----------|--------------------------|
| C01 | Windows 11 | Chrome | Desktop | 1920×1080 | Chrome DevTools emulation / BrowserStack |
| C02 | Windows 11 | Firefox | Desktop | 1920×1080 | Chrome DevTools emulation / BrowserStack |
| C03 | Windows 11 | Edge | Desktop | 1440×900 | Chrome DevTools emulation / BrowserStack |
| C04 | macOS Sequoia | Safari | Desktop | 1920×1080 | Chrome DevTools emulation / BrowserStack |
| C05 | macOS Sequoia | Opera | Desktop | 1280×800 | Chrome DevTools emulation / BrowserStack |
| C06 | macOS Sequoia | Chrome | Desktop | 1440×900 | Chrome DevTools emulation / BrowserStack |
| C07 | Android 14 | Chrome | Phone | 390×844 | Chrome DevTools emulation / BrowserStack |
| C08 | Android 14 | Samsung Internet | Phone | 360×800 | Chrome DevTools emulation / BrowserStack |
| C09 | Android 14 | Chrome | Tablet | 820×1180 | Chrome DevTools emulation / BrowserStack |
| C10 | iOS 17 | Safari | Phone | 390×844 | Chrome DevTools emulation / BrowserStack |

> In Chrome DevTools mode, the OS and non-Chromium browser labels are target
> compatibility profiles only; viewport emulation does not reproduce those native
> browser engines. BrowserStack or equivalent real-browser infrastructure is
> required for claims about actual Firefox, Safari, Edge, Opera, Samsung Internet,
> Windows, macOS, Android, or iOS behavior.

## Pre-Test Coverage Verification

### Operating Systems

| Required Target | Covered By | Count | Status |
|-----------------|------------|-------|--------|
| Windows | C01, C02, C03 | 3 | ✅ Pass |
| macOS | C04, C05, C06 | 3 | ✅ Pass |
| Android | C07, C08, C09 | 3 | ✅ Pass |

Additional coverage: iOS is covered by C10.

### Browsers

| Required Browser | Covered By | Count | Status |
|------------------|------------|-------|--------|
| Chrome | C01, C06, C07, C09 | 4 | ✅ Pass |
| Firefox | C02 | 1 | ✅ Pass |
| Safari | C04, C10 | 2 | ✅ Pass |
| Edge | C03 | 1 | ✅ Pass |
| Opera | C05 | 1 | ✅ Pass |

Additional coverage: Samsung Internet is covered by C08.

### Device Classes

| Required Class | Covered By | Count | Status |
|----------------|------------|-------|--------|
| Desktop | C01–C06 | 6 | ✅ Pass |
| Tablet | C09 | 1 | ✅ Pass |
| Phone | C07, C08, C10 | 3 | ✅ Pass |

## Coverage Decision

All mandatory Phase 0 rules pass:

- Windows, macOS, and Android each have at least one cell.
- Chrome, Firefox, Safari, Edge, and Opera each have at least one cell.
- Desktop, tablet, and phone each have at least one cell.
- The same matrix can be reused for B1, B2, and B4.

**Phase 0 matrix status: ✅ Ready for review.**

## Post-Approval Execution Note

During B1 execution on 2026-07-30, BrowserStack's authenticated Automate
inventory showed that the approved C05 combination, macOS Sequoia + Opera, was
not available. The newest executable macOS/Opera substitute was macOS Mojave +
Opera 12.15. It was executed and documented as a deviation; its result must not
be presented as current Opera-on-Sequoia coverage.

For C09, the available Android 14 tablet was Samsung Galaxy Tab A9 Plus rather
than Galaxy Tab S9. The Android, Chrome, and tablet coverage dimensions remained
the same.

## Directory Layout

```text
artifacts/04-cross-platform/
├── phase-0-matrix-setup.md
├── screenshots/
│   └── raw/
└── scripts/
```

The `raw/` directory is reserved for captures before the MSSV overlay.
The parent `screenshots/` directory will contain final overlaid evidence.
Capture and overlay scripts will be added when the execution mode is selected.

## Pre-Execution Gate

- [x] One 10-cell matrix defined for all three screens.
- [x] Mandatory OS coverage verified.
- [x] Mandatory browser coverage verified.
- [x] Mandatory device-class coverage verified.
- [x] Raw and final screenshot locations defined.
- [x] Scripts location defined.
- [x] Python 3 and Pillow available (`Pillow 11.3.0`).
- [ ] Capture mode selected.
- [ ] Live EMS authentication verified.
- [ ] Screenshot execution started.

No live EMS navigation or screenshot capture is part of Phase 0.
