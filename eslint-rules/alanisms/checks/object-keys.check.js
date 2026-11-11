/**
 * Alanism 1: object keys must be in alphabetical order
 *
 * @module AlanismsObjectKeysCheck
 */

import { compareNames } from '../helpers.js'

/**
 * Check that the keys in every object literal are in A–Z order
 *
 * Spread elements and computed keys that are not plain values split an object into separate runs, because moving keys
 * across them could change the result. Each run is checked on its own.
 *
 * The fix moves each key together with any comment lines directly above it. If a comment sits at the end of a key's
 * line, or after the last key, it is unclear which key it belongs to, so the object is reported but not fixed.
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
        _checkRun(context, sourceCode, run)
      }
    }
  }
}

function _checkRun(context, sourceCode, run) {
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
  const chunks = _chunks(sourceCode, run)

  context.report({
    data: { current: _keyName(property), previous: _keyName(previous) },
    fix: chunks
      ? (fixer) => {
          return run.map((runProperty, index) => {
            const [start, end] = chunks.get(sorted[index])

            return fixer.replaceTextRange(chunks.get(runProperty), sourceCode.text.slice(start, end))
          })
        }
      : null,
    messageId: 'objectKeys',
    node: property
  })
}

function _chunks(sourceCode, run) {
  const chunks = new Map()

  for (const property of run) {
    const previousToken = sourceCode.getTokenBefore(property)
    const nextToken = sourceCode.getTokenAfter(property)
    const leadingComments = sourceCode.getCommentsBefore(property)
    const trailingComments = [
      ...sourceCode.getCommentsAfter(property),
      ...(nextToken.value === ',' ? sourceCode.getCommentsAfter(nextToken) : [])
    ]

    const leadingOnPreviousLine = leadingComments.some((comment) => {
      return comment.loc.start.line === previousToken.loc.end.line
    })
    const trailingOnSameLine = trailingComments.some((comment) => {
      return comment.loc.start.line === property.loc.end.line
    })
    const danglingAtEnd = nextToken.value === '}' && trailingComments.length > 0

    if (leadingOnPreviousLine || trailingOnSameLine || danglingAtEnd) {
      return null
    }

    const start = leadingComments.length > 0 ? leadingComments[0].range[0] : property.range[0]

    chunks.set(property, [start, property.range[1]])
  }

  return chunks
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
