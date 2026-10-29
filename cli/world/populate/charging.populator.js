import ChangeReasonHelper from '../../../test/support/helpers/change-reason.helper.js'
import ChargeCategoryHelper from '../../../test/support/helpers/charge-category.helper.js'
import SupportedSourceHelper from '../../../test/support/helpers/supported-source.helper.js'
import { addDays } from '../helpers/date.helpers.js'
import addressData from '../data/address.data.js'
import billingAccountAddressData from '../data/billing-account-address.data.js'
import buildBillingAccountEntity from '../entities/billing-account.entity.js'
import chargeElementData from '../data/charge-element.data.js'
import chargeReferenceData from '../data/charge-reference.data.js'
import chargeReferencePresrocData from '../data/charge-reference-presroc.data.js'
import chargeVersionData from '../data/charge-version.data.js'
import { generateUUID } from '../../../test/support/generators.js'
import licenceAgreementData from '../data/licence-agreement.data.js'
import { purposesOn } from './helpers/purposes.helpers.js'
import { regionOf } from './helpers/regions.helpers.js'
import { srocStartDate } from '../default-values.js'
import { licenceEndDate, licenceModel } from './helpers/end-dates.helpers.js'
import { licenceVersionChange, licenceVersionOn } from './helpers/licence-versions.helpers.js'

/**
 * Charge the licences
 *
 * Each licence holder, past and present, is given a billing account, and each licence empty lists for its charges. A
 * licence is charged for each of its licence
 * versions, so its charge versions follow its licence versions: the part of a licence version before sroc started is
 * alcs and the part after is sroc. Licences that started before sroc are given alcs charge versions, then live licences
 * are given sroc ones, and so are licences that ended after sroc started. A licence version with two purposes then has
 * both charged, the sroc charge references are varied so they are not all alike, and a few licences are given a
 * superseded charge version. The charge versions are then numbered, and last of all a few licences are given a section
 * 130U agreement.
 *
 * Where a step takes the next value from a list, it goes back to the start of the list when it runs out.
 *
 * Call this after everything else has been added to the licences.
 *
 * @param {object[]} licenceEntities - the licence entities to charge
 */
export default function charging(licenceEntities) {
  const billingAccountEntities = _billingAccounts(licenceEntities)

  _addChargeLists(licenceEntities)
  _chargeLicencesFromAlcs(licenceEntities, billingAccountEntities)
  _chargeLiveLicencesFromSroc(licenceEntities, billingAccountEntities)
  _chargeEndedLicencesFromSroc(licenceEntities, billingAccountEntities)
  _chargeBothPurposes(licenceEntities)
  _varySrocReferences(licenceEntities)
  _addSupersededVersions(licenceEntities)
  _numberChargeVersions(licenceEntities)
  _addOtherAgreements(licenceEntities)
}

/**
 * The billing account for each licence holder, past and present, by the id of their company
 *
 * Each licence holder, past and present, has one billing account for all the licences it holds. It is built for the
 * company and address on the first licence version the company holds, and kept on that licence, so it is loaded with
 * it. They are read from the licence version rather than the licence, as a licence that shares its holder with another
 * gives up its own company for that one.
 *
 * A few billing accounts have moved address, so every 28th one built moves to a new address.
 *
 * @private
 */
function _billingAccounts(licenceEntities) {
  const SECOND_ADDRESS_EVERY = 28

  const billingAccountEntities = new Map()

  let builtCount = 0

  for (const licenceEntity of licenceEntities) {
    const billingAccounts = []
    const billingAccountAddresses = []

    for (const licenceVersion of licenceEntity.licenceVersions) {
      const { addressId, companyId: holderId } = licenceVersion

      if (billingAccountEntities.has(holderId)) {
        continue
      }

      const billingAccountEntity = buildBillingAccountEntity(
        { company: { id: holderId }, address: { id: addressId } },
        regionOf(licenceEntity).region
      )
      const { billingAccount } = billingAccountEntity
      const accountAddresses = [billingAccountEntity.billingAccountAddress]

      if (builtCount % SECOND_ADDRESS_EVERY === SECOND_ADDRESS_EVERY - 1) {
        _moveBillingAccountAddress(licenceEntity, billingAccount, accountAddresses)
      }

      billingAccounts.push(billingAccount)
      billingAccountAddresses.push(...accountAddresses)

      billingAccountEntities.set(holderId, billingAccountEntity)
      builtCount++
    }

    licenceEntity.billingAccounts = billingAccounts
    licenceEntity.billingAccountAddresses = billingAccountAddresses
  }

  return billingAccountEntities
}

