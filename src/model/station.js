import _ from 'lodash';
import stationMeasures from '../services/gauge-api';

class Station {
  constructor(json) {
    this.json = json;
  }

  riverName() {
    return this.json.riverName;
  }

  lat() {
    return this.json.lat;
  }

  long() {
    return this.json.long;
  }

  reference() {
    return this.json.stationReference;
  }

  measure() {
    return stationMeasures(this.json.id);
  }

  get(path) {
    return _.get(this.json, path);
  }
}

export { Station as default };
