import { generateUUID } from '../../../test/support/generators.js'

/**
 * Build a licence document record for a licence
 *
 * @param {object} licence - the licence record
 *
 * @returns {object} the data to load
 */
export default function (licence) {
  const licenceDocumentId = generateUUID()

  return {
    id: licenceDocumentId,
    licenceRef: licence.licenceRef,
    startDate: licence.startDate
  }
}