/**
 * Move a billing account to a new address
 *
 * Its first address ends on 31 March 2024, and a new address starts on 1 April 2024. The new address is added to the
 * licence's addresses so it is loaded with it.
 *
 * @private
 */
function _moveBillingAccountAddress(licenceEntity, billingAccount, billingAccountAddresses) {
  const address = addressData()
  const secondBillingAccountAddress = billingAccountAddressData(billingAccount, address)

  billingAccountAddresses[0].endDate = '2024-03-31'
  secondBillingAccountAddress.startDate = '2024-04-01'
  billingAccountAddresses.push(secondBillingAccountAddress)

  licenceEntity.addresses.push(address)
}

/**
 * Give every licence empty lists for its charge versions, charge references, charge elements and licence agreements
 *
 * The steps that follow add to them. They are added after the billing accounts, as the load service loads tables in
 * the order their keys first appear, and charge versions refer to billing accounts.
 *
 * @private
 */
function _addChargeLists(licenceEntities) {
  for (const licenceEntity of licenceEntities) {
    licenceEntity.chargeVersions = []
    licenceEntity.chargeReferences = []
    licenceEntity.chargeElements = []
    licenceEntity.licenceAgreements = []
  }
}

/**
 * Give every licence that started before the sroc start date its alcs charge versions
 *
 * They were brought over from NALD. Many brought over from NALD have no charge reference, so 2 in every 5 licences have
 * no charge reference or billing account on their alcs charge versions. NALD left about a third of the alcs charge
 * versions on licences that ended before the sroc start date with no end date, so every 3rd of those licences has its
 * last alcs charge version left open. About half of the alcs charge versions with a charge reference on a licence
 * version with two purposes have one for each purpose, so every 2nd licence with such a version does.
 *
 * @private
 */
function _chargeLicencesFromAlcs(licenceEntities, billingAccountEntities) {
  const ALCS_REFERENCED = [true, true, false, true, false]
  const OPEN_ALCS_EVERY = 3
  const REFERENCE_EACH_PURPOSE_EVERY = 2

  const alcsLicenceEntities = licenceEntities.filter((licenceEntity) => {
    return licenceEntity.licence.startDate < srocStartDate
  })

  const referencedLicenceEntities = alcsLicenceEntities.filter((_licenceEntity, index) => {
    return ALCS_REFERENCED[index % ALCS_REFERENCED.length]
  })

  const openLicenceEntities = alcsLicenceEntities
    .filter((licenceEntity) => {
      const endDate = licenceEndDate(licenceEntity)

      return endDate && endDate < srocStartDate
    })
    .filter((_licenceEntity, index) => {
      return index % OPEN_ALCS_EVERY === OPEN_ALCS_EVERY - 1
    })

  const referenceEachPurposeLicenceEntities = referencedLicenceEntities
    .filter((licenceEntity) => {
      return licenceEntity.licenceVersions.some((licenceVersion) => {
        return licenceVersion.startDate < srocStartDate && purposesOn(licenceEntity, licenceVersion).length === 2
      })
    })
    .filter((_licenceEntity, index) => {
      return index % REFERENCE_EACH_PURPOSE_EVERY === REFERENCE_EACH_PURPOSE_EVERY - 1
    })

  for (const licenceEntity of alcsLicenceEntities) {
    _chargeFromAlcs(
      licenceEntity,
      billingAccountEntities,
      referencedLicenceEntities.includes(licenceEntity),
      openLicenceEntities.includes(licenceEntity),
      referenceEachPurposeLicenceEntities.includes(licenceEntity)
    )
  }
}

