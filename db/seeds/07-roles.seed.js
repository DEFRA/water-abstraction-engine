import { db } from '../db.js'
import { timestampForPostgres } from '../../src/lib/general.lib.js'
import { data as roles } from './data/roles.js'

export async function seed() {
  for (const role of roles) {
    await _upsert(role)
  }
}

async function _upsert(role) {
  // Note: We store the data in a format that matches what we get through Objection.js and our view model RoleModel.
  // But because of the reason detailed below, the payload we send in the insert has to match how the underlying table
  // is structured. Hence this transformation.
  const payload = {
    application: 'water_admin',
    dateUpdated: timestampForPostgres(),
    description: role.description,
    role: role.role,
    roleId: role.id
  }

  // NOTE: We've had to drop back to Knex rather than Objection.js because the view model doesn't expose a field
  // (application) that we rely on to make the onConflict work. This was by design, `application` never differs across
  // records so is redundant to us when fetching instances of `RoleModel`.
  return db('roles')
    .withSchema('idm')
    .insert(payload)
    .onConflict(['application', 'role'])
    .merge(['description', 'dateUpdated'])
}
