// 23127379_Load_20260813.js
// Group 1 — Read-heavy: GET /api/products/:id
// Scenario: Load Testing
// Student: 23127379 — Thai Minh Huy
// Date: 2026-08-13
// Approved params: VUs 50→100→150, think-time 1–2s, p95<2000ms, error<5%
// Reviewer note (Skill 10): body check strengthened to verify JSON .id field

import http from 'k6/http';
import { sleep, check } from 'k6';
import { SharedArray } from 'k6/data';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

const products = new SharedArray('products', function () {
  return papaparse.parse(open('./products_data.csv'), { header: true }).data
    .filter(row => row.product_id && row.product_id.trim() !== '');
});

export const options = {
  stages: [
    { duration: '1m', target: 50  },  // ramp-up
    { duration: '5m', target: 100 },  // sustained normal load
    { duration: '2m', target: 150 },  // peak load
    { duration: '1m', target: 0   },  // ramp-down
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'],  // p95 < 2s (baseline: 3–8ms)
    http_req_failed:   ['rate<0.05'],   // error rate < 5%
  },
};

export default function () {
  // Each VU cycles its own product ID deterministically
  const row = products[(__VU - 1) % products.length];

  const res = http.get(`${BASE_URL}/api/products/${row.product_id}`, {
    tags: { name: 'get_product' }
  });

  check(res, {
    'GET /api/products/:id status 200': (r) => r.status === 200,
    'GET /api/products/:id has id field': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.id !== undefined && body.id !== null;
      } catch {
        return false;
      }
    },
    'GET /api/products/:id has name field': (r) => {
      try {
        const body = JSON.parse(r.body);
        return typeof body.name === 'string' && body.name.length > 0;
      } catch {
        return false;
      }
    },
  });

  sleep(Math.random() * 1 + 1); // think-time: 1–2s (browsing cadence)
}

export function handleSummary(data) {
  return {
    'results-load-test/report.html': htmlReport(data),
    'results-load-test/summary.json': JSON.stringify(data),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}
