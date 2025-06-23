# Golden Signal Demo Project

This project is a full-stack demo to showcase the implementation of **Golden Signals**, **SLOs**, **Observability**, **CI/CD**, and **Incident Management** using modern SRE tools and practices.

---

## 🔍 What Are Golden Signals?

Golden Signals are four key metrics every service should monitor:

1. **Latency** – Time to serve requests
2. **Traffic** – Volume of requests
3. **Errors** – Failed requests (5xx/4xx)
4. **Saturation** – System usage nearing capacity (CPU, Memory, etc.)

This project instruments and visualizes all four.

---

## 🧱 Project Structure

```
golden-signal-demo/
├── server.js                  # Node.js app with Prometheus histogram metrics
├── package.json
├── prometheus.yml            # Scrape config for Prometheus
├── grafana-dashboard.json    # Grafana dashboard (Golden Signals)
├── Dockerfile
├── docker-compose.yml
├── k8s/                      # Kubernetes manifests
│   ├── deployment.yaml
│   ├── service.yaml
│   └── servicemonitor.yaml
├── terraform/                # Terraform Docker provisioning
│   └── main.tf
├── helm/                     # Helm chart
│   └── golden-signal-app/
│       ├── Chart.yaml
│       ├── values.yaml
│       └── templates/
│           ├── deployment.yaml
│           └── service.yaml
├── .github/workflows/        # GitHub Actions CI/CD
│   └── ci-cd.yml
├── prometheus-alerts/        # Prometheus SLO & alerting
│   ├── slo_rules.yml
│   ├── alertmanager.yml
│   └── postmortem-template.md
└── README.md
```

---

## 🚀 Getting Started

### 1. **Run Locally with Docker Compose**

```bash
docker-compose up --build
```

- App: http://localhost:8080/
- Metrics: http://localhost:8080/metrics
- Prometheus: http://localhost:9090/

---

### 2. **Prometheus + Grafana Setup**

- Add `prometheus.yml` as config
- Import `grafana-dashboard.json` into Grafana
- Metrics include:
  - `http_request_duration_seconds_bucket`
  - `http_requests_total`

---

### 3. **CI/CD Pipeline (GitHub Actions)**

- On push to `main`:
  - Lint and test app
  - Build Docker image
  - Placeholder for deploy stage

---

### 4. **Kubernetes Deployment**

```bash
kubectl apply -f k8s/
```

Includes:
- Deployment
- Service
- ServiceMonitor (Prometheus Operator)

---

### 5. **Helm Deployment**

```bash
helm install golden-signal-app ./helm/golden-signal-app
```

---

### 6. **SLO + Burn Rate Alerts**

Prometheus alert rule (14.4x burn rate):

```yaml
alert: HighErrorBudgetBurn
expr: (1 - (success / total)) > 0.001 * 14.4
for: 5m
```

View in: `prometheus-alerts/slo_rules.yml`

---

### 7. **Incident Management**

- Alertmanager integrated with PagerDuty: `alertmanager.yml`
- Use `postmortem-template.md` to document incidents

---

## 📈 Golden Signal Dashboard Panels

| Signal      | PromQL |
|-------------|--------|
| Latency (p95) | `histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))` |
| Traffic      | `sum(rate(http_requests_total[1m]))` |
| Errors       | `sum(rate(http_requests_total{status=~"5.."}[1m])) / sum(rate(http_requests_total[1m]))` |
| Saturation   | CPU & Memory usage from Node Exporter or K8s metrics |

---

## ✅ SRE Practices Demonstrated

- Golden Signal observability
- Prometheus & Grafana monitoring
- SLO + burn rate alerting
- Blameless postmortem framework
- Infrastructure as Code (Terraform, Helm)
- CI/CD pipeline automation
- Kubernetes deployment and ServiceMonitor
- Alert routing with Alertmanager + PagerDuty

---

## 📬 Contributions

Pull requests welcome. This is a learning tool — extend it with:
- OpenTelemetry
- Blackbox probes
- ArgoCD GitOps
- Multi-window burn rate alerts

---

## 🧠 Author

Built by ChatGPT + Gurpreet Singh to prepare for high-stakes SRE interviews and real-world architecture demos.

---

Happy Monitoring! 🚀
