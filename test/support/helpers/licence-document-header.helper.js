/**
 * @module LicenceDocumentHeaderHelper
 */

import LicenceDocumentHeaderModel from '../../../src/models/licence-document-header.model.js'
import { generateLicenceRef, generateRandomInteger, generateUUID } from '../generators.js'

/**
 * Add a new licence document header
 *
 * If no `data` is provided, default values will be used. These are
 *
 * - `regimeEntityId` - [random UUID]
 * - `naldId` - [randomly generated - 105175]
 * - `licenceRef` - [randomly generated - 01/123]
 * - `metadata` - [object intended to be persisted] as JSON]
 *
 * @param {object} [data] - Any data you want to use instead of the defaults used here or in the database
 *
 * @returns {Promise<module:LicenceDocumentHeaderModel>} The instance of the newly created record
 */
async function add(data = {}) {
  const insertData = defaults(data)

  return LicenceDocumentHeaderModel.query()
    .insert({ ...insertData })
    .returning('*')
}

/**
 * Returns the defaults used
 *
 * It will override or append to them any data provided. Mainly used by the `add()` method, we make it available
 * for use in tests to avoid having to duplicate values.
 *
 * @param {object} [data] - Any data you want to use instead of the defaults used here or in the database
 *
 * @returns {object} - Returns the set defaults with the override data spread
 */
function defaults(data = {}) {
  const defaults = {
    licenceRef: generateLicenceRef(),
    metadata: _metadata(),
    naldId: generateRandomInteger(1000, 199999),
    regimeEntityId: generateUUID()
  }

  return {
    ...defaults,
    ...data
  }
}

function _metadata() {
  return {
    AddressLine1: 'ENVIRONMENT AGENCY',
    AddressLine2: 'HORIZON HOUSE',
    AddressLine3: 'DEANERY ROAD',
    AddressLine4: '',
    contacts: [
      {
        addressLine1: 'ENVIRONMENT AGENCY',
        addressLine2: 'HORIZON HOUSE',
        addressLine3: 'DEANERY ROAD',
        addressLine4: null,
        country: null,
        county: 'AVON',
        forename: 'AMARA',
        initials: 'A',
        name: 'GUPTA',
        postcode: 'BS1 5AH',
        role: 'Licence holder',
        salutation: null,
        town: 'BRISTOL',
        type: 'Person'
      }
    ],
    Country: '',
    County: 'AVON',
    Expires: null,
    Forename: 'AMARA',
    Initials: 'A',
    isCurrent: true,
    isSummer: true,
    Modified: '20080327',
    Name: 'GUPTA',
    Postcode: 'BS1 5AH',
    Salutation: '',
    Town: 'BRISTOL'
  }
}

export default {
  add,
  defaults
}
