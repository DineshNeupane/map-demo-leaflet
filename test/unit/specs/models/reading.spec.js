import { Reading } from '../../../../src/model/reading';
import { testReading } from './datapoint';

describe('reading', () => {
  it('should return the correct uri', () => {
    const reading = new Reading(testReading);
    expect(reading.uri()).to.equal(testReading['@id']);
  });

  it('should return the correct value', () => {
    const reading = new Reading(testReading);
    expect(reading.value()).to.equal(0.4);
  });

  it('should return the date string', () => {
    const reading = new Reading(testReading);
    expect(reading.dateTimeStr()).to.equal('2017-06-19T05:15:00Z');
  });

  it('should return the measure', () => {
    const reading = new Reading(testReading);
    expect(reading.measure()).to.equal(testReading.measure);
  });

  it('should return the js date', () => {
    const reading = new Reading(testReading);
    const date = new Date('June 19, 2017 05:15:00 GMT');
    expect(reading.jsDate()).to.deep.equal(date);
  });
});
