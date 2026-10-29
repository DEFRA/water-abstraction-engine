import { generateInvoiceNumber } from '../helpers/generators.helpers.js'
import { generateUUID } from '../../../test/support/generators.js'

/**
 * Build a bill record for a billing account in a bill run
 *
 * @param {object} billingAccount - the billing account record
 * @param {object} billRun - the bill run record
 * @param {object} region - the region record
 *
 * @returns {object} the data to load
 */
export default function (billingAccount, billRun, region) {
  return {
    id: generateUUID(),
    billingAccountId: billingAccount.id,
    address: {},
    accountNumber: billingAccount.accountNumber,
    invoiceNumber: generateInvoiceNumber(region),
    billRunId: billRun.id,
    financialYearEnding: billRun.toFinancialYearEnding,
    netAmount: 0,
    invoiceValue: 0,
    creditNoteValue: 0,
    credit: false
  }
}
