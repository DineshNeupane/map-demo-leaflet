const request = require('superagent');
const moment = require('moment');

const API_ROOT = 'http://192.168.1.131:3000/api/';
const READING_ROOT = 'reading/';
const LEVEL_ROOT = 'levels/';
const TIDE_ROOT = 'tide/';

function dateTimeHandler(date, time) {
  let urlPromise;
  if (moment(date, 'YYYY-MM-DD').isValid() && moment(time, 'hh-mm').isValid()) {
    urlPromise =
      Promise.resolve(`${date}/${moment(time, 'hh:mm').format('hh-mm')}`);
  } else {
    urlPromise = Promise.reject('Invalid date');
  }
  return urlPromise;
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
    .then(response => response.body.data);
}

export function getLevels(date, time) {
  return dateTimeHandler(date, time)
    .then(dateTimeString =>
      getJSON(`${API_ROOT}${LEVEL_ROOT}${dateTimeString}`))
    .then(response => response.body.data);
}

export function getTide(date, time) {
  return dateTimeHandler(date, time)
    .then(dateTimeString => getJSON(`${API_ROOT}${TIDE_ROOT}${dateTimeString}`))
    .then(response => response.body.data);
}
