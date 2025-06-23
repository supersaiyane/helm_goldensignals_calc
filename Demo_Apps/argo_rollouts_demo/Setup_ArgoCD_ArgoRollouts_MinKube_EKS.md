# 🚀 Setup: Argo Rollouts + GitOps on Minikube/EKS using Argo CD

---

## ✅ Prerequisites

| Tool              | Version         |
|-------------------|-----------------|
| Argo CD           | v2.8+           |
| Argo Rollouts     | v1.6+           |
| Prometheus        | Installed with metrics endpoint |
| Minikube or EKS   | Kubernetes cluster |
| GitHub Repository | Holds Helm chart and workflow |

---

## 🧱 Step 1: Install Argo CD

```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

Port forward UI:

```bash
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

Login:

```bash
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
```

---

## 📦 Step 2: Install Argo Rollouts Controller

```bash
kubectl create namespace argo-rollouts
kubectl apply -n argo-rollouts -f https://github.com/argoproj/argo-rollouts/releases/latest/download/install.yaml
```

Optional UI:

```bash
kubectl -n argo-rollouts port-forward svc/argo-rollouts-dashboard 3100:3100
```

---

## 🔁 Step 3: Deploy Prometheus (Optional if already present)

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/kube-prometheus-stack
```

Ensure it scrapes Istio or app metrics.

---

## 📘 Step 4: Create Argo CD App

```bash
kubectl apply -f - <<EOF
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: golden-signal-rollout
  namespace: argocd
spec:
  project: default
  source:
    repoURL: 'https://github.com/yourname/argo-rollouts-demo'
    targetRevision: HEAD
    path: charts
    helm:
      valueFiles:
        - values.yaml
  destination:
    server: https://kubernetes.default.svc
    namespace: default
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
EOF
```

---

## 🚦 Step 5: Watch Rollout in Action

```bash
kubectl argo rollouts get rollout golden-rollout
```

Or use Argo Rollouts dashboard at http://localhost:3100

---

## ✅ Step 6: Trigger a New Deployment

Update the `image.tag` value in your Helm chart (e.g., `v3`) and push the change. Argo CD will:

1. Sync the app
2. Apply the rollout YAML
3. Trigger a new canary deployment
4. Use Prometheus to analyze metrics
5. Promote or rollback automatically

---

## 🧪 Tips

- Use `AnalysisTemplate` to enforce success thresholds
- Use GitHub Actions to automate version bumps
- Add Slack notification hooks to alerts
- Run `kubectl argo rollouts dashboard` for UI

---