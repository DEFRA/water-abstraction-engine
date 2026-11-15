/**
 * Static lookup values for notifications
 *
 * @module NotificationsLib
 */

/**
 * These are the different statuses a notification record can have
 */
export const NOTIFICATIONS_STATUS = Object.freeze({
  cancelled: 'cancelled',
  error: 'error',
  pending: 'pending',
  sent: 'sent'
})

/**
 * Mapping of Notify email statuses to internal notification statuses
 *
 * See {@link https://docs.notifications.service.gov.uk/node.html#email-status-descriptions | Notify docs} for more
 *
 * - **created** - GOV.UK Notify has placed the message in a queue, ready to be sent to the provider. It should only
 * remain in this state for a few seconds.
 * - **sending** - GOV.UK Notify has sent the message to the provider. The provider will try to deliver the message to
 * the recipient for up to 72 hours. Notify is waiting for delivery information.
 * - **delivered** - The message was successfully delivered.
 * - **permanent-failure** - The provider could not deliver the message because the email address was wrong. You should
 * remove these email addresses from your database.
 * - **temporary-failure** - The provider could not deliver the message. This can happen when the recipient’s inbox is
 * full or their anti-spam filter rejects your email. Check your content does not look like spam before you try to
 * send the message again.
 * - **technical-failure** - Your message was not sent because there was a problem between Notify and the provider.
 * You’ll have to try sending your messages again.
 */
export const EMAIL_STATUS = Object.freeze({
  created: NOTIFICATIONS_STATUS.pending,
  delivered: NOTIFICATIONS_STATUS.sent,
  error: NOTIFICATIONS_STATUS.error,
  'permanent-failure': NOTIFICATIONS_STATUS.error,
  sending: NOTIFICATIONS_STATUS.pending,
  'technical-failure': NOTIFICATIONS_STATUS.error,
  'temporary-failure': NOTIFICATIONS_STATUS.error
})

/**
 * Mapping of Notify letter statuses to internal notification statuses
 *
 * See {@link https://docs.notifications.service.gov.uk/node.html#letter-status-descriptions | Notify docs} for more
 *
 * - **accepted** - GOV.UK Notify has sent the letter to the provider to be printed.
 * - **received** - The provider has printed and dispatched the letter.
 * - **cancelled** - Sending cancelled. The letter will not be printed or dispatched.
 * - **technical-failure** - GOV.UK Notify had an unexpected error while sending the letter to our printing provider.
 * - **permanent-failure** - The provider cannot print the letter. Your letter will not be dispatched.
 * - **pending-virus-check** - GOV.UK Notify has not completed a virus scan of the precompiled letter file.
 */
export const LETTER_STATUS = Object.freeze({
  accepted: NOTIFICATIONS_STATUS.pending,
  cancelled: NOTIFICATIONS_STATUS.cancelled,
  created: NOTIFICATIONS_STATUS.pending,
  error: NOTIFICATIONS_STATUS.error,
  'pending-virus-check': NOTIFICATIONS_STATUS.pending,
  'permanent-failure': NOTIFICATIONS_STATUS.error,
  received: NOTIFICATIONS_STATUS.sent,
  sending: NOTIFICATIONS_STATUS.pending,
  'technical-failure': NOTIFICATIONS_STATUS.error,
  'temporary-failure': NOTIFICATIONS_STATUS.error,
  'validation-failed': NOTIFICATIONS_STATUS.error
})
