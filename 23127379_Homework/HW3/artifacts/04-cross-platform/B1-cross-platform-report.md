# B1 Cross-Platform Compatibility Test Report

## 1. Report Information

| Field | Value |
|-------|-------|
| Project | HW03 — GUI, Usability, and Cross-Platform Testing on EMS |
| Student | Thái Minh Huy |
| MSSV | 23127379 |
| Group | 06 |
| Scenario | B — Student / Event Attendee |
| Screen | B1 — Events List / Discovery |
| SUT | EMS — Event Management System |
| Tested URL | `https://prod-dev.ems-fitus.cloud/dashboard` |
| Execution date | 2026-07-30 |
| Test infrastructure | BrowserStack Automate with Selenium |
| Matrix size | 10 cells |
| Final result | 5 Pass, 5 Fail |
| Pass rate | 50% |
| AI audit | Logged as AI-011 through AI-014 in `artifacts/05-audit/ai-audit-report.md` |

## 2. Executive Summary

Screen B1 was tested across ten desktop, phone, and tablet configurations
covering Windows, macOS, Android, and iOS; Chrome, Firefox, Safari, Edge, Opera,
and Samsung Internet; and all three required device classes.

The desktop B1 layout passed on Windows Chrome, Windows Firefox, Windows Edge,
macOS Safari, and macOS Chrome. These cells showed no horizontal document
overflow, broken visible images, or corrupted Vietnamese text.

Five cells failed or could not complete the expected flow:

1. C05 could not access EMS because BrowserStack's only executable macOS/Opera
   substitute, macOS Mojave with Opera 12.15, failed TLS negotiation.
2. C07–C10 displayed the same event ten hours earlier than the desktop cells.
3. Phone layouts showed floating Filters and Share controls overlapping the
   spotlight event.
4. The Android tablet layout displayed two Filters controls at the same time.

The most serious confirmed EMS issue is device-dependent event time rendering.
An attendee relying on a mobile device could arrive at the wrong time.

## 3. Test Objective

The objective was to determine whether B1 remains visually consistent,
readable, and functionally trustworthy across the approved platform matrix.
Testing focused on:

- correct rendering of navigation, spotlight event, filters, and event cards;
- responsive behavior on desktop, tablet, and phone;
- horizontal overflow, clipping, overlap, and duplicate controls;
- broken images and Vietnamese text rendering;
- consistency of event date and time information;
- availability of the screen after authentication;
- presence of the required MSSV email overlay in every final screenshot.

## 4. Test Procedure

For each matrix cell, the test performed the following sequence:

1. Start a BrowserStack browser or real-device session.
2. Open the EMS login page.
3. Enter the student credentials and submit the form.
4. Confirm navigation to `/dashboard`.
5. Wait until the B1 main content and at least one event card are visible.
6. Collect DOM diagnostics for overflow, images, clipped text, viewport size,
   and Vietnamese content.
7. Capture a raw screenshot.
8. Apply the `23127379@student.hcmus.edu.vn` overlay.
9. Review the final screenshot and assign Pass or Fail.

The first click submission did not redirect in Firefox, Android Chrome, or
Samsung Internet. Pressing Enter on the same completed form succeeded. This is
recorded as an authentication-flow observation and was not, by itself, used to
fail B1.

## 5. Pass/Fail Criteria

A cell passed when:

- B1 was reachable after authentication;
- the primary layout remained readable and usable;
- no important content was hidden by another control;
- event date and time values were consistent with the desktop baseline;
- no horizontal document overflow or broken visible images were detected;
- Vietnamese diacritics rendered correctly.

A cell failed when one or more of these conditions were not satisfied. Expected
line-clamping inside event cards and the application's empty-thumbnail
placeholder were not treated as defects.

## 6. Platform Matrix and Results

