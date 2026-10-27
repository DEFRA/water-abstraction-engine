import { addCondition } from './helpers/conditions.helpers.js'
import { currentPurpose } from './helpers/purposes.helpers.js'
import { generateUUID } from '../../../test/support/generators.js'
import { licenceModel } from './helpers/end-dates.helpers.js'
import licenceMonitoringStationData from '../data/licence-monitoring-station.data.js'
import monitoringStationHelper from '../../../test/support/helpers/monitoring-station.helper.js'
import { formatDateToIso, relativeToToday } from '../helpers/date.helpers.js'

// How often a live licence is tagged to a monitoring station. Every 6th live licence is, starting with its first.
//
// Only a few licences are tagged, and nearly all of them are live.
const MONITORING_STATION_EVERY = 6

// The monitoring stations the tagged licences are tagged to, and how many tagged licences each one has. The tagged
// licences take them in order, going back to the start of the list when it runs out. A station is picked by its place
// in the monitoring stations the engine seeds, missing the first few which the specs use.
//
// Most stations have one or a few licences tagged to them, and a few have many.
const MONITORING_STATIONS = [
  { station: 10, licences: 21 },
  { station: 11, licences: 8 },
  { station: 12, licences: 7 },
  { station: 13, licences: 3 },
  { station: 14, licences: 3 },
  { station: 15, licences: 3 },
  { station: 16, licences: 3 },
  { station: 17, licences: 3 },
  { station: 18, licences: 2 },
  { station: 19, licences: 2 },
  { station: 20, licences: 2 },
  { station: 21, licences: 2 },
  { station: 22, licences: 2 },
  { station: 23, licences: 1 },
  { station: 24, licences: 1 },
  { station: 25, licences: 1 },
  { station: 26, licences: 1 },
  { station: 27, licences: 1 },
  { station: 28, licences: 1 },
  { station: 29, licences: 1 },
  { station: 30, licences: 1 },
  { station: 31, licences: 1 },
  { station: 32, licences: 1 },
  { station: 33, licences: 1 },
  { station: 34, licences: 1 },
  { station: 35, licences: 1 }
]

// How many times a tagged licence is tagged to its monitoring station. Each tagged licence takes the next one, going
// back to the start of the list when it runs out.
//
// Most are tagged once. Some are tagged twice, and a few three times.
const TAGS_PER_LICENCE = [1, 1, 2, 1, 1, 3, 1, 2, 1, 1]

// The tags. Each tag takes the next one, going back to the start of the list when it runs out.
//
// Most tags measure flow and the rest measure level. Most stop abstraction, and a few reduce it or do either, whatever
// they measure. About two thirds are linked to a cessation condition on the licence, and the rest have their own
// abstraction period. Most have last been sent a resume alert, some a stop alert, and a few a warning or reduce alert.
// A stop alert is only sent for a tag that stops abstraction, and a reduce alert for one that reduces it. The list is a
// different length to the tags per licence, so a licence is not always given the same kinds of tag.
const TAGS = [
  {
    measureType: 'flow',
    restrictionType: 'stop',
    thresholdUnit: 'Ml/d',
    thresholdValue: 83.8,
    linkedCondition: true,
    status: 'resume'
  },
  {
    measureType: 'flow',
    restrictionType: 'stop',
    thresholdUnit: 'm3/s',
    thresholdValue: 1.3,
    linkedCondition: true,
    status: 'stop'
  },
  {
    measureType: 'flow',
    restrictionType: 'stop',
    thresholdUnit: 'Ml/d',
    thresholdValue: 26.4,
    linkedCondition: false,
    status: 'resume'
  },
  {
    measureType: 'level',
    restrictionType: 'stop',
    thresholdUnit: 'SLD',
    thresholdValue: 99.45,
    linkedCondition: true,
    status: 'resume'
  },
  {
    measureType: 'flow',
    restrictionType: 'stop',
    thresholdUnit: 'l/s',
    thresholdValue: 300,
    linkedCondition: true,
    status: 'resume'
  },
  {
    measureType: 'flow',
    restrictionType: 'reduce',
    thresholdUnit: 'm3/s',
    thresholdValue: 3.68,
    linkedCondition: false,
    status: 'resume'
  },
  {
    measureType: 'flow',
    restrictionType: 'stop',
    thresholdUnit: 'Ml/d',
    thresholdValue: 428.1,
    linkedCondition: true,
    status: 'stop'
  },
  {
    measureType: 'flow',
    restrictionType: 'stop',
    thresholdUnit: 'm3/s',
    thresholdValue: 1.3,
    linkedCondition: false,
    status: 'resume'
  },
  {
    measureType: 'flow',
    restrictionType: 'stop',
    thresholdUnit: 'm3/d',
    thresholdValue: 45460,
    linkedCondition: true,
    status: 'warning'
  },
  {
    measureType: 'flow',
    restrictionType: 'stop_or_reduce',
    thresholdUnit: 'Ml/d',
    thresholdValue: 83.8,
    linkedCondition: true,
    status: 'reduce'
  },
  {
    measureType: 'level',
    restrictionType: 'reduce',
    thresholdUnit: 'mAOD',
    thresholdValue: 2,
    linkedCondition: false,
    status: 'resume'
  },
  {
    measureType: 'flow',
    restrictionType: 'stop',
    thresholdUnit: 'm3/s',
    thresholdValue: 1.3,
    linkedCondition: true,
    status: 'resume'
  },
  {
    measureType: 'flow',
    restrictionType: 'stop',
    thresholdUnit: 'l/s',
    thresholdValue: 108.75,
    linkedCondition: false,
    status: 'stop'
  },
  {
    measureType: 'flow',
    restrictionType: 'stop',
    thresholdUnit: 'Ml/d',
    thresholdValue: 83.8,
    linkedCondition: true,
    status: 'resume'
  },
  {
    measureType: 'flow',
    restrictionType: 'stop',
    thresholdUnit: 'm3/s',
    thresholdValue: 1.3,
    linkedCondition: true,
    status: 'resume'
  },
  {
    measureType: 'flow',
    restrictionType: 'stop',
    thresholdUnit: 'Ml/d',
    thresholdValue: 26.4,
    linkedCondition: true,
    status: 'resume'
  },
  {
    measureType: 'level',
    restrictionType: 'stop_or_reduce',
    thresholdUnit: 'mBOD',
    thresholdValue: 0.75,
    linkedCondition: true,
    status: 'reduce'
  },
  {
    measureType: 'flow',
    restrictionType: 'stop',
    thresholdUnit: 'm3/s',
    thresholdValue: 1.3,
    linkedCondition: false,
    status: 'resume'
  },
  {
    measureType: 'flow',
    restrictionType: 'stop',
    thresholdUnit: 'l/s',
    thresholdValue: 300,
    linkedCondition: true,
    status: 'stop'
  },
  {
    measureType: 'flow',
    restrictionType: 'stop',
    thresholdUnit: 'Ml/d',
    thresholdValue: 83.8,
    linkedCondition: true,
    status: 'resume'
  },
  {
    measureType: 'flow',
    restrictionType: 'stop',
    thresholdUnit: 'm3/s',
    thresholdValue: 1.3,
    linkedCondition: true,
    status: 'resume'
  }
]

