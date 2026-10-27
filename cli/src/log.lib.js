import { input } from '@inquirer/prompts'

// A minimal stand-in for a dependency like Chalk, using ANSI escape codes directly to avoid adding another
// dependency to this project (see recent supply chain attacks via npm packages)

const BOLD = '\x1b[1m'
const BLUE = '\x1b[34m'
const CLEAR_LINE = '\r\x1b[2K'
const GREEN = '\x1b[32m'
const HIDE_CURSOR = '\x1b[?25l'
const RED = '\x1b[31m'
const RESET_ALL = '\x1b[0m'
const RESET_BOLD = '\x1b[22m'
const SHOW_CURSOR = '\x1b[?25h'
const SPINNER_FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
const YELLOW = '\x1b[33m'

/**
 * Print the CLI's title, followed by a context-specific subtitle
 *
 * @param {string} subtitle - the line shown under the title
 */
export function printBanner(subtitle) {
  console.clear()

  logInfo(styleBold('Acceptance test CLI'))
  logInfo(`${subtitle}\n`)
}

/**
 * Log a message in blue, for general info
 *
 * @param {string} message - the message to log
 */
export function logInfo(message) {
  _log(BLUE, message)
}

/**
 * Log a message in red, for errors, then wait for the user to acknowledge it
 *
 * The menu this returns to always starts with a `console.clear()`, which would otherwise wipe the error off the
 * screen before it could be read
 *
 * @param {string} message - the message to log
 */
export async function logError(message) {
  _log(RED, message)

  try {
    await input({ message: 'Press Enter to continue' })
  } catch {
    // Ctrl+C here just dismisses the error; the caller's own keypress handling still governs Escape/quit
  }
}

/**
 * Log a message in green, for success
 *
 * @param {string} message - the message to log
 */
export function logSuccess(message) {
  _log(GREEN, message)
}

/**
 * Log a message in yellow, for warnings
 *
 * @param {string} message - the message to log
 */
export function logWarning(message) {
  _log(YELLOW, message)
}

/**
 * Wrap a message in bold ANSI codes
 *
 * @param {string} message - the message to style
 * @returns {string} the message wrapped in bold
 */
export function styleBold(message) {
  return `${BOLD}${message}${RESET_BOLD}`
}

/**
 * Run an async function whilst showing a spinner. Restores the cursor even if the function throws
 *
 * @param {string} message - the label shown next to the spinner
 * @param {Function} fn - the async function to run
 */
export async function withSpinner(message, fn) {
  let i = 0

  process.stdout.write(HIDE_CURSOR)

  const interval = setInterval(() => {
    const frame = SPINNER_FRAMES[i++ % SPINNER_FRAMES.length]
    process.stdout.write(`\r${YELLOW}${frame}${RESET_ALL} ${message}`)
  }, 80)

  try {
    await fn()
  } finally {
    clearInterval(interval)
    process.stdout.write(CLEAR_LINE)
    process.stdout.write(SHOW_CURSOR)
  }
}

function _log(color, message) {
  console.log(`${color}${message}${RESET_ALL}`)
}
