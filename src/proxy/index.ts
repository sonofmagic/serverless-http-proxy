import express from 'express'
import cors from 'cors'
import { addProxyMiddleware } from '../util'
import type { ProxyOptions } from '../types'
import type { CorsOptions } from 'cors'

export default function (
  proxyOptions: ProxyOptions,
  corsOptions?: CorsOptions
) {
  const app = express()
  if (corsOptions) {
    app.use(cors(corsOptions))
  }
  return addProxyMiddleware(app, proxyOptions)
}
