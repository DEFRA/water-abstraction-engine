/**
 * Routes for the health check endpoints
 *
 * @module HealthRoutes
 */

import { airbrake, database } from '../controllers/health.controller.js'

export default [
  {
    method: 'GET',
    options: {
      app: {
        plainOutput: true
      },
      auth: false,
      handler: airbrake
    },
    path: '/health/airbrake'
  },
  {
    method: 'GET',
    options: {
      app: {
        plainOutput: true
      },
      auth: false,
      handler: database
    },
    path: '/health/database'
  }
]
