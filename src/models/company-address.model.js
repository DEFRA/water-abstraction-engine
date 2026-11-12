/**
 * Model for company_addresses (crm_v2.company_addresses)
 * @module CompanyAddressModel
 */

import { Model } from 'objection'

import AddressModel from './address.model.js'
import BaseModel from './base.model.js'
import CompanyModel from './company.model.js'
import LicenceRoleModel from './licence-role.model.js'

export default class CompanyAddressModel extends BaseModel {
  static get tableName() {
    return 'companyAddresses'
  }

  static get relationMappings() {
    return {
      address: {
        join: {
          from: 'companyAddresses.addressId',
          to: 'addresses.id'
        },
        modelClass: AddressModel,
        relation: Model.BelongsToOneRelation
      },
      company: {
        join: {
          from: 'companyAddresses.companyId',
          to: 'companies.id'
        },
        modelClass: CompanyModel,
        relation: Model.BelongsToOneRelation
      },
      licenceRole: {
        join: {
          from: 'companyAddresses.licenceRoleId',
          to: 'licenceRoles.id'
        },
        modelClass: LicenceRoleModel,
        relation: Model.BelongsToOneRelation
      }
    }
  }
}
