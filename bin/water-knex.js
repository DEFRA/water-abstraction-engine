#!/usr/bin/env node

/**
 * Bin script to allow shared access to Knex from the apps. Means they don't have to install knex as a dependency.
 *
 * When npm installs a package that has a bin entry, it creates a symlink in `node_modules/.bin/` pointing to that
 * script. So when water-abstraction-engine is installed as a dependency, npm reads this in the `package,json`
 *
 * ```json
 * "bin": {
 *   "water-knex": "./bin/water-knex.js"
 * }
 * ```
 *
 * and creates `node_modules/.bin/water-knex → node_modules/water-abstraction-engine/bin/water-knex.js`.
 *
 * When npm runs any script from a `package.json`, it temporarily prepends `node_modules/.bin` to `PATH`. So
 * `water-knex` resolves to that symlink, which points to the engine's script — no different to how eslint or vitest
 * work existing scripts.
 * @module WaterKnex
 */

import { config } from 'dotenv'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'child_process'
import { dirname, join } from 'node:path'

// Load the calling app's .env before spawning knex. The knex CLI changes process.cwd() to the knexfile's directory
// before loading it, which would cause dotenv inside the knexfile to load water-abstraction-engine's .env by default,
// instead of the caller's. By loading it here first, the vars are already set in process.env and dotenv's default
// no-overwrite behaviour keeps them intact in the child.
config()

// This is part of ensuring all paths are determined absolute rather than relative. It means rather than Knex looking
// for migrations and seeds, etc, relative from `process.cwd()`, it instead just uses the absolute path to the file.
// This allows us to run migrations in the engine to create the test DB, as well as from the apps for their own testing,
// and to run migrations against the main DB from them.
const __dirname = dirname(fileURLToPath(import.meta.url))
// When water-abstraction-engine is npm-linked, import.meta.url resolves the symlink to the real path, so knex lives in
// the engine's own node_modules. When installed normally or in CI, npm hoists knex to the calling app's node_modules.
const engineKnex = join(__dirname, '../node_modules/.bin/knex')
const knexBin = existsSync(engineKnex) ? engineKnex : join(process.cwd(), 'node_modules/.bin/knex')
const knexfile = join(__dirname, '../knexfile.js')

const args = ['--knexfile', knexfile, ...process.argv.slice(2)]
const result = spawnSync(knexBin, args, { stdio: 'inherit' })

process.exit(result.status)
