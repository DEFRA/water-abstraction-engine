/**
 * Model for licence_agreements (water.licence_agreements)
 * @module LicenceAgreementModel
 */

import { Model } from 'objection'

import BaseModel from './base.model.js'
import FinancialAgreementModel from './financial-agreement.model.js'
import LicenceModel from './licence.model.js'

export default class LicenceAgreementModel extends BaseModel {
  static get tableName() {
    return 'licenceAgreements'
  }

  static get relationMappings() {
    return {
      financialAgreement: {
        join: {
          from: 'licenceAgreements.financialAgreementId',
          to: 'financialAgreements.id'
        },
        modelClass: FinancialAgreementModel,
        relation: Model.HasOneRelation
      },
      licence: {
        join: {
          from: 'licenceAgreements.licenceRef',
          to: 'licences.licenceRef'
        },
        modelClass: LicenceModel,
        relation: Model.HasOneRelation
      }
    }
  }
}
