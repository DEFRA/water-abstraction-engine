/**
/**
 * @module Generators
 */

import crypto from 'crypto'

import RegionHelper from './helpers/region.helper.js'
import { faker } from './faker.js'
import { formatDateObjectToISO } from '../../src/lib/dates.lib.js'
import { generateNoticeReferenceCode, generateUUID } from '../../src/lib/general.lib.js'

export { generateNoticeReferenceCode, generateUUID }

const VERIFICATION_CODE_CHARACTERS = '23456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXY'
const VERIFICATION_CODE_LENGTH = 5

/**
 * Generates an account number
 *
 * The account number is in the format '[charge region id]########A'. The leading letter must match the region's
 * charge region id - the app filters a company's existing billing accounts by whether the account number starts
 * with the selected region's code, so a mismatched prefix makes the app treat the company as having none. Pass the
 * region's charge region id when that matters.
 *
 * @param {string} [chargeRegionId='T'] - the letter the account number starts with
 *
 * @returns {string} - An account number
 */
export function generateAccountNumber(chargeRegionId = 'T') {
  return `${chargeRegionId}${generateRandomInteger(10000000, 99999999)}A`
}

/**
 * Generates an address
 *
 * We pick from a list of real Environment Agency office addresses (source:
 * https://www.gov.uk/government/organisations/environment-agency/about/access-and-opening) rather than generating
 * one, because a downstream service checks that the postcode we provide actually exists.
 *
 * @returns {object} An address object
 */
export function generateAddress() {
  return faker.helpers.arrayElement(_environmentAgencyAddresses)
}

/**
 * Generate an address external id
 *
 * This is built from NALD import data using the region code and address id
 *
 * @param {module:RegionModel|null} [region=null] - the region the address belongs to
 *
 * @returns {string} - A random external id
 */
export function generateAddressExternalId(region = null) {
  if (!region) {
    region = RegionHelper.select(RegionHelper.TEST_REGION_INDEX)
  }

  const addressId = generateRandomInteger(100, 99998)

  return `${region.naldRegionId}:${addressId}`
}

/**
 * Generates a Bill run number
 *
 * @param {object} region - the region
 * @returns {number} - A bill run number
 */
export function generateBillRunNumber(region = null) {
  if (!region) {
    region = RegionHelper.select(RegionHelper.TEST_REGION_INDEX)
  }

  return Number(`${region.naldRegionId}${generateRandomInteger(10000, 99999)}`)
}

/**
 * Generates a company contact
 *
 * @param {string} companyName - The name of the company
 *
 * @returns {object} A company contact object
 */
export function generateCompanyContact(companyName) {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()

  const email = faker.internet.email({ firstName, lastName, provider: `${_provider(companyName)}.com` }).toLowerCase()

  return {
    department: `${firstName} ${lastName}`,
    firstName,
    lastName,
    email
  }
}

/**
 * Generate a company email address
 *
 * @param {string} companyName - The name of the company (e.g., "Hamill & Jones")
 * @returns {string} An email address (e.g., "daryl.denesik34@hamill-jones.com")
 */
export function generateCompanyEmailAddress(companyName) {
  return faker.internet.email({ provider: `${_provider(companyName)}.com` }).toLowerCase()
}

/**
 * Generate a company external id
 *
 * This is built from NALD import data using the region code and party id
 *
 * @param {module:RegionModel|null} [region=null] - the region the company belongs to
 *
 * @returns {string} - A random external id
 */
export function generateCompanyExternalId(region = null) {
  if (!region) {
    region = RegionHelper.select(RegionHelper.TEST_REGION_INDEX)
  }

  const partyId = generateRandomInteger(100, 9999998)

  return `${region.naldRegionId}:${partyId}`
}

/**
 * Generate a company number
 *
 * @returns {int} - A random company number
 */
export function generateCompanyNumber() {
  return generateRandomInteger(1000000, 9999999).toString()
}

