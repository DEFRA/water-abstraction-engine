import { chargeYearAmount } from '../helpers/billing.helpers.js'
import { generateUUID } from '../../../test/support/generators.js'

/**
 * Build a presroc transaction record for a bill licence and charge reference
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
    // A presroc (alcs scheme) transaction must have an abstraction period — unlike sroc, the DB check constraint
    // doesn't waive this for the alcs scheme
    abstractionPeriod: {
      startDay: chargeReference.abstractionPeriodStartDay,
      startMonth: chargeReference.abstractionPeriodStartMonth,
      endDay: chargeReference.abstractionPeriodEndDay,
      endMonth: chargeReference.abstractionPeriodEndMonth
    },
    source: chargeReference.source,
    loss: chargeReference.loss,
    scheme: chargeReference.scheme,
    section127Agreement: chargeReference.section127Agreement,
    description: chargeReference.description,
    purposes: [{}],
    netAmount,
    credit: false
  }
}
