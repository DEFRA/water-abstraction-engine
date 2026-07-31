import Cookie from '@hapi/cookie'
import Hapi from '@hapi/hapi'
import Inert from '@hapi/inert'
import Scooter from '@hapi/scooter'

import AirbrakePlugin from './plugins/airbrake.plugin.js'
import AuthPlugin from './plugins/auth.plugin.js'
import BearerPlugin from './plugins/bearer.plugin.js'
import ContentSecurityPolicyPlugin from './plugins/content-security-policy.plugin.js'
import CrumbPlugin from './plugins/crumb.plugin.js'
import ErrorPagesPlugin from './plugins/error-pages.plugin.js'
import GlobalHapiServerMethodsPlugin from './plugins/global-hapi-server-methods.plugin.js'
import GlobalNotifierPlugin from './plugins/global-notifier.plugin.js'
import HapiConfig from './config/hapi.config.js'
import HapiPinoPlugin from './plugins/hapi-pino.plugin.js'
import KeepYarAlivePlugin from './plugins/keep-yar-alive.plugin.js'
import NotifyTokenCachePlugin from './plugins/notify-token-cache.plugin.js'
import PayloadCleanerPlugin from './plugins/payload-cleaner.plugin.js'
import RouterPlugin from './plugins/router.plugin.js'
import StopPlugin from './plugins/stop.plugin.js'
import ViewsPlugin from './plugins/views.plugin.js'
import YarPlugin from './plugins/yar.plugin.js'

/**
 * Prep an instance of Hapi server with all the base plugins registered
 *
 * @param {object} viewsConfig - The server config to apply when creating and preparing the Hapi server instance
 * @param {Function} authService - The function the AuthPlugin will call to validate a user is authenticated and to
 * populate the request with their details and credentials.
 *
 * @returns {Promise<object>} The 'prepped' Hapi server instance
 */
export default async function baseServer(viewsConfig, authService) {
  const server = Hapi.server(HapiConfig)

  await _registerPlugins(server, viewsConfig, authService)

  return server
}

process.on('unhandledRejection', (err) => {
  console.error(err)
  process.exit(1)
})

async function _registerPlugins(server, viewsConfig, authService) {
  // NOTE: This order matters to some plugins we register. Inserting into the order should be fine. But if you reorder
  // any existing plugin registration double-check you haven't broken anything!
  await server.register(StopPlugin)
  await server.register(Inert)
  await server.register(Cookie)
  await server.register(Scooter)
  await server.register(GlobalHapiServerMethodsPlugin)
  await server.register(YarPlugin)
  await server.register(BearerPlugin)
  await server.register(AuthPlugin(authService))
  await server.register(HapiPinoPlugin)
  await server.register(AirbrakePlugin)
  await server.register(GlobalNotifierPlugin)
  await server.register(NotifyTokenCachePlugin)
  await server.register(CrumbPlugin)
  await server.register(ErrorPagesPlugin)
  await server.register(PayloadCleanerPlugin)
  await server.register(ViewsPlugin(viewsConfig))
  await server.register(ContentSecurityPolicyPlugin)
  await server.register(KeepYarAlivePlugin)
  await server.register(RouterPlugin)
}
