/**
 * Use to help with cleaning the database between tests
 *
 * It's good practise to ensure the database is in a 'clean' state between tests to avoid any side effects caused by
 * data from one test being present in another.
 * @module DatabaseSupport
 */

import { db, dbConfig } from '../../db/db.js'

import { seed as changeReasonsSeeder } from '../../db/seeds/12-change-reasons.seed.js'
import { seed as chargeCategoriesSeeder } from '../../db/seeds/13-charge-categories.seed.js'
import { seed as financialAgreementsSeeder } from '../../db/seeds/11-financial-agreements.seed.js'
import { seed as groupRolesSeeder } from '../../db/seeds/08-group-roles.seed.js'
import { seed as groupsSeeder } from '../../db/seeds/06-groups.seed.js'
import { seed as licenceRoleSeeder } from '../../db/seeds/14-licence-roles.seed.js'
import { seed as licenceVersionPurposeConditionTypeSeeder } from '../../db/seeds/05-licence-version-purpose-condition-types.seed.js'
import { seed as primaryPurposesSeeder } from '../../db/seeds/03-primary-purposes.seed.js'
import { seed as purposesSeeder } from '../../db/seeds/02-purposes.seed.js'
import { seed as regionsSeeder } from '../../db/seeds/01-regions.seed.js'
import { seed as returnCyclesSeeder } from '../../db/seeds/16-return-cycles.seed.js'
import { seed as rolesSeeder } from '../../db/seeds/07-roles.seed.js'
import { seed as secondaryPurposesSeeder } from '../../db/seeds/04-secondary-purposes.seed.js'
import { seed as sourcesSeeder } from '../../db/seeds/15-sources.seed.js'
import { seed as userGroupsSeeder } from '../../db/seeds/10-user-groups.seed.js'
import { seed as userRolesSeeder } from '../../db/seeds/17-user-roles.seed.js'
import { seed as usersSeeder } from '../../db/seeds/09-users.seed.js'

const LEGACY_SCHEMAS = ['crm', 'crm_v2', 'idm', 'permit', 'returns', 'water']

/**
 * Tables that hold only static reference data inserted directly by their legacy migration (not a seed file, and
 * nothing in the app or test suite ever adds, changes or removes rows in them - see the migrations themselves for
 * the source of truth). `clean()` leaves these untouched entirely rather than truncating and having to re-insert
 * what the migration already put there.
 *
 * `crm.entity` deliberately isn't listed here even though it has a static row too (see
 * `db/migrations/legacy/20221108002002_crm-entity.js`) - it also holds rows tests create dynamically (see
 * `test/support/helpers/licence-entity.helper.js`), so it still needs truncating for test isolation. See
 * `_reinsertCrmRegimeEntity()`.
 */
const STATIC_REFERENCE_TABLES = {
  permit: ['regime'],
  water: ['notify_templates']
}

/**
 * Call to clean the database of all data
 *
 * It works by identifying all the tables in each schema which we use.
 *
 * Once it has that info it creates a query that tells PostgreSQL to TRUNCATE all the tables and restart their
 * identity columns. For example, if a table relies on an incrementing ID the query will reset that to 1.
 */
export async function clean() {
  const schemas = ['public', ...LEGACY_SCHEMAS]

  for (const schema of schemas) {
    const tables = await _tableNames(schema, STATIC_REFERENCE_TABLES[schema])

    if (tables.length === 0) {
      continue
    }

    await db.raw(`TRUNCATE TABLE ${tables.join(',')} RESTART IDENTITY;`)
  }

  await _reinsertCrmRegimeEntity()

  // TODO: when all calls to DatabaseSupport.clean() (this function) have been removed from the tests we can drop this
  await _seed()
}

/**
 * Call to wipe the database of all tables, views and legacy schemas
 *
 * In order to test our code we have to recreate the legacy tables in our test DB. It is not uncommon for us to make
 * mistakes when we do because of their complexity. We could then create fix-migrations. But the number of legacy
 * migrations is already high. Adding fix-migrations to the folder will make it even more onerous to maintain.
 *
 * So, as a team we've opted when we spot an issue to go back and fix the original legacy migration file. The downside
 * of this is it will cause the next migration run to error. That was until we added this function to wipe the test DB
 * of all tables, views and schemas. If this gets run before the migrations it will be starting with a clean slate.
 */
export async function wipe() {
  // Drop the public views first
  const viewNames = await _viewNames('public')

  for (const viewName of viewNames) {
    await db.raw(`DROP VIEW IF EXISTS ${viewName};`)
  }

  // Then drop the public tables (including the migration management tables)
  const tableNames = await _tableNames('public')

  tableNames.push(..._migrationTables())
  for (const tableName of tableNames) {
    await db.raw(`DROP TABLE IF EXISTS ${tableName};`)
  }

  // Then drop the legacy schemas
  for (const schemaName of LEGACY_SCHEMAS) {
    await db.raw(`DROP SCHEMA IF EXISTS  ${schemaName} CASCADE;`)
  }
}

function _migrationTables() {
  return [dbConfig.migrations.tableName, `${dbConfig.migrations.tableName}_lock`]
}

/**
 * Re-insert the one static 'regime' row db/migrations/legacy/20221108002002_crm-entity.js inserts directly
 *
 * `crm.entity` still gets truncated by `clean()` (see `STATIC_REFERENCE_TABLES`), so this puts that one row back
 * afterward. A migration only runs once, so without this the row would be gone for the rest of the run after the
 * first `clean()` call.
 */
async function _reinsertCrmRegimeEntity() {
  return db('entity')
    .withSchema('crm')
    .insert({
      entity_id: '0434dc31-a34e-7158-5775-4694af7a60cf',
      entity_nm: 'water-abstraction',
      entity_type: 'regime',
      entity_definition: {}
    })
    .onConflict(['entity_id', 'entity_nm', 'entity_type'])
    .ignore()
}

async function _seed() {
  // NOTE: Order matches the order they are seeded via Knex seeding. Do not alphabetize!
  await regionsSeeder()
  await purposesSeeder()
  await primaryPurposesSeeder()
  await secondaryPurposesSeeder()
  await licenceVersionPurposeConditionTypeSeeder()
  await groupsSeeder()
  await rolesSeeder()
  await groupRolesSeeder()
  await usersSeeder()
  await userGroupsSeeder()
  await userRolesSeeder()
  await financialAgreementsSeeder()
  await changeReasonsSeeder()
  await chargeCategoriesSeeder()
  await licenceRoleSeeder()
  await sourcesSeeder()
  await returnCyclesSeeder()
}

async function _tableNames(schema, excludedTables = []) {
  const result = await db('pg_tables')
    .select('tablename')
    .where('schemaname', schema)
    .whereNotIn('tablename', [..._migrationTables(), ...excludedTables])

  return result.map((table) => {
    return `"${schema}".${table.tablename}`
  })
}

async function _viewNames(schema) {
  const result = await db('pg_views').select('viewname').where('schemaname', schema)

  return result.map((view) => {
    return `"${schema}".${view.viewname}`
  })
}

/**
 * Close the connection to the database
 *
 */
export async function closeConnection() {
  await db.destroy()
}
