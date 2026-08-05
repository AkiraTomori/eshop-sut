# B2 Cross-Platform Compatibility Test Report

## 1. Report Information

| Field | Value |
|-------|-------|
| Project | HW03 — GUI, Usability, and Cross-Platform Testing on EMS |
| Student | Thái Minh Huy |
| MSSV | 23127379 |
| Group | 06 |
| Scenario | B — Student / Event Attendee |
| Screen | B2 — Event Detail |
| Tested event | `https://prod-dev.ems-fitus.cloud/events/2` |
| Execution date | 2026-07-30 |
| Test infrastructure | BrowserStack Automate with Selenium |
| Matrix size | 10 cells |
| Final result | 5 Pass, 5 Fail |
| Pass rate | 50% |

## 2. Executive Summary

Screen B2 was exercised in ten BrowserStack desktop, phone, and tablet
configurations. Nine modern configurations authenticated and reached the same
published event detail page. The legacy Opera substitute could not negotiate
the EMS TLS connection.

All five modern desktop cells passed. Four mobile/tablet cells failed because
the same event and registration periods changed by ten hours relative to the
desktop baseline. The three phone layouts also kept the Save action beside a
long Vietnamese heading, forcing the title into an excessively narrow column;
the floating Share action covered content as the page scrolled.

## 3. Test Procedure

For every cell, the automated test:

1. Started the requested BrowserStack browser or real device.
2. Opened the EMS login page and authenticated with the student account.
3. Opened B1 and selected the first visible published event.
4. Confirmed navigation to `/events/2` and waited for B2 to render.
5. Collected DOM diagnostics for overflow, broken images, clipped text,
   touch-target candidates, viewport size, and Vietnamese text.
6. Captured a raw screenshot and applied the required MSSV email overlay.
7. Compared event details and responsive layout with the desktop baseline.

## 4. Matrix Results

| Cell | Executed Platform | Browser | Device | Target Viewport | Actual CSS Viewport | Result | Defect or Observation | Evidence |
|------|-------------------|---------|--------|-----------------|---------------------|--------|-----------------------|----------|
| C01 | Windows 11 | Chrome | Desktop | 1920×1080 | 1904×929 | ✅ Pass | B2 rendered without horizontal overflow or broken images; event time was 11:30–14:00. | [B2_C01.png](screenshots/B2_C01.png) |
| C02 | Windows 11 | Firefox | Desktop | 1920×1080 | 1904×986 | ✅ Pass | Layout and event details matched the desktop baseline. | [B2_C02.png](screenshots/B2_C02.png) |
| C03 | Windows 11 | Edge | Desktop | 1440×900 | 1416×733 | ✅ Pass | Narrower desktop layout remained readable and usable. | [B2_C03.png](screenshots/B2_C03.png) |
| C04 | macOS Sequoia | Safari | Desktop | 1920×1080 | 1920×1028 | ✅ Pass | B2 and Vietnamese diacritics rendered correctly; event time matched the desktop baseline. | [B2_C04.png](screenshots/B2_C04.png) |
| C05 | macOS Mojave substitute | Opera 12.15 | Desktop | 1280×800 | EMS not reached | ❌ Fail / limitation | BrowserStack's only macOS/Opera substitute failed TLS negotiation before login. The approved Sequoia target was unavailable. | [B2_C05.png](screenshots/B2_C05.png) |
| C06 | macOS Sequoia | Chrome | Desktop | 1440×900 | 1440×757 | ✅ Pass | B2 rendered consistently with the other desktop cells. | [B2_C06.png](screenshots/B2_C06.png) |
| C07 | Android 14 — Galaxy S24 | Chrome | Phone | 390×844 | 360×647 | ❌ Fail | Event time changed to 01:30–04:00; the long title was squeezed beside Save and Share overlaid content. | [B2_C07.png](screenshots/B2_C07.png) |
| C08 | Android 14 — Galaxy S24 | Samsung Internet | Phone | 360×800 | 360×607 | ❌ Fail | Same time shift and responsive heading/action defects as C07. | [B2_C08.png](screenshots/B2_C08.png) |
| C09 | Android 14 — Galaxy Tab A9 Plus | Chrome | Tablet | 820×1180 | 800×1112 | ❌ Fail | Layout was readable, but event and registration periods were ten hours earlier than desktop. | [B2_C09.png](screenshots/B2_C09.png) |
| C10 | iOS 17 — iPhone 15 | Safari | Phone | 390×844 | 393×659 | ❌ Fail | Same time shift; Save constrained the title and Share floated over event content. | [B2_C10.png](screenshots/B2_C10.png) |

## 5. Coverage Verification

