# Error Budget in SRE: Definition, Measurement & Alerting

## 1. What Is an Error Budget?
An **error budget** is the allowance for unreliability you’re willing to tolerate in a given measurement period. It’s defined by your SLO:
- **SLO** = target reliability (e.g., 99.9% successful requests)  
- **Error budget ratio** = 1 − SLO (e.g., 0.1% = 0.001)  
- **Measurement period** = how long you evaluate the SLO (e.g., 30 days, 1 week)

A 99.9% SLO over 30 days ⇒ error budget of 0.1% of 30 days = 43.2 minutes of allowed “badness.”

## 2. Measuring Error‐Budget Consumption with PromQL
Define a measurement window `W` (e.g., `5m`, `1h`, `30d`).  
```promql
# SLI: ratio of successful (2xx) requests over window W
sum(rate(http_requests_total{status=~"2.."}[W]))
/
sum(rate(http_requests_total[W]))

# Error‐budget consumed as a ratio over W
1 -
(
  sum(rate(http_requests_total{status=~"2.."}[W]))
  /
  sum(rate(http_requests_total[W]))
)
```
Or equivalently:
```promql
sum(rate(http_requests_total{status!~"2.."}[W])) 
/
sum(rate(http_requests_total[W]))
```

## 3. Burn Rate: Definition & Formula
The **burn rate** tells you how fast you’re consuming error budget relative to the allowed pace:
\`\`\`
burn_rate(W) = error_ratio(W) / error_budget_ratio
\`\`\`
For an SLO of 0.999 (error_budget = 0.001):
```promql
(
  sum(rate(http_requests_total{status!~"2.."}[W]))
  /
  sum(rate(http_requests_total[W]))
)
/
(1 - 0.999)
```
- **burn_rate = 1** ⇒ consuming at exactly budget pace  
- **burn_rate > 1** ⇒ consuming faster than budget  
- **burn_rate < 1** ⇒ under budget

## 4. “14×” and “6×” Thresholds
Google SRE practice recommends two burn‐rate alert thresholds:

| Severity        | Burn‐rate threshold | Window        | Purpose                                           |
|-----------------|---------------------|---------------|---------------------------------------------------|
| **Page (P1)**   | > 14                | 5 minutes     | Detect sudden spikes—eats budget 14× faster       |
| **Ticket (P2)** | > 6                 | 1 hour        | Detect sustained high error rate                  |

- **14× over 5m**: alerts if you’d exhaust your error budget in ~5m/14 of the SLO period.  
- **6× over 1h**: alerts for slower but persistent burns.

## 5. Example Alertmanager Rules
```yaml
groups:
- name: SLO.BurnRate
  rules:
  # 1) Fast-burn page alert
  - alert: ErrorBudgetFastBurn
    expr: |
      (
        sum(rate(http_requests_total{status!~"2.."}[5m]))
        /
        sum(rate(http_requests_total[5m]))
      )
      /
      (1 - 0.999)
      > 14
    for: 0m
    labels:
      severity: page
    annotations:
      summary: "🔥 Error budget burn_rate >14× over 5m for {{ $labels.job }}"

  # 2) Slow-burn ticket alert
  - alert: ErrorBudgetSlowBurn
    expr: |
      (
        sum(rate(http_requests_total{status!~"2.."}[1h]))
        /
        sum(rate(http_requests_total[1h]))
      )
      /
      (1 - 0.999)
      > 6
    for: 0m
    labels:
      severity: ticket
    annotations:
      summary: "⚠️ Error budget burn_rate >6× over 1h for {{ $labels.job }}"
```

## 6. Applying to a 2-Hour Error Budget
If your total error budget (for the full SLO period) is **2 hours**:
- **14×** ⇒ consumes 2h ÷ 14 ≈ **8.6 minutes** of budget in a 5m window (fast‑burn).  
- **6×** ⇒ consumes 2h ÷ 6 ≈ **20 minutes** of budget in a 1h window (slow‑burn).  
These thresholds alert you well before the budget fully depletes.

## 7. Corner Cases & Best Practices
1. **Window vs. SLO period**  
   - Don’t select `W` longer than your measurement period.  
2. **Low traffic volumes**  
   - At very low rates, error_ratio can spike due to small sample sizes.  
   - Mitigate with a minimum request threshold, e.g.:  
     ```promql
     sum(rate(http_requests_total[5m])) > 10
     ```
3. **Missing data / scrape gaps**  
   - Use `absent()` or `unless` to avoid false alerts when metrics drop.  
4. **Sliding vs. calendar windows**  
   - PromQL’s `rate()` uses sliding windows—continuous evaluation rather than fixed calendar buckets.  
5. **Alert noise & flapping**  
   - Leverage `for:` to require sustained violation for slower-burn alerts.  
   - Combine immediate page alerts (no `for`) with `for: 10m` on lower-severity rules.

## 8. Measuring & Reporting
- **Dashboards**  
  - Plot rolling burn_rate over 5m, 1h, and the full SLO window.  
  - Show cumulative error_budget_consumed vs. allowed budget.  
- **Post‐incident analysis**  
  - Compute total budget used over period (e.g., 30d):
    ```promql
    sum(increase(http_requests_total{status!~"2.."}[30d]))
    /
    sum(increase(http_requests_total[30d]))
    ```
    Then divide by `(1 - SLO)` to get total burn_rate.

## 9. Summary
1. **Error budget** = allowed unreliability (1 − SLO).  
2. **Burn rate** = consumption speed vs. allowance.  
3. **14× (5m)** catches sudden spikes; **6× (1h)** catches sustained burns.  
4. **PromQL**: error_ratio / error_budget_ratio.  
5. **For a 2h budget**, alerts trigger at ~8.6m and ~20m of burn—providing early warnings.

Use these patterns to set up robust alerts, maintain visibility, and ensure you never unknowingly exhaust your error budget in production.
