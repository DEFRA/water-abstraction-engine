import path from 'path'

/**
 * Build the world.json key for a spec and the scenario it seeds, e.g. '.../search.spec.js' + 'licence' ->
 * 'search-licence'
 *
 * @param {string} specFile - path to the spec file, e.g. '.../search.spec.js'
 * @param {string} scenarioName - the scenario file name without '.scenario.js', e.g. 'licence'
 *
 * @returns {string} the world.json key, e.g. 'search-licence'
 */
export default function buildWorldKey(specFile, scenarioName) {
  const specSlug = path.basename(specFile, '.spec.js')

  return `${specSlug}-${scenarioName}`
}
