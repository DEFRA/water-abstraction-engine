import { generatePointExternalId } from '../helpers/generators.helpers.js'
import { generateUUID } from '../../../test/support/generators.js'

/**
 * Build a point record in a region
 *
 * @param {object} region - the region record
 *
 * @returns {object} the data to load
 */
export default function (region) {
  const pointId = generateUUID()

  return {
    id: pointId,
    description: 'Example point 1',
    ngr1: 'TQ 1234 5678',
    externalId: generatePointExternalId(region),
    sourceId: {
      schema: 'public',
      table: 'sources',
      lookup: 'legacyId',
      value: 'S',
      select: 'id'
    }
  }
}
