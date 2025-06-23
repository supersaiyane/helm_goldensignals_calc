# Extended Error Budget Policies & Alerts

Below is a comprehensive guide on burn-rate thresholds, early warnings, and operational policies to protect your error budget—especially when you have days left to fix issues.

---

## 1. Extending Beyond 14× and 6×

The classic **14×/5 m** and **6×/1 h** thresholds cover only two tiers. To catch problems earlier and in more granularity, add additional burn-rate tiers:

| Tier       | Burn-rate threshold | Window | Action                                              |
|------------|---------------------|--------|-----------------------------------------------------|
| **Warn**   | > 2×                | 6 h    | Slack-level warning: investigate slow drift         |
| **Advise** | > 4×                | 1 h    | Pager-lite (ticket): assign troubleshooter          |
| **Ticket** | > 6×                | 30 m   | Pager P2: sustained degradation                     |
| **Page**   | > 10×               | 10 m   | Pager P1: fast burn                                 |
| **Page+**  | > 14×               | 5 m    | Pager P0: emergency—throttle or roll back           |

> **Why these thresholds?**
> - **2×/6 h** catches very slow drifts before they become major issues.  
> - **4×/1 h** gives time to assign a dedicated responder.  
> - **10×/10 m** sits between slow (6×) and fast (14×) burn rates.

### Example PromQL for the “Warn” tier
```promql
(
  sum(rate(http_requests_total{status!~"2.."}[6h]))
  /
  sum(rate(http_requests_total[6h]))
)
/
(1 - 0.999)
> 2
```

---

## 2. Ensuring You Don’t “Sneak Past” Your Budget

1. **Multi-tier alerts**  
   - Add a tier at **> 1× over 24 h** (“info”) to log when you first start edging past budget.

2. **Dashboards**  
   - Plot burn_rate at 24 h, 6 h, 1 h, 10 m, and 5 m sliding windows to visualize consumption curves.

3. **Automated actions**  
   - At the Warn tier, trigger scripts that tag incidents, attach runbooks, or auto-scale capacity.

---

## 3. Error-Budget Policy Framework

Define a policy mapping **percentage of budget used** to **required action**.  
Assuming a **4-day (96 h)** total budget:

| % of Budget Used     | Burn-rate tier hit     | Mandatory Response                                       |
|----------------------|------------------------|----------------------------------------------------------|
| **20% (~19 h)**      | Warn (2×/6 h)          | Post update in Slack; assign on-call to investigate      |
| **50% (~48 h)**      | Advise (4×/1 h)        | Open priority ticket; pause non-critical releases        |
| **75% (~72 h)**      | Ticket (6×/30 m)       | Escalate to engineering manager; degrade non-essential features |
| **90% (~86 h)**      | Page (10×/10 m)        | All-hands incident call; engage support teams            |
| **100% (96 h)**      | Page+ (14×/5 m)        | Emergency: throttle traffic, roll back, or initiate full DR plan |

---

## 4. If Your System Is Down & You Have 4 Days of Budget Left

1. **Immediate Triage**  
   - Fastest alert (14×/5 m) pages you—launch incident command, stand up war room.

2. **Traffic Shaping**  
   - Use feature flags or circuit breakers to reduce traffic to failing components.

3. **Back-off & Retry Policies**  
   - Implement exponential back-off in client libraries to avoid hammering endpoints.

4. **Release Freeze**  
   - Halt all non-essential deployments until under 50% budget consumption.

5. **Reliability Sprint**  
   - Form a dedicated team to focus solely on root‑cause fixes and performance optimizations.

6. **Stakeholder Communication**  
   - Update SLAs, notify customers of potential SLO misses, and set expectations.

7. **Post‑mortem & Learnings**  
   - Once stabilized, conduct a blameless post-mortem and refine thresholds & runbooks.

---

## 5. Example Combined Alertmanager Snippet
```yaml
groups:
- name: SLO.BurnRateExtended
  rules:

  # Warn: early warning (info)
  - alert: ErrorBudgetWarn
    expr: |
      (
        sum(rate(http_requests_total{status!~"2.."}[6h]))
        /
        sum(rate(http_requests_total[6h]))
      )
      /
      (1 - 0.999) > 2
    for: 0m
    labels:
      severity: info
    annotations:
      summary: "[WARN] burn_rate >2× over 6h"

  # Advise: lightweight ticket
  - alert: ErrorBudgetAdvise
    expr: |
      (
        sum(rate(http_requests_total{status!~"2.."}[1h]))
        /
        sum(rate(http_requests_total[1h]))
      )
      /
      (1 - 0.999) > 4
    for: 0m
    labels:
      severity: ticket
    annotations:
      summary: "[ADVISE] burn_rate >4× over 1h"

  # Slow-burn P2
  - alert: ErrorBudgetSlowBurn
    expr: |
      (
        sum(rate(http_requests_total{status!~"2.."}[30m]))
        /
        sum(rate(http_requests_total[30m]))
      )
      /
      (1 - 0.999) > 6
    for: 0m
    labels:
      severity: ticket
    annotations:
      summary: "[TICKET] burn_rate >6× over 30m"

  # Fast-burn P1
  - alert: ErrorBudgetFastBurn
    expr: |
      (
        sum(rate(http_requests_total{status!~"2.."}[10m]))
        /
        sum(rate(http_requests_total[10m]))
      )
      /
      (1 - 0.999) > 10
    for: 0m
    labels:
      severity: page
    annotations:
      summary: "[PAGE] burn_rate >10× over 10m"

  # Emergency P0
  - alert: ErrorBudgetEmergency
    expr: |
      (
        sum(rate(http_requests_total{status!~"2.."}[5m]))
        /
        sum(rate(http_requests_total[5m]))
      )
      /
      (1 - 0.999) > 14
    for: 0m
    labels:
      severity: critical
    annotations:
      summary: "[EMERGENCY] burn_rate >14× over 5m"
```

---

## Takeaways

1. **Multi-tier thresholds** (2×, 4×, 6×, 10×, 14×) give early to emergency warnings.  
2. **Policy mapping** ties % budget used to concrete operational actions.  
3. **Rapid response** protocols (triage, traffic shaping, freezes, sprints) preserve budget and stability.  
4. **Blameless post-mortems** close the loop and improve future readiness.
