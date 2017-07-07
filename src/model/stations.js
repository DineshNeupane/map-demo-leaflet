const _ = require('lodash');
const moment = require('moment');
const allStations = require('../services/gauge-api.js').allStations;
const allReadings = require('../services/gauge-api.js').stationReadings;

let stations;
let stationsPromise;
let pointStore = {};

function retrieveStations() {
  stationsPromise = allStations()
    .then((stns) => {
      stations = stns;
      stationsPromise = null;
      return stns;
    });
  return stationsPromise;
}

function retrieveReadings(startdate, enddate) {
  return allReadings(startdate, enddate);
}

export function readingsCollection(date) {
  const startdate = date;
  const enddate = moment(date, 'YYYY-MM-DD')
    .add(1, 'days')
    .format('YYYY-MM-DD');
  return retrieveReadings(startdate, enddate);
}

export function stationsCollection() {
  if (stations) {
    return Promise.resolve(stations);
  } else if (stationsPromise) {
    return stationsPromise;
  }

  return retrieveStations();
}

export default function getPoints(date) {
  if (!pointStore) {
    if (typeof (Storage) !== 'undefined' && localStorage.pointStore) {
      pointStore = JSON.parse(localStorage.getItem('pointStore'));
    } else {
      pointStore = {};
    }
  }
  if (pointStore[date]) {
    if (pointStore[date].points) {
      return Promise.resolve(pointStore[date].points);
    }
    return pointStore[date].promise;
  }
  const pointPromise =
    Promise.all([stationsCollection(), readingsCollection(date)])
    .then((results) => {
      const stationValues = results[0];
      const readingValues = results[1];
      return readingValues.map((reading) => {
        const station = _.find(stationValues, (o) => {
          const stationRef = o.get('stationReference');
          const measureStationRef = reading.get('measure.stationReference');
          return stationRef === measureStationRef;
        });
        if (station) {
          const obj = {
            reference: station.reference(),
            location: [station.lat(), station.long()],
            scale: reading.get('value'),
          };
          return obj;
        }
        return {};
      });
    })
    .then((points) => {
      pointStore[date].points = points;
      if (typeof (Storage) !== 'undefined') {
        localStorage.setItem('pointStore', JSON.stringify(pointStore));
      }
      return points;
    });
  pointStore[date] = { promise: pointPromise };
  return pointPromise;
}

function compactify(arr, fieldFn) {
  return _.uniq(
    _.reject(
      _.map(arr, value => value[fieldFn].call(value)),
      _.isEmpty,
   ));
}

export function riverNames() {
  return stationsCollection()
    .then(stns => compactify(stns, 'riverName'));
}