/**
 * Give the live licences their sroc charge versions
 *
 * Nearly every live licence has sroc charge versions, so every one except every 18th is given them. A few are
 * non-chargeable, so every 24th of those is made for the next non-chargeable reason in the list, about half of which
 * are transfer type licence.
 *
 * @private
 */
function _chargeLiveLicencesFromSroc(licenceEntities, billingAccountEntities) {
  const NON_CHARGEABLE_EVERY = 24
  const NON_CHARGEABLE_REASONS = [
    ChangeReasonHelper.select(20),
    ChangeReasonHelper.select(13),
    ChangeReasonHelper.select(20),
    ChangeReasonHelper.select(17),
    ChangeReasonHelper.select(20),
    ChangeReasonHelper.select(21),
    ChangeReasonHelper.select(20),
    ChangeReasonHelper.select(19),
    ChangeReasonHelper.select(20),
    ChangeReasonHelper.select(16)
  ]
  const UNCHARGED_EVERY = 18

  const liveLicenceEntities = licenceEntities.filter((licenceEntity) => {
    return !licenceModel(licenceEntity).$ended()
  })

  const chargedLicenceEntities = liveLicenceEntities.filter((_licenceEntity, index) => {
    return index % UNCHARGED_EVERY !== UNCHARGED_EVERY - 1
  })

  for (let i = 0; i < chargedLicenceEntities.length; i++) {
    if (i % NON_CHARGEABLE_EVERY === NON_CHARGEABLE_EVERY - 1) {
      const reason = NON_CHARGEABLE_REASONS[Math.floor(i / NON_CHARGEABLE_EVERY) % NON_CHARGEABLE_REASONS.length]

      _chargeAsNonChargeable(chargedLicenceEntities[i], reason)
    } else {
      _chargeFromSroc(chargedLicenceEntities[i], billingAccountEntities)
    }
  }
}

/**
 * Give the licences that ended after sroc started their sroc charge versions
 *
 * A licence that has ended is given them where it ended on or after the sroc start date, however it ended, as it was
 * on sroc until then.
 *
 * @private
 */
function _chargeEndedLicencesFromSroc(licenceEntities, billingAccountEntities) {
  for (const licenceEntity of licenceEntities) {
    if (licenceModel(licenceEntity).$ended() && licenceEndDate(licenceEntity) >= srocStartDate) {
      _chargeFromSroc(licenceEntity, billingAccountEntities)
    }
  }
}

/**
 * Charge both purposes of the licence versions with two
 *
 * A sroc charge version is built with one charge reference and one charge element, for the first purpose on its licence
 * version. Each licence with a sroc charge version for a licence version with two purposes has them charged in the next
 * way from the list, the same way on each of those charge versions. About half have one reference with an element for
 * each purpose, a quarter a reference for each, and a quarter only the first purpose charged.
 *
 * @private
 */
function _chargeBothPurposes(licenceEntities) {
  const PURPOSE_CHARGING = ['elements', 'elements', 'references', 'first only']

  const twoPurposeLicenceEntities = licenceEntities.filter((licenceEntity) => {
    return _twoPurposeCharges(licenceEntity).length > 0
  })

  for (let i = 0; i < twoPurposeLicenceEntities.length; i++) {
    const licenceEntity = twoPurposeLicenceEntities[i]
    const charging = PURPOSE_CHARGING[i % PURPOSE_CHARGING.length]

    for (const { chargeReference, licenceVersionPurposes } of _twoPurposeCharges(licenceEntity)) {
      _chargeByPurpose(licenceEntity, chargeReference, licenceVersionPurposes, charging)
    }
  }
}

/**
 * The sroc charge references of a licence's charge versions for a licence version with two purposes, with those
 * purposes
 *
 * @private
 */
function _twoPurposeCharges(licenceEntity) {
  return _srocChargeVersions(licenceEntity).flatMap((chargeVersion) => {
    const licenceVersionPurposes = purposesOn(licenceEntity, licenceVersionOn(licenceEntity, chargeVersion.startDate))
    const chargeReference = licenceEntity.chargeReferences.find((srocChargeReference) => {
      return srocChargeReference.chargeVersionId === chargeVersion.id
    })

    if (licenceVersionPurposes.length !== 2 || !chargeReference) {
      return []
    }

    return [{ chargeReference, licenceVersionPurposes }]
  })
}

