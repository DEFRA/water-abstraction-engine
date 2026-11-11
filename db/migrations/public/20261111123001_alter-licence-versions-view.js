const viewName = 'licence_versions'

export function up(knex) {
  return knex.schema.dropViewIfExists(viewName).createView(viewName, (view) => {
    // NOTE: We have commented out unused columns from the source table
    view.as(
      knex('licence_versions').withSchema('water').select([
        'licence_version_id AS id',
        'licence_id',
        'application_number',
        'issue',
        'increment',
        'status',
        'start_date',
        'end_date',
        'issue_date',
        'external_id',
        // 'is_test',
        'company_id',
        'address_id',
        'criticality_code', // New column added
        'criticality_description', // New column added
        'date_created AS created_at',
        'date_updated AS updated_at'
      ])
    )
  })
}

export function down(knex) {
  return knex.schema.dropViewIfExists(viewName).createView(viewName, (view) => {
    // NOTE: We have commented out unused columns from the source table
    view.as(
      knex('licence_versions').withSchema('water').select([
        'licence_version_id AS id',
        'licence_id',
        'application_number',
        'issue',
        'increment',
        'status',
        'start_date',
        'end_date',
        'issue_date',
        'external_id',
        // 'is_test',
        'company_id',
        'address_id',
        'date_created AS created_at',
        'date_updated AS updated_at'
      ])
    )
  })
}
