/**
 * Loads the entities using the DB helpers
 * @module LoadService
 */

import AddressHelper from '../../test/support/helpers/address.helper.js'
import BillHelper from '../../test/support/helpers/bill.helper.js'
import BillLicenceHelper from '../../test/support/helpers/bill-licence.helper.js'
import BillRunChargeVersionYearHelper from '../../test/support/helpers/bill-run-charge-version-year.helper.js'
import BillRunHelper from '../../test/support/helpers/bill-run.helper.js'
import BillRunVolumeHelper from '../../test/support/helpers/bill-run-volume.helper.js'
import BillingAccountAddressHelper from '../../test/support/helpers/billing-account-address.helper.js'
import BillingAccountHelper from '../../test/support/helpers/billing-account.helper.js'
import ChangeReasonHelper from '../../test/support/helpers/change-reason.helper.js'
import ChargeElementHelper from '../../test/support/helpers/charge-element.helper.js'
import ChargeReferenceHelper from '../../test/support/helpers/charge-reference.helper.js'
import ChargeVersionHelper from '../../test/support/helpers/charge-version.helper.js'
import CompanyAddressHelper from '../../test/support/helpers/company-address.helper.js'
import CompanyContactHelper from '../../test/support/helpers/company-contact.helper.js'
import CompanyHelper from '../../test/support/helpers/company.helper.js'
import ContactHelper from '../../test/support/helpers/contact.helper.js'
import EventHelper from '../../test/support/helpers/event.helper.js'
import ExpandedError from '../../src/errors/expanded.error.js'
import LicenceAgreementHelper from '../../test/support/helpers/licence-agreement.helper.js'
import LicenceDocumentHeaderHelper from '../../test/support/helpers/licence-document-header.helper.js'
import LicenceDocumentHelper from '../../test/support/helpers/licence-document.helper.js'
import LicenceDocumentRoleHelper from '../../test/support/helpers/licence-document-role.helper.js'
import LicenceEndDateChangeHelper from '../../test/support/helpers/licence-end-date-change.helper.js'
import LicenceEntityHelper from '../../test/support/helpers/licence-entity.helper.js'
import LicenceEntityRoleHelper from '../../test/support/helpers/licence-entity-role.helper.js'
import LicenceHelper from '../../test/support/helpers/licence.helper.js'
import LicenceMonitoringStationHelper from '../../test/support/helpers/licence-monitoring-station.helper.js'
import LicenceRoleHelper from '../../test/support/helpers/licence-role.helper.js'
import LicenceSupplementaryYearHelper from '../../test/support/helpers/licence-supplementary-year.helper.js'
import LicenceVersionHelper from '../../test/support/helpers/licence-version.helper.js'
import LicenceVersionPurposeConditionHelper from '../../test/support/helpers/licence-version-purpose-condition.helper.js'
import LicenceVersionPurposeHelper from '../../test/support/helpers/licence-version-purpose.helper.js'
import LicenceVersionPurposePointHelper from '../../test/support/helpers/licence-version-purpose-point.helper.js'
import ModLogHelper from '../../test/support/helpers/mod-log.helper.js'
import NotificationHelper from '../../test/support/helpers/notification.helper.js'
import PermitLicenceHelper from '../../test/support/helpers/permit-licence.helper.js'
import PointHelper from '../../test/support/helpers/point.helper.js'
import ReturnCycleHelper from '../../test/support/helpers/return-cycle.helper.js'
import ReturnLogHelper from '../../test/support/helpers/return-log.helper.js'
import ReturnRequirementHelper from '../../test/support/helpers/return-requirement.helper.js'
import ReturnRequirementPointHelper from '../../test/support/helpers/return-requirement-point.helper.js'
import ReturnRequirementPurposeHelper from '../../test/support/helpers/return-requirement-purpose.helper.js'
import ReturnSubmissionHelper from '../../test/support/helpers/return-submission.helper.js'
import ReturnSubmissionLineHelper from '../../test/support/helpers/return-submission-line.helper.js'
import ReturnVersionHelper from '../../test/support/helpers/return-version.helper.js'
import ReviewChargeElementHelper from '../../test/support/helpers/review-charge-element.helper.js'
import ReviewChargeElementReturnHelper from '../../test/support/helpers/review-charge-element-return.helper.js'
import ReviewChargeReferenceHelper from '../../test/support/helpers/review-charge-reference.helper.js'
import ReviewChargeVersionHelper from '../../test/support/helpers/review-charge-version.helper.js'
import ReviewLicenceHelper from '../../test/support/helpers/review-licence.helper.js'
import ReviewReturnHelper from '../../test/support/helpers/review-return.helper.js'
import SessionHelper from '../../test/support/helpers/session.helper.js'
import TransactionHelper from '../../test/support/helpers/transaction.helper.js'
import UserGroupHelper from '../../test/support/helpers/user-group.helper.js'
import UserHelper from '../../test/support/helpers/user.helper.js'
import UserRoleHelper from '../../test/support/helpers/user-role.helper.js'
import WorkflowHelper from '../../test/support/helpers/workflow.helper.js'
import { asArrays } from './helpers/wire-format.helpers.js'
import { db } from '../../db/db.js'

