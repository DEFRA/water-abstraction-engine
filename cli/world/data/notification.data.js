import { generateGovUKEmail } from '../helpers/generators.helpers.js'
import { generateUUID } from '../../../test/support/generators.js'

/**
 * Build a returns invitation event and the email notification sent to a contact for a licence
 *
 * @param {string} licenceRef - the licence reference the notification is about
 * @param {object} contact - the contact record
 *
 * @returns {object} the data to load
 */
export default function (licenceRef, contact) {
  const eventId = generateUUID()
  const notificationId = generateUUID()

  return {
    event: {
      id: eventId,
      type: 'return',
      issuer: generateGovUKEmail(),
      licences: JSON.stringify([licenceRef])
    },
    notification: {
      id: notificationId,
      eventId,
      recipient: contact.email,
      messageType: 'email',
      messageRef: 'returns invitation',
      createdAt: new Date()
    }
  }
}
