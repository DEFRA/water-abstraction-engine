/**
 * The templates for each file the scaffold CLI generates, and the controller and route snippet it prints
 *
 * Each template is a plain function that takes the module descriptors built in scaffold.js and returns the content.
 *
 * @module TemplatesLib
 */

import { posix } from 'node:path'

/**
 * Generate the source of the presenter for a page
 *
 * @param {object} modules - the module descriptors built in scaffold.js
 *
 * @returns {string} the source of the presenter
 */
export function presenterTemplate(modules) {
  const { presenter } = modules

  return `/**
 * Formats data for the '' page
 * @module ${presenter.moduleName}
 */

/**
 * Formats data for the '' page
 *
 * @param {module:SessionModel} session - The session instance
 *
 * @returns {object} The data formatted for the view template
 */
export default function ${presenter.functionName}(session) {
  return {
    backLink: {
      href: '',
      text: 'Back'
    },
    pageTitle: ''
  }
}
`
}

/**
 * Generate the test file for the presenter for a page
 *
 * @param {object} modules - the module descriptors built in scaffold.js
 *
 * @returns {string} the source of the test file
 */
export function presenterTestTemplate(modules) {
  const { presenter } = modules

  return `// Test framework
import { beforeEach, describe, expect, it } from 'vitest'

// Thing under test
import ${presenter.moduleName} from '${presenter.testImportPath}'

describe('${presenter.describeLabel}', () => {
  let session

  beforeEach(() => {
    session = {}
  })

  describe('when called', () => {
    it('returns page data for the view', () => {
      const result = ${presenter.moduleName}(session)

      expect(result).toEqual({
        backLink: {
          href: '',
          text: 'Back'
        },
        pageTitle: ''
      })
    })
  })
})
`
}

/**
 * Generate the source of the service that fetches and presents the data for a page
 *
 * @param {object} modules - the module descriptors built in scaffold.js
 *
 * @returns {string} the source of the view service
 */
export function viewServiceTemplate(modules) {
  const { presenter, viewService } = modules

  return `/**
 * Orchestrates fetching and presenting the data for the '' page
 *
 * @module ${viewService.moduleName}
 */

import FetchSessionDal from 'water-abstraction-engine/dal/fetch-session.dal.js'

import ${presenter.moduleName} from '${presenter.srcImportPath}'

/**
 * Orchestrates fetching and presenting the data for the '' page
 *
 * @param {string} sessionId - The UUID of the current session
 *
 * @returns {Promise<object>} The data formatted for the view template
 */
export default async function ${viewService.functionName}(sessionId) {
  const session = await FetchSessionDal(sessionId)

  const pageData = ${presenter.moduleName}(session)

  return {
    ...pageData
  }
}
`
}

/**
 * Generate the test file for the service that fetches and presents the data for a page
 *
 * @param {object} modules - the module descriptors built in scaffold.js
 *
 * @returns {string} the source of the test file
 */
export function viewServiceTestTemplate(modules) {
  const { viewService } = modules

  return `// Test framework
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Test helpers
import SessionModelStub from 'water-abstraction-engine/test/stubs/session.stub.js'

// Things we need to stub
import * as FetchSessionDal from 'water-abstraction-engine/dal/fetch-session.dal.js'

// Thing under test
import ${viewService.moduleName} from '${viewService.testImportPath}'

describe('${viewService.describeLabel}', () => {
  let session
  let sessionData

  beforeEach(() => {
    sessionData = {}

    session = SessionModelStub(sessionData)

    vi.spyOn(FetchSessionDal, 'default').mockResolvedValue(session)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('when called', () => {
    it('returns page data for the view', async () => {
      const result = await ${viewService.moduleName}(session.id)

      expect(result).toEqual({
        backLink: {
          href: '',
          text: 'Back'
        },
        pageTitle: ''
      })
    })
  })
})
`
}

