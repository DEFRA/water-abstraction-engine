import LicenceEntityModel from '../../src/models/licence-entity.model.js'
import { data as entities } from './data/entities.js'

/**
 * Seeds the entity reference data using an upsert
 *
 * This is legacy reference data from the old `crm` schema. In practice it has only ever held the single
 * 'water-abstraction' / 'regime' row we care about here, but we still need it seeded so things like
 * `crm.document_header.regime_entity_id` have a valid row to point at.
 *
 * Previous table name - crm.entity
 *
 * Public table name - public.licence_entities
 *
 */
export async function seed() {
  for (const entity of entities) {
    await _upsert(entity)
  }
}

async function _upsert(entity) {
  // crm.entity's primary key is the composite (entity_id, entity_nm, entity_type) - there's no constraint on id
  // (entity_id) alone - see db/migrations/legacy/20221108002002_crm-entity.js. All three columns the view exposes
  // are part of that key, so there's nothing left to merge on conflict
  return LicenceEntityModel.query().insert(entity).onConflict(['id', 'name', 'type']).ignore()
}
