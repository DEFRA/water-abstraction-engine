import ChangeReasonHelper from '../../../test/support/helpers/change-reason.helper.js'
import ChargeCategoryHelper from '../../../test/support/helpers/charge-category.helper.js'
import PurposeHelper from '../../../test/support/helpers/purpose.helper.js'
import chargeElementData from '../data/charge-element.data.js'
import chargeReferenceData from '../data/charge-reference.data.js'
import chargeVersionData from '../data/charge-version.data.js'
import { licenceModel } from './helpers/end-dates.helpers.js'
import { purposesOn } from './helpers/purposes.helpers.js'
import { regionOf } from './helpers/regions.helpers.js'
import { srocStartDate } from '../default-values.js'
import workflowData from '../data/workflow.data.js'

/**
 * Put the licences in the workflow
 *
 * Each licence is given an empty list for its workflow records. Most live licences without a sroc charge version are
 * not in the workflow, so only every 7th of them is waiting for its charge information to be set up, and every 10th of
 * the rest has had it set up and is waiting for it to be approved. The licence versions since sroc started are then
 * given the workflow records that were removed.
 *
 * Call this after charging, as the workflow records are for the licences' charge versions.
 *
 * @param {object[]} licenceEntities - the licence entities to put in the workflow
 */
export default function workflows(licenceEntities) {
  const IN_REVIEW_EVERY = 10
  const TO_SET_UP_EVERY = 7

  for (const licenceEntity of licenceEntities) {
    licenceEntity.workflows = []
  }

  const billingAccounts = licenceEntities.flatMap((licenceEntity) => {
    return licenceEntity.billingAccounts
  })

  const unchargedLicenceEntities = licenceEntities.filter((licenceEntity) => {
    const srocCharged = licenceEntity.chargeVersions.some((chargeVersion) => {
      return chargeVersion.scheme === 'sroc'
    })

    return !licenceModel(licenceEntity).$ended() && !srocCharged
  })

  const toSetUpLicenceEntities = unchargedLicenceEntities.filter((_licenceEntity, index) => {
    return index % TO_SET_UP_EVERY === TO_SET_UP_EVERY - 1
  })

  for (const licenceEntity of toSetUpLicenceEntities) {
    _toSetUp(licenceEntity)
  }

  const inReviewLicenceEntities = unchargedLicenceEntities
    .filter((_licenceEntity, index) => {
      return index % TO_SET_UP_EVERY !== TO_SET_UP_EVERY - 1
    })
    .filter((_licenceEntity, index) => {
      return index % IN_REVIEW_EVERY === IN_REVIEW_EVERY - 1
    })

  for (const licenceEntity of inReviewLicenceEntities) {
    _inReview(licenceEntity, billingAccounts)
  }

  _addRemovedWorkflows(licenceEntities)
}

/**
 * Put a licence in the workflow waiting for its charge information to be set up
 *
 * It is for the licence's current licence version, which is the last one. Nobody has started on it yet, so it has no
 * charge version and was not created by anyone. It says whether the licence has a charge version.
 *
 * @private
 */
function _toSetUp(licenceEntity) {
  const workflow = workflowData(licenceEntity.licence)

  workflow.status = 'to_setup'
  workflow.licenceVersionId = licenceEntity.licenceVersions.at(-1).id
  workflow.createdBy = null
  workflow.data = { chargeVersion: null, chargeVersionExists: licenceEntity.chargeVersions.length > 0 }

  licenceEntity.workflows.push(workflow)
}

/**
 * Put a licence in the workflow with its charge information set up and waiting to be approved
 *
 * It is for the licence's current licence version, and was set up by the billing and data user for the licence holder's
 * billing account. The licence has never been charged on sroc, so it starts on the sroc start date, or when the licence
 * started where that was later. It is for the move onto sroc where the licence started before the sroc start date, or
 * for a new licence where it did not.
 *
 * It has a charge reference and charge element for the first purpose on the licence version, built as a sroc charge
 * version's are. They are only held in the workflow record, as they are not charged until it is approved.
 *
 * @private
 */
