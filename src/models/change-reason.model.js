/**
 * Model for change_reasons (water.change_reasons)
 * @module ChangeReasonModel
 */

import { Model } from 'objection'

import BaseModel from './base.model.js'
import ChargeVersionModel from './charge-version.model.js'

export default class ChangeReasonModel extends BaseModel {
  static get tableName() {
    return 'changeReasons'
  }

  static get relationMappings() {
    return {
      chargeVersions: {
        join: {
          from: 'changeReasons.id',
          to: 'chargeVersions.changeReasonId'
        },
        modelClass: ChargeVersionModel,
        relation: Model.HasManyRelation
      }
    }
  }
}
