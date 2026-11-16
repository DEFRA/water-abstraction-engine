// Test framework
import { beforeEach, describe, expect, it } from 'vitest'

// Test helpers
import { generateUUID } from 'water-abstraction-engine/test/generators.js'

// Thing under test
import __MODULE_NAME__ from '__REQUIRE_PATH__'

describe('__DESCRIBE_LABEL__', () => {
  let session

  beforeEach(() => {
    session = { id: generateUUID() }
  })

  describe('when called', () => {
    it('returns page data for the view', () => {
      const result = __MODULE_NAME__(session)

      expect(result).toEqual({
        backLink: {
          href: `__ROUTE_BASE__/${session.id}/previous-page`,
          text: 'Back'
        },
        pageTitle: 'Check the details'
      })
    })
  })
})
