/**
 * Model for sources (water.sources)
 * @module SourceModel
 */

import { Model } from 'objection'

import BaseModel from './base.model.js'
import PointModel from './point.model.js'

export default class SourceModel extends BaseModel {
  static get tableName() {
    return 'sources'
  }

  static get relationMappings() {
    return {
      points: {
        join: {
          from: 'sources.id',
          to: 'points.sourceId'
        },
        modelClass: PointModel,
        relation: Model.HasManyRelation
      }
    }
  }
}
