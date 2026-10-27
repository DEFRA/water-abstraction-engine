import { currentPurpose } from './purposes.helpers.js'
import licenceVersionPurposeConditionData from '../../data/licence-version-purpose-condition.data.js'

/**
 * Add a condition to a licence
 *
 * The condition is added to the first purpose on the licence's current licence version. It is a level cessation
 * condition.
 *
 * Call this again to add another.
 *
 * @param {object} licenceEntity - the licence entity to change
 */
export function addCondition(licenceEntity) {
  // A licence is built with no conditions. The first time this is called the list is created
  licenceEntity.licenceVersionPurposeConditions ??= []

  const purpose = currentPurpose(licenceEntity)
  const condition = licenceVersionPurposeConditionData(purpose)

  condition.externalId = conditionExternalId(licenceEntity, purpose)

  licenceEntity.licenceVersionPurposeConditions.push(condition)
}

/**
 * The external id for the next condition on a purpose
 *
 * A condition's external id has to be unique. Left alone it is a random number from a small range, and with enough
 * conditions two would match. So it is made from the purpose's own external id, which is unique, and which condition
 * on the purpose this is.
 *
 * @param {object} licenceEntity - the licence entity the purpose belongs to
 * @param {object} purpose - the licence version purpose the condition is for
 *
 * @returns {string} the external id, for example '1:12345678:1:0'
 */
export function conditionExternalId(licenceEntity, purpose) {
  const conditionsOnPurpose = licenceEntity.licenceVersionPurposeConditions.filter((condition) => {
    return condition.licenceVersionPurposeId === purpose.id
  })

  return `${purpose.externalId}:${conditionsOnPurpose.length + 1}:0`
}
