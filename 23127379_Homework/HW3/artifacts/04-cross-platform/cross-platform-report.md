# Cross-Platform Compatibility Report — EMS Scenario B

## Report Status

| Field | Value |
|-------|-------|
| Student | Thái Minh Huy — 23127379 |
| Screens executed | B1 — Events List; B2 — Event Detail; B4 — Registration / QR |
| Review status | B1, B2, and B4 approved; Phase 4 finalised |
| Matrix | 10 cells per screen; 30 cells executed |
| Execution date | 2026-07-30 |
| Execution infrastructure | BrowserStack Automate with Selenium |
| Evidence | 30 raw screenshots and 30 MSSV-overlaid screenshots |
| Final combined result | 16 Pass, 14 Fail — 53.3% pass rate |
| AI audit status | ✅ B1–B4 interactions logged; critique intentionally deferred |

All three screens were executed and approved at their review checkpoints. This
document is the final Task 3 cross-platform compatibility report.

Detailed standalone versions are available in
[`B1-cross-platform-report.md`](B1-cross-platform-report.md) and
[`B2-cross-platform-report.md`](B2-cross-platform-report.md), with the
approved B4 report in
[`B4-cross-platform-report.md`](B4-cross-platform-report.md).

## Method

Each supported BrowserStack session opened the EMS login page and authenticated
with the student account. B1 sessions captured `/dashboard`; B2 sessions selected
the first visible published event and captured `/events/2`; B4 sessions opened
`/profile` and activated the check-in QR dialog. Each session collected DOM
diagnostics before capturing the rendered viewport. The final evidence files
have the required `23127379@student.hcmus.edu.vn` overlay.

The automated checks covered:

- horizontal document overflow;
- broken visible images;
- CSS-clipped text candidates;
- small interactive-element candidates;
- Vietnamese diacritic rendering;
- requested versus actual browser viewport.

All screenshots were also reviewed visually. Intentional card line-clamping and
the empty-thumbnail placeholder were not counted as defects.

## BrowserStack Availability Deviation

The approved C05 target was **macOS Sequoia + Opera at 1280×800**. BrowserStack's
authenticated Automate inventory offered no Opera version on Sequoia. Its newest
available macOS/Opera pairing was **macOS Mojave + Opera 12.15**. That substitute
was executed at the nearest supported resolution, 1280×1024.

The C05 evidence therefore does **not** establish current Opera-on-Sequoia
behavior. It establishes that the only executable BrowserStack macOS/Opera
combination could not access EMS.

## Screen B1 — Events List

### Matrix Results

