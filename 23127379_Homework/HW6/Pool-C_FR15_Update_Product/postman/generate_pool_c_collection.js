/*
 * Deterministic Stage 4 artifact generator for Pool C / FR-15.
 * It reads no secrets and emits only the tracked collection, environment template,
 * and runner data. Runtime tokens and fixture identifiers belong in an ignored
 * local environment copy.
 */
const fs = require('fs');
const path = require('path');

const outDir = __dirname;
const baseBody = () => ({
  name: 'Updated Product',
  price: 150000,
  description: 'Updated description',
  imageUrl: 'https://example.test/updated.png',
  category_id: '{{existingCategoryId}}'
});
const withField = (field, value) => ({ ...baseBody(), [field]: value });
const withoutField = (field) => {
  const body = baseBody();
  delete body[field];
  return body;
};

const cases = [];
function add(testCaseId, technique, objective, options = {}) {
  cases.push({
    testCaseId,
    technique,
    objective,
    enabled: options.enabled !== false,
    disabledReason: options.disabledReason || '',
    targetPath: options.targetPath || '/api/products/{{targetProductId}}',
    authMode: options.authMode || 'validAdmin',
    bodyMode: options.bodyMode || 'json',
    bodyObject: options.bodyMode === 'raw' || options.bodyMode === 'absent'
      ? undefined
      : (options.bodyObject || baseBody()),
    rawBody: options.bodyMode === 'raw' ? options.rawBody : undefined,
    extraHeaders: options.extraHeaders || {},
    statusOracle: options.statusOracle || '4xx',
    stateOracle: options.stateOracle || 'No product may change.',
    evidenceRequired: options.evidenceRequired || 'Restricted non-GET datastore snapshot before and after this case.',
    requirementSource: options.requirementSource || 'README FR-15; API specification section 3.3'
  });
}

const success = {
  statusOracle: '2xx',
  stateOracle: 'Only the target product may contain the submitted values; all non-target products remain unchanged.'
};
const reject = {
  statusOracle: '4xx',
  stateOracle: 'The target and every non-target product remain unchanged.'
};
const conditional = {
  statusOracle: '2xx|4xx',
  stateOracle: 'If accepted, only the path-selected target may change; if rejected, no product may change.'
};

