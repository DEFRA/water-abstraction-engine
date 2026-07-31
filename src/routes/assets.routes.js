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
        file: { path: join(govukFrontendDir, 'govuk', 'all.js'), confine: false }
      },
      app: {
        plainOutput: true
      },
      auth: false
    }
  },
  {
    method: 'GET',
    path: '/assets/{path*}',
    options: {
      handler: {
        directory: {
          path: [
            'src/public/static',
            'src/public/images',
            'src/public/build',
            join(govukFrontendDir, 'govuk', 'assets')
          ]
        }
      },
      app: {
        plainOutput: true
      },
      auth: false
    }
  }
]
