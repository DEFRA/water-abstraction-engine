/**
 * Model for group_roles (idm.group_roles)
 * @module GroupRoleModel
 */

import { Model } from 'objection'

import BaseModel from './base.model.js'
import GroupModel from './group.model.js'
import RoleModel from './role.model.js'

export default class GroupRoleModel extends BaseModel {
  static get tableName() {
    return 'groupRoles'
  }

  static get relationMappings() {
    return {
      group: {
        join: {
          from: 'groupRoles.groupId',
          to: 'groups.id'
        },
        modelClass: GroupModel,
        relation: Model.BelongsToOneRelation
      },
      role: {
        join: {
          from: 'groupRoles.roleId',
          to: 'roles.id'
        },
        modelClass: RoleModel,
        relation: Model.BelongsToOneRelation
      }
    }
  }
}
