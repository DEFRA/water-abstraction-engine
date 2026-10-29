import buildChargeVersionEntity from '../entities/charge-version.entity.js'
import { formatDateToIso } from './date.helpers.js'
import { srocStartDate } from '../default-values.js'

/**
 * Flags a licence for supplementary billing, supersedes the current charge version by reference, and creates a new
 * revised version.
 *
 * @param {object} licenceEntity - the licence entity
 * @param {object} billingAccountEntity - the billing account entity
 * @param {object} chargeVersionEntity - the charge version entity
 * @param {object} region - the region the additional charge version is for
 *
 * @returns {object} An additional charge version that would be the reason for the 'includeInSrocBilling' flag being set
 */
export function includeInSrocSupplementaryBilling(licenceEntity, billingAccountEntity, chargeVersionEntity, region) {
  // This is what flags the licence for the next sroc supplementary bill run — without it, fetch-charge-versions
  // (the query the supplementary engine uses to find what to bill) excludes the licence entirely
  licenceEntity.licence.includeInSrocBilling = true

  chargeVersionEntity.chargeVersion.status = 'superseded'

  const additionalChargeEntity = buildChargeVersionEntity(licenceEntity, billingAccountEntity, region)

  additionalChargeEntity.chargeReference.waterModel = 'tier 1'

  additionalChargeEntity.chargeReference.chargeCategoryId.value = '4.6.2'

  additionalChargeEntity.chargeVersion.versionNumber = chargeVersionEntity.chargeVersion.versionNumber + 1
  additionalChargeEntity.chargeVersion.changeReasonId.value = 'Error correction'

  return additionalChargeEntity
}

/**
 * Sets the Pre-SROC billing flag on a licence entity and sets the end date on the associated charge version.
 *
 * @param {object} presrocLicenceEntity - the licence entity to mark for presroc billing
 * @param {object} presrocChargeVersionEntity - the billing account entity
 */
export function includeInPresrocSupplementaryBilling(presrocLicenceEntity, presrocChargeVersionEntity) {
  // This is what flags the licence for the next presroc and sroc supplementary bill runs — without it, each
  // engine's charge version query excludes the licence entirely
  presrocLicenceEntity.licence.includeInPresrocBilling = 'yes'

  // The presroc charge version ends the day before the sroc one below begins, reflecting a licence that was
  // properly superseded at the scheme boundary rather than one left open-ended
  const presrocChargeVersionEndDate = new Date(srocStartDate)

  presrocChargeVersionEndDate.setUTCDate(presrocChargeVersionEndDate.getUTCDate() - 1)

  presrocChargeVersionEntity.chargeVersion.endDate = formatDateToIso(presrocChargeVersionEndDate)
}

/**
 * Sets a bill run's type to two-part tariff on every entity in the array
 *
 * @param {object[]} billRunEntities - the bill run entities returned by buildBillRunEntities
 */
export function markAsTwoPartTariff(billRunEntities) {
  for (const billRunEntity of billRunEntities) {
    billRunEntity.billRun.batchType = 'two_part_tariff'
  }
}

/**
 * Sums a list of transactions into invoice, credit note, and net totals
 *
 * @param {object[]} transactions - the transactions to total
 *
 * @returns {object} The summed `creditNoteValue`, `invoiceValue`, and `netAmount` (invoice minus credit note)
 */
export function transactionTotals(transactions) {
  let invoiceValue = 0
  let creditNoteValue = 0

  for (const transaction of transactions) {
    if (transaction.credit) {
      creditNoteValue += transaction.netAmount
    } else {
      invoiceValue += transaction.netAmount
    }
  }

  return {
    creditNoteValue,
    invoiceValue,
    netAmount: invoiceValue - creditNoteValue
  }
}

/**
 * Looks up the standard charge amount for a financial year, halved when the charge is two-part tariff
 *
 * @param {number} chargeYear - the financial year ending to look up the charge amount for
 * @param {boolean} twoPartTariff - whether to halve the amount for a two-part tariff charge
 *
 * @returns {number} The charge amount for the year, halved if `twoPartTariff` is true
 */
export function chargeYearAmount(chargeYear, twoPartTariff) {
  const chargeYearAmounts = {
    2027: {
      scheme: 'sroc',
      amount: 10676
    },
    2026: {
      scheme: 'sroc',
      amount: 10676
    },
    2025: {
      scheme: 'sroc',
      amount: 9700
    },
    2024: {
      scheme: 'sroc',
      amount: 9700
    },
    2023: {
      scheme: 'sroc',
      amount: 9700
    },
    2022: {
      scheme: 'presroc',
      amount: 2988
    }
  }

  const amount = chargeYearAmounts[chargeYear].amount

  if (twoPartTariff) {
    return amount / 2
  }

  return amount
}