// Confirmed Stage 2 Domain rows (37).
add('FR15-DOM-001', 'Domain Testing', 'Valid full update control', success);
add('FR15-DOM-002', 'Domain Testing', 'Absent request body', { ...reject, bodyMode: 'absent' });
add('FR15-DOM-003', 'Domain Testing', 'Malformed JSON body', { ...reject, bodyMode: 'raw', rawBody: '{"name":' });
add('FR15-DOM-004', 'Domain Testing', 'Non-object JSON body', { ...reject, bodyMode: 'raw', rawBody: '[]' });
add('FR15-DOM-005', 'Domain Testing', 'Non-existent product identifier', { ...reject, targetPath: '/api/products/{{missingProductId}}' });
add('FR15-DOM-007', 'Domain Testing', 'Missing required path identifier', { ...reject, targetPath: '/api/products/' });
add('FR15-DOM-008', 'Domain Testing', 'Missing Authorization header', { ...reject, authMode: 'none' });
add('FR15-DOM-009', 'Domain Testing', 'Empty bearer credential', { ...reject, authMode: 'emptyBearer' });
add('FR15-DOM-010', 'Domain Testing', 'Basic scheme instead of bearer', { ...reject, authMode: 'basic' });
add('FR15-DOM-011', 'Domain Testing', 'JWT with invalid signature', { ...reject, authMode: 'invalidSignature' });
add('FR15-DOM-012', 'Domain Testing', 'Expired JWT', {
  ...reject,
  authMode: 'expiredToken',
  enabled: false,
  disabledReason: 'Requires a controlled expired JWT in the ignored local environment.'
});
add('FR15-DOM-013', 'Domain Testing', 'Valid non-admin JWT', { ...reject, authMode: 'validUser' });
add('FR15-DOM-017', 'Domain Testing', 'Name lower boundary: 1 character', { ...success, bodyObject: withField('name', 'A') });
add('FR15-DOM-018', 'Domain Testing', 'Name lower boundary + 1: 2 characters', { ...success, bodyObject: withField('name', 'AA') });
add('FR15-DOM-019', 'Domain Testing', 'Name upper boundary - 1: 254 characters', { ...success, bodyObject: withField('name', 'A'.repeat(254)) });
add('FR15-DOM-020', 'Domain Testing', 'Name upper boundary: 255 characters', { ...success, bodyObject: withField('name', 'A'.repeat(255)) });
add('FR15-DOM-021', 'Domain Testing', 'Name upper boundary + 1: 256 characters', { ...reject, bodyObject: withField('name', 'A'.repeat(256)) });
add('FR15-DOM-022', 'Domain Testing', 'Omitted required name', { ...reject, bodyObject: withoutField('name') });
add('FR15-DOM-023', 'Domain Testing', 'Null name', { ...reject, bodyObject: withField('name', null) });
add('FR15-DOM-024', 'Domain Testing', 'Non-string name', { ...reject, bodyObject: withField('name', 123) });
add('FR15-DOM-025', 'Domain Testing', 'Whitespace-only name under literal documented rules', { ...success, bodyObject: withField('name', '   ') });
add('FR15-DOM-026', 'Domain Testing', 'Price below strict lower threshold', { ...reject, bodyObject: withField('price', -1) });
add('FR15-DOM-027', 'Domain Testing', 'Price at excluded threshold zero', { ...reject, bodyObject: withField('price', 0) });
add('FR15-DOM-028', 'Domain Testing', 'Price immediately above threshold', { ...success, bodyObject: withField('price', 1) });
add('FR15-DOM-029', 'Domain Testing', 'Positive fractional price', { ...success, bodyObject: withField('price', 0.01) });
add('FR15-DOM-030', 'Domain Testing', 'Omitted required price', { ...reject, bodyObject: withoutField('price') });
add('FR15-DOM-031', 'Domain Testing', 'Null price', { ...reject, bodyObject: withField('price', null) });
add('FR15-DOM-032', 'Domain Testing', 'Numeric-looking string price', { ...reject, bodyObject: withField('price', '150000') });
add('FR15-DOM-033', 'Domain Testing', 'Boolean price', { ...reject, bodyObject: withField('price', true) });
add('FR15-DOM-034', 'Domain Testing', 'Vietnamese Unicode description', { ...success, bodyObject: withField('description', 'Mô tả sản phẩm cập nhật') });
add('FR15-DOM-035', 'Domain Testing', 'Empty description string', { ...success, bodyObject: withField('description', '') });
add('FR15-DOM-039', 'Domain Testing', 'Non-URL imageUrl string under literal documented rules', { ...success, bodyObject: withField('imageUrl', 'not-a-url') });
add('FR15-DOM-040', 'Domain Testing', 'Empty imageUrl string', { ...success, bodyObject: withField('imageUrl', '') });
add('FR15-DOM-044', 'Domain Testing', 'Update to a second existing category', { ...success, bodyObject: withField('category_id', '{{secondCategoryId}}') });
add('FR15-DOM-045', 'Domain Testing', 'Non-existent category identifier', { ...reject, bodyObject: withField('category_id', '{{missingCategoryId}}') });
add('FR15-DOM-046', 'Domain Testing', 'Omitted required category_id', { ...reject, bodyObject: withoutField('category_id') });
add('FR15-DOM-047', 'Domain Testing', 'Null category_id', { ...reject, bodyObject: withField('category_id', null) });

