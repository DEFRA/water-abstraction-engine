// Test framework
import { beforeEach, describe, expect, it } from 'vitest'

import http2 from 'node:http2'

// Thing under test
import HapiPinoSerializersService from '../../../src/services/plugins/hapi-pino-serializers.service.js'

const { HTTP_STATUS_OK } = http2.constants

describe('Plugins - Hapi Pino Serializers Service', () => {
  describe('when called', () => {
    it('returns an object containing two functions called "req" and "res"', () => {
      const result = HapiPinoSerializersService()

      expect(result.req).toBeDefined()
      expect(result.res).toBeDefined()
    })

    describe('and the function "res" when provided with a pino serialized request object', () => {
      let requestObject

      beforeEach(() => {
        requestObject = {
          headers: {
            accept:
              'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-GB,en;q=0.9,en-US;q=0.8',
            'cache-control': 'max-age=0',
            connection: 'keep-alive',
            cookie: 'imagine_a_long_string_made_up_of_a_mish_mash_of_letters_and_numbers_because_it_is_encrypted',
            host: 'localhost:8013',
            referer: 'http://localhost:8008/system/bill-runs/a13ad1c9-331d-4ceb-9b61-cbd411a79e7b/cancel',
            'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132", "Google Chrome";v="132"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': 'macOS',
            'sec-fetch-dest': 'document',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-user': '?1',
            'upgrade-insecure-requests': '1',
            'user-agent':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36',
            'x-forwarded-for': '172.18.0.1',
            'x-forwarded-host': 'localhost:8008',
            'x-forwarded-port': '60884',
            'x-forwarded-proto': 'http'
          },
          id: '1737736750350:9bc56d13c48b:618:m6azkwqb:10004',
          method: 'get',
          query: {},
          remoteAddress: '127.0.0.1',
          remotePort: 51170,
          url: '/bill-runs'
        }
      })

      it('returns version containing only the key properties we care about', () => {
        const { req } = HapiPinoSerializersService()

        expect(req(requestObject)).toEqual({
          id: '1737736750350:9bc56d13c48b:618:m6azkwqb:10004',
          method: 'get',
          query: {},
          url: '/bill-runs'
        })
      })
    })

    describe('and the function "res" when provided with a pino serialized request object', () => {
      let responseObject

      beforeEach(() => {
        responseObject = {
          headers: {
            'cache-control': 'no-cache',
            'content-encoding': 'gzip',
            'content-type': 'text/html; charset=utf-8',
            'set-cookie': [
              'wrlsCrumb=qLVnKWrMY3HUAgrqg5tDOM_QL12lmcft2e3Ytq0kp9y; Secure; HttpOnly; SameSite=Strict; Path=/'
            ],
            'strict-transport-security': 'max-age=15768000',
            vary: 'accept-encoding',
            'x-content-type-options': 'nosniff',
            'x-download-options': 'noopen',
            'x-frame-options': 'DENY',
            'x-xss-protection': '0'
          },
          statusCode: HTTP_STATUS_OK
        }
      })

      it('returns version containing only the key properties we care about', () => {
        const { res } = HapiPinoSerializersService()

        expect(res(responseObject)).toEqual({
          statusCode: HTTP_STATUS_OK
        })
      })
    })
  })
})
