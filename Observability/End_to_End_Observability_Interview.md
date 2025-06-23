# 🧠 Interview-Style Design Question: End-to-End Observability

## 📌 Scenario:

You’re designing a global e-commerce platform. Users access the service via browser and mobile apps. The architecture involves:

- CDN + Frontend
- Backend APIs (microservices)
- Data layer (caches, DBs)
- 99.95% Availability SLO

---

## 🛠️ Interview Task:

**Design an observability strategy that covers client to backend. Include:**

### 1. **Golden Signals**
- **Latency**: Measure from client to server
- **Traffic**: Request rates on frontend/backend
- **Errors**: Client JS errors, HTTP 5xx
- **Saturation**: Backend CPU/memory

---

### 2. **Tools Stack**
- **Frontend**: RUM via Grafana Faro / Datadog RUM
- **Backend**: Prometheus + OpenTelemetry + Loki
- **Tracing**: Tempo / Jaeger to trace request lifecycle
- **Logs**: Loki / CloudWatch Logs
- **Dashboards**: Grafana with multi-tier panels

---

### 3. **SLIs & SLOs**
| Layer      | SLI Example                         | SLO Target |
|------------|-------------------------------------|------------|
| Frontend   | TTI < 3s in 95% of sessions         | 95%        |
| API        | HTTP 2xx rate                       | 99.9%      |
| DB         | Query latency P95 < 200ms           | 99%        |

---

### 4. **Alerting Strategy**
- Burn rate alerts for each SLO
- Alert grouping by layer (Frontend / API / DB)
- Routing via Alertmanager or PagerDuty

---

### 5. **Architecture Diagram Description**
```
[User Browser] → [CDN] → [Frontend App] → [API Gateway] → [Microservices] → [DB]
      ↓              ↓              ↓             ↓              ↓
    RUM          OpenTelemetry    Prometheus   Tracing       Logs + SLOs
```

---

## ✅ Bonus Points
- Include **synthetic monitoring** for uptime checks
- Add **chaos injection** for resilience validation
- Highlight **correlation IDs** from RUM to trace logs

---

## 🚀 Goal:

Ensure **user experience is measurable**, **reliability is enforced by SLOs**, and **every failure is observable** from browser to database.