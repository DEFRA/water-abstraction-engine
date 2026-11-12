/**
 * Model for purposes (water.purposes_uses)
 * @module PurposeModel
 */

import { Model } from 'objection'

import BaseModel from './base.model.js'
import ChargeElementModel from './charge-element.model.js'
import ChargeReferenceModel from './charge-reference.model.js'
import LicenceVersionPurposeModel from './licence-version-purpose.model.js'
import ReturnRequirementPurposeModel from './return-requirement-purpose.model.js'

export default class PurposeModel extends BaseModel {
  static get tableName() {
    return 'purposes'
  }

  static get relationMappings() {
    return {
      chargeElements: {
        join: {
          from: 'purposes.id',
          to: 'chargeElements.purposeId'
        },
        modelClass: ChargeElementModel,
        relation: Model.HasManyRelation
      },
      chargeReferences: {
        join: {
          from: 'purposes.id',
          to: 'chargeReferences.purposeId'
        },
        modelClass: ChargeReferenceModel,
        relation: Model.HasManyRelation
      },
      licenceVersionPurposes: {
        join: {
          from: 'purposes.id',
          to: 'licenceVersionPurposes.purposeId'
        },
        modelClass: LicenceVersionPurposeModel,
        relation: Model.HasManyRelation
      },
      returnRequirementPurposes: {
        join: {
          from: 'purposes.id',
          to: 'returnRequirementPurposes.purposeId'
        },
        modelClass: ReturnRequirementPurposeModel,
        relation: Model.HasManyRelation
      }
    }
  }
}
