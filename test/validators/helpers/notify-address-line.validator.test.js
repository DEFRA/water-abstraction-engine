// Test framework
import { describe, expect, it } from 'vitest'

// Thing under test
import { invalidStartCharacters } from '../../../src/validators/helpers/notify-address-line.validator.js'

describe('Validators - Helpers - Notify Address Line Validator', () => {
  describe('#invalidStartCharacters', () => {
    describe('when the value does not start with a special character', () => {
      it('returns false', () => {
        const result = invalidStartCharacters('1 Privet Drive')

        expect(result).toBe(false)
      })
    })

    describe('when the value starts with a special character', () => {
      it('returns true', () => {
        const result = invalidStartCharacters('@invalid')

        expect(result).toBe(true)
      })
    })
  })
})
