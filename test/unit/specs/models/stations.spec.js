import { measureLocations, stationsCollection, readingArrayToDataPoints }
  from '../../../../src/model/stations';
import { testStation,
  downstageMeasure, stageMeasure, testReading }
    from '../models/datapoint';
import Station from '../../../../src/model/station';
import { Reading } from '../../../../src/model/reading';
import * as tide from '../../../../src/services/tide-api';
import DataPoint from '../../../../src/model/dataPoint';

describe('stationsCollection', () => {
  let stub;
  before(() => {
    stub = sinon.stub(tide, 'allStations')
      .returns(Promise.resolve([new Station(testStation)]));
  });

  after(() => {
    tide.allStations.restore();
  });

  it('should return the result of allStations first', () =>
    stationsCollection().then((result) => {
      expect(stub.calledOnce);
      expect(result).to.deep.equal([new Station(testStation)]);
    }));

  it('should return the saved version', () =>
    stationsCollection().then(() =>
      stationsCollection().then((result) => {
        expect(stub.calledOnce);
        expect(result).to.deep.equal([new Station(testStation)]);
      })));
});

describe('measureLocations', () => {
  before(() => {
    sinon.stub(tide, 'allStations')
      .returns(Promise.resolve([new Station(testStation)]));
  });

  after(() => {
    tide.allStations.restore();
  });

  it('should return object of ids and locations', () =>
    measureLocations().then((result) => {
      const expectedOut = {};
      expectedOut[stageMeasure] = {
        lat: 51.874767,
        long: -1.740083,
      };
      expectedOut[downstageMeasure] = {
        lat: 51.874767,
        long: -1.740083,
      };
      expect(result).to.deep.equal(expectedOut);
    }));
});
/*
describe('latestValues', () => {
  before(() => {
    sinon.stub(tide, 'tideReadings')
      .returns(Promise.Resolve([new Reading(testTideReading)]));
    sinon.stub(tide, 'riverReadings')
      .returns(Promise.Resolve([new Reading(testRiverReading)]));
    sinon.stub(tide, 'rainReadings')
      .returns(Promise.Resolve([new Reading(testRainReading)]));
  });

  after(() => {
    tide.tideReadings.restore();
    tide.riverReadings.restore();
    tide.rainReadings.restore();
  });

  it('should return readings for all parameters', () => {
    latestValues().then((result) => {
      expect(result.tide).to.deep.equal([new Reading(testTideReading)]);
      expect(result.river).to.deep.equal([new Reading(testRiverReading)]);
      expect(result.rain).to.deep.equal([new Reading(testRiverReading)]);
    });
  });
});*/

describe('readingArrayToDataPoints', () => {
  it('should convert reading to dataPoint', () => {
    const testLocations = {};
    testLocations[downstageMeasure] = {
      lat: 51.874767,
      long: -1.740083,
    };
    const result =
      readingArrayToDataPoints(testLocations, [new Reading(testReading)]);
    expect(result).to.deep.equal([new DataPoint({
      lat: 51.874767,
      long: -1.740083,
      value: 0.4,
    })]);
  });
});
