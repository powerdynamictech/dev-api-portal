// made a proxy to avoid  CORS errors
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 3000;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, apikey');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);  
  }
  next();
});

app.use(
  '/secureid',
  createProxyMiddleware({
    target: 'https://api.secureid.ro',
    changeOrigin: true,
    pathRewrite: (path, req) => {
      return `/v1/user${path}`;
    },
    onProxyReq: (proxyReq, req, res) => {
      proxyReq.setHeader('apikey', 'YOUR KEY HERE');
    }
  })
);

app.listen(PORT, () => {
  console.log(`Proxy running at http://localhost:${PORT}`);
});