| Cell | Executed Platform | Browser | Device Class | Target Viewport | Actual CSS Viewport | Result | Evidence |
|------|-------------------|---------|--------------|-----------------|---------------------|--------|----------|
| C01 | Windows 11 | Chrome | Desktop | 1920×1080 | 1904×929 | ✅ Pass | [B1_C01.png](screenshots/B1_C01.png) |
| C02 | Windows 11 | Firefox | Desktop | 1920×1080 | 1904×986 | ✅ Pass | [B1_C02.png](screenshots/B1_C02.png) |
| C03 | Windows 11 | Edge | Desktop | 1440×900 | 1416×733 | ✅ Pass | [B1_C03.png](screenshots/B1_C03.png) |
| C04 | macOS Sequoia | Safari | Desktop | 1920×1080 | 1920×1028 | ✅ Pass | [B1_C04.png](screenshots/B1_C04.png) |
| C05 | macOS Mojave substitute | Opera 12.15 | Desktop | 1280×800 | EMS not reached | ❌ Fail / limitation | [B1_C05.png](screenshots/B1_C05.png) |
| C06 | macOS Sequoia | Chrome | Desktop | 1440×900 | 1440×757 | ✅ Pass | [B1_C06.png](screenshots/B1_C06.png) |
| C07 | Android 14 — Galaxy S24 | Chrome | Phone | 390×844 | 360×647 | ❌ Fail | [B1_C07.png](screenshots/B1_C07.png) |
| C08 | Android 14 — Galaxy S24 | Samsung Internet | Phone | 360×800 | 360×607 | ❌ Fail | [B1_C08.png](screenshots/B1_C08.png) |
| C09 | Android 14 — Galaxy Tab A9 Plus | Chrome | Tablet | 820×1180 | 800×1112 | ❌ Fail | [B1_C09.png](screenshots/B1_C09.png) |
| C10 | iOS 17 — iPhone 15 | Safari | Phone | 390×844 | 393×659 | ❌ Fail | [B1_C10.png](screenshots/B1_C10.png) |

### 6.1 Cell-Level Notes

| Cell | Result | Test Notes |
|------|--------|------------|
| C01 | ✅ Pass | Header, spotlight event, filters, sidebar, and event grid rendered correctly. No horizontal overflow or broken images were detected. |
| C02 | ✅ Pass | B1 rendered consistently with C01. The login click required an Enter fallback, but the authenticated B1 screen itself passed. |
| C03 | ✅ Pass | Responsive desktop layout remained usable at the narrower Edge viewport. Event cards continued in a readable grid. |
| C04 | ✅ Pass | Safari rendered the B1 layout and Vietnamese diacritics correctly. No horizontal overflow was detected. |
| C05 | ❌ Fail / limitation | Opera displayed “Unable to complete secure transaction” with fatal TLS error 40 before EMS loaded. This was a BrowserStack platform substitute, not the approved Sequoia target. |
| C06 | ✅ Pass | Chrome on macOS rendered the same usable desktop structure as Windows Chrome. |
| C07 | ❌ Fail | Event time changed to 01:30–04:00 instead of 11:30–14:00. Floating Filters and Share controls overlapped spotlight content. |
| C08 | ❌ Fail | The time shift was repeated. Filters obscured the date row and Share covered content on the right side. |
| C09 | ❌ Fail | The event time shifted to 01:30–04:00. Both an in-flow Filters button and a floating Filters button were present. |
| C10 | ❌ Fail | The time shift was repeated on iOS Safari. Filters and Share controls overlapped the spotlight card. |

## 7. Coverage Verification

| Coverage Dimension | Required | Covered By | Result |
|--------------------|----------|------------|--------|
| Windows | ≥1 | C01, C02, C03 | ✅ Satisfied |
| macOS | ≥1 | C04, C06; C05 substitute | ✅ Satisfied |
| Android | ≥1 | C07, C08, C09 | ✅ Satisfied |
| iOS | Additional | C10 | ✅ Covered |
| Chrome | ≥1 | C01, C06, C07, C09 | ✅ Satisfied |
| Firefox | ≥1 | C02 | ✅ Satisfied |
| Safari | ≥1 | C04, C10 | ✅ Satisfied |
| Edge | ≥1 | C03 | ✅ Satisfied |
| Opera | ≥1 | C05 substitute | ⚠️ Conditional |
| Desktop | ≥1 | C01–C06 | ✅ Satisfied |
| Tablet | ≥1 | C09 | ✅ Satisfied |
| Phone | ≥1 | C07, C08, C10 | ✅ Satisfied |

