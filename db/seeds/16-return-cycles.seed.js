import ReturnCycleModel from '../../src/models/return-cycle.model.js'
import { compareDates, determineFinancialYearEnd } from '../../src/lib/dates.lib.js'
import { generateUUID, timestampForPostgres, today } from '../../src/lib/general.lib.js'
import {
  determineCycleDueDate,
  determineCycleEndDate,
  determineCycleStartDate
} from '../../src/lib/return-cycle-dates.lib.js'

export async function seed() {
  const todaysDate = today()
  const financialYearEnd = determineFinancialYearEnd(todaysDate)

  let year = 1959
  let determinationDate

  do {
    determinationDate = new Date(`${year}-04-01`)

    const summerReturnCycle = _generateReturnCycle(true, determinationDate)
    const allYearReturnCycle = _generateReturnCycle(false, determinationDate)

    // This special case is to replicate the extended due date for the 2019/20 all-year return cycle due to COVID-19
    if (allYearReturnCycle.startDate.getTime() === new Date('2019-04-01').getTime()) {
      allYearReturnCycle.dueDate = new Date('2020-10-16')
    }

    // Only upsert all-year return cycles that have started
    if (compareDates(allYearReturnCycle.startDate, todaysDate) <= 0) {
      await _upsert(allYearReturnCycle)
    }

    await _upsert(summerReturnCycle)

    year++
  } while (determinationDate < new Date(`${financialYearEnd}-04-01`))
}

function _generateReturnCycle(summer, determinationDate) {
  return {
    dueDate: determineCycleDueDate(summer, determinationDate),
    endDate: determineCycleEndDate(summer, determinationDate),
    id: generateUUID(),
    startDate: determineCycleStartDate(summer, determinationDate),
    submittedInWrls: true,
    summer
  }
}

async function _upsert(cycle) {
  return ReturnCycleModel.query()
    .insert({ ...cycle, createdAt: timestampForPostgres(), updatedAt: timestampForPostgres() })
    .onConflict(['startDate', 'endDate', 'summer'])
    .merge(['dueDate', 'submittedInWrls', 'updatedAt'])
}
