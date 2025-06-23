# 📊 Building SLOs Based on RUM Data

## 🎯 Why Use RUM for SLOs?
Traditional SLOs often focus on server-side metrics. Real User Monitoring (RUM) extends this by including **client-side performance**, giving a full picture of user experience.

---

## 🧩 Client-Side SLIs to Monitor

| Indicator                    | SLI Example                                    |
|-----------------------------|------------------------------------------------|
| Time to Interactive (TTI)   | 95% of sessions have TTI < 3s                  |
| First Contentful Paint (FCP)| 99% of sessions load FCP < 1.5s                |
| JS Error Rate               | Less than 0.01% of sessions with JS errors     |
| Frontend Latency            | 95% of sessions report frontend latency < 500ms|

---

## ✅ Example SLO Definitions

### 🎯 SLO #1: TTI Responsiveness
- **SLI**: % of sessions with `tti < 3s`
- **SLO Target**: 95%
- **PromQL**:
```promql
(sum(rate(user_sessions{tti<3}[5m])) / sum(rate(user_sessions[5m]))) * 100
```

---

### 🎯 SLO #2: JavaScript Error Rate
- **SLI**: % of sessions with no uncaught JS errors
- **SLO Target**: 99.99%
- **PromQL**:
```promql
(1 - (sum(rate(js_errors_total[5m])) / sum(rate(user_sessions[5m])))) * 100
```

---

### 🎯 SLO #3: Frontend Latency
- **SLI**: 95th percentile of frontend response time
- **Target**: < 500ms
- **PromQL**:
```promql
histogram_quantile(0.95, sum(rate(frontend_latency_bucket[5m])) by (le))
```

---

## 📐 Error Budget Calculation

If your SLO target is 99.9%:
- Monthly budget = 0.1% of 30 days = ~43.2 minutes
- Every minute above the threshold eats into your error budget

Use burn rate alerts:
```promql
rate(error_budget_burn[5m]) > (14.4)  # fast burn alert
rate(error_budget_burn[1h]) > (6)     # slow burn alert
```

---

## 🧠 Tips for Implementation
- Use **Grafana Faro**, **Datadog RUM**, or **AWS CloudWatch RUM** to export these metrics.
- Align frontend SLOs with **backend** for full reliability guarantees.
- Use **recording rules** in Prometheus to store these SLIs efficiently.