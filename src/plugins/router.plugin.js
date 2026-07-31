/**
 * Our router plugin which pulls in the various routes we have defined ready to be registered with the Hapi server
 * (server.js).
 *
 * You register your routes via a plugin, and by bringing them into this central place it gives us the scope to do
 * things like filter what actually gets registered. A working example might be an endpoints used to support testing and
 * debugging which we don't want registered in the actual production environment.
 *
 * @module RouterPlugin
 */

import AirbrakeConfig from '../config/airbrake.config.js'
import AssetRoutes from '../routes/assets.routes.js'
import FilterRoutesService from '../services/plugins/filter-routes.service.js'
import HealthRoutes from '../routes/health.routes.js'
import RootRoutes from '../routes/root.routes.js'

const routes = [...RootRoutes, ...AssetRoutes, ...HealthRoutes]

export default {
  name: 'router-engine',
  register: (server, _options) => {
    // Filter our any routes which should not be registered. Typically, these will be unfinished endpoints we filter
    // out when running in production
    const filteredRoutes = FilterRoutesService(routes, AirbrakeConfig.environment)

    server.route(filteredRoutes)
  }
}
