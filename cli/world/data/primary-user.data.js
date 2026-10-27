import { generateCompanyEmailAddress } from '../helpers/generators.helpers.js'
import { generateUUID } from '../../../test/support/generators.js'
import { password } from '../default-values.js'

/**
 * Build the licence entities, licence entity role and external user that make up a company's primary user
 *
 * @param {object} company - the company record
 *
 * @returns {object} the data to load
 */
export default function (company) {
  const licenceEntityRoleId = generateUUID()
  const individualEntityId = generateUUID()
  const companyEntityId = generateUUID()

  const email = generateCompanyEmailAddress(company.name)

  const individualEntity = {
    id: individualEntityId,
    name: email,
    type: 'individual'
  }

  const companyEntity = {
    id: companyEntityId,
    name: company.name,
    type: 'company'
  }

  const licenceEntityRole = {
    id: licenceEntityRoleId,
    licenceEntityId: individualEntityId,
    companyEntityId,
    role: 'primary_user',
    createdBy: 'acceptance-test-setup'
  }

  const user = {
    username: email,
    password,
    resetRequired: 0,
    application: 'water_vml',
    badLogins: 0,
    enabled: true,
    licenceEntityId: individualEntityId
  }

  return {
    licenceEntities: [individualEntity, companyEntity],
    licenceEntityRole,
    user
  }
}
