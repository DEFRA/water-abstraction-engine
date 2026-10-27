import { REGIONS, regionOf } from './helpers/regions.helpers.js'

/**
 * Hold some licences by a company that holds others
 *
 * In each region, every 24th licence is held by a water company, starting with the region's first. A region's water
 * company licences are all held by the same company. This is just an arbitrary way of adding several licences to a
 * water company.
 *
 * Most licence holders hold one licence, some hold a few and a very few hold many. So the rest of a region's licences
 * are taken in order and split into groups, each the size of the next number in `HOLDINGS`, and each group is held by
 * the same company. A group of 1 is left as it is. A group is cut short if the region runs out of licences, as a
 * company's licences are all in one region. Of every 48 numbers in `HOLDINGS`, 39 are 1, 8 are from 2 to 5 and 1 is 8.
 * It goes back to the start when it runs out, and carries on from where it got to in the next region.
 *
 * Call this straight after the licences are built, and before the later licence versions, so a licence that shares a
 * holder can still be transferred to another later.
 *
 * @param {object[]} licenceEntities - the licence entities to change
 */
export default function licenceHolders(licenceEntities) {
  const WATER_COMPANY_EVERY = 24

  const HOLDINGS = [
    1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 5, 1, 1, 1,
    1, 1, 3, 1, 1, 1, 1, 8, 2
  ]

  let holdingIndex = 0

  for (const { region } of REGIONS) {
    const regionLicenceEntities = licenceEntities.filter((licenceEntity) => {
      return regionOf(licenceEntity).region === region
    })

    const waterCompanyLicenceEntities = regionLicenceEntities.filter((_licenceEntity, index) => {
      return index % WATER_COMPANY_EVERY === 0
    })

    const otherLicenceEntities = regionLicenceEntities.filter((_licenceEntity, index) => {
      return index % WATER_COMPANY_EVERY !== 0
    })

    for (const licenceEntity of waterCompanyLicenceEntities) {
      licenceEntity.licence.waterUndertaker = true
    }

    _holdBySameCompany(waterCompanyLicenceEntities)

    let i = 0

    while (i < otherLicenceEntities.length) {
      const holding = HOLDINGS[holdingIndex % HOLDINGS.length]

      _holdBySameCompany(otherLicenceEntities.slice(i, i + holding))

      i += holding
      holdingIndex++
    }
  }
}

/**
 * Make the first licence's current licence holder the current licence holder of them all
 *
 * A licence's current licence holder is the last company, address and company address in its lists. Each licence
 * after the first drops its own, as they are no longer needed, and its licence versions and licence document roles
 * held by that company are given the first licence's company and address instead. Its licence document header is
 * changed to name the company. Any licence holders a licence had before that are left as they were.
 *
 * @private
 */
function _holdBySameCompany(licenceEntities) {
  const [firstLicenceEntity, ...otherLicenceEntities] = licenceEntities
  const company = firstLicenceEntity.companies.at(-1)
  const address = firstLicenceEntity.addresses.at(-1)

  for (const licenceEntity of otherLicenceEntities) {
    const droppedCompany = licenceEntity.companies.pop()

    licenceEntity.addresses.pop()
    licenceEntity.companyAddresses.pop()

    for (const held of [...licenceEntity.licenceVersions, ...licenceEntity.licenceDocumentRoles]) {
      if (held.companyId === droppedCompany.id) {
        held.companyId = company.id
        held.addressId = address.id
      }
    }

    licenceEntity.licenceDocumentHeader.metadata.Name = company.name
    licenceEntity.licenceDocumentHeader.metadata.contacts[0].name = company.name
  }
}
