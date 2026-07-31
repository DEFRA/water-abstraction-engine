/**
 * Config values used to connect to PostgreSQL
 * @module DatabaseConfig
 */

// We import dotenv directly in each config file to support unit tests that depend on this subset of config.
// Importing dotenv in multiple places has no effect on the app when running for real.
import 'dotenv/config'

export default {
  // Used by any service which uses paging in its query and by the PaginatorPresenter
  defaultPageSize: Number.parseInt(process.env.DEFAULT_PAGE_SIZE) || 25,
  // Only used when seeding our dev/test user records
  defaultUserPassword: process.env.DEFAULT_USER_PASSWORD,
  database: process.env.POSTGRES_DB,
  host: process.env.POSTGRES_HOST,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
  testDatabase: process.env.POSTGRES_DB_TEST,
  user: process.env.POSTGRES_USER
}
