/**
 * Build a licence version purpose condition record for a licence version purpose
 *
 * @param {object} licenceVersionPurpose - the licence version purpose record
 *
 * @returns {object} the data to load
 */
export default function (licenceVersionPurpose) {
  return {
    licenceVersionPurposeId: licenceVersionPurpose.id,
    licenceVersionPurposeConditionTypeId: {
      schema: 'public',
      table: 'licenceVersionPurposeConditionTypes',
      lookup: 'subcode',
      value: 'LEV',
      select: 'id'
    },
    notes: 'Test condition notes'
  }
}
