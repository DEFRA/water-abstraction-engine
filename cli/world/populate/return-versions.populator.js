import { addDays } from '../helpers/date.helpers.js'
import { isQuarterlyReturnSubmissions } from '../../../src/lib/dates.lib.js'
import { licenceEndDate } from './helpers/end-dates.helpers.js'
import { purposesOn } from './helpers/purposes.helpers.js'
import returnRequirementData from '../data/return-requirement.data.js'
import returnRequirementPointData from '../data/return-requirement-point.data.js'
import returnRequirementPurposeData from '../data/return-requirement-purpose.data.js'
import returnVersionData from '../data/return-version.data.js'
import { users } from '../default-values.js'
import { licenceVersionChange, licenceVersionOn } from './helpers/licence-versions.helpers.js'

// The date the import of return versions from NALD was removed. Return versions that start on or after it were set up
// in the service instead.
const NALD_IMPORT_END_DATE = '2025-07-01'

/**
 * Give the licences their return versions
 *
 * Each licence is given empty lists for its return versions, then its return versions follow its licence versions.
 * A few are then moved so they do not line up with their licence versions. Then water companies change to quarterly
 * returns from 1 April 2025, and a few licences have their latest return version replaced.
 *
 * Call this after everything else has been added to the licences, as the return versions follow their final licence
 * versions, purposes and points.
 *
 * @param {object[]} licenceEntities - the licence entities to give return versions
 */
export default function returnVersions(licenceEntities) {
  _addReturnLists(licenceEntities)
  _followLicenceVersions(licenceEntities)
  _misalignSome(licenceEntities)
  _quarterlyForWaterCompanies(licenceEntities)
  _replaceSome(licenceEntities)
}

/**
 * Give every licence empty lists for its return versions, return requirements, and their points and purposes
 *
 * The steps that follow add to them. They are added last, as the load service loads tables in the order their keys
 * first appear, and return versions refer to licences and points.
 *
 * @private
 */
function _addReturnLists(licenceEntities) {
  for (const licenceEntity of licenceEntities) {
    licenceEntity.returnVersions = []
    licenceEntity.returnRequirements = []
    licenceEntity.returnRequirementPoints = []
    licenceEntity.returnRequirementPurposes = []
  }
}

/**
 * Give every licence a return version for each of its licence versions
 *
 * Each licence version that started before the licence ended, or on the day it did, has a return version. It starts
 * when the licence version did and ends when it did. The last one has no end date, even where the licence has ended,
 * as a return version is not ended when its licence is. They are numbered from 100 in order. The first was made for a
 * new licence, and each one after for why its licence version changed.
 *
 * A water company's return versions are for quarterly returns, but only where they start on or after 1 April 2025, as
 * quarterly returns cannot be set on one that starts before.
 *
 * Those that start before the import from NALD was removed were imported from NALD, so they and their return
 * requirements, points and purposes have NALD external ids. The NALD region and licence id are taken from the licence's
 * first licence version, whose external id starts with them. The rest were set up in the service, so they were created
 * by the billing and data user, and their return requirements have the site descriptions the service gives them.
 *
 * @private
 */
function _followLicenceVersions(licenceEntities) {
  const FIRST_VERSION = 100

  for (const licenceEntity of licenceEntities) {
    const [naldRegionId, naldLicenceId] = licenceEntity.licenceVersions[0].externalId.split(':')
    const endDate = licenceEndDate(licenceEntity)
    const licenceVersions = licenceEntity.licenceVersions.filter((licenceVersion) => {
      return !endDate || licenceVersion.startDate <= endDate
    })

    for (let i = 0; i < licenceVersions.length; i++) {
      const licenceVersion = licenceVersions[i]
      const returnVersion = _addReturnVersion(licenceEntity, licenceVersion, licenceVersion.startDate)

      returnVersion.endDate = i < licenceVersions.length - 1 ? licenceVersion.endDate : null
      returnVersion.version = FIRST_VERSION + i
      returnVersion.reason = i === 0 ? 'new-licence' : _reason(licenceVersions[i - 1], licenceVersion)
      returnVersion.quarterlyReturns =
        licenceEntity.licence.waterUndertaker && isQuarterlyReturnSubmissions(returnVersion.startDate)

      if (returnVersion.startDate < NALD_IMPORT_END_DATE) {
        _importedFromNald(licenceEntity, returnVersion, naldRegionId, naldLicenceId)
      } else {
        returnVersion.createdBy = users.BILLING_AND_DATA.userId

        _siteDescriptionsFromPoints(licenceEntity, returnVersion)
      }
    }
  }
}

