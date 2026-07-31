// Test framework
import { beforeAll, describe, expect, it } from 'vitest'

// Test helpers
import SessionHelper from '../support/helpers/session.helper.js'
import SessionModel from '../../src/models/session.model.js'

// Thing under test
import DeleteSessionDal from '../../src/dal/delete-session.dal.js'

describe('Delete Session DAL', () => {
  let session
  let sessionId

  beforeAll(async () => {
    session = await SessionHelper.add()
    sessionId = session.id
  })

  describe('when the session exists', () => {
    it('deletes the session', async () => {
      await DeleteSessionDal(sessionId)

      const session = await SessionModel.query().findById(sessionId)

      expect(session).toBeUndefined()
    })
  })
})
