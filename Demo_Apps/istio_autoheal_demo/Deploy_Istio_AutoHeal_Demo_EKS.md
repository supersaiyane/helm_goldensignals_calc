# 🚀 Deploying istio_autoheal_demo on AWS EKS with ALB + ACM + Route 53

This guide builds on the Minikube setup and walks you through deploying the auto-healing demo on **EKS**, with production-grade networking:

---

## ✅ Prerequisites

| Tool              | Version         |
|-------------------|-----------------|
| AWS CLI           | Configured with IAM credentials |
| eksctl            | v0.140+         |
| kubectl           | v1.26+          |
| istioctl          | v1.18+          |
| Helm              | v3.11+          |
| AWS Load Balancer Controller | Installed on EKS cluster |
| ACM               | Certificate for your domain |
| Route53           | Hosted zone for domain mapping |

---

## 🧱 Step 1: Create EKS Cluster

```bash
eksctl create cluster --name golden-signal   --region us-east-1   --nodes 2 --node-type t3.medium   --with-oidc --managed
```

---

## 📦 Step 2: Deploy Istio on EKS

```bash
istioctl install --set profile=demo -y
kubectl label namespace default istio-injection=enabled
```

Verify:

```bash
kubectl get svc -n istio-system
```

---

## 🌐 Step 3: Set Up Ingress with ALB + ACM

### 1. Install AWS Load Balancer Controller

Follow official guide: https://docs.aws.amazon.com/eks/latest/userguide/aws-load-balancer-controller.html

### 2. Annotate ingress gateway for ALB

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: golden-ingress
  annotations:
    kubernetes.io/ingress.class: alb
    alb.ingress.kubernetes.io/scheme: internet-facing
    alb.ingress.kubernetes.io/listen-ports: '[{"HTTPS": 443}]'
    alb.ingress.kubernetes.io/certificate-arn: arn:aws:acm:REGION:ACCOUNT:certificate/ID
    external-dns.alpha.kubernetes.io/hostname: app.example.com
spec:
  rules:
    - host: app.example.com
      http:
        paths:
        - path: /
          pathType: Prefix
          backend:
            service:
              name: golden-signal
              port:
                number: 3000
```

Apply with:

```bash
kubectl apply -f ingress.yaml
```

---

## 🌍 Step 4: Connect to Route 53

- Make sure you have a hosted zone for `example.com`
- Create a CNAME pointing `app.example.com` to the ALB DNS name

---

## 🧪 Step 5: Build and Push Docker Image to ECR

```bash
aws ecr create-repository --repository-name golden-signal
docker tag golden-signal:latest <account>.dkr.ecr.<region>.amazonaws.com/golden-signal
aws ecr get-login-password | docker login --username AWS --password-stdin <account>.dkr.ecr.<region>.amazonaws.com
docker push <account>.dkr.ecr.<region>.amazonaws.com/golden-signal
```

Update the deployment with the full ECR image URL.

---

## 📈 Step 6: Enable Prometheus, Argo Workflows, and Alerts

Use Helm to install:

```bash
helm install prometheus prometheus-community/kube-prometheus-stack
helm install argo argo/argo-workflows -n argo --create-namespace
```

Apply:

```bash
kubectl apply -f argo-workflow.yaml -n argo
kubectl apply -f prometheus-alerts.yaml
```

---

## 🔁 Step 7: Test Auto-Healing in EKS

1. Curl the endpoint `https://app.example.com`
2. Induce latency spike in app
3. Watch alerts in Prometheus
4. Argo triggers rollout restart via webhook

---

## ✅ Best Practices

- Use HTTPS with ACM always
- Tag Route53 entries with service name
- Run chaos drills via Litmus + Argo
- Store configs in GitOps repo (ArgoCD)