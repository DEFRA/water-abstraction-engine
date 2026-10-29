import chargeElementData from '../data/charge-element.data.js'
import chargeReferenceData from '../data/charge-reference.data.js'
import chargeVersionData from '../data/charge-version.data.js'

/**
 * Builds a charge version in its entirety: the charge version itself, a charge reference for the given licence
 * version purpose, and a charge element — the minimum valid data a charge version needs to exist against a
 * licence, given an existing billing account.
 *
 * @param {object} licenceEntity - the licence entity the charge version is for
 * @param {object} billingAccountEntity - the billing account entity the charge version is for
 * @param {object} region - the region the charge version and its billing account are for
 */
export default function (licenceEntity, billingAccountEntity, region) {
  const { licence, licenceVersionPurpose } = licenceEntity
  const { billingAccount } = billingAccountEntity

  const chargeVersion = chargeVersionData(billingAccount, licence, region)
  const chargeReference = chargeReferenceData(chargeVersion, [licenceVersionPurpose])
  const chargeElement = chargeElementData(chargeReference, licenceVersionPurpose)

  return {
    chargeVersion,
    chargeReference,
    chargeElement
  }
}
