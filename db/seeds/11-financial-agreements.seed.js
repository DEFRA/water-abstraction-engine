import FinancialAgreementModel from '../../src/models/financial-agreement.model.js'
import { data as financialAgreements } from './data/financial-agreements.js'
import { timestampForPostgres } from '../../src/lib/general.lib.js'

export default async function seed() {
  for (const financialAgreement of financialAgreements) {
    await _upsert(financialAgreement)
  }
}

async function _upsert(financialAgreement) {
  return FinancialAgreementModel.query()
    .insert({ ...financialAgreement, updatedAt: timestampForPostgres() })
    .onConflict('code')
    .merge(['description', 'disabled', 'updatedAt'])
}
