import { addDays } from '../../helpers/date.helpers.js'
import addressData from '../../data/address.data.js'
import companyAddressData from '../../data/company-address.data.js'
import companyData from '../../data/company.data.js'
import { conditionExternalId } from './conditions.helpers.js'
import licenceDocumentRoleData from '../../data/licence-document-role.data.js'
import licenceVersionData from '../../data/licence-version.data.js'
import licenceVersionPurposeConditionData from '../../data/licence-version-purpose-condition.data.js'
import licenceVersionPurposeData from '../../data/licence-version-purpose.data.js'
import licenceVersionPurposePointData from '../../data/licence-version-purpose-point.data.js'
import { addPurpose, purposesOn } from './purposes.helpers.js'

/**
 * Give a licence a new licence version because a purpose was added
 *
 * The new version is the next issue. It has every purpose the version before it had, and one more.
 *
 * @param {object} licenceEntity - the licence entity to change
 * @param {object} region - the region the licence is in
 *
 * @returns {object} the same licence entity
 */
export function addPurposeToNewVersion(licenceEntity, region) {
  const { previous, current } = _newLicenceVersion(licenceEntity, region)

  current.issue = previous.issue + 1

  addPurpose(licenceEntity, region)

  return licenceEntity
}

/**
 * Give a licence a new licence version because a detail on the last one was wrong
 *
 * The new version is the next increment of the same issue. Nothing else changes. It starts on `startDate` where it is
 * given one, and otherwise 60 days after the last.
 *
 * @param {object} licenceEntity - the licence entity to change
 * @param {object} region - the region the licence is in
 * @param {string} [startDate] - the date the new version starts, for example '2024-04-01'
 *
 * @returns {object} the same licence entity
 */
export function correct(licenceEntity, region, startDate) {
  const { previous, current } = _newLicenceVersion(licenceEntity, region, startDate)

  current.issue = previous.issue
  current.increment = previous.increment + 1

  return licenceEntity
}

/**
 * Give a licence a new licence version because it was transferred to a new licence holder
 *
 * The new version is the next issue, and is for a different company at a different address. The previous licence
 * holder's document role ends when their version does, and the new licence holder's starts when theirs does. It starts
 * on `startDate` where it is given one, and otherwise 60 days after the last.
 *
 * @param {object} licenceEntity - the licence entity to change
 * @param {object} region - the region the licence is in
 * @param {string} [startDate] - the date the new version starts, for example '2024-04-01'
 *
 * @returns {object} the same licence entity
 */
export function transfer(licenceEntity, region, startDate) {
  const { licenceDocument } = licenceEntity
  const { previous, current } = _newLicenceVersion(licenceEntity, region, startDate)

  const company = companyData(region)
  const address = addressData()

  current.issue = previous.issue + 1
  current.companyId = company.id
  current.addressId = address.id

  const previousRole = licenceEntity.licenceDocumentRoles.at(-1)
  const currentRole = licenceDocumentRoleData(licenceDocument, company, address)

  previousRole.endDate = previous.endDate
  currentRole.startDate = current.startDate

  // If the licence has already ended, so has its licence document. The new licence holder's role ends with it
  if (licenceDocument.endDate) {
    currentRole.endDate = licenceDocument.endDate
  }

  licenceEntity.companies.push(company)
  licenceEntity.addresses.push(address)
  licenceEntity.companyAddresses.push(companyAddressData(company, address))
  licenceEntity.licenceDocumentRoles.push(currentRole)

  licenceEntity.licenceDocumentHeader.metadata.Name = company.name
  licenceEntity.licenceDocumentHeader.metadata.contacts[0].name = company.name

  return licenceEntity
}

/**
 * Why a licence version changed from the one before it
 *
 * A licence version for a new licence holder is a transfer. One with the same issue is a correction. Any other is a new
 * issue for the same licence holder, which is a purpose being added.
 *
 * @param {object} previousLicenceVersion - the licence version before it
 * @param {object} licenceVersion - the licence version that changed
 *
 * @returns {string} 'transfer', 'correction' or 'new-issue'
 */
export function licenceVersionChange(previousLicenceVersion, licenceVersion) {
  if (licenceVersion.companyId !== previousLicenceVersion.companyId) {
    return 'transfer'
  }

  if (licenceVersion.issue === previousLicenceVersion.issue) {
    return 'correction'
  }

  return 'new-issue'
}

/**
 * The licence version in force on a date, which is the latest one to start on or before it
 *
 * @param {object} licenceEntity - the licence entity to look in
 * @param {string} date - the date, for example '2025-04-01'
 *
 * @returns {object} the licence version
 */
export function licenceVersionOn(licenceEntity, date) {
  const startedBefore = licenceEntity.licenceVersions.filter((licenceVersion) => {
    return licenceVersion.startDate <= date
  })

  return startedBefore.at(-1)
}

/**
 * Supersede a licence's latest licence version and add a new current one
 *
 * The new version starts on `startDate` where it is given one, and otherwise 60 days after the one it replaces, which
 * ends the day before. It is for the same licence
 * holder, and has a copy of every purpose the version it replaces had, each linked to the same points and with the same
 * conditions.
 *
 * The caller sets the new version's issue and increment, as that depends on why the version changed.
 *
 * @private
 */
function _newLicenceVersion(licenceEntity, region, startDate) {
  const { licence } = licenceEntity

  const previous = licenceEntity.licenceVersions.at(-1)
  const current = licenceVersionData(licence, { id: previous.companyId }, { id: previous.addressId }, region)

  current.startDate = startDate ?? addDays(previous.startDate, 60)

  previous.status = 'superseded'
  previous.endDate = addDays(current.startDate, -1)

  const previousPurposes = purposesOn(licenceEntity, previous)

  for (const previousPurpose of previousPurposes) {
    const purpose = licenceVersionPurposeData(current, region)

    purpose.purposeId.value = previousPurpose.purposeId.value

    const previousPurposePoints = licenceEntity.licenceVersionPurposePoints.filter((licenceVersionPurposePoint) => {
      return licenceVersionPurposePoint.licenceVersionPurposeId === previousPurpose.id
    })

    for (const previousPurposePoint of previousPurposePoints) {
      licenceEntity.licenceVersionPurposePoints.push(
        licenceVersionPurposePointData(purpose, { id: previousPurposePoint.pointId })
      )
    }

    licenceEntity.licenceVersionPurposes.push(purpose)

    const previousConditions = (licenceEntity.licenceVersionPurposeConditions ?? []).filter((condition) => {
      return condition.licenceVersionPurposeId === previousPurpose.id
    })

    for (const previousCondition of previousConditions) {
      const condition = licenceVersionPurposeConditionData(purpose)

      condition.licenceVersionPurposeConditionTypeId.value =
        previousCondition.licenceVersionPurposeConditionTypeId.value
      condition.externalId = conditionExternalId(licenceEntity, purpose)

      licenceEntity.licenceVersionPurposeConditions.push(condition)
    }
  }

  licenceEntity.licenceVersions.push(current)

  return { previous, current }
}
