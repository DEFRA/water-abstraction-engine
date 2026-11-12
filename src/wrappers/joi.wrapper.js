/**
 * Shares the engine's copy of `joi` (extended with `@joi/date`) with the apps, so the engine and the apps all use the
 * same instance
 *
 * @module JoiWrapper
 */

import JoiBase from 'joi'
import JoiDate from '@joi/date'

const Joi = JoiBase.extend(JoiDate)

export default Joi
