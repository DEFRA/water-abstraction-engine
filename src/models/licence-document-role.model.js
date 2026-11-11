/**
 * Model for licence_document_roles (crm_v2.document_roles)
 * @module LicenceDocumentRoleModel
 */

import { Model } from 'objection'

import AddressModel from './address.model.js'
import BaseModel from './base.model.js'
import CompanyModel from './company.model.js'
import ContactModel from './contact.model.js'
import LicenceDocumentModel from './licence-document.model.js'
import LicenceRoleModel from './licence-role.model.js'

export default class LicenceDocumentRoleModel extends BaseModel {
  static get tableName() {
    return 'licenceDocumentRoles'
  }

  static get relationMappings() {
    return {
      address: {
        join: {
          from: 'licenceDocumentRoles.addressId',
          to: 'addresses.id'
        },
        modelClass: AddressModel,
        relation: Model.BelongsToOneRelation
      },
      company: {
        join: {
          from: 'licenceDocumentRoles.companyId',
          to: 'companies.id'
        },
        modelClass: CompanyModel,
        relation: Model.BelongsToOneRelation
      },
      contact: {
        join: {
          from: 'licenceDocumentRoles.contactId',
          to: 'contacts.id'
        },
        modelClass: ContactModel,
        relation: Model.BelongsToOneRelation
      },
      licenceDocument: {
        join: {
          from: 'licenceDocumentRoles.licenceDocumentId',
          to: 'licenceDocuments.id'
        },
        modelClass: LicenceDocumentModel,
        relation: Model.BelongsToOneRelation
      },
      licenceRole: {
        join: {
          from: 'licenceDocumentRoles.licenceRoleId',
          to: 'licenceRoles.id'
        },
        modelClass: LicenceRoleModel,
        relation: Model.BelongsToOneRelation
      }
    }
  }
}
