/**
 * The last presroc financial year (end year) — water-abstraction-service's batch-service.js caps presroc
 * supplementary billing at this year, and its legacy engine is never triggered for anything after it.
 * @type {number}
 */
export const PRESROC_LAST_FINANCIAL_YEAR = 2022

/**
 * The first sroc financial year (end year) — DetermineBillingPeriodsService in water-abstraction-system never
 * looks back further than this for sroc supplementary billing.
 * @type {number}
 */
export const SROC_FIRST_FINANCIAL_YEAR = 2023

/**
 * Adds a number of days to a date, or takes them away where `days` is negative
 *
 * @param {Date | string} date - The date to add the days to, for example '2024-04-01'
 * @param {number} days - The number of days to add, for example -1 for the day before
 *
 * @returns {string} The new date formatted as YYYY-MM-DD, for example '2024-03-31'
 */
export function addDays(date, days) {
  const result = new Date(date)

  result.setUTCDate(result.getUTCDate() + days)

  return formatDateToIso(result)
}

/**
 * Works out how many presroc and sroc billing periods a supplementary bill run is expected to generate bills for
 *
 * The two schemes are calculated independently, by two different engines, each with their own rule:
 *
 * - sroc (DetermineBillingPeriodsService in water-abstraction-system): up to 5 years back from
 * `financialYearToBaseItOn`, never earlier than 2023, the first sroc financial year.
 * - presroc (the legacy water-abstraction-service's batch-service.js): always exactly 5 years back from
 * `financialYearToBaseItOn`, but capped at 2022, the last presroc financial year, on both ends. Once
 * `financialYearToBaseItOn` is more than 5 years past 2022, that range inverts and there are no presroc periods
 * left to bill at all.
 *
 * For example
 *
 * - financialYearToBaseItOn is 2024 so result will be 2 sroc and 4 presroc
 * - financialYearToBaseItOn is 2025 so result will be 3 sroc and 3 presroc
 * - financialYearToBaseItOn is 2026 so result will be 4 sroc and 2 presroc
 * - financialYearToBaseItOn is 2027 so result will be 5 sroc and 1 presroc
 * - financialYearToBaseItOn is 2028 so result will be 5 sroc and 0 presroc
 *
 * @param {number} financialYearToBaseItOn - The financial year (end year) to base the billing period counts on
 *
 * @returns {object} An object with `presroc` and `sroc` properties holding the number of billing periods for each
 * scheme
 */
export function billingPeriodCounts(financialYearToBaseItOn) {
  const MAX_YEARS_LOOKED_BACK = 5

  const earliestPossibleSrocFinancialYear = Math.max(
    SROC_FIRST_FINANCIAL_YEAR,
    financialYearToBaseItOn - MAX_YEARS_LOOKED_BACK
  )
  const srocBillingPeriods = Math.max(
    Math.min(financialYearToBaseItOn - earliestPossibleSrocFinancialYear + 1, MAX_YEARS_LOOKED_BACK),
    0
  )

  const presrocFromFinancialYear = financialYearToBaseItOn - MAX_YEARS_LOOKED_BACK
  const presrocToFinancialYear = Math.min(financialYearToBaseItOn, PRESROC_LAST_FINANCIAL_YEAR)
  const presrocBillingPeriods = Math.max(
    Math.min(presrocToFinancialYear - presrocFromFinancialYear + 1, MAX_YEARS_LOOKED_BACK),
    0
  )

  return { presroc: presrocBillingPeriods, sroc: srocBillingPeriods }
}

/**
 * Compares two dates and returns:
 *
 * -1 if dateA is before dateB
 * 1 if dateA is after dateB
 * 0 if they are the same date
 *
 * This is useful as a helper for sorting dates.
 *
 * @param {Date} dateA - First date to compare
 * @param {Date} dateB - Second date to compare
 *
 * @returns {number} -1 if dateA is before dateB, 1 if dateA is after dateB, 0 if they are the same date
 */
export function compareDates(dateA, dateB) {
  // Math.sign() clamps the result of the subtraction to a minimum of -1 and a maximum of 1
  return Math.sign(dateA - dateB)
}

/**
 * Returns the start date of the return cycle for a given return log start date.
 *
 * Summer cycle is November to October. But if the start date is between January and October, the cycle year is the
 * previous year. For example, a return log with a start date of 2024-03-01 would have a return cycle start date of
 * 2023-11-01. A return log with a start date of 2024-11-01 would have a return cycle start date of 2024-11-01.
 *
 * Winter cycle is April to March. But if the start date is between January and March, the cycle year is the previous
 * year. For example, a return log with a start date of 2024-02-01 would have a return cycle start date of 2023-04-01. A
 * return log with a start date of 2024-04-01 would have a return cycle start date of 2024-04-01.
 *
 * @param {string|Date} returnLogStartDate - The start date of the return log
 * @param {boolean} summer - Whether the return cycle is a summer cycle
 *
 * @returns {Date} The start date of the return cycle
 */
