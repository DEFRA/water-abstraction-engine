import { generateUUID } from '../../../test/support/generators.js'

/**
 * Build a user group record adding a user to a group
 *
 * @param {object} user - the user record
 * @param {object} group - the group to add the user to
 *
 * @returns {object} the data to load
 */
export default function (user, group) {
  return {
    id: generateUUID(),
    userId: {
      schema: 'public',
      table: 'users',
      lookup: 'id',
      value: user.id,
      select: 'userId'
    },
    groupId: {
      schema: 'public',
      table: 'groups',
      lookup: 'group',
      value: group,
      select: 'id'
    }
  }
}
