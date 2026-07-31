import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

import DatabaseConfig from './src/config/database.config.js'

// This is part of ensuring all paths are determined absolute rather than relative. It means rather than Knex looking
// for migrations and seeds, etc, relative from `process.cwd()`, it instead just uses the absolute path to the file.
// This allows us to run migrations in the engine to create the test DB, as well as from the apps for their own testing,
// and to run migrations against the main DB from them.
const __dirname = dirname(fileURLToPath(import.meta.url))

const defaultConfig = {
  client: 'postgres',
  useNullAsDefault: true,
  seeds: {
    directory: join(__dirname, 'db/seeds')
  }
}

const defaultConnection = {
  host: DatabaseConfig.host,
  user: DatabaseConfig.user,
  password: DatabaseConfig.password,
  database: DatabaseConfig.database,
  port: DatabaseConfig.port,
  charset: 'utf8'
}

const development = {
  ...defaultConfig,
  migrations: {
    tableName: 'knex_migrations',
    directory: join(__dirname, 'db/migrations/public')
  },
  connection: defaultConnection
}

const test = {
  ...defaultConfig,
  migrations: {
    sortDirsSeparately: true,
    tableName: 'knex_migrations',
    directory: [join(__dirname, 'db/migrations/legacy'), join(__dirname, 'db/migrations/public')]
  },
  connection: {
    ...defaultConnection,
    database: DatabaseConfig.testDatabase
  },
  pool: {
    // Knex/Tarn's default pool keeps a minimum of 2 connections open at all times, and those minimum connections are
    // exempt from idle-timeout eviction - they only close when something explicitly destroys the pool. Nothing in our
    // test suite does that (each Vitest worker creates its own pool via db/db.js and never tears it down), so those
    // connections stay open for the life of the worker process, and could prevent it from exiting on its own once
    // tests finish. Setting `min: 0` here means idle connections are free to close themselves after Tarn's default
    // idle timeout instead
    min: 0,
    // Aggressively tear down idle connections quickly. The default is 30 seconds
    idleTimeoutMillis: 500,
    // Frequently scan and clear out those idle connections. The default is 1 second
    reapIntervalMillis: 250
  }
}

const production = {
  ...defaultConfig,
  migrations: {
    tableName: 'knex_migrations',
    directory: join(__dirname, 'db/migrations/public')
  },
  connection: defaultConnection
}

export default { development, test, production }