// Confirmed Stage 2 Security/Schema rows (23).
add('FR15-SEC-001', 'Security/Schema Checklist', 'Valid current admin token positive control', success);
add('FR15-SEC-002', 'Security/Schema Checklist', 'Missing bearer token', { ...reject, authMode: 'none' });
add('FR15-SEC-003', 'Security/Schema Checklist', 'Empty bearer credential', { ...reject, authMode: 'emptyBearer' });
add('FR15-SEC-004', 'Security/Schema Checklist', 'Basic scheme instead of bearer', { ...reject, authMode: 'basic' });
add('FR15-SEC-005', 'Security/Schema Checklist', 'Malformed non-JWT bearer value', { ...reject, authMode: 'malformed' });
add('FR15-SEC-006', 'Security/Schema Checklist', 'JWT signature altered', { ...reject, authMode: 'invalidSignature' });
add('FR15-SEC-007', 'Security/Schema Checklist', 'Expired JWT', {
  ...reject,
  authMode: 'expiredToken',
  enabled: false,
  disabledReason: 'Requires a controlled expired JWT in the ignored local environment.'
});
add('FR15-SEC-008', 'Security/Schema Checklist', 'JWT using alg:none', { ...reject, authMode: 'algNone' });
add('FR15-SEC-009', 'Security/Schema Checklist', 'Valid normal-user JWT', { ...reject, authMode: 'validUser' });
add('FR15-SEC-010', 'Security/Schema Checklist', 'Body id attempts to retarget the update', { ...conditional, bodyObject: { ...baseBody(), id: '{{otherProductId}}' } });
add('FR15-SEC-011', 'Security/Schema Checklist', 'Query id conflicts with path id', { ...conditional, targetPath: '/api/products/{{targetProductId}}?id={{otherProductId}}' });
add('FR15-SEC-012', 'Security/Schema Checklist', 'Extra product_id attempts to retarget the update', { ...conditional, bodyObject: { ...baseBody(), product_id: '{{otherProductId}}' } });
add('FR15-SEC-013', 'Security/Schema Checklist', 'Extra role attempts privilege mutation', { ...conditional, bodyObject: { ...baseBody(), role: 'superadmin' }, stateOracle: 'Reject or ignore the extra role field; no account role or non-target product may change.' });
add('FR15-SEC-016', 'Security/Schema Checklist', 'SQL injection payload in path identifier', { ...reject, targetPath: '/api/products/%27%20OR%201%3D1--' });
add('FR15-SEC-017', 'Security/Schema Checklist', 'SQL injection payload in name', { ...conditional, bodyObject: withField('name', "x', price=0 WHERE 1=1--"), stateOracle: 'Treat the name literally on the target or reject it; never update multiple rows or expose database internals.' });
add('FR15-SEC-018', 'Security/Schema Checklist', 'SQL-looking category identifier', { ...reject, bodyObject: withField('category_id', "1 OR 1=1") });
add('FR15-SEC-019', 'Security/Schema Checklist', 'Benign apostrophe in valid name', { ...success, bodyObject: withField('name', "O'Brien") });
add('FR15-SEC-023', 'Security/Schema Checklist', 'Object/operator category identifier', { ...reject, bodyObject: withField('category_id', { $ne: null }) });
add('FR15-SEC-024', 'Security/Schema Checklist', 'Method override requests DELETE', { ...conditional, extraHeaders: { 'X-HTTP-Method-Override': 'DELETE' }, stateOracle: 'Reject or ignore method override; the target must never be deleted and no non-target product may change.' });
add('FR15-SEC-025', 'Security/Schema Checklist', 'Concurrent valid updates to distinct products', {
  ...success,
  enabled: false,
  disabledReason: 'Requires an external two-request concurrency harness and isolated datastore snapshots.',
  evidenceRequired: 'Run two synchronized PUT requests against distinct controlled products; snapshot both rows and all non-target products.'
});
add('FR15-SEC-026', 'Security/Schema Checklist', 'Sequential replay of identical valid PUT', {
  ...success,
  enabled: false,
  disabledReason: 'Requires a two-step replay sequence and create/delete/count state evidence.',
  evidenceRequired: 'Execute the identical PUT twice against a reset fixture and snapshot target values, product count, and non-target rows.'
});
add('FR15-SCH-008', 'Security/Schema Checklist', 'Successful response discloses no password, hash, JWT, or token', success);
add('FR15-SCH-009', 'Security/Schema Checklist', 'SQLi path error discloses no SQL, stack, or filesystem detail', { ...reject, targetPath: '/api/products/%27%20OR%201%3D1--' });

