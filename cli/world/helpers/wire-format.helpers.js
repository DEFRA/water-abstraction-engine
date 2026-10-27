/**
 * Data/scenario files may use a singular key naming an entity directly (e.g. `licence`, `company`, `address`)
 * rather than the plural table name the load endpoint expects (`licences`, `companies`, `addresses`), and may
 * return either a single object or an array for it. Normalizing both here means scenario/data files can compose
 * with plain entity names throughout, never having to know or care that the wire format is a pluralized array
 * per key.
 *
 * A scenario overriding a single-entity result with several instances (e.g. a second point on top of the one a
 * base scenario already built) sets its own plural-named key (`points: [...]`) alongside whatever singular key
 * the base scenario already spread in (`point: {...}`) — object spread can't make one key replace another with a
 * different name. Rather than requiring every override to know and exactly match the base scenario's key name,
 * the plural key wins here: when both a key and its pluralized form are present, the singular one is skipped.
 *
 * @param {object} data - the scenario/data object to convert to the seed endpoint's wire format
 *
 * @returns {object} The data with every key pluralized and its value normalized to an array
 */
export function asArrays(data) {
  const result = {}

  for (const key of Object.keys(data)) {
    const pluralKey = _pluralize(key)

    if (pluralKey !== key && Object.hasOwn(data, pluralKey)) {
      continue
    }

    const value = data[key]

    result[pluralKey] = Array.isArray(value) ? value : [value]
  }

  return result
}

/**
 * A key already ending in a single `s` (`companies`, `licences`, `licenceVersionPurposePoints`) is treated as
 * already plural and left alone, since most entity names in this codebase pluralize with a plain `s` and we
 * can't tell "singular, happens to end in s" apart from "already plural" by spelling alone. `address` and
 * `companyAddress` are the known exceptions — they end in a doubled `ss`, which is never how a word already
 * pluralized this way would end, so that case is handled explicitly (`address` -> `addresses`). Words ending in
 * a consonant + `y` (`company`) pluralize as `-ies`.
 *
 * @private
 */
function _pluralize(word) {
  if (word.endsWith('ss')) {
    return `${word}es`
  }

  if (/[^aeiou]y$/i.test(word)) {
    return `${word.slice(0, -1)}ies`
  }

  if (word.endsWith('s')) {
    return word
  }

  return `${word}s`
}
