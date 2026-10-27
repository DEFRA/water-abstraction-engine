import { convertCubicMetresToMegalitres } from '../helpers/conversion.helpers.js'
import { eiucRegions } from '../default-values.js'
import { generateUUID } from '../../../test/support/generators.js'
import { isTwoPartTariffPurpose } from '../helpers/purpose.helpers.js'

/**
 * Build a charge reference record for a charge version
 *
 * @param {object} chargeVersion - the charge version record
 * @param {object[]} licenceVersionPurposes - the licence version purpose records
 *
 * @returns {object} the data to load
 */
export default function (chargeVersion, licenceVersionPurposes) {
  let annualQuantity = 0
  let twoPartTariff = false

  for (const licenceVersionPurpose of licenceVersionPurposes) {
    annualQuantity += licenceVersionPurpose.annualQuantity

    if (!twoPartTariff) {
      twoPartTariff = isTwoPartTariffPurpose(licenceVersionPurpose.purposeId.value)
    }
  }

  return {
    id: generateUUID(),
    chargeVersionId: chargeVersion.id,
    description: 'Test charge reference 1',
    source: 'non-tidal',
    loss: 'high',
    scheme: 'sroc',
    chargeCategoryId: {
      schema: 'public',
      table: 'chargeCategories',
      lookup: 'reference',
      value: '4.6.1',
      select: 'id'
    },
    additionalCharges: {},
    adjustments: {
      aggregate: null,
      s126: null,
      s127: twoPartTariff,
      s130: false,
      charge: null,
      winter: false
    },
    restrictedSource: false,
    waterModel: 'no model',
    volume: convertCubicMetresToMegalitres(annualQuantity),
    eiucRegion: eiucRegions[chargeVersion.regionCode],
    section127Agreement: twoPartTariff
  }
}
