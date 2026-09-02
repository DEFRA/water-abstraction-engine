const tableName = 'entity'

export function up(knex) {
  return knex.schema
    .withSchema('crm')
    .createTable(tableName, (table) => {
      // Data
      table.string('entity_id').notNullable()
      table.string('entity_nm').notNullable()
      table.string('entity_type').notNullable()
      table.jsonb('entity_definition')
      table.string('source')

      // Legacy timestamps
      // NOTE: They are not automatically set
      table.timestamp('created_at')
      table.timestamp('updated_at')

      // Primary Key
      // NOTE: It is not entity_id. The primary key is made up of all these columns
      table.primary(['entity_id', 'entity_nm', 'entity_type'])
    })
    .then(() => {
      // Matches the row inserted by the original production migration:
      // water-abstraction-tactical-crm/migrations/sqls/20171201091402-crm-up.sql
      return knex('entity').withSchema('crm').insert({
        entity_id: '0434dc31-a34e-7158-5775-4694af7a60cf',
        entity_nm: 'water-abstraction',
        entity_type: 'regime',
        entity_definition: {}
      })
    })
}

export function down(knex) {
  return knex.schema.withSchema('crm').dropTableIfExists(tableName)
}
