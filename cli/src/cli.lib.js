import { logWarning } from './log.lib.js'

/**
 * Log a goodbye message and exit the CLI
 */
export function exit() {
  logWarning('\nGoodbye!')

  // Without this, the keypress listener below keeps stdin resumed and the process hangs after
  // "Goodbye!" instead of exiting, requiring a second Ctrl+C to force it closed
  process.stdin.removeAllListeners('keypress')
  process.exit(0)
}
