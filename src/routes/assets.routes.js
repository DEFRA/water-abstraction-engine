/**
 * Routes that serve the static assets, including those provided by govuk-frontend
 *
 * @module AssetsRoutes
 */

import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'

// Resolve govuk-frontend relative to this file so it works regardless of npm hoisting
const _require = createRequire(import.meta.url)
const govukFrontendDir = dirname(_require.resolve('govuk-frontend/package.json'))

export default [
  {
    method: 'GET',
    path: '/assets/all.js',
    options: {
      handler: {
        // confine: false required — default confine: '.' blocks paths outside the consuming app's CWD (e.g. npm link)
        file: { confine: false, path: join(govukFrontendDir, 'govuk', 'all.js') }
      },
      app: {
        plainOutput: true
      },
      auth: false
    }
  },
  {
    method: 'GET',
    options: {
      app: {
        plainOutput: true
      },
      auth: false,
      handler: {
        directory: {
          path: [
            'src/public/static',
            'src/public/images',
            'src/public/build',
            join(govukFrontendDir, 'govuk', 'assets')
          ]
        }
      }
    },
    path: '/assets/{path*}'
  }
]
