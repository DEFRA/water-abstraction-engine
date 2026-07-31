// Test framework
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

// Test helpers
import http2 from 'node:http2'

import LoggerStub from '../support/stubs/logger.stub.js'

// For running our service
import { init } from '../support/test-server.js'

const { HTTP_STATUS_OK } = http2.constants

describe('Root Controller', () => {
  let server

  // Create server before running the tests
  beforeAll(async () => {
    server = await init()
  })

  beforeEach(async () => {
    // We silence any calls to server.logger made in the plugin to try and keep the test output as clean as possible
    LoggerStub(server.logger)

    // We silence sending a notification to our Errbit instance using Airbrake
    vi.spyOn(server.app.airbrake, 'notify').mockResolvedValue(undefined)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  afterAll(async () => {
    await server.stop()
  })

  describe('GET /', () => {
    it('displays the correct message', async () => {
      const options = {
        method: 'GET',
        url: '/'
      }

      const response = await server.inject(options)
      const payload = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(HTTP_STATUS_OK)
      expect(payload.status).toEqual('alive')
    })
  })
})
