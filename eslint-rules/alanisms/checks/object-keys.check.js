/**
 * Alanism 1: object keys must be in alphabetical order
 *
 * @module AlanismsObjectKeysCheck
 */

import { compareNames, hasComments, reorderFixes } from '../helpers.js'

/**
 * Check that the keys in every object literal are in A–Z order
 *
 * Spread elements and computed keys that are not plain values split an object into separate runs, because moving keys
 * across them could change the result. Each run is checked on its own.
 *
 * @param {object} context - The ESLint rule context
 *
 * @returns {object} The ESLint listeners for this check
 */
export default function objectKeysCheck(context) {
  const sourceCode = context.sourceCode

  return {
    ObjectExpression(node) {
      for (const run of _runs(node.properties)) {
        _checkRun(context, sourceCode, node, run)
      }
    }
  }
}

function _checkRun(context, sourceCode, objectNode, run) {
  if (run.length < 2) {
    return
  }

  const outOfOrderIndex = run.findIndex((property, index) => {
    return index > 0 && compareNames(_keyName(run[index - 1]), _keyName(property)) > 0
  })

  if (outOfOrderIndex === -1) {
    return
  }

  const property = run[outOfOrderIndex]
  const previous = run[outOfOrderIndex - 1]
  const sorted = [...run].sort((first, second) => {
    return compareNames(_keyName(first), _keyName(second))
  })

  context.report({
    data: { current: _keyName(property), previous: _keyName(previous) },
    fix: hasComments(sourceCode, objectNode.range[0], objectNode)
      ? null
      : (fixer) => {
          return reorderFixes(fixer, sourceCode, run, sorted)
        },
    messageId: 'objectKeys',
    node: property
  })
}

function _keyName(property) {
  if (property.type !== 'Property') {
    return null
  }

  const { computed, key } = property

  if (key.type === 'Literal') {
    return String(key.value)
  }

  if (!computed && key.type === 'Identifier') {
    return key.name
  }

  return null
}

function _runs(properties) {
  const runs = []

  let current = []

  for (const property of properties) {
    if (_keyName(property) === null) {
      runs.push(current)
      current = []
    } else {
      current.push(property)
    }
  }

  runs.push(current)

  return runs
}
