import express from 'express'
import type { IRoute } from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'
import cors from 'cors'
import type { Options, Filter } from 'http-proxy-middleware'
import type { CorsOptions } from 'cors'
export default function (
  proxyOptions: Options & { context?: Filter },
  corsOptions?: CorsOptions
) {
  const app = express()
  if (corsOptions) {
    app.use(cors(corsOptions))
  }
  app.use('/', createProxyMiddleware(proxyOptions))
  return app
}
