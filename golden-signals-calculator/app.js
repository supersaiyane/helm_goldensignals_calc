const express = require('express');
const client = require('prom-client');

const app = express();
const port = 3000;

// Create Prometheus metrics
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 1.5, 2]
});

const httpRequestTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'code']
});

const httpRequestErrors = new client.Counter({
  name: 'http_request_errors_total',
  help: 'Total number of failed requests',
  labelNames: ['method', 'route', 'code']
});

const cpuGauge = new client.Gauge({
  name: 'cpu_usage_percent',
  help: 'Simulated CPU usage % (Saturation)'
});

setInterval(() => {
  const usage = Math.random() * 100;
  cpuGauge.set(usage);
}, 5000);

app.use((req, res, next) => {
  const start = process.hrtime();

  res.on('finish', () => {
    const durationInSeconds = getDurationInSeconds(start);
    httpRequestDurationMicroseconds
      .labels(req.method, req.path, res.statusCode)
      .observe(durationInSeconds);

    httpRequestTotal
      .labels(req.method, req.path, res.statusCode)
      .inc();

    if (res.statusCode >= 400) {
      httpRequestErrors
        .labels(req.method, req.path, res.statusCode)
        .inc();
    }
  });

  next();
});

function getDurationInSeconds(start) {
  const diff = process.hrtime(start);
  return diff[0] + diff[1] / 1e9;
}

app.get('/add', (req, res) => {
  const a = parseFloat(req.query.a);
  const b = parseFloat(req.query.b);
  res.send({ result: a + b });
});

app.get('/subtract', (req, res) => {
  const a = parseFloat(req.query.a);
  const b = parseFloat(req.query.b);
  res.send({ result: a - b });
});

app.get('/multiply', (req, res) => {
  const a = parseFloat(req.query.a);
  const b = parseFloat(req.query.b);
  res.send({ result: a * b });
});

app.get('/divide', (req, res) => {
  const a = parseFloat(req.query.a);
  const b = parseFloat(req.query.b);
  if (b === 0) {
    res.status(400).send({ error: 'Division by zero' });
  } else {
    res.send({ result: a / b });
  }
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

app.listen(port, () => {
  console.log(`Calculator app listening at http://localhost:${port}`);
});
