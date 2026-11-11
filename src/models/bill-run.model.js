/**
 * Model for bill_runs (water.billing_batches)
 * @module BillRunModel
 */

import { Model } from 'objection'

import BaseModel from './base.model.js'
import BillModel from './bill.model.js'
import BillRunVolumeModel from './bill-run-volume.model.js'
import RegionModel from './region.model.js'
import ReviewLicenceModel from './review-licence.model.js'

export default class BillRunModel extends BaseModel {
  static get tableName() {
    return 'billRuns'
  }

  static get relationMappings() {
    return {
      billRunVolumes: {
        join: {
          from: 'billRuns.id',
          to: 'billRunVolumes.billRunId'
        },
        modelClass: BillRunVolumeModel,
        relation: Model.HasManyRelation
      },
      bills: {
        join: {
          from: 'billRuns.id',
          to: 'bills.billRunId'
        },
        modelClass: BillModel,
        relation: Model.HasManyRelation
      },
      region: {
        join: {
          from: 'billRuns.regionId',
          to: 'regions.id'
        },
        modelClass: RegionModel,
        relation: Model.BelongsToOneRelation
      },
      reviewLicences: {
        join: {
          from: 'billRuns.id',
          to: 'reviewLicences.billRunId'
        },
        modelClass: ReviewLicenceModel,
        relation: Model.HasManyRelation
      }
    }
  }

  static get errorCodes() {
    return {
      failedToCreateBillRun: 50,
      failedToCreateCharge: 40,
      failedToDeleteInvoice: 60,
      failedToGetChargeModuleBillRunSummary: 80,
      failedToPopulateChargeVersions: 10,
      failedToPrepareTransactions: 30,
      failedToProcessChargeVersions: 20,
      failedToProcessRebilling: 90,
      failedToProcessTwoPartTariff: 70
    }
  }
}
