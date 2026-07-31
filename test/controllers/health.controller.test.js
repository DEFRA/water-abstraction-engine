// Test framework
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

// Test helpers
import http2 from 'node:http2'

import LoggerStub from '../support/stubs/logger.stub.js'

// Things we need to stub
import * as CheckDatabaseDal from '../../src/dal/health/check-database.dal.js'

// For running our service
import { init } from '../support/test-server.js'

const { HTTP_STATUS_INTERNAL_SERVER_ERROR, HTTP_STATUS_OK } = http2.constants

describe('Health Controller', () => {
  let airbrakeStub
  let server

  // Create server before running the tests
  beforeAll(async () => {
    server = await init()
  })

  beforeEach(async () => {
    // We silence any calls to server.logger made in the plugin to try and keep the test output as clean as possible
    LoggerStub(server.logger)

    // We need to stub Airbrake in these tests. But this also silences sending a notification to our Errbit instance
    // using Airbrake just like our other controller tests
    airbrakeStub = vi.spyOn(server.app.airbrake, 'notify').mockResolvedValue(undefined)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  afterAll(async () => {
    await server.stop()
  })

  describe('GET /health/airbrake', () => {
    const options = {
      method: 'GET',
      url: '/health/airbrake'
    }

    it('returns a 500 error', async () => {
      const response = await server.inject(options)

      expect(response.statusCode).toEqual(HTTP_STATUS_INTERNAL_SERVER_ERROR)
    })

    it('causes Airbrake to send a notification', async () => {
      await server.inject(options)

      expect(airbrakeStub).toHaveBeenCalled()
    })
  })

  describe('GET /health/database', () => {
    const options = {
      method: 'GET',
      url: '/health/database'
    }

    describe('when the request succeeds', () => {
      beforeEach(async () => {
        vi.spyOn(CheckDatabaseDal, 'default').mockResolvedValue()
      })

      it('returns stats about each table', async () => {
        const response = await server.inject(options)

        expect(response.statusCode).toEqual(HTTP_STATUS_OK)
      })
    })
  })
})
