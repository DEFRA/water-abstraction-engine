/**
 * Shared helpers used by the checks that make up the alanisms ESLint rule
 *
 * @module AlanismsHelpers
 */

/**
 * Compare two names in A–Z order, ignoring case
 *
 * When two names only differ by case, a case-sensitive comparison is used so the order is always stable.
 *
 * @param {string} first - The first name to compare
 * @param {string} second - The second name to compare
 *
 * @returns {number} A negative number if `first` comes first, a positive number if `second` comes first, else 0
 */
export function compareNames(first, second) {
  const firstLower = first.toLowerCase()
  const secondLower = second.toLowerCase()

  if (firstLower !== secondLower) {
    return firstLower < secondLower ? -1 : 1
  }

  if (first === second) {
    return 0
  }

  return first < second ? -1 : 1
}

/**
 * Check if any comments sit inside an area of code, including a trailing comment on the area's last line
 *
 * Fixes that move code around would leave these comments next to the wrong code, so the checks report without fixing
 * when this returns true.
 *
 * @param {object} sourceCode - The ESLint SourceCode object for the file
 * @param {number} start - The position the area starts at
 * @param {object} lastNode - The last node in the area
 *
 * @returns {boolean} true if a comment is found
 */
export function hasComments(sourceCode, start, lastNode) {
  const endLine = lastNode.loc.end.line

  return sourceCode.getAllComments().some((comment) => {
    if (comment.range[0] < start) {
      return false
    }

    return comment.range[1] <= lastNode.range[1] || comment.loc.start.line === endLine
  })
}

/**
 * Build the fixes that put nodes into a new order, by swapping in the source text of each node's replacement
 *
 * Only the text of the nodes themselves is replaced, so the commas, line breaks and indentation between them are kept.
 *
 * @param {object} fixer - The ESLint fixer
 * @param {object} sourceCode - The ESLint SourceCode object for the file
 * @param {object[]} nodes - The nodes in their current order
 * @param {object[]} sortedNodes - The same nodes in the order they should be in
 *
 * @returns {object[]} The fixes to apply
 */
export function reorderFixes(fixer, sourceCode, nodes, sortedNodes) {
  return nodes.map((node, index) => {
    return fixer.replaceText(node, sourceCode.getText(sortedNodes[index]))
  })
}
