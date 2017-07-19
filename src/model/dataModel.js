import { measureLocations } from '../model/stations';
import PointStore from '../model/pointStore';
import
  { rainReadings, tideReadings, riverReadings }
    from '../services/tide-api';

const Promise = require('bluebird');
const moment = require('moment');

export default class dataModel {
  constructor() {
    this.measurePromise = measureLocations();
    this.rainStorePromise = this.measurePromise.then(locations =>
      new PointStore(90000, rainReadings, locations));
    this.tideStorePromise = this.measurePromise.then(locations =>
      new PointStore(30000, tideReadings, locations));
    this.levelStorePromise = this.measurePromise.then(locations =>
      new PointStore(250000, riverReadings, locations));
  }

  // Calls getters from requiredType to get latest data
  getLatest(requiredType) {
    let rainPromise = Promise.resolve([]);
    let tidePromise = Promise.resolve([]);
    let floodingPromise = Promise.resolve([]);
    if (requiredType.rainfall) {
      rainPromise = this.rainStorePromise.then(store => store.getLatest());
    }
    if (requiredType.flooding) {
      floodingPromise = this.levelStorePromise.then(store => store.getLatest());
    }
    if (requiredType.tide) {
      tidePromise = this.tideStorePromise.then(store => store.getLatest());
    }
    return Promise.join(floodingPromise, rainPromise, tidePromise,
      (levelPoints, rainPoints, tidePoints) =>
        ({ levelPoints, rainPoints, tidePoints }));
  }

  // Calls getters from requiredType to get data for date
  getDate(date, requiredType) {
    const loadPromises = {};
    if (requiredType.rainfall) {
      loadPromises.rain = {
        promise: this.rainStorePromise.then(store => store.getDay(date)),
        type: 'rainfall',
      };
    }
    if (requiredType.flooding) {
      loadPromises.level = {
        promise: this.levelStorePromise.then(store => store.getDay(date)),
        type: 'level',
      };
    }
    if (requiredType.tide) {
      loadPromises.tide = {
        promise: this.tideStorePromise.then(store => store.getDay(date)),
        type: 'tide',
      };
    }
    return loadPromises;
  }

  getAPIPoint(date, time, requiredType) {
    let floodingPromise = Promise.resolve([]);
    let rainPromise = Promise.resolve([]);
    let tidePromise = Promise.resolve([]);
    if (requiredType.rainfall) {
      rainPromise = this.rainStorePromise.then(rain =>
        rain.getPoint(moment(`${date} ${time}`, 'YYYY-MM-DD HH-mm')
          .add(1, 'hour').format('YYYY-MM-DD HH-mm')));
    }
    if (requiredType.flooding) {
      floodingPromise = this.levelStorePromise.then(levels =>
        levels.getPoint(moment(`${date} ${time}`, 'YYYY-MM-DD HH-mm')
          .add(1, 'hour').format('YYYY-MM-DD HH-mm')));
    }
    if (requiredType.tide) {
      tidePromise = this.tideStorePromise.then(tides =>
        tides.getPoint(moment(`${date} ${time}`, 'YYYY-MM-DD HH-mm')
          .add(1, 'hour').format('YYYY-MM-DD HH-mm')));
    }
    return Promise.join(rainPromise, floodingPromise, tidePromise,
      (rainPoints, levelPoints, tidePoints) => ({
        rainPoints, levelPoints, tidePoints }));
  }
}
