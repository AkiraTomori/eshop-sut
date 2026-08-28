# HW06 Consolidated Bug Report

> **Status:** POSTED AND RECONCILED — six new HW06 GitHub Issues were opened on 2026-08-28; `BUG-PB-002` was added as HW06 evidence to existing Issue 28 instead of creating a duplicate. MSSV-tagged screenshots were generated from the real Newman/SQLite evidence.

## Failure triage summary

| Pool | Final executed case verdict | Genuine defect root causes | Runner/test issues excluded | Evidence limitations |
|---|---|---:|---:|---|
| A / FR-03 | 29 passed / 26 failed | 3 | 1 corrected double-slash diagnostic | Three redacted MSSV screenshots generated |
| B / FR-08 | 29 passed / 13 failed | 2 | 2 corrected diagnostics (`StudentID` case and regex serialization) | Cart clearing remains unverified; two MSSV screenshots generated |
| C / FR-15 | 30 passed / 37 failed | 3 | 1 corrected double-slash diagnostic | Two MSSV screenshots generated; one known issue reused |
| **Total** | **88 passed / 76 failed** | **8** | **4** | **Seven evidence screenshots generated** |

Pool B's Newman-only result was 41/1; restricted SQLite evidence independently identified 12 additional server-total failures. That produces the final 29/13 verdict without double-counting `FR08-DOM-007`.

## Evidence-backed defects

| Bug | Pool/API | Failed cases | Severity | Evidence | GitHub status |
|---|---|---:|---|---|---|
| `BUG-PA-001` — four-digit OTP generated instead of six digits | FR-03 forgot-password | 26 cases / 27 assertions | High security/functional | Pool A Newman JSON/HTML and CLI | Opened as [Issue 68](https://github.com/AkiraTomori/eshop-sut/issues/68) |
| `BUG-PA-002` — invalid new passwords accepted | FR-03 reset-password | 9 cases | High validation/security | Pool A Newman and fixture snapshots | Opened as [Issue 70](https://github.com/AkiraTomori/eshop-sut/issues/70) |
| `BUG-PA-003` — new password persisted as plaintext | FR-03 reset-password | Dedicated persistence evidence | Critical security | Redacted before/after boolean fixture evidence | Opened as [Issue 69](https://github.com/AkiraTomori/eshop-sut/issues/69) |
| `BUG-PB-001` — JSON array creates null-valued order | FR-08 checkout | 1 case | Medium | Pool B Newman + redacted order snapshot | Opened as [Issue 71](https://github.com/AkiraTomori/eshop-sut/issues/71) |
| `BUG-PB-002` — checkout trusts client total | FR-08 checkout | 12 cases | High data integrity | Pool B Newman + per-case SQLite totals | HW06 evidence added to existing [Issue 28](https://github.com/AkiraTomori/eshop-sut/issues/28); duplicate avoided |
| `BUG-PC-001` — missing/invalid/non-admin credentials can update products | FR-15 update | 16 cases | High authorization | Pool C Newman + isolated SQLite state | Opened as [Issue 72](https://github.com/AkiraTomori/eshop-sut/issues/72) |
| `BUG-PC-002` — invalid required product fields are persisted | FR-15 update | 18 cases | High validation/data integrity | Pool C Newman + isolated SQLite state | Opened as [Issue 73](https://github.com/AkiraTomori/eshop-sut/issues/73) |
| Existing `BUG-FR15-011` — false success for missing product | FR-15 update | 3 cases | Known issue | Pool C Newman + zero-mutation state | Existing [Issue 52](https://github.com/AkiraTomori/eshop-sut/issues/52); no duplicate draft |

Detailed reproduction steps, expected/actual results, sources, impact, and draft issue bodies remain in each Pool's `stage5-bug-report-proposal.md`.

## False positives and evidence gaps

- Discarded URL/header/assertion diagnostics are test-script issues, not SUT defects. All were corrected and rerun before triage.
- Pool B cart clearing has no approved non-GET observation method and remains unverified.
- SQL-looking Pool C values did not demonstrate SQL execution; their failures were validation or the known zero-row false-success behavior.
- Six new Issue URLs and two reused Issue URLs are recorded above. Seven MSSV `23127379` screenshots were generated from the redacted Newman/SQLite evidence during the posting session; no OTP, password, or bearer-token value was intentionally retained in the final evidence views.
