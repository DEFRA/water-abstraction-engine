/**
 * Formats data for the '' check page
 * @module __MODULE_NAME__
 */

/**
 * Formats data for the '' check page
 *
 * @param {module:SessionModel} session - The session instance
 *
 * @returns {object} The data formatted for the view template
 */
export default function __FUNCTION_NAME__(session) {
  return {
    backLink: {
      href: `__ROUTE_BASE__/${session.id}/previous-page`,
      text: 'Back'
    },
    pageTitle: 'Check the details'
  }
}
