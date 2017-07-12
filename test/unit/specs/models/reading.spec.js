import { Reading } from '../../../../src/model/reading';
import { testReading } from './datapoint';

describe('reading', () => {

  it('should return the correct uri', () => {
    const reading = new Reading(testReading);
    expect(reading.uri()).to.equal("http://environment.data.gov.uk/flood-monitoring/data/readings/E7050-rainfall-tipping_bucket_raingauge-t-15_min-mm/2017-06-19T05-15-00Z");
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
    expect(reading.measure()).to.equal("http://environment.data.gov.uk/flood-monitoring/id/measures/E7050-rainfall-tipping_bucket_raingauge-t-15_min-mm");
  })

  it('should return the js date', () => {
    const reading = new Reading(testReading);
    expect(reading.jsDate()).to.deep.equal(new Date('June 19, 2017 05:15:00 GMT'));
  });
});
