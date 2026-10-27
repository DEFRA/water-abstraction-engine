import { regions } from '../../default-values.js'

/**
 * How many licences of each group to add for each region
 *
 * The groups are by how often a kind of licence is seen. A region's total is in proportion to its size, and is split
 * between the groups the same way in every region.
 */
export const REGIONS = [
  {
    region: regions.ANGLIAN,
    common: 273,
    fairlyCommon: 92,
    uncommon: 128,
    rare: 61,
    veryRare: 3
  },
  {
    region: regions.MIDLANDS,
    common: 215,
    fairlyCommon: 72,
    uncommon: 101,
    rare: 48,
    veryRare: 2
  },
  {
    region: regions.SOUTH_WEST,
    common: 156,
    fairlyCommon: 53,
    uncommon: 73,
    rare: 35,
    veryRare: 1
  },
  {
    region: regions.NORTH_EAST,
    common: 124,
    fairlyCommon: 42,
    uncommon: 58,
    rare: 28,
    veryRare: 2
  },
  {
    region: regions.NORTH_WEST,
    common: 81,
    fairlyCommon: 27,
    uncommon: 38,
    rare: 18,
    veryRare: 2
  },
  { region: regions.THAMES, common: 64, fairlyCommon: 22, uncommon: 30, rare: 14, veryRare: 1 },
  {
    region: regions.SOUTHERN,
    common: 44,
    fairlyCommon: 15,
    uncommon: 21,
    rare: 10,
    veryRare: 1
  },
  { region: regions.WALES, common: 27, fairlyCommon: 9, uncommon: 12, rare: 6, veryRare: 1 }
]

/**
 * The entry in the regions list for the region a licence is in
 *
 * @param {object} licenceEntity - the licence entity to look in
 *
 * @returns {object} the entry, for example `{ region, common: 273, ... }`
 */
export function regionOf(licenceEntity) {
  return REGIONS.find(({ region }) => {
    return region.naldRegionId === licenceEntity.licence.regionId.value
  })
}
