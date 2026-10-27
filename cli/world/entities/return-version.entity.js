import returnRequirementData from '../data/return-requirement.data.js'
import returnRequirementPointData from '../data/return-requirement-point.data.js'
import returnRequirementPurposeData from '../data/return-requirement-purpose.data.js'
import returnVersionData from '../data/return-version.data.js'

/**
 * Builds a return version in its entirety: the return version itself, a return requirement, and its point and
 * purpose links — the minimum valid data a return version needs to exist against a licence.
 *
 * @param {object} licenceEntity - the licence entity the return version is for
 */
export default function (licenceEntity) {
  const { licence, licenceVersionPurpose, point } = licenceEntity

  const returnVersion = returnVersionData(licence)
  const returnRequirement = returnRequirementData(returnVersion, licenceVersionPurpose)
  const returnRequirementPoint = returnRequirementPointData(returnRequirement, point)
  const returnRequirementPurpose = returnRequirementPurposeData(returnRequirement, licenceVersionPurpose)

  return {
    returnVersion,
    returnRequirement,
    returnRequirementPoint,
    returnRequirementPurpose
  }
}
