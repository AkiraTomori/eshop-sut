#!/bin/bash
# resource_monitor.sh — run in a SEPARATE terminal BEFORE starting k6
# Records CPU/memory every 5 seconds during the spike test
# Usage: bash resource_monitor.sh

LOG="results/resource_usage.txt"
echo "=== Resource Monitor Start: $(date) ===" > "$LOG"
echo "Monitoring node.js (SUT) and system resources every 5s..."
echo "Press Ctrl+C when k6 finishes."
echo ""

while true; do
  echo "--- $(date +%H:%M:%S) ---" >> "$LOG"
  # Top 10 processes by CPU
  top -l 1 -n 10 -stats pid,command,cpu,mem 2>/dev/null | head -20 >> "$LOG"
  # Node.js process specifically
  ps aux | grep "node" | grep -v grep >> "$LOG" 2>/dev/null || true
  echo "" >> "$LOG"
  sleep 5
done
