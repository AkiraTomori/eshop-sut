"""
generate_html_report.py
Usage:
  python3 generate_html_report.py <csv_path> <summary_json_path> <output_html_path>

Extracts ALL values dynamically from the k6 CSV and summary.json.
No hardcoded numbers. Compatible with k6 v2.x output format.
"""
import json, csv, math, os, sys
from datetime import datetime


def pct(lst, p):
    if not lst: return 0
    idx = max(0, int(math.ceil(p / 100 * len(lst))) - 1)
    return lst[idx]


def mb(b):
    try: return f"{float(b)/1024/1024:.2f} MB"
    except: return "N/A"


def fmt(v, d=3):
    try: return f"{float(v):.{d}f}"
    except: return str(v)


def generate(csv_path, json_path, out_path):
    # ── Load summary.json ────────────────────────────────────────────────────
    with open(json_path) as f:
        s = json.load(f)
    m = s["metrics"]

    def gv(metric, key, default=None):
        return m.get(metric, {}).get(key, default)

    # ── Parse raw CSV ────────────────────────────────────────────────────────
    url_data      = {}
    all_durations = []
    failed_count  = 0
    total_fail_rows = 0
    timestamps    = []
    vus_over_time = {}
    check_passes  = 0
    check_fails   = 0
    csv_rows      = 0

    with open(csv_path, newline='') as f:
        reader = csv.DictReader(f)
        for row in reader:
            csv_rows += 1
            mn  = row.get('metric_name', '')
            val = row.get('metric_value', '0')
            ts  = row.get('timestamp', '0')
            try: v = float(val)
            except: v = 0.0
            try: t = int(ts)
            except: t = 0

            if mn == 'http_req_duration':
                url = row.get('url', 'unknown')
                all_durations.append(v)
                timestamps.append(t)
                url_data.setdefault(url, []).append(v)
            elif mn == 'http_req_failed':
                total_fail_rows += 1
                if v == 1.0: failed_count += 1
            elif mn == 'vus':
                vus_over_time[t] = max(vus_over_time.get(t, 0), int(v))
            elif mn == 'checks':
                if v == 1.0: check_passes += 1
                else:        check_fails  += 1

    all_durations.sort()
    n = len(all_durations)

    csv_min  = all_durations[0]  if n else 0
    csv_max  = all_durations[-1] if n else 0
    csv_avg  = sum(all_durations) / n if n else 0
    csv_med  = pct(all_durations, 50)
    csv_p90  = pct(all_durations, 90)
    csv_p95  = pct(all_durations, 95)
    csv_p99  = pct(all_durations, 99)

    t_start    = min(timestamps) if timestamps else 0
    t_end      = max(timestamps) if timestamps else 0
    dur_s      = t_end - t_start if t_end > t_start else 1
    throughput = n / dur_s
    err_rate   = (failed_count / total_fail_rows * 100) if total_fail_rows else 0.0
    max_vus    = max(vus_over_time.values()) if vus_over_time else 0
    start_dt   = datetime.fromtimestamp(t_start).strftime('%Y-%m-%d %H:%M:%S') if t_start else 'N/A'
    end_dt     = datetime.fromtimestamp(t_end).strftime('%Y-%m-%d %H:%M:%S')   if t_end   else 'N/A'
    dur_str    = f"{dur_s // 60} min {dur_s % 60} s"

    # ── summary.json values ──────────────────────────────────────────────────
    j_p95     = gv("http_req_duration", "p(95)", "N/A")
    j_avg     = gv("http_req_duration", "avg",   "N/A")
    j_err_val = m.get("http_req_failed", {}).get("value", 0)
    j_err_pct = float(j_err_val) * 100
    j_count   = gv("http_reqs", "count", 0)
    data_sent = gv("data_sent",     "count", 0)
    data_recv = gv("data_received", "count", 0)

    # ── Thresholds ───────────────────────────────────────────────────────────
    thresh_dur  = m.get("http_req_duration", {}).get("thresholds", {})
    thresh_fail = m.get("http_req_failed",   {}).get("thresholds", {})
    thresholds  = [(expr, not breached) for expr, breached in {**thresh_dur, **thresh_fail}.items()]

    thresh_rows_html = ""
    for expr, passed in thresholds:
        badge = '<span class="badge bg-success">PASSED</span>' if passed else '<span class="badge bg-danger">FAILED</span>'
        thresh_rows_html += f"<tr><td><code>{expr}</code></td><td>{badge}</td></tr>\n"

    # ── Per-URL ──────────────────────────────────────────────────────────────
    url_rows_html = ""
    for url, vals in sorted(url_data.items()):
        vals.sort()
        un   = len(vals)
        up95 = pct(vals, 95)
        uavg = sum(vals) / un
        url_rows_html += f'<tr><td><code>{url}</code></td><td>{un:,}</td><td>{uavg:.3f}</td><td>{up95:.3f}</td><td><span class="badge bg-success">OK</span></td></tr>\n'

    # ── Cross-check ──────────────────────────────────────────────────────────
    try:    p95_match = abs(float(j_p95) - csv_p95) < 0.01
    except: p95_match = False
    try:    avg_match = abs(float(j_avg) - csv_avg) < 0.01
    except: avg_match = False

    cross_html = f"""
<tr><td>p95</td><td>{csv_p95:.3f} ms</td><td>{fmt(j_p95)} ms</td><td>{'✅ Match' if p95_match else '⚠️ Differs'}</td></tr>
<tr><td>avg</td><td>{csv_avg:.3f} ms</td><td>{fmt(j_avg)} ms</td><td>{'✅ Match' if avg_match else '⚠️ Differs'}</td></tr>
<tr><td>Error rate</td><td>{err_rate:.4f}%</td><td>{j_err_pct:.4f}%</td><td>{'✅ Match' if abs(err_rate-j_err_pct)<0.01 else '⚠️ Differs'}</td></tr>
<tr><td>Total requests</td><td>{n:,}</td><td>{int(j_count):,}</td><td>{'✅ Match' if n==int(j_count) else '⚠️ Differs'}</td></tr>
"""

    csv_filename = os.path.basename(csv_path)

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>k6 Report · {csv_filename}</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <style>
    body {{ background:#f8f9fa; font-family:'Segoe UI',sans-serif; }}
    .card {{ border:none; border-radius:12px; box-shadow:0 2px 10px rgba(0,0,0,.07); margin-bottom:1.5rem; }}
    .metric-card {{ text-align:center; padding:1.5rem 1rem; }}
    .metric-value {{ font-size:2rem; font-weight:700; color:#0d6efd; }}
    .metric-label {{ font-size:.8rem; color:#6c757d; text-transform:uppercase; letter-spacing:.06em; margin-top:.25rem; }}
    .header-band {{ background:linear-gradient(135deg,#0d6efd 0%,#6610f2 100%); color:#fff; padding:2rem 2.5rem; border-radius:14px; margin-bottom:2rem; }}
    .section-title {{ font-size:1.05rem; font-weight:600; color:#343a40; margin-bottom:1rem; }}
    code {{ background:#f1f3f5; padding:2px 5px; border-radius:4px; font-size:.85em; }}
    .note {{ font-size:.8rem; color:#6c757d; margin-top:.5rem; }}
  </style>
</head>
<body>
<div class="container py-4">

  <div class="header-band">
    <h2 class="mb-1 fw-bold">k6 Performance Test Report</h2>
    <p class="mb-1 opacity-75">Source: <code style="background:rgba(255,255,255,.15);color:#fff">{csv_filename}</code> · {csv_rows:,} rows</p>
    <p class="mb-0 opacity-75">Start: {start_dt} · End: {end_dt} · Duration: {dur_str}</p>
  </div>

  <div class="card p-4">
    <div class="section-title">Threshold Results</div>
    <table class="table table-sm table-bordered mb-0">
      <thead><tr><th>Expression</th><th>Result</th></tr></thead>
      <tbody>{thresh_rows_html}</tbody>
    </table>
  </div>

  <div class="row g-3 mb-2">
    <div class="col-6 col-md-3"><div class="card metric-card"><div class="metric-value">{fmt(csv_p95,2)} ms</div><div class="metric-label">p95 (CSV computed)</div></div></div>
    <div class="col-6 col-md-3"><div class="card metric-card"><div class="metric-value">{fmt(csv_avg,2)} ms</div><div class="metric-label">Avg Response Time</div></div></div>
    <div class="col-6 col-md-3"><div class="card metric-card"><div class="metric-value">{throughput:.2f}</div><div class="metric-label">Req/s (Throughput)</div></div></div>
    <div class="col-6 col-md-3"><div class="card metric-card"><div class="metric-value">{err_rate:.2f}%</div><div class="metric-label">Error Rate</div></div></div>
  </div>
  <div class="row g-3 mb-3">
    <div class="col-6 col-md-3"><div class="card metric-card"><div class="metric-value">{n:,}</div><div class="metric-label">Total Requests</div></div></div>
    <div class="col-6 col-md-3"><div class="card metric-card"><div class="metric-value">{failed_count:,}</div><div class="metric-label">Failed Requests</div></div></div>
    <div class="col-6 col-md-3"><div class="card metric-card"><div class="metric-value">{max_vus}</div><div class="metric-label">Max VUs (CSV)</div></div></div>
    <div class="col-6 col-md-3"><div class="card metric-card"><div class="metric-value">{dur_str}</div><div class="metric-label">Test Duration</div></div></div>
  </div>

  <div class="card p-4">
    <div class="section-title">Response Time Distribution — <code>http_req_duration</code></div>
    <p class="note">Computed from {n:,} <code>http_req_duration</code> rows in CSV. Source of truth — NOT http_req_waiting or http_req_connecting.</p>
    <table class="table table-sm table-bordered">
      <thead><tr><th>Percentile</th><th>Value (ms)</th><th>Source</th></tr></thead>
      <tbody>
        <tr><td>Min</td><td>{fmt(csv_min)}</td><td>CSV min(metric_value)</td></tr>
        <tr><td>Median (p50)</td><td>{fmt(csv_med)}</td><td>CSV quantile(0.50)</td></tr>
        <tr><td>p90</td><td>{fmt(csv_p90)}</td><td>CSV quantile(0.90)</td></tr>
        <tr class="table-primary"><td><strong>p95</strong></td><td><strong>{fmt(csv_p95)}</strong></td><td>CSV quantile(0.95) — threshold metric</td></tr>
        <tr><td>p99</td><td>{fmt(csv_p99)}</td><td>CSV quantile(0.99)</td></tr>
        <tr><td>Max</td><td>{fmt(csv_max)}</td><td>CSV max(metric_value)</td></tr>
        <tr><td>Avg</td><td>{fmt(csv_avg)}</td><td>CSV mean(metric_value)</td></tr>
      </tbody>
    </table>
  </div>

  <div class="card p-4">
    <div class="section-title">Test Statistics</div>
    <table class="table table-sm table-bordered">
      <tbody>
        <tr><td>CSV file</td><td>{csv_filename} ({csv_rows:,} rows)</td></tr>
        <tr><td>Start time</td><td>{start_dt}</td></tr>
        <tr><td>End time</td><td>{end_dt}</td></tr>
        <tr><td>Duration</td><td>{dur_str} ({dur_s} s)</td></tr>
        <tr><td>Total HTTP requests</td><td>{n:,}</td></tr>
        <tr><td>Throughput</td><td>{throughput:.3f} req/s (= {n} / {dur_s} s)</td></tr>
        <tr><td>Failed requests</td><td>{failed_count} / {total_fail_rows}</td></tr>
        <tr><td>Error rate</td><td>{err_rate:.4f}%</td></tr>
        <tr><td>check() passes</td><td>{check_passes:,}</td></tr>
        <tr><td>check() fails</td><td>{check_fails:,}</td></tr>
        <tr><td>Max VUs observed</td><td>{max_vus}</td></tr>
        <tr><td>Data sent</td><td>{mb(data_sent)}</td></tr>
        <tr><td>Data received</td><td>{mb(data_recv)}</td></tr>
      </tbody>
    </table>
  </div>

  <div class="card p-4">
    <div class="section-title">Per-Endpoint Breakdown (from raw CSV)</div>
    <table class="table table-sm table-bordered">
      <thead><tr><th>URL</th><th>Count</th><th>Avg (ms)</th><th>p95 (ms)</th><th>Status</th></tr></thead>
      <tbody>{url_rows_html}</tbody>
    </table>
  </div>

  <div class="card p-4">
    <div class="section-title">Cross-check: CSV-computed vs summary.json</div>
    <table class="table table-sm table-bordered">
      <thead><tr><th>Metric</th><th>CSV-computed</th><th>summary.json</th><th>Match?</th></tr></thead>
      <tbody>{cross_html}</tbody>
    </table>
  </div>

  <footer class="text-center text-muted small py-3">
    All values extracted dynamically from <code>{csv_filename}</code> and <code>summary.json</code> — no hardcoded numbers.
  </footer>
</div>
</body>
</html>"""

    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "w") as f:
        f.write(html)
    print(f"Report written: {out_path}")
    print(f"  CSV rows     : {csv_rows:,}")
    print(f"  Durations    : {n:,}")
    print(f"  Max VUs      : {max_vus}")
    print(f"  Duration     : {dur_str}")
    print(f"  p95 (CSV)    : {csv_p95:.3f} ms")
    print(f"  Error rate   : {err_rate:.4f}%")


if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Usage: python3 generate_html_report.py <csv> <summary.json> <output.html>")
        sys.exit(1)
    generate(sys.argv[1], sys.argv[2], sys.argv[3])
