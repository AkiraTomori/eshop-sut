# Cross-Platform Compatibility Matrix — Template

> Replace all `{placeholders}` with actual values.

---

# Cross-Browser / Cross-Platform Report — Scenario {A|B|C|D}

**Author**: {Student Name} — {MSSV}
**Date**: {YYYY-MM-DD}
**Testing Tool**: {BrowserStack / LambdaTest / Real Devices}
**Screens Tested**: {ScreenID1}, {ScreenID2}, {ScreenID3}

---

## Matrix Configuration

### Dimensions

| Dimension | Values |
|-----------|--------|
| **Operating Systems (3)** | Windows 11, macOS 15, Android 14 |
| **Browsers (5)** | Chrome 126, Firefox 128, Safari 18, Edge 126, Opera 112 |
| **Device Classes (3)** | Desktop (1920×1080), Tablet (1024×768), Phone (390×844) |

### Selected Combinations (per screen)

| # | OS | Browser | Device | Resolution |
|---|-----|---------|--------|------------|
| 1 | Windows 11 | Chrome 126 | Desktop | 1920×1080 |
| 2 | Windows 11 | Firefox 128 | Desktop | 1920×1080 |
| 3 | Windows 11 | Edge 126 | Desktop | 1920×1080 |
| 4 | macOS 15 | Safari 18 | Desktop | 1440×900 |
| 5 | macOS 15 | Chrome 126 | Desktop | 1440×900 |
| 6 | Android 14 | Chrome 126 | Phone | 390×844 |
| 7 | Android 14 | Opera 112 | Tablet | 1024×768 |
| 8 | Android 14 | Samsung Internet | Phone | 360×800 |
| 9 | iOS 17 | Safari 18 | Phone | 390×844 |
| 10 | iOS 17 | Chrome 126 | Tablet | 820×1180 |

---

## Screen 1: {X1} — {Screen Name}

### Results

| # | OS | Browser | Device | Result | Defect Notes | Screenshot |
|---|-----|---------|--------|--------|-------------|------------|
| 1 | Windows 11 | Chrome 126 | Desktop | ✅ Pass | — | `X1_Win11_Chrome_Desktop.png` |
| 2 | Windows 11 | Firefox 128 | Desktop | ✅ Pass | — | `X1_Win11_Firefox_Desktop.png` |
| 3 | Windows 11 | Edge 126 | Desktop | ✅ Pass | — | `X1_Win11_Edge_Desktop.png` |
| 4 | macOS 15 | Safari 18 | Desktop | ❌ Fail | Date picker renders differently | `X1_macOS15_Safari_Desktop.png` |
| 5 | macOS 15 | Chrome 126 | Desktop | ✅ Pass | — | `X1_macOS15_Chrome_Desktop.png` |
| 6 | Android 14 | Chrome 126 | Phone | ❌ Fail | Table overflows horizontally | `X1_Android14_Chrome_Phone.png` |
| 7 | Android 14 | Opera 112 | Tablet | ✅ Pass | — | `X1_Android14_Opera_Tablet.png` |
| 8 | Android 14 | Samsung Internet | Phone | ❌ Fail | Sidebar overlaps content | `X1_Android14_Samsung_Phone.png` |
| 9 | iOS 17 | Safari 18 | Phone | ✅ Pass | — | `X1_iOS17_Safari_Phone.png` |
| 10 | iOS 17 | Chrome 126 | Tablet | ✅ Pass | — | `X1_iOS17_Chrome_Tablet.png` |

### Coverage Verification

| Dimension | Required ≥ 1 | Actual | ✅/❌ |
|-----------|-------------|--------|-------|
| Windows | ≥ 1 | 3 | ✅ |
| macOS | ≥ 1 | 2 | ✅ |
| Android | ≥ 1 | 3 | ✅ |
| iOS | ≥ 1 | 2 | ✅ |
| Chrome | ≥ 1 | 4 | ✅ |
| Firefox | ≥ 1 | 1 | ✅ |
| Safari | ≥ 1 | 2 | ✅ |
| Edge | ≥ 1 | 1 | ✅ |
| Opera | ≥ 1 | 1 | ✅ |
| Desktop | ≥ 1 | 5 | ✅ |
| Tablet | ≥ 1 | 2 | ✅ |
| Phone | ≥ 1 | 3 | ✅ |

---

## Screen 2: {X2} — {Screen Name}

*(Same format as Screen 1)*

---

## Screen 3: {X3} — {Screen Name}

*(Same format as Screen 1)*

---

## Cross-Screen Summary

| Screen | Cells Tested | Pass | Fail | Pass Rate |
|--------|-------------|------|------|-----------|
| {X1} — {name} | 10 | 7 | 3 | 70.0% |
| {X2} — {name} | 10 | 9 | 1 | 90.0% |
| {X3} — {name} | 10 | 8 | 2 | 80.0% |
| **Total** | **30** | **24** | **6** | **80.0%** |

## Most Common Defects

| Defect Type | Count | Affected Combinations | Screens |
|-------------|-------|----------------------|---------|
| Table overflow | 2 | Android/Phone | X1, X3 |
| Sidebar overlap | 1 | Android/Phone | X1 |
| Date picker rendering | 1 | macOS/Safari | X1 |
| Touch target too small | 2 | iOS+Android/Phone | X2, X3 |

---

## Tools & Evidence

- **Testing tool**: {BrowserStack / LambdaTest}
- **Email overlay**: `{MSSV}@{domain}.edu.vn`
- **Screenshot directory**: `screenshots/cross-platform/`
- All screenshots show browser, OS, device identification alongside EMS URL
