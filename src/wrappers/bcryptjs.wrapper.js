/**
 * Shares the engine's copy of `bcryptjs` with the apps, so the engine and the apps all use the same instance
 *
 * @module BcryptjsWrapper
 */

import bcryptjs from 'bcryptjs'

export default bcryptjs
