/**
 * Model for review_charge_versions
 * @module ReviewChargeVersionModel
 */

import { Model } from 'objection'

import BaseModel from './base.model.js'
import ChargeVersionModel from './charge-version.model.js'
import ReviewChargeReferenceModel from './review-charge-reference.model.js'
import ReviewLicenceModel from './review-licence.model.js'

export default class ReviewChargeVersionModel extends BaseModel {
  static get tableName() {
    return 'reviewChargeVersions'
  }

  static get relationMappings() {
    return {
      chargeVersion: {
        join: {
          from: 'reviewChargeVersions.chargeVersionId',
          to: 'chargeVersions.id'
        },
        modelClass: ChargeVersionModel,
        relation: Model.BelongsToOneRelation
      },
      reviewChargeReferences: {
        join: {
          from: 'reviewChargeVersions.id',
          to: 'reviewChargeReferences.reviewChargeVersionId'
        },
        modelClass: ReviewChargeReferenceModel,
        relation: Model.HasManyRelation
      },
      reviewLicence: {
        join: {
          from: 'reviewChargeVersions.reviewLicenceId',
          to: 'reviewLicences.id'
        },
        modelClass: ReviewLicenceModel,
        relation: Model.BelongsToOneRelation
      }
    }
  }
}
