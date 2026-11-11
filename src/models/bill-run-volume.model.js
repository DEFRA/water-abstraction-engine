/**
 * Model for bill_run_volumes (water.billing_volumes)
 * @module BillRunVolumeModel
 */

import { Model } from 'objection'

import BaseModel from './base.model.js'
import BillRunModel from './bill-run.model.js'
import ChargeReferenceModel from './charge-reference.model.js'

export default class BillRunVolumeModel extends BaseModel {
  static get tableName() {
    return 'billRunVolumes'
  }

  static get relationMappings() {
    return {
      billRun: {
        join: {
          from: 'billRunVolumes.billRunId',
          to: 'billRuns.id'
        },
        modelClass: BillRunModel,
        relation: Model.BelongsToOneRelation
      },
      chargeReference: {
        join: {
          from: 'billRunVolumes.chargeReferenceId',
          to: 'chargeReferences.id'
        },
        modelClass: ChargeReferenceModel,
        relation: Model.BelongsToOneRelation
      }
    }
  }

  // NOTE: When we checked the live data the only statuses we could find in use were; 10, 40, 50, 60, 70, 90 and 100
  static get twoPartTariffStatuses() {
    return {
      lateReturns: 50,
      noMatchingChargeElement: 100,
      noReturnsForMatching: 70,
      noReturnsSubmitted: 10,
      notDueForBilling: 80,
      overAbstraction: 60,
      received: 30,
      returnLineOverlapsChargePeriod: 90,
      someReturnsDue: 40,
      underQuery: 20
    }
  }

  $twoPartTariffStatus() {
    const index = Object.values(BillRunVolumeModel.twoPartTariffStatuses).indexOf(this.twoPartTariffStatus)

    if (index !== -1) {
      return Object.keys(BillRunVolumeModel.twoPartTariffStatuses)[index]
    }

    return null
  }
}
