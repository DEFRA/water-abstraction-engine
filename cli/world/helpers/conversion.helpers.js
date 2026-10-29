import Big from 'big.js'

const MAX_DECIMAL = 6

/**
 * Converts a quantity from cubic metres to megalitres
 *
 * We use **Big.js** to mitigate issues with
 * {@link https://en.wikipedia.org/wiki/Floating-point_error_mitigation | floating-point errors}.
 *
 * The classic example of this in JavaScript is `0.1 + 0.2`. You expect `0.3` but in fact the result is
 * `0.30000000000000004`.
 *
 * @param {number} quantity - the quantity in cubic metres to be formatted and converted to megalitres
 *
 * @returns {number|null} The converted quantity or null if the quantity is null or undefined
 */
export function convertCubicMetresToMegalitres(quantity) {
  if (quantity === null || quantity === undefined) {
    return null
  }

  return Big(quantity).times(0.001).round(MAX_DECIMAL, Big.roundHalfUp).toNumber()
}

/**
 * Splits a total volume into an equal number of parts
 *
 * We use **Big.js** to mitigate issues with
 * {@link https://en.wikipedia.org/wiki/Floating-point_error_mitigation | floating-point errors}.
 *
 * Each part is rounded to {@link MAX_DECIMAL} decimal places. If rounding causes the sum of all parts to differ from
 * the original volume, the difference is added to the last part to ensure the total is preserved.
 *
 * @param {number} totalVolume - the total volume to be split
 * @param {number} numberOfSplits - the number of equal parts to split the total volume into
 *
 * @returns {number[]} An array of split volumes
 */
export function splitTotalVolume(totalVolume, numberOfSplits) {
  // Work out the individual split volume, rounding to the specified number of decimal places
  const splitVolume = Big(totalVolume).div(numberOfSplits).round(MAX_DECIMAL, Big.roundHalfUp).toNumber()

  // Make an array of the split volume, equal to the number of splits requested
  const splits = Array.from({ length: numberOfSplits }, () => {
    return splitVolume
  })

  // Sum the splits
  const sumOfSplits = splits
    .reduce((acc, val) => {
      return Big(acc).plus(val)
    }, Big(0))
    .toNumber()

  // Check if there is a difference, which can happen due to the rounding
  const difference = Big(totalVolume).minus(sumOfSplits).toNumber()

  // If there is a difference, we apply it to the last split in the array to ensure their total matches the original
  // total volume
  if (difference !== 0) {
    splits[splits.length - 1] = Big(splits[splits.length - 1])
      .plus(difference)
      .toNumber()
  }

  return splits
}
