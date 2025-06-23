const express = require('express');
const client = require('prom-client');
const app = express();
const register = new client.Registry();

const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 0.3, 0.5, 1, 2.5, 5, 10]
});

register.registerMetric(httpRequestDurationMicroseconds);
client.collectDefaultMetrics({ register });

app.get('/', (req, res) => {
  const end = httpRequestDurationMicroseconds.startTimer();
  setTimeout(() => {
    res.status(200).send('Hello World');
    end({ route: '/', code: 200, method: 'GET' });
  }, Math.random() * 1000);
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.listen(8080, () => console.log('Listening on :8080'));
