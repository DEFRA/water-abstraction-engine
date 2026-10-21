/**
 * Model for supported_sources (water.billing_supported_sources)
 * @module SupportedSourceModel
 */

import BaseModel from './base.model.js'

export default class SupportedSourceModel extends BaseModel {
  static get tableName() {
    return 'supportedSources'
  }
}
