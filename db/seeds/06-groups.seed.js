import { db } from '../db.js'
import { timestampForPostgres } from '../../src/lib/general.lib.js'
import { data as groups } from './data/groups.js'

export async function seed() {
  for (const group of groups) {
    await _upsert(group)
  }
}

async function _upsert(group) {
  // Note: We store the data in a format that matches what we get through Objection.js and our view model GroupModel.
  // But because of the reason detailed below, the payload we send in the insert has to match how the underlying table
  // is structured. Hence this transformation.
  const payload = {
    application: 'water_admin',
    dateUpdated: timestampForPostgres(),
    description: group.description,
    group: group.group,
    groupId: group.id
  }

  // NOTE: We've had to drop back to Knex rather than Objection.js because the view model doesn't expose a field
  // (application) that we rely on to make the onConflict work. This was by design, `application` never differs across
  // records so is redundant to us when fetching instances of `GroupModel`.
  return db('groups')
    .withSchema('idm')
    .insert(payload)
    .onConflict(['application', 'group'])
    .merge(['description', 'dateUpdated'])
}
