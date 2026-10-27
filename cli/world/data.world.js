import { fileURLToPath } from 'node:url'
import fs from 'node:fs/promises'
import path from 'path'

import buildWorldKey from './key.world.js'

const ACCEPTANCE_TESTS_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../../water-abstraction-acceptance-tests'
)
const SCENARIOS_DIR = path.resolve(ACCEPTANCE_TESTS_DIR, 'tests/support/scenarios')
const TEST_DIRS = ['tests/internal', 'tests/external']

/**
 * Generate a separate copy of scenario data for every spec that calls the `world` fixture, keyed by spec then scenario
 * name
 *
 * @returns {Promise<object>} the generated data for each spec, keyed by world key
 */
export default async function dataWorld() {
  const scenarios = {}
  const specs = await _specs()

  for (const { specFile, scenarioName } of specs) {
    const key = buildWorldKey(specFile, scenarioName)

    if (scenarios[key]) {
      throw new Error(`Two specs produce the same world key '${key}'`)
    }

    const scenarioPath = path.resolve(SCENARIOS_DIR, `${scenarioName}.scenario.js`)
    const { default: data } = await import(`file://${scenarioPath}`)

    scenarios[key] = data()
  }

  return scenarios
}

/**
 * Find every spec that calls the `world` fixture, and the scenario it asks for, e.g. world('licence')
 *
 * @returns {Promise<object[]>} one entry per matching spec, each with `specFile` and `scenarioName`
 */
async function _specs() {
  const specs = []

  for (const dir of TEST_DIRS) {
    const baseDir = path.resolve(ACCEPTANCE_TESTS_DIR, dir)
    const entries = await fs.readdir(baseDir, { recursive: true })

    for (const entry of entries) {
      const specFile = path.resolve(baseDir, entry)

      if (!entry.endsWith('.spec.js')) {
        continue
      }

      const content = await fs.readFile(specFile, 'utf-8')
      const matches = [...content.matchAll(/world\('([a-z0-9-]+)'\)/g)]

      if (matches.length > 1) {
        throw new Error(`Spec '${entry}' calls world() more than once; a spec can only use one scenario`)
      }

      if (matches.length === 1) {
        specs.push({ specFile, scenarioName: matches[0][1] })
      }
    }
  }

  return specs
}
