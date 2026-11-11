/**
 * Model for regions (water.regions)
 * @module RegionModel
 */

import { Model } from 'objection'

import BaseModel from './base.model.js'
import BillRunModel from './bill-run.model.js'
import CompanyModel from './company.model.js'
import LicenceModel from './licence.model.js'

export default class RegionModel extends BaseModel {
  static get tableName() {
    return 'regions'
  }

  static get relationMappings() {
    return {
      billRuns: {
        join: {
          from: 'regions.id',
          to: 'billRuns.regionId'
        },
        modelClass: BillRunModel,
        relation: Model.HasManyRelation
      },
      companies: {
        join: {
          from: 'regions.id',
          to: 'companies.regionId'
        },
        modelClass: CompanyModel,
        relation: Model.HasManyRelation
      },
      licences: {
        join: {
          from: 'regions.id',
          to: 'licences.regionId'
        },
        modelClass: LicenceModel,
        relation: Model.HasManyRelation
      }
    }
  }
}
