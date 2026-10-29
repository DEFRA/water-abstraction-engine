import { users } from '../default-values.js'

/**
 * Build a workflow record putting a licence in review with a draft charge version
 *
 * @param {object} licence - the licence record
 *
 * @returns {object} the data to load
 */
export default function (licence) {
  return {
    licenceId: licence.id,
    status: 'review',
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: {
      id: users.BILLING_AND_DATA.userId,
      email: users.BILLING_AND_DATA.username
    },
    data: {
      chargeVersion: {
        scheme: 'sroc',
        status: 'draft',
        dateRange: {
          startDate: licence.startDate
        },
        changeReason: {
          id: 'db22c827-c74d-40d9-aab8-282fd9843933',
          type: 'new_non_chargeable_charge_version',
          description: 'Aggregate licence',
          triggersMinimumCharge: false,
          isEnabledForNewChargeVersions: true
        },
        chargeElements: []
      }
    }
  }
}
