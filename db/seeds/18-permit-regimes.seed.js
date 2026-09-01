import PermitRegimeModel from '../../src/models/permit-regime.model.js'
import { data as permitRegimes } from './data/permit-regimes.js'

/**
 * Seeds the permit regime reference data using an upsert
 *
 * This is legacy reference data from the old `permit` schema. In practice it has only ever held the single
 * 'Water Licencing' row, but we still need it seeded so the `permit_regimes` view has something to return.
 *
 * Previous table name - permit.regime
 *
 * Public table name - public.permit_regimes
 *
 */
export async function seed() {
  for (const permitRegime of permitRegimes) {
    await _upsert(permitRegime)
  }
}

async function _upsert(permitRegime) {
  return PermitRegimeModel.query().insert(permitRegime).onConflict('id').merge(['name'])
}
