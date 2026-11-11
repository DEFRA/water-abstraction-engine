/**
 * Model for roles (idm.roles)
 * @module RoleModel
 */

import { Model } from 'objection'

import BaseModel from './base.model.js'
import GroupModel from './group.model.js'
import GroupRoleModel from './group-role.model.js'
import UserModel from './user.model.js'
import UserRoleModel from './user-role.model.js'

export default class RoleModel extends BaseModel {
  static get tableName() {
    return 'roles'
  }

  static get relationMappings() {
    return {
      groupRoles: {
        join: {
          from: 'roles.id',
          to: 'groupRoles.roleId'
        },
        modelClass: GroupRoleModel,
        relation: Model.HasManyRelation
      },
      groups: {
        join: {
          from: 'roles.id',
          through: {
            from: 'groupRoles.roleId',
            to: 'groupRoles.groupId'
          },
          to: 'groups.id'
        },
        modelClass: GroupModel,
        relation: Model.ManyToManyRelation
      },
      userRoles: {
        join: {
          from: 'roles.id',
          to: 'userRoles.roleId'
        },
        modelClass: UserRoleModel,
        relation: Model.HasManyRelation
      },
      users: {
        join: {
          from: 'roles.id',
          through: {
            from: 'userRoles.roleId',
            to: 'userRoles.userId'
          },
          to: 'users.userId'
        },
        modelClass: UserModel,
        relation: Model.ManyToManyRelation
      }
    }
  }
}
