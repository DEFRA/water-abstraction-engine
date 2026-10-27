import { REGIONS } from './helpers/regions.helpers.js'
import { addCondition } from './helpers/conditions.helpers.js'
import { addPoint } from './helpers/points.helpers.js'
import { addPurpose } from './helpers/purposes.helpers.js'
import { asArrays } from '../helpers/wire-format.helpers.js'
import buildLicenceEntity from '../entities/licence.entity.js'
import { addPurposeToNewVersion, correct, transfer } from './helpers/licence-versions.helpers.js'
import { expire, expireInFuture, lapse, revoke } from './helpers/end-dates.helpers.js'

/**
 * Build the licences that populate the world
 *
 * Each region gets its number of licences from each group: common, fairly common, uncommon, rare and very rare. Each
 * group has its own list of licence types, and its own function that builds them.
 *
 * Each licence type says how the licence ends, in the order the ends are applied, and how many licence versions,
 * purposes, points and conditions it has. Any left out stay as the licence was built. The licence types in a group are
 * seen about as often as each other, so a group's licences are shared equally between its licence types. Where one
 * licence type is seen more than the rest of its group it is in the list more than once. Each list is most common
 * first, so a small region that can not have them all gets the ones seen most.
 *
 * A live licence either has no end date or expires in the future. About a third of them expire in the future, so about
 * a third of the live licence types are built that way. An ended licence is mostly revoked, but some have expired or
 * lapsed, so a few of the ended licence types are built those ways.
 *
 * @returns {object[]} the licence entities
 */
export default function licences() {
  const licenceEntities = []

  for (const { region, common, fairlyCommon, uncommon, rare, veryRare } of REGIONS) {
    _common(region, common, licenceEntities)
    _fairlyCommon(region, fairlyCommon, licenceEntities)
    _uncommon(region, uncommon, licenceEntities)
    _rare(region, rare, licenceEntities)
    _veryRare(region, veryRare, licenceEntities)
  }

  return licenceEntities
}

/**
 * Build a region's common licences
 *
 * Revoked is seen about four times as often as expired.
 *
 * @private
 */
function _common(region, count, licenceEntities) {
  const COMMON = [{ ends: [revoke] }, { ends: [revoke] }, { ends: [expire] }, { ends: [revoke] }, { ends: [revoke] }]

  _buildLicences(region, count, COMMON, licenceEntities)
}

/**
 * Build a region's fairly common licences
 *
 * @private
 */
function _fairlyCommon(region, count, licenceEntities) {
  const FAIRLY_COMMON = [
    { ends: [lapse] },
    { ends: [revoke], conditions: 1 },
    { ends: [revoke], versions: 2 },
    { ends: [expire, revoke] }
  ]

  _buildLicences(region, count, FAIRLY_COMMON, licenceEntities)
}

/**
 * Build a region's uncommon licences
 *
 * @private
 */
function _uncommon(region, count, licenceEntities) {
  const UNCOMMON = [
    { ends: [], versions: 2 },
    { ends: [], conditions: 1 },
    { ends: [] },
    { ends: [expireInFuture], versions: 3 },
    { ends: [expire], points: 2 },
    { ends: [], versions: 4 },
    { ends: [expire], versions: 2, conditions: 1 },
    { ends: [lapse], purposes: 2, points: 2 },
    { ends: [expireInFuture], versions: 2, conditions: 1 },
    { ends: [], conditions: 4 },
    { ends: [revoke], conditions: 2 },
    { ends: [revoke], purposes: 2 },
    { ends: [revoke], purposes: 2, conditions: 4 },
    { ends: [expireInFuture], versions: 4, conditions: 1 },
    { ends: [revoke], versions: 3 }
  ]

  _buildLicences(region, count, UNCOMMON, licenceEntities)
}

/**
 * Build a region's rare licences
 *
 * @private
 */
