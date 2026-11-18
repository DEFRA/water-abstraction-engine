// Test framework
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Test helpers
import SessionModelStub from 'water-abstraction-engine/test/stubs/session.stub.js'

// Things we need to stub
import * as FetchSessionDal from 'water-abstraction-engine/dal/fetch-session.dal.js'

// Thing under test
import __MODULE_NAME__ from '__REQUIRE_PATH__'

describe('__DESCRIBE_LABEL__', () => {
  let payload
  let session
  let sessionData

  beforeEach(() => {
    payload = { placeholder: 'change me' }
    sessionData = {}

    session = SessionModelStub(sessionData)

    vi.spyOn(FetchSessionDal, 'default').mockResolvedValue(session)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('when called', () => {
    it('saves the submitted value', async () => {
      await __MODULE_NAME__(session.id, payload)

      expect(session.$update).toHaveBeenCalled()
    })

    it('continues the journey', async () => {
      const result = await __MODULE_NAME__(session.id, payload)

      expect(result).toEqual({ redirectUrl: `__ROUTE_BASE__/${session.id}/next-page` })
    })
  })

  describe('when the check page has been visited', () => {
    beforeEach(() => {
      sessionData = { checkPageVisited: true }

      session = SessionModelStub(sessionData)

      vi.spyOn(FetchSessionDal, 'default').mockResolvedValue(session)
    })

    it('returns to the check page', async () => {
      const result = await __MODULE_NAME__(session.id, payload)

      expect(result).toEqual({ redirectUrl: `__ROUTE_BASE__/${session.id}/check` })
    })
  })

  describe('when validation fails', () => {
    beforeEach(() => {
      payload = {}
    })

    it('returns page data for the view, with errors', async () => {
      const result = await __MODULE_NAME__(session.id, payload)

      expect(result).toEqual({
        backLink: {
          href: `__ROUTE_BASE__/${session.id}/previous-page`,
          text: 'Back'
        },
        error: {
          errorList: [
            {
              href: '#placeholder',
              text: '"placeholder" is required'
            }
          ],
          placeholder: {
            text: '"placeholder" is required'
          }
        },
        pageTitle: ''
      })
    })
  })
})
