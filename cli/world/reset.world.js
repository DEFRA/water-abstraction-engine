import createWorld from './create.world.js'
import destroyWorld from './destroy.world.js'

/**
 * Destroy then create the world
 */
export default async function resetWorld() {
  await destroyWorld()
  await createWorld()
}
