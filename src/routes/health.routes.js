import { airbrake, database } from '../controllers/health.controller.js'

export default [
  {
    method: 'GET',
    path: '/health/airbrake',
    options: {
      handler: airbrake,
      app: {
        plainOutput: true
      },
      auth: false
    }
  },
  {
    method: 'GET',
    path: '/health/database',
    options: {
      handler: database,
      app: {
        plainOutput: true
      },
      auth: false
    }
  }
]
