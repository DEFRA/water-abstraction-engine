// Test framework
import { describe, expect, it } from 'vitest'

// Thing under test
import { maxDecimalPlaces } from '../../../src/validators/helpers/max-decimal-places.validator.js'

describe('Validators - Helpers - Max Decimal Places Validator', () => {
  describe('#maxDecimalPlaces', () => {
    describe('when the value is falsy', () => {
      it('returns the value', () => {
        const result = maxDecimalPlaces(2)(null, {})

        expect(result).toBeNull()
      })
    })

    describe('when the value has no decimal places', () => {
      it('returns the value', () => {
        const result = maxDecimalPlaces(2)(100, {})

        expect(result).toBe(100)
      })
    })

    describe('when the value has fewer decimal places than the maximum', () => {
      it('returns the value', () => {
        const result = maxDecimalPlaces(2)(1.5, {})

        expect(result).toBe(1.5)
      })
    })

    describe('when the value has the same number of decimal places as the maximum', () => {
      it('returns the value', () => {
        const result = maxDecimalPlaces(2)(1.25, {})

        expect(result).toBe(1.25)
      })
    })

    describe('when the value has more decimal places than the maximum', () => {
      it('returns the "custom.maxDecimals" error', () => {
        const helpers = {
          error: (key) => {
            return key
          }
        }

        const result = maxDecimalPlaces(2)(1.256, helpers)

        expect(result).toBe('custom.maxDecimals')
      })
    })
  })
})
