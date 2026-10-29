import { generateAccountNumber } from '../helpers/generators.helpers.js'
import { generateUUID } from '../../../test/support/generators.js'

/**
 * Build a billing account record for a company
 *
 * @param {object} company - the company record
 * @param {object} region - the region record
 *
 * @returns {object} the data to load
 */
export default function (company, region) {
  const billingAccountId = generateUUID()
  const accountNumber = generateAccountNumber(region)

  return {
    id: billingAccountId,
    accountNumber,
    companyId: company.id
  }
}
