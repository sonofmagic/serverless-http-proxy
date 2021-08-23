/* eslint-disable no-undef */
import { createProxy } from '../../src'
import axios from 'axios'
import type { AxiosResponse } from 'axios'
import * as cheerio from 'cheerio'

describe('normal proxy test', () => {
  describe('createInstance', () => {
    const app = createProxy({
      target: 'https://www.baidu.com',
      changeOrigin: true,
      onError (err, req, res) {
        res.writeHead(500, {
          'Content-Type': 'text/plain'
        })
        res.end(err.message)
      }
    })
    const port = 9000
    const server = app.listen(port)
    console.log(`proxy listen at ${port}`)
    test('get baidu', () => {
      return axios
        .get<any, AxiosResponse<string>>('http://localhost:9000/')
        .then((res) => {
          const isStr = typeof res.data === 'string'
          expect(isStr).toBe(true)
          if (isStr) {
            expect(res.data.includes('baidu')).toBe(true)
          }
        })
    })
    test('404', () => {
      return axios
        .get<any, AxiosResponse<string>>('http://localhost:9000/12345')
        .catch((err) => {
          expect(err.response.status).toBe(404)
        })
    })

    afterAll(() => {
      server.close()
    })
  })

  describe('createInstance with context', () => {
    const app = createProxy({
      target: 'https://www.baidu.com',
      changeOrigin: true,
      // context: '/baidu',
      path: '/baidu'
    })
    const server = app.listen(9001)
    test('get baidu', () => {
      return axios
        .get<any, AxiosResponse<string>>('http://localhost:9001/baidu')
        .then((res) => {
          const isStr = typeof res.data === 'string'
          expect(isStr).toBe(true)
          if (isStr) {
            expect(res.data.includes('baidu')).toBe(true)
          }
        })
    })

    test('404', () => {
      return axios
        .get<any, AxiosResponse<string>>('http://localhost:9001/bilibili')
        .catch((err) => {
          expect(err.response.status).toBe(404)
          expect(err.response.headers['x-powered-by']).toBe('Express')
        })
    })
    afterAll(() => {
      server.close()
    })
  })

  describe('multiple proxy', () => {
    const app = createProxy([
      {
        target: 'https://www.baidu.com',
        changeOrigin: true,
        // context: ['/bd', '/baidu'],
        path: '/baidu'
      },
      {
        target: 'https://www.zhihu.com',
        changeOrigin: true,
        // context: ['/zhihu'],
        path: '/zhihu'
      },
      {
        target: 'https://www.bilibili.com',
        changeOrigin: true,
        // context(pathname, req) {
        //   return /^\/bilibili/.test(req.path)
        // },
        path: ['/bilibili', '/bl']
      }
    ])

    const server = app.listen(9002)

    test('get baidu', () => {
      return axios
        .get<any, AxiosResponse<string>>('http://localhost:9002/baidu')
        .then((res) => {
          const isStr = typeof res.data === 'string'
          expect(isStr).toBe(true)
          if (isStr) {
            expect(res.data.includes('baidu')).toBe(true)
          }
        })
    })

    test('get zhihu from zhihu', () => {
      return axios
        .get<any, AxiosResponse<string>>('http://localhost:9002/zhihu')
        .then((res) => {
          const isStr = typeof res.data === 'string'
          expect(isStr).toBe(true)
          if (isStr) {
            expect(res.data.includes('知乎')).toBe(true)
          }
        })
    })

    test('get bilibili from bilibili', () => {
      return axios
        .get<any, AxiosResponse<string>>('http://localhost:9002/bilibili')
        .catch((err) => {
          expect(err.response.data.includes('Σ(oﾟдﾟoﾉ)')).toBe(true)
        })
    })

    test('get bilibili from bl', () => {
      return axios
        .get<any, AxiosResponse<string>>('http://localhost:9002/bl')
        .catch((err) => {
          expect(err.response.data.includes('Σ(oﾟдﾟoﾉ)')).toBe(true)
        })
    })

    afterAll(() => {
      server.close()
    })
  })
})
