const express = require('express');
const app = express();

app.get('/', (req, res) => {
  const delay = Math.random() > 0.7 ? 600 : 100; // Simulate latency spike
  setTimeout(() => res.send('Golden Signal App OK'), delay);
});

app.listen(3000, () => console.log('App running on port 3000'));