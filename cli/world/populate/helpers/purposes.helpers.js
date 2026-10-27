import licenceVersionPurposeData from '../../data/licence-version-purpose.data.js'
import licenceVersionPurposePointData from '../../data/licence-version-purpose-point.data.js'

// A licence is built with one purpose. These are the ones added after it, in order: spray irrigation storage, general
// use, and trickle irrigation direct. All are for agriculture
const PURPOSES_TO_ADD = ['420', '160', '600']

/**
 * Add a purpose to a licence's current licence version
 *
 * The purpose is linked to the licence's point. It is a different purpose from the ones the licence version already
 * has, with the same abstraction period.
 *
 * Call this again to add another, up to three times.
 *
 * @param {object} licenceEntity - the licence entity to change
 * @param {object} region - the region the licence is in
 */
export function addPurpose(licenceEntity, region) {
  // The current licence version is the last one
  const currentLicenceVersion = licenceEntity.licenceVersions.at(-1)

  const existingPurposes = purposesOn(licenceEntity, currentLicenceVersion)

  const purpose = licenceVersionPurposeData(currentLicenceVersion, region)

  purpose.purposeId.value = PURPOSES_TO_ADD[existingPurposes.length - 1]

  licenceEntity.licenceVersionPurposes.push(purpose)
  licenceEntity.licenceVersionPurposePoints.push(licenceVersionPurposePointData(purpose, licenceEntity.points[0]))
}

/**
 * The first purpose on the licence's current licence version, which is the last one
 *
 * @param {object} licenceEntity - the licence entity to look in
 *
 * @returns {object} the licence version purpose
 */
export function currentPurpose(licenceEntity) {
  const currentLicenceVersion = licenceEntity.licenceVersions.at(-1)

  return purposesOn(licenceEntity, currentLicenceVersion)[0]
}

/**
 * The purposes on a licence version
 *
 * @param {object} licenceEntity - the licence entity to look in
 * @param {object} licenceVersion - the licence version whose purposes to find
 *
 * @returns {object[]} the licence version purposes
 */
export function purposesOn(licenceEntity, licenceVersion) {
  return licenceEntity.licenceVersionPurposes.filter((licenceVersionPurpose) => {
    return licenceVersionPurpose.licenceVersionId === licenceVersion.id
  })
}