/**
 * Generate the source of the service that validates and saves the data submitted from a page
 *
 * @param {object} modules - the module descriptors built in scaffold.js
 *
 * @returns {string} the source of the submit service
 */
export function submitServiceTemplate(modules) {
  const { presenter, submitService, validator } = modules

  return `/**
 * Orchestrates validating the data for the '' page
 *
 * @module ${submitService.moduleName}
 */

import FetchSessionDal from 'water-abstraction-engine/dal/fetch-session.dal.js'
import { formatValidationResult } from 'water-abstraction-engine/presenters/base.presenter.js'

import ${presenter.moduleName} from '${presenter.srcImportPath}'
import ${validator.moduleName} from '${validator.srcImportPath}'

/**
 * Orchestrates validating the data for the '' page
 *
 * @param {string} sessionId - The UUID of the current session
 * @param {object} payload - The submitted form data
 *
 * @returns {Promise<object>} An empty object when the data is valid, else the page data with the validation errors
 */
export default async function ${submitService.functionName}(sessionId, payload) {
  const session = await FetchSessionDal(sessionId)

  const validationResult = _validate(payload)

  if (!validationResult) {
    await _save(session, payload)

    return {}
  }

  const pageData = ${presenter.moduleName}(session)

  return {
    error: validationResult,
    ...pageData
  }
}

async function _save(session, payload) {
  return session.$update()
}

function _validate(payload) {
  const validationResult = ${validator.moduleName}(payload)

  return formatValidationResult(validationResult)
}
`
}

/**
 * Generate the test file for the service that validates and saves the data submitted from a page
 *
 * @param {object} modules - the module descriptors built in scaffold.js
 *
 * @returns {string} the source of the test file
 */
export function submitServiceTestTemplate(modules) {
  const { submitService } = modules

  return `// Test framework
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Test helpers
import SessionModelStub from 'water-abstraction-engine/test/stubs/session.stub.js'

// Things we need to stub
import * as FetchSessionDal from 'water-abstraction-engine/dal/fetch-session.dal.js'

// Thing under test
import ${submitService.moduleName} from '${submitService.testImportPath}'

describe('${submitService.describeLabel}', () => {
  let payload
  let session
  let sessionData

  beforeEach(() => {
    payload = { placeholder: 'change me' }
    sessionData = {}

    session = SessionModelStub(sessionData)

    vi.spyOn(FetchSessionDal, 'default').mockResolvedValue(session)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('when called', () => {
    it('saves the submitted value', async () => {
      await ${submitService.moduleName}(session.id, payload)

      expect(session.$update).toHaveBeenCalled()
    })

    it('continues the journey', async () => {
      const result = await ${submitService.moduleName}(session.id, payload)

      expect(result).toEqual({})
    })
  })

  describe('when validation fails', () => {
    beforeEach(() => {
      payload = {}
    })

    it('returns page data for the view, with errors', async () => {
      const result = await ${submitService.moduleName}(session.id, payload)

      expect(result).toEqual({
        backLink: {
          href: '',
          text: 'Back'
        },
        error: {
          errorList: [
            {
              href: '#placeholder',
              text: '"placeholder" is required'
            }
          ],
          placeholder: {
            text: '"placeholder" is required'
          }
        },
        pageTitle: ''
      })
    })
  })
})
`
}

/**
 * Generate the source of the validator for the data submitted from a page
 *
 * @param {object} modules - the module descriptors built in scaffold.js
 *
 * @returns {string} the source of the validator
 */
export function validatorTemplate(modules) {
  const { validator } = modules

  return `/**
 * Validates data submitted for the '' page
 *
 * @module ${validator.moduleName}
 */

import Joi from 'joi'

/**
 * Validates data submitted for the '' page
 *
 * @param {object} payload - The payload from the request to be validated
 *
 * @returns {object} the result from calling Joi's schema.validate(). It will be an object with a \`value:\` property. If
 * any errors are found the \`error:\` property will also exist detailing what the issues were
 */
export default function ${validator.functionName}(payload) {
  const schema = Joi.object({
    placeholder: Joi.required()
  })

  return schema.validate(payload, { abortEarly: false })
}
`
}

