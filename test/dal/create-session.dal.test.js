// Test framework
import { beforeAll, describe, expect, it } from 'vitest'

// Test helpers
import SessionModel from '../../src/models/session.model.js'

// Thing under test
import CreateSessionDal from '../../src/dal/create-session.dal.js'

describe('Create Session DAL', () => {
  describe('when there is no data', () => {
    it('creates an empty session and returns the session ID', async () => {
      const result = await CreateSessionDal()

      const session = await SessionModel.query().findById(result.id)

      expect(session).toMatchObject({
        data: {},
        id: result.id
      })
    })
  })

  describe('when there is data', () => {
    let data

    beforeAll(() => {
      data = { testData: 'Here is some test data' }
    })

    it('creates a session with the data and returns the session ID', async () => {
      const result = await CreateSessionDal(data)

      const session = await SessionModel.query().findById(result.id)

      expect(session).toMatchObject({
        data: { testData: 'Here is some test data' },
        id: result.id,
        testData: 'Here is some test data'
      })
    })
  })
})
