/**
 * Model for licence_supplementary_years
 * @module LicenceSupplementaryYearModel
 */

import { Model } from 'objection'

import BaseModel from './base.model.js'
import BillRunModel from './bill-run.model.js'
import LicenceModel from './licence.model.js'

export default class LicenceSupplementaryYearModel extends BaseModel {
  static get tableName() {
    return 'licenceSupplementaryYears'
  }

  static get relationMappings() {
    return {
      billRun: {
        join: {
          from: 'licenceSupplementaryYears.billRunId',
          to: 'billRuns.id'
        },
        modelClass: BillRunModel,
        relation: Model.BelongsToOneRelation
      },
      licence: {
        join: {
          from: 'licenceSupplementaryYears.licenceId',
          to: 'licences.id'
        },
        modelClass: LicenceModel,
        relation: Model.BelongsToOneRelation
      }
    }
  }
}
