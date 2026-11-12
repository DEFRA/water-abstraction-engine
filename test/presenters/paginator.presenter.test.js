// Test framework
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Test helpers
import DatabaseConfig from '../../src/config/database.config.js'

// Thing under test
import PaginatorPresenter from '../../src/presenters/paginator.presenter.js'

describe('Paginator Presenter', () => {
  const path = '/system/bill-runs'

  // NOTE: We set the number of records according to the default page size we use in these tests (50) to get the number
  // of pages we expect
  let numberOfRecords
  let queryArgs
  let selectedPage
  let currentAmount
  let message

  beforeEach(async () => {
    // NOTE: We set the default page so we have control over how we expect the paginator to 'page up' our results. But
    // it also allows us to set it to something different to the current default of 25 to confirm changing the default
    // won't break the presenter
    vi.replaceProperty(DatabaseConfig, 'defaultPageSize', 50)

    // The default page count is used, as the queries will be returning this amount.
    currentAmount = '50'
    message = 'notices'
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('when no pagination is needed', () => {
    describe('for 1 page', () => {
      beforeEach(() => {
        numberOfRecords = 1
      })

      it('returns just the number of pages calculated (no pagination component returned)', () => {
        const result = PaginatorPresenter(numberOfRecords, selectedPage, path, currentAmount, message)

        expect(result).toEqual({
          currentPageNumber: 1,
          numberOfPages: 1,
          showingMessage: 'Showing all 1 notices'
        })
      })

      it('returns the "Showing all X <message>" message', () => {
        const result = PaginatorPresenter(numberOfRecords, selectedPage, path, currentAmount, message)

        expect(result.showingMessage).toEqual('Showing all 1 notices')
      })
    })
  })

  describe('when pagination is needed', () => {
    describe('and there are no query arguments', () => {
      describe('for 2 pages', () => {
        beforeEach(() => {
          numberOfRecords = 75
        })

        describe('and the first page is selected', () => {
          beforeEach(() => {
            selectedPage = 1
          })

          it('returns [1] 2 Next ->', () => {
            const result = PaginatorPresenter(numberOfRecords, selectedPage, path, currentAmount, message)

            expect(result).toEqual({
              component: {
                items: [
                  { current: true, href: '/system/bill-runs?page=1', number: 1, visuallyHiddenText: 'Page 1' },
                  { current: false, href: '/system/bill-runs?page=2', number: 2, visuallyHiddenText: 'Page 2' }
                ],
                next: { href: '/system/bill-runs?page=2' }
              },
              currentPageNumber: selectedPage,
              numberOfPages: 2,
              showingMessage: 'Showing 50 of 75 notices'
            })
          })
        })

        describe('and the last page is selected', () => {
          beforeEach(() => {
            selectedPage = 2
          })

          it('returns <- Previous 1 [2]', () => {
            const result = PaginatorPresenter(numberOfRecords, selectedPage, path, currentAmount, message)

            expect(result).toEqual({
              component: {
                items: [
                  { current: false, href: '/system/bill-runs?page=1', number: 1, visuallyHiddenText: 'Page 1' },
                  { current: true, href: '/system/bill-runs?page=2', number: 2, visuallyHiddenText: 'Page 2' }
                ],
                previous: { href: '/system/bill-runs?page=1' }
              },
              currentPageNumber: selectedPage,
              numberOfPages: 2,
              showingMessage: 'Showing 50 of 75 notices'
            })
          })
        })
      })

      describe('for 3 pages', () => {
        beforeEach(() => {
          numberOfRecords = 125
        })

        describe('and the first page is selected', () => {
          beforeEach(() => {
            selectedPage = 1
          })

          it('returns [1] 2  3 Next ->', () => {
            const result = PaginatorPresenter(numberOfRecords, selectedPage, path, currentAmount, message)

            expect(result).toEqual({
              component: {
                items: [
                  { current: true, href: '/system/bill-runs?page=1', number: 1, visuallyHiddenText: 'Page 1' },
                  { current: false, href: '/system/bill-runs?page=2', number: 2, visuallyHiddenText: 'Page 2' },
                  { current: false, href: '/system/bill-runs?page=3', number: 3, visuallyHiddenText: 'Page 3' }
                ],
                next: { href: '/system/bill-runs?page=2' }
              },
              currentPageNumber: selectedPage,
              numberOfPages: 3,
              showingMessage: 'Showing 50 of 125 notices'
            })
          })
        })

        describe('and page 2 is selected', () => {
          beforeEach(() => {
            selectedPage = 2
          })

          it('returns <- Previous 1 [2] 3 Next ->', () => {
            const result = PaginatorPresenter(numberOfRecords, selectedPage, path, currentAmount, message)

            expect(result).toEqual({
              component: {
                items: [
                  { current: false, href: '/system/bill-runs?page=1', number: 1, visuallyHiddenText: 'Page 1' },
                  { current: true, href: '/system/bill-runs?page=2', number: 2, visuallyHiddenText: 'Page 2' },
                  { current: false, href: '/system/bill-runs?page=3', number: 3, visuallyHiddenText: 'Page 3' }
                ],
                next: { href: '/system/bill-runs?page=3' },
                previous: { href: '/system/bill-runs?page=1' }
              },
              currentPageNumber: selectedPage,
              numberOfPages: 3,
              showingMessage: 'Showing 50 of 125 notices'
            })
          })
        })

        describe('and the last page is selected', () => {
          beforeEach(() => {
            selectedPage = 3
          })

          it('returns <- Previous 1 2 [3]', () => {
            const result = PaginatorPresenter(numberOfRecords, selectedPage, path, currentAmount, message)

            expect(result).toEqual({
              component: {
                items: [
                  { current: false, href: '/system/bill-runs?page=1', number: 1, visuallyHiddenText: 'Page 1' },
                  { current: false, href: '/system/bill-runs?page=2', number: 2, visuallyHiddenText: 'Page 2' },
                  { current: true, href: '/system/bill-runs?page=3', number: 3, visuallyHiddenText: 'Page 3' }
                ],
                previous: { href: '/system/bill-runs?page=2' }
              },
              currentPageNumber: selectedPage,
              numberOfPages: 3,
              showingMessage: 'Showing 50 of 125 notices'
            })
          })
        })
      })

      describe('for 4 pages', () => {
        beforeEach(() => {
          numberOfRecords = 175
        })

        describe('and the first page is selected', () => {
          beforeEach(() => {
            selectedPage = 1
          })

          it('returns [1] 2 3 4 Next ->', () => {
            const result = PaginatorPresenter(numberOfRecords, selectedPage, path, currentAmount, message)

            expect(result).toEqual({
              component: {
                items: [
                  { current: true, href: '/system/bill-runs?page=1', number: 1, visuallyHiddenText: 'Page 1' },
                  { current: false, href: '/system/bill-runs?page=2', number: 2, visuallyHiddenText: 'Page 2' },
                  { current: false, href: '/system/bill-runs?page=3', number: 3, visuallyHiddenText: 'Page 3' },
                  { current: false, href: '/system/bill-runs?page=4', number: 4, visuallyHiddenText: 'Page 4' }
                ],
                next: { href: '/system/bill-runs?page=2' }
              },
              currentPageNumber: selectedPage,
              numberOfPages: 4,
              showingMessage: 'Showing 50 of 175 notices'
            })
          })
        })

        describe('and page 2 is selected', () => {
          beforeEach(() => {
            selectedPage = 2
          })

          it('returns <- Previous 1 [2] 3 4 Next ->', () => {
            const result = PaginatorPresenter(numberOfRecords, selectedPage, path, currentAmount, message)

            expect(result).toEqual({
              component: {
                items: [
                  { current: false, href: '/system/bill-runs?page=1', number: 1, visuallyHiddenText: 'Page 1' },
                  { current: true, href: '/system/bill-runs?page=2', number: 2, visuallyHiddenText: 'Page 2' },
                  { current: false, href: '/system/bill-runs?page=3', number: 3, visuallyHiddenText: 'Page 3' },
                  { current: false, href: '/system/bill-runs?page=4', number: 4, visuallyHiddenText: 'Page 4' }
                ],
                next: { href: '/system/bill-runs?page=3' },
                previous: { href: '/system/bill-runs?page=1' }
              },
              currentPageNumber: selectedPage,
              numberOfPages: 4,
              showingMessage: 'Showing 50 of 175 notices'
            })
          })
        })

        describe('and the last page is selected', () => {
          beforeEach(() => {
            selectedPage = 4
          })

          it('returns <- Previous 1 2 3 [4]', () => {
            const result = PaginatorPresenter(numberOfRecords, selectedPage, path, currentAmount, message)

            expect(result).toEqual({
              component: {
                items: [
                  { current: false, href: '/system/bill-runs?page=1', number: 1, visuallyHiddenText: 'Page 1' },
                  { current: false, href: '/system/bill-runs?page=2', number: 2, visuallyHiddenText: 'Page 2' },
                  { current: false, href: '/system/bill-runs?page=3', number: 3, visuallyHiddenText: 'Page 3' },
                  { current: true, href: '/system/bill-runs?page=4', number: 4, visuallyHiddenText: 'Page 4' }
                ],
                previous: { href: '/system/bill-runs?page=3' }
              },
              currentPageNumber: selectedPage,
              numberOfPages: 4,
              showingMessage: 'Showing 50 of 175 notices'
            })
          })
        })
      })

      describe('for 5 pages', () => {
        beforeEach(() => {
          numberOfRecords = 225
        })

        describe('and the first page is selected', () => {
          beforeEach(() => {
            selectedPage = 1
          })

          it('returns [1] 2 3 4 5 Next ->', () => {
            const result = PaginatorPresenter(numberOfRecords, selectedPage, path, currentAmount, message)

            expect(result).toEqual({
              component: {
                items: [
                  { current: true, href: '/system/bill-runs?page=1', number: 1, visuallyHiddenText: 'Page 1' },
                  { current: false, href: '/system/bill-runs?page=2', number: 2, visuallyHiddenText: 'Page 2' },
                  { current: false, href: '/system/bill-runs?page=3', number: 3, visuallyHiddenText: 'Page 3' },
                  { current: false, href: '/system/bill-runs?page=4', number: 4, visuallyHiddenText: 'Page 4' },
                  { current: false, href: '/system/bill-runs?page=5', number: 5, visuallyHiddenText: 'Page 5' }
                ],
                next: { href: '/system/bill-runs?page=2' }
              },
              currentPageNumber: selectedPage,
              numberOfPages: 5,
              showingMessage: 'Showing 50 of 225 notices'
            })
          })
        })

        describe('and page 3 is selected', () => {
          beforeEach(() => {
            selectedPage = 3
          })

          it('returns <- Previous 1 2 [3] 4 5 Next ->', () => {
            const result = PaginatorPresenter(numberOfRecords, selectedPage, path, currentAmount, message)

            expect(result).toEqual({
              component: {
                items: [
                  { current: false, href: '/system/bill-runs?page=1', number: 1, visuallyHiddenText: 'Page 1' },
                  { current: false, href: '/system/bill-runs?page=2', number: 2, visuallyHiddenText: 'Page 2' },
                  { current: true, href: '/system/bill-runs?page=3', number: 3, visuallyHiddenText: 'Page 3' },
                  { current: false, href: '/system/bill-runs?page=4', number: 4, visuallyHiddenText: 'Page 4' },
                  { current: false, href: '/system/bill-runs?page=5', number: 5, visuallyHiddenText: 'Page 5' }
                ],
                next: { href: '/system/bill-runs?page=4' },
                previous: { href: '/system/bill-runs?page=2' }
              },
              currentPageNumber: selectedPage,
              numberOfPages: 5,
              showingMessage: 'Showing 50 of 225 notices'
            })
          })
        })

        describe('and the last page is selected', () => {
          beforeEach(() => {
            selectedPage = 5
          })

          it('returns <- Previous 1 2 3 4 [5]', () => {
            const result = PaginatorPresenter(numberOfRecords, selectedPage, path, currentAmount, message)

            expect(result).toEqual({
              component: {
                items: [
                  { current: false, href: '/system/bill-runs?page=1', number: 1, visuallyHiddenText: 'Page 1' },
                  { current: false, href: '/system/bill-runs?page=2', number: 2, visuallyHiddenText: 'Page 2' },
                  { current: false, href: '/system/bill-runs?page=3', number: 3, visuallyHiddenText: 'Page 3' },
                  { current: false, href: '/system/bill-runs?page=4', number: 4, visuallyHiddenText: 'Page 4' },
                  { current: true, href: '/system/bill-runs?page=5', number: 5, visuallyHiddenText: 'Page 5' }
                ],
                previous: { href: '/system/bill-runs?page=4' }
              },
              currentPageNumber: selectedPage,
              numberOfPages: 5,
              showingMessage: 'Showing 50 of 225 notices'
            })
          })
        })
      })

      describe('for 6 pages', () => {
        beforeEach(() => {
          numberOfRecords = 275
        })

        describe('and the first page is selected', () => {
          beforeEach(() => {
            selectedPage = 1
          })

          it('returns [1] 2 3 4 5 6 Next ->', () => {
            const result = PaginatorPresenter(numberOfRecords, selectedPage, path, currentAmount, message)

            expect(result).toEqual({
              component: {
                items: [
                  { current: true, href: '/system/bill-runs?page=1', number: 1, visuallyHiddenText: 'Page 1' },
                  { current: false, href: '/system/bill-runs?page=2', number: 2, visuallyHiddenText: 'Page 2' },
                  { current: false, href: '/system/bill-runs?page=3', number: 3, visuallyHiddenText: 'Page 3' },
                  { current: false, href: '/system/bill-runs?page=4', number: 4, visuallyHiddenText: 'Page 4' },
                  { current: false, href: '/system/bill-runs?page=5', number: 5, visuallyHiddenText: 'Page 5' },
                  { current: false, href: '/system/bill-runs?page=6', number: 6, visuallyHiddenText: 'Page 6' }
                ],
                next: { href: '/system/bill-runs?page=2' }
              },
              currentPageNumber: selectedPage,
              numberOfPages: 6,
              showingMessage: 'Showing 50 of 275 notices'
            })
          })
        })

        describe('and page 3 is selected', () => {
          beforeEach(() => {
            selectedPage = 3
          })

          it('returns <- Previous 1 2 [3] 4 5 6 Next ->', () => {
            const result = PaginatorPresenter(numberOfRecords, selectedPage, path, currentAmount, message)

            expect(result).toEqual({
              component: {
                items: [
                  { current: false, href: '/system/bill-runs?page=1', number: 1, visuallyHiddenText: 'Page 1' },
                  { current: false, href: '/system/bill-runs?page=2', number: 2, visuallyHiddenText: 'Page 2' },
                  { current: true, href: '/system/bill-runs?page=3', number: 3, visuallyHiddenText: 'Page 3' },
                  { current: false, href: '/system/bill-runs?page=4', number: 4, visuallyHiddenText: 'Page 4' },
                  { current: false, href: '/system/bill-runs?page=5', number: 5, visuallyHiddenText: 'Page 5' },
                  { current: false, href: '/system/bill-runs?page=6', number: 6, visuallyHiddenText: 'Page 6' }
                ],
                next: { href: '/system/bill-runs?page=4' },
                previous: { href: '/system/bill-runs?page=2' }
              },
              currentPageNumber: selectedPage,
              numberOfPages: 6,
              showingMessage: 'Showing 50 of 275 notices'
            })
          })
        })

        describe('and the last page is selected', () => {
          beforeEach(() => {
            selectedPage = 6
          })

          it('returns <- Previous 1 2 3 4 5 [6]', () => {
            const result = PaginatorPresenter(numberOfRecords, selectedPage, path, currentAmount, message)

            expect(result).toEqual({
              component: {
                items: [
                  { current: false, href: '/system/bill-runs?page=1', number: 1, visuallyHiddenText: 'Page 1' },
                  { current: false, href: '/system/bill-runs?page=2', number: 2, visuallyHiddenText: 'Page 2' },
                  { current: false, href: '/system/bill-runs?page=3', number: 3, visuallyHiddenText: 'Page 3' },
                  { current: false, href: '/system/bill-runs?page=4', number: 4, visuallyHiddenText: 'Page 4' },
                  { current: false, href: '/system/bill-runs?page=5', number: 5, visuallyHiddenText: 'Page 5' },
                  { current: true, href: '/system/bill-runs?page=6', number: 6, visuallyHiddenText: 'Page 6' }
                ],
                previous: { href: '/system/bill-runs?page=5' }
              },
              currentPageNumber: selectedPage,
              numberOfPages: 6,
              showingMessage: 'Showing 50 of 275 notices'
            })
          })
        })
      })

      describe('for 7 pages', () => {
        beforeEach(() => {
          numberOfRecords = 325
        })

        describe('and the first page is selected', () => {
          beforeEach(() => {
            selectedPage = 1
          })

          it('returns [1] 2 3 4 5 6 7 Next ->', () => {
            const result = PaginatorPresenter(numberOfRecords, selectedPage, path, currentAmount, message)

            expect(result).toEqual({
              component: {
                items: [
                  { current: true, href: '/system/bill-runs?page=1', number: 1, visuallyHiddenText: 'Page 1' },
                  { current: false, href: '/system/bill-runs?page=2', number: 2, visuallyHiddenText: 'Page 2' },
                  { current: false, href: '/system/bill-runs?page=3', number: 3, visuallyHiddenText: 'Page 3' },
                  { current: false, href: '/system/bill-runs?page=4', number: 4, visuallyHiddenText: 'Page 4' },
                  { current: false, href: '/system/bill-runs?page=5', number: 5, visuallyHiddenText: 'Page 5' },
                  { current: false, href: '/system/bill-runs?page=6', number: 6, visuallyHiddenText: 'Page 6' },
                  { current: false, href: '/system/bill-runs?page=7', number: 7, visuallyHiddenText: 'Page 7' }
                ],
                next: { href: '/system/bill-runs?page=2' }
              },
              currentPageNumber: selectedPage,
              numberOfPages: 7,
              showingMessage: 'Showing 50 of 325 notices'
            })
          })
        })

        describe('and page 4 is selected', () => {
          beforeEach(() => {
            selectedPage = 4
          })

          it('returns <- Previous 1 2 3 [4] 5 6 7 Next ->', () => {
            const result = PaginatorPresenter(numberOfRecords, selectedPage, path, currentAmount, message)

            expect(result).toEqual({
              component: {
                items: [
                  { current: false, href: '/system/bill-runs?page=1', number: 1, visuallyHiddenText: 'Page 1' },
                  { current: false, href: '/system/bill-runs?page=2', number: 2, visuallyHiddenText: 'Page 2' },
                  { current: false, href: '/system/bill-runs?page=3', number: 3, visuallyHiddenText: 'Page 3' },
                  { current: true, href: '/system/bill-runs?page=4', number: 4, visuallyHiddenText: 'Page 4' },
                  { current: false, href: '/system/bill-runs?page=5', number: 5, visuallyHiddenText: 'Page 5' },
                  { current: false, href: '/system/bill-runs?page=6', number: 6, visuallyHiddenText: 'Page 6' },
                  { current: false, href: '/system/bill-runs?page=7', number: 7, visuallyHiddenText: 'Page 7' }
                ],
                next: { href: '/system/bill-runs?page=5' },
                previous: { href: '/system/bill-runs?page=3' }
              },
              currentPageNumber: selectedPage,
              numberOfPages: 7,
              showingMessage: 'Showing 50 of 325 notices'
            })
          })
        })

        describe('and the last page is selected', () => {
          beforeEach(() => {
            selectedPage = 7
          })

          it('returns <- Previous 1 2 3 4 5 6 [7]', () => {
            const result = PaginatorPresenter(numberOfRecords, selectedPage, path, currentAmount, message)

            expect(result).toEqual({
              component: {
                items: [
                  { current: false, href: '/system/bill-runs?page=1', number: 1, visuallyHiddenText: 'Page 1' },
                  { current: false, href: '/system/bill-runs?page=2', number: 2, visuallyHiddenText: 'Page 2' },
                  { current: false, href: '/system/bill-runs?page=3', number: 3, visuallyHiddenText: 'Page 3' },
                  { current: false, href: '/system/bill-runs?page=4', number: 4, visuallyHiddenText: 'Page 4' },
                  { current: false, href: '/system/bill-runs?page=5', number: 5, visuallyHiddenText: 'Page 5' },
                  { current: false, href: '/system/bill-runs?page=6', number: 6, visuallyHiddenText: 'Page 6' },
                  { current: true, href: '/system/bill-runs?page=7', number: 7, visuallyHiddenText: 'Page 7' }
                ],
                previous: { href: '/system/bill-runs?page=6' }
              },
              currentPageNumber: selectedPage,
              numberOfPages: 7,
              showingMessage: 'Showing 50 of 325 notices'
            })
          })
        })
      })

      describe('for 8 pages', () => {
        beforeEach(() => {
          numberOfRecords = 375
        })

        describe('and the first page is selected', () => {
          beforeEach(() => {
            selectedPage = 1
          })

          it('returns [1] 2 3 4 5 .. 8 Next ->', () => {
            const result = PaginatorPresenter(numberOfRecords, selectedPage, path, currentAmount, message)

            expect(result).toEqual({
              component: {
                items: [
                  { current: true, href: '/system/bill-runs?page=1', number: 1, visuallyHiddenText: 'Page 1' },
                  { current: false, href: '/system/bill-runs?page=2', number: 2, visuallyHiddenText: 'Page 2' },
                  { current: false, href: '/system/bill-runs?page=3', number: 3, visuallyHiddenText: 'Page 3' },
                  { current: false, href: '/system/bill-runs?page=4', number: 4, visuallyHiddenText: 'Page 4' },
                  { current: false, href: '/system/bill-runs?page=5', number: 5, visuallyHiddenText: 'Page 5' },
                  { ellipsis: true },
                  { current: false, href: '/system/bill-runs?page=8', number: 8, visuallyHiddenText: 'Page 8' }
                ],
                next: { href: '/system/bill-runs?page=2' }
              },
              currentPageNumber: selectedPage,
              numberOfPages: 8,
              showingMessage: 'Showing 50 of 375 notices'
            })
          })
        })

        describe('and page 4 is selected', () => {
          beforeEach(() => {
            selectedPage = 4
          })

          it('returns <- Previous 1 2 3 [4] 5 .. 8 Next ->', () => {
            const result = PaginatorPresenter(numberOfRecords, selectedPage, path, currentAmount, message)

            expect(result).toEqual({
              component: {
                items: [
                  { current: false, href: '/system/bill-runs?page=1', number: 1, visuallyHiddenText: 'Page 1' },
                  { current: false, href: '/system/bill-runs?page=2', number: 2, visuallyHiddenText: 'Page 2' },
                  { current: false, href: '/system/bill-runs?page=3', number: 3, visuallyHiddenText: 'Page 3' },
                  { current: true, href: '/system/bill-runs?page=4', number: 4, visuallyHiddenText: 'Page 4' },
                  { current: false, href: '/system/bill-runs?page=5', number: 5, visuallyHiddenText: 'Page 5' },
                  { ellipsis: true },
                  { current: false, href: '/system/bill-runs?page=8', number: 8, visuallyHiddenText: 'Page 8' }
                ],
                next: { href: '/system/bill-runs?page=5' },
                previous: { href: '/system/bill-runs?page=3' }
              },
              currentPageNumber: selectedPage,
              numberOfPages: 8,
              showingMessage: 'Showing 50 of 375 notices'
            })
          })
        })

        describe('and page 5 is selected', () => {
          beforeEach(() => {
            selectedPage = 5
          })

          it('returns <- Previous 1 .. 4 [5] 6 7 8 Next ->', () => {
            const result = PaginatorPresenter(numberOfRecords, selectedPage, path, currentAmount, message)

            expect(result).toEqual({
              component: {
                items: [
                  { current: false, href: '/system/bill-runs?page=1', number: 1, visuallyHiddenText: 'Page 1' },
                  { ellipsis: true },
                  { current: false, href: '/system/bill-runs?page=4', number: 4, visuallyHiddenText: 'Page 4' },
                  { current: true, href: '/system/bill-runs?page=5', number: 5, visuallyHiddenText: 'Page 5' },
                  { current: false, href: '/system/bill-runs?page=6', number: 6, visuallyHiddenText: 'Page 6' },
                  { current: false, href: '/system/bill-runs?page=7', number: 7, visuallyHiddenText: 'Page 7' },
                  { current: false, href: '/system/bill-runs?page=8', number: 8, visuallyHiddenText: 'Page 8' }
                ],
                next: { href: '/system/bill-runs?page=6' },
                previous: { href: '/system/bill-runs?page=4' }
              },
              currentPageNumber: selectedPage,
              numberOfPages: 8,
              showingMessage: 'Showing 50 of 375 notices'
            })
          })
        })

        describe('and the last page is selected', () => {
          beforeEach(() => {
            selectedPage = 8
          })

          it('returns <- Previous 1 .. 4 5 6 7 [8]', () => {
            const result = PaginatorPresenter(numberOfRecords, selectedPage, path, currentAmount, message)

            expect(result).toEqual({
              component: {
                items: [
                  { current: false, href: '/system/bill-runs?page=1', number: 1, visuallyHiddenText: 'Page 1' },
                  { ellipsis: true },
                  { current: false, href: '/system/bill-runs?page=4', number: 4, visuallyHiddenText: 'Page 4' },
                  { current: false, href: '/system/bill-runs?page=5', number: 5, visuallyHiddenText: 'Page 5' },
                  { current: false, href: '/system/bill-runs?page=6', number: 6, visuallyHiddenText: 'Page 6' },
                  { current: false, href: '/system/bill-runs?page=7', number: 7, visuallyHiddenText: 'Page 7' },
                  { current: true, href: '/system/bill-runs?page=8', number: 8, visuallyHiddenText: 'Page 8' }
                ],
                previous: { href: '/system/bill-runs?page=7' }
              },
              currentPageNumber: selectedPage,
              numberOfPages: 8,
              showingMessage: 'Showing 50 of 375 notices'
            })
          })
        })
      })

      describe('for 9 pages', () => {
        beforeEach(() => {
          numberOfRecords = 425
        })

        describe('and the first page is selected', () => {
          beforeEach(() => {
            selectedPage = 1
          })

          it('returns [1] 2 3 4 5 .. 9 Next ->', () => {
            const result = PaginatorPresenter(numberOfRecords, selectedPage, path, currentAmount, message)

            expect(result).toEqual({
              component: {
                items: [
                  { current: true, href: '/system/bill-runs?page=1', number: 1, visuallyHiddenText: 'Page 1' },
                  { current: false, href: '/system/bill-runs?page=2', number: 2, visuallyHiddenText: 'Page 2' },
                  { current: false, href: '/system/bill-runs?page=3', number: 3, visuallyHiddenText: 'Page 3' },
                  { current: false, href: '/system/bill-runs?page=4', number: 4, visuallyHiddenText: 'Page 4' },
                  { current: false, href: '/system/bill-runs?page=5', number: 5, visuallyHiddenText: 'Page 5' },
                  { ellipsis: true },
                  { current: false, href: '/system/bill-runs?page=9', number: 9, visuallyHiddenText: 'Page 9' }
                ],
                next: { href: '/system/bill-runs?page=2' }
              },
              currentPageNumber: selectedPage,
              numberOfPages: 9,
              showingMessage: 'Showing 50 of 425 notices'
            })
          })
        })

        describe('and page 4 is selected', () => {
          beforeEach(() => {
            selectedPage = 4
          })

          it('returns <- Previous 1 2 3 [4] 5 .. 9 Next ->', () => {
            const result = PaginatorPresenter(numberOfRecords, selectedPage, path, currentAmount, message)

            expect(result).toEqual({
              component: {
                items: [
                  { current: false, href: '/system/bill-runs?page=1', number: 1, visuallyHiddenText: 'Page 1' },
                  { current: false, href: '/system/bill-runs?page=2', number: 2, visuallyHiddenText: 'Page 2' },
                  { current: false, href: '/system/bill-runs?page=3', number: 3, visuallyHiddenText: 'Page 3' },
                  { current: true, href: '/system/bill-runs?page=4', number: 4, visuallyHiddenText: 'Page 4' },
                  { current: false, href: '/system/bill-runs?page=5', number: 5, visuallyHiddenText: 'Page 5' },
                  { ellipsis: true },
                  { current: false, href: '/system/bill-runs?page=9', number: 9, visuallyHiddenText: 'Page 9' }
                ],
                next: { href: '/system/bill-runs?page=5' },
                previous: { href: '/system/bill-runs?page=3' }
              },
              currentPageNumber: selectedPage,
              numberOfPages: 9,
              showingMessage: 'Showing 50 of 425 notices'
            })
          })
        })

        describe('and page 5 is selected', () => {
          beforeEach(() => {
            selectedPage = 5
          })

          it('returns <- Previous 1 .. 4 [5] 6 .. 9 Next ->', () => {
            const result = PaginatorPresenter(numberOfRecords, selectedPage, path, currentAmount, message)

            expect(result).toEqual({
              component: {
                items: [
                  { current: false, href: '/system/bill-runs?page=1', number: 1, visuallyHiddenText: 'Page 1' },
                  { ellipsis: true },
                  { current: false, href: '/system/bill-runs?page=4', number: 4, visuallyHiddenText: 'Page 4' },
                  { current: true, href: '/system/bill-runs?page=5', number: 5, visuallyHiddenText: 'Page 5' },
                  { current: false, href: '/system/bill-runs?page=6', number: 6, visuallyHiddenText: 'Page 6' },
                  { ellipsis: true },
                  { current: false, href: '/system/bill-runs?page=9', number: 9, visuallyHiddenText: 'Page 9' }
                ],
                next: { href: '/system/bill-runs?page=6' },
                previous: { href: '/system/bill-runs?page=4' }
              },
              currentPageNumber: selectedPage,
              numberOfPages: 9,
              showingMessage: 'Showing 50 of 425 notices'
            })
          })
        })

        describe('and page 6 is selected', () => {
          beforeEach(() => {
            selectedPage = 6
          })

          it('returns <- Previous 1 .. 5 [6] 7 8 9 Next ->', () => {
            const result = PaginatorPresenter(numberOfRecords, selectedPage, path, currentAmount, message)

            expect(result).toEqual({
              component: {
                items: [
                  { current: false, href: '/system/bill-runs?page=1', number: 1, visuallyHiddenText: 'Page 1' },
                  { ellipsis: true },
                  { current: false, href: '/system/bill-runs?page=5', number: 5, visuallyHiddenText: 'Page 5' },
                  { current: true, href: '/system/bill-runs?page=6', number: 6, visuallyHiddenText: 'Page 6' },
                  { current: false, href: '/system/bill-runs?page=7', number: 7, visuallyHiddenText: 'Page 7' },
                  { current: false, href: '/system/bill-runs?page=8', number: 8, visuallyHiddenText: 'Page 8' },
                  { current: false, href: '/system/bill-runs?page=9', number: 9, visuallyHiddenText: 'Page 9' }
                ],
                next: { href: '/system/bill-runs?page=7' },
                previous: { href: '/system/bill-runs?page=5' }
              },
              currentPageNumber: selectedPage,
              numberOfPages: 9,
              showingMessage: 'Showing 50 of 425 notices'
            })
          })
        })

        describe('and the last page is selected', () => {
          beforeEach(() => {
            selectedPage = 9
          })

          it('returns <- Previous 1 .. 5 6 7 8 [9]', () => {
            const result = PaginatorPresenter(numberOfRecords, selectedPage, path, currentAmount, message)

            expect(result).toEqual({
              component: {
                items: [
                  { current: false, href: '/system/bill-runs?page=1', number: 1, visuallyHiddenText: 'Page 1' },
                  { ellipsis: true },
                  { current: false, href: '/system/bill-runs?page=5', number: 5, visuallyHiddenText: 'Page 5' },
                  { current: false, href: '/system/bill-runs?page=6', number: 6, visuallyHiddenText: 'Page 6' },
                  { current: false, href: '/system/bill-runs?page=7', number: 7, visuallyHiddenText: 'Page 7' },
                  { current: false, href: '/system/bill-runs?page=8', number: 8, visuallyHiddenText: 'Page 8' },
                  { current: true, href: '/system/bill-runs?page=9', number: 9, visuallyHiddenText: 'Page 9' }
                ],
                previous: { href: '/system/bill-runs?page=8' }
              },
              currentPageNumber: selectedPage,
              numberOfPages: 9,
              showingMessage: 'Showing 50 of 425 notices'
            })
          })
        })
      })

      describe('for 100 pages', () => {
        beforeEach(() => {
          numberOfRecords = 4975
        })

        describe('and the first page is selected', () => {
          beforeEach(() => {
            selectedPage = 1
          })

          it('returns [1] 2 3 4 5 .. 100 Next ->', () => {
            const result = PaginatorPresenter(numberOfRecords, selectedPage, path, currentAmount, message)

            expect(result).toEqual({
              component: {
                items: [
                  { current: true, href: '/system/bill-runs?page=1', number: 1, visuallyHiddenText: 'Page 1' },
                  { current: false, href: '/system/bill-runs?page=2', number: 2, visuallyHiddenText: 'Page 2' },
                  { current: false, href: '/system/bill-runs?page=3', number: 3, visuallyHiddenText: 'Page 3' },
                  { current: false, href: '/system/bill-runs?page=4', number: 4, visuallyHiddenText: 'Page 4' },
                  { current: false, href: '/system/bill-runs?page=5', number: 5, visuallyHiddenText: 'Page 5' },
                  { ellipsis: true },
                  { current: false, href: '/system/bill-runs?page=100', number: 100, visuallyHiddenText: 'Page 100' }
                ],
                next: { href: '/system/bill-runs?page=2' }
              },
              currentPageNumber: selectedPage,
              numberOfPages: 100,
              showingMessage: 'Showing 50 of 4975 notices'
            })
          })
        })

        describe('and page 4 is selected', () => {
          beforeEach(() => {
            selectedPage = 4
          })

          it('returns <- Previous 1 2 3 [4] 5 .. 100 Next ->', () => {
            const result = PaginatorPresenter(numberOfRecords, selectedPage, path, currentAmount, message)

            expect(result).toEqual({
              component: {
                items: [
                  { current: false, href: '/system/bill-runs?page=1', number: 1, visuallyHiddenText: 'Page 1' },
                  { current: false, href: '/system/bill-runs?page=2', number: 2, visuallyHiddenText: 'Page 2' },
                  { current: false, href: '/system/bill-runs?page=3', number: 3, visuallyHiddenText: 'Page 3' },
                  { current: true, href: '/system/bill-runs?page=4', number: 4, visuallyHiddenText: 'Page 4' },
                  { current: false, href: '/system/bill-runs?page=5', number: 5, visuallyHiddenText: 'Page 5' },
                  { ellipsis: true },
                  { current: false, href: '/system/bill-runs?page=100', number: 100, visuallyHiddenText: 'Page 100' }
                ],
                next: { href: '/system/bill-runs?page=5' },
                previous: { href: '/system/bill-runs?page=3' }
              },
              currentPageNumber: selectedPage,
              numberOfPages: 100,
              showingMessage: 'Showing 50 of 4975 notices'
            })
          })
        })

        describe('and page 49 is selected', () => {
          beforeEach(() => {
            selectedPage = 49
          })

          it('returns <- Previous 1 .. 48 [49] 50 .. 100 Next ->', () => {
            const result = PaginatorPresenter(numberOfRecords, selectedPage, path, currentAmount, message)

            expect(result).toEqual({
              component: {
                items: [
                  { current: false, href: '/system/bill-runs?page=1', number: 1, visuallyHiddenText: 'Page 1' },
                  { ellipsis: true },
                  { current: false, href: '/system/bill-runs?page=48', number: 48, visuallyHiddenText: 'Page 48' },
                  { current: true, href: '/system/bill-runs?page=49', number: 49, visuallyHiddenText: 'Page 49' },
                  { current: false, href: '/system/bill-runs?page=50', number: 50, visuallyHiddenText: 'Page 50' },
                  { ellipsis: true },
                  { current: false, href: '/system/bill-runs?page=100', number: 100, visuallyHiddenText: 'Page 100' }
                ],
                next: { href: '/system/bill-runs?page=50' },
                previous: { href: '/system/bill-runs?page=48' }
              },
              currentPageNumber: selectedPage,
              numberOfPages: 100,
              showingMessage: 'Showing 50 of 4975 notices'
            })
          })
        })

        describe('and page 97 is selected', () => {
          beforeEach(() => {
            selectedPage = 97
          })

          it('returns <- Previous 1 .. 96 [97] 98 99 100 Next ->', () => {
            const result = PaginatorPresenter(numberOfRecords, selectedPage, path, currentAmount, message)

            expect(result).toEqual({
              component: {
                items: [
                  { current: false, href: '/system/bill-runs?page=1', number: 1, visuallyHiddenText: 'Page 1' },
                  { ellipsis: true },
                  { current: false, href: '/system/bill-runs?page=96', number: 96, visuallyHiddenText: 'Page 96' },
                  { current: true, href: '/system/bill-runs?page=97', number: 97, visuallyHiddenText: 'Page 97' },
                  { current: false, href: '/system/bill-runs?page=98', number: 98, visuallyHiddenText: 'Page 98' },
                  { current: false, href: '/system/bill-runs?page=99', number: 99, visuallyHiddenText: 'Page 99' },
                  { current: false, href: '/system/bill-runs?page=100', number: 100, visuallyHiddenText: 'Page 100' }
                ],
                next: { href: '/system/bill-runs?page=98' },
                previous: { href: '/system/bill-runs?page=96' }
              },
              currentPageNumber: selectedPage,
              numberOfPages: 100,
              showingMessage: 'Showing 50 of 4975 notices'
            })
          })
        })

        describe('and the last page is selected', () => {
          beforeEach(() => {
            currentAmount = '3'
            selectedPage = 100
          })

          it('returns <- Previous 1 .. 96 97 98 99 [100]', () => {
            const result = PaginatorPresenter(numberOfRecords, selectedPage, path, currentAmount, message)

            expect(result).toEqual({
              component: {
                items: [
                  { current: false, href: '/system/bill-runs?page=1', number: 1, visuallyHiddenText: 'Page 1' },
                  { ellipsis: true },
                  { current: false, href: '/system/bill-runs?page=96', number: 96, visuallyHiddenText: 'Page 96' },
                  { current: false, href: '/system/bill-runs?page=97', number: 97, visuallyHiddenText: 'Page 97' },
                  { current: false, href: '/system/bill-runs?page=98', number: 98, visuallyHiddenText: 'Page 98' },
                  { current: false, href: '/system/bill-runs?page=99', number: 99, visuallyHiddenText: 'Page 99' },
                  { current: true, href: '/system/bill-runs?page=100', number: 100, visuallyHiddenText: 'Page 100' }
                ],
                previous: { href: '/system/bill-runs?page=99' }
              },
              currentPageNumber: selectedPage,
              numberOfPages: 100,
              showingMessage: 'Showing 3 of 4975 notices'
            })
          })

          describe('when "numberOfShownItems" is less than the default page size', () => {
            it('returns the "Showing 3 of 4975 notices"', () => {
              const result = PaginatorPresenter(numberOfRecords, selectedPage, path, currentAmount, message)

              expect(result.showingMessage).toEqual(`Showing ${currentAmount} of 4975 notices`)
            })
          })
        })
      })
    })

    describe('and there are query arguments', () => {
      beforeEach(() => {
        queryArgs = {
          'billing-account-id': 'c17c0a2b-6950-490b-8c3a-4dc9f01da368',
          'licence-id': '354fc0bd-0820-4611-a6af-874480bbae3b'
        }
      })

      describe('URL encodes the query string', () => {
        beforeEach(() => {
          queryArgs = {
            name: 'Mr T'
          }
        })

        it('encodes special characters correctly', () => {
          const result = PaginatorPresenter(numberOfRecords, selectedPage, path, currentAmount, message, queryArgs)

          expect(result.component.previous.href).toEqual('/system/bill-runs?page=99&name=Mr+T')
        })
      })

      describe('for 2 pages', () => {
        beforeEach(() => {
          numberOfRecords = 75
        })

        describe('and the first page is selected', () => {
          beforeEach(() => {
            selectedPage = 1
          })

          it('returns [1] 2 Next ->', () => {
            const result = PaginatorPresenter(numberOfRecords, selectedPage, path, currentAmount, message, queryArgs)

            expect(result).toEqual({
              component: {
                items: [
                  {
                    current: true,
                    href: '/system/bill-runs?page=1&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 1,
                    visuallyHiddenText: 'Page 1'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=2&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 2,
                    visuallyHiddenText: 'Page 2'
                  }
                ],
                next: {
                  href: '/system/bill-runs?page=2&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b'
                }
              },
              currentPageNumber: selectedPage,
              numberOfPages: 2,
              showingMessage: 'Showing 50 of 75 notices'
            })
          })
        })

        describe('and the last page is selected', () => {
          beforeEach(() => {
            selectedPage = 2
          })

          it('returns <- Previous 1 [2]', () => {
            const result = PaginatorPresenter(numberOfRecords, selectedPage, path, currentAmount, message, queryArgs)

            expect(result).toEqual({
              component: {
                items: [
                  {
                    current: false,
                    href: '/system/bill-runs?page=1&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 1,
                    visuallyHiddenText: 'Page 1'
                  },
                  {
                    current: true,
                    href: '/system/bill-runs?page=2&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 2,
                    visuallyHiddenText: 'Page 2'
                  }
                ],
                previous: {
                  href: '/system/bill-runs?page=1&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b'
                }
              },
              currentPageNumber: selectedPage,
              numberOfPages: 2,
              showingMessage: 'Showing 50 of 75 notices'
            })
          })
        })
      })

      describe('for 3 pages', () => {
        beforeEach(() => {
          numberOfRecords = 125
        })

        describe('and the first page is selected', () => {
          beforeEach(() => {
            selectedPage = 1
          })

          it('returns [1] 2  3 Next ->', () => {
            const result = PaginatorPresenter(numberOfRecords, selectedPage, path, currentAmount, message, queryArgs)

            expect(result).toEqual({
              component: {
                items: [
                  {
                    current: true,
                    href: '/system/bill-runs?page=1&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 1,
                    visuallyHiddenText: 'Page 1'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=2&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 2,
                    visuallyHiddenText: 'Page 2'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=3&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 3,
                    visuallyHiddenText: 'Page 3'
                  }
                ],
                next: {
                  href: '/system/bill-runs?page=2&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b'
                }
              },
              currentPageNumber: selectedPage,
              numberOfPages: 3,
              showingMessage: 'Showing 50 of 125 notices'
            })
          })
        })

        describe('and page 2 is selected', () => {
          beforeEach(() => {
            selectedPage = 2
          })

          it('returns <- Previous 1 [2] 3 Next ->', () => {
            const result = PaginatorPresenter(numberOfRecords, selectedPage, path, currentAmount, message, queryArgs)

            expect(result).toEqual({
              component: {
                items: [
                  {
                    current: false,
                    href: '/system/bill-runs?page=1&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 1,
                    visuallyHiddenText: 'Page 1'
                  },
                  {
                    current: true,
                    href: '/system/bill-runs?page=2&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 2,
                    visuallyHiddenText: 'Page 2'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=3&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 3,
                    visuallyHiddenText: 'Page 3'
                  }
                ],
                next: {
                  href: '/system/bill-runs?page=3&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b'
                },
                previous: {
                  href: '/system/bill-runs?page=1&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b'
                }
              },
              currentPageNumber: selectedPage,
              numberOfPages: 3,
              showingMessage: 'Showing 50 of 125 notices'
            })
          })
        })

        describe('and the last page is selected', () => {
          beforeEach(() => {
            selectedPage = 3
          })

          it('returns <- Previous 1 2 [3]', () => {
            const result = PaginatorPresenter(numberOfRecords, selectedPage, path, currentAmount, message, queryArgs)

            expect(result).toEqual({
              component: {
                items: [
                  {
                    current: false,
                    href: '/system/bill-runs?page=1&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 1,
                    visuallyHiddenText: 'Page 1'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=2&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 2,
                    visuallyHiddenText: 'Page 2'
                  },
                  {
                    current: true,
                    href: '/system/bill-runs?page=3&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 3,
                    visuallyHiddenText: 'Page 3'
                  }
                ],
                previous: {
                  href: '/system/bill-runs?page=2&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b'
                }
              },
              currentPageNumber: selectedPage,
              numberOfPages: 3,
              showingMessage: 'Showing 50 of 125 notices'
            })
          })
        })
      })

      describe('for 4 pages', () => {
        beforeEach(() => {
          numberOfRecords = 175
        })

        describe('and the first page is selected', () => {
          beforeEach(() => {
            selectedPage = 1
          })

          it('returns [1] 2 3 4 Next ->', () => {
            const result = PaginatorPresenter(numberOfRecords, selectedPage, path, currentAmount, message, queryArgs)

            expect(result).toEqual({
              component: {
                items: [
                  {
                    current: true,
                    href: '/system/bill-runs?page=1&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 1,
                    visuallyHiddenText: 'Page 1'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=2&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 2,
                    visuallyHiddenText: 'Page 2'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=3&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 3,
                    visuallyHiddenText: 'Page 3'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=4&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 4,
                    visuallyHiddenText: 'Page 4'
                  }
                ],
                next: {
                  href: '/system/bill-runs?page=2&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b'
                }
              },
              currentPageNumber: selectedPage,
              numberOfPages: 4,
              showingMessage: 'Showing 50 of 175 notices'
            })
          })
        })

        describe('and page 2 is selected', () => {
          beforeEach(() => {
            selectedPage = 2
          })

          it('returns <- Previous 1 [2] 3 4 Next ->', () => {
            const result = PaginatorPresenter(numberOfRecords, selectedPage, path, currentAmount, message, queryArgs)

            expect(result).toEqual({
              component: {
                items: [
                  {
                    current: false,
                    href: '/system/bill-runs?page=1&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 1,
                    visuallyHiddenText: 'Page 1'
                  },
                  {
                    current: true,
                    href: '/system/bill-runs?page=2&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 2,
                    visuallyHiddenText: 'Page 2'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=3&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 3,
                    visuallyHiddenText: 'Page 3'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=4&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 4,
                    visuallyHiddenText: 'Page 4'
                  }
                ],
                next: {
                  href: '/system/bill-runs?page=3&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b'
                },
                previous: {
                  href: '/system/bill-runs?page=1&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b'
                }
              },
              currentPageNumber: selectedPage,
              numberOfPages: 4,
              showingMessage: 'Showing 50 of 175 notices'
            })
          })
        })

        describe('and the last page is selected', () => {
          beforeEach(() => {
            selectedPage = 4
          })

          it('returns <- Previous 1 2 3 [4]', () => {
            const result = PaginatorPresenter(numberOfRecords, selectedPage, path, currentAmount, message, queryArgs)

            expect(result).toEqual({
              component: {
                items: [
                  {
                    current: false,
                    href: '/system/bill-runs?page=1&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 1,
                    visuallyHiddenText: 'Page 1'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=2&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 2,
                    visuallyHiddenText: 'Page 2'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=3&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 3,
                    visuallyHiddenText: 'Page 3'
                  },
                  {
                    current: true,
                    href: '/system/bill-runs?page=4&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 4,
                    visuallyHiddenText: 'Page 4'
                  }
                ],
                previous: {
                  href: '/system/bill-runs?page=3&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b'
                }
              },
              currentPageNumber: selectedPage,
              numberOfPages: 4,
              showingMessage: 'Showing 50 of 175 notices'
            })
          })
        })
      })

      describe('for 5 pages', () => {
        beforeEach(() => {
          numberOfRecords = 225
        })

        describe('and the first page is selected', () => {
          beforeEach(() => {
            selectedPage = 1
          })

          it('returns [1] 2 3 4 5 Next ->', () => {
            const result = PaginatorPresenter(numberOfRecords, selectedPage, path, currentAmount, message, queryArgs)

            expect(result).toEqual({
              component: {
                items: [
                  {
                    current: true,
                    href: '/system/bill-runs?page=1&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 1,
                    visuallyHiddenText: 'Page 1'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=2&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 2,
                    visuallyHiddenText: 'Page 2'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=3&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 3,
                    visuallyHiddenText: 'Page 3'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=4&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 4,
                    visuallyHiddenText: 'Page 4'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=5&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 5,
                    visuallyHiddenText: 'Page 5'
                  }
                ],
                next: {
                  href: '/system/bill-runs?page=2&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b'
                }
              },
              currentPageNumber: selectedPage,
              numberOfPages: 5,
              showingMessage: 'Showing 50 of 225 notices'
            })
          })
        })

        describe('and page 3 is selected', () => {
          beforeEach(() => {
            selectedPage = 3
          })

          it('returns <- Previous 1 2 [3] 4 5 Next ->', () => {
            const result = PaginatorPresenter(numberOfRecords, selectedPage, path, currentAmount, message, queryArgs)

            expect(result).toEqual({
              component: {
                items: [
                  {
                    current: false,
                    href: '/system/bill-runs?page=1&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 1,
                    visuallyHiddenText: 'Page 1'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=2&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 2,
                    visuallyHiddenText: 'Page 2'
                  },
                  {
                    current: true,
                    href: '/system/bill-runs?page=3&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 3,
                    visuallyHiddenText: 'Page 3'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=4&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 4,
                    visuallyHiddenText: 'Page 4'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=5&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 5,
                    visuallyHiddenText: 'Page 5'
                  }
                ],
                next: {
                  href: '/system/bill-runs?page=4&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b'
                },
                previous: {
                  href: '/system/bill-runs?page=2&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b'
                }
              },
              currentPageNumber: selectedPage,
              numberOfPages: 5,
              showingMessage: 'Showing 50 of 225 notices'
            })
          })
        })

        describe('and the last page is selected', () => {
          beforeEach(() => {
            selectedPage = 5
          })

          it('returns <- Previous 1 2 3 4 [5]', () => {
            const result = PaginatorPresenter(numberOfRecords, selectedPage, path, currentAmount, message, queryArgs)

            expect(result).toEqual({
              component: {
                items: [
                  {
                    current: false,
                    href: '/system/bill-runs?page=1&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 1,
                    visuallyHiddenText: 'Page 1'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=2&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 2,
                    visuallyHiddenText: 'Page 2'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=3&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 3,
                    visuallyHiddenText: 'Page 3'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=4&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 4,
                    visuallyHiddenText: 'Page 4'
                  },
                  {
                    current: true,
                    href: '/system/bill-runs?page=5&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 5,
                    visuallyHiddenText: 'Page 5'
                  }
                ],
                previous: {
                  href: '/system/bill-runs?page=4&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b'
                }
              },
              currentPageNumber: selectedPage,
              numberOfPages: 5,
              showingMessage: 'Showing 50 of 225 notices'
            })
          })
        })
      })

      describe('for 6 pages', () => {
        beforeEach(() => {
          numberOfRecords = 275
        })

        describe('and the first page is selected', () => {
          beforeEach(() => {
            selectedPage = 1
          })

          it('returns [1] 2 3 4 5 6 Next ->', () => {
            const result = PaginatorPresenter(numberOfRecords, selectedPage, path, currentAmount, message, queryArgs)

            expect(result).toEqual({
              component: {
                items: [
                  {
                    current: true,
                    href: '/system/bill-runs?page=1&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 1,
                    visuallyHiddenText: 'Page 1'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=2&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 2,
                    visuallyHiddenText: 'Page 2'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=3&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 3,
                    visuallyHiddenText: 'Page 3'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=4&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 4,
                    visuallyHiddenText: 'Page 4'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=5&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 5,
                    visuallyHiddenText: 'Page 5'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=6&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 6,
                    visuallyHiddenText: 'Page 6'
                  }
                ],
                next: {
                  href: '/system/bill-runs?page=2&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b'
                }
              },
              currentPageNumber: selectedPage,
              numberOfPages: 6,
              showingMessage: 'Showing 50 of 275 notices'
            })
          })
        })

        describe('and page 3 is selected', () => {
          beforeEach(() => {
            selectedPage = 3
          })

          it('returns <- Previous 1 2 [3] 4 5 6 Next ->', () => {
            const result = PaginatorPresenter(numberOfRecords, selectedPage, path, currentAmount, message, queryArgs)

            expect(result).toEqual({
              component: {
                items: [
                  {
                    current: false,
                    href: '/system/bill-runs?page=1&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 1,
                    visuallyHiddenText: 'Page 1'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=2&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 2,
                    visuallyHiddenText: 'Page 2'
                  },
                  {
                    current: true,
                    href: '/system/bill-runs?page=3&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 3,
                    visuallyHiddenText: 'Page 3'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=4&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 4,
                    visuallyHiddenText: 'Page 4'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=5&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 5,
                    visuallyHiddenText: 'Page 5'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=6&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 6,
                    visuallyHiddenText: 'Page 6'
                  }
                ],
                next: {
                  href: '/system/bill-runs?page=4&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b'
                },
                previous: {
                  href: '/system/bill-runs?page=2&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b'
                }
              },
              currentPageNumber: selectedPage,
              numberOfPages: 6,
              showingMessage: 'Showing 50 of 275 notices'
            })
          })
        })

        describe('and the last page is selected', () => {
          beforeEach(() => {
            selectedPage = 6
          })

          it('returns <- Previous 1 2 3 4 5 [6]', () => {
            const result = PaginatorPresenter(numberOfRecords, selectedPage, path, currentAmount, message, queryArgs)

            expect(result).toEqual({
              component: {
                items: [
                  {
                    current: false,
                    href: '/system/bill-runs?page=1&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 1,
                    visuallyHiddenText: 'Page 1'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=2&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 2,
                    visuallyHiddenText: 'Page 2'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=3&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 3,
                    visuallyHiddenText: 'Page 3'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=4&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 4,
                    visuallyHiddenText: 'Page 4'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=5&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 5,
                    visuallyHiddenText: 'Page 5'
                  },
                  {
                    current: true,
                    href: '/system/bill-runs?page=6&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 6,
                    visuallyHiddenText: 'Page 6'
                  }
                ],
                previous: {
                  href: '/system/bill-runs?page=5&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b'
                }
              },
              currentPageNumber: selectedPage,
              numberOfPages: 6,
              showingMessage: 'Showing 50 of 275 notices'
            })
          })
        })
      })

      describe('for 7 pages', () => {
        beforeEach(() => {
          numberOfRecords = 325
        })

        describe('and the first page is selected', () => {
          beforeEach(() => {
            selectedPage = 1
          })

          it('returns [1] 2 3 4 5 6 7 Next ->', () => {
            const result = PaginatorPresenter(numberOfRecords, selectedPage, path, currentAmount, message, queryArgs)

            expect(result).toEqual({
              component: {
                items: [
                  {
                    current: true,
                    href: '/system/bill-runs?page=1&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 1,
                    visuallyHiddenText: 'Page 1'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=2&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 2,
                    visuallyHiddenText: 'Page 2'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=3&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 3,
                    visuallyHiddenText: 'Page 3'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=4&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 4,
                    visuallyHiddenText: 'Page 4'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=5&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 5,
                    visuallyHiddenText: 'Page 5'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=6&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 6,
                    visuallyHiddenText: 'Page 6'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=7&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 7,
                    visuallyHiddenText: 'Page 7'
                  }
                ],
                next: {
                  href: '/system/bill-runs?page=2&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b'
                }
              },
              currentPageNumber: selectedPage,
              numberOfPages: 7,
              showingMessage: 'Showing 50 of 325 notices'
            })
          })
        })

        describe('and page 4 is selected', () => {
          beforeEach(() => {
            selectedPage = 4
          })

          it('returns <- Previous 1 2 3 [4] 5 6 7 Next ->', () => {
            const result = PaginatorPresenter(numberOfRecords, selectedPage, path, currentAmount, message, queryArgs)

            expect(result).toEqual({
              component: {
                items: [
                  {
                    current: false,
                    href: '/system/bill-runs?page=1&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 1,
                    visuallyHiddenText: 'Page 1'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=2&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 2,
                    visuallyHiddenText: 'Page 2'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=3&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 3,
                    visuallyHiddenText: 'Page 3'
                  },
                  {
                    current: true,
                    href: '/system/bill-runs?page=4&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 4,
                    visuallyHiddenText: 'Page 4'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=5&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 5,
                    visuallyHiddenText: 'Page 5'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=6&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 6,
                    visuallyHiddenText: 'Page 6'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=7&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 7,
                    visuallyHiddenText: 'Page 7'
                  }
                ],
                next: {
                  href: '/system/bill-runs?page=5&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b'
                },
                previous: {
                  href: '/system/bill-runs?page=3&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b'
                }
              },
              currentPageNumber: selectedPage,
              numberOfPages: 7,
              showingMessage: 'Showing 50 of 325 notices'
            })
          })
        })

        describe('and the last page is selected', () => {
          beforeEach(() => {
            selectedPage = 7
          })

          it('returns <- Previous 1 2 3 4 5 6 [7]', () => {
            const result = PaginatorPresenter(numberOfRecords, selectedPage, path, currentAmount, message, queryArgs)

            expect(result).toEqual({
              component: {
                items: [
                  {
                    current: false,
                    href: '/system/bill-runs?page=1&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 1,
                    visuallyHiddenText: 'Page 1'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=2&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 2,
                    visuallyHiddenText: 'Page 2'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=3&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 3,
                    visuallyHiddenText: 'Page 3'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=4&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 4,
                    visuallyHiddenText: 'Page 4'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=5&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 5,
                    visuallyHiddenText: 'Page 5'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=6&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 6,
                    visuallyHiddenText: 'Page 6'
                  },
                  {
                    current: true,
                    href: '/system/bill-runs?page=7&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 7,
                    visuallyHiddenText: 'Page 7'
                  }
                ],
                previous: {
                  href: '/system/bill-runs?page=6&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b'
                }
              },
              currentPageNumber: selectedPage,
              numberOfPages: 7,
              showingMessage: 'Showing 50 of 325 notices'
            })
          })
        })
      })

      describe('for 8 pages', () => {
        beforeEach(() => {
          numberOfRecords = 375
        })

        describe('and the first page is selected', () => {
          beforeEach(() => {
            selectedPage = 1
          })

          it('returns [1] 2 3 4 5 .. 8 Next ->', () => {
            const result = PaginatorPresenter(numberOfRecords, selectedPage, path, currentAmount, message, queryArgs)

            expect(result).toEqual({
              component: {
                items: [
                  {
                    current: true,
                    href: '/system/bill-runs?page=1&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 1,
                    visuallyHiddenText: 'Page 1'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=2&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 2,
                    visuallyHiddenText: 'Page 2'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=3&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 3,
                    visuallyHiddenText: 'Page 3'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=4&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 4,
                    visuallyHiddenText: 'Page 4'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=5&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 5,
                    visuallyHiddenText: 'Page 5'
                  },
                  { ellipsis: true },
                  {
                    current: false,
                    href: '/system/bill-runs?page=8&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 8,
                    visuallyHiddenText: 'Page 8'
                  }
                ],
                next: {
                  href: '/system/bill-runs?page=2&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b'
                }
              },
              currentPageNumber: selectedPage,
              numberOfPages: 8,
              showingMessage: 'Showing 50 of 375 notices'
            })
          })
        })

        describe('and page 4 is selected', () => {
          beforeEach(() => {
            selectedPage = 4
          })

          it('returns <- Previous 1 2 3 [4] 5 .. 8 Next ->', () => {
            const result = PaginatorPresenter(numberOfRecords, selectedPage, path, currentAmount, message, queryArgs)

            expect(result).toEqual({
              component: {
                items: [
                  {
                    current: false,
                    href: '/system/bill-runs?page=1&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 1,
                    visuallyHiddenText: 'Page 1'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=2&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 2,
                    visuallyHiddenText: 'Page 2'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=3&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 3,
                    visuallyHiddenText: 'Page 3'
                  },
                  {
                    current: true,
                    href: '/system/bill-runs?page=4&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 4,
                    visuallyHiddenText: 'Page 4'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=5&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 5,
                    visuallyHiddenText: 'Page 5'
                  },
                  { ellipsis: true },
                  {
                    current: false,
                    href: '/system/bill-runs?page=8&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 8,
                    visuallyHiddenText: 'Page 8'
                  }
                ],
                next: {
                  href: '/system/bill-runs?page=5&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b'
                },
                previous: {
                  href: '/system/bill-runs?page=3&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b'
                }
              },
              currentPageNumber: selectedPage,
              numberOfPages: 8,
              showingMessage: 'Showing 50 of 375 notices'
            })
          })
        })

        describe('and page 5 is selected', () => {
          beforeEach(() => {
            selectedPage = 5
          })

          it('returns <- Previous 1 .. 4 [5] 6 7 8 Next ->', () => {
            const result = PaginatorPresenter(numberOfRecords, selectedPage, path, currentAmount, message, queryArgs)

            expect(result).toEqual({
              component: {
                items: [
                  {
                    current: false,
                    href: '/system/bill-runs?page=1&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 1,
                    visuallyHiddenText: 'Page 1'
                  },
                  { ellipsis: true },
                  {
                    current: false,
                    href: '/system/bill-runs?page=4&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 4,
                    visuallyHiddenText: 'Page 4'
                  },
                  {
                    current: true,
                    href: '/system/bill-runs?page=5&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 5,
                    visuallyHiddenText: 'Page 5'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=6&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 6,
                    visuallyHiddenText: 'Page 6'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=7&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 7,
                    visuallyHiddenText: 'Page 7'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=8&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 8,
                    visuallyHiddenText: 'Page 8'
                  }
                ],
                next: {
                  href: '/system/bill-runs?page=6&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b'
                },
                previous: {
                  href: '/system/bill-runs?page=4&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b'
                }
              },
              currentPageNumber: selectedPage,
              numberOfPages: 8,
              showingMessage: 'Showing 50 of 375 notices'
            })
          })
        })

        describe('and the last page is selected', () => {
          beforeEach(() => {
            selectedPage = 8
          })

          it('returns <- Previous 1 .. 4 5 6 7 [8]', () => {
            const result = PaginatorPresenter(numberOfRecords, selectedPage, path, currentAmount, message, queryArgs)

            expect(result).toEqual({
              component: {
                items: [
                  {
                    current: false,
                    href: '/system/bill-runs?page=1&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 1,
                    visuallyHiddenText: 'Page 1'
                  },
                  { ellipsis: true },
                  {
                    current: false,
                    href: '/system/bill-runs?page=4&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 4,
                    visuallyHiddenText: 'Page 4'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=5&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 5,
                    visuallyHiddenText: 'Page 5'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=6&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 6,
                    visuallyHiddenText: 'Page 6'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=7&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 7,
                    visuallyHiddenText: 'Page 7'
                  },
                  {
                    current: true,
                    href: '/system/bill-runs?page=8&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 8,
                    visuallyHiddenText: 'Page 8'
                  }
                ],
                previous: {
                  href: '/system/bill-runs?page=7&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b'
                }
              },
              currentPageNumber: selectedPage,
              numberOfPages: 8,
              showingMessage: 'Showing 50 of 375 notices'
            })
          })
        })
      })

      describe('for 9 pages', () => {
        beforeEach(() => {
          numberOfRecords = 425
        })

        describe('and the first page is selected', () => {
          beforeEach(() => {
            selectedPage = 1
          })

          it('returns [1] 2 3 4 5 .. 9 Next ->', () => {
            const result = PaginatorPresenter(numberOfRecords, selectedPage, path, currentAmount, message, queryArgs)

            expect(result).toEqual({
              component: {
                items: [
                  {
                    current: true,
                    href: '/system/bill-runs?page=1&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 1,
                    visuallyHiddenText: 'Page 1'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=2&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 2,
                    visuallyHiddenText: 'Page 2'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=3&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 3,
                    visuallyHiddenText: 'Page 3'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=4&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 4,
                    visuallyHiddenText: 'Page 4'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=5&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 5,
                    visuallyHiddenText: 'Page 5'
                  },
                  { ellipsis: true },
                  {
                    current: false,
                    href: '/system/bill-runs?page=9&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 9,
                    visuallyHiddenText: 'Page 9'
                  }
                ],
                next: {
                  href: '/system/bill-runs?page=2&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b'
                }
              },
              currentPageNumber: selectedPage,
              numberOfPages: 9,
              showingMessage: 'Showing 50 of 425 notices'
            })
          })
        })

        describe('and page 4 is selected', () => {
          beforeEach(() => {
            selectedPage = 4
          })

          it('returns <- Previous 1 2 3 [4] 5 .. 9 Next ->', () => {
            const result = PaginatorPresenter(numberOfRecords, selectedPage, path, currentAmount, message, queryArgs)

            expect(result).toEqual({
              component: {
                items: [
                  {
                    current: false,
                    href: '/system/bill-runs?page=1&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 1,
                    visuallyHiddenText: 'Page 1'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=2&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 2,
                    visuallyHiddenText: 'Page 2'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=3&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 3,
                    visuallyHiddenText: 'Page 3'
                  },
                  {
                    current: true,
                    href: '/system/bill-runs?page=4&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 4,
                    visuallyHiddenText: 'Page 4'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=5&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 5,
                    visuallyHiddenText: 'Page 5'
                  },
                  { ellipsis: true },
                  {
                    current: false,
                    href: '/system/bill-runs?page=9&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 9,
                    visuallyHiddenText: 'Page 9'
                  }
                ],
                next: {
                  href: '/system/bill-runs?page=5&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b'
                },
                previous: {
                  href: '/system/bill-runs?page=3&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b'
                }
              },
              currentPageNumber: selectedPage,
              numberOfPages: 9,
              showingMessage: 'Showing 50 of 425 notices'
            })
          })
        })

        describe('and page 5 is selected', () => {
          beforeEach(() => {
            selectedPage = 5
          })

          it('returns <- Previous 1 .. 4 [5] 6 .. 9 Next ->', () => {
            const result = PaginatorPresenter(numberOfRecords, selectedPage, path, currentAmount, message, queryArgs)

            expect(result).toEqual({
              component: {
                items: [
                  {
                    current: false,
                    href: '/system/bill-runs?page=1&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 1,
                    visuallyHiddenText: 'Page 1'
                  },
                  { ellipsis: true },
                  {
                    current: false,
                    href: '/system/bill-runs?page=4&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 4,
                    visuallyHiddenText: 'Page 4'
                  },
                  {
                    current: true,
                    href: '/system/bill-runs?page=5&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 5,
                    visuallyHiddenText: 'Page 5'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=6&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 6,
                    visuallyHiddenText: 'Page 6'
                  },
                  { ellipsis: true },
                  {
                    current: false,
                    href: '/system/bill-runs?page=9&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 9,
                    visuallyHiddenText: 'Page 9'
                  }
                ],
                next: {
                  href: '/system/bill-runs?page=6&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b'
                },
                previous: {
                  href: '/system/bill-runs?page=4&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b'
                }
              },
              currentPageNumber: selectedPage,
              numberOfPages: 9,
              showingMessage: 'Showing 50 of 425 notices'
            })
          })
        })

        describe('and page 6 is selected', () => {
          beforeEach(() => {
            selectedPage = 6
          })

          it('returns <- Previous 1 .. 5 [6] 7 8 9 Next ->', () => {
            const result = PaginatorPresenter(numberOfRecords, selectedPage, path, currentAmount, message, queryArgs)

            expect(result).toEqual({
              component: {
                items: [
                  {
                    current: false,
                    href: '/system/bill-runs?page=1&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 1,
                    visuallyHiddenText: 'Page 1'
                  },
                  { ellipsis: true },
                  {
                    current: false,
                    href: '/system/bill-runs?page=5&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 5,
                    visuallyHiddenText: 'Page 5'
                  },
                  {
                    current: true,
                    href: '/system/bill-runs?page=6&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 6,
                    visuallyHiddenText: 'Page 6'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=7&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 7,
                    visuallyHiddenText: 'Page 7'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=8&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 8,
                    visuallyHiddenText: 'Page 8'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=9&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 9,
                    visuallyHiddenText: 'Page 9'
                  }
                ],
                next: {
                  href: '/system/bill-runs?page=7&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b'
                },
                previous: {
                  href: '/system/bill-runs?page=5&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b'
                }
              },
              currentPageNumber: selectedPage,
              numberOfPages: 9,
              showingMessage: 'Showing 50 of 425 notices'
            })
          })
        })

        describe('and the last page is selected', () => {
          beforeEach(() => {
            selectedPage = 9
          })

          it('returns <- Previous 1 .. 5 6 7 8 [9]', () => {
            const result = PaginatorPresenter(numberOfRecords, selectedPage, path, currentAmount, message, queryArgs)

            expect(result).toEqual({
              component: {
                items: [
                  {
                    current: false,
                    href: '/system/bill-runs?page=1&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 1,
                    visuallyHiddenText: 'Page 1'
                  },
                  { ellipsis: true },
                  {
                    current: false,
                    href: '/system/bill-runs?page=5&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 5,
                    visuallyHiddenText: 'Page 5'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=6&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 6,
                    visuallyHiddenText: 'Page 6'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=7&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 7,
                    visuallyHiddenText: 'Page 7'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=8&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 8,
                    visuallyHiddenText: 'Page 8'
                  },
                  {
                    current: true,
                    href: '/system/bill-runs?page=9&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 9,
                    visuallyHiddenText: 'Page 9'
                  }
                ],
                previous: {
                  href: '/system/bill-runs?page=8&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b'
                }
              },
              currentPageNumber: selectedPage,
              numberOfPages: 9,
              showingMessage: 'Showing 50 of 425 notices'
            })
          })
        })
      })

      describe('for 100 pages', () => {
        beforeEach(() => {
          numberOfRecords = 4975
        })

        describe('and the first page is selected', () => {
          beforeEach(() => {
            selectedPage = 1
          })

          it('returns [1] 2 3 4 5 .. 100 Next ->', () => {
            const result = PaginatorPresenter(numberOfRecords, selectedPage, path, currentAmount, message, queryArgs)

            expect(result).toEqual({
              component: {
                items: [
                  {
                    current: true,
                    href: '/system/bill-runs?page=1&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 1,
                    visuallyHiddenText: 'Page 1'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=2&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 2,
                    visuallyHiddenText: 'Page 2'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=3&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 3,
                    visuallyHiddenText: 'Page 3'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=4&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 4,
                    visuallyHiddenText: 'Page 4'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=5&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 5,
                    visuallyHiddenText: 'Page 5'
                  },
                  { ellipsis: true },
                  {
                    current: false,
                    href: '/system/bill-runs?page=100&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 100,
                    visuallyHiddenText: 'Page 100'
                  }
                ],
                next: {
                  href: '/system/bill-runs?page=2&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b'
                }
              },
              currentPageNumber: selectedPage,
              numberOfPages: 100,
              showingMessage: 'Showing 50 of 4975 notices'
            })
          })
        })

        describe('and page 4 is selected', () => {
          beforeEach(() => {
            selectedPage = 4
          })

          it('returns <- Previous 1 2 3 [4] 5 .. 100 Next ->', () => {
            const result = PaginatorPresenter(numberOfRecords, selectedPage, path, currentAmount, message, queryArgs)

            expect(result).toEqual({
              component: {
                items: [
                  {
                    current: false,
                    href: '/system/bill-runs?page=1&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 1,
                    visuallyHiddenText: 'Page 1'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=2&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 2,
                    visuallyHiddenText: 'Page 2'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=3&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 3,
                    visuallyHiddenText: 'Page 3'
                  },
                  {
                    current: true,
                    href: '/system/bill-runs?page=4&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 4,
                    visuallyHiddenText: 'Page 4'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=5&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 5,
                    visuallyHiddenText: 'Page 5'
                  },
                  { ellipsis: true },
                  {
                    current: false,
                    href: '/system/bill-runs?page=100&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 100,
                    visuallyHiddenText: 'Page 100'
                  }
                ],
                next: {
                  href: '/system/bill-runs?page=5&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b'
                },
                previous: {
                  href: '/system/bill-runs?page=3&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b'
                }
              },
              currentPageNumber: selectedPage,
              numberOfPages: 100,
              showingMessage: 'Showing 50 of 4975 notices'
            })
          })
        })

        describe('and page 49 is selected', () => {
          beforeEach(() => {
            selectedPage = 49
          })

          it('returns <- Previous 1 .. 48 [49] 50 .. 100 Next ->', () => {
            const result = PaginatorPresenter(numberOfRecords, selectedPage, path, currentAmount, message, queryArgs)

            expect(result).toEqual({
              component: {
                items: [
                  {
                    current: false,
                    href: '/system/bill-runs?page=1&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 1,
                    visuallyHiddenText: 'Page 1'
                  },
                  { ellipsis: true },
                  {
                    current: false,
                    href: '/system/bill-runs?page=48&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 48,
                    visuallyHiddenText: 'Page 48'
                  },
                  {
                    current: true,
                    href: '/system/bill-runs?page=49&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 49,
                    visuallyHiddenText: 'Page 49'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=50&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 50,
                    visuallyHiddenText: 'Page 50'
                  },
                  { ellipsis: true },
                  {
                    current: false,
                    href: '/system/bill-runs?page=100&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 100,
                    visuallyHiddenText: 'Page 100'
                  }
                ],
                next: {
                  href: '/system/bill-runs?page=50&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b'
                },
                previous: {
                  href: '/system/bill-runs?page=48&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b'
                }
              },
              currentPageNumber: selectedPage,
              numberOfPages: 100,
              showingMessage: 'Showing 50 of 4975 notices'
            })
          })
        })

        describe('and page 97 is selected', () => {
          beforeEach(() => {
            selectedPage = 97
          })

          it('returns <- Previous 1 .. 96 [97] 98 99 100 Next ->', () => {
            const result = PaginatorPresenter(numberOfRecords, selectedPage, path, currentAmount, message, queryArgs)

            expect(result).toEqual({
              component: {
                items: [
                  {
                    current: false,
                    href: '/system/bill-runs?page=1&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 1,
                    visuallyHiddenText: 'Page 1'
                  },
                  { ellipsis: true },
                  {
                    current: false,
                    href: '/system/bill-runs?page=96&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 96,
                    visuallyHiddenText: 'Page 96'
                  },
                  {
                    current: true,
                    href: '/system/bill-runs?page=97&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 97,
                    visuallyHiddenText: 'Page 97'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=98&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 98,
                    visuallyHiddenText: 'Page 98'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=99&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 99,
                    visuallyHiddenText: 'Page 99'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=100&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 100,
                    visuallyHiddenText: 'Page 100'
                  }
                ],
                next: {
                  href: '/system/bill-runs?page=98&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b'
                },
                previous: {
                  href: '/system/bill-runs?page=96&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b'
                }
              },
              currentPageNumber: selectedPage,
              numberOfPages: 100,
              showingMessage: 'Showing 50 of 4975 notices'
            })
          })
        })

        describe('and the last page is selected', () => {
          beforeEach(() => {
            selectedPage = 100
          })

          it('returns <- Previous 1 .. 96 97 98 99 [100]', () => {
            const result = PaginatorPresenter(numberOfRecords, selectedPage, path, currentAmount, message, queryArgs)

            expect(result).toEqual({
              component: {
                items: [
                  {
                    current: false,
                    href: '/system/bill-runs?page=1&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 1,
                    visuallyHiddenText: 'Page 1'
                  },
                  { ellipsis: true },
                  {
                    current: false,
                    href: '/system/bill-runs?page=96&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 96,
                    visuallyHiddenText: 'Page 96'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=97&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 97,
                    visuallyHiddenText: 'Page 97'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=98&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 98,
                    visuallyHiddenText: 'Page 98'
                  },
                  {
                    current: false,
                    href: '/system/bill-runs?page=99&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 99,
                    visuallyHiddenText: 'Page 99'
                  },
                  {
                    current: true,
                    href: '/system/bill-runs?page=100&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b',
                    number: 100,
                    visuallyHiddenText: 'Page 100'
                  }
                ],
                previous: {
                  href: '/system/bill-runs?page=99&billing-account-id=c17c0a2b-6950-490b-8c3a-4dc9f01da368&licence-id=354fc0bd-0820-4611-a6af-874480bbae3b'
                }
              },
              currentPageNumber: selectedPage,
              numberOfPages: 100,
              showingMessage: 'Showing 50 of 4975 notices'
            })
          })
        })
      })
    })
  })
})
