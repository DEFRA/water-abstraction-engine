/**
 * Build a return requirement purpose record for a return requirement from a licence version purpose
 *
 * @param {object} returnRequirement - the return requirement record
 * @param {object} licenceVersionPurpose - the licence version purpose record
 *
 * @returns {object} the data to load
 */
export default function (returnRequirement, licenceVersionPurpose) {
  return {
    returnRequirementId: returnRequirement.id,
    alias: `TEST RET REQ PURPOSE ${licenceVersionPurpose.purposeId.value}`,
    primaryPurposeId: {
      schema: 'public',
      table: 'primaryPurposes',
      lookup: 'legacyId',
      value: licenceVersionPurpose.primaryPurposeId.value,
      select: 'id'
    },
    secondaryPurposeId: {
      schema: 'public',
      table: 'secondaryPurposes',
      lookup: 'legacyId',
      value: licenceVersionPurpose.secondaryPurposeId.value,
      select: 'id'
    },
    purposeId: {
      schema: 'public',
      table: 'purposes',
      lookup: 'legacyId',
      value: licenceVersionPurpose.purposeId.value,
      select: 'id'
    }
  }
}
