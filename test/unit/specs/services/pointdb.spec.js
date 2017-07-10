/* eslint-disable */
var pointdb = require('../../../../src/services/pointdb.js');
const request = require('superagent');
const Promise = require('bluebird');

import DataPoint from '../../../../src/model/dataPoint.js';
import { testPoint, testServerResponse } from '../models/datapoint.js';


describe('dateTimeHandler', () => {
  it('should accept correct date times', () => {
    return pointdb.dateTimeHandler('2017-05-05', '20-30').then((datestr) => {
      expect(datestr).to.equal('2017-05-05/20-30');
    })
  });

  it('should reject incorrect dates', () => {
    return pointdb.dateTimeHandler('2017-05-32', '20-30').catch((datestr) => {
      expect(datestr).to.equal('Invalid date');
    })
  });

  it('should reject incorrect times', () => {
    return pointdb.dateTimeHandler('2017-05-30', '24-30')
      .catch((datestr) => {
        expect(datestr).to.equal('Invalid date');
      })
  });
});

describe('getPoints', function(){
  before(function(){
    sinon
      .stub(request, 'get')
      .returns({
        accept: function (blah) {
          return Promise.resolve(testServerResponse);
        }
      });
  });

  after(function(){
    request.get.restore();
  });

  it('should return data from response', function(){
    return pointdb.getPoints('2017-05-30', '23-00')
      .then((json) => {
        expect(json).to.deep.equal([
          new DataPoint(testPoint)
        ]);
      })
  });
});

describe('getLevels', function(){
  before(function(){
    sinon
      .stub(request, 'get')
      .returns({
        accept: function (blah) {
          return Promise.resolve(testServerResponse);
        }
      });
  });

  after(function(){
    request.get.restore();
  });

  it('should return data from response', function(){
    return pointdb.getLevels('2017-05-30', '23-00')
      .then((json) => {
        expect(json).to.deep.equal([
          new DataPoint(testPoint)
        ]);
      })
  });
});

describe('getTide', function(){
  before(function(){
    sinon
      .stub(request, 'get')
      .returns({
        accept: function (blah) {
          return Promise.resolve(testServerResponse);
        }
      });
  });

  after(function(){
    request.get.restore();
  });

  it('should return data from response', function(){
    return pointdb.getTide('2017-05-30', '23-00')
      .then((json) => {
        expect(json).to.deep.equal([
          new DataPoint(testPoint)
        ]);
      })
  });
});
