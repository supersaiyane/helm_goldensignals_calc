# 🧭 Chaos Engineering Architecture Diagram (Markdown)

## 📐 Visual Representation of Chaos Setup on Kubernetes (EKS)

```text
                         +------------------------------+
                         |     SRE/Operator Dashboard   |
                         |     (Grafana + Prometheus)  |
                         +------------------------------+
                                      ↑
                         Alerting     |     Metrics
                      +-------------->●<---------------------+
                      |               |                      |
                      |         +-----▼------+               |
                      |         | Prometheus |               |
                      |         +------------+               |
                      |                                      |
          +-----------+------------+             +-----------+------------+
          |                        |             |                        |
+-------------------+   Inject    |     +-------------------+   Inject    |
| LitmusChaos CRDs  |─────────────┘     | Chaos Controller  |────────────┘
+-------------------+                   +-------------------+
         │                                          │
         ▼                                          ▼
+-------------------+                     +-----------------------+
| Target App (Pod)  |                     | Target App (Service)  |
| Namespace: team-a |                     | Namespace: team-b     |
+-------------------+                     +-----------------------+

                  ⇅                                      ⇅
         Pod Delete, Delay,                        DNS Blackhole, CPU Hog

        Observed via Logs + Metrics and SLOs
```

---

## 🧩 Components

| Component         | Description                                           |
|------------------|-------------------------------------------------------|
| LitmusChaos       | Injects failures via CRDs and ChaosEngine            |
| Target App        | Microservices deployed in different namespaces       |
| Prometheus        | Scrapes golden signal metrics (latency, errors)      |
| Grafana           | Visualizes impact, error budget, burn rate           |
| Alertmanager      | Sends alerts on SLA/SLO violations                   |

---

Use this architecture to explain:
- Scoped chaos testing by namespace
- Real-time monitoring and rollback
- CI/CD-injected chaos for every release