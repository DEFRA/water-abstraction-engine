/**
 * Model for review_returns
 * @module ReviewReturnModel
 */

import { Model } from 'objection'

import BaseModel from './base.model.js'
import ReturnLogModel from './return-log.model.js'
import ReviewChargeElementModel from './review-charge-element.model.js'
import ReviewChargeElementReturnModel from './review-charge-element-return.model.js'
import ReviewLicenceModel from './review-licence.model.js'

export default class ReviewReturnModel extends BaseModel {
  static get tableName() {
    return 'reviewReturns'
  }

  // Defining which fields contain json allows us to insert an object without needing to stringify it first
  static get jsonAttributes() {
    return ['purposes']
  }

  static get relationMappings() {
    return {
      returnLog: {
        join: {
          from: 'reviewReturns.returnLogId',
          to: 'returnLogs.id'
        },
        modelClass: ReturnLogModel,
        relation: Model.BelongsToOneRelation
      },
      reviewChargeElementReturns: {
        join: {
          from: 'reviewReturns.id',
          to: 'reviewChargeElementReturns.reviewReturnId'
        },
        modelClass: ReviewChargeElementReturnModel,
        relation: Model.HasManyRelation
      },
      reviewChargeElements: {
        join: {
          from: 'reviewReturns.id',
          through: {
            from: 'reviewChargeElementReturns.reviewReturnId',
            to: 'reviewChargeElementReturns.reviewChargeElementId'
          },
          to: 'reviewChargeElements.id'
        },
        modelClass: ReviewChargeElementModel,
        relation: Model.ManyToManyRelation
      },
      reviewLicence: {
        join: {
          from: 'reviewReturns.reviewLicenceId',
          to: 'reviewLicences.id'
        },
        modelClass: ReviewLicenceModel,
        relation: Model.BelongsToOneRelation
      }
    }
  }
}
