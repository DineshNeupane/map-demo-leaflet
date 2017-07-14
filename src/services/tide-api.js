import Station from '../model/station';
import { Reading } from '../model/reading';

const request = require('superagent');
const _ = require('lodash');

const API_ROOT = '//environment.data.gov.uk';
const STATIONS_ENDPOINT = '/flood-monitoring/id/stations';
const READINGS_ENDPOINT = '/flood-monitoring/data/readings';

function getJSON(apiPath, params) {
  const protocol =
    window.location.protocol !== 'about:' ? window.location.protocol : 'https:';
  const api = protocol + API_ROOT + apiPath;
  const reqPromise = request
      .get(api)
      .accept('application/json')
      .query(params || {});
  return reqPromise;
}

function wrapValues(ValueClass, items) {
  return _.map(items.body.items, item => new ValueClass(item));
}

export function tideReadings(options) {
  const params =
    _.extend(
      { qualifier: 'Tidal Level', _limit: 10000 },
      options);
  return getJSON(`${READINGS_ENDPOINT}`, params)
    .then(items => wrapValues(Reading, items));
}

export function riverReadings(options) {
  const params =
    _.extend(
      { qualifier: 'Stage', _limit: 10000 },
      options);
  return getJSON(`${READINGS_ENDPOINT}`, params)
    .then(items => wrapValues(Reading, items));
}

export function rainReadings(options) {
  const params =
    _.extend(
      { parameter: 'rainfall', _limit: 10000 },
      options);
  return getJSON(`${READINGS_ENDPOINT}`, params)
      .then(items => wrapValues(Reading, items));
}

export function allStations(options) {
  const params = _.extend({}, options);
  return getJSON(STATIONS_ENDPOINT, params)
    .then(items => wrapValues(Station, items));
}
