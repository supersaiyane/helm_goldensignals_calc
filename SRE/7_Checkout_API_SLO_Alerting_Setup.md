
# ✅ Full Prometheus + Alertmanager + PagerDuty Setup for `/checkout` API

This guide provides a full example of integrating Prometheus alerting with Alertmanager and PagerDuty using SLO-based burn rate rules.

---

## 🔧 prometheus.yml

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

alerting:
  alertmanagers:
    - static_configs:
        - targets: ['localhost:9093']

rule_files:
  - "slo_rules.yml"    # Burn-rate alerts

scrape_configs:
  - job_name: "checkout-api"
    static_configs:
      - targets: ["localhost:8080"]
    metrics_path: /metrics
    scheme: http

    relabel_configs:
      - source_labels: [__address__]
        regex: (.*):.*
        target_label: instance
        replacement: ${1}
```

---

## 📐 slo_rules.yml (Burn-Rate Alerting Rules for `/checkout` API)

```yaml
groups:
- name: checkout-slo
  interval: 15s
  rules:
    - alert: CheckoutSLOFastBurn
      expr: |
        (
          sum(rate(http_requests_total{job="checkout-api", status!~"2.."}[5m]))
          /
          sum(rate(http_requests_total{job="checkout-api"}[5m]))
        ) / 0.0001 > 14
      for: 2m
      labels:
        severity: critical
      annotations:
        summary: "Fast Burn: Checkout error budget at 14×"
        description: "Checkout API error rate is burning fast. Action needed immediately."

    - alert: CheckoutSLOSlowBurn
      expr: |
        (
          sum(rate(http_requests_total{job="checkout-api", status!~"2.."}[1h]))
          /
          sum(rate(http_requests_total{job="checkout-api"}[1h]))
        ) / 0.0001 > 6
      for: 15m
      labels:
        severity: warning
      annotations:
        summary: "Slow Burn: Checkout error budget at 6×"
        description: "Checkout API is steadily degrading. Attention needed within hours."
```

---

## 🚨 alertmanager.yml (Routing + PagerDuty Integration)

Replace `<PAGERDUTY-INTEGRATION-KEY>` with your actual PagerDuty service key.

```yaml
global:
  resolve_timeout: 5m

route:
  group_by: ['alertname']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 3h
  receiver: 'pagerduty-team'

receivers:
  - name: 'pagerduty-team'
    pagerduty_configs:
      - service_key: '<PAGERDUTY-INTEGRATION-KEY>'
        severity: '{{ .CommonLabels.severity }}'
        send_resolved: true

inhibit_rules:
  - source_match:
      severity: 'critical'
    target_match:
      severity: 'warning'
    equal: ['alertname']
```

---

## ✅ Testing the Flow

1. **Expose metrics** from your app like:
   - `http_requests_total{status="200"}`
   - Add `http_request_duration_seconds_bucket` if using latency

2. **Start Prometheus**:
```bash
./prometheus --config.file=prometheus.yml
```

3. **Start Alertmanager**:
```bash
./alertmanager --config.file=alertmanager.yml
```

4. **Trigger test alert**:
   - Send repeated 500 errors via `/checkout` endpoint

5. **Monitor**:
   - Prometheus: [http://localhost:9090](http://localhost:9090)
   - Alertmanager: [http://localhost:9093](http://localhost:9093)

---

## 📊 Grafana PromQL Expressions

**Availability SLI**:
```promql
sum(rate(http_requests_total{job="checkout-api", status=~"2.."}[5m]))
/
sum(rate(http_requests_total{job="checkout-api"}[5m]))
```

**Burn-rate**:
```promql
(
  sum(rate(http_requests_total{job="checkout-api", status!~"2.."}[5m]))
  /
  sum(rate(http_requests_total{job="checkout-api"}[5m]))
) / 0.0001
```

---

## 🔗 How Prometheus Connects to Alertmanager

Add this to `prometheus.yml` under `alerting:`:

```yaml
alerting:
  alertmanagers:
    - static_configs:
        - targets:
            - 'localhost:9093'
```

---

## 🧠 Behind the Scenes

1. Prometheus evaluates rules every 15s.
2. If alert expression is true for `for:` duration, it sends alert to Alertmanager.
3. Alertmanager routes it based on `alertmanager.yml`.
4. PagerDuty triggers incidents via webhook.

---

## 🔍 Common Mistakes & Fixes

| Mistake | Fix |
|--------|-----|
| Forgot `alerting:` block | Add the `alertmanagers:` section |
| Wrong Alertmanager address | Test with `curl http://localhost:9093/` |
| `rule_files:` missing | Add it to `prometheus.yml` |
| Alerts not firing | Ensure alert conditions actually met |

---

## ✅ TL;DR – Prometheus → Alertmanager → PagerDuty

Just make sure this is in `prometheus.yml`:

```yaml
alerting:
  alertmanagers:
    - static_configs:
        - targets: ['localhost:9093']
```