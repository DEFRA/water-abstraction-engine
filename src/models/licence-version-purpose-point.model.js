/**
 * Model for licence_version_purpose_points (water.licence_version_purpose_points)
 * @module LicenceVersionPurposePointModel
 */

import { Model } from 'objection'

import BaseModel from './base.model.js'
import LicenceVersionPurposeModel from './licence-version-purpose.model.js'
import PointModel from './point.model.js'

export default class LicenceVersionPurposePointModel extends BaseModel {
  static get tableName() {
    return 'licenceVersionPurposePoints'
  }

  static get relationMappings() {
    return {
      licenceVersionPurpose: {
        join: {
          from: 'licenceVersionPurposePoints.licenceVersionPurposeId',
          to: 'licenceVersionPurposes.id'
        },
        modelClass: LicenceVersionPurposeModel,
        relation: Model.BelongsToOneRelation
      },
      point: {
        join: {
          from: 'licenceVersionPurposePoints.pointId',
          to: 'points.id'
        },
        modelClass: PointModel,
        relation: Model.BelongsToOneRelation
      }
    }
  }
}
