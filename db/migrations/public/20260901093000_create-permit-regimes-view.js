const viewName = 'permit_regimes'

export function up(knex) {
  return knex.schema.createView(viewName, (view) => {
    view.as(knex('regime').withSchema('permit').select(['regime_id AS id', 'regime_nm AS name']))
  })
}

export function down(knex) {
  return knex.schema.dropViewIfExists(viewName)
}