/**
 * Creates an MD5 hash of contact name and address to be used for comparing 'contacts'
 *
 * @param {string} contactName - The contact name to be used with the address
 * @param {object} address - The address (lines 1 to 4 plus postcode and country) to be converted to a hash
 *
 * @returns {string} - The md5 'hash ID' of the contact name and address
 */
export function generateContactHashId(contactName, address) {
  const addressLine1 = address.addressLine1
  const addressLine2 = address.addressLine2 ?? ''
  const addressLine3 = address.addressLine3 ?? ''
  const addressLine4 = address.addressLine4
  const postcode = address.postcode ?? ''
  const country = address.country ?? ''

  const combinedString = `${contactName}${addressLine1}${addressLine2}${addressLine3}${addressLine4}${postcode}${country}`

  return crypto.createHash('md5').update(combinedString).digest('hex')
}

/**
 * Generate a unique email address (external)
 *
 * We use 'acceptance.test.' to delete all relevant test email address.
 *
 * We use 'Date.now()' to ensure all email are unique.
 *
 * @returns {string} - An email address
 */
export function generateExternalEmailAddress() {
  return faker.internet.email().toLowerCase()
}

/**
 * Generate a unique GOV UK email address (internal)
 *
 *
 *
 * @returns {string} - A defra.gov.uk email address
 */
export function generateGovUKEmail() {
  return faker.internet.email({ provider: 'defra.gov.uk' }).toLowerCase()
}

/**
 * Generates an Invoice number
 *
 * The invoice number is in the format '[charge region id]AI#######T'. Real invoice numbers are returned by the
 * Charging Module when a bill run is sent - we don't call that service, so we generate our own that looks the same,
 * e.g. 'SAI0001234T'.
 *
 * @param {object} region - the region the invoice number's charge region id prefix is generated for
 *
 * @returns {string} - An invoice number
 */
export function generateInvoiceNumber(region = null) {
  if (!region) {
    region = RegionHelper.select(RegionHelper.TEST_REGION_INDEX)
  }

  const sequence = generateRandomInteger(1, 9999999).toString().padStart(7, '0')

  return `${region.chargeRegionId}AI${sequence}T`
}

/**
 * Returns a randomly generated licence reference
 *
 * We use 'AT/TE/ST/' as the start of test licences so we can delete them in the teardown.
 *
 * @returns {string} - A randomly generated licence reference
 */
export function generateLicenceRef() {
  return `AT/TE/ST/${generateRandomInteger(1000, 9999)}/${generateRandomInteger(1000, 9999)}`
}

/**
 * Returns a randomly generated externalId for a licence version
 *
 * @param {module:RegionModel|null} [region=null] - the region the licence version belongs to
 *
 * @returns {string} - A randomly generated externalId
 */
export function generateLicenceVersionExternalId(region = null) {
  if (!region) {
    region = RegionHelper.select(RegionHelper.TEST_REGION_INDEX)
  }

  return `${region.naldRegionId}:${generateRandomInteger(10000, 99999999)}:${generateRandomInteger(1, 100)}:0`
}

/**
 * Returns a randomly generated licence version purpose external id
 *
 * @param {module:RegionModel|null} [region=null] - the region the licence version purpose belongs to
 *
 * @returns {string} - A randomly generated external id
 */
export function generateLicenceVersionPurposeExternalId(region = null) {
  if (!region) {
    region = RegionHelper.select(RegionHelper.TEST_REGION_INDEX)
  }

  return `${region.naldRegionId}:${generateRandomInteger(10000, 99999999)}`
}

/**
 * Returns a randomly generated licence version purpose point external ID (9:100:1)
 *
 * Combines IDs found in `NALD_ABS_PURP_POINTS` which is the basis for licence version purpose points.
 *
 * - `[region code]:[licence version purpose ID]:[point ID]` - all values are NALD IDs
 *
 * @param {module:RegionModel|null} [region=null] - the region the licence version purpose point belongs to
 *
 * @returns {string} - A randomly generated licence version purpose point external ID
 */