/**
 * Vary the sroc charge references so they are not all alike
 *
 * Each takes the next loss, water model and whether it is for a restricted source from their lists, then the charge
 * category those and its volume fall in. Most are high loss, about a third medium and a few low; a little over half are
 * restricted; models are spread about evenly. A water company licence's references are for public water supply, and the
 * rest have no additional charges. Of the references whose licence is in a region with supported sources, every 30th is
 * for the next supported source of that region; North West and South West have none. Every 12th has a winter discount
 * and every 9th an aggregate factor of a half. A few have a charge adjustment, so every 125th has a charge adjustment
 * of a half.
 *
 * @private
 */
function _varySrocReferences(licenceEntities) {
  const AGGREGATE_EVERY = 9
  const CHARGE_ADJUSTMENT_EVERY = 125
  const LOSSES = ['high', 'medium', 'high', 'low', 'high', 'medium', 'high']
  const RESTRICTED_SOURCES = [true, false, true, true, false]
  const SUPPORTED_SOURCE_EVERY = 30
  const WATER_MODELS = ['no model', 'tier 1', 'tier 2']
  const WINTER_DISCOUNT_EVERY = 12

  const srocReferences = licenceEntities.flatMap((licenceEntity) => {
    const regionName = regionOf(licenceEntity).region.displayName
    const supportedSources = SupportedSourceHelper.data.filter((supportedSource) => {
      return supportedSource.region === regionName
    })

    return _srocChargeReferences(licenceEntity).map((chargeReference) => {
      return { chargeReference, regionName, supportedSources, waterUndertaker: licenceEntity.licence.waterUndertaker }
    })
  })

  let supportedSourceCount = 0
  const nextSupportedSource = {}

  for (let i = 0; i < srocReferences.length; i++) {
    const { chargeReference, regionName, supportedSources, waterUndertaker } = srocReferences[i]

    chargeReference.additionalCharges = waterUndertaker ? { isSupplyPublicWater: true } : null

    if (supportedSources.length > 0) {
      supportedSourceCount++

      if (supportedSourceCount % SUPPORTED_SOURCE_EVERY === 0) {
        const index = nextSupportedSource[regionName] ?? 0
        const { id, name } = supportedSources[index % supportedSources.length]

        nextSupportedSource[regionName] = index + 1
        chargeReference.additionalCharges = { supportedSource: { id, name }, isSupplyPublicWater: waterUndertaker }
      }
    }
    chargeReference.loss = LOSSES[i % LOSSES.length]
    chargeReference.restrictedSource = RESTRICTED_SOURCES[i % RESTRICTED_SOURCES.length]
    chargeReference.waterModel = WATER_MODELS[i % WATER_MODELS.length]
    chargeReference.chargeCategoryId.value = _chargeCategory(chargeReference).reference

    if (i % WINTER_DISCOUNT_EVERY === WINTER_DISCOUNT_EVERY - 1) {
      chargeReference.adjustments.winter = true
    }

    if (i % AGGREGATE_EVERY === AGGREGATE_EVERY - 1) {
      chargeReference.adjustments.aggregate = '0.5'
    }

    if (i % CHARGE_ADJUSTMENT_EVERY === CHARGE_ADJUSTMENT_EVERY - 1) {
      chargeReference.adjustments.charge = '0.5'
    }
  }
}

/**
 * Give a few live licences a superseded sroc charge version
 *
 * Only a live licence with a chargeable sroc charge version is given one. About one in seven have a superseded charge
 * version, so every 7th is given one: a copy of its first sroc charge version, with its charge references and charge
 * elements, that starts on the same date, has no end date and was replaced from the start.
 *
 * The licence is not flagged for supplementary billing, as its charge history is treated as already billed.
 *
 * @private
 */
