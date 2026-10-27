import { eiucRegions } from '../default-values.js'
import { generateLicenceRef, generateUUID } from '../../../test/support/generators.js'

/**
 * Build a licence record in a region
 *
 * @param {string} startDate - the licence start date as an ISO date string
 * @param {object} region - the region record
 *
 * @returns {object} the data to load
 */
export default function (startDate, region) {
  const licenceId = generateUUID()
  const licenceRef = generateLicenceRef()

  return {
    id: licenceId,
    licenceRef,
    regionId: { schema: 'public', table: 'regions', lookup: 'naldRegionId', value: region.naldRegionId, select: 'id' },
    regions: {
      historicalAreaCode: 'SAAR',
      regionalChargeArea: eiucRegions[region.naldRegionId]
    },
    startDate,
    waterUndertaker: false
  }
}