| Cell | Executed OS | Browser | Device | Target Viewport | Captured Viewport / Image | Result | Defect or Observation | Screenshot |
|------|-------------|---------|--------|-----------------|---------------------------|--------|-----------------------|------------|
| C01 | Windows 11 | Chrome | Desktop | 1920×1080 | 1904×929 CSS / 1904×929 PNG | ✅ Pass | No horizontal overflow or broken images; primary layout rendered correctly. | [B1_C01.png](screenshots/B1_C01.png) |
| C02 | Windows 11 | Firefox | Desktop | 1920×1080 | 1904×986 CSS / 1904×986 PNG | ✅ Pass | B1 rendered correctly. Login click stalled, but Enter submission authenticated successfully; tracked as an execution observation. | [B1_C02.png](screenshots/B1_C02.png) |
| C03 | Windows 11 | Edge | Desktop | 1440×900 | 1416×733 CSS / 1416×733 PNG | ✅ Pass | No horizontal overflow or broken images; layout remained usable. | [B1_C03.png](screenshots/B1_C03.png) |
| C04 | macOS Sequoia | Safari | Desktop | 1920×1080 | 1920×1028 CSS / 1920×1028 PNG | ✅ Pass | No horizontal overflow or broken images; Vietnamese text rendered correctly. | [B1_C04.png](screenshots/B1_C04.png) |
| C05 | macOS Mojave substitute | Opera 12.15 | Desktop | 1280×800 | No EMS viewport / 1280×1024 PNG | ❌ Fail | EMS was unreachable: Opera reported “Unable to complete secure transaction,” fatal TLS error 40. Approved Sequoia target was unavailable. | [B1_C05.png](screenshots/B1_C05.png) |
| C06 | macOS Sequoia | Chrome | Desktop | 1440×900 | 1440×757 CSS / 1440×757 PNG | ✅ Pass | No horizontal overflow or broken images; primary layout rendered correctly. | [B1_C06.png](screenshots/B1_C06.png) |
| C07 | Android 14 — Galaxy S24 | Chrome | Phone | 390×844 | 360×647 CSS / 1080×2109 PNG | ❌ Fail | Event time shifted from 11:30–14:00 to 01:30–04:00; floating Filters and Share controls overlap spotlight content. | [B1_C07.png](screenshots/B1_C07.png) |
| C08 | Android 14 — Galaxy S24 | Samsung Internet | Phone | 360×800 | 360×607 CSS / 1080×2109 PNG | ❌ Fail | Same time-zone shift; floating Filters control obscures the date row and Share overlaps spotlight content. | [B1_C08.png](screenshots/B1_C08.png) |
| C09 | Android 14 — Galaxy Tab A9 Plus | Chrome | Tablet | 820×1180 | 800×1112 CSS / 1200×1812 PNG | ❌ Fail | Event time shifted to 01:30–04:00; both in-flow and floating Filters controls appear, producing duplicate actions. | [B1_C09.png](screenshots/B1_C09.png) |
| C10 | iOS 17 — iPhone 15 | Safari | Phone | 390×844 | 393×659 CSS / 1178×2556 PNG | ❌ Fail | Event time shifted to 01:30–04:00; floating Filters and Share controls overlap spotlight content. | [B1_C10.png](screenshots/B1_C10.png) |

### Coverage Verification

| Dimension | Requirement | Covered By | Status |
|-----------|-------------|------------|--------|
| Windows | ≥1 | C01, C02, C03 | ✅ |
| macOS | ≥1 | C04, C05 substitute, C06 | ✅ |
| Android | ≥1 | C07, C08, C09 | ✅ |
| iOS — additional | — | C10 | ✅ |
| Chrome | ≥1 | C01, C06, C07, C09 | ✅ |
| Firefox | ≥1 | C02 | ✅ |
| Safari | ≥1 | C04, C10 | ✅ |
| Edge | ≥1 | C03 | ✅ |
| Opera | ≥1 | C05 substitute only | ⚠️ Covered with platform/version deviation |
| Desktop | ≥1 | C01–C06 | ✅ |
| Tablet | ≥1 | C09 | ✅ |
| Phone | ≥1 | C07, C08, C10 | ✅ |

### B1 Result Summary

| Result | Cells | Count |
|--------|-------|-------|
| Pass | C01, C02, C03, C04, C06 | 5 |
| Fail | C05, C07, C08, C09, C10 | 5 |
| Total | C01–C10 | 10 |
| Pass rate | — | 50% |

## Consolidated B1 Findings

| Finding ID | Type | Affected Cells | Severity | Description | Recommendation |
|------------|------|----------------|----------|-------------|----------------|
| CP-B1-01 | Connectivity / legacy browser | C05 | 3 — Major | The only available BrowserStack macOS/Opera combination cannot negotiate EMS TLS, so the application is inaccessible. This does not prove a defect in current Opera because Sequoia/current Opera was unavailable. | Define and publish the supported-browser baseline; test current Opera using another real-browser provider before making a support claim. |
| CP-B1-02 | Time-zone handling | C07, C08, C09, C10 | 3 — Major | Mobile devices display the spotlight event as 01:30–04:00 while desktop cells display 11:30–14:00 for the same event. Event schedules should not change with the tester device's default zone. | Store an event time zone and format dates explicitly in that zone, such as `Asia/Ho_Chi_Minh`, instead of using the device default. |
| CP-B1-03 | Element overlap | C07, C08, C10 | 2 — Moderate | Floating Filters and Share controls cover spotlight text/date content on phone layouts. | Move controls outside the carousel content area or reserve safe-area spacing at phone breakpoints. |
| CP-B1-04 | Duplicate control / responsive state | C09 | 2 — Moderate | Tablet layout shows both the in-flow Filters control and a second floating Filters control. | Make filter triggers mutually exclusive at responsive breakpoints. |

