/**
 * Model for return_requirements (water.return_requirements)
 * @module ReturnRequirementModel
 */

import { Model } from 'objection'

import BaseModel from './base.model.js'
import PointModel from './point.model.js'
import ReturnLogModel from './return-log.model.js'
import ReturnRequirementPurposeModel from './return-requirement-purpose.model.js'
import ReturnVersionModel from './return-version.model.js'

export default class ReturnRequirementModel extends BaseModel {
  static get tableName() {
    return 'returnRequirements'
  }

  static get relationMappings() {
    return {
      points: {
        join: {
          from: 'returnRequirements.id',
          through: {
            from: 'returnRequirementPoints.returnRequirementId',
            to: 'returnRequirementPoints.pointId'
          },
          to: 'points.id'
        },
        modelClass: PointModel,
        relation: Model.ManyToManyRelation
      },
      returnLogs: {
        join: {
          from: 'returnRequirements.id',
          to: 'returnLogs.returnRequirementId'
        },
        modelClass: ReturnLogModel,
        relation: Model.HasManyRelation
      },
      returnRequirementPurposes: {
        join: {
          from: 'returnRequirements.id',
          to: 'returnRequirementPurposes.returnRequirementId'
        },
        modelClass: ReturnRequirementPurposeModel,
        relation: Model.HasManyRelation
      },
      returnVersion: {
        join: {
          from: 'returnRequirements.returnVersionId',
          to: 'returnVersions.id'
        },
        modelClass: ReturnVersionModel,
        relation: Model.BelongsToOneRelation
      }
    }
  }
}
