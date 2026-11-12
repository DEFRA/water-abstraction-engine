/**
 * Model for licence_monitoring_stations (water.licence_monitoring_stations)
 * @module LicenceMonitoringStationModel
 */

import { Model } from 'objection'

import BaseModel from './base.model.js'
import LicenceModel from './licence.model.js'
import LicenceVersionPurposeConditionModel from './licence-version-purpose-condition.model.js'
import MonitoringStationModel from './monitoring-station.model.js'
import NotificationModel from './notification.model.js'
import UserModel from './user.model.js'

export default class LicenceMonitoringStationModel extends BaseModel {
  static get tableName() {
    return 'licenceMonitoringStations'
  }

  static get relationMappings() {
    return {
      licence: {
        join: {
          from: 'licenceMonitoringStations.licenceId',
          to: 'licences.id'
        },
        modelClass: LicenceModel,
        relation: Model.BelongsToOneRelation
      },
      licenceVersionPurposeCondition: {
        join: {
          from: 'licenceMonitoringStations.licenceVersionPurposeConditionId',
          to: 'licenceVersionPurposeConditions.id'
        },
        modelClass: LicenceVersionPurposeConditionModel,
        relation: Model.HasOneRelation
      },
      monitoringStation: {
        join: {
          from: 'licenceMonitoringStations.monitoringStationId',
          to: 'monitoringStations.id'
        },
        modelClass: MonitoringStationModel,
        relation: Model.BelongsToOneRelation
      },
      notifications: {
        join: {
          from: 'licenceMonitoringStations.id',
          to: 'notifications.licenceMonitoringStationId'
        },
        modelClass: NotificationModel,
        relation: Model.HasManyRelation
      },
      user: {
        join: {
          from: 'licenceMonitoringStations.createdBy',
          to: 'users.userId'
        },
        modelClass: UserModel,
        relation: Model.BelongsToOneRelation
      }
    }
  }
}
