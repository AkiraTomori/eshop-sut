---
name: playwright-setup
description: "Initialize or repair the shared HW04 Playwright infrastructure, including three browser projects, reusable auth state, data-driven environment configuration, and separate per-FR/per-browser HTML reports showing the student ID. Use once before FR automation or when infrastructure changes."
---

# Set up HW04 Playwright once

Obey `AGENTS.md`. Invoke `playwright-core` and `playwright-ci` as supporting skills for this gate. Read:

- `../playwright/core/configuration.md`
- `../playwright/core/authentication.md`
- `../playwright/ci/projects-and-dependencies.md`
- `../playwright/ci/reporting-and-artifacts.md`
- `../playwright/ci/global-setup-teardown.md`

Do not load a CI-provider guide unless the user requested that provider. Record the supporting skills and guides in this invocation's audit block.

## Required outputs

Maintain these shared files:

```text
23127379_Homework/HW4/package.json
23127379_Homework/HW4/playwright.config.ts
23127379_Homework/HW4/global-setup.ts
23127379_Homework/HW4/global-teardown.ts
23127379_Homework/HW4/test-environment.json
23127379_Homework/HW4/scripts/run-feature.mjs
23127379_Homework/HW4/tsconfig.json
```

## Configuration requirements

- Use the installed Playwright version consistently; do not claim `latest` while pinning an unrelated old version.
- Support Node versions required by that installed Playwright release.
- Declare Chromium, Firefox, and WebKit projects.
- Set HTML report title to `EShop HW04 Automation — Run by: 23127379`.
- Keep retries CI-only, use web-first timeouts, and retain failure screenshot/trace/video.
- Load URLs, accounts, and auth-state paths from `test-environment.json`; do not hardcode them in setup code.
- Save user/admin storage states in global setup.
- Require authenticated describe blocks to load the correct state explicitly; unauthenticated blocks must use empty state.
- Never state that storage state is reused unless the generated specs/config actually load it.

## Report runner

`scripts/run-feature.mjs FR06|FR08|FR15` must run browsers sequentially and write:

```text
Pool-[X]_FR##/playwright-report/chromium/index.html
Pool-[X]_FR##/playwright-report/firefox/index.html
Pool-[X]_FR##/playwright-report/webkit/index.html
```

Keep each run's JSON/test artefacts in a browser-specific path so runs cannot overwrite one another.

## Setup gate

Validate:

```text
npm install
npx playwright install
npx playwright --version
npx tsc --noEmit
npx playwright test --list
```

`--list` may report no tests before the first FR is generated; config/type errors must still be absent. Verify the report title through generated report metadata after the first real run.

After setup completes, invoke `ai-audit-logger` once and append to `Infrastructure-AI-Audit.md`. Do not rerun this skill for each FR unless infrastructure changed.
