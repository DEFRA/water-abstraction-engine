/**
 * Build a licence agreement record for a licence
 *
 * @param {object} licence - the licence record
 *
 * @returns {object} the data to load
 */
export default function (licence) {
  return {
    financialAgreementId: {
      schema: 'public',
      table: 'financialAgreements',
      lookup: 'code',
      value: 'S127',
      select: 'id'
    },
    licenceRef: licence.licenceRef,
    startDate: licence.startDate
  }
}
