const express = require('express');
const client = require('prom-client');
const app = express();
const register = new client.Registry();

const loadTime = new client.Histogram({
  name: 'rum_page_load_seconds',
  help: 'Page load time in seconds from RUM data',
  buckets: [0.5, 1, 2, 3, 5, 10]
});
register.registerMetric(loadTime);

const errorCounter = new client.Counter({
  name: 'js_error_total',
  help: 'Total JS errors collected from users',
  labelNames: ['browser']
});
register.registerMetric(errorCounter);

// Simulate ingest from frontend
app.get('/rum', (req, res) => {
  const load = Math.random() * 5;
  const browser = req.query.browser || "chrome";
  loadTime.observe(load);

  if (Math.random() > 0.9) errorCounter.labels(browser).inc();

  res.send("RUM data received");
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.listen(8080, () => console.log("RUM Exporter running on 8080"));