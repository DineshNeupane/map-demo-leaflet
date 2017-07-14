import { measureLocations } from '../model/stations';
import PointStore from '../model/pointStore';
import
  { rainReadings, tideReadings, riverReadings }
    from '../services/tide-api';

const Promise = require('bluebird');

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

  getLatest(requiredType) {
    console.log(requiredType);
    let floodingPromise = Promise.resolve([]);
    let rainPromise = Promise.resolve([]);
    let tidePromise = Promise.resolve([]);
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

  getDate(date, requiredType) {
    console.log(requiredType);
    const loadPromises = {};
    if (requiredType.rainfall) {
      loadPromises.rain =
        this.rainStorePromise.then(store => store.getDay(date));
    }
    if (requiredType.flooding) {
      loadPromises.level =
        this.levelStorePromise.then(store => store.getDay(date));
    }
    if (requiredType.tide) {
      loadPromises.tide =
        this.tideStorePromise.then(store => store.getDay(date));
    }
    return loadPromises;
  }

  getAPIPoint(date, time, requiredType) {
    let floodingPromise = Promise.resolve([]);
    let rainPromise = Promise.resolve([]);
    let tidePromise = Promise.resolve([]);
    if (requiredType.rainfall) {
      rainPromise = this.rainStorePromise.then(rain =>
        rain.getPoint(`${date} ${time}`));
    }
    if (requiredType.flooding) {
      floodingPromise = this.levelStorePromise.then(levels =>
        levels.getPoint(`${date} ${time}`));
    }
    if (requiredType.tide) {
      tidePromise = this.tideStorePromise.then(tides =>
        tides.getPoint(`${date} ${time}`));
    }
    return Promise.join(rainPromise, floodingPromise, tidePromise,
      (rainPoints, levelPoints, tidePoints) => ({
        rainPoints, levelPoints, tidePoints }));
  }
}
