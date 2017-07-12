import
  { tideReadings, riverReadings, rainReadings, allStations }
  from '../../../../src/services/tide-api';
import { Reading } from '../../../../src/model/reading';
import Station from '../../../../src/model/station';

import {
  testTideReadings,
  testTideReading,
  testRiverReading,
  testRiverReadings,
  testRainReading,
  testRainReadings,
  testStation,
  testStations,
} from './testconsts';

const request = require('superagent');
const Promise = require('bluebird');


describe('tide api', () => {
  describe('tideReadings', () => {
    let query;
    let accept;
    before(() => {
      query = sinon.stub();
      query.returns(Promise.resolve({ body: testTideReadings }));
      accept = sinon.stub();
      accept.returns({ query });
      sinon
        .stub(request, 'get')
        .returns({ accept });
    });

    after(() => {
      request.get.restore();
    });

    it('should return a list of readings', () =>
      tideReadings().then((result) => {
        const params = { latest: '', qualifier: 'Tidal Level', _limit: 10000 };
        expect(accept.calledWith('application/json'));
        expect(query.calledWith(params));
        expect(result).to.deep.equal([new Reading(testTideReading)]);
      }));
  });

  describe('riverReadings', () => {
    let query;
    let accept;
    before(() => {
      query = sinon.stub();
      query.returns(Promise.resolve({ body: testRiverReadings }));
      accept = sinon.stub();
      accept.returns({ query });
      sinon
        .stub(request, 'get')
        .returns({ accept });
    });

    after(() => {
      request.get.restore();
    });

    it('should return a list of readings', () =>
      riverReadings().then((result) => {
        const params = { latest: '', qualifier: 'Stage', _limit: 10000 };
        expect(accept.calledWith('application/json'));
        expect(query.calledWith(params));
        expect(result).to.deep.equal([new Reading(testRiverReading)]);
      }));
  });

  describe('rainReadings', () => {
    let query;
    let accept;
    before(() => {
      query = sinon.stub();
      query.returns(Promise.resolve({ body: testRainReadings }));
      accept = sinon.stub();
      accept.returns({ query });
      sinon
        .stub(request, 'get')
        .returns({ accept });
    });

    after(() => {
      request.get.restore();
    });

    it('should return a list of readings', () =>
      rainReadings().then((result) => {
        const params = { latest: '', parameter: 'rainfall', _limit: 10000 };
        expect(accept.calledWith('application/json'));
        expect(query.calledWith(params));
        expect(result).to.deep.equal([new Reading(testRainReading)]);
      }));
  });

  describe('allStations', () => {
    let query;
    let accept;
    before(() => {
      query = sinon.stub();
      query.returns(Promise.resolve({ body: testStations }));
      accept = sinon.stub();
      accept.returns({ query });
      sinon
        .stub(request, 'get')
        .returns({ accept });
    });

    after(() => {
      request.get.restore();
    });

    it('should return all the stations', () => allStations().then((result) => {
      const params = { _view: 'full' };
      expect(accept.calledWith('application/json'));
      expect(query.calledWith(params));
      expect(result).to.deep.equal([new Station(testStation)]);
    }));
  });
});
