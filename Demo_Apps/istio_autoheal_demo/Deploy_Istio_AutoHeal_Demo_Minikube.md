# 🚀 Deploying istio_autoheal_demo on Minikube

---

## ✅ Prerequisites

| Tool              | Version         |
|-------------------|-----------------|
| Minikube          | v1.29+          |
| kubectl           | v1.26+          |
| istioctl          | v1.18+          |
| Prometheus        | bundled via Istio demo profile |
| Argo Workflows    | v3.x            |

---

## 🧱 Step 1: Start Minikube

```bash
minikube start --memory=6g --cpus=4
```

---

## 🧰 Step 2: Install Istio (Demo Profile)

```bash
istioctl install --set profile=demo -y
kubectl label namespace default istio-injection=enabled
```

---

## 📦 Step 3: Deploy the Demo App

Unzip the archive:

```bash
unzip istio_autoheal_demo.zip
```

Build and tag your app locally:

```bash
eval $(minikube docker-env)
docker build -t golden-signal:latest .
```

Apply the manifests:

```bash
kubectl apply -f deployment.yaml
kubectl apply -f virtual-service.yaml
kubectl apply -f destination-rule.yaml
```

---

## 🔭 Step 4: Access the App

```bash
kubectl port-forward svc/golden-signal 3000:3000
```

Open: [http://localhost:3000](http://localhost:3000)

---

## 📈 Step 5: Enable Metrics + Alerts

Istio demo profile ships with Prometheus. Verify:

```bash
kubectl port-forward -n istio-system svc/prometheus 9090:9090
```

Apply alert rules:

```bash
kubectl apply -f prometheus-alerts.yaml -n istio-system
```

> ⚠️ Ensure Prometheus is configured to load custom rule files.

---

## 🤖 Step 6: Install Argo Workflows

```bash
kubectl create namespace argo
kubectl apply -n argo -f https://github.com/argoproj/argo-workflows/releases/download/v3.4.4/install.yaml
```

Port-forward Argo UI:

```bash
kubectl -n argo port-forward svc/argo-server 2746:2746
```

Apply the workflow:

```bash
kubectl apply -f argo-workflow.yaml -n argo
```

---

## 🔄 Step 7: (Optional) Wire Alertmanager to Argo

Example receiver in `alertmanager.yaml`:

```yaml
receivers:
  - name: argo-trigger
    webhook_configs:
      - url: "http://argo-workflows.argo.svc:2746/api/v1/workflows/argo"
```

Trigger manually:

```bash
kubectl create -f argo-workflow.yaml -n argo
```

---

## ✅ Step 8: Validate Auto-Heal Flow

1. Continuously hit the app:

```bash
watch -n0.5 curl -s http://localhost:3000
```

2. Observe random latency spikes
3. When P95 latency > 500ms:
   - Prometheus alert fires
   - Argo restarts pod
   - Auto-heal confirmed!

---