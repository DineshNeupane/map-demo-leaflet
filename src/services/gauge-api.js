import Station from '../model/station';
import { Reading } from '../model/reading';

const request = require('superagent');
const _ = require('lodash');

const API_ROOT = '//environment.data.gov.uk';
const STATIONS_ENDPOINT = '/flood-monitoring/id/stations';
const READINGS_ENDPOINT = '/flood-monitoring/data/readings';

function getJSON(apiPath, params, latest) {
  const protocol =
    window.location.protocol !== 'about:' ? window.location.protocol : 'https:';
  const api = protocol + API_ROOT + apiPath;
  const reqPromise = request
      .get(api)
      .accept('application/json')
      .query(params || {});
  if (latest) {
    reqPromise.query('latest');
  }
  return reqPromise;
}

function resultItems(response) {
  return response.body.items;
}


function wrapValues(ValueClass, items) {
  return _.map(items, item => new ValueClass(item));
}

export function allStations(options) {
  const params = _.extend({ parameter: 'rainfall', _view: 'full' }, options);
  return getJSON(STATIONS_ENDPOINT, params)
    .then(resultItems)
    .then(_.partial(wrapValues, Station));
}

export function stationDetails(stationId) {
  return getJSON(`${STATIONS_ENDPOINT}/${stationId}`, { _view: 'full' })
    .then(resultItems, () => null)
    .then(json => (json ? new Station(json) : {}.undefined));
}

export default function stationMeasures(stationId, options) {
  return getJSON(`${STATIONS_ENDPOINT}/${stationId}/readings`, options)
    .then(resultItems)
    .then(_.partial(wrapValues, Reading));
}

export function stationReadings(startdate, enddate, options) {
  const defaults = {
    parameter: 'rainfall',
    startdate,
    enddate,
    _limit: '10000',
    _view: 'full',
  };
  const params = _.extend(defaults, options);
  return getJSON(`${READINGS_ENDPOINT}`, params)
    .then(resultItems)
    .then(_.partial(wrapValues, Reading));
}

export function levelReadings(options) {
  const params = _.extend({ parameter: 'level', _view: 'full' }, options);
  return getJSON(`${READINGS_ENDPOINT}`, params)
    .then((results) => {
      console.log(results);
      return results;
    })
    .then(_.partial(wrapValues, Reading));
}
