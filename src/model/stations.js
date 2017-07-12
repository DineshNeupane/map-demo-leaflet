const allStations = require('../services/tide-api.js').allStations;

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
  const measureLocs = {};
  return stationsCollection().then((stationlist) => {
    stationlist.map((station) => {
      station.measure().map((measureVal) => {
        measureLocs[measureVal['@id']] = {
          lat: station.lat(),
          long: station.long(),
        };
        return null;
      });
      return null;
    });
    return measureLocs;
  });
}

export { measureLocations, stationsCollection };
