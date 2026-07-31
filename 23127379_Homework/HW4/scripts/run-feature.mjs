import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const playwrightCli = require.resolve('@playwright/test/cli');
const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const hw4Directory = path.resolve(scriptDirectory, '..');

const features = {
  FR06: {
    displayId: 'FR-06',
    fileId: 'fr06',
    pool: 'Pool-A_FR06',
    spec: 'Pool-A_FR06/fr06.spec.ts',
  },
  FR08: {
    displayId: 'FR-08',
    fileId: 'fr08',
    pool: 'Pool-B_FR08',
    spec: 'Pool-B_FR08/fr08.spec.ts',
  },
  FR15: {
    displayId: 'FR-15',
    fileId: 'fr15',
    pool: 'Pool-C_FR15',
    spec: 'Pool-C_FR15/fr15.spec.ts',
  },
};

const featureId = process.argv[2]?.toUpperCase();
const feature = features[featureId];

if (!feature) {
  process.stderr.write('Usage: node scripts/run-feature.mjs FR06|FR08|FR15\n');
  process.exit(2);
}

const browsers = ['chromium', 'firefox', 'webkit'];
const runStartedAt = new Date();
const browserResults = [];

function formatTimestamp(date) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);
}

function formatDuration(duration) {
  if (!Number.isFinite(duration)) {
    return 'N/A';
  }

  return `${(duration / 1000).toFixed(1)}s`;
}