## Screen B2 — Event Detail

### Matrix Results

| Cell | Executed OS | Browser | Device | Result | Defect or Observation | Screenshot |
|------|-------------|---------|--------|--------|-----------------------|------------|
| C01 | Windows 11 | Chrome | Desktop | ✅ Pass | B2 rendered correctly; no horizontal overflow or broken images. | [B2_C01.png](screenshots/B2_C01.png) |
| C02 | Windows 11 | Firefox | Desktop | ✅ Pass | Layout and event details matched the desktop baseline. | [B2_C02.png](screenshots/B2_C02.png) |
| C03 | Windows 11 | Edge | Desktop | ✅ Pass | Narrower desktop layout remained usable. | [B2_C03.png](screenshots/B2_C03.png) |
| C04 | macOS Sequoia | Safari | Desktop | ✅ Pass | B2 and Vietnamese diacritics rendered correctly. | [B2_C04.png](screenshots/B2_C04.png) |
| C05 | macOS Mojave substitute | Opera 12.15 | Desktop | ❌ Fail / limitation | Legacy substitute failed TLS negotiation before EMS login. | [B2_C05.png](screenshots/B2_C05.png) |
| C06 | macOS Sequoia | Chrome | Desktop | ✅ Pass | B2 rendered consistently with the other desktop cells. | [B2_C06.png](screenshots/B2_C06.png) |
| C07 | Android 14 — Galaxy S24 | Chrome | Phone | ❌ Fail | Ten-hour time shift; title squeezed beside Save; Share overlays content. | [B2_C07.png](screenshots/B2_C07.png) |
| C08 | Android 14 — Galaxy S24 | Samsung Internet | Phone | ❌ Fail | Same time shift and phone action-layout defects as C07. | [B2_C08.png](screenshots/B2_C08.png) |
| C09 | Android 14 — Galaxy Tab A9 Plus | Chrome | Tablet | ❌ Fail | Event and registration periods displayed ten hours earlier than desktop. | [B2_C09.png](screenshots/B2_C09.png) |
| C10 | iOS 17 — iPhone 15 | Safari | Phone | ❌ Fail | Same time shift; Save constrains title and Share overlays content. | [B2_C10.png](screenshots/B2_C10.png) |

### B2 Coverage and Result

Windows ✅ · macOS ✅ · Android ✅ · iOS ✅ · Chrome ✅ · Firefox ✅ ·
Safari ✅ · Edge ✅ · Opera ⚠️ conditional substitute · Desktop ✅ ·
Tablet ✅ · Phone ✅

| Result | Cells | Count |
|--------|-------|-------|
| Pass | C01, C02, C03, C04, C06 | 5 |
| Fail | C05, C07, C08, C09, C10 | 5 |
| Total | C01–C10 | 10 |
| Pass rate | — | 50% |

## Consolidated B2 Findings

| Finding ID | Type | Affected Cells | Severity | Description | Recommendation |
|------------|------|----------------|----------|-------------|----------------|
| CP-B2-01 | Time-zone handling | C07, C08, C09, C10 | 3 — Major | Mobile/tablet cells show event, registration, and check-in periods ten hours earlier than desktop. | Store the event zone and format timestamps explicitly in `Asia/Ho_Chi_Minh`. |
| CP-B2-02 | Responsive layout / overlap | C07, C08, C10 | 2 — Moderate | Save squeezes the Vietnamese heading into a narrow column and Share floats over content. | Stack heading/actions at phone breakpoints and reserve space for, or relocate, Share. |
| CP-B2-03 | Connectivity / legacy browser | C05 | 3 — Major / inconclusive for current Opera | The only BrowserStack macOS/Opera substitute cannot negotiate EMS TLS. | Validate current Opera elsewhere and publish the supported-browser baseline. |

See [`B2-cross-platform-report.md`](B2-cross-platform-report.md) for the
complete procedure, viewport data, detailed findings, limitations, and evidence
inventory.