// Human-confirmed Stage 3 additions (7).
add('FR15-EXT-DOM-001', 'Domain Testing gap analysis', '255 precomposed Vietnamese code points exceed 255 UTF-8 bytes', { ...success, bodyObject: withField('name', 'á'.repeat(255)) });
add('FR15-EXT-DOM-002', 'Domain Testing gap analysis', 'Positive JSON number in exponent notation', { ...success, bodyMode: 'raw', rawBody: '{"name":"Updated Product","price":1e2,"description":"Updated description","imageUrl":"https://example.test/updated.png","category_id":{{existingCategoryId}}}' });
add('FR15-EXT-SEC-001', 'Security/Schema gap analysis', 'Properly signed array-valued admin role claim', {
  ...reject,
  authMode: 'roleArrayToken',
  enabled: false,
  disabledReason: 'Requires a properly signed disposable role-array JWT in the ignored local environment.'
});
add('FR15-EXT-SEC-002', 'Security/Schema gap analysis', 'Duplicate Authorization headers with no admin credential', { ...reject, authMode: 'duplicateNonAdminMalformed' });
add('FR15-EXT-SEC-003', 'Security/Schema gap analysis', 'SQL injection string in numeric price', { ...reject, bodyObject: withField('price', '0); DROP TABLE products;--') });
add('FR15-EXT-SEC-004', 'Security/Schema gap analysis', 'SQL injection string in description', { ...conditional, bodyObject: withField('description', "x', price=0 WHERE 1=1--"), stateOracle: 'Treat description as inert literal text on the target or reject it; never bulk-update, cross-update, or expose database internals.' });
add('FR15-EXT-SEC-005', 'Security/Schema gap analysis', 'SQL injection string in imageUrl', { ...conditional, bodyObject: withField('imageUrl', "https://example.test/p.png?x=' OR 1=1--"), stateOracle: 'Treat imageUrl as inert literal text on the target or reject it; never bulk-update, cross-update, or expose database internals.' });

const collectionPrerequest = [
  "const studentId = String(pm.environment.get('StudentID') || '').trim();",
  "const baseUrl = String(pm.environment.get('baseUrl') || '').trim().replace(/\\/$/, '');",
  "if (!studentId) { throw new Error('StudentID must be set in the active local environment.'); }",
  "if (!/^http:\\/\\/(localhost|127\\.0\\.0\\.1):3000$/i.test(baseUrl)) { throw new Error('baseUrl must be http://localhost:3000 or http://127.0.0.1:3000.'); }",
  "pm.request.headers.upsert({ key: 'X-Student-Id', value: studentId });"
];

