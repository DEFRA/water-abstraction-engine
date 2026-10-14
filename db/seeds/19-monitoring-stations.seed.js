import MonitoringStationModel from '../../src/models/monitoring-station.model.js'
import ServerConfig from '../../src/config/server.config.js'
import { data as monitoringStations } from './data/monitoring-stations.js'

const BATCH_SIZE = 1000

/**
 * Seeds the monitoring station data using an upsert
 *
 * Previous table name - water.gauging_stations
 *
 * Public table name - public.monitoring_stations
 */
export async function seed() {
  // These monitoring stations are for use in our non-production environments only
  if (ServerConfig.environment === 'production') {
    return
  }

  // There are thousands of monitoring stations, so they are upserted in batches rather than one at a time
  for (let i = 0; i < monitoringStations.length; i += BATCH_SIZE) {
    await _upsert(monitoringStations.slice(i, i + BATCH_SIZE))
  }
}

async function _upsert(monitoringStations) {
  return MonitoringStationModel.query()
    .insert(monitoringStations)
    .onConflict('id')
    .merge([
      'label',
      'lat',
      'long',
      'easting',
      'northing',
      'gridReference',
      'catchmentName',
      'riverName',
      'wiskiId',
      'stationReference',
      'status',
      'metadata',
      'hydrologyStationId',
      'updatedAt'
    ])
}
