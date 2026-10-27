import { generateUUID } from '../../../test/support/generators.js'

/**
 * Build a bill licence record linking a bill to a licence
 *
 * @param {object} bill - the bill record
 * @param {object} licence - the licence record
 *
 * @returns {object} the data to load
 */
export default function (bill, licence) {
  return {
    id: generateUUID(),
    billId: bill.id,
    licenceRef: licence.licenceRef,
    licenceId: licence.id
  }
}
