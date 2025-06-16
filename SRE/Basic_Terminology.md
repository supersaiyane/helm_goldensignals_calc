## 1. Reliability & User-Facing Guarantees

| Term | Quick Definition | Why the Panel Cares |
|------|------------------|----------------------|
| SLA (Service-Level Agreement) | Contractual uptime/latency promise to customers. Breach ⇒ penalties. | Shows you separate legal/commercial targets from engineering ones. |
| SLO (Service-Level Objective) | Reliability target you aim to meet (e.g., 99.95 % availability). | Core to SRE practice; balancing feature velocity vs. stability. |
| SLI (Service-Level Indicator) | Measurable metric representing service health (e.g., request success ratio). | You must choose the right signals, not just easy ones. |
| Error Budget | 1 – SLO; quantifies allowable failure minutes. | Drives release gating, chaos tests, and incident severity. |
| Four Golden Signals | Latency, Traffic, Errors, Saturation. | Canonical baseline dashboard; expect to diagram this. |
| Availability vs. Durability | Uptime vs. data survival. | Knowing the trade-offs guides redundancy design. |

## 2. Incident & Failure Metrics

| Term | Quick Definition | Why the Panel Cares |
|------|------------------|----------------------|
| MTTD (Mean Time to Detect) | Avg. time to notice an issue. | Shows monitoring efficacy. |
| MTTR (Mean Time to Resolve) | Detect → full recovery. | You’ll be asked how to drive this down. |
| MTBF (Mean Time Between Failures) | Avg. run time between incidents. | Highlights systemic vs. random failures. |
| MTTA (Mean Time to Acknowledge) | Alert → human ownership. | Tests alert-routing & on-call hygiene. |
| P0/P1/P2 Severity | Priority scale; P0 = business-critical. | Interviewers love “how would you triage?”. |

## 3. Incident Response Artifacts

| Term | Quick Definition | Why the Panel Cares |
|------|------------------|----------------------|
| Runbook | Step-by-step fix/diagnosis doc. | Proves operational maturity. |
| Playbook | Higher-level flows (e.g., failover process). | Tests knowledge of coordinated response. |
| Blameless Post-Mortem | Retrospective focusing on systemic causes. | Cultural keystone; expect scenario questions. |
| Incident Commander | Single decision owner during crisis. | Ensures clear comms; you may role-play this. |

## 4. Toil & Engineering Efficiency

| Term | Quick Definition | Why the Panel Cares |
|------|------------------|----------------------|
| Toil | Repetitive, automatable ops work. | You must show automation mindset. |
| Error Budget Policy | Rules for pausing releases when budget is spent. | Connects reliability metrics to velocity. |
| Operational Load | % time on call / handling tickets. | Balances project vs. reactive work. |

## 5. Observability & Tracing

| Term | Quick Definition | Why the Panel Cares |
|------|------------------|----------------------|
| White-Box Monitoring | Uses internal metrics (Prom, OpenTelemetry). | Shows you instrument code, not just infra. |
| Black-Box Monitoring | External probes / synthetic tests. | Complements SLIs; interviewer may ask to script one. |
| Structured Logging | Logs as key-value JSON. | Enables query & correlation. |
| Distributed Trace | End-to-end request timeline (e.g., Jaeger). | Critical for microservice latency root cause. |
| Cardinality Explosion | Too many label combinations in metrics. | Tests Prometheus scaling knowledge. |

## 6. Deployment & Release Strategies

| Term | Quick Definition | Why the Panel Cares |
|------|------------------|----------------------|
| Blue-Green Deploy | Two prod environments; flip traffic. | Classic zero-downtime example. |
| Canary Release | Gradual % rollout + rollback. | Expect to draft a rollout plan. |
| Feature Flag | Toggle code paths at runtime. | Connects to error-budget-driven rollbacks. |
| Progressive Delivery | Automating canary + metrics-based promotion. | Modern buzzword—mention tools (Argo Rollouts, Flagger). |

## 7. Testing & Chaos

| Term | Quick Definition | Why the Panel Cares |
|------|------------------|----------------------|
| Chaos Engineering | Inject controlled failures to validate resilience. | You may need to write a simple fault-injection script. |
| GameDay | Team exercise simulating incidents. | Shows continuous learning culture. |
| Fault Injection Policy | Limits blast radius of chaos. | Safety governance = interview brownie points. |

## 8. Capacity & Resilience

| Term | Quick Definition | Why the Panel Cares |
|------|------------------|----------------------|
| Autoscaling (HPA/VPA) | Horizontal/Vertical pod auto-scaling. | Hands-on YAML likely. |
| Pod Disruption Budget (PDB) | Min healthy pods during voluntary disruptions. | Pro tip: tie to upgrade strategy. |
| Circuit Breaker | Fail fast after threshold errors. | Often “how to protect downstream”. |
| Bulkhead | Isolate resources per tenant. | Connect to multi-tenant SLIs. |

## 9. Kubernetes-Specific Reliability

| Term | Quick Definition | Why the Panel Cares |
|------|------------------|----------------------|
| Readiness Probe | Indicates pod can accept traffic. | Common bug root cause. |
| Liveness Probe | Restarts hung containers. | Shows you separate crash vs. overload. |
| PodSecurityPolicy / Admission Controller | Gate pod specs at deploy time. | Security + reliability intersection. |
| NetworkPolicy | Namespaced firewall rules. | Expect to craft one on a whiteboard. |
| CNI / eBPF | Container Networking Interface; eBPF for high-perf packet filtering (e.g., Cilium). | Cutting-edge topic—they’ll be impressed. |

## 10. Infrastructure as Code & Supply Chain

| Term | Quick Definition | Why the Panel Cares |
|------|------------------|----------------------|
| Idempotence | Same IaC run ⇒ same state, no drift. | Must defend Terraform module design. |
| Drift Detection | Flag infra diverging from code (e.g., Terraform plan in CI). | Reliability = consistency. |
| GitOps | Declarative infra reconciled from Git (Argo CD, Flux). | Hot topic; likely demo exercise. |
| SBOM (Software Bill of Materials) | Inventory of components in artifacts. | Rising SLSA/Supply-chain compliance requirement. |

## 11. Data Reliability

| Term | Quick Definition | Why the Panel Cares |
|------|------------------|----------------------|
| RPO (Recovery Point Objective) | Max tolerated data loss gap. | Pair with backup cadence. |
| RTO (Recovery Time Objective) | Max tolerated downtime after disaster. | Guides failover automation design. |
| Point-in-Time Recovery (PITR) | Restore DB to exact timestamp. | Might need to script postgres WAL replay. |

## 12. Security-Oriented SRE

| Term | Quick Definition | Why the Panel Cares |
|------|------------------|----------------------|
| Zero Trust | “Never trust, always verify” (identity-based auth every hop). | Mention mTLS + short-lived tokens. |
| mTLS (Mutual TLS) | Certificate auth both ways. | You’ll map to service mesh policy. |
| Secret Rotation | Automated key renewal. | Reliability & security share ownership. |

## 13. Cultural & Process Terms

| Term | Quick Definition | Why the Panel Cares |
|------|------------------|----------------------|
| You Build It, You Run It | Dev teams own on-call. | Aligns incentives—leaders love this. |
| Shift-Left | Move testing/ops earlier in SDLC. | Connects to CI policy. |
| Error Budget Burn Rate | How fast you’re spending budget (e.g., %/hour). | Enables real-time release gating. |
