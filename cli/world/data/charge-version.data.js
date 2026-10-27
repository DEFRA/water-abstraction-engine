import { generateUUID } from '../../../test/support/generators.js'
import { users } from '../default-values.js'

/**
 * Build a charge version record for a licence and billing account
 *
 * @param {object} billingAccount - the billing account record
 * @param {object} licence - the licence record
 * @param {object} region - the region record
 *
 * @returns {object} the data to load
 */
export default function (billingAccount, licence, region) {
  const chargeVersionId = generateUUID()

  return {
    id: chargeVersionId,
    licenceId: licence.id,
    licenceRef: licence.licenceRef,
    billingAccountId: billingAccount.id,
    regionCode: region.naldRegionId,
    scheme: 'sroc',
    versionNumber: 100,
    startDate: licence.startDate,
    status: 'current',
    source: 'wrls',
    createdBy: {
      id: users.BILLING_AND_DATA.userId,
      email: users.BILLING_AND_DATA.username
    },
    approvedBy: {
      id: users.BILLING_AND_DATA.userId,
      email: users.BILLING_AND_DATA.username
    },
    changeReasonId: {
      schema: 'public',
      table: 'changeReasons',
      lookup: 'description',
      value: 'New licence',
      select: 'id'
    }
  }
}
