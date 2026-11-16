/**
 * Orchestrates validating the data for the '' page
 *
 * @module __MODULE_NAME__
 */

import FetchSessionDal from 'water-abstraction-engine/dal/fetch-session.dal.js'
import { formatValidationResult } from 'water-abstraction-engine/presenters/base.presenter.js'
import { checkUrl } from 'water-abstraction-engine/lib/check-page.lib.js'

import __PRESENTER_NAME__ from '__PRESENTER_PATH__'
import __VALIDATOR_NAME__ from '__VALIDATOR_PATH__'

/**
 * Orchestrates validating the data for the '' page
 *
 * @param {string} sessionId - The UUID of the current session
 * @param {object} payload - The submitted form data
 *
 * @returns {Promise<object>} The URL to redirect to when the data is valid, else the page data with the validation errors
 */
export default async function __FUNCTION_NAME__(sessionId, payload) {
  const session = await FetchSessionDal(sessionId)

  const validationResult = _validate(payload)

  if (!validationResult) {
    await _save(session, payload)

    return {
      redirectUrl: checkUrl(session, `__ROUTE_BASE__/${sessionId}/next-page`)
    }
  }

  const pageData = __PRESENTER_NAME__(session)

  return {
    error: validationResult,
    ...pageData
  }
}

async function _save(session, payload) {
  return session.$update()
}

function _validate(payload) {
  const validationResult = __VALIDATOR_NAME__(payload)

  return formatValidationResult(validationResult)
}
