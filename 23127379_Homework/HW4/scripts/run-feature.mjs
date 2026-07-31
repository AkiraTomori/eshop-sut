import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const playwrightCli = require.resolve('@playwright/test/cli');
const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const hw4Directory = path.resolve(scriptDirectory, '..');

const features = {
  FR06: { pool: 'Pool-A_FR06', spec: 'Pool-A_FR06/fr06.spec.ts' },
  FR08: { pool: 'Pool-B_FR08', spec: 'Pool-B_FR08/fr08.spec.ts' },
  FR15: { pool: 'Pool-C_FR15', spec: 'Pool-C_FR15/fr15.spec.ts' },
};

const featureId = process.argv[2]?.toUpperCase();
const feature = features[featureId];

if (!feature) {
  process.stderr.write('Usage: node scripts/run-feature.mjs FR06|FR08|FR15\n');
  process.exit(2);
}

let anyRunFailed = false;

for (const browser of ['chromium', 'firefox', 'webkit']) {
  const reportDirectory = path.join(
    feature.pool,
    'playwright-report',
    browser,
  );
  const resultsDirectory = path.join(feature.pool, 'test-results', browser);
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
        HW4_RUN_TIMESTAMP: new Date().toISOString(),
      },
      stdio: 'inherit',
    },
  );

  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    anyRunFailed = true;
  }
}

if (anyRunFailed) {
  process.exit(1);
}
