// Test framework
import { describe, expect, it } from 'vitest'

// Test helpers
import dataWorld from '../../../cli/world/data.world.js'

// Thing under test
import protectWorld from '../../../cli/world/protect.world.js'

describe('Protect World', () => {
  describe('when given the real scenarios', () => {
    it('does not find any duplicate bill run combinations', async () => {
      const scenarios = await dataWorld()

      expect(() => {
        protectWorld(scenarios)
      }).not.toThrow()
    })
  })
})
