// Test framework
import { describe, it } from 'vitest'

// Test helpers
import { RuleTester } from 'eslint'

// Thing under test
import AlanismsRule from '../../eslint-rules/alanisms/index.js'

RuleTester.describe = describe
RuleTester.it = it
RuleTester.itOnly = it.only

const ALL_CHECKS_OFF = {
  declarations: false,
  imports: false,
  mixedExports: false,
  moduleJsdoc: false,
  objectKeys: false
}

const ruleTester = new RuleTester()

describe('ESLint Rules - Alanisms rule', () => {
  describe('Alanism 1: object keys must be in alphabetical order', () => {
    ruleTester.run('alanisms', AlanismsRule, {
      invalid: [
        {
          code: _code(
            'const page = {',
            "  pageTitle: 'Jokes',",
            '  joke: data.joke,',
            "  backLink: { href: '/', text: 'Back' }",
            '}'
          ),
          errors: [{ messageId: 'objectKeys' }],
          options: _only('objectKeys'),
          output: _code(
            'const page = {',
            "  backLink: { href: '/', text: 'Back' },",
            '  joke: data.joke,',
            "  pageTitle: 'Jokes'",
            '}'
          )
        },
        {
          code: _code('const page = {', '  // Explains b', '  b: 1,', '  // Explains a', '  a: 2', '}'),
          errors: [{ messageId: 'objectKeys' }],
          options: _only('objectKeys'),
          output: _code('const page = {', '  // Explains a', '  a: 2,', '  // Explains b', '  b: 1', '}')
        },
        {
          code: _code('const page = {', '  b: {', '    // Inside b', '    c: 1', '  },', '  a: 2', '}'),
          errors: [{ messageId: 'objectKeys' }],
          options: _only('objectKeys'),
          output: _code('const page = {', '  a: 2,', '  b: {', '    // Inside b', '    c: 1', '  }', '}')
        },
        {
          code: _code('const page = {', '  b: 1, // Explains b', '  a: 2', '}'),
          errors: [{ messageId: 'objectKeys' }],
          options: _only('objectKeys'),
          output: null
        },
        {
          code: _code('const page = {', '  b: 1,', '  a: 2', '  // Dangling at the end', '}'),
          errors: [{ messageId: 'objectKeys' }],
          options: _only('objectKeys'),
          output: null
        }
      ],
      valid: [
        {
          code: "const page = { backLink: { href: '/', text: 'Back' }, joke: data.joke, pageTitle: 'Jokes' }",
          options: _only('objectKeys')
        },
        { code: 'const page = { b: 1, ...rest, a: 2 }', options: _only('objectKeys') },
        { code: 'const page = { b: 1, [key]: 2, a: 3 }', options: _only('objectKeys') },
        { code: 'const page = { apple: 1, Banana: 2 }', options: _only('objectKeys') }
      ]
    })
  })

  describe('Alanisms 2 and 3: imports must be grouped and in alphabetical order', () => {
    const alanism2Good = _code(
      "import FetchSessionDal from '../../../../dal/fetch-session.dal.js'",
      "import PermissionsPresenter from '../../../../presenters/users/internal/setup/permissions.presenter.js'",
      "import { formatValidationResult } from '../../../../presenters/base.presenter.js'",
      "import { flashNotification } from '../../../../lib/general.lib.js'"
    )

    const alanism3Good = _code(
      "import crypto from 'node:crypto'",
      "import path from 'path'",
      '',
      "import LicenceModel from '../../../models/licence.model.js'",
      "import ViewNoticeService from '../../../services/notices/view-notice.service.js'",
      '',
      "import DatabaseConfig from '../../../../config/database.config.js'"
    )

    describe('in source files', () => {
      ruleTester.run('alanisms', AlanismsRule, {
        invalid: [
          {
            code: _code(
              "import FetchSessionDal from '../../../../dal/fetch-session.dal.js'",
              "import { flashNotification } from '../../../../lib/general.lib.js'",
              "import { formatValidationResult } from '../../../../presenters/base.presenter.js'",
              "import PermissionsPresenter from '../../../../presenters/users/internal/setup/permissions.presenter.js'"
            ),
            errors: [{ messageId: 'importSortOrder' }],
            options: _only('imports', 'groups'),
            output: alanism2Good
          },
          {
            code: _code(
              "import crypto from 'node:crypto'",
              "import LicenceModel from '../../../models/licence.model.js'",
              "import path from 'path'",
              "import DatabaseConfig from '../../../../config/database.config.js'",
              "import ViewNoticeService from '../../../services/notices/view-notice.service.js'"
            ),
            errors: [{ messageId: 'importGroupOrder' }],
            options: _only('imports', 'groups'),
            output: alanism3Good
          },
          {
            code: _code(
              "import crypto from 'node:crypto'",
              "import path from 'path'",
              "import LicenceModel from '../../../models/licence.model.js'",
              "import ViewNoticeService from '../../../services/notices/view-notice.service.js'",
              "import DatabaseConfig from '../../../../config/database.config.js'"
            ),
            errors: [{ messageId: 'importGroupSpacing' }],
            options: _only('imports', 'groups'),
            output: alanism3Good
          },
          {
            code: "import { pause, formatLongDate } from 'water-abstraction-engine/lib/general.lib.js'",
            errors: [{ messageId: 'importMemberOrder' }],
            options: _only('imports', 'groups'),
            output: "import { formatLongDate, pause } from 'water-abstraction-engine/lib/general.lib.js'"
          },
          {
            code: _code("import path from 'path' // Needed for the folder name", "import crypto from 'node:crypto'"),
            errors: [{ messageId: 'importSortOrder' }],
            options: _only('imports', 'groups'),
            output: null
          }
        ],
        valid: [
          { code: alanism2Good, options: _only('imports', 'groups') },
          { code: alanism3Good, options: _only('imports', 'groups') }
        ]
      })
    })

    describe('in test files', () => {
      ruleTester.run('alanisms', AlanismsRule, {
        invalid: [
          {
            code: _code(
              '// Things we need to stub',
              "import * as CreateEmailRequest from '../../src/requests/notify/create-email.request.js'",
              "import AirbrakeModule from '@airbrake/node'"
            ),
            errors: [{ messageId: 'importGroupOrder' }],
            options: _only('imports', 'sections'),
            output: _code(
              '// Things we need to stub',
              "import AirbrakeModule from '@airbrake/node'",
              "import * as CreateEmailRequest from '../../src/requests/notify/create-email.request.js'"
            )
          }
        ],
        valid: [
          {
            code: _code(
              '// Test framework',
              "import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'",
              '',
              '// Test helpers',
              "import { NOTIFY_TEMPLATES } from '../../src/lib/notify-templates.lib.js'",
              '',
              '// Things we need to stub',
              "import AirbrakeModule from '@airbrake/node'",
              "import * as CreateEmailRequest from '../../src/requests/notify/create-email.request.js'",
              "import AirbrakeConfig from '../../src/config/airbrake.config.js'",
              "import NotifyConfig from '../../src/config/notify.config.js'",
              '',
              '// Thing under test',
              "import BaseNotifierLib from '../../src/lib/base-notifier.lib.js'"
            ),
            options: _only('imports', 'sections')
          }
        ]
      })
    })
  })

  describe('Alanism 4: blank line after variable declarations', () => {
    ruleTester.run('alanisms', AlanismsRule, {
      invalid: [
        {
          code: _code("const username = 'alan.thegreat@gmail.com'", 'await UserModel.query().insert({ username })'),
          errors: [{ messageId: 'declarations' }],
          options: _only('declarations'),
          output: _code(
            "const username = 'alan.thegreat@gmail.com'",
            '',
            'await UserModel.query().insert({ username })'
          )
        },
        {
          code: _code(
            "const username = 'alan.thegreat@gmail.com'",
            'let lastLogin = new Date()',
            'await UserModel.query().insert({ lastLogin, username })'
          ),
          errors: [{ messageId: 'declarations' }, { messageId: 'declarations' }],
          options: _only('declarations'),
          output: _code(
            "const username = 'alan.thegreat@gmail.com'",
            '',
            'let lastLogin = new Date()',
            '',
            'await UserModel.query().insert({ lastLogin, username })'
          )
        },
        {
          code: _code('function go() {', '  const total = 1 // Starting total', '  return total', '}'),
          errors: [{ messageId: 'declarations' }],
          options: _only('declarations'),
          output: _code('function go() {', '  const total = 1 // Starting total', '', '  return total', '}')
        }
      ],
      valid: [
        {
          code: _code(
            "const username = 'alan.thegreat@gmail.com'",
            'const lastLogin = new Date()',
            '',
            'await UserModel.query().insert({ lastLogin, username })'
          ),
          options: _only('declarations')
        },
        {
          code: _code(
            "const username = 'alan.thegreat@gmail.com'",
            '',
            'let lastLogin = new Date()',
            '',
            'await UserModel.query().insert({ lastLogin, username })'
          ),
          options: _only('declarations')
        }
      ]
    })
  })

  describe('Alanism 5: @module JSDoc first, then imports', () => {
    const moduleJsdoc = _code('/**', ' * Does the thing.', ' *', ' * @module MyService', ' */')

    ruleTester.run('alanisms', AlanismsRule, {
      invalid: [
        {
          code: _code("import FetchSessionDal from '../../dal/fetch-session.dal.js'", '', moduleJsdoc),
          errors: [{ messageId: 'moduleJsdocFirst' }],
          options: _only('moduleJsdoc')
        },
        {
          code: 'export default function go() {}',
          errors: [{ messageId: 'moduleJsdocMissing' }],
          options: _only('moduleJsdoc')
        },
        {
          code: _code(moduleJsdoc, '', "'use strict'"),
          errors: [{ messageId: 'useStrict' }],
          options: _only('moduleJsdoc')
        }
      ],
      valid: [
        {
          code: _code(moduleJsdoc, '', "import FetchSessionDal from '../../dal/fetch-session.dal.js'"),
          options: _only('moduleJsdoc')
        }
      ]
    })
  })

  describe('Mixed exports: one export style per file', () => {
    ruleTester.run('alanisms', AlanismsRule, {
      invalid: [
        {
          code: _code('export default function go() {}', 'export const total = 1'),
          errors: [{ messageId: 'mixedExports' }, { messageId: 'mixedExports' }],
          options: _only('mixedExports')
        }
      ],
      valid: [{ code: _code('export const total = 1', 'export const count = 2'), options: _only('mixedExports') }]
    })
  })

  describe('All checks together', () => {
    ruleTester.run('alanisms', AlanismsRule, {
      invalid: [],
      valid: [
        _code(
          '/**',
          ' * Fetches the licence and formats it for the view',
          ' *',
          ' * @module ViewLicenceService',
          ' */',
          '',
          "import crypto from 'node:crypto'",
          '',
          "import FetchLicenceDal from '../dal/fetch-licence.dal.js'",
          "import { formatLongDate } from '../presenters/base.presenter.js'",
          '',
          "import FeatureFlagsConfig from '../config/feature-flags.config.js'",
          '',
          'export default async function go(licenceId) {',
          '  const licence = await FetchLicenceDal(licenceId)',
          '',
          '  return { FeatureFlagsConfig, id: crypto.randomUUID(), licence, startDate: formatLongDate(licence.startDate) }',
          '}'
        )
      ]
    })
  })
})

function _code(...lines) {
  return lines.join('\n')
}

function _only(check, value = true) {
  return [{ ...ALL_CHECKS_OFF, [check]: value }]
}
