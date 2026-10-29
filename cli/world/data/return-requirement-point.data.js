/**
 * Build a return requirement point record linking a return requirement to a point
 *
 * @param {object} returnRequirement - the return requirement record
 * @param {object} point - the point record
 *
 * @returns {object} the data to load
 */
export default function (returnRequirement, point) {
  return {
    returnRequirementId: returnRequirement.id,
    pointId: point.id
  }
}
