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

const downstageMeasure = 'http://environment.data.gov.uk/flood-monitoring/id/measures/1029TH-level-downstage-i-15_min-mASD';

const stageMeasure = 'http://environment.data.gov.uk/flood-monitoring/id/measures/1029TH-level-stage-i-15_min-mASD';

const testMeasures = [{
  '@id': downstageMeasure,
  parameter: 'level',
  parameterName: 'Water Level',
  period: 900,
  qualifier: 'Downstream Stage',
  unitName: 'mASD',
},
{
  '@id': stageMeasure,
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

const noMeasureStation = { 
  "@id" : "http://environment.data.gov.uk/flood-monitoring/id/stations/067027_TG_127" ,
  "RLOIid" : "4173" ,
  "catchmentName" : "Dee" ,
  "dateOpened" : "1993-01-01" ,
  "easting" : 341800 ,
  "label" : "Ironbridge" ,
  "lat" : 53.134133 ,
  "long" : -2.871357 ,
  "northing" : 360020 ,
  "notation" : "067027_TG_127" ,
  "riverName" : "Dee" ,
  "stageScale" : { 
    "@id" : "http://environment.data.gov.uk/flood-monitoring/id/stations/067027_TG_127/stageScale" ,
    "highestRecent" : { 
      "@id" : "http://environment.data.gov.uk/flood-monitoring/id/stations/067027_TG_127/stageScale/highestRecent" ,
      "dateTime" : "2011-02-08T17:30:00" ,
      "value" : 7.086
    }
     ,
    "maxOnRecord" : { 
      "@id" : "http://environment.data.gov.uk/flood-monitoring/id/stations/067027_TG_127/stageScale/maxOnRecord" ,
      "dateTime" : "2000-11-07T18:15:00" ,
      "value" : 8.035
    }
     ,
    "minOnRecord" : { 
      "@id" : "http://environment.data.gov.uk/flood-monitoring/id/stations/067027_TG_127/stageScale/minOnRecord" ,
      "dateTime" : "1995-12-18T16:00:00" ,
      "value" : 4.348
    }
     ,
    "scaleMax" : 9 ,
    "typicalRangeHigh" : 5.985 ,
    "typicalRangeLow" : 4.386
  }
   ,
  "stationReference" : "067027_TG 127" ,
  "status" : "http://environment.data.gov.uk/flood-monitoring/def/core/statusukcmf" ,
  "town" : "Aldford" ,
  "wiskiID" : "DEE067027"
}

module.exports = {
  testPoint,
  testServerResponse,
  testReading,
  testMeasures,
  testStation,
  noMeasureStation,
  downstageMeasure,
  stageMeasure,
};
