import userData from '../data/user.data.js'
import userGroupData from '../data/user-group.data.js'
import { applications, groups } from '../default-values.js'

/**
 * Builds an internal user in its entirety: the user itself and the user group that gives it its permissions. The user
 * is in the billing and data group unless a different group is passed in.
 *
 * @param {string} group - the group the user belongs to
 */
export default function (group = groups.BILLING_AND_DATA) {
  const user = userData(applications.INTERNAL)
  const userGroup = userGroupData(user, group)

  return {
    user,
    userGroup
  }
}
