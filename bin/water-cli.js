#!/usr/bin/env node

/**
 * Bin script to allow the apps to run the engine's interactive seed CLI. See cli/README.md.
 *
 * When water-abstraction-engine is installed as a dependency, npm reads this in the `package.json`
 *
 * ```json
 * "bin": {
 *   "water-cli": "./bin/water-cli.js"
 * }
 * ```
 *
 * and creates `node_modules/.bin/water-cli → node_modules/water-abstraction-engine/bin/water-cli.js`. So an app can
 * add `"cli": "water-cli"` to its scripts and run it with `npm run cli`.
 * @module WaterCli
 */

import { config } from 'dotenv'

// Load the calling app's .env, so the CLI seeds the database the app is configured for rather than the engine's
config()

// Tells createWorld() to also seed the populate world data when resetting the world from the CLI
process.env.CLI_MODE = 'true'

// Imported dynamically so the CLI only starts once the env above has been set
await import('../cli/cli.js')
