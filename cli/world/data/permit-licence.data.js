/**
 * Build a permit licence record for a licence
 *
 * @param {object} licence - the licence record
 *
 * @returns {object} the data to load
 */
export default function (licence) {
  return {
    licenceRef: licence.licenceRef,
    startDate: licence.startDate,
    metadata: {
      source: 'acceptance-test-setup'
    }
  }
}
