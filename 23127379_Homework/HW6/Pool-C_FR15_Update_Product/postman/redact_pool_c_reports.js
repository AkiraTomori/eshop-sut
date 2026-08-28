/* Redact runtime JWTs from Newman JSON/HTML before evidence is stored. */
const fs = require('fs');

const [rawJsonPath, rawHtmlPath, localEnvironmentPath, outputJsonPath, outputHtmlPath] = process.argv.slice(2);
if (![rawJsonPath, rawHtmlPath, localEnvironmentPath, outputJsonPath, outputHtmlPath].every(Boolean)) {
  throw new Error('Usage: node redact_pool_c_reports.js <raw-json> <raw-html> <local-environment> <output-json> <output-html>');
}
const environment = JSON.parse(fs.readFileSync(localEnvironmentPath));
const runtimeValues = new Map(environment.values.map(item => [item.key, String(item.value || '')]));
const sensitiveKeys = ['adminToken', 'userToken', 'expiredToken', 'roleArrayToken'];
const jwtPattern = /[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]*/g;

function redact(text) {
  let result = text;
  for (const key of sensitiveKeys) {
    const value = runtimeValues.get(key);
    if (value) result = result.split(value).join('[REDACTED_JWT]');
  }
  return result.replace(jwtPattern, '[REDACTED_JWT]');
}
const json = redact(fs.readFileSync(rawJsonPath, 'utf8'));
const html = redact(fs.readFileSync(rawHtmlPath, 'utf8'));
JSON.parse(json);
if (jwtPattern.test(json) || jwtPattern.test(html)) throw new Error('JWT-shaped value remains after redaction');
fs.writeFileSync(outputJsonPath, json);
fs.writeFileSync(outputHtmlPath, html);
console.log(JSON.stringify({ jsonBytes: Buffer.byteLength(json), htmlBytes: Buffer.byteLength(html), jwtValuesRedacted: sensitiveKeys.length }));
