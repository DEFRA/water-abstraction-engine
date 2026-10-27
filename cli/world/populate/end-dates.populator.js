import { formatDateToIso, today } from '../helpers/date.helpers.js'

// How many years after they started the licences that have ended were held for, by how they ended. Each licence takes
// the next one in the list for how it ended, going back to the start of the list when it runs out. A licence that has
// not ended does not use the one it takes.
//
// A licence that expired was mostly held for about ten years. One that lapsed or was revoked was often held for
// decades. Where a licence started too recently to have been held for the number of years it takes, it uses the next
// one in the list that fits. Each list is a different length to the start dates and any of the groups of licences, so a
// kind of licence does not always end at the same time.
const YEARS_HELD = {
  expired: [9, 5, 11, 2, 15, 7, 10],
  lapsed: [23, 10, 34, 3, 39, 16, 28],
  revoked: [14, 5, 28, 2, 40, 9, 20]
}

// The date many licences were revoked on. Two of every three licences that were revoked, and that started long enough
// before it, are revoked on this date rather than a number of years after they started.
const REVOKED_ON = '2005-03-31'

/**
 * Move when the licences that have ended did so
 *
 * Each one that has ended is moved to end the next number of years after it started. Then two of every three are moved
 * to the date many licences were revoked on, where they were revoked and started before it.
 *
 * Call this after everything has been added to the licences.
 *
 * @param {object[]} licenceEntities - the licence entities to change
 */
export default function endDates(licenceEntities) {
  for (let i = 0; i < licenceEntities.length; i++) {
    _endAfter(licenceEntities[i], YEARS_HELD, i)

    if (i % 3 !== 2) {
      _revokeOn(licenceEntities[i], REVOKED_ON)
    }
  }
}

/**
 * End a licence a number of years after it started
 *
 * A licence that has ended is built ending in the last few months. This moves the end back, to a number of years after
 * the licence started.
 *
 * The number comes from the list for how the licence ended: expired, lapsed or revoked. Where it has more than one end
 * date it is the list for the first of them, in that order. The licence takes the number at `first` in the list, going
 * back to the start of the list when it runs out. Where the licence started too recently to have been held for that
 * many years it takes the next number in the list that fits.
 *
 * Where the licence has more than one end date they stay in the same order 30 days apart: expired, then lapsed, then
 * revoked. Its licence document, and the licence holder's document role, end on the first.
 *
 * A licence that has not ended is left alone, and so is an expiry date in the future.
 *
 * @private
 */
function _endAfter(licenceEntity, yearsHeld, first) {
  const { licence, licenceDocument } = licenceEntity

  if (!licenceDocument.endDate) {
    return licenceEntity
  }

  let yearsHeldForEndType = yearsHeld.revoked

  if (_inThePast(licence.expiredDate)) {
    yearsHeldForEndType = yearsHeld.expired
  } else if (licence.lapsedDate) {
    yearsHeldForEndType = yearsHeld.lapsed
  }

  const endDate = _endDateThatFits(licence, licenceDocument.endDate, yearsHeldForEndType, first)

  if (endDate) {
    _moveEnd(licenceEntity, endDate)
  }

  return licenceEntity
}

/**
 * Revoke a licence on a given date
 *
 * This is for a licence that has already been revoked, to move when it was to a date many licences were revoked on.
 *
 * The licence is left alone unless being revoked is the only way it has ended, so one that has also lapsed or expired
 * is. So is one whose last licence version started on or after the date.
 *
 * @private
 */
function _revokeOn(licenceEntity, date) {
  const { licence } = licenceEntity
  const licenceVersions = licenceEntity.licenceVersions

  if (!licence.revokedDate || licence.lapsedDate || _inThePast(licence.expiredDate)) {
    return licenceEntity
  }

  if (licenceVersions.at(-1).startDate >= date) {
    return licenceEntity
  }

  _moveEnd(licenceEntity, new Date(date))

  return licenceEntity
}

/**
 * The first end date, going through the list of years held from `first`, that is earlier than the licence ends now
 *
 * @private
 */
function _endDateThatFits(licence, previousEndDate, yearsHeld, first) {
  for (let i = 0; i < yearsHeld.length; i++) {
    const endDate = new Date(licence.startDate)

    endDate.setUTCFullYear(endDate.getUTCFullYear() + yearsHeld[(first + i) % yearsHeld.length])

    if (formatDateToIso(endDate) < previousEndDate) {
      return endDate
    }
  }

  return null
}

/**
 * Whether an end date is set and is before today
 *
 * @private
 */
function _inThePast(date) {
  return Boolean(date) && date < formatDateToIso(today())
}

/**
 * Move the end of a licence that has ended to the given date
 *
 * The licence document and the licence holder's document role end on the date. So does the first end date the licence
 * has in the past, in the order expired, lapsed, revoked. Any others follow 30 days apart.
 *
 * @private
 */
function _moveEnd(licenceEntity, endDate) {
  const { licence, licenceDocument } = licenceEntity
  const previousEndDate = licenceDocument.endDate
  const licenceDocumentRoles = licenceEntity.licenceDocumentRoles

  for (const licenceDocumentRole of licenceDocumentRoles) {
    if (licenceDocumentRole.endDate === previousEndDate) {
      licenceDocumentRole.endDate = formatDateToIso(endDate)
    }
  }

  licenceDocument.endDate = formatDateToIso(endDate)

  for (const endType of ['expiredDate', 'lapsedDate', 'revokedDate']) {
    if (_inThePast(licence[endType])) {
      licence[endType] = formatDateToIso(endDate)

      endDate.setUTCDate(endDate.getUTCDate() + 30)
    }
  }
}
