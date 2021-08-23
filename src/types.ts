import type { Options, Filter } from 'http-proxy-middleware'
import type { RequestHandler } from 'express'

export type ProxyOption = Options & {
  context?: Filter
  path?: string | string[]
}

export type ProxyOptions = ProxyOption | ProxyOption[]

export type MiddlewareWrapper = {
  middleware: RequestHandler
  path: string | string[]
}
