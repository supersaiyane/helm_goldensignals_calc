# 🔁 Disaster Recovery Runbook — Region Failover Promotion

## 🧱 Purpose:
Promote the secondary region (eu-west-1) to active when the primary (us-east-1) is degraded or unavailable.

---

## ✅ Prerequisites

- Aurora Global DB with replica in eu-west-1
- Helm app charts available in both clusters
- S3 with Cross-Region Replication enabled
- Prometheus + Thanos for metrics visibility
- Route53 DNS health check for `/healthz` endpoint

---

## 🛠️ Manual DR Steps

### Step 1: Promote Aurora Replica

```bash
aws rds promote-read-replica-db-cluster   --db-cluster-identifier my-db-replica-eu-west-1
```

Wait until status is `available` and `writer`.

---

### Step 2: Redeploy App with Primary Settings

```bash
helm upgrade golden-signal golden-signal-chart/   -f values-eu-west-1.yaml   --set global.primary=true   --kube-context eu-west-1-context
```

---

### Step 3: Update Route53 Failover

```bash
aws route53 change-resource-record-sets --hosted-zone-id ZONEID --change-batch file://update-secondary.json
```

Use a JSON batch to point `example.com` to eu-west-1 LB.

---

### Step 4: Sync Monitoring and Alerts

- Change Prometheus label selector to `region="eu-west-1"`
- Confirm alerts route correctly
- Re-enable all external integrations (Slack, PagerDuty)

---

### Step 5: Notify Stakeholders

- Post message in incident Slack channel
- Open PagerDuty incident with tag `multi-region-dr`
- Send customer advisory if SLA is breached

---

## ⚠️ Rollback Plan

- Watch for recovery in us-east-1
- Demote eu-west-1 DB
- Repoint DNS to primary
- Re-run Helm with us-east-1 values