/**
 * Check no scenarios in the world create a bill run for the same batch type, region and financial year
 *
 * Seeding clashing bill runs together would be incorrect data, so we fail before anything is loaded and list every
 * clash found.
 *
 * @param {object} scenarios - the generated data for each scenario, keyed by scenario name
 *
 * @throws {Error} when one or more duplicate bill run combinations are found
 */
export default function protectWorld(scenarios) {
  const billRunKeys = new Map()
  const errors = []

  for (const [key, scenarioData] of Object.entries(scenarios)) {
    if (scenarioData.billRuns) {
      for (const billRun of scenarioData.billRuns) {
        const region = billRun.regionId?.value
        const year = billRun.toFinancialYearEnding
        const batchType = billRun.batchType

        const billRunKey = `${batchType}-${region}-${year}`

        if (billRunKeys.has(billRunKey)) {
          const originalScenario = billRunKeys.get(billRunKey)
          errors.push(
            `• [Batch Type: ${batchType} | Region: ${region} | Year: ${year}] ` +
              `found in scenario '${key}' (already used in '${originalScenario}')`
          )
        } else {
          billRunKeys.set(billRunKey, key)
        }
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(`Found ${errors.length} duplicate bill run combination(s):\n${errors.join('\n')}`)
  }
}
