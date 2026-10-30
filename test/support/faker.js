/**
 * @module Faker
 */

import { Faker, base, en } from '@faker-js/faker'

/**
 * A shared Faker instance
 *
 * Generators that use this instance produce the same values on every machine once it has been seeded with
 * `faker.seed()`. Anything that seeds it must use this instance, not the default one exported by `@faker-js/faker`.
 *
 * Company types come from our own list, so they don't change if faker's built-in list does.
 */
export const faker = new Faker({
  locale: [
    {
      company: { legal_entity_type: ['Ltd', 'PLC', 'LLP', 'and Sons', 'Farms', 'Estates'] }
    },
    en,
    base
  ]
})
