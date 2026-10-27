import { generateBillRunNumber } from '../helpers/generators.helpers.js'
import { generateUUID } from '../../../test/support/generators.js'

/**
 * Build a bill run record for a region
 *
 * @param {object} region - the region record
 *
 * @returns {object} the data to load
 */
export default function (region) {
  return {
    id: generateUUID(),
    regionId: { schema: 'public', table: 'regions', lookup: 'naldRegionId', value: region.naldRegionId, select: 'id' },
    batchType: 'annual',
    fromFinancialYearEnding: '2024',
    toFinancialYearEnding: '2024',
    status: 'sent',
    // In a real bill run this is returned by the Charging Module when the bill run is created there — we don't call
    // that service, so we generate our own to satisfy the column's uniqueness constraint.
    externalId: generateUUID(),
    billRunNumber: generateBillRunNumber(region)
  }
}
