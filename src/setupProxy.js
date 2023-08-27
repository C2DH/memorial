const { createProxyMiddleware } = require('http-proxy-middleware')
const fs = require('fs')
const target = import.meta.env.VITE_PROXY || 'http://localhost'
const apiPath = import.meta.env.VITE_API_ROOT || '/api'

fs.appendFile(
  './setupProxy.log',
  `${new Date().toISOString()} target:${target} apiPath:${apiPath}\n`,
  (err) => console.error(err),
)

module.exports = function (app) {
  app.use(
    apiPath,
    createProxyMiddleware({
      target,
      changeOrigin: true,
    }),
  )
  app.use(
    '/media',
    createProxyMiddleware({
      target,
      changeOrigin: true,
    }),
  )
}
