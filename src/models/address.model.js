/**
 * Model for addresses (crm_v2.addresses)
 * @module AddressModel
 */

import { Model } from 'objection'

import BaseModel from './base.model.js'
import BillingAccountAddressModel from './billing-account-address.model.js'
import CompanyAddressModel from './company-address.model.js'
import LicenceDocumentRoleModel from './licence-document-role.model.js'
import LicenceVersionModel from './licence-version.model.js'

export default class AddressModel extends BaseModel {
  static get tableName() {
    return 'addresses'
  }

  static get relationMappings() {
    return {
      billingAccountAddresses: {
        join: {
          from: 'addresses.id',
          to: 'billingAccountAddresses.addressId'
        },
        modelClass: BillingAccountAddressModel,
        relation: Model.HasManyRelation
      },
      companyAddresses: {
        join: {
          from: 'addresses.id',
          to: 'companyAddresses.addressId'
        },
        modelClass: CompanyAddressModel,
        relation: Model.HasManyRelation
      },
      licenceDocumentRoles: {
        join: {
          from: 'addresses.id',
          to: 'licenceDocumentRoles.addressId'
        },
        modelClass: LicenceDocumentRoleModel,
        relation: Model.HasManyRelation
      },
      licenceVersions: {
        join: {
          from: 'addresses.id',
          to: 'licenceVersions.addressId'
        },
        modelClass: LicenceVersionModel,
        relation: Model.HasManyRelation
      }
    }
  }
}
