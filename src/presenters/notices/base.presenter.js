/**
 * General helper methods used by the notice presenters
 * @module NoticesBasePresenter
 */

import { today } from '../../lib/general.lib.js'

/**
 * Determines the due date for a notification when no due date information is available
 *
 * This is determined by the business to be 'today' plus 28 days for email, and 29 days for letters. For example, if
 * today is 2025-11-01 then
 *
 * - Email due date is 2025-11-29
 * - Letter due date is 2025-11-30
 *
 * The extra day for letters is to allow the extra time it takes Notify to send the letter for printing and mailing.
 *
 *
 * @param {string} [messageType=email] - Either 'letter' or 'email'. Defaults to 'email'.
 *
 * @returns {Date} A date either 28 or 29 days from 'today'
 */
export function futureDueDate(messageType = 'email') {
  const dueDate = today()
  const daysToAdd = messageType === 'letter' ? 29 : 28

  dueDate.setDate(dueDate.getDate() + daysToAdd)

  return dueDate
}
