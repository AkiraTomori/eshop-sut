<!-- HW4_RUN_COUNT: 2 -->
# FR-15 Automation Run Summary

- **Tracked FR run sessions:** 2
- **Last updated:** 2026-08-01, 17:37:21 (Asia/Ho_Chi_Minh)
- **Runner:** 23127379
- **Scope:** One session represents one invocation of `npm run test:fr15`, including Chromium, Firefox, and WebKit attempts.

## Open the full FR report

This opens one overview containing Chromium, Firefox, and WebKit:

```bash
npx playwright show-report Pool-C_FR15/playwright-report
```

## Open one browser report

Run these commands from `23127379_Homework/HW4`. Stop the report server with `Ctrl+C`.

```bash
npx playwright show-report Pool-C_FR15/playwright-report/chromium
npx playwright show-report Pool-C_FR15/playwright-report/firefox
npx playwright show-report Pool-C_FR15/playwright-report/webkit
```

Only one report server should use the default port at a time. If needed, add `--port <number>` to a command.

<!-- HW4_RUN_HISTORY -->

## Run #1 — 2026-08-01, 17:22:17

| Browser | Process | Passed | Failed | Flaky | Skipped | Total | Duration | HTML report | JSON result |
|---|---|---:|---:|---:|---:|---:|---:|---|---|
| chromium | Failed (exit 1) | 0 | 0 | 0 | 0 | 0 | 0.3s | [Open](playwright-report/chromium/index.html) | [JSON](test-results/chromium/results.json) |
| firefox | Failed (exit 1) | 0 | 0 | 0 | 0 | 0 | 0.3s | [Open](playwright-report/firefox/index.html) | [JSON](test-results/firefox/results.json) |
| webkit | Failed (exit 1) | 0 | 0 | 0 | 0 | 0 | 0.4s | [Open](playwright-report/webkit/index.html) | [JSON](test-results/webkit/results.json) |

---

## Run #2 — 2026-08-01, 17:24:28

| Browser | Process | Passed | Failed | Flaky | Skipped | Total | Duration | HTML report | JSON result |
|---|---|---:|---:|---:|---:|---:|---:|---|---|
| chromium | Failed (exit 1) | 1 | 24 | 0 | 0 | 25 | 233.5s | [Open](playwright-report/chromium/index.html) | [JSON](test-results/chromium/results.json) |
| firefox | Failed (exit 1) | 1 | 24 | 0 | 0 | 25 | 284.3s | [Open](playwright-report/firefox/index.html) | [JSON](test-results/firefox/results.json) |
| webkit | Failed (exit 1) | 1 | 24 | 0 | 0 | 25 | 253.2s | [Open](playwright-report/webkit/index.html) | [JSON](test-results/webkit/results.json) |


