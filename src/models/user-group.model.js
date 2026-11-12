/**
 * Model for user_groups (idm.user_groups)
 * @module UserGroupModel
 */

import { Model } from 'objection'

import BaseModel from './base.model.js'
import GroupModel from './group.model.js'
import UserModel from './user.model.js'

export default class UserGroupModel extends BaseModel {
  static get tableName() {
    return 'userGroups'
  }

  static get relationMappings() {
    return {
      group: {
        join: {
          from: 'userGroups.groupId',
          to: 'groups.id'
        },
        modelClass: GroupModel,
        relation: Model.BelongsToOneRelation
      },
      user: {
        join: {
          from: 'userGroups.userId',
          to: 'users.userId'
        },
        modelClass: UserModel,
        relation: Model.BelongsToOneRelation
      }
    }
  }
}
