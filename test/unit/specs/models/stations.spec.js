import { measureLocations, stationsCollection }
  from '../../../../src/model/stations';
import { testStation } from '../services/testconsts';
import Station from '../../../../src/model/station';
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
    stationsCollection().then((result) => {
      expect(stub.calledOnce);
      expect(result).to.deep.equal([new Station(testStation)]);
    });
  });

  it('should return the saved version', () => {
    stationsCollection().then(() => {
      stationsCollection().then((result) => {
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
    measureLocations().then((result) => {
      const idstr =
        'http://environment.data.gov.uk/flood-monitoring/id/stations/1029TH';
      expect(result).to.deep.equal({
        '@id': idstr,
        lat: 51.874767,
        long: -1.740083,
      });
    });
  });
});
