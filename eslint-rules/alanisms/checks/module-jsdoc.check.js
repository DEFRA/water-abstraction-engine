/**
 * Alanism 5: files must start with the `@module` JSDoc block, followed by the imports
 *
 * @module AlanismsModuleJsdocCheck
 */

/**
 * Check that the file has a `@module` JSDoc block before any code, and does not use `'use strict'`
 *
 * This check only reports. Writing the module description needs a person, so there is no fix.
 *
 * @param {object} context - The ESLint rule context
 *
 * @returns {object} The ESLint listeners for this check
 */
export default function moduleJsdocCheck(context) {
  const sourceCode = context.sourceCode

  return {
    Program(node) {
      const [firstStatement] = node.body
      const moduleComment = sourceCode.getAllComments().find(_isModuleJsdoc)

      if (_isUseStrict(firstStatement)) {
        context.report({ messageId: 'useStrict', node: firstStatement })
      }

      if (!moduleComment) {
        context.report({ loc: { column: 0, line: 1 }, messageId: 'moduleJsdocMissing' })

        return
      }

      if (firstStatement && moduleComment.range[0] > firstStatement.range[0]) {
        context.report({ loc: moduleComment.loc, messageId: 'moduleJsdocFirst' })
      }
    }
  }
}

function _isModuleJsdoc(comment) {
  return comment.type === 'Block' && comment.value.startsWith('*') && /@module\b/.test(comment.value)
}

function _isUseStrict(statement) {
  return statement?.type === 'ExpressionStatement' && statement.directive === 'use strict'
}
