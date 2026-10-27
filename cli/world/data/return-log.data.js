import { generateUUID } from '../../../test/support/generators.js'
import { purposeDescription } from '../helpers/purpose.helpers.js'
import { determineReturnCycleStartDate, formatDateToIso } from '../helpers/date.helpers.js'

/**
 * Build a return log record for a return requirement and return period
 *
 * @param {object} licence - the licence record
 * @param {object} returnRequirement - the return requirement record
 * @param {object[]} returnRequirementPurposes - the return requirement purpose records
 * @param {object[]} points - the point records
 * @param {object} period - the return period
 * @param {object} region - the region record
 *
 * @returns {object} the data to load
 */
export default function (licence, returnRequirement, returnRequirementPurposes, points, period, region) {
  const returnLogId = generateUUID()

  const startDate = new Date(period.startDate)
  const endDate = new Date(period.endDate)

  const startDateString = formatDateToIso(startDate)
  const endDateString = formatDateToIso(endDate)
  const dueDateString = period.dueDate ? formatDateToIso(new Date(period.dueDate)) : null

  const returnCycleStartDate = determineReturnCycleStartDate(startDate, returnRequirement.summer)

  return {
    id: returnLogId,
    returnId: `v1:${region.naldRegionId}:${licence.licenceRef}:${returnRequirement.reference}:${startDateString}:${endDateString}`,
    returnReference: returnRequirement.reference,
    licenceRef: licence.licenceRef,
    metadata: {
      nald: {
        areaCode: 'AREA',
        formatId: returnRequirement.reference,
        regionCode: region.naldRegionId,
        periodEndDay: returnRequirement.abstractionPeriodEndDay,
        periodEndMonth: returnRequirement.abstractionPeriodEndMonth,
        periodStartDay: returnRequirement.abstractionPeriodStartDay,
        periodStartMonth: returnRequirement.abstractionPeriodStartMonth
      },
      points: points.map((point) => {
        return {
          name: point.description,
          ngr1: point.ngr1,
          ngr2: null,
          ngr3: null,
          ngr4: null
        }
      }),
      isFinal: false,
      version: 1,
      isSummer: returnRequirement.summer,
      isUpload: false,
      purposes: _purposes(returnRequirementPurposes),
      isCurrent: true,
      description: returnRequirement.siteDescription,
      isTwoPartTariff: returnRequirement.twoPartTariff
    },
    returnsFrequency: 'month',
    startDate: startDateString,
    endDate: endDateString,
    dueDate: dueDateString,
    source: 'WRLS',
    status: 'due',
    underQuery: false,
    returnCycleId: {
      schema: 'public',
      table: 'returnCycles',
      lookup: 'startDate',
      value: formatDateToIso(returnCycleStartDate),
      select: 'id'
    },
    returnRequirementId: returnRequirement.id,
    quarterly: period.quarterly
  }
}

/**
 * The return requirements data setup up the return requirements purpose.
 *
 * These are actually look-up values for the load function to handle, but the purpose 'code' is hard-coded in the
 * return requirement data. So we can use this here to help align wth our goal of making the data as real as possible.
 *
 * @private
 */
function _purposes(returnRequirementPurposes) {
  return returnRequirementPurposes.map((returnRequirementPurpose) => {
    return {
      alias: returnRequirementPurpose.alias,
      primary: {
        code: returnRequirementPurpose.primaryPurposeId.value,
        description: 'Agriculture'
      },
      secondary: {
        code: returnRequirementPurpose.secondaryPurposeId.value,
        description: 'General Agriculture'
      },
      tertiary: {
        code: returnRequirementPurpose.purposeId.value,
        description: purposeDescription(returnRequirementPurpose.purposeId.value)
      }
    }
  })
}
