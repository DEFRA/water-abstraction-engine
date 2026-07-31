// Test framework
import { describe, expect, it } from 'vitest'

// Thing under test
import FetchAppInfoService from '../../../src/services/health/fetch-app-info.service.js'

describe('Health - Fetch App Info service', () => {
  const appName = 'engine'

  it("returns the app's version and commit hash", async () => {
    const result = await FetchAppInfoService(appName)

    expect(result.name).toEqual('Engine')
    expect(result.serviceName).toEqual('engine')
    expect(result.version).toBeDefined()
    expect(result.commit).toBeDefined()
  })
})
