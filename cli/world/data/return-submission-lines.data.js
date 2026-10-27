import { generateUUID } from '../../../test/support/generators.js'
import { splitTotalVolume } from '../helpers/conversion.helpers.js'

/**
 * Build twelve monthly return submission line records, splitting the total volume between them
 *
 * @param {object} period - the return period
 * @param {object} returnSubmission - the return submission record
 * @param {number} totalVolume - the total volume to split across the lines
 *
 * @returns {object[]} the data to load
 */
export default function (period, returnSubmission, totalVolume) {
  const startYear = period.startDate.getFullYear()
  const endYear = period.endDate.getFullYear()

  const splitVolumes = splitTotalVolume(totalVolume, 12)

  return [
    {
      id: generateUUID(),
      returnSubmissionId: returnSubmission.id,
      startDate: `${startYear}-04-01`,
      endDate: `${startYear}-04-30`,
      quantity: splitVolumes[0]
    },
    {
      id: generateUUID(),
      returnSubmissionId: returnSubmission.id,
      startDate: `${startYear}-05-01`,
      endDate: `${startYear}-05-31`,
      quantity: splitVolumes[1]
    },
    {
      id: generateUUID(),
      returnSubmissionId: returnSubmission.id,
      startDate: `${startYear}-06-01`,
      endDate: `${startYear}-06-30`,
      quantity: splitVolumes[2]
    },
    {
      id: generateUUID(),
      returnSubmissionId: returnSubmission.id,
      startDate: `${startYear}-07-01`,
      endDate: `${startYear}-07-31`,
      quantity: splitVolumes[3]
    },
    {
      id: generateUUID(),
      returnSubmissionId: returnSubmission.id,
      startDate: `${startYear}-08-01`,
      endDate: `${startYear}-08-31`,
      quantity: splitVolumes[4]
    },
    {
      id: generateUUID(),
      returnSubmissionId: returnSubmission.id,
      startDate: `${startYear}-09-01`,
      endDate: `${startYear}-09-30`,
      quantity: splitVolumes[5]
    },
    {
      id: generateUUID(),
      returnSubmissionId: returnSubmission.id,
      startDate: `${startYear}-10-01`,
      endDate: `${startYear}-10-31`,
      quantity: splitVolumes[6]
    },
    {
      id: generateUUID(),
      returnSubmissionId: returnSubmission.id,
      startDate: `${startYear}-11-01`,
      endDate: `${startYear}-11-30`,
      quantity: splitVolumes[7]
    },
    {
      id: generateUUID(),
      returnSubmissionId: returnSubmission.id,
      startDate: `${startYear}-12-01`,
      endDate: `${startYear}-12-31`,
      quantity: splitVolumes[8]
    },
    {
      id: generateUUID(),
      returnSubmissionId: returnSubmission.id,
      startDate: `${endYear}-01-01`,
      endDate: `${endYear}-01-31`,
      quantity: splitVolumes[9]
    },
    {
      id: generateUUID(),
      returnSubmissionId: returnSubmission.id,
      startDate: `${endYear}-02-01`,
      endDate: `${endYear}-02-28`,
      quantity: splitVolumes[10]
    },
    {
      id: generateUUID(),
      returnSubmissionId: returnSubmission.id,
      startDate: `${endYear}-03-01`,
      endDate: `${endYear}-03-31`,
      quantity: splitVolumes[11]
    }
  ]
}
