/**
 * Model for licence_unregistrations (water.licence_unregistrations)
 * @module LicenceUnregistrationModel
 */

import { Model } from 'objection'

import BaseModel from './base.model.js'
import LicenceModel from './licence.model.js'
import UserModel from './user.model.js'

export default class LicenceUnregistrationModel extends BaseModel {
  static get tableName() {
    return 'licenceUnregistrations'
  }

  static get relationMappings() {
    return {
      licence: {
        join: {
          from: 'licenceUnregistrations.licenceId',
          to: 'licences.id'
        },
        modelClass: LicenceModel,
        relation: Model.BelongsToOneRelation
      },
      user: {
        join: {
          from: 'licenceUnregistrations.createdBy',
          to: 'users.id'
        },
        modelClass: UserModel,
        relation: Model.BelongsToOneRelation
      }
    }
  }
}
