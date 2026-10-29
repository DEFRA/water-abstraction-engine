import { generateUUID } from '../../../test/support/generators.js'

/**
 * Build a return submission record for a return log
 *
 * @param {object} returnLog - the return log record
 *
 * @returns {object} the data to load
 */
export default function (returnLog) {
  return {
    id: generateUUID(),
    returnId: returnLog.returnId,
    returnLogId: returnLog.id,
    nilReturn: false,
    current: true
  }
}
