# B4 Cross-Platform Compatibility Test Report

## 1. Report Information

| Field | Value |
|-------|-------|
| Project | HW03 — GUI, Usability, and Cross-Platform Testing on EMS |
| Student | Thái Minh Huy |
| MSSV | 23127379 |
| Group | 06 |
| Scenario | B — Student / Event Attendee |
| Screen | B4 — Registration / Check-in QR Ticket |
| Tested URL | `https://prod-dev.ems-fitus.cloud/profile` |
| Tested state | `Check-in QR Code` dialog open |
| Execution date | 2026-07-30 |
| Test infrastructure | BrowserStack Automate with Selenium |
| Matrix size | 10 cells |
| Final result | 6 Pass, 4 Fail |
| Final pass rate | 60% |

## 2. Executive Summary

B4 was exercised across the standard ten-cell matrix with the live profile-level
check-in QR dialog open. Nine modern desktop/mobile configurations authenticated,
opened `/profile`, and displayed a readable QR code, student identifier, close
control, and Download action. The QR dialog remained inside the visible viewport
on desktop, tablet, Android phones, and iPhone.

Six cells passed. C05 failed because BrowserStack's only macOS/Opera substitute
could not negotiate EMS TLS. The three phone cells failed because the profile
action row and surrounding page created horizontal overflow and clipped the
Change Password action. C10 also exposed an iOS Safari activation risk: WebDriver's
native click focused the QR button without opening the dialog, and Enter also
failed; a JavaScript click was required.

## 3. Test Procedure

For every matrix cell, the automated test:

1. Started the requested BrowserStack browser or real device.
2. Logged into EMS with the Scenario B student account.
3. Navigated directly to `/profile`.
4. Located the visible QR Code action and attempted to activate it.
5. Waited for the `Check-in QR Code` dialog.
6. Collected DOM diagnostics for page overflow, modal bounds, viewport size,
   broken images, clipped text, and Vietnamese rendering.
7. Captured a raw screenshot and applied the required MSSV email overlay.
8. Visually checked the QR, modal controls, surrounding layout, and clipping.

## 4. Matrix Results

| Cell | Executed Platform | Browser | Device | Target Viewport | Actual CSS Viewport | Result | Defect or Observation | Evidence |
|------|-------------------|---------|--------|-----------------|---------------------|--------|-----------------------|----------|
| C01 | Windows 11 | Chrome | Desktop | 1920×1080 | 1904×929 | ✅ Pass | QR dialog was centred, fully visible, and readable; no page overflow or broken images. | [B4_C01.png](screenshots/B4_C01.png) |
| C02 | Windows 11 | Firefox | Desktop | 1920×1080 | 1904×986 | ✅ Pass | QR, identifier, close control, and Download action rendered correctly. | [B4_C02.png](screenshots/B4_C02.png) |
| C03 | Windows 11 | Edge | Desktop | 1440×900 | 1416×733 | ✅ Pass | Dialog remained fully visible at the narrower desktop viewport. | [B4_C03.png](screenshots/B4_C03.png) |
| C04 | macOS Sequoia | Safari | Desktop | 1920×1080 | 1920×1028 | ✅ Pass | QR dialog opened with a native click and rendered correctly. | [B4_C04.png](screenshots/B4_C04.png) |
| C05 | macOS Mojave substitute | Opera 12.15 | Desktop | 1280×800 | EMS not reached | ❌ Fail / limitation | Legacy Opera substitute failed TLS negotiation before login; approved Sequoia target was unavailable. | [B4_C05.png](screenshots/B4_C05.png) |
| C06 | macOS Sequoia | Chrome | Desktop | 1440×900 | 1440×757 | ✅ Pass | QR dialog and all essential actions rendered correctly. | [B4_C06.png](screenshots/B4_C06.png) |
| C07 | Android 14 — Galaxy S24 | Chrome | Phone | 390×844 | 360px visible device width; 457px layout viewport | ❌ Fail | QR dialog fit and was readable, but the page had horizontal overflow and clipped the third profile action. | [B4_C07.png](screenshots/B4_C07.png) |
| C08 | Android 14 — Galaxy S24 | Samsung Internet | Phone | 360×800 | 360px visible device width; 457px layout viewport | ❌ Fail | Same page overflow/action clipping as C07; QR dialog itself remained usable. | [B4_C08.png](screenshots/B4_C08.png) |
| C09 | Android 14 — Galaxy Tab A9 Plus | Chrome | Tablet | 820×1180 | 800×1112 | ✅ Pass | Dialog fit entirely within the viewport; QR and controls remained readable. | [B4_C09.png](screenshots/B4_C09.png) |
| C10 | iOS 17 — iPhone 15 | Safari | Phone | 390×844 | 393×659 | ❌ Fail | Page overflow clipped the action row; native click and Enter did not open QR, requiring JavaScript activation. | [B4_C10.png](screenshots/B4_C10.png) |

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

