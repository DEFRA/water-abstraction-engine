/**
 * Orchestrates fetching and presenting the data for the '' check page
 *
 * @module __MODULE_NAME__
 */

import FetchSessionDal from 'water-abstraction-engine/dal/fetch-session.dal.js'
import { markCheckPageVisited } from 'water-abstraction-engine/lib/check-page.lib.js'

import __PRESENTER_NAME__ from '__PRESENTER_PATH__'

/**
 * Orchestrates fetching and presenting the data for the '' check page
 *
 * @param {string} sessionId - The UUID of the current session
 *
 * @returns {Promise<object>} The data formatted for the view template
 */
export default async function __FUNCTION_NAME__(sessionId) {
  const session = await FetchSessionDal(sessionId)

  await markCheckPageVisited(session)

  const pageData = __PRESENTER_NAME__(session)

  return {
    ...pageData
  }
}
