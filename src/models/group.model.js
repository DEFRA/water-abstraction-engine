/**
 * Model for groups (idm.groups)
 * @module GroupModel
 */

import { Model } from 'objection'

import BaseModel from './base.model.js'
import GroupRoleModel from './group-role.model.js'
import RoleModel from './role.model.js'
import UserGroupModel from './user-group.model.js'
import UserModel from './user.model.js'

export default class GroupModel extends BaseModel {
  static get tableName() {
    return 'groups'
  }

  static get relationMappings() {
    return {
      groupRoles: {
        join: {
          from: 'groups.id',
          to: 'groupRoles.groupId'
        },
        modelClass: GroupRoleModel,
        relation: Model.HasManyRelation
      },
      roles: {
        join: {
          from: 'groups.id',
          through: {
            from: 'groupRoles.groupId',
            to: 'groupRoles.roleId'
          },
          to: 'roles.id'
        },
        modelClass: RoleModel,
        relation: Model.ManyToManyRelation
      },
      userGroups: {
        join: {
          from: 'groups.id',
          to: 'userGroups.groupId'
        },
        modelClass: UserGroupModel,
        relation: Model.HasManyRelation
      },
      users: {
        join: {
          from: 'groups.id',
          through: {
            from: 'userGroups.groupId',
            to: 'userGroups.userId'
          },
          to: 'users.userId'
        },
        modelClass: UserModel,
        relation: Model.ManyToManyRelation
      }
    }
  }
}
