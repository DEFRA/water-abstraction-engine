/**
 * Validation helpers for the address lines we send to Notify
 *
 * @module NotifyAddressLineValidator
 */

/**
 * Checks if the given string starts with any of the special characters
 * given in the startCharacters array.
 *
 * @param {string} value - The string to check
 *
 * @returns {boolean} true if the string starts with any of the special characters, false otherwise
 */
export function invalidStartCharacters(value) {
  const startCharacters = ['@', '(', ')', '=', '[', ']', '”', '\\', '/', '<', '>']

  return startCharacters.some((character) => {
    return value.startsWith(character)
  })
}
