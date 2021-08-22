import path from 'path'
import express from 'express'
import history from 'connect-history-api-fallback'
import { createProxyMiddleware } from 'http-proxy-middleware'
import type { Options, Filter } from 'http-proxy-middleware'
import { isProd } from '../util'
export default function (proxyOptions: Options, staticFilePath: string) {
  const app = express()

  const apiProxy = createProxyMiddleware(proxyOptions)
  const staticFileMiddleware = express.static(staticFilePath)
  app.use(staticFileMiddleware)
  const historyMiddleware = history({
    disableDotRule: true,
    verbose: !isProd
  })
  app.use((req, res, next) => {
    if (/^\/api/.test(req.path)) {
      apiProxy(req, res, next)
    } else {
      historyMiddleware(req, res, next)
    }
  })

  app.use(staticFileMiddleware)
  return app
}
