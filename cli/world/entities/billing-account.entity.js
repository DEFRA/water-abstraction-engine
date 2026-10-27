import billingAccountAddressData from '../data/billing-account-address.data.js'
import billingAccountData from '../data/billing-account.data.js'

/**
 * Builds a billing account in its entirety: the billing account itself and its billing account address — the
 * minimum valid data a billing account needs to exist.
 *
 * @param {object} licenceEntity - the licence entity the billing account is for
 * @param {object} region - the region the billing account's account number is generated for
 */
export default function (licenceEntity, region) {
  const { address, company } = licenceEntity

  const billingAccount = billingAccountData(company, region)
  const billingAccountAddress = billingAccountAddressData(billingAccount, address)

  return {
    billingAccount,
    billingAccountAddress
  }
}
