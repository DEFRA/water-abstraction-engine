/**
 * Model for return_requirement_purposes (water.return_requirement_purposes)
 * @module ReturnRequirementPurposeModel
 */

import { Model } from 'objection'

import BaseModel from './base.model.js'
import PrimaryPurposeModel from './primary-purpose.model.js'
import PurposeModel from './purpose.model.js'
import ReturnRequirementModel from './return-requirement.model.js'
import SecondaryPurposeModel from './secondary-purpose.model.js'

export default class ReturnRequirementPurposeModel extends BaseModel {
  static get tableName() {
    return 'returnRequirementPurposes'
  }

  static get relationMappings() {
    return {
      primaryPurpose: {
        join: {
          from: 'returnRequirementPurposes.primaryPurposeId',
          to: 'primaryPurposes.id'
        },
        modelClass: PrimaryPurposeModel,
        relation: Model.BelongsToOneRelation
      },
      purpose: {
        join: {
          from: 'returnRequirementPurposes.purposeId',
          to: 'purposes.id'
        },
        modelClass: PurposeModel,
        relation: Model.BelongsToOneRelation
      },
      returnRequirement: {
        join: {
          from: 'returnRequirementPurposes.returnRequirementId',
          to: 'returnRequirements.id'
        },
        modelClass: ReturnRequirementModel,
        relation: Model.BelongsToOneRelation
      },
      secondaryPurpose: {
        join: {
          from: 'returnRequirementPurposes.secondaryPurposeId',
          to: 'secondaryPurposes.id'
        },
        modelClass: SecondaryPurposeModel,
        relation: Model.BelongsToOneRelation
      }
    }
  }
}
