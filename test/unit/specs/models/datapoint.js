/*eslint-disable */

const testPoint = {
  lat: 52,
  long: 0.2,
  value: '0.5',
};

const testServerResponse = {
  body: {
    data: [
      testPoint,
    ],
  },
};

const testReading = {
  '@id': 'http://environment.data.gov.uk/flood-monitoring/data/readings/E7050-rainfall-tipping_bucket_raingauge-t-15_min-mm/2017-06-19T05-15-00Z',
  dateTime: '2017-06-19T05:15:00Z',
  measure: 'http://environment.data.gov.uk/flood-monitoring/id/measures/E7050-rainfall-tipping_bucket_raingauge-t-15_min-mm',
  value: 0.4,
};

const testMeasures = [{
  '@id': 'http://environment.data.gov.uk/flood-monitoring/id/measures/1029TH-level-downstage-i-15_min-mASD',
  parameter: 'level',
  parameterName: 'Water Level',
  period: 900,
  qualifier: 'Downstream Stage',
  unitName: 'mASD',
},
{
  '@id': 'http://environment.data.gov.uk/flood-monitoring/id/measures/1029TH-level-stage-i-15_min-mASD',
  parameter: 'level',
  parameterName: 'Water Level',
  period: 900,
  qualifier: 'Stage',
  unitName: 'mASD',
},
];

const testStation = {
  '@id': 'http://environment.data.gov.uk/flood-monitoring/id/stations/1029TH',
  RLOIid: '7041',
  catchmentName: 'Cotswolds',
  dateOpened: '1994-01-01',
  easting: 417990,
  label: 'Bourton Dickler',
  lat: 51.874767,
  long: -1.740083,
  measures: testMeasures,
  northing: 219610,
  notation: '1029TH',
  riverName: 'Dikler',
  stageScale: 'http://environment.data.gov.uk/flood-monitoring/id/stations/1029TH/stageScale',
  stationReference: '1029TH',
  status: 'http://environment.data.gov.uk/flood-monitoring/def/core/statusActive',
  town: 'Little Rissington',
  wiskiID: '1029TH',
};

module.exports = {
  testPoint,
  testServerResponse,
  testReading,
  testMeasures,
  testStation,
};