function _addSupersededVersions(licenceEntities) {
  const SUPERSEDED_EVERY = 7

  const chargedLicenceEntities = licenceEntities.filter((licenceEntity) => {
    const firstSrocChargeVersion = _srocChargeVersions(licenceEntity)[0]

    return (
      !licenceModel(licenceEntity).$ended() &&
      firstSrocChargeVersion &&
      _referenced(licenceEntity, firstSrocChargeVersion)
    )
  })

  const supersededLicenceEntities = chargedLicenceEntities.filter((_licenceEntity, index) => {
    return index % SUPERSEDED_EVERY === SUPERSEDED_EVERY - 1
  })

  for (const licenceEntity of supersededLicenceEntities) {
    const superseded = _copyChargeVersion(licenceEntity, _srocChargeVersions(licenceEntity)[0])

    superseded.status = 'superseded'
    superseded.endDate = null
  }
}

/**
 * Number each licence's charge versions in the order they were made
 *
 * They are numbered from 1 in order of their start date. A superseded charge version was made before the one that
 * replaced it, so where two start on the same date the superseded one comes first.
 *
 * @private
 */
function _numberChargeVersions(licenceEntities) {
  for (const licenceEntity of licenceEntities) {
    const chargeVersions = [...licenceEntity.chargeVersions].sort((first, second) => {
      if (first.startDate !== second.startDate) {
        return first.startDate < second.startDate ? -1 : 1
      }

      return first.status === 'superseded' ? -1 : 1
    })

    for (let i = 0; i < chargeVersions.length; i++) {
      chargeVersions[i].versionNumber = i + 1
    }
  }
}

/**
 * Give a few licences a section 130U agreement
 *
 * Besides two-part tariff, a few licences have another kind of agreement, most often section 130U, so every 180th
 * licence is given one. It is added to the licence's agreements, so a licence with a two-part tariff agreement keeps
 * that one too. A licence with a section 130 agreement has the section 130 adjustment on its sroc charge references, so
 * each sroc charge reference the licence has is given it.
 *
 * @private
 */
function _addOtherAgreements(licenceEntities) {
  const S130U_EVERY = 180

  const s130uLicenceEntities = licenceEntities.filter((_licenceEntity, index) => {
    return index % S130U_EVERY === S130U_EVERY - 1
  })

  for (const licenceEntity of s130uLicenceEntities) {
    const licenceAgreement = licenceAgreementData(licenceEntity.licence)

    licenceAgreement.financialAgreementId.value = 'S130U'

    licenceEntity.licenceAgreements.push(licenceAgreement)

    const srocReferences = _srocChargeReferences(licenceEntity)

    for (const chargeReference of srocReferences) {
      chargeReference.adjustments.s130 = true
    }
  }
}

/**
 * Give a licence its alcs charge versions
 *
 * Each licence version that started before the sroc start date, and before the licence ended, has an alcs charge
 * version for its holder. It starts when the licence version did and ends when it did, or when the alcs scheme did or
 * the licence ended where that was earlier. The first was made for a new licence, and each one after for why its
 * licence version changed. They were brought over from NALD.
 *
 * Where it is `open`, the last has no end date, as NALD left it. Where it is not `referenced` they have no charge
 * reference, billing account or company, as NALD has none of them. Otherwise each has a charge reference for the first
 * purpose on its licence version, or one for each purpose where `referenceEachPurpose` and the licence version has two.
 * Where one of the charge references is for two-part tariff, the licence is given a two-part tariff (S127) agreement,
 * starting when the first charge version with one did, as that is when two-part tariff began.
 *
 * @private
 */
