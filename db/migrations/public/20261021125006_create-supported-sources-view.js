const viewName = 'supported_sources'

export function up(knex) {
  return knex.schema.createView(viewName, (view) => {
    view.as(
      knex('billing_supported_sources')
        .withSchema('water')
        .select([
          'billing_supported_source_id AS id',
          'reference',
          'name',
          'order',
          'region',
          'date_created AS created_at',
          'date_updated AS updated_at'
        ])
    )
  })
}

export function down(knex) {
  return knex.schema.dropViewIfExists(viewName)
}
