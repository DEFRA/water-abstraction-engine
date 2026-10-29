import destroyWorld from '../world/destroy.world.js'
import { exit } from './cli.lib.js'
import resetWorld from '../world/reset.world.js'
import selectTaskPrompt from './select-task.prompt.js'
import { logError, printBanner, withSpinner } from './log.lib.js'

/**
 * Show the CLI's task menu and run whichever entry the user selects
 *
 * Tab returns quietly to the search prompt. Escape and Ctrl+C both exit the CLI.
 *
 * @param {AbortSignal} escapeSignal - aborted when Escape is pressed; exits the CLI
 * @param {AbortSignal} tabSignal - aborted when Tab is pressed; switches to the scenarios menu
 */
export default async function tasksMenu(escapeSignal, tabSignal) {
  printBanner('Select a task')

  try {
    const choices = [
      { name: 'Reset world', value: 'reset-world' },
      { name: 'Destroy world', value: 'destroy-world' }
    ]

    const selected = await selectTaskPrompt(choices, escapeSignal, tabSignal)

    await _processTask(selected)
  } catch (err) {
    if (tabSignal.aborted) {
      return
    }

    if (escapeSignal.aborted || err.name === 'ExitPromptError') {
      exit()
      return
    }

    await logError(`\nError: ${err.message}`)
  }
}

async function _processTask(selectedTask) {
  if (selectedTask === 'reset-world') {
    await withSpinner('Resetting the world...', resetWorld)
  } else if (selectedTask === 'destroy-world') {
    await withSpinner('Destroying world...', destroyWorld)
  }
}
