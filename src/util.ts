import { createProxyMiddleware } from 'http-proxy-middleware'
import type { ProxyOption, ProxyOptions, MiddlewareWrapper } from './types'
import type { Express } from 'express'

export const isProd = process.env.NODE_ENV === 'production'
export function omit<T, K extends keyof T> (
  obj: T,
  fields: Array<K>
): Omit<T, K> {
  // eslint-disable-next-line prefer-object-spread
  const shallowCopy = Object.assign({}, obj)
  for (let i = 0; i < fields.length; i += 1) {
    const key = fields[i]
    delete shallowCopy[key]
  }
  return shallowCopy
}

export function getProxyMiddleware (opt: ProxyOption): MiddlewareWrapper {
  let middleware
  if (opt.context === undefined) {
    middleware = createProxyMiddleware(omit(opt, ['path']))
  } else {
    middleware = createProxyMiddleware(
      opt.context,
      omit(opt, ['context', 'path'])
    )
  }
  return {
    middleware,
    path: opt.path || '/'
  }
}

export function handleMultiplePaths (
  app: Express,
  middlewareWrapper: MiddlewareWrapper
) {
  const { middleware, path } = middlewareWrapper
  if (Array.isArray(path)) {
    path.forEach((p) => {
      app.use(p, middleware)
    })
  } else {
    app.use(path, middleware)
  }
  return app
}

export function addProxyMiddleware (app: Express, proxyOptions: ProxyOptions) {
  if (Array.isArray(proxyOptions)) {
    proxyOptions.forEach((opt) => {
      handleMultiplePaths(app, getProxyMiddleware(opt))
    })
  } else {
    handleMultiplePaths(app, getProxyMiddleware(proxyOptions))
  }
  return app
}
