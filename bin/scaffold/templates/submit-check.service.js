/**
 * Orchestrates submitting the '' check page
 *
 * @module __MODULE_NAME__
 */

import FetchSessionDal from 'water-abstraction-engine/dal/fetch-session.dal.js'

/**
 * Orchestrates submitting the '' check page
 *
 * @param {string} sessionId - The UUID of the current session
 *
 * @returns {Promise<object>} The URL to redirect to
 */
export default async function __FUNCTION_NAME__(sessionId) {
  const session = await FetchSessionDal(sessionId)

  await _save(session)

  return {
    redirectUrl: `__ROUTE_BASE__/${sessionId}/next-page`
  }
}

async function _save(session) {
  return session.$update()
}
