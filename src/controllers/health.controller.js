/**
 * Controller for /health endpoints
 * @module HealthController
 */

import http2 from 'node:http2'

import CheckDatabaseDal from '../dal/health/check-database.dal.js'

const { HTTP_STATUS_OK } = http2.constants

export async function airbrake(request, _h) {
  // First section tests connecting to Airbrake through a manual notification
  request.server.app.airbrake.notify({
    message: 'Airbrake manual health check',
    error: new Error('Airbrake manual health check error'),
    session: {
      req: {
        id: request.info.id
      }
    }
  })

  // Second section throws an error and checks that we automatically capture it and then connect to Airbrake
  throw new Error('Airbrake automatic health check error')
}

export async function database(_request, h) {
  const result = await CheckDatabaseDal()

  return h.response(result).code(HTTP_STATUS_OK)
}
