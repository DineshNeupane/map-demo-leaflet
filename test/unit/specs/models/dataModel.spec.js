import DataModel from '../../../../src/model/dataModel';
import Point from '../../../../src/model/dataPoint';
import PointStore from '../../../../src/model/pointStore';

describe('DataModel', () => {
  describe('getLatest', () => {
    it('should return nothing if no types specified', () => {
      const test = new DataModel();
      return test.getLatest().then((out) => {
        expect(out.levelPoints).to.deep.equal([]);
        expect(out.rainPoints).to.deep.equal([]);
        expect(out.tidePoints).to.deep.equal([]);
      });
    });
  });

  describe('getLatest', () => {
    before(() => {
      sinon.stub(PointStore.prototype, 'getLatest').callsFake(() =>
        new Point({
          lat: 100,
          long: 2,
          value: 0.5,
        }));
    });

    after(() => {
      PointStore.prototype.getLatest.restore();
    });

    it('should return points for each type', () => {
      const model = new DataModel();
      const testPoint = new Point({
        lat: 100,
        long: 2,
        value: 0.5,
      });
      return model.getLatest({
        rainfall: true,
        tide: true,
        flooding: true,
      })
        .then((out) => {
          expect(out.levelPoints).to.deep.equal(testPoint);
          expect(out.rainPoints).to.deep.equal(testPoint);
          expect(out.tidePoints).to.deep.equal(testPoint);
        });
    });
  });

  describe('getAPIPoint', () => {
    before(() => {
      sinon.stub(PointStore.prototype, 'getPoint').callsFake(() => [
        new Point({
          lat: 100,
          long: 2,
          value: 0.5,
        })]);
    });

    after(() => {
      PointStore.prototype.getPoint.restore();
    });

    it('should return promise of points for required type', () => {
      const test = new DataModel();
      const testPoint = new Point({
        lat: 100,
        long: 2,
        value: 0.5,
      });
      return test.getAPIPoint('2017-06-05', '11-50', {
        rainfall: true,
        tide: true,
        flooding: true,
      }).then((result) => {
        expect(result.levelPoints).to.deep.equal([testPoint]);
        expect(result.rainPoints).to.deep.equal([testPoint]);
        expect(result.tidePoints).to.deep.equal([testPoint]);
      });
    });
  });
});
