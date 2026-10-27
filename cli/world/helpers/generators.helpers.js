import { faker } from '@faker-js/faker'

import RegionHelper from '../../../test/support/helpers/region.helper.js'
import { generateRandomInteger } from '../../../test/support/generators.js'

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
 * Generates an account number
 *
 * The account number is in the format '[charge region id]########A'. The leading letter must match the region's
 * charge region id - the app filters a company's existing billing accounts by whether the account number starts
 * with the selected region's code, so a mismatched prefix makes the app treat the company as having none. Falls
 * back to 'S' (our seeded Test Region) when no region is passed, since the engine's own `generateAccountNumber()`
 * always uses 'T', which doesn't match Test Region either.
 *
 * @param {object} region - the region the account number's charge region id prefix is generated for
 *
 * @returns {string} - An account number
 */
export function generateAccountNumber(region) {
  const chargeRegionId = region
    ? region.chargeRegionId
    : RegionHelper.select(RegionHelper.TEST_REGION_INDEX).chargeRegionId

  return `${chargeRegionId}${generateRandomInteger(10000000, 99999999)}A`
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
 * Generate a company email address
 *
 * @param {string} companyName - The name of the company (e.g., "Hamill & Jones")
 * @returns {string} An email address (e.g., "daryl.denesik34@hamill-jones.com")
 */
export function generateCompanyEmailAddress(companyName) {
  return faker.internet.email({ provider: `${_provider(companyName)}.com` }).toLowerCase()
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
