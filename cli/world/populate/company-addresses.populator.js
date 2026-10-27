import { licenceEndDate } from './helpers/end-dates.helpers.js'

/**
 * Make each company address the licence holder address of its company, as the import does
 *
 * A licence's company address is built for billing. The import builds one for each company and address that hold a
 * licence version, as the default licence holder address. It starts with the earliest of those licence versions, and
 * is open while any of them is. Once they have all ended, it ends on the latest of their ends. A licence version ends
 * on its end date or the licence's, whichever is first.
 *
 * Call this after everything that adds licence versions or ends licences.
 *
 * @param {object[]} licenceEntities - the licence entities to change
 */
export default function companyAddresses(licenceEntities) {
  const heldVersions = _heldVersions(licenceEntities)

  for (const licenceEntity of licenceEntities) {
    for (const companyAddress of licenceEntity.companyAddresses) {
      const versions = heldVersions.get(_key(companyAddress))
      const startDates = versions
        .map((version) => {
          return version.startDate
        })
        .sort()
      const endDates = versions.map((version) => {
        return version.endDate
      })

      companyAddress.licenceRoleId.value = 'licenceHolder'
      companyAddress.default = true
      companyAddress.startDate = startDates[0]

      if (!endDates.includes(null)) {
        companyAddress.endDate = endDates.sort().at(-1)
      }
    }
  }
}

/**
 * The start and end of every licence version, by the company and address that hold it
 *
 * @private
 */
function _heldVersions(licenceEntities) {
  const heldVersions = new Map()

  for (const licenceEntity of licenceEntities) {
    const endDate = licenceEndDate(licenceEntity)

    for (const licenceVersion of licenceEntity.licenceVersions) {
      const key = _key(licenceVersion)
      const endDates = [licenceVersion.endDate, endDate].filter(Boolean).sort()

      if (!heldVersions.has(key)) {
        heldVersions.set(key, [])
      }

      heldVersions.get(key).push({ startDate: licenceVersion.startDate, endDate: endDates[0] ?? null })
    }
  }

  return heldVersions
}

function _key({ companyId, addressId }) {
  return `${companyId}:${addressId}`
}
