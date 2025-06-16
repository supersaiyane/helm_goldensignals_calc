# Incident Lifecycle — Stage-by-Stage Cheat-Sheet

| Stage | Key Activities & Artefacts | Must-Know Terminology (drop these in the interview) |
|-------|-----------------------------|-----------------------------------------------------|
| 1️⃣ Monitoring & Signal | Continuous ingestion of SLIs; dashboards; anomaly detectors. | **SLI**, **SLO**, **Error-Budget Burn**, **MTTD**, **White- vs. Black-Box monitoring** |
| 2️⃣ Alerting & Paging | Alert rules fire → on-call receives page via PagerDuty/Opsgenie. | **Alertmanager**, **Page**, **Escalation Policy**, **MTTA**, **Slack bridge** |
| 3️⃣ Acknowledgement & Incident Declaration | First responder ACKs, labels severity (P0/P1), spins up war room. | **Incident Commander (IC)**, **Scribe/Comms Lead**, **P0/P1**, **War-Room Channel** |
| 4️⃣ Triage & Diagnosis | Query logs, traces; follow runbooks; form hypotheses; decide rollback vs. fix-forward. | **Golden Signals**, **Runbook**, **Playbook**, **Distributed Trace**, **Blast Radius** |
| 5️⃣ Mitigation / Workaround | Rollback image, flip feature flag, shift traffic, apply hotfix. | **Rollback**, **Feature Flag**, **Canary Abort**, **Circuit Breaker**, **Bulkhead** |
| 6️⃣ Resolution | Service fully healthy; smoke tests green; customer impact ended. | **MTTR**, **Verification Probe**, **Status-Page Close**, **All-Clear** |
| 7️⃣ Blameless Post-Mortem | Timeline, impact, root-cause analysis, 5 Whys, CAPA drafted. | **RCA**, **5 Whys**, **CAPA**, **LFI (Lessons For Improvement)**, **Contributing Factors** |
| 8️⃣ Action Items & Follow-up | File Jira tickets, automate toil, update SLIs/SLOs, schedule chaos test. | **Toil**, **Tech Debt**, **Error-Budget Policy**, **Change Management**, **GameDay** |
| 9️⃣ Knowledge-Base Update & Closure | Refresh runbooks, attach dashboards, tag metrics annotation, close incident. | **Runbook Update**, **KB Article**, **Drift Detection**, **Shift-Left**, **MTBF tracking** |
