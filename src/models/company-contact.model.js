/**
 * Model for company_contacts (crm_v2.company_contacts)
 * @module CompanyContactModel
 */

import { Model } from 'objection'

import BaseModel from './base.model.js'
import CompanyModel from './company.model.js'
import ContactModel from './contact.model.js'
import LicenceRoleModel from './licence-role.model.js'
import UserModel from './user.model.js'

export default class CompanyContactModel extends BaseModel {
  static get tableName() {
    return 'companyContacts'
  }

  static get relationMappings() {
    return {
      company: {
        join: {
          from: 'companyContacts.companyId',
          to: 'companies.id'
        },
        modelClass: CompanyModel,
        relation: Model.BelongsToOneRelation
      },
      contact: {
        join: {
          from: 'companyContacts.contactId',
          to: 'contacts.id'
        },
        modelClass: ContactModel,
        relation: Model.BelongsToOneRelation
      },
      createdByUser: {
        join: {
          from: 'companyContacts.createdBy',
          to: 'users.id'
        },
        modelClass: UserModel,
        relation: Model.BelongsToOneRelation
      },
      licenceRole: {
        join: {
          from: 'companyContacts.licenceRoleId',
          to: 'licenceRoles.id'
        },
        modelClass: LicenceRoleModel,
        relation: Model.BelongsToOneRelation
      },
      updatedByUser: {
        join: {
          from: 'companyContacts.updatedBy',
          to: 'users.id'
        },
        modelClass: UserModel,
        relation: Model.BelongsToOneRelation
      }
    }
  }

  /**
   * Maps the `abstractionAlerts` flag and linked licences to the journey string value ('yes', 'some', or 'no')
   *
   * @returns {string} 'yes', 'some', or 'no'
   */
  $abstractionAlertType() {
    if (!this.abstractionAlerts) {
      return 'no'
    }

    return this.abstractionAlertLicences ? 'some' : 'yes'
  }
}
