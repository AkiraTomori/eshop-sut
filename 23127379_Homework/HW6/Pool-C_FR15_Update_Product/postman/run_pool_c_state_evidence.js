/*
 * Local-only FR15 state-evidence harness.
 *
 * It replays each enabled runner row in isolation through the tracked Postman
 * collection, resets only disposable products 101/102, and observes SQLite via
 * docker exec. It never sends GET and never writes runtime tokens to evidence.
 */
const childProcess = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const [containerId, newmanModulePath, collectionPath, environmentPath, dataPath, outputPath] = process.argv.slice(2);
if (![containerId, newmanModulePath, collectionPath, environmentPath, dataPath, outputPath].every(Boolean)) {
  throw new Error('Usage: node run_pool_c_state_evidence.js <container> <newman-module> <collection> <local-environment> <local-data> <output>');
}

const newman = require(path.resolve(newmanModulePath));
const collection = JSON.parse(fs.readFileSync(collectionPath));
const environment = JSON.parse(fs.readFileSync(environmentPath));
const rows = JSON.parse(fs.readFileSync(dataPath)).filter(row => row.enabled);
const env = Object.fromEntries(environment.values.map(item => [item.key, item.value]));
const expectedStudentId = String(env.StudentID || '');

const baselineTarget = {
  id: 101,
  name: 'FR15 Baseline P1',
  price: 100000,
  description: 'FR15 baseline target',
  imageUrl: 'https://example.test/fr15-p1.png',
  category_id: 1
};
const baselineSentinel = {
  id: 102,
  name: 'FR15 Sentinel P2',
  price: 200000,
  description: 'FR15 non-target sentinel',
  imageUrl: 'https://example.test/fr15-p2.png',
  category_id: 2
};

const resetSource = [
  'const sqlite3=require("sqlite3").verbose();',
  'const db=new sqlite3.Database("/app/database.sqlite");',
  'db.serialize(()=>{',
  'db.run("DELETE FROM products WHERE id IN (?,?)",[101,102]);',
  'const sql="INSERT INTO products (id,name,price,description,imageUrl,category_id) VALUES (?,?,?,?,?,?)";',
  'db.run(sql,[101,"FR15 Baseline P1",100000,"FR15 baseline target","https://example.test/fr15-p1.png",1]);',
  'db.run(sql,[102,"FR15 Sentinel P2",200000,"FR15 non-target sentinel","https://example.test/fr15-p2.png",2]);',
  'db.close();',
  '});'
].join('');
const querySource = [
  'const sqlite3=require("sqlite3").verbose();',
  'const db=new sqlite3.Database("/app/database.sqlite");',
  'db.all("SELECT id,name,price,description,imageUrl,category_id FROM products ORDER BY id",[],(err,rows)=>{',
  'if(err)throw err;console.log(JSON.stringify(rows));db.close();',
  '});'
].join('');

function dockerNode(source) {
  return childProcess.execFileSync('docker', ['exec', containerId, 'node', '-e', source], { encoding: 'utf8' }).trim();
}
function resetFixtures() {
  dockerNode(resetSource);
}
function queryProducts() {
  return JSON.parse(dockerNode(querySource));
}
function fingerprint(rowsToHash) {
  return crypto.createHash('sha256').update(JSON.stringify(rowsToHash)).digest('hex');
}
function runOne(row) {
  return new Promise((resolve, reject) => {
    newman.run({
      collection,
      environment,
      iterationData: [row],
      reporters: [],
      color: 'off'
    }, (error, summary) => error ? reject(error) : resolve(summary));
  });
}

(async () => {
  resetFixtures();
  const baselineAll = queryProducts();
  const baselineNonTarget = baselineAll.filter(product => product.id !== 101);
  const baselineNonTargetFingerprint = fingerprint(baselineNonTarget);
  const evidence = [];

  for (const row of rows) {
    resetFixtures();
    const summary = await runOne(row);
    const execution = summary.run.executions.find(item => item.response);
    if (!execution) throw new Error(`${row.testCaseId}: no HTTP execution was recorded`);
    const afterAll = queryProducts();
    const afterTarget = afterAll.find(product => product.id === 101) || null;
    const afterSentinel = afterAll.find(product => product.id === 102) || null;
    const afterNonTargetFingerprint = fingerprint(afterAll.filter(product => product.id !== 101));
    const studentHeader = (execution.request.headers || execution.request.header || []).find(header => String(header.key).toLowerCase() === 'x-student-id');
    const assertionFailures = (execution.assertions || []).filter(assertion => assertion.error).map(assertion => assertion.error.message);
    const targetUnchanged = JSON.stringify(afterTarget) === JSON.stringify(baselineTarget);
    const nonTargetsUnchanged = afterNonTargetFingerprint === baselineNonTargetFingerprint;

    evidence.push({
      testCaseId: row.testCaseId,
      technique: row.technique,
      statusCode: execution.response.code,
      statusOracle: row.statusOracle,
      assertionFailures,
      method: execution.request.method,
      url: execution.request.url.toString().replace(/^http:\/\/(localhost|127\.0\.0\.1):3000/, 'LOCAL_BASE_URL'),
      studentHeaderPresent: Boolean(studentHeader),
      studentHeaderMatches: Boolean(studentHeader) && String(studentHeader.value) === expectedStudentId,
      stateOracle: row.stateOracle,
      targetUnchanged,
      targetAfter: afterTarget,
      nonTargetsUnchanged,
      productCountBefore: baselineAll.length,
      productCountAfter: afterAll.length,
      nonTargetFingerprintBefore: baselineNonTargetFingerprint,
      nonTargetFingerprintAfter: afterNonTargetFingerprint,
      sentinelAfter: afterSentinel
    });
  }

  const output = {
    generatedAt: new Date().toISOString(),
    observationMethod: 'Local Newman PUT plus docker-exec SQLite snapshot; no GET request.',
    disposableFixtures: [baselineTarget, baselineSentinel],
    caseCount: evidence.length,
    summary: {
      requests: evidence.length,
      statusCounts: evidence.reduce((counts, row) => ({ ...counts, [row.statusCode]: (counts[row.statusCode] || 0) + 1 }), {}),
      assertionFailureCases: evidence.filter(row => row.assertionFailures.length).map(row => row.testCaseId),
      allStudentHeadersPresentAndMatching: evidence.every(row => row.studentHeaderPresent && row.studentHeaderMatches),
      allMethodsPut: evidence.every(row => row.method === 'PUT'),
      allNonTargetsUnchanged: evidence.every(row => row.nonTargetsUnchanged),
      allProductCountsUnchanged: evidence.every(row => row.productCountBefore === row.productCountAfter),
      rejectedOracleCasesThatMutatedTarget: evidence.filter(row => row.statusOracle === '4xx' && !row.targetUnchanged).map(row => row.testCaseId)
    },
    cases: evidence
  };
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2) + '\n');
  console.log(JSON.stringify(output.summary, null, 2));
})().catch(error => {
  console.error(error.stack || error.message);
  process.exit(1);
});
