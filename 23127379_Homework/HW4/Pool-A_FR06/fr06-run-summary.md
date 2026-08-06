<!-- HW4_RUN_COUNT: 2 -->
# FR-06 Automation Run Summary

- **Tracked FR run sessions:** 2
- **Last updated:** 2026-08-06, 17:40:09 (Asia/Ho_Chi_Minh)
- **Runner:** 23127379
- **Scope:** One session represents one invocation of `npm run test:fr06`, including Chromium, Firefox, and WebKit attempts.

## Open the full FR report

This opens one overview containing Chromium, Firefox, and WebKit:

```bash
npx playwright show-report Pool-A_FR06/playwright-report
```

## Open one browser report

Run these commands from `23127379_Homework/HW4`. Stop the report server with `Ctrl+C`.

```bash
npx playwright show-report Pool-A_FR06/playwright-report/chromium
npx playwright show-report Pool-A_FR06/playwright-report/firefox
npx playwright show-report Pool-A_FR06/playwright-report/webkit
```

Only one report server should use the default port at a time. If needed, add `--port <number>` to a command.

<!-- HW4_RUN_HISTORY -->

## Run #1 — 2026-07-31 09:48:51

| Browser | Process | Passed | Failed | Flaky | Skipped | Total | Duration | HTML report | JSON result |
|---|---|---:|---:|---:|---:|---:|---:|---|---|
| chromium | Failed (exit 1) | 7 | 15 | 0 | 0 | 22 | 192.0s | [Open](playwright-report/chromium/index.html) | [JSON](test-results/chromium/results.json) |
| firefox | Failed (exit 1) | 7 | 15 | 0 | 0 | 22 | 220.7s | [Open](playwright-report/firefox/index.html) | [JSON](test-results/firefox/results.json) |
| webkit | Failed (exit 1) | 7 | 15 | 0 | 0 | 22 | 222.3s | [Open](playwright-report/webkit/index.html) | [JSON](test-results/webkit/results.json) |

The nonzero browser exits reflect failed assertions; all three Playwright processes completed and produced reports.

---

## Run #2 — 2026-08-06, 17:30:20

| Browser | Process | Passed | Failed | Flaky | Skipped | Total | Duration | HTML report | JSON result |
|---|---|---:|---:|---:|---:|---:|---:|---|---|
| chromium | Failed (exit 1) | 7 | 15 | 0 | 0 | 22 | 184.6s | [Open](playwright-report/chromium/index.html) | [JSON](test-results/chromium/results.json) |
| firefox | Failed (exit 1) | 7 | 15 | 0 | 0 | 22 | 200.3s | [Open](playwright-report/firefox/index.html) | [JSON](test-results/firefox/results.json) |
| webkit | Failed (exit 1) | 7 | 15 | 0 | 0 | 22 | 202.7s | [Open](playwright-report/webkit/index.html) | [JSON](test-results/webkit/results.json) |


