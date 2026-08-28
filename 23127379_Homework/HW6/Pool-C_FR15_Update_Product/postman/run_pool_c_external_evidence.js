/* Local-only concurrency/replay evidence for disabled FR15 rows. No GET request. */
const childProcess = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const [containerId, newmanModulePath, collectionPath, environmentPath, outputPath] = process.argv.slice(2);
if (![containerId, newmanModulePath, collectionPath, environmentPath, outputPath].every(Boolean)) {
  throw new Error('Usage: node run_pool_c_external_evidence.js <container> <newman-module> <collection> <local-environment> <output>');
}
const newman = require(path.resolve(newmanModulePath));
const collection = JSON.parse(fs.readFileSync(collectionPath));
const environment = JSON.parse(fs.readFileSync(environmentPath));
const expectedStudentId = String(environment.values.find(item => item.key === 'StudentID').value);

const resetSource = 'const sqlite3=require("sqlite3").verbose();const db=new sqlite3.Database("/app/database.sqlite");db.serialize(()=>{db.run("DELETE FROM products WHERE id IN (?,?)",[101,102]);const sql="INSERT INTO products (id,name,price,description,imageUrl,category_id) VALUES (?,?,?,?,?,?)";db.run(sql,[101,"FR15 Baseline P1",100000,"FR15 baseline target","https://example.test/fr15-p1.png",1]);db.run(sql,[102,"FR15 Sentinel P2",200000,"FR15 non-target sentinel","https://example.test/fr15-p2.png",2]);db.close();});';
const querySource = 'const sqlite3=require("sqlite3").verbose();const db=new sqlite3.Database("/app/database.sqlite");db.all("SELECT id,name,price,description,imageUrl,category_id FROM products ORDER BY id",[],(err,rows)=>{if(err)throw err;console.log(JSON.stringify(rows));db.close();});';
function dockerNode(source) {
  return childProcess.execFileSync('docker', ['exec', containerId, 'node', '-e', source], { encoding: 'utf8' }).trim();
}
function resetFixtures() { dockerNode(resetSource); }
function queryProducts() { return JSON.parse(dockerNode(querySource)); }
function fingerprint(rows) { return crypto.createHash('sha256').update(JSON.stringify(rows)).digest('hex'); }
function body(name, price, description, imageUrl, categoryId = '{{existingCategoryId}}') {
  return { name, price, description, imageUrl, category_id: categoryId };
}
function row(testCaseId, targetPath, bodyObject) {
  return {
    testCaseId,
    technique: 'Security/Schema Checklist external harness',
    objective: testCaseId,
    enabled: true,
    disabledReason: '',
    targetPath,
    authMode: 'validAdmin',
    bodyMode: 'json',
    bodyObject,
    extraHeaders: {},
    statusOracle: '2xx',
    stateOracle: 'Only the addressed target changes; product count and every other product remain unchanged.',
    evidenceRequired: 'External SQLite snapshot.',
    requirementSource: 'README FR-15; API specification section 3.3'
  };
}
function runOne(iterationData) {
  return new Promise((resolve, reject) => newman.run({ collection, environment, iterationData: [iterationData], reporters: [], color: 'off' }, (error, summary) => {
    if (error) return reject(error);
    const execution = summary.run.executions.find(item => item.response);
    const header = (execution.request.headers || execution.request.header || []).find(item => String(item.key).toLowerCase() === 'x-student-id');
    resolve({
      statusCode: execution.response.code,
      method: execution.request.method,
      studentHeaderMatches: Boolean(header) && String(header.value) === expectedStudentId,
      assertionFailures: (execution.assertions || []).filter(assertion => assertion.error).map(assertion => assertion.error.message)
    });
  }));
}

(async () => {
  resetFixtures();
  const baseline = queryProducts();
  const seededFingerprint = fingerprint(baseline.filter(product => ![101, 102].includes(product.id)));
  const concurrentA = row('FR15-SEC-025', '/api/products/{{targetProductId}}', body('FR15 Concurrent A', 101000, 'Concurrent target A', 'https://example.test/concurrent-a.png'));
  const concurrentB = row('FR15-SEC-025', '/api/products/{{otherProductId}}', body('FR15 Concurrent B', 202000, 'Concurrent target B', 'https://example.test/concurrent-b.png', '{{secondCategoryId}}'));
  const concurrentRuns = await Promise.all([runOne(concurrentA), runOne(concurrentB)]);
  const concurrentAfter = queryProducts();
  const concurrency = {
    testCaseId: 'FR15-SEC-025',
    requests: concurrentRuns,
    target101: concurrentAfter.find(product => product.id === 101),
    target102: concurrentAfter.find(product => product.id === 102),
    productCountBefore: baseline.length,
    productCountAfter: concurrentAfter.length,
    seededProductsUnchanged: fingerprint(concurrentAfter.filter(product => ![101, 102].includes(product.id))) === seededFingerprint,
    distinctTargetsPreserved: concurrentAfter.find(product => product.id === 101)?.name === 'FR15 Concurrent A' && concurrentAfter.find(product => product.id === 102)?.name === 'FR15 Concurrent B'
  };

  resetFixtures();
  const replayBody = body('FR15 Replay Target', 303000, 'Replay target', 'https://example.test/replay.png');
  const replayRow = row('FR15-SEC-026', '/api/products/{{targetProductId}}', replayBody);
  const replayFirst = await runOne(replayRow);
  const afterFirst = queryProducts();
  const replaySecond = await runOne(replayRow);
  const afterSecond = queryProducts();
  const replay = {
    testCaseId: 'FR15-SEC-026',
    firstRequest: replayFirst,
    secondRequest: replaySecond,
    targetAfterFirst: afterFirst.find(product => product.id === 101),
    targetAfterSecond: afterSecond.find(product => product.id === 101),
    productCountBefore: baseline.length,
    productCountAfterFirst: afterFirst.length,
    productCountAfterSecond: afterSecond.length,
    seededProductsUnchanged: fingerprint(afterSecond.filter(product => ![101, 102].includes(product.id))) === seededFingerprint,
    identicalStateAfterReplay: JSON.stringify(afterFirst) === JSON.stringify(afterSecond)
  };

  const output = {
    generatedAt: new Date().toISOString(),
    observationMethod: 'Local Newman PUT concurrency/replay plus docker-exec SQLite snapshots; no GET request.',
    concurrency,
    replay,
    summary: {
      requests: 4,
      allMethodsPut: [...concurrentRuns, replayFirst, replaySecond].every(run => run.method === 'PUT'),
      allStudentHeadersMatch: [...concurrentRuns, replayFirst, replaySecond].every(run => run.studentHeaderMatches),
      allAssertionsPass: [...concurrentRuns, replayFirst, replaySecond].every(run => run.assertionFailures.length === 0),
      concurrencyPass: concurrency.distinctTargetsPreserved && concurrency.seededProductsUnchanged && concurrency.productCountBefore === concurrency.productCountAfter,
      replayPass: replay.identicalStateAfterReplay && replay.seededProductsUnchanged && replay.productCountBefore === replay.productCountAfterSecond
    }
  };
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2) + '\n');
  console.log(JSON.stringify(output.summary, null, 2));
})().catch(error => {
  console.error(error.stack || error.message);
  process.exit(1);
});
