import DatabaseConfig from '../../src/config/database.config.js'
import monitoringStationHelper from '../../test/support/helpers/monitoring-station.helper.js'
import { naldRegions } from '../../src/lib/static-lookups.lib.js'
import regionHelper from '../../test/support/helpers/region.helper.js'
import userHelper from '../../test/support/helpers/user.helper.js'

export const applications = {
  EXTERNAL: 'water_vml',
  INTERNAL: 'water_admin'
}

export const groups = {
  BILLING_AND_DATA: 'billing_and_data',
  ENVIRONMENT_OFFICER: 'environment_officer',
  NPS: 'nps',
  PSC: 'psc',
  SUPER: 'super',
  WIRS: 'wirs'
}

export const monitoringStations = {
  FIRST: monitoringStationHelper.select(0),
  SECOND: monitoringStationHelper.select(1),
  THIRD: monitoringStationHelper.select(2)
}

/**
 * When a scenario or data file needs a password, we use the one set in the DEFAULT_USER_PASSWORD environment variable
 * as our default.
 * @type {string}
 */
export const password = DatabaseConfig.defaultUserPassword

export const regions = {
  ANGLIAN: regionHelper.select(0),
  MIDLANDS: regionHelper.select(1),
  NORTH_EAST: regionHelper.select(2),
  NORTH_WEST: regionHelper.select(3),
  SOUTH_WEST: regionHelper.select(4),
  SOUTHERN: regionHelper.select(5),
  THAMES: regionHelper.select(6),
  WALES: regionHelper.select(7)
}

/**
 * When a licence or a sroc charge reference needs its EIUC region (a licence's regional charge area), we use the one
 * for its region, keyed by the region's NALD id. The names are the engine's lookup of NALD EIUC codes. NALD gives each
 * licence its own EIUC code, so pairing a region with one is our choice. North East covers both Yorkshire and
 * Northumbria, so we use Yorkshire, the larger.
 * @type {object}
 */
export const eiucRegions = {
  [regions.ANGLIAN.naldRegionId]: naldRegions.AN,
  [regions.MIDLANDS.naldRegionId]: naldRegions.MD,
  [regions.NORTH_EAST.naldRegionId]: naldRegions.YO,
  [regions.NORTH_WEST.naldRegionId]: naldRegions.NW,
  [regions.SOUTH_WEST.naldRegionId]: naldRegions.SW,
  [regions.SOUTHERN.naldRegionId]: naldRegions.SO,
  [regions.THAMES.naldRegionId]: naldRegions.TH,
  [regions.WALES.naldRegionId]: naldRegions.WL
}

/**
 * When a scenario or data file needs the date the sroc charging scheme came into force, we use 2022-04-01 as our
 * default — the first day of the first sroc financial year (2022 to 2023).
 * @type {string}
 */
export const srocStartDate = '2022-04-01'

export const users = {
  BASIC: userHelper.select(10),
  BILLING_AND_DATA: userHelper.select(4),
  PSC: userHelper.select(5)
}
