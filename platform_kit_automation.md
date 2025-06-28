# Platform Kit Automation — Interview Reference

## 1 · Design Principles
- **Opinionated, not restrictive** – sensible defaults (naming, tags, SLO thresholds) that teams can override via `values.yaml` or TF variables.  
- **Layered modules**  
  1. **Bootstrap** – VPC / IAM / cluster / Prometheus stack  
  2. **Service** – Helm chart, HPA, PDB, NetworkPolicy  
  3. **Ops** – SLO dashboards, Alertmanager routes, PagerDuty service  
- **Golden-path compliance** – every generated service ships with ✓ security baselines, ✓ observability, ✓ backup & DR hooks.

---

## 2 · Terraform Layer

| Feature | Highlights | Why It Matters |
|---------|------------|----------------|
| **EKS / GKE module** | Node groups, Karpenter, IRSA, encrypted PVC class | Cross-cloud depth + security |
| **PagerDuty provider** | Creates service, escalation, on-call schedule | Incident-management automation |
| **Thanos + S3 remote-write** | Long-term metric retention, toggle-able | Cost/perf trade-offs |
| **FinOps tag injection** | Cost-center, owner, TTL on every resource | Enables 30 % cloud-spend cut |

---

## 3 · Helm “service-chart”
- Templates: `Deployment`, `Service`, `HPA`, `ServiceMonitor`, `Ingress`, `Secret`, `ConfigMap`, `PDB`.
- **Auto-sidecars**: OpenTelemetry Collector + Fluent Bit wired to OTLP endpoint.
- **SLO annotations**: `slo.latency_threshold=300ms`; parsed by an SLO-controller CRD that emits PromQL burn-rate alerts.

---

## 4 · GitHub Actions Re-usable Workflow

```yaml
name: ci-cd
uses: org/platform-kit/.github/workflows/service.yml@v2
with:
  registry: ghcr.io/org
  kube-context: prod
  terraform-dir: infra
secrets: inherit
```

Stages: lint → unit-test → **Trivy scan** → build → push → **Helm-lint** → **TF plan** → ArgoCD sync  
Matrix builds pull language versions from `platform.toml`.  
Required checks: **codecov ≥ 80 %**, **0 HIGH vulns** in security scan.

---

## 5 · `platform-kit` CLI (Go + Cobra)

| Command | Action | Time Saved |
|---------|--------|-----------|
| `platform-init --service payments --language node` | Scaffolds `/app`, `/chart`, `/infra`, CI workflow | 2 days → **15 min** |
| `platform-plan` | `terraform plan` + Helm diff in temp cluster | Prevents prod surprises |
| `platform-slo add --latency 300 --availability 99.9` | Writes SLO YAML, pushes Grafana JSON, updates Alertmanager | 100 % consistency |

---

## 6 · Impact Metrics
- **120 + services onboarded** in nine months; new-service setup **2 weeks → 30 min**.  
- **MTTR down 35 %** after SLO-driven auto-rollbacks.  
- **92 % operational efficiency** across pipeline/run-book tasks.  
- **Zero critical drift** – all prod clusters pass weekly conformance scans.

---

## 7 · Story Arc (for live discussion)

1. **Problem** – Engineers spent days wiring logs, alerts, PagerDuty.  
2. **Solution** – Built opinionated TF/Helm modules + one-command CLI.  
3. **Challenges** – Multi-cloud nuances, backward compatibility, change management.  
4. **Outcome** – Metrics above; demoed live Grafana dashboards.  
5. **Next** – Add Policy-as-Code via OPA and ArgoCD image-updater for drift reconciliation.
