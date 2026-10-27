import { generateLicenceVersionPurposeExternalId, generateUUID } from '../../../test/support/generators.js'

/**
 * Build a licence version purpose record for a licence version
 *
 * @param {object} licenceVersion - the licence version record
 * @param {object} region - the region record
 *
 * @returns {object} the data to load
 */
export default function (licenceVersion, region) {
  const licenceVersionPurposeId = generateUUID()

  return {
    id: licenceVersionPurposeId,
    licenceVersionId: licenceVersion.id,
    primaryPurposeId: {
      schema: 'public',
      table: 'primaryPurposes',
      lookup: 'legacyId',
      value: 'A',
      select: 'id'
    },
    secondaryPurposeId: {
      schema: 'public',
      table: 'secondaryPurposes',
      lookup: 'legacyId',
      value: 'AGR',
      select: 'id'
    },
    purposeId: {
      schema: 'public',
      table: 'purposes',
      lookup: 'legacyId',
      value: '400',
      select: 'id'
    },
    abstractionPeriodStartDay: 1,
    abstractionPeriodStartMonth: 4,
    abstractionPeriodEndDay: 31,
    abstractionPeriodEndMonth: 3,
    annualQuantity: 1554,
    externalId: generateLicenceVersionPurposeExternalId(region)
  }
}
