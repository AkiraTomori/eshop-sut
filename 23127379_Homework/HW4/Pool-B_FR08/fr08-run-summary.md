<!-- HW4_RUN_COUNT: 2 -->
# FR-08 Automation Run Summary

- **Tracked FR run sessions:** 2
- **Last updated:** 2026-07-31, 14:54:30 (Asia/Ho_Chi_Minh)
- **Runner:** 23127379
- **Scope:** One session represents one invocation of `npm run test:fr08`, including Chromium, Firefox, and WebKit attempts.

## Open the full FR report

This opens one overview containing Chromium, Firefox, and WebKit:

```bash
npx playwright show-report Pool-B_FR08/playwright-report
```

## Open one browser report

Run these commands from `23127379_Homework/HW4`. Stop the report server with `Ctrl+C`.

```bash
npx playwright show-report Pool-B_FR08/playwright-report/chromium
npx playwright show-report Pool-B_FR08/playwright-report/firefox
npx playwright show-report Pool-B_FR08/playwright-report/webkit
```

Only one report server should use the default port at a time. If needed, add `--port <number>` to a command.

<!-- HW4_RUN_HISTORY -->

## Run #1 — 2026-07-31, 14:39:08

| Browser | Process | Passed | Failed | Flaky | Skipped | Total | Duration | HTML report | JSON result |
|---|---|---:|---:|---:|---:|---:|---:|---|---|
| chromium | Failed (exit 1) | 0 | 0 | 0 | 0 | 0 | 0.3s | [Open](playwright-report/chromium/index.html) | [JSON](test-results/chromium/results.json) |
| firefox | Failed (exit 1) | 0 | 0 | 0 | 0 | 0 | 0.2s | [Open](playwright-report/firefox/index.html) | [JSON](test-results/firefox/results.json) |
| webkit | Failed (exit 1) | 0 | 0 | 0 | 0 | 0 | 0.2s | [Open](playwright-report/webkit/index.html) | [JSON](test-results/webkit/results.json) |

---

## Run #2 — 2026-07-31, 14:40:20

| Browser | Process | Passed | Failed | Flaky | Skipped | Total | Duration | HTML report | JSON result |
|---|---|---:|---:|---:|---:|---:|---:|---|---|
| chromium | Failed (exit 1) | 1 | 13 | 0 | 0 | 14 | 270.3s | [Open](playwright-report/chromium/index.html) | [JSON](test-results/chromium/results.json) |
| firefox | Failed (exit 1) | 1 | 13 | 0 | 0 | 14 | 296.0s | [Open](playwright-report/firefox/index.html) | [JSON](test-results/firefox/results.json) |
| webkit | Failed (exit 1) | 1 | 13 | 0 | 0 | 14 | 281.9s | [Open](playwright-report/webkit/index.html) | [JSON](test-results/webkit/results.json) |