const itemPrerequest = [
  "const enabled = pm.iterationData.get('enabled');",
  "if (enabled === false || String(enabled).toLowerCase() === 'false') { pm.execution.skipRequest(); return; }",
  "const caseId = String(pm.iterationData.get('testCaseId') || 'UNSET');",
  "pm.variables.set('activeTestCaseId', caseId);",
  "pm.variables.set('targetPath', String(pm.iterationData.get('targetPath') || ''));",
  "const numericVariables = new Set(['targetProductId','otherProductId','missingProductId','existingCategoryId','secondCategoryId','missingCategoryId']);",
  "function resolveValue(value) {",
  "  if (Array.isArray(value)) return value.map(resolveValue);",
  "  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k,v]) => [k, resolveValue(v)]));",
  "  if (typeof value !== 'string') return value;",
  "  const exact = value.match(/^{{([^{}]+)}}$/);",
  "  if (exact) {",
  "    const raw = pm.environment.get(exact[1]);",
  "    if (raw === undefined || raw === null || String(raw).trim() === '') throw new Error(caseId + ': missing environment fixture ' + exact[1]);",
  "    return numericVariables.has(exact[1]) ? Number(raw) : raw;",
  "  }",
  "  return pm.variables.replaceIn(value);",
  "}",
  "const bodyMode = String(pm.iterationData.get('bodyMode') || 'json');",
  "if (bodyMode === 'absent') pm.request.body.update('');",
  "else if (bodyMode === 'raw') pm.request.body.update(pm.variables.replaceIn(String(pm.iterationData.get('rawBody') || '')));",
  "else pm.request.body.update(JSON.stringify(resolveValue(pm.iterationData.get('bodyObject'))));",
  "pm.request.headers.upsert({ key: 'Content-Type', value: 'application/json' });",
  "pm.request.headers.remove('Authorization');",
  "pm.request.headers.remove('X-HTTP-Method-Override');",
  "const adminToken = String(pm.environment.get('adminToken') || '').trim();",
  "const userToken = String(pm.environment.get('userToken') || '').trim();",
  "const authMode = String(pm.iterationData.get('authMode') || 'validAdmin');",
  "function need(value, label) { if (!value) throw new Error(caseId + ': missing ' + label + ' in local environment'); return value; }",
  "function base64url(text) { return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(text)).replace(/=+$/,'').replace(/\\+/g,'-').replace(/\\//g,'_'); }",
  "if (authMode === 'validAdmin') pm.request.headers.add({ key: 'Authorization', value: 'Bearer ' + need(adminToken, 'adminToken') });",
  "else if (authMode === 'validUser') pm.request.headers.add({ key: 'Authorization', value: 'Bearer ' + need(userToken, 'userToken') });",
  "else if (authMode === 'emptyBearer') pm.request.headers.add({ key: 'Authorization', value: 'Bearer ' });",
  "else if (authMode === 'basic') pm.request.headers.add({ key: 'Authorization', value: 'Basic abc' });",
  "else if (authMode === 'malformed') pm.request.headers.add({ key: 'Authorization', value: 'Bearer not-a-jwt' });",
  "else if (authMode === 'invalidSignature') { const token = need(adminToken, 'adminToken'); const parts = token.split('.'); if (parts.length !== 3) throw new Error(caseId + ': adminToken is not a three-part JWT'); parts[2] = (parts[2] || 'x').replace(/^./, c => c === 'a' ? 'b' : 'a'); pm.request.headers.add({ key: 'Authorization', value: 'Bearer ' + parts.join('.') }); }",
  "else if (authMode === 'expiredToken') pm.request.headers.add({ key: 'Authorization', value: 'Bearer ' + need(String(pm.environment.get('expiredToken') || '').trim(), 'expiredToken') });",
  "else if (authMode === 'roleArrayToken') pm.request.headers.add({ key: 'Authorization', value: 'Bearer ' + need(String(pm.environment.get('roleArrayToken') || '').trim(), 'roleArrayToken') });",
  "else if (authMode === 'algNone') { const token = need(adminToken, 'adminToken'); const parts = token.split('.'); if (parts.length !== 3) throw new Error(caseId + ': adminToken is not a three-part JWT'); pm.request.headers.add({ key: 'Authorization', value: 'Bearer ' + base64url(JSON.stringify({alg:'none',typ:'JWT'})) + '.' + parts[1] + '.' }); }",
  "else if (authMode === 'duplicateNonAdminMalformed') { pm.request.headers.add({ key: 'Authorization', value: 'Bearer ' + need(userToken, 'userToken') }); pm.request.headers.add({ key: 'Authorization', value: 'Bearer not-a-jwt' }); }",
  "else if (authMode !== 'none') throw new Error(caseId + ': unsupported authMode ' + authMode);",
  "const extraHeaders = pm.iterationData.get('extraHeaders') || {};",
  "Object.entries(extraHeaders).forEach(([key,value]) => pm.request.headers.upsert({ key, value: String(value) }));"
];

