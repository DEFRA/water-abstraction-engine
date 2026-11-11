// Test framework
import { describe, expect, it } from 'vitest'

// Thing under test
import PayloadCleaningService from '../../../src/services/plugins/payload-cleaning.service.js'

describe('Plugins - Payload Cleaning Service', () => {
  describe('when an object contains values with extra whitespace', () => {
    it('can remove them from simple objects', () => {
      const dirtyObject = {
        customerName: 'Bert & Ernie  ',
        reference: 'BESESAME001'
      }

      const cleanedObject = PayloadCleaningService(dirtyObject)

      expect(cleanedObject.customerName).toEqual('Bert & Ernie')
    })

    it('can remove them from nested objects', () => {
      const dirtyObject = {
        details: {
          firstName: ' Bert',
          lastName: ' Ernie '
        },
        reference: 'BESESAME001'
      }

      const cleanedObject = PayloadCleaningService(dirtyObject)

      expect(cleanedObject.details.firstName).toEqual('Bert')

      expect(cleanedObject.details.lastName).toEqual('Ernie')
    })

    it('can remove them from arrays', () => {
      const dirtyObject = {
        codes: [' ABD1 ', 'B1 ', ' C2'],
        reference: 'BESESAME001'
      }

      const cleanedObject = PayloadCleaningService(dirtyObject)

      expect(cleanedObject.codes).toEqual(['ABD1', 'B1', 'C2'])
    })

    it('can remove them from objects in arrays', () => {
      const dirtyObject = {
        contacts: [
          { firstName: ' Bert', lastName: ' Ernie ' },
          { firstName: 'Big', lastName: 'Bird' }
        ],
        reference: 'BESESAME001'
      }

      const cleanedObject = PayloadCleaningService(dirtyObject)

      expect(cleanedObject.contacts[0].firstName).toEqual('Bert')
      expect(cleanedObject.contacts[0].lastName).toEqual('Ernie')
    })
  })

  describe('when an object contains values which are just whitespace', () => {
    it('removes them from simple objects', () => {
      const dirtyObject = {
        customerName: ' ',
        reference: 'BESESAME001'
      }

      const cleanedObject = PayloadCleaningService(dirtyObject)

      expect(cleanedObject).not.toHaveProperty('customerName')
    })

    it('removes them from nested objects', () => {
      const dirtyObject = {
        details: {
          firstName: ' ',
          lastName: 'Ernie'
        },
        reference: 'BESESAME001'
      }

      const cleanedObject = PayloadCleaningService(dirtyObject)

      expect(cleanedObject.details).not.toHaveProperty('firstName')
      expect(cleanedObject.details).toHaveProperty('lastName')
    })

    it('removes them from arrays', () => {
      const dirtyObject = {
        codes: [' ABD1 ', ' ', 'C2'],
        reference: 'BESESAME001'
      }

      const cleanedObject = PayloadCleaningService(dirtyObject)

      expect(cleanedObject.codes).toEqual(['ABD1', 'C2'])
    })

    it('removes them from objects in arrays', () => {
      const dirtyObject = {
        contacts: [
          { firstName: 'Bert', lastName: ' ' },
          { firstName: 'Big', lastName: 'Bird' }
        ],
        reference: 'BESESAME001'
      }

      const cleanedObject = PayloadCleaningService(dirtyObject)

      expect(cleanedObject.contacts[0]).toHaveProperty('firstName')
      expect(cleanedObject.contacts[0]).not.toHaveProperty('lastName')
    })
  })

  describe('when an object contains values which are empty', () => {
    it('removes them from simple objects', () => {
      const dirtyObject = {
        customerName: '',
        reference: 'BESESAME001'
      }

      const cleanedObject = PayloadCleaningService(dirtyObject)

      expect(cleanedObject).not.toHaveProperty('customerName')
    })

    it('removes them from nested objects', () => {
      const dirtyObject = {
        details: {
          firstName: '',
          lastName: 'Ernie'
        },
        reference: 'BESESAME001'
      }

      const cleanedObject = PayloadCleaningService(dirtyObject)

      expect(cleanedObject.details).not.toHaveProperty('firstName')
      expect(cleanedObject.details).toHaveProperty('lastName')
    })

    it('removes them from arrays', () => {
      const dirtyObject = {
        codes: [' ABD1 ', '', 'C2'],
        reference: 'BESESAME001'
      }

      const cleanedObject = PayloadCleaningService(dirtyObject)

      expect(cleanedObject.codes).toEqual(['ABD1', 'C2'])
    })

    it('removes them from objects in arrays', () => {
      const dirtyObject = {
        contacts: [
          { firstName: 'Bert', lastName: '' },
          { firstName: 'Big', lastName: 'Bird' }
        ],
        reference: 'BESESAME001'
      }

      const cleanedObject = PayloadCleaningService(dirtyObject)

      expect(cleanedObject.contacts[0]).toHaveProperty('firstName')
      expect(cleanedObject.contacts[0]).not.toHaveProperty('lastName')
    })
  })

  describe('when an object contains null values', () => {
    it('removes them from simple objects', () => {
      const dirtyObject = {
        customerName: null,
        reference: 'BESESAME001'
      }

      const cleanedObject = PayloadCleaningService(dirtyObject)

      expect(cleanedObject).not.toHaveProperty('customerName')
    })

    it('removes them from nested objects', () => {
      const dirtyObject = {
        details: {
          firstName: null,
          lastName: 'Ernie'
        },
        reference: 'BESESAME001'
      }

      const cleanedObject = PayloadCleaningService(dirtyObject)

      expect(cleanedObject.details).not.toHaveProperty('firstName')
      expect(cleanedObject.details).toHaveProperty('lastName')
    })

    it('removes them from arrays', () => {
      const dirtyObject = {
        codes: [' ABD1 ', null, 'C2'],
        reference: 'BESESAME001'
      }

      const cleanedObject = PayloadCleaningService(dirtyObject)

      expect(cleanedObject.codes).toEqual(['ABD1', 'C2'])
    })

    it('removes them from objects in arrays', () => {
      const dirtyObject = {
        contacts: [
          { firstName: 'Bert', lastName: null },
          { firstName: 'Big', lastName: 'Bird' }
        ],
        reference: 'BESESAME001'
      }

      const cleanedObject = PayloadCleaningService(dirtyObject)

      expect(cleanedObject.contacts[0]).toHaveProperty('firstName')
      expect(cleanedObject.contacts[0]).not.toHaveProperty('lastName')
    })
  })

  describe('when an object contains boolean values', () => {
    it('leaves them untouched in simple objects', () => {
      const dirtyObject = {
        existingCustomer: true,
        hasOrders: false,
        reference: 'BESESAME001'
      }

      const cleanedObject = PayloadCleaningService(dirtyObject)

      expect(cleanedObject).toEqual(dirtyObject)
    })

    it('leaves them untouched in nested objects', () => {
      const dirtyObject = {
        orderStatus: {
          packed: true,
          shipped: false
        },
        reference: 'BESESAME001'
      }

      const cleanedObject = PayloadCleaningService(dirtyObject)

      expect(cleanedObject).toEqual(dirtyObject)
    })

    it('leaves them untouched in arrays', () => {
      const dirtyObject = {
        preferences: [true, false, true],
        reference: 'BESESAME001'
      }

      const cleanedObject = PayloadCleaningService(dirtyObject)

      expect(cleanedObject).toEqual(dirtyObject)
    })
  })

  describe('when an object contains number values', () => {
    it('leaves them untouched in simple objects', () => {
      const dirtyObject = {
        lines: 5,
        reference: 'BESESAME001',
        value: 120.3
      }

      const cleanedObject = PayloadCleaningService(dirtyObject)

      expect(cleanedObject).toEqual(dirtyObject)
    })

    it('leaves them untouched in nested objects', () => {
      const dirtyObject = {
        orderDetails: {
          lines: 6,
          value: 121.33
        },
        reference: 'BESESAME001'
      }

      const cleanedObject = PayloadCleaningService(dirtyObject)

      expect(cleanedObject).toEqual(dirtyObject)
    })

    it('leaves them untouched in arrays', () => {
      const dirtyObject = {
        lineValues: [10.0, 11.54, 2.99],
        reference: 'BESESAME001'
      }

      const cleanedObject = PayloadCleaningService(dirtyObject)

      expect(cleanedObject).toEqual(dirtyObject)
    })
  })

  describe('when an object has values that contain characters like &, <, and >', () => {
    it('leaves them untouched in simple objects', () => {
      const dirtyObject = {
        customerName: 'Bert< & >Ernie',
        reference: 'BESESAME001'
      }

      const cleanedObject = PayloadCleaningService(dirtyObject)

      expect(cleanedObject).toEqual(dirtyObject)
    })

    it('leaves them untouched in nested objects', () => {
      const dirtyObject = {
        details: {
          firstName: 'Bert <',
          lastName: '>Ernie<'
        },
        reference: 'BESESAME001'
      }

      const cleanedObject = PayloadCleaningService(dirtyObject)

      expect(cleanedObject).toEqual(dirtyObject)
    })

    it('leaves them untouched in arrays', () => {
      const dirtyObject = {
        codes: ['A1&', 'B2<', 'C3>'],
        reference: 'BESESAME001'
      }

      const cleanedObject = PayloadCleaningService(dirtyObject)

      expect(cleanedObject).toEqual(dirtyObject)
    })
  })

  describe('when an object contains dangerous content', () => {
    it('removes it from simple objects', () => {
      const dirtyObject = {
        customerName: '<script>alert(1)</script>',
        reference: 'BESESAME001'
      }

      const cleanedObject = PayloadCleaningService(dirtyObject)

      expect(cleanedObject).not.toHaveProperty('customerName')
    })

    it('removes it from nested objects', () => {
      const dirtyObject = {
        details: {
          firstName: '<script>alert(1)</script>',
          lastName: 'Ernie'
        },
        reference: 'BESESAME001'
      }

      const cleanedObject = PayloadCleaningService(dirtyObject)

      expect(cleanedObject.details).not.toHaveProperty('firstName')
      expect(cleanedObject.details).toHaveProperty('lastName')
    })

    it('removes it from arrays', () => {
      const dirtyObject = {
        codes: ['ABD1', '<script>alert(1)</script>', 'C2'],
        reference: 'BESESAME001'
      }

      const cleanedObject = PayloadCleaningService(dirtyObject)

      expect(cleanedObject.codes).toEqual(['ABD1', 'C2'])
    })
  })
})