function _inReview(licenceEntity, billingAccounts) {
  const { licence } = licenceEntity
  const licenceVersion = licenceEntity.licenceVersions.at(-1)
  const billingAccount = billingAccounts.find((account) => {
    return account.companyId === licenceVersion.companyId
  })
  const workflow = workflowData(licence)
  const reason = licence.startDate < srocStartDate ? ChangeReasonHelper.select(24) : ChangeReasonHelper.select(11)

  const chargeVersion = chargeVersionData(billingAccount, licence, regionOf(licenceEntity).region)
  const firstPurpose = purposesOn(licenceEntity, licenceVersion)[0]
  const chargeReference = chargeReferenceData(chargeVersion, [firstPurpose])
  const chargeElement = chargeElementData(chargeReference, firstPurpose)

  workflow.licenceVersionId = licenceVersion.id
  workflow.data.chargeVersion.dateRange.startDate =
    licence.startDate > srocStartDate ? licence.startDate : srocStartDate
  workflow.data.chargeVersion.changeReason = _draftChangeReason(reason.description)
  workflow.data.chargeVersion.invoiceAccount = { id: billingAccount.id, invoiceAccountAddresses: [] }
  workflow.data.chargeVersion.chargeElements = _draftChargeElements([chargeReference], [chargeElement])

  licenceEntity.workflows.push(workflow)
}

/**
 * Give the licence versions that started on or after the sroc start date the workflow records that were removed
 *
 * When a licence version is added, the licence is put in the workflow waiting for its charge information to be set up.
 * Once someone has dealt with it, the workflow record is removed, but it is kept with a deleted date. Most licence
 * versions since sroc started have one, so every one does except every 6th, and except one already in the workflow.
 *
 * About a fifth of them had their charge information set up and approved, so every 4th given one is for the charge
 * version that was approved, where the licence version has a current sroc charge version starting when it did. The rest
 * were waiting for their charge information to be set up.
 *
 * @private
 */
function _addRemovedWorkflows(licenceEntities) {
  const APPROVED_EVERY = 4
  const NONE_EVERY = 6

  let count = 0
  let givenCount = 0

  for (const licenceEntity of licenceEntities) {
    for (const licenceVersion of licenceEntity.licenceVersions) {
      if (licenceVersion.startDate < srocStartDate) {
        continue
      }

      const inWorkflow = licenceEntity.workflows.some((workflow) => {
        return workflow.licenceVersionId === licenceVersion.id
      })

      if (inWorkflow) {
        continue
      }

      count++

      if (count % NONE_EVERY === 0) {
        continue
      }

      givenCount++

      const approvedChargeVersion = licenceEntity.chargeVersions.find((chargeVersion) => {
        return (
          chargeVersion.scheme === 'sroc' &&
          chargeVersion.status === 'current' &&
          chargeVersion.startDate === licenceVersion.startDate
        )
      })

      if (givenCount % APPROVED_EVERY === 0 && approvedChargeVersion) {
        _approvedReview(licenceEntity, licenceVersion, approvedChargeVersion)

        continue
      }

      const chargeVersionExists = licenceEntity.chargeVersions.some((chargeVersion) => {
        return chargeVersion.startDate < licenceVersion.startDate
      })

      _removedToSetUp(licenceEntity, licenceVersion, chargeVersionExists)
    }
  }
}

/**
 * Add a workflow record for a licence version whose charge information was set up and approved
 *
 * It holds the charge version as it was when it went for review, with the same start date, reason, billing account and
 * charge references as the charge version that was approved. A non-chargeable one has no billing account, so it has no
 * billing account in the workflow record either. Approving it removed the workflow record.
 *
 * @private
 */
function _approvedReview(licenceEntity, licenceVersion, chargeVersion) {
  const workflow = workflowData(licenceEntity.licence)
  const chargeReferences = licenceEntity.chargeReferences.filter((chargeReference) => {
    return chargeReference.chargeVersionId === chargeVersion.id
  })
  const chargeElements = licenceEntity.chargeElements.filter((chargeElement) => {
    return chargeReferences.some((chargeReference) => {
      return chargeReference.id === chargeElement.chargeReferenceId
    })
  })

  workflow.licenceVersionId = licenceVersion.id
  workflow.data.chargeVersion.dateRange.startDate = chargeVersion.startDate
  workflow.data.chargeVersion.changeReason = _draftChangeReason(chargeVersion.changeReasonId.value)
  workflow.data.chargeVersion.chargeElements = _draftChargeElements(chargeReferences, chargeElements)

  if (chargeVersion.billingAccountId) {
    workflow.data.chargeVersion.invoiceAccount = { id: chargeVersion.billingAccountId, invoiceAccountAddresses: [] }
  }

  workflow.deletedAt = new Date()

  licenceEntity.workflows.push(workflow)
}

