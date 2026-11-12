/**
 * @module PermitLicenceHelper
 */

import PermitLicenceModel from '../../../src/models/permit-licence.model.js'
import { generateLicenceRef } from '../generators.js'

/**
 * Add a new licence into the licence table in the permit schema
 *
 * If no `data` is provided, default values will be used. These are
 *
 * - `licenceStatusId` - 1
 * - `licenceTypeId` - 8
 * - `licenceRegimeId` - 1
 * - `licenceRef` - [randomly generated - 01/123]
 * - `licenceDataValue` - large JSON blob. See _licenceDataValue() for details
 *
 * @param {object} [data] - Any data you want to use instead of the defaults used here or in the database
 *
 * @returns {Promise<module:PermitLicenceModel>} The instance of the newly created record
 */
async function add(data = {}) {
  const insertData = defaults(data)

  return PermitLicenceModel.query()
    .insert({ ...insertData })
    .returning('*')
}

/**
 * Returns the defaults used
 *
 * It will override or append to them any data provided. Mainly used by the `add()` method, we make it available
 * for use in tests to avoid having to duplicate values.
 *
 * @param {object} [data] - Any data you want to use instead of the defaults used here or in the database
 *
 * @returns {object} - Returns the set defaults with the override data spread
 */
function defaults(data = {}) {
  const licenceRef = data.licenceRef ? data.licenceRef : generateLicenceRef()
  const defaults = {
    licenceDataValue: _licenceDataValue(licenceRef),
    licenceRef,
    licenceRegimeId: 1,
    licenceStatusId: 1,
    licenceTypeId: 8
  }

  return {
    ...defaults,
    ...data
  }
}

/**
 * In real life, when a licence is imported from NALD into WRLS a number of records get created. A lot of it is
 * duplication, but not everything from NALD is put into tables.
 *
 * This seems to stem from an early architectural decision that WRLS would be building a generic 'permit' repository.
 * Some top level information is captured in `permit.licence`. But because it needed to be 'generic' everything
 * (everything 😱) from NALD gets dumped into the JSONB field `licence_data_value`. The problem is, when the previous
 * team built a feature that needed info only held in `licence_data_value`, rather than put it into a table, they just
 * dipped into the JSON. And they did this again, and again, and again!
 *
 * You cannot load a licence in the UI without having this field properly populated. And that means it'll block our
 * acceptance tests if we don't put something 'real' into it.
 *
 * This was the NALD dump the legacy acceptance test data loading solution used. It doesn't matter that the data
 * included doesn't match with the related licence and other records. The critical factor is the structure must align
 * with what the legacy apps expect.
 * @param licenceRef
 */
