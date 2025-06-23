# 🎓 Chaos Engineering — Mock Interview Question (with Answer Guide)

## 🧠 Question:

> **"You are responsible for reliability in a large-scale multi-tenant SaaS platform hosted on Kubernetes (AWS EKS). How would you introduce Chaos Engineering in a production-like environment without impacting SLAs? Please walk me through your strategy, architecture, and operational guardrails."**

---

## ✅ What Interviewers Look For:

| Aspect                          | Expectation                                                             |
|----------------------------------|-------------------------------------------------------------------------|
| Architecture Thinking            | Use of namespaces, experiments scoped to individual services            |
| Safety Mechanisms                | Guardrails, steady state definition, blast radius control               |
| Tool Familiarity                 | LitmusChaos, Gremlin, AWS FIS, etc.                                     |
| Observability Integration        | Prometheus, Alertmanager, Grafana, SLO dashboards                        |
| Real-World Application           | Daily CI/CD chaos runs, weekly game days, SLO-linked auto remediation   |

---

## 🧩 Sample High-Level Answer:

### 🔹 1. **Strategy & Goals**

- Objective: Validate failure resilience *before* real outages.
- Scope: Start with **non-critical services** and move to core paths once maturity increases.
- Frequency: Run daily in **staging**, weekly in **production** under guardrails.

---

### 🔹 2. **Architecture Overview**

```
[User] → [Ingress] → [Microservices] → [DB]
                  ↑         ↑
           Litmus Operator + Chaos CRDs (per service)
                  ↓         ↓
     Prometheus + Grafana → SLO Dashboards
```

- Chaos orchestrator: **LitmusChaos** (K8s native)
- Each experiment targets a **namespace-bound service**
- **Observability** wired into Prometheus/Grafana
- Alerts wired to Slack/PagerDuty on SLO breach

---

### 🔹 3. **Tooling**

| Component     | Tool Used                  |
|---------------|----------------------------|
| Chaos Engine  | LitmusChaos (via CRDs)     |
| Observability | Prometheus, Grafana        |
| Alerting      | Alertmanager + Slack/PagerDuty |
| GitOps        | ArgoCD to deploy chaos plans |
| SLO Burn Calc | Custom PromQL alerts       |

---

### 🔹 4. **Experiment Types**

- **Pod kill** (e.g. API)
- **Network latency** (e.g. DB service)
- **Node drain** (simulate zone failure)
- **DNS failure** (blackhole third-party service)
- **Disk pressure** (simulate log growth)

---

### 🔹 5. **Steady State & Guardrails**

- Steady state: Response latency, error rates, CPU threshold
- Pre-checks:
  - No active P1 incidents
  - System must be “green” in dashboards
- Fail-safe: Auto-disable experiment on:
  - SLA breach
  - PagerDuty signal
  - Manual “kill switch” (chaos namespace deletion)

---

### 🔹 6. **CI/CD Integration**

- Add chaos step in CI/CD for every new feature branch in staging:
```yaml
- name: Inject Chaos for API
  run: kubectl apply -f chaos/engine-api.yaml
```

- Add post-chaos validation job:
```bash
./scripts/check-slo-burn.sh
```

---

### 🔹 7. **Production Strategy**

- Run during low-traffic hours
- Start with read-only or stateless services
- Slowly move to full **Game Day** chaos scenarios:
  - DB failover
  - Region outage simulation
  - Service-to-service circuit breaker failures

---

## 🚀 Bonus Points If You Say:

- "We tag all chaos events using `chaos=true` and query their impact in Grafana dashboards."
- "We validate that **error budget consumption increases**, but remains within limits."
- "We discovered an unknown failure path when cache failed silently."