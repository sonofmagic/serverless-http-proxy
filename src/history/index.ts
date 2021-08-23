import express from 'express'
import history from 'connect-history-api-fallback'
import type { ProxyOptions } from '../types'
import { isProd, addProxyMiddleware } from '../util'
export default function (proxyOptions: ProxyOptions, staticFilePath: string) {
  const app = express()
  const staticFileMiddleware = express.static(staticFilePath)
  app.use(staticFileMiddleware)
  const historyMiddleware = history({
    disableDotRule: true,
    verbose: !isProd
  })
  addProxyMiddleware(app, proxyOptions)

  app.use(historyMiddleware)

  app.use(staticFileMiddleware)
  return app
}
