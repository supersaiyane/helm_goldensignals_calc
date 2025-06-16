
# 📊 Golden Signals Monitoring with Prometheus and Grafana

This guide explains how to implement the four **Golden Signals** in a Kubernetes environment using Prometheus and Grafana. These signals are essential for building observability into your application and ensuring reliability.

---

## 🟨 What Are Golden Signals?

| # | Signal      | Definition                                                                 | Why It Matters                                                                 |
|---|-------------|-----------------------------------------------------------------------------|---------------------------------------------------------------------------------|
| 1 | **Latency** | Time taken to serve a request (successfully or not).                        | High latency may indicate slowness or degraded performance.                     |
| 2 | **Traffic** | Number of requests, transactions, or load on your system.                   | Measures demand; helps plan scaling.                                            |
| 3 | **Errors**  | Rate of failed requests (4xx, 5xx, timeouts, etc.).                         | Indicates broken functionality or outages.                                      |
| 4 | **Saturation** | How full your resources are (CPU, memory, disk I/O, etc.).              | High saturation means you’re near or at capacity—leads to degraded performance. |

---

## ✅ Step-by-Step Implementation

### 1. 📦 Application Instrumentation (Node.js Example)

```bash
npm install prom-client
```

**Sample Code:**

```javascript
const express = require('express');
const client = require('prom-client');
const app = express();
const register = client.register;

const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3]
});

app.use((req, res, next) => {
  const end = httpRequestDurationMicroseconds.startTimer();
  res.on('finish', () => {
    end({ method: req.method, route: req.route?.path || req.path, code: res.statusCode });
  });
  next();
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.listen(8080);
```

---

### 2. 🔍 Prometheus Configuration

Add to `prometheus.yml`:

```yaml
scrape_configs:
  - job_name: 'golden-signal-calculator'
    static_configs:
      - targets: ['localhost:8080']
```

---

### 3. 📈 PromQL Queries

| Signal       | Query |
|--------------|-------|
| **Latency**  | `histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))` |
| **Traffic**  | `sum(rate(http_requests_total[1m]))` |
| **Errors**   | `sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m]))` |
| **Saturation** | `sum(rate(container_cpu_usage_seconds_total{container!="POD",pod!=""}[5m])) by (pod)` |

---

### 4. 📊 Grafana Dashboard Setup

Create 4 Panels in Grafana for:

#### Latency
```promql
histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))
```

#### Traffic
```promql
sum(rate(http_requests_total[1m]))
```

#### Errors
```promql
sum(rate(http_requests_total{code=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) * 100
```

#### Saturation
```promql
sum(rate(container_cpu_usage_seconds_total{container!="POD",pod!=""}[5m])) by (pod)
```

---

### 5. ⚠️ Alerting with Alertmanager

**Sample alert.rules.yml:**

```yaml
groups:
- name: golden-signal-alerts
  rules:
  - alert: HighErrorRate
    expr: sum(rate(http_requests_total{code=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) > 0.05
    for: 2m
    labels:
      severity: critical
    annotations:
      summary: "High error rate detected"
      description: "More than 5% of requests are failing"
```

---

## 📌 Summary

Implementing Golden Signals provides:

- Fast insight into performance issues
- Foundation for SLOs and SLIs
- Meaningful alerting without noise

---