function _chargeFromAlcs(licenceEntity, billingAccountEntities, referenced, open, referenceEachPurpose) {
  const endDate = licenceEndDate(licenceEntity)
  const alcsEndDate = _alcsEndDate(licenceEntity)
  const alcsLicenceVersions = licenceEntity.licenceVersions.filter((licenceVersion) => {
    return licenceVersion.startDate < srocStartDate && (!endDate || licenceVersion.startDate <= endDate)
  })

  const chargeReferences = []

  for (let i = 0; i < alcsLicenceVersions.length; i++) {
    const licenceVersion = alcsLicenceVersions[i]
    const chargeVersion = _chargeVersionFor(licenceEntity, licenceVersion, billingAccountEntities)

    chargeVersion.scheme = 'alcs'
    chargeVersion.source = 'nald'
    chargeVersion.createdBy = null
    chargeVersion.approvedBy = null
    chargeVersion.startDate = licenceVersion.startDate
    chargeVersion.endDate =
      licenceVersion.endDate && licenceVersion.endDate < alcsEndDate ? licenceVersion.endDate : alcsEndDate
    chargeVersion.changeReasonId.value =
      i === 0 ? ChangeReasonHelper.select(11).description : _changeReason(alcsLicenceVersions[i - 1], licenceVersion)

    if (open && i === alcsLicenceVersions.length - 1) {
      chargeVersion.endDate = null
    }

    licenceEntity.chargeVersions.push(chargeVersion)

    if (!referenced) {
      chargeVersion.billingAccountId = null
      chargeVersion.companyId = null

      continue
    }

    const licenceVersionPurposes = purposesOn(licenceEntity, licenceVersion)
    const purposesToReference =
      referenceEachPurpose && licenceVersionPurposes.length === 2 ? licenceVersionPurposes : [licenceVersionPurposes[0]]

    for (const licenceVersionPurpose of purposesToReference) {
      const chargeReference = chargeReferencePresrocData(chargeVersion, licenceVersionPurpose)

      chargeReferences.push(chargeReference)
      licenceEntity.chargeReferences.push(chargeReference)
    }
  }

  const firstTwoPartTariffReference = chargeReferences.find((chargeReference) => {
    return chargeReference.section127Agreement
  })

  if (!firstTwoPartTariffReference) {
    return
  }

  const firstTwoPartTariffChargeVersion = licenceEntity.chargeVersions.find((chargeVersion) => {
    return chargeVersion.id === firstTwoPartTariffReference.chargeVersionId
  })
  const licenceAgreement = licenceAgreementData(licenceEntity.licence)

  licenceAgreement.startDate = firstTwoPartTariffChargeVersion.startDate

  licenceEntity.licenceAgreements.push(licenceAgreement)
}

/**
 * Give a licence its non-chargeable sroc charge versions
 *
 * Each licence version in force on or after the sroc start date, and before the licence ended, has a non-chargeable
 * sroc charge version. It starts when the licence version did, or on the sroc start date where that was later, and ends
 * when the licence version did. The last one has no end date. Each is made for the given non-chargeable `reason`, so it
 * has no charge reference, charge element or billing account.
 *
 * @private
 */
function _chargeAsNonChargeable(licenceEntity, reason) {
  const srocLicenceVersions = _srocLicenceVersions(licenceEntity)

  for (let i = 0; i < srocLicenceVersions.length; i++) {
    const licenceVersion = srocLicenceVersions[i]
    const chargeVersion = chargeVersionData({ id: null }, licenceEntity.licence, regionOf(licenceEntity).region)

    chargeVersion.startDate = licenceVersion.startDate > srocStartDate ? licenceVersion.startDate : srocStartDate
    chargeVersion.endDate = i < srocLicenceVersions.length - 1 ? licenceVersion.endDate : null
    chargeVersion.changeReasonId.value = reason.description
    chargeVersion.billingAccountId = null

    licenceEntity.chargeVersions.push(chargeVersion)
  }
}

/**
 * Charge both purposes of a licence version on its sroc charge version
 *
 * The charge version was built with one charge reference and one charge element, for the first purpose on its licence
 * version. Where `charging` is 'elements' they are replaced with one charge reference for both purposes, with a charge
 * element for each. Where it is 'references' they are replaced with a charge reference and charge element for each
 * purpose. Where it is 'first only' they are left as they are.
 *
 * @private
 */
