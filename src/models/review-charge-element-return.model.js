/**
 * Model for review_charge_elements_returns
 * @module ReviewChargeElementReturnModel
 */

import { Model } from 'objection'

import BaseModel from './base.model.js'
import ReviewChargeElementModel from './review-charge-element.model.js'
import ReviewReturnModel from './review-return.model.js'

export default class ReviewChargeElementReturnModel extends BaseModel {
  static get tableName() {
    return 'reviewChargeElementReturns'
  }

  static get relationMappings() {
    return {
      reviewChargeElement: {
        join: {
          from: 'reviewChargeElementReturns.reviewChargeElementId',
          to: 'reviewChargeElements.id'
        },
        modelClass: ReviewChargeElementModel,
        relation: Model.BelongsToOneRelation
      },
      reviewReturn: {
        join: {
          from: 'reviewChargeElementReturns.reviewReturnId',
          to: 'reviewReturns.id'
        },
        modelClass: ReviewReturnModel,
        relation: Model.BelongsToOneRelation
      }
    }
  }
}
