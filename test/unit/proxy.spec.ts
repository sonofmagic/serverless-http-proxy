import { createProxy } from '../../src'
import axios from 'axios'
import type { AxiosResponse } from 'axios'
import * as cheerio from 'cheerio'
describe('normal proxy test', () => {
  describe('createInstance', () => {
    const app = createProxy({
      target: 'https://www.baidu.com',
      changeOrigin: true,
      onError(err, req, res) {
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
    afterAll(() => {
      server.close()
    })
  })
})
