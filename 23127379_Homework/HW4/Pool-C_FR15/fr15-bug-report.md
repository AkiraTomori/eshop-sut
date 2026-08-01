# FR-15 Detailed Bug Report — Product Management

> **Student:** 23127379 — Thái Minh Huy
>
> **Evidence source:** [FR-15 Run Summary](fr15-run-summary.md), tracked Run #2 across Chromium, Firefox, and WebKit
>
> **Classification status:** Complete — HITL accepted
>
> **Aggregate report:** [HW04 Bug Report](../bug_report.md)

---

## Classification summary

Run #2 executed 25 tests in each browser. The retained JSON reports contain 72 failed TC/browser results and three passes (`TC-FR15-BV-006`, one per browser). Classification used the reviewed spec/data, HW2 test cases and detailed bug report, SRS, current React source, screenshots, error contexts, and valid Playwright traces.

| Classification | Distinct count | Failed TC/browser results |
|---|---:|---:|
| Genuine product defects | 12 | 57 |
| Known HW2 defects reproduced | 6 | 30 |
| New automation-discovered defects | 6 | 27 primary, plus 3 secondary associations |
| Test or source issues | 2 | 15 exclusively, plus 3 secondary observations |
| Out of HW4 scope failures | 0 | 0 |

The 57 genuine results cover 19 failed TCs on all three browsers. Primary attribution assigns 30 to known and 27 to new defects; EP-004 also exposes the new missing-success-notification defect while remaining primarily attributed to known delete-confirmation failure. Fifteen results are exclusively automation/source issues: 12 boundary results fail on an unrelated price-format assertion and three tab-order results enforce an ordering that conflicts with the SRS visual-order rule. EP-010 remains a genuine product failure because its required markers, validation message, and Save colour fail independently; its tab-order observation is secondary and is not counted again.

## Failure classification matrix

Each failed TC/browser result has one row. Isolated HTML reports: [Chromium](playwright-report/chromium/index.html), [Firefox](playwright-report/firefox/index.html), [WebKit](playwright-report/webkit/index.html). Every linked artifact directory also retains `error-context.md`.

