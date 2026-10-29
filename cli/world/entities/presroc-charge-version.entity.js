import chargeReferenceData from '../data/charge-reference-presroc.data.js'
import chargeVersionData from '../data/charge-version.data.js'
import licenceAgreementData from '../data/licence-agreement.data.js'

/**
 * Builds a presroc (alcs scheme) charge version in its entirety: the charge version itself and a charge
 * reference — the minimum valid data a charge version needs to exist against a presroc licence, given an
 * existing billing account.
 *
 * Unlike charge-version.entity.js, this doesn't build a charge element. The alcs scheme predates the sroc
 * reference/element split, so charge-reference-presroc.data.js already carries the abstraction period and
 * authorised quantity directly on the charge reference, where sroc would hold them on a separate charge element.
 * The modern billing engine also only processes charge versions on the sroc scheme, so there's no
 * charge-element-dependent transaction generation this data needs to satisfy either.
 *
 * @param {object} licenceEntity - the licence entity the charge version is for
 * @param billingAccountEntity
 * @param {object} region - the region
 */
export default function (licenceEntity, billingAccountEntity, region) {
  const { licence, licenceVersionPurpose } = licenceEntity

  const chargeVersion = chargeVersionData(billingAccountEntity.billingAccount, licence, region)

  // charge-version.data.js hardcodes the scheme to sroc, so we override it to alcs to match the presroc start date
  chargeVersion.scheme = 'alcs'

  const chargeReference = chargeReferenceData(chargeVersion, licenceVersionPurpose)

  let licenceAgreement = {}
  if (chargeReference.section127Agreement) {
    licenceAgreement = licenceAgreementData(licence)
  }

  return {
    chargeVersion,
    chargeReference,
    licenceAgreement
  }
}
