/**
 * Config values used by the service to configure the Hapi server instance
 * @module HapiConfig
 */

// We import dotenv directly in each config file to support unit tests that depend on this subset of config.
// Importing dotenv in multiple places has no effect on the app when running for real.
import 'dotenv/config'

export default {
  port: process.env.PORT,
  // The routes section is used to set default configuration for every route in the app. In our case we want to Hapi to
  // set a bunch of common security headers. See https://hapi.dev/api/?v=20.0.0#-routeoptionssecurity for details of
  // what gets enabled.
  routes: {
    security: true
  },
  // The router section controls how incoming request URIs are matched against the routing table. In our AWS
  // environments we see trailing slashes added to the end of paths so this deals with that issue. We also don't want
  // client systems having to worry about what case they use for the endpoint when making a request.
  router: {
    isCaseSensitive: false,
    stripTrailingSlash: true
  }
}
