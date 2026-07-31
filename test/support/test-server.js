import BaseServer from '../../src/base-server.js'

/**
 * Initialises the Hapi server without starting it
 *
 * > For test purposes only. Mimics what one of the apps would do
 *
 * @returns {Promise<object>} The initialised Hapi server instance
 */
export async function init() {
  const viewsConfig = _viewsConfig()

  const server = await BaseServer(viewsConfig, _authService)

  await server.initialize()

  return server
}

/**
 * Starts the Hapi server and begins accepting connections
 *
 * > For test purposes only. Mimics what one of the apps would do
 *
 * @returns {Promise<object>} The running Hapi server instance
 */
export async function start() {
  const server = await init()

  await server.start()

  return server
}

process.on('unhandledRejection', (err) => {
  console.error(err)
  process.exit(1)
})

function _authService(_request, _session) {
  return { isValid: true, credentials: {} }
}

/**
 * The Hapi vision plugin is registered and managed by water-abstraction-engine to avoid duplication. It also means we
 * can add the govuk frontend and Nunjucks just once to the engine.
 *
 * But the apps need control over the views, so they can be tailored for their different needs. This means the apps need
 * to tell the engine what config Vision should use. This essentially comes down to telling Vision, and Nunjucks where
 * to find stuff. For that to happen we need to dynamically resolve the path to the views directory relative to this at
 * run time.
 *
 * This is why the config is generated and passed through at runtime.
 *
 * @private
 */
function _viewsConfig() {
  return {
    // Only enable caching of templates if we are running in production
    isCached: process.env.NODE_ENV === 'production',
    // the root file path used to resolve and load the templates identified when calling h.view()
    path: 'views',
    // The base path used as prefix for `path:`. It will dynamically resolve to the current working directory of the
    // Node.js process
    relativeTo: process.cwd()
  }
}