function readStats(jsonResultPath) {
  try {
    const report = JSON.parse(fs.readFileSync(jsonResultPath, 'utf8'));
    const stats = report.stats;

    if (!stats) {
      throw new Error('Playwright JSON report has no stats object');
    }

    return {
      passed: stats.expected ?? 0,
      failed: stats.unexpected ?? 0,
      flaky: stats.flaky ?? 0,
      skipped: stats.skipped ?? 0,
      total:
        (stats.expected ?? 0) +
        (stats.unexpected ?? 0) +
        (stats.flaky ?? 0) +
        (stats.skipped ?? 0),
      duration: formatDuration(stats.duration),
      statsError: null,
    };
  } catch (error) {
    return {
      passed: 'N/A',
      failed: 'N/A',
      flaky: 'N/A',
      skipped: 'N/A',
      total: 'N/A',
      duration: 'N/A',
      statsError: error instanceof Error ? error.message : String(error),
    };
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function writeFeatureReportIndex(currentFeature, results, runCount) {
  const reportRoot = path.join(
    hw4Directory,
    currentFeature.pool,
    'playwright-report',
  );
  fs.mkdirSync(reportRoot, { recursive: true });

  const cards = results
    .map((result) => {
      const statusClass = result.exitCode === 0 ? 'passed' : 'failed';
      const statusLabel =
        result.exitCode === 0 ? 'Completed' : `Failed (exit ${result.exitCode})`;

      return `<article class="card ${statusClass}">
        <div class="card-heading">
          <h2>${escapeHtml(result.browser)}</h2>
          <span class="status">${escapeHtml(statusLabel)}</span>
        </div>
        <dl>
          <div><dt>Passed</dt><dd>${escapeHtml(result.passed)}</dd></div>
          <div><dt>Failed</dt><dd>${escapeHtml(result.failed)}</dd></div>
          <div><dt>Flaky</dt><dd>${escapeHtml(result.flaky)}</dd></div>
          <div><dt>Skipped</dt><dd>${escapeHtml(result.skipped)}</dd></div>
          <div><dt>Total</dt><dd>${escapeHtml(result.total)}</dd></div>
          <div><dt>Duration</dt><dd>${escapeHtml(result.duration)}</dd></div>
        </dl>
        <a class="button" href="./${escapeHtml(result.browser)}/index.html">Open ${escapeHtml(result.browser)} report</a>
      </article>`;
    })
    .join('\n');
  const totalExecutions = results.reduce(
    (total, result) =>
      typeof result.total === 'number' ? total + result.total : total,
    0,
  );
  const indexHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(currentFeature.displayId)} Full Browser Report — Run by: 23127379</title>
  <style>
    :root { color-scheme: light; font-family: Inter, ui-sans-serif, system-ui, sans-serif; background: #f5f7fb; color: #172033; }
    body { margin: 0; }
    main { width: min(1120px, calc(100% - 32px)); margin: 0 auto; padding: 48px 0; }
    header { margin-bottom: 28px; }
    h1 { margin: 0 0 8px; font-size: clamp(28px, 5vw, 44px); }
    header p { margin: 6px 0; color: #536078; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 18px; }
    .card { background: white; border: 1px solid #dce2ec; border-top: 5px solid #667085; border-radius: 14px; padding: 20px; box-shadow: 0 8px 24px rgb(23 32 51 / 7%); }
    .card.passed { border-top-color: #16803c; }
    .card.failed { border-top-color: #c43232; }
    .card-heading { display: flex; justify-content: space-between; gap: 12px; align-items: center; }
    h2 { margin: 0; text-transform: capitalize; }
    .status { font-size: 13px; font-weight: 700; }
    dl { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin: 22px 0; }
    dl div { background: #f5f7fb; border-radius: 8px; padding: 10px; }
    dt { color: #667085; font-size: 12px; }
    dd { margin: 4px 0 0; font-size: 18px; font-weight: 700; }
    .button { display: block; padding: 11px 14px; border-radius: 8px; background: #2447d8; color: white; font-weight: 700; text-align: center; text-decoration: none; }
    footer { margin-top: 28px; color: #667085; font-size: 13px; }
  </style>
</head>
<body>
  <main>
    <header>
      <h1>${escapeHtml(currentFeature.displayId)} Full Browser Report</h1>
      <p>Tracked run #${escapeHtml(runCount)} · ${escapeHtml(formatTimestamp(runStartedAt))} (Asia/Ho_Chi_Minh)</p>
      <p>${escapeHtml(totalExecutions)} browser test executions across Chromium, Firefox, and WebKit · Run by: 23127379</p>
    </header>
    <section class="grid" aria-label="Browser reports">
      ${cards}
    </section>
    <footer>This overview links to the latest isolated Playwright HTML report for each browser.</footer>
  </main>
</body>
</html>
`;

  fs.writeFileSync(path.join(reportRoot, 'index.html'), indexHtml, 'utf8');
}

function writeRunSummary(currentFeature, results) {
  const poolDirectory = path.join(hw4Directory, currentFeature.pool);
  fs.mkdirSync(poolDirectory, { recursive: true });

  const summaryPath = path.join(
    poolDirectory,
    `${currentFeature.fileId}-run-summary.md`,
  );
  const existingSummary = fs.existsSync(summaryPath)
    ? fs.readFileSync(summaryPath, 'utf8')
    : '';
  const previousRunCount = Number(
    existingSummary.match(/<!-- HW4_RUN_COUNT: (\d+) -->/)?.[1] ?? 0,
  );
  const runCount = previousRunCount + 1;
  const historyMarker = '<!-- HW4_RUN_HISTORY -->';
  const existingHistory = existingSummary.includes(historyMarker)
    ? existingSummary.split(historyMarker)[1].trim()
    : '';
  const updatedAt = formatTimestamp(new Date());

  const showReportCommands = browsers
    .map(
      (browser) =>
        `npx playwright show-report ${currentFeature.pool}/playwright-report/${browser}`,
    )
    .join('\n');
  const showFullReportCommand = `npx playwright show-report ${currentFeature.pool}/playwright-report`;
  const rows = results
    .map((result) => {
      const reportLink = `playwright-report/${result.browser}/index.html`;
      const jsonLink = `test-results/${result.browser}/results.json`;
      const processStatus =
        result.exitCode === 0 ? 'Completed' : `Failed (exit ${result.exitCode})`;

      return `| ${result.browser} | ${processStatus} | ${result.passed} | ${result.failed} | ${result.flaky} | ${result.skipped} | ${result.total} | ${result.duration} | [Open](${reportLink}) | [JSON](${jsonLink}) |`;
    })
    .join('\n');
  const notes = results
    .filter((result) => result.processError || result.statsError)
    .map((result) => {
      const detail = result.processError ?? result.statsError;
      return `- **${result.browser}:** ${detail}`;
    })
    .join('\n');
  const session = `## Run #${runCount} — ${formatTimestamp(runStartedAt)}

| Browser | Process | Passed | Failed | Flaky | Skipped | Total | Duration | HTML report | JSON result |
|---|---|---:|---:|---:|---:|---:|---:|---|---|
${rows}

${notes ? `### Collection notes\n\n${notes}\n` : ''}`;
  const history = existingHistory
    ? `${existingHistory}\n\n---\n\n${session}`
    : session;
  const summary = `<!-- HW4_RUN_COUNT: ${runCount} -->
# ${currentFeature.displayId} Automation Run Summary

- **Tracked FR run sessions:** ${runCount}
- **Last updated:** ${updatedAt} (Asia/Ho_Chi_Minh)
- **Runner:** 23127379
- **Scope:** One session represents one invocation of \`npm run test:${currentFeature.fileId}\`, including Chromium, Firefox, and WebKit attempts.

## Open the full FR report

This opens one overview containing Chromium, Firefox, and WebKit:

\`\`\`bash
${showFullReportCommand}
\`\`\`

## Open one browser report

Run these commands from \`23127379_Homework/HW4\`. Stop the report server with \`Ctrl+C\`.

\`\`\`bash
${showReportCommands}
\`\`\`

Only one report server should use the default port at a time. If needed, add \`--port <number>\` to a command.

${historyMarker}

${history}
`;

  fs.writeFileSync(summaryPath, summary, 'utf8');
  process.stdout.write(
    `\nUpdated ${path.relative(hw4Directory, summaryPath)} (tracked run #${runCount}).\n`,
  );

  return runCount;
}

for (const browser of browsers) {
  const reportDirectory = path.join(
    feature.pool,
    'playwright-report',
    browser,
  );
  const resultsDirectory = path.join(feature.pool, 'test-results', browser);
  const jsonResultPath = path.join(
    hw4Directory,
    resultsDirectory,
    'results.json',
  );
  fs.rmSync(path.join(hw4Directory, reportDirectory), {
    recursive: true,
    force: true,
  });
  fs.rmSync(path.join(hw4Directory, resultsDirectory), {
    recursive: true,
    force: true,
  });

  const result = spawnSync(
    process.execPath,
    [playwrightCli, 'test', feature.spec, '--project', browser],
    {
      cwd: hw4Directory,
      env: {
        ...process.env,
        PLAYWRIGHT_HTML_OUTPUT_DIR: reportDirectory,
        HW4_RESULTS_DIR: resultsDirectory,
        HW4_JSON_OUTPUT_FILE: path.join(resultsDirectory, 'results.json'),
        HW4_RUN_TIMESTAMP: runStartedAt.toISOString(),
      },
      stdio: 'inherit',
    },
  );

  browserResults.push({
    browser,
    exitCode: result.status ?? 1,
    processError: result.error?.message ?? null,
    ...readStats(jsonResultPath),
  });
}

const runCount = writeRunSummary(feature, browserResults);
writeFeatureReportIndex(feature, browserResults, runCount);

if (browserResults.some((result) => result.exitCode !== 0)) {
  process.exit(1);
}