| Source TC | Browser | Exact failed assertion(s) | Classification | Bug/Issue ID | Evidence |
|---|---|---|---|---|---|
| TC-FR15-EP-001 | Chromium | Expected formatted `15,000,000`; row contains raw `15000000` | Genuine — new | BUG-FR15-AUTO-001 | [shot](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-3346c-lds-contain-valid-data-FR15-chromium/test-failed-1.png) · [trace](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-3346c-lds-contain-valid-data-FR15-chromium/trace.zip) |
| TC-FR15-EP-001 | Firefox | Same raw-price failure | Genuine — new | BUG-FR15-AUTO-001 | [shot](test-results/firefox/Pool-C_FR15-fr15-FR-15-Pro-3346c-lds-contain-valid-data-FR15-firefox/test-failed-1.png) · [trace](test-results/firefox/Pool-C_FR15-fr15-FR-15-Pro-3346c-lds-contain-valid-data-FR15-firefox/trace.zip) |
| TC-FR15-EP-001 | WebKit | Same raw-price failure | Genuine — new | BUG-FR15-AUTO-001 | [shot](test-results/webkit/Pool-C_FR15-fr15-FR-15-Pro-3346c-lds-contain-valid-data-FR15-webkit/test-failed-1.png) · [trace](test-results/webkit/Pool-C_FR15-fr15-FR-15-Pro-3346c-lds-contain-valid-data-FR15-webkit/trace.zip) |
| TC-FR15-EP-002 | Chromium | Expected formatted `50,000`; row contains raw `50000` | Genuine — new | BUG-FR15-AUTO-001 | [shot](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-a7b85-d-imageUrl-are-omitted-FR15-chromium/test-failed-1.png) · [trace](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-a7b85-d-imageUrl-are-omitted-FR15-chromium/trace.zip) |
| TC-FR15-EP-002 | Firefox | Same raw-price failure | Genuine — new | BUG-FR15-AUTO-001 | [shot](test-results/firefox/Pool-C_FR15-fr15-FR-15-Pro-a7b85-d-imageUrl-are-omitted-FR15-firefox/test-failed-1.png) · [trace](test-results/firefox/Pool-C_FR15-fr15-FR-15-Pro-a7b85-d-imageUrl-are-omitted-FR15-firefox/trace.zip) |
| TC-FR15-EP-002 | WebKit | Same raw-price failure | Genuine — new | BUG-FR15-AUTO-001 | [shot](test-results/webkit/Pool-C_FR15-fr15-FR-15-Pro-a7b85-d-imageUrl-are-omitted-FR15-webkit/test-failed-1.png) · [trace](test-results/webkit/Pool-C_FR15-fr15-FR-15-Pro-a7b85-d-imageUrl-are-omitted-FR15-webkit/trace.zip) |
| TC-FR15-EP-004 | Chromium | No confirmation text; success notification absent | Genuine — known + new | BUG-FR15-017, BUG-FR15-AUTO-002 | [shot](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-2cbd3-te-confirmation-dialog-FR15-chromium/test-failed-1.png) · [trace](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-2cbd3-te-confirmation-dialog-FR15-chromium/trace.zip) |
| TC-FR15-EP-004 | Firefox | Same confirmation and notification failures | Genuine — known + new | BUG-FR15-017, BUG-FR15-AUTO-002 | [shot](test-results/firefox/Pool-C_FR15-fr15-FR-15-Pro-2cbd3-te-confirmation-dialog-FR15-firefox/test-failed-1.png) · [trace](test-results/firefox/Pool-C_FR15-fr15-FR-15-Pro-2cbd3-te-confirmation-dialog-FR15-firefox/trace.zip) |
| TC-FR15-EP-004 | WebKit | Same confirmation and notification failures | Genuine — known + new | BUG-FR15-017, BUG-FR15-AUTO-002 | [shot](test-results/webkit/Pool-C_FR15-fr15-FR-15-Pro-2cbd3-te-confirmation-dialog-FR15-webkit/test-failed-1.png) · [trace](test-results/webkit/Pool-C_FR15-fr15-FR-15-Pro-2cbd3-te-confirmation-dialog-FR15-webkit/trace.zip) |
| TC-FR15-EP-005 | Chromium | No confirmation; cancel path unavailable and row is removed | Genuine — known | BUG-FR15-017 | [shot](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-976ae-te-confirmation-dialog-FR15-chromium/test-failed-1.png) · [trace](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-976ae-te-confirmation-dialog-FR15-chromium/trace.zip) |
| TC-FR15-EP-005 | Firefox | Same immediate-delete failure | Genuine — known | BUG-FR15-017 | [shot](test-results/firefox/Pool-C_FR15-fr15-FR-15-Pro-976ae-te-confirmation-dialog-FR15-firefox/test-failed-1.png) · [trace](test-results/firefox/Pool-C_FR15-fr15-FR-15-Pro-976ae-te-confirmation-dialog-FR15-firefox/trace.zip) |
| TC-FR15-EP-005 | WebKit | Same immediate-delete failure | Genuine — known | BUG-FR15-017 | [shot](test-results/webkit/Pool-C_FR15-fr15-FR-15-Pro-976ae-te-confirmation-dialog-FR15-webkit/test-failed-1.png) · [trace](test-results/webkit/Pool-C_FR15-fr15-FR-15-Pro-976ae-te-confirmation-dialog-FR15-webkit/trace.zip) |
| TC-FR15-EP-006 | Chromium | Progressbar absent; price is raw rather than formatted | Genuine — new | BUG-FR15-AUTO-005, BUG-FR15-AUTO-001 | [shot](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-ca1bf-thout-a-search-keyword-FR15-chromium/test-failed-1.png) · [trace](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-ca1bf-thout-a-search-keyword-FR15-chromium/trace.zip) |
| TC-FR15-EP-006 | Firefox | Same loading and raw-price failures | Genuine — new | BUG-FR15-AUTO-005, BUG-FR15-AUTO-001 | [shot](test-results/firefox/Pool-C_FR15-fr15-FR-15-Pro-ca1bf-thout-a-search-keyword-FR15-firefox/test-failed-1.png) · [trace](test-results/firefox/Pool-C_FR15-fr15-FR-15-Pro-ca1bf-thout-a-search-keyword-FR15-firefox/trace.zip) |
| TC-FR15-EP-006 | WebKit | Same loading and raw-price failures | Genuine — new | BUG-FR15-AUTO-005, BUG-FR15-AUTO-001 | [shot](test-results/webkit/Pool-C_FR15-fr15-FR-15-Pro-ca1bf-thout-a-search-keyword-FR15-webkit/test-failed-1.png) · [trace](test-results/webkit/Pool-C_FR15-fr15-FR-15-Pro-ca1bf-thout-a-search-keyword-FR15-webkit/trace.zip) |
| TC-FR15-EP-007 | Chromium | Search textbox is absent | Genuine — new | BUG-FR15-AUTO-003 | [shot](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-c0032-rch-keyword-is-entered-FR15-chromium/test-failed-1.png) · [trace](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-c0032-rch-keyword-is-entered-FR15-chromium/trace.zip) |
| TC-FR15-EP-007 | Firefox | Same absent-search failure | Genuine — new | BUG-FR15-AUTO-003 | [shot](test-results/firefox/Pool-C_FR15-fr15-FR-15-Pro-c0032-rch-keyword-is-entered-FR15-firefox/test-failed-1.png) · [trace](test-results/firefox/Pool-C_FR15-fr15-FR-15-Pro-c0032-rch-keyword-is-entered-FR15-firefox/trace.zip) |
| TC-FR15-EP-007 | WebKit | Same absent-search failure | Genuine — new | BUG-FR15-AUTO-003 | [shot](test-results/webkit/Pool-C_FR15-fr15-FR-15-Pro-c0032-rch-keyword-is-entered-FR15-webkit/test-failed-1.png) · [trace](test-results/webkit/Pool-C_FR15-fr15-FR-15-Pro-c0032-rch-keyword-is-entered-FR15-webkit/trace.zip) |
| TC-FR15-EP-008 | Chromium | Search textbox/empty-result flow is absent | Genuine — new | BUG-FR15-AUTO-003 | [shot](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-bcb13-rns-no-product-matches-FR15-chromium/test-failed-1.png) · [trace](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-bcb13-rns-no-product-matches-FR15-chromium/trace.zip) |
| TC-FR15-EP-008 | Firefox | Same absent search/empty state | Genuine — new | BUG-FR15-AUTO-003 | [shot](test-results/firefox/Pool-C_FR15-fr15-FR-15-Pro-bcb13-rns-no-product-matches-FR15-firefox/test-failed-1.png) · [trace](test-results/firefox/Pool-C_FR15-fr15-FR-15-Pro-bcb13-rns-no-product-matches-FR15-firefox/trace.zip) |
| TC-FR15-EP-008 | WebKit | Same absent search/empty state | Genuine — new | BUG-FR15-AUTO-003 | [shot](test-results/webkit/Pool-C_FR15-fr15-FR-15-Pro-bcb13-rns-no-product-matches-FR15-webkit/test-failed-1.png) · [trace](test-results/webkit/Pool-C_FR15-fr15-FR-15-Pro-bcb13-rns-no-product-matches-FR15-webkit/trace.zip) |
| TC-FR15-EP-009 | Chromium | View/details action is absent | Genuine — new | BUG-FR15-AUTO-004 | [shot](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-5971b-essed-by-a-valid-admin-FR15-chromium/test-failed-1.png) · [trace](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-5971b-essed-by-a-valid-admin-FR15-chromium/trace.zip) |
| TC-FR15-EP-009 | Firefox | Same absent-detail failure | Genuine — new | BUG-FR15-AUTO-004 | [shot](test-results/firefox/Pool-C_FR15-fr15-FR-15-Pro-5971b-essed-by-a-valid-admin-FR15-firefox/test-failed-1.png) · [trace](test-results/firefox/Pool-C_FR15-fr15-FR-15-Pro-5971b-essed-by-a-valid-admin-FR15-firefox/trace.zip) |
| TC-FR15-EP-009 | WebKit | Same absent-detail failure | Genuine — new | BUG-FR15-AUTO-004 | [shot](test-results/webkit/Pool-C_FR15-fr15-FR-15-Pro-5971b-essed-by-a-valid-admin-FR15-webkit/test-failed-1.png) · [trace](test-results/webkit/Pool-C_FR15-fr15-FR-15-Pro-5971b-essed-by-a-valid-admin-FR15-webkit/trace.zip) |
| TC-FR15-EP-010 | Chromium | Three markers/error absent; Save green; tab mismatch | Genuine — known; secondary test issue | BUG-FR15-013, 014, 015; TEST-FR15-002 | [shot](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-705f6-bove-the-submit-button-FR15-chromium/test-failed-1.png) · [trace](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-705f6-bove-the-submit-button-FR15-chromium/trace.zip) |
| TC-FR15-EP-010 | Firefox | Same independent UI failures and secondary tab mismatch | Genuine — known; secondary test issue | BUG-FR15-013, 014, 015; TEST-FR15-002 | [shot](test-results/firefox/Pool-C_FR15-fr15-FR-15-Pro-705f6-bove-the-submit-button-FR15-firefox/test-failed-1.png) · [trace](test-results/firefox/Pool-C_FR15-fr15-FR-15-Pro-705f6-bove-the-submit-button-FR15-firefox/trace.zip) |
| TC-FR15-EP-010 | WebKit | Same independent UI failures and secondary tab mismatch | Genuine — known; secondary test issue | BUG-FR15-013, 014, 015; TEST-FR15-002 | [shot](test-results/webkit/Pool-C_FR15-fr15-FR-15-Pro-705f6-bove-the-submit-button-FR15-webkit/test-failed-1.png) · [trace](test-results/webkit/Pool-C_FR15-fr15-FR-15-Pro-705f6-bove-the-submit-button-FR15-webkit/trace.zip) |
| TC-FR15-NEG-005 | Chromium | Required-name error is absent | Genuine — known | BUG-FR15-014 | [shot](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-856cb-eld-is-submitted-empty-FR15-chromium/test-failed-1.png) · [trace](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-856cb-eld-is-submitted-empty-FR15-chromium/trace.zip) |
| TC-FR15-NEG-005 | Firefox | Same missing-validation failure | Genuine — known | BUG-FR15-014 | [shot](test-results/firefox/Pool-C_FR15-fr15-FR-15-Pro-856cb-eld-is-submitted-empty-FR15-firefox/test-failed-1.png) · [trace](test-results/firefox/Pool-C_FR15-fr15-FR-15-Pro-856cb-eld-is-submitted-empty-FR15-firefox/trace.zip) |
| TC-FR15-NEG-005 | WebKit | Same missing-validation failure | Genuine — known | BUG-FR15-014 | [shot](test-results/webkit/Pool-C_FR15-fr15-FR-15-Pro-856cb-eld-is-submitted-empty-FR15-webkit/test-failed-1.png) · [trace](test-results/webkit/Pool-C_FR15-fr15-FR-15-Pro-856cb-eld-is-submitted-empty-FR15-webkit/trace.zip) |
| TC-FR15-NEG-009 | Chromium | Zero-price row remains; error absent | Genuine — known | BUG-FR15-001 | [shot](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-32a4a--price-is-exactly-zero-FR15-chromium/test-failed-1.png) · [trace](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-32a4a--price-is-exactly-zero-FR15-chromium/trace.zip) |
| TC-FR15-NEG-009 | Firefox | Same zero-price acceptance | Genuine — known | BUG-FR15-001 | [shot](test-results/firefox/Pool-C_FR15-fr15-FR-15-Pro-32a4a--price-is-exactly-zero-FR15-firefox/test-failed-1.png) · [trace](test-results/firefox/Pool-C_FR15-fr15-FR-15-Pro-32a4a--price-is-exactly-zero-FR15-firefox/trace.zip) |
| TC-FR15-NEG-009 | WebKit | Same zero-price acceptance | Genuine — known | BUG-FR15-001 | [shot](test-results/webkit/Pool-C_FR15-fr15-FR-15-Pro-32a4a--price-is-exactly-zero-FR15-webkit/test-failed-1.png) · [trace](test-results/webkit/Pool-C_FR15-fr15-FR-15-Pro-32a4a--price-is-exactly-zero-FR15-webkit/trace.zip) |
| TC-FR15-NEG-010 | Chromium | Negative-price row remains; error absent | Genuine — known | BUG-FR15-002 | [shot](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-9fd86-negative-integer-value-FR15-chromium/test-failed-1.png) · [trace](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-9fd86-negative-integer-value-FR15-chromium/trace.zip) |
| TC-FR15-NEG-010 | Firefox | Same negative-price acceptance | Genuine — known | BUG-FR15-002 | [shot](test-results/firefox/Pool-C_FR15-fr15-FR-15-Pro-9fd86-negative-integer-value-FR15-firefox/test-failed-1.png) · [trace](test-results/firefox/Pool-C_FR15-fr15-FR-15-Pro-9fd86-negative-integer-value-FR15-firefox/trace.zip) |
| TC-FR15-NEG-010 | WebKit | Same negative-price acceptance | Genuine — known | BUG-FR15-002 | [shot](test-results/webkit/Pool-C_FR15-fr15-FR-15-Pro-9fd86-negative-integer-value-FR15-webkit/test-failed-1.png) · [trace](test-results/webkit/Pool-C_FR15-fr15-FR-15-Pro-9fd86-negative-integer-value-FR15-webkit/trace.zip) |
| TC-FR15-NEG-024 | Chromium | Three mandatory asterisks are absent | Genuine — known | BUG-FR15-013 | [shot](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-af043-mandatory-field-labels-FR15-chromium/test-failed-1.png) · [trace](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-af043-mandatory-field-labels-FR15-chromium/trace.zip) |
| TC-FR15-NEG-024 | Firefox | Same missing-marker failure | Genuine — known | BUG-FR15-013 | [shot](test-results/firefox/Pool-C_FR15-fr15-FR-15-Pro-af043-mandatory-field-labels-FR15-firefox/test-failed-1.png) · [trace](test-results/firefox/Pool-C_FR15-fr15-FR-15-Pro-af043-mandatory-field-labels-FR15-firefox/trace.zip) |
| TC-FR15-NEG-024 | WebKit | Same missing-marker failure | Genuine — known | BUG-FR15-013 | [shot](test-results/webkit/Pool-C_FR15-fr15-FR-15-Pro-af043-mandatory-field-labels-FR15-webkit/test-failed-1.png) · [trace](test-results/webkit/Pool-C_FR15-fr15-FR-15-Pro-af043-mandatory-field-labels-FR15-webkit/trace.zip) |
| TC-FR15-NEG-025 | Chromium | Required-name error above Save is absent | Genuine — known | BUG-FR15-014 | [shot](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-8be13-re-on-the-product-form-FR15-chromium/test-failed-1.png) · [trace](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-8be13-re-on-the-product-form-FR15-chromium/trace.zip) |
| TC-FR15-NEG-025 | Firefox | Same missing-error failure | Genuine — known | BUG-FR15-014 | [shot](test-results/firefox/Pool-C_FR15-fr15-FR-15-Pro-8be13-re-on-the-product-form-FR15-firefox/test-failed-1.png) · [trace](test-results/firefox/Pool-C_FR15-fr15-FR-15-Pro-8be13-re-on-the-product-form-FR15-firefox/trace.zip) |
| TC-FR15-NEG-025 | WebKit | Same missing-error failure | Genuine — known | BUG-FR15-014 | [shot](test-results/webkit/Pool-C_FR15-fr15-FR-15-Pro-8be13-re-on-the-product-form-FR15-webkit/test-failed-1.png) · [trace](test-results/webkit/Pool-C_FR15-fr15-FR-15-Pro-8be13-re-on-the-product-form-FR15-webkit/trace.zip) |
| TC-FR15-NEG-026 | Chromium | Expected blue; Save is green | Genuine — known | BUG-FR15-015 | [shot](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-605a4-roduct-management-page-FR15-chromium/test-failed-1.png) · [trace](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-605a4-roduct-management-page-FR15-chromium/trace.zip) |
| TC-FR15-NEG-026 | Firefox | Same colour failure | Genuine — known | BUG-FR15-015 | [shot](test-results/firefox/Pool-C_FR15-fr15-FR-15-Pro-605a4-roduct-management-page-FR15-firefox/test-failed-1.png) · [trace](test-results/firefox/Pool-C_FR15-fr15-FR-15-Pro-605a4-roduct-management-page-FR15-firefox/trace.zip) |
| TC-FR15-NEG-026 | WebKit | Same colour failure | Genuine — known | BUG-FR15-015 | [shot](test-results/webkit/Pool-C_FR15-fr15-FR-15-Pro-605a4-roduct-management-page-FR15-webkit/test-failed-1.png) · [trace](test-results/webkit/Pool-C_FR15-fr15-FR-15-Pro-605a4-roduct-management-page-FR15-webkit/trace.zip) |
| TC-FR15-NEG-027 | Chromium | Sole h1 is `EShop Admin`, not Product Management | Genuine — new | BUG-FR15-AUTO-006 | [shot](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-2de0b-n-more-than-one-h1-tag-FR15-chromium/test-failed-1.png) · [trace](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-2de0b-n-more-than-one-h1-tag-FR15-chromium/trace.zip) |
| TC-FR15-NEG-027 | Firefox | Same non-feature h1 failure | Genuine — new | BUG-FR15-AUTO-006 | [shot](test-results/firefox/Pool-C_FR15-fr15-FR-15-Pro-2de0b-n-more-than-one-h1-tag-FR15-firefox/test-failed-1.png) · [trace](test-results/firefox/Pool-C_FR15-fr15-FR-15-Pro-2de0b-n-more-than-one-h1-tag-FR15-firefox/trace.zip) |
| TC-FR15-NEG-027 | WebKit | Same non-feature h1 failure | Genuine — new | BUG-FR15-AUTO-006 | [shot](test-results/webkit/Pool-C_FR15-fr15-FR-15-Pro-2de0b-n-more-than-one-h1-tag-FR15-webkit/test-failed-1.png) · [trace](test-results/webkit/Pool-C_FR15-fr15-FR-15-Pro-2de0b-n-more-than-one-h1-tag-FR15-webkit/trace.zip) |
| TC-FR15-NEG-028 | Chromium | Expected Description focus; Image URL remains in visual order | Test/source issue | TEST-FR15-002 | [shot](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-8cd66--product-creation-form-FR15-chromium/test-failed-1.png) · [trace](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-8cd66--product-creation-form-FR15-chromium/trace.zip) |
| TC-FR15-NEG-028 | Firefox | Same over-specified tab-order failure | Test/source issue | TEST-FR15-002 | [shot](test-results/firefox/Pool-C_FR15-fr15-FR-15-Pro-8cd66--product-creation-form-FR15-firefox/test-failed-1.png) · [trace](test-results/firefox/Pool-C_FR15-fr15-FR-15-Pro-8cd66--product-creation-form-FR15-firefox/trace.zip) |
| TC-FR15-NEG-028 | WebKit | Same over-specified tab-order failure | Test/source issue | TEST-FR15-002 | [shot](test-results/webkit/Pool-C_FR15-fr15-FR-15-Pro-8cd66--product-creation-form-FR15-webkit/test-failed-1.png) · [trace](test-results/webkit/Pool-C_FR15-fr15-FR-15-Pro-8cd66--product-creation-form-FR15-webkit/trace.zip) |
| TC-FR15-NEG-029 | Chromium | Confirmation message collection is empty | Genuine — known | BUG-FR15-017 | [shot](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-c8d17--a-confirmation-dialog-FR15-chromium/test-failed-1.png) · [trace](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-c8d17--a-confirmation-dialog-FR15-chromium/trace.zip) |
| TC-FR15-NEG-029 | Firefox | Same missing-confirmation failure | Genuine — known | BUG-FR15-017 | [shot](test-results/firefox/Pool-C_FR15-fr15-FR-15-Pro-c8d17--a-confirmation-dialog-FR15-firefox/test-failed-1.png) · [trace](test-results/firefox/Pool-C_FR15-fr15-FR-15-Pro-c8d17--a-confirmation-dialog-FR15-firefox/trace.zip) |
| TC-FR15-NEG-029 | WebKit | Same missing-confirmation failure | Genuine — known | BUG-FR15-017 | [shot](test-results/webkit/Pool-C_FR15-fr15-FR-15-Pro-c8d17--a-confirmation-dialog-FR15-webkit/test-failed-1.png) · [trace](test-results/webkit/Pool-C_FR15-fr15-FR-15-Pro-c8d17--a-confirmation-dialog-FR15-webkit/trace.zip) |
| TC-FR15-BV-001 | Chromium | Name boundary succeeds; unrelated price-format assertion fails | Test issue | TEST-FR15-001 | [shot](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-24c57-ctly-2-characters-LB-1-FR15-chromium/test-failed-1.png) · [trace](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-24c57-ctly-2-characters-LB-1-FR15-chromium/trace.zip) |
| TC-FR15-BV-001 | Firefox | Same unrelated assertion | Test issue | TEST-FR15-001 | [shot](test-results/firefox/Pool-C_FR15-fr15-FR-15-Pro-24c57-ctly-2-characters-LB-1-FR15-firefox/test-failed-1.png) · [trace](test-results/firefox/Pool-C_FR15-fr15-FR-15-Pro-24c57-ctly-2-characters-LB-1-FR15-firefox/trace.zip) |
| TC-FR15-BV-001 | WebKit | Same unrelated assertion | Test issue | TEST-FR15-001 | [shot](test-results/webkit/Pool-C_FR15-fr15-FR-15-Pro-24c57-ctly-2-characters-LB-1-FR15-webkit/test-failed-1.png) · [trace](test-results/webkit/Pool-C_FR15-fr15-FR-15-Pro-24c57-ctly-2-characters-LB-1-FR15-webkit/trace.zip) |
| TC-FR15-BV-002 | Chromium | Name boundary succeeds; unrelated price-format assertion fails | Test issue | TEST-FR15-001 | [shot](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-45072-ctly-255-characters-UB-FR15-chromium/test-failed-1.png) · [trace](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-45072-ctly-255-characters-UB-FR15-chromium/trace.zip) |
| TC-FR15-BV-002 | Firefox | Same unrelated assertion | Test issue | TEST-FR15-001 | [shot](test-results/firefox/Pool-C_FR15-fr15-FR-15-Pro-45072-ctly-255-characters-UB-FR15-firefox/test-failed-1.png) · [trace](test-results/firefox/Pool-C_FR15-fr15-FR-15-Pro-45072-ctly-255-characters-UB-FR15-firefox/trace.zip) |
| TC-FR15-BV-002 | WebKit | Same unrelated assertion | Test issue | TEST-FR15-001 | [shot](test-results/webkit/Pool-C_FR15-fr15-FR-15-Pro-45072-ctly-255-characters-UB-FR15-webkit/test-failed-1.png) · [trace](test-results/webkit/Pool-C_FR15-fr15-FR-15-Pro-45072-ctly-255-characters-UB-FR15-webkit/trace.zip) |
| TC-FR15-BV-007 | Chromium | Expected formatted upper-bound price; raw digits render | Genuine — new | BUG-FR15-AUTO-001 | [shot](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-2e04e-r-boundary-UB-1-and-UB-FR15-chromium/test-failed-1.png) · [trace](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-2e04e-r-boundary-UB-1-and-UB-FR15-chromium/trace.zip) |
| TC-FR15-BV-007 | Firefox | Same raw-price failure | Genuine — new | BUG-FR15-AUTO-001 | [shot](test-results/firefox/Pool-C_FR15-fr15-FR-15-Pro-2e04e-r-boundary-UB-1-and-UB-FR15-firefox/test-failed-1.png) · [trace](test-results/firefox/Pool-C_FR15-fr15-FR-15-Pro-2e04e-r-boundary-UB-1-and-UB-FR15-firefox/trace.zip) |
| TC-FR15-BV-007 | WebKit | Same raw-price failure | Genuine — new | BUG-FR15-AUTO-001 | [shot](test-results/webkit/Pool-C_FR15-fr15-FR-15-Pro-2e04e-r-boundary-UB-1-and-UB-FR15-webkit/test-failed-1.png) · [trace](test-results/webkit/Pool-C_FR15-fr15-FR-15-Pro-2e04e-r-boundary-UB-1-and-UB-FR15-webkit/trace.zip) |
| TC-FR15-BV-008 | Chromium | Expected formatted practical probe; raw digits render | Genuine — new | BUG-FR15-AUTO-001 | [shot](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-9cde5-eshold-practical-probe-FR15-chromium/test-failed-1.png) · [trace](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-9cde5-eshold-practical-probe-FR15-chromium/trace.zip) |
| TC-FR15-BV-008 | Firefox | Same raw-price failure | Genuine — new | BUG-FR15-AUTO-001 | [shot](test-results/firefox/Pool-C_FR15-fr15-FR-15-Pro-9cde5-eshold-practical-probe-FR15-firefox/test-failed-1.png) · [trace](test-results/firefox/Pool-C_FR15-fr15-FR-15-Pro-9cde5-eshold-practical-probe-FR15-firefox/trace.zip) |
| TC-FR15-BV-008 | WebKit | Same raw-price failure | Genuine — new | BUG-FR15-AUTO-001 | [shot](test-results/webkit/Pool-C_FR15-fr15-FR-15-Pro-9cde5-eshold-practical-probe-FR15-webkit/test-failed-1.png) · [trace](test-results/webkit/Pool-C_FR15-fr15-FR-15-Pro-9cde5-eshold-practical-probe-FR15-webkit/trace.zip) |
| TC-FR15-BV-011 | Chromium | Description boundary succeeds; unrelated price-format assertion fails | Test issue | TEST-FR15-001 | [shot](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-2298c-actly-1-character-LB-1-FR15-chromium/test-failed-1.png) · [trace](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-2298c-actly-1-character-LB-1-FR15-chromium/trace.zip) |
| TC-FR15-BV-011 | Firefox | Same unrelated assertion | Test issue | TEST-FR15-001 | [shot](test-results/firefox/Pool-C_FR15-fr15-FR-15-Pro-2298c-actly-1-character-LB-1-FR15-firefox/test-failed-1.png) · [trace](test-results/firefox/Pool-C_FR15-fr15-FR-15-Pro-2298c-actly-1-character-LB-1-FR15-firefox/trace.zip) |
| TC-FR15-BV-011 | WebKit | Same unrelated assertion | Test issue | TEST-FR15-001 | [shot](test-results/webkit/Pool-C_FR15-fr15-FR-15-Pro-2298c-actly-1-character-LB-1-FR15-webkit/test-failed-1.png) · [trace](test-results/webkit/Pool-C_FR15-fr15-FR-15-Pro-2298c-actly-1-character-LB-1-FR15-webkit/trace.zip) |
| TC-FR15-BV-012 | Chromium | Description boundary succeeds; unrelated price-format assertion fails | Test issue | TEST-FR15-001 | [shot](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-ff015-tly-1000-characters-UB-FR15-chromium/test-failed-1.png) · [trace](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-ff015-tly-1000-characters-UB-FR15-chromium/trace.zip) |
| TC-FR15-BV-012 | Firefox | Same unrelated assertion | Test issue | TEST-FR15-001 | [shot](test-results/firefox/Pool-C_FR15-fr15-FR-15-Pro-ff015-tly-1000-characters-UB-FR15-firefox/test-failed-1.png) · [trace](test-results/firefox/Pool-C_FR15-fr15-FR-15-Pro-ff015-tly-1000-characters-UB-FR15-firefox/trace.zip) |
| TC-FR15-BV-012 | WebKit | Same unrelated assertion | Test issue | TEST-FR15-001 | [shot](test-results/webkit/Pool-C_FR15-fr15-FR-15-Pro-ff015-tly-1000-characters-UB-FR15-webkit/test-failed-1.png) · [trace](test-results/webkit/Pool-C_FR15-fr15-FR-15-Pro-ff015-tly-1000-characters-UB-FR15-webkit/trace.zip) |

