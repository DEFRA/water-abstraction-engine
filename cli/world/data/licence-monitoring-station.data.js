/**
 * Build a licence monitoring station record linking a licence to a monitoring station
 *
 * @param {object} licence - the licence record
 * @param {object} monitoringStation - the monitoring station record
 *
 * @returns {object} the data to load
 */
export default function (licence, monitoringStation) {
  return {
    licenceId: licence.id,
    monitoringStationId: monitoringStation.id,
    abstractionPeriodStartDay: 10,
    abstractionPeriodStartMonth: 10,
    abstractionPeriodEndDay: 11,
    abstractionPeriodEndMonth: 11,
    restrictionType: 'stop'
  }
}