/**
 * Make a return version, and its return requirements, points and purposes, look as the import from NALD left them
 *
 * The import set whether a return version is for multiple uploads from whether its return requirements are uploads,
 * so its return requirements are uploads where it is for multiple uploads.
 *
 * In NALD a return requirement is a return format, and its id is the return requirement's legacy id. So the ids are:
 *
 * - return version - region, licence id and version
 * - return requirement - region and return format id
 * - return requirement point - region, return format id and the point's NALD id, which ends the point's external id
 * - return requirement purpose - region, return format id, then the primary, secondary and purpose codes
 *
 * Call this after the return version's version has been set.
 *
 * @private
 */
function _importedFromNald(licenceEntity, returnVersion, naldRegionId, naldLicenceId) {
  returnVersion.externalId = `${naldRegionId}:${naldLicenceId}:${returnVersion.version}`

  const returnRequirements = licenceEntity.returnRequirements.filter((returnRequirement) => {
    return returnRequirement.returnVersionId === returnVersion.id
  })

  for (const returnRequirement of returnRequirements) {
    const returnFormatId = `${naldRegionId}:${returnRequirement.legacyId}`

    returnRequirement.upload = returnVersion.multipleUpload
    returnRequirement.externalId = returnFormatId

    for (const returnRequirementPoint of licenceEntity.returnRequirementPoints) {
      if (returnRequirementPoint.returnRequirementId !== returnRequirement.id) {
        continue
      }

      const point = licenceEntity.points.find((point) => {
        return point.id === returnRequirementPoint.pointId
      })
      const naldPointId = point.externalId.split(':')[1]

      returnRequirementPoint.externalId = `${returnFormatId}:${naldPointId}`
    }

    for (const returnRequirementPurpose of licenceEntity.returnRequirementPurposes) {
      if (returnRequirementPurpose.returnRequirementId !== returnRequirement.id) {
        continue
      }

      const { primaryPurposeId, secondaryPurposeId, purposeId } = returnRequirementPurpose

      returnRequirementPurpose.externalId = `${returnFormatId}:${primaryPurposeId.value}:${secondaryPurposeId.value}:${purposeId.value}`
    }
  }
}

/**
 * Move the second return version of a few licences so it does not start when its licence version did
 *
 * In NALD a return version does not always line up with a licence version. So every 20th licence with more than one
 * return version, starting with the 20th, has its second return version start on the 1 April after its licence version
 * started, as returns are often changed from the start of a return cycle. The return version before it ends the day
 * before. A licence is left alone where that date is after the second return version ends, or after the licence
 * ended, or on or after the import from NALD was removed, as only NALD return versions are misaligned this way.
 *
 * @private
 */
function _misalignSome(licenceEntities) {
  const MISALIGNED_EVERY = 20

  const licenceEntitiesWithChanges = licenceEntities.filter((licenceEntity) => {
    return licenceEntity.returnVersions.length > 1
  })

  const licenceEntitiesToMisalign = licenceEntitiesWithChanges.filter((_licenceEntity, index) => {
    return index % MISALIGNED_EVERY === MISALIGNED_EVERY - 1
  })

  for (const licenceEntity of licenceEntitiesToMisalign) {
    const [firstReturnVersion, secondReturnVersion] = licenceEntity.returnVersions
    const startDate = _nextFirstOfApril(secondReturnVersion.startDate)
    const endDate = licenceEndDate(licenceEntity)

    if (secondReturnVersion.endDate && startDate > secondReturnVersion.endDate) {
      continue
    }

    if (endDate && startDate > endDate) {
      continue
    }

    if (startDate >= NALD_IMPORT_END_DATE) {
      continue
    }

    secondReturnVersion.startDate = startDate
    firstReturnVersion.endDate = addDays(startDate, -1)
  }
}

