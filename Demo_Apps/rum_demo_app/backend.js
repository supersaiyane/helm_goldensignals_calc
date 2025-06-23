const express = require('express');
const promClient = require('prom-client');

const app = express();
const register = new promClient.Registry();

const httpRequestDurationMicroseconds = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 0.3, 0.5, 0.75, 1, 1.5, 2, 5],
});

register.registerMetric(httpRequestDurationMicroseconds);
promClient.collectDefaultMetrics({ register });

app.use((req, res, next) => {
  const end = httpRequestDurationMicroseconds.startTimer();
  res.on('finish', () => {
    end({ method: req.method, route: req.url, code: res.statusCode });
  });
  next();
});

app.get('/', (req, res) => res.send('Golden Signal Calculator API Running!'));
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});