#!/bin/bash
# run_all_monitored.sh

run_test() {
  SCRIPT_PATH=$1
  OUTPUT_DIR=$2
  
  mkdir -p "$OUTPUT_DIR"
  echo "Running $SCRIPT_PATH -> $OUTPUT_DIR"
  
  # Start resource monitor in background
  RESOURCE_LOG="${OUTPUT_DIR}/resource_usage.txt"
  echo "=== Resource Monitor Start: $(date) ===" > "${RESOURCE_LOG}"
  
  (
    while true; do
      echo "--- $(date +%H:%M:%S) ---" >> "${RESOURCE_LOG}"
      top -l 1 -n 10 -stats pid,command,cpu,mem | head -20 >> "${RESOURCE_LOG}"
      ps aux | grep "node" | grep -v grep >> "${RESOURCE_LOG}" 2>/dev/null || true
      sleep 5
    done
  ) &
  MONITOR_PID=$!
  
  # Run k6
  k6 run \
    --out csv="${OUTPUT_DIR}/results.csv" \
    --summary-export="${OUTPUT_DIR}/summary.json" \
    "${SCRIPT_PATH}" \
    > "${OUTPUT_DIR}/k6_console.txt" 2>&1
    
  # Kill monitor
  kill $MONITOR_PID
  
  echo "Finished $SCRIPT_PATH"
}

run_test "23127379_Homework/HW5/Group-1_Load_Products/23127379_Load_20260813.js" "23127379_Homework/HW5/Group-1_Load_Products/results_monitored_load"
run_test "23127379_Homework/HW5/Group-1_Load_Products/23127379_Load_Endurance_20260813.js" "23127379_Homework/HW5/Group-1_Load_Products/results_monitored_endurance"
run_test "23127379_Homework/HW5/Group-2_Spike_Auth/23127379_Spike_20260813.js" "23127379_Homework/HW5/Group-2_Spike_Auth/results_monitored_spike"
run_test "23127379_Homework/HW5/Group-3_Stress_Checkout/23127379_Stress_20260813.js" "23127379_Homework/HW5/Group-3_Stress_Checkout/results_monitored_stress"
run_test "23127379_Homework/HW5/Group-3_Stress_Checkout/23127379_Stress_Endurance_20260814.js" "23127379_Homework/HW5/Group-3_Stress_Checkout/results_monitored_endurance"
