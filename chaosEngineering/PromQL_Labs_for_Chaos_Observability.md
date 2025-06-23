# 📊 Custom PromQL Labs for Chaos Observability

These labs help you validate the **resilience** of your system under **chaos scenarios** using **Prometheus queries**.

---

## 🧪 Lab 1: Track Pod Deletion Events

**Goal:** Detect when chaos deletes a pod.

```promql
increase(kube_pod_container_status_terminated_reason{reason="Evicted"}[5m])
```

Use `container="chaos-runner"` to trace it to LitmusChaos execution.

---

## 🧪 Lab 2: Watch Latency Increase After Chaos

**Scenario:** Chaos introduces network delay or CPU hog.

```promql
histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))
```

- Watch for spike after chaos injection
- Correlate with time window of chaosengine run

---

## 🧪 Lab 3: Track Error Rate During Chaos

```promql
100 * (1 - (sum(rate(http_requests_total{status=~"2.."}[1m])) / sum(rate(http_requests_total[1m]))))
```

- Ideal for SLO burn alerts
- Use with service-specific labels (e.g., `job="checkout"`)

---

## 🧪 Lab 4: Burn Rate During Chaos Event

**Fast burn alert (14x error budget consumption):**

```promql
(
  sum(rate(http_requests_total{status!~"2.."}[1m])) /
  sum(rate(http_requests_total[1m]))
) > (1 - 0.999) * 14
```

Replace `0.999` with your SLO target.

---

## 🧪 Lab 5: Monitor Chaos Annotations and Labels

Use metric labels to tag chaos events:

```promql
kube_pod_labels{label_chaos="true"}
```

Filter dashboard panels by `label_chaos` to compare metrics in/around chaos runs.

---

## 🧪 Lab 6: DNS Failure Impact

```promql
sum(rate(dns_errors_total[5m])) by (service)
```

- Useful in blackhole scenarios
- Works with `node_exporter` or custom exporter metrics

---

## 🧪 Lab 7: CPU Stress or Pod Saturation

```promql
rate(container_cpu_usage_seconds_total{pod=~"cart-.*"}[5m])
```

- Track CPU exhaustion experiments
- Compare before/after chaos injection

---

## 📈 Visualization Tips

- Use **annotations** in Grafana for chaos start/end markers
- Tag alerts with `chaos=true` to isolate noisy tests
- Create chaos-specific dashboards for:
  - Latency histograms
  - Error budget graphs
  - SLO burn-down

---

## 📁 Bonus: LitmusChaos Status Metrics

```promql
litmuschaos_engine_experiment_verdict{chaosresult_verdict!="Pass"}
```

- Track failing chaos experiments
- Tie back to SLOs for auto remediation

---

Use these labs to **measure, observe, and react** during simulated failures!