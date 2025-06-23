# 📊 Kiali Dashboard Layout + Service Mesh SLO Setup

---

## 🧭 Kiali Dashboard Overview

Kiali is a visualization tool for Istio service mesh, showing service-to-service communication, health status, and request flow.

### 📌 Default Panels in Kiali

| Panel                      | Purpose                                        |
|----------------------------|------------------------------------------------|
| **Graph View**             | Live traffic between services                  |
| **Applications**           | Latency, request rate, error rate              |
| **Workloads**              | Pods and sidecars health                       |
| **Traffic Animation**      | Real-time edge traffic visualization           |
| **Inbound/Outbound Metrics** | Per workload route metrics                  |
| **Traces (Jaeger)**        | Distributed traces per request path           |
| **Security Overview**      | mTLS enforcement status                       |

---

## 📐 Example Kiali Graph View Layout

```text
                +---------------------+
                |    Ingress Gateway  |
                +---------------------+
                          |
                          ▼
                  +----------------+
                  | golden-signal  |
                  +----------------+
                     /     |     \
                +---+   +--+--+   +---+
                | v1|   | v2 |   |v3  |
                +---+   +----+   +---+

Traffic animation:
- 80% → v1 (green arrow)
- 20% → v2 (yellow arrow)
- 0%  → v3 (gray arrow)
```

---

## 📈 Custom SLOs for Service Mesh Traffic

### 🎯 SLO #1: HTTP Success Rate (Per Service)

**Goal**: 99.9% of requests return 2xx/3xx status

```promql
(
  sum(rate(istio_requests_total{reporter="destination", response_code=~"2..|3.."}[1m])) /
  sum(rate(istio_requests_total{reporter="destination"}[1m]))
) * 100
```

---

### 🎯 SLO #2: P95 Request Latency (Route Level)

```promql
histogram_quantile(0.95,
  sum(rate(istio_request_duration_milliseconds_bucket{reporter="destination"}[5m]))
  by (le, destination_workload)
)
```

---

### 🎯 SLO #3: Error Rate Spike (Burn Rate Alert)

```promql
(
  1 - (
    sum(rate(istio_requests_total{response_code=~"2.."}[1m])) /
    sum(rate(istio_requests_total[1m]))
  )
) > (1 - 0.999) * 14
```

Use with:
- Slack or PagerDuty alert
- Route-level burn label
- Auto-remediation trigger

---

## 🔐 Use Labels for Tracing

Add service labels:
```yaml
labels:
  app: golden-signal
  version: v1
  chaos: "false"
```

Kiali will display these in the **graph** and **workload health** views.

---

## 🧠 SLO Dashboard in Grafana

- Use Istio metrics from Prometheus
- Panel examples:
  - HTTP success % over time
  - Latency (P50/P90/P95)
  - Error budget burn down (per route)
  - mTLS coverage %
  - Service dependency map (external to internal)

---

This layout + SLO setup ensures **mesh traffic is observable**, **resilient**, and **aligned to SLOs**.