function _chargeByPurpose(licenceEntity, chargeReference, licenceVersionPurposes, charging) {
  if (charging === 'first only') {
    return
  }

  const chargeVersion = licenceEntity.chargeVersions.find((srocChargeVersion) => {
    return srocChargeVersion.id === chargeReference.chargeVersionId
  })

  licenceEntity.chargeReferences = licenceEntity.chargeReferences.filter((builtChargeReference) => {
    return builtChargeReference !== chargeReference
  })
  licenceEntity.chargeElements = licenceEntity.chargeElements.filter((chargeElement) => {
    return chargeElement.chargeReferenceId !== chargeReference.id
  })

  if (charging === 'elements') {
    const purposesChargeReference = chargeReferenceData(chargeVersion, licenceVersionPurposes)

    licenceEntity.chargeReferences.push(purposesChargeReference)

    for (const licenceVersionPurpose of licenceVersionPurposes) {
      licenceEntity.chargeElements.push(chargeElementData(purposesChargeReference, licenceVersionPurpose))
    }

    return
  }

  for (let i = 0; i < licenceVersionPurposes.length; i++) {
    const purposeChargeReference = chargeReferenceData(chargeVersion, [licenceVersionPurposes[i]])

    purposeChargeReference.description = `Test charge reference ${i + 1}`

    licenceEntity.chargeReferences.push(purposeChargeReference)
    licenceEntity.chargeElements.push(chargeElementData(purposeChargeReference, licenceVersionPurposes[i]))
  }
}

/**
 * Give a licence its sroc charge versions
 *
 * Each licence version in force on or after the sroc start date, and before the licence ended, has a sroc charge
 * version for its holder. It starts when the licence version did, or on the sroc start date where that was later, and
 * ends when the licence version did. The last one has no end date, even where the licence has ended, as a charge
 * version is not ended when its licence is. The first was made because the licence moved onto sroc where it started
 * before the sroc start date, or for a new licence where it did not. Each one after was made for why its licence
 * version changed.
 *
 * Each has a charge reference and charge element for the first purpose on its licence version.
 *
 * @private
 */
function _chargeFromSroc(licenceEntity, billingAccountEntities) {
  const srocLicenceVersions = _srocLicenceVersions(licenceEntity)

  for (let i = 0; i < srocLicenceVersions.length; i++) {
    const licenceVersion = srocLicenceVersions[i]
    const chargeVersion = _chargeVersionFor(licenceEntity, licenceVersion, billingAccountEntities)

    chargeVersion.startDate = licenceVersion.startDate > srocStartDate ? licenceVersion.startDate : srocStartDate
    chargeVersion.endDate = i < srocLicenceVersions.length - 1 ? licenceVersion.endDate : null

    if (i > 0) {
      chargeVersion.changeReasonId.value = _changeReason(srocLicenceVersions[i - 1], licenceVersion)
    } else if (licenceEntity.licence.startDate < srocStartDate) {
      chargeVersion.changeReasonId.value = ChangeReasonHelper.select(24).description
    }

    const firstPurpose = purposesOn(licenceEntity, licenceVersion)[0]
    const chargeReference = chargeReferenceData(chargeVersion, [firstPurpose])

    licenceEntity.chargeVersions.push(chargeVersion)
    licenceEntity.chargeReferences.push(chargeReference)
    licenceEntity.chargeElements.push(chargeElementData(chargeReference, firstPurpose))
  }
}

/**
 * The licence versions a licence is charged for on sroc
 *
 * These are the ones in force on or after the sroc start date, and starting before the licence ended.
 *
 * @private
 */
function _srocLicenceVersions(licenceEntity) {
  const endDate = licenceEndDate(licenceEntity)

  return licenceEntity.licenceVersions.filter((licenceVersion) => {
    return (
      (!licenceVersion.endDate || licenceVersion.endDate >= srocStartDate) &&
      (!endDate || licenceVersion.startDate <= endDate)
    )
  })
}

/**
 * The date a licence's alcs charge version ends, which is the day before sroc started, or when the licence ended where
 * that was earlier
 *
 * @private
 */
function _alcsEndDate(licenceEntity) {
  const endDate = licenceEndDate(licenceEntity)

  if (endDate && endDate < srocStartDate) {
    return endDate
  }

  return addDays(srocStartDate, -1)
}

/**
 * Whether a charge version has a charge reference
 *
 * @private
 */
function _referenced(licenceEntity, chargeVersion) {
  return licenceEntity.chargeReferences.some((chargeReference) => {
    return chargeReference.chargeVersionId === chargeVersion.id
  })
}

/**
 * A licence's sroc charge references
 *
 * @private
 */
