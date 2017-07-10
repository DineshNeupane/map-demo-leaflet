import DataPoint from '../model/dataPoint';

const request = require('superagent');
const moment = require('moment');
const _ = require('lodash');

const API_ROOT = 'http://192.168.1.131:3000/api/';
const READING_ROOT = 'reading/';
const LEVEL_ROOT = 'levels/';
const TIDE_ROOT = 'tide/';

export function dateTimeHandler(date, time) {
  let urlPromise;
  if (moment(date, 'YYYY-MM-DD').isValid() && moment(time, 'HH-mm').isValid()) {
    urlPromise =
      Promise.resolve(`${date}/${moment(time, 'HH:mm').format('HH-mm')}`);
  } else {
    urlPromise = Promise.reject('Invalid date');
  }
  return urlPromise;
}

function wrapValues(ValueClass, items) {
  return _.map(items, item => new ValueClass(item));
}

export function getJSON(api) {
  return request
        .get(api)
        .accept('application/json');
}

export function getPoints(date, time) {
  return dateTimeHandler(date, time)
    .then(dateTimeString =>
      getJSON(`${API_ROOT}${READING_ROOT}${dateTimeString}`))
    .then(response => response.body.data)
    .then(_.partial(wrapValues, DataPoint));
}

export function getLevels(date, time) {
  return dateTimeHandler(date, time)
    .then(dateTimeString =>
      getJSON(`${API_ROOT}${LEVEL_ROOT}${dateTimeString}`))
    .then(response => response.body.data)
    .then(_.partial(wrapValues, DataPoint));
}

export function getTide(date, time) {
  return dateTimeHandler(date, time)
    .then(dateTimeString => getJSON(`${API_ROOT}${TIDE_ROOT}${dateTimeString}`))
    .then(response => response.body.data)
    .then(_.partial(wrapValues, DataPoint));
}
