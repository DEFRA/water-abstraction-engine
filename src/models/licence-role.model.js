/**
 * Model for licence_roles (crm_v2.roles)
 * @module LicenceRoleModel
 */

import { Model } from 'objection'

import BaseModel from './base.model.js'
import CompanyAddressModel from './company-address.model.js'
import CompanyContactModel from './company-contact.model.js'
import LicenceDocumentRoleModel from './licence-document-role.model.js'

export default class LicenceRoleModel extends BaseModel {
  static get tableName() {
    return 'licenceRoles'
  }

  static get relationMappings() {
    return {
      companyAddresses: {
        join: {
          from: 'licenceRoles.id',
          to: 'companyAddresses.licenceRoleId'
        },
        modelClass: CompanyAddressModel,
        relation: Model.HasManyRelation
      },
      companyContacts: {
        join: {
          from: 'licenceRoles.id',
          to: 'companyContacts.licenceRoleId'
        },
        modelClass: CompanyContactModel,
        relation: Model.HasManyRelation
      },
      licenceDocumentRoles: {
        join: {
          from: 'licenceRoles.id',
          to: 'licenceDocumentRoles.licenceRoleId'
        },
        modelClass: LicenceDocumentRoleModel,
        relation: Model.HasManyRelation
      }
    }
  }
}
