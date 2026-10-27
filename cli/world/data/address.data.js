import { generateAddress } from '../helpers/generators.helpers.js'
import { generateUUID } from '../../../test/support/generators.js'

/**
 * Build an address record with generated UK address lines
 *
 * @returns {object} the data to load
 */
export default function () {
  const addressId = generateUUID()

  const { address1, address2, address3, address4, postcode } = generateAddress()

  return {
    id: addressId,
    address1,
    address2,
    address3,
    address4,
    postcode,
    country: 'United Kingdom',
    dataSource: 'wrls'
  }
}
