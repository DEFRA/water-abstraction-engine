// Test framework
import { describe, expect, it } from 'vitest'

// Thing under test
import { isFalse } from '../../../src/validators/helpers/is-false.validator.js'

describe('Validators - Helpers - Is False Validator', () => {
  describe('#isFalse', () => {
    describe('when "booleanToCheck" is false', () => {
      it('returns the value', () => {
        const result = isFalse(false)('test-value', {})

        expect(result).toBe('test-value')
      })
    })

    describe('when "booleanToCheck" is true', () => {
      describe('and no custom errorKey is provided', () => {
        it('returns the default "custom.isFalse" error', () => {
          const helpers = {
            error: (key) => {
              return key
            }
          }

          const result = isFalse(true)('test-value', helpers)

          expect(result).toBe('custom.isFalse')
        })
      })

      describe('and a custom errorKey is provided', () => {
        it('returns the custom error key', () => {
          const helpers = {
            error: (key) => {
              return key
            }
          }

          const result = isFalse(true, 'custom.myError')('test-value', helpers)

          expect(result).toBe('custom.myError')
        })
      })
    })
  })
})
