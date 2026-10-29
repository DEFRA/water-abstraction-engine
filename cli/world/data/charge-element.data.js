import { convertCubicMetresToMegalitres } from '../helpers/conversion.helpers.js'
import { generateUUID } from '../../../test/support/generators.js'
import { isTwoPartTariffPurpose, purposeDescription } from '../helpers/purpose.helpers.js'

/**
 * Build a charge element record for a charge reference and licence version purpose
 *
 * @param {object} chargeReference - the charge reference record
 * @param {object} licenceVersionPurpose - the licence version purpose record
 *
 * @returns {object} the data to load
 */
export default function (chargeReference, licenceVersionPurpose) {
  const twoPartTariff = isTwoPartTariffPurpose(licenceVersionPurpose.purposeId.value)
  const description = purposeDescription(licenceVersionPurpose.purposeId.value)

  return {
    id: generateUUID(),
    chargeReferenceId: chargeReference.id,
    abstractionPeriodStartDay: licenceVersionPurpose.abstractionPeriodStartDay,
    abstractionPeriodStartMonth: licenceVersionPurpose.abstractionPeriodStartMonth,
    abstractionPeriodEndDay: licenceVersionPurpose.abstractionPeriodEndDay,
    abstractionPeriodEndMonth: licenceVersionPurpose.abstractionPeriodEndMonth,
    authorisedAnnualQuantity: convertCubicMetresToMegalitres(licenceVersionPurpose.annualQuantity),
    loss: 'high',
    section127Agreement: twoPartTariff,
    description,
    purposeId: {
      schema: 'public',
      table: 'purposes',
      lookup: 'legacyId',
      value: licenceVersionPurpose.purposeId.value,
      select: 'id'
    },
    purposePrimaryId: {
      schema: 'public',
      table: 'primaryPurposes',
      lookup: 'legacyId',
      value: licenceVersionPurpose.primaryPurposeId.value,
      select: 'id'
    },
    purposeSecondaryId: {
      schema: 'public',
      table: 'secondaryPurposes',
      lookup: 'legacyId',
      value: licenceVersionPurpose.secondaryPurposeId.value,
      select: 'id'
    }
  }
}
