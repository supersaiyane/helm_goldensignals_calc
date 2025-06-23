# 📊 Real User Monitoring (RUM) SLO Burn Tracking Guide

---

## 🎯 What is RUM?

**Real User Monitoring (RUM)** collects performance data from actual users visiting your application. It focuses on metrics such as:

- Page Load Time
- First Contentful Paint (FCP)
- Time to Interactive (TTI)
- Cumulative Layout Shift (CLS)
- JavaScript errors

---

## 🧩 RUM vs Synthetic Monitoring

| Feature               | RUM                     | Synthetic Monitoring          |
|------------------------|------------------------|-------------------------------|
| Data Source            | Real user traffic       | Simulated agents or bots      |
| Metrics Collected      | Page performance, errors| Ping/HTTP uptime, response    |
| Granularity            | Region/device-specific  | Controlled/standardized       |
| Example Tools          | Datadog RUM, Sentry, New Relic RUM | Pingdom, Blackbox Exporter   |

---

## 🎯 Defining RUM-Based SLOs

| SLO Category     | SLI Example                           | Objective                     |
|------------------|----------------------------------------|-------------------------------|
| Page Load        | % of users with page load < 3s         | 95%                           |
| Errors           | JS error rate per session              | < 1%                          |
| Experience Index | % of users with CLS < 0.1              | 90%                           |
| Device/Geo       | % of users in EU with FCP < 2s         | 92%                           |

---

## 🔢 SLI Calculation for Page Load Time

Assuming you're collecting `page_load_time_seconds` from RUM:

```promql
100 * (
  count_over_time(rum_page_load_seconds_bucket{le="3"}[5m]) 
  /
  count_over_time(rum_page_load_seconds_count[5m])
)
```

---

## 🔥 What is SLO Burn Rate?

**Burn Rate** = Rate at which your system consumes its error budget.

If 95% of users should have page load < 3s, and today only 85% do, you're burning faster than normal.

---

## 📐 Burn Rate Thresholds

| Condition                       | Burn Rate x Budget | Alert Type      |
|----------------------------------|--------------------|-----------------|
| Slow burn (warning)             | 1x - 2x            | Ticket/Slack    |
| Medium burn (watch)             | 4x                 | On-call alert   |
| Fast burn (critical)            | 14x                | Page engineer   |

---

## 🧠 Alerting Rule Example (Datadog / Prometheus)

```yaml
- alert: HighPageLoadBurnRate
  expr: |
    (
      1 - (
        count_over_time(rum_page_load_seconds_bucket{le="3"}[5m])
        /
        count_over_time(rum_page_load_seconds_count[5m])
      )
    ) > 0.05
  for: 2m
  labels:
    severity: warning
  annotations:
    summary: "RUM SLO Burn - Page Load > 3s"
```

---

## 📊 Grafana Dashboard Panels

| Panel Title             | Query                                                    |
|--------------------------|----------------------------------------------------------|
| Page Load Histogram     | `histogram_quantile(0.95, rate(rum_page_load_seconds_bucket[5m]))` |
| Error Rate              | `sum(rate(js_error_total[5m])) by (browser)`             |
| Geo Heatmap             | `avg(page_load_time_seconds) by (country)`               |
| Device Class Comparison | `avg(load_time_seconds) by (device_type)`                |

---

## 🔄 Burn Down Budget Panel

- Show remaining minutes or % of budget
- Visualize current vs projected burn
- Show if 14x or 6x threshold is breached

---

## 🔁 Workflow

```
[Frontend RUM Agent] --> [Collector API] --> [Prometheus or Datadog]
                                                |
                    +---------------------------+------------------+
                    |                                              |
            [Grafana Dashboard]                           [Alert Rules]
                    |
           [Burn Rate Panel + SLO Compliance]
```

---

## ✅ Best Practices

- Split SLIs per device class (desktop, mobile)
- Aggregate SLIs across regions
- Include RUM in postmortem analysis
- Set different SLOs for core vs long-tail pages

---

## 🔧 Tools Supporting RUM SLO Burn

- **Datadog RUM + SLO**
- **New Relic RUM**
- **Prometheus + OpenTelemetry JS SDK**
- **Sentry + custom Prom exporters**

---