/**
 * Generate the return logs data for the given return requirement and cycle
 * @module GenerateReturnLogsService
 */

import GenerateReturnLogService from './generate-return-log.service.js'
import { determineReturnsPeriods } from '../../lib/return-periods.lib.js'

/**
 * Generate the return logs data for the given return requirement and cycle
 *
 * A return requirement on a return version for quarterly returns gets a return log for each quarter of a return cycle
 * that starts on or after 1 April 2025, where the return version and licence are in force during that quarter. Any
 * other return requirement gets one return log for the return cycle.
 *
 * @param {module:ReturnRequirementModel} returnRequirement - the return requirement to generate return logs for
 * @param {module:ReturnCycleModel} returnCycle - the return cycle to generate return logs against
 * @param {Date} [licenceEndDate=null] - the licence end date if there is one
 * @param {boolean} setOldReturnsDueDate - whether to set the due date on return logs that end before quarterly returns
 * started on 1 April 2025, as the `ENABLE_SET_OLD_RETURNS_DUE_DATE` feature flag does in the system
 *
 * @returns {object[]} the generated return logs data
 */
export default function generateReturnLogsService(
  returnRequirement,
  returnCycle,
  licenceEndDate = null,
  setOldReturnsDueDate
) {
  const isQuarterlyReturn = returnRequirement.returnVersion.quarterlyReturns
  const returnLogs = []

  if (isQuarterlyReturn && returnCycle.startDate >= new Date('2025-04-01')) {
    const quarterlyReturnPeriods = determineReturnsPeriods(returnCycle)

    const periodsToProcess = quarterlyReturnPeriods.filter((period) => {
      const startDateInPeriod = returnRequirement.returnVersion.startDate <= period.endDate
      const endDateInPeriod = returnRequirement.returnVersion.endDate >= period.startDate
      const endDateIsNull = returnRequirement.returnVersion.endDate === null
      const licenceEndDateIsNull = licenceEndDate === null
      const licenceEndDateInPeriod = licenceEndDate >= period.startDate

      return startDateInPeriod && (endDateIsNull || endDateInPeriod) && (licenceEndDateIsNull || licenceEndDateInPeriod)
    })

    for (const quarterlyReturnPeriod of periodsToProcess) {
      returnLogs.push(GenerateReturnLogService(returnRequirement, quarterlyReturnPeriod, setOldReturnsDueDate))
    }
  } else {
    returnLogs.push(GenerateReturnLogService(returnRequirement, returnCycle, setOldReturnsDueDate))
  }

  // It is possible that a licence can be ended _before_ the return cycle starts. On the rare occasions this happens
  // GenerateReturnLogService will return NULL instead of an object (else you'd get a return log that ends before it
  // finishes!) So, we filter out any nulls from returnLogs before returning it.
  return returnLogs.filter(Boolean)
}