function _srocChargeReferences(licenceEntity) {
  return licenceEntity.chargeReferences.filter((chargeReference) => {
    return chargeReference.scheme === 'sroc'
  })
}

/**
 * A licence's sroc charge versions, in order of their start date
 *
 * @private
 */
function _srocChargeVersions(licenceEntity) {
  const srocChargeVersions = licenceEntity.chargeVersions.filter((chargeVersion) => {
    return chargeVersion.scheme === 'sroc'
  })

  return srocChargeVersions.sort((first, second) => {
    return first.startDate < second.startDate ? -1 : 1
  })
}

/**
 * Copy a charge version onto a licence, with its charge references and charge elements, and return the copy
 *
 * Every copy is given a new id, and its charge references and charge elements point at the copies they belong to.
 *
 * @private
 */
function _copyChargeVersion(licenceEntity, chargeVersion) {
  const chargeVersionCopy = structuredClone(chargeVersion)

  chargeVersionCopy.id = generateUUID()

  licenceEntity.chargeVersions.push(chargeVersionCopy)

  const chargeReferences = licenceEntity.chargeReferences.filter((chargeReference) => {
    return chargeReference.chargeVersionId === chargeVersion.id
  })

  for (const chargeReference of chargeReferences) {
    const chargeReferenceCopy = structuredClone(chargeReference)

    chargeReferenceCopy.id = generateUUID()
    chargeReferenceCopy.chargeVersionId = chargeVersionCopy.id

    licenceEntity.chargeReferences.push(chargeReferenceCopy)

    const chargeElements = licenceEntity.chargeElements.filter((chargeElement) => {
      return chargeElement.chargeReferenceId === chargeReference.id
    })

    for (const chargeElement of chargeElements) {
      const chargeElementCopy = structuredClone(chargeElement)

      chargeElementCopy.id = generateUUID()
      chargeElementCopy.chargeReferenceId = chargeReferenceCopy.id

      licenceEntity.chargeElements.push(chargeElementCopy)
    }
  }

  return chargeVersionCopy
}

/**
 * The charge category for a sroc charge reference
 *
 * It is the one of the engine's charge categories for a non-tidal source with the reference's loss, water model and
 * restricted source, whose volume band its volume falls in. Where none matches, it throws an error saying what the
 * reference has, rather than leaving the reference without a category.
 *
 * @private
 */
function _chargeCategory(chargeReference) {
  const { loss, restrictedSource, volume, waterModel } = chargeReference

  const chargeCategory = ChargeCategoryHelper.data.find((category) => {
    return (
      !category.tidal &&
      category.lossFactor === loss &&
      category.modelTier === waterModel &&
      category.restrictedSource === restrictedSource &&
      volume > category.minVolume &&
      volume <= category.maxVolume
    )
  })

  if (!chargeCategory) {
    throw new Error(
      `No charge category for a non-tidal ${loss} loss reference with ${waterModel}, restricted source ` +
        `${restrictedSource} and a volume of ${volume}`
    )
  }

  return chargeCategory
}

/**
 * The change reason for a charge version, from why its licence version changed from the one before
 *
 * A transfer is a succession or transfer, a correction is a minor change, and a new issue is a major change.
 *
 * @private
 */
function _changeReason(previousLicenceVersion, licenceVersion) {
  const CHANGE_REASONS = {
    transfer: ChangeReasonHelper.select(8).description,
    correction: ChangeReasonHelper.select(1).description,
    'new-issue': ChangeReasonHelper.select(0).description
  }

  return CHANGE_REASONS[licenceVersionChange(previousLicenceVersion, licenceVersion)]
}

/**
 * A charge version for a licence version, billed to the account of that licence version's holder
 *
 * It is for the billing account's company, as the service sets it when a charge version is created.
 *
 * @private
 */
function _chargeVersionFor(licenceEntity, licenceVersion, billingAccountEntities) {
  const { billingAccount } = billingAccountEntities.get(licenceVersion.companyId)
  const chargeVersion = chargeVersionData(billingAccount, licenceEntity.licence, regionOf(licenceEntity).region)

  chargeVersion.companyId = billingAccount.companyId

  return chargeVersion
}
