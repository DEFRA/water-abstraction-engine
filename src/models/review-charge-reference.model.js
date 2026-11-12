/**
 * Model for review_charge_references
 * @module ReviewChargeReferenceModel
 */

import { Model } from 'objection'

import BaseModel from './base.model.js'
import ChargeReferenceModel from './charge-reference.model.js'
import ReviewChargeElementModel from './review-charge-element.model.js'
import ReviewChargeVersionModel from './review-charge-version.model.js'

export default class ReviewChargeReferenceModel extends BaseModel {
  static get tableName() {
    return 'reviewChargeReferences'
  }

  static get relationMappings() {
    return {
      chargeReference: {
        join: {
          from: 'reviewChargeReferences.chargeReferenceId',
          to: 'chargeReferences.id'
        },
        modelClass: ChargeReferenceModel,
        relation: Model.BelongsToOneRelation
      },
      reviewChargeElements: {
        join: {
          from: 'reviewChargeReferences.id',
          to: 'reviewChargeElements.reviewChargeReferenceId'
        },
        modelClass: ReviewChargeElementModel,
        relation: Model.HasManyRelation
      },
      reviewChargeVersion: {
        join: {
          from: 'reviewChargeReferences.reviewChargeVersionId',
          to: 'reviewChargeVersions.id'
        },
        modelClass: ReviewChargeVersionModel,
        relation: Model.BelongsToOneRelation
      }
    }
  }
}
