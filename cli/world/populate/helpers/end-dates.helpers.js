import LicenceModel from '../../../../src/models/licence.model.js'
import { formatDateToIso, relativeToToday } from '../../helpers/date.helpers.js'

/**
 * Revoke a licence 30 days ago
 *
 * The most common end date.
 *
 * @param {object} licenceEntity - the licence entity to change
 *
 * @returns {object} the same licence entity
 */
export function revoke(licenceEntity) {
  const revokedDate = formatDateToIso(relativeToToday(-30))

  licenceEntity.licence.revokedDate = revokedDate
  _endDocument(licenceEntity, revokedDate)

  return licenceEntity
}

/**
 * Expire a licence 90 days ago
 *
 * The second most common end date.
 *
 * @param {object} licenceEntity - the licence entity to change
 *
 * @returns {object} the same licence entity
 */
export function expire(licenceEntity) {
  const expiredDate = formatDateToIso(relativeToToday(-90))

  licenceEntity.licence.expiredDate = expiredDate
  _endDocument(licenceEntity, expiredDate)

  return licenceEntity
}

/**
 * Set a licence to expire a year from now
 *
 * Uncommon. The licence has not ended yet, so its licence document and document role are left open.
 *
 * @param {object} licenceEntity - the licence entity to change
 *
 * @returns {object} the same licence entity
 */
export function expireInFuture(licenceEntity) {
  licenceEntity.licence.expiredDate = formatDateToIso(relativeToToday(365))

  return licenceEntity
}

/**
 * Lapse a licence 60 days ago
 *
 * Uncommon.
 *
 * @param {object} licenceEntity - the licence entity to change
 *
 * @returns {object} the same licence entity
 */
export function lapse(licenceEntity) {
  const lapsedDate = formatDateToIso(relativeToToday(-60))

  licenceEntity.licence.lapsedDate = lapsedDate
  _endDocument(licenceEntity, lapsedDate)

  return licenceEntity
}

/**
 * The date a licence ended or will end, which is the earliest of when it expired, lapsed and was revoked
 *
 * @param {object} licenceEntity - the licence entity whose end dates to use
 *
 * @returns {string|null} the date as YYYY-MM-DD, for example '2024-03-31', or null where the licence has no end date
 */
export function licenceEndDate(licenceEntity) {
  const ends = licenceModel(licenceEntity).$ends()

  return ends ? formatDateToIso(ends.date) : null
}

/**
 * The engine's licence model for a licence's end dates, so we can use what it works out from them
 *
 * The model compares the dates as `Date`s, so ours are converted for it.
 *
 * @param {object} licenceEntity - the licence entity whose end dates to use
 *
 * @returns {object} a licence model with the licence's expired, lapsed and revoked dates
 */
export function licenceModel(licenceEntity) {
  const { expiredDate, lapsedDate, revokedDate } = licenceEntity.licence

  return LicenceModel.fromJson({
    expiredDate: expiredDate ? new Date(expiredDate) : null,
    lapsedDate: lapsedDate ? new Date(lapsedDate) : null,
    revokedDate: revokedDate ? new Date(revokedDate) : null
  })
}

/**
 * End the licence document and document role on the date the licence ended
 *
 * When a licence has more than one end date they end on the earliest.
 *
 * @private
 */
function _endDocument(licenceEntity, endDate) {
  const { licenceDocument, licenceDocumentRoles } = licenceEntity

  if (licenceDocument.endDate && licenceDocument.endDate < endDate) {
    return
  }

  licenceDocument.endDate = endDate
  licenceDocumentRoles[0].endDate = endDate
}