/**
 * Generate the test file for the validator for the data submitted from a page
 *
 * @param {object} modules - the module descriptors built in scaffold.js
 *
 * @returns {string} the source of the test file
 */
export function validatorTestTemplate(modules) {
  const { validator } = modules

  return `// Test framework
import { beforeEach, describe, expect, it } from 'vitest'

// Thing under test
import ${validator.moduleName} from '${validator.testImportPath}'

describe('${validator.describeLabel}', () => {
  let payload

  beforeEach(() => {
    payload = { placeholder: '' }
  })

  describe('when called with valid data', () => {
    it('returns with no errors', () => {
      const result = ${validator.moduleName}(payload)

      expect(result.value).toBeDefined()
      expect(result.error).toBeUndefined()
    })
  })

  describe('when called with invalid data', () => {
    beforeEach(() => {
      payload = {}
    })

    it('returns with errors', () => {
      const result = ${validator.moduleName}(payload)

      expect(result.value).toBeDefined()
      expect(result.error).toBeDefined()
      expect(result.error.details[0].message).toEqual('"placeholder" is required')
    })
  })
})
`
}

/**
 * Generate the Nunjucks view template for a page
 *
 * @returns {string} the source of the view template
 */
export function viewTemplate() {
  return `{% extends 'layout.njk' %}

{% from "govuk/components/button/macro.njk" import govukButton %}

{% block pageContent %}
  <form method="post">
    <input type="hidden" name="wrlsCrumb" value="{{wrlsCrumb}}"/>

    {{ govukButton({ text: "Continue", preventDoubleClick: true }) }}
  </form>
{% endblock %}
`
}

/**
 * Generate the controller and route code needed to wire up the scaffolded services
 *
 * Only the handlers and routes for the services in the journey are included. The snippet is printed for the user to
 * paste into the right controller and routes files, rather than written to disk.
 *
 * @param {object} modules - the module descriptors built in scaffold.js
 * @param {string[]} keys - the modules in the journey, for example `['submitService', 'validator']`
 *
 * @returns {string} the controller and route code
 */
export function snippetTemplate(modules, keys) {
  const { names, submitService, view, viewService } = modules
  const routePath = `/${posix.join(names.dir, '{sessionId}', names.name)}`

  const handlers = []
  const imports = []
  const routes = []

  if (keys.includes('viewService')) {
    const handlerName = `view${names.pascalName}`

    imports.push(`import ${viewService.moduleName} from '${viewService.controllerImportPath}'`)
    handlers.push(`export async function ${handlerName}(request, h) {
  const { sessionId } = request.params

  const pageData = await ${viewService.moduleName}(sessionId)

  return h.view('${view.viewPath}', pageData)
}`)
    routes.push(_route('GET', handlerName, routePath))
  }

  if (keys.includes('submitService')) {
    const handlerName = `submit${names.pascalName}`

    imports.push(`import ${submitService.moduleName} from '${submitService.controllerImportPath}'`)
    handlers.push(`export async function ${handlerName}(request, h) {
  const {
    payload,
    params: { sessionId }
  } = request

  const pageData = await ${submitService.moduleName}(sessionId, payload)

  if (pageData.error) {
    return h.view('${view.viewPath}', pageData)
  }

  return h.redirect('')
}`)
    routes.push(_route('POST', handlerName, routePath))
  }

  return `// Controller code
${imports.sort().join('\n')}

${handlers.join('\n\n')}

// Route code
${routes.join(',\n')}`
}

function _route(method, handlerName, routePath) {
  return `{
  method: '${method}',
  options: {
    auth: {
      access: {
        scope: ['']
      }
    },
    handler: ${handlerName}
  },
  path: '${routePath}'
}`
}