const itemTests = [
  "const caseId = String(pm.iterationData.get('testCaseId'));",
  "const oracle = String(pm.iterationData.get('statusOracle'));",
  "const statusClass = Math.floor(pm.response.code / 100) + 'xx';",
  "pm.test(caseId + ' - approved HTTP class oracle: ' + oracle, function () {",
  "  const allowed = oracle.split('|');",
  "  pm.expect(allowed).to.include(statusClass);",
  "});",
  "pm.test(caseId + ' - response is never 5xx', function () { pm.expect(pm.response.code).to.be.below(500); });",
  "pm.test(caseId + ' - request remains the selected PUT product endpoint', function () {",
  "  pm.expect(pm.request.method).to.eql('PUT');",
  "  pm.expect(pm.request.url.getPath()).to.match(/^\\/api\\/products\\//);",
  "});",
  "pm.test(caseId + ' - mandatory student header is present', function () {",
  "  pm.expect(pm.request.headers.get('X-Student-Id')).to.eql(String(pm.environment.get('StudentID')).trim());",
  "});",
  "pm.test(caseId + ' - response discloses no credential or obvious internal detail', function () {",
  "  const text = pm.response.text();",
  "  pm.expect(text).not.to.match(/[\"']?(password|password_hash|jwt|token|secret)[\"']?\\s*:/i);",
  "  pm.expect(text).not.to.match(/(sqlite|sqlstate|node_modules|backend\\/server\\.js|stack trace)/i);",
  "});"
];

const collection = {
  info: {
    _postman_id: '23127379-pool-c-fr15-update-product',
    name: '23127379 HW06 EShop API Testing - Pool C',
    description: 'Pool C scored target: PUT /api/products/:id only. Contains 60 human-confirmed Stage 2 VALID rows and 7 human-confirmed Stage 3 extensions. Five external-fixture cases remain present but disabled. No GET request is included.',
    schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
  },
  event: [{ listen: 'prerequest', script: { type: 'text/javascript', exec: collectionPrerequest } }],
  item: [{
    name: 'Pool C - FR-15 Update Product',
    description: 'The only scored API unit in this collection.',
    item: [{
      name: '{{testCaseId}} - PUT /api/products/:id',
      event: [
        { listen: 'prerequest', script: { type: 'text/javascript', exec: itemPrerequest } },
        { listen: 'test', script: { type: 'text/javascript', exec: itemTests } }
      ],
      request: {
        method: 'PUT',
        header: [
          { key: 'Content-Type', value: 'application/json', type: 'text' },
          { key: 'Authorization', value: 'Bearer {{adminToken}}', type: 'text' }
        ],
        body: { mode: 'raw', raw: '{{requestBody}}', options: { raw: { language: 'json' } } },
        url: '{{baseUrl}}{{targetPath}}',
        description: 'Data-driven FR-15 request. Persistent-state oracles are verified through restricted non-GET datastore snapshots, never through a GET test.'
      },
      response: []
    }]
  }]
};

const values = [
  ['baseUrl', 'http://localhost:3000', true],
  ['StudentID', '23127379', true],
  ['adminToken', '', true],
  ['userToken', '', true],
  ['expiredToken', '', true],
  ['roleArrayToken', '', true],
  ['targetProductId', '', true],
  ['otherProductId', '', true],
  ['missingProductId', '999999', true],
  ['existingCategoryId', '', true],
  ['secondCategoryId', '', true],
  ['missingCategoryId', '999999', true]
].map(([key, value, enabled]) => ({ key, value, type: 'default', enabled }));

const environment = {
  id: '23127379-pool-c-local-template',
  name: '23127379 HW06 EShop Local - Pool C',
  values,
  _postman_variable_scope: 'environment',
  _postman_exported_using: 'Codex Stage 4 deterministic generator'
};

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, '23127379_HW06_EShop.postman_collection.json'), JSON.stringify(collection, null, 2) + '\n');
fs.writeFileSync(path.join(outDir, '23127379_HW06_EShop.postman_environment.json'), JSON.stringify(environment, null, 2) + '\n');
fs.writeFileSync(path.join(outDir, '23127379_FR15_data.json'), JSON.stringify(cases, null, 2) + '\n');
console.log(JSON.stringify({ total: cases.length, enabled: cases.filter(c => c.enabled).length, disabled: cases.filter(c => !c.enabled).length }, null, 2));
