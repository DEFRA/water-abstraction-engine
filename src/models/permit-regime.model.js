/**
 * Model for permit_regimes (permit.regime)
 * @module PermitRegimeModel
 */

import BaseModel from './base.model.js'

export default class PermitRegimeModel extends BaseModel {
  static get tableName() {
    return 'permitRegimes'
  }
}
