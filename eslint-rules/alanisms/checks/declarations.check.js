/**
 * Alanism 4: a blank line must follow variable declarations
 *
 * @module AlanismsDeclarationsCheck
 */

/**
 * Check that a blank line separates variable declarations from the statement that follows them
 *
 * Declarations of the same kind can sit together. A blank line is needed before the first statement that is not a
 * declaration, and between `const` and `let` declarations.
 *
 * @param {object} context - The ESLint rule context
 *
 * @returns {object} The ESLint listeners for this check
 */
export default function declarationsCheck(context) {
  const sourceCode = context.sourceCode

  const checkBody = (node) => {
    _checkStatements(context, sourceCode, node.body)
  }

  return {
    BlockStatement: checkBody,
    Program: checkBody,
    StaticBlock: checkBody,
    SwitchCase(node) {
      _checkStatements(context, sourceCode, node.consequent)
    }
  }
}

function _checkStatements(context, sourceCode, statements) {
  for (let index = 1; index < statements.length; index++) {
    const previous = statements[index - 1]
    const current = statements[index]
    const kind = _declarationKind(previous)

    if (!kind || _declarationKind(current) === kind || _hasBlankLine(sourceCode, previous, current)) {
      continue
    }

    context.report({
      data: { kind },
      fix: (fixer) => {
        return fixer.insertTextAfter(_lineEnd(sourceCode, previous), '\n')
      },
      messageId: 'declarations',
      node: current
    })
  }
}

function _declarationKind(statement) {
  if (statement.type === 'VariableDeclaration') {
    return statement.kind
  }

  if (statement.type === 'ExportNamedDeclaration' && statement.declaration?.type === 'VariableDeclaration') {
    return statement.declaration.kind
  }

  return null
}

function _hasBlankLine(sourceCode, previous, current) {
  const tokens = [
    sourceCode.getLastToken(previous),
    ...sourceCode.getTokensBetween(previous, current, { includeComments: true }),
    sourceCode.getFirstToken(current)
  ]

  return tokens.some((token, index) => {
    return index > 0 && token.loc.start.line - tokens[index - 1].loc.end.line > 1
  })
}

function _lineEnd(sourceCode, previous) {
  const lastToken = sourceCode.getLastToken(previous)
  const trailingComments = sourceCode.getCommentsAfter(lastToken).filter((comment) => {
    return comment.loc.start.line === lastToken.loc.end.line
  })

  return trailingComments.length > 0 ? trailingComments[trailingComments.length - 1] : lastToken
}
