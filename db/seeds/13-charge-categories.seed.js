import ChargeCategoryModel from '../../src/models/charge-category.model.js'
import { data as chargeCategories } from './data/charge-categories.js'
import { timestampForPostgres } from '../../src/lib/general.lib.js'

export default async function seed() {
  for (const chargeCategory of chargeCategories) {
    await _upsert(chargeCategory)
  }
}

async function _upsert(chargeCategory) {
  return ChargeCategoryModel.query()
    .insert({ ...chargeCategory, createdAt: timestampForPostgres(), updatedAt: timestampForPostgres() })
    .onConflict('reference')
    .merge([
      'description',
      'lossFactor',
      'maxVolume',
      'minVolume',
      'modelTier',
      'restrictedSource',
      'shortDescription',
      'subsistenceCharge',
      'tidal',
      'updatedAt'
    ])
}
