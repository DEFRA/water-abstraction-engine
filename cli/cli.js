/**
 * Interactive CLI to seed the local database with test scenarios. See cli/README.md. Run it with the `water-cli` bin
 */

import { listScenarios } from './src/scenarios.lib.js'
import scenariosMenu from './src/scenarios.menu.js'
import tasksMenu from './src/tasks.menu.js'

const escapeAbortController = new AbortController()

// Reassigned after each use — an AbortController can't be un-aborted, so the next prompt needs a fresh one.
//
// fresh signal for the first scenariosMenu call
let tabAbortController = new AbortController()

async function run() {
  const scenarios = await listScenarios()

  let selectedScenario

  while (true) {
    selectedScenario = await scenariosMenu(
      scenarios,
      escapeAbortController.signal,
      tabAbortController.signal,
      selectedScenario
    )

    if (tabAbortController.signal.aborted) {
      // Tab just fired to open the tasks menu; reset so it can also be pressed to exit tasksMenu
      tabAbortController = new AbortController()

      await tasksMenu(escapeAbortController.signal, tabAbortController.signal)

      // tasksMenu may have aborted the signal i.e. switched back to scenarios; reset so Tab is detectable again in the
      // next scenariosMenu call
      tabAbortController = new AbortController()
    }
  }
}

// Escape quits; Tab opens the tasks menu
process.stdin.on('keypress', (_str, key) => {
  if (key.name === 'escape') {
    escapeAbortController.abort()
  } else if (key.name === 'tab') {
    tabAbortController.abort()
  }
})

// Entry point
await run()