function _rare(region, count, licenceEntities) {
  const RARE = [
    { ends: [expireInFuture] },
    { ends: [], versions: 3, conditions: 1 },
    { ends: [expireInFuture], conditions: 2 },
    { ends: [], versions: 2, conditions: 4 },
    { ends: [revoke], conditions: 3 },
    { ends: [], versions: 4, purposes: 2, conditions: 4 },
    { ends: [expireInFuture], versions: 2, conditions: 2 },
    { ends: [], versions: 4, conditions: 2 },
    { ends: [expireInFuture], versions: 4, conditions: 4 },
    { ends: [], purposes: 2, conditions: 4 },
    { ends: [expireInFuture, revoke] },
    { ends: [], conditions: 3 },
    { ends: [], versions: 2, purposes: 2, conditions: 4 },
    { ends: [expireInFuture], versions: 3, conditions: 2 },
    { ends: [], versions: 3, conditions: 4 },
    { ends: [], versions: 4, conditions: 3 },
    { ends: [], versions: 3, purposes: 2, conditions: 4 },
    { ends: [expireInFuture], versions: 2, conditions: 3 },
    { ends: [expire, lapse] }
  ]

  _buildLicences(region, count, RARE, licenceEntities)
}

/**
 * Build a region's very rare licences
 *
 * @private
 */
function _veryRare(region, count, licenceEntities) {
  const VERY_RARE = [{ ends: [expireInFuture, lapse] }, { ends: [lapse, revoke] }, { ends: [expire, lapse, revoke] }]

  _buildLicences(region, count, VERY_RARE, licenceEntities)
}

/**
 * Build the given number of licences in a region, each the next licence type in the list
 *
 * Each licence is given the next start date and the next purpose. The list of licence types goes back to the start
 * when it runs out.
 *
 * @private
 */
function _buildLicences(region, count, licenceTypes, licenceEntities) {
  for (let i = 0; i < count; i++) {
    const startDate = _startDate(licenceEntities)
    const purpose = _purpose(licenceEntities)
    const licenceType = licenceTypes[i % licenceTypes.length]

    licenceEntities.push(_build(region, startDate, purpose, licenceType))
  }
}

/**
 * Build a licence of the given licence type that starts on the given date and is used for the given purpose
 *
 * A licence is built starting at the beginning of the previous return cycle, so the licence and everything that starts
 * when it does are moved to the start date: its permit licence, licence document, licence document role and licence
 * version. Its purpose is changed to the given one. Where the licence started before 2000 its first licence version is
 * issue 100. Otherwise it is issue 1. These are all done before anything is added to the licence, as new licence
 * versions are dated, numbered and given purposes from the one before. It is then ended the ways its licence type says,
 * in order, and given its licence type's licence versions, purposes, points and conditions.
 *
 * @private
 */
function _build(region, startDate, purpose, licenceType) {
  const ISSUE_100_BEFORE = '2000-01-01'

  const licenceEntity = _asLists(buildLicenceEntity(region))

  licenceEntity.licence.startDate = startDate
  licenceEntity.permitLicence.startDate = startDate
  licenceEntity.licenceDocument.startDate = startDate
  licenceEntity.licenceDocumentRoles[0].startDate = startDate
  licenceEntity.licenceVersions[0].startDate = startDate

  licenceEntity.licenceVersionPurposes[0].purposeId.value = purpose

  if (startDate < ISSUE_100_BEFORE) {
    licenceEntity.licenceVersions[0].issue = 100
  }

  for (const end of licenceType.ends) {
    end(licenceEntity)
  }

  return _addVersionsPurposesPointsAndConditions(licenceEntity, region, licenceType)
}

/**
 * Turn the parts of a licence entity that a licence can have more than one of into lists
 *
 * The licence entity is built with one company, address, company address, licence document role, licence version,
 * licence version purpose, point and licence version purpose point. `asArrays` puts each into a list of one, under the
 * same name made plural, so the populators can add to them and never have to check which they are. The rest of the
 * entity is left as it is.
 *
 * The company, address and company address stay first, as everything else that refers to them is loaded after them.
 * The other lists go after the rest, in the order they are loaded in: a point before the licence version purpose
 * points that refer to it.
 *
 * @private
 */
