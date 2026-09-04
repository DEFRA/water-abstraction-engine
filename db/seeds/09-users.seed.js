import bcrypt from 'bcryptjs'

import DatabaseConfig from '../../src/config/database.config.js'
import ServerConfig from '../../src/config/server.config.js'
import UserModel from '../../src/models/user.model.js'
import { db } from '../db.js'
import { timestampForPostgres } from '../../src/lib/general.lib.js'
import { data as users } from './data/users.js'

export async function seed() {
  // These users are for use in our non-production environments only
  if (ServerConfig.environment === 'production') {
    return
  }

  const defaultPassword = _generateHashedPassword()

  for (const user of users) {
    const password = _password(user, defaultPassword)
    const exists = await _exists(user)

    if (exists) {
      await _update(user, password)
    } else {
      await _insert(user, password)
    }

    await _applyRoleToExternalUsers(user)
  }

  await _syncUserIdSequence()
}

/**
 * Determines the password to use for the user being seeded
 *
 * In nearly all cases we want to seed the user with the default password we specify in an env var then hash. This makes
 * testing easier as all our seeded test users can be accessed with the same password.
 *
 * For testing purposes though we need a user who is 'locked'. Currently, this is handled by the legacy service setting
 * their password to `VOID`. So in this case, we don't want to create or update the test user with the default password
 * but to leave it as 'VOID'.
 *
 * @private
 */
function _password(user, defaultPassword) {
  const { password } = user

  if (password === 'VOID') {
    return password
  }

  return defaultPassword
}

/**
 * Sets the `role` property for external users, which is not a field we expose in the view or the model
 *
 * Whilst working on WATER-5129 we encountered a scenario where the water-abstraction-service is requesting an external
 * user's details by making a request to water-abstraction-tactical-idm via hapi-pg-rest-api. The request does not
 * include a select, so hapi-pg-rest-api is grabbing all fields.
 *
 * However, also within tactical-idm, someone has added a custom prequery hook that automatically tries to convert the
 * contents of the `role` field to JSON if it exists in the object being returned.
 *
 * Frustratingly, the information in the field is never used. So, our choice to disregard the field in our view and
 * model was correct. But if not populated, you cannot upload a CSV returns file as an external user (the scenario that
 * exposed this).
 *
 * This extra call, means we can still populate the field _and_ continue to ignore it in our view and model!
 *
 * @private
 */
async function _applyRoleToExternalUsers(user) {
  const { application, username } = user

  if (application === 'water_admin') {
    return
  }

  const params = [username]
  const query = `UPDATE idm.users SET "role" = '{"scopes": ["external"]}' WHERE user_name = ?;`

  return db.raw(query, params)
}

async function _exists(user) {
  const { application, username } = user

  const result = await UserModel.query()
    .select('userId')
    .where('application', application)
    .andWhere('username', username)
    .limit(1)
    .first()

  return !!result
}

function _generateHashedPassword() {
  // 10 is the number of salt rounds to perform to generate the salt. The legacy code uses
  // const salt = bcrypt.genSaltSync(10) to pre-generate the salt before passing it to hashSync(). But this is
  // intended for operations where you need to hash a large number of values. If you just pass in a number bcrypt will
  // autogenerate the salt for you.
  // https://github.com/kelektiv/node.bcrypt.js#usage
  return bcrypt.hashSync(DatabaseConfig.defaultUserPassword, 10)
}

async function _idInUse(userId) {
  const result = await UserModel.query().where('userId', userId).limit(1).first()

  return !!result
}

async function _insert(user, password) {
  const {
    application,
    badLogins,
    enabled,
    id,
    userId,
    lastLogin,
    resetGuid,
    resetGuidCreatedAt,
    resetRequired,
    username
  } = user

  // NOTE: Seeding users is a pain (!) because of the previous teams choice to use a custom sequence for the ID instead
  // of sticking with UUIDs. This means it is possible that, for example, a user with
  //
  // `username = 'admin-internal@wrls.gov.uk' && application = 'water_admin'`
  //
  // does not exist. _But_ a user with ID 100000 does! So, we do want to insert our record, but we can't use the ID
  // because it is already in use. We only really face this problem when running the seed in our AWS environments.
  const idInUse = await _idInUse(userId)

  if (idInUse) {
    return UserModel.query().insert({
      id,
      userId,
      application,
      badLogins,
      enabled,
      lastLogin,
      password,
      resetGuid,
      resetGuidCreatedAt,
      resetRequired,
      username
    })
  }

  return UserModel.query().insert({ ...user, password })
}

/**
 * Points the `idm.users` ID sequence at the highest `user_id` in the table
 *
 * We explicitly set `user_id` for each seeded user (they start at 100000) instead of letting the DB generate it, so
 * our inserts never advance the sequence backing the column. Most of the time that's harmless because the sequence
 * still starts below our seeded IDs. But `test/support/database.js` truncates tables with `RESTART IDENTITY` when
 * cleaning the DB between tests, which resets the sequence to 1 without touching the rows this seed then
 * (re)inserts at 100000+. Left alone, the next auto-generated `user_id` would be 1, drifting further out of step
 * with our seeded IDs each time the DB is cleaned. So, after seeding, we sync the sequence back to the current max.
 *
 * @private
 */
async function _syncUserIdSequence() {
  await db.raw("SELECT setval(pg_get_serial_sequence('idm.users', 'user_id'), (SELECT MAX(user_id) FROM idm.users))")
}

async function _update(user, password) {
  const { application, badLogins, enabled, lastLogin, resetGuid, resetGuidCreatedAt, resetRequired, username } = user

  return UserModel.query()
    .patch({
      badLogins,
      enabled,
      lastLogin,
      password,
      resetGuid,
      resetGuidCreatedAt,
      resetRequired,
      updatedAt: timestampForPostgres()
    })
    .where('application', application)
    .andWhere('username', username)
}
