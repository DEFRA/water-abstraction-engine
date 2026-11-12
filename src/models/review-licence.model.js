/**
 * Model for review_licences
 * @module ReviewLicenceModel
 */

import { Model } from 'objection'

import BaseModel from './base.model.js'
import BillRunModel from './bill-run.model.js'
import LicenceModel from './licence.model.js'
import ReviewChargeVersionModel from './review-charge-version.model.js'
import ReviewReturnModel from './review-return.model.js'

export default class ReviewLicenceModel extends BaseModel {
  static get tableName() {
    return 'reviewLicences'
  }

  static get relationMappings() {
    return {
      billRun: {
        join: {
          from: 'reviewLicences.billRunId',
          to: 'billRuns.id'
        },
        modelClass: BillRunModel,
        relation: Model.BelongsToOneRelation
      },
      licence: {
        join: {
          from: 'reviewLicences.licenceId',
          to: 'licences.id'
        },
        modelClass: LicenceModel,
        relation: Model.BelongsToOneRelation
      },
      reviewChargeVersions: {
        join: {
          from: 'reviewLicences.id',
          to: 'reviewChargeVersions.reviewLicenceId'
        },
        modelClass: ReviewChargeVersionModel,
        relation: Model.HasManyRelation
      },
      reviewReturns: {
        join: {
          from: 'reviewLicences.id',
          to: 'reviewReturns.reviewLicenceId'
        },
        modelClass: ReviewReturnModel,
        relation: Model.HasManyRelation
      }
    }
  }
}
