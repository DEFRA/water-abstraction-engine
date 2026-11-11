/**
 * Model for charge_version_notes (water.notes)
 * @module ChargeVersionNote
 */

import { Model } from 'objection'

import BaseModel from './base.model.js'
import ChargeVersionModel from './charge-version.model.js'
import UserModel from './user.model.js'

export default class ChargeVersionNote extends BaseModel {
  static get tableName() {
    return 'chargeVersionNotes'
  }

  static get relationMappings() {
    return {
      chargeVersion: {
        join: {
          from: 'chargeVersionNotes.id',
          to: 'chargeVersions.noteId'
        },
        modelClass: ChargeVersionModel,
        relation: Model.BelongsToOneRelation
      },
      user: {
        join: {
          from: 'chargeVersionNotes.userId',
          to: 'users.userId'
        },
        modelClass: UserModel,
        relation: Model.BelongsToOneRelation
      }
    }
  }
}
