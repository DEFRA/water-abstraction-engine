/**
 * Model for charge_elements (water.charge_purposes)
 * @module ChargeElementModel
 */

import { Model } from 'objection'

import BaseModel from './base.model.js'
import ChargeReferenceModel from './charge-reference.model.js'
import PurposeModel from './purpose.model.js'
import ReviewChargeElementModel from './review-charge-element.model.js'

export default class ChargeElementModel extends BaseModel {
  static get tableName() {
    return 'chargeElements'
  }

  static get relationMappings() {
    return {
      chargeReference: {
        join: {
          from: 'chargeElements.chargeReferenceId',
          to: 'chargeReferences.id'
        },
        modelClass: ChargeReferenceModel,
        relation: Model.BelongsToOneRelation
      },
      purpose: {
        join: {
          from: 'chargeElements.purposeId',
          to: 'purposes.id'
        },
        modelClass: PurposeModel,
        relation: Model.BelongsToOneRelation
      },
      reviewChargeElements: {
        join: {
          from: 'chargeElements.id',
          to: 'reviewChargeElements.chargeElementId'
        },
        modelClass: ReviewChargeElementModel,
        relation: Model.HasManyRelation
      }
    }
  }
}
