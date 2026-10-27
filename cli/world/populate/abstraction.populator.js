import licenceVersionPurposePointData from '../data/licence-version-purpose-point.data.js'
import pointData from '../data/point.data.js'
import { purposesOn } from './helpers/purposes.helpers.js'
import { regionOf } from './helpers/regions.helpers.js'

// The abstraction periods the licences abstract during. Each licence takes the next one, going back to the start of the
// list when it runs out.
//
// About a third of licences abstract all year, 1 January to 31 December, so about a third of the periods are. About a
// quarter are 1 April to 31 March. The rest are shared between the summer and winter periods. The list is a different
// length to the start dates, the purposes and any of the groups of licences, so a kind of licence is not always given
// the same abstraction period.
const ABSTRACTION_PERIODS = [
  { startDay: 1, startMonth: 1, endDay: 31, endMonth: 12 },
  { startDay: 1, startMonth: 4, endDay: 31, endMonth: 3 },
  { startDay: 1, startMonth: 4, endDay: 31, endMonth: 10 },
  { startDay: 1, startMonth: 1, endDay: 31, endMonth: 12 },
  { startDay: 1, startMonth: 4, endDay: 30, endMonth: 9 },
  { startDay: 1, startMonth: 4, endDay: 31, endMonth: 3 },
  { startDay: 1, startMonth: 1, endDay: 31, endMonth: 12 },
  { startDay: 1, startMonth: 11, endDay: 31, endMonth: 3 },
  { startDay: 1, startMonth: 4, endDay: 31, endMonth: 10 },
  { startDay: 1, startMonth: 1, endDay: 31, endMonth: 12 },
  { startDay: 1, startMonth: 4, endDay: 31, endMonth: 3 },
  { startDay: 1, startMonth: 3, endDay: 31, endMonth: 10 },
  { startDay: 1, startMonth: 1, endDay: 31, endMonth: 12 },
  { startDay: 1, startMonth: 4, endDay: 30, endMonth: 9 },
  { startDay: 1, startMonth: 4, endDay: 31, endMonth: 3 },
  { startDay: 1, startMonth: 1, endDay: 31, endMonth: 12 },
  { startDay: 1, startMonth: 5, endDay: 30, endMonth: 9 }
]

// The quantities the licences can abstract up to: in a year, a day and an hour in cubic metres, and in an instant in
// litres per second. Each licence takes the next one for its first purpose, and the ones after it for any other
// purposes it has, going back to the start of the list when it runs out.
//
// A purpose nearly always has an annual and a daily quantity. About half have an hourly and an instant quantity too,
// and the rest are missing one or both. Most annual quantities are between 1,000 and 100,000, with a few smaller and a
// few much larger. The list is a different length to the start dates, the purposes, the abstraction periods and any of
// the groups of licences, so a kind of licence is not always given the same quantities.
const QUANTITIES = [
  { annual: 20000, daily: 432, hourly: 36, instant: 10 },
  { annual: 4546, daily: 45.46, hourly: null, instant: null },
  { annual: 250000, daily: 2400, hourly: 100, instant: null },
  { annual: 10000, daily: 200, hourly: 18, instant: 5 },
  { annual: 2273, daily: 22.7, hourly: 2.3, instant: null },
  { annual: 50000, daily: 1080, hourly: 90, instant: 25 },
  { annual: 500, daily: 5, hourly: null, instant: null },
  { annual: 22730, daily: 545.5, hourly: null, instant: 12.6 },
  { annual: 5000, daily: 60, hourly: 7.2, instant: 2 },
  { annual: 2000000, daily: 9600, hourly: 400, instant: 111.1 },
  { annual: 9092, daily: 90.9, hourly: null, instant: null },
  { annual: 30000, daily: 648, hourly: 54, instant: 15 },
  { annual: 600000, daily: 3600, hourly: 150, instant: null }
]

// How many points the licences abstract from. Each licence takes the next one, going back to the start of the list when
// it runs out.
//
// Most licences abstract from one point. About one in ten abstract from two, and a few from more. The list is a
// different length to the other lists and any of the groups of licences, so a kind of licence does not always have the
// same number of points.
const POINTS = [1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 5, 1, 1, 1, 1, 2, 1, 1]

