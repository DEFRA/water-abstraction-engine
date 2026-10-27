import { generateCompanyContact } from '../helpers/generators.helpers.js'
import { generateUUID } from '../../../test/support/generators.js'

/**
 * Build a department contact record with an email based on the company name
 *
 * @param {object} company - the company record
 *
 * @returns {object} the data to load
 */
export default function (company) {
  const contactId = generateUUID()

  const { department, email } = generateCompanyContact(company.name)

  return {
    id: contactId,
    department,
    email,
    contactType: 'department'
  }
}
