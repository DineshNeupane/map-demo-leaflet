import PointStore from '../../../../src/model/pointStore';
import { Reading } from '../../../../src/model/reading';
import Point from '../../../../src/model/dataPoint';
import { testReading, downstageMeasure } from './datapoint';

describe('getLatest', () => {
  it('should return the latest value of the getterFunction', () => {
    const getter = sinon.stub()
      .returns(Promise.resolve([new Reading(testReading)]));
    const testLocations = {};
    testLocations[downstageMeasure] = {
      lat: 51.874767,
      long: -1.740083,
    };
    const pointStore = new PointStore(1, getter, testLocations);
    return pointStore.getLatest().then(result =>
      expect(result).to.deep.equal([
        new Point({
          lat: 51.874767,
          long: -1.740083,
          value: 0.4,
        })]));
  });
});

describe('getDay', () => {
  it('should call the getter once', () => {
    const getter = sinon.stub()
      .returns(Promise.resolve([new Reading(testReading)]));
    const testLocations = {};
    testLocations[downstageMeasure] = {
      lat: 51.874767,
      long: -1.740083,
    };
    const pointStore = new PointStore(1000, getter, testLocations);
    return pointStore.getDay('2017-06-05').completionPromise
      .then(() =>
        expect(getter.calledOnce).to.equal(true));
  });

  it('should call the getter twice', () => {
    const getter = sinon.stub()
      .returns(Promise.resolve([new Reading(testReading)]));
    const testLocations = {};
    testLocations[downstageMeasure] = {
      lat: 51.874767,
      long: -1.740083,
    };
    const pointStore = new PointStore(20000, getter, testLocations);
    return pointStore.getDay('2017-06-05').completionPromise
      .then(() =>
        expect(getter.calledTwice).to.equal(true));
  });

  it('should return promise if already polled', () => {
    const getter = sinon.stub()
      .returns(Promise.resolve([new Reading(testReading)]));
    const testLocations = {};
    testLocations[downstageMeasure] = {
      lat: 51.874767,
      long: -1.740083,
    };
    const pointStore = new PointStore(20000, getter, testLocations);
    return pointStore.getDay('2017-06-05').completionPromise
      .then(() =>
        pointStore.getDay('2017-06-05').completionPromise
          .then((out) => {
            expect(out).to.equal('already polled');
          }));
  });
});

describe('getPoints', () => {
  it('should return empty array if not polled', () => {
    const getter = sinon.stub()
      .returns(Promise.resolve([new Reading(testReading)]));
    const testLocations = {};
    testLocations[downstageMeasure] = {
      lat: 51.874767,
      long: -1.740083,
    };
    const pointStore = new PointStore(20000, getter, testLocations);
    pointStore.getPoint('test date').then(out =>
      expect(out).to.deep.equal([]));
  });

  it('should return array of points if polled', () => {
    const getter = sinon.stub()
      .returns(Promise.resolve([new Reading(testReading)]));
    const testLocations = {};
    testLocations[downstageMeasure] = {
      lat: 51.874767,
      long: -1.740083,
    };
    const pointStore = new PointStore(10000, getter, testLocations);
    pointStore.getDay('test').completionPromise.then(() =>
      pointStore.getPoint('2017-06-19 06-15')
        .then(pointsArr =>
          expect(pointsArr).to.deep.equal([new Point({
            lat: 51.874767,
            long: -1.740083,
            value: 0.4,
          })])));
  });
});
