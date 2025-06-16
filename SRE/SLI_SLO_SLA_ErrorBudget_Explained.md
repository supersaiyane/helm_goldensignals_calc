
# 📊 SLI, SLO, SLA & Error Budget – Complete Breakdown

## 🔹 What Is SLI, SLO, and SLA?

| Term | Definition | Layman Example |
|------|------------|----------------|
| **SLI (Service Level Indicator)** | A metric that measures the performance of a system | "Out of 1,000,000 API calls, 999,900 were successful" ⇒ SLI = 99.99% |
| **SLO (Service Level Objective)** | The internal reliability goal you want to meet | "We aim to keep success rate at **99.99%** every 30 days" |
| **SLA (Service Level Agreement)** | The external promise to customers, usually less strict than SLO | "We guarantee 99.9% uptime, else you get credits/refunds" |

---

## 🔹 What Are “Nines” (9s)?

| Nines | % Availability | Max Downtime / Month | Max Downtime / Year |
|-------|----------------|----------------------|----------------------|
| **99.9%** (3 nines) | 0.1% error budget | 43 min 49 sec | 8h 45m 57s |
| **99.99%** (4 nines) | 0.01% error budget | 4 min 23 sec | 52 min 35 sec |
| **99.999%** (5 nines) | 0.001% error budget | 26 sec | 5 min 15 sec |

### 🔸 Error Budget Formula

```
Error Budget = 1 - SLO
```

If SLO = 99.99% (0.9999):

```
Error Budget = 1 - 0.9999 = 0.0001 (0.01%)
```

In 30 days = 43,200 minutes:

```
Error time allowed = 0.0001 × 43200 = 4.32 minutes
```

---

## 🔹 Burn Rate

Burn rate tells you how **fast** you are using your error budget.

```
Burn Rate = (Actual Error Rate) / (Error Budget)
```

### 🔸 Google SRE Burn Rate Alerts

| Alert Type | Rule | Meaning |
|------------|------|---------|
| **Fast Burn** | Burn rate > 14 for 5 minutes | "You’ll run out of budget in 2 days" |
| **Slow Burn** | Burn rate > 6 for 1 hour | "You’ll run out in 5 days" |

---

## 🔹 PromQL Queries for SLO Burn Rate

Let’s say:

- Job = "checkout-api"
- SLO = 99.99%
- Error Budget = 0.0001

### 🔸 Fast Burn Rule (14x over 5 minutes)

```promql
(
  sum(rate(http_requests_total{job="checkout-api", status!~"2.."}[5m]))
  /
  sum(rate(http_requests_total{job="checkout-api"}[5m]))
) / 0.0001 > 14
```

### 🔸 Slow Burn Rule (6x over 1 hour)

```promql
(
  sum(rate(http_requests_total{job="checkout-api", status!~"2.."}[1h]))
  /
  sum(rate(http_requests_total{job="checkout-api"}[1h]))
) / 0.0001 > 6
```

### 🔸 Availability SLI

```promql
sum(rate(http_requests_total{job="checkout-api", status=~"2.."}[5m]))
/
sum(rate(http_requests_total{job="checkout-api"}[5m]))
```

---

## 🔹 Example Summary

> You want 99.99% success rate (SLO).  
> Your system emits an SLI of 99.985%.  
> This means you're doing well (SLO met), but watch the burn rate.  
> If the error rate ever reaches **14× the budget for 5 min**, page immediately.  
> If it's **6× for an hour**, create a ticket or alert ops.

---

## ✅ TL;DR

- **SLI** = Measured success % (what’s happening)
- **SLO** = Internal goal (what we want)
- **SLA** = External promise (what we commit)
- **Error Budget** = How much failure we can tolerate
- **Burn Rate** = How fast we’re spending it
