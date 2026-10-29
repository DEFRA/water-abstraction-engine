import { chargeYearAmount } from '../helpers/billing.helpers.js'
import { generateUUID } from '../../../test/support/generators.js'

/**
 * Build a transaction record for a bill licence and charge reference
 *
 * @param {object} billLicence - the bill licence record
 * @param {object} chargeReference - the charge reference record
 * @param {object} dates - the dates for the transaction
 *
 * @returns {object} the data to load
 */
export default function (billLicence, chargeReference, dates) {
  const netAmount = chargeYearAmount(dates.endDate.getUTCFullYear(), chargeReference.section127Agreement)

  return {
    id: generateUUID(),
    billLicenceId: billLicence.id,
    chargeReferenceId: chargeReference.id,
    chargeType: 'standard',
    startDate: dates.startDate,
    endDate: dates.endDate,
    source: chargeReference.source,
    loss: chargeReference.loss,
    volume: chargeReference.volume,
    scheme: chargeReference.scheme,
    section127Agreement: chargeReference.section127Agreement,
    section130Agreement: 'false',
    description: chargeReference.description,
    chargeCategoryCode: chargeReference.chargeCategoryId.value,
    chargeCategoryDescription: 'Test charge category',
    purposes: [{}],
    netAmount,
    credit: false
  }
}
