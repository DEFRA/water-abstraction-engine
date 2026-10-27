import { generateUUID } from '../../../test/support/generators.js'

/**
 * Build a billing account address record linking a billing account to an address
 *
 * @param {object} billingAccount - the billing account record
 * @param {object} address - the address record
 *
 * @returns {object} the data to load
 */
export default function (billingAccount, address) {
  const billingAccountAddressId = generateUUID()

  return {
    id: billingAccountAddressId,
    billingAccountId: billingAccount.id,
    addressId: address.id,
    startDate: '2022-04-01'
  }
}
