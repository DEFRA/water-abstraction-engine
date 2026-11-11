const tableName = 'billing_supported_sources'

export function up(knex) {
  return knex.schema.withSchema('water').createTable(tableName, (table) => {
    // Primary Key
    table.uuid('billing_supported_source_id').primary().defaultTo(knex.raw('gen_random_uuid()'))

    // Data
    table.specificType('reference', 'varchar').notNullable().unique()
    table.string('name').notNullable()
    table.integer('order')
    table.string('region')

    // Legacy timestamps
    table.timestamp('date_created', { useTz: false }).notNullable().defaultTo(knex.fn.now())
    table.timestamp('date_updated', { useTz: false }).notNullable().defaultTo(knex.fn.now())
  })
}

export function down(knex) {
  return knex.schema.withSchema('water').dropTableIfExists(tableName)
}
