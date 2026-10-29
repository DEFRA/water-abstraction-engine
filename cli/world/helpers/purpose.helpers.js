const PURPOSE_DESCRIPTIONS = {
  400: 'Spray Irrigation - Direct',
  420: 'Spray Irrigation - Storage'
}

const TWO_PART_TARIFF_PURPOSE_IDS = ['400', '420']

/**
 * Whether a purpose (by its legacy id) is one we treat as two-part tariff in our test data.
 *
 * @param {string} purposeId - the purpose's legacy id, for example '400'
 *
 * @returns {boolean} true if the purpose is a two-part tariff purpose
 */
export function isTwoPartTariffPurpose(purposeId) {
  return TWO_PART_TARIFF_PURPOSE_IDS.includes(purposeId)
}

/**
 * The description for a purpose (by its legacy id). Any purpose we don't specifically know is treated as the default
 * non-two-part-tariff purpose, 280 (Make-Up Or Top Up Water).
 *
 * @param {string} purposeId - the purpose's legacy id, for example '400'
 *
 * @returns {string} the purpose's description
 */
export function purposeDescription(purposeId) {
  return PURPOSE_DESCRIPTIONS[purposeId] ?? 'Make-Up Or Top Up Water'
}