export function determineReturnCycleStartDate(returnLogStartDate, summer) {
  // Just in case the date is passed directly from calculate dates response
  const startDate = new Date(returnLogStartDate)
  const startDateMonth = startDate.getUTCMonth()
  const startDateYear = startDate.getUTCFullYear()

  let cycleYear = startDateYear
  let cycleMonth

  if (summer) {
    cycleMonth = '11'

    if (startDateMonth < 10) {
      cycleYear = startDateYear - 1
    }
  } else {
    cycleMonth = '04'

    if (startDateMonth < 3) {
      cycleYear = startDateYear - 1
    }
  }

  return new Date(`${cycleYear}-${cycleMonth}-01`)
}

/**
 * Formats a date to ISO 8601 date format (YYYY-MM-DD)
 *
 * @param {Date} date - The date to format
 *
 * @returns {string} The date formatted as YYYY-MM-DD
 */
export function formatDateToIso(date) {
  const dateValue = new Date(date)

  return dateValue.toISOString().split('T')[0]
}

/**
 * Formats a date into a human readable day, month and year string, for example, '12 September 2021'
 *
 * @param {Date | string} date - The date to be formatted
 *
 * @returns {string | null} The date formatted as a 'DD MMMM YYYY' string
 */
export function formatLongDate(date) {
  if (!date) {
    return null
  }

  const localDate = new Date(date)

  return localDate.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })
}

/**
 * Splits a date range into calendar month periods, each with a field name matching the external return submission
 * form's convention for naming its monthly volume/reading inputs, for example `2025-04-01_2025-04-30`
 *
 * @param {Date | string} startDate - The start of the date range
 * @param {Date | string} endDate - The end of the date range
 *
 * @returns {object[]} An array of `{ startDate, endDate, fieldName }` objects, one per calendar month in the range
 */
export function monthlyReturnPeriods(startDate, endDate) {
  const periods = []

  const rangeEnd = new Date(endDate)

  let cursor = new Date(startDate)

  while (cursor <= rangeEnd) {
    const monthStartDate = new Date(Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth(), 1))
    const monthEndDate = new Date(Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth() + 1, 0))

    periods.push({
      startDate: monthStartDate,
      endDate: monthEndDate,
      fieldName: `${formatDateToIso(monthStartDate)}_${formatDateToIso(monthEndDate)}`
    })

    cursor = new Date(Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth() + 1, 1))
  }

  return periods
}

/**
 * Given a return period, returns a new period with the same properties but start and end dates moved back 1 period
 *
 * If the given period is quarterly, the dates will be moved back by 3 months. If it's not quarterly, the dates will be
 * moved back by 12 months.
 *
 * The new start date is calculated by subtracting months from the given start date, which is safe because a
 * period's start date is always the 1st of the month. The new end date is then derived as the day before the given
 * period's start date (periods are contiguous), rather than by subtracting months from the given end date directly -
 * doing that would risk overflowing into the next month when the end date's day-of-month (28, 29, 30 or 31) doesn't
 * exist in the target month, for example subtracting 3 months from 31 December lands on 1 October, not 30 September.
 * The due date is then derived as 28 days after the new end date, matching the convention used across return periods.
 *
 * @param {object} period - The return period to calculate the previous period for
 *
 * @returns {object} The previous return period to the one provided
 */
export function previousPeriod(period) {
  const startDate = new Date(period.startDate)

  let monthsBack = 12
  if (period.quarterly) {
    monthsBack = 3
  }

  const endDate = new Date(startDate)
  endDate.setUTCDate(endDate.getUTCDate() - 1)

  startDate.setUTCMonth(startDate.getUTCMonth() - monthsBack)

  let dueDate = null
  if (period.dueDate) {
    dueDate = new Date(endDate)
    dueDate.setUTCDate(dueDate.getUTCDate() + 28)
  }

  return {
    dueDate,
    endDate,
    name: period.name,
    quarterly: period.quarterly,
    startDate
  }
}

/**
 * Subtracts a specified number of years from a given date.
 *
 * @param {string | number | Date} date - The starting date as an ISO string, timestamp, or Date object.
 * @param {number} [years=1] - The number of years to subtract.
 * @returns {Date} A new Date object offset by the specified years.
 */
export function previousYears(date, years = 1) {
  const result = new Date(date)

  result.setUTCFullYear(result.getUTCFullYear() - years)

  return result
}

