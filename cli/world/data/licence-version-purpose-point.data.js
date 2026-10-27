/**
 * Build a licence version purpose point record linking a licence version purpose to a point
 *
 * @param {object} licenceVersionPurpose - the licence version purpose record
 * @param {object} point - the point record
 *
 * @returns {object} the data to load
 */
export default function (licenceVersionPurpose, point) {
  return {
    licenceVersionPurposeId: licenceVersionPurpose.id,
    pointId: point.id
  }
}
