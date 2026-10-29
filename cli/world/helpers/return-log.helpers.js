import returnLogData from '../data/return-log.data.js'
import { compareDates, previousPeriod } from './date.helpers.js'

/**
 * Builds the previous and current return cycle periods for a return requirement
 *
 * @param {object} cycle - the return cycle (start and end date) the return logs cover
 * @param {Date|null} [dueDate] - the due date for the previous cycle's return log
 * @param {boolean} [quarterly] - whether the return logs are for a quarterly return cycle
 *
 * @returns {object[]} The previous and current cycle periods
 */
export function returnLogPeriods(cycle, dueDate = null, quarterly = false) {
  const previousPeriodDetails = previousPeriod({
    startDate: cycle.startDate,
    endDate: cycle.endDate,
    dueDate,
    quarterly
  })

  const currentPeriodDetails = {
    startDate: new Date(cycle.startDate),
    endDate: new Date(cycle.endDate),
    dueDate: null,
    quarterly
  }

  return [previousPeriodDetails, currentPeriodDetails]
}

/**
 * Builds a return log for a return requirement for each of the given periods
 *
 * @param {object} licence - the licence the return logs belong to
 * @param {object} returnRequirement - the return requirement the return logs are for
 * @param {object} returnRequirementPurpose - the return requirement purpose the return logs are for
 * @param {object} point - the point the return logs are for
 * @param {object[]} periods - the periods to build a return log for, for example the result of `returnLogPeriods(cycle)`
 * @param {object} region - the region
 *
 * @returns {object[]} A return log for each of the given periods
 */
export function buildReturnLogs(licence, returnRequirement, returnRequirementPurpose, point, periods, region) {
  return periods.map((period) => {
    return returnLogData(licence, returnRequirement, [returnRequirementPurpose], [point], period, region)
  })
}

/**
 * Builds a due return log for the current cycle and the previous cycle, for a single return requirement
 *
 * @param {object} licence - the licence the return logs belong to
 * @param {object} returnRequirement - the return requirement the return logs are for
 * @param {object} returnRequirementPurpose - the return requirement purpose the return logs are for
 * @param {object} point - the point the return logs are for
 * @param {object} cycle - the return cycle (start, end and due date) the return logs cover
 * @param {object} region - the region
 *
 * @returns {object[]} The due return log for the current cycle and the previous cycle
 */
export function buildPreviousAndCurrentReturnLogs(
  licence,
  returnRequirement,
  returnRequirementPurpose,
  point,
  cycle,
  region
) {
  const currentPeriod = {
    startDate: new Date(cycle.startDate),
    endDate: new Date(cycle.endDate),
    dueDate: cycle.dueDate ? new Date(cycle.dueDate) : null,
    quarterly: false
  }
  const previousPeriodDetails = previousPeriod(currentPeriod)

  const [currentReturnLog, previousReturnLog] = buildReturnLogs(
    licence,
    returnRequirement,
    returnRequirementPurpose,
    point,
    [currentPeriod, previousPeriodDetails],
    region
  )

  return [currentReturnLog, previousReturnLog]
}

/**
 * Sorts return logs by start date descending, then reference descending, then end date descending
 *
 * This matches the order the licence returns tab displays return logs in.
 *
 * @param {object[]} returnLogs - The return logs to sort, each with a `startDate`, `returnReference` and `endDate`
 *
 * @returns {object[]} An array of the return logs sorted by start date descending, then reference descending,
 * then end date descending
 */
export function sortReturnLogsByDisplayOrder(returnLogs) {
  return [...returnLogs].sort((a, b) => {
    const startDateDiff = compareDates(new Date(b.startDate), new Date(a.startDate))

    if (startDateDiff !== 0) {
      return startDateDiff
    }

    const referenceDiff = compareDates(b.returnReference ?? 0, a.returnReference ?? 0)

    if (referenceDiff !== 0) {
      return referenceDiff
    }

    return compareDates(new Date(b.endDate), new Date(a.endDate))
  })
}