export function generateLicenceVersionPurposePointExternalId(region = null) {
  if (!region) {
    region = RegionHelper.select(RegionHelper.TEST_REGION_INDEX)
  }

  const naldPointId = generateNaldPointId()

  return `${region.naldRegionId}:${generateRandomInteger(100, 99999)}:${naldPointId}`
}

/**
 * Generates a random name
 *
 * @returns {string} a random name in the format [random UUID]@example.co.uk
 */
export function generateName() {
  return `${generateUUID()}@example.co.uk`
}

/**
 * Returns a randomly generated NALD point ID (55944)
 *
 * @returns {string} - A randomly generated point ID
 */
export function generateNaldPointId() {
  return generateRandomInteger(1, 99999)
}

/**
 * Returns a randomly generated National Grid Reference NGR (TL 5143 7153)
 *
 * @returns {string} - A randomly National Grid Reference NGR
 */
export function generateNationalGridReference() {
  // NOTE: These are taken from https://en.wikipedia.org/wiki/Ordnance_Survey_National_Grid and are the 100KM
  // square references that cover the majority of the UK (sorry far North!)
  const codes = ['SD', 'SE', 'SJ', 'SK', 'SO', 'SP', 'ST', 'SU', 'SY', 'SZ', 'TA', 'TF', 'TL', 'TQ', 'TV', 'TG', 'TM']

  return `${codes[generateRandomInteger(0, 16)]} ${generateRandomInteger(100, 999)} ${generateRandomInteger(100, 999)}`
}

/**
 * Generates a Point external id
 *
 * @param {object} region - the region
 * @returns {string} - A point external id
 */
export function generatePointExternalId(region = null) {
  if (!region) {
    region = RegionHelper.select(RegionHelper.TEST_REGION_INDEX)
  }

  return `${region.naldRegionId}:${region.naldRegionId}${generateRandomInteger(100000, 99999999)}`
}

/**
 * Generate a random integer within a range
 *
 * Uses the shared Faker instance rather than `crypto.randomInt()`, so seeding it with `faker.seed()` gives the same
 * values on every machine. Like `crypto.randomInt()`, `min` is included and `max` is not.
 *
 * @param {number} min - the lowest number that can be returned
 * @param {number} max - one more than the highest number that can be returned
 *
 * @returns {number} a random integer from `min` up to, but not including, `max`
 */
export function generateRandomInteger(min, max) {
  return faker.number.int({ min, max: max - 1 })
}

/**
 * Generates a return requirement reference
 *
 * @returns {number}
 */
export function generateReference() {
  return generateRandomInteger(10000000, 99999999)
}

/**
 * Generates a NALD pattern external ID (e.g. 9:10001)
 *
 * The pattern is: [region code]:[NALD ID]
 *
 * @param {number|null} [regionCode=null] - The region code to use, if not provided a random one is used
 *
 * @returns {string} The generated external ID
 */
export function generateRegionNaldPatternExternalId(regionCode = null) {
  if (!regionCode) {
    regionCode = RegionHelper.select(RegionHelper.TEST_REGION_INDEX).naldRegionId
  }

  return `${regionCode}:${generateRandomInteger(100, 99999)}`
}

/**
 * Returns a randomly generated return log Id
 *
 * Unlike other tables, the previous team opted to generate a unique ID based on properties of the return log including
 * start and end dates, version and references.
 *
 * So, in order to replicate that we have this helper method, that defaults some of those values, and randomises others
 * in order to generate a unique return log ID.
 *
 * If you have known values, for example, the licence reference they can be passed to this helper and it will
 * incorporate them into the ID.
 *
 * @param {string} [startDate] - the start date as a string, for example '2022-04-01'
 * @param {string} [endDate] - the end date as a string, for example '2023-03-31'
 * @param {number} [version] - the version number to use, for example 1
 * @param {string} [licenceRef] - the licence reference to use
 * @param {string} [returnReference] - the return requirement reference to use
 *
 * @returns {string} the generated return log ID
 */
