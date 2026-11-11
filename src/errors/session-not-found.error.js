/**
 * Error thrown when the requested setup session no longer exists
 *
 * @module SessionNotFoundError
 */

export default class SessionNotFoundError extends Error {
  constructor() {
    super('The requested setup session no longer exists')
  }
}