// The cessation condition a tag is linked to, by what the tag measures
const CONDITION_TYPES = {
  flow: 'Flow cessation condition',
  level: 'Level cessation condition'
}

/**
 * Tag some of the live licences to monitoring stations
 *
 * Every 6th licence that is still live is tagged to the next monitoring station, the next number of times, with the
 * next tags in the list. Each monitoring station is used for its number of licences before moving on to the next.
 *
 * Call this after the licences' abstraction periods and end dates have been set.
 *
 * @param {object[]} licenceEntities - the licence entities to change
 */
export default function monitoringStations(licenceEntities) {
  const liveLicenceEntities = licenceEntities.filter((licenceEntity) => {
    return !licenceModel(licenceEntity).$ended()
  })

  const stations = []

  for (const { station, licences } of MONITORING_STATIONS) {
    for (let i = 0; i < licences; i++) {
      stations.push(station)
    }
  }

  let tagCount = 0

  for (let i = 0; i < liveLicenceEntities.length; i += MONITORING_STATION_EVERY) {
    const taggedCount = i / MONITORING_STATION_EVERY
    const monitoringStation = monitoringStationHelper.select(stations[taggedCount % stations.length])

    for (let j = 0; j < TAGS_PER_LICENCE[taggedCount % TAGS_PER_LICENCE.length]; j++) {
      _tagToMonitoringStation(liveLicenceEntities[i], monitoringStation, TAGS[tagCount % TAGS.length])
      tagCount++
    }
  }
}

/**
 * Tag a licence to a monitoring station
 *
 * The tag has the abstraction period of the first purpose on the licence's current licence version. Where it is linked
 * to a condition, a cessation condition for what it measures is added to the licence for it. Where its last alert was
 * not a resume alert, it was sent 7 days ago.
 *
 * @private
 */
function _tagToMonitoringStation(licenceEntity, monitoringStation, tag) {
  // A licence is built with no tags. The first time this is called the list is created
  licenceEntity.licenceMonitoringStations ??= []

  const purpose = currentPurpose(licenceEntity)
  const licenceMonitoringStation = licenceMonitoringStationData(licenceEntity.licence, monitoringStation)

  licenceMonitoringStation.measureType = tag.measureType
  licenceMonitoringStation.restrictionType = tag.restrictionType
  licenceMonitoringStation.thresholdUnit = tag.thresholdUnit
  licenceMonitoringStation.thresholdValue = tag.thresholdValue
  licenceMonitoringStation.abstractionPeriodStartDay = purpose.abstractionPeriodStartDay
  licenceMonitoringStation.abstractionPeriodStartMonth = purpose.abstractionPeriodStartMonth
  licenceMonitoringStation.abstractionPeriodEndDay = purpose.abstractionPeriodEndDay
  licenceMonitoringStation.abstractionPeriodEndMonth = purpose.abstractionPeriodEndMonth
  licenceMonitoringStation.status = tag.status

  if (tag.status !== 'resume') {
    licenceMonitoringStation.statusUpdatedAt = formatDateToIso(relativeToToday(-7))
  }

  if (tag.linkedCondition) {
    addCondition(licenceEntity)

    const condition = licenceEntity.licenceVersionPurposeConditions.at(-1)

    // A condition is built without an id, so it is given one for the tag to link to
    condition.id = generateUUID()
    condition.licenceVersionPurposeConditionTypeId.lookup = 'displayTitle'
    condition.licenceVersionPurposeConditionTypeId.value = CONDITION_TYPES[tag.measureType]

    licenceMonitoringStation.licenceVersionPurposeConditionId = condition.id
  }

  licenceEntity.licenceMonitoringStations.push(licenceMonitoringStation)
}
