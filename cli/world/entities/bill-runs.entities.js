import billData from '../data/bill.data.js'
import billLicenceData from '../data/bill-licence.data.js'
import billRunData from '../data/bill-run.data.js'
import transactionData from '../data/transaction.data.js'
import { transactionTotals } from '../helpers/billing.helpers.js'
import { previousYears, today } from '../helpers/date.helpers.js'

/**
 * Builds a bill run in its entirety: a sent bill run for the financial year ending taken from the given billing
 * period dates, and a bill, bill licence, and transaction for the given charge version's licence — the minimum
 * valid data a bill run needs to exist against a licence.
 *
 * @param {object} licenceEntity - the licence entity the bill licence is for
 * @param {object} billingAccountEntity - the billing account for the bill
 * @param {object} chargeVersionEntity - the charge version the bill and transaction are for
 * @param {object} dates - the billing period dates; `dates.endDate` sets the bill run's financial year ending
 * @param {object} region - the region
 */
export default function (licenceEntity, billingAccountEntity, chargeVersionEntity, dates, region) {
  const billRunEntities = []

  const chargeVersionStartDate = new Date(chargeVersionEntity.chargeVersion.startDate)
  const currentPeriodStartDate = new Date(dates.startDate)
  const yearsBack = Math.max(0, currentPeriodStartDate.getFullYear() - chargeVersionStartDate.getFullYear())

  for (let offset = 0; offset <= yearsBack; offset++) {
    const period = {
      startDate: previousYears(dates.startDate, offset),
      endDate: previousYears(dates.endDate, offset)
    }

    const billRunEntity = _billRunEntity(licenceEntity, billingAccountEntity, chargeVersionEntity, period, region)

    if (offset > 0) {
      billRunEntity.billRun.createdAt = previousYears(today(), offset)
    }

    billRunEntities.push(billRunEntity)
  }

  return billRunEntities
}

function _billRunEntity(licenceEntity, billingAccountEntity, chargeVersionEntity, dates, region) {
  const { licence } = licenceEntity
  const { billingAccount } = billingAccountEntity
  const { chargeReference } = chargeVersionEntity

  const billRun = billRunData(region)

  billRun.createdAt = today()
  billRun.fromFinancialYearEnding = new Date(dates.endDate).getUTCFullYear()
  billRun.toFinancialYearEnding = new Date(dates.endDate).getUTCFullYear()

  const bill = billData(billingAccount, billRun, region)
  const billLicence = billLicenceData(bill, licence)

  const transactions = [transactionData(billLicence, chargeReference, dates)]

  _compensationCharge(licenceEntity, billLicence, chargeVersionEntity, dates, transactions)

  const { creditNoteValue, invoiceValue, netAmount } = transactionTotals(transactions)

  bill.netAmount = netAmount
  bill.creditNoteValue = creditNoteValue
  bill.invoiceValue = invoiceValue

  billRun.invoiceCount = 1
  billRun.creditNoteCount = 0
  billRun.invoiceValue = invoiceValue
  billRun.creditNoteValue = creditNoteValue
  billRun.netTotal = netAmount

  return {
    billRun,
    bill,
    billLicence,
    transactions
  }
}

function _compensationCharge(licenceEntity, billLicence, chargeVersionEntity, dates, transactions) {
  if (!licenceEntity.licence.waterUndertaker) {
    const compensationTransaction = transactionData(billLicence, chargeVersionEntity.chargeReference, dates)

    compensationTransaction.chargeType = 'compensation'
    compensationTransaction.netAmount = 0
    compensationTransaction.description =
      'Compensation charge: calculated from the charge reference, activity description and regional environmental improvement charge; excludes any supported source additional charge and two-part tariff charge agreement'

    transactions.push(compensationTransaction)
  }
}
