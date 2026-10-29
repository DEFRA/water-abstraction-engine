import { currentPurpose } from './purposes.helpers.js'
import licenceVersionPurposePointData from '../../data/licence-version-purpose-point.data.js'
import pointData from '../../data/point.data.js'

/**
 * Add a point to a licence
 *
 * The point is linked to the first purpose on the licence's current licence version, so that purpose abstracts from
 * one more point.
 *
 * Call this again to add another.
 *
 * @param {object} licenceEntity - the licence entity to change
 * @param {object} region - the region the licence is in
 */
export function addPoint(licenceEntity, region) {
  const point = pointData(region)

  point.description = `Example point ${licenceEntity.points.length + 1}`
  point.ngr1 = 'TT 9876 5432'

  licenceEntity.points.push(point)
  licenceEntity.licenceVersionPurposePoints.push(licenceVersionPurposePointData(currentPurpose(licenceEntity), point))
}
