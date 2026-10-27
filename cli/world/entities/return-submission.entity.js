import returnSubmissionData from '../data/return-submission.data.js'
import returnSubmissionLinesData from '../data/return-submission-lines.data.js'

/**
 * Builds a return submission in its entirety: the return submission itself and its submission lines — the minimum
 * valid data a return submission needs to exist against a return log.
 *
 * A return log doesn't need a return submission to be valid, so this isn't part of the return log's own
 * composition — it's built separately and only when a scenario needs a submitted (not just due) return log.
 *
 * @param {object} returnLog - the return log the submission is for
 * @param {number} totalVolume - the total volume to record across the submission lines
 */
export default function (returnLog, totalVolume) {
  const returnSubmission = returnSubmissionData(returnLog)

  // returnLog.startDate/endDate are ISO strings (the shape the seed endpoint expects), but returnSubmissionLinesData
  // needs real Date objects to read the year off, so we convert them back here.
  const period = { startDate: new Date(returnLog.startDate), endDate: new Date(returnLog.endDate) }
  const returnSubmissionLines = returnSubmissionLinesData(period, returnSubmission, totalVolume)

  return {
    returnSubmission,
    returnSubmissionLines
  }
}