export function generateReturnId(
  startDate = new Date('2022-04-01'),
  endDate = new Date('2023-03-31'),
  version = 1,
  licenceRef = null,
  returnReference = null
) {
  if (!licenceRef) {
    licenceRef = generateLicenceRef()
  }

  if (!returnReference) {
    returnReference = generateReference()
  }

  return `v${version}:1:${licenceRef}:${returnReference}:${formatDateObjectToISO(startDate)}:${formatDateObjectToISO(endDate)}`
}

/**
 * Returns a randomly generated return requirement point external ID (9:100:1)
 *
 * Combines IDs found in `NALD_RET_FMT_POINTS` which is the basis for return requirements points.
 *
 * - `[region code]:[return requirement ID]:[point ID]` - all values are NALD IDs
 *
 * @param {module:RegionModel|null} [region=null] - the region the return requirement point belongs to
 *
 * @returns {string} - A randomly generated return requirement point external ID
 */
export function generateReturnRequirementPointExternalId(region = null) {
  if (!region) {
    region = RegionHelper.select(RegionHelper.TEST_REGION_INDEX)
  }

  const naldPointId = generateNaldPointId()

  return `${region.naldRegionId}:${generateRandomInteger(100, 99999)}:${naldPointId}`
}

/**
 * Generate an UPRN for an address
 *
 * @returns {string} - A random UPRN
 */
export function generateUprn() {
  return generateRandomInteger(100, 999999999999)
}

/**
 * Generates a random user ID
 *
 * @returns {number} a random integer between 100011 and 199999
 */
export function generateUserId() {
  // The last ID in the pre-seeded users is 100010
  return generateRandomInteger(100011, 199999)
}

/**
 * Generates a random user name
 *
 * @returns {string} a random user name in the format [random UUID]@wrls.gov.uk
 */
export function generateUserName() {
  return `${generateUUID()}@wrls.gov.uk`
}

/**
 * Generates a random verification code
 *
 * @returns {string} a random 5-character verification code, using the allowed characters
 */
export function generateVerificationCode() {
  return Array.from({ length: VERIFICATION_CODE_LENGTH }, () => {
    return VERIFICATION_CODE_CHARACTERS.charAt(generateRandomInteger(0, VERIFICATION_CODE_CHARACTERS.length - 1))
  }).join('')
}

/**
 * Regex Explanation:
 * 1. /[^a-z0-9]+/g     - Replaces any sequence of non-alphanumeric characters (spaces, symbols) with a single hyphen.
 * 2. /^[-_]+|[-_]+$/g  - Strips any leftover hyphens or underscores from the start (^) or end ($) of the domain string.
 *
 * So "Acme Corporation!" becomes "acme-corporation"
 *
 * @private
 */
function _provider(companyName) {
  return companyName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^[-_]+|[-_]+$/g, '')
}

