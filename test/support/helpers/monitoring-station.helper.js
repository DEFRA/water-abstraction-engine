/**
 * @module MonitoringStationHelper
 */

import MonitoringStationModel from '../../../src/models/monitoring-station.model.js'
import { data as monitoringStations } from '../../../db/seeds/data/monitoring-stations.js'
import { timestampForPostgres } from '../../../src/lib/general.lib.js'
import { generateRandomInteger, generateUUID } from '../generators.js'

/**
 * Add a new monitoring station
 *
 * If no `data` is provided, default values will be used. These are
 *
 * - `hydrologyStationId` - [random UUID]
 * - `label` - 'MONITOR PLACE'
 * - `createdAt` - new Date()
 * - `updatedAt` - new Date()
 *
 * @param {object} [data] - Any data you want to use instead of the defaults used here or in the database
 *
 * @returns {Promise<module:MonitoringStationModel>} The instance of the newly created record
 */
async function add(data = {}) {
  const insertData = defaults(data)

  return MonitoringStationModel.query()
    .insert({ ...insertData })
    .returning('*')
}

/**
 * Returns the defaults used
 *
 * It will override or append to them any data provided. Mainly used by the `add()` method, we make it available
 * for use in tests to avoid having to duplicate values.
 *
 * @param {object} [data] - Any data you want to use instead of the defaults used here or in the database
 *
 * @returns {object} - Returns the set defaults with the override data spread
 */
function defaults(data = {}) {
  const timestamp = timestampForPostgres()

  const defaults = {
    hydrologyStationId: generateUUID(),
    label: 'MONITOR PLACE',
    // INFO: The table does not have a default for the date columns
    createdAt: timestamp,
    updatedAt: timestamp
  }

  return {
    ...defaults,
    ...data
  }
}

/**
 * Select an entry from the reference data entries seeded at the start of testing
 *
 * Because this helper is linked to a reference record instead of a transaction, we don't expect these to be created
 * when using the service.
 *
 * So, they are seeded automatically when tests are run. Tests that need to link to a record can use this method to
 * select a specific entry, or have it return one at random.
 *
 * @param {number} [index=-1] - The reference entry to select. Defaults to -1 which means an entry will be returned at
 * random from the reference data
 *
 * @returns {module:MonitoringStationModel} The selected reference entry or one picked at random
 */
function select(index = -1) {
  if (index > -1) {
    return MonitoringStationModel.fromJson(monitoringStations[index])
  }

  const randomIndex = generateRandomInteger(0, monitoringStations.length - 1)

  return MonitoringStationModel.fromJson(monitoringStations[randomIndex])
}

export default {
  add,
  data: monitoringStations,
  defaults,
  select
}
