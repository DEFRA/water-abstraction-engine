import SupportedSourceModel from '../../src/models/supported-source.model.js'
import { data as supportedSources } from './data/supported-sources.js'
import { timestampForPostgres } from '../../src/lib/general.lib.js'

/**
 * Seeds the supported sources reference data using an upsert
 *
 * The IDs match those in production, so every environment has the same IDs. Where a supported source already exists
 * with a different ID (the legacy migration that first seeded them let the DB generate the IDs), it is updated to match.
 *
 * Previous table name - water.billing_supported_sources
 *
 * Public table name - public.supported_sources
 */
export async function seed() {
  for (const supportedSource of supportedSources) {
    await _upsert(supportedSource)
  }
}

async function _upsert(supportedSource) {
  return SupportedSourceModel.query()
    .insert({ ...supportedSource, createdAt: timestampForPostgres(), updatedAt: timestampForPostgres() })
    .onConflict('reference')
    .merge(['id', 'name', 'order', 'region', 'updatedAt'])
}
