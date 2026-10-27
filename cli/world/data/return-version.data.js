import { generateUUID } from '../../../test/support/generators.js'

/**
 * Build a return version record for a licence
 *
 * @param {object} licence - the licence record
 *
 * @returns {object} the data to load
 */
export default function (licence) {
  const returnVersionId = generateUUID()

  return {
    id: returnVersionId,
    version: 101,
    startDate: licence.startDate,
    endDate: null,
    status: 'current',
    licenceId: licence.id,
    multipleUpload: licence.waterUndertaker,
    quarterlyReturns: licence.waterUndertaker
  }
}
