import { generateUUID } from '../../../test/support/generators.js'

/**
 * Build a company contact record linking a contact to a company
 *
 * @param {object} contact - the contact record
 * @param {object} company - the company record
 *
 * @returns {object} the data to load
 */
export default function (contact, company) {
  const companyContactId = generateUUID()

  return {
    id: companyContactId,
    contactId: contact.id,
    licenceRoleId: {
      schema: 'public',
      table: 'licenceRoles',
      lookup: 'name',
      value: 'additionalContact',
      select: 'id'
    },
    companyId: company.id,
    abstractionAlerts: false
  }
}
