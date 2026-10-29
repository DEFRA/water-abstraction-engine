import { fileURLToPath } from 'node:url'
import fs from 'node:fs/promises'
import path from 'path'

const WORLD_FILE = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../../water-abstraction-acceptance-tests/world.json'
)

/**
 * Write the world's scenario data to `world.json` at the top of the acceptance tests repo, so the data it created can
 * be looked up later
 *
 * @param {object} scenarios - the generated data for each scenario, keyed by scenario name
 */
export default async function saveWorld(scenarios) {
  await fs.writeFile(WORLD_FILE, JSON.stringify(scenarios, null, 2), 'utf-8')
}