Opera coverage is conditional because BrowserStack did not offer Opera on macOS
Sequoia. The substitute result must not be described as current Opera-on-Sequoia
coverage.

## 8. Detailed Findings

### B1-CP-01 — Event Time Changes Across Device Time Zones

| Field | Value |
|-------|-------|
| Type | Functional consistency / time-zone handling |
| Affected cells | C07, C08, C09, C10 |
| Severity | 3 — Major |
| Priority | P1 — Fix before release |
| Desktop baseline | `28/06/2026 11:30 – 28/06/2026 14:00` |
| Mobile/tablet actual | `28/06/2026 01:30 – 28/06/2026 04:00` |
| Evidence | [C04 desktop](screenshots/B1_C04.png), [C08 phone](screenshots/B1_C08.png), [C09 tablet](screenshots/B1_C09.png), [C10 iPhone](screenshots/B1_C10.png) |

**Steps to reproduce**

1. Log in to EMS.
2. Open B1 on a desktop session and record the spotlight event time.
3. Open B1 on an Android or iOS BrowserStack device.
4. Compare the same event's displayed time.

**Expected result:** The academic event time remains fixed to its configured
event time zone across devices.

**Actual result:** Mobile and tablet devices display the event ten hours earlier
than desktop sessions.

**Impact:** Students may attend or register based on an incorrect event time.

**Recommendation:** Store the event time-zone identifier with the event and
format it explicitly, for example with `Asia/Ho_Chi_Minh`, instead of relying on
the browser/device default zone.

### B1-CP-02 — Floating Controls Overlap Spotlight Content

| Field | Value |
|-------|-------|
| Type | Responsive layout / element overlap |
| Affected cells | C07, C08, C10 |
| Severity | 2 — Moderate |
| Priority | P1 — High |
| Evidence | [C07](screenshots/B1_C07.png), [C08](screenshots/B1_C08.png), [C10](screenshots/B1_C10.png) |

**Steps to reproduce**

1. Open B1 on a phone-sized real device.
2. Observe the floating Filters control at the lower left.
3. Observe the floating Share control on the right of the spotlight card.

**Expected result:** Floating actions remain outside important event text, date,
location, and navigation controls.

**Actual result:** Filters overlaps the date/content region, and Share overlaps
the spotlight card's text region.

**Impact:** Important event information becomes harder to read and controls may
be activated accidentally.

**Recommendation:** Reserve safe-area spacing within the responsive carousel or
place these actions below the card rather than above its content.

### B1-CP-03 — Duplicate Filters Controls on Tablet

| Field | Value |
|-------|-------|
| Type | Responsive state / duplicate control |
| Affected cell | C09 |
| Severity | 2 — Moderate |
| Priority | P2 — Medium |
| Evidence | [C09](screenshots/B1_C09.png) |

**Steps to reproduce**

1. Open B1 on an Android 14 tablet.
2. Scroll to the Events and filtering section.
3. Compare the in-flow Filters button with the floating Filters button.

**Expected result:** One clear Filters entry point is visible for the current
responsive breakpoint.

**Actual result:** Two Filters controls are visible at the same time.

**Impact:** The interface is visually inconsistent and may confuse users about
whether the controls have different functions.

**Recommendation:** Make the desktop/tablet filter trigger and the floating
mobile trigger mutually exclusive through responsive visibility rules.

### B1-CP-04 — BrowserStack Opera Substitute Cannot Access EMS

| Field | Value |
|-------|-------|
| Type | Compatibility limitation / TLS |
| Affected cell | C05 |
| Severity | 3 — Major for the executed legacy browser |
| Priority | P3 — Clarify support baseline |
| Evidence | [C05](screenshots/B1_C05.png) |

**Expected result:** The selected browser establishes HTTPS and loads EMS.

**Actual result:** Opera 12.15 reports fatal TLS error 40 and does not reach the
login page.

