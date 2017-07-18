import { readingArrayToDataPoints } from '../model/stations';

const _ = require('lodash');

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
  console.log(bins);
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


  getDay(date) {
    let completionPromise;
    if (!this.loadingDays[date]) {
      console.log('getting day');
      this.loadingDays[date] = true;
      const getPromises = [];
      for (let i = 0; i < this.limit; i += 10000) {
        // eslint-disable-next-line
        getPromises.push(this.getterFunction({ date, '_offset': i }));
      }
      completionPromise = Promise.all(getPromises)
        .then((out) => {
          console.log(out);
          return out;
        })
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
          console.log(this.points);
          return Promise.resolve('complete');
        });
    } else {
      completionPromise = Promise.resolve('already polled');
    }
    return completionPromise;
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