const _environmentAgencyAddresses = [
  {
    address1: 'ENVIRONMENT AGENCY',
    address2: 'Orchard House',
    address3: 'Endeavour Park, London Road',
    address4: 'West Malling',
    postcode: 'ME19 5SH'
  },
  {
    address1: 'ENVIRONMENT AGENCY',
    address2: 'Sunrise Business Park',
    address3: 'Higher Shaftesbury Road',
    address4: 'Blandford Forum',
    postcode: 'DT11 8ST'
  },
  {
    address1: 'ENVIRONMENT AGENCY',
    address2: 'Sir John Moore House',
    address3: 'Victoria Square',
    address4: 'Bodmin',
    postcode: 'PL31 1EB'
  },
  {
    address1: 'ENVIRONMENT AGENCY',
    address2: 'Rivers House',
    address3: 'East Quay',
    address4: 'Bridgwater',
    postcode: 'TA6 4YS'
  },
  {
    address1: 'ENVIRONMENT AGENCY',
    address2: 'Manley House',
    address3: 'Kestrel Way',
    address4: 'Exeter',
    postcode: 'EX2 7LQ'
  },
  {
    address1: 'ENVIRONMENT AGENCY',
    address2: 'Iceni House',
    address3: 'Cobham Road',
    address4: 'Ipswich',
    postcode: 'IP3 9JD'
  },
  {
    address1: 'ENVIRONMENT AGENCY',
    address2: 'Lateral',
    address3: '8 City Walk',
    address4: 'Leeds',
    postcode: 'LS11 9AT'
  },
  {
    address1: 'ENVIRONMENT AGENCY',
    address2: 'Sentinel House',
    address3: '9 Wellington Crescent, Fradley Park',
    address4: 'Lichfield',
    postcode: 'WS13 8RR'
  },
  {
    address1: 'ENVIRONMENT AGENCY',
    address2: 'Ceres House',
    address3: '2 Searby Road',
    address4: 'Lincoln',
    postcode: 'LN2 4DT'
  },
  {
    address1: 'ENVIRONMENT AGENCY',
    address2: 'Tyneside House',
    address3: 'Skinnerburn Road, Newcastle Business Park',
    address4: 'Newcastle upon Tyne',
    postcode: 'NE4 7AR'
  },
  {
    address1: 'ENVIRONMENT AGENCY',
    address2: 'Dragonfly House',
    address3: '2 Gilders Way',
    address4: 'Norwich',
    postcode: 'NR3 1UB'
  },
  {
    address1: 'ENVIRONMENT AGENCY',
    address2: 'Trentside',
    address3: 'Scarrington Road',
    address4: 'West Bridgford, Nottingham',
    postcode: 'NG2 5FA'
  },
  {
    address1: 'ENVIRONMENT AGENCY',
    address2: 'Ghyll Mount',
    address3: 'Gillan Way, Penrith 40 Business Park',
    address4: 'Penrith',
    postcode: 'CA11 9BP'
  },
  {
    address1: 'ENVIRONMENT AGENCY',
    address2: 'Lutra House',
    address3: 'Dodd Way Off Seedlee Road, Walton Summit Centre',
    address4: 'Bamber Bridge, Preston',
    postcode: 'PR5 8BX'
  },
  {
    address1: 'ENVIRONMENT AGENCY',
    address2: 'Romsey Office',
    address3: 'Canal Walk',
    address4: 'Romsey',
    postcode: 'SO51 8DU'
  },
  {
    address1: 'ENVIRONMENT AGENCY',
    address2: 'Hafren House',
    address3: 'Welshpool Road, Shelton',
    address4: 'Shrewsbury',
    postcode: 'SY3 8BB'
  },
  {
    address1: 'ENVIRONMENT AGENCY',
    address2: 'Riversmeet House',
    address3: 'Newtown Industrial Estate, Northway Lane',
    address4: 'Tewkesbury',
    postcode: 'GL20 8JG'
  },
  {
    address1: 'ENVIRONMENT AGENCY',
    address2: 'Red Kite House',
    address3: 'Howbery Park, Crowmarsh Gifford',
    address4: 'Wallingford',
    postcode: 'OX10 8BD'
  },
  {
    address1: 'ENVIRONMENT AGENCY',
    address2: 'Richard Fairclough House',
    address3: 'Knutsford Road, Latchford',
    address4: 'Warrington',
    postcode: 'WA4 1HT'
  },
  {
    address1: 'ENVIRONMENT AGENCY',
    address2: 'Alchemy',
    address3: 'Bessemer Road',
    address4: 'Welwyn Garden City',
    postcode: 'AL7 1HE'
  },
  {
    address1: 'ENVIRONMENT AGENCY',
    address2: 'Teville Gate House',
    address3: '25 Railway Approach',
    address4: 'Worthing',
    postcode: 'BN11 1UR'
  },
  {
    address1: 'ENVIRONMENT AGENCY',
    address2: 'Foss House',
    address3: '1-2 Peasholme Green, Kingspool',
    address4: 'York',
    postcode: 'YO1 7PX'
  }
]
