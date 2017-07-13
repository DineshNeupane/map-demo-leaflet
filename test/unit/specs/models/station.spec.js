import Station from '../../../../src/model/station';
import { testStation, testMeasures, noMeasureStation } from './datapoint';

describe('Station', () => {
  it('should return correct river name', () => {
    const station = new Station(testStation);
    expect(station.riverName()).to.equal('Dikler');
  });

  it('should return correct latitude', () => {
    const station = new Station(testStation);
    expect(station.lat()).to.equal(51.874767);
  });

  it('should return correct longitude', () => {
    const station = new Station(testStation);
    expect(station.long()).to.equal(-1.740083);
  });

  it('should return correct station reference', () => {
    const station = new Station(testStation);
    expect(station.reference()).to.equal('1029TH');
  });

  it('should return correct measures', () => {
    const station = new Station(testStation);
    expect(station.measure()).to.equal(testMeasures);
  });

  it('should return empty array if no measures', () => {
    const station = new Station(noMeasureStation);
    expect(station.measure()).to.deep.equal([]);
  });
});