function _asLists(licenceEntity) {
  const {
    company,
    address,
    companyAddress,
    licenceDocumentRole,
    licenceVersion,
    licenceVersionPurpose,
    point,
    licenceVersionPurposePoint,
    ...rest
  } = licenceEntity

  return {
    ...asArrays({ company, address, companyAddress }),
    ...rest,
    ...asArrays({ licenceDocumentRole, licenceVersion, licenceVersionPurpose, point, licenceVersionPurposePoint })
  }
}

/**
 * The purpose for the next licence, which is the next in the list after the one the last licence was given
 *
 * About two thirds of licences are not two-part tariff, so about two thirds of the purposes are general farming and
 * domestic (140), which is not. The rest are spray irrigation direct (400), which is. The list is a different length to
 * the start dates and to any of the groups of licences, so a licence type is not always given the same purpose.
 *
 * @private
 */
function _purpose(licenceEntities) {
  const PURPOSES = ['140', '140', '400', '140', '140', '400', '140', '400', '140', '140', '400']

  return PURPOSES[licenceEntities.length % PURPOSES.length]
}

/**
 * The start date for the next licence, which is the next in the list after the one the last licence was given
 *
 * About half of all licences started in the 1960s, so about half of the dates are. The rest are shared between the
 * decades since in proportion. The list is a different length to any of the groups of licences, so a licence type is
 * not always given the same start date.
 *
 * @private
 */
function _startDate(licenceEntities) {
  const START_DATES = [
    '1965-04-01',
    '1972-04-01',
    '1966-04-01',
    '1994-04-01',
    '1963-04-01',
    '1985-04-01',
    '1967-04-01',
    '2004-04-01',
    '1961-04-01',
    '2013-04-01',
    '1968-04-01',
    '1991-04-01',
    '1964-04-01',
    '1978-04-01',
    '1969-04-01',
    '2022-04-01',
    '1962-04-01',
    '1988-04-01',
    '1960-04-01',
    '2008-04-01',
    '1965-04-01',
    '1997-04-01',
    '2017-04-01'
  ]

  return START_DATES[licenceEntities.length % START_DATES.length]
}

/**
 * Add licence versions, purposes, points and conditions to a licence
 *
 * The licence type says how many the licence ends up with. Any that are left out stay as the licence was built: one
 * licence version, one purpose, one point and no conditions.
 *
 * Purposes, points and conditions are added first, so that every licence version has them. Then the licence versions
 * are added, each for a reason: a transfer to a new licence holder, then a correction, then another transfer. Where the
 * licence has more than one version and more than one purpose, the last version is there because a purpose was added.
 *
 * @private
 */
function _addVersionsPurposesPointsAndConditions(licenceEntity, region, licenceType) {
  const { versions = 1, purposes = 1, points = 1, conditions = 0 } = licenceType

  const purposeAddedInLastVersion = versions > 1 && purposes > 1
  const purposesToAddNow = purposeAddedInLastVersion ? purposes - 2 : purposes - 1

  for (let i = 0; i < purposesToAddNow; i++) {
    addPurpose(licenceEntity, region)
  }

  for (let i = 1; i < points; i++) {
    addPoint(licenceEntity, region)
  }

  for (let i = 0; i < conditions; i++) {
    addCondition(licenceEntity)
  }

  const reasons = [transfer, correct, transfer]

  for (let i = 0; i < versions - 1; i++) {
    const lastVersion = i === versions - 2

    if (lastVersion && purposeAddedInLastVersion) {
      addPurposeToNewVersion(licenceEntity, region)
    } else {
      reasons[i](licenceEntity, region)
    }
  }

  return licenceEntity
}
