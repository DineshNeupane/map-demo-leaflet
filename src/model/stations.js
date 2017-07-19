import { tideReadings, riverReadings, rainReadings, allStations }
  from '../services/tide-api';
import DataPoint from '../model/dataPoint';

const Promise = require('bluebird');

let stations;
let stationsPromise;

let measures;
let measuresPromise;

// Get and cache stations
function retrieveStations() {
  stationsPromise = allStations()
    .then((stns) => {
      stations = stns;
      stationsPromise = null;
      return stns;
    });
  return stationsPromise;
}

// Returns (potentially cached) stations
function stationsCollection() {
  if (stations) {
    return Promise.resolve(stations);
  } else if (stationsPromise) {
    return stationsPromise;
  }

  return retrieveStations();
}

// Returns an object keyed by measure URI whose value is the lat and long of the
// measure station
function measureLocations() {
  let locationPromise;
  // Measures already available
  if (measures) {
    locationPromise = Promise.resolve(measures);
  // Promise of measures available
  } else if (measuresPromise) {
    locationPromise = measuresPromise;
  // Compute measures
  } else {
    measuresPromise = stationsCollection().then((stationlist) => {
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
      measures = measureLocs;
      return measureLocs;
    });
    locationPromise = measuresPromise;
  }
  return locationPromise;
}

function getPointFromReading(reading, locations) {
  return {
    lat: locations[reading.measure()].lat,
    long: locations[reading.measure()].long,
    value: reading.value(),
  };
}

function latestValues() {
  return measureLocations()
    .then(locations =>
      Promise.join(tideReadings(), riverReadings(), rainReadings(),
        (tideResults, riverResults, rainResults) => {
          const tide = tideResults.map(tidalLevel =>
            getPointFromReading(tidalLevel, locations));
          const river = riverResults.map(riverLevel =>
            getPointFromReading(riverLevel, locations));
          const rain = rainResults.map(rainLevel =>
            getPointFromReading(rainLevel, locations));
          return { tide, river, rain };
        }),
    );
}

// Converts array of Readings to array of dataPoints
function readingArrayToDataPoints(locations, readings) {
  let dataPointsArray = [];
  if (readings) {
    dataPointsArray = readings.reduce((dataPoints, reading) => {
      if (locations[reading.measure()]) {
        const val = getPointFromReading(reading, locations);
        if (val.lat !== undefined || val.long !== undefined) {
          dataPoints.push(new DataPoint(val));
        }
      }
      return dataPoints;
    }, []);
  }
  return dataPointsArray;
}

export { measureLocations, stationsCollection,
  latestValues, readingArrayToDataPoints };
