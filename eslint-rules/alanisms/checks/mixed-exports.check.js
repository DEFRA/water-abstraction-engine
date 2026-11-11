/**
 * A file must use one export style only: a single default export, or one or more named exports, never both
 *
 * @module AlanismsMixedExportsCheck
 */

/**
 * Check that a file does not mix a default export with named exports
 *
 * @param {object} context - The ESLint rule context
 *
 * @returns {object} The ESLint listeners for this check
 */
export default function mixedExportsCheck(context) {
  return {
    'Program:exit'(node) {
      const defaultExports = node.body.filter((statement) => {
        return statement.type === 'ExportDefaultDeclaration'
      })
      const namedExports = node.body.filter((statement) => {
        return statement.type === 'ExportNamedDeclaration' || statement.type === 'ExportAllDeclaration'
      })

      if (defaultExports.length === 0 || namedExports.length === 0) {
        return
      }

      for (const exportNode of [...defaultExports, ...namedExports]) {
        context.report({ messageId: 'mixedExports', node: exportNode })
      }
    }
  }
}