## Detailed product defects

All defects affect Chromium, Firefox, and WebKit. The matrix supplies per-result artifacts; each section links a representative trace/screenshot and all three reports.

### BUG-FR15-001 — Zero price is accepted

- **Known/New:** Known HW2 defect; **Severity:** Serious; **Source:** TC-FR15-NEG-009; [GitHub Issue 42](https://github.com/AkiraTomori/eshop-sut/issues/42)
- **Expected:** Price `0` is rejected with an exact visible validation error and no product row is created.
- **Actual/assertion:** The row count is 1 and the price error is absent in all browsers.
- **Evidence:** [screenshot](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-32a4a--price-is-exactly-zero-FR15-chromium/test-failed-1.png), [trace](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-32a4a--price-is-exactly-zero-FR15-chromium/trace.zip), [Chromium report](playwright-report/chromium/index.html), [Firefox report](playwright-report/firefox/index.html), [WebKit report](playwright-report/webkit/index.html).
- **Impact:** Invalid free products enter the catalogue through Web Admin.

### BUG-FR15-002 — Negative price is accepted

- **Known/New:** Known HW2 defect; **Severity:** Serious; **Source:** TC-FR15-NEG-010; [GitHub Issue 43](https://github.com/AkiraTomori/eshop-sut/issues/43)
- **Expected:** A negative price is rejected and the product is not created.
- **Actual/assertion:** The negative-price row remains and no validation error renders.
- **Evidence:** [screenshot](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-9fd86-negative-integer-value-FR15-chromium/test-failed-1.png), [trace](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-9fd86-negative-integer-value-FR15-chromium/trace.zip), [Chromium report](playwright-report/chromium/index.html), [Firefox report](playwright-report/firefox/index.html), [WebKit report](playwright-report/webkit/index.html).
- **Impact:** Administrators can publish nonsensical negative prices.

### BUG-FR15-013 — Mandatory field indicators are missing

- **Known/New:** Known HW2 defect; **Severity:** Medium; **Source:** TC-FR15-EP-010 and NEG-024; [GitHub Issue 54](https://github.com/AkiraTomori/eshop-sut/issues/54)
- **Expected:** Name, Price, and Category labels each display `*`.
- **Actual/assertion:** All three exact marker locators are absent.
- **Evidence:** [screenshot](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-af043-mandatory-field-labels-FR15-chromium/test-failed-1.png), [trace](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-af043-mandatory-field-labels-FR15-chromium/trace.zip), [Chromium report](playwright-report/chromium/index.html), [Firefox report](playwright-report/firefox/index.html), [WebKit report](playwright-report/webkit/index.html).
- **Impact:** The form does not communicate required inputs.

### BUG-FR15-014 — Required validation errors are absent

- **Known/New:** Known HW2 defect; **Severity:** Medium; **Source:** TC-FR15-EP-010, NEG-005, and NEG-025; [GitHub Issue 55](https://github.com/AkiraTomori/eshop-sut/issues/55)
- **Expected:** Empty mandatory input shows its exact error above Save and blocks creation.
- **Actual/assertion:** The required error locator is absent; only native `required` behaviour exists for Name and no specified message renders.
- **Evidence:** [screenshot](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-856cb-eld-is-submitted-empty-FR15-chromium/test-failed-1.png), [trace](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-856cb-eld-is-submitted-empty-FR15-chromium/trace.zip), [Chromium report](playwright-report/chromium/index.html), [Firefox report](playwright-report/firefox/index.html), [WebKit report](playwright-report/webkit/index.html).
- **Impact:** Validation guidance and placement violate the required form behaviour.

### BUG-FR15-015 — Save button is green instead of blue

- **Known/New:** Known HW2 defect; **Severity:** Medium; **Source:** TC-FR15-EP-010 and NEG-026; [GitHub Issue 56](https://github.com/AkiraTomori/eshop-sut/issues/56)
- **Expected:** The positive Save action is blue (`rgb(37, 99, 235)`).
- **Actual/assertion:** `toHaveCSS` receives green (`rgb(22, 163, 74)`).
- **Evidence:** [screenshot](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-605a4-roduct-management-page-FR15-chromium/test-failed-1.png), [trace](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-605a4-roduct-management-page-FR15-chromium/trace.zip), [Chromium report](playwright-report/chromium/index.html), [Firefox report](playwright-report/firefox/index.html), [WebKit report](playwright-report/webkit/index.html).
- **Impact:** Positive-action colour is inconsistent with the required UI language.

### BUG-FR15-017 — Delete confirmation is absent

- **Known/New:** Known HW2 defect; **Severity:** Serious; **Source:** TC-FR15-EP-004, EP-005, and NEG-029; [GitHub Issue 58](https://github.com/AkiraTomori/eshop-sut/issues/58)
- **Expected:** Delete prompts for confirmation; cancel retains the unchanged product and confirm performs deletion.
- **Actual/assertion:** No dialog message is captured and deletion occurs immediately, removing the cancel safeguard.
- **Evidence:** [screenshot](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-976ae-te-confirmation-dialog-FR15-chromium/test-failed-1.png), [trace](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-976ae-te-confirmation-dialog-FR15-chromium/trace.zip), [Chromium report](playwright-report/chromium/index.html), [Firefox report](playwright-report/firefox/index.html), [WebKit report](playwright-report/webkit/index.html).
- **Impact:** A destructive operation has no user confirmation or cancellation path.

### BUG-FR15-AUTO-001 — Product-list prices lack thousands separators

- **Known/New:** Automation-discovered; **Severity:** Medium; **Source:** TC-FR15-EP-001, EP-002, EP-006, BV-007, and BV-008; **GitHub Issue:** https://github.com/AkiraTomori/eshop-sut/issues/62
- **Expected:** Prices render with grouping separators, for example `15,000,000`.
- **Actual/assertion:** Rows render raw numeric strings such as `15000000`; `App.jsx` displays `p.price` directly.
- **Evidence:** [screenshot](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-3346c-lds-contain-valid-data-FR15-chromium/test-failed-1.png), [trace](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-3346c-lds-contain-valid-data-FR15-chromium/trace.zip), [Chromium report](playwright-report/chromium/index.html), [Firefox report](playwright-report/firefox/index.html), [WebKit report](playwright-report/webkit/index.html).
- **Impact:** Large monetary values are harder to scan and do not meet the required display format.

### BUG-FR15-AUTO-002 — Successful deletion has no success notification

- **Known/New:** Automation-discovered; **Severity:** Medium; **Source:** TC-FR15-EP-004; **GitHub Issue:** https://github.com/AkiraTomori/eshop-sut/issues/63
- **Expected:** After confirmed deletion, an exact success notification is visible and the row disappears.
- **Actual/assertion:** The row disappears but the success locator is absent. This is independent of the missing confirmation in BUG-FR15-017.
- **Evidence:** [screenshot](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-2cbd3-te-confirmation-dialog-FR15-chromium/test-failed-1.png), [trace](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-2cbd3-te-confirmation-dialog-FR15-chromium/trace.zip), [Chromium report](playwright-report/chromium/index.html), [Firefox report](playwright-report/firefox/index.html), [WebKit report](playwright-report/webkit/index.html).
- **Impact:** Administrators receive no completion feedback for a destructive action.

### BUG-FR15-AUTO-003 — Product search and empty-result state are absent

- **Known/New:** Automation-discovered; **Severity:** Serious; **Source:** TC-FR15-EP-007 and EP-008; **GitHub Issue:** https://github.com/AkiraTomori/eshop-sut/issues/64
- **Expected:** Admin can search by keyword; matching rows remain and a no-match query shows the required empty state.
- **Actual/assertion:** `getByRole('searchbox')` is absent, so neither search path is available.
- **Evidence:** [screenshot](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-c0032-rch-keyword-is-entered-FR15-chromium/test-failed-1.png), [trace](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-c0032-rch-keyword-is-entered-FR15-chromium/trace.zip), [Chromium report](playwright-report/chromium/index.html), [Firefox report](playwright-report/firefox/index.html), [WebKit report](playwright-report/webkit/index.html).
- **Impact:** Product discovery becomes impractical as the catalogue grows.

### BUG-FR15-AUTO-004 — Product detail action/view is absent in Web Admin

- **Known/New:** Automation-discovered; **Severity:** Serious; **Source:** TC-FR15-EP-009; **GitHub Issue:** https://github.com/AkiraTomori/eshop-sut/issues/65
- **Expected:** A valid admin can open a product detail view and see the complete record.
- **Actual/assertion:** The product row has Edit/Delete only; the View/details action locator is absent.
- **Evidence:** [screenshot](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-5971b-essed-by-a-valid-admin-FR15-chromium/test-failed-1.png), [trace](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-5971b-essed-by-a-valid-admin-FR15-chromium/trace.zip), [Chromium report](playwright-report/chromium/index.html), [Firefox report](playwright-report/firefox/index.html), [WebKit report](playwright-report/webkit/index.html).
- **Impact:** Admin cannot inspect a product without entering an edit flow.

### BUG-FR15-AUTO-005 — Product-list loading indicator is absent

- **Known/New:** Automation-discovered; **Severity:** Medium; **Source:** TC-FR15-EP-006; **GitHub Issue:** https://github.com/AkiraTomori/eshop-sut/issues/66
- **Expected:** A loading indicator is visible while the list is fetched and disappears when rows render.
- **Actual/assertion:** The soft `toBeVisible` assertion for the progressbar times out; source has no loading state. The later category-column assertion was not reached after the hard price assertion and is not claimed as browser-confirmed.
- **Evidence:** [screenshot](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-ca1bf-thout-a-search-keyword-FR15-chromium/test-failed-1.png), [trace](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-ca1bf-thout-a-search-keyword-FR15-chromium/trace.zip), [Chromium report](playwright-report/chromium/index.html), [Firefox report](playwright-report/firefox/index.html), [WebKit report](playwright-report/webkit/index.html).
- **Impact:** Users receive no feedback during list loading.

### BUG-FR15-AUTO-006 — Product Management lacks a meaningful feature-level h1

- **Known/New:** Automation-discovered; **Severity:** Medium; **Source:** TC-FR15-NEG-027; **GitHub Issue:** https://github.com/AkiraTomori/eshop-sut/issues/67
- **Expected:** Exactly one meaningful h1 identifies Product Management.
- **Actual/assertion:** The sole h1 is global text `EShop Admin`; `Quản lý Sản phẩm` is an h2. This differs from canonical BUG-FR15-016, which recorded zero h1 elements, so the old ID is not reused.
- **Evidence:** [screenshot](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-2de0b-n-more-than-one-h1-tag-FR15-chromium/test-failed-1.png), [trace](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-2de0b-n-more-than-one-h1-tag-FR15-chromium/trace.zip), [Chromium report](playwright-report/chromium/index.html), [Firefox report](playwright-report/firefox/index.html), [WebKit report](playwright-report/webkit/index.html).
- **Impact:** Heading semantics do not identify the active admin feature for assistive navigation.

## Test and source issues

### TEST-FR15-001 — Boundary helpers assert unrelated price formatting

- **Severity:** Medium; **Affected results:** BV-001, BV-002, BV-011, and BV-012 across three browsers (12 exclusive failures).
- **Cause:** The shared create-and-verify helper always asserts formatted price, although these four authoritative TCs test only Name or Description boundaries.
- **Evidence:** Their intended boundary values are created and re-opened successfully before the unrelated price assertion fails.
- **Correction:** Split persistence verification from presentation-format verification; keep price formatting only in TCs that specify it. Rerun these four cases after HITL approves the script correction.

### TEST-FR15-002 — Tab-order expectation conflicts with the SRS visual-order rule

- **Severity:** Medium; **Affected results:** NEG-028 across three browsers (exclusive), plus a secondary EP-010 observation.
- **Cause:** HW2 NEG-028 lists Description before Image URL, while the reviewed SRS requires top-to-bottom/left-to-right order and the actual visual/DOM order is Name → Price → Image URL → Description → Category → Save. HW2 also recorded the current UI as passing.
- **Evidence:** Focus remains on Image URL when the test expects Description in every browser.
- **Correction:** Obtain HITL resolution of the source discrepancy, then align either the UI layout or external expected-order data. Do not file a product bug until that requirement is resolved.

Tracked Run #1 is an infrastructure attempt with zero test executions and is not part of this classification. Run #2 contains no browser-specific infrastructure failure.

## Out-of-scope observations

No Run #2 failure came from API/database activity. The 21 API-dependent HW2 cases listed in [the automation review](fr15-automation-review.md#api-dependent-cases-excluded-from-hw4) remain excluded and are not presented as browser confirmations. The category-column clause in EP-006 was not reached after a hard assertion and is not claimed as passed or failed.

## GitHub Issues

All six automation-discovered defects are filed as verified GitHub Issues 62–67. The sections below retain the submitted issue content and evidence links.

### BUG-FR15-AUTO-001 — Product-list prices lack thousands separators

- **Severity:** Medium; **Browsers:** Chromium, Firefox, WebKit; **Source TCs:** EP-001, EP-002, EP-006, BV-007, BV-008
- **Steps:** Log in to Web Admin, create a product with a multi-digit price, and inspect its row.
- **Expected:** Grouped price such as `15,000,000`.
- **Actual:** Raw `15000000` is rendered.
- **Evidence:** [full report](playwright-report/index.html), [screenshot](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-3346c-lds-contain-valid-data-FR15-chromium/test-failed-1.png), [trace](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-3346c-lds-contain-valid-data-FR15-chromium/trace.zip).
- **GitHub Issue URL:** https://github.com/AkiraTomori/eshop-sut/issues/62

### BUG-FR15-AUTO-002 — Successful deletion has no success notification

- **Severity:** Medium; **Browsers:** Chromium, Firefox, WebKit; **Source TC:** EP-004
- **Steps:** Create a disposable product through Web Admin, choose Delete, and observe post-deletion feedback.
- **Expected:** Exact deletion-success notification and removed row.
- **Actual:** Row is removed with no success notification.
- **Evidence:** [full report](playwright-report/index.html), [screenshot](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-2cbd3-te-confirmation-dialog-FR15-chromium/test-failed-1.png), [trace](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-2cbd3-te-confirmation-dialog-FR15-chromium/trace.zip).
- **GitHub Issue URL:** https://github.com/AkiraTomori/eshop-sut/issues/63

### BUG-FR15-AUTO-003 — Product search and empty-result state are absent

- **Severity:** Serious; **Browsers:** Chromium, Firefox, WebKit; **Source TCs:** EP-007, EP-008
- **Steps:** Open Product Management and attempt to search for a matching and non-matching product name.
- **Expected:** Search input filters rows; no-match query shows the required empty state.
- **Actual:** No search input or search-result state exists.
- **Evidence:** [full report](playwright-report/index.html), [screenshot](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-c0032-rch-keyword-is-entered-FR15-chromium/test-failed-1.png), [trace](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-c0032-rch-keyword-is-entered-FR15-chromium/trace.zip).
- **GitHub Issue URL:** https://github.com/AkiraTomori/eshop-sut/issues/64

### BUG-FR15-AUTO-004 — Product detail action/view is absent in Web Admin

- **Severity:** Serious; **Browsers:** Chromium, Firefox, WebKit; **Source TC:** EP-009
- **Steps:** Open Product Management and inspect a valid product row for a detail/view action.
- **Expected:** Admin can open and review complete product details.
- **Actual:** Only Edit and Delete actions exist.
- **Evidence:** [full report](playwright-report/index.html), [screenshot](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-5971b-essed-by-a-valid-admin-FR15-chromium/test-failed-1.png), [trace](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-5971b-essed-by-a-valid-admin-FR15-chromium/trace.zip).
- **GitHub Issue URL:** https://github.com/AkiraTomori/eshop-sut/issues/65

### BUG-FR15-AUTO-005 — Product-list loading indicator is absent

- **Severity:** Medium; **Browsers:** Chromium, Firefox, WebKit; **Source TC:** EP-006
- **Steps:** Open Product Management from a fresh admin page and observe the list while data loads.
- **Expected:** A loading progress indicator appears and then disappears.
- **Actual:** No progressbar/loading state renders.
- **Evidence:** [full report](playwright-report/index.html), [screenshot](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-ca1bf-thout-a-search-keyword-FR15-chromium/test-failed-1.png), [trace](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-ca1bf-thout-a-search-keyword-FR15-chromium/trace.zip).
- **GitHub Issue URL:** https://github.com/AkiraTomori/eshop-sut/issues/66

### BUG-FR15-AUTO-006 — Product Management lacks a meaningful feature-level h1

- **Severity:** Medium; **Browsers:** Chromium, Firefox, WebKit; **Source TC:** NEG-027
- **Steps:** Open Product Management and inspect level-one headings.
- **Expected:** Exactly one h1 identifies Product Management.
- **Actual:** `EShop Admin` is the only h1 and the feature title is h2.
- **Evidence:** [full report](playwright-report/index.html), [screenshot](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-2de0b-n-more-than-one-h1-tag-FR15-chromium/test-failed-1.png), [trace](test-results/chromium/Pool-C_FR15-fr15-FR-15-Pro-2de0b-n-more-than-one-h1-tag-FR15-chromium/trace.zip).
- **GitHub Issue URL:** https://github.com/AkiraTomori/eshop-sut/issues/67
