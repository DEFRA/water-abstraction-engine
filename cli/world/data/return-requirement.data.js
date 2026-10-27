import { generateReference, generateUUID } from '../../../test/support/generators.js'
import { isTwoPartTariffPurpose, purposeDescription } from '../helpers/purpose.helpers.js'

/**
 * Build a return requirement record for a return version
 *
 * @param {object} returnVersion - the return version record
 * @param {object} licenceVersionPurpose - the licence version purpose record
 *
 * @returns {object} the data to load
 */
export default function (returnVersion, licenceVersionPurpose) {
  const returnRequirementId = generateUUID()
  const siteDescription = purposeDescription(licenceVersionPurpose.purposeId.value)
  const reference = generateReference()

  return {
    id: returnRequirementId,
    collectionFrequency: 'month',
    reportingFrequency: 'month',
    returnVersionId: returnVersion.id,
    summer: false,
    upload: false,
    abstractionPeriodStartDay: licenceVersionPurpose.abstractionPeriodStartDay,
    abstractionPeriodStartMonth: licenceVersionPurpose.abstractionPeriodStartMonth,
    abstractionPeriodEndDay: licenceVersionPurpose.abstractionPeriodEndDay,
    abstractionPeriodEndMonth: licenceVersionPurpose.abstractionPeriodEndMonth,
    siteDescription,
    legacyId: reference,
    reference,
    twoPartTariff: isTwoPartTariffPurpose(licenceVersionPurpose.purposeId.value)
  }
}
