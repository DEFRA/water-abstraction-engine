const tableName = 'regime'

export function up(knex) {
  return knex.schema.withSchema('permit').createTable(tableName, (table) => {
    // Primary Key
    table.bigIncrements('regime_id').primary()

    // Data
    table.string('regime_nm')
  })
}

export function down(knex) {
  return knex.schema.withSchema('permit').dropTableIfExists(tableName)
}
