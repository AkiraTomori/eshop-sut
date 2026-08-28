/* Static validation only: this script sends no HTTP requests. */
const fs = require('fs');
const path = require('path');

const poolDir = path.resolve(__dirname, '..');
const collection = JSON.parse(fs.readFileSync(path.join(__dirname, '23127379_HW06_EShop.postman_collection.json')));
const environment = JSON.parse(fs.readFileSync(path.join(__dirname, '23127379_HW06_EShop.postman_environment.json')));
const data = JSON.parse(fs.readFileSync(path.join(__dirname, '23127379_FR15_data.json')));
const stage2 = fs.readFileSync(path.join(poolDir, 'stage2-audit-proposal.md'), 'utf8');
const stage3 = fs.readFileSync(path.join(poolDir, 'stage3-extension-proposal.md'), 'utf8');

const stage2Valid = [...stage2.matchAll(/^\| (FR15-(?:DOM|SEC|SCH)-\d+) .* \| VALID \|/gm)].map(match => match[1]);
const stage3Extensions = [...new Set([...stage3.matchAll(/\| (FR15-EXT-(?:DOM|SEC)-\d+)/g)].map(match => match[1]))];
const expectedIds = [...stage2Valid, ...stage3Extensions].sort();
const actualIds = data.map(row => row.testCaseId).sort();

const scripts = [];
const methods = [];
function walk(value) {
  if (Array.isArray(value)) return value.forEach(walk);
  if (!value || typeof value !== 'object') return;
  if (value.script && Array.isArray(value.script.exec)) scripts.push(value.script.exec.join('\n'));
  if (value.request && value.request.method) methods.push(value.request.method);
  Object.values(value).forEach(walk);
}
walk(collection);
scripts.forEach((source, index) => {
  try {
    new Function(source);
  } catch (error) {
    throw new Error(`Postman script ${index + 1} has invalid JavaScript: ${error.message}`);
  }
});

const env = Object.fromEntries(environment.values.map(variable => [variable.key, variable.value]));
const serialized = JSON.stringify(collection);
const trackedEmpty = [
  'adminToken', 'userToken', 'expiredToken', 'roleArrayToken',
  'targetProductId', 'otherProductId', 'existingCategoryId', 'secondCategoryId'
];
const checks = {
  collectionV21: collection.info.schema.endsWith('/v2.1.0/collection.json'),
  onePoolFolder: collection.item.length === 1,
  oneDataDrivenTarget: collection.item[0].item.length === 1,
  stage2ValidCount: stage2Valid.length === 60,
  stage3ExtensionCount: stage3Extensions.length === 7,
  totalRows: data.length === 67,
  enabledRows: data.filter(row => row.enabled).length === 62,
  disabledRows: data.filter(row => !row.enabled).length === 5,
  uniqueIds: new Set(actualIds).size === 67,
  exactApprovedIdSet: JSON.stringify(expectedIds) === JSON.stringify(actualIds),
  putOnly: methods.length === 1 && methods[0] === 'PUT',
  noGetMethod: !methods.includes('GET'),
  collectionStudentIdLookup: serialized.includes("pm.environment.get('StudentID')"),
  collectionHeaderUpsert: serialized.includes("pm.request.headers.upsert({ key: 'X-Student-Id'"),
  localBaseUrl: env.baseUrl === 'http://localhost:3000',
  studentIdConfigured: env.StudentID === '23127379',
  trackedRuntimeValuesEmpty: trackedEmpty.every(key => env[key] === ''),
  allScriptsCompile: scripts.length === 3,
  everyRowHasOracle: data.every(row => ['2xx', '4xx', '2xx|4xx'].includes(row.statusOracle) && row.stateOracle && row.evidenceRequired),
  disabledRowsExplainWhy: data.filter(row => !row.enabled).every(row => row.disabledReason)
};

const result = {
  checks,
  methods,
  disabledCaseIds: data.filter(row => !row.enabled).map(row => row.testCaseId)
};
console.log(JSON.stringify(result, null, 2));
if (Object.values(checks).some(check => !check)) process.exit(1);