// The entities defined in the scenarioData need to match the properties of this object else you'll get an error. The loader
// uses the matched value to determine which helper to use to 'load' the entity instance
const LOAD_HELPERS = {
  addresses: { helper: AddressHelper, legacy: { schema: 'crm_v2', table: 'addresses', id: 'address_id' } },
  billLicences: { helper: BillLicenceHelper },
  billRunChargeVersionYears: { helper: BillRunChargeVersionYearHelper },
  billRunVolumes: { helper: BillRunVolumeHelper },
  billRuns: { helper: BillRunHelper },
  bills: { helper: BillHelper },
  billingAccountAddresses: {
    helper: BillingAccountAddressHelper,

    legacy: { schema: 'crm_v2', table: 'invoice_account_addresses', id: 'invoice_account_address_id' }
  },
  billingAccounts: {
    helper: BillingAccountHelper,

    legacy: { schema: 'crm_v2', table: 'invoice_accounts', id: 'invoice_account_id' }
  },
  changeReasons: { helper: ChangeReasonHelper },
  chargeElements: {
    helper: ChargeElementHelper,

    legacy: { schema: 'water', table: 'charge_purposes', id: 'charge_purpose_id' }
  },
  chargeReferences: {
    helper: ChargeReferenceHelper,

    legacy: { schema: 'water', table: 'charge_elements', id: 'charge_element_id' }
  },
  chargeVersions: {
    helper: ChargeVersionHelper,

    legacy: { schema: 'water', table: 'charge_versions', id: 'charge_version_id' }
  },
  companyAddresses: {
    helper: CompanyAddressHelper,

    legacy: { schema: 'crm_v2', table: 'company_addresses', id: 'company_address_id' }
  },
  companyContacts: {
    helper: CompanyContactHelper,

    legacy: { schema: 'crm_v2', table: 'company_contacts', id: 'company_contact_id' }
  },
  companies: { helper: CompanyHelper, legacy: { schema: 'crm_v2', table: 'companies', id: 'company_id' } },
  contacts: { helper: ContactHelper, legacy: { schema: 'crm_v2', table: 'contacts', id: 'contact_id' } },
  events: { helper: EventHelper },
  licenceAgreements: {
    helper: LicenceAgreementHelper,

    legacy: { schema: 'water', table: 'licence_agreements', id: 'licence_agreement_id' }
  },
  licenceDocumentHeaders: { helper: LicenceDocumentHeaderHelper },
  licenceDocumentRoles: {
    helper: LicenceDocumentRoleHelper,

    legacy: { schema: 'crm_v2', table: 'document_roles', id: 'document_role_id' }
  },
  licenceDocuments: {
    helper: LicenceDocumentHelper,

    legacy: { schema: 'crm_v2', table: 'documents', id: 'document_id' }
  },
  licenceEndDateChanges: { helper: LicenceEndDateChangeHelper },
  licenceEntityRoles: { helper: LicenceEntityRoleHelper },
  licenceEntities: { helper: LicenceEntityHelper },
  licenceMonitoringStations: {
    helper: LicenceMonitoringStationHelper,

    legacy: { schema: 'water', table: 'licence_gauging_stations', id: 'licence_gauging_station_id' }
  },
  licenceRoles: { helper: LicenceRoleHelper },
  licenceSupplementaryYears: { helper: LicenceSupplementaryYearHelper },
  licenceVersionPurposeConditions: { helper: LicenceVersionPurposeConditionHelper },
  licenceVersionPurposes: {
    helper: LicenceVersionPurposeHelper,

    legacy: { schema: 'water', table: 'licence_version_purposes', id: 'licence_version_purpose_id' }
  },
  licenceVersionPurposePoints: { helper: LicenceVersionPurposePointHelper },
  licenceVersions: {
    helper: LicenceVersionHelper,

    legacy: { schema: 'water', table: 'licence_versions', id: 'licence_version_id' }
  },
  licences: { helper: LicenceHelper, legacy: { schema: 'water', table: 'licences', id: 'licence_id' } },
  modLogs: { helper: ModLogHelper },
  notifications: { helper: NotificationHelper },
  points: { helper: PointHelper },
  permitLicences: { helper: PermitLicenceHelper },
  returnCycles: {
    helper: ReturnCycleHelper,

    legacy: { schema: 'returns', table: 'return_cycles', id: 'return_cycle_id' }
  },
  returnLogs: { helper: ReturnLogHelper, legacy: { schema: 'returns', table: 'returns', id: 'id' } },
  returnRequirementPoints: { helper: ReturnRequirementPointHelper },
  returnRequirementPurposes: { helper: ReturnRequirementPurposeHelper },
  returnRequirements: { helper: ReturnRequirementHelper },
  returnSubmissionLines: { helper: ReturnSubmissionLineHelper },
  returnSubmissions: { helper: ReturnSubmissionHelper },
  returnVersions: { helper: ReturnVersionHelper },
  reviewChargeElementReturns: { helper: ReviewChargeElementReturnHelper },
  reviewChargeElements: { helper: ReviewChargeElementHelper },
  reviewChargeReferences: { helper: ReviewChargeReferenceHelper },
  reviewChargeVersions: { helper: ReviewChargeVersionHelper },
  reviewLicences: { helper: ReviewLicenceHelper },
  reviewReturns: { helper: ReviewReturnHelper },
  sessions: { helper: SessionHelper },
  transactions: { helper: TransactionHelper },
  userGroups: { helper: UserGroupHelper },
  userRoles: { helper: UserRoleHelper },
  users: { helper: UserHelper },
  workflows: { helper: WorkflowHelper }
}

