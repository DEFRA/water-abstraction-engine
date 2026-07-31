/**
 * Our views plugin which serves views using nunjucks and govuk-frontend.
 *
 * The bulk of this is taken from https://github.com/DEFRA/hapi-web-boilerplate and tweaked to fit how we organise our
 * code. For now we have removed Google Analytics (which would have been added to the `context` option) as we can
 * integrate that at a later date.
 *
 * @module ViewsPlugin
 */

import Nunjucks from 'nunjucks'
import Vision from '@hapi/vision'
import { existsSync } from 'node:fs'
import path from 'node:path'

import MarkdownFilter from '../../views/filters/markdown.filter.js'

/**
 * The rendering function for the view engine
 *
 * When we register the Vision plugin we are required to populate `options:` (see
 * {@link https://hapi.dev/module/vision/api/?v=7.0.1#options options}). For each `engine:` we register (in our case
 * just Nunjucks) we must set the `compile:` property to a function which in turn returns a function that will be called
 * when a view is to be rendered, for example, when `h.view()` is called in a controller.
 *
 * We know, it's confusing! This is why we've broken it out here rather than follow the
 * {@link https://hapi.dev/module/vision/api/?v=7.0.1#nunjucks nunjucks example} which does it all inline.
 *
 * We believe it's done in this way to take advantage of a
 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures closure}. Before rendering a template
 * Nunjucks needs to compile it. So, we can generate the compiled template using the args passed to this function.
 *
 * Using a closure, we can refer to the compiled template we create here in the function we're returning, even though
 * that function will be called somewhere else entirely!
 *
 * Tl;DR; It the object we pass to Vision `compile:` must be a function that returns a function :-)
 *
 * @param {string} template - The content of the template
 * @param {object} options - Vision's `config.compileOptions` property which we assign the Nunjucks Environment instance
 * to in `prepare()` below
 */
function compile(template, options) {
  const compiledTemplate = Nunjucks.compile(template, options.environment)

  return (renderContext) => {
    return compiledTemplate.render(renderContext)
  }
}

/**
 * Initialises additional engine state
 *
 * That summary description and the ones for the params is taken directly from the
 * {@link https://hapi.dev/module/vision/api/?v=7.0.1#options Vision docs}.
 *
 * Essentially, Vision is 'engine agnostic'. It is intended to work with lots of view engines. Some of them, like
 * Nunjucks, require or can be configured. If `prepare:` is in the plugin options Vision will call it as part of
 * its initialisation so you can configure your chosen view engine.
 *
 * @param {*} config - The engine configuration object allowing updates to be made. This is useful for engines like
 * Nunjucks that rely on additional state for rendering
 * @param {*} next - Has the signature `function(err)`
 *
 * @returns the result of calling `next()`
 */
