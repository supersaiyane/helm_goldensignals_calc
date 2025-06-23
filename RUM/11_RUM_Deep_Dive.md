# 📡 Real User Monitoring (RUM) — Deep Dive for SRE Architects

## 📌 What is RUM?

Real User Monitoring (RUM) is a **passive monitoring technique** that captures **actual user interactions** with your application in real-time.

> 🧩 RUM ≠ synthetic tests.  
> Instead, it collects **live client-side data** from real browsers/apps.

---

## 🎯 Why RUM Matters (Especially for Architects)

- Provides **user-centric visibility** → "What is *actually* slow for users?"
- Complements backend metrics like SLOs based on server-side Prometheus.
- Improves **SLO accuracy** by including frontend, network, and rendering delays.
- Enables **end-to-end observability** across client ↔ CDN ↔ API ↔ DB.

---

## 🏗️ Key Metrics Captured by RUM

| Metric                        | Description                             |
|------------------------------|-----------------------------------------|
| `First Contentful Paint`     | Time until first content renders        |
| `Time to Interactive (TTI)`  | Time until page becomes usable          |
| `DOM Load / Complete`        | When DOM and resources are loaded       |
| `Frontend/Backend Latency`   | Time split between client and server    |
| `Error Rate`                 | JS errors, HTTP errors                  |
| `User Location/Device/Browser` | Segmentation for performance issues   |

---

## ⚙️ RUM Architecture Overview

```
+---------------------+
|  User Browser/App   |
| (JavaScript Agent)  |
+---------------------+
           |
     Collects events:
     - Navigation timing
     - Resource timing
     - User interactions
           ↓
+---------------------+
|  RUM Collector API  | ← (Your endpoint or Vendor’s)
+---------------------+
           ↓
+---------------------+
|  Storage & Analysis |
| (e.g., Datadog,     |
|  AWS, Elastic RUM)  |
+---------------------+
           ↓
     Dashboards / Alerts
```

---

## 🧪 Popular Tools for RUM

| Tool                 | Highlights                                                        |
|----------------------|-------------------------------------------------------------------|
| **Datadog RUM**      | Full user session replay, frontend + backend correlation          |
| **AWS CloudWatch RUM** | Native for AWS web apps, integrates with CloudWatch metrics    |
| **Grafana Faro**     | Self-hosted RUM collector + backend                               |
| **Elastic RUM (APM)**| OpenTelemetry-compatible, Kibana dashboards                       |
| **New Relic Browser**| Heatmaps, JS error tracking, Core Web Vitals                     |

---

## ✅ How to Implement RUM (Hands-On)

### Example: Grafana Faro (Self-Hosted)

#### 1. Add RUM Script to your frontend app:

```html
<script src="https://unpkg.com/@grafana/faro-web-sdk"></script>
<script>
  Faro.init({
    url: "https://your-rum-collector/api/events",
    app: {
      name: "golden-signal-calc",
      version: "1.0.0",
    },
  });
</script>
```

#### 2. Deploy a Faro Collector (Docker):

```bash
docker run -p 8080:8080 \
  -e FARO_COLLECTOR_API_KEY=abc123 \
  grafana/faro-collector
```

#### 3. Ingest into Prometheus / Loki / Tempo and connect to Grafana.

---

## 📊 RUM + SLOs: What Can You Do?

### Define **Client-Side SLIs**:

- `TTI < 3s` in 95% of sessions
- `No JS error` in 99.99% of sessions

### Burn Rate Alerts:

```promql
sum(rate(user_sessions{tti>3}[5m])) / sum(rate(user_sessions[5m]))
```

### Combine with backend to form **End-to-End SLIs**:

```text
User Latency = Frontend Latency + Network RTT + Server Latency
```

---

## 📁 Real-World Use Cases

| Use Case                           | Impact                                  |
|-----------------------------------|-----------------------------------------|
| Tracking slow pages in India      | Optimize CDN and DNS routing            |
| JS Error Spike in Chrome 113      | Rollback frontend release               |
| Correlating page loads with 5xx   | Identify broken backend routes          |
| Measuring full SLOs               | End-to-end reliability measurement      |

---

## 🧠 Learning Targets for You (Actionable)

| Topic                   | Task                                                             |
|------------------------|------------------------------------------------------------------|
| 📍 RUM Concept          | Explain what RUM is, and how it complements Prometheus           |
| 🧪 Hands-on             | Deploy Grafana Faro or CloudWatch RUM in a sample app            |
| 🎯 SLO Design           | Add frontend latency and error SLOs                              |
| 📈 Dashboards           | Build Grafana dashboards with client + server metrics            |
| 🚨 Alerts               | Define burn rate alerts using RUM metrics                        |