const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/prompt",
    createProxyMiddleware({
      target: "http://localhost:1234/",
      changeOrigin: true,
    })
  );
  app.use(
    "/reset",
    createProxyMiddleware({
      target: "http://localhost:1234/",
      changeOrigin: true,
    })
  );
};
