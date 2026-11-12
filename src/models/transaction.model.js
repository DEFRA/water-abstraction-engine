/**
 * Model for transactions (water.billing_transactions)
 * @module TransactionModel
 */

import { Model } from 'objection'

import BaseModel from './base.model.js'
import BillLicenceModel from './bill-licence.model.js'
import ChargeReferenceModel from './charge-reference.model.js'

export default class TransactionModel extends BaseModel {
  static get tableName() {
    return 'transactions'
  }

  static get relationMappings() {
    return {
      billLicence: {
        join: {
          from: 'transactions.billLicenceId',
          to: 'billLicences.id'
        },
        modelClass: BillLicenceModel,
        relation: Model.BelongsToOneRelation
      },
      chargeReference: {
        join: {
          from: 'transactions.chargeReferenceId',
          to: 'chargeReferences.id'
        },
        modelClass: ChargeReferenceModel,
        relation: Model.BelongsToOneRelation
      }
    }
  }

  // Defining which fields contain json allows us to insert an object without needing to stringify it first
  static get jsonAttributes() {
    return ['abstractionPeriod', 'grossValuesCalculated', 'metadata', 'purposes']
  }
}
