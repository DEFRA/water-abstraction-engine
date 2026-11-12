/**
 * Model for licence_version_purpose_conditions (water.licence_version_purpose_conditions)
 * @module LicenceVersionPurposeConditionModel
 */

import { Model } from 'objection'

import BaseModel from './base.model.js'
import LicenceMonitoringStationModel from './licence-monitoring-station.model.js'
import LicenceVersionPurposeConditionTypeModel from './licence-version-purpose-condition-type.model.js'
import LicenceVersionPurposeModel from './licence-version-purpose.model.js'

export default class LicenceVersionPurposeConditionModel extends BaseModel {
  static get tableName() {
    return 'licenceVersionPurposeConditions'
  }

  static get relationMappings() {
    return {
      licenceMonitoringStations: {
        join: {
          from: 'licenceVersionPurposeConditions.id',
          to: 'licenceMonitoringStations.licenceVersionPurposeConditionId'
        },
        modelClass: LicenceMonitoringStationModel,
        relation: Model.HasManyRelation
      },
      licenceVersionPurpose: {
        join: {
          from: 'licenceVersionPurposeConditions.licenceVersionPurposeId',
          to: 'licenceVersionPurposes.id'
        },
        modelClass: LicenceVersionPurposeModel,
        relation: Model.BelongsToOneRelation
      },
      licenceVersionPurposeConditionType: {
        join: {
          from: 'licenceVersionPurposeConditions.licenceVersionPurposeConditionTypeId',
          to: 'licenceVersionPurposeConditionTypes.id'
        },
        modelClass: LicenceVersionPurposeConditionTypeModel,
        relation: Model.HasOneRelation
      }
    }
  }
}
