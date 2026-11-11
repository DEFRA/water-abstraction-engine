const tableName = 'regime'

export function up(knex) {
  return knex.schema
    .withSchema('permit')
    .createTable(tableName, (table) => {
      // Primary Key
      table.bigIncrements('regime_id').primary()

      // Data
      table.string('regime_nm')
    })
    .then(() => {
      // Matches the row inserted by the original production migration:
      // water-abstraction-permit-repository/migrations/sqls/20171201101816-permits-up.sql
      return knex('regime').withSchema('permit').insert({ regime_id: 1, regime_nm: 'Water Licencing' })
    })
}

export function down(knex) {
  return knex.schema.withSchema('permit').dropTableIfExists(tableName)
}