/**
 * Give every water company licence a new return version for quarterly returns from 1 April 2025
 *
 * Water companies changed to quarterly returns from 1 April 2025, the first date quarterly returns can be set on a
 * return version. Each water company licence that had not ended before then, and whose last return version starts
 * before then, has that return version ended the day before. A new one starts on 1 April 2025 for the licence version
 * in force on that date, for quarterly returns, as a change to the requirements for returns. It was set up in the
 * service, so it was created by the billing and data user, and has no NALD external ids.
 *
 * @private
 */
function _quarterlyForWaterCompanies(licenceEntities) {
  const QUARTERLY_START_DATE = '2025-04-01'
  const DAY_BEFORE = '2025-03-31'

  for (const licenceEntity of licenceEntities) {
    if (!licenceEntity.licence.waterUndertaker) {
      continue
    }

    const endDate = licenceEndDate(licenceEntity)

    if (endDate && endDate < QUARTERLY_START_DATE) {
      continue
    }

    const lastReturnVersion = licenceEntity.returnVersions.at(-1)

    if (lastReturnVersion.startDate >= QUARTERLY_START_DATE) {
      continue
    }

    const licenceVersion = licenceVersionOn(licenceEntity, QUARTERLY_START_DATE)
    const returnVersion = _addReturnVersion(licenceEntity, licenceVersion, QUARTERLY_START_DATE)

    lastReturnVersion.endDate = DAY_BEFORE

    returnVersion.endDate = null
    returnVersion.version = lastReturnVersion.version + 1
    returnVersion.reason = 'change-to-return-requirements'
    returnVersion.quarterlyReturns = true
    returnVersion.createdBy = users.BILLING_AND_DATA.userId

    _siteDescriptionsFromPoints(licenceEntity, returnVersion)
  }
}

/**
 * Replace the latest return version of a few licences, as the service does when a return version is set up with the
 * same start date as one already there
 *
 * Every 100th licence that is not held by a water company, starting with the 50th, had its latest return version
 * corrected in the service. The latest is superseded, and a new one replaces it with the same start and end dates, for
 * the licence version in force when it starts. It is the next version, made for an error correction by the billing and
 * data user, so it has no NALD external ids. A water company's licences are left alone, as their latest return version
 * is for quarterly returns.
 *
 * @private
 */
function _replaceSome(licenceEntities) {
  const REPLACED_EVERY = 100
  const FIRST_REPLACED = 50

  const otherLicenceEntities = licenceEntities.filter((licenceEntity) => {
    return !licenceEntity.licence.waterUndertaker
  })

  const licenceEntitiesToReplace = otherLicenceEntities.filter((_licenceEntity, index) => {
    return index % REPLACED_EVERY === FIRST_REPLACED - 1
  })

  for (const licenceEntity of licenceEntitiesToReplace) {
    const latestReturnVersion = licenceEntity.returnVersions.at(-1)
    const licenceVersion = licenceVersionOn(licenceEntity, latestReturnVersion.startDate)
    const returnVersion = _addReturnVersion(licenceEntity, licenceVersion, latestReturnVersion.startDate)

    latestReturnVersion.status = 'superseded'

    returnVersion.endDate = latestReturnVersion.endDate
    returnVersion.version = latestReturnVersion.version + 1
    returnVersion.reason = 'error-correction'
    returnVersion.quarterlyReturns = false
    returnVersion.createdBy = users.BILLING_AND_DATA.userId

    _siteDescriptionsFromPoints(licenceEntity, returnVersion)
  }
}

