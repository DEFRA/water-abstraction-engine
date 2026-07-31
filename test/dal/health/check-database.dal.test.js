// Test framework
import { describe, expect, it } from 'vitest'

// Thing under test
import CheckDatabaseDal from '../../../src/dal/health/check-database.dal.js'

describe('Health - Check Database DAL', () => {
  it('confirms connection to the db by not throwing an error', async () => {
    await expect(CheckDatabaseDal()).resolves.toBeDefined()
  })
})
