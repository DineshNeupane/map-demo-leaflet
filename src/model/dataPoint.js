import _ from 'lodash';

export default class DataPoint {
  constructor(json) {
    this.jsonRef = json;
  }

  lat() {
    return this.get('lat');
  }

  long() {
    return this.get('long');
  }

  value() {
    return parseFloat(this.get('value'));
  }

  get(path) {
    return _.get(this.jsonRef, path);
  }
}
