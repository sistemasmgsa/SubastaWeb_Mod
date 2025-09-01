const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://api.apis.net.pe',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '', // remueve el prefijo /api
      },
    })
  );
};