/**
 * Give the return requirements of a return version set up in the service the site description the service gives them
 *
 * When the service generates return requirements from a licence's abstraction data, a return requirement's site
 * description is the description of the first point it is for. Return requirements imported from NALD keep their own,
 * as NALD holds it as free text against the return format.
 *
 * @private
 */
function _siteDescriptionsFromPoints(licenceEntity, returnVersion) {
  const returnRequirements = licenceEntity.returnRequirements.filter((returnRequirement) => {
    return returnRequirement.returnVersionId === returnVersion.id
  })

  for (const returnRequirement of returnRequirements) {
    const firstReturnRequirementPoint = licenceEntity.returnRequirementPoints.find((returnRequirementPoint) => {
      return returnRequirementPoint.returnRequirementId === returnRequirement.id
    })
    const firstPoint = licenceEntity.points.find((point) => {
      return point.id === firstReturnRequirementPoint.pointId
    })

    returnRequirement.siteDescription = firstPoint.description
  }
}

/**
 * Add a return version for a licence version to the licence, starting on `startDate`, and return it so the caller can
 * set its end date, version and reason
 *
 * As when the service generates return requirements from a licence's abstraction data, it has one return requirement
 * for each purpose on the licence version, from every point that purpose abstracts from. No purpose is given an alias,
 * as the service leaves it empty, so the purpose's own description is shown. Each is on the summer returns cycle where
 * its purpose abstracts only between April and October, and the winter and all year one otherwise. How often its
 * readings are collected and reported depends on the licence and purpose, as the service decides it. Its returns are
 * yearly, as the service sets them.
 *
 * None of them has an external id until it is given a NALD one, as only records imported from NALD have them. It is set
 * to null, as otherwise the load service's helpers would make up a random one.
 *
 * It relies on every licence version having a purpose, and every purpose a point, which is how the licences populator
 * builds them and how a new licence version copies them.
 *
 * @private
 */
function _addReturnVersion(licenceEntity, licenceVersion, startDate) {
  const returnVersion = returnVersionData(licenceEntity.licence)

  returnVersion.startDate = startDate
  returnVersion.externalId = null

  licenceEntity.returnVersions.push(returnVersion)

  for (const licenceVersionPurpose of purposesOn(licenceEntity, licenceVersion)) {
    const returnRequirement = returnRequirementData(returnVersion, licenceVersionPurpose)

    returnRequirement.summer = _summer(returnRequirement)
    returnRequirement.collectionFrequency = _collectionFrequency(licenceEntity, licenceVersionPurpose, startDate)
    returnRequirement.reportingFrequency = _reportingFrequency(licenceEntity, licenceVersionPurpose)
    returnRequirement.returnsFrequency = 'year'
    returnRequirement.externalId = null

    licenceEntity.returnRequirements.push(returnRequirement)

    const returnRequirementPurpose = returnRequirementPurposeData(returnRequirement, licenceVersionPurpose)

    returnRequirementPurpose.alias = null
    returnRequirementPurpose.externalId = null

    licenceEntity.returnRequirementPurposes.push(returnRequirementPurpose)

    const licenceVersionPurposePoints = licenceEntity.licenceVersionPurposePoints.filter(
      (licenceVersionPurposePoint) => {
        return licenceVersionPurposePoint.licenceVersionPurposeId === licenceVersionPurpose.id
      }
    )

    for (const licenceVersionPurposePoint of licenceVersionPurposePoints) {
      const returnRequirementPoint = returnRequirementPointData(returnRequirement, {
        id: licenceVersionPurposePoint.pointId
      })

      returnRequirementPoint.externalId = null

      licenceEntity.returnRequirementPoints.push(returnRequirementPoint)
    }
  }

  return returnVersion
}

