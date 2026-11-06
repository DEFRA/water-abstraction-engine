// Test framework
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Thing under test
import * as BasePresenter from '../../../src/presenters/notices/base.presenter.js'

describe('Notices - Base presenter', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  describe('#futureDueDate()', () => {
    describe('when the "messageType" is "letter', () => {
      describe('and the current date is the start of the month', () => {
        beforeEach(() => {
          vi.useFakeTimers({ now: new Date(`2025-01-01`) })
        })

        it('should set the date to 29 days in the future', () => {
          const result = BasePresenter.futureDueDate('letter')

          const expectedDate = new Date(`2025-01-30`)

          expect(result).toEqual(expectedDate)
        })
      })

      describe('and the current date is towards the end of the month', () => {
        beforeEach(() => {
          vi.useFakeTimers({ now: new Date(`2025-01-15`) })
        })

        it('should correctly calculate date across month boundary', () => {
          const result = BasePresenter.futureDueDate('letter')

          const expectedDate = new Date(`2025-02-13`)

          expect(result).toEqual(expectedDate)
        })
      })

      describe('and the current date is towards the end of the year', () => {
        beforeEach(() => {
          vi.useFakeTimers({ now: new Date(`2024-12-15`) })
        })

        it('should correctly calculate date across year boundary', () => {
          const result = BasePresenter.futureDueDate('letter')

          const expectedDate = new Date(`2025-01-13`)

          expect(result).toEqual(expectedDate)
        })
      })
    })

    describe('when the "messageType" is "email"', () => {
      describe('and the current date is the start of the month', () => {
        beforeEach(() => {
          vi.useFakeTimers({ now: new Date(`2025-01-01`) })
        })

        it('should set the date to 28 days in the future', () => {
          const result = BasePresenter.futureDueDate('email')

          const expectedDate = new Date(`2025-01-29`)

          expect(result).toEqual(expectedDate)
        })
      })

      describe('and the current date is towards the end of the month', () => {
        beforeEach(() => {
          vi.useFakeTimers({ now: new Date(`2025-01-15`) })
        })

        it('should correctly calculate date across month boundary', () => {
          const result = BasePresenter.futureDueDate('email')

          const expectedDate = new Date(`2025-02-12`)

          expect(result).toEqual(expectedDate)
        })
      })

      describe('and the current date is towards the end of the year', () => {
        beforeEach(() => {
          vi.useFakeTimers({ now: new Date(`2024-12-15`) })
        })

        it('should correctly calculate date across year boundary', () => {
          const result = BasePresenter.futureDueDate('email')

          const expectedDate = new Date(`2025-01-12`)

          expect(result).toEqual(expectedDate)
        })
      })
    })

    describe('when no "messageType" is provided', () => {
      describe('and the current date is the start of the month', () => {
        beforeEach(() => {
          vi.useFakeTimers({ now: new Date(`2025-01-01`) })
        })

        it('should set the date to 28 days in the future', () => {
          const result = BasePresenter.futureDueDate()

          const expectedDate = new Date(`2025-01-29`)

          expect(result).toEqual(expectedDate)
        })
      })

      describe('and the current date is towards the end of the month', () => {
        beforeEach(() => {
          vi.useFakeTimers({ now: new Date(`2025-01-15`) })
        })

        it('should correctly calculate date across month boundary', () => {
          const result = BasePresenter.futureDueDate()

          const expectedDate = new Date(`2025-02-12`)

          expect(result).toEqual(expectedDate)
        })
      })

      describe('and the current date is towards the end of the year', () => {
        beforeEach(() => {
          vi.useFakeTimers({ now: new Date(`2024-12-15`) })
        })

        it('should correctly calculate date across year boundary', () => {
          const result = BasePresenter.futureDueDate()

          const expectedDate = new Date(`2025-01-12`)

          expect(result).toEqual(expectedDate)
        })
      })
    })
  })
})