| Dimension | Required | Covered By | Status |
|-----------|----------|------------|--------|
| Windows | ≥1 | C01, C02, C03 | ✅ |
| macOS | ≥1 | C04, C05 substitute, C06 | ✅ |
| Android | ≥1 | C07, C08, C09 | ✅ |
| iOS — additional | — | C10 | ✅ |
| Chrome | ≥1 | C01, C06, C07, C09 | ✅ |
| Firefox | ≥1 | C02 | ✅ |
| Safari | ≥1 | C04, C10 | ✅ |
| Edge | ≥1 | C03 | ✅ |
| Opera | ≥1 | C05 substitute only | ⚠️ Conditional |
| Desktop | ≥1 | C01–C06 | ✅ |
| Tablet | ≥1 | C09 | ✅ |
| Phone | ≥1 | C07, C08, C10 | ✅ |

Opera coverage is conditional: BrowserStack did not offer Opera on macOS
Sequoia. C05 is evidence for the closest executable substitute, not a claim
about current Opera compatibility.

## 6. Detailed Findings

### CP-B2-01 — Event Dates Change with Device Time Zone

| Field | Value |
|-------|-------|
| Type | Functional consistency / time-zone handling |
| Affected cells | C07, C08, C09, C10 |
| Severity | 3 — Major |
| Desktop event period | 28/06/2026 11:30–14:00 |
| Mobile/tablet event period | 28/06/2026 01:30–04:00 |
| Desktop registration start | 16/06/2026 01:00 |
| Mobile/tablet registration start | 15/06/2026 15:00 |

**Expected:** The configured academic event periods remain fixed in their
authoritative event time zone on every device.

**Actual:** Android and iOS cells display the same values ten hours earlier than
Windows and macOS desktop cells.

**Impact:** An attendee may register, arrive, or attempt check-in at the wrong
time.

**Recommendation:** Store the event time-zone identifier and format every event,
registration, and check-in timestamp explicitly in that zone, such as
`Asia/Ho_Chi_Minh`, instead of using the device default.

### CP-B2-02 — Phone Heading and Floating Actions Compete with Content

| Field | Value |
|-------|-------|
| Type | Responsive layout / overlap |
| Affected cells | C07, C08, C10 |
| Severity | 2 — Moderate |

**Expected:** At phone widths, the title and actions reflow into separate rows,
and floating actions do not cover readable content.

**Actual:** Save remains beside the long Vietnamese heading, reducing the title
to a narrow column with excessive line wrapping. The Share control floats over
the heading or description region.

**Recommendation:** Stack Save beneath or above the heading below the phone
breakpoint and reserve a safe content gutter for Share, or move Share into the
normal action row.

### CP-B2-03 — Approved Opera Target Is Not Executable

| Field | Value |
|-------|-------|
| Type | Test-platform limitation / legacy TLS |
| Affected cell | C05 |
| Severity | 3 — Major for the substitute; inconclusive for current Opera |

BrowserStack offered no macOS Sequoia + Opera Automate target. Its available
macOS Mojave + Opera 12.15 substitute displayed “Unable to complete secure
transaction” with fatal TLS error 40 before EMS loaded.

**Recommendation:** Define the supported-browser baseline and validate a current
Opera build through another real-browser service or a controlled local machine.

## 7. Additional Observations

- No horizontal document overflow was detected in the nine authenticated cells.
- No visible broken image was detected in those cells.
- Vietnamese diacritics rendered correctly in all authenticated cells.
- C07 and C08 required the Enter-key login fallback after the first click did
  not redirect. This authentication observation did not independently fail B2.
- Phone diagnostics found nine CSS-clipped text candidates. The screenshots
  establish the heading/action problem; automated candidates were not counted
  as separate defects without visual confirmation.
- BrowserStack real-device PNG dimensions differ from CSS viewports because of
  device pixel ratio and mobile browser chrome.

## 8. Evidence Inventory

| Evidence | Location | Count |
|----------|----------|-------|
| Raw screenshots | `screenshots/raw/B2_C01.png` … `B2_C10.png` | 10 |
| MSSV-overlaid screenshots | `screenshots/B2_C01.png` … `B2_C10.png` | 10 |
| C05 diagnostic source | `screenshots/diagnostics/B2_C05_error.png` | 1 |
| BrowserStack/DOM results | `B2-browserstack-results.json` | 10 records |
| Capture harness | `scripts/browserstack_capture.py` | 1 |
| Overlay utility | `scripts/add_overlay.py` | 1 |

## 9. Conclusion

B2 achieved a 50% matrix pass rate: five modern desktop cells passed, while the
Opera substitute and all four mobile/tablet cells failed. The highest-priority
product defect is time-zone handling because it changes operational event
information. The phone heading/action layout should also be corrected before
release.
