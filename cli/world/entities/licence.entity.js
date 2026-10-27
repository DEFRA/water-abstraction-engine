import addressData from '../data/address.data.js'
import companyAddressData from '../data/company-address.data.js'
import companyData from '../data/company.data.js'
import licenceData from '../data/licence.data.js'
import licenceDocumentData from '../data/licence-document.data.js'
import licenceDocumentHeaderData from '../data/licence-document-header.data.js'
import licenceDocumentRoleData from '../data/licence-document-role.data.js'
import licenceVersionData from '../data/licence-version.data.js'
import licenceVersionPurposeData from '../data/licence-version-purpose.data.js'
import licenceVersionPurposePointData from '../data/licence-version-purpose-point.data.js'
import permitLicenceData from '../data/permit-licence.data.js'
import pointData from '../data/point.data.js'
import { determineReturnCycleStartDate, formatDateToIso, previousPeriod, today } from '../helpers/date.helpers.js'

/**
 * Builds a licence in its entirety: the licence itself, its licence holder (company and address), permit licence,
 * licence document, licence document header, licence document role, licence version, and a licence version purpose
 * and point — the minimum valid data a licence needs to exist.
 *
 * @param {object} region - the region
 */
export default function (region) {
  const company = _company(region)
  const point = pointData(region)
  const licence = _licence(company.company, company.address, region)
  const licenceVersionPurpose = licenceVersionPurposeData(licence.licenceVersion, region)
  const licenceVersionPurposePoint = licenceVersionPurposePointData(licenceVersionPurpose, point)

  return {
    ...company,
    point,
    ...licence,
    licenceVersionPurpose,
    licenceVersionPurposePoint
  }
}

/**
 * Builds a company and its address, linked together as the licence holder.
 *
 * @private
 */
function _company(region) {
  const company = companyData(region)
  const address = addressData()
  const companyAddress = companyAddressData(company, address)

  return {
    company,
    address,
    companyAddress
  }
}

/**
 * Builds what a core licence looks like: the licence itself, plus its permit licence, licence document,
 * licence document header, licence document role, and licence version.
 *
 * @private
 */
function _licence(company, address, region) {
  const currentCycleStartDate = determineReturnCycleStartDate(today(), false)
  const { startDate: previousCycleStartDate } = previousPeriod({ startDate: currentCycleStartDate, quarterly: false })
  const startDate = formatDateToIso(previousCycleStartDate)

  const licence = licenceData(startDate, region)
  const permitLicence = permitLicenceData(licence)
  const licenceDocumentHeader = licenceDocumentHeaderData(licence, company)
  const licenceDocument = licenceDocumentData(licence)
  const licenceDocumentRole = licenceDocumentRoleData(licenceDocument, company, address)
  const licenceVersion = licenceVersionData(licence, company, address, region)

  return {
    permitLicence,
    licenceDocumentHeader,
    licenceDocument,
    licenceDocumentRole,
    licence,
    licenceVersion
  }
}