/**
 * Add a workflow record for a licence version that was waiting for its charge information to be set up, and has since
 * been removed
 *
 * Nobody started on it, so it has no charge version and was not created by anyone.
 *
 * @private
 */
function _removedToSetUp(licenceEntity, licenceVersion, chargeVersionExists) {
  const workflow = workflowData(licenceEntity.licence)

  workflow.status = 'to_setup'
  workflow.licenceVersionId = licenceVersion.id
  workflow.createdBy = null
  workflow.data = { chargeVersion: null, chargeVersionExists }
  workflow.deletedAt = new Date()

  licenceEntity.workflows.push(workflow)
}

/**
 * The change reason as a draft charge version in the workflow holds it, found by its description
 *
 * @private
 */
function _draftChangeReason(description) {
  const changeReason = ChangeReasonHelper.data.find((reason) => {
    return reason.description === description
  })

  return {
    description: changeReason.description,
    id: changeReason.id,
    isEnabledForNewChargeVersions: changeReason.enabledForNewChargeVersions,
    triggersMinimumCharge: changeReason.triggersMinimumCharge,
    type: changeReason.type
  }
}

/**
 * The charge references as a draft charge version in the workflow holds them, each with its charge elements
 *
 * The draft calls a charge reference a charge element, and a charge element a charge purpose. The charge category and
 * purpose are held in full, rather than by their ids.
 *
 * @private
 */
function _draftChargeElements(chargeReferences, chargeElements) {
  return chargeReferences.map((chargeReference) => {
    const chargeCategory = ChargeCategoryHelper.data.find((category) => {
      return category.reference === chargeReference.chargeCategoryId.value
    })
    const referenceElements = chargeElements.filter((chargeElement) => {
      return chargeElement.chargeReferenceId === chargeReference.id
    })

    return {
      additionalCharges: chargeReference.additionalCharges,
      adjustments: chargeReference.adjustments,
      chargeCategory: {
        id: chargeCategory.id,
        reference: chargeCategory.reference,
        shortDescription: chargeCategory.shortDescription
      },
      chargePurposes: referenceElements.map((chargeElement) => {
        return _draftChargePurpose(chargeElement)
      }),
      description: chargeReference.description,
      eiucRegion: chargeReference.eiucRegion,
      eiucSource: chargeReference.source === 'tidal' ? 'tidal' : 'other',
      isFactorsOverridden: null,
      isRestrictedSource: chargeReference.restrictedSource,
      isSection127AgreementEnabled: chargeReference.section127Agreement,
      loss: chargeReference.loss,
      scheme: chargeReference.scheme,
      season: null,
      source: chargeReference.source,
      volume: chargeReference.volume,
      waterModel: chargeReference.waterModel
    }
  })
}

/**
 * A charge element as a draft charge version in the workflow holds it
 *
 * @private
 */
function _draftChargePurpose(chargeElement) {
  const purpose = PurposeHelper.data.find((purposeUse) => {
    return purposeUse.legacyId === chargeElement.purposeId.value
  })

  return {
    abstractionPeriod: {
      endDay: chargeElement.abstractionPeriodEndDay,
      endMonth: chargeElement.abstractionPeriodEndMonth,
      startDay: chargeElement.abstractionPeriodStartDay,
      startMonth: chargeElement.abstractionPeriodStartMonth
    },
    authorisedAnnualQuantity: chargeElement.authorisedAnnualQuantity,
    billableAnnualQuantity: null,
    description: chargeElement.description,
    isSection127AgreementEnabled: chargeElement.section127Agreement,
    loss: chargeElement.loss,
    maxAnnualQuantity: chargeElement.authorisedAnnualQuantity,
    purposeUse: {
      code: purpose.legacyId,
      id: purpose.id,
      isTwoPartTariff: purpose.twoPartTariff,
      lossFactor: purpose.lossFactor,
      name: purpose.description
    }
  }
}
