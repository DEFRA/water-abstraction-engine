import { faker } from '@faker-js/faker'

import { generateCompanyExternalId, generateUUID } from '../../../test/support/generators.js'

/**
 * Build a company record in a region
 *
 * @param {object} region - the region record
 *
 * @returns {object} the data to load
 */
export default function (region) {
  const companyId = generateUUID()
  const companyExternalId = generateCompanyExternalId(region)

  return {
    id: companyId,
    externalId: companyExternalId,
    name: faker.company.name(),
    type: 'organisation'
  }
}
