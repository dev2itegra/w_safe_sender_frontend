const express = require("express");
const cors = require("cors");
const http = require("http");

const app = express();
const port = 3009;

app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

app.get("/index.js", (req, res) => {
  const options = {
    hostname: "127.0.0.1",
    port: 3007,
    path: "/index.js",
    method: "GET",
    headers: {
      "Accept": "*/*",
    }
  };

  const proxyReq = http.request(options, (proxyRes) => {
    if (proxyRes.statusCode !== 200) {
      res.status(proxyRes.statusCode).send(`Failed to fetch index.js: ${proxyRes.statusCode}`);
      return;
    }

    res.setHeader("Content-Type", "application/javascript");
    proxyRes.pipe(res);
  });

  proxyReq.on("error", (err) => {
    console.error("Ошибка при запросе к webpack-dev-server:", err.message);
    res.status(500).send("Ошибка при получении index.js");
  });

  proxyReq.end();
});

app.listen(port, () => {
  console.log(`🚀 Express сервер работает на http://localhost:${port}`);
});
