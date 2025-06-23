const express = require('express');
const app = express();

app.get('/', (req, res) => {
  const delay = Math.random() > 0.7 ? 800 : 150;
  const errorRate = Math.random() > 0.9;
  setTimeout(() => {
    if (errorRate) return res.status(500).send("Error!");
    res.send("Golden Signal Canary v2");
  }, delay);
});

app.listen(3000, () => console.log('App listening on port 3000'));