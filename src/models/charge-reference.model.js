/**
 * Model for charge_references (water.charge_elements)
 * @module ChargeReferenceModel
 */

import { Model } from 'objection'

import BaseModel from './base.model.js'
import BillRunVolumeModel from './bill-run-volume.model.js'
import ChargeCategoryModel from './charge-category.model.js'
import ChargeElementModel from './charge-element.model.js'
import ChargeVersionModel from './charge-version.model.js'
import PurposeModel from './purpose.model.js'
import ReviewChargeReferenceModel from './review-charge-reference.model.js'
import TransactionModel from './transaction.model.js'

export default class ChargeReferenceModel extends BaseModel {
  static get tableName() {
    return 'chargeReferences'
  }

  static get relationMappings() {
    return {
      billRunVolumes: {
        join: {
          from: 'chargeReferences.id',
          to: 'billRunVolumes.chargeReferenceId'
        },
        modelClass: BillRunVolumeModel,
        relation: Model.HasManyRelation
      },
      chargeCategory: {
        join: {
          from: 'chargeReferences.chargeCategoryId',
          to: 'chargeCategories.id'
        },
        modelClass: ChargeCategoryModel,
        relation: Model.BelongsToOneRelation
      },
      chargeElements: {
        join: {
          from: 'chargeReferences.id',
          to: 'chargeElements.chargeReferenceId'
        },
        modelClass: ChargeElementModel,
        relation: Model.HasManyRelation
      },
      chargeVersion: {
        join: {
          from: 'chargeReferences.chargeVersionId',
          to: 'chargeVersions.id'
        },
        modelClass: ChargeVersionModel,
        relation: Model.BelongsToOneRelation
      },
      purpose: {
        join: {
          from: 'chargeReferences.purposeId',
          to: 'purposes.id'
        },
        modelClass: PurposeModel,
        relation: Model.BelongsToOneRelation
      },
      reviewChargeReferences: {
        join: {
          from: 'chargeReferences.id',
          to: 'reviewChargeReferences.chargeReferenceId'
        },
        modelClass: ReviewChargeReferenceModel,
        relation: Model.HasManyRelation
      },
      transactions: {
        join: {
          from: 'chargeReferences.id',
          to: 'transactions.chargeReferenceId'
        },
        modelClass: TransactionModel,
        relation: Model.HasManyRelation
      }
    }
  }
}
