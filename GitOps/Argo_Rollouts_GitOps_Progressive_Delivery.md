# 🚀 GitOps Progressive Delivery with Argo Rollouts

This guide covers how to implement **progressive delivery strategies** such as **blue-green**, **canary**, and **automated promotion/rollback** using Argo Rollouts.

---

## 🎯 What is Argo Rollouts?

Argo Rollouts is a Kubernetes controller and set of CRDs that provides:

- Canary deployments
- Blue-green deployments
- Traffic shifting (Istio, ALB, NGINX)
- Automated analysis using metrics
- Promotion/rollback controls

---

## 🧱 Core CRDs

| CRD         | Purpose                                  |
|-------------|------------------------------------------|
| Rollout     | Replaces Deployment with advanced logic  |
| AnalysisTemplate | Defines success/failure metrics    |
| Experiment  | Optional test variation                  |
| Service     | Required for stable/preview traffic      |

---

## 🧰 GitOps Architecture with Argo CD + Argo Rollouts

```
Developer --> Git (main) --> Argo CD --> Argo Rollouts Controller
                                      ↳ Canary/Blue-Green Strategy
                                      ↳ Prometheus/Grafana Metrics
```

---

## 📦 Sample Canary Rollout Manifest

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: golden-signal-rollout
spec:
  replicas: 3
  strategy:
    canary:
      steps:
        - setWeight: 20
        - pause: { duration: 1m }
        - setWeight: 50
        - pause: { duration: 2m }
        - setWeight: 100
  selector:
    matchLabels:
      app: golden-signal
  template:
    metadata:
      labels:
        app: golden-signal
    spec:
      containers:
      - name: golden-signal
        image: golden-signal:{{ .Values.image.tag }}
        ports:
        - containerPort: 3000
```

---

## 🎯 AnalysisTemplate Example (Latency + Success)

```yaml
apiVersion: argoproj.io/v1alpha1
kind: AnalysisTemplate
metadata:
  name: golden-signal-check
spec:
  metrics:
    - name: http-success-rate
      interval: 1m
      successCondition: result > 99
      provider:
        prometheus:
          query: |
            sum(rate(http_requests_total{status=~"2.."}[1m])) / 
            sum(rate(http_requests_total[1m])) * 100

    - name: latency-p95
      interval: 1m
      successCondition: result < 500
      provider:
        prometheus:
          query: |
            histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[1m])) by (le))
```

---

## 📊 Dashboard

In Grafana, monitor:
- Current rollout weight
- Success rate / error rate
- Latency (P95)
- Argo Rollouts status

---

## 🔄 Rollback Logic

If analysis fails:
- Rollout automatically halts or reverts
- Developers notified via Slack / PagerDuty
- Manual override via Argo CD UI

---

## 📘 GitOps Flow

1. **Push** to Git (e.g., `main`)
2. Argo CD syncs rollout spec
3. Rollout controller triggers canary steps
4. Metrics evaluated at each step
5. Promote or rollback automatically

---

## ✅ Benefits

- Safe progressive rollouts
- Full Git-based history
- Built-in observability
- Compatible with ALB / Istio / NGINX

---

## 📦 Helm + GitOps Integration

Add to `values.yaml`:
```yaml
image:
  tag: v2
```

Argo CD will detect the change and sync the `Rollout`.

---

## 🔐 Best Practices

- Always use AnalysisTemplate for autosafe rollout
- Tag metrics with version
- Use Argo CD wave ordering (if monorepo)
- Version lock Rollout manifest schema

---

## 🧪 Optional Tools

- Flagger (for more mesh-native automation)
- Kustomize + Argo CD apps
- Codefresh or Tekton for pipeline pre-checks