function _licenceDataValue(licenceRef) {
  return {
    data: {
      cams: [],
      current_version: {
        address: {
          ADDR_LINE1: 'Test address line 1',
          ADDR_LINE2: 'Test address line 2',
          ADDR_LINE3: 'Test address line 3',
          ADDR_LINE4: 'Test address line 4',
          COUNTRY: 'null',
          COUNTY: 'Test county',
          FGAC_REGION_CODE: '9',
          ID: '9000022',
          POSTCODE: 'AT1 1AT',
          TOWN: 'Test town'
        },
        expiry_date: '01/04/2023',
        formats: [
          {
            ABS_PERIOD_END_DAY: '31',
            ABS_PERIOD_END_MONTH: '12',
            ABS_PERIOD_ST_DAY: '1',
            ABS_PERIOD_ST_MONTH: '1',
            ANNUAL_QTY: '1234',
            ARTC_REC_FREQ_CODE: 'D',
            ARTC_RET_FREQ_CODE: 'A',
            CC_IND: 'N',
            DESCR: 'Test format description',
            FGAC_REGION_CODE: '9',
            FORM_PRODN_MONTH: '10',
            FORMS_REQ_ALL_YEAR: 'Y',
            ID: '9000025',
            points: [
              {
                AADD_ID: '9000020',
                FGAC_REGION_CODE: '9',
                ID: '9000026',
                LOCAL_NAME: 'Test point local name',
                NGR1_EAST: '1234',
                NGR1_NORTH: '1234',
                NGR1_SHEET: 'TQ'
              }
            ],
            purposes: [
              {
                APUR_APPR_CODE: 'P',
                APUR_APSE_CODE: 'ELC',
                APUR_APUS_CODE: '80',
                ARTY_ID: '9000027',
                FGAC_REGION_CODE: '9',
                primary_purpose: 'Production Of Energy',
                PURP_ALIAS: 'Evaporative Cooling',
                secondary_purpose: 'Electricity',
                tertiary_purpose: 'Evaporative Cooling'
              }
            ],
            SITE_DESCR: 'Test site description',
            TIMELTD_END_DATE: 'null',
            TIMELTD_ST_DATE: 'null',
            TPT_FLAG: 'N'
          }
        ],
        licence: {
          ACON_AADD_ID: '9000020',
          ACON_APAR_ID: '9999999',
          CODE: 'FULL',
          DESCR: 'Full Licence (>=28 Days)',
          EFF_END_DATE: 'null',
          EFF_ST_DATE: '01/04/2022',
          FGAC_REGION_CODE: '9',
          INCR_NO: '0',
          ISSUE_NO: '100',
          LIC_SIG_DATE: '01/04/2022',
          party: [
            {
              APAR_TYPE: 'ORG',
              FGAC_REGION_CODE: '9',
              ID: '9000029',
              NAME: 'Test party name'
            }
          ],
          RETURNS_REQ: 'Y',
          STATUS: 'CURR'
        },
        original_effective_date: '20220401',
        party: {
          APAR_TYPE: 'ORG',
          ASIC_ASID_DIVISION: 'null',
          DESCR: 'null',
          FGAC_REGION_CODE: '9',
          FORENAME: 'null',
          ID: '9999999',
          INITIALS: 'null',
          LOCAL_NAME: 'null',
          NAME: 'Testing',
          SALUTATION: 'null'
        },
        purposes: [
          {
            ANNUAL_QTY: '12345',
            APUR_APPR_CODE: 'P',
            APUR_APSE_CODE: 'ELC',
            APUR_APUS_CODE: '80',
            DAILY_QTY: '123',
            FGAC_REGION_CODE: '9',
            HOURLY_QTY: '12',
            ID: '9000030',
            INST_QTY: '12',
            LANDS: 'Boldly outlined on map',
            licenceAgreements: [],
            licenceConditions: [],
            NOTES: 'null',
            PERIOD_END_DAY: '31',
            PERIOD_END_MONTH: '12',
            PERIOD_ST_DAY: '1',
            PERIOD_ST_MONTH: '1',
            purpose: [
              {
                purpose_primary: {
                  CODE: 'P',
                  DESCR: 'Production Of Energy'
                },
                purpose_secondary: {
                  CODE: 'ELC',
                  DESCR: 'Electricity'
                },
                purpose_tertiary: {
                  ALSF_CODE: 'H',
                  CODE: '80',
                  DESCR: 'Evaporative Cooling'
                }
              }
            ],
            purposePoints: [
              {
                FGAC_REGION_CODE: '9',
                means_of_abstraction: {
                  CODE: 'UNP',
                  DESCR: 'Unspecified Pump 1'
                },
                NOTES: 'null',
                point_detail: {
                  AADD_ID: '9000020',
                  FGAC_REGION_CODE: '9',
                  ID: '9000031',
                  LOCAL_NAME: 'Test local name 1',
                  NGR1_EAST: '1234',
                  NGR1_NORTH: '1234',
                  NGR1_SHEET: 'TQ'
                },
                point_source: {
                  CART_NORTH: '1234',
                  CODE: 'ABC',
                  FGAC_REGION_CODE: '9',
                  LOCAL_NAME: 'Test local name 1',
                  NAME: 'Test point source name 1',
                  NOTES: 'Test point source notes 1'
                }
              },
              {
                FGAC_REGION_CODE: '9',
                means_of_abstraction: {
                  CODE: 'UNP',
                  DESCR: 'Unspecified Pump 2'
                },
                NOTES: 'null',
                point_detail: {
                  AADD_ID: '9000022',
                  FGAC_REGION_CODE: '9',
                  ID: '9000032',
                  LOCAL_NAME: 'Test local name 2',
                  NGR1_EAST: '5678',
                  NGR1_NORTH: '5678',
                  NGR1_SHEET: 'TT'
                },
                point_source: {
                  CART_NORTH: '5678',
                  CODE: 'DEF',
                  FGAC_REGION_CODE: '9',
                  LOCAL_NAME: 'Test local name 2',
                  NAME: 'Test point source name 2',
                  NOTES: 'Test point source notes 2'
                }
              }
            ],
            TIMELTD_END_DATE: 'null',
            TIMELTD_ST_DATE: 'null'
          }
        ],
        version_effective_date: '20220401'
      },
      purposes: [
        {
          ANNUAL_QTY: '12345',
          APUR_APPR_CODE: 'P',
          APUR_APSE_CODE: 'ELC',
          APUR_APUS_CODE: '80',
          DAILY_QTY: '123',
          FGAC_REGION_CODE: '9',
          HOURLY_QTY: '12',
          ID: '9000007',
          INST_QTY: '12',
          LANDS: 'Boldly outlined on map',
          licenceAgreements: [],
          licenceConditions: [],
          NOTES: 'null',
          PERIOD_END_DAY: '31',
          PERIOD_END_MONTH: '12',
          PERIOD_ST_DAY: '1',
          PERIOD_ST_MONTH: '1',
          purpose: [
            {
              purpose_primary: {
                CODE: 'P',
                DESCR: 'Production Of Energy'
              },
              purpose_secondary: {
                CODE: 'ELC',
                DESCR: 'Electricity'
              },
              purpose_tertiary: {
                ALSF_CODE: 'H',
                CODE: '80',
                DESCR: 'Evaporative Cooling'
              }
            }
          ],
          purposePoints: [
            {
              FGAC_REGION_CODE: '9',
              means_of_abstraction: {
                CODE: 'ABC',
                DESCR: 'Test means of abstraction',
                NOTES: 'null'
              },
              NOTES: 'null',
              point_detail: {
                FGAC_REGION_CODE: '9',
                ID: '90000012',
                LOCAL_NAME: 'Test purpose local name',
                NGR1_EAST: '1234',
                NGR1_NORTH: '1234',
                NGR1_SHEET: 'TQ'
              },
              point_source: {
                CART_NORTH: '1234',
                CODE: 'ABC',
                FGAC_REGION_CODE: '9',
                LOCAL_NAME: 'Test local name',
                NAME: 'Test source name',
                NOTES: 'Test source notes'
              }
            }
          ],
          TIMELTD_END_DATE: 'null',
          TIMELTD_ST_DATE: 'null'
        }
      ],
      roles: [
        {
          array: [
            {
              ACON_AADD_ID: '9000020',
              ACON_APAR_ID: '9999999',
              CODE: 'WP',
              CONT_NO: '01234 567 567',
              DESCR: 'Work Phone',
              FGAC_REGION_CODE: '6'
            }
          ],
          role_address: {
            ADDR_LINE1: 'Test address line 1',
            ADDR_LINE2: 'Test address line 2',
            ADDR_LINE3: 'Test address line 3',
            ADDR_LINE4: 'Test address line 4',
            COUNTRY: 'null',
            COUNTY: 'Test county',
            FGAC_REGION_CODE: '9',
            ID: '9000022',
            POSTCODE: 'AT1 1AT',
            TOWN: 'Test town'
          },
          role_detail: {
            ACON_AADD_ID: '9000020',
            ACON_APAR_ID: '9999999',
            EFF_END_DATE: '01/04/2023',
            EFF_ST_DATE: '01/04/2022',
            ID: '9000004'
          },
          role_party: {
            APAR_TYPE: 'PER',
            DESCR: 'Test role description',
            FORENAME: 'Test role first name',
            ID: '9999999',
            INITIALS: 'N',
            NAME: 'Test',
            SALUTATION: 'Ms'
          },
          role_type: {
            CODE: 'EO',
            DESCR: 'Enforcement Officer'
          }
        }
      ],
      versions: [
        {
          ACON_AADD_ID: '9000020',
          ACON_APAR_ID: '9999999',
          APP_NO: licenceRef,
          EFF_END_DATE: '01/04/2023',
          EFF_ST_DATE: '01/04/2022',
          FGAC_REGION_CODE: '9',
          INCR_NO: '0',
          ISSUE_NO: '100',
          LIC_SIG_DATE: '01/04/2022',
          parties: [
            {
              APAR_TYPE: 'ORG',
              contacts: [
                {
                  AADD_ID: '9000020',
                  APAR_ID: '9999999',
                  FGAC_REGION_CODE: '9',
                  party_address: {
                    ADDR_LINE1: 'Test address line 1',
                    ADDR_LINE2: 'Test address line 2',
                    ADDR_LINE3: 'Test address line 3',
                    ADDR_LINE4: 'Test address line 4',
                    COUNTRY: 'null',
                    COUNTY: 'Test county',
                    FGAC_REGION_CODE: '9',
                    ID: '9000022',
                    POSTCODE: 'AT1 1AT',
                    TOWN: 'Test town'
                  }
                }
              ],
              DESCR: 'null',
              FGAC_REGION_CODE: '9',
              FORENAME: 'null',
              ID: '9999999',
              INITIALS: 'null',
              LOCAL_NAME: 'null',
              NAME: 'Test party name',
              SALUTATION: 'null'
            }
          ],
          RETURNS_REQ: 'Y',
          STATUS: 'CURR'
        }
      ]
    },
    EXPIRY_DATE: '01/04/2023',
    FGAC_REGION_CODE: '9',
    ID: '9000000',
    LAPSED_DATE: 'null',
    LIC_NO: licenceRef,
    NOTES: 'Licence notes',
    ORIG_EFF_DATE: '01/04/2022',
    ORIG_SIG_DATE: '01/04/2022',
    REV_DATE: 'null',
    vmlVersion: 2
  }
}

export default {
  add,
  defaults
}