/**
 * How often a return requirement's readings are collected
 *
 * As when the service generates return requirements from a licence's abstraction data, they are collected daily for a
 * water company, and for a two-part tariff irrigation purpose on a licence with a two-part tariff (S127) agreement in
 * place when the return version starts. Otherwise they are collected weekly where the purpose abstracts more than 2,500
 * cubic metres a day, and monthly where it does not. The service also collects daily for electricity generation, which
 * is not checked as no licence in the world abstracts for it.
 *
 * It relies on the charging populator having given every licence its list of agreements.
 *
 * @private
 */
function _collectionFrequency(licenceEntity, licenceVersionPurpose, startDate) {
  const TWO_PART_IRRIGATION_PURPOSES = ['380', '390', '400', '410', '420', '600', '620']

  if (licenceEntity.licence.waterUndertaker) {
    return 'day'
  }

  const twoPartTariffAgreement = licenceEntity.licenceAgreements.some((licenceAgreement) => {
    return (
      licenceAgreement.financialAgreementId.value === 'S127' &&
      licenceAgreement.startDate <= startDate &&
      (!licenceAgreement.endDate || licenceAgreement.endDate >= startDate)
    )
  })

  if (twoPartTariffAgreement && TWO_PART_IRRIGATION_PURPOSES.includes(String(licenceVersionPurpose.purposeId.value))) {
    return 'day'
  }

  return _weeklyOrMonthly(licenceVersionPurpose)
}

/**
 * How often a return requirement's readings are reported
 *
 * As when the service generates return requirements from a licence's abstraction data, they are reported daily for a
 * water company. Otherwise they are reported weekly where the purpose abstracts more than 2,500 cubic metres a day, and
 * monthly where it does not. The service also reports daily for electricity generation, which is not checked as no
 * licence in the world abstracts for it.
 *
 * @private
 */
function _reportingFrequency(licenceEntity, licenceVersionPurpose) {
  if (licenceEntity.licence.waterUndertaker) {
    return 'day'
  }

  return _weeklyOrMonthly(licenceVersionPurpose)
}

/**
 * Weekly where a purpose abstracts more than 2,500 cubic metres a day, and monthly where it does not
 *
 * @private
 */
function _weeklyOrMonthly(licenceVersionPurpose) {
  const DAILY_CUBIC_METRES_THRESHOLD = 2500

  if (licenceVersionPurpose.dailyQuantity > DAILY_CUBIC_METRES_THRESHOLD) {
    return 'week'
  }

  return 'month'
}

/**
 * Whether a return requirement is on the summer returns cycle
 *
 * As when the service generates return requirements from a licence's abstraction data, it is where the abstraction
 * period starts and ends in April to October, and does not run over the end of the year. Only the months are checked.
 *
 * @private
 */
function _summer(returnRequirement) {
  const SUMMER_MONTHS = [4, 5, 6, 7, 8, 9, 10]

  const { abstractionPeriodStartMonth, abstractionPeriodEndMonth } = returnRequirement

  if (abstractionPeriodStartMonth > abstractionPeriodEndMonth) {
    return false
  }

  return SUMMER_MONTHS.includes(abstractionPeriodStartMonth) && SUMMER_MONTHS.includes(abstractionPeriodEndMonth)
}

/**
 * The reason for a return version, from why its licence version changed from the one before
 *
 * A transfer is a succession or transfer of the licence, a correction is a minor change, and a new issue is a major
 * change.
 *
 * @private
 */
function _reason(previousLicenceVersion, licenceVersion) {
  const REASONS = {
    transfer: 'succession-or-transfer-of-licence',
    correction: 'minor-change',
    'new-issue': 'major-change'
  }

  return REASONS[licenceVersionChange(previousLicenceVersion, licenceVersion)]
}

/**
 * The 1 April after a date, for example '2024-04-01' for '2023-06-15', and '2025-04-01' for '2024-04-01'
 *
 * @private
 */
function _nextFirstOfApril(date) {
  const year = Number(date.slice(0, 4))
  const firstOfApril = `${year}-04-01`

  return date < firstOfApril ? firstOfApril : `${year + 1}-04-01`
}