## Screen B4 — Registration / Check-in QR

### Matrix Results

| Cell | Executed OS | Browser | Device | Result | Defect or Observation | Screenshot |
|------|-------------|---------|--------|--------|-----------------------|------------|
| C01 | Windows 11 | Chrome | Desktop | ✅ Pass | QR dialog centred and fully visible; no overflow or broken images. | [B4_C01.png](screenshots/B4_C01.png) |
| C02 | Windows 11 | Firefox | Desktop | ✅ Pass | QR and modal controls rendered correctly. | [B4_C02.png](screenshots/B4_C02.png) |
| C03 | Windows 11 | Edge | Desktop | ✅ Pass | QR dialog remained fully usable at the narrower viewport. | [B4_C03.png](screenshots/B4_C03.png) |
| C04 | macOS Sequoia | Safari | Desktop | ✅ Pass | Native click opened the correctly rendered QR dialog. | [B4_C04.png](screenshots/B4_C04.png) |
| C05 | macOS Mojave substitute | Opera 12.15 | Desktop | ❌ Fail / limitation | Legacy substitute failed TLS negotiation before EMS login. | [B4_C05.png](screenshots/B4_C05.png) |
| C06 | macOS Sequoia | Chrome | Desktop | ✅ Pass | QR dialog and actions rendered correctly. | [B4_C06.png](screenshots/B4_C06.png) |
| C07 | Android 14 — Galaxy S24 | Chrome | Phone | ❌ Fail | QR dialog fit, but page overflow clipped the third profile action. | [B4_C07.png](screenshots/B4_C07.png) |
| C08 | Android 14 — Galaxy S24 | Samsung Internet | Phone | ❌ Fail | Same page overflow/action clipping as C07; QR remained usable. | [B4_C08.png](screenshots/B4_C08.png) |
| C09 | Android 14 — Galaxy Tab A9 Plus | Chrome | Tablet | ✅ Pass | QR dialog fit entirely and remained readable. | [B4_C09.png](screenshots/B4_C09.png) |
| C10 | iOS 17 — iPhone 15 | Safari | Phone | ❌ Fail | Page overflow plus QR trigger required JavaScript after native click and Enter failed. | [B4_C10.png](screenshots/B4_C10.png) |

### B4 Coverage and Result

Windows ✅ · macOS ✅ · Android ✅ · iOS ✅ · Chrome ✅ · Firefox ✅ ·
Safari ✅ · Edge ✅ · Opera ⚠️ conditional substitute · Desktop ✅ ·
Tablet ✅ · Phone ✅

| Result | Cells | Count |
|--------|-------|-------|
| Pass | C01, C02, C03, C04, C06, C09 | 6 |
| Fail | C05, C07, C08, C10 | 4 |
| Total | C01–C10 | 10 |
| Pass rate | — | 60% |

## Consolidated B4 Findings

| Finding ID | Type | Affected Cells | Severity | Description | Recommendation |
|------------|------|----------------|----------|-------------|----------------|
| CP-B4-01 | Horizontal overflow | C07, C08, C10 | 3 — Major | The phone action row exceeds the viewport and clips Change Password. | Stack/wrap profile actions and remove viewport-exceeding minimum widths. |
| CP-B4-02 | iOS activation | C10 | 3 — Major, pending physical confirmation | Native click focused QR without opening it; Enter also failed; JavaScript click succeeded. | Use a consistent native button handler and confirm with a physical iPhone tap. |
| CP-B4-03 | Connectivity / legacy browser | C05 | 3 — Major / inconclusive for current Opera | The only BrowserStack macOS/Opera substitute cannot negotiate EMS TLS. | Validate current Opera elsewhere and publish the supported-browser baseline. |

See [`B4-cross-platform-report.md`](B4-cross-platform-report.md) for full
viewport data, detailed findings, limitations, and evidence.

## Cross-Screen Summary