function prepare(config, next) {
  // Tell Nunjucks the paths to where your templates live. We _think_ Nunjucks searches in order of the paths provided.
  // So, search our templates first before searching in the govuk-frontend package for a template.
  //
  // We resolve all paths relative to this plugin file rather than using bare relative paths. Bare relative paths
  // would resolve against the consuming app's CWD, but these are water-abstraction-engine's own dependencies so they
  // live alongside this file. import.meta.dirname gives us the real path regardless of symlinks, so this works whether
  // water-abstraction-engine is installed as a git dependency (nested under node_modules/water-abstraction-engine/) or
  // npm-linked.
  //
  // govukFrontendPath: path to govuk-frontend package
  //   - npm link: govuk-frontend lives in water-abstraction-engine's own node_modules (import.meta.dirname resolves the
  //     symlink to the real engine path, so the nested node_modules/ is found)
  //   - git dep in CI: npm may hoist govuk-frontend to the consuming app's node_modules, so the nested path
  //     won't exist — fall back one level up to the parent node_modules/
  //   → templates imported as e.g. "govuk/components/summary-list/macro.njk"
  //
  // waterEngineParentPath: parent directory of water-abstraction-engine itself
  //   - git dep:  water-back-office/node_modules/   (contains water-abstraction-engine/)
  //   - npm link: workspace parent dir              (contains water-abstraction-engine/)
  //   → templates imported as e.g. "water-abstraction-engine/views/macros/page-heading.njk"
  const engineGovuk = path.resolve(import.meta.dirname, '../../node_modules/govuk-frontend/')
  const govukFrontendPath = existsSync(engineGovuk)
    ? engineGovuk
    : path.resolve(import.meta.dirname, '../../../govuk-frontend/')
  const waterEngineParentPath = path.resolve(import.meta.dirname, '../../..')
  const paths = [path.join(config.relativeTo, config.path), waterEngineParentPath, govukFrontendPath]

  // configure() returns an instance of Nunjucks Environment class (see
  // https://mozilla.github.io/nunjucks/api.html#environment) which is the central object for handling templates.
  // This gets assigned to Vision's compileOptions which is passed into `compile()` above as `options`.
  const environment = Nunjucks.configure(paths)

  // Add custom filter to support rendering Notify notifications as HTML
  environment.addFilter('markdown', MarkdownFilter)

  config.compileOptions.environment = environment

  return next()
}

/**
 * Factory function to build the Vision plugin
 *
 * This differs from our other plugins that return an object because need to pass in config to be applied to the object
 * we're returning. This is because the apps need to tell us where their views are located so we can configure Vision
 * and Nunjucks to find them.
 *
 * ## Context
 *
 * The `context` function is used to set global context available to all templates when they are rendered. It takes the
 * request object as an argument and returns an object containing various properties that can be accessed in the
 * templates. In our case this includes information about the authenticated user, navigation links, and other relevant
 * data.
 *
 * When rendering views, the global context will be merged with any context object specified on the handler or using
 * `h.view()`. When multiple context objects are used, values from the global context always have lowest precedence.
 *
 * Expanding that last point, what it means is when we call `h.view('bills/view.njk', { ...myContext })` in a controller
 * Vision will combine the 'context' (data) we pass in with the `params`, `payload`, `query` and `pre` values from the
 * `request` plus the output of this function and pass that through to the template. Nice!
 *
 * > Credit to https://www.solarwinter.net/hapi-vision-and-who-am-i/ for highlighting we could do this
 *
 * Unlike `compile()` and `prepare()`, it is defined within this factory function so it can close over the
 * `navigationLinks` from the config object. This is a closure! It means we can use the `navigationLinks` in the context
 * function because we cannot pass it in as an argument.
 *
 * @param {object} config - Object containing `isCached`, `navigationLinks`, `path` and `relativeTo` properties to
 * configure Vision and Nunjucks
 *
 * @returns {object} The Vision plugin object
 */
export default function ViewsPlugin(config) {
  const { isCached, navigationLinks, path: rootFilePath, relativeTo } = config

  // Defined here so it closes over `navigationLinks` from config, i.e. a closure!
  function context(request) {
    return {
      assetPath: '/assets',
      cspNonce: request.plugins.blankie?.nonces?.script,
      referrer: request.info.referrer,
      auth: {
        authenticated: request.auth.isAuthenticated,
        authorized: request.auth.isAuthorized,
        user: request.auth.credentials?.user,
        scope: request.auth.credentials?.scope,
        permission: request.auth.credentials?.permission
      },
      // The navigation links, if any, to display in the top-level GOV.UK header
      navigationLinks: request.auth.isAuthenticated ? navigationLinks : []
    }
  }

  return {
    plugin: Vision,
    options: {
      engines: {
        // The 'engine' is the file extension this applies to; in this case, .njk
        njk: {
          compile,
          prepare
        }
      },
      context,
      // the root file path used to resolve and load the templates identified when calling h.view()
      path: rootFilePath,
      // a base path used as prefix for `path:`
      relativeTo,
      // Whether to enable caching of templates (typically only enabled in production)
      isCached
    }
  }
}
