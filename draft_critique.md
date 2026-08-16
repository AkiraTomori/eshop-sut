# AI Critique — HW05 Performance Testing
**Student ID**: 23127379

## Analysis of AI Errors and Limitations

During HW05, I used Antigravity (Claude Sonnet) to support the entire performance testing workflow. The following is an honest assessment of where the AI fell short, with concrete evidence.

### Error 1: Missing Endurance Parameters (Skill 1, Group 3, v1)
When generating the test parameters for the Group 3 Transactional endpoint (`POST /api/checkout`), the AI successfully mapped the scenario to a Stress test (10→200 VUs). However, it completely omitted the endurance/soak test variant, which is a mandatory requirement for HW05 Task 1 to find the memory ceiling. This was flagged as a High severity issue by the independent reviewer (Skill 10). The AI produced this error because the initial prompt focused heavily on the stress test breaking point, causing the model to lose context on the global assignment requirements.

### Error 2: Arithmetic Hallucination in Test Duration (Skill 1, Group 3, v1)
In the same Group 3 v1 output, the AI accurately defined the VU stepping logic: 12 steps of 30 seconds (which equals 6 minutes), plus a 1-minute ramp-down. However, it hallucinated the final sum, explicitly stating the total duration was 13 minutes instead of 7 minutes. This is a classic Large Language Model arithmetic failure, where the AI generates plausible text but fails to correctly evaluate basic mathematical operations over its own generated data.

### What the AI Did Well
The AI was exceptional at data extraction and boilerplate generation. The `jtl-log-analyzer` (Skill 4) accurately parsed 45,000+ CSV rows without hallucinating performance metrics, correctly identifying that the `POST /api/checkout` endpoint survived 200 VUs with 0.00% errors. It saved hours of manual scripting and reporting.

### Lessons Learned
1. Always implement an independent review step (Skill 10). The AI caught its own math errors when placed in a fresh, independent context.
2. AI struggles with multi-constraint optimization. When prompted to focus on the "breaking point", it forgot the "endurance" requirement. Explicitly restating all global requirements in every prompt is necessary to maintain context.

**Word count**: 342
