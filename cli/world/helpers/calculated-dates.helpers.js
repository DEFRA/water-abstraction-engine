import DetermineBillingPeriodsService from '../../../src/services/bill-runs/determine-billing-periods.service.js'
import { determineCurrentFinancialYear, today } from '../../../src/lib/general.lib.js'
import {
  determineCycleDueDate,
  determineCycleEndDate,
  determineCycleStartDate
} from '../../../src/lib/return-cycle-dates.lib.js'
import { determineReturnsPeriods, determineUpcomingReturnPeriods } from '../../../src/lib/return-periods.lib.js'

/**
 * Returns dynamic dates used to seed data, for example, current financial year and returns periods
 *
 * Often a scenario needs to be seeded dynamically, to support behaviour in the service. A good example is bill runs,
 * where we are generally working in the current financial year, so we need to know what that is. Another is when
 * sending return invites and reminders, where due return logs need to exist for the current return periods the UI
 * will display to the user.
 *
 * This was previously calculated by water-abstraction-system and exposed via the `/system/data/dates` endpoint, to
 * avoid duplicating the logic here. Ported directly into the acceptance tests so they no longer need to call out to
 * the service just to seed data.
 *
 * @returns {object} an object containing the current billing and return periods, plus the current financial year dates
 */
export function calculatedDates() {
  const [firstReturnPeriod, secondReturnPeriod] = determineUpcomingReturnPeriods(today())
  const currentSummerReturnCycle = {
    startDate: determineCycleStartDate(true),
    endDate: determineCycleEndDate(true),
    dueDate: determineCycleDueDate(true)
  }
  const currentWinterReturnCycle = {
    startDate: determineCycleStartDate(false),
    endDate: determineCycleEndDate(false),
    dueDate: determineCycleDueDate(false)
  }
  const quarterlyPeriods = determineReturnsPeriods(currentWinterReturnCycle)
  const currentFinancialYear = determineCurrentFinancialYear()
  const billingPeriods = {
    annual: DetermineBillingPeriodsService('annual', currentFinancialYear.endDate.getFullYear()),
    supplementary: DetermineBillingPeriodsService('supplementary', currentFinancialYear.endDate.getFullYear()),
    twoPartTariff: DetermineBillingPeriodsService('two_part_tariff', currentFinancialYear.endDate.getFullYear() - 1),
    twoPartSupplementary: DetermineBillingPeriodsService(
      'two_part_supplementary',
      currentFinancialYear.endDate.getFullYear()
    )
  }

  return {
    billingPeriods,
    currentFinancialYear,
    currentSummerReturnCycle,
    currentWinterReturnCycle,
    quarterlyPeriods,
    firstReturnPeriod,
    secondReturnPeriod
  }
}
