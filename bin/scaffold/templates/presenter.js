/**
 * Formats data for the '' page
 * @module __MODULE_NAME__
 */

import { checkUrl } from 'water-abstraction-engine/lib/check-page.lib.js'

/**
 * Formats data for the '' page
 *
 * @param {module:SessionModel} session - The session instance
 *
 * @returns {object} The data formatted for the view template
 */
export default function __FUNCTION_NAME__(session) {
  return {
    backLink: {
      href: checkUrl(session, `__ROUTE_BASE__/${session.id}/previous-page`),
      text: 'Back'
    },
    pageTitle: ''
  }
}
