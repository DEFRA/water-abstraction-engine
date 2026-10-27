import { licenceModel } from './helpers/end-dates.helpers.js'
import { regionOf } from './helpers/regions.helpers.js'
import { correct, transfer } from './helpers/licence-versions.helpers.js'

/**
 * Give some live licences a licence version after the sroc start date
 *
 * A few live licences have changed since sroc started, so every 5th live licence that is not held by a water company,
 * starting with the 5th, is transferred to a new licence holder or corrected. Transfers and corrections are about as
 * common as each other, so they take turns. Each starts on the next date in the list, 1 April of a year from 2023 to
 * 2026, with the later years in it more than once as later changes are more common. A water company's licences are
 * left alone, as they are all held by the same company, and so is a licence whose current version starts on or after
 * its date.
 *
 * Each list is taken in turn, going back to the start when it runs out.
 *
 * Call this after the licence holders have been set, and before the abstraction details and charging, so they cover
 * the new licence versions.
 *
 * @param {object[]} licenceEntities - the licence entities to change
 */
export default function laterLicenceVersions(licenceEntities) {
  const CHANGE_DATES = ['2023-04-01', '2024-04-01', '2024-04-01', '2025-04-01', '2025-04-01', '2026-04-01']
  const CHANGES = [transfer, correct]
  const LATER_VERSION_EVERY = 5

  const liveLicenceEntities = licenceEntities.filter((licenceEntity) => {
    return !licenceModel(licenceEntity).$ended() && !licenceEntity.licence.waterUndertaker
  })

  const licenceEntitiesToChange = liveLicenceEntities.filter((_licenceEntity, index) => {
    return index % LATER_VERSION_EVERY === LATER_VERSION_EVERY - 1
  })

  for (let i = 0; i < licenceEntitiesToChange.length; i++) {
    const licenceEntity = licenceEntitiesToChange[i]
    const currentLicenceVersion = licenceEntity.licenceVersions.at(-1)
    const change = CHANGES[i % CHANGES.length]
    const changeDate = CHANGE_DATES[i % CHANGE_DATES.length]

    if (currentLicenceVersion.startDate < changeDate) {
      change(licenceEntity, regionOf(licenceEntity).region, changeDate)
    }
  }
}
