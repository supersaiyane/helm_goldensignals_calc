
# 🧩 UNIVERSAL YAML TEMPLATE STRUCTURE

This structure is common to all Kubernetes resources, and only the `spec:` part changes per resource type.

```yaml
apiVersion: <version>
kind: <resource type>
metadata:
  name: <resource-name>
  namespace: <optional>
  labels: <optional>
  annotations: <optional>
spec:
  # resource-specific configuration
```

---

## 📌 1. Pod Template

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: <pod-name>
  labels:
    app: <app-label>
spec:
  containers:
    - name: <container-name>
      image: <image-name>
      ports:
        - containerPort: <port>
      env:             # optional
        - name: ENV_NAME
          value: "value"
      volumeMounts:    # optional
        - name: <volume-name>
          mountPath: /path/in/container
  volumes:             # optional
    - name: <volume-name>
      emptyDir: {}     # or configMap, secret, PVC etc.
```

---

## 📌 2. Deployment Template

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: <deployment-name>
  labels:
    app: <app-name>
spec:
  replicas: <number>
  selector:
    matchLabels:
      app: <label>
  template:
    metadata:
      labels:
        app: <label>
    spec:
      containers:
        - name: <container-name>
          image: <image-name>
          ports:
            - containerPort: <port>
          readinessProbe:   # optional
            httpGet:
              path: /
              port: <port>
            initialDelaySeconds: 5
            periodSeconds: 10
          livenessProbe:    # optional
            httpGet:
              path: /
              port: <port>
            initialDelaySeconds: 15
            periodSeconds: 20
```

---

## 📌 3. Service Template

```yaml
apiVersion: v1
kind: Service
metadata:
  name: <service-name>
spec:
  type: ClusterIP | NodePort | LoadBalancer
  selector:
    app: <label>
  ports:
    - protocol: TCP
      port: <service-port>
      targetPort: <container-port>
```

---

## 📌 4. ConfigMap Template

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: <configmap-name>
data:
  ENV_KEY: value
  LOG_LEVEL: debug
```

---

## 📌 5. Secret Template

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: <secret-name>
type: Opaque
data:
  DB_PASSWORD: <base64-encoded-password>
```

Use this to encode:
```bash
echo -n "password" | base64
```

---

## 📌 6. PVC (PersistentVolumeClaim)

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: <pvc-name>
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: <e.g., 1Gi>
```

---

## 📌 7. Job / CronJob Template

### ✅ Job

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: <job-name>
spec:
  template:
    spec:
      containers:
        - name: job-container
          image: busybox
          command: ["echo", "hello from job"]
      restartPolicy: Never
```

### ✅ CronJob

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: <cronjob-name>
spec:
  schedule: "*/5 * * * *"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
            - name: cron-container
              image: busybox
              args: ["date"]
          restartPolicy: OnFailure
```

---

## 📌 8. HorizontalPodAutoscaler (HPA)

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: <hpa-name>
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: <deployment-name>
  minReplicas: 1
  maxReplicas: 5
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 50
```

---

## 🔁 Recommended YAML Writing Order (Common Pattern)

1. **Namespace**         – if you're using one  
2. **ConfigMap**         – configuration first  
3. **Secret**            – credentials, keys  
4. **PVC**               – if persistent storage is needed  
5. **Deployment**        – the core application  
6. **Service**           – expose your app  
7. **Ingress**           – for external routing (optional)  
8. **HPA / PDB**         – reliability and autoscaling  

---
