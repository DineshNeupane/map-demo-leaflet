import { tideReadings, riverReadings, rainReadings, allStations }
  from '../services/tide-api';
import DataPoint from '../model/dataPoint';

const Promise = require('bluebird');

let stations;
let stationsPromise;

function retrieveStations() {
  stationsPromise = allStations()
    .then((stns) => {
      stations = stns;
      stationsPromise = null;
      return stns;
    });
  return stationsPromise;
}

function stationsCollection() {
  if (stations) {
    return Promise.resolve(stations);
  } else if (stationsPromise) {
    return stationsPromise;
  }

  return retrieveStations();
}

function measureLocations() {
  return stationsCollection().then((stationlist) => {
    const measureLocs = {};
    stationlist.map((station) => {
      station.measure().map((measureVal) => {
        if (!measureLocs[measureVal['@id']]) {
          measureLocs[measureVal['@id']] = {
            lat: station.lat(),
            long: station.long(),
          };
        }
        return null;
      });
      return null;
    });
    return measureLocs;
  });
}

function latestValues() {
  return measureLocations()
    .then(locations =>
      Promise.join(tideReadings(), riverReadings(), rainReadings(),
        (tideResults, riverResults, rainResults) => {
          const tide = tideResults.map(tidalLevel => ({
            lat: locations[tidalLevel.measure()].lat,
            long: locations[tidalLevel.measure()].long,
            value: tidalLevel.value(),
          }));
          const river = riverResults.map(riverLevel => ({
            lat: locations[riverLevel.measure()].lat,
            long: locations[riverLevel.measure()].long,
            value: riverLevel.value(),
          }));
          const rain = rainResults.map(rainLevel => ({
            lat: locations[rainLevel.measure()].lat,
            long: locations[rainLevel.measure()].long,
            value: rainLevel.value(),
          }));
          return { tide, river, rain };
        }),
    );
}

function readingArrayToDataPoints(locations, readings) {
  return readings.reduce((result, reading) => {
    if (locations[reading.measure()]) {
      const val = {
        lat: locations[reading.measure()].lat,
        long: locations[reading.measure()].long,
        value: reading.value(),
      };
      if (val.lat !== undefined || val.long !== undefined) {
        result.push(new DataPoint(val));
      }
    }
    return result;
  }, []);
}

export { measureLocations, stationsCollection,
  latestValues, readingArrayToDataPoints };
