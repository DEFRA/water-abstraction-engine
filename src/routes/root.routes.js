import { index } from '../controllers/root.controller.js'

export default [
  {
    method: 'GET',
    options: {
      app: {
        plainOutput: true
      },
      auth: false,
      handler: index
    },
    path: '/'
  },
  {
    method: 'GET',
    options: {
      auth: false,
      handler: {
        file: 'src/public/static/robots.txt'
      }
    },
    path: '/robots.txt'
  },
  {
    method: 'GET',
    options: {
      app: {
        plainOutput: true
      },
      auth: false,
      handler: index
    },
    path: '/status'
  }
]
