import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import DatabaseConfig from './src/config/database.config.js'

// This is part of ensuring all paths are determined absolute rather than relative. It means rather than Knex looking
// for migrations and seeds, etc, relative from `process.cwd()`, it instead just uses the absolute path to the file.
// This allows us to run migrations in the engine to create the test DB, as well as from the apps for their own testing,
// and to run migrations against the main DB from them.
const __dirname = dirname(fileURLToPath(import.meta.url))

const defaultConfig = {
  client: 'postgres',
  seeds: {
    directory: join(__dirname, 'db/seeds')
  },
  useNullAsDefault: true
}

const defaultConnection = {
  charset: 'utf8',
  database: DatabaseConfig.database,
  host: DatabaseConfig.host,
  password: DatabaseConfig.password,
  port: DatabaseConfig.port,
  user: DatabaseConfig.user
}

const development = {
  ...defaultConfig,
  connection: defaultConnection,
  migrations: {
    directory: join(__dirname, 'db/migrations/public'),
    tableName: 'knex_migrations'
  }
}

const test = {
  ...defaultConfig,
  migrations: {
    directory: [join(__dirname, 'db/migrations/legacy'), join(__dirname, 'db/migrations/public')],
    sortDirsSeparately: true,
    tableName: 'knex_migrations'
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
  connection: defaultConnection,
  migrations: {
    directory: join(__dirname, 'db/migrations/public'),
    tableName: 'knex_migrations'
  }
}

export default { development, production, test }