/**
 * Give the licences what they abstract: the points they abstract from, the period they abstract during and the
 * quantities they can abstract up to
 *
 * Each licence is given the next number of points, the next abstraction period and the next quantities in their lists,
 * going back to the start of a list when it runs out. A licence with more than one purpose takes the quantities after
 * its first purpose's for the others.
 *
 * Call this after everything has been added to the licences, as new purposes and licence versions are built with the
 * period and quantity a licence starts with.
 *
 * @param {object[]} licenceEntities - the licence entities to change
 */
export default function abstraction(licenceEntities) {
  for (let i = 0; i < licenceEntities.length; i++) {
    _abstractFrom(licenceEntities[i], regionOf(licenceEntities[i]).region, POINTS[i % POINTS.length])
    _abstractDuring(licenceEntities[i], ABSTRACTION_PERIODS[i % ABSTRACTION_PERIODS.length])
    _abstractUpTo(licenceEntities[i], QUANTITIES, i % QUANTITIES.length)
  }
}

/**
 * Give a licence a number of points to abstract from
 *
 * Points are added until the licence has that many. A licence that already has that many, or more, is left alone.
 *
 * Each point added is linked to the first purpose on every licence version, so the licence has abstracted from it for
 * as long as it has been held.
 *
 * @private
 */
function _abstractFrom(licenceEntity, region, points) {
  const licenceVersions = licenceEntity.licenceVersions

  while (licenceEntity.points.length < points) {
    const point = pointData(region)

    point.description = `Example point ${licenceEntity.points.length + 1}`
    point.ngr1 = 'TT 9876 5432'

    licenceEntity.points.push(point)

    for (const licenceVersion of licenceVersions) {
      const firstPurpose = purposesOn(licenceEntity, licenceVersion)[0]

      licenceEntity.licenceVersionPurposePoints.push(licenceVersionPurposePointData(firstPurpose, point))
    }
  }

  return licenceEntity
}

/**
 * Change the abstraction period a licence abstracts during
 *
 * A licence is built with an abstraction period of 1 April to 31 March. This gives it another, for example 1 November
 * to 31 March. Every purpose on every licence version is given the same one.
 *
 * @private
 */
function _abstractDuring(licenceEntity, abstractionPeriod) {
  const licenceVersionPurposes = licenceEntity.licenceVersionPurposes

  for (const licenceVersionPurpose of licenceVersionPurposes) {
    licenceVersionPurpose.abstractionPeriodStartDay = abstractionPeriod.startDay
    licenceVersionPurpose.abstractionPeriodStartMonth = abstractionPeriod.startMonth
    licenceVersionPurpose.abstractionPeriodEndDay = abstractionPeriod.endDay
    licenceVersionPurpose.abstractionPeriodEndMonth = abstractionPeriod.endMonth
  }

  return licenceEntity
}

/**
 * Change the quantities a licence can abstract up to
 *
 * A licence is built with an annual quantity of 1554 on its purpose, and no daily, hourly or instant quantity. This
 * gives each purpose all four, though the hourly and instant ones can be empty.
 *
 * The first purpose on a licence version is given the quantities at `first` in the list, the second the ones after, and
 * so on, going back to the start of the list when it runs out. So the purposes on a licence version have different
 * quantities. A purpose is in the same place on every licence version, so it has the same quantities on them all.
 *
 * @private
 */
function _abstractUpTo(licenceEntity, quantities, first) {
  const licenceVersions = licenceEntity.licenceVersions

  for (const licenceVersion of licenceVersions) {
    const purposesOnVersion = purposesOn(licenceEntity, licenceVersion)

    for (let i = 0; i < purposesOnVersion.length; i++) {
      const { annual, daily, hourly, instant } = quantities[(first + i) % quantities.length]

      purposesOnVersion[i].annualQuantity = annual
      purposesOnVersion[i].dailyQuantity = daily
      purposesOnVersion[i].hourlyQuantity = hourly
      purposesOnVersion[i].instantQuantity = instant
    }
  }

  return licenceEntity
}
