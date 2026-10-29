/**
 * Build a licence document role record linking a licence document to a company and address
 *
 * @param {object} licenceDocument - the licence document record
 * @param {object} company - the company record
 * @param {object} address - the address record
 *
 * @returns {object} the data to load
 */
export default function (licenceDocument, company, address) {
  return {
    licenceDocumentId: licenceDocument.id,
    licenceRoleId: {
      schema: 'public',
      table: 'licenceRoles',
      lookup: 'name',
      value: 'licenceHolder',
      select: 'id'
    },
    startDate: licenceDocument.startDate,
    companyId: company.id,
    addressId: address.id
  }
}
