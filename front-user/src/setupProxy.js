const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api', // Replace with the endpoint you want to proxy
    createProxyMiddleware({
      target: 'https://secure.clickpay.com.sa', // Replace with the ClickPay API URL
      changeOrigin: true,
    })
  );
};