import abstraction from './populate/abstraction.populator.js'
import charging from './populate/charging.populator.js'
import companyAddresses from './populate/company-addresses.populator.js'
import endDates from './populate/end-dates.populator.js'
import laterLicenceVersions from './populate/later-licence-versions.populator.js'
import licenceHolders from './populate/licence-holders.populator.js'
import licences from './populate/licences.populator.js'
import { mergeByKey } from './helpers/scenario.helpers.js'
import monitoringStations from './populate/monitoring-stations.populator.js'
import returnVersions from './populate/return-versions.populator.js'
import workflows from './populate/workflows.populator.js'

/**
 * Generate the data that populates the world when it is created from the CLI, on top of what the specs ask for
 *
 * The licences are built first. Then each populator changes or adds to them, in order, as later ones depend on what
 * earlier ones have set.
 *
 * @returns {object} the data, keyed by database table name
 */
export default function populateWorld() {
  const licenceEntities = licences()

  licenceHolders(licenceEntities)
  laterLicenceVersions(licenceEntities)
  abstraction(licenceEntities)
  endDates(licenceEntities)
  companyAddresses(licenceEntities)
  monitoringStations(licenceEntities)
  charging(licenceEntities)
  workflows(licenceEntities)
  returnVersions(licenceEntities)

  return mergeByKey(...licenceEntities)
}