| Screen | Cells | Pass | Fail | Pass Rate |
|--------|-------|------|------|-----------|
| B1 — Events List | 10 | 5 | 5 | 50% |
| B2 — Event Detail | 10 | 5 | 5 | 50% |
| B4 — Registration / QR | 10 | 6 | 4 | 60% |
| **Total** | **30** | **16** | **14** | **53.3%** |

## Most Common Defects

Counts below are affected screen-cell occurrences. A failed cell can contain
more than one defect, so the frequencies do not sum to the 14 failed cells.

| Defect Type | Count | Affected Screen-Cells |
|-------------|------:|-----------------------|
| Device-dependent event/registration time | 8 | B1-C07, B1-C08, B1-C09, B1-C10; B2-C07, B2-C08, B2-C09, B2-C10 |
| Phone control/content overlap or constrained layout | 6 | B1-C07, B1-C08, B1-C10; B2-C07, B2-C08, B2-C10 |
| Phone horizontal overflow / clipped profile action | 3 | B4-C07, B4-C08, B4-C10 |
| Legacy Opera substitute TLS failure | 3 | B1-C05, B2-C05, B4-C05 |
| Duplicate responsive Filters control | 1 | B1-C09 |
| iOS QR activation failure signal | 1 | B4-C10 |

The time-zone defect is the widest confirmed functional risk, affecting every
tested Android/iOS mobile or tablet cell on B1 and B2. Responsive control
placement is the next most frequent pattern. C05 is a test-platform limitation:
it covers a legacy BrowserStack substitute and must not be presented as evidence
that current Opera on macOS Sequoia fails.

## Execution Observations

- C02 Firefox, C07 Android Chrome, and C08 Samsung Internet did not redirect
  after the first mouse/touch-style Login click. Submitting the same valid form
  with Enter succeeded. This observation concerns the authentication flow rather
  than the B1 screen and was not used alone to fail those B1 cells.
- No horizontal document overflow was detected in the nine authenticated B1
  sessions.
- No visible image had `naturalWidth === 0` in those sessions. The gray thumbnail
  placeholder is an intentional application state, not a broken network image.
- Vietnamese diacritics rendered correctly in all authenticated sessions.
- BrowserStack real-device screenshots use device pixel ratios, so PNG dimensions
  differ from CSS viewport dimensions.
- The B4 QR dialog itself fit every authenticated modern viewport. B4 phone
  failures concern surrounding page overflow, plus the C10 activation behavior.

## Evidence Inventory

| Evidence Type | Location | Count |
|---------------|----------|-------|
| Raw screenshots | `artifacts/04-cross-platform/screenshots/raw/{B1,B2,B4}_C01.png` … `C10.png` | 30 |
| Final overlaid screenshots | `artifacts/04-cross-platform/screenshots/{B1,B2,B4}_C01.png` … `C10.png` | 30 |
| Diagnostic retry screenshots | `artifacts/04-cross-platform/screenshots/diagnostics/` | 8 |
| BrowserStack/DOM results | `artifacts/04-cross-platform/{B1,B2,B4}-browserstack-results.json` | 30 cell records |
| Capture script | `artifacts/04-cross-platform/scripts/browserstack_capture.py` | 1 |
| Overlay script | `artifacts/04-cross-platform/scripts/add_overlay.py` | 1 |

## Conclusion

Task 3 completed 30 authenticated cross-platform executions across B1, B2, and
B4, with 16 passes and 14 failures (53.3%). All required OS, browser, and device
classes were represented, subject to the documented conditional Opera
substitute. Modern desktop configurations were consistently compatible. The
highest-priority product issue is device-dependent time rendering on B1 and B2,
followed by phone control overlap and B4 profile-page overflow. The B4 QR dialog
itself rendered correctly in every authenticated modern configuration, although
the iOS activation signal still warrants confirmation with a physical tap.

## References

- BrowserStack, [Automate with Selenium](https://www.browserstack.com/docs/automate/selenium).
- BrowserStack, [Select browsers and devices for Selenium testing](https://www.browserstack.com/docs/automate/selenium/select-browsers-and-devices).
- BrowserStack, [Take screenshots in Selenium tests](https://www.browserstack.com/docs/automate/selenium/take-screenshots).
