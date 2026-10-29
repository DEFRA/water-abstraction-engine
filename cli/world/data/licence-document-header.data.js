import { generateUUID } from '../../../test/support/generators.js'

/**
 * Build a licence document header record for a licence and company
 *
 * @param {object} licence - the licence record
 * @param {object} company - the company record
 *
 * @returns {object} the data to load
 */
export default function (licence, company) {
  const licenceDocumentHeaderId = generateUUID()

  return {
    id: licenceDocumentHeaderId,
    regimeEntityId: {
      schema: 'public',
      table: 'licenceEntities',
      lookup: 'type',
      value: 'regime',
      select: 'id'
    },
    licenceRef: licence.licenceRef,
    naldId: {
      schema: 'public',
      table: 'permitLicences',
      lookup: 'licenceRef',
      value: licence.licenceRef,
      select: 'id'
    },
    metadata: {
      Name: company.name,
      dataType: 'acceptance-test-setup',
      IsCurrent: true,
      Salutation: '',
      AddressLine1: 'Big Farm',
      AddressLine2: 'ENVIRONMENT AGENCY',
      AddressLine3: 'HORIZON HOUSE',
      AddressLine4: 'DEANERY ROAD',
      Town: 'BRISTOL',
      County: 'BRISTOL',
      Postcode: 'BS1 5AH',
      Country: 'United Kingdom',
      contacts: [
        {
          name: company.name,
          role: 'Licence holder',
          town: 'Bristol',
          type: 'Organisation',
          county: null,
          country: null,
          forename: null,
          initials: null,
          postcode: 'BS1 5AH',
          salutation: null,
          addressLine1: 'Horizon House',
          addressLine2: 'Dean Lane',
          addressLine3: null,
          addressLine4: null
        }
      ]
    },
    licence_name: 'the daily cupcake licence'
  }
}