/**
 * Loads the entities using the DB helpers
 *
 * Takes arrays of entities from the scenarioData and using our test helpers creates associated records in the DB. For
 * example, given the following scenarioData a new 'region' record will be created using the `RegionHelper`, and a 'licence'
 * using the `LicenceHelper`.
 *
 * ```json
 * {
 *   "regions": [
 *     {
 *       "id": "d0a4123d-1e19-480d-9dd4-f70f3387c4b9",
 *       "chargeRegionId": "S",
 *       "naldRegionId": 9,
 *       "displayName": "Test Region",
 *       "name": "Test Region"
 *     }
 *   ],
 *   "licences": [
 *     {
 *       "id": "f8702a6a-f61d-4b0a-9af3-9a53768ee516",
 *       "licenceRef": "AT/TE/ST/01/01",
 *       "regionId": "d0a4123d-1e19-480d-9dd4-f70f3387c4b9",
 *       "regions": {
 *         "historicalAreaCode": "SAAR",
 *         "regionalChargeArea": "Southern"
 *       },
 *       "startDate": "2022-04-01",
 *       "waterUndertaker": true
 *     }
 *   ]
 * }
 * ```
 *
 * The IDs have been defined in the scenarioData to make it possible to link the new licence to the new region.
 *
 * > Order matters!
 *
 * This is only possible because the region is defined in the scenarioData _before_ the licence. If they were the other way
 * round an error would be thrown when inserting the licence due to a foreign key constraint that requires the
 * referenced region to exist.
 *
 * The values for each entity instance are passed to the associated helper. Like the unit tests, it is on the caller
 * to override any defaults the helper will use. As this is intended to support acceptance testing it is likely you will
 * need to define real values instead of leaving the helper generate the data.
 *
 * ### Looking up an ID (or value)
 *
 * Some records link to lookup values that already exist, for example charge categories and purposes. The problem is
 * the IDs will be different in every environment. It is not possible to set the ID in the fixture. For these you can
 * tell the loader to 'lookup' the ID (or value - it is up to you).
 *
 * In this example we need to lookup the ID for the `crm.entity` record whose `entity_type` is `'regime'`.
 *
 * ```json
 *   "licenceDocumentHeaders": [
 *     {
 *       "id": "282b226e-c47b-4dcc-bbb0-94648fb6b242",
 *       "regimeEntityId": {
 *         "schema": "crm",
 *         "table": "entity",
 *         "lookup": "entityType",
 *         "value": "regime",
 *         "select": "entityId"
 *       }
 *     }
 *   ]
 * ```
 *
 * The result of the lookup will be used as the value for `regimeEntityId` when it is passed to the
 * `LicenceDocumentHeaderHelper`. You _must_ provide all elements for the query. Transformed to SQL this would be
 * `SELECT entity_id FROM crm.entity WHERE entity_type = 'regime'`.
 *
 * @param {object} scenarioData - the body from the request containing the entities to be created
 *
 * @returns {Promise<object>} for each entity type passed in an array of ID's for the records created, for example
 *
 * ```javascript
 * {
 *   regions: ['d0a4123d-1e19-480d-9dd4-f70f3387c4b9'],
 *   licences: ['f8702a6a-f61d-4b0a-9af3-9a53768ee516']
 * }
 * ```
 */
