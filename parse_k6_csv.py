import pandas as pd
import numpy as np
import json
import sys

CSV_FILE = '23127379_Homework/HW5/Group-3_Stress_Checkout/results/23127379_Stress_20260816.csv'
SUMMARY_JSON = '23127379_Homework/HW5/Group-3_Stress_Checkout/results/summary.json'

try:
    df = pd.read_csv(CSV_FILE, engine='python', on_bad_lines='skip')
except Exception as e:
    print(f"Error reading CSV: {e}")
    sys.exit(1)

http_dur = df[df['metric_name'] == 'http_req_duration'].copy()
http_dur['timestamp'] = pd.to_numeric(http_dur['timestamp'], errors='coerce')
http_dur['metric_value'] = pd.to_numeric(http_dur['metric_value'], errors='coerce')

http_fail = df[df['metric_name'] == 'http_req_failed'].copy()
http_fail['metric_value'] = pd.to_numeric(http_fail['metric_value'], errors='coerce')

total_requests = len(http_dur)
error_count = int(http_fail['metric_value'].sum()) if len(http_fail) > 0 else 0
test_duration = (http_dur['timestamp'].max() - http_dur['timestamp'].min())

print("=== PERFORMANCE METRICS ===")
print(f"Total Requests : {total_requests}")
print(f"Test Duration  : {test_duration:.1f}s")
print(f"Throughput     : {total_requests / test_duration:.2f} req/s" if test_duration > 0 else "N/A")
print()
print("=== RESPONSE TIME (ms) — from 'http_req_duration' metric ===")
print(f"Min  : {http_dur['metric_value'].min():.1f}")
print(f"Avg  : {http_dur['metric_value'].mean():.1f}")
print(f"p50  : {http_dur['metric_value'].quantile(0.50):.1f}")
print(f"p90  : {http_dur['metric_value'].quantile(0.90):.1f}")
print(f"p95  : {http_dur['metric_value'].quantile(0.95):.1f}")
print(f"p99  : {http_dur['metric_value'].quantile(0.99):.1f}")
print(f"Max  : {http_dur['metric_value'].max():.1f}")
print()
print("=== ERROR ANALYSIS ===")
total_fail_rows = len(http_fail)
print(f"Error Count : {error_count}")
print(f"Error Rate  : {error_count / total_fail_rows * 100:.2f}%" if total_fail_rows > 0 else "N/A")

print("\n=== PER-ENDPOINT BREAKDOWN ===")
for name, grp in http_dur.groupby('name'):
    p95 = grp['metric_value'].quantile(0.95)
    avg = grp['metric_value'].mean()
    count = len(grp)
    print(f"{name}: count={count}, avg={avg:.1f}ms, p95={p95:.1f}ms")

try:
    with open(SUMMARY_JSON) as f:
        summary = json.load(f)

    metrics = summary.get('metrics', {})
    duration_vals = metrics.get('http_req_duration', {})
    if 'values' in duration_vals:
        duration_vals = duration_vals['values']

    failed_vals = metrics.get('http_req_failed', {})
    if 'values' in failed_vals:
        failed_vals = failed_vals['values']

    reqs_vals = metrics.get('http_reqs', {})
    if 'values' in reqs_vals:
        reqs_vals = reqs_vals['values']

    print("\n=== FROM summary.json ===")
    print(f"p95 (summary): {duration_vals.get('p(95)', 'N/A')}ms")
    print(f"avg (summary): {duration_vals.get('avg', 'N/A')}ms")
    err_rate = failed_vals.get('rate', 'N/A')
    if isinstance(err_rate, (int, float)):
        print(f"error rate   : {err_rate*100:.4f}%")
    else:
        print(f"error rate   : {err_rate}")
    print(f"total reqs   : {reqs_vals.get('count', 'N/A')}")
except Exception as e:
    print(f"Error reading JSON: {e}")
