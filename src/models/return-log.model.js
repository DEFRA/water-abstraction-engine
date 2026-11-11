/**
 * Model for return_logs (returns.returns)
 * @module ReturnLogModel
 */

import { Model } from 'objection'

import BaseModel from './base.model.js'
import LicenceModel from './licence.model.js'
import ReturnCycleModel from './return-cycle.model.js'
import ReturnRequirementModel from './return-requirement.model.js'
import ReturnSubmissionModel from './return-submission.model.js'
import ReviewReturnModel from './review-return.model.js'

export default class ReturnLogModel extends BaseModel {
  static get tableName() {
    return 'returnLogs'
  }

  // Defining which fields contain json allows us to insert an object without needing to stringify it first
  static get jsonAttributes() {
    return ['metadata']
  }

  static get relationMappings() {
    return {
      licence: {
        join: {
          from: 'returnLogs.licenceRef',
          to: 'licences.licenceRef'
        },
        modelClass: LicenceModel,
        relation: Model.BelongsToOneRelation
      },
      returnCycle: {
        join: {
          from: 'returnLogs.returnCycleId',
          to: 'returnCycles.id'
        },
        modelClass: ReturnCycleModel,
        relation: Model.HasOneRelation
      },
      returnRequirement: {
        join: {
          from: 'returnLogs.returnRequirementId',
          to: 'returnRequirements.id'
        },
        modelClass: ReturnRequirementModel,
        relation: Model.HasOneRelation
      },
      returnSubmissions: {
        join: {
          from: 'returnLogs.id',
          to: 'returnSubmissions.returnLogId'
        },
        modelClass: ReturnSubmissionModel,
        relation: Model.HasManyRelation
      },
      reviewReturns: {
        join: {
          from: 'returnLogs.id',
          to: 'reviewReturns.returnLogId'
        },
        modelClass: ReviewReturnModel,
        relation: Model.HasManyRelation
      }
    }
  }
}
