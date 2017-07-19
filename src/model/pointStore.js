import { readingArrayToDataPoints } from '../model/stations';

const _ = require('lodash');

// Takes an array of readings and forms an object keyed by datetime string
// where the value is an array of data points for that time
function binReadings(readings) {
  const bins = {};
  readings.map((reading) => {
    if (bins[reading.moment()]) {
      bins[reading.moment()].push(reading);
    } else {
      bins[reading.moment()] = [reading];
    }
    return null;
  });
  return bins;
}


/** Encapsulate a set of points for dates **/
export default class PointStore {
  constructor(limit, getterFunction, locations) {
    this.limit = limit;
    this.getterFunction = getterFunction;
    this.points = {};
    this.loadingDays = [];
    this.locations = locations;
  }

  // Stores points for required day
  getDay(date) {
    let completionPromise;
    const getPromises = [];
    if (!this.loadingDays[date]) {
      this.loadingDays[date] = true;
      for (let i = 0; i < this.limit; i += 10000) {
        // eslint-disable-next-line
        getPromises.push(this.getterFunction({ date, '_offset': i }));
      }
      completionPromise = Promise.all(getPromises)
        .then(out =>
          out.reduce((all, page) =>
            all.concat(page)
          , []),
        )
        .then(readings =>
          binReadings(readings))
        .then((result) => {
          const out = {};
          Object.keys(result).map((key) => {
            out[key] = readingArrayToDataPoints(this.locations, result[key]);
            return null;
          });
          return out;
        })
        .then((result) => {
          this.points = _.extend(this.points, result);
          return Promise.resolve('complete');
        });
    } else {
      completionPromise = Promise.resolve('already polled');
    }
    return {
      total: this.limit / 10000,
      getPromises,
      completionPromise,
    };
  }

  getLatest() {
    return this.getterFunction({ latest: '' })
      .then(readings => readingArrayToDataPoints(this.locations, readings));
  }

  getPoint(date) {
    let pointPromise;
    if (this.points[date]) {
      pointPromise = Promise.resolve(this.points[date]);
    } else {
      pointPromise = Promise.resolve([]);
    }
    return pointPromise;
  }
}
