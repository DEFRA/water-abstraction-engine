// Test framework
import { beforeEach, describe, expect, it } from 'vitest'

// Test helpers
import GlobalNotifierLib from '../../src/lib/global-notifier.lib.js'

// For running our service
import { init } from '../support/test-server.js'

describe('Global Notifier Plugin', () => {
  beforeEach(async () => {
    // Create server before each test
    await init()
  })

  describe('Global Notifier Plugin', () => {
    describe('when the server is initialised', () => {
      it('makes an instance of GlobalNotifierLib available globally', async () => {
        const result = globalThis.GlobalNotifier

        expect(result).toBeInstanceOf(GlobalNotifierLib)
      })
    })
  })
})
