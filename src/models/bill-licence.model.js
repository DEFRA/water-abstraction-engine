/**
 * Model for bill_licences (water.billing_invoice_licences)
 * @module BillLicenceModel
 */

import { Model } from 'objection'

import BaseModel from './base.model.js'
import BillModel from './bill.model.js'
import LicenceModel from './licence.model.js'
import TransactionModel from './transaction.model.js'

export default class BillLicenceModel extends BaseModel {
  static get tableName() {
    return 'billLicences'
  }

  static get relationMappings() {
    return {
      bill: {
        join: {
          from: 'billLicences.billId',
          to: 'bills.id'
        },
        modelClass: BillModel,
        relation: Model.BelongsToOneRelation
      },
      licence: {
        join: {
          from: 'billLicences.licenceId',
          to: 'licences.id'
        },
        modelClass: LicenceModel,
        relation: Model.BelongsToOneRelation
      },
      transactions: {
        join: {
          from: 'billLicences.id',
          to: 'transactions.billLicenceId'
        },
        modelClass: TransactionModel,
        relation: Model.HasManyRelation
      }
    }
  }
}
