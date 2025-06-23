# 🎓 Mock Interview Scenario: Multi-Region Failover

## 🧠 Scenario:
> **"You're designing a SaaS system with 99.99% availability for global users. It runs in multiple AWS regions. How would you architect a failover system to ensure minimal downtime in case a region goes down?"**

---

## ✅ What Interviewers Look For:

| Category              | Expectation                                                                 |
|-----------------------|-----------------------------------------------------------------------------|
| Architecture Design   | Clear use of Route53, EKS, RDS/Aurora Global, S3 CRR                        |
| Failover Strategy     | DNS-based + data layer promotion + infra warm standby                       |
| SLO Awareness         | Region-specific alerts, burn rate triggers                                  |
| Automation            | DR scripts, health checks, infra-as-code                                    |
| Testing & Reliability | GameDay plans, chaos testing, incident playbooks                            |

---

## 🧩 High-Level Answer

### 🔹 1. Architecture Components

- EKS clusters in us-east-1 (primary) and eu-west-1 (secondary)
- Route53 DNS with health check–based failover
- Aurora Global Database (write in primary, read replica in secondary)
- S3 with Cross-Region Replication
- Thanos for Prometheus global metrics

---

### 🔹 2. Failover Flow

1. us-east-1 fails (app or DB health check fails)
2. Route53 fails over traffic to eu-west-1
3. Promote Aurora read replica to writable
4. Helm release auto-promotes app with correct config
5. Restart queues/caches in secondary
6. SLO dashboards flip to secondary
7. Incident declared → alert + auto-remediation triggered

---

### 🔹 3. Testing & Simulation

- Run GameDay drills: fail Route53 health check, inject latency, stop DB
- Use `chaos=true` dashboards to measure impact
- SLO-based alerting per region

---

## 🚀 Bonus Points

- "We use GitOps with ArgoCD and sync waves for multi-cluster management."
- "Our DR scripts promote DB, reassign Route53, and notify Slack."