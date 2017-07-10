import Datapoint from '../../../../src/model/dataPoint';
import { testPoint } from './datapoint';

describe('Datapoint', () => {
  it('should return the correct latitude', () => {
    const testpoint = new Datapoint(testPoint);
    expect(testpoint.lat()).to.equal(52);
  });

  it('should return the correct longitude', () => {
    const testpoint = new Datapoint(testPoint);
    expect(testpoint.long()).to.equal(0.2);
  });

  it('should return the correct value', () => {
    const testpoint = new Datapoint(testPoint);
    expect(testpoint.value()).to.equal(0.5);
  });
});
