/**
 * One ESLint rule that enforces the alanisms in `.agents/skills/standards/alanisms.md`
 *
 * Each alanism is checked by its own module in `checks/`, and every message names the alanism it relates to. Options
 * turn individual checks off or change how they work, for example test files have no `@module` block and split their
 * imports into commented sections.
 *
 * @module AlanismsRule
 */

import declarationsCheck from './checks/declarations.check.js'
import importsCheck from './checks/imports.check.js'
import mixedExportsCheck from './checks/mixed-exports.check.js'
import moduleJsdocCheck from './checks/module-jsdoc.check.js'
import objectKeysCheck from './checks/object-keys.check.js'

const DEFAULT_OPTIONS = {
  declarations: true,
  imports: 'groups',
  mixedExports: true,
  moduleJsdoc: true,
  objectKeys: true
}

export default {
  create(context) {
    const options = { ...DEFAULT_OPTIONS, ...context.options[0] }
    const listeners = []

    if (options.objectKeys) {
      listeners.push(objectKeysCheck(context))
    }

    if (options.imports) {
      listeners.push(importsCheck(context, options.imports))
    }

    if (options.declarations) {
      listeners.push(declarationsCheck(context))
    }

    if (options.moduleJsdoc) {
      listeners.push(moduleJsdocCheck(context))
    }

    if (options.mixedExports) {
      listeners.push(mixedExportsCheck(context))
    }

    return _mergeListeners(listeners)
  },
  meta: {
    docs: {
      description: 'Enforce the alanisms: object key order, import order and groups, blank lines and file structure'
    },
    fixable: 'code',
    messages: {
      declarations: 'Alanism 4: add a blank line after the `{{kind}}` declarations',
      importGroupOrder: 'Alanism 3: group imports as external packages, then internal modules, then config modules',
      importGroupSpacing:
        'Alanism 3: separate import groups with one blank line, and use no blank lines inside a group',
      importMemberOrder: 'Alanism 2: named imports inside `{ }` must be in A–Z order',
      importSortOrder:
        'Alanism 2: sort imports with default imports first (A–Z by variable name), then named imports (A–Z by file name)',
      mixedExports: 'This file mixes a default export with named exports. Use one export style only.',
      moduleJsdocFirst: 'Alanism 5: the `@module` JSDoc block must come before the imports and any other code',
      moduleJsdocMissing: 'Alanism 5: files must start with a JSDoc block containing `@module`',
      objectKeys: "Alanism 1: object keys must be in A–Z order ('{{current}}' should come before '{{previous}}')",
      useStrict: "Alanism 5: ESM modules are always strict, so remove 'use strict'"
    },
    schema: [
      {
        additionalProperties: false,
        properties: {
          declarations: { type: 'boolean' },
          imports: { enum: ['groups', 'sections', false] },
          mixedExports: { type: 'boolean' },
          moduleJsdoc: { type: 'boolean' },
          objectKeys: { type: 'boolean' }
        },
        type: 'object'
      }
    ],
    type: 'suggestion'
  }
}

function _mergeListeners(listeners) {
  const merged = {}

  for (const listener of listeners) {
    for (const [selector, handler] of Object.entries(listener)) {
      const existing = merged[selector]

      merged[selector] = existing
        ? (node) => {
            existing(node)
            handler(node)
          }
        : handler
    }
  }

  return merged
}
