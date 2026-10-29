import { generateUUID } from '../../../test/support/generators.js'
import { yesterday } from '../helpers/date.helpers.js'
import { applications, password } from '../default-values.js'
import { generateExternalEmailAddress, generateGovUKEmail } from '../helpers/generators.helpers.js'

/**
 * Build a user record for the internal or external application
 *
 * @param {string} application - the application the user belongs to, defaults to internal
 *
 * @returns {object} the data to load
 */
export default function (application = applications.INTERNAL) {
  const username = application === applications.INTERNAL ? generateGovUKEmail() : generateExternalEmailAddress()

  return {
    id: generateUUID(),
    username,
    password,
    resetRequired: 0,
    application,
    badLogins: 0,
    enabled: true,
    lastLogin: yesterday()
  }
}