/**
 * Returns a date relative to today by the specified number of days.
 *
 * If the number of days is positive, it will add that number of days to today. If it is negative, it will subtract that
 * number of days from today.
 *
 * @param {number} numberOfDays - the number of days to add to, or subtract from, today
 *
 * @returns {Date} a date relative to today
 */
export function relativeToToday(numberOfDays) {
  const relative = today()

  relative.setDate(relative.getDate() + numberOfDays)

  return relative
}

/**
 * Transforms a return log's start, end and due dates into a human-readable strings
 *
 * For example, given the following return log:
 *
 * ```javascript
 * {
 *   startDate: new Date('2025-04-01'),
 *   endDate: new Date('2026-03-31'),
 *   dueDate: new Date('2026-04-28')
 * }
 * ```
 *
 * It will return
 *
 * ```javascript
 * {
 *   startDate: new Date('2025-04-01'),
 *   endDate: new Date('2026-03-31'),
 *   dueDate: new Date('2026-04-28'),
 *   startDateString: '1 April 2025',
 *   endDateString: '31 March 2026',
 *   dueDateString: '28 April 2026',
 *   dateString: '1 April 2025 to 31 March 2026',
 *   status: 'not due yet'
 * }
 * ```
 *
 * @param {object} returnLog - An object representing a return log with a `startDate`, `endDate` and optional `dueDate`
 * property
 *
 * @returns the return log's start, end and due dates formatted as human-readable strings, the original start, end and
 * due dates, plus the status for the return log.
 */
export function returnLogDateDetails(returnLog) {
  const startDateString = formatLongDate(returnLog.startDate)
  const endDateString = formatLongDate(returnLog.endDate)
  const dueDateString = returnLog.dueDate ? formatLongDate(returnLog.dueDate) : null
  const status = returnLogStatusLabel(returnLog.endDate, returnLog.dueDate)

  return {
    startDate: returnLog.startDate,
    endDate: returnLog.endDate,
    startDateString,
    endDateString,
    dueDateString,
    dateString: `${startDateString} to ${endDateString}`,
    status
  }
}

/**
 * Determines the display status of a return log based on its end and due date, relative to today
 *
 * If a return log's end date is equal to or greater than 'today', it is considered 'not due yet' regardless of its due
 * date.
 *
 * If the end date is in the past, the status is determined by the due date:
 *
 * - If the due date is null, the status is 'open'
 * - If the due date is more than 28 days in the future, the status is 'open'
 * - If the due date is 28 days or less in the future, the status is 'due'
 * - If the due date is in the past, the status is 'overdue'
 *
 * @param {Date | string} endDate - The end date of the return log
 * @param {Date | string} [dueDate=null] - The due date to compare against today. If not set defaults to null
 *
 * @returns {string} 'overdue', 'due', or 'not due yet'
 */
export function returnLogStatusLabel(endDate, dueDate = null) {
  const todayValue = today()
  const endDateValue = new Date(endDate)
  const dueDateValue = dueDate ? new Date(dueDate) : null

  const onOrBeforeEndDate = compareDates(endDateValue, todayValue) !== -1

  if (onOrBeforeEndDate) {
    return 'not due yet'
  }

  if (!dueDateValue) {
    return 'open'
  }

  const pastDueDate = compareDates(dueDateValue, todayValue) === -1

  if (pastDueDate) {
    return 'overdue'
  }

  const notDueUntil = new Date(dueDateValue)

  notDueUntil.setDate(notDueUntil.getDate() - 27)

  const beforeDuePeriod = compareDates(dueDateValue, notDueUntil) === -1

  if (beforeDuePeriod) {
    return 'open'
  }

  return 'due'
}

/**
 * Returns today's date with the time set to midnight, for example '2023-01-13T00:00:00.000Z'.
 *
 * A number of dates in our data are held as date-only, and we have to make decisions based on comparing them to
 * today's date. If we don't strip the time when comparing, we get issues where a date is equal to the current date.
 *
 * For example, the return log 'due date' is held in the record as date-only. If we compare it against 'today' without
 * stripping the time, then any return due 'today' would be flagged as overdue when it is still due (just!)
 *
 * This is a handy helper to return 'today' as a date-only value.
 *
 * @returns {Date}
 */
export function today() {
  const todaysDate = new Date()

  todaysDate.setHours(0, 0, 0, 0)

  return todaysDate
}

/**
 * Returns a date object representing tomorrow's date
 *
 * @returns {Date} tomorrow's date
 */
export function tomorrow() {
  const tomorrow = today()

  tomorrow.setDate(tomorrow.getDate() + 1)

  return tomorrow
}

/**
 * Returns a date object representing yesterday's date
 *
 * @returns {Date} yesterday's date
 */
export function yesterday() {
  const yesterday = today()

  yesterday.setDate(yesterday.getDate() - 1)

  return yesterday
}
