/**
 * Alanisms 2 and 3: import statements must be grouped and in alphabetical order
 *
 * @module AlanismsImportsCheck
 */

import path from 'node:path'

import { compareNames, hasComments, reorderFixes } from '../helpers.js'

const EXTERNAL_GROUP = 0
const INTERNAL_GROUP = 1
const CONFIG_GROUP = 2

const DEFAULT_IMPORT = 0
const NAMED_IMPORT = 1
const SIDE_EFFECT_IMPORT = 2

/**
 * Check that imports are grouped and sorted
 *
 * Imports are split into three groups: external packages (including `node:` builtins), internal relative imports, and
 * config modules (relative imports from a `config/` folder). Within each group, default imports come first sorted by
 * variable name, then named imports sorted by file name, then side-effect imports. Named members inside `{ }` must also
 * be in A–Z order.
 *
 * In 'groups' mode (source files) the groups must be separated by one blank line, with no blank lines inside a group.
 * In 'sections' mode (test files) imports are already split into sections by blank lines and comments, so the same
 * order is applied within each section, with no blank lines between the groups.
 *
 * @param {object} context - The ESLint rule context
 * @param {string} mode - Either 'groups' or 'sections'
 *
 * @returns {object} The ESLint listeners for this check
 */
export default function importsCheck(context, mode) {
  const sourceCode = context.sourceCode

  return {
    'Program:exit'(program) {
      const imports = program.body.filter((statement) => {
        return statement.type === 'ImportDeclaration'
      })

      for (const importNode of imports) {
        _checkMembers(context, sourceCode, importNode)
      }

      if (mode === 'sections') {
        for (const section of _sections(imports)) {
          _checkSection(context, sourceCode, section)
        }

        return
      }

      _checkGroups(context, sourceCode, program, imports)
    }
  }
}

function _checkGroups(context, sourceCode, program, imports) {
  if (imports.length < 2) {
    return
  }

  const first = imports[0]
  const last = imports[imports.length - 1]
  const sorted = [...imports].sort(_compareImports)
  const fixable = !hasComments(sourceCode, first.range[0], last) && _contiguous(program, imports)
  const problem = _orderProblem(imports, sorted) ?? (fixable ? _spacingProblem(imports) : null)

  if (!problem) {
    return
  }

  context.report({
    fix: fixable
      ? (fixer) => {
          return fixer.replaceTextRange([first.range[0], last.range[1]], _groupedText(sourceCode, sorted))
        }
      : null,
    messageId: problem.messageId,
    node: problem.node
  })
}

function _checkMembers(context, sourceCode, importNode) {
  const members = importNode.specifiers.filter((specifier) => {
    return specifier.type === 'ImportSpecifier'
  })

  if (members.length < 2) {
    return
  }

  const sorted = [...members].sort((first, second) => {
    return compareNames(first.local.name, second.local.name)
  })

  const alreadySorted = sorted.every((member, index) => {
    return member === members[index]
  })

  if (alreadySorted) {
    return
  }

  context.report({
    fix: hasComments(sourceCode, importNode.range[0], importNode)
      ? null
      : (fixer) => {
          return reorderFixes(fixer, sourceCode, members, sorted)
        },
    messageId: 'importMemberOrder',
    node: importNode
  })
}

function _checkSection(context, sourceCode, section) {
  if (section.length < 2) {
    return
  }

  const first = section[0]
  const last = section[section.length - 1]
  const sorted = [...section].sort(_compareImports)
  const problem = _orderProblem(section, sorted)

  if (!problem) {
    return
  }

  context.report({
    fix: hasComments(sourceCode, first.range[0], last)
      ? null
      : (fixer) => {
          const text = sorted
            .map((importNode) => {
              return sourceCode.getText(importNode)
            })
            .join('\n')

          return fixer.replaceTextRange([first.range[0], last.range[1]], text)
        },
    messageId: problem.messageId,
    node: problem.node
  })
}

function _compareImports(first, second) {
  const groupDifference = _group(first) - _group(second)

  if (groupDifference !== 0) {
    return groupDifference
  }

  const kindDifference = _kind(first) - _kind(second)

  if (kindDifference !== 0) {
    return kindDifference
  }

  const nameDifference = compareNames(_sortName(first), _sortName(second))

  if (nameDifference !== 0) {
    return nameDifference
  }

  return compareNames(first.source.value, second.source.value)
}

function _contiguous(program, imports) {
  const start = program.body.indexOf(imports[0])

  return program.body.slice(start, start + imports.length).every((statement) => {
    return statement.type === 'ImportDeclaration'
  })
}

function _group(importNode) {
  const source = importNode.source.value

  if (!source.startsWith('.')) {
    return EXTERNAL_GROUP
  }

  if (source.split('/').includes('config')) {
    return CONFIG_GROUP
  }

  return INTERNAL_GROUP
}

function _groupedText(sourceCode, sorted) {
  const lines = []

  sorted.forEach((importNode, index) => {
    if (index > 0 && _group(importNode) !== _group(sorted[index - 1])) {
      lines.push('')
    }

    lines.push(sourceCode.getText(importNode))
  })

  return lines.join('\n')
}

function _kind(importNode) {
  const { specifiers } = importNode

  if (specifiers.length === 0) {
    return SIDE_EFFECT_IMPORT
  }

  const hasDefault = specifiers.some((specifier) => {
    return specifier.type === 'ImportDefaultSpecifier' || specifier.type === 'ImportNamespaceSpecifier'
  })

  return hasDefault ? DEFAULT_IMPORT : NAMED_IMPORT
}

function _orderProblem(imports, sorted) {
  const firstMisplaced = imports.findIndex((importNode, index) => {
    return importNode !== sorted[index]
  })

  if (firstMisplaced === -1) {
    return null
  }

  const groupOutOfOrder = imports.findIndex((importNode, index) => {
    return index > 0 && _group(importNode) < _group(imports[index - 1])
  })

  if (groupOutOfOrder !== -1) {
    return { messageId: 'importGroupOrder', node: imports[groupOutOfOrder] }
  }

  return { messageId: 'importSortOrder', node: sorted[firstMisplaced] }
}

function _sections(imports) {
  const sections = []

  let current = []

  for (const importNode of imports) {
    const previous = current[current.length - 1]

    if (previous && importNode.loc.start.line - previous.loc.end.line > 1) {
      sections.push(current)
      current = []
    }

    current.push(importNode)
  }

  sections.push(current)

  return sections
}

function _sortName(importNode) {
  const kind = _kind(importNode)

  if (kind === DEFAULT_IMPORT) {
    const specifier = importNode.specifiers.find((importSpecifier) => {
      return importSpecifier.type !== 'ImportSpecifier'
    })

    return specifier.local.name
  }

  if (kind === NAMED_IMPORT) {
    return path.posix.basename(importNode.source.value)
  }

  return importNode.source.value
}

function _spacingProblem(imports) {
  for (let index = 1; index < imports.length; index++) {
    const previous = imports[index - 1]
    const current = imports[index]
    const blankLines = current.loc.start.line - previous.loc.end.line - 1
    const expected = _group(current) === _group(previous) ? 0 : 1

    if (blankLines !== expected) {
      return { messageId: 'importGroupSpacing', node: current }
    }
  }

  return null
}