Opera coverage is conditional because BrowserStack did not offer Opera on macOS
Sequoia. C05 describes the closest executable substitute and must not be treated
as evidence about current Opera.

## 6. Detailed Findings

### CP-B4-01 — Phone Profile Page Creates Horizontal Overflow

| Field | Value |
|-------|-------|
| Type | Responsive layout / horizontal overflow |
| Affected cells | C07, C08, C10 |
| Severity | 3 — Major |

**Expected:** Profile actions and content reflow within the phone viewport without
horizontal scrolling or clipped actions.

**Actual:** The QR Code, Edit Profile, and Change Password actions remain in one
wide row. Change Password extends beyond the visible right edge, and DOM
diagnostics report document-level horizontal overflow.

**Impact:** Phone users may not discover or reach all profile actions and may
accidentally pan the page horizontally.

**Recommendation:** Stack or wrap the profile actions at phone breakpoints,
remove minimum widths that exceed the viewport, and validate at 320–393 CSS px.

### CP-B4-02 — iOS Safari QR Trigger Does Not Activate Normally

| Field | Value |
|-------|-------|
| Type | Browser interaction / activation |
| Affected cell | C10 |
| Severity | 3 — Major, pending physical-device confirmation |
| Native click | Focused the QR button; dialog did not open |
| Enter activation | Dialog did not open |
| JavaScript click | Dialog opened |
| Diagnostic evidence | [Native activation failure](screenshots/diagnostics/B4_C10_native_activation_error.png) |

**Expected:** A normal tap/click and keyboard activation open the QR dialog.

**Actual:** BrowserStack iOS Safari required programmatic JavaScript activation.

**Impact:** If reproduced with a physical tap, iPhone users cannot display their
check-in ticket.

**Recommendation:** Use a native button event handler that responds consistently
to pointer, click, and keyboard activation. Reconfirm this finding on a physical
iPhone before release classification.

### CP-B4-03 — Approved Opera Target Is Not Executable

| Field | Value |
|-------|-------|
| Type | Test-platform limitation / legacy TLS |
| Affected cell | C05 |
| Severity | 3 — Major for the substitute; inconclusive for current Opera |

BrowserStack's only executable macOS/Opera pairing was Mojave with Opera 12.15.
It displayed “Unable to complete secure transaction” with fatal TLS error 40
before EMS loaded.

**Recommendation:** Publish a supported-browser baseline and validate current
Opera using another real-browser service or a controlled local machine.

## 7. Confirmed Compatible QR Behavior

- The QR remained sharp and visually complete in all nine authenticated cells.
- The dialog, close control, student ID, and Download action remained visible.
- Modal bounds stayed within each reported browser viewport.
- Android and iOS phone dialogs adapted from 448 CSS px on desktop to
  approximately the available phone width.
- No visible broken image was detected.
- Vietnamese diacritics in the surrounding profile content rendered correctly.

## 8. Additional Observations and Limitations

- C07 and C08 needed the Enter-key fallback after the first Login click did not
  redirect. This authentication observation did not independently fail B4.
- The first-pass QR visual selector selected a small SVG icon in C01–C09 rather
  than the QR canvas. QR presence and integrity for those cells were therefore
  established by direct screenshot review; the selector was corrected before
  the C10 retry.
- The BrowserStack iOS activation result is a strong compatibility signal but
  should be confirmed by a human tap on a physical iPhone.
- Real-device PNG dimensions differ from CSS viewports because of device pixel
  ratio and mobile browser chrome.

## 9. Evidence Inventory

| Evidence | Location | Count |
|----------|----------|-------|
| Raw screenshots | `screenshots/raw/B4_C01.png` … `B4_C10.png` | 10 |
| MSSV-overlaid screenshots | `screenshots/B4_C01.png` … `B4_C10.png` | 10 |
| C05 failure diagnostic | `screenshots/diagnostics/B4_C05_error.png` | 1 |
| C10 native-activation diagnostic | `screenshots/diagnostics/B4_C10_native_activation_error.png` | 1 |
| BrowserStack/DOM results | `B4-browserstack-results.json` | 10 records |
| Capture harness | `scripts/browserstack_capture.py` | 1 |
| Overlay utility | `scripts/add_overlay.py` | 1 |

## 10. Conclusion

B4 achieved a final 60% matrix pass rate: five modern desktop cells and
the Android tablet passed, while C05 and all three phone cells failed. The QR
dialog presentation itself was compatible in every authenticated configuration.
The surrounding phone overflow is confirmed; the iOS activation defect should
receive physical-device confirmation because it can block check-in.
