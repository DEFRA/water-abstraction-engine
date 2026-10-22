// Test framework
import { beforeAll, describe, expect, it } from 'vitest'

// Test helpers
import SupportedSourceHelper from '../support/helpers/supported-source.helper.js'

// Thing under test
import SupportedSourceModel from '../../src/models/supported-source.model.js'

describe('Supported Source model', () => {
  let testRecord

  beforeAll(() => {
    testRecord = SupportedSourceHelper.select()
  })

  describe('Basic query', () => {
    it('can successfully run a basic query', async () => {
      const result = await SupportedSourceModel.query().findById(testRecord.id)

      expect(result).toBeInstanceOf(SupportedSourceModel)
      expect(result.id).toEqual(testRecord.id)
    })
  })
})
