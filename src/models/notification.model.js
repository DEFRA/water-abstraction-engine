/**
 * Model for notifications (water.notification)
 * @module NotificationModel
 */

import { Model } from 'objection'

import BaseModel from './base.model.js'
import EventModel from './event.model.js'
import LicenceMonitoringStationModel from './licence-monitoring-station.model.js'

export default class NotificationModel extends BaseModel {
  static get tableName() {
    return 'notifications'
  }

  // Defining which fields contain json allows us to insert an object without needing to stringify it first
  static get jsonAttributes() {
    return ['licences', 'personalisation', 'returnLogIds']
  }

  static get relationMappings() {
    return {
      event: {
        join: {
          from: 'notifications.eventId',
          to: 'events.id'
        },
        modelClass: EventModel,
        relation: Model.HasOneRelation
      },
      licenceMonitoringStation: {
        join: {
          from: 'notifications.licenceMonitoringStationId',
          to: 'licenceMonitoringStations.id'
        },
        modelClass: LicenceMonitoringStationModel,
        relation: Model.BelongsToOneRelation
      }
    }
  }
}
