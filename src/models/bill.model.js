/**
 * Model for bills (water.billing_invoices)
 * @module BillModel
 */

import { Model } from 'objection'

import BaseModel from './base.model.js'
import BillingAccountModel from './billing-account.model.js'
import BillLicenceModel from './bill-licence.model.js'
import BillRunModel from './bill-run.model.js'

export default class BillModel extends BaseModel {
  static get tableName() {
    return 'bills'
  }

  static get relationMappings() {
    return {
      billingAccount: {
        join: {
          from: 'bills.billingAccountId',
          to: 'billingAccounts.id'
        },
        modelClass: BillingAccountModel,
        relation: Model.BelongsToOneRelation
      },
      billLicences: {
        join: {
          from: 'bills.id',
          to: 'billLicences.billId'
        },
        modelClass: BillLicenceModel,
        relation: Model.HasManyRelation
      },
      billRun: {
        join: {
          from: 'bills.billRunId',
          to: 'billRuns.id'
        },
        modelClass: BillRunModel,
        relation: Model.BelongsToOneRelation
      }
    }
  }
}
