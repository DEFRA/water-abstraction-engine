import { convertCubicMetresToMegalitres } from '../helpers/conversion.helpers.js'
import { generateUUID } from '../../../test/support/generators.js'
import { isTwoPartTariffPurpose, purposeDescription } from '../helpers/purpose.helpers.js'

/**
 * Build a presroc charge reference record for a charge version
 *
 * @param {object} chargeVersion - the charge version record
 * @param {object} licenceVersionPurpose - the licence version purpose record
 *
 * @returns {object} the data to load
 */
export default function (chargeVersion, licenceVersionPurpose) {
  const chargeReferenceId = generateUUID()

  const twoPartTariff = isTwoPartTariffPurpose(licenceVersionPurpose.purposeId.value)
  const description = purposeDescription(licenceVersionPurpose.purposeId.value)

  return {
    id: chargeReferenceId,
    chargeVersionId: chargeVersion.id,
    abstractionPeriodStartDay: licenceVersionPurpose.abstractionPeriodStartDay,
    abstractionPeriodStartMonth: licenceVersionPurpose.abstractionPeriodStartMonth,
    abstractionPeriodEndDay: licenceVersionPurpose.abstractionPeriodEndDay,
    abstractionPeriodEndMonth: licenceVersionPurpose.abstractionPeriodEndMonth,
    authorisedAnnualQuantity: convertCubicMetresToMegalitres(licenceVersionPurpose.annualQuantity),
    season: 'all year',
    seasonDerived: 'all year',
    description: `Test PRESROC charge element 1 - ${description}`,
    source: 'unsupported',
    loss: 'high',
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
      value: 'A',
      select: 'id'
    },
    purposeSecondaryId: {
      schema: 'public',
      table: 'secondaryPurposes',
      lookup: 'legacyId',
      value: 'AGR',
      select: 'id'
    },
    section127Agreement: twoPartTariff,
    scheme: 'alcs',
    restrictedSource: false
  }
}
