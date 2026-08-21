---
description: Print one Pool-local AI audit or the root consolidated AI Audit Report
argument-hint: "<pool-a|pool-b|pool-c|root|all; default=current-pool>"
---

Read `AGENTS.md` completely and obey section 3. This is a read-only command: do not create or execute any GET, Postman, Newman, or API request, do not alter the log, and do not advance a stage or pool. The `X-Student-Id: {StudentID}` rule remains mandatory if a future command creates requests.

Resolve `$ARGUMENTS` as follows: omitted means the current Pool from `progress.md`; `pool-a`, `pool-b`, and `pool-c` mean that Pool's `ai_audit_report.md`; `root` means `23127379_Homework/HW6/ai_audit_report.md`; and `all` means the three Pool reports followed by the root report. Reject any other value.

Read and print the selected file(s) verbatim. Do not append an audit row for reading an audit, change a Human Review decision, summarize, normalize, aggregate, or rewrite any file.
