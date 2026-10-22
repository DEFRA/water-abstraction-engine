import SupportedSourceModel from '../../src/models/supported-source.model.js'
import { data as supportedSources } from './data/supported-sources.js'
import { timestampForPostgres } from '../../src/lib/general.lib.js'

/**
 * Seeds the supported sources reference data using an upsert
 *
 * New supported sources are inserted with the IDs from pre-production. Existing ones keep their IDs.
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
    .merge(['name', 'order', 'region', 'updatedAt'])
}
