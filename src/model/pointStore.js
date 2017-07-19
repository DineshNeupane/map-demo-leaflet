import { readingArrayToDataPoints } from '../model/stations';

const _ = require('lodash');

const API_READING_LIMIT = 10000;

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
    const pagePromises = [];
    if (!this.loadingDays[date]) {
      this.loadingDays[date] = true;
      for (let i = 0; i < this.limit; i += API_READING_LIMIT) {
        // eslint-disable-next-line
        pagePromises.push(this.getterFunction({ date, '_offset': i }));
      }
      completionPromise = Promise.all(pagePromises)
        .then(pages =>
          // take array of array of readings and convert them to a single array
          // of readings
          pages.reduce((all, page) => all.concat(page), []),
        )
        .then(readings =>
          binReadings(readings))
        .then((binnedReadings) => {
          const dataPointsByDatetime = {};
          Object.keys(binnedReadings).map((key) => {
            dataPointsByDatetime[key] =
              readingArrayToDataPoints(this.locations, binnedReadings[key]);
            return null;
          });
          return dataPointsByDatetime;
        })
        .then((dataPoints) => {
          this.points = _.extend(this.points, dataPoints);
          return Promise.resolve('complete');
        });
    } else {
      completionPromise = Promise.resolve('already polled');
    }
    return {
      total: this.limit / API_READING_LIMIT,
      pagePromises,
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
