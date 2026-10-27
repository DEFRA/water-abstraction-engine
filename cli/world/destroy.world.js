import { fileURLToPath } from 'node:url'
import path from 'path'
import { unlink } from 'node:fs/promises'

import { clean } from '../../test/support/database.js'

const WORLD_FILE = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../../water-abstraction-acceptance-tests/world.json'
)

/**
 * Removes all created data from the database and deletes local world.json
 */
export default async function destroyWorld() {
  await clean()

  try {
    await unlink(WORLD_FILE)
  } catch (error) {
    // Ignore error if the file already doesn't exist
    if (error.code !== 'ENOENT') {
      throw error
    }
  }
}
