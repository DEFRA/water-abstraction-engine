// Test framework
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Test helpers
import SessionModelStub from 'water-abstraction-engine/test/stubs/session.stub.js'

// Things we need to stub
import * as FetchSessionDal from 'water-abstraction-engine/dal/fetch-session.dal.js'

// Thing under test
import __MODULE_NAME__ from '__REQUIRE_PATH__'

describe('__DESCRIBE_LABEL__', () => {
  let session
  let sessionData

  beforeEach(() => {
    sessionData = {}

    session = SessionModelStub(sessionData)

    vi.spyOn(FetchSessionDal, 'default').mockResolvedValue(session)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('when called', () => {
    it('saves the session', async () => {
      await __MODULE_NAME__(session.id)

      expect(session.$update).toHaveBeenCalled()
    })

    it('continues the journey', async () => {
      const result = await __MODULE_NAME__(session.id)

      expect(result).toEqual({ redirectUrl: `__ROUTE_BASE__/${session.id}/next-page` })
    })
  })
})