**Interpretation:** BrowserStack did not provide the approved macOS Sequoia +
Opera combination. The executed macOS Mojave + Opera 12.15 substitute is a
legacy environment. This evidence does not demonstrate a defect in current
Opera.

**Recommendation:** Define the officially supported browser baseline and verify
current Opera through another real-browser provider before stating current
Opera compatibility.

## 9. Cross-Cell Summary

| Category | Cells | Count |
|----------|-------|-------|
| Passed | C01, C02, C03, C04, C06 | 5 |
| Failed — confirmed EMS issue | C07, C08, C09, C10 | 4 |
| Failed — platform substitute limitation | C05 | 1 |
| Total | C01–C10 | 10 |

| Defect Pattern | Affected Cells | Frequency |
|----------------|----------------|-----------|
| Device-dependent event time | C07, C08, C09, C10 | 4 |
| Floating control overlap | C07, C08, C10 | 3 |
| Duplicate Filters control | C09 | 1 |
| TLS failure on legacy substitute | C05 | 1 |

## 10. Positive Compatibility Observations

- B1 displayed correctly on five modern desktop browser combinations.
- No horizontal document overflow was detected in the nine authenticated
  sessions.
- No visible image returned a broken-image state.
- Vietnamese diacritics rendered correctly across authenticated desktop and
  mobile sessions.
- The main navigation adapted to a hamburger menu on phone and tablet layouts.
- Event cards changed from a desktop grid to a single-column mobile layout.
- Every final evidence image contains the required MSSV email overlay.

## 11. Limitations

- Only B1 was tested in this report. B2 and B4 remain outside its scope.
- BrowserStack did not provide the exact C05 macOS Sequoia + Opera target.
- BrowserStack device chrome and device pixel ratios caused PNG dimensions to
  differ from the requested CSS viewport dimensions.
- Screenshots represent the viewport visible at capture time, not an entire
  stitched page.
- C05 could not reach EMS, so no B1 DOM or visual-layout analysis was possible
  for that cell.
- Automated clipping candidates were manually reviewed because deliberate
  line-clamping can otherwise create false positives.

## 12. Prioritized Recommendations

| Rank | Recommendation | Related Finding | Suggested Effort |
|------|----------------|-----------------|------------------|
| 1 | Format event dates using the event's configured time zone instead of the device default. | B1-CP-01 | Medium |
| 2 | Reposition phone Filters and Share actions so they never cover event content. | B1-CP-02 | Small–Medium |
| 3 | Remove the duplicate floating Filters trigger at tablet breakpoints. | B1-CP-03 | Small |
| 4 | Publish a supported browser/version policy and test current Opera through a suitable provider. | B1-CP-04 | Small for policy; Medium for added testing |
| 5 | Investigate why click submission stalled on Firefox and Android while Enter succeeded. | Authentication observation | Medium |

## 13. Conclusion

B1 is stable on the tested modern desktop browsers but is not yet consistently
reliable on mobile and tablet devices. The mobile time-zone defect affects the
accuracy of core event information, while overlapping and duplicate filter
controls reduce readability and responsive consistency. These findings should
be addressed before B1 is considered fully cross-platform compatible.

The recorded B1 pass rate is **50%**. Excluding the unavailable current
Opera-on-Sequoia target does not change the need to fix the four confirmed
mobile/tablet failures.

## 14. Evidence and Reproducibility

| Artifact | Location |
|----------|----------|
| Raw screenshots | `artifacts/04-cross-platform/screenshots/raw/B1_C01.png` through `B1_C10.png` |
| Final overlaid screenshots | `artifacts/04-cross-platform/screenshots/B1_C01.png` through `B1_C10.png` |
| BrowserStack and DOM results | `artifacts/04-cross-platform/B1-browserstack-results.json` |
| Capture script | `artifacts/04-cross-platform/scripts/browserstack_capture.py` |
| Overlay script | `artifacts/04-cross-platform/scripts/add_overlay.py` |
| Matrix setup | `artifacts/04-cross-platform/phase-0-matrix-setup.md` |