export default async function loadService(scenarioData) {
  // Instantiate a result object to which we'll record the ID's generated/used
  const result = {}

  const data = asArrays(scenarioData)

  // From the scenarioData grab the entities to load; regions, licences, chargeVersions etc
  const entityKeys = Object.keys(data)

  for (const entityKey of entityKeys) {
    result[entityKey] = []

    // Extract the next entity to load, for example licences: [{}, {}]
    const entity = data[entityKey]

    // Then iterate through the entity's instances to be created
    for (const instance of entity) {
      // Apply any lookups defined in the instance
      await _applyLookups(instance)

      // Select the appropriate helper for the entity
      const loadHelper = _helper(entityKey)

      // Then create (load) the instance into the DB
      const { id } = await loadHelper.helper.add(instance)

      // Finally record the ID either generated or used in the result
      result[entityKey].push(id)
    }
  }

  return result
}

/**
 * A lookup is where we need to grab an existing value from the DB. For example, looking up the ID of the charge
 * category to use in a charge reference we are trying to load.
 *
 * In this example the instance needs to lookup the ID for the `crm.entity` record whose `entity_type` is `'regime'`.
 *
 * ```json
 *   "licenceDocumentHeaders": [
 *     {
 *       "id": "282b226e-c47b-4dcc-bbb0-94648fb6b242",
 *       "regimeEntityId": {
 *         "schema": "crm",
 *         "table": "entity",
 *         "lookup": "entityType",
 *         "value": "regime",
 *         "select": "entityId"
 *       }
 *     }
 *   ]
 * ```
 *
 * We grab all the keys for the instance, then iterate through all its properties. In this example when we get to
 * `instance.regimeEntityId` we'll confirm it is an object with a `schema:` property. We then replace the value of
 * `instance.regimeEntityId` with the result of a query based on the details provided. In this case `SELECT entity_id
 * FROM crm.entity WHERE entity_type = 'regime'`.
 *
 * @private
 */
async function _applyLookups(instance) {
  const keys = Object.keys(instance)

  for (const key of keys) {
    if (instance[key] && instance[key].schema) {
      const { schema, table, lookup, value, select } = instance[key]

      instance[key] = await _selector(schema, table, select, lookup, value)
    }
  }
}

function _helper(entityKey) {
  const loadHelper = LOAD_HELPERS[entityKey]

  if (!loadHelper) {
    throw new ExpandedError('Unknown entity to load', { entityKey })
  }

  return loadHelper
}

async function _selector(schema, table, select, where, value) {
  try {
    const result = await db.withSchema(schema).first(select).from(table).where(where, value)

    return result[select]
  } catch (error) {
    console.error('Load service failed to apply lookup', { schema, table, select, where, value })

    throw error
  }
}
