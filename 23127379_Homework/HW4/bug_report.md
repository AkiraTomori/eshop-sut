# HW04 Bug Report — Consolidated Summary

> **Student:** 23127379 — Thái Minh Huy
>
> **Scope:** Summary only. Detailed evidence and reproduction steps live in each FR pool.
>
> **GitHub Issues:** <https://github.com/ttbhanh/eshop-sut/issues>

---

## Feature reports

| FR | Feature | Detailed report | Latest automation evidence | Classification status | Confirmed bugs |
|---|---|---|---|---|---:|
| FR-06 | Product Detail View | [fr06-bug-report.md](Pool-A_FR06/fr06-bug-report.md) | Run #1 — 3 browsers | Pending `/hw4-bugs FR-06` | Pending |
| FR-08 | Checkout | `Pool-B_FR08/fr08-bug-report.md` | Not run | Not started | 0 |
| FR-15 | Product Management | `Pool-C_FR15/fr15-bug-report.md` | Not run | Not started | 0 |

## Consolidated bug index

This table is populated only from bugs already classified as genuine product defects in a signed per-FR report. Do not copy unclassified assertion failures or HW2 candidates into this index.

| Bug ID | FR | Title | Severity | Affected browsers | Known/New | GitHub Issue | Detail |
|---|---|---|---|---|---|---|---|
| _Pending FR-06 classification_ | FR-06 | — | — | — | — | — | [Open detail](Pool-A_FR06/fr06-bug-report.md) |

## Totals

| Metric | FR-06 | FR-08 | FR-15 | Total |
|---|---:|---:|---:|---:|
| Confirmed genuine product defects | Pending | 0 | 0 | Pending |
| Known HW2 defects reproduced | Pending | 0 | 0 | Pending |
| New automation-discovered defects | Pending | 0 | 0 | Pending |
| Test/infrastructure failures | Pending | 0 | 0 | Pending |
| Out-of-scope failures | Pending | 0 | 0 | Pending |

## Aggregation rules

- `/hw4-bugs FR-##` writes full details to the current pool's `fr##-bug-report.md`.
- Root `bug_report.md` contains only totals, a concise bug index, GitHub Issue links, and links to the detailed FR reports.
- The root summary must be updated in the same `/hw4-bugs` invocation; it must never contain more confirmed bugs than the detailed FR reports.
- A failed assertion is not automatically a product bug. It must first be classified against HW2, SRS, test code, environment, and retained browser evidence.
- API-only HW2 defects remain outside HW4 automation scope and must not be presented as browser-automation confirmations.
