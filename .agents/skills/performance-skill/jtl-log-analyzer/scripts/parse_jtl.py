#!/usr/bin/env python3
"""
parse_jtl.py — Phân tích file .jtl của JMeter cho EShop HW05 (Skill 4)

Usage:
    python3 parse_jtl.py <jtl_file>
    python3 parse_jtl.py <jtl_file> --check-regression [--baseline baseline_thresholds.yaml]
    python3 parse_jtl.py <jtl_file> --output report.md

Requirements:
    pip3 install pandas numpy pyyaml
"""

import sys
import os
import csv
import json
import argparse
from datetime import datetime

def parse_jtl(jtl_file: str) -> list:
    """Parse JTL file và trả về list of dicts."""
    rows = []
    with open(jtl_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            rows.append(row)
    return rows

def compute_metrics(rows: list, label_filter: str = None) -> dict:
    """Tính toán metrics từ parsed rows."""
    if label_filter:
        rows = [r for r in rows if label_filter.lower() in r.get('label', '').lower()]
    
    if not rows:
        return {"error": "No data found"}
    
    elapsed = [int(r['elapsed']) for r in rows]
    elapsed.sort()
    
    success_count = sum(1 for r in rows if r.get('success', '').lower() == 'true')
    error_count = len(rows) - success_count
    
    # Response codes breakdown
    response_codes = {}
    for r in rows:
        code = r.get('responseCode', 'unknown')
        response_codes[code] = response_codes.get(code, 0) + 1
    
    # Time range
    timestamps = [int(r['timeStamp']) for r in rows]
    duration_ms = max(timestamps) - min(timestamps)
    duration_s = duration_ms / 1000.0 if duration_ms > 0 else 1
    
    # Percentiles
    def percentile(data, p):
        if not data:
            return 0
        idx = int(len(data) * p / 100)
        idx = min(idx, len(data) - 1)
        return data[idx]
    
    metrics = {
        "total_requests": len(rows),
        "duration_s": round(duration_s, 1),
        "throughput_rps": round(len(rows) / duration_s, 2),
        "success_count": success_count,
        "error_count": error_count,
        "error_rate_pct": round(error_count / len(rows) * 100, 2),
        "response_time": {
            "min": min(elapsed),
            "avg": round(sum(elapsed) / len(elapsed), 1),
            "p50": percentile(elapsed, 50),
            "p75": percentile(elapsed, 75),
            "p90": percentile(elapsed, 90),
            "p95": percentile(elapsed, 95),
            "p99": percentile(elapsed, 99),
            "max": max(elapsed),
        },
        "response_codes": response_codes,
    }
    return metrics

def find_errors(rows: list) -> list:
    """Tìm và list các error rows với source line number."""
    errors = []
    for i, r in enumerate(rows, start=2):  # line 1 is header
        if r.get('success', '').lower() == 'false':
            errors.append({
                "line": i,
                "timestamp": r.get('timeStamp', ''),
                "label": r.get('label', ''),
                "response_code": r.get('responseCode', ''),
                "response_message": r.get('responseMessage', ''),
                "failure_message": r.get('failureMessage', ''),
                "elapsed": r.get('elapsed', ''),
            })
    return errors

def find_outliers(rows: list, multiplier: float = 3.0) -> list:
    """Tìm extreme outliers (elapsed > p99 * multiplier)."""
    elapsed = sorted([int(r['elapsed']) for r in rows])
    if not elapsed:
        return []
    
    idx_p99 = int(len(elapsed) * 0.99)
    p99 = elapsed[min(idx_p99, len(elapsed)-1)]
    threshold = p99 * multiplier
    
    outliers = []
    for i, r in enumerate(rows, start=2):
        if int(r['elapsed']) > threshold:
            outliers.append({
                "line": i,
                "elapsed": int(r['elapsed']),
                "label": r.get('label', ''),
                "response_code": r.get('responseCode', ''),
                "threshold": threshold,
            })
    return outliers

def format_report(jtl_file: str, metrics: dict, errors: list, outliers: list) -> str:
    """Sinh markdown report."""
    file_size = os.path.getsize(jtl_file)
    
    report = f"""# JTL Analysis Report — EShop HW05

**Source file**: `{jtl_file}`
**File size**: {file_size:,} bytes
**Analysis date**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

---

## Performance Metrics
*(All numbers traceable to .jtl source file)*

| Metric | Value | Source |
|--------|-------|--------|
| Total Requests | {metrics['total_requests']:,} | Lines 2–{metrics['total_requests']+1} in .jtl |
| Test Duration | {metrics['duration_s']}s | timeStamp col: first→last row |
| Throughput | {metrics['throughput_rps']} req/s | {metrics['total_requests']} / {metrics['duration_s']}s |
| Success Count | {metrics['success_count']:,} | success==true rows |
| Error Count | {metrics['error_count']:,} | success==false rows |
| **Error Rate** | **{metrics['error_rate_pct']}%** | {metrics['error_count']}/{metrics['total_requests']} × 100 |

## Response Time Distribution (ms)

| Percentile | Value (ms) | Interpretation |
|------------|------------|----------------|
| Min | {metrics['response_time']['min']} | Fastest response |
| Avg | {metrics['response_time']['avg']} | Mean (influenced by outliers) |
| p50 (Median) | {metrics['response_time']['p50']} | 50% of requests faster than this |
| p75 | {metrics['response_time']['p75']} | 75% of requests faster than this |
| p90 | {metrics['response_time']['p90']} | 90% of requests faster than this |
| **p95** | **{metrics['response_time']['p95']}** | **Primary threshold metric** |
| p99 | {metrics['response_time']['p99']} | 99% of requests faster than this |
| Max | {metrics['response_time']['max']} | Slowest response (may include outliers) |

## HTTP Response Code Breakdown

| Code | Count | % | Meaning |
|------|-------|---|---------|
"""
    
    total = metrics['total_requests']
    for code, count in sorted(metrics['response_codes'].items()):
        pct = round(count / total * 100, 1)
        meaning = {
            '200': '✅ OK',
            '201': '✅ Created',
            '400': '⚠️ Bad Request',
            '401': '⚠️ Unauthorized (or lockout)',
            '403': '🔒 Forbidden (lockout)',
            '404': '❌ Not Found',
            '500': '🔴 Server Error',
            '503': '🔴 Service Unavailable',
        }.get(str(code), '❓ Unknown')
        report += f"| {code} | {count:,} | {pct}% | {meaning} |\n"
    
    report += "\n## Proposed Performance Thresholds\n"
    p95 = metrics['response_time']['p95']
    err_rate = metrics['error_rate_pct']
    throughput = metrics['throughput_rps']
    
    report += f"""
*(Based on actual measurements — not generic values)*

| Metric | Measured | Proposed Threshold | Buffer |
|--------|----------|--------------------|--------|
| p95 Response Time | {p95}ms | < {int(p95 * 1.2)}ms | +20% |
| Error Rate | {err_rate}% | < {max(2.0, err_rate + 1):.1f}% | +1pp |
| Throughput | {throughput} req/s | ≥ {round(throughput * 0.9, 2)} req/s | -10% |
"""
    
    if errors:
        report += f"\n## Error Details ({len(errors)} errors found)\n\n"
        report += "| Line # | Timestamp | Label | HTTP Code | Message |\n"
        report += "|--------|-----------|-------|-----------|--------|\n"
        for e in errors[:20]:  # Show first 20
            ts = datetime.fromtimestamp(int(e['timestamp'])/1000).strftime('%H:%M:%S') if e['timestamp'] else 'N/A'
            report += f"| {e['line']} | {ts} | {e['label'][:30]} | {e['response_code']} | {e['failure_message'][:50]} |\n"
        if len(errors) > 20:
            report += f"\n*(Showing 20 of {len(errors)} errors. Full list in .jtl file.)*\n"
    else:
        report += "\n## Errors\n✅ No errors detected.\n"
    
    if outliers:
        report += f"\n## Extreme Outliers ({len(outliers)} found, > p99 × 3)\n\n"
        for o in outliers[:10]:
            report += f"- Line {o['line']}: {o['label']} → {o['elapsed']}ms (threshold: {int(o['threshold'])}ms)\n"
    
    report += """
---
## Optimization Recommendations

> Labels: **[FEASIBLE]** = applicable to EShop local SQLite setup
>         **[HALLUCINATED]** = not applicable (requires infra EShop doesn't have)

| # | Recommendation | Label | Reasoning |
|---|----------------|-------|-----------|
| 1 | Enable SQLite WAL mode | **[FEASIBLE]** | EShop uses SQLite. WAL allows concurrent reads during writes. Add `PRAGMA journal_mode=WAL;` on DB init. |
| 2 | Add index on products.name | **[FEASIBLE]** | `GET /api/products?search=` likely does full scan. `CREATE INDEX idx_products_name ON products(name);` |
| 3 | Reuse DB connection (singleton) | **[FEASIBLE]** | If backend creates new connection per request, this is expensive. Verify in backend/db.js. |
| 4 | Redis caching for product list | **[HALLUCINATED]** | EShop has no Redis. Valid for production but not this SUT. |
| 5 | Horizontal scaling / load balancer | **[HALLUCINATED]** | Single Node.js process on localhost. No infrastructure to scale. |
| 6 | Connection pool (pg-pool, etc.) | **[HALLUCINATED]** | EShop uses SQLite, not PostgreSQL. Connection pooling not applicable. |

*Each recommendation must be verified against actual backend code before applying.*

---
*Generated by: jtl-log-analyzer (Skill 4) — parse_jtl.py*
"""
    return report

def check_regression(metrics: dict, baseline_file: str = None) -> dict:
    """So sánh với baseline thresholds."""
    if not baseline_file or not os.path.exists(baseline_file):
        print("⚠️  No baseline file found. Skipping regression check.")
        return {"status": "no_baseline"}
    
    try:
        import yaml
        with open(baseline_file) as f:
            baseline = yaml.safe_load(f)
    except ImportError:
        print("⚠️  PyYAML not installed. Run: pip3 install pyyaml")
        return {"status": "error", "message": "pyyaml not installed"}
    
    results = {}
    p95 = metrics['response_time']['p95']
    err_rate = metrics['error_rate_pct']
    throughput = metrics['throughput_rps']
    
    # Check each threshold
    for scenario_key in ['load_test', 'spike_test', 'stress_test']:
        if scenario_key in baseline:
            threshold = baseline[scenario_key].get('p95_regression_threshold_ms', float('inf'))
            if p95 > threshold:
                results['p95_regression'] = {
                    "status": "FAIL",
                    "measured": p95,
                    "threshold": threshold,
                }
                print(f"🔴 REGRESSION: p95={p95}ms > threshold={threshold}ms")
            else:
                results['p95_ok'] = {"status": "PASS", "measured": p95, "threshold": threshold}
                print(f"✅ p95 OK: {p95}ms < {threshold}ms")
    
    return results

def main():
    parser = argparse.ArgumentParser(description='Parse JMeter .jtl file for EShop HW05')
    parser.add_argument('jtl_file', help='Path to .jtl file')
    parser.add_argument('--check-regression', action='store_true', help='Check against baseline')
    parser.add_argument('--baseline', default='baseline_thresholds.yaml', help='Baseline YAML file')
    parser.add_argument('--output', help='Output markdown report file')
    parser.add_argument('--label', help='Filter by label (e.g. "GET /api/products")')
    args = parser.parse_args()
    
    if not os.path.exists(args.jtl_file):
        print(f"❌ File not found: {args.jtl_file}")
        sys.exit(1)
    
    print(f"📊 Parsing: {args.jtl_file}")
    rows = parse_jtl(args.jtl_file)
    print(f"   Total rows: {len(rows)}")
    
    metrics = compute_metrics(rows, label_filter=args.label)
    errors = find_errors(rows)
    outliers = find_outliers(rows)
    
    report = format_report(args.jtl_file, metrics, errors, outliers)
    
    if args.output:
        with open(args.output, 'w') as f:
            f.write(report)
        print(f"✅ Report saved: {args.output}")
    else:
        print(report)
    
    if args.check_regression:
        regression_result = check_regression(metrics, args.baseline)
        if regression_result.get('p95_regression'):
            sys.exit(1)  # Exit code 1 = regression detected (for CI)
    
    # Print JSON summary for CI consumption
    summary = {
        "p95": metrics['response_time']['p95'],
        "error_rate": metrics['error_rate_pct'],
        "throughput": metrics['throughput_rps'],
        "total_requests": metrics['total_requests'],
        "error_count": metrics['error_count'],
    }
    print("\n--- JSON SUMMARY (for CI) ---")
    print(json.dumps(summary, indent=2))

if __name__ == '__main__':
    main()
