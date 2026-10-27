import { search } from '@inquirer/prompts'

import { cliTheme } from './theme.lib.js'

/**
 * Show a searchable scenario picker in the terminal
 *
 * @param {object[]} scenarios - the full list of scenarios to search
 * @param {AbortSignal} escapeSignal - aborted when Escape is pressed; exits the CLI
 * @param {AbortSignal} tabSignal - aborted when Tab is pressed; switches to the task menu
 * @param {object} [selectedScenario] - the previously selected scenario, highlighted by default
 *
 * @returns {Promise<object>} the scenario the user selected
 */
export default async function searchScenariosPrompt(scenarios, escapeSignal, tabSignal, selectedScenario) {
  return search(
    {
      message: 'Search for a scenario:',
      // Highlights the last used scenario
      default: selectedScenario,
      source: async (input) => {
        let filteredScenarios = scenarios

        if (input) {
          filteredScenarios = _findMatchingScenarios(scenarios, input)
        }

        return _presentScenarios(filteredScenarios)
      },
      theme: cliTheme('Task menu')
    },
    { signal: AbortSignal.any([escapeSignal, tabSignal]) }
  )
}

function _findMatchingScenarios(scenarios, input) {
  const query = input.toLowerCase()

  return scenarios.filter((scenario) => {
    return scenario.title.toLowerCase().includes(query) || scenario.filename.toLowerCase().includes(query)
  })
}

function _presentScenarios(filteredScenarios) {
  return filteredScenarios.map((scenario) => {
    return {
      name: scenario.title,
      value: scenario,
      description: scenario.description
    }
  })
}
