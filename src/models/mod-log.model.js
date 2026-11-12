/**
 * Model for mod log (water.mod_logs)
 * @module ModLogModel
 */

import { Model } from 'objection'

import BaseModel from './base.model.js'
import ChargeVersionModel from './charge-version.model.js'
import LicenceModel from './licence.model.js'
import LicenceVersionModel from './licence-version.model.js'
import ReturnVersionModel from './return-version.model.js'

export default class ModLogModel extends BaseModel {
  static get tableName() {
    return 'modLogs'
  }

  static get relationMappings() {
    return {
      chargeVersion: {
        join: {
          from: 'modLogs.chargeVersionId',
          to: 'chargeVersions.id'
        },
        modelClass: ChargeVersionModel,
        relation: Model.BelongsToOneRelation
      },
      licence: {
        join: {
          from: 'modLogs.licenceId',
          to: 'licences.id'
        },
        modelClass: LicenceModel,
        relation: Model.BelongsToOneRelation
      },
      licenceVersion: {
        join: {
          from: 'modLogs.licenceVersionId',
          to: 'licenceVersions.id'
        },
        modelClass: LicenceVersionModel,
        relation: Model.BelongsToOneRelation
      },
      returnVersion: {
        join: {
          from: 'modLogs.returnVersionId',
          to: 'returnVersions.id'
        },
        modelClass: ReturnVersionModel,
        relation: Model.BelongsToOneRelation
      }
    }
  }
}
