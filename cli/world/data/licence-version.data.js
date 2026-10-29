import { generateLicenceVersionExternalId, generateUUID } from '../../../test/support/generators.js'

/**
 * Build a licence version record for a licence
 *
 * @param {object} licence - the licence record
 * @param {object} company - the company record
 * @param {object} address - the address record
 * @param {object} region - the region record
 *
 * @returns {object} the data to load
 */
export default function (licence, company, address, region) {
  const licenceVersionId = generateUUID()

  return {
    id: licenceVersionId,
    licenceId: licence.id,
    issue: 1,
    increment: 0,
    status: 'current',
    startDate: licence.startDate,

    externalId: generateLicenceVersionExternalId(region),
    companyId: company.id,
    addressId: address.id
  }
}
