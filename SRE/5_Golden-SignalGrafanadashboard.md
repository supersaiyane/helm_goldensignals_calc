# Golden-Signal Grafana Dashboard

---

## 🔹 Traffic – Requests/sec by Status

**PromQL:**
```promql
sum(rate(http_requests_total{job="checkout"}[$__rate_interval])) by (status)
```

---

## 🔹 Errors – Error Ratio (%)

**PromQL:**
```promql
100 * (1 - (
  sum(rate(http_requests_total{job="checkout",status=~"2.."}[$__rate_interval])) /
  sum(rate(http_requests_total{job="checkout"}[$__rate_interval]))
))
```

---

## 🔹 Latency – P50 / P90 / P99 Overlay

**PromQL (example for P99):**
```promql
histogram_quantile(0.99, sum by (le) (
  rate(http_request_duration_seconds_bucket{job="checkout"}[$__rate_interval])
))
```

(Repeat with `0.90` for P90 and `0.50` for P50)

---

## 🔹 Saturation – Pod CPU / Memory Usage vs. Requests

**PromQL:**
```promql
avg(rate(container_cpu_usage_seconds_total{pod=~"checkout-.*"}[$__rate_interval]))
```

(Add similar memory usage expression as needed)

---

## 🔹 Error-Budget Burn-Down Gauge

- Custom Grafana panel
- Fed by a **Prometheus recording rule** based on burn rate

---
