import { exit } from './cli.lib.js'
import { loadScenario } from './scenarios.lib.js'
import searchScenariosPrompt from './search-scenarios.prompt.js'
import { logError, printBanner, withSpinner } from './log.lib.js'

/**
 * Show the CLI's scenarios menu and load whichever scenario the user selects
 *
 * Tab returns quietly to the tasks menu. Escape and Ctrl+C both exit the CLI.
 *
 * @param {object[]} scenarios - the full list of available scenarios, as returned by listScenarios()
 * @param {AbortSignal} escapeSignal - aborted when Escape is pressed; exits the CLI
 * @param {AbortSignal} tabSignal - aborted when Tab is pressed; switches to the tasks menu
 * @param {object} [selectedScenario] - the previously selected scenario, highlighted by default
 * @returns {Promise<object|undefined>} the last selected scenario, to pre-highlight it next time
 */
export default async function scenariosMenu(scenarios, escapeSignal, tabSignal, selectedScenario) {
  printBanner('Type to search')

  try {
    selectedScenario = await searchScenariosPrompt(scenarios, escapeSignal, tabSignal, selectedScenario)

    await withSpinner('Loading scenario...', async () => {
      return loadScenario(selectedScenario)
    })
  } catch (err) {
    if (tabSignal.aborted) {
      return selectedScenario
    }

    if (escapeSignal.aborted || err.name === 'ExitPromptError') {
      exit()
      return
    }

    await logError(`\nError: ${err.message}`)
  }

  return selectedScenario
}
