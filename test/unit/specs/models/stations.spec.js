import { measureLocations, stationsCollection, latestValues }
  from '../../../../src/model/stations';
import { testTideReading, testRainReading, testRiverReading, testStation,
  downstageMeasure, stageMeasure }
    from '../models/datapoint';
import Station from '../../../../src/model/station';
import { Reading } from '../../../../src/model/reading';
import * as tide from '../../../../src/services/tide-api';

describe('stationsCollection', () => {
  let stub;
  before(() => {
    stub = sinon.stub(tide, 'allStations')
      .returns(Promise.resolve([new Station(testStation)]));
  });

  after(() => {
    tide.allStations.restore();
  });

  it('should return the result of allStations first', () => {
    return stationsCollection().then((result) => {
      expect(stub.calledOnce);
      expect(result).to.deep.equal([new Station(testStation)]);
    });
  });

  it('should return the saved version', () => {
    return stationsCollection().then(() => {
      return stationsCollection().then((result) => {
        expect(stub.calledOnce);
        expect(result).to.deep.equal([new Station(testStation)]);
      });
    });
  });
});

describe('measureLocations', () => {
  before(() => {
    sinon.stub(tide, 'allStations')
      .returns(Promise.resolve([new Station(testStation)]));
  });

  after(() => {
    tide.allStations.restore();
  });

  it('should return object of ids and locations', () => {
    return measureLocations().then((result) => {
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
    });
  